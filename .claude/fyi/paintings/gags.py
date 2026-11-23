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
OUT = HERE / "out_gags"
LOG = OUT / "log.jsonl"
REVIEW = REPO / ".claude/review/hear-page/posts5"
MODEL = D.MODEL
CEILING_USD = 0.80                  # this version only; version 1 cost 0.349 and is logged elsewhere
SIZES = {"draft": ((1152, 608), "low", 190), "final": ((1600, 832), "max", 2050), "direct": ((1600, 832), "max", 2050)}   # (size, quality, guessed output tokens)

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

GAG = ("THE TONE: a warm, witty scene, told with affection, like a single-panel cartoon painted in oils. The joke must be "
       "understood in one glance, before the words are read: one character is completely sure of itself and is getting "
       "it wrong, and the people around have noticed. Faces and gestures carry it: give every near figure a clear, "
       "readable expression.")

POSTS = {
    "r": dict(
        name="robot-waiter", line="Who checks the bot?", refs=[RECEIPT, BALLOONS, PARADE],
        subject=(GAG + " "
            "WHAT IT IS: a cafe terrace on the promenade of the same seaside city on a bright late morning, seen from the "
            "guest's seat at a round table, at a three-quarter angle, as in the FIRST reference image: the blue table top "
            "fills the bottom of the picture and is cut by its bottom edge. "
            "THE ROBOT, the star of the picture: an AI waiter stands at the right side of the table, seen from the hips up, "
            "its head in the upper third of the picture against the sky. It is built with the care of a fine old espresso "
            "machine: glossy cream-white enamel panels with coral joints and a few brass rivets, a rounded head with a dark "
            "glass face on which two happy curved eyes and a small proud smile glow in pale blue, one short antenna with a "
            "coral ball. It is dressed like an old-fashioned head waiter: a coral bow tie, a long cream apron, a folded "
            "white napkin over its left forearm, its left hand held behind its back. Chest out, chin lifted, it looks "
            "straight at the guest with complete pride, and does not look at what its right hand is doing. "
            "THE JOKE: with its right arm raised high it pours from a coral coffee pot in one long, elegant, glittering arc. "
            "The arc sails right past the coral cup, which stands on its saucer with nothing in it, and lands exactly in "
            "the middle of the lilac plate of macarons beside it: a small splash, a dark pool spreading over the plate, one "
            "macaron floating, three drops on the table. "
            "THE WORDS: beside the plate lies the cafe bill, a long cream-white paper slip curling at one end like the "
            "paper in the FIRST reference image and as large in the picture as that paper is, turned toward the viewer. "
            "Across it, in deep navy bold rounded letters on one line: Who checks the bot? with a question mark. "
            "THE GUEST: at the bottom left corner, large and cut by the edges, seen from behind over the shoulder: a man "
            "in a pale blue shirt, his hand half raised with one finger up, about to say something. "
            "BEHIND: at the next table three friends have stopped mid-coffee: a woman hides a laugh behind her hand, a man "
            "raises one eyebrow, a woman in a straw hat points with her spoon; a human waiter in a white shirt has stopped "
            "mid-step with a tray and stares; a small dog under their table looks up at the falling coffee. A "
            "coral-and-white striped awning with no writing, planters of lilac and white flowers, coral woven chairs. "
            "FAR: the promenade railing, the sea with two white sails, and the skyline of pale glass towers under soft "
            "white clouds."),
        words=W("Who checks the bot?", "W-h-o c-h-e-c-k-s t-h-e b-o-t", "on the paper bill on the table")),
    "k": dict(
        name="lookout", line="A sample sees 2%.", refs=[BALLOONS, PLANE, PARADE],
        subject=(GAG + " "
            "WHAT IT IS: the harbour of the same seaside city on a bright late morning, seen from the quay at a "
            "three-quarter angle, with the water opening to the right. "
            "THE WATCHMAN, the star of the picture: on a white wooden lookout tower with a small coral roof stands the "
            "harbour watchman, a stout man with a grand moustache in a spotless white uniform with brass buttons and a "
            "white cap. Chest out, one hand on his hip, he looks with complete satisfaction through a long brass telescope "
            "at one single small white sailboat far out on a perfectly peaceful patch of sea at the upper right. He is the "
            "only person in the picture who is content. "
            "THE JOKE: everywhere he does not look, the harbour is in gentle chaos, each mishap clear and separate: right "
            "beneath his tower a rowing boat is slowly sinking while its owner bails with his straw hat; two gulls fly off "
            "with a fish each from the fishmonger's stall while the fishmonger shakes a fist; a runaway coral parasol "
            "tumbles along the quay with a waiter in an apron running after it; a golden dog swims away with a whole "
            "baguette; a man sleeps on a yellow pedal boat that drifts out to sea; a coral life ring hangs unused on the "
            "tower. "
            "THE WORDS, large: on the cream-white wooden board fixed across the front of the lookout tower, under his "
            "feet, in deep navy bold rounded letters on one line: A sample sees 2%. with a full stop. The board takes "
            "about two fifths of the picture's width and stands against the sky and the sea. "
            "IN FRONT, large, seen from behind and cut by the bottom edge, at the bottom left: a man who points at the "
            "sinking boat and a woman in a coral jacket with one hand on her head, both looking up at the watchman in "
            "disbelief. "
            "BEHIND AND FAR: the promenade curving away at the left with a striped awning with no writing, trees and a few "
            "strollers; the skyline of pale glass towers at the left; open sea and soft white clouds at the right."),
        words=W("A sample sees 2%.", "A s-a-m-p-l-e s-e-e-s 2-percent-sign", "on the board of the lookout tower")),
    "c": dict(
        name="churn-ferry", line="They said it before they left.", refs=[PLANE, BALLOONS, PARADE],
        subject=(
            "THE TONE: a bittersweet scene with a small smile in it, told with affection. It must be understood in one "
            "glance, before the words are read: they told him, he did not hear it, and now they are leaving. "
            "WHAT IT IS: the ferry pier of the same seaside city on a bright late morning, seen from the quay at a "
            "three-quarter angle, the water opening to the right. "
            "THE SHOPKEEPER, in front at the left, large, seen from behind and cut by the bottom edge: a man in a white "
            "shirt and a long grey apron stands with his shoulders dropped and his head lifted toward the ferry. In the "
            "hand that hangs at his side he holds a bunch of lilac and white flowers, heads down, that he came too late "
            "to give. A small dog sits at his feet and looks up at him. "
            "WHAT HE DID NOT HEAR, right beside him at the left edge: his little shop kiosk with a coral-and-white striped "
            "awning with no writing, and on its wall a coral letterbox so stuffed with unopened envelopes that its flap "
            "cannot close: cream, lilac and pale blue envelopes stick out of it, a drift of them lies on the paving "
            "beneath it, and one is caught under his shoe. Every envelope is sealed and carries no writing. "
            "THE ONES WHO LEAVE: a white ferry with a coral funnel has just pulled away from the pier, white water at its "
            "stern, its decks lined with small people beside their suitcases; a few wave, most have already turned to "
            "look ahead. On the pier the last passengers walk up the gangway of a second ferry with coral, lilac and teal "
            "suitcases; one woman looks back at the shopkeeper over her shoulder and lifts her hand a little. "
            "THE WORDS, the largest thing in the picture: the funnel of the leaving ferry has puffed them into the sky in "
            "thick, soft, rounded white steam letters, like the trail letters in the FIRST reference image and as large, "
            "on two lines that fill the upper right half of the picture: They said it / before they left. with a full "
            "stop. The last wisp of steam still joins the full stop to the funnel. Open blue sky behind the words. "
            "FAR: the skyline of pale glass towers at the left, the open sea with two white sails at the right, soft "
            "white clouds kept away from the words."),
        words=W("They said it before they left.", "T-h-e-y s-a-i-d i-t b-e-f-o-r-e t-h-e-y l-e-f-t", "as steam letters in the sky above the ferry")),
    "k2": dict(
        name="lookout2", line="A sample sees 2%.", refs=[BALLOONS, PLANE, PARADE],
        subject=(
            "THE PEOPLE: every person in this picture is painted exactly like the people in the reference paintings: "
            "ordinary, good-looking city people with natural proportions and natural faces, drawn with affection. No "
            "caricature and no cartoon: nobody is fat, nobody has a big nose, a big moustache or an exaggerated face or "
            "body. The humour comes from what is happening, never from how anybody looks. "
            "WHAT IT IS: the harbour of the same seaside city on a bright late morning, seen from the quay at a "
            "three-quarter angle, with the water opening to the right. "
            "THE WATCHMAN, the main figure: on a white wooden lookout tower with a small coral roof stands the harbour "
            "watchman: a slim, upright man of about forty with short dark hair, in a neat white shirt with rolled sleeves, "
            "white trousers and a white cap, of the same build and painted the same way as the man in the apron in the "
            "FIRST reference image. Standing straight, one hand resting on the rail, he looks with complete satisfaction "
            "through a long brass telescope at one single small white sailboat far out on a peaceful patch of sea at the "
            "upper right. He alone in the picture is content. "
            "WHAT HE DOES NOT SEE: everywhere he does not look, the harbour is in gentle trouble, each thing clear and "
            "separate: right beneath his tower a rowing boat is slowly filling with water while its owner bails with a "
            "bucket; two gulls fly off with a fish each from the fish stall while the fishmonger calls after them; a "
            "coral parasol has blown off the quay and floats on the water, and a waiter in an apron leans over the edge "
            "of the stone quay reaching for it with a boat hook; a golden dog swims away with a whole baguette; a man "
            "sleeps on a yellow pedal boat that drifts out to sea; a coral life ring hangs unused on the tower. Every "
            "person stands on the quay, on the tower or in a boat; nobody walks on the water. "
            "THE WORDS, large: on the cream-white wooden board fixed across the front of the lookout tower, under his "
            "feet, in deep navy bold rounded letters on one line: A sample sees 2%. with a full stop. The board takes "
            "about two fifths of the picture's width and stands against the sky and the sea. "
            "IN FRONT, large, seen from behind and cut by the bottom edge, at the bottom left: a man who points at the "
            "boat that is filling with water and a woman in a coral jacket with one hand raised to her head, both looking "
            "up at the watchman. "
            "BEHIND AND FAR: the promenade curving away at the left with a striped awning with no writing, trees and a few "
            "strollers; the skyline of pale glass towers at the left; open sea and soft white clouds at the right."),
        words=W("A sample sees 2%.", "A s-a-m-p-l-e s-e-e-s 2-percent-sign", "on the board of the lookout tower")),
    "g1": dict(
        name="lookout", line="A sample sees 2%.", refs=[BALLOONS, PLANE, PARADE],
        subject=(GAG + " "
            "WHAT IT IS: the harbour of the same seaside city on a bright late morning, seen from the quay. "
            "THE JOKE: on a white wooden lookout tower stands the harbour watchman in a white uniform and cap, chest out, "
            "proudly looking through a long brass telescope at one single small sailboat far out at sea. Behind his back "
            "and beneath him, where he does not look, the whole harbour is in gentle chaos: a rowing boat is slowly "
            "sinking while its owner bails with a hat, three gulls fly off with a fishmonger's fish, a runaway coral "
            "parasol tumbles along the quay with a waiter chasing it, a dog swims away with a baguette, a man has fallen "
            "asleep on a drifting pedal boat. "
            "THE WORDS, large: on the cream-white board fixed across the front of the lookout tower, in deep navy bold "
            "rounded letters on one line: A sample sees 2%. with a full stop. The board takes about two fifths of the "
            "picture's width and stands against the sky. "
            "IN FRONT, large, seen from behind and cut by the bottom edge: two adults on the quay, one pointing at the "
            "sinking boat, one looking up at the watchman in disbelief. "
            "FAR: the sea, sails, and pale glass towers at the left."),
        words=W("A sample sees 2%.", "A s-a-m-p-l-e s-e-e-s 2-percent-sign", "on the board of the lookout tower")),
    "g2": dict(
        name="endless-form", line="Just three more questions.", refs=[RECEIPT, BALLOONS, PARADE],
        subject=(GAG + " "
            "WHAT IT IS: a ticket kiosk on the promenade of the same seaside city on a bright late morning, seen from the "
            "pavement at a three-quarter angle. "
            "THE JOKE: behind the kiosk window a cheerful clerk in a white shirt and a coral tie reads questions from a paper "
            "form that never ends: the cream-white paper runs out of the window, over the counter, down to the pavement and "
            "away along the whole promenade in long loops, round a lamp post, over a bench, into the far distance. The "
            "clerk holds up three fingers and smiles. In front of the window a customer with a small suitcase has aged while "
            "waiting: a long white beard down to his belt, a cobweb between his hat and the kiosk. Behind him the queue "
            "winds away; one person has set up a deck chair, one is knitting a very long scarf, one has fallen asleep on a "
            "suitcase. Far behind, the ferry they are waiting for sails away. "
            "THE WORDS, large: on the nearest loop of the paper, which lies across the front of the picture turned toward "
            "the viewer, as large as the paper in the FIRST reference image, in deep navy bold rounded letters on one line: "
            "Just three more questions. with a full stop. "
            "FAR: the sea with the ferry and pale glass towers."),
        words=W("Just three more questions.", "J-u-s-t t-h-r-e-e m-o-r-e q-u-e-s-t-i-o-n-s", "on the nearest loop of the long paper")),
    "g3": dict(
        name="next-window", line="Can I speak to your supervisor?", refs=[BALLOONS, PARADE, RECEIPT],
        subject=(GAG + " "
            "WHAT IT IS: a row of five white ticket windows under one long coral-and-white striped awning, on a square of "
            "the same seaside city on a bright late morning, seen from the square at a gentle angle so that the row runs "
            "across the picture. "
            "THE JOKE: in each of the five windows sits a smiling clerk, and each clerk points politely to the next window "
            "on the right. The clerk in the last window points all the way back to the first. In front of the middle "
            "window stands the customer, a woman in a coral jacket with a small suitcase and a worn-out look, shoes in her "
            "hand; chalk footprints on the paving show that she has already walked the whole row three times, in a loop. A "
            "pigeon follows the same loop behind her. "
            "THE WORDS, large: she holds up over her head, with both arms, a long cream-white paper ticket, turned toward "
            "the viewer and standing against the sky above the awning, about half the picture's width. On it, in deep navy "
            "bold rounded letters on one line: Can I speak to your supervisor? with a question mark. "
            "IN FRONT, at the bottom left, cut by the edges: two adults waiting on a bench, seen from behind, one checking "
            "a wristwatch. "
            "FAR: tree crowns, a tram, pale glass towers."),
        words=W("Can I speak to your supervisor?", "C-a-n I s-p-e-a-k t-o y-o-u-r s-u-p-e-r-v-i-s-o-r", "on the long paper ticket she holds up")),
    "g4": dict(
        name="not-a-refund", line="Not a refund.", refs=[BALLOONS, RECEIPT, PARADE],
        subject=(GAG + " "
            "WHAT IT IS: an ice-cream cart on the promenade of the same seaside city on a bright late morning, seen from the "
            "pavement at a three-quarter angle. "
            "THE JOKE: a customer in a pale blue shirt stands at the cart holding a bare ice-cream cone; his two scoops lie "
            "on the paving at his feet, where a small dog is already licking them. He holds out his other hand, open, for "
            "his money back. The ice-cream seller, in a coral striped apron and a paper hat, beams with generosity and "
            "presents to him, with both hands and a little bow, an enormous gift voucher: a cream-white card as wide as "
            "the cart, with a scalloped edge and a big coral ribbon bow on one corner. The customer already holds two "
            "smaller vouchers of the same kind under his arm. "
            "THE WORDS, large: across the enormous voucher, turned toward the viewer, in deep navy bold rounded letters on "
            "one line: Not a refund. with a full stop. The voucher takes about half the picture's width. "
            "IN FRONT, at the bottom right, cut by the edges: two adults with ice creams, seen from behind, watching; one "
            "has stopped mid-lick. "
            "BEHIND: the cart with its striped parasol and no writing, the railing, the sea. "
            "FAR: sails and pale glass towers."),
        words=W("Not a refund.", "N-o-t a r-e-f-u-n-d", "across the enormous voucher")),
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
    ap.add_argument("--send", choices=["draft", "final", "direct"])
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
