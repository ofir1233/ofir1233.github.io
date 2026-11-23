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
OUT = HERE / "out_ideas6"
LOG = OUT / "log.jsonl"
REVIEW = REPO / ".claude/review/hear-page/posts5"
MODEL = D.MODEL
CEILING_USD = 0.40                  # this version only; version 1 cost 0.349 and is logged elsewhere
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

POSTS = {
    "a": dict(
        name="speech-clouds", line="Every conversation.", refs=[PLANE, BALLOONS, PARADE],
        subject=(
            "WHAT IT IS: the same seaside city on a bright late morning, seen from a cafe terrace above the promenade. "
            "THE IDEA: every conversation in the city rises into the sky as a white cloud in the shape of a speech bubble, "
            "with a small tail that points down to the people who are talking. The sky holds many of these bubble clouds, "
            "large near us and small far away, each above its own little group: friends at a table, a couple on a bench, "
            "two fishermen on a boat, neighbours on balconies, a family on the beach. "
            "THE WORDS, the main thing: the nearest and largest bubble cloud, in the upper middle of the picture, about half "
            "its width, with its tail pointing to the two people talking at the table in front. The words are cut through "
            "this white cloud, so that the blue sky shows through it as bold rounded letters: Every conversation. with a "
            "full stop. "
            "IN FRONT, large, cut by the bottom edge: two friends at a cafe table, seen from behind and in profile, talking "
            "with their hands; coral woven chairs, two cups. "
            "IN THE MIDDLE: the promenade and the harbour with a dozen small groups of people, each under its own small "
            "bubble cloud; boats, awnings, flowers. "
            "FAR: the skyline of pale glass towers and the sea."),
        words=words("Every conversation.", "E-v-e-r-y c-o-n-v-e-r-s-a-t-i-o-n", " Only the largest cloud carries words; the other bubble clouds carry none.")),
    "b": dict(
        name="tin-can", line="We hear every call.", refs=[PARADE, ROME, BALLOONS],
        subject=(
            "WHAT IT IS: a street of the same seaside city on a bright late morning, between two rows of white apartment "
            "buildings with balconies, seen from the pavement. "
            "THE IDEA: a tin-can telephone. On every balcony somebody holds a tin can to an ear or to the mouth, and from "
            "each can a taut string runs out over the street. All the strings, dozens of them, meet in one enormous tin can, "
            "as large as a car, that stands on the roof terrace at the end of the street, in the upper middle of the picture "
            "against the open sky. "
            "THE WORDS, the main thing: round the big tin can is wrapped a coral paper label, and on it, in cream-white bold "
            "rounded letters on two lines: We hear every call. with a full stop. The label takes about a third of the "
            "picture's width. "
            "IN FRONT, large, seen from behind and cut by the bottom edge: a child holding a small tin can to one ear, its "
            "string running up to the big can, and a parent beside the child looking up. "
            "IN THE MIDDLE: the balconies on both sides with people of every age holding their cans, flower boxes, striped "
            "awnings, laundry; the strings cross the street like the rays of a fan. A cream-white tram beneath. "
            "FAR: sky and soft clouds behind the big can."),
        words=words("We hear every call.", "W-e h-e-a-r e-v-e-r-y c-a-l-l", " Exactly one big can. The small cans carry no writing.")),
    "c": dict(
        name="bottles", line="Not a sample.", refs=[BALLOONS, PLANE, PARADE],
        subject=(
            "WHAT IT IS: the harbour of the same seaside city on a bright late morning. "
            "THE IDEA: the harbour water is dotted with hundreds of glass bottles, each with a rolled paper note inside. At "
            "the left, on the pier, an old fisherman with a fishing rod has caught one single bottle. At the right the harbour "
            "crane lifts out of the water an enormous fishing net bulging with thousands of glittering bottles, dripping, as "
            "large in the picture as the cloud of balloons in the FIRST reference image, and standing against the open sky. "
            "THE WORDS, the main thing: from the crane hook above the net hangs one broad coral cloth pennant, and on it, in "
            "cream-white bold rounded letters on one line: Not a sample. with a full stop. It takes about a third of the "
            "picture's width. "
            "IN FRONT, large, seen from behind and cut by the bottom edge: the old fisherman in a straw hat with his rod and "
            "his one bottle, and a woman in a coral jacket beside him, both looking across at the net. "
            "IN THE MIDDLE: the quay with a few people pointing and photographing, a coral fishing boat, bottles bobbing on "
            "the water. "
            "FAR: the skyline of pale glass towers."),
        words=words("Not a sample.", "N-o-t a s-a-m-p-l-e", " Exactly one pennant. The notes in the bottles show no writing.")),
    "d": dict(
        name="shell", line="Even here.", refs=[ROME, BALLOONS, PLANE],
        subject=(
            "WHAT IT IS: the city beach of the same seaside city on a bright late morning. "
            "THE IDEA: a seashell, a spiral conch, pearly white and pale pink with a coral lip, as large as a kiosk, lies on "
            "the sand, the way the giant telephone handset lies on the Colosseum in the FIRST reference image. People queue "
            "to put an ear to its opening. A girl has her ear pressed to it, eyes closed, smiling. "
            "THE WORDS, the main thing: written large in the wet sand in front of the shell, as if with a finger, in bold "
            "rounded letters across the lower third of the picture: Even here. with a full stop. The letters are grooves of "
            "darker wet sand with a bright rim. "
            "IN FRONT: the words in the sand and, beside them, the girl at the shell. "
            "IN THE MIDDLE: the queue of beachgoers behind her, a few striped coral-and-white parasols, a lifeguard hut "
            "with no writing, a dog. "
            "FAR: the sea with white sails and the skyline of pale glass towers."),
        words=words("Even here.", "E-v-e-n h-e-r-e", " Exactly one giant shell.")),
    "e": dict(
        name="one-balcony", line="One of them told you what to build next.", refs=[ROME, PARADE, PAPER],
        subject=(
            "WHAT IT IS: one white apartment block of the same seaside city on a bright late morning, seen from across the "
            "street; it fills most of the picture. "
            "THE IDEA: on every balcony of the block, five storeys of six balconies, somebody is on the phone. All the "
            "balconies lie in cool blue-grey shade, their people small and pale, except one balcony in the middle of the "
            "picture, in full sun: a coral awning, boxes of flowers, and a woman on the phone leaning on the rail, bright "
            "and clear. "
            "THE WORDS, the main thing: from the rail of that one sunlit balcony hangs a broad coral cloth banner, about two "
            "fifths of the picture's width, and on it, in cream-white bold rounded letters on two lines: One of them told "
            "you / what to build next. with a full stop at the end. "
            "IN FRONT, at the bottom corners, cut by the edge: tree crowns, and two passers-by seen from behind looking up "
            "at the sunlit balcony. "
            "FAR: a strip of sky and one pale glass tower beside the block."),
        words=words("One of them told you what to build next.", "O-n-e o-f t-h-e-m t-o-l-d y-o-u w-h-a-t t-o b-u-i-l-d n-e-x-t", " Exactly one banner.")),
    "f": dict(
        name="washing-line", line="Six seconds that matter.", refs=[ROME, PARADE, BALLOONS],
        subject=(
            "WHAT IT IS: a narrow street of the same seaside city on a bright late morning, between two white apartment "
            "buildings, seen from the pavement looking up at a gentle angle. "
            "THE IDEA: one very long washing line crosses the whole street from a balcony on the left to a balcony on the "
            "right. On it hang dozens of white sheets and towels of different lengths, long and short in turn, so that the "
            "whole row has the outline of the wave of a recorded voice. Among them, a little to the right of the middle, one "
            "short stretch of the line carries coral cloth, where every other piece is white. "
            "THE WORDS, the main thing: on the widest coral sheet, in cream-white bold rounded letters on two lines: Six "
            "seconds / that matter. with a full stop. The sheet hangs against the open sky between the buildings. "
            "IN FRONT, large, seen from behind and cut by the bottom edge: a woman with a laundry basket on her hip and a "
            "child pointing up at the coral sheet. "
            "IN THE MIDDLE: the balconies on both sides with neighbours leaning out, one pulling the line on its pulley, "
            "flower pots, a cat, a parked bicycle below. "
            "FAR: sky, soft clouds and one pale glass tower at the end of the street."),
        words=words("Six seconds that matter.", "S-i-x s-e-c-o-n-d-s t-h-a-t m-a-t-t-e-r", " The white sheets carry no writing.")),
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
