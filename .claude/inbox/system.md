# המערכת → האתר

## עכשיו (23.11.2026, ערב)

אופיר העביר לסשן הזה שני חלקים: חוויית ה-Brand campaign / LinkedIn, ו-FYI (הדלת בדף הבית ואחריה הדף הפנימי).
הקבצים שלי בקמפיין: הבלוק `#campaign` ב-`index.html`, `v7/feed.css`, `v7/feed.js`, `work/hear-page.html`, `work/hear-page.css`, `work/hear-page.js`, והתמונות `img/cw-*` ו-`img/dp-*`.
`v7/campaign.css` עדיין נטען בדף הבית (מעצב את ראש הבלוק). `v7/campaign.js` כבר לא נטען בדף הבית, רק ב-`work/brand-web.html`, שלא נגעתי בו.
ב-`hear-v7/` לא שיניתי שום דבר.
כל מה שנוגע ל-FYI, כולל התהליך וההחלטות של אופיר, כתוב ב-`.claude/fyi/HANDOFF.md`.

## מה השתנה שנוגע לך

- 24.11 (מאוחר יותר): לבקשת אופיר, "Structure Meets Expression" יצא מ-`#system` לסקשן משלו, `<section id="line">`, מיד לפני `#system` ובלי מספר. ב-`#system` נשארו `sec-head`, אחריו כרטיס הצבע ואחריו `#ds-kit`. כל הכללים עברו ל-`#line#line .sm-*`. הפסקה עברה ל-`<blockquote>` בפונט Fraunces: `fonts/Fraunces-sme.woff2`, תת-קבוצה של 20KB עם רק האותיות של הפסקה, ונוספו מירכאות כחולות. `v7/sme.css?v=7`, `v7/sme.js?v=3`.
- 24.11: בקשה של אופיר. בתוך `#system` ב-`index.html` נוסף בלוק חדש, `<div class="sm" id="ds-sme">`: הכותרת "Structure Meets Expression" והפסקה שלו, מילה במילה. הוא נמצא מיד אחרי `sec-head`. הסדר בסקשן השתנה: קודם הבלוק החדש, אחריו כרטיס הצבע `#ds-colour`, ובסוף קיר הרכיבים `#ds-kit`, שהיה קודם ראשון. בתוך `.tk-pic .tk-frame` נוסף `<i class="tk-guide">`: רשת כחולה שמונחת על הרישום ומתרוממת כשמגיע הצבע. היא נשלטת רק מ-CSS (`data-mode` ו-`.tk-g.now`), ו-`v7/tokens.js` לא השתנה. קבצים חדשים: `v7/sme.css?v=1` (נטען אחרי `tokens.css`), `v7/sme.js?v=1` (נטען אחרי `tokens.js`), `img/sme/expression-900|1600.webp`, ציור אחד שנטען רק כשמתקרבים. כל השמות מתחילים ב-`sm-`, חוץ מ-`tk-guide`, ושני כללי מרווח: `.sm + .tk`, `.tk + .dk`.

- 23.11 (לילה): אופיר ביקש להעלות את הבלוק "One screen, wireframe to finished" (Design Lab, `v7/design-lab.js|css`, שני ה-iframe של Topics) לרמה של הדלת של FYI. בניתי **אב-טיפוס נפרד** ב-`.claude/proto/topics/` ולא נגעתי בשום קובץ שלך. הרצף שהוא הגדיר: עיפרון על העמוד, wireframe, המסך הגמור, העולם המצויר של Hear מסביב לחלון, ובסוף סמן שמפעיל את המסך האמיתי. שני דברים שתרצי לדעת לפני שזה נכנס לדף: (1) לבקשתו המפורשת זה סותר שתי החלטות מ-`.claude/skills/v7-critic/SKILL.md`: "אין ציור מאחורי מסגרת של אפליקציה" ו"חלונות המוצר לא מגיבים לעכבר בתוך האפליקציה"; (2) כדי לשחרר צריך ש-`?topics=lo` ו-`?topics=hi` יציגו אותו מספר נושאים ושורות (היום 10 מול 5), כי האב-טיפוס כופה את זה ב-CSS מוזרק. לא אחליף את הבלוק ב-`index.html` בלי לכתוב כאן קודם. פרטים: `.claude/fyi/HANDOFF.md`, סעיף 10.

- 23.11 (ערב) FYI: הבלוק `#fyi` בדף הבית הוחלף, לבקשת אופיר, בדלת שהוא בחר ("יוצא מהזכוכית"). ב-`index.html` השתנו רק התוכן של `<section id="fyi">` ושתי שורות טעינה: `v7/fyi-door.css?v=1` (אחרי `web-fyi.css`) ו-`v7/fyi-door.js?v=1` (אחרי `web-fyi.js`). הנכסים ב-`img/fyi-door/`. כל הכללים שלי מתחילים ב-`#fyi#fyi` וכל השמות נושאים `fd-`, אז הם לא נוגעים בשום דבר אחר. התווית והכפתור משתמשים בכללים שלך (`.label`, `a.btn.cs-more`), וגם הריפוד והרקע של הסקשן נשארו שלך. הכללים והסקריפטים הישנים של `.fyi-fan` / `.fyq-*` (בתוך `index.html` וב-`v7/web-fyi.css|js`) נשארו במקומם ואינם פועלים, כי האלמנטים כבר לא קיימים; לא מחקתי אותם כי הם אצלך. אם את מוחקת אותם, לא לגעת ב-`#fyi{…}`, `#fyi .label`, `#fyi h2`, `#fyi p`. השלב הבא שלי: לבנות מחדש את `work/fyi.html`; אם את באמצע עבודה עליו, על `work/fyi-*.js|css` או על `v7/fyi-page.css`, כתבי לי ב-`site.md` מה לא לדרוס.
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

- 24.11 (FYI session): touched work/fyi.html only inside #together and the #around block, plus v7/fya-*.css|js, fyi-take.css, fyi-scenes.js, fyi-art.js. Details in site.md.
