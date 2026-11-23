# FYI: the art system

How the chosen look becomes a repeatable production, picture by picture and screen by screen.

Read for this: the four review sheets in `.claude/review/fyi/styles/` (pepper, studio-session, neon-styles, neon-grown-up), the full-size drafts behind them (`out_fyi_styles4`, `out_fyi_styles5`), the scripts `fyi_styles4.py` and `fyi_styles5.py`, the first brand drafts that already exist (`out_fyi_brand1/b1-cat-sheet.png`, `b2-stickers.png`, made 23.11 at 16:06), the painting skill, `work/fyi.html`, `work/fyi-scenes.js`, the depth code in `work/hear-page.css`, and the provider's image guide. Nothing was run, nothing was paid, nothing in the repo was touched. All measurements below were made with PIL on the existing drafts.

**Owner's correction, 23.11, built into this version:** the cat is not a brand character. In his words, he does not want to focus on the cat; there is "this style of relatable animals" that can blend in "here and there, especially with the wide focal lens that brings depth into the picture". His references are mostly real photographs: real animals with real accessories, deadpan and cool. So section 2 is THE ANIMALS (no mascot, no sheet, each a one-off), the consistency effort moves to the four crew members and the studio, and the lens gets its own section (1.3).

This file sits beside `/private/tmp/claude-501/fyi-brand/narrative.md`, which decides where art may appear (the glass rule, the loudness ladder). Its section 3 was written before the correction: it makes the cat a recurring "witness" that wears nothing and gives the dog no role. The owner's words replace that; the rest of its placement rules still fit what follows.

---

## 0. The short answer to "it is still in diapers"

Six approved pictures are a mood. A system needs seven things the drafts do not have yet:

1. **A lens that is written, not hoped for.** The wide lens close to a face is the thing the owner values. It has to be specified with a camera position, three size steps and overlaps, given as an image as well as in words, and measured (1.3). It is also what makes the site's layered depth work.
2. **A light with a reason.** Today pink is a wash over everything. Rule: the pink light comes from the phone's screen and dies within an arm's length; cyan comes from the control-room window; the rest falls to navy. Pink then means FYI, the pictures get the dark they lack, and the light itself adds depth.
3. **A print that is the same on every picture.** The model paints; code prints. Halftone, plate offset and paper grain are applied by one script and one CSS layer, so the finish cannot drift, costs nothing, and can move.
4. **People and a place that hold.** Four crew members with fixed faces and clothes, one room with fixed landmarks, both kept as reference sheets and never as words alone. This is where the consistency work goes.
5. **Animals as spice.** A different real animal each time, about one picture in six, never a character (section 2).
6. **A clock and three sizes of voice.** The story has five times of day; the same room in different light gives variety inside the look. And three sizes: World (a full scene), Moment (one subject on a flat ground), Mark (sticker, texture, cover). Most product screens take a Moment, a Mark or nothing.
7. **Numbers.** Every result is measured against targets before the owner sees it, as the painting skill does for the portfolio.

---

## 1. The style bible

### 1.1 What the drafts actually are (measured)

Method: picture reduced to 384 px wide, HSV per pixel. A pixel counts as coloured when S >= 0.25 and V >= 0.20. Bands by hue: pink 310-345, salmon 345-15, wood 15-45, yellow 45-75, green 75-165, cyan 165-200, cobalt 200-245, violet 245-310. Dark = V < 0.25. Paper = V > 0.88 and S < 0.14.

| draft | pink | warm (salmon + wood + yellow) | cool (cyan + cobalt + violet) | dark | paper | hue of the darkest 2% |
|---|---|---|---|---|---|---|
| p1 session | 25 | 40 | 27 | 10 | 0.2 | 275 |
| p2 sax | 19 | 46 | 22 | 16 | 0.0 | 266 |
| p3 voice | 22 | 53 | 20 | 8 | 0.0 | 286 |
| q1 phone eye | 10 | 64 | 16 | 10 | 0.0 | 240 |
| q2 cat | 26 | 54 | 10 | 8 | 0.2 | 325 |
| q3 dog | 17 | 71 | 5 | 9 | 0.3 | 319 |

All numbers are percent of the picture. What they say, and what the eye confirms at full size:

- **It is a warm picture with pink on it, not a neon picture.** Warm tones cover 40 to 71%. Cyan is 0 to 1% in every draft, cobalt 1 to 8%. The prompt says "cyan, violet and cobalt"; the model delivered wood. Cause: the PLACE block names wood four times (diffuser wall, slatted wall, floor, desk) and pink light on honey wood turns salmon.
- **No darks and no paper.** Dark tone is 8 to 16%, bare paper 0%. Neon only glows next to night, and print only reads as print where paper shows. "Vivid and alive, not dark and not gloomy" worked too well: everything is mid-tone. In q2 and q3 the darkest tone is dark magenta-brown (hue 319 to 325), which is the muddy feeling.
- **The print is weak.** Halftone appears in two or three small corners (the ceiling in q1, the phone glass in q2). The "offset cyan and magenta fringes" came out as a glowing pink and cyan outline round every figure, because the same paragraph also asks for "pink and cyan rim light on every figure" and the model merged the two. A glowing two-colour outline is the most recognisable sign of generated "neon" art.
- **Over-busy and repeating.** Every picture has the full kit: diffuser wall, plants, boom microphone, flight case, laptop with blobs, canvas with blobs, cables. The block lists them all, so the model paints them all.
- **Generic details.** The "stickers" are coloured blobs. The "abstract spray-painted canvas" is the same pink-blue smear each time. The swooshes of "sound" leave the saxophone bell at random. Plants are yellow-green monstera (off palette).
- **The same two people.** The men: beard, cap, sunglasses, chain, in four of six drafts. Sunglasses indoors hide the eyes and read as posing. The crew of the story (Maya, Theo, Ines, Kofi) has no faces yet.
- **Hands and instruments.** q1: the finger is right (four fingers and a thumb, good nail) but the saxophone hangs behind it with its bell touching the fingertip, so the two cannot be separated. p1 and p2: the saxophone key-work is a scatter of pearls, and in p1 the lower hand sits on the bell instead of the lower stack. q2: one paw lies on the desk with no leg behind it, and the cat's body turns into a wall of fur behind the keyboard player. The bass headstocks follow one well-known maker's shape.
- **The lens works in round 5 and is absent in round 4.** q1 to q3 have real depth: the near head is roughly 8 to 15 times the width of the far heads, and the ceiling bends. p1 to p3 are eye-level pictures, and p2 asks for a background "soft and out of focus", which is a long-lens look: the opposite of what he values.
- **Words alone do not hold an identity.** q2, b1 and b2 show three different cats, and b1 and b2 used the identical paragraph. For animals this no longer matters (each is a one-off). For the four crew members it is the whole problem (2.5).
- **The animals drifted toward cartoon.** q2's cat has glassy domed eyes about 0.23 of the head's width; the b2 sticker cat is a kitten. The b1 sheet, oddly, is closest to his new references: a real animal's anatomy and eyes. The dog in q3 is right: a real retriever, eyes closed, real headphones.

