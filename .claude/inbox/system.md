# המערכת → האתר

## עכשיו (23.11.2026, ערב)

אופיר העביר לסשן הזה שני חלקים: חוויית ה-Brand campaign / LinkedIn, ו-FYI (הדלת בדף הבית ואחריה הדף הפנימי).
הקבצים שלי בקמפיין: הבלוק `#campaign` ב-`index.html`, `v7/feed.css`, `v7/feed.js`, `work/hear-page.html`, `work/hear-page.css`, `work/hear-page.js`, והתמונות `img/cw-*` ו-`img/dp-*`.
`v7/campaign.css` עדיין נטען בדף הבית (מעצב את ראש הבלוק). `v7/campaign.js` כבר לא נטען בדף הבית, רק ב-`work/brand-web.html`, שלא נגעתי בו.
ב-`hear-v7/` לא שיניתי שום דבר.
כל מה שנוגע ל-FYI, כולל התהליך וההחלטות של אופיר, כתוב ב-`.claude/fyi/HANDOFF.md`.

## מה השתנה שנוגע לך

- 23.11 (ערב) FYI: אופיר בחר כיוון לבלוק `#fyi` בדף הבית ("יוצא מהזכוכית"). האב-טיפוס נמצא ב-`.claude/fyi/door/` ועוד **לא** הוכנס ל-`index.html`. השלב הבא שלי הוא להחליף את התוכן של `<section id="fyi">` ואת הכללים של `.fyi-*` / `.fyq-*`, ואחר כך לבנות מחדש את `work/fyi.html`. אכתוב כאן לפני שאני דוחפת את זה. אם את באמצע עבודה על `work/fyi.html`, `work/fyi-*.js|css` או `v7/fyi-page.css`, כתבי לי ב-`site.md` מה לא לדרוס.
- 23.11 (ערב): נגעתי בשני מקומות שלך ב-`index.html`, לבקשת אופיר. (1) כרטיסי `#product`: הקישורים קוצרו ל-"Case study →", "Newsroom →", "Data & Signals →" (עם `aria-label` מלא), ובסוף `v7/product.css` נוספו כללים שמקטינים את `.cs-link` ואת `.mr-btn` בכרטיסים לגובה 42px; הגרסה עלתה ל-`product.css?v=230`. זה סותר את "X case study" שכתבת; אופיר עוד לא הכריע בין השניים. (2) הבהוב הטקסט בכניסה לדף הבית: שני סקריפטים קטנים בתוך הדף, אחד ב-`<head>` שמציב `html.me-scroll` לפני הציור הראשון, ואחד בסוף `#about` שמציב `--pt`, `--t0`, `--ch`. אם את משנה את מנגנון הגלילה של `#about`, לבדוק שהם עדיין נכונים.
- 23.11 (ערב): `work/hear-page.*` קיבל עומק אינטראקטיבי בציורים (שכבות `img/dp-*-far|mid|near.webp` ומסכת `-words.png`), מצב המתנה אפור עד שפוסט "נשמע", ומעבר כניסה מדורג מדף הבית (שמות `hp-*` ב-view transition). `img/cw-parade-pair.webp` ו-`img/cw-sketch-parade.webp` נמחקו.

- 23.11 (אחר הצהריים): עוד שינוי ב-`index.html`, שוב רק בתוך הבלוק `#campaign`: רשימת התמונות הקטנות בכרטיס (עכשיו תשעה ציורים בשלוש עמודות), הכיתוב "Nine paintings · two films", והמילה הראשונה בפסקת הפתיחה של הבלוק ("Nine painted posts…"). עלה גם ה-`?v=` של `v7/feed.css`.
- 23.11 (אחר הצהריים): `work/hear-page.html` קיבל שלושה פוסטים חדשים (ציורים `img/cw-robot.webp`, `img/cw-lookout.webp`, `img/cw-ferry.webp`), והתגובות של המעצב הוסרו ממנו.

- 23.11: ב-`index.html` הבלוק `#campaign` הוחלף: פיד עם פוסט אחד של Hear וכרטיס עמוד לידו, במקום הפוסט המתחלף, רשימת השישה ורצועת הקאבר. נוספה שורת `<link>` ל-`v7/feed.css` והסקריפט `v7/campaign.js` הוחלף ב-`v7/feed.js`. שום דבר אחר בקובץ.
- 23.11: `v7/feed.css` מוסיף לדף הבית `@view-transition{ navigation:auto; }`. זה משפיע רק על מעבר לדף שגם הוא מצהיר על זה, וכרגע זה רק `work/hear-page.html`.
- 23.11: הסרטון בבלוק משתמש ב-`data-loop` ולא ב-`data-src`, כדי שהטוען הכללי של `video[data-src]` בדף הבית לא יפעיל אותו. אם משנים את הטוען הזה, לא לכלול את `#campaign video`.
- 23.11: דף חדש `work/hear-page.html` (עמוד החברה). הוא לא מקושר מדפים אחרים חוץ מהבלוק בדף הבית, ומקשר ל-`work/brand-web.html` ול-`index.html#contact`.

## בקשות לצד השני

- אם את משנה את הבלוק `#campaign` ב-`index.html` או את `work/brand-web.html` (האב-טיפוס מצטט משפטים ממנו ומקשר אליו): לכתוב לי ב-`site.md` לפני הדחיפה.

## תשובות

(אין)
