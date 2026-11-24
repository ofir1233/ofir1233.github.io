---
name: v7-painting
description: How to make a paid painted image for the portfolio (v7 look) without wasting the owner's money. Read before ANY image-generation call for this site.
---

# Painted images for the portfolio

## THE PALETTE. Nothing outside it, ever.

Taken from Hear's painting `hear-v7/media/hero-contact-center-1600.webp` and the opening picture `img/me-v7-studio-1536.webp`. Both go into every call as reference images.

| what | colour |
| --- | --- |
| sky | cobalt-azure, about `#3b8ed3`; darker strokes `#1f6fc4`, lighter `#6cb4ec` |
| trees, plants | COOL emerald / teal green, about `#43765d`; darker `#2c5a48`, lighter `#6aa98a` |
| buildings | blue glass (cobalt, azure, pale sky blue) and cool white with pale blue shadows |
| clouds | crisp white with pale blue and lilac shadows |
| accents, small only | coral, lilac |

FORBIDDEN, the owner rejected them in anger on 22.11.2026: yellow, yellow-green, olive, lime, golden or warm foliage; big pink or purple flower masses; orange or terracotta roofs; a pale washed-out sky; warm, sunset or beige tones.

The palette and the forbidden list are written into EVERY prompt, with the hex values. Every result is measured (see "Colour is checked with numbers") before the owner sees it. A picture with a forbidden colour is never shown as a candidate and never placed.

The reference for quality is the opening picture, `img/me-v7-studio-1536.webp`. Every new painting is judged against it, side by side.
The owner pays for every call. A bad result is money thrown away, and an excuse afterwards is worth nothing to him.

## COLOURFULNESS, added by the owner on 22.11.2026 (evening)

The owner showed Hear's hero painting and said my pictures lack its colourfulness: they came out as blue-only pictures. He adopts for the portfolio the COLOURS, the pull of the paint and the rich style of that painting: coral red-orange (about #e8604a) in large clear shapes, lilac, magenta-pink and white flowers, emerald, cobalt, cream. So coral, lilac and pink are NOT "tiny accents" any more: they are spread over the whole picture.

He does NOT adopt its subject. People at desks, rows of chairs, headsets, laptops, an office: that is Hear's contact-centre brand, and it never goes into his pictures. I painted a row of seven people on coral chairs (a copy of the reference's subject) and paid for a max render before he saw the draft: about $0.34 wasted, and he answered "לא!!!!!!!".

- Still forbidden: yellow, yellow-green, olive, lime, warm or golden foliage, orange roofs, sunset tones, beige.
- The low draft goes to the owner BEFORE any max render, every time, even when the money is pre-approved.
- Closing picture, draft that carries this colourfulness without people: `scratchpad/end3.py` (harbour city from the water: coral boat and awnings, lilac sail, flowering balconies, beach cabins, lighthouse with a coral band). Waiting for the owner's answer.
- 22.11.2026: end3 was painted at max (about $0.29) and placed as `img/end-harbour.webp` (and `end-harbour-1152.webp` for phones) behind the closing section, see `v7/path-contact.css`. The owner had said to spend what is left and not to ask; he has seen the draft's direction but has not yet said a word about the placed picture. Measured: sky hue 209, saturation 67; warm 6.9%, which is the coral and is intended.

## What made the opening picture work

- The prompt listed MANY concrete things to paint (plants, lamps, desks, monitors, chairs, bicycle, flowers, rug, sunlight, people far away). Detail in the prompt gives detail in the picture.
- The sky was full of painted clouds and the city was dense, with glass towers, Bauhaus buildings, trees and sea.
- The style paragraph, to be reused word for word:
  "impasto oil painting ... thousands of small, crisp, confident palette-knife and flat-brush strokes; sharp edges, clean saturated colour, every object clearly readable, no blur, no muddy tones, no photo realism".
- Model `gpt-image-1.5`, size `1536x1024`, quality `high`.

## What failed (22.11.2026, background for How I work)

The prompt asked for a sky "completely empty", "calm", with buildings that "stay low", to leave room for a UI card.
The result was flat: a smooth striped sky, a small thin city, no thick paint. The owner called it garbage, rightly.

