#!/usr/bin/env python3
# #############################################################################
# #############################################################################
# ##                                                                         ##
# ##   DO NOT RUN without the owner's explicit yes: this call costs money.   ##
# ##                                                                         ##
# #############################################################################
# #############################################################################
#
# PACKAGE B, "the feed as a descent", version 2: uniform with the campaign paintings.
# This file is the draft stage. Acceptance list, measured ranges and real prices: descent_final_run.md.
# Rulebook: /Users/ofirnona/ofir1233.github.io/.claude/skills/v7-painting/SKILL.md
#
# Spending limits set for this run (23.11.2026): at most ONE low draft and ONE final at max, $0.55 in all,
# no retry of any kind. The script enforces all three from its own log and never repeats a call.
#
#   python3 THIS_FILE                         DRY. Sends nothing. Makes the box layout, writes the prompt, prints the plan.
#   python3 THIS_FILE --models                FREE. Lists the account's image models.
#   python3 THIS_FILE --send --owner-said-yes PAID. One call. (The final stage also needs --draft FILE.)
#   python3 THIS_FILE --check FILE [--scale S --windows y1,y2,y3,y4]
#                                             FREE. Cuts a result into 4 feed posts and measures it.
#
# The API key is read from the environment variable OPENAI_API_KEY. It is never printed, never written to
# a file, and it is scrubbed from any error text before that text is shown.
# Written on 23.11.2026. NOT executed by the agent that wrote it: there was no key in the environment.

import argparse
import base64
import colorsys
import json
import os
import re
import shutil
import statistics
import sys
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path("/Users/ofirnona/ofir1233.github.io")            # read only, except REVIEW below
REVIEW = REPO / ".claude/review/hear-page/descent"           # never committed; the final stage saves here
HERE = Path(__file__).resolve().parent
OUT = HERE / "out_descent"                                   # working files and the log
LOG = OUT / "log.jsonl"

STAGE = "draft"                                          # "draft" or "final"
MODEL = "gpt-image-2.6-sunburst"                             # confirmed on the guide page, 23.11.2026
ENDPOINT = "https://api.openai.com/v1/images/edits"
MODELS_URL = "https://api.openai.com/v1/models"

# Sizes: four feed posts of 1.91:1, one above the other. Both sizes are legal by the guide (23.11.2026):
# sides multiples of 16, no side over 3840, 655,360 to 8,294,400 pixels, shape between 1:3 and 3:1.
# Output tokens are the guide calculator's own numbers for GPT-Image-2.6, read on 23.11.2026.
STAGES = {
    "draft": dict(size=(1024, 2144), quality="low", output_tokens=567),      # $0.017 for the picture
    "final": dict(size=(1600, 3344), quality="max", output_tokens=8115),     # $0.243 for the picture
}
FINAL_W, FINAL_H = STAGES["final"]["size"]
SLICES = 4
LAYOUT_W = 800                                               # the box sketch is sent small
CEILING_USD = 0.55                                           # draft + final together, input included
USD_PER_M_OUTPUT = 30.0                                      # guide, GPT-Image-2.6
USD_PER_M_IMAGE_INPUT = 8.0                                  # guide gives this for 2.5; ASSUMED the same for 2.6
USD_PER_M_TEXT_INPUT = 5.0                                   # the same remark
GUESS_INPUT_USD_PER_REFERENCE = 0.02                         # my guess before any bill exists (skill: "a few cents")

# Reference images. The owner's one condition: uniform with the campaign paintings shown beside it.
# So the style references are campaign paintings of this city, not the portfolio's studio painting.
REFS = [
    None,                                                    # image 1: the box layout, made below
    REPO / "img/cw-plane.webp",                              # image 2: sky, towers, the plane and its trail letters
    REPO / "img/cw-parade.webp",                             # image 3: the street between the towers, tree crowns
    REPO / "img/cw-receipt.webp",                            # image 4: the cafe table, cup, print on paper
]                                                            # final stage adds the approved draft as the LAST image

# =============================================================================
# THE PROMPT
# From the skill, word for word: TECHNIQUE, and the light sentence of CLOSING.
# Changed for this run, on the owner's condition of uniformity (see descent_final_run.md):
#   OPENING names the campaign paintings instead of "the FIRST reference image";
#   COLOURS follows the skill's method (hex values sampled from the references, forbidden list named),
#     with the campaign paintings as the references;
#   "No text, no letters, no logos." is replaced by WORDS.
# =============================================================================
MAP = (
    "The FIRST reference image is a rough sketch made of coloured boxes. It is only a map of where things "
    "stand: keep the place and the size of every box and paint the real thing there. Do not paint boxes, "
    "sketch lines or its lettering style. The four lines of words written in it show where the painted words "
    "go and how large they are. The SECOND, THIRD and FOURTH reference images are finished paintings by the "
    "painter of this picture, made on the same day in the same city. Take from them the hand, the paint, the "
    "colours, the light, the buildings of the city and the way words are painted into a scene: from the "
    "SECOND the sky, the clouds, the glass towers, the plane and the white letters of its trail; from the "
    "THIRD the street running between the towers and the tree crowns; from the FOURTH the cafe table, the "
    "cup and saucer, the woven chair and the print on the paper. Do not repeat their subjects: no woman on a "
    "balcony, no parade, no marching band, no crowd, no balloon letters, no receipt, no croissant."
)

OPENING = (
    "It must look as if the same painter made it on the same day, in the same city, as the SECOND, THIRD "
    "and FOURTH reference images, so that it can hang in one row with them."
)

TECHNIQUE = (
    "TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes "
    "in thousands of small, crisp, confident strokes; every stroke a distinct plane of colour with a sharp "
    "edge and a slight ridge of paint; clearly hand-painted at every scale. Not a digital illustration, not "
    "anime, not pixel art, not vector, not a print: no flat fills, no outlines, no dithering, no fine "
    "hatching, no canvas weave, no cracks, no stripes, no blur, no photo realism."
)

