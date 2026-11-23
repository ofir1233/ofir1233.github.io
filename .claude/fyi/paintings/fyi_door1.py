# FYI: low-cost sketches of the home page entrance section ("the door"). PAID with --send (low quality).
import sys, threading
from pathlib import Path
import fyi_styles as F, fyi_styles4 as S4, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_door1"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""; F.SIZE = "1536x1024"
PAGE = (
    "WHAT THIS IS: a design mock-up of one wide section of a portfolio website, seen straight on, filling the whole frame. "
    "The page ground is a warm off-white paper colour, bright and airy, and it stays light: the art sits ON the light page and "
    "breaks out over it, the page never turns dark. In the left third: one very large heavy dark-ink sans-serif heading that reads "
    "exactly FYI, under it two short lines of small grey text drawn as soft grey bars (not readable words), and one dark rounded "
    "pill button with a small arrow. The other two thirds hold the art described below, large, overlapping the left column a little.\n\n"
    "THE ART STYLE of everything that is not page or type: " + S4.LOOK
)
NO = ("NOT IN THE PICTURE: crowns, stars, hearts, lightning bolts, smileys, sparkles, toys, browser chrome, cursors. The only "
      "readable word anywhere is FYI in the heading. No other letters, numbers, logos or existing characters.")
ANIMALS = ("The animals are real animals with real anatomy and fur, painted like portraits of working musicians, each with one or "
           "two real accessories; cool and characterful, not cute, never cartoon bodies.")
def P(art): return PAGE + "\n\n" + art + "\n\n" + NO
F.STYLES = {
    "d1-cast": ("Pick who you are", P(
        "THE ART: a loose wall of large die-cut portrait stickers with white borders, overlapping and slightly rotated, each on its "
        "own colour ground (hot pink, cobalt, honey, violet, cyan): a hamster in round sunglasses with crossed drumsticks, a golden "
        "retriever in a cap with a saxophone, an alpaca in a knitted beanie, a tabby cat at a studio microphone, a beagle in a beanie "
        "and big headphones, a grey parrot in a backwards cap. " + ANIMALS + " In front of the wall stands one modern smartphone, "
        "upright, screen true black, showing a round profile picture slot; the hamster sticker is in mid-air, peeling off the wall "
        "and flying into that slot, with a hand-inked motion scribble behind it. Soft real shadows of stickers and phone on the paper.")),
    "d2-lens": ("What the phone sees", P(
        "THE ART: one large window cut into the page in the shape of a tall smartphone screen with big rounded corners, tilted a few "
        "degrees. Through it, an extreme wide-angle fisheye view looking UP from a phone lying on a studio desk: a saxophonist in "
        "headphones and a cap leans over the lens, his huge thumb coming straight at the viewer to press a round hot pink record "
        "button at the bottom of the window; a singer laughs beside him; behind them a warm wooden recording studio with diffuser "
        "panels, a microphone and plants. The thumb and the saxophone bell break OUT of the window frame over the paper page, with a "
        "soft shadow. From the record button a big painted hot pink sound wave runs left across the page behind the heading. Two or "
        "three die-cut stickers (a ticket, a record sleeve) are stuck on the window's edge.")),
    "d3-glass": ("Out of the glass", P(
        "THE ART: one modern smartphone stands upright, slightly turned, screen true black with a chat thread of dark grey bubbles and "
        "one hot pink bubble, and small round animal portraits as the chat's profile pictures. Things the chat is about are leaving "
        "the screen and becoming real, large, on the page around it: a huge painted hot pink sound wave shooting out of a voice "
        "message to the right; a square record sleeve with a black vinyl half out, sliding out of the glass, bigger than the phone; "
        "a concert poster pasted on the page with torn tape at its corners showing concentric copper arcs; a ticket stub. Thin "
        "hand-inked arrows tie each object to its bubble. Soft real shadows on the paper. The phone is the smallest of the big things.")),
    "d4-door": ("The door", P(
        "THE ART: a giant smartphone stands on the page like a real door left ajar, hinged on its left edge, seen with a wide-angle "
        "lens from low down so it towers. Its black glass front is covered in die-cut stickers and a spray-painted pink scribble. "
        "Through the gap pours hot pink and cyan light that spills across the off-white page as a long wedge of colour and halftone "
        "dots, and inside the gap is a glimpse of a warm wooden recording studio full of life: a singer at a microphone, a hand on a "
        "keyboard, and a golden retriever in headphones poking its head round the door to look at the viewer. A cable runs out "
        "under the door across the page toward the pill button.")),
    "d5-popup": ("The room in the pocket", P(
        "THE ART: a smartphone lies flat on the page, seen from above at an angle with a wide lens, and out of its black screen a "
        "whole recording studio rises like a pop-up book in cut layers with depth: wooden diffuser walls at the back, then a "
        "drummer hamster in round sunglasses on a small drum kit, a saxophonist in headphones, a singer at a microphone, a tabby cat "
        "on a speaker, and at the very front a tiny crowd seen from behind with raised phones. " + ANIMALS + " The layers cast "
        "shadows on each other and on the paper page; hot pink neon tube along the back wall; a few die-cut stickers and inked "
        "scribbles spill off the phone onto the page.")),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("drafts", todo, "expected about $%.2f" % (0.03 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
