# Three STYLE directions for the FYI page, as cheap drafts (low quality). PAID when run with --send.
# The key is read from OPENAI_API_KEY and is never printed or written.
import base64, json, sys, time, threading, urllib.request, urllib.error
from pathlib import Path
import descent_draft as D
OUT = Path(__file__).resolve().parent / "out_fyi_styles"; LOG = OUT / "log.jsonl"
URL = "https://api.openai.com/v1/images/generations"; MODEL = D.MODEL; SIZE = "1536x1024"; CEILING = 0.30

SCENE = (
    "THE SCENE, the same in every version: a shared creative studio in daylight, one week before a launch night. Four "
    "artists who work together, ordinary good-looking adults with natural proportions, each busy with their own part: "
    "a woman musician at a small synthesizer with headphones round her neck; a man at a monitor that shows an abstract "
    "music visualizer of copper-coloured arcs; a woman designer pinning three alternative record covers to a wall; and "
    "a man by the tall window, mid-conversation, holding a phone in his hand. In front, large and cut by the bottom "
    "edge, a work table: a second phone lying face up with a dark glass screen, a coffee cup, a roll of tape, printed "
    "proofs of a concert poster, cables. The room is alive and a little messy: instruments, plants, a bicycle, sheets "
    "taped to the walls. A wide picture with depth: the table in front, the four people in the middle, the window and "
    "the city roofs behind. No writing anywhere: no letters, no numbers, no logos, on the posters, the covers or the "
    "phone screens; phone screens are dark glass."
)
STYLES = {
    "s1-print": ("PRINT, like a gig poster", "THE LOOK: a risograph / screen print in three inks on warm off-white paper: a strong cobalt blue (#0B67F8), a "
        "copper orange (#C97A3D) and a deep ink navy; where blue and copper overprint they make a dark brown. Bold, flat, "
        "confident shapes with clean cut edges, visible halftone dots in the mid-tones, a fine paper grain, and a slight "
        "misregistration between the inks. Large areas of the paper are left unprinted, so the picture sits lightly on a "
        "pale page. Drawn like a modern editorial illustration: simplified but natural people, no outlines, no gradients, "
        "no photo realism."),
    "s2-photo": ("PHOTOGRAPH, editorial", "THE LOOK: a real photograph, the kind a culture magazine runs with a story about a band: shot on 35 mm film with a "
        "50 mm lens at eye height, soft late-morning window light from the left, shallow depth of field with the table in "
        "front slightly out of focus, natural skin, gentle film grain. A bright, airy room with white walls and pale wood, "
        "so the picture is light overall; the colour accents are copper (a lamp, a jacket, the arcs on the monitor), "
        "cobalt blue (a chair, a sweater) and a little teal. Candid, unposed: nobody looks at the camera."),
    "s3-collage": ("COLLAGE, cut paper", "THE LOOK: a hand-made collage photographed from straight on: the people and objects are cut out of matte coloured "
        "paper and of black-and-white photo prints with scissors, layered with small cast shadows between the layers, "
        "fixed with strips of translucent tape and a few pins, on a pale warm grey board. Paper colours: cobalt blue "
        "(#0B67F8), copper orange (#C97A3D), lilac (#C8B6FF), teal (#34D1BF), cream and charcoal. Torn edges beside clean "
        "cut edges, a few pencil construction lines, a strip of a printed sound wave. Tactile and deliberate, with plenty "
        "of the pale board left clear."),
}
lock = threading.Lock()
def log(e):
    with lock:
        OUT.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f: f.write(json.dumps(e, ensure_ascii=False) + "\n")
def send(k, key):
    title, look = STYLES[k]; prompt = look + "\n\n" + SCENE
    body = json.dumps({"model": MODEL, "prompt": prompt, "size": SIZE, "quality": "low", "n": 1}).encode()
    req = urllib.request.Request(URL, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
    log({"style": k, "status": "sent", "cost_usd": 0.0})
    try:
        with urllib.request.urlopen(req, timeout=600) as r: ans = json.loads(r.read())
    except urllib.error.HTTPError as e:
        msg = D._scrub(e.read().decode("utf-8", "replace")[:500], key); log({"style": k, "status": "refused %d" % e.code, "cost_usd": 0.0, "note": msg}); print(k, "REFUSED", e.code, msg); return
    except Exception as e:
        log({"style": k, "status": "no answer", "cost_usd": 0.05}); print(k, "NO ANSWER", D._scrub(repr(e), key)); return
    png = OUT / (k + ".png"); png.write_bytes(base64.b64decode(ans["data"][0]["b64_json"]))
    o, i = D.cost_of(ans.get("usage") or {}); log({"style": k, "status": "done", "cost_usd": round(o + i, 4), "usage": ans.get("usage"), "prompt": prompt, "picture": str(png)})
    print(k, "saved", png.name, "cost $%.4f" % (o + i))
if __name__ == "__main__":
    todo = [k for k in STYLES if not (OUT / (k + ".png")).is_file()]
    spent = sum(json.loads(l).get("cost_usd", 0) for l in LOG.read_text().splitlines()) if LOG.is_file() else 0
    print("styles", todo, "spent $%.3f" % spent, "expected about $%.2f" % (0.03 * len(todo)), "ceiling $%.2f" % CEILING)
    if "--send" not in sys.argv: print("DRY RUN. Nothing was sent."); sys.exit()
    if spent + 0.03 * len(todo) > CEILING: sys.exit("Over the ceiling. Nothing was sent.")
    key = D._key(); ts = [threading.Thread(target=send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
