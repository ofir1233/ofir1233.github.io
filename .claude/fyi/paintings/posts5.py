# Four separate campaign paintings, one per post, each a deep and living scene (version 2 of "the descent").
# PAID when run with --send. The key is read from OPENAI_API_KEY and is never printed or written.
# Usage:
#   python3 posts4.py                       dry run: prints the plan and the expected cost
#   python3 posts4.py --send draft          the low drafts of all posts that have none yet (in parallel)
#   python3 posts4.py --send final          the max finals of all posts that have a draft and no final
#   add --only p1,p3 to limit; add --redo to allow one more call for a post and stage (logged as a redo)
import argparse, base64, json, re, sys, time, threading
import urllib.error, urllib.request
from pathlib import Path
from PIL import Image

import descent_draft as D          # the checked helpers: multipart, key, scrub, cost, measure, fixed prompt blocks

REPO = D.REPO
HERE = Path(__file__).resolve().parent
OUT = HERE / "out_posts5"
LOG = OUT / "log.jsonl"
REVIEW = REPO / ".claude/review/hear-page/posts5"
MODEL = D.MODEL
CEILING_USD = 1.20                  # this version only; version 1 cost 0.349 and is logged elsewhere
SIZES = {"draft": ((1152, 608), "low", 190), "final": ((1600, 832), "max", 2050)}   # (size, quality, guessed output tokens)

HARBOUR = REPO / "img/end-harbour.webp"
PLANE = REPO / "img/cw-plane.webp"
PARADE = REPO / "img/cw-parade.webp"
RECEIPT = REPO / "img/cw-receipt.webp"

BALLOONS = REPO / "img/cw-balloons.webp"

HIERARCHY = (
    "THE MESSAGE IS THE SUBJECT OF THE PICTURE. The line of words is the largest and clearest thing in it, as large "
    "and as dominant as the words are in the FIRST reference image. It stands against open sky or an unbroken light "
    "surface, with nothing busy behind it or touching it, and it is the place of the strongest contrast. Everything "
    "else is the setting, and the setting serves the words: it frames them and leads the eye to them. The people "
    "nearest the viewer are seen from behind and look at the words, point at them or turn toward them; streets, "
    "railings, kite strings and shadows run toward them. Near the words the picture is made of larger, broader "
    "shapes with fewer things. The setting is alive but secondary: one clear group of people in front, some life in "
    "the middle, and a far distance made of a few large shapes. It is a real place with depth, seen at eye height at "
    "a gentle angle: the front figures are large and cut by the bottom edge, the far skyline is small."
)
CAMERA = (
    "The FIRST reference image gives the composition: keep how large its words are, where they sit, how much open "
    "sky or open surface surrounds them, and how the figures in front look toward them; replace its subject with the "
    "one described here. All the reference images are finished paintings by the painter of this picture, made on the "
    "same day in the same city: take from them the hand, the paint, the colours, the light, the buildings of the city "
    "and the way words are painted into a scene."
)
OPENING = "It must look as if the same painter made it on the same day, in the same city, as the reference paintings, so that it can hang in one row with them and nobody could tell which were painted first."
TECHNIQUE = (
    "TECHNIQUE: an oil painting by the hand of the reference images: broad, loose, confident strokes of thick paint "
    "laid with wide brushes and a palette knife; large readable shapes; the sky brushed in long soft strokes with "
    "soft-edged white clouds; faces, hands and far figures suggested with a few strokes. Not a mosaic: no small "
    "square tiles of paint, no brick pattern in the paving, the walls or the water. Not a digital illustration, not "
    "anime, not vector, no outlines, no photo realism."
)
COLOURS = (
    "COLOURS: taken from the reference images and from nowhere else. Sky: a light, airy azure, about #5aa3e6 near "
    "the top and paler toward the horizon, with soft white clouds. Glass towers: pale blue and blue-grey with soft "
    "reflections. Ground, paving and stone: warm light greys and creams with soft grey-violet shadows; the ground "
    "is never blue and never lilac. Trees: fresh leaf greens, sunlit yellow-green to mid green. Coral red, about "
    "#ea5a4b, for the object that carries the words and for a few accents. Lilac and white flowers, cream, a little "
    "teal. Not in this picture: deep cobalt, electric blue, a blue cast over the whole picture, orange roofs, black."
)

