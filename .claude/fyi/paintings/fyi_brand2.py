# FYI: a first draft of the avatar cast (animal personas chosen at sign-up). PAID with --send (low quality).
import sys, threading
from pathlib import Path
import fyi_styles as F, fyi_styles4 as S4, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_brand2"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""; F.SIZE = "1536x1024"
RULES = (
    "THE ANIMALS: each is a real animal with real anatomy, real fur or feathers and eyes of a natural size, painted like a "
    "portrait photograph of a musician, never a cartoon animal with a human body. Each wears one or two real accessories and "
    "has its own unmistakable character and its own kind of music. Adult animals. Cool and characterful, not cute."
)
NO = ("NOT IN THE PICTURE: crowns, stars, hearts, lightning bolts, smileys, sparkles, toys. No words, no letters, no numbers, "
      "no labels, no captions, no logos, no existing characters.")
F.STYLES = {
    "c1-avatars": ("The avatar cast", S4.LOOK + "\n\n" + RULES + "\n\nTHE SHEET: a tidy grid of eight square avatar portraits, four "
        "across and two down, with even gaps between them on a deep navy ground. Each square has its own single flat ground "
        "colour and shows one animal from the chest up, facing the viewer or in three-quarter view, large in its square. "
        "Top row, left to right: (1) a Syrian hamster, the punk drummer: round dark sunglasses, a tiny leather jacket collar, "
        "a pair of drumsticks crossed in front of it, fur spiked up, on a hot pink ground; (2) a golden retriever, the calm "
        "jazz player: a plain black cap, wired earbuds, eyes closed, a saxophone strap round the neck with the top of the "
        "saxophone showing, on a deep cobalt ground; (3) an alpaca, the laid-back reggae singer: a slouchy knitted beanie, "
        "half-closed sleepy eyes, a slow easy look, a small hoop in one ear, on a warm honey-wood ground; (4) a tabby cat, the "
        "singer: sleek, chin lifted, one eye on the viewer, at a vintage studio microphone, on a violet ground. Bottom row: "
        "(5) a beagle, the hip-hop producer: a beanie, sunglasses, a gold chain, big headphones round the neck, on a cyan "
        "ground; (6) a grey parrot, the MC: head cocked, beak open mid-line, a small cap worn backwards, on a deep pink "
        "ground; (7) a white rabbit, the electronic producer: mirrored visor glasses, one ear folded, a synthesizer's keys at "
        "the bottom edge, on a navy ground with a thin pink edge light; (8) a tortoise, the ambient composer: big studio "
        "headphones, eyes half closed, utterly still, on a paper-coloured ground.\n\n" + NO),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("drafts", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
