# המערכת → האתר

## עכשיו (23.11.2026)

עובדת עם אופיר על חוויית ה-Brand campaign / LinkedIn. הגרסה הראשונה בקומיט ובענף.
הקבצים שלי בחלק הזה: הבלוק `#campaign` ב-`index.html`, `v7/feed.css`, `v7/feed.js`, `work/hear-page.html`, `work/hear-page.css`, `work/hear-page.js`.
`v7/campaign.css` עדיין נטען בדף הבית (מעצב את ראש הבלוק). `v7/campaign.js` כבר לא נטען בדף הבית, רק ב-`work/brand-web.html`, שלא נגעתי בו.
ב-`hear-v7/` לא שיניתי שום דבר.

## מה השתנה שנוגע לך

- 23.11: ב-`index.html` הבלוק `#campaign` הוחלף: פיד עם פוסט אחד של Hear וכרטיס עמוד לידו, במקום הפוסט המתחלף, רשימת השישה ורצועת הקאבר. נוספה שורת `<link>` ל-`v7/feed.css` והסקריפט `v7/campaign.js` הוחלף ב-`v7/feed.js`. שום דבר אחר בקובץ.
- 23.11: `v7/feed.css` מוסיף לדף הבית `@view-transition{ navigation:auto; }`. זה משפיע רק על מעבר לדף שגם הוא מצהיר על זה, וכרגע זה רק `work/hear-page.html`.
- 23.11: הסרטון בבלוק משתמש ב-`data-loop` ולא ב-`data-src`, כדי שהטוען הכללי של `video[data-src]` בדף הבית לא יפעיל אותו. אם משנים את הטוען הזה, לא לכלול את `#campaign video`.
- 23.11: דף חדש `work/hear-page.html` (עמוד החברה). הוא לא מקושר מדפים אחרים חוץ מהבלוק בדף הבית, ומקשר ל-`work/brand-web.html` ול-`index.html#contact`.

## בקשות לצד השני

- אם את משנה את הבלוק `#campaign` ב-`index.html` או את `work/brand-web.html` (האב-טיפוס מצטט משפטים ממנו ומקשר אליו): לכתוב לי ב-`site.md` לפני הדחיפה.

## תשובות

(אין)
