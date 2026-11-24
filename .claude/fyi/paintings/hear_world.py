# The locked talk: one custom painting per moment, each for its exact frame, in the world of the chapter 01 window.
# Draft (low) first; the final (max) repaints the approved draft as its sketch. PAID with --send draft|final --only a,b
# Key from OPENAI_API_KEY, never printed or written. No talk text in any prompt.
import base64, json, sys, random, threading, urllib.request, urllib.error
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import descent_draft as D
HERE = Path(__file__).resolve().parent; OUT = HERE / "out_hear_world"; LOG = OUT / "log.jsonl"; REPO = D.REPO
REF_CH1 = HERE / "out_hear_ch1b/final.png"; REF_RICH = REPO / "img/hw-sky-city.webp"
def sky(W, H, deep=(0x22, 0x68, 0xbb), pale=(0x9c, 0xc8, 0xee), split=.55):
    g = Image.new("RGB", (W, H)); px = g.load()
    for y in range(H):
        t = min(1, max(0, (y / H - split) * 2.4)); c = tuple(round(deep[i] + (pale[i] - deep[i]) * t) for i in range(3))
        for x in range(W): px[x, y] = c
    return g, ImageDraw.Draw(g)
def cloud(d, rnd, cx, cy, w, h):
    for _ in range(26):
        rx, ry = rnd.uniform(.15, .32) * w, rnd.uniform(.25, .45) * h
        x, y = cx + rnd.uniform(-.5, .5) * w, cy + rnd.uniform(-.3, .3) * h; d.ellipse((x - rx, y - ry, x + rx, y + ry), fill=(244, 246, 252))
def skyline(d, rnd, W, base, x0=0, x1=None, tall=(120, 260)):
    x = x0; x1 = x1 or W
    while x < x1:
        w = rnd.randint(22, 66); h = rnd.choice([rnd.randint(40, 110), rnd.randint(*tall)]) if rnd.random() < .7 else rnd.randint(30, 60)
        col = rnd.choice([(0x2f, 0x7f, 0xd0), (0x5a, 0x9e, 0xdf), (0xe8, 0xf0, 0xf7), (0x86, 0xb8, 0xe6)])
        d.rectangle((x, base - h, x + w, base + 80), fill=col); x += w + rnd.randint(2, 10)
def g_cover(W, H):      # frame 732 x 788: a terrace close to the viewer, the city below, a big sky the calls rise into
    g, d = sky(W, H); r = random.Random(3)
    cloud(d, r, 140, 60, 380, 150); cloud(d, r, W - 120, 120, 300, 130); cloud(d, r, W * .55, H * .52, 420, 110)
    hz = int(H * .66); d.rectangle((0, hz, W, H), fill=(0xbf, 0xda, 0xef)); d.rectangle((0, hz + 18, W, hz + 48), fill=(0x4f, 0x95, 0xd6))
    skyline(d, r, W, hz + 40)
    d.polygon([(0, H), (0, int(H * .8)), (W, int(H * .74)), (W, H)], fill=(0xf2, 0xf4, 0xf7))             # terrace floor and railing
    for i in range(16):
        hx, hy = r.randint(0, W), r.randint(int(H * .82), H); c = (0xb9, 0xa6, 0xe6) if i % 3 else (0xf6, 0xf6, 0xfa); d.ellipse((hx - 60, hy - 50, hx + 60, hy + 50), fill=c)
    return g
def g_tower(W, H):      # frame 720 x 848: one glass tower from the street, a band of windows across it at 48 percent height
    g, d = sky(W, H, split=.7); r = random.Random(5)
    cloud(d, r, 90, 70, 360, 140); cloud(d, r, W - 80, 160, 280, 120)
    L, R2 = int(W * .16), int(W * .86)
    d.polygon([(L, int(H * .08)), (R2, int(H * .02)), (R2 + 40, H), (L - 40, H)], fill=(0x3b, 0x86, 0xcf))
    for i in range(14):
        y = int(H * .06) + i * int(H * .066); d.line((L - 10, y + 6, R2 + 20, y), fill=(0x2a, 0x6c, 0xb5), width=4)
    band = int(H * .48); d.rectangle((L - 18, band - 18, R2 + 26, band + 18), fill=(0x8e, 0xc6, 0xf2))   # the band of windows
    d.rectangle((0, int(H * .88), W, H), fill=(0x43, 0x76, 0x5d))
    return g
