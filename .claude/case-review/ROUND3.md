# Round 3 for every case page (24.11.2026, night)

Critics after round 2: comprehension 7–8 per page; art direction FAIL 7.5 (up from 6.5). Brand, Data and Explainable scores land.
Shared (already in v7/cs2.css, "round 3" block): `.c2-coda` (the ending line), `.c2-status` (one quiet status line), `.c2-note`
(a decision that is not the key one, as a plain line).

For your page, on top of BRIEF.md and ROUND2.md (same rules: never invent facts; do not edit shared files, index.html, other pages
or hear-v7; page CSS in the page `<style>` scoped under `.c2`; Playwright at 1440x900 and 390x844; do not commit):
1. Picture on the first screen at 1440: cut the hero lead to 2–3 lines and each summary cell to ~3 lines, so the top of the
   annotated still shows above the fold at 1440x900. Check it.
2. One definition per term, worded exactly so on every page where it appears:
   - agents: "the people who answer the calls"
   - alerts: "checks the team sets, which fire on a call"
   - signals: "labels Hear puts on calls, by AI or by rule"
   - agent evaluations: "scores for the person who took the call"
   - the Lab: "Hear Design Lab, my working copy of Hear, built in code" (in the summary; afterwards just "the Lab")
   Define a term only where the page needs it.
3. Ending: replace the two-column `.c2-stand` block (and its `h2.c2-stand-h`) with ONE `<p class="c2-coda">` line that comes from the
   page's moment (a claim the reader has just seen proven, e.g. "One low score, twelve calls, one cause."), then ONE
   `<p class="c2-status">` line: where it stands and my part, plainly (Lab, demo data, dates; nothing invented). Keep the Next card.
4. Only ONE decision per page in the two-card `.c2-dec` form (the key one); any other becomes a `<p class="c2-note">` line or is cut.
5. Cut the remaining build-log and side-project lines named in your task.
6. The moment's first state must carry the point by itself (fix what your task names).
7. No full product screen repeated across pages (your task names any).
Report briefly: what changed, screenshots (1440 and 390: first screen, the moment, the ending), NEED.
