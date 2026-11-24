# Chapter 01, the framed window into Hear's sky where the calls float. Custom painting for this exact frame (736 x 888 canvas px).
# The 13 spheres of calls fill a disc centred at frame (368, 404), radius 315: that disc is open sky. City along the bottom 14%.
# PAID with --send draft|final. Key from OPENAI_API_KEY, never printed or written. No talk text in any prompt.
import base64, json, sys, random, urllib.request, urllib.error
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import descent_draft as D
HERE = Path(__file__).resolve().parent; OUT = HERE / "out_hear_ch1b"; LOG = OUT / "log.jsonl"; REPO = D.REPO
REF_RICH = REPO / "img/hw-sky-city.webp"; REF_PAL = REPO / "hear-v7/media/hero-contact-center-1600.webp"
SIZES = {"draft": ("1232x1488", "low"), "final": ("1232x1488", "max")}
def guide():
    """Hand-drawn composition only (shapes, no stamped art): sky, the open disc, clouds at the corners, a varied skyline, a terrace corner."""
    OUT.mkdir(parents=True, exist_ok=True); W, H = 1232, 1488; k = W / 736
    g = Image.new("RGB", (W, H)); px = g.load()
    cx, cy, R = 368 * k, 404 * k, 315 * k
    for y in range(H):
        t = y / H
        for x in range(W):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** .5 / R
            deep, mid, pale = (0x22, 0x68, 0xbb), (0x34, 0x86, 0xd0), (0xa8, 0xd0, 0xf0)
            base = tuple(deep[i] + (pale[i] - deep[i]) * min(1, max(0, (t - .55) * 3)) for i in range(3))
            w = max(0, min(1, 1.15 - d))
            px[x, y] = tuple(round(base[i] * (1 - w) + mid[i] * w) for i in range(3))
    d = ImageDraw.Draw(g); rnd = random.Random(7)
    def cloud(cx, cy, w, h):
        for _ in range(26):
            rx, ry = rnd.uniform(.15, .32) * w, rnd.uniform(.25, .45) * h
            x, y = cx + rnd.uniform(-.5, .5) * w, cy + rnd.uniform(-.3, .3) * h
            d.ellipse((x - rx, y - ry, x + rx, y + ry), fill=(244, 246, 252))
    cloud(120, 40, 420, 150); cloud(1150, 70, 300, 130)
    hz = int(H * .86)
    cloud(220, hz - 30, 420, 120); cloud(1000, hz - 20, 380, 110)
    d.rectangle((0, hz, W, H), fill=(0xbf, 0xda, 0xef))
    d.rectangle((0, hz + 26, W, hz + 60), fill=(0x4f, 0x95, 0xd6))           # a strip of sea
    x = 0
    while x < W:                                                              # a varied skyline: every block different
        w = rnd.randint(26, 74); h = rnd.choice([rnd.randint(40, 110), rnd.randint(120, 260)]) if rnd.random() < .7 else rnd.randint(30, 60)
        col = rnd.choice([(0x2f, 0x7f, 0xd0), (0x5a, 0x9e, 0xdf), (0xe8, 0xf0, 0xf7), (0x86, 0xb8, 0xe6)])
        d.rectangle((x, hz + 60 - h, x + w, hz + 140), fill=col); x += w + rnd.randint(2, 10)
    for i in range(18):                                                       # tree crowns along the foot
        tx = rnd.randint(0, W); d.ellipse((tx - 40, hz + 110, tx + 40, hz + 170), fill=(0x43, 0x76, 0x5d))
    d.polygon([(W - 330, H), (W - 250, hz + 70), (W, hz + 40), (W, H)], fill=(0xf2, 0xf4, 0xf7))   # a terrace corner, bottom right
    for i in range(7):
        hx, hy = W - 260 + i * 38, H - 70 + (i % 2) * 22; d.ellipse((hx - 34, hy - 30, hx + 34, hy + 30), fill=(0xb9, 0xa6, 0xe6) if i % 3 else (0xf6, 0xf6, 0xfa))
    g = g.filter(ImageFilter.GaussianBlur(1.2)); g.save(OUT / "guide.png"); return OUT / "guide.png"