def g_terrace(W, H):    # frame 720 x 848: a rooftop work terrace; the task card will float over the sky in the upper half
    g, d = sky(W, H); r = random.Random(9)
    cloud(d, r, W * .7, 80, 420, 140); cloud(d, r, 80, H * .5, 300, 110)
    hz = int(H * .62); d.rectangle((0, hz, W, H), fill=(0xbf, 0xda, 0xef)); skyline(d, r, W, hz + 30, tall=(80, 180))
    d.polygon([(0, H), (0, int(H * .76)), (W, int(H * .7)), (W, H)], fill=(0xf2, 0xf4, 0xf7))
    d.ellipse((int(W * .3), int(H * .78), int(W * .7), int(H * .92)), fill=(0xff, 0xff, 0xff))           # a round table
    d.rectangle((int(W * .42), int(H * .79), int(W * .56), int(H * .82)), fill=(0x9a, 0xa3, 0xad))       # a closed laptop
    d.ellipse((int(W * .6), int(H * .79), int(W * .64), int(H * .83)), fill=(0xe8, 0x60, 0x4a))          # a coral cup
    for i in range(8):
        hx, hy = r.randint(0, W), r.randint(int(H * .84), H); d.ellipse((hx - 50, hy - 40, hx + 50, hy + 40), fill=(0x43, 0x76, 0x5d) if i % 2 else (0xb9, 0xa6, 0xe6))
    return g
def g_far(W, H):        # frame 720 x 848: the whole city far away across the water, a wide sky above
    g, d = sky(W, H, split=.62); r = random.Random(11)
    cloud(d, r, 100, 60, 380, 140); cloud(d, r, W - 100, 100, 320, 130)
    hz = int(H * .78); d.rectangle((0, hz, W, H), fill=(0x4f, 0x95, 0xd6)); skyline(d, r, W, hz, tall=(60, 140))
    cloud(d, r, 140, hz - 40, 300, 70); cloud(d, r, W - 160, hz - 30, 320, 70)
    return g
def g_close(W, H):      # 1872 x 624, cropped to the close's wide frame: the quality manager on the rooftop, the city before her
    g, d = sky(W, H, split=.35); r = random.Random(13)
    cloud(d, r, 260, 80, 520, 150); cloud(d, r, W - 300, 70, 520, 150)
    hz = int(H * .55); skyline(d, r, W, hz + 60, tall=(120, 240))
    d.rectangle((0, int(H * .74), W, H), fill=(0xf2, 0xf4, 0xf7)); d.line((0, int(H * .72), W, int(H * .66)), fill=(0xcf, 0xe2, 0xf2), width=10)
    d.rectangle((int(W * .56), int(H * .22), int(W * .64), H), fill=(0xe8, 0x60, 0x4a))                   # the woman in coral, standing at the railing
    d.ellipse((int(W * .575), int(H * .1), int(W * .625), int(H * .26)), fill=(0x6b, 0x4a, 0x3a))
    for i in range(10):
        hx = r.randint(0, int(W * .3)); hy = r.randint(int(H * .7), H); d.ellipse((hx - 60, hy - 50, hx + 60, hy + 50), fill=(0x43, 0x76, 0x5d) if i % 2 else (0xf6, 0xf6, 0xfa))
    return g