### 1.2 The blocks

Prompt order for every world scene: MAP (what each reference image is) + LOOK + PRINT + LIGHT + CAMERA + PLACE + SCENE + PEOPLE or ANIMAL + COUNT + NOT.

**Keep word for word** (these sentences did their job in the drafts):

- "a frame from a stylised 3D animated feature, finished to look hand-painted and printed: solid 3D forms and real cinematic lighting, every surface built from visible confident brush strokes"
- "hand-drawn ink contour lines and quick sketch hatching over the render"
- "an extreme wide-angle, almost fisheye lens held very close to the subject, so the nearest thing is huge and bulges toward the viewer, the room bends away round it and the far things are small"
- "walls of wooden acoustic diffuser panels (grids of small wooden blocks of different depths)" and "a large studio condenser microphone in its shock mount on a boom stand"
- "Nobody poses for the viewer. Not cute and not cartoonish; not grim, not tired, not rebellious."
- the scene phrases that carried the humour: "the way a cat watches a fishbowl", "has not noticed", "eyes closed, nose lifted, completely lost in the music, as serious as any musician", "deadpan and warm".
- "crowns, stars, hearts, lightning bolts, smileys, sparkles, toys".

**Change:**

| in the scripts | problem seen | replace with |
|---|---|---|
| "Pink and cyan rim light on every figure" | glowing two-colour outlines everywhere | the LIGHT block: two lights, each with a source |
| "halftone dots in the shadows and in the light beams; offset cyan and magenta print fringes along the edges" | almost no halftone; fringes became glow | the PRINT block (hard, thin, on the near figure only), plus the code print pass (1.6) |
| "rich and glowing ... Vivid and alive, not dark and not gloomy" | no darks, no paper, mid-tone soup | "a dim room with strong colour"; navy named as the deepest tone; faces kept in the light so it does not slide back to round 3 |
| "against the warm honey wood of the studio" + four wooden things in PLACE | 40 to 71% warm | wood in ONE place (the diffuser wall); everything else named in cool colours |
| the full list of props in every prompt | every picture has everything | fixed landmarks + two or three props chosen per picture + a COUNT block |
| "stickers on a flight case and on a laptop lid", "one canvas of abstract spray-painted art" | blobs and smears | none until the real stickers and covers exist; then they go in as a reference image |
| "a cap, sunglasses, a chain" on the people | one repeated man, hidden eyes | wardrobe moves to the cast sheet; people: "eyes visible, no sunglasses". The cap, the sunglasses and the chain now belong to the animals (section 2), which is funnier and frees the people to be people |
| "late twenties and thirties" | fine, but the filter has refused twice | "adults aged 28 to 40", in every prompt, also for small far figures |
| "sharp sunlit-style highlights" | pulled the pictures to daylight orange | "hard-edged highlights and crisp cast shadows from the phone's light" |
| "Playful, intimate and funny" in the lens block | mood words push toward cute | keep "intimate"; the humour is written into the scene as behaviour |
| "eye-level camera" (p1), "soft and out of focus" (p2) | flat, long-lens pictures | every world scene uses the CAMERA block; no blur anywhere |
| "a few painted streaks that follow the sound" | random swooshes | at most one streak, and it travels from the instrument INTO the phone |
| "tall green plants" | yellow-green, off palette | "one tall plant with dark teal leaves" or no plant |

**The blocks, version 2** (copy as they are; square brackets are the only parts that change).

MAP (edits endpoint, always first):
> The FIRST reference image is the cast sheet: the people of this picture are these people and nobody else. The SECOND reference image is the room: this picture is in that room, with its walls, window and ceiling. The THIRD reference image is a finished picture by the same hand: take from it the paint, the ink line and the light, not its subject. The LAST reference image is a rough map of coloured boxes: keep the place, the size and the colour of every box and paint the real thing there. Do not paint boxes.

LOOK:
> THE LOOK: a frame from a stylised 3D animated feature, finished to look hand-painted and printed: solid 3D forms and real cinematic lighting, every surface built from visible confident brush strokes; hand-drawn ink contour lines and quick sketch hatching over the render. Shadows are flat shapes with a hard painted edge, two or three tones, never a smooth gradient. The ink line is deep navy, heavier on the near figure, thin or absent far away. One large clear shape first, detail second. Everything is sharp from the nearest thing to the farthest wall. No blur, no glow, no bloom, no lens flare, no rays, no floating particles, no airbrush, no glossy plastic, no photo realism.