SUBJECT = ("The FIRST reference image is this very picture as an approved small sketch: keep where everything is and how big it is, every cloud "
  "and every building, and repaint it as one finished painting, richer and more precise. Above all keep the large round area of open sky in the upper and middle part of the picture "
  "exactly where it is: a rich, luminous mid-azure built from long, broad, soft-edged knife strokes that melt into each other, with no cloud "
  "and no bird inside it, a deep blue against which many small points of white light could float and stay clear. Thick sculpted cumulus "
  "with sunlit tops and pale blue and lilac shadows only where the layout has them: in the two top corners, and resting on the horizon "
  "behind the city on both sides. ALONG THE BOTTOM, the city, painted with as much care and life as the city in the SECOND reference "
  "image: a long skyline where EVERY building is different, glass towers of different heights and widths reflecting the sky in cobalt and "
  "azure, white Bauhaus apartment blocks with rounded balconies and roof terraces, a few slim landmark towers, window grids, a thin strip "
  "of sea with small white sails and foam, a promenade with rounded emerald tree crowns. In the bottom right corner, close to the viewer, "
  "the white corner of a rooftop terrace with a glass railing and a planter of hydrangeas in lilac and white.")
PROMPT = "\n\n".join([
  "It must look as if the same painter made it on the same day as the SECOND and THIRD reference images.", SUBJECT,
  "TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes in thousands of small, crisp, "
  "confident strokes; every stroke a distinct plane of colour with a sharp edge and a slight ridge of paint; clearly hand-painted at every "
  "scale. Not a digital illustration, not anime, not vector, no outlines, no canvas weave, no cracks, no stripes, no blur, no photo realism.",
  "COLOURS: sky cobalt-azure #3b8ed3 with #2a78c6 and #6cb4ec strokes; clouds crisp white with pale blue and lilac shadows; buildings blue "
  "glass and clean cool white facades with pale blue shadows; trees cool emerald #43765d; coral #e8604a only as tiny accents (an awning, a "
  "sail). FORBIDDEN: yellow, yellow-green, olive, golden or warm light, orange roofs, beige, sunset tones, black.",
  "Bright late-morning light from the left. No text, no letters, no numbers, no logos, no people, no birds, no dots or particles."])
def send(stage, key):
    size, q = SIZES[stage]
    refs = ([OUT / "draft-v1.png"] if stage == "final" else [OUT / "guide.png"]) + [REF_RICH, REF_PAL] + ([OUT / "draft-v1.png"] if stage == "final" else [])
    prompt = PROMPT + ("\n\nThe LAST reference image is the small sketch of this very picture: keep its composition and colours exactly and repaint it large." if stage == "final" else "")
    files = []
    for i, r in enumerate(refs, 1):
        mime = {"png": "image/png", "webp": "image/webp"}[r.suffix.lstrip(".")]; files.append(("image[]", f"reference{i}{r.suffix}", mime, r.read_bytes()))
    body, ctype = D._multipart([("model", D.MODEL), ("prompt", prompt), ("size", size), ("quality", q), ("n", "1")], files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    try:
        with urllib.request.urlopen(req, timeout=1500) as r: raw = r.read()
    except urllib.error.HTTPError as e:
        print("REFUSED", e.code, D._scrub(e.read().decode("utf-8", "replace")[:300], key)); return
    a = json.loads(raw); (OUT / f"{stage}.png").write_bytes(base64.b64decode(a["data"][0]["b64_json"]))
    o, i = D.cost_of(a.get("usage") or {}); print(stage, "saved $%.4f" % (o + i))
    with open(LOG, "a") as f: f.write(json.dumps({"stage": stage, "cost_usd": round(o + i, 4)}) + "\n")
if __name__ == "__main__":
    import re; m = re.search(D.BANNED_IN_MY_BLOCKS, SUBJECT, flags=re.I); assert not m, m.group(0)
    guide()
    if "--send" in sys.argv: send(sys.argv[sys.argv.index("--send") + 1], D._key())
