# Case studies, rebuilt from the reader's side (24.11.2026)

## Why
Owner, 24.11.2026 (translated): "The case studies don't work well, and it is not the first time I ask to fix them. There is a deeper
problem: the information is hard to understand and take in, and every attempt to explain it with animations creates more load."
Later the same day: "If you find a need to improve the design itself and add things that contribute to the research and show
higher-level product-definition thinking, you can; I approve."

An audit of all seven pages (four reviewers) and a research pass agreed on the root causes:
1. No outside-in frame. The first screen never says what Hear is, who uses the screen, the problem in user terms, or where the work stands.
2. The story is told from the build log (versions, commits, "V4 + Filter", "the Lab's July build", library swaps), not from a user's problem.
3. Inventory instead of argument: chapters describe what each part of the screen does, every chapter has the same weight.
4. Motion carries the opening: self-playing camera tours of the live app (14 to 40 s, cropping labels, tiny captions) play before the
   reader knows what they are looking at, and usually show something other than the chapter's point.
5. Each page bundles two to four projects; the meaning is folded behind Read more while the motion is not.
Seventeen earlier critic rounds polished pixels and never tested comprehension. That is why the problem kept coming back.

## The model page
`work/explainable-scores.html`, built on `v7/cs2.css` + `v7/cs2.js`. Read both, and look at the page at http://localhost:8001/work/explainable-scores.html.
Order of a page:
1. Hero: kicker, a plain title that states the outcome/claim, ONE context sentence (what Hear is, who uses this screen, what I made),
   a four-cell summary (For · The problem · What I did · Where it stands), then ONE annotated still with 2–4 numbered pins and their key,
   and optionally a "Try the live screen" button that loads the real screen only on click.
2. The setting: the domain in plain words, often as a four-box flow (`.c2-flow`, the box I designed marked `.is-me` with `<em>My screens</em>`).
3. The problem: in user terms, ideally a before/after (`.c2-ba`), plus the questions the user brings (`.c2-qs`, each pointing to the step that answers it).
4. How it works: a reader-controlled stepper (`.c2-steps`) of 2–4 stills; nothing advances by itself.
5. One or two real decisions (`.c2-dec`): the question, the chosen option, the one set aside, and why in user terms.
6. Where it stands + my part (`.c2-stand`), said plainly and honestly.
7. The existing Next card, unchanged.

## Rules
- Never invent a fact, number, user, quote, outcome or date. Use only what is already on the page (or the home page). If something
  important is missing, leave it out and list it as NEED in your report. Do not write placeholders on the page.
- Plain words. Define a domain term on first use ("agents", the people who answer calls). Remove internal names: Lab version names,
  "V1/V2", commit wording, library names, "Northwind" unless defined once, "Mission Control", "platform surface", etc.
- Headings are whole claims; reading only the headings tells the story. One idea per section, one visual per idea.
  Main path about 600–1,000 words; no paragraph over ~60 words. No Read more / folded text.
- Visuals: existing stills (`img/v7s-*.webp` and others already on the page). Annotate with `.c2-pin` (left/top as % of the image)
  and a `.c2-key` under it. No new paid images. A live product window only behind a `.c2-live` button (`data-live` = the same
  `hear-v7/plan/studio.html?screen=…` URL the page already uses). Remove the self-playing hero tours (`.px-host`, `product.js`,
  `depth.js`, `lab-*.css`, `px.css`) from the page.
- One page, one story. If a page bundles another project, keep it to one short section at most, or cut it and say so.
- Do NOT edit `v7/cs2.css`, `v7/cs2.js`, `index.html`, other pages, or anything in `hear-v7/`. If you need a page-only rule,
  put it in a `<style>` in the page's head, scoped under `.c2`. Keep the top bar, the footer and the Next card as they are.
- Check your page with Playwright at 1440x900 and 390x844 (require('/Users/ofirnona/Desktop/platform/node_modules/playwright-core'),
  chromium.launch({channel:'chrome'}), the server at http://localhost:8001): no console errors, nothing cut, pins on target,
  every image loads. Do not commit; the session that started you commits.
