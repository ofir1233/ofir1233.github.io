# First brand-development drafts for FYI: the cat's character sheet and a first sticker set. PAID with --send (low quality).
import sys, threading
from pathlib import Path
import fyi_styles as F, fyi_styles4 as S4, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_brand1"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""; F.SIZE = "1536x1024"
CAT = (
    "THE CAT: one original character, the same animal in every drawing: a young adult short-haired tabby with a lean, real "
    "cat's build; warm brown and black mackerel stripes; a white chin, white chest and four white paws; a pink nose; amber "
    "eyes of a natural size (large and alert, but a real cat's eyes, not a cartoon's); a small notch in the tip of the left "
    "ear; no collar. Curious, focused and self-possessed: a studio cat, not a kitten and not a toy."
)
NO = ("NOT IN THE PICTURE: crowns, stars, hearts, lightning bolts, smileys, sparkles, toys. No words, no letters, no numbers, "
      "no labels, no captions, no logos, no existing characters.")
F.STYLES = {
    "b1-cat-sheet": ("The cat: character sheet", S4.LOOK + "\n\n" + CAT + "\n\nTHE SHEET: a character model sheet on a warm off-white "
        "paper ground with a little halftone texture, laid out in two tidy rows with generous space between the drawings and "
        "nothing overlapping. Top row, the whole cat standing, four views of the same pose: front, three-quarter, side, back. "
        "Bottom row, five moments: the head close with a wide-angle lens, peering down at something; sitting upright, staring "
        "with total focus; one paw lifted, about to tap; curled asleep on a mixing desk; sitting with big studio headphones "
        "on, eyes closed. Pink and cyan rim light on every drawing.\n\n" + NO),
    "b2-stickers": ("First sticker set", S4.LOOK + "\n\n" + CAT + "\n\nTHE SHEET: twelve separate die-cut stickers laid out in a tidy "
        "grid of four by three on a warm off-white ground, with clear space between them. Each sticker has a thick white border "
        "and a small soft shadow, as if peeled from a sheet. The twelve: the cat's head peering over an edge; the cat's paw "
        "tapping a phone screen; the cat asleep on a speaker; a pink sound wave; a studio microphone in its shock mount; a "
        "saxophone; a pair of studio headphones; a vinyl record in a sleeve of abstract art; a speech bubble with nothing "
        "written in it; a concert ticket with abstract shapes and no writing; a hand holding up a phone with a glowing screen; a "
        "spray can with a pink drip.\n\n" + NO),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("drafts", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