COLOURS = (
    "COLOURS: taken from the SECOND, THIRD and FOURTH reference images and from nowhere else. Sky: "
    "cobalt-azure blue, about #4094e4, with darker #2a78c6 and lighter #77bbde strokes; rich but natural, "
    "not electric, not neon. Clouds: crisp white with pale blue and lilac shadows. Trees: the fresh leaf "
    "greens of those paintings, about #4e835b, with deep shadow #234c33 and sunlit leaves #9dc584. "
    "Buildings: blue glass towers (cobalt, azure and pale sky-blue reflections) and white facades with "
    "pale blue shadows. Coral red (about #ea5a4b) in clear shapes on objects, with lilac, a little "
    "magenta-pink, white flowers and cream. Not in this picture: olive, golden or autumn foliage, orange "
    "roofs, sunset or evening tones, large beige or brown areas, large pink or purple flower masses, black "
    "areas. The darkest colour is a deep navy."
)

SUBJECT = (
    "WHAT IT IS: one tall painting of the same seaside city of blue glass towers and white blocks, as one "
    "continuous view from the sky down to a cafe table: what a guest at a pavement cafe sees when looking up "
    "from the table, along the street, over the roofs and into the sky. One picture with one light: no "
    "panels, no frames, no borders, no dividing lines, nothing painted twice. It is described here in four "
    "bands of equal height, from top to bottom. Each band has its own main thing standing whole inside it; "
    "the sky, the towers, the white walls and the pavement run on from band to band without a break.\n"
    "BAND 1, the sky, the top quarter: cobalt-azure built from broad visible knife strokes in different "
    "directions; in the right third the small white passenger plane of the SECOND reference image, flying "
    "to the right; behind it its white trail has written two words across the blue, in the same thick, soft, "
    "rounded cloud-white letters as the words in the sky of the SECOND reference image, on two lines: the "
    "first line Every, the second line conversation. with a full stop after it, and the trail runs on from "
    "the full stop to the plane; thick sculpted white cumulus with pale blue and lilac shadows at the left "
    "edge, at the right edge and along the bottom of the band; two small kites, one coral and one lilac; "
    "gulls; the tops of the two tallest glass towers rise into the bottom of the band.\n"
    "BAND 2, the roofs and towers, the second quarter: a dense skyline of blue glass towers with window "
    "grids and cloud reflections, and white blocks with rounded corners; roof terraces with striped "
    "parasols (coral-and-white, lilac-and-white), white deck chairs, potted trees, a white water tank on "
    "legs, a washing line with white and lilac sheets, a roof garden with lavender and white hydrangeas, "
    "white pigeons; a strip of cobalt sea with a white sailboat between two blocks at the far left; and "
    "along the roof edge of the widest white block, on a white steel frame, one row of big standing sign "
    "letters in coral, bold rounded sans-serif letters, each a solid painted block with a light side and a "
    "shadow side, glossy like the coral balloon letters of the THIRD reference image, spelling Not a "
    "sample. with a full stop after it; under the roof edge two rows of tall windows reflecting the sky.\n"
    "BAND 3, the street, the third quarter: the street at eye level, running away from the viewer between "
    "the buildings as in the THIRD reference image: balconies with white railings and boxes of white and "
    "lilac flowers, shop fronts with glass reflecting the sky, a coral-and-white striped awning at the left "
    "and a teal awning at the right with no writing on them, big rounded tree crowns, pale blue-lilac paving "
    "with dappled leaf shadows, two tram rails, a cream-white tram with a cobalt band far down the street "
    "with no number on it, two cyclists and a few passers-by, small; two white lamp posts with round "
    "globes, and stretched straight across the street between them, facing the viewer squarely, one broad "
    "coral cloth banner with the words We hear every call. brushed on it in cream-white paint, in bold "
    "rounded sans-serif letters on one line, with a full stop at the end.\n"
    "BAND 4, the cafe table, the bottom quarter: at the top of the band the edge of the cafe terrace: paving "
    "and a row of planters with white hydrangeas and lavender; then, large and close, the round cafe table "
    "of the FOURTH reference image, its blue-painted top in thick visible knife strokes with the dappled "
    "shadow of leaves on it; on the table a coral cup of coffee on a coral saucer, a lilac plate with three "
    "magenta-pink macarons, a glass vase with lilac and white flowers, a glass of water with a white "
    "highlight, a folded teal napkin; and standing upright in the middle of the table, facing the viewer "
    "squarely, one folded cream-white card with the words Even here. painted on it in deep navy, in the "
    "same bold rounded sans-serif letters as the large print on the paper in the FOURTH reference image, "
    "with a full stop after them; a coral woven chair back at the left edge and another at the right edge, "
    "a lilac cushion."
)

WORDS = (
    "THE WORDS: exactly four lines of words are painted in this picture, one in each band, in this order "
    "from top to bottom: Every conversation. / Not a sample. / We hear every call. / Even here. Spell them "
    "exactly, letter for letter, each with its full stop: E-v-e-r-y c-o-n-v-e-r-s-a-t-i-o-n; N-o-t a "
    "s-a-m-p-l-e; W-e h-e-a-r e-v-e-r-y c-a-l-l; E-v-e-n h-e-r-e. Each line is written once, whole, large, "
    "upright and easy to read, inside its own band, with sky, wall or table above it and beneath it. The "
    "words are part of the scene and made of its paint, as in the reference paintings: the trail is cloud, "
    "the roof letters are painted metal, the banner is brushed cloth, the card is painted paper. No other "
    "text anywhere in the picture: no shop names, no street signs, no numbers, no menus, no writing on the "
    "plane, the tram, the awnings, the parasols, the cup or the napkin other than the four lines; no logos, "
    "no symbols, no signature."
)

