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
OUT = HERE / "out_posts4"
LOG = OUT / "log.jsonl"
REVIEW = REPO / ".claude/review/hear-page/posts4"
MODEL = D.MODEL
CEILING_USD = 1.50                  # this version only; version 1 cost 0.349 and is logged elsewhere
SIZES = {"draft": ((1152, 608), "low", 190), "final": ((1600, 832), "max", 2050)}   # (size, quality, guessed output tokens)

HARBOUR = REPO / "img/end-harbour.webp"
PLANE = REPO / "img/cw-plane.webp"
PARADE = REPO / "img/cw-parade.webp"
RECEIPT = REPO / "img/cw-receipt.webp"

DEPTH = (
    "DEPTH AND LIFE: this is a deep, crowded, living view of a real place, never a poster and never a diagram. "
    "The camera stands at eye height inside the scene and looks into it at a three-quarter angle, never square-on. "
    "Three planes that overlap one another: a FOREGROUND of large things close to the viewer, cut off by the edges of "
    "the picture; a MIDDLE full of people and activity; a FAR distance of the glass skyline, the sea and tall sculpted "
    "clouds. Things stand in front of other things, get smaller with distance and throw shadows. Dozens of small "
    "living details in every part of the picture: people walking, talking and pointing, flowers, awnings, bicycles, "
    "boats, gulls, laundry, lamps, reflections in glass and in water. The composition is asymmetric: nothing sits in "
    "the centre, nothing is mirrored left and right."
)
CAMERA = (
    "The FIRST reference image gives the camera: keep its viewpoint, its horizon height, its depth and its richness "
    "of detail, and replace its subject with the one described here. The other reference images are finished "
    "paintings by the painter of this picture, made on the same day in the same city: take from them the hand, the "
    "thick paint, the colours, the light, the buildings of the city and the way words are painted into a scene."
)
OPENING = "It must look as if the same painter made it on the same day, in the same city, as the reference paintings, so that it can hang in one row with them."

def words(line, spell, extra=""):
    return (
        f"THE WORDS: exactly one line of words is painted in this picture: {line} Spell it exactly, letter for letter, "
        f"with its full stop: {spell}. It is written once, whole, large and easy to read, and nothing covers any letter. "
        "The words are part of the scene and made of its paint. No other text anywhere in the picture: no shop names, "
        "no street signs, no numbers, no menus, no writing on boats, trams, awnings, parasols, cups or napkins; no logos, "
        "no symbols, no signature." + extra
    )
COUNT = ("COUNT: nobody sits at a desk; no office, no headsets, no laptops, no monitors, no phones held up. "
         "People are ordinary city people outdoors.")

