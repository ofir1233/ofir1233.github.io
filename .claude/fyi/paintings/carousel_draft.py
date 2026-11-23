#!/usr/bin/env python3
# #############################################################################
# #############################################################################
# ##                                                                         ##
# ##   DO NOT RUN without the owner's explicit yes: this call costs money.   ##
# ##                                                                         ##
# #############################################################################
# #############################################################################
#
# PACKAGE A, "the seamless carousel": LOW DRAFT ONLY.
# Plan, acceptance list, prices and risks: carousel.md (same folder).
# Rulebook: /Users/ofirnona/ofir1233.github.io/.claude/skills/v7-painting/SKILL.md
#
# What each way of starting this file does:
#   python3 carousel_draft.py                       DRY. Sends nothing, costs nothing. Makes the box layout
#                                                   (PIL), writes the prompt to a text file, prints the plan.
#   python3 carousel_draft.py --models              FREE. Asks the account which image models it has
#                                                   (the skill: never take a model name from an old script).
#   python3 carousel_draft.py --send --owner-said-yes
#                                                   PAID, about $0.07 (estimate, see carousel.md). One call,
#                                                   never repeated by the script. Only after the owner has
#                                                   seen the price and answered with a clear yes.
#   python3 carousel_draft.py --check FILE [--band-y N]
#                                                   FREE. Cuts a result into 5 slides and measures the colours.
#
# The API key is read from the environment variable OPENAI_API_KEY. It is never printed, never written to
# a file, and it is scrubbed from any error text before that text is shown.
# This script was written on 23.11.2026 and has NOT been executed by the agent that wrote it.

import argparse
import base64
import colorsys
import json
import os
import re
import statistics
import sys
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path("/Users/ofirnona/ofir1233.github.io")            # read only
HERE = Path(__file__).resolve().parent
OUT = HERE / "out_carousel"                                  # everything this script writes goes here

# ---- the call (skill, section THE MODEL; confirm the model name on the day, with --models and the guide)
MODEL = "gpt-image-2.6-sunburst"                             # the newest "Sunburst" on 22.11.2026
ENDPOINT = "https://api.openai.com/v1/images/edits"
MODELS_URL = "https://api.openai.com/v1/models"
QUALITY = "low"                                              # this file is the low draft and nothing else
PRICE_PER_M_OUTPUT_TOKENS = 30.0                             # dollars, from the skill

# ---- sizes.  Five 4:5 slides side by side are a 4:1 strip.  The canvas is 3:1: the strip plus a spare
#      band of sky above and pavement below, so the strip can be moved up or down after painting.
FINAL_W, FINAL_H = 3840, 1280                                # the max render (NOT made by this script)
DRAFT_W, DRAFT_H = 2880, 960                                 # this draft: the same picture at 75%
SLIDES = 5
LAYOUT_W = 1440                                              # the box sketch is sent small: cheaper to read
ESTIMATE = "about $0.07 (estimate; say $0.10 to the owner as the ceiling)"

REFS = [
    None,                                                    # image 1: the box layout, made below
    REPO / "img/me-v7-studio-b-1920.webp",                   # image 2: the hand (quality and style reference)
    REPO / "hear-v7/media/hero-contact-center-1600.webp",    # image 3: colour and richness of paint only
]

# =============================================================================
# THE PROMPT.  OPENING / TECHNIQUE / COLOURS / FORBID are the skill's own words.
# Two deliberate departures, both explained in carousel.md:
#   1. OPENING says SECOND where the skill says FIRST, because image 1 is the box layout here.
#   2. CLOSING keeps the skill's light sentence; "No text, no letters, no logos." is replaced by WORDS,
#      because this campaign picture carries the message as painted words.
# =============================================================================
MAP = (
    "The FIRST reference image is a rough sketch made of coloured boxes. It is only a map of where things "
    "stand: keep the place and the size of every box and paint the real thing there. Do not paint boxes, "
    "sketch lines or its lettering style. The five words written in it show where the five painted words go "
    "and how large they are. The SECOND reference image is a finished painting by the painter of this "
    "picture: take from it the hand, the thick paint and the strokes. The THIRD reference image is by the "
    "same painter: take from it only the richness of the paint and its coral, lilac, magenta-pink, emerald, "
    "cobalt and cream. Take nothing of the subject of either: no people at desks, no chairs in rows, no "
    "headsets, no laptops, no monitors, no office, no room."
)