COUNT = (
    "COUNT: exactly one plane with one trail, one row of standing letters on one roof, one banner across "
    "the street, one table with one standing card and one cup. Nobody sits at the table and no hands are in "
    "the picture. People are few and small, passers-by and cyclists seen from far. No desks, no office, no "
    "headsets, no laptops."
)

CLOSING = "Bright late-morning light from the left, strong light and shadow planes on every building."

LAST = (
    "The LAST reference image is the small sketch of this very picture: keep its composition and colours "
    "exactly and repaint it large."
)

BLOCKS = [MAP, OPENING, TECHNIQUE, COLOURS, SUBJECT, WORDS, COUNT, CLOSING] + ([LAST] if STAGE == "final" else [])
PROMPT = "\n\n".join(BLOCKS)

# Skill, rule 3 and the note under THE FIXED PROMPT: these words must not be in what I wrote myself.
BANNED_IN_MY_BLOCKS = r"\b(empty|calm|minimal|simple|plain|quiet|clean|low|flat|graphic|editorial)\b"

# ---------------------------------------------------------------------------
# Acceptance ranges for colour: the five campaign paintings of this city, measured on 23.11.2026 with the
# function measure() below (parade, plane, balloons, receipt, paper). (min, max) over the five.
# The skill's own numbers are printed beside them and recorded, but the campaign range decides.
# ---------------------------------------------------------------------------
CAMPAIGN_RANGE = {
    "sky_hue": (207, 210), "sky_sat": (48, 76), "sky_val": (80, 95), "green_hue": (107, 164),
    "coral": (6.37, 12.2), "yellow": (0.26, 4.24), "yellow_green": (1.59, 2.93), "orange": (0.44, 4.42),
    "beige": (0.99, 10.42), "near_black": (0.0, 0.12), "pink_purple": (0.32, 1.75),
}
SKILL_NUMBER = {
    "sky_hue": "203 to 212", "sky_sat": "near 70", "sky_val": "", "green_hue": "140 to 165", "coral": "",
    "yellow": "0", "yellow_green": "0", "orange": "0", "beige": "", "near_black": "0", "pink_purple": "",
}

# ---------------------------------------------------------------------------
# The layout image (reference image 1). Local, PIL only, costs nothing.
# All coordinates are written for the FINAL canvas (1600 x 3344) and scaled.
# No cut lines and no labels are drawn: the model paints what it sees, so the
# only writing in the sketch is the four lines of the message.
# ---------------------------------------------------------------------------
L_SKY, L_CLOUD = "#a9c6e6", "#f3f6fa"
L_TOWER, L_TOWER2 = "#7f9fc4", "#93b0d0"
L_WALL, L_WALL_SH, L_WIN = "#eef1f5", "#cfd8e6", "#9db4d1"
L_TREE, L_TRUNK = "#5d8a76", "#8f95a8"
L_PAVE, L_RAIL, L_SEA = "#cdd3e4", "#9aa3bd", "#5f8fca"
L_CORAL, L_CREAM, L_NAVY, L_LILAC, L_TEAL = "#e8604a", "#f4efe6", "#123a6b", "#b9a6e6", "#4f8f8a"


def _fit_text(draw, box, text, fill, k, bold=2):
    """Write `text` as large as fits inside `box` (final-canvas coordinates)."""
    x0, y0, x1, y1 = [v * k for v in box]
    size = max(8, int(y1 - y0))
    while size > 8:
        font = ImageFont.load_default(size=size)
        l, t, r, b = draw.textbbox((0, 0), text, font=font)
        if (r - l) <= (x1 - x0) and (b - t) <= (y1 - y0):
            break
        size -= 2
    px = x0 + ((x1 - x0) - (r - l)) / 2 - l
    py = y0 + ((y1 - y0) - (b - t)) / 2 - t
    sw = max(0, int(round(bold * k)))
    draw.text((px, py), text, font=font, fill=fill, stroke_width=sw, stroke_fill=fill)