def g_behind(W, H, seed, sea=False, park=False, bridge=False):
    """Behind a product window: the window covers the middle; the painting shows as sky round it with clouds at the corners, and
    a band of city along the bottom (where the window leaves the most room)."""
    g, d = sky(W, H, split=.5); r = random.Random(seed)
    cloud(d, r, 120, 70, 420, 150); cloud(d, r, W - 140, 90, 420, 150); cloud(d, r, 90, H * .55, 260, 110); cloud(d, r, W - 90, H * .5, 260, 110)
    hz = int(H * .8)
    if sea: d.rectangle((0, hz + 30, W, H), fill=(0x4f, 0x95, 0xd6))
    skyline(d, r, W, hz + 34, tall=(70, 150))
    if park: d.rectangle((0, hz + 70, W, H), fill=(0x43, 0x76, 0x5d))
    if bridge: d.line((0, hz + 60, W, hz + 20), fill=(0xf2, 0xf4, 0xf7), width=26)
    return g

def g_problem(W, H):    # frame 552 x 760 (problem slide, right side): the quality manager at her desk by a tall window, the sky full of lights
    g, d = sky(W, H, split=.62); r = random.Random(31)
    cloud(d, r, W * .8, 60, 300, 110)
    hz = int(H * .66); skyline(d, r, W, hz, tall=(60, 140))
    d.rectangle((0, hz + 40, W, H), fill=(0xf2, 0xf4, 0xf7))                                             # desk surface
    d.rectangle((int(W * .1), int(H * .7), int(W * .6), int(H * .8)), fill=(0x9a, 0xa3, 0xad))           # an open laptop
    d.rectangle((int(W * .62), int(H * .38), int(W * .9), H), fill=(0xe8, 0x60, 0x4a))                   # her, from behind, in coral
    d.ellipse((int(W * .68), int(H * .26), int(W * .84), int(H * .42)), fill=(0x6b, 0x4a, 0x3a))
    return g
def g_learn(W, H):      # frame 720 x 848 (chapter 04): looking up through a glass atrium roof in strong perspective, big panes, sky beyond
    g, d = sky(W, H, split=.95); r = random.Random(33)
    cloud(d, r, 200, 160, 460, 170); cloud(d, r, W - 180, 420, 420, 150)
    cx, cy = W * .5, -H * .9                      # the vanishing point far above: the ribs converge upward
    for i in range(-3, 9):
        x = i * W / 5; d.line((x, H, cx + (x - cx) * .35, 0), fill=(0xf2, 0xf6, 0xfb), width=16)
    for j, y in enumerate([H * .92, H * .66, H * .45, H * .29, H * .16, H * .06]):
        d.line((0, y, W, y), fill=(0xf2, 0xf6, 0xfb), width=max(6, 16 - j * 2))
    return g
FIXED_TECH = ("TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes in thousands of small, crisp, "
  "confident strokes; every stroke a distinct plane of colour with a sharp edge and a slight ridge of paint; clearly hand-painted at every "
  "scale. Not a digital illustration, not anime, not vector, no outlines, no canvas weave, no cracks, no stripes, no blur, no photo realism.")
FIXED_COL = ("COLOURS: exactly those of the SECOND reference image: sky cobalt-azure #3b8ed3 with #2a78c6 and #6cb4ec strokes; clouds crisp white with "
  "pale blue and lilac shadows; buildings blue glass and clean cool white facades with pale blue shadows; trees cool emerald #43765d; coral "
  "#e8604a and lilac as small accents. FORBIDDEN: yellow, yellow-green, olive, golden or warm light, orange roofs, beige, sunset tones, black.")
LAYOUT = ("The FIRST reference image is the LAYOUT of this picture, drawn roughly as coloured shapes: keep where everything is and how big it is, "
  "and repaint it as one finished painting in the same world, on the same day, as the SECOND reference image (the same city, the same sky, "
  "the same light). ")
OPEN = ("Where the layout is open sky, it stays open: a rich, luminous mid-azure in long, broad, soft-edged knife strokes that melt into each "
  "other, with no cloud and no bird in it, a deep blue against which many small points of white light could float and stay clear. ")