OPENING = "It must look as if the same painter made it on the same day as the SECOND reference image."

TECHNIQUE = (
    "TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes "
    "in thousands of small, crisp, confident strokes; every stroke a distinct plane of colour with a sharp "
    "edge and a slight ridge of paint; clearly hand-painted at every scale. Not a digital illustration, not "
    "anime, not pixel art, not vector, not a print: no flat fills, no outlines, no dithering, no fine "
    "hatching, no canvas weave, no cracks, no stripes, no blur, no photo realism."
)

COLOURS = (
    "COLOURS: taken from the windows of the references and from nowhere else. Sky: cobalt-azure blue, about "
    "#3b8ed3, with darker #2a78c6 and lighter #6cb4ec strokes; rich but natural, not electric, not neon, not "
    "ultramarine. Trees: COOL emerald and teal greens only, about #43765d, with darker #2c5a48 and lighter "
    "#6aa98a. Absolutely no yellow, no yellow-green, no olive, no lime, no golden or warm foliage. Buildings: "
    "blue glass towers (cobalt, azure and pale sky-blue reflections) and clean cool white facades with pale "
    "blue shadows. Only tiny accents of coral and lilac. No pink or purple flower masses, no orange roofs. "
    "The whole picture is cool: blue, white and emerald."
)

# The skill's later ruling (COLOURFULNESS, 22.11.2026 evening) in its own colour words.  See carousel.md,
# "Decisions for the owner", point 2: the fixed COLOURS block above still says "tiny accents".
CAMPAIGN_COLOURS = (
    "One change to the paragraph above, for this picture: coral and lilac are not tiny here. Coral "
    "red-orange (about #e8604a) appears in large clear shapes, with lilac, magenta-pink and white flowers, "
    "emerald, cobalt and cream, spread over the whole picture. They sit on the objects named below (an "
    "awning, a ribbon, balloon letters, chairs, a boat, cabin doors, pennants, flowers in boxes and "
    "buckets). They are never foliage, never a roof and never the colour of the light, and the flowers are "
    "many small bunches, never one big pink or purple mass."
)