def make_layout(path, width):
    k = width / FINAL_W
    W, H = width, int(round(FINAL_H * k))
    im = Image.new("RGB", (W, H), L_SKY)
    d = ImageDraw.Draw(im)

    def R(box, fill, outline=None, r=0):
        b = [v * k for v in box]
        if r:
            d.rounded_rectangle(b, radius=r * k, fill=fill, outline=outline, width=max(1, int(3 * k)))
        else:
            d.rectangle(b, fill=fill, outline=outline, width=max(1, int(3 * k)))

    def E(box, fill):
        d.ellipse([v * k for v in box], fill=fill)

    def P(pts, fill):
        d.polygon([(x * k, y * k) for x, y in pts], fill=fill)

    def LN(pts, fill, w=4):
        d.line([(x * k, y * k) for x, y in pts], fill=fill, width=max(1, int(w * k)))

    # ---- BAND 1, y 0..836: sky, the plane and the words of its trail
    for cx, cy, rx, ry in [(150, 600, 210, 110), (1470, 690, 200, 100), (330, 760, 200, 80),
                           (1250, 800, 220, 80), (90, 150, 150, 60), (1500, 130, 140, 55)]:
        E((cx - rx, cy - ry, cx + rx, cy + ry), L_CLOUD)
    _fit_text(d, (330, 170, 830, 350), "Every", L_CLOUD, k, 7)
    _fit_text(d, (250, 400, 1190, 580), "conversation.", L_CLOUD, k, 7)
    LN([(1190, 520), (1300, 500)], L_CLOUD, 14)
    P([(1300, 478), (1420, 490), (1440, 500), (1420, 512), (1300, 522)], L_CREAM)   # the plane
    P([(1340, 500), (1310, 440), (1345, 440), (1390, 500)], L_CREAM)
    P([(1300, 500), (1285, 462), (1310, 462), (1325, 500)], "#1f6fc4")
    P([(560, 640), (600, 690), (560, 750), (520, 690)], L_CORAL)                    # two kites
    P([(1010, 650), (1040, 690), (1010, 735), (980, 690)], L_LILAC)

    # ---- BAND 2, y 836..1672: towers and roofs.  Two tower tips rise into band 1.
    for x0, x1, top, c in [(120, 330, 990, L_TOWER2), (420, 640, 730, L_TOWER), (700, 880, 1010, L_TOWER2),
                           (960, 1180, 770, L_TOWER), (1250, 1470, 960, L_TOWER2)]:
        R((x0, top, x1, 2200), c)
        for wy in range(top + 40, 1700, 50):
            LN([(x0 + 14, wy), (x1 - 14, wy)], L_SKY, 5)
    R((0, 1500, 110, 1640), L_SEA)                                                 # strip of sea, far left
    P([(40, 1600), (40, 1520), (85, 1600)], L_CLOUD)
    # the widest white block; its roof edge carries the standing letters
    R((230, 1350, 1370, 2330), L_WALL, L_WALL_SH)
    LN([(300, 1345), (1300, 1345)], L_RAIL, 8)
    for sx in range(320, 1300, 140):
        LN([(sx, 1345), (sx, 1160)], L_RAIL, 4)
    _fit_text(d, (310, 1150, 1290, 1335), "Not a sample.", L_CORAL, k, 5)
    # side blocks with roof terraces: parasols, water tank, washing line
    R((0, 1620, 230, 2330), L_WALL, L_WALL_SH)
    R((1370, 1560, 1600, 2330), L_WALL, L_WALL_SH)
    P([(40, 1620), (110, 1545), (180, 1620)], L_CORAL)
    R((1420, 1470, 1500, 1560), L_CLOUD, L_WALL_SH)
    P([(1510, 1560), (1550, 1500), (1590, 1560)], L_LILAC)
    for wx in range(290, 1300, 150):
        for wy in (1420, 1540):
            R((wx, wy, wx + 80, wy + 70), L_WIN)

    # ---- BAND 3, y 1672..2508: the street; the banner carries the words
    for wx in range(290, 1300, 150):                # balconies, below the cut at 1672 (the wall runs across it)
        R((wx, 1730, wx + 80, 1800), L_WIN)
        R((wx - 10, 1802, wx + 90, 1818), L_WALL_SH)
    P([(560, 2200), (1040, 2200), (1600, 2508), (0, 2508)], L_PAVE)                 # the street, in perspective
    R((0, 2330, 1600, 2700), L_PAVE)
    LN([(760, 2210), (560, 2700)], L_RAIL, 6)
    LN([(840, 2210), (1040, 2700)], L_RAIL, 6)
    R((730, 2130, 870, 2260), L_CREAM, L_RAIL, r=14)                                # the tram, far down the street
    R((730, 2196, 870, 2206), "#1f6fc4")
    for x0, x1, c in [(40, 300, L_CORAL), (1300, 1560, L_TEAL)]:                    # two awnings, no writing
        P([(x0, 2120), (x1, 2120), (x1 + 20, 2200), (x0 - 20, 2200)], c)
        R((x0, 2200, x1, 2400), L_WIN, L_WALL_SH)
    for cx, cy, r in [(400, 2190, 110), (1200, 2190, 110), (70, 2330, 90), (1530, 2330, 90)]:
        R((cx - 10, cy, cx + 10, cy + 120), L_TRUNK)
        E((cx - r, cy - r, cx + r, cy + r), L_TREE)
    for px in (230, 1370):                                                          # two lamp posts hold the banner
        R((px - 9, 1800, px + 9, 2440), L_CREAM, L_WALL_SH)
        E((px - 24, 1765, px + 24, 1813), L_CREAM)
    R((240, 1840, 1360, 2020), L_CORAL)
    _fit_text(d, (280, 1862, 1320, 1998), "We hear every call.", L_CREAM, k, 4)

    # ---- BAND 4, y 2508..3344: the cafe table; the standing card carries the words
    for bx in range(60, 1500, 250):                 # planters, below the cut at 2508
        R((bx, 2610, bx + 200, 2690), L_WALL, L_WALL_SH)
        for fx in range(bx + 10, bx + 190, 46):
            E((fx, 2570, fx + 44, 2620), L_LILAC if (fx // 46) % 2 else L_CLOUD)
    R((0, 2700, 1600, 3344), L_PAVE)
    R((0, 2720, 190, 3060), L_CORAL, r=40)                                          # chair backs, left and right
    R((1440, 2760, 1600, 3080), L_CORAL, r=40)
    E((20, 2900, 1580, 3520), "#6f9fd6")                                           # the round table top
    E((150, 3080, 400, 3220), L_CORAL)                                              # saucer and cup
    E((205, 3060, 345, 3160), L_CORAL)
    E((225, 3072, 325, 3128), L_CREAM)
    E((1180, 3110, 1480, 3250), L_LILAC)                                            # plate with macarons
    for mx in (1240, 1310, 1370):
        E((mx, 3140, mx + 60, 3190), "#d85c9a")
    R((1210, 2900, 1290, 3060), L_CLOUD, L_WALL_SH)                                 # glass vase with flowers
    for fx, fy in [(1200, 2850), (1250, 2820), (1290, 2860)]:
        E((fx, fy, fx + 60, fy + 60), L_LILAC)
    P([(480, 3130), (520, 2830), (1080, 2830), (1120, 3130)], L_CREAM)              # the standing card
    _fit_text(d, (540, 2890, 1060, 3080), "Even here.", L_NAVY, k, 5)

    im.save(path)
    return im.size

def _pixels(im, longest=420):
    small = im.convert("RGB")
    small.thumbnail((longest, longest))
    get = getattr(small, "get_flattened_data", None) or small.getdata
    return list(get())


def measure(im):
    """Shares (percent of pixels) and medians, HSV with hue in degrees."""
    px = _pixels(im)
    n = len(px)
    sky, green = [], []
    c = dict(yellow=0, yellow_green=0, orange=0, beige=0, coral=0, pink_purple=0, near_black=0)
    for r, g, b in px:
        h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        h, s, v = h * 360, s * 100, v * 100
        if v < 10:
            c["near_black"] += 1
        if 190 <= h <= 230 and s >= 35 and v >= 50:
            sky.append((h, s, v))
        if 70 <= h <= 185 and s >= 20 and v >= 20:
            green.append(h)
        if 40 <= h < 70 and s >= 30 and v >= 40:
            c["yellow"] += 1
        if 70 <= h < 100 and s >= 25 and v >= 25:
            c["yellow_green"] += 1
        if 18 <= h < 40 and s >= 45 and v >= 45:
            c["orange"] += 1
        if 18 <= h < 60 and 12 <= s < 45 and v >= 60:
            c["beige"] += 1
        if (h >= 345 or h < 18) and s >= 40 and v >= 55:
            c["coral"] += 1
        if 270 <= h < 345 and s >= 25 and v >= 40:
            c["pink_purple"] += 1
    out = {k: round(100.0 * val / n, 2) for k, val in c.items()}
    out["sky_share"] = round(100.0 * len(sky) / n, 1)
    out["green_share"] = round(100.0 * len(green) / n, 1)
    out["sky_hue"] = round(statistics.median(t[0] for t in sky)) if len(sky) > 50 else None
    out["sky_sat"] = round(statistics.median(t[1] for t in sky)) if len(sky) > 50 else None
    out["sky_val"] = round(statistics.median(t[2] for t in sky)) if len(sky) > 50 else None
    out["green_hue"] = round(statistics.median(green)) if len(green) > 50 else None
    return out


def colour_report(im, sky_region):
    """One line per measure: value, campaign range, the skill's number, verdict by the campaign range.

    Two-sided measures (sky, foliage, coral) must lie inside the range. Shares of colours the skill
    forbids (yellow, yellow-green, orange, beige, near-black, pink and purple) only have a ceiling:
    less than the campaign paintings have is no fault. A value just outside is LOOK, not PASS.
    """
    whole, sky = measure(im), measure(sky_region)
    val = dict(whole)
    val.update(sky_hue=sky["sky_hue"], sky_sat=sky["sky_sat"], sky_val=sky["sky_val"])
    slack = {"sky_hue": 2, "sky_sat": 5, "sky_val": 4, "green_hue": 6, "coral": 3.0}
    names = [("sky_hue", "sky hue"), ("sky_sat", "sky saturation"), ("sky_val", "sky value"),
             ("green_hue", "foliage hue"), ("coral", "coral share %"), ("yellow", "yellow share %"),
             ("yellow_green", "yellow-green share %"), ("orange", "orange share %"), ("beige", "beige share %"),
             ("near_black", "near-black share %"), ("pink_purple", "pink + purple share %")]
    lines, verdicts = ["Colour numbers: value | campaign paintings (min to max) | the skill's number"], {}
    for key, label in names:
        v, (lo, hi) = val[key], CAMPAIGN_RANGE[key]
        if v is None:
            verdict = "LOOK"
        elif key in slack:
            verdict = "PASS" if lo <= v <= hi else ("LOOK" if lo - slack[key] <= v <= hi + slack[key] else "FAIL")
        else:
            verdict = "PASS" if v <= hi else ("LOOK" if v <= hi * 1.5 + 0.3 else "FAIL")
        verdicts[key] = (verdict, v)
        lines.append(f"  {verdict}  {label}: {v} | {lo} to {hi} | {SKILL_NUMBER[key] or 'none'}")
    return lines, verdicts


def comparison_sheet(posts, path):
    """The four new posts beside the six campaign paintings, each 552 px wide, as in a feed column."""
    w, gap, pad = 552, 28, 36
    others = ["cw-parade", "cw-plane", "cw-balloons", "cw-receipt", "cw-paper", "cw-rome"]
    cols = [[p.convert("RGB") for p in posts],
            [Image.open(REPO / f"img/{n}.webp").convert("RGB") for n in others[:3]],
            [Image.open(REPO / f"img/{n}.webp").convert("RGB") for n in others[3:]]]
    cols = [[im.resize((w, round(w * im.height / im.width)), Image.LANCZOS) for im in col] for col in cols]
    height = max(sum(im.height for im in col) + gap * (len(col) - 1) for col in cols) + 2 * pad + 40
    sheet = Image.new("RGB", (3 * w + 2 * gap + 2 * pad, height), "#ffffff")
    d = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=22)
    for ci, (col, title) in enumerate(zip(cols, ["NEW: the descent, posts 1 to 4",
                                                 "parade, plane, balloons", "receipt, newspaper, Rome"])):
        x, y = pad + ci * (w + gap), pad
        d.text((x, y), title, font=font, fill="#171b20")
        y += 40
        for im in col:
            sheet.paste(im, (x, y))
            y += im.height + gap
    sheet.save(path, quality=92)


def check(path, windows=None, scale=1.0):
    """Cut the painting into 4 feed posts, build the sheets a person has to look at, print the numbers.

    Default: four equal bands that touch (scale 1.0). The posts are separate in a feed, so if a band
    landed a little off, the four windows may be made a little smaller (scale, e.g. 0.92: still 1.91:1,
    centred left to right) and moved (windows: their four tops in pixels), in order and without overlap.
    """
    im = Image.open(path).convert("RGB")
    W, H = im.size
    band = H // SLICES
    pw, ph = round(W * scale), round(band * scale)
    x0 = (W - pw) // 2
    if windows is None:
        windows = [i * band + (band - ph) // 2 for i in range(SLICES)]
    if not 0.5 <= scale <= 1.0 or len(windows) != SLICES \
            or any(b - a < ph for a, b in zip(windows, windows[1:])) \
            or windows[0] < 0 or windows[-1] + ph > H:
        sys.exit(f"--windows needs {SLICES} tops, in order, at least {ph} px apart, inside 0..{H - ph}; "
                 "--scale between 0.5 and 1.")
    stem = Path(path).stem
    OUT.mkdir(parents=True, exist_ok=True)

    posts = [im.crop((x0, y, x0 + pw, y + ph)) for y in windows]
    for i, p in enumerate(posts, 1):
        p.save(OUT / f"{stem}_post{i}.png")

    # 1. each post alone, 600 px wide, with gaps like a feed
    small = [p.resize((600, round(600 * ph / pw)), Image.LANCZOS) for p in posts]
    sheet = Image.new("RGB", (648, sum(s.height for s in small) + (SLICES + 1) * 40), "#ffffff")
    y = 40
    for s in small:
        sheet.paste(s, (24, y))
        y += s.height + 40
    sheet.save(OUT / f"{stem}_posts_alone.png")

    # 2. every edge of a post that lies inside the painting: 5% of a post to both sides, enlarged 2x
    g = max(8, round(ph * 0.05))
    edges = sorted(set(e for y in windows for e in (y, y + ph) if 0 < e < H))
    strips, coral_in_gutter = [], []
    for cy in edges:
        top = max(0, cy - g)
        st = im.crop((x0, top, x0 + pw, min(H, cy + g)))
        coral_in_gutter.append(measure(st)["coral"])
        st = st.resize((st.width * 2, st.height * 2), Image.LANCZOS)
        ImageDraw.Draw(st).line([(0, (cy - top) * 2), (st.width, (cy - top) * 2)], fill="#ff00ff", width=1)
        strips.append(st)
    gsheet = Image.new("RGB", (strips[0].width + 60, sum(s.height for s in strips) + (len(strips) + 1) * 30),
                       "#ffffff")
    y = 30
    for s in strips:
        gsheet.paste(s, (30, y))
        y += s.height + 30
    gsheet.save(OUT / f"{stem}_cut_lines.png")

    # 3. the posts beside the six campaign paintings, at feed size
    comparison_sheet(posts, OUT / f"{stem}_beside_campaign.jpg")

    # 4. numbers
    print(f"\nCHECK of {path}  ({W}x{H}; post {pw}x{ph} = {pw / ph:.3f}:1; window tops {windows})")
    lines, verdicts = colour_report(im, posts[0])
    for line in lines:
        print(line)
    # where the bands really are, in fiftieths of the height: sky-blue share, and runs of coral rows
    rows = [measure(im.crop((0, H * i // 50, W, H * (i + 1) // 50))) for i in range(50)]
    print("Sky-blue share per tenth of the height, top to bottom (the blue table top counts in the last two):")
    print("        " + "  ".join(str(round(sum(r["sky_share"] for r in rows[i * 5:i * 5 + 5]) / 5, 1))
                                 for i in range(10)))
    runs, start = [], None
    for i, r in enumerate(rows + [{"coral": 0}]):
        if r["coral"] >= 12 and start is None:
            start = i
        if r["coral"] < 12 and start is not None:
            runs.append((start * 2, i * 2))
            start = None
    print("Bands of rows that are 12% coral or more, as % of the height (wanted: roof letters inside 27 to 48, "
          "banner inside 52 to 73):")
    print("        " + ("  ".join(f"{a} to {b}" for a, b in runs) or "none"))
    print("Coral at the edges of the posts, % (a hint only: above 3 means a coral thing may touch a cut):")
    print("        " + "  ".join(f"y={cy}: {v}" for cy, v in zip(edges, coral_in_gutter)))
    print("Coral per post, %: " + "  ".join(str(measure(p)["coral"]) for p in posts))
    print("LOOK AT, before anything is said about the result:")
    print(f"  {OUT / (stem + '_posts_alone.png')}      each post alone, as in a feed")
    print(f"  {OUT / (stem + '_cut_lines.png')}        the edges of the posts, 2x")
    print(f"  {OUT / (stem + '_beside_campaign.jpg')}  the posts beside the six campaign paintings")
    print("  Read the four lines letter by letter: Every conversation. / Not a sample. / "
          "We hear every call. / Even here.")
    print("  Search every post for any other writing (shop signs, tram number, cup, plane).")
    if STAGE == "draft":
        print("  A low draft shows layout, content and colour. It does NOT show stroke thickness.")
    else:
        save_review(Path(path), posts, stem)


def save_review(painting, posts, stem):
    """Final stage only: copy the results into the review folder (never committed). No site file is touched."""
    REVIEW.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(painting, REVIEW / "descent-full.png")
    for i, p in enumerate(posts, 1):
        p.save(REVIEW / f"descent-post{i}.png")
    for suffix, name in [("_beside_campaign.jpg", "descent-beside-campaign.jpg"),
                         ("_cut_lines.png", "descent-cut-lines.png"),
                         ("_posts_alone.png", "descent-posts-alone.png")]:
        shutil.copyfile(OUT / (stem + suffix), REVIEW / name)
    draft = next((e for e in read_log() if e.get("stage") == "draft" and e.get("picture")), None)
    if draft and Path(draft["picture"]).is_file():
        shutil.copyfile(draft["picture"], REVIEW / "descent-draft-low.png")
    print(f"Saved for review in {REVIEW}")


# ---------------------------------------------------------------------------
# Money: what the log says was spent, and what this call is expected to cost.
# ---------------------------------------------------------------------------
def cost_of(usage):
    """Dollars for one call from the API's usage block. Input rates are ASSUMED equal to the 2.5 rates."""
    out_t = usage.get("output_tokens") or 0
    det = usage.get("input_tokens_details") or {}
    img_t, txt_t = det.get("image_tokens"), det.get("text_tokens")
    if img_t is None and txt_t is None:                      # no breakdown: price all input at the image rate
        img_t, txt_t = usage.get("input_tokens") or 0, 0
    out_usd = out_t * USD_PER_M_OUTPUT / 1e6
    in_usd = (img_t or 0) * USD_PER_M_IMAGE_INPUT / 1e6 + (txt_t or 0) * USD_PER_M_TEXT_INPUT / 1e6
    return round(out_usd, 4), round(in_usd, 4)


def read_log():
    if not LOG.is_file():
        return []
    return [json.loads(line) for line in LOG.read_text(encoding="utf-8").splitlines() if line.strip()]


def budget(n_refs):
    """Returns (spent so far, expected cost of this call). Exits if a limit of this run would be broken."""
    entries = read_log()
    if any(e.get("stage") == STAGE for e in entries):
        sys.exit(f"The log already holds a {STAGE} call. The limit is ONE. Nothing was sent. "
                 "A second one needs a new yes from the owner (and then a fresh log).")
    spent = sum(e.get("cost_usd", 0.0) for e in entries)
    picture = STAGES[STAGE]["output_tokens"] * USD_PER_M_OUTPUT / 1e6
    draft = next((e for e in entries if e.get("stage") == "draft"), None)
    if STAGE == "final":
        if draft is None:
            sys.exit("No draft in the log. The final is painted with the checked draft as its last reference. "
                     "Nothing was sent.")
        per_ref = draft["input_usd"] / max(1, draft["n_refs"])   # the draft's real bill, per reference
        expected = picture + per_ref * n_refs * 1.25             # 25% on top: the draft itself is a larger image
    else:
        expected = picture + GUESS_INPUT_USD_PER_REFERENCE * n_refs
        final_guess = STAGES["final"]["output_tokens"] * USD_PER_M_OUTPUT / 1e6 \
            + GUESS_INPUT_USD_PER_REFERENCE * (n_refs + 1)
        if expected + final_guess > CEILING_USD:
            sys.exit(f"Draft (${expected:.2f}) plus final (${final_guess:.2f}) would pass ${CEILING_USD}. "
                     "Nothing was sent.")
    if spent + expected > CEILING_USD:
        sys.exit(f"Spent ${spent:.3f}; this call is expected to cost ${expected:.3f}; together over the "
                 f"ceiling of ${CEILING_USD}. STOP. Nothing was sent.")
    return spent, expected


# ---------------------------------------------------------------------------
# The network part.  --models is free.  --send is the paid call.
# ---------------------------------------------------------------------------
def _key():
    key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not key:
        sys.exit("OPENAI_API_KEY is not set in the environment. Nothing was sent.")
    return key


def _scrub(text, key):
    text = text.replace(key, "[key hidden]")
    return re.sub(r"sk-[A-Za-z0-9_\-\*\.]{6,}", "[key hidden]", text)


def _get_json(url, key):
    req = urllib.request.Request(url, headers={"Authorization": "Bearer " + key})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} from {url}: " + _scrub(e.read().decode("utf-8", "replace")[:1500], key))
    except urllib.error.URLError as e:
        sys.exit(f"Could not reach {url}: " + _scrub(str(e.reason), key))


def image_models(key):
    ids = sorted(m.get("id", "") for m in _get_json(MODELS_URL, key).get("data", []))
    return ids, [i for i in ids if "image" in i.lower()]


def _multipart(fields, files):
    boundary = "----painting" + uuid.uuid4().hex
    parts = []
    for name, value in fields:
        parts.append(
            (f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n').encode("utf-8")
            + str(value).encode("utf-8") + b"\r\n"
        )
    for name, filename, mime, data in files:
        parts.append(
            (f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'
             f"Content-Type: {mime}\r\n\r\n").encode("utf-8") + data + b"\r\n"
        )
    parts.append(f"--{boundary}--\r\n".encode("utf-8"))
    return b"".join(parts), "multipart/form-data; boundary=" + boundary


def preflight(draft_path):
    """Everything that can be wrong without paying. Returns the list of reference files, in order."""
    assert STAGE in STAGES
    w, h = STAGES[STAGE]["size"]
    assert w % 16 == 0 and h % 16 == 0 and h % SLICES == 0
    assert max(w, h) <= 3840 and 655_360 <= w * h <= 8_294_400 and max(w, h) / min(w, h) <= 3.0
    for name, block in [("MAP", MAP), ("OPENING", OPENING), ("COLOURS", COLOURS), ("SUBJECT", SUBJECT),
                        ("WORDS", WORDS), ("COUNT", COUNT)]:
        hit = re.search(BANNED_IN_MY_BLOCKS, block, flags=re.I)
        assert not hit, f"the skill forbids the word '{hit.group(0)}' in the prompt ({name})"
    OUT.mkdir(parents=True, exist_ok=True)
    layout = OUT / "descent_layout.png"
    make_layout(layout, LAYOUT_W)
    refs = [layout] + REFS[1:]
    if STAGE == "final":
        if not draft_path:
            sys.exit("The final stage needs --draft FILE (the checked low draft). Nothing was sent.")
        refs.append(Path(draft_path))
    for p in refs:
        if not Path(p).is_file():
            sys.exit(f"Reference image missing: {p}. Nothing was sent.")
    (OUT / f"descent_prompt_{STAGE}.txt").write_text(PROMPT, encoding="utf-8")
    return refs


def plan(refs, spent, expected):
    w, h = STAGES[STAGE]["size"]
    print(f"PACKAGE B, the descent, stage: {STAGE.upper()}")
    print(f"  model     {MODEL}")
    print(f"  endpoint  {ENDPOINT}")
    print(f"  size      {w}x{h}   quality {STAGES[STAGE]['quality']}   n 1")
    for i, p in enumerate(refs, 1):
        print(f"  image {i}   {p}")
    print(f"  prompt    {len(PROMPT)} characters, saved to {OUT / ('descent_prompt_' + STAGE + '.txt')}")
    print(f"  price     picture ${STAGES[STAGE]['output_tokens'] * USD_PER_M_OUTPUT / 1e6:.3f} (guide calculator) "
          f"+ references; expected ${expected:.2f} in all")
    print(f"  budget    spent so far ${spent:.3f}; ceiling ${CEILING_USD} for draft and final together")


def send(refs):
    key = _key()
    all_ids, image_ids = image_models(key)                   # free
    if MODEL not in all_ids:
        sys.exit(f"The account has no model named {MODEL}. Its image models: {image_ids}. Nothing was sent.")
    w, h = STAGES[STAGE]["size"]
    quality = STAGES[STAGE]["quality"]
    stamp = time.strftime("%Y%m%d-%H%M%S")
    fields = [("model", MODEL), ("prompt", PROMPT), ("size", f"{w}x{h}"), ("quality", quality), ("n", "1")]
    files = []
    for i, p in enumerate(refs, 1):
        p = Path(p)
        mime = {"png": "image/png", "webp": "image/webp", "jpg": "image/jpeg", "jpeg": "image/jpeg"}[
            p.suffix.lower().lstrip(".")]
        files.append(("image[]", f"reference{i}{p.suffix.lower()}", mime, p.read_bytes()))
    body, content_type = _multipart(fields, files)
    req = urllib.request.Request(ENDPOINT, data=body, method="POST",
                                 headers={"Authorization": "Bearer " + key, "Content-Type": content_type})
    OUT.mkdir(parents=True, exist_ok=True)
    marker = {"time": stamp, "stage": STAGE, "status": "sent, no answer recorded yet", "cost_usd": 0.0,
              "input_usd": 0.0, "n_refs": len(refs)}
    with open(LOG, "a", encoding="utf-8") as f:              # written BEFORE the call: a crash cannot hide it
        f.write(json.dumps(marker) + "\n")
    print("Sending ONE paid call. The script does not retry, whatever happens.")
    try:
        with urllib.request.urlopen(req, timeout=1200) as r:
            raw = r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"The API refused the call (HTTP {e.code}); a refused call is normally not charged, check "
                 "the usage page. The log keeps this attempt: no second try without the owner.\n"
                 + _scrub(e.read().decode("utf-8", "replace")[:2000], key))
    except Exception as e:                                   # timeout, broken connection
        sys.exit("No answer came back. THE CALL MAY STILL HAVE BEEN CHARGED: check the usage page and tell "
                 "the owner. No second try.\n" + _scrub(repr(e), key))

    raw_path = OUT / f"descent_{STAGE}_{stamp}_response.json"
    raw_path.write_bytes(raw)                                # first of all: what was paid for is on disk
    try:
        answer = json.loads(raw)
        png = base64.b64decode(answer["data"][0]["b64_json"])
    except Exception as e:
        sys.exit(f"The answer is saved at {raw_path} but could not be read as a picture: {e!r}")
    png_path = OUT / f"descent_{STAGE}_{stamp}.png"
    png_path.write_bytes(png)
    usage = answer.get("usage") or {}
    out_usd, in_usd = cost_of(usage)
    entries = [e for e in read_log() if not (e.get("time") == stamp and e.get("stage") == STAGE)]
    entries.append({"time": stamp, "stage": STAGE, "status": "done", "model": MODEL, "size": f"{w}x{h}",
                    "quality": quality, "n_refs": len(refs), "references": [str(p) for p in refs],
                    "usage": usage, "output_usd": out_usd, "input_usd": in_usd,
                    "cost_usd": round(out_usd + in_usd, 4), "picture": str(png_path), "prompt": PROMPT})
    LOG.write_text("".join(json.dumps(e, ensure_ascii=False) + "\n" for e in entries), encoding="utf-8")
    print(f"Saved {png_path}")
    print(f"Usage: {usage}")
    print(f"Cost of this call: picture ${out_usd} + input ${in_usd} = ${round(out_usd + in_usd, 4)} "
          "(input priced at the 2.5 rates; the usage page has the last word)")
    print(f"Spent in this run so far: ${sum(e.get('cost_usd', 0.0) for e in entries):.3f} of ${CEILING_USD}")
    try:
        raw_path.unlink()
    except OSError:
        pass
    check(png_path)


def main():
    ap = argparse.ArgumentParser(description=f"Package B, the descent: {STAGE} stage.")
    ap.add_argument("--models", action="store_true", help="free: list the account's image models")
    ap.add_argument("--send", action="store_true", help="PAID: make this stage's one picture")
    ap.add_argument("--owner-said-yes", action="store_true", help="required with --send")
    ap.add_argument("--draft", metavar="FILE", help="final stage: the checked low draft, sent as the last reference")
    ap.add_argument("--check", metavar="FILE", help="free: cut a result into posts and measure it")
    ap.add_argument("--windows", default=None, help="with --check: the tops of the four posts in pixels")
    ap.add_argument("--scale", type=float, default=1.0, help="with --check: post size against a quarter band")
    a = ap.parse_args()

    if a.check:
        wins = [int(v) for v in a.windows.split(",")] if a.windows else None
        check(a.check, wins, a.scale)
        return
    if a.models:
        _, image_ids = image_models(_key())
        print("Image models on this account:")
        for i in image_ids:
            print("  " + i)
        print(f"This script would use: {MODEL}")
        return
    refs = preflight(a.draft)
    if not a.send:
        expected = STAGES[STAGE]["output_tokens"] * USD_PER_M_OUTPUT / 1e6 + GUESS_INPUT_USD_PER_REFERENCE * len(refs)
        plan(refs, sum(e.get("cost_usd", 0.0) for e in read_log()), expected)
        print("\nDRY RUN. Nothing was sent and nothing was spent.")
        return
    if not a.owner_said_yes:
        sys.exit("--send needs --owner-said-yes. Nothing was sent.")
    spent, expected = budget(len(refs))
    plan(refs, spent, expected)
    send(refs)


if __name__ == "__main__":
    main()