## THE MODEL. Only the strongest one.

Owner's order, 22.11.2026: from now on only OpenAI's best and most expensive image model. On that day five calls were wasted on `gpt-image-1.5` because the model name was copied from an old script without checking.

- Before every painting session, list the account's image models (`scratchpad/models.py`, free) and read `https://developers.openai.com/api/docs/guides/image-generation`. Use the newest "Sunburst" model (the detailed one; "Flare" is the fast one). Never take a model name from an old script.
- On 22.11.2026 that is `gpt-image-2.6-sunburst`: endpoint `v1/images/edits` with reference images, quality `low / medium / high / xhigh / max`, custom sizes up to 3840 px a side and 8.29 MP (sides multiples of 16), `complexity` defaults to high.
- Final pictures: quality `max`. Size large enough that the part the page shows has at least 2x the CSS pixels (for the How I work square: portrait `2304x3456`).
- Price: $30 per million output tokens. From the calculator on that page: max 2304x3456 = 15,303 tokens = about $0.46; max 1600x2400 = about $0.27; max 1024x1536 = about $0.16; low 1024x1536 = about $0.02. Add a few cents for the reference images. Read the calculator again when the model or size changes, and tell the owner the number.

## Before the prompt: know exactly what is wanted

1. Look at the picture being replaced and write down what must STAY (layout, horizon height, where it is open, what sits on top of it in the page) and what must CHANGE. On 22.11.2026 I skipped this and lost three paid calls: the old background already had the right layout (sky on 75%, clouds low, city band), and only its style had to change.
2. Say what the picture is FOR in one line. Here: a backdrop for UI; the UI is the subject, the painting must not compete with it.
3. Write the acceptance list before paying, as things that can be measured or seen, and give it to the owner with the price. For this background:
   - horizon between 72% and 80% of the height, inside the visible crop;
   - upper and central sky open, clouds only low and at the sides;
   - sky is visibly painted, same blue and same stroke as the windows of the opening picture; no weave, stripes or cracks;
   - city band dense and detailed, same buildings as the opening picture;
   - nothing painted where the Hear logo cloud sits on the Design step.

## After every result: check before showing or placing

1. Judge only the part the page shows. The background is drawn `object-fit: cover` in a square, `object-position: 50% 70%`, so only the middle ~62% of the width is seen. Crop to that first.
2. Measure the horizon (share of blue per row) and compare with the acceptance list. Do not judge it by eye.
3. Make a preview of the real page with the picture on it, in headless Chrome, swapping the image by script and without changing any site file: all three steps, with the logo cloud and the glass card on top. That preview, beside the opening picture, is what the owner gets.
4. Go over the acceptance list line by line and report pass or fail for each. One failed line = the result failed; say so first.
5. A low-quality draft shows layout, content and colour. It does NOT show stroke thickness; say that and do not claim it.
6. Change one thing per draft, and write the prompt and what came out in the log at the bottom of this file.
7. Two failed drafts in the same method: stop, change the method, and tell the owner why, before a third.

## Log, background for How I work (22.11.2026)

- high, text only, "empty calm sky, low city": flat striped sky, thin city. Failed.
- low, text + style image, rich sky and city half and half: right style and detail, wrong layout (owner wants sky on 75%).
- low, text "sky three quarters" + style image: city on 55%, cracked sky. Failed.
- low, layout image (old background) + style image: good style, good sky, but the horizon again near the middle (44%). The model puts the horizon near the middle whatever it is told or shown.
- What works: do not fight the model over the horizon. Take a picture with the right style and CROP the square the page shows so the horizon lands at 75% (script `pv.py crop`, preview `pv.mjs`). The preview of that crop on the real page passed layout, logo cloud and UI. For enough pixels in the crop, paint in portrait (1024x1536), where a middle horizon leaves a square of about 1000 px with the city in its bottom quarter.