SUBJECT = (
    "WHAT IT IS: one very wide street-level painting of a seaside city of blue glass towers and white "
    "Bauhaus blocks, seen from the opposite pavement, as if walking along one street from the town at the "
    "left to the harbour at the right. One continuous picture with one street, one sky and one light: no "
    "panels, no frames, no borders, no dividing lines, nothing painted twice. It is described here in five "
    "neighbouring parts of equal width, from left to right. Each part has its own main thing standing whole "
    "inside it; the walls, the tree crowns, the pavement, the two tram rails and a string of small pennants "
    "run on from part to part without a break. The top eighth of the picture holds sky, cloud and tower "
    "tops, and the bottom eighth holds cobbled pavement with leaf shadows.\n"
    "SKY, along the whole width: cobalt-azure built from broad visible knife strokes in different "
    "directions; thick sculpted white cumulus with pale blue and lilac shadows piled behind the towers, a "
    "different group of clouds over each part; gulls; behind the street a dense skyline of blue glass towers "
    "with window grids and cloud reflections, taller toward the left.\n"
    "STREET, along the whole width: pale blue-lilac cobbles (cool, never beige) with dappled blue shadows of "
    "leaves; a white kerb; two steel-blue tram rails; one white lamp post with a round globe in each part; a "
    "string of small triangular pennants in coral, lilac, white and teal, with no letters on them, swinging "
    "from lamp post to lamp post; big rounded emerald tree crowns with cool blue-lilac trunks standing "
    "between the buildings.\n"
    "PART 1, the flower shop: a white Bauhaus corner block with rounded balconies, white railings, boxes of "
    "lilac and white flowers and tall windows reflecting the sky; on its ground floor a flower shop under "
    "one large coral awning (#e8604a) that faces the viewer squarely; on the front of the awning the word "
    "Every in large cream-white hand-painted letters; under the awning white enamel buckets of white, lilac "
    "and a few magenta-pink flowers on wooden steps painted white, a teal watering can, a shop window with "
    "sky reflections, a white bicycle with a basket of flowers leaning on the wall, a florist in a teal "
    "apron, small; two blue glass towers behind.\n"
    "PART 2, the tram: a short vintage tram of one car stands whole inside this part, side-on to the "
    "viewer: cream-white body, a cobalt band under the windows, a round front lamp, a white roof, a "
    "pantograph reaching the overhead wire, passengers as small dabs of colour behind the windows; along its "
    "side, under the cobalt band, the word customer in large coral hand-painted letters; no number and no "
    "route board on it. Behind it a tall blue glass tower with a strong reflection of clouds, and a white "
    "apartment block with a roof terrace and a lilac-and-white striped parasol; a white tram shelter with a "
    "bench; two people waiting with a small white dog, seen from far.\n"
    "PART 3, the square with the kite: the street opens into a small square with a round stone fountain, "
    "white water jets and pale blue water; a child and a parent by the fountain hold a kite string, small, "
    "seen from behind; high above them one large diamond kite in lilac with a white cross, and from the kite "
    "a long broad coral cloth ribbon streams to the left, pulled straight by the wind and facing the viewer "
    "squarely like a banner towed through the sky; on the ribbon the word call, in large cream-white painted "
    "letters, with a comma after it; an ice-cream cart with a lilac-and-white striped parasol and no "
    "writing; white blocks with rounded balconies, emerald crowns, two glass towers; white pigeons on the "
    "cobbles.\n"
    "PART 4, the cafe: a cafe terrace under a wide teal-and-white striped awning with no writing; round "
    "tables with blue-painted metal tops, coral woven chairs with white frames, coral cups, glass vases of "
    "lilac flowers, guests as small figures talking, a waiter in a white shirt and a navy apron seen from "
    "behind; white planters with white hydrangeas and lavender; and in the foreground on the pavement, "
    "large, an A-frame chalk board, deep cobalt navy (#123a6b) in a white wooden frame, facing the viewer "
    "squarely; on it the word heard. in large cream-white chalk letters, with a full stop after it, and "
    "nothing else written or drawn on the board.\n"
    "PART 5, the harbour: the street ends at the harbour promenade: a white railing, cobalt sea in short "
    "horizontal knife strokes with white foam lines, a white lighthouse with a coral band on a pier, a "
    "sailboat with a lilac sail, a coral fishing boat, two coral buoys, gulls; three beach cabins with "
    "coral, lilac and teal doors; on the promenade a teal flower cart with white and lilac flowers, and tied "
    "to it by thin strings four big coral foil balloon letters floating side by side high against the sky, "
    "glossy, with white highlights, spelling the word Hear; a few round balloons in azure, lilac and white "
    "beside them; one person photographing the balloons, small, seen from behind."
)

WORDS = (
    "THE WORDS: exactly five words are painted in this picture, one in each part, in this order from left "
    "to right: Every / customer / call, / heard. / Hear. Spell them exactly, letter for letter: E-v-e-r-y; "
    "c-u-s-t-o-m-e-r; c-a-l-l followed by a comma; h-e-a-r-d followed by a full stop; H-e-a-r. Each word is "
    "written once, whole, large, upright and easy to read, inside its own part, with wall, sky or pavement "
    "to its left and to its right. No other text anywhere in the picture: no shop names, no street signs, no "
    "numbers, no price tags, no posters, no writing on the tram, the awnings, the carts, the boats or the "
    "pennants other than the five words; no logos, no symbols, no signature."
)

COUNT = (
    "COUNT: exactly one tram, one kite with one ribbon, one chalk board, one coral awning with a word, one "
    "set of four balloon letters, one lighthouse, one fountain. No plane. People are few and small, "
    "passers-by and cafe guests seen from far; nobody large in the foreground."
)

