# Third round of STYLE drafts for the FYI page: the studio scene, grown up. PAID when run with --send. Key from OPENAI_API_KEY, never printed.
import sys, threading
from pathlib import Path
import fyi_styles as F, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_styles3"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""
SCENE = (
    "THE SCENE: a working studio in a converted warehouse at night, a week before a show. Four collaborators, each absorbed "
    "in their own part and none looking at the viewer: a woman producer at a synthesizer, headphones round her neck, eyes on "
    "her hands; a man at a monitor that shows an abstract visualizer of glowing arcs, chin on his fist; a woman fixing three "
    "record covers of abstract art to the wall; a man leaning in the doorway reading a phone that lights his face. In front, "
    "large and cut by the bottom edge: a mixing desk with lit knobs and a second phone lying face up. Low camera, wide lens, "
    "strong depth, bare concrete and brick, cables, speaker stacks, a rack of gear."
)
PEOPLE = (
    "PEOPLE: original characters, working artists aged about 25 to 32, with realistic adult proportions and faces, tired and "
    "focused, dressed in real clothes (work jackets, hoodies, boots). Not cute, not cartoonish, not anime: no big eyes, no "
    "blushing cheeks, no smiling at the viewer."
)
NO = (
    "NOT IN THE PICTURE: crowns, stars, hearts, lightning bolts, smiley faces, sparkles, cute stickers, lava lamps, toys, "
    "rainbows, pastel colours. No readable words, no letters, no numbers, no logos, no existing characters."
)
BASE = (
    "THE LOOK: a frame from a stylised 3D animated feature for a grown-up audience, finished to look hand-painted and printed: "
    "solid 3D forms and real cinematic lighting, every surface built from visible angular brush strokes; halftone dots in the "
    "shadows and the light beams; offset cyan and magenta print fringes on the edges, as if the colour plates were out of "
    "register; hand-drawn ink contour lines and quick sketch hatching over the render."
)
F.STYLES = {
    "m1-cinema": ("Cinematic", BASE + " MOOD: a night scene from a film: most of the picture is deep navy and near-black, and the "
        "light comes from two sources only: one hot neon pink tube (#FF2E93) and the cold cyan of the screens. Strong contrast, "
        "long shadows, pink rim light on shoulders and hair, haze in the air. Three colours carry the picture: pink, cyan, navy. "
        "The walls carry old layered graffiti: big rough spray throw-ups in one colour, drips, torn wheat-pasted posters of "
        "abstract shapes.\n\n" + SCENE + "\n\n" + PEOPLE + "\n\n" + NO),
    "m2-graphic": ("Graphic print", BASE + " MOOD: pushed toward a printed comic page: large areas of solid black ink for the "
        "shadows, hard-edged planes of flat colour, coarse halftone, heavy misregistration, white paper showing through in the "
        "highlights, a few torn-paper edges and strips of tape. A tight palette: hot neon pink (#FF2E93), black, off-white and "
        "one cold blue (#0B67F8). The walls carry rough graffiti as big abstract brush and spray gestures.\n\n" + SCENE + "\n\n" + PEOPLE + "\n\n" + NO),
    "m3-paint": ("Raw paint", BASE + " MOOD: rough and physical, like a street painter's canvas: thick dry-brush strokes and "
        "palette-knife scrapes, spray paint mist and long drips, scratches, the under-drawing in charcoal still showing. The "
        "background wall is a field of raw hot pink and magenta paint dragged over dark navy, with burnt orange and a little "
        "violet; the figures are painted darker and more solid against it. Neon pink light spills over everything.\n\n" + SCENE + "\n\n" + PEOPLE + "\n\n" + NO),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("styles", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