def words(line, spell, extra=""):
    return (
        f"THE WORDS: exactly one line of words is painted in this picture: {line} Spell it exactly, letter for letter, "
        f"with its full stop: {spell}. It is written once, whole, very large and easy to read at a glance, and nothing "
        "covers or touches any letter. The words are part of the scene and made of its paint. No other text anywhere "
        "in the picture: no shop names, no street signs, no numbers, no menus, no writing on boats, trams, awnings, "
        "parasols, cups or napkins; no logos, no symbols, no signature." + extra
    )
COUNT = ("COUNT: nobody sits at a desk; no office, no headsets, no laptops, no monitors. People are ordinary city people "
         "outdoors, and there are few of them: this is not a crowd scene.")

POSTS = {
    "p1": dict(
        name="harbour", line="Every conversation.", refs=[PLANE, BALLOONS, PARADE],
        subject=(
            "WHAT IT IS: the harbour promenade of the same seaside city on a bright late morning. "
            "THE WORDS, the main thing: a small white passenger plane at the upper right has just written across the wide "
            "open sky two lines of thick, soft, rounded cloud-white trail letters, exactly like the words in the sky of "
            "the FIRST reference image and just as large: the first line Every, the second line conversation. with a full "
            "stop after it. Together the two lines fill the upper half of the picture, from about one fifth to four fifths "
            "of its width; the trail runs on from the full stop to the plane. Behind the words there is only blue sky; the "
            "clouds keep to the left edge, the right edge and the horizon. "
            "IN FRONT, large, cut by the bottom edge, at the left third of the picture: on a wooden pier, seen from behind, "
            "a woman in a coral jacket with a straw hat and a child holding the string of a small coral kite look up at the "
            "words; beside them a white railing post and one pot of lilac and white flowers. "
            "IN THE MIDDLE: the harbour water with one coral fishing boat and one sailboat with a lilac sail; the quay with "
            "a few small people, two of them pointing up at the sky, and one coral-and-white striped awning. "
            "FAR: the skyline of pale glass towers along the bottom third of the picture, well beneath the words."),
        words=words("Every conversation.", "E-v-e-r-y c-o-n-v-e-r-s-a-t-i-o-n",
                    " The second letter of the first word is a small v with no tail beneath the line. Exactly one plane and one trail.")),
    "p2": dict(
        name="roofs", line="Not a sample.", refs=[PARADE, PLANE, BALLOONS],
        subject=(
            "WHAT IT IS: the rooftops of the same seaside city on a bright late morning, seen from a roof terrace. "
            "THE WORDS, the main thing: on the roof of the building across the street, on a white steel frame, stand very "
            "large sign letters in glossy coral, bold and rounded, each a solid block with a light side and a shadow side, "
            "glossy like the coral balloon letters of the FIRST reference image and as large in the picture as those are: "
            "two lines, the first line Not a, the second line sample. with a full stop after it. They fill the middle of the "
            "picture and stand against the open sky, seen a little from beneath at a gentle angle. No tower stands "
            "behind the letters. "
            "IN FRONT, large, cut by the bottom edge, at the left: a woman in a coral dress and a man in a white shirt, seen "
            "from behind, lean on a white parapet and look up at the letters; she points at them. On the parapet two pots of "
            "white hydrangeas and lavender; at the right edge the rim of one lilac-and-white striped parasol. "
            "IN THE MIDDLE: the roof with the steel frame; two small workers in white, one on a ladder beside the full stop; "
            "a few white pigeons taking off. "
            "FAR: a few pale glass towers at the far left and the far right only, a strip of sea with two white sails, soft "
            "white clouds."),
        words=words("Not a sample.", "N-o-t a s-a-m-p-l-e", " Exactly one sign, of two lines.")),
    "p3": dict(
        name="street", line="We hear every call.", refs=[PARADE, BALLOONS, RECEIPT],
        subject=(
            "WHAT IT IS: the main avenue of the same seaside city on a bright late morning, seen from the middle of the "
            "pavement, looking down the avenue. "
            "THE WORDS, the main thing: one very broad coral cloth banner is hung high across the avenue between two white "
            "lamp posts with round globes. It stands against the open sky, seen from beneath at a gentle angle, and takes "
            "about two thirds of the width of the picture, in its upper half. On it, brushed in cream-white paint, in bold "
            "rounded letters on one line: We hear every call. with a full stop at the end. "
            "IN FRONT, large, seen from behind and cut by the bottom edge: a small group of people who have stopped to look "
            "up at the banner: a woman in a straw hat pointing at it, a tall man in a pale blue shirt shading his eyes with one hand, and a cyclist "
            "standing beside a coral bicycle. "
            "IN THE MIDDLE: the avenue with one cream-white tram with a pale blue band coming up the rails, tree crowns at "
            "the left and at the right that frame the banner, two coral-and-white striped awnings with no writing, one "
            "flower stall, some passers-by. "
            "FAR: the avenue narrowing toward pale glass towers and soft clouds."),
        words=words("We hear every call.", "W-e h-e-a-r e-v-e-r-y c-a-l-l", " Exactly one banner. The tram carries no number.")),
    "p4": dict(
        name="table", line="Even here.", refs=[RECEIPT, BALLOONS, PARADE],
        subject=(
            "WHAT IT IS: a cafe table on the pavement of the same seaside city on a bright late morning, seen from the seat "
            "at the table: the composition of the FIRST reference image. "
            "THE WORDS, the main thing: where the long paper lies in the FIRST reference image, and taking as much of the "
            "picture as it does there, one folded cream-white card stands on the table, turned a little so that one side "
            "of it is nearer. On it, in deep navy, in bold rounded letters as large as the largest print on that paper: "
            "Even here. with a full stop after it. "
            "ON THE TABLE, and nothing else: a coral cup of coffee on a coral saucer at the left, a lilac plate with two "
            "magenta-pink macarons at the right, and behind them a small glass vase with lilac flowers. The round table top "
            "is painted blue in broad strokes, with the soft shadow of leaves on it. A coral woven chair back at the left "
            "edge. "
            "BEHIND, smaller and softer: the cafe terrace with a few people talking over coffee, a waiter in a white shirt, "
            "a coral-and-white striped awning with no writing, planters with flowers. "
            "FAR: tree crowns and pale glass towers under a light sky."),
        words=words("Even here.", "E-v-e-n h-e-r-e", " Exactly one standing card. Nothing is written on the cup, the plate or the awning.")),
}