FORBID = (
    "FORBIDDEN in every part of the picture: yellow, golden light, orange, amber, yellow-green, olive, lime, "
    "warm or golden foliage, orange roofs, beige, brown, black. Light that would be yellow in a photograph "
    "is painted here as cream-white (#f4efe6) or as coral (#e8604a). The darkest colour in the picture is a "
    "deep cobalt navy (#123a6b), never black and never grey."
)

CLOSING = "Bright late-morning light from the left, strong light and shadow planes on every building."

PROMPT = "\n\n".join([MAP, OPENING, TECHNIQUE, COLOURS, CAMPAIGN_COLOURS, SUBJECT, WORDS, COUNT, FORBID, CLOSING])

# Skill, rule 3 and the note under THE FIXED PROMPT: these words must not be in what I wrote myself.
BANNED_IN_MY_BLOCKS = r"\b(empty|calm|minimal|simple|plain|quiet|clean|low|flat|graphic|editorial)\b"

# ---------------------------------------------------------------------------
# The layout image (reference image 1). Local, PIL only, costs nothing.
# All coordinates are written for the FINAL canvas (3840 x 1280) and scaled.
# No cut lines and no labels are drawn: the model paints what it sees, so the
# only writing in the sketch is the five words of the message.
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

    GROUND = 900                      # top of the pavement on the final canvas

    # clouds: one group over each slide, piled behind the towers
    for cx, cy, rx, ry in [(250, 250, 230, 90), (560, 330, 170, 70), (1010, 190, 240, 95),
                           (1330, 300, 170, 70), (1790, 520, 220, 80), (2450, 230, 230, 90),
                           (2800, 330, 190, 75), (3250, 600, 200, 70), (3640, 640, 170, 60)]:
        E((cx - rx, cy - ry, cx + rx, cy + ry), L_CLOUD)

    # far glass towers, taller toward the left; none ends on a cut line
    for x0, x1, top, c in [(70, 250, 150, L_TOWER), (300, 440, 300, L_TOWER2), (560, 700, 210, L_TOWER),
                           (900, 1090, 120, L_TOWER), (1150, 1300, 260, L_TOWER2), (1380, 1500, 340, L_TOWER),
                           (1600, 1740, 400, L_TOWER2), (2010, 2150, 470, L_TOWER), (2390, 2530, 380, L_TOWER2),
                           (2700, 2850, 440, L_TOWER), (2930, 3040, 520, L_TOWER2)]:
        R((x0, top, x1, GROUND), c)
        for wy in range(top + 30, GROUND - 260, 46):
            LN([(x0 + 12, wy), (x1 - 12, wy)], L_SKY, 5)

    # near white blocks along the street (walls run across the cut lines)
    for x0, x1, top in [(0, 700, 470), (700, 1560, 560), (1560, 1700, 520), (2140, 2330, 540),
                        (2330, 3110, 500)]:
        R((x0, top, x1, GROUND), L_WALL, L_WALL_SH)
        for wx in range(int(x0) + 50, int(x1) - 70, 120):
            for wy in range(top + 40, GROUND - 230, 90):
                R((wx, wy, wx + 60, wy + 50), L_WIN)

    # pavement, kerb, two tram rails that run the whole width
    R((0, GROUND, FINAL_W, FINAL_H), L_PAVE)
    LN([(0, GROUND + 6), (FINAL_W, GROUND + 6)], L_WALL_SH, 8)
    LN([(0, 985), (FINAL_W, 985)], L_RAIL, 6)
    LN([(0, 1035), (FINAL_W, 1035)], L_RAIL, 6)

    # harbour end (slide 5): sea, promenade railing, lighthouse, sail, cabins
    R((3110, 800, FINAL_W, GROUND), L_SEA)
    LN([(3110, 860), (FINAL_W, 860)], L_CREAM, 6)
    R((3745, 520, 3790, 860), L_CREAM, L_WALL_SH)
    R((3745, 640, 3790, 690), L_CORAL)
    P([(3180, 850), (3180, 690), (3270, 850)], L_LILAC)
    for i, c in enumerate([L_CORAL, L_LILAC, L_TEAL]):
        R((3560 + i * 58, 760, 3610 + i * 58, 860), c)

    # tree crowns: the things that are allowed to stand on a cut line
    for cx, cy, r in [(768, 700, 120), (1536, 690, 105), (2304, 700, 120), (3072, 690, 105),
                      (40, 720, 100), (1760, 740, 80)]:
        R((cx - 12, cy, cx + 12, GROUND), L_TRUNK)
        E((cx - r, cy - r, cx + r, cy + r), L_TREE)

    # the string of pennants from lamp post to lamp post, along the whole street
    posts = [384, 1152, 1920, 2688, 3456]
    for px in posts:
        R((px - 7, 560, px + 7, GROUND), L_CREAM, L_WALL_SH)
        E((px - 20, 530, px + 20, 570), L_CREAM)
    for a, b in zip([0] + posts, posts + [FINAL_W]):
        LN([(a, 575), ((a + b) / 2, 610), (b, 575)], L_RAIL, 3)

    # SLIDE 1: flower shop, the coral awning carries "Every"
    P([(130, 610), (650, 610), (680, 760), (100, 760)], L_CORAL)
    _fit_text(d, (150, 625, 630, 750), "Every", L_CREAM, k, 4)
    R((150, 760, 630, GROUND), L_WIN, L_WALL_SH)
    for fx in (180, 300, 420, 540):
        E((fx, 830, fx + 80, 900), L_LILAC if fx % 240 else L_CLOUD)

    # SLIDE 2: the tram, whole inside the slide, carries "customer"
    R((860, 690, 1450, 950), L_CREAM, L_RAIL, r=26)
    for wx in range(890, 1400, 92):
        R((wx, 715, wx + 70, 785), L_WIN)
    R((860, 800, 1450, 818), "#1f6fc4")
    _fit_text(d, (900, 826, 1410, 930), "customer", L_CORAL, k, 3)
    LN([(1150, 690), (1150, 600)], L_RAIL, 5)
    for wx in (980, 1320):
        E((wx - 28, 940, wx + 28, 996), L_RAIL)

    # SLIDE 3: square with fountain; the kite's ribbon carries "call,"
    E((1790, 880, 2060, 960), L_WALL_SH)
    E((1850, 860, 2000, 915), L_SKY)
    P([(2170, 215), (2235, 300), (2170, 400), (2105, 300)], L_LILAC)
    LN([(2170, 400), (1960, 880)], L_RAIL, 3)
    P([(1640, 318), (2112, 300), (2112, 440), (1640, 458)], L_CORAL)
    _fit_text(d, (1670, 318, 2090, 446), "call,", L_CREAM, k, 4)

    # SLIDE 4: cafe terrace; the chalk board in front carries "heard."
    for i in range(8):
        R((2370 + i * 84, 600, 2412 + i * 84, 665), L_TEAL)
    for tx in (2420, 2890):           # two tables; every chair stays clear of the cut lines
        E((tx, 800, tx + 130, 850), L_SEA)
        R((tx - 50, 770, tx - 5, 880), L_CORAL)
    P([(2530, 690), (2850, 690), (2880, 1080), (2500, 1080)], L_CREAM)
    R((2548, 712, 2832, 1040), L_NAVY)
    _fit_text(d, (2566, 800, 2814, 950), "heard.", L_CREAM, k, 3)

    # SLIDE 5: flower cart; four coral balloon letters carry "Hear"
    R((3380, 880, 3560, 980), L_TEAL)
    for wx in (3410, 3530):
        E((wx - 30, 960, wx + 30, 1020), L_RAIL)
    for i, ch in enumerate("Hear"):
        bx = 3215 + i * 124
        LN([(bx + 55, 520), (3470, 880)], L_RAIL, 2)
        d.rounded_rectangle([bx * k, 300 * k, (bx + 112) * k, 520 * k], radius=36 * k, fill=L_CORAL)
        _fit_text(d, (bx + 14, 330, bx + 98, 490), ch, L_CREAM, k, 4)
    for bx, by, c in [(3180, 560, L_LILAC), (3716, 380, L_TOWER2), (3150, 420, L_CLOUD)]:
        E((bx, by, bx + 56, by + 70), c)

    im.save(path)
    return im.size