PRINT (world scenes; left out of sheets, stickers and anything the code pass will print):
> THE PRINT: the picture is printed in four inks on warm paper. The shadows and the beam of the phone's light are coarse round halftone dots in navy ink, large enough to count. The plates are slightly out of register: one thin hard cyan line on one side of the near figure's outline and one thin hard magenta line on the other side, and nowhere else. The few highest lights are bare warm paper (#F4EDE2).

LIGHT (night, the default; the other hours of the story are written the same way):
> THE LIGHT: night; the room lamps are off. The brightest thing in the picture is the screen of the phone. It throws hot neon pink light (#FF2E93) on what is nearest to it, and the pink dies away within an arm's length. From behind, through the control-room window, comes cool electric cyan light (#19D3F3) that draws a rim on the far side of each figure. What neither light reaches falls into cobalt (#0B67F8) and violet (#7A3CFF) shadow; the deepest shadow is navy (#0D1030), never black, never grey, never brown. Honey wood (#C98A4B) shows only in the small areas the pink does not touch. Faces are in the light and easy to read. A dim room with strong colour, like a stage a minute before the show.

CAMERA: see 1.3.

PLACE:
> THE PLACE: one professional recording studio, the room of the SECOND reference image. Always there: one wall of wooden acoustic diffuser panels (a grid of small wooden blocks of different depths); opposite it the glass window of the control room, lit cyan from inside; above, a dark ceiling with one oval tray of six small round lamps. In this picture also: [two or three of: a large studio condenser microphone in its shock mount on a boom stand / a keyboard on a stand / two monitor speakers / a closed flight case / a mixing desk / a camera on a tripod / a roll of poster proofs and a roll of tape / one tall plant with dark teal leaves]. The far end of the room is dark and simple, drawn in navy and cobalt with few strokes.

PEOPLE:
> PEOPLE: original characters, all adults aged 28 to 40, with realistic adult proportions and faces: [Maya at the keyboard, Theo behind the camera]. They are the people of the FIRST reference image: same faces, same hair, same clothes. Accomplished at their work and at ease. They are absorbed in the work and in each other; confident, warm, enjoying it. Nobody poses for the viewer and nobody looks at the animal. Eyes visible, no sunglasses. Every hand has four fingers and a thumb. Not cute and not cartoonish; not grim, not tired, not rebellious.

ANIMAL: see 2.3.

COUNT (the painting skill's defence against additions; rewritten per picture):
> COUNT: exactly [two] people and nobody else: nobody behind the glass, nobody in a reflection. [Exactly one animal. / No animals.] Exactly one phone, one microphone, [one keyboard]. At most one painted streak of sound, from the [keyboard] into the phone. What is not named in this prompt is not in the picture.

NOT IN THE PICTURE:
> NOT IN THE PICTURE: crowns, stars, hearts, lightning bolts, smileys, sparkles, toys, graffiti, drips, spray cans. No readable words, no letters, no numbers, no signs. No interface on any screen: a screen shows one pink waveform or plain light. No logos, brand marks or a maker's recognisable shapes on clothes, caps, instruments, phones, laptops or gear. No existing characters, no real persons.

Three working rules that go with the blocks:

- **Instruments are cast by how well the model draws them.** In focus: keyboard, mixing desk, microphone, headphones, camera, laptop, phone. Far away, cut by the frame or in halftone shadow only: saxophone, bass and guitar (headstock out of the frame), drum kit. A saxophone as the hero of a picture needs a reference photograph the owner took himself, and a check of every key at full size.
- **Composition and colour go in as an image, never as words.** The skill found that written proportions are ignored. Here the LAST reference is a box map made with PIL (free): navy field, the pink pool where the phone is, the cyan window, the near subject as one large box with clear colour all round it, the mid figures as small boxes, the far things as tiny ones. The map carries the lens (the size steps) and the shares of colour at once.
- **The story's crew is not only musicians.** Theo directs video, Ines designs, Kofi books rooms. A camera, poster proofs and a venue door belong in the scenes, or FYI reads as a music app.

### 1.3 The lens: the part he named

What makes the depth real in q1 to q3, turned into rules. A wide lens does not make depth through blur; it makes it through **size, overlap and bending**.

1. **Say where the camera is, as an object in the room.** "The picture is what the phone sees from where it was put down: lying on the desk looking straight up" (or leaning against a monitor speaker, or lying on the lid of the flight case, or on the floor). A physical position gives the model the angle, the horizon and a reason for the distortion. It is also the product's own point of view.
2. **Give the distance in centimetres.** "The nose is fifteen centimetres from the lens." Close is what makes the bulge.
3. **Name three size steps.** NEAR: one subject, "the largest thing in the picture, filling about half of it". MID: "behind it, a quarter of its size". FAR: "small, at the far wall". Then say it once more as a comparison the model cannot dodge: "the dog's nose is larger than the head of the bass player behind it".
4. **Name the overlaps in order.** "The ear overlaps the boom arm; the boom arm overlaps the diffuser wall." Overlap is the strongest depth cue and it is what the planes are later cut along.
5. **Name what bends.** "Straight things bend: the edge of the ceiling, the boom arm and the top of the diffuser wall curve round the centre of the picture like the inside of a bowl."
6. **Show a ground plane running away.** The desk, the floorboards or the case lid starts at the bottom edge, right under the lens, and runs to the far wall. q1 and q2 have it; it is half of the depth.
7. **No blur.** A wide lens is sharp from front to back. Blur is the other kind of photograph, and blurred edges cannot be cut into planes.
8. **Let the light agree with the lens.** Pink and bright near the phone, cyan in the middle distance, navy far away: near is warm and light, far is cool and dark.

The CAMERA block:
> THE CAMERA: the picture is what the phone sees from where it was put down: [lying on the desk, looking straight up]. An extreme wide-angle, almost fisheye lens held very close to the subject, so the nearest thing is huge and bulges toward the viewer, the room bends away round it and the far things are small. The nearest point of [the dog's nose] is about fifteen centimetres from the lens and is the largest thing in the picture. Behind it, at a quarter of its size, [Maya and Kofi]; at the far wall, small, [the control-room window]. [The dog's ear overlaps the boom arm, and the boom arm overlaps the diffuser wall.] Straight things bend: the edge of the ceiling, the boom arm and the top of the diffuser wall curve round the centre of the picture. [The desk] starts at the bottom edge under the lens and runs away to the far wall. Everything is sharp, near and far. Hard-edged highlights and crisp cast shadows from the phone's light. The near subject is cut by one edge of the picture at most, and room colour shows all round the rest of its outline.

Depth checks, measured on the draft before anything else (pixels, by hand, free):

| check | pass | today |
|---|---|---|
| width of the near head divided by the width of a far head | at least 6 | q2 about 15, q3 about 8; p1 to p3 about 3 to 4 (rough, by eye on the drafts) |
| size steps | three (near, mid, far), each half the one before or less | q2 and q3 pass; q1 has near and far only |
| the near subject's share of the picture | 35 to 55% | q2 and q3 pass |
| overlaps along the depth | at least two, and the near subject touches nothing at its own depth | q1 fails (fingertip meets the saxophone bell); q2 fails (body merges with the wall) |
| bent straight lines | at least two visible | q1 to q3 pass |
| ground plane from the bottom edge to the far wall | present | q1, q2 pass; q3 partly |
| blur | none | p2 fails |

Where the lens is not used: sheets, stickers, covers, posters and avatars are flat and frontal. The lens is for World scenes and for the animal one-offs; there it is used every time.

### 1.4 The palette

| name | hex | hue | role | share in a night scene |
|---|---|---|---|---|
| Hot pink | `#FF2E93` | 331 | The light of the phone. FYI itself. | 14 to 24% |
| Deep pink | `#C4126B` | 330 | Pink in shadow, the second tone of pink shapes. | inside the pink share |
| Cyan | `#19D3F3` | 189 | The second light: control-room window, far rims, the cyan plate. | 4 to 10% |
| Cobalt | `#0B67F8` | 217 | Lit shadow, clothes, the large cool masses. | 12 to 22% |
| Violet | `#7A3CFF` | 259 | Where pink light meets blue shadow. Never an "AI" sign inside the art. | 8 to 16% |
| Navy | `#0D1030` | 235 | The deepest tone, the ink line, the halftone ink. Replaces black. | 20 to 32% (as V < 0.25) |
| Honey wood | `#C98A4B` | 30 | The one warm material: the diffuser wall. Also warm fur. | with dark wood and fur, at most 30% |
| Dark wood | `#7A4A2B` | 24 | Wood in shadow. | |
| Paper | `#F4EDE2` | 37 | The highest lights; the ground of sheets and stickers. | 1.5 to 6% |
| Amber | `#F2A93B` | 36 | Small glints only: an animal's eye, brass, a gold chain. | under 2% |

Outside the palette: yellow, yellow-green, lime, olive, mustard, orange light, brown shadow, pure black, neutral grey. Green is allowed only as dark teal leaves, at most 3%.

Copper (`#C97A3D`) is not a brand colour. It belongs to the project "Copper Hours" and appears only on that project's covers and poster. The brand lends its technique, not its palette.

### 1.5 The numeric checks, run on every result before the owner sees it

One script, `check.py` (PIL only, free), with the method of 1.1. For a night world scene:

| check | pass | the approved drafts today |
|---|---|---|
| pink share | 14 to 24% | 10 to 26 |
| cool share (cyan + cobalt + violet) | at least 30% | 5 to 27: all fail |
| warm share (salmon + wood + yellow) | at most 30% (up to 38% when a warm-furred animal is the near subject) | 40 to 71: all fail |
| yellow 45-75 | at most 2% | 0 to 2 |
| green 75-165 | at most 3% | 0 |
| dark tone, V < 0.25 | 20 to 32% | 8 to 16: all fail |
| near black, V < 0.08 | at most 1.5% | 0 to 1.1 |
| median hue of the darkest 2% | 225 to 265 (navy to violet) | 240 to 325 |
| paper (V > 0.88, S < 0.14) | 1.5 to 6% | 0 to 0.3: all fail |
| pink is local | the half of the picture that holds the phone has at least twice the pink share of the other half | not measured yet |
| mean saturation | 0.45 to 0.60 | 0.51 to 0.61 |

Then the depth checks of 1.3, and by eye at 100%, one line each in the report (the skill's rule: never "style matches" from a look alone): layout against the box map; COUNT (people, phones, animals, streaks); every hand larger than 5% of the picture height (fingers counted); every instrument in focus; each crew member's three marks (2.5); the room's landmarks (2.6); the animal rules (2.2); any letter-like shape; any maker's shape.

Other hours of the clock get their own table when their key frame is designed (the morning frame will have little pink and much paper). Sheets and stickers are checked differently: the flat ground within 3 units of its hex along the whole border.

A low draft shows layout, lens, content and colour. It does not show the ink line, the stroke or the dots. Say so each time; do not judge the print from a draft.

### 1.6 The print pass: the model paints, code prints

The print finish is the part of the look the model does worst and the part code does perfectly. One script and one CSS layer:

- `print_pass.py` (PIL, free): (1) builds a shadow mask from the luminance; (2) replaces the darkest band with round halftone dots in navy at a fixed screen angle and pitch (the pitch tied to the output width, so every asset has the same dot); (3) offsets the cyan and magenta separations by 2 to 3 px in opposite directions along the strongest outline only; (4) lays the paper tone into the highest lights and a fine grain over all; (5) writes the amounts into the log. One number, `press` from 0 to 1, sets the strength.
- `press` can follow the story: Day 1 nearly pure paint (0.2), launch night fully printed (1.0). The narrative file calls this "paint becomes print".
- On the web the same three things live as CSS over the picture (section 3, textures), so on the depth planes the dots stay still while the planes move, and the two plates can slide into register.

Why this matters for money: a picture whose finish comes from code can be rendered smaller and scaled up with Lanczos before the pass, because crisp dots and grain at final resolution hide the softness. To be tested for free on the existing drafts before it is trusted.

First free experiment: run the pass on q1, q2 and q3 and show the owner the three pairs side by side. If he prefers the model's own finish, the PRINT block stays in the prompt and the pass only adds grain.

---

## 2. The animals, and what really needs consistency

### 2.1 What they are

Not a mascot, not a character, not a cast. A genre: **a real animal, photographed by a wide lens, wearing one or two real things a person in the studio would wear, taking the work as seriously as the people do.** A different species or breed each time; none appears twice; none has a name, a sheet or a story. They are spice: the picture you did not expect on the third screen.

Consequences for production: no character sheet, no reference image of any animal, no identity check, no drift ladder. The first cat sheet (`b1`) is not needed. Each animal picture is one self-contained call.

### 2.2 The rules of the genre (what keeps it on the right side of childish)

The owner's references are photographs. That is the rule in one line: **it must read as a painted photograph of a real animal, not as a designed cartoon animal.** The stylisation lives in the paint, the print and the lens, never in the animal's design.

1. **Real animal.** Real anatomy, real fur, real proportions, the breed named ("an adult golden retriever", "an adult beagle", "a Syrian hamster"). Adult animals only: small is fine, baby is not. No puppies or kittens; they are where cute starts.
2. **Real eyes.** The size a photograph would show: a cat's eye about a fifth of the head's width, a dog's a seventh to a tenth. The lens may make the whole head huge; it never enlarges the eyes inside the head. No glassy domes, no sparkle, no lashes, no eyebrows. q2 (about 0.23, domed and glossy) is the line not to cross again. Eyes closed, or behind sunglasses, are the easiest ways to stay deadpan.
3. **One or two real accessories; three only when one of them is a garment.** From the crew's own wardrobe: a plain cap, a beanie, sunglasses, studio headphones, wired earbuds, a hoodie, a knitted sweater, a turtleneck, a chain. Real objects in real materials, sitting the way they sit on a real animal (the cap a little too big, the headphones resting over the ears). Plain: no logos, no lettering. In black, navy, cream or cobalt; one item may be hot pink. Never a full outfit: nothing on legs or paws, no trousers, no shoes, no costume, no props that make it a character (no microphone "held", no crown, no bow tie).
4. **An animal's body.** It sits, lies, stands on four legs, rests a paw on a thing. No upright human posture, no hands, no fingers gripping, no legs crossed. An object may lie under a paw or beside it; it is never held. (Two of the references show a hamster holding drumsticks and a puppy holding a phone. Take the deadpan from them and leave the grip: a hamster sitting on the skin of a real snare drum beside a real pair of sticks is the same joke with a real animal.)
5. **Real scale.** No miniature instruments and no doll furniture: "toys" stays on the forbidden list. Small animals sit on full-size gear.
6. **Deadpan.** Mouth closed, no smile, no tongue, no head tilt, no wave. Calm, cool, a little grand.
7. **It works, or it listens.** It behaves like a serious creator or a serious listener: lost in the music with its eyes closed; waiting for the count; guarding the flight case; hearing the take back. It never performs for the viewer. It may look into the lens the way an animal looks at an object that interests it; it does not pose for it.
8. **The people do not notice it.** No one in the frame looks at it, laughs at it or pets it. It is somebody's animal in the room, and it is not the butt of the joke.
9. **One animal per picture, and no words.** No speech, no bubble, no name, no caption in its voice. Two animals in one frame make a cast.
10. **Domestic only.** Dogs of many breeds, cats, a hamster, a rabbit, a parrot or cockatoo: animals that could really be in a studio. No wild, zoo or farm animals: that is a children's book.
11. **Never the same one twice.** A list of what has been used (species, breed, accessories) is kept, and the next one differs in all three.

The childish signals of round 2 (acid yellow, crowns, stars, bolts, drips) stay out. Sunglasses, caps and chains are not childish on a real animal that keeps a straight face; they are childish on a cartoon one.

### 2.3 The prompt blocks

ANIMAL (replaces PEOPLE as the near subject; people may still be small in the back):
> THE ANIMAL: one real [adult golden retriever], painted from life: real anatomy, real fur, the proportions and the eyes a photograph of this animal would show. The stylisation is in the paint and the print, not in the animal: it is not a cartoon character and it is not a toy. It wears [a plain black cap and a pair of big professional studio headphones], real objects of real size, with nothing written on them, and nothing else. It [sits] the way a [dog] sits; it has paws, not hands, and holds nothing. [Eyes closed, nose lifted, completely lost in the music, as serious as any musician.] Mouth closed. It does not pose for the viewer and nobody in the room looks at it.

SCENE lines in the genre, ready to drop in (each with the CAMERA block of 1.3):

- **The listener** (the picture he loved, and close to his first reference): *"the phone leans against a monitor speaker on the floor. Fifteen centimetres from it, an adult golden retriever in a plain black cap and wired earbuds, eyes closed, nose lifted. Behind it, a quarter of its size, Maya at the keyboard; at the far wall the cyan window."*
- **From below:** *"the phone lies on the floor looking straight up. An adult grey cat stands over it, seen from below, its chin and whiskers huge, looking down past the lens at the glass, unimpressed. Above it the dark ceiling and its oval tray of six lamps bend like the inside of a bowl."* (His reference is a cat from below against the sky; indoors the ceiling is the sky.)
- **The engineer:** *"the phone lies on the mixing desk. An adult beagle in a navy beanie and round sunglasses sits in the engineer's chair, one paw resting on the edge of the desk, facing the monitor speakers, hearing the take back."*
- **The count-in:** *"the phone lies on the floor tom. A Syrian hamster sits on the skin of the snare drum beside a real pair of drumsticks, in tiny round sunglasses, perfectly still, waiting for the count. Behind it the cymbals bend away, huge."*
- **Front of house** (launch night): *"the phone lies on the bar of the venue. An adult chihuahua in a black turtleneck and a thin gold chain sits on the bar beside it, looking past the lens toward the stage; far behind, small, the lit stage and the heads of the adult crowd as halftone silhouettes."*

In the COUNT block: "Exactly one animal." In every picture without one: "No animals."

### 2.4 How often, and where

"Here and there" as numbers: **about one painted picture in six has an animal, and never two in one view.**

| place | animals | note |
|---|---|---|
| The case-study page | one picture with an animal as the near subject; at most one more where an animal is a small, unnoticed presence | of six to eight pictures on the page |
| World scenes, full set | 1 of 6 | the people and the room lead |
| A sticker set | 1 of 8 (3 of 24) | a head with an accessory, flat and frontal |
| Empty and error states | 2 of about 6: a tab's first-run empty state, and offline | each a different animal |
| Notifications | one kind only: the one no person sent (the quiet "nothing new" kind) | never on a notification that carries a person's message, a task or a summary |
| Marketing, App Store | 1 of every 5 or 6 images | |

Where animals never appear: next to or inside any AI surface; inside the thread, the composer, tasks or calls; as an avatar (an animal avatar reads as a user); in the mark or the app icon; on the crews' own covers and posters; on permission, payment or delete dialogs, or on an error where something was lost; twice on one screen; as a series ("animal of the week").

People versus animals, as a share of all painted pictures: people about 60%, the room and its objects about 25%, animals about 15%.

### 2.5 What does need consistency: the four crew members

They appear across scenes, as avatars in the product and as names in the story. One wrong face and the page reads as a pile of generated pictures. All the effort that was going to the cat goes here.

**Each person gets three marks that read at thumbnail size:** a silhouette (hair), one garment in one colour, one object. Proposal, in words; fictional, adults, and only the owner judges the faces:

| who | silhouette | garment | object |
|---|---|---|---|
| **Maya**, 33, artist and producer | dark curls in a high bun | a cobalt overshirt, sleeves rolled | studio headphones round her neck, always; one hoop earring, left ear only |
| **Theo**, 36, video director | shaved head, short dark beard | a navy work jacket | round clear glasses (not sunglasses); a camera strap across the chest |
| **Ines**, 29, designer | a straight black bob with a blunt fringe | a cream oversized T-shirt | a marker behind her right ear; ink on her fingers |
| **Kofi**, 38, shows and venues | short locs tied back | a pale grey hoodie under a dark coat | a ring of keys on a carabiner at the belt; a phone in his hand |

The asymmetric marks (Maya's one earring, Ines's marker) show at once when the model mirrors a figure.

**Cast sheet A, the law** (2400x1600, max): the four heads, each from the front and in three-quarter view, eyes visible, neutral soft white light, no coloured light, flat even ground `#E9E6E0`, no texture, no labels. LOOK block without PRINT.

**Cast sheet B** (2400x1600, max, through the edits endpoint with sheet A as image 1): the four standing, whole figure, in their clothes with their objects, hands visible and relaxed, same light and ground. This sheet is also the source of the four avatars (cut with PIL, each set on its tint from the page: `#E8B45C`, `#C3DC6B`, `#F28DB2`, `#8EC8F2`).

**Every later picture with people:**

- Endpoint `v1/images/edits`. Image 1 = only the people in this picture, cropped from the sheets and enlarged to fill the reference (a sheet of four gives the model four people to paint). Image 2 = the room (2.6). Image 3 = the style anchor. Last = the box map or the approved low draft.
- The PEOPLE block names them and says "same faces, same hair, same clothes"; the COUNT block gives the number and says "nobody else".
- No other people in any reference image. p1 to q3 are retired as references once the cast sheet is approved, or the model averages the old bearded man into Theo.
- The lens helps: in the scenes he loved, the people are mid-distance and small, where the three marks carry the identity and the face does not have to be perfect. A crew member's face fifteen centimetres from the lens is the hardest picture in the set; do one at most, and expect to redraft it.
- The guide does not state a maximum number of reference images (its example sends four; this project has sent five). Keep to four or five.

**Checking** (`cast_check.py`, free): cut each head from the new picture, set it beside the sheet head at the same size. Per person: silhouette, garment and colour, object: all three must pass. Then the face, judged by the owner, not by the script. Hands: fingers counted on every hand larger than 5% of the picture's height.

**When a person drifts:**

1. At the low draft: never pay for a final of a face that failed. Change one thing and redraft.
2. Mirrored figure (the earring on the wrong ear): flip the picture if nothing else in it has a handedness. Free.
3. A flat mark wrong on a small figure (jacket colour, missing glasses): repaint in PIL. Free. Logged.
4. Face wrong: redraft with that one head enlarged as image 1 and one reference fewer.
5. Two failed drafts by the same method: stop (the skill's rule) and change the method: paint the figure alone on a flat key ground in that pose and light, cut it out, lay it over the room plate, run the print pass over the whole.
6. Never fix identity with more adjectives: b1 and b2 show that the same words give different results.

### 2.6 And the studio

One room, so that six pictures are one place.

- **Landmarks, fixed:** (1) the diffuser wall; (2) opposite it the control-room window, lit cyan; (3) the ceiling: dark, with one oval tray of six small round lamps (what every looking-up picture shows); (4) the floor: dark boards with one navy rug; (5) the boom microphone near the middle; (6) the desk with the mixing desk under the window.
- **A plan, free:** a top-down drawing made with PIL or SVG with the six landmarks and the four places the phone is ever put down (desk, flight-case lid, floor by the speaker, mixing desk). Each scene names one of the four. The plan is for the people writing prompts, not for the model.
- **The room plate** (2400x1600, max): the empty room at night, seen by the lens from the desk position. It is image 2 of every scene, the first style anchor, and a picture in its own right for the quiet parts of the page. Later, the same room in the morning and before the launch, made the way the skill made the harbour at other hours (image 1 = the night plate, "same room, every object in its place, only the light changes").
- **Check:** the landmarks that the camera position should show are there, in the right order from left to right, and counted (six lamps, one window, one microphone).

---

## 3. The families of assets

"Full" is what the brand could need; "lean" follows the narrative's advice to cap the portfolio page at six to eight finished pictures.

| family | master size | delivered | count: proof / full | use |
|---|---|---|---|---|
| **Cast sheets** | 2 sheets at 2400x1600, max | reference only; four avatars at 512 px cut from sheet B | 2 / 2 | Hold the crew's faces; the avatars in the crew picker and the cast row. |
| **Room plates** | 2400x1600, max | WebP 1920 w and 960 w | 1 / 3 | Reference for every scene; quiet crops round the phones on the page. |
| **World scenes** (heroes) | 2400x1600 landscape, or 1600x2400 portrait for phone-first pictures; max | WebP 1920 w (target under 260 KB) and 960 w (under 90 KB); far and near planes for mouse devices | 3 / 6 | Case-study hero, welcome, launch night, App Store, website. One in six led by an animal. |
| **Animal one-offs** (small) | 1024x1024 or 1024x1536, max, with the lens | 640 px WebP, under 45 KB | 0 / 4 | A first-run empty state, offline, the quiet notification, one spare. Each a different animal. |
| **Die-cut stickers** | a 3 by 3 sheet at 2048x2048, max: cells of about 680 px, eight used and one spare | 512 px WebP with alpha, under 20 KB; white edge and shadow made in code | 8 / 24 | Reactions and votes that a person places; the lid of the flight case; the laptop in world scenes (through a reference image); marketing. |
| **Record covers, "Copper Hours"** | 1024x1024, max | 512 and 128 px | 3 / 3 | The album in the thread, the poll, the chat-list thumbnail. |
| **Launch poster** | one textless art, 1600x2000, max, with the subject inside the middle 60% so it crops to 4:5, 9:16 and 1.91:1 | per format, with HTML words on top | 1 art, 3 styles / same | Splash is the art; Ink and Paper are made from it in code. |
| **Visualizer** | none | canvas or SVG | 0 paid | Copper arcs that pulse; a brush mask gives the hand. One painted still at most. |
| **Event posters by other crews** | 1600x2000, max | 4:5 | 0 / 4 | The public events feed, to show that not every launch looks like FYI. |
| **App icon** | drafts at 1024x1024 low; the final redrawn by hand as SVG | SVG and PNG set | 4 drafts / 1 | The mark as two plates in register. No halftone under 128 px. No animal. |
| **Textures** | code | CSS and SVG | free | Below. |

Sticker subjects for the proof (no clip-art, no spray can, nothing from round 2): the pink waveform as one brush stroke; the studio microphone in its shock mount; the headphones; the phone face up with its pink glow; a closed flight case; an empty speech bubble; a ticket stub with a perforation and no writing; and the one animal: a dog's head in a plain cap and sunglasses, frontal, deadpan. Words on the bubble and the ticket are set in HTML or SVG. All eight are painted in one call so they share a hand.

**The works inside the story are by Ines, not by the brand.** The three covers and the poster must look like one designer's hand and unlike the house style: no figures, no animals, no neon. Two inks, copper `#C97A3D` and one more, on paper or on near-black, built on the arcs the page already uses (the call notes say "cover B. The arcs pulse on the snare"). A: copper arcs on navy, tight. B (the one the crew picks): arcs broken by one hard diagonal, with the teal the thread mentions ("that teal is the poster"). C: arcs dissolved into halftone. Drafted together in one picture so they are visibly three answers to one brief.

### Textures: code first

| texture | how | image needed? |
|---|---|---|
| Halftone field | CSS: `radial-gradient` dots as a repeating background; for dots that grow and shrink, a soft gradient under the dot pattern with `filter: contrast()` on the wrapper. Colour by `mix-blend-mode: multiply` in navy. | no |
| Plate offset on a cut-out (sticker, near plane, the mark) | CSS: `filter: drop-shadow(-2px 0 0 #19D3F3) drop-shadow(2px 1px 0 #FF2E93)` on an image with alpha; the offsets are CSS variables, so the plates can move with the pointer or snap to zero. | no |
| Plate offset on words | `text-shadow: -2px 0 #19D3F3, 2px 1px #FF2E93` | no |
| Paper grain | one 256 px tiling noise PNG made with PIL (about 6 KB), `multiply` at 6 to 10%. An SVG `feTurbulence` filter gives the same look but repaints slowly on phones; use the tile. | made free |
| Die-cut white edge and soft shadow | PIL: grow the alpha by 10 px and fill white; shadow by CSS `drop-shadow`. Uniform on every sticker. | no |
| Brush edges and the sound stroke | These need a real hand. One paid sheet of six black dry-brush strokes and torn edges on white (2048x2048, max), then threshold and trace to SVG masks of a few KB each. Used as `mask-image` on the visualizer's arcs, the waveform and picture edges. | one paid sheet |
| The Ink and Paper poster styles | PIL: Ink = two-tone threshold of the Splash art in navy on near-black with one colour plate; Paper = the art multiplied onto `#F6EFE6` with coarse halftone. One art, three presses, as the product promises ("a style change reaches the phone and every format at once"). | no |

The narrative keeps the press material off controls. The textures above are built to that: they are layers over pictures and published objects, never over buttons or bubbles.

### Screen by screen

| screen (part of the page) | art | family |
|---|---|---|
| Case-study hero, App Store, website | "What the phone sees": Maya and Theo lean over the lens, the finger comes down to record. Planes: finger, words, people, room. | World |
| 01 Welcome | The room from the desk at night, the phone's pink pool on the wood. The mark comes into register. | Room plate |
| 01 Profile, crew picker | The four crew avatars. The empty avatar stays a plain plus. | Avatars |
| 01 New project; Chats and Projects lists | The project's cover as a 48 to 64 px thumbnail. | Covers |
| First-run empty state of a tab | One animal, small, with the lens (the cat from below); one line; one button. | Animal one-off |
| 02 Thread, composer, voice note | Nothing painted inside the phone. On the page, the stage round the phone may be a quiet crop of the room at 11:14 PM. | Room plate |
| 03 AI catch-up and every AI card | Nothing. No animal, no person, no texture. | none |
| 04 Tasks | Nothing. | none |
| 05 Covers and the vote | The three covers; a vote is a sticker in the voter's tint. | Covers, stickers |
| 05 Together, on the page | "The listener": the retriever in cap and earbuds, the crew small behind. The page's one animal picture. | World |
| 05 Call | The visualizer in code. | Visualizer |
| 06 Event card, formats, link page | The poster in its three presses; the plates snap when the event goes public. | Poster, textures |
| 06 Launch night, on the page | The venue from the bar: the crew at the door, the crowd as silhouettes. | World |
| Offline | One animal, a different one (the beagle at the desk, waiting). | Animal one-off |
| 07 System | The palette roles as a table; small specimens of dot, plate and grain; one line on how the pictures were made. | Textures |

---

## 4. Depth: pictures made to come apart

How the site does it today (`work/hear-page.css`): all planes are full-frame images of the same pixel size. `far` is an RGB WebP that scales to 1.10 and travels up to 3.5% by 2.5%; `near` and an optional `mid` are WebP with alpha; `near` travels 14 px by 9 px and scales to 1.05. Each amount is already a CSS variable per picture (`--nx`, `--ny`, `--fx`, `--fy`, `--fs`). Mouse devices only.

**The wide lens and the layered effect are the same idea.** A wide-lens picture already has three sizes of thing at three distances; the planes only let them move as they would if the phone were nudged. So a picture that passes the depth checks of 1.3 is most of the way to being cut. For these pictures:

- **Three planes: near** (the huge subject and anything that touches it), **mid** (the people, as one group), **far** (the room). Words are a real HTML plane between mid and near, so a headline can pass behind a finger or an ear.
- **Let near move the most.** Close to a wide lens, a small move of the camera shifts the near thing a lot and the far wall hardly at all. Suggested per-picture values: near 20 px by 12 px and scale 1.07; mid 6 px by 4 px; far 1.5% and scale 1.04.
- **Dots stay still.** Halftone and grain are one fixed CSS layer above all planes; the plate fringe is a live `drop-shadow` on the near plane.

**Method A, for heroes: the scene first, the plates after.** The owner judges a whole picture, so he approves a whole picture.

1. Box map with the near subject as one box with clear colour all round it, the mid group as a separate cluster that does not touch it. Low draft. Depth checks. Approval. Max final. This flat final is also what every phone gets.
2. FAR plate: edits, image 1 = the final, with the wording that held the harbour "object for object" in the skill: *"Paint the SAME picture again, by the same hand. Same camera, same lens, every object in the same place and the same size. One change only: the dog and the two people are not there. Where they were, paint what stands behind them: [the diffuser wall, the boom arm, the rug]. Add nothing else and remove nothing else."* Low draft first; watch for additions (the model fills a hole with a plant).
3. NEAR plate: edits, image 1 = the final: *"The same dog, same pose, same size, same place in the frame, same light, alone. Everything else is one flat, even green (#00C853), no shadow, no glow, no halo, clean hard painted edge."* Green is the one hue the palette never uses, so the key is clean. Cut with PIL; place over the far plate with one fit by hand. It need not match the final pixel for pixel, because the far plate no longer holds the subject. MID plate, when wanted: the same call for the people.
4. Cheaper cut for hard-edged things (the finger, the phone): mask the final itself with a free local matting model and touch up by hand. Fur and whiskers do not survive this; whiskers can be redrawn as SVG strokes, which also makes them their own nearest plane.

**Method B, for small pictures and series: plates first.** A library of room plates and of figures painted on the key ground, composited in PIL, print pass over the whole. Cheapest per picture and the safest way to hold the crew's faces. Weaker for heroes, because the pink light on the desk and the cast shadow have to be added by hand (a soft pink pool and a contact shadow as their own layers).

**The free version, for tests today:** cut the near subject from an existing draft and scale it up by 5 to 6%. Its overhang hides the copy of itself still painted in the far plate, as long as the near plane travels less than the overhang. Good enough to try on q1, q2 and q3 now; not for a final.

**What to avoid:**

- A near subject that touches something at another depth. q1: the fingertip meets the saxophone bell. q2: the cat's body becomes the wall and a paw lies on the desk on its own. Ask for room colour all round the outline, and name what is behind.
- A near subject cut by two or more edges of the frame: it cannot travel without showing its cut. One edge, and preferably the bottom, where the desk or the phone anchors it.
- Anything soft or transparent across a boundary: blur, loose hair, smoke, light beams, glass, motion streaks. A streak is its own plane or an SVG.
- Reflections of the near subject in far things. In q2 the phone's glass reflects the cat: the phone must then ride on the near plane.
- Halftone, grain or plate fringes painted into planes that move: dots swim against dots. For pictures that will be split, leave the PRINT block out.
- Anything that matters in the outer 6% of the far plate: its scale crops it.
- Asking for an "empty" or "calm" area for the words (the skill's first rule). The words sit on the dark far end of the room, which is named with content ("the control-room window, two monitor speakers, in navy and cobalt, few strokes").
- Planes on phones. No pointer, no depth: phones load the flat picture only, and the planes load lazily on `(hover: hover) and (pointer: fine)`.

---

## 5. Production plan and costs

Prices are this project's own bills on `gpt-image-2.6-sunburst` ($30 per million output tokens), read from the logs in `scratchpad/paintings/out_*`:

| call | price | source |
|---|---|---|
| low draft, text only, 1536x1024 or 1024x1536 | $0.022 | fyi_styles4/5 logs (664 output tokens) |
| low draft with 2 to 4 references, same size | about $0.05 | skill; logs show $0.035 to $0.044 at 1152x608 |
| max 1024x1024 with references | about $0.13 | estimate, no bill yet |
| max 1600x832 with references | $0.15 | posts4/5 and gags logs |
| max 1024x1536 or 1600x1072 with references | about $0.19 | skill's $0.16 plus references |
| max 1600x2000 with references | about $0.28 | estimate |
| max 2400x1600 or 1600x2400 with references | about $0.33 | skill: $0.30 to $0.31 with two references |
| max 2048x2048 with references | about $0.35 | estimate between the line above and $0.46 for 2304x3456 |

The estimates must be read off the guide's calculator before the first call (the skill's rule), and each price said to the owner before each call.

### Step 0: free, before any money

1. `check.py`, `cast_check.py`, `print_pass.py`, the box-map maker, the plan of the room.
2. The print pass on q1, q2, q3: three before-and-after pairs for the owner.
3. The CSS textures and the live plate offset, on a local copy of the page (headless preview, no repo change).
4. A depth test with near subjects cut from q1, q2 and q3 (the free version in section 4), with the per-picture values suggested there.
5. Ink and Paper treatments tried on the arcs the page already draws.
6. One check that costs two cents instead of nothing: whether `background: "transparent"` (in the guide for PNG and WebP) is honoured by this model. If it is, the green key is not needed.

### The proof batch

The brief's "character sheet" is now the crew's cast sheet, with the room plate beside it.

| item | drafts (low) | finals (max) | arithmetic | cost |
|---|---|---|---|---|
| Cast: two takes on the four people | 2 text-only | | 2 x 0.022 | $0.04 |
| Cast: one correction round | 2 with references | | 2 x 0.05 | $0.10 |
| Cast sheets A and B (four avatars cut free) | | 2 at 2400x1600 | 2 x 0.33 | $0.66 |
| Room plate, night | 2 text-only | 1 at 2400x1600 | 2 x 0.022 + 0.33 | $0.37 |
| 8 stickers on one sheet | 2 | 1 at 2048x2048 | 2 x 0.05 + 0.35 | $0.45 |
| 3 hero scenes | 2 each = 6 | 3 at 2400x1600 | 6 x 0.05 + 3 x 0.33 | $1.29 |
| 3 covers | 2 (all three in one picture) | 3 at 1024x1024 | 2 x 0.05 + 3 x 0.13 | $0.49 |
| 1 poster (Splash; Ink and Paper in code) | 2 | 1 at 1600x2000 | 2 x 0.05 + 0.28 | $0.38 |
| **Core** | **18** | **11** | | **$3.78** |
| Far plates for the 3 heroes | 3 | 3 at 1600x1072 | 3 x 0.05 + 3 x 0.19 | $0.72 |
| Re-rolls of single stickers that fail | | up to 2 at 1024x1024 | 2 x 0.13 | $0.26 |
| **With depth and re-rolls** | **21** | **up to 16** | | **$4.76** |
| Reserve for a refused or failed final, 15% | | | | $0.71 |
| **Ceiling to ask the owner for** | | | | **$5.47** |

The three heroes of the proof: (1) "What the phone sees", Maya and Theo over the lens, the finger coming down; (2) a session from the flight-case lid, three of the crew at work, no animal; (3) "The listener", the retriever. Two with people, one with an animal: more animal than the one-in-six rule, on purpose, because the proof has to test the genre once.

Order: Step 0; then the cast and the room (no scene with people is drafted before cast sheet A is approved); then one hero end to end, including its planes on a local copy of the page; then the rest. Every low draft goes to the owner before its max render, even inside an approved budget. Two failed drafts in one method: stop and change the method.

### The full set, after the proof is approved

| item | arithmetic | cost |
|---|---|---|
| 3 more heroes with far plates | 3 x (0.10 + 0.33 + 0.24) | $2.01 |
| 2 more room plates (morning, before launch) | 2 x 0.05 + 2 x 0.33 | $0.76 |
| 4 small animal one-offs | 4 x (0.05 + 0.13) | $0.72 |
| 16 more stickers, two sheets, with re-rolls | 2 x (0.10 + 0.35) + 0.26 | $1.16 |
| 4 event posters by other crews | 4 x (0.05 + 0.28) | $1.32 |
| Brush-edge sheet for the SVG masks | 0.05 + 0.35 | $0.40 |
| App icon: 4 drafts, one painted reference; the final drawn as SVG | 4 x 0.022 + 0.13 | $0.22 |
| **Full set beyond the proof** | | **$6.59** |
| Reserve 15% | | $0.99 |

Proof and full set together: about $11.35, about $13.05 with both reserves. The lean set (six to eight finished pictures on the page) is the proof batch plus one more hero with its plate: about $5.45.

### Free, and not free

Free: all textures; the print pass; cut-outs by key colour or flood fill; die-cut edges; the Ink and Paper presses; avatars cut from the cast sheet; stickers cut from sheets; mirror flips and small repairs of flat marks; box maps, colour keys and the room plan; responsive sizes and WebP encoding; Lanczos scaling up to about 1.5 times when the print pass follows it; crops of the existing low drafts as thumbnails up to about 360 px wide; the visualizer; the SVG icon; every measurement.

Not free: any new subject or pose; a crew member in a new scene with the face kept; a far plate whose hidden part is really painted; stroke and ink quality at full size (a low draft enlarged stays a low draft; AI upscalers smear the brushwork and invent detail in hands and faces, so they are not used on figures).

---

## 6. Risks

**Copyright and likeness.** Not legal advice; the working rules:

- The first references the owner collected are fan art of an existing animated film. **May be taken: the technique**, which nobody owns: a 3D render finished with brush strokes, halftone dots, plates out of register, ink lines and hatching over forms, hard two-tone shadows, a neon night palette, a wide lens close to a face.
- **May not be taken:** the film's characters (faces, silhouettes, hair, names), their costumes and props, logos, symbols and title lettering, its recognisable frames and poses, its city and set designs, and the fan pictures themselves, which belong to the people who drew them.
- The animal references are other people's photographs. **May be taken: the genre** (a real animal, a cap, a straight face, a wide lens from below). **May not be taken:** any one photograph's exact animal, outfit, crop and pose together. Each of ours is a different breed, a different accessory, in our room.
- So: no fan art, no film stills and none of the animal photographs go into the edits endpoint as reference images, ever. No film, studio, artist, photographer or character is named in any prompt; the look is described in plain words, as the scripts already do. The style anchor is always one of our own approved pictures.
- No animal may drift toward a famous animated one: glossy pleading eyes, a known cat's or dog's markings and outfit. Real breed, real eyes, plain accessories.
- People: fictional, "no real persons" stays in every prompt, no photographs of real musicians as references, no real artist's name. Gear and clothes: no badges and no maker's shapes (headstocks out of frame, plain dark phone, plain laptop lid, plain cap).
- Pictures made by a model alone may not be protectable as the owner's own work in some countries. The parts a person drew or arranged are: the mark and icon redrawn as SVG, the layouts, the composites, the box maps. Keep the logs and drafts as the record of direction, and say plainly on the page how the pictures were made.

**The safety filter.** It has refused twice in this project, both times at the output stage and both with children in the picture; a draft can pass and its final still be refused (the posts5 log). Rules: every prompt says "adults aged 28 to 40", including for far figures, which the wide lens shrinks to child size; small far people are "seen far away, full adult proportions"; no "young", "girl", "boy", "kid", "baby", and for animals "adult", never "puppy" or "kitten"; the launch-night crowd is "adults only" and mostly silhouettes; no costume or bare-skin wording. A refusal has cost nothing so far, but the reserve assumes it might. After a refusal, change the trigger before resending; never resend the same prompt, and do not switch the `moderation` setting without the owner's decision.

**Text.** The guide itself says the model struggles with precise text. No words in any picture: screens show one waveform or plain light; posters and tickets are painted blank with the subject inside the middle 60%; bubbles are empty; caps and hoodies are plain. All words are HTML or SVG on their own plane. Every result is searched at 100% for letter-like scribbles on gear, clothes, stickers and screens.

**Consistency.** The guide also says recurring characters may not hold. That is now a risk for the four people and the room only. The defences, in order: the cast sheet and the room plate as images 1 and 2; one or two people enlarged rather than a whole sheet; people at mid distance; one style anchor that never changes during a batch; the blocks kept in one file with a version number and never retyped; the numeric checks; the three marks per person; a contact sheet of every approved picture regenerated after each new one (free), because drift shows across a set before it shows in one picture; and the code print pass, which gives every asset the same last step. The animals carry no such risk, which is one more reason the owner's correction is a good one.

**The animals turning cute.** The genre is one step from a children's sticker pack. The eleven rules of 2.2 are the guard; the two that matter most are "real animal, real eyes" and "it does not perform for the viewer". Any draft where the animal smiles, has enlarged eyes, holds something or stands like a person fails, however charming.

**Weight on a phone.** Halftone and grain are the worst case for image compression and shimmer when scaled. Keep them in CSS and keep the pictures smooth: smaller files and crisp dots at any density. Budgets: hero 960 px under 90 KB, 1920 px under 260 KB; sticker under 20 KB; small animal picture under 45 KB; cover thumbnail under 8 KB; at most one painted picture per screen and about 250 KB of art per page view on a phone; depth planes never load on touch devices; everything below the first screen is lazy. The existing depth planes on the site are 40 to 260 KB each, so three planes per hero is a desktop-only cost.

**Money.** The skill's rules stand: the price before every call and a clear yes, the low draft to the owner before any max render, one change per draft, a log of every prompt and result, and a stop after two failures by the same method.