PLATES = {
  "cover": ("1232x1328", g_cover, LAYOUT + OPEN + "THE PICTURE: standing on a bright rooftop terrace high above the city, looking out. In the "
     "front, filling the bottom of the picture, the white terrace floor and a glass railing with big planters of hydrangeas in lilac "
     "and white. Beyond the railing, down below, the glass city and a strip of sea with small white sails; every building different. Above, "
     "a big sky: cumulus in the top corners and one long cloud bank floating across the middle-right, and above and around it open sky."),
  "tower": ("1232x1456", g_tower, LAYOUT + OPEN + "THE PICTURE: one tall glass office tower seen from the street, close, with a wide-angle lens "
     "looking up, so it rises and leans in toward the top of the picture. Its facade is a grid of glass reflecting the sky and the clouds in "
     "cobalt and azure. Across the facade, at the height shown in the layout, runs ONE horizontal band of windows, a single floor, lit a "
     "little paler and clearer than the rest, from edge to edge of the tower. At its foot cool emerald tree crowns; sky and cumulus at the "
     "top corners."),
  "terrace": ("1232x1456", g_terrace, LAYOUT + OPEN + "THE PICTURE: a rooftop work terrace above the city on a bright morning. In the front a "
     "round white table with a closed laptop, a coral cup and a notebook, two chairs, planters of emerald plants and lilac flowers; a glass "
     "railing; beyond it the glass city and its towers. Above, open sky with one big cumulus at the top right and a smaller one on the left: "
     "the upper half of the picture must stay open sky, because a card of interface will float there."),
  "far": ("1232x1456", g_far, LAYOUT + OPEN + "THE PICTURE: the whole glass city seen from far away across bright blue water, a long skyline "
     "where every building is different, towers and white blocks with countless tiny windows, small white sails on the water, cumulus "
     "resting on the horizon at both ends. Above it a very wide open sky with cumulus only in the top corners."),
  "b-lab": ("1472x1136", lambda W, H: g_behind(W, H, 21, park=True), LAYOUT + "THE PICTURE: a wide view of Hear's sky over the glass city, made to sit behind a window of interface that will cover its middle. So everything that matters is at the edges: sculpted cumulus with sunlit tops in the four corners and at both sides, and along the bottom a band of the city, every building different. Between them, a rich mid-azure sky in long, broad knife strokes. The city here: seen from a rooftop garden, tree crowns and planters in the front, glass towers and white blocks behind."),
  "b-topics": ("1536x1056", lambda W, H: g_behind(W, H, 22, sea=True), LAYOUT + "THE PICTURE: a wide view of Hear's sky over the glass city, made to sit behind a window of interface that will cover its middle. So everything that matters is at the edges: sculpted cumulus with sunlit tops in the four corners and at both sides, and along the bottom a band of the city, every building different. Between them, a rich mid-azure sky in long, broad knife strokes. The city here: seen across the water, a long waterfront with small white sails and a promenade."),
  "b-compliance": ("1536x1056", lambda W, H: g_behind(W, H, 23, park=True), LAYOUT + "THE PICTURE: a wide view of Hear's sky over the glass city, made to sit behind a window of interface that will cover its middle. So everything that matters is at the edges: sculpted cumulus with sunlit tops in the four corners and at both sides, and along the bottom a band of the city, every building different. Between them, a rich mid-azure sky in long, broad knife strokes. The city here: a leafy district by a park, white Bauhaus blocks with rounded balconies, rows of emerald trees, a few glass towers behind."),
  "b-actions": ("1536x1056", lambda W, H: g_behind(W, H, 24, bridge=True), LAYOUT + "THE PICTURE: a wide view of Hear's sky over the glass city, made to sit behind a window of interface that will cover its middle. So everything that matters is at the edges: sculpted cumulus with sunlit tops in the four corners and at both sides, and along the bottom a band of the city, every building different. Between them, a rich mid-azure sky in long, broad knife strokes. The city here: a white bridge crossing the bottom of the picture toward the towers, the river below it."),
  "problem": ("1040x1440", g_problem, LAYOUT + OPEN + "THE PICTURE: seen from behind her, a quality manager in a coral jacket sits at a white desk "
     "by a tall window high above the glass city, an open laptop in front of her. Through the window, filling the upper part of the picture, a "
     "big open sky over the city where thousands of small points of light could float. Natural adult proportions, not a caricature; a plant "
     "with lilac flowers on the desk. The open sky must take at least the top half of the picture."),
  "learn": ("1232x1456", g_learn, LAYOUT + "THE PICTURE: looking straight up through the glass roof of a tall atrium in the glass city, a few big "
     "glass panes in white frames in strong perspective, the frame ribs converging upward toward the sky; through the panes the azure sky and sculpted cumulus. Some panes "
     "catch the sun and glow paler. The grid fills the whole picture edge to edge; a few emerald leaves of a tall plant reach into the bottom corner."),
  "close": ("1872x624", g_close, LAYOUT + "THE PICTURE: a wide view of a rooftop terrace above the city. A woman quality manager in a coral jacket "
     "stands at the glass railing a little right of centre, holding a cup of coffee, seen from behind and slightly to the side, looking out "
     "over the bright glass city, at ease: the work is done. Natural adult proportions and a natural face, not a caricature. On the left, "
     "planters of hydrangeas and emerald plants. The city spreads across the whole width below a big sky with cumulus on both sides; every "
     "building different. No other people."),
}
def prompt(k, stage):
    b = ["It must look as if the same painter made it on the same day as the SECOND and THIRD reference images.", PLATES[k][2], FIXED_TECH, FIXED_COL,
         "Bright late-morning light from the left. No text, no letters, no numbers, no logos, no birds, no dots or particles."]
    if stage == "final": b.append("The LAST reference image is the approved small sketch of this very picture: keep its composition, every cloud and every building exactly, and repaint it large, richer and more precise.")
    return "\n\n".join(b)
