# Second round of STYLE drafts for the FYI page (low quality). PAID when run with --send. Key from OPENAI_API_KEY, never printed.
import sys, json, threading
from pathlib import Path
import fyi_styles as F, descent_draft as D
F.OUT = Path(__file__).resolve().parent / "out_fyi_styles2"; F.LOG = F.OUT / "log.jsonl"; F.SCENE = ""
LOOK = (
    "THE LOOK: a frame from a stylised 3D animated feature that is finished to look hand-painted and printed. Solid 3D forms and "
    "real cinematic lighting, but every surface carries visible brush strokes; shadows and skies break into halftone dots; "
    "edges carry offset cyan and magenta print fringes, as if the colour plates were slightly out of register; hand-drawn ink "
    "contour lines, hatching and quick sketch scribbles are drawn over the render; a few motion streaks and flecks of paint. "
    "COLOURS: loud and glowing: hot neon pink (#FF2E93) as the leading colour, electric cyan, violet, a strong cobalt blue "
    "(#0B67F8), small hits of acid yellow-green, against deep navy and near-black. Neon rim light on every figure. "
    "STREET ART: rough graffiti, spray paint with drips, paint-marker doodles (stars, arrows, crowns, lightning bolts, "
    "spirals, scribbles) and die-cut stickers with thick white borders. All of it abstract: no readable words, no letters, no "
    "numbers, no logos, no existing characters. PEOPLE: original characters, stylish young adults in their early twenties with "
    "natural proportions and expressive faces, in streetwear."
)
F.STYLES = {
    "n1-crew": ("Crew in the studio, at night", LOOK + "\n\nTHE SCENE: a small creative studio at night, lit by pink and cyan neon and by "
        "screens. Four friends who make music and pictures together: a woman at a synthesizer with headphones round her neck, a "
        "man at a monitor showing an abstract visualizer of glowing arcs, a woman pinning three record covers of abstract art to a "
        "wall crowded with stickers and spray paint, and a man leaning in the doorway holding a phone whose screen lights his face. "
        "In front, large and cut by the bottom edge: a mixing desk with glowing knobs and a second phone lying face up. A wide "
        "picture, low camera, strong depth."),
    "n2-stickers": ("Sticker wall", LOOK + "\n\nTHE SCENE: a collage that looks slapped onto a city wall. The wall is rough concrete "
        "covered in layers of spray paint, drips and marker doodles. Stuck on it, overlapping, as big die-cut stickers with thick "
        "white borders and small drop shadows: four young creators painted in the 3D-painted look (a singer with headphones, a "
        "filmmaker with a camera, a designer holding a poster of abstract shapes, a promoter holding up a phone), a cassette, a "
        "turntable, a sound wave, a speech bubble with nothing written in it, lightning bolts and stars. Strips of torn tape, a "
        "peeling corner, halftone patches. Bold, crowded at the edges, with one clear open patch of wall near the middle."),
    "n3-hero": ("One creator, close", LOOK + "\n\nTHE SCENE: a young woman musician on a rooftop at dusk, seen from a low angle, "
        "mid-step, one hand holding a phone up near her face, its screen throwing pink and cyan light on her; headphones round her "
        "neck, an oversized jacket, sneakers. Behind her a wall of rough graffiti and stickers, and beyond it the city's lights "
        "smeared into streaks. Paint flecks and sketch lines trail from her like a sound wave. A tall, dynamic picture with a big "
        "clear shape and a strong diagonal."),
}
if __name__ == "__main__":
    todo = [k for k in F.STYLES if not (F.OUT / (k + ".png")).is_file()]
    print("styles", todo, "expected about $%.2f" % (0.025 * len(todo)))
    if "--send" not in sys.argv: print("DRY RUN"); sys.exit()
    key = D._key(); ts = [threading.Thread(target=F.send, args=(k, key)) for k in todo]; [t.start() for t in ts]; [t.join() for t in ts]
