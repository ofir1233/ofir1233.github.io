# FYI door v2: the room seen from inside the phone, now with animals in it. PAID with --send (low quality drafts).
import sys, threading
from pathlib import Path
import fyi_styles as F, fyi_styles4 as S4, fyi_styles5 as S5, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_door2"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""; F.SIZE = "1024x1536"
VIEW = (
    "THE VIEW: we are INSIDE a phone that lies on the studio desk, looking straight up through its glass screen. Everything that "
    "matters sits in the middle two thirds of the picture's width; the left and right edges hold only room. Nothing is drawn on "
    "the glass: no buttons, no icons, no interface, no phone frame."
)
THUMB = (
    "A thumb comes straight down at us and presses FLAT against the glass in the lower middle of the picture: we see the soft "
    "PAD of the thumb from underneath, with its fingerprint ridges, pressed pale and slightly flattened where it touches, never "
    "the nail. The hand and forearm rise away from it, huge and foreshortened."
)
ANIMALS = (
    "THE ANIMALS are real animals with real anatomy and real fur, painted like portraits of working musicians, each with one or "
    "two real accessories; cool and characterful, deadpan, never cute, never cartoon animals with human bodies."
)
def P(scene): return S4.LOOK + "\n\n" + S5.LENS + "\n\n" + VIEW + "\n\n" + S4.ROOM + "\n\n" + scene + "\n\n" + ANIMALS + "\n\n" + S4.PEOPLE + "\n\n" + S4.NO
F.STYLES = {
    "e1-crew-and-dog": ("The crew, the dog and the cat", P(
        "THE SCENE: three faces lean over the phone into the lens, very close. On the left a saxophonist in headphones, a cap and "
        "sunglasses, smiling, the saxophone hanging from its strap: the thumb is his. " + THUMB + " On the right a singer with "
        "curly hair, one hand on her headphone, laughing. Between and below them, pushing in closest of all from the lower right, "
        "the crew's golden retriever in big professional studio headphones, its wet nose huge and near the glass, sniffing the "
        "phone with total seriousness. High behind them a tabby cat lies on a monitor speaker and watches. Above, the studio bends "
        "round the edges: wooden diffuser panels, the boom microphone, a pink neon tube, plants. A tall picture.")),
    "e2-animal-band": ("The animal band", P(
        "THE SCENE: a band of animals leans over the phone into the lens, very close, and one human hand. In the middle a golden "
        "retriever in a black cap and wired earbuds with a saxophone on a strap round its neck, calm, eyes half closed. On the "
        "right an alpaca in a slouchy knitted beanie, long neck bending in from the top, sleepy and amused. On the left, standing "
        "on the desk edge, a Syrian hamster in round dark sunglasses holding a pair of drumsticks. High behind them a tabby cat "
        "at the boom microphone. From the lower left a human musician's hand in a hoodie sleeve reaches in: the thumb is theirs. "
        + THUMB + " Above, the studio bends round the edges: wooden diffuser panels, a pink neon tube, plants. A tall picture.")),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("drafts", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