- Then the owner rejected that draft for its COLOURS, and showed Hear's own painting `hear-v7/media/hero-contact-center-1600.webp` as what he means. Measured: in both reference paintings the foliage is cool emerald (hue ~150, about #43765d) and the sky cobalt-azure (hue ~207, about #3b8ed3). The draft had yellow-olive trees (hue 65) on 18% of the picture, pink and purple flower masses and orange roofs. I had passed "style" by eye and never checked colour.

- APPROVED and placed as `img/hw-sky-city.webp`: `images/edits`, `gpt-image-1.5`, `1024x1536`, `high`, two reference images (Hear's hero painting, the opening picture), then a 1024 square cropped from y=150. Measured: foliage hue 146, sky hue 204, warm colours 0%. The prompt that worked, in order: "paint the OUTSIDE VIEW seen through the windows of the references, sky and city only" → COLOURS with hex values and the forbidden list → TECHNIQUE (small crisp flat strokes, graphic, no weave / cracks / stripes) → SKY (open blue above and in the middle, white cumulus low and at the sides) → CITY (dense blue glass towers, white blocks with rounded balconies, emerald tree crowns along the bottom, strip of sea at the left).

- The owner then said that picture was not good: thin digital-looking strokes, blue too strong (saturation 85). The cause was the technique wording "small crisp flat strokes, graphic, like an editorial illustration" and the old model.

- REPLACED, approved by the owner and placed as `img/hw-sky-city.webp` (1600 square cropped from y=420): `images/edits`, `gpt-image-2.6-sunburst`, `1600x2400`, quality `max`, same two reference images, about $0.30 (plus $0.05 for a low check). Measured: sky hue 208, saturation 73, warm colours 0%, foliage hue 173 (a little too teal; hardly seen in the crop). The sky came out as thick visible knife strokes. The owner said 4K is not needed: strongest model and `max`, at a size that gives 2x the CSS pixels and no more. The script is `scratchpad/sky6.py`; its prompt is the fixed prompt below.

- OPENING PICTURE repainted the same day so all paintings speak one language, approved and placed: studio `img/me-v7-studio-b-1920.webp` (`2400x1600`, max, about $0.31) and portrait `img/me-v7-fig-b.webp` (`1168x1600`, max, about $0.22). These two are now the quality and style reference; the older `me-v7-studio-1536.webp` and `me-v7-fig-blue.webp` are the previous generation. Script `scratchpad/paint.py`.
  - Repainting an existing picture: image 1 = the picture to keep ("same composition, same camera, every object in the same place"), image 2 = a painting already in the new technique ("same painter, same day"), then the fixed TECHNIQUE and COLOURS blocks, then the content region by region.
  - The model ADDS things when repainting (extra people, a potted palm, a planter, more flowers). A COUNT block ("exactly four designers at the desk ... nobody else ... exactly one lamp") removed the extra people and lamps; the palm and planter stayed. Check the low draft for additions.
  - Portrait: the transparent background is not requested. Ask for "one flat, even, plain light grey (#ecece8), clean hard painted edge, no glow, no halo, no shadow", then cut it out with a flood fill from the borders (`scratchpad/cut.py`), which keeps the white collar. Likeness comes from giving the approved painted portrait as image 1 and listing the features; only the owner judges it.

## Log, footer sky (22.11.2026, night)

- The owner asked for a footer in the style of Hear's painted-sky footer, with a picture that suits him. Draft first: `images/edits`, `gpt-image-2.6-sunburst`, `2048x1024`, quality `low`, about $0.05, two references (Hear's hero painting for colour, `img/me-v7-studio-b-1920.webp` for the hand). Shown to the owner in place; he answered that the footer is excellent.
- APPROVED and placed as `img/foot-sky.webp` (3072 wide) and `img/foot-sky-s.webp` (1536 wide, phones): same call at `3072x1536`, quality `max`, about $0.28, with the low draft as a THIRD reference image ("the small sketch of this very picture, keep its composition exactly, repaint it large"). Measured: sky hue 208, saturation 85, value 95, warm colours 0.3%, yellow and olive 0%.
- The content block that worked: sky on about four fifths, "the top half and the whole centre are open blue with no clouds at all", cumulus piled low along the horizon and rising at the far left and far right like two wings, a few gulls, two kites (coral, lilac); the city only as a low band along the bottom edge seen across the water: glass towers, white Bauhaus blocks with flowering climbers, striped awnings, emerald crowns, lighthouse with a coral band, pier, sailboat with a lilac sail, coral fishing boat, two coral buoys. Here an open sky was right because text lies on it; it was asked for as "open blue built from broad knife strokes in different directions", never as empty or calm.
- Small things do not go where the prompt says. The kites were asked for "a little left of the centre, one third down" and landed there, but the page needed them between the signature and the link columns. Moving them afterwards was cheaper and exact: copy a feathered box around them to the new place and close the hole with a feathered box of sky from the same height further right (PIL only, box with a wide margin so no tail is left behind). Check the result at full size for ghosts.
- The picture is anchored to the bottom of the footer and is 50vw high, so the top of the painting is what sits under the text. Check every width (1440, 1920, 390) that no kite, gull or cloud lies under a word.

