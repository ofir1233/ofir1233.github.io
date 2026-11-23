# Hear's world for the "One screen" block on the home page: two custom plates, each a low draft first and a max final after the owner sees the draft.
#   sky       the far plane: painted sky with its clouds (the front cloud is cut from this plate later)
#   elements  the city with trees, the wisteria branch and the flowers, each alone on a flat ground, to be cut out
# PAID with --send draft|final. The key is read from OPENAI_API_KEY and is never printed or written.
import base64, json, sys, time, threading, urllib.request, urllib.error
from pathlib import Path
from PIL import Image, ImageFilter
import descent_draft as D
HERE = Path(__file__).resolve().parent; OUT = HERE / "out_hear_topics2"; LOG = OUT / "log.jsonl"; REPO = D.REPO
ART = REPO / ".claude/review/proto/topics/art"
STYLE1 = REPO / "hear-v7/media/hero-contact-center-1600.webp"; STYLE2 = REPO / "img/me-v7-studio-b-1920.webp"
SIZES = {"draft": {"sky": "1536x1024", "elements": "1536x1024"}, "final": {"sky": "2048x1360", "elements": "1600x1072"}}
QUALITY = {"draft": "low", "final": "max"}

def guides():
    """Composition is given as a picture, never as words: layout sheets built from the placeholder cut-outs."""
    OUT.mkdir(parents=True, exist_ok=True)
    W, H = 1536, 1024
    sky = Image.new("RGB", (W, H)); px = sky.load()
    top, bot = (0x2a, 0x78, 0xc6), (0x6c, 0xb4, 0xec)
    for y in range(H):
        t = y / (H - 1); c = tuple(round(top[i] + (bot[i] - top[i]) * t) for i in range(3))
        for x in range(W): px[x, y] = c
    def put(canvas, name, box, flip=False):
        im = Image.open(ART / name).convert("RGBA")
        if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        x, y, w = box; h = round(im.height * w / im.width); im = im.resize((w, h), Image.LANCZOS); canvas.paste(im, (x, y), im)
    put(sky, "ph-cloud-top.webp", (560, 40, 560)); put(sky, "ph-cloud-left.webp", (40, 300, 330)); put(sky, "ph-cloud-front.webp", (1010, 760, 500))
    put(sky, "ph-cloud-left.webp", (1240, 380, 280), flip=True); put(sky, "ph-cloud-top.webp", (30, 30, 380), flip=True)
    sky.save(OUT / "guide-sky.png")
    el = Image.new("RGB", (W, H), (0xec, 0xec, 0xe8))
    put(el, "ph-city.webp", (50, 150, 560)); put(el, "ph-wisteria.webp", (640, 20, 860)); put(el, "ph-flowers.webp", (860, 540, 420))
    el.save(OUT / "guide-elements.png")

OPENING = "It must look as if the same painter made it on the same day as the SECOND and THIRD reference images."
TECHNIQUE = ("TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes in thousands of small, "
    "crisp, confident strokes; every stroke a distinct plane of colour with a sharp edge and a slight ridge of paint; clearly "
    "hand-painted at every scale. Not a digital illustration, not anime, not pixel art, not vector, not a print: no flat fills, no "
    "outlines, no dithering, no fine hatching, no canvas weave, no cracks, no stripes, no blur, no photo realism.")
COLOURS = ("COLOURS: taken from the windows and the flowers of the SECOND and THIRD reference images and from nowhere else. Sky: "
    "cobalt-azure blue, about #3b8ed3, with darker #2a78c6 and lighter #6cb4ec strokes; rich but natural, not electric, not neon, "
    "not ultramarine. Clouds: crisp white with pale blue and lilac shadows. Leaves and trees: COOL emerald green only, "
    "about #43765d, with darker #2c5a48 and lighter #6aa98a: a true emerald, clearly green, not teal, not turquoise, not blue-green. Buildings: blue glass towers (cobalt, azure and pale sky-blue "
    "reflections) and clean cool white facades with pale blue shadows. Flowers: lilac (#b9a6e6), white and a little magenta-pink. "
    "FORBIDDEN everywhere: yellow, yellow-green, olive, lime, golden or warm foliage, orange, terracotta, beige, brown, sunset tones, black.")