lock = threading.Lock()
def send(k, stage, key):
    size = PLATES[k][0]; q = "low" if stage == "draft" else "max"
    refs = ([OUT / f"{k}-guide.png"] if stage == "draft" else [OUT / f"{k}-draft.png"]) + [REF_CH1, REF_RICH] + ([OUT / f"{k}-draft.png"] if stage == "final" else [])
    files = []
    for i, r in enumerate(refs, 1):
        mime = {"png": "image/png", "webp": "image/webp"}[r.suffix.lstrip(".")]; files.append(("image[]", f"reference{i}{r.suffix}", mime, r.read_bytes()))
    body, ctype = D._multipart([("model", D.MODEL), ("prompt", prompt(k, stage)), ("size", size), ("quality", q), ("n", "1")], files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    try:
        with urllib.request.urlopen(req, timeout=1500) as r: raw = r.read()
    except urllib.error.HTTPError as e:
        print(k, "REFUSED", e.code, D._scrub(e.read().decode("utf-8", "replace")[:300], key)); return
    except Exception as e:
        print(k, "NO ANSWER", D._scrub(repr(e), key)); return
    a = json.loads(raw); (OUT / f"{k}-{stage}.png").write_bytes(base64.b64decode(a["data"][0]["b64_json"]))
    o, i = D.cost_of(a.get("usage") or {}); print(k, stage, "saved $%.4f" % (o + i))
    with lock, open(LOG, "a") as f: f.write(json.dumps({"plate": k, "stage": stage, "cost_usd": round(o + i, 4)}) + "\n")
if __name__ == "__main__":
    import re
    OUT.mkdir(parents=True, exist_ok=True)
    for k, (size, gf, subj) in PLATES.items():
        m = re.search(D.BANNED_IN_MY_BLOCKS, subj, flags=re.I); assert not m, (k, m.group(0))
        W, H = map(int, size.split("x")); gf(W, H).filter(ImageFilter.GaussianBlur(1.2)).save(OUT / f"{k}-guide.png")
    if "--send" not in sys.argv: print("guides written"); sys.exit()
    stage = sys.argv[sys.argv.index("--send") + 1]; only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else list(PLATES)
    key = D._key(); ts = [threading.Thread(target=send, args=(k, stage, key)) for k in only]; [t.start() for t in ts]; [t.join() for t in ts]