## Log, Topics pencil underdrawing (24.11.2026)

- A graphite underdrawing of the Topics sky (`img/topics/sky.webp`), shown at Sketch and painted over by the brush at Hear's world. Draft: `images/edits`, `gpt-image-2.6-sunburst`, sky.webp as the only reference, "the artist's preparatory GRAPHITE PENCIL UNDERDRAWING ... the painting could be laid over the drawing and match line for line", grey graphite on cool white paper, no colour named as forbidden. Quality `low`, about $0.04. Shown to the owner in place; he approved it.
- Final: same call at `high 2048x1360`, about $0.08, with the low draft as image 2 and "The shading is LIGHTER and SPARSER than in that sketch: only a few loose hatch lines on each cloud's shadow side, never a dense or solid dark patch." The clouds registered with the oil sky in a 50% overlay. Mean saturation 0.30 (grey).
- To place it, convert to alpha, not multiply: colour 39,40,43; alpha = ((paper - v) / (paper - 40)) ^ .85, paper = the 60th percentile of the grey histogram (254). `scratchpad/palpha.py`, WebP q80, 328KB. Shown at opacity .32 behind a mask that starts at the window's top, so the head stays clear.

## THE FIXED PROMPT. Every painting uses these blocks word for word.

Only the SUBJECT block changes from picture to picture. Both reference images go in with every call.

OPENING: "It must look as if the same painter made it on the same day as the FIRST reference image."

TECHNIQUE: "a real impasto oil painting, thick opaque paint laid with a palette knife and flat brushes in thousands of small, crisp, confident strokes; every stroke a distinct plane of colour with a sharp edge and a slight ridge of paint; clearly hand-painted at every scale. Not a digital illustration, not anime, not pixel art, not vector, not a print: no flat fills, no outlines, no dithering, no fine hatching, no canvas weave, no cracks, no stripes, no blur, no photo realism."

COLOURS: "taken from the windows of the references and from nowhere else. Sky: cobalt-azure blue, about #3b8ed3, with darker #2a78c6 and lighter #6cb4ec strokes; rich but natural, not electric, not neon, not ultramarine. Trees: COOL emerald and teal greens only, about #43765d, with darker #2c5a48 and lighter #6aa98a. Absolutely no yellow, no yellow-green, no olive, no lime, no golden or warm foliage. Buildings: blue glass towers (cobalt, azure and pale sky-blue reflections) and clean cool white facades with pale blue shadows. Only tiny accents of coral and lilac. No pink or purple flower masses, no orange roofs. The whole picture is cool: blue, white and emerald."

SUBJECT (changes): what is in the picture, region by region, with many named things in each region. For the How I work background it was SKY (blue built from broad knife strokes in different directions; top and centre open; thick sculpted white cumulus with pale blue and lilac shadows only low above the skyline, larger at the far left and right) and CITY (dense blue glass towers with window grids and reflections, white apartment blocks with rounded balconies and roof terraces, big rounded emerald tree crowns along the bottom, a thin strip of sea at the far left).

CLOSING: "Bright late-morning light from the left, strong light and shadow planes on every building. No text, no letters, no logos."

Never write "flat strokes", "graphic" or "editorial illustration" in the technique: that wording gave the thin digital look.