# ---------------------------------------------------------------------------
# Free local checks on a result: the cut and the colour numbers (PIL only).
# ---------------------------------------------------------------------------
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


def _verdict(name, value, ok, look=None):
    if value is None:
        return f"  LOOK  {name}: not enough pixels to measure"
    if ok(value):
        return f"  PASS  {name}: {value}"
    if look and look(value):
        return f"  LOOK  {name}: {value}"
    return f"  FAIL  {name}: {value}"


def colour_report(im, sky_region):
    whole, sky = measure(im), measure(sky_region)
    lines = [
        "Colour numbers (skill: 'Colour is checked with numbers, every time')",
        _verdict("sky hue, must be 203 to 212", sky["sky_hue"], lambda x: 203 <= x <= 212),
        _verdict("sky saturation, near 70 (approved pictures: 67 to 86)", sky["sky_sat"],
                 lambda x: 60 <= x <= 80, lambda x: 80 < x <= 86),
        f"        sky value: {sky['sky_val']} (reference paintings: 84 to 95)",
        _verdict("foliage hue, must be 140 to 165 (166 to 180 = teal side, show the owner)",
                 whole["green_hue"], lambda x: 140 <= x <= 165, lambda x: 165 < x <= 180),
        _verdict("yellow share %, must be 0 (limit 0.3)", whole["yellow"], lambda x: x <= 0.3),
        _verdict("yellow-green / olive / lime share %, must be 0 (limit 0.5)", whole["yellow_green"],
                 lambda x: x <= 0.5),
        _verdict("orange share %, limit 1.0 (small people's skin lands here)", whole["orange"],
                 lambda x: x <= 1.0, lambda x: x <= 2.0),
        _verdict("beige share %, look above 3 (my own measure; Hear's hero painting has 5.9)", whole["beige"],
                 lambda x: x <= 3.0, lambda x: x <= 8.0),
        _verdict("near-black share %, limit 0.5", whole["near_black"], lambda x: x <= 0.5),
        _verdict("coral share %, wanted 3 to 12 (the six campaign paintings: 5 to 12)", whole["coral"],
                 lambda x: 3 <= x <= 12, lambda x: 1.5 <= x <= 16),
        _verdict("pink + purple share %, look above 8 (no flower masses)", whole["pink_purple"],
                 lambda x: x <= 8, lambda x: x <= 14),
    ]
    return lines


