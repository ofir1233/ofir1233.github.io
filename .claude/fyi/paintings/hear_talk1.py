# The locked talk "Prioritise, explain, decide": cheap painted sketches of its key moments, one idea: the city of calls.
# PAID with --send (low quality). Key from OPENAI_API_KEY, never printed or written. No talk text goes into any prompt.
import base64, json, sys, threading, urllib.request, urllib.error
from pathlib import Path
import descent_draft as D
HERE = Path(__file__).resolve().parent; OUT = HERE / "out_hear_talk1"; LOG = OUT / "log.jsonl"; REPO = D.REPO
REF1 = REPO / "hear-v7/media/hero-contact-center-1600.webp"; REF2 = REPO / "img/me-v7-studio-b-1920.webp"
SIZE = "1536x864"
OPENING = "It must look as if the same painter made it on the same day as the two reference images."
TECHNIQUE = ("TECHNIQUE: a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes in thousands of small, crisp, "
  "confident strokes; every stroke a distinct plane of colour with a sharp edge and a slight ridge of paint; clearly hand-painted at every scale. "
  "Not a digital illustration, not anime, not vector, no outlines, no canvas weave, no blur, no photo realism.")
COLOURS = ("COLOURS: taken from the references. Sky cobalt-azure #3b8ed3 with #2a78c6 and #6cb4ec strokes and crisp white cumulus with pale blue and lilac "
  "shadows; trees cool emerald #43765d; buildings blue glass and clean cool white facades with pale blue shadows; coral #e8604a and lilac as clear "
  "accents. FORBIDDEN: yellow, yellow-green, olive, lime, warm or golden foliage, orange roofs, beige, sunset tones, black.")
SLIDE = ("WHAT THIS IS: a mock-up of ONE presentation slide, 16:9, seen straight on, filling the frame. The slide ground is a warm off-white paper "
  "(#f4f3f1), bright and airy, and stays light. Text is drawn ONLY as dark grey bars (no letters, no words, no numbers anywhere). ")
NO = "No text, no letters, no numbers, no logos, no user interface, no screens."
IDEAS = {
  "t1-cover": SLIDE + "LAYOUT: the left 45 percent is paper with a very large heading drawn as three thick dark bars, the last one blue, and two thin grey "
    "bars under it. THE ART fills the right 55 percent and bleeds off the right and bottom edges, its left edge dissolving into the paper in loose "
    "brush strokes: Hear's glass city seen from a high terrace in bright late morning, towers and white blocks with thousands of windows; out of the "
    "windows rise thousands of tiny bright points of light, like sparks or seeds, drifting up into the cobalt sky in a slow loose stream that thins "
    "toward the top left and continues as tiny dark specks over the paper behind the heading. In the near foreground at the bottom right, painted "
    "large and soft, the edge of a terrace with white hydrangeas and lilac flowers.",
  "t2-prioritise": SLIDE + "LAYOUT: the right half is paper with a heading of three thick dark bars and a row of three short bars below. THE ART fills "
    "the left half, framed as a tall rounded window into the painting: the glass city seen straight down from very high above, its districts "
    "separated by green parks and streets into about thirteen distinct round neighbourhoods of different sizes, each a cluster of roofs; one large "
    "neighbourhood near the top right glows warm coral in sunlight while all the others lie in cool blue shade under drifting cloud shadows. "
    "Over the whole view, thousands of tiny points of light are scattered, densest over the glowing neighbourhood.",
  "t3-explain": SLIDE + "LAYOUT: the right half is paper with a heading of three thick dark bars and three short number bars. THE ART fills the left "
    "half, framed as a tall rounded window: one tall glass office tower seen close from the street with a wide-angle lens, its facade a grid of "
    "twenty-three lit windows in one horizontal row near the middle, each window glowing cool white-blue, except two windows that glow warm amber "
    "coral. Behind the glass of those two, the silhouette of a contact-centre agent with a headset at a desk. Sky and clouds above, emerald trees "
    "at the foot.",
  "t4-decide": SLIDE + "LAYOUT: the right half is paper with a heading of two thick dark bars and a small white card shape drawn with grey bars. THE "
    "ART fills the left half, framed as a tall rounded window: inside a bright modern contact centre like the first reference, seen close, one "
    "hand passes a small glowing amber card of light across a desk to another person's open hand; around them plants, coral chairs, monitors "
    "softly out of focus, the city through tall windows behind. The amber glow is the brightest thing in the picture.",
  "t5-learn": SLIDE + "LAYOUT: the right half is paper with a heading of three thick dark bars and three short bars. THE ART fills the left half, framed "
    "as a tall rounded window: the glass city at bright noon seen from a hill, a lighthouse-like slim tower in the middle distance "
    "sends one soft beam that sweeps across one district; in the swept district every fourth window is lit warm amber, the rest stay cool. "
    "Big sculpted cumulus over everything.",
  "t6-close": SLIDE + "LAYOUT: the top 40 percent is paper with a large two-line heading drawn as thick bars, the second line blue, and one thin bar "
    "under it. THE ART fills the bottom 60 percent edge to edge and fades into the paper at its top in loose brush strokes: a woman quality "
    "manager in a coral jacket stands at the glass railing of a rooftop terrace with a cup of coffee, at ease, looking out over the bright glass "
    "city; around her emerald trees, white hydrangeas, lilac flowers; behind her two colleagues talk at a small table. Natural adult proportions, "
    "a satisfied moment after the work is done.",
}
def prompt(k): return "\n\n".join([OPENING, IDEAS[k], TECHNIQUE, COLOURS, "Bright late-morning light from the left. " + NO])
lock = threading.Lock()
def log(e):
    with lock:
        OUT.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f: f.write(json.dumps(e, ensure_ascii=False) + "\n")
def send(k, key):
    fields = [("model", D.MODEL), ("prompt", prompt(k)), ("size", SIZE), ("quality", "low"), ("n", "1")]
    files = [("image[]", "reference1.webp", "image/webp", REF1.read_bytes()), ("image[]", "reference2.webp", "image/webp", REF2.read_bytes())]
    body, ctype = D._multipart(fields, files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    log({"idea": k, "status": "sent", "cost_usd": 0.0})
    try:
        with urllib.request.urlopen(req, timeout=900) as r: raw = r.read()
    except urllib.error.HTTPError as e:
        msg = D._scrub(e.read().decode("utf-8", "replace")[:400], key); log({"idea": k, "status": f"refused {e.code}", "note": msg}); print(k, "REFUSED", e.code, msg); return
    except Exception as e:
        log({"idea": k, "status": "no answer"}); print(k, "NO ANSWER", D._scrub(repr(e), key)); return
    a = json.loads(raw); (OUT / (k + ".png")).write_bytes(base64.b64decode(a["data"][0]["b64_json"]))
    o, i = D.cost_of(a.get("usage") or {}); log({"idea": k, "status": "done", "cost_usd": round(o + i, 4)}); print(k, "saved $%.4f" % (o + i))
if __name__ == "__main__":
    todo = [k for k in IDEAS if not (OUT / (k + ".png")).is_file()]
    if "--send" not in sys.argv: print("DRY", todo); sys.exit()
    for k in todo:
        import re; assert not re.search(D.BANNED_IN_MY_BLOCKS, IDEAS[k], flags=re.I), (k, re.search(D.BANNED_IN_MY_BLOCKS, IDEAS[k], flags=re.I).group(0))
    key = D._key(); ts = [threading.Thread(target=send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