SUBJECT = {
  "sky": ("The FIRST reference image is the LAYOUT of this picture, a rough sheet: keep every cloud where it is and about the size it "
    "is, and keep the blue between them where it is; repaint all of it as a finished painting. THE PICTURE IS ONLY SKY, edge to edge. "
    "The blue is built from broad visible knife strokes laid in different directions, in several blues, deeper toward the top and "
    "lighter toward the bottom. The clouds are thick sculpted white cumulus with pale blue and lilac shadows and bright sunlit "
    "tops: a long bank across the upper middle, a smaller one at the upper left, one at the left edge, one at the right edge, and "
    "one low at the lower right whose whole outline stands clear against plain blue. Each cloud is a separate island with blue "
    "all round it. Nothing else in the picture: no buildings, no trees, no plants, no birds, no horizon, no sea, no ground, no frame."),
  "elements": ("The FIRST reference image is the LAYOUT of this picture, a rough sheet with three separate things on one flat ground: "
    "keep each thing where it is and the size it is, apart from the others and clear of the edges (the hanging branch alone "
    "touches the top edge), and repaint each as a finished painting. (1) On the left, a tall cluster of the city: blue glass "
    "towers with window grids and sky reflections, two white apartment blocks with rounded balconies and roof terraces, rising "
    "out of big rounded cool-emerald tree crowns that close the cluster at its foot and at its sides. The towers, the blocks and "
    "the tree crowns stand DIRECTLY against the plain grey ground: no sky, no clouds and no blue patch behind them or between "
    "them; the grey ground shows between the towers and above every roof, and the outline of the cluster is the outline of the "
    "buildings and trees themselves. (2) Across the upper right, "
    "one branch of wisteria on a short piece of white-painted wooden pergola beam: cool-emerald leaves and many long hanging "
    "clusters of lilac and white blossom, some long, some short. (3) Below it, a generous mound of hydrangea flower heads in "
    "lilac, white and a little magenta-pink among broad cool-emerald leaves. THE GROUND everywhere else is one even, plain light "
    "grey (#ecece8) with no texture: a clean hard painted edge round each thing, no glow, no halo, no mist, no cast shadow on "
    "the ground, nothing else on it."),
}
CLOSING = "Bright late-morning light from the left, strong light and shadow planes. No text, no letters, no logos, no people."
def prompt(k, stage):
    b = [OPENING, SUBJECT[k], TECHNIQUE, COLOURS, CLOSING]
    if stage == "final": b.append("The LAST reference image is the small sketch of this very picture: keep its composition and colours exactly and repaint it large.")
    return "\n\n".join(b)
lock = threading.Lock()
def log(e):
    with lock:
        OUT.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f: f.write(json.dumps(e, ensure_ascii=False) + "\n")
def send(k, stage, key):
    refs = [OUT / f"guide-{k}.png", STYLE1, STYLE2] + ([OUT / f"{k}_draft.png"] if stage == "final" else [])
    fields = [("model", D.MODEL), ("prompt", prompt(k, stage)), ("size", SIZES[stage][k]), ("quality", QUALITY[stage]), ("n", "1")]
    files = []
    for i, r in enumerate(refs, 1):
        mime = {"png": "image/png", "webp": "image/webp", "jpg": "image/jpeg"}[r.suffix.lstrip(".")]
        files.append(("image[]", f"reference{i}{r.suffix}", mime, r.read_bytes()))
    body, ctype = D._multipart(fields, files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    log({"plate": k, "stage": stage, "status": "sent", "cost_usd": 0.0})
    try:
        with urllib.request.urlopen(req, timeout=1200) as r: raw = r.read()
    except urllib.error.HTTPError as e:
        msg = D._scrub(e.read().decode("utf-8", "replace")[:500], key); log({"plate": k, "stage": stage, "status": f"refused HTTP {e.code}", "cost_usd": 0.0, "note": msg}); print(k, stage, "REFUSED", e.code, msg); return
    except Exception as e:
        log({"plate": k, "stage": stage, "status": "no answer, may be charged", "cost_usd": 0.0}); print(k, stage, "NO ANSWER", D._scrub(repr(e), key)); return
    a = json.loads(raw); out = OUT / f"{k}_{stage}.png"; out.write_bytes(base64.b64decode(a["data"][0]["b64_json"]))
    o, i = D.cost_of(a.get("usage") or {}); log({"plate": k, "stage": stage, "status": "done", "cost_usd": round(o + i, 4), "usage": a.get("usage"), "prompt": prompt(k, stage)})
    print(k, stage, "saved, cost $%.4f" % (o + i))
if __name__ == "__main__":
    guides()
    if "--send" not in sys.argv: print("guides written; DRY RUN"); sys.exit()
    stage = sys.argv[sys.argv.index("--send") + 1]; only = sys.argv[sys.argv.index("--only") + 1].split(",") if "--only" in sys.argv else list(SUBJECT)
    todo = [k for k in only if not (OUT / f"{k}_{stage}.png").is_file()]
    print(stage, todo)
    key = D._key(); ts = [threading.Thread(target=send, args=(k, stage, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