def check(path, band_y=None):
    """Cut the strip into 5 slides, build the sheets a person has to look at, print the numbers."""
    im = Image.open(path).convert("RGB")
    W, H = im.size
    band_h = round(W / 4)                                    # five 4:5 slides = 4:1
    if band_h > H:
        sys.exit(f"{path}: {W}x{H} is wider than 4:1, there is no 4:1 band in it.")
    if band_y is None:
        band_y = (H - band_h) // 2
    band_y = max(0, min(H - band_h, band_y))
    band = im.crop((0, band_y, W, band_y + band_h))
    sw = W // SLIDES
    stem = Path(path).stem
    OUT.mkdir(parents=True, exist_ok=True)

    slides = [band.crop((i * sw, 0, (i + 1) * sw, band_h)) for i in range(SLIDES)]
    for i, s in enumerate(slides, 1):
        s.save(OUT / f"{stem}_slide{i}.png")

    # 1. each slide alone, at phone size (390 px wide), with gaps: is every one a picture on its own?
    ph = [s.resize((390, round(390 * band_h / sw)), Image.LANCZOS) for s in slides]
    sheet = Image.new("RGB", (SLIDES * 390 + (SLIDES + 1) * 24, ph[0].height + 48), "#ffffff")
    for i, p in enumerate(ph):
        sheet.paste(p, (24 + i * (390 + 24), 24))
    sheet.save(OUT / f"{stem}_slides_alone.png")

    # 2. the four cut lines, each as a strip of 5% of a slide to both sides, enlarged 3x, cut drawn in magenta
    g = max(8, round(sw * 0.05))
    strips, coral_in_gutter = [], []
    for i in range(1, SLIDES):
        st = band.crop((i * sw - g, 0, i * sw + g, band_h))
        coral_in_gutter.append(measure(st)["coral"])
        st = st.resize((st.width * 3, st.height * 3), Image.LANCZOS)
        ImageDraw.Draw(st).line([(st.width // 2, 0), (st.width // 2, st.height)], fill="#ff00ff", width=1)
        strips.append(st)
    gsheet = Image.new("RGB", (sum(s.width for s in strips) + 5 * 30, strips[0].height + 60), "#ffffff")
    x = 30
    for s in strips:
        gsheet.paste(s, (x, 30))
        x += s.width + 30
    gsheet.save(OUT / f"{stem}_cut_lines.png")

    sky_region = band.crop((0, 0, W, round(band_h * 0.40)))
    print(f"\nCHECK of {path}  ({W}x{H}; band y={band_y}..{band_y + band_h}; slide {sw}x{band_h})")
    for line in colour_report(band, sky_region):
        print(line)
    print("Coral in the four cut-line strips, % (a hint only: above 3 means a coral thing may touch a cut):")
    print("        " + "  ".join(f"cut {i + 1}: {v}" for i, v in enumerate(coral_in_gutter)))
    print("Coral per slide, % (every slide should have some): "
          + "  ".join(str(measure(s)["coral"]) for s in slides))
    print("LOOK AT, before anything is shown to the owner or said about the result:")
    print(f"  {OUT / (stem + '_slides_alone.png')}   each slide alone, phone size")
    print(f"  {OUT / (stem + '_cut_lines.png')}   the four cut lines, 3x")
    print("  Read the five words letter by letter: Every / customer / call, / heard. / Hear")
    print("  Search every slide for any other writing (shop signs, tram number, cart, boats).")
    print("  A low draft shows layout, content and colour. It does NOT show stroke thickness.")
    print("  If the words sit too high or too deep, run --check again with --band-y to move the band.")


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


def preflight():
    """Everything that can be wrong without paying. Returns the list of reference files, in order."""
    assert QUALITY == "low", "This file makes the low draft only. The max render gets its own script."
    for w, h in [(DRAFT_W, DRAFT_H), (FINAL_W, FINAL_H)]:
        assert w % 16 == 0 and h % 16 == 0, "sides must be multiples of 16"
        assert max(w, h) <= 3840 and w * h <= 8_290_000, "over the model's size limits"
        assert max(w, h) / min(w, h) <= 3.0, "wider than 3:1 has never been tried (see carousel.md)"
    assert abs(DRAFT_W / DRAFT_H - FINAL_W / FINAL_H) < 1e-6, "draft and final must have one shape"
    for name, block in [("MAP", MAP), ("CAMPAIGN_COLOURS", CAMPAIGN_COLOURS), ("SUBJECT", SUBJECT),
                        ("WORDS", WORDS), ("COUNT", COUNT)]:
        hit = re.search(BANNED_IN_MY_BLOCKS, block, flags=re.I)
        assert not hit, f"the skill forbids the word '{hit.group(0)}' in the prompt ({name})"
    OUT.mkdir(parents=True, exist_ok=True)
    layout = OUT / "carousel_layout.png"
    make_layout(layout, LAYOUT_W)
    refs = [layout] + REFS[1:]
    for p in refs:
        if not Path(p).is_file():
            sys.exit(f"Reference image missing: {p}. Nothing was sent.")
    (OUT / "carousel_prompt.txt").write_text(PROMPT, encoding="utf-8")
    return refs


def plan(refs):
    print("PACKAGE A, the seamless carousel: LOW DRAFT")
    print(f"  model     {MODEL}   (confirm today with --models and the image guide)")
    print(f"  endpoint  {ENDPOINT}")
    print(f"  size      {DRAFT_W}x{DRAFT_H}   quality {QUALITY}   n 1")
    for i, p in enumerate(refs, 1):
        print(f"  image {i}   {p}")
    print(f"  prompt    {len(PROMPT)} characters, saved to {OUT / 'carousel_prompt.txt'}")
    print(f"  price     {ESTIMATE}")


def send(refs):
    key = _key()
    all_ids, image_ids = image_models(key)                   # free
    if MODEL not in all_ids:
        sys.exit(f"The account has no model named {MODEL}. Its image models: {image_ids}. Nothing was sent.")
    stamp = time.strftime("%Y%m%d-%H%M%S")
    fields = [("model", MODEL), ("prompt", PROMPT), ("size", f"{DRAFT_W}x{DRAFT_H}"),
              ("quality", QUALITY), ("n", "1")]
    files = []
    for p in refs:
        p = Path(p)
        mime = {"png": "image/png", "webp": "image/webp", "jpg": "image/jpeg", "jpeg": "image/jpeg"}[
            p.suffix.lower().lstrip(".")]
        files.append(("image[]", p.name, mime, p.read_bytes()))
    body, content_type = _multipart(fields, files)
    req = urllib.request.Request(ENDPOINT, data=body, method="POST",
                                 headers={"Authorization": "Bearer " + key, "Content-Type": content_type})
    print("Sending ONE paid call. The script does not retry, whatever happens.")
    try:
        with urllib.request.urlopen(req, timeout=900) as r:
            raw = r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"The API refused the call (HTTP {e.code}); a refused call is normally not charged, check "
                 "the usage page.\n" + _scrub(e.read().decode("utf-8", "replace")[:2000], key))
    except Exception as e:                                   # timeout, broken connection
        sys.exit("No answer came back. THE CALL MAY STILL HAVE BEEN CHARGED: check the usage page and tell "
                 "the owner before any second try.\n" + _scrub(repr(e), key))

    raw_path = OUT / f"carousel_low_{stamp}_response.json"
    raw_path.write_bytes(raw)                                # first of all: what was paid for is on disk
    try:
        answer = json.loads(raw)
        png = base64.b64decode(answer["data"][0]["b64_json"])
    except Exception as e:
        sys.exit(f"The answer is saved at {raw_path} but could not be read as a picture: {e!r}")
    png_path = OUT / f"carousel_low_{stamp}.png"
    png_path.write_bytes(png)
    usage = answer.get("usage") or {}
    out_tokens = usage.get("output_tokens")
    cost = None if out_tokens is None else round(out_tokens * PRICE_PER_M_OUTPUT_TOKENS / 1_000_000, 4)
    with open(OUT / "log.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps({
            "time": stamp, "package": "A carousel", "model": MODEL, "endpoint": ENDPOINT,
            "size": f"{DRAFT_W}x{DRAFT_H}", "quality": QUALITY, "references": [str(p) for p in refs],
            "usage": usage, "output_cost_usd": cost, "picture": str(png_path), "prompt": PROMPT,
        }, ensure_ascii=False) + "\n")
    print(f"Saved {png_path}")
    print(f"Usage: {usage}")
    print(f"Output tokens cost ${cost} at $30 per million; the input side (prompt and reference images) "
          "comes on top, read the real total on the usage page and tell the owner.")
    try:
        raw_path.unlink()                                    # the picture and the log hold everything
    except OSError:
        pass
    check(png_path)