def prompt(pid, stage):
    p = POSTS[pid]
    blocks = [CAMERA, OPENING, TECHNIQUE, COLOURS, HIERARCHY, p["subject"], p["words"], COUNT, "Bright late-morning light from the left, soft shadows."]
    if stage == "final":
        blocks.append("The LAST reference image is the small sketch of this very picture: keep its composition, its camera, "
                      "its people and its colours exactly, keep every letter of its line of words exactly as written and "
                      "where it is, add no other writing, and repaint it large in broad strokes of thick paint.")
    if stage == "final" and pid == "p3":
        blocks.append("One change from the sketch: the man in front carries nobody. He stands alone, shading his eyes with one "
                      "hand. All the people in this picture are adults, fully and plainly dressed.")
    text = "\n\n".join(blocks)
    mine = "\n".join([CAMERA, OPENING, HIERARCHY, p["subject"], p["words"], COUNT])
    hit = re.search(D.BANNED_IN_MY_BLOCKS, mine, flags=re.I)
    assert not hit, f"{pid}: the skill forbids the word '{hit.group(0)}'"
    return text

def read_log():
    return [json.loads(l) for l in LOG.read_text(encoding="utf-8").splitlines() if l.strip()] if LOG.is_file() else []

lock = threading.Lock()
def log(entry):
    with lock:
        OUT.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def latest(pid, stage):
    done = [e for e in read_log() if e.get("post") == pid and e.get("stage") == stage and e.get("status") == "done"]
    return done[-1] if done else None

def guess(stage, n_refs):
    return SIZES[stage][2] * D.USD_PER_M_OUTPUT / 1e6 + 0.012 * n_refs

