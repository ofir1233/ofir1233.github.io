# Round 2 for every case page (24.11.2026, evening)

Two critics read the seven rebuilt pages. Comprehension: every first screen now answers what / who / problem / what I did in
under 10 seconds (scores 6–8); what a stranger still cannot answer is "did it ship, did it matter" — that needs the owner (NEED),
do not write it. Art direction: FAIL 6.5 — clear but it looks like documentation: too many identical white boxes, flat rhythm,
the same full screens repeated across pages, and six of seven pages have no moment of their own.

Shared changes already made in `v7/cs2.css` (the block at the end, "round 2") and `v7/cs2.js`: larger h2, more space between
sections, `.c2-sec.is-key` (a full-width pale-blue band for ONE section per page: the page's moment), stronger summary, pins in
Deep Blue, the flow as a line of stops, the questions as pull quotes, a quieter Before, decisions where the chosen option leads and
the "why" reads at 18px, the phone hero shows the picture before the summary, wide annotated stills pan on a phone (automatic).

For your page, on top of BRIEF.md (same rules: never invent facts; plain words; do not edit shared files, index.html, other pages
or hear-v7; page-only CSS in a `<style>` scoped under `.c2`; check at 1440x900 and 390x844 with Playwright; do not commit):
1. Build the page's ONE memorable moment (given in your task) as the `.is-key` section. It is moved only by the reader (click, tap,
   drag, keys), never plays by itself, built from facts already on the page, works without a mouse (buttons, focus states),
   respects prefers-reduced-motion, and has a clear first state that already makes the point. Any motion is short (≤400 ms) and
   shows a change. It replaces the section it supersedes (usually the stepper) rather than adding length.
2. End on the key decision, then "Where it stands". Add a claim heading to the ending: `<h2 class="c2-stand-h">…</h2>` before
   `.c2-stand` (e.g. "Designed and tested in the Lab, on demo data"). Say "my working copy of Hear" / "the Lab" once in the summary;
   keep the second mention short. Drop "Not every version in the Lab is finished".
3. One page, one story: a second project at the end (AI Tasks, Signals, Explorations, Same rule, Storybook) becomes one sentence
   inside another section, or is cut. A text-only section right before the ending should not remain.
4. No full product screen that already appears elsewhere on the page or on another case page: use a tight crop instead
   (you may crop existing stills with Python PIL into new files `img/v7s-<page>-<what>.webp`, quality ~82; no paid images).
5. Define every domain term on first use; replace screen names in the hero with what they do.
6. Leave the Next card as it is (the session that started you updates all of them at the end).
Report: what you changed, the moment and how it behaves, screenshot paths (1440 and 390, including the moment in two states), NEED.