## Colour is checked with numbers, every time

- The colour reference is `hear-v7/media/hero-contact-center-1600.webp` together with `img/me-v7-studio-1536.webp`. Send both as reference images.
- Write the palette into the prompt as hex values sampled from the references, and name what is forbidden (yellow, olive, lime, warm foliage, pink or purple flower masses, orange roofs).
- After every result, before showing it: measure mean hue / saturation / value of the sky pixels and of the green pixels, and put them next to the reference numbers. Foliage hue must be 140 to 165, sky hue 203 to 212 with saturation near 70. If not, it failed.
- "Style matches" is never reported from a look alone. Report: layout, colour numbers, content, stroke, each on its own line.

## Rules

1. Never ask for an empty, calm, clean or plain area. Room for UI comes from cropping, positioning and the glass card on top, never from emptiness in the painting.
   For the "How I work" background the owner wants the sky on about 75% of the picture, so the UI on top is what is seen, and the city only as a band at the bottom. Open sky is fine; flat sky is not: describe the blue as thick knife strokes in several blues, put clouds low and at the sides, and say "no canvas weave, no stripes".
   The Hear logo cloud is NOT painted. It is a separate layer (`.hl-cloud`) shown only on the Design step; show the owner a preview with it on top.
   COMPOSITION IS GIVEN AS AN IMAGE, NEVER AS WORDS. The model ignores proportions written in text ("sky on three quarters" gave a city on 55%). Use `images/edits` with image 1 = a picture that already has the wanted layout (for this background: the existing `img/hw-sky.webp`) and image 2 = `img/me-v7-studio-1536.webp` for style, and ask to repaint image 1 with the same layout in the technique of image 2. This is how the owner's portrait was made, and it worked.
2. Every region of the picture gets named content and visible thick strokes: the sky has painted clouds and knife strokes in the blue itself, the city is dense and close.
3. Before paying: write the prompt, then check it against the list above. If it has fewer concrete objects than the opening prompt, or any word like empty / calm / minimal / simple / low, rewrite it first.
4. State the price and wait for a clear yes before every call, including every retry.
5. First a draft at quality `low` (a few cents) to check composition and richness. Pay for `high` only when the draft passes.
6. When a result comes back, compare it with `img/me-v7-studio-1536.webp` side by side BEFORE touching the site: stroke thickness, amount of detail, density, clouds, colour. If it is weaker, do not place it. Show it to the owner and say plainly that it failed.
7. Never place a new painting in the page before the owner has seen the picture itself and approved it.
8. Keep the working prompt of every approved painting in this file, so the next one starts from what worked.


## The harbour at another hour (23.11.2026): made, measured, WAITING for the owner's approval

The closing picture (`img/end-harbour.webp`) repainted at dusk and at night, for the Contact frame that follows Tel Aviv's hour (`v7/close.js`, live only when `#contact` carries `data-hours`; `?hour=dusk|night` shows one hour).
Files: `img/end-harbour-dusk.webp`, `img/end-harbour-night.webp` (2304x1536) and their `-1152` phone sizes.
Call: `v1/images/edits`, `gpt-image-2.6-sunburst`. Image 1 = `img/end-harbour.webp` (the composition, given as a picture), image 2 = `hear-v7/media/hero-contact-center-1600.webp` (paint and palette), and for the full-size render image 3 = the low draft of the same hour. Low draft 1536x1024 about $0.05, max 2304x1536 $0.30 each.
What worked: a "sunset" asked for as the blue hour (cobalt, lilac, one low coral-pink band) keeps the no-yellow, no-orange rule; a night asked for as "deep blue and never black" with lit windows in cream-white and coral stays in the palette. The composition held object for object in both.
Measured (share of pixels; sky = median hue / saturation / value of the top eighth): day yellow 0, orange 0.03, coral 2.7, sky 209/86/94. Dusk yellow 0, orange 0, coral 2.95, near-black 0.02, sky 215/92/76. Night yellow 0, orange 0, coral 2.99, near-black 0.01, sky 215/95/58.