def send(pid, stage, key, redo):
    (w, h), quality, _ = SIZES[stage]
    p = POSTS[pid]
    refs = list(p["refs"])
    if stage == "final":
        ov = json.loads((OUT / "overrides.json").read_text()) if (OUT / "overrides.json").is_file() else {}
        refs.append(HERE / ov[pid] if pid in ov else Path(latest(pid, "draft")["picture"]))
    text = prompt(pid, stage)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    fields = [("model", MODEL), ("prompt", text), ("size", f"{w}x{h}"), ("quality", quality), ("n", "1")]
    files = []
    for i, r in enumerate(refs, 1):
        r = Path(r)
        mime = {"png": "image/png", "webp": "image/webp", "jpg": "image/jpeg", "jpeg": "image/jpeg"}[r.suffix.lower().lstrip(".")]
        files.append(("image[]", f"reference{i}{r.suffix.lower()}", mime, r.read_bytes()))
    body, ctype = D._multipart(fields, files)
    req = urllib.request.Request(D.ENDPOINT, data=body, method="POST", headers={"Authorization": "Bearer " + key, "Content-Type": ctype})
    log({"time": stamp, "post": pid, "stage": stage, "status": "sent", "cost_usd": 0.0, "redo": bool(redo)})
    try:
        with urllib.request.urlopen(req, timeout=1200) as r:
            raw = r.read()
    except urllib.error.HTTPError as e:
        msg = D._scrub(e.read().decode("utf-8", "replace")[:600], key)
        log({"time": stamp, "post": pid, "stage": stage, "status": f"refused HTTP {e.code}", "cost_usd": 0.0, "note": msg})
        print(f"{pid} {stage}: REFUSED HTTP {e.code}: {msg}"); return
    except Exception as e:
        log({"time": stamp, "post": pid, "stage": stage, "status": "no answer, may be charged", "cost_usd": guess(stage, len(refs))})
        print(f"{pid} {stage}: NO ANSWER ({D._scrub(repr(e), key)}); counted as charged"); return
    answer = json.loads(raw)
    png = OUT / f"{pid}_{p['name']}_{stage}_{stamp}.png"
    png.write_bytes(base64.b64decode(answer["data"][0]["b64_json"]))
    usage = answer.get("usage") or {}
    o, i = D.cost_of(usage)
    log({"time": stamp, "post": pid, "stage": stage, "status": "done", "size": f"{w}x{h}", "quality": quality, "usage": usage,
         "cost_usd": round(o + i, 4), "picture": str(png), "redo": bool(redo), "prompt": text})
    print(f"{pid} {stage}: saved {png.name}  cost ${round(o + i, 4)}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--send", choices=["draft", "final"])
    ap.add_argument("--only", default="")
    ap.add_argument("--redo", action="store_true")
    a = ap.parse_args()
    ids = [x for x in (a.only.split(",") if a.only else POSTS) if x in POSTS]
    for pid in ids:
        for st in ("draft", "final"):
            prompt(pid, st)
        for r in POSTS[pid]["refs"]:
            assert Path(r).is_file(), r
    spent = sum(e.get("cost_usd", 0.0) for e in read_log())
    stage = a.send or "draft"
    todo = []
    for pid in ids:
        if stage == "final" and not latest(pid, "draft"):
            print(f"{pid}: no draft yet, skipped"); continue
        if latest(pid, stage) and not a.redo:
            print(f"{pid}: already has a {stage}, skipped (use --redo)"); continue
        todo.append(pid)
    expected = sum(guess(stage, len(POSTS[p]["refs"]) + (1 if stage == "final" else 0)) for p in todo)
    print(f"stage {stage}; posts {todo}; spent in this version ${spent:.3f}; expected for this batch ${expected:.2f}; ceiling ${CEILING_USD}")
    if not a.send:
        print("DRY RUN. Nothing was sent."); return
    if spent + expected > CEILING_USD:
        sys.exit("Over the ceiling. Nothing was sent.")
    key = D._key()
    ids_all, _ = D.image_models(key)
    if MODEL not in ids_all:
        sys.exit(f"The account has no model {MODEL}. Nothing was sent.")
    threads = [threading.Thread(target=send, args=(pid, stage, key, a.redo)) for pid in todo]
    [t.start() for t in threads]; [t.join() for t in threads]
    print(f"spent in this version so far: ${sum(e.get('cost_usd', 0.0) for e in read_log()):.3f}")

if __name__ == "__main__":
    main()
