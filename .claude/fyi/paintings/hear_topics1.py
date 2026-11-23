# Hear, home page: inspiration sketches for the "One screen" block (pencil, wireframe, finished, Hear's world). PAID with --send (low quality).
# The key is read from OPENAI_API_KEY and is never printed or written.
import base64, json, sys, time, threading, urllib.request, urllib.error
from pathlib import Path
import descent_draft as D
HERE = Path(__file__).resolve().parent; OUT = HERE / "out_hear_topics1"; LOG = OUT / "log.jsonl"
REPO = D.REPO; SIZE = "1536x1024"; QUALITY = "low"
STYLE_REF = REPO / "hear-v7/media/hero-contact-center-1600.jpg"
SCREEN_REF = HERE.parent / "topics-hi.png"
PAGE = (
    "WHAT THIS IS: a design mock-up of one wide section of a portfolio website, seen straight on, filling the whole frame. The page "
    "ground is a warm off-white, bright and airy; the page stays light everywhere. In the top left corner there is a heading drawn "
    "as two thick dark bars and, under it, two thin grey bars for text (no readable words anywhere on the page). The rest holds the "
    "art described below, large."
)
WORLD = (
    "THE PAINTED WORLD: everything that is painted belongs to the world of the FIRST reference image and must look as if the same "
    "painter made it: oil paint laid in broad, loose, confident strokes with wide brushes and a palette knife; a light azure sky "
    "with soft-edged white clouds; a pale glass city; green plants and hanging lilac flowers; bright late-morning light and soft "
    "shadows. Calm, generous, optimistic. No people in this picture."
)
SCREEN = (
    "THE PRODUCT SCREEN: the SECOND reference image is the real screen and must stay recognisable wherever the finished screen "
    "appears: a narrow menu column on the left, a title, a row of four big numbers, a treemap of blue rectangles of different sizes "
    "with large numbers in them (one rectangle much darker than the others), and on the right a list of rows with small bar "
    "charts. It is clean, precise interface design, not painted: crisp edges, white panels, blue accents."
)
NO = "NOT IN THE PICTURE: people, hands, faces, logos, browser chrome, stickers, neon, cartoon shapes, readable sentences."
def P(art): return "\n\n".join([PAGE, WORLD, SCREEN, art, NO])
IDEAS = {
    "k1-one-sheet": P(
        "THE ART: ONE large sheet that is three things at once, changing from left to right. Its left third is a sheet of drawing "
        "paper with the screen drawn in graphite pencil: slightly wobbly boxes, scribbled zigzag lines for text, a few handwritten "
        "numbers, visible pencil pressure, and a real yellow pencil lying across its lower corner with a few eraser crumbs. Its "
        "middle third is the same layout as a flat gray wireframe: plain gray boxes, no colour. Its right third is the finished "
        "screen from the SECOND reference, in full colour, with rounded corners and a soft shadow, glowing a little. The changes "
        "between the thirds are soft and uneven, as if one were growing out of the other. Behind the right part, beyond the page, "
        "the painted sky and two soft clouds rise, and a little blue light from the screen falls on the page."),
    "k2-window-in-the-sky": P(
        "THE ART: the finished screen from the SECOND reference as one clean app window with rounded corners, large, floating "
        "calmly. Around and behind it the off-white page opens into the painted azure sky: large soft white clouds behind the "
        "window, and one small cloud drifting IN FRONT of its lower right corner, so the window clearly sits inside the sky with "
        "depth. Sunlight catches the top edge of the window; a soft blue glow from it falls onto the page. Toward the left and the "
        "bottom the sky fades back into the plain off-white page. A small arrow cursor rests on the darkest rectangle of the treemap."),
    "k3-city-from-above": P(
        "THE ART: the finished screen from the SECOND reference floats as a clean app window in the upper part. Below and behind it, "
        "seen from high above at an angle, lies the painted city: and the city repeats the treemap. Each city block matches one "
        "rectangle of the treemap in size and in its shade of blue (roofs and glass in that blue), laid out in the same "
        "arrangement, with thin streets between them where the gaps between rectangles are. Fine light lines drop from three of "
        "the rectangles to their blocks. All the city is in sunshine except the block of the darkest rectangle, which lies under "
        "the soft shadow of a single cloud. The city fades into the off-white page at the edges."),
    "k4-desk": P(
        "THE ART: a designer's pale wooden desk by a tall window, painted in the world of the FIRST reference, seen from a little "
        "above. On the desk, from left to right, the same screen three times: a sheet of paper with the screen drawn in graphite "
        "pencil (wobbly boxes, scribbles, handwritten numbers) with a pencil and an eraser beside it; a sheet of tracing paper "
        "with the flat gray wireframe, one corner lifted; and a thin glass tablet standing on a small stand that shows the "
        "finished screen from the SECOND reference, crisp and bright. Around them a ruler, a cup, a plant with lilac flowers. "
        "Through the window the azure sky, soft clouds and the pale glass city. The desk and window fade into the off-white page "
        "at the left and at the bottom."),
    "k5-page-turning": P(
        "THE ART: one large sheet of drawing paper with the screen drawn in graphite pencil (wobbly boxes, scribbled lines, a few "
        "handwritten numbers). Its right half is lifting and curling away like a page being turned, with a real paper curl and its "
        "shadow, and underneath it is the finished screen from the SECOND reference, crisp, in full colour, exactly where the "
        "drawing was, so the pencil lines continue into the real interface along the curl. From under the lifted page the painted "
        "azure sky and soft white clouds spill out behind the screen and drift up beyond the page. A yellow pencil rests on the "
        "flat left half."),
}
lock = threading.Lock()
def log(e):
    with lock:
        OUT.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f: f.write(json.dumps(e, ensure_ascii=False) + "\n")
def send(k, key):
    fields = [("model", D.MODEL), ("prompt", IDEAS[k]), ("size", SIZE), ("quality", QUALITY), ("n", "1")]
    files = [("image[]", "reference1.jpg", "image/jpeg", STYLE_REF.read_bytes()), ("image[]", "reference2.png", "image/png", SCREEN_REF.read_bytes())]
    body, ctype = D._multipart(fields, files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    log({"idea": k, "status": "sent", "cost_usd": 0.0})
    try:
        with urllib.request.urlopen(req, timeout=900) as r: raw = r.read()
    except urllib.error.HTTPError as e:
        msg = D._scrub(e.read().decode("utf-8", "replace")[:500], key); log({"idea": k, "status": f"refused HTTP {e.code}", "cost_usd": 0.0, "note": msg}); print(k, "REFUSED", e.code, msg); return
    except Exception as e:
        log({"idea": k, "status": "no answer, may be charged", "cost_usd": 0.06}); print(k, "NO ANSWER", D._scrub(repr(e), key)); return
    a = json.loads(raw); (OUT / (k + ".png")).write_bytes(base64.b64decode(a["data"][0]["b64_json"]))
    o, i = D.cost_of(a.get("usage") or {}); log({"idea": k, "status": "done", "cost_usd": round(o + i, 4), "usage": a.get("usage")}); print(k, "saved, cost $%.4f" % (o + i))
if __name__ == "__main__":
    todo = [k for k in IDEAS if not (OUT / (k + ".png")).is_file()]
    print("sketches", todo, "expected about $%.2f" % (0.05 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    assert STYLE_REF.is_file() and SCREEN_REF.is_file()
    key = D._key(); ts = [threading.Thread(target=send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