KEEP: "The FIRST reference image is a finished painting of a harbour city seen from the water. Paint the SAME picture again, by the same painter, at a different hour of the same day. Same composition, same camera, same horizon height: every tower, every white Bauhaus block, every awning, every beach cabin, the lighthouse with its coral band, the pier, the promenade railing, the coral fishing boat, the sailboat with the lilac sail, the teal rowing boat, the white sailboat, the two coral buoys and the jetty corner with flower pots stay exactly where they are, the same size and the same shape. Do not add objects, people, boats or buildings and do not remove any. Only the light, the sky and the colours of the hour change. The SECOND reference image is by the same painter: take from it only the richness of the paint and its coral, lilac, magenta-pink, emerald, cobalt and cream. No people, no desks, no office. "

FORBID: "FORBIDDEN in every part of the picture: yellow, golden light, orange, amber, yellow-green, olive, lime, warm or golden foliage, orange roofs, beige, brown, black. Light that would be yellow in a photograph is painted here as cream-white (#f4efe6) or as coral (#e8604a). The darkest colour in the picture is a deep cobalt navy (#123a6b), never black and never grey. "

HOUR, dusk: "THE HOUR: the blue hour, a few minutes after the sun has gone down behind the viewer. A cool, clear evening, not a sunset picture. SKY: built from broad visible knife strokes in different directions; deep cobalt (#1f5fae) at the top, through azure (#3b8ed3) in the middle, to a band of lilac (#b9a6e6) and then a thin low band of coral-pink (#f08c7c) just above the skyline. The cumulus clouds of the first reference are in the same places, now lilac and pale blue with coral-pink undersides and cool white rims; three or four first stars as small thick dabs of white near the top; the gulls are gone or tiny. CITY: the glass towers are deep cobalt and azure, many of their windows lit as small crisp squares of cream-white, a few of coral; the white blocks are pale blue-lilac in shadow with cream-white lit windows and balcony doors; the striped awnings and beach cabins keep their coral, lilac, teal and white, a tone deeper; the tree crowns are deep cool emerald (#2c5a48); a string of cream-white lamps along the promenade railing; the lighthouse lamp is lit cream-white. SEA: deep cobalt and azure short horizontal knife strokes, with long broken vertical reflections of the cream-white windows and lamps, of the coral band low in the sky and of the lilac clouds; white foam lines; the boats keep their colours a tone deeper, each with one small cream-white lantern and its reflection. LIGHT: soft even evening light, the last cool glow from behind the viewer; the brightest things are the lit windows, the lamps and the low coral band. "

HOUR, night: "THE HOUR: a clear night with a bright full moon. A night picture that is still full of colour and easy to read, deep blue and never black. SKY: built from broad visible knife strokes in different directions; deep cobalt navy (#123a6b) at the top to cobalt (#1f5fae) low above the skyline; full of stars as small thick dabs of white and pale blue of different sizes; a round white moon with a pale blue ring high at the upper left; the cumulus clouds of the first reference are in the same places, now deep blue with moonlit white and lilac rims. No gulls. CITY: the glass towers are deep cobalt with grids of lit windows as small crisp squares of cream-white, some coral, some pale azure; the white blocks are moonlit pale blue with cream-white lit windows and coral-lit balcony doors; the striped awnings and beach cabins keep their coral, lilac, teal and white, deeper, each cabin with a small cream-white lamp over its door; the tree crowns are deep emerald (#2c5a48) with moonlit teal tops; a string of cream-white lamps along the promenade railing and the pier; the lighthouse lamp is lit, with one pale beam painted as a few broad strokes across the sky. SEA: deep cobalt navy with azure knife strokes; a broad broken path of white moonlight across the water; long vertical reflections of the cream-white and coral windows and lamps; white foam lines; the boats keep their colours, deeper, each with a cream-white lantern and its reflection; the two coral buoys stay coral. LIGHT: moonlight from the upper left, cool white rims on every boat, roof and cloud. "

Prompt order: KEEP + TECHNIQUE (above) + HOUR + FORBID + "No text, no letters, no logos." For the full-size render add: "The LAST reference image is the small sketch of this very picture: keep its composition and colours exactly and repaint it large."
