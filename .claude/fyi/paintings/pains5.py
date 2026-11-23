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
OUT = HERE / "out_pains5"
LOG = OUT / "log.jsonl"
REVIEW = REPO / ".claude/review/hear-page/posts5"
MODEL = D.MODEL
CEILING_USD = 0.45                  # this version only; version 1 cost 0.349 and is logged elsewhere
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
    "shapes with fewer things. The setting is alive and generous but secondary: one clear group of people in front, a "
    "middle distance with plenty of small life in it (a dozen or two small figures, awnings, flowers, boats), and a far "
    "distance made of a few large shapes. It is a real place with depth, seen at eye height at "
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
         "outdoors, all plainly and fully dressed.")

ROME = REPO / "img/cw-rome.webp"
PAPER = REPO / "img/cw-paper.webp"

def W(line, spell, where):
    return (f"THE WORDS: exactly one line of words is painted in this picture: {line} Spell it exactly, letter for letter, "
            f"with its punctuation: {spell}. It is written once, whole, large and easy to read at a glance, {where}, and "
            "nothing covers any letter. The words are part of the scene and made of its paint. No other text anywhere in "
            "the picture: no shop names, no street signs, no numbers, no menus, no logos, no signature.")

POSTS = {
    "a": dict(
        name="compliance-plank", line="This call is recorded.", refs=[BALLOONS, PLANE, PARADE],
        subject=(
            "WHAT IT IS: a white wooden footbridge over the harbour of the same seaside city on a bright late morning, seen "
            "from the quay at a gentle angle, so that the bridge runs across the picture and away from the viewer. "
            "THE IDEA: every plank of the bridge is in place except one. In the middle of the bridge one plank is missing, "
            "and through the gap the blue water shows. People walk across without noticing; a woman in a coral dress has "
            "stopped just before the gap, one foot lifted, looking down, and the man behind her reaches out to hold her "
            "arm. On the quay in front, a carpenter in white overalls walks toward the bridge carrying the missing plank "
            "on his shoulder: a long cream-white plank, its broad face turned toward the viewer, as large as the paper in the cafe "
            "painting among the references. "
            "THE WORDS, the main thing: painted along the plank he carries, in deep navy bold rounded letters on one line: "
            "This call is recorded. with a full stop. The plank takes about half the width of the picture. "
            "IN THE MIDDLE: the bridge with a dozen small walkers, a cyclist, a dog; boats under it. "
            "FAR: the skyline of pale glass towers."),
        words=W("This call is recorded.", "T-h-i-s c-a-l-l i-s r-e-c-o-r-d-e-d", "along the plank the carpenter carries")),
    "b": dict(
        name="identity-shadow", line="Who is really calling?", refs=[BALLOONS, PARADE, RECEIPT],
        subject=(
            "WHAT IT IS: a sunlit square of the same seaside city on a bright late morning, with long clear shadows on the "
            "pale warm paving, seen from a little above eye height. "
            "THE IDEA: a short queue of ordinary adults waits at a white ticket kiosk with a coral-and-white striped awning. "
            "Each of them throws a long shadow on the paving, and each shadow is the true shape of its owner, except one. "
            "The third person in the queue, a friendly-looking man in a pale blue shirt holding a phone to his ear, throws "
            "the shadow of a fox standing on its hind legs, with pointed ears and a long bushy tail. Nobody in the queue has "
            "noticed. The fox shadow lies across the middle of the picture and is its largest and clearest shape. "
            "THE WORDS, the main thing: written in white chalk on the paving along the fox shadow, in bold rounded letters "
            "on one line, about half the width of the picture: Who is really calling? with a question mark. "
            "IN FRONT, at the bottom right, cut by the edge: a woman in a coral jacket seen from behind, who has noticed the "
            "shadow and points at it. "
            "IN THE MIDDLE: the kiosk and the queue, flower pots, a bicycle, pigeons. "
            "FAR: trees, a tram and pale glass towers."),
        words=W("Who is really calling?", "W-h-o i-s r-e-a-l-l-y c-a-l-l-i-n-g", "in chalk on the paving along the fox shadow")),
    "c": dict(
        name="churn-suitcases", line="They said it before they left.", refs=[PLANE, BALLOONS, PARADE],
        subject=(
            "WHAT IT IS: the ferry pier of the same seaside city on a bright late morning, seen from the quay. "
            "THE IDEA: customers who leave. A white ferry with a coral funnel is pulling away from the pier, its decks full "
            "of small people with suitcases, a few of them waving. More people with suitcases, coral, lilac and teal, still "
            "walk up the gangway of a second ferry. On the pier stands one man in a white shirt and an apron, seen from "
            "behind, large and cut by the bottom edge, his arms hanging, holding a bunch of flowers he did not get to "
            "give. "
            "THE WORDS, the main thing: high in the sky above the leaving ferry, its funnel has puffed the words in soft "
            "white steam letters, as large and as round as the trail letters in the FIRST reference image, on two lines: "
            "They said it / before they left. with a full stop. Open blue sky behind them. "
            "IN THE MIDDLE: the pier, bollards, gulls, a striped ticket hut with no writing, a few onlookers. "
            "FAR: the sea, sails, and the skyline of pale glass towers at one side."),
        words=W("They said it before they left.", "T-h-e-y s-a-i-d i-t b-e-f-o-r-e t-h-e-y l-e-f-t", "as steam letters in the sky above the ferry")),
    "d": dict(
        name="promise-phone-booth", line="We'll call you back.", refs=[ROME, BALLOONS, RECEIPT],
        subject=(
            "WHAT IT IS: a sunny corner of the promenade of the same seaside city on a bright late morning. "
            "THE IDEA: a promise that was not kept. A coral telephone booth stands on the corner, and it has been waiting "
            "so long that the city has grown over it: bougainvillea and white flowering climbers wind round it and over its "
            "roof, a bird has built a nest on top of it, a cat sleeps against its door. Beside it, on a white bench, a "
            "woman in a straw hat still waits, a small suitcase at her feet, a cold cup of coffee beside her, looking at "
            "the booth. The booth is large, a little right of the middle of the picture, against the open sky and the "
            "sea. "
            "THE WORDS, the main thing: on the cream-white panel across the top of the booth, where a telephone booth "
            "carries its name, in deep navy bold rounded letters on one line, about two fifths of the picture's width: "
            "We'll call you back. with an apostrophe and a full stop. "
            "IN THE MIDDLE: the promenade with a few passers-by who walk on, a lamp post, flower pots. "
            "FAR: the sea with sails and pale glass towers at the left."),
        words=W("We'll call you back.", "W-e-apostrophe-l-l c-a-l-l y-o-u b-a-c-k", "on the panel across the top of the telephone booth")),
    "e": dict(
        name="ai-agent-waiter", line="Who checks the bot?", refs=[RECEIPT, BALLOONS, PARADE],
        subject=(
            "WHAT IT IS: a cafe terrace of the same seaside city on a bright late morning, seen from the seat at a table, as "
            "in the FIRST reference image. "
            "THE IDEA: an AI agent that is sure of itself and wrong. A friendly white-and-coral robot waiter, rounded and "
            "toy-like, with a small apron, stands at the table and pours coffee from a coral pot with great confidence: the "
            "stream of coffee misses the cup by a hand's width and lands in the lilac plate of macarons. The robot smiles "
            "and looks proudly at the guest. The guests at the next table have stopped talking and stare; one raises an "
            "eyebrow, one hides a laugh. "
            "THE WORDS, the main thing: on the table, where the long paper lies in the FIRST reference image and as large "
            "as it is there, lies the cafe bill on cream-white paper, and across it, in deep navy bold rounded letters on "
            "one line: Who checks the bot? with a question mark. "
            "ON THE TABLE besides: the coral cup on its saucer, with no coffee in it, and the plate with the coffee in it. "
            "BEHIND: the terrace, a striped awning with no writing, planters, tree crowns and pale glass towers."),
        words=W("Who checks the bot?", "W-h-o c-h-e-c-k-s t-h-e b-o-t", "on the paper on the table")),
}

def prompt(pid, stage):
    p = POSTS[pid]
    blocks = [CAMERA, OPENING, TECHNIQUE, COLOURS, HIERARCHY, p["subject"], p["words"], COUNT, "Bright late-morning light from the left, soft shadows."]
    if stage == "final":
        blocks.append("The LAST reference image is the small sketch of this very picture: keep its composition, its camera, "
                      "its people and its colours exactly, keep every letter of its line of words exactly as written and "
                      "where it is, add no other writing, and repaint it large in broad strokes of thick paint.")
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
