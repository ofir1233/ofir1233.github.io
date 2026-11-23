# Fifth round for the FYI page: the "pepper". Wide-angle, face-in-the-lens pictures in the approved studio look. PAID with --send.
import sys, threading
from pathlib import Path
import fyi_styles as F, fyi_styles4 as S4, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_styles5"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""; F.SIZE = "1024x1536"
LENS = (
    "THE CAMERA: an extreme wide-angle, almost fisheye lens held very close to the subject, so the nearest thing is huge and "
    "bulges toward the viewer, the room bends away round it and the far things are small. Playful, intimate and funny, with "
    "sharp sunlit-style highlights and crisp cast shadows, drawn with confident ink lines."
)
def P(scene): return S4.LOOK + "\n\n" + LENS + "\n\n" + S4.ROOM + "\n\n" + scene + "\n\n" + S4.PEOPLE + "\n\n" + S4.NO
F.STYLES = {
    "q1-phone-eye": ("What the phone sees", P("THE SCENE: seen from the phone itself, which lies on the desk looking straight up. Two "
        "musicians lean over it into the lens, very close: a saxophonist in headphones and sunglasses with the saxophone hanging "
        "from its strap, and a singer with one hand on her headphone; his finger comes down toward the lens to press record, "
        "huge in the foreground. Above them the studio bends round the edges of the picture: the wooden diffuser panels, the boom "
        "microphone, a pink neon tube, plants. A tall picture.")),
    "q2-cat": ("The studio cat", P("THE SCENE: the studio's tabby cat, very close to the lens, its face filling the upper half of "
        "the picture: enormous round curious eyes, pink nose, long white whiskers. It is peering down at a phone that lies on the "
        "desk in the lower corner of the picture, the way a cat watches a fishbowl: on the phone's glowing screen a pink sound "
        "wave moves, and it is reflected in the cat's eyes. One paw is lifted, about to tap the glass. Behind the cat, small and "
        "bent by the lens, the band is in the middle of a serious take and has not noticed. A tall picture.")),
    "q3-dog": ("The listener", P("THE SCENE: the crew's golden retriever sits in the middle of the studio, seen close and from "
        "slightly below, wearing a pair of big professional studio headphones and a black cap with nothing written on it, eyes "
        "closed, nose lifted, completely lost in the music, as serious as any musician. Behind it, small and bent by the lens, "
        "the saxophonist and the bass player are mid-take; a phone leans against a monitor speaker, its screen glowing. A tall "
        "picture, deadpan and warm.")),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("styles", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
