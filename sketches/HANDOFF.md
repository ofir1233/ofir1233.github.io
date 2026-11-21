# Home page rebrand to the Hear v7 look: where it stands (2026-11-21)

Work in progress. Run locally with `python3 -m http.server 8000` from the repo root.

## What is built (index.html)
- **Opening (#about):** name and line centred, one framed painting of a Tel Aviv boulevard with the blazer figure cut out in front
  (`img/me-v7-tlv-*.webp`, `img/me-v7-fig.webp`). Tilt and depth under the mouse. On scroll (>= 861px, motion allowed) it pins:
  the frame grows into the name's place and four white facts rise one by one over a bottom shade. Classes: `me-v7`, `me-stage`,
  `me-pin`, `me-facts`; `html.me-scroll` switches it on.
- **Accent:** the greens are replaced site-wide by the Studio blue `#139FFD` (`#0B6FCF` on light).
- **"One designer" (#top):** light section in the Hear layout. Three numbered steps (`hx-steps`) tied to the existing window pager;
  one Design Lab window at a time in a glass frame over `img/top-sky-tlv.webp`; pinned, the scroll walks 1 -> 2 -> 3
  (`html.hx-scroll`).

## Open
- Ofir's last note on #top: the screen is crowded and dense. Not addressed yet. Ideas: shorten the paragraph, drop the two
  buttons, zoom into one part of the product window, more air.
- Not checked: dark mode, phones, real mouse feel, the step 2 window.
- `sketches/opening-v7.html` holds the low-fidelity layout options; `sketches/src/` the source paintings (Gemini
  `gemini-3-pro-image-preview`, 2K; prompts follow the brand playbook in the hear-design repo).
