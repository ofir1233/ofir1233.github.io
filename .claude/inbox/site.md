# האתר → המערכת

## עכשיו (23.11.2026)

עובדת על `index.html`, `v7/`, `work/` בענף `v7-rebrand`. כרגע: עיבוד מחדש של דף FYI (`work/fyi.html`, קובץ חדש `v7/fyi-page.css`), ואחריו החלק של FYI בדף הבית.
לא נוגעת ב-`hear-v7/`.
לא נוגעת גם בחלק של Brand campaign / LinkedIn (אופיר, 23.11: הוא עובד עליו עם הצד של המערכת): בדף הבית החלק `#web` עם דף החברה והכיסוי (`.cw-*`), `v7/campaign.css`, `v7/campaign.js`, וכן `work/brand-web.html`. מי שמשנה שם, שיכתוב ב-`system.md` אילו קבצים, כי `index.html` משותף.

## מה השתנה שנוגע לך

- 23.11: הבלוק "One screen, wireframe to finished" בדף הבית מציג עכשיו שני iframe של `studio.html` זה על זה (`?topics=lo` ו-`?topics=hi`) עם קו השוואה. שניהם חייבים להישאר באותה פריסה ברוחב 1440, 860 ו-460, אחרת הם לא יתיישרו.
- 23.11: ה-staging ב-Vercel נפרס מ-`hear-v7/` כפי שהיה באותו יום. כל שינוי אחריו דורש פריסה ידנית.

- 23.11: `v7/case.css` (משותף לכל הדפים הפנימיים, גם ל-`work/brand-web.html`): הכמוסות על האיורים (`.shot .live`, למשל "Staging site" / "Mockup") מוסתרות עכשיו בכל הדפים; הערת המקורות עברה לפני כרטיס "הבא"; `.bw-go .pill` לבן עם קו דק. ב-`work/brand-web.html` עצמו שיניתי רק את סדר שני הבלוקים בסוף ואת מספר הגרסה של `case.css`, לפני שנאמר לי לא לגעת. מעכשיו לא נוגעת בו.
- 23.11: `v7/case.css` (משותף, גם ל-`work/brand-web.html`): הערת המקורות (`.sources`) מקבלת קו דק מעליה ורווח, כדי שלא תיצמד לבלוק האחרון. ב-`work/brand-web.html` עצמו לא נגעתי, ולכן הוא עדיין טוען `case.css?v=26`; כדי לראות את השינוי שם צריך להעלות את המספר.
- 23.11: מעכשיו אני מעלה `?v=` ב-`index.html` רק לקבצים שאני משנה, כדי לא לגעת בשורות ליד ה-`<link>` החדש שלך.
- 23.11: `v7/case.css` (משותף, גם ל-`work/brand-web.html`): `article.decision` הפך לשורות שטוחות על קו דק (ב-brand-web אין החלטות, אז אין שם שינוי); בטלפון `.chapter.sheet` רץ מקצה לקצה ואין יותר "Swipe the picture sideways" בכיתובים. `v7/px.css` ו-`v7/product.css`: לשוניות החלון (`.px-tabs`) הן מילים עם קו תחתון ולא כמוסה. ב-`work/brand-web.html` לא נגעתי.

## בקשות לצד השני

- אם משנים את `window.hearTopics.fidelity`, את `.side` / `.stage` / `.tp-*` במסך Topics, או את שמות ה-`screen=`: לכתוב לי כאן לפני הדחיפה.

## תשובות

(אין)

## 23.11 - home Product cards and inner pages (site session)
- Home `#product` cards: title, one short lead (`.pf-lead`), dark case-study button, outline Read more. Challenge, full paragraph and "same call" show only when Read more is open. Rules at the end of `v7/product.css`. Under the frame only the active step is written; the others are numbers.
- `v7/px.css`: tour step buttons are top-aligned columns.
- `v7/case.css`: a decision with a figure is a two-column grid from 900px; phone decision options have no left padding except the chosen one.
- `v7/fyi-page.css`: AI strip is an auto-fill grid (300px min); the field sheet stage text is capped at 540px.
- `#campaign`, `work/brand-web.html`, feed and campaign files: not touched.
- 23.11 (evening): `v7/case.css` now draws every `.more > summary` (Read more) on the inner pages as an outline button, 44px high, with a plus sign. This also reaches `work/brand-web.html` through the shared stylesheet; the file itself is untouched. FYI "All steps" has the same outline.

- 23.11 (site): `work/case.js` + `v7/case.css` now fold every `.decision` that has a chosen option and at least one other: closed shows the question and the chosen option, an outline button ("The option I ruled out") opens the rest and the reasoning. `work/brand-web.html` has no decisions, so nothing changes there. Loading: home paintings at the page end are fetched only near the postcard (`html.cl-near`), `img/bg-calm-sky-1600.webp` replaces the jpg in product.css, px.css and system.css.
