# Chapter 01 of the locked talk: the painted atmosphere behind the three.js particles. Low draft first, max after a look.
# PAID with --send draft|final. Key from OPENAI_API_KEY, never printed or written. No talk text in any prompt.
import base64, json, sys, threading, urllib.request, urllib.error
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import descent_draft as D
HERE = Path(__file__).resolve().parent; OUT = HERE / "out_hear_ch1"; LOG = OUT / "log.jsonl"; REPO = D.REPO
ART = REPO / ".claude/review/proto/topics/art"
REF_A = REPO / "hear-v7/media/hero-contact-center-1600.webp"; REF_B = REPO / "img/me-v7-studio-b-1920.webp"
SIZES = {"draft": ("1200x1104", "low"), "final": ("1600x1472", "max")}
def guide():
    """The visible box of the slide's painting (1180 x 1080 canvas px), scaled to 1200 x 1104. The calls' 13 spheres fill a disc
    centred at (440, 548), radius 340: that disc must be open, rich mid-azure sky, with nothing white in it."""
    OUT.mkdir(parents=True, exist_ok=True); W, H = 1200, 1104; k = W / 1180
    g = Image.new("RGB", (W, H)); px = g.load()
    cx, cy, R = 440 * k, 548 * k, 340 * k
    for y in range(H):
        for x in range(W):
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** .5 / R
            t = y / H
            deep, mid, pale = (0x24, 0x6c, 0xbe), (0x3b, 0x8e, 0xd3), (0x9c, 0xc8, 0xee)
            base = tuple(deep[i] + (pale[i] - deep[i]) * min(1, max(0, (t - .1) * 1.1)) for i in range(3))
            w = max(0, min(1, 1.25 - d))          # inside the disc: rich mid azure
            px[x, y] = tuple(round(base[i] * (1 - w) + mid[i] * w) for i in range(3))
    def put(name, x, y, w, flip=False):
        im = Image.open(ART / name).convert("RGBA")
        if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        h = round(im.height * w / im.width); im = im.resize((w, h), Image.LANCZOS); g.paste(im, (x, y), im)
    put("cloud-back.webp", -90, -70, 640); put("cloud-back.webp", 820, -40, 420, True)
    hz = H - 96
    d = ImageDraw.Draw(g); d.rectangle((0, hz, W, H), fill=(0xd0, 0xe3, 0xf3))
    put("cloud-front.webp", -40, hz - 130, 520); put("cloud-front.webp", 760, hz - 120, 480, True)
    city = Image.open(ART / "city.webp").convert("RGBA")
    for i, x in enumerate(range(-50, W + 50, 150)):
        cw = 230; c = city.resize((cw, round(city.height * (0.30 + 0.07 * (i % 3)) * cw / city.width))); g.paste(c, (x, hz - c.height + 16), c)
    g.save(OUT / "guide.png"); return OUT / "guide.png"
PROMPT = "\n\n".join([
  "It must look as if the same painter made it on the same day as the SECOND and THIRD reference images.",
  "The FIRST reference image is the LAYOUT of this picture, a rough sheet: keep every cloud where it is and about the size it is, keep the "
  "band of distant city along the bottom where it is, standing on a hazy pale horizon that runs across the whole width, and keep the large round "
  "area of rich mid-azure sky in the middle of the picture exactly where it is, with no cloud inside it; repaint all of it as one finished painting. THE PICTURE: a wide view of Hear's sky over the glass city on a bright late morning. "
  "The sky is built from broad visible knife strokes in several blues, deep cobalt in the top left corner, turning pale and luminous, "
  "almost white-blue, toward the horizon and across the open middle. Thick sculpted cumulus with sunlit tops and pale blue and lilac "
  "shadows: a bank across the top, a second one at the top right, and two masses resting on the horizon behind the city, one on each side. Along the bottom, far away and small, the glass city: blue glass towers and white blocks with tiny windows, tree crowns, "
  "softened by distance and light haze. The middle of the picture is open sky in a rich, even mid-azure, painted in long, broad, soft-edged "
  "knife strokes that melt into each other, a deep luminous blue against which many small points of white light could float and stay clear.",
  "TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes in thousands of small, crisp, "
  "confident strokes; every stroke a distinct plane of colour with a sharp edge and a slight ridge of paint; clearly hand-painted at every "
  "scale. Not a digital illustration, not anime, not vector, no outlines, no canvas weave, no cracks, no stripes, no blur, no photo realism.",
  "COLOURS: sky cobalt-azure #3b8ed3 with #2a78c6 and #6cb4ec strokes, pale toward #dcebf8; clouds crisp white with pale blue and lilac "
  "shadows; city blue glass and cool white; trees cool emerald #43765d. FORBIDDEN: yellow, yellow-green, olive, golden or warm light, "
  "orange, beige, sunset tones, black.",
  "Bright light from the left. No text, no letters, no numbers, no logos, no people, no birds, no dots or particles."])
def send(stage, key):
    size, q = SIZES[stage]
    refs = [OUT / "guide.png", REF_A, REF_B] + ([OUT / "draft.png"] if stage == "final" else [])
    prompt = PROMPT + ("\n\nThe LAST reference image is the small sketch of this very picture: keep its composition and colours exactly and repaint it large." if stage == "final" else "")
    files = []
    for i, r in enumerate(refs, 1):
        mime = {"png": "image/png", "webp": "image/webp"}[r.suffix.lstrip(".")]; files.append(("image[]", f"reference{i}{r.suffix}", mime, r.read_bytes()))
    body, ctype = D._multipart([("model", D.MODEL), ("prompt", prompt), ("size", size), ("quality", q), ("n", "1")], files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    try:
        with urllib.request.urlopen(req, timeout=1200) as r: raw = r.read()
    except urllib.error.HTTPError as e:
        print("REFUSED", e.code, D._scrub(e.read().decode("utf-8", "replace")[:300], key)); return
    a = json.loads(raw); (OUT / f"{stage}.png").write_bytes(base64.b64decode(a["data"][0]["b64_json"]))
    o, i = D.cost_of(a.get("usage") or {}); print(stage, "saved $%.4f" % (o + i))
    with open(LOG, "a") as f: f.write(json.dumps({"stage": stage, "cost_usd": round(o + i, 4)}) + "\n")
if __name__ == "__main__":
    import re; mine = PROMPT.split('\n\n')[1]; assert not re.search(D.BANNED_IN_MY_BLOCKS, mine, flags=re.I), re.search(D.BANNED_IN_MY_BLOCKS, mine, flags=re.I).group(0)
    guide()
    if "--send" in sys.argv: send(sys.argv[sys.argv.index("--send") + 1], D._key())