POSTS = {
    "p1": dict(
        name="harbour", line="Every conversation.", refs=[HARBOUR, PLANE, PARADE],
        subject=(
            "WHAT IT IS: the harbour of the same seaside city on a bright late morning, seen from a wooden pier at the water. "
            "FOREGROUND, close and large, cut by the left and bottom edges of the picture: the end of the pier with thick "
            "white-painted posts, teal and white flower pots spilling magenta-pink bougainvillea and white flowers, a coiled "
            "rope, a coral-and-white striped deck chair with a straw hat on it, and a child seen from behind holding the "
            "string of a coral kite that flies high at the left. "
            "MIDDLE: the water full of boats: a coral fishing boat with a white cabin and a life ring, a sailboat with a lilac "
            "sail, two rowing boats, coral buoys, the reflections broken into short knife strokes; along the quay a promenade "
            "crowded with small people walking, a cafe with coral-and-white striped awnings and parasols, a cyclist, a couple "
            "pointing up at the sky, white railings, and at the right a white lighthouse with a coral band. "
            "FAR: the dense skyline of blue glass towers and white blocks with flowering balconies; above it a huge sky with "
            "tall sculpted cumulus at both sides, and gulls. "
            "IN THE SKY: a small white passenger plane, high at the upper right, has written across the open blue, in the "
            "same thick, soft, rounded cloud-white trail letters as the words in the sky of the SECOND reference image, two "
            "lines that climb a little toward the plane: the first line Every, the second line conversation. with a full "
            "stop after it; the trail runs on from the full stop to the plane."),
        words=words("Every conversation.", "E-v-e-r-y c-o-n-v-e-r-s-a-t-i-o-n", " Exactly one plane and one trail.")),
    "p2": dict(
        name="roofs", line="Not a sample.", refs=[PLANE, HARBOUR, PARADE],
        subject=(
            "WHAT IT IS: the rooftops of the same seaside city on a bright late morning, seen from a roof terrace. "
            "FOREGROUND, close and large, cut by the bottom and right edges of the picture: the terrace: a white parapet wall "
            "with pots of lavender and white hydrangeas, a lilac-and-white striped parasol, two white deck chairs with coral "
            "towels, a small round table with a coral coffee pot and two cups, a washing line with white and lilac sheets "
            "blowing, a white cat asleep on the wall; a woman in a coral dress and a man in a white shirt, seen from behind, "
            "lean on the parapet and look across at the letters. "
            "MIDDLE: the neighbouring roof, seen at a three-quarter angle so that its long edge runs gently away from the "
            "viewer: along that edge, on a white steel frame, stands one row of big sign letters in glossy coral, bold rounded "
            "sans-serif, each letter a solid block with a light side and a shadow side, glossy like the balloon letters of the "
            "THIRD reference image, the nearer letters a little larger than the farther ones, spelling Not a sample. with a "
            "full stop after it; two small workers in white on that roof, one on a ladder beside the last letter; a white "
            "water tank on legs, roof gardens, striped parasols, white pigeons taking off. "
            "FAR: blue glass towers reflecting the clouds, a strip of cobalt sea with white sailboats, tall sculpted cumulus, "
            "a lilac kite."),
        words=words("Not a sample.", "N-o-t a s-a-m-p-l-e", " Exactly one row of standing letters, on one roof.")),
    "p3": dict(
        name="street", line="We hear every call.", refs=[PARADE, HARBOUR, PLANE],
        subject=(
            "WHAT IT IS: the main avenue of the same seaside city on a bright late morning, seen from the pavement at a street "
            "cafe, looking down the avenue at an angle. "
            "FOREGROUND, close and large, cut by the bottom and left edges of the picture: two cafe tables with coral woven "
            "chairs; a woman in a straw hat and a man with a dog under the table sit with coffee, seen from behind and in "
            "profile; a waiter in a white apron carries a tray; a parked coral bicycle with a basket of white flowers. "
            "MIDDLE: the avenue full of life: a cream-white tram with a cobalt band comes up the rails, cyclists, a flower "
            "stall under a teal awning, children with a lilac kite, shoppers with bags, a street musician with a cello, shop "
            "fronts with glass reflecting the sky, coral-and-white striped awnings with no writing on them, balconies with "
            "boxes of white and lilac flowers, rounded tree crowns throwing dappled shadows on pale blue-lilac paving; and "
            "high across the avenue, hung between two white lamp posts with round globes and seen from below at a "
            "three-quarter angle, so that it runs away into the street, one broad coral cloth banner, rippling a little in "
            "the wind, with the words We hear every call. brushed on it in cream-white paint, in bold rounded sans-serif "
            "letters on one line, with a full stop at the end. "
            "FAR: the avenue narrowing toward blue glass towers and tall sculpted clouds."),
        words=words("We hear every call.", "W-e h-e-a-r e-v-e-r-y c-a-l-l", " Exactly one banner. The tram carries no number.")),
    "p4": dict(
        name="table", line="Even here.", refs=[RECEIPT, HARBOUR, PARADE],
        subject=(
            "WHAT IT IS: a cafe table on the pavement of the same seaside city on a bright late morning, seen from the seat at "
            "the table, as in the FIRST reference image. "
            "FOREGROUND, close and large, cut by the bottom edge of the picture: the round table top, painted blue in thick "
            "visible knife strokes, with the dappled shadow of leaves on it; a coral cup of coffee on a coral saucer, a lilac "
            "plate with three magenta-pink macarons, a glass vase with lilac and white flowers, a glass of water with a white "
            "highlight, a folded teal napkin, a pair of sunglasses; and standing on the table, turned a little to the left so "
            "that one side of it is nearer, one folded cream-white card with the words Even here. painted on it in deep navy, "
            "in bold rounded sans-serif letters like the large print on the paper in the FIRST reference image, with a full "
            "stop after them; a coral woven chair back at the right edge with a lilac cushion. "
            "MIDDLE: the terrace behind the table: other tables with people talking and laughing over coffee, a waiter "
            "pouring from a coral pot, a dog asleep under a chair, planters with white hydrangeas and lavender, a "
            "coral-and-white striped awning with no writing on it, a child reaching for a lilac balloon, a parked bicycle. "
            "FAR: the avenue with a cream-white tram, tree crowns, blue glass towers and tall sculpted clouds."),
        words=words("Even here.", "E-v-e-n h-e-r-e", " Exactly one standing card. Nothing is written on the cup, the napkin or the awning.")),
}

def prompt(pid, stage):
    p = POSTS[pid]
    blocks = [CAMERA, OPENING, D.TECHNIQUE, D.COLOURS, DEPTH, p["subject"], p["words"], COUNT, D.CLOSING]
    if stage == "final":
        blocks.append("The LAST reference image is the small sketch of this very picture: keep its composition, its camera, "
                      "its people and its colours exactly, keep every letter of its line of words exactly as written and "
                      "where it is, add no other writing, and repaint it large with far more detail and thick paint.")
    if stage == "final":
        blocks.append("The sky is the lighter, softer azure of the campaign paintings, about #4094e4, never a deep or electric cobalt.")
        if pid == "p1":
            blocks.append("Check the first word of the trail before painting it: it is Every: a capital E, then a small v made of "
                          "two short straight strokes that meet at the bottom and do NOT go beneath the line, then e, r, y. "
                          "Only the last letter of that word has a tail beneath the line.")
    text = "\n\n".join(blocks)
    mine = "\n".join([CAMERA, OPENING, DEPTH, p["subject"], p["words"], COUNT])
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