def main():
    ap = argparse.ArgumentParser(description="Package A, the seamless carousel: low draft only.")
    ap.add_argument("--models", action="store_true", help="free: list the account's image models")
    ap.add_argument("--send", action="store_true", help="PAID: make the low draft")
    ap.add_argument("--owner-said-yes", action="store_true",
                    help="required with --send: the owner saw the price and answered yes, for this very call")
    ap.add_argument("--check", metavar="FILE", help="free: cut a result into slides and measure its colours")
    ap.add_argument("--band-y", type=int, default=None, help="with --check: top of the 4:1 band, in pixels")
    a = ap.parse_args()

    if a.check:
        check(a.check, a.band_y)
        return
    if a.models:
        _, image_ids = image_models(_key())
        print("Image models on this account:")
        for i in image_ids:
            print("  " + i)
        print(f"This script would use: {MODEL}")
        return
    refs = preflight()
    plan(refs)
    if not a.send:
        print("\nDRY RUN. Nothing was sent and nothing was spent.")
        print("To pay for the draft: --send --owner-said-yes, and only after the owner's explicit yes.")
        return
    if not a.owner_said_yes:
        sys.exit("\n--send needs --owner-said-yes. State the price, wait for a clear yes. Nothing was sent.")
    send(refs)


if __name__ == "__main__":
    main()
