# Fourth round of STYLE drafts for the FYI page: serious creators in a professional studio. PAID with --send. Key from OPENAI_API_KEY, never printed.
import sys, threading
from pathlib import Path
import fyi_styles as F, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_styles4"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""
LOOK = (
    "THE LOOK: a frame from a stylised 3D animated feature, finished to look hand-painted and printed: solid 3D forms and real "
    "cinematic lighting, every surface built from visible confident brush strokes; halftone dots in the shadows and in the light "
    "beams; offset cyan and magenta print fringes along the edges, as if the colour plates were slightly out of register; "
    "hand-drawn ink contour lines and quick sketch hatching over the render; a few painted streaks that follow the sound and the "
    "movement of the players. COLOURS: rich and glowing: hot neon pink (#FF2E93) leads, with electric cyan, violet and a strong "
    "cobalt blue (#0B67F8), against the warm honey wood of the studio and deep navy shadows. Pink and cyan rim light on every "
    "figure. Vivid and alive, not dark and not gloomy."
)
ROOM = (
    "THE PLACE: a professional recording studio during a late session: walls of wooden acoustic diffuser panels (grids of small "
    "wooden blocks of different depths), warm slatted wood, a large studio condenser microphone in its shock mount on a boom "
    "stand, keyboards, monitor speakers, cables on the floor, tall green plants, a glass control-room window. A few signs of the "
    "people who work here: stickers on a flight case and on a laptop lid, one canvas of abstract spray-painted art leaning on "
    "the wall."
)
PEOPLE = (
    "PEOPLE: original characters: accomplished musicians in their late twenties and thirties, with realistic adult proportions "
    "and faces, stylish and at ease (hoodies, plain tees, a cap, sunglasses, a chain, good headphones). They are absorbed in "
    "playing and listening to each other; confident, warm, enjoying it. Nobody poses for the viewer. Not cute and not cartoonish; "
    "not grim, not tired, not rebellious."
)
NO = ("NOT IN THE PICTURE: crowns, stars, hearts, lightning bolts, smileys, sparkles, toys. No readable words, no letters, no "
      "numbers, no logos or brand marks on clothes or gear, no existing characters, no real persons.")
def P(scene): return LOOK + "\n\n" + ROOM + "\n\n" + scene + "\n\n" + PEOPLE + "\n\n" + NO
F.STYLES = {
    "p1-session": ("The session", P("THE SCENE: four musicians mid-take. In the middle a saxophonist in a dark hoodie, headphones and "
        "sunglasses, leaning into his tenor saxophone; at the left a bass player in a white tee and a beanie with headphones, "
        "watching him and nodding; behind them a woman at a keyboard, eyes closed, one hand raised from the keys; at the right, "
        "close to the viewer and cut by the edge, a singer at the studio microphone, one hand on her headphone. On a music stand "
        "in front a phone stands upright, its screen glowing. A wide picture, eye-level camera, strong depth.")),
    "p2-sax": ("One player, close", P("THE SCENE: a close view from slightly below of one saxophonist in the middle of a phrase: "
        "dark hoodie, big headphones, round sunglasses that reflect small pink and cyan lights, the brass of the saxophone "
        "catching the pink light. Behind him, soft and out of focus, the wooden diffuser panels and a second musician at a "
        "keyboard. A tight, bold composition with one large clear shape.")),
    "p3-voice": ("The voice", P("THE SCENE: a singer seated at the studio microphone, seen from the side: a cap, tinted glasses, a "
        "full beard, a patterned short-sleeved shirt with an abstract pattern, a watch; one hand resting on his knee, eyes closed, "
        "mid-line. Tall green plants around him, the slatted wooden wall behind, the long boom arm of the microphone crossing the "
        "picture. On a small table beside him a phone lies face up with a glowing screen, next to a cup. Calm and powerful.")),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("styles", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
