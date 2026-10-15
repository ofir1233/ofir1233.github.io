// Agent evaluation in four modes: light, dark, Hebrew right to left, then light again. The tokens and the direction
// change; the components stay the same. The score chart is swept with the cursor in each mode.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    bug: 'M9 7.5V6.5a3 3 0 0 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.5 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M21 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4M8 2l1.9 1.9M16 2l-1.9 1.9',
    cuser: 'M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM12 13a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM6.6 19.4a6 6 0 0 1 10.8 0',
    lchart: 'M3.5 3.5v15a2 2 0 0 0 2 2h15M19 9l-5 5-4-4-3 3',
    cal: 'M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5zM8 2.5v4M16 2.5v4M3.5 9.5h17M7.5 13h.01M10.5 13h.01M13.5 13h.01M16.5 13h.01M7.5 16.5h.01M10.5 16.5h.01M13.5 16.5h.01M16.5 16.5h.01',
    info: 'M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM12 16.5v-5M12 8h.01',
    up: 'M6 15l6-6 6 6',
    sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
    mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21',
    slashsq: 'M6 3.5h12A2.5 2.5 0 0 1 20.5 6v12a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 18V6A2.5 2.5 0 0 1 6 3.5zM14.5 8.5l-5 7',
    home: 'M3.5 10.5L12 3.5l8.5 7V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19zM9.5 20.5v-6h5v6',
    pen: 'M12 3.5H5.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V12M18.4 2.9a2 2 0 0 1 2.8 2.8L12.5 14.4l-3.7.9.9-3.7z',
  });

  // ---------- demo data: 30 daily scores, Sun Sep 13 to Mon Oct 12 ----------
  const SC = [76, 76, 75, 75, 74, 74, 76, 74, 74, 75, 74, 75, 75, 74, 75, 76, 77, 66, 68, 67, 67, 77, 77, 77, 77, 81, 80, 81, 76, 75];
  const TOP = [306, 306, 307, 308, 309, 309, 306, 309, 310, 308, 309, 308, 307, 309, 308, 305, 301, 327, 324, 326, 325, 302, 302, 301, 302, 292, 295, 292, 304, 307];
  const CL = ['d1d1d1', 'd1d1d1', 'd3d3d3', 'd6d6d6', 'd9cfce', 'd7d0ce', 'cfd1d1', 'd7d0d0', 'd8cfcb', 'd6d4d1', 'd6d1d2', 'd7d4d5', 'd6d6d6', 'd7d0d3', 'd6d6d6', 'd0d0d0', 'c3c5c5', 'edafa0', 'eab3a8', 'ecb0a6', 'e9b2a7', 'c7c9ca', 'c5c7c8', 'c3c5c5', 'c6c9ca', 'a8aeb1', 'aeb4b7', 'a5aeb0', 'cbcbcb', 'd5d5d5'];
  const CD = ['3d3d3d', '3d3d3d', '3c3c3c', '3b3b3b', '413c3e', '403b3d', '3d3d3d', '403c3e', '453c3c', '3c3c39', '3d3d3a', '3c3c39', '3c3c3c', '3d3d3d', '3c3c3c', '3e3e3e', '424343', '724b41', '684740', '6e4842', '6b4741', '3f4141', '404243', '414343', '404141', '49504e', '464d4b', '494f52', '3e3f42', '3c3c3c'];
  // calls depend only on the weekday (Sun..Sat); Sep 13 is a Sunday
  const CALLS = ['1,618', '3,177', '3,236', '3,118', '3,060', '2,883', '1,324'];
  const WD = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], he: ['יום א׳', 'יום ב׳', 'יום ג׳', 'יום ד׳', 'יום ה׳', 'יום ו׳', 'שבת'] };
  const MO = { en: ['Sep', 'Oct'], he: ['בספט׳', 'באוק׳'] };
  const dm = i => (13 + i <= 30 ? [13 + i, 0] : [i - 17, 1]);
  const dateLabel = (i, L) => { const [d, m] = dm(i); return L === 'he' ? `${d} ${MO.he[m]}` : `${MO.en[m]} ${d}`; };
  const tipDate = (i, L) => `${WD[L][i % 7]}, ${dateLabel(i, L)}`;

  const T = {
    en: {
      ae: 'Agent Evaluation', total: 'Total Agents', hide: 'Hide Filters', show: 'Show by agent name', evl: 'Evaluation:',
      last: '<span>Last 30 days</span>', filter: 'Filter', chip: 'Agent status : Active', clear: 'Clear all', upto: 'Up to 90 days',
      title: 'Average score over time', sub: 'Height and color = that period’s score · hover for calls', bars: 'Bars', trend: 'Trend', score: 'Score',
      poor: 'Poor 55', good: '95 Good', foot: 'Sep 13 – Oct 12 · 30 days · Time unit: Day · Scroll to zoom · drag to select · double-click to reset',
      cat: 'Category Averages', abs: 'Agents by average score', meta: '· 715 agents · 8 criteria', avg: 'Average <b>76/100</b> · 9 agents below 60', ag: 'agents',
      team: 'Team Performance', search: 'Search by team name...', cols: ['Team name', 'Agents', 'Last call date', 'Avg. handle time', 'Avg. score', 'Total calls'],
      based: n => `Based on ${n} calls`,
    },
    he: {
      ae: 'הערכת נציגים', total: 'סה״כ נציגים', hide: 'הסתר מסננים', show: 'הצג לפי שם נציג', evl: 'הערכה:',
      last: '<span><b>30</b> הימים האחרונים</span>', filter: 'סינון', chip: 'סטטוס נציג : פעיל', clear: 'ניקוי הכול', upto: 'עד 90 יום',
      title: 'ציון ממוצע לאורך זמן', sub: 'גובה וצבע = ציון התקופה · רחפו למספר השיחות', bars: 'עמודות', trend: 'מגמה', score: 'ציון',
      poor: 'חלש 55', good: 'טוב 95', foot: '13 בספט׳ – 12 באוק׳ · 30 ימים · יחידת זמן: יום · גללו לזום · גררו לבחירה · לחיצה כפולה לאיפוס',
      cat: 'ממוצעים לפי קטגוריה', abs: 'נציגים לפי ציון ממוצע', meta: '· 715 נציגים · 8 קריטריונים', avg: 'ממוצע <b>76/100</b> · 9 נציגים מתחת ל-60', ag: 'נציגים',
      team: 'ביצועי צוות', search: 'חיפוש לפי שם צוות...', cols: ['שם הצוות', 'מספר נציגים', 'תאריך קריאה אחרונה', 'זמן טיפול ממוצע', 'ציון ממוצע', 'סה״כ שיחות'],
      based: n => `בהתבסס על ${n} שיחות`,
    },
  };
  // score bands of the category bar: [range, agents, light, dark, width in px]
  const BANDS = [['90–100', 27, '#475e5d', '#6a7f80', 34], ['80–89', 198, '#889698', '#4f595b', 246], ['70–79', 341, '#d7d6d3', '#3c3c3c', 426], ['60–69', 140, '#f2a695', '#7a4b42', 175], ['<60', 9, '#fd6f56', '#bd5744', 11]];
  // a box placed from the inline start (left in English, right in Hebrew)
  const at = (s, t, w, h) => `inset-inline-start:${s}px;top:${t}px${w ? `;width:${w}px` : ''}${h ? `;height:${h}px` : ''}`;

  // ---------- the sidebar, in English or Hebrew ----------
  const NAV_HE = [['report', 'דוחות'], ['grid', 'מיני אפליקציות'], ['h', 'בינה'], ['term', 'סיגנלים'], ['alert', 'התראות'], ['shieldPlain', 'ציות'], ['shield', 'הערכת נציגים'], ['book', 'ידע'], ['spark', 'Magic API'],
    ['h', 'תפעול'], ['robot', 'משימות AI'], ['users', 'לקוחות'], ['bolt', 'פעולות'], ['bag', 'מרקטפלייס'], ['news', 'חדשות · כיוונים', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1]];
  const theme = s => s.replace(ic('moon'), `<span class="ds-th">${ic('moon', 'mo')}${ic('sun', 'su')}</span>`);
  const side = L => {
    let s = L === 'he' ? LX.shell({ active: 'הערכת נציגים', scroll: 19.5, nav: NAV_HE }) : LX.shell({ active: 'Agent Evaluation', scroll: 19.5 });
    s = theme(s).replace(`${ic('lang')}EN${ic('down')}`, `${ic('lang')}<span class="lg">${L === 'he' ? 'HE' : 'EN'}</span>${ic('down', 'lc')}`);
    if (L === 'he') s = s.replace(`Powered by ${LX.mark()}Hear`, `מופעל על ידי <span class="pw" dir="ltr">${LX.mark()}Hear</span>`).replace('<b>You</b>', '<b>את/ה</b>').replace('<span>A…</span>', '<span>ש…</span>').replace(`<span class="sb-tab">${ic('right')}`, `<span class="sb-tab">${ic('left')}`);
    return s;
  };

  // ---------- the main column ----------
  const head = L => {
    const t = T[L];
    const crumbs = `<span class="pill-ae">${t.ae}</span>${ic(L === 'he' ? 'left' : 'right', 'chev')}<span class="pill-tot">${t.total}<em>715</em></span>`;
    const seg = `<span class="seg"><span>V2</span><span>V3</span><span>V4</span><span class="on">V4 + Filter</span></span>`;
    const evl = `<span class="evl">${ic('lchart')}<span class="ev-l">${t.evl}</span><b>Service Quality</b>${ic('down')}</span>`;
    if (L === 'he') return `<header class="hd hd1">
      <span class="crumbs" style="${at(15, 16)}">${crumbs}</span>
      <span class="btn dbg" style="${at(347, 11, 128, 33)}">${ic('bug')}Debug Query</span>
      <span class="btn" style="${at(485, 11, 92, 33)}">${t.hide}</span>
      <span class="btn" style="${at(588, 11, 125, 33)}">${ic('cuser')}${t.show}</span>
      <span class="evlw" style="${at(732, 11, 169, 33)}">${evl}</span>
      <span style="${at(918, 8, 211, 40)};position:absolute">${seg}</span></header>`;
    return `<header class="hd">
      <span class="crumbs" style="${at(15, 14)}">${crumbs}</span>
      <span class="btn dbg" style="${at(488, 7, 128, 34)}">${ic('bug')}Debug Query</span>
      <span class="btn" style="${at(626, 7, 95, 34)}">${t.hide}</span>
      <span class="btn" style="${at(731, 7, 177, 34)}">${ic('cuser')}${t.show}</span>
      <span style="${at(918, 8, 212, 40)};position:absolute">${seg}</span>
      <span class="evlw r2" style="${at(21, 57, 220, 18)}">${evl}</span></header>`;
  };
  const filters = L => {
    const t = T[L], P = L === 'he' ? [[0, 142], [148, 81], [238, 121], [370]] : [[1, 134], [143, 89], [241, 162], [414]];
    return `<div class="fl">
      <span class="fbtn last" style="${at(P[0][0], 0, P[0][1], 29)}">${t.last}${ic('cal')}</span>
      <span class="fbtn add" style="${at(P[1][0], 0, P[1][1], 29)}">${ic('plus')}${t.filter}</span>
      <span class="chip" style="${at(P[2][0], 0, P[2][1], 29)}">${t.chip}<i>${ic('x')}</i></span>
      <span class="clr" style="${at(P[3][0], 0)}">${t.clear}</span>
      <span class="upto">${t.upto}</span></div>`;
  };
  const chart = L => {
    const t = T[L];
    const bars = SC.map((v, i) => `<i class="bar" data-i="${i}" style="left:${(4 + 29.76 * i).toFixed(2)}px;height:${482 - TOP[i]}px;--cl:#${CL[i]};--cd:#${CD[i]}"></i>`).join('');
    const xl = SC.map((v, i) => `<span data-i="${i}" style="left:${(17 + 29.76 * i).toFixed(2)}px">${v}</span>`).join('');
    const dt = [0, 5, 10, 15, 20, 25].map(i => `<span style="left:${(4 + 29.76 * i).toFixed(2)}px">${dateLabel(i, L)}</span>`).join('');
    return `<section class="card ch">
      <h3 class="ct">${t.title}</h3><p class="cs">${t.sub}</p>
      <span class="tog"><span class="on">${t.bars}</span><span>${t.trend}</span></span>
      <div class="plot" dir="ltr">
        ${[100, 80, 60, 40, 20, 0].map((v, k) => `<i class="gl" style="top:${(k * 46.8).toFixed(1)}px"></i><span class="yl" style="top:${(k * 46.8).toFixed(1)}px">${v}</span>`).join('')}
        <div class="bars">${bars}</div>
        <span class="rl">${t.score}</span><div class="xl">${xl}</div><div class="dt">${dt}</div>
        <div class="tip"><b class="td"></b><span class="tv"><b></b> / 100</span><span class="tc"></span></div>
      </div>
      <div class="lg-row"><span class="leg" dir="ltr"><span class="lp">${t.poor}</span><i class="grad"></i><span class="lp">${t.good}</span></span><span class="foot">${t.foot}</span></div>
    </section>`;
  };
  const cat = L => {
    const t = T[L];
    return `<section class="card ca">
      <h3 class="ct">${t.cat}</h3>${ic('up', 'col')}
      <div class="inner">
        <div class="l1"><span class="l1s"><b>${t.abs}</b>${ic('info')}<span class="mu">${t.meta}</span></span><span class="l1e">${t.avg}</span></div>
        <div class="dist" dir="ltr">${BANDS.map(b => `<i style="width:${b[4]}px;--cl:${b[2]};--cd:${b[3]}"></i>`).join('')}</div>
        <div class="dleg" dir="ltr">${BANDS.map(b => `<span><i style="--cl:${b[2]};--cd:${b[3]}"></i>${b[0]}<b>${b[1]} ${t.ag}</b></span>`).join('')}</div>
      </div>
    </section>`;
  };
  const team = L => {
    const t = T[L];
    return `<section class="card tm">
      <h3 class="ct">${t.team}</h3>
      <span class="srch">${ic('search')}${t.search}</span>
      <div class="th">${t.cols.map((c, k) => `<span style="inset-inline-start:${[80, 267, 400, 561, 694, 828][k]}px">${c}${k > 3 ? ic('info') : ''}</span>`).join('')}</div>
    </section>`;
  };
  const main = L => `<div class="mn">${head(L)}<div class="bd">${filters(L)}${chart(L)}${cat(L)}${team(L)}</div></div>`;

  const menu = () => `<div class="lm">${[['IL', 'Hebrew', 'HE'], ['US', 'English', 'EN', 1], ['SA', 'Arabic', 'AR'], ['FR', 'French', 'FR'], ['DE', 'German', 'DE'], ['ES', 'Spanish', 'ES'], ['PT', 'Portuguese', 'PT'], ['RU', 'Russian', 'RU'], ['CN', 'Chinese', 'ZH'], ['JP', 'Japanese', 'JA']]
    .map(([r, n, c, on]) => `<div class="lr${on ? ' on' : ''}" data-l="${c}"><small>${r}</small><span>${n}</span><em>${c}</em></div>`).join('')}</div>`;

  // the pre-roll: the chat home, for the first 0.64 s of the recording
  const NAV_CHAT = [['h', 'Main'], ['home', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['topics', 'Topics'], ['report', 'Reports'], ['grid', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['news', 'News · Directions', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1]];
  const chat = () => `<div class="pre">${theme(LX.shell({ active: 'Chat', nav: NAV_CHAT }))}
    <div class="pre-hist"><span>${ic('down')}History</span>${ic('pen')}</div>
    <header class="pre-hd"><b>Dashboard</b><span class="pre-v"><small>Briefing</small><span class="on">V1</span><span>V2</span><span>V3</span><span>V4</span><span>V5</span></span></header>
    <div class="pre-c">${LX.mark('pre-mk')}<h2>Good afternoon, there.</h2><p>What would you like to explore today?</p>
      <div class="pre-box"><span class="pre-ph is-typing">Who are my top p</span><span class="pre-ic">${ic('at')}${ic('slashsq')}</span>${ic('mic', 'pre-mic')}</div>
      <span class="pre-pill"><i></i>Identifying top topics...</span></div></div>`;

  const html = (L = 'en') => `<div class="ds" dir="${L === 'he' ? 'rtl' : 'ltr'}"><i class="pg"></i>${side(L)}${main(L)}
    <span class="ttip"></span>${L === 'en' ? menu() : ''}</div>`;

  // ---------- states ----------
  const setLang = (app, L) => {
    app.classList.toggle('rtl', L === 'he');
    app.querySelector('.ds').outerHTML = html(L);
  };
  const tipFor = (q, i, L) => {
    const tip = q('.tip');
    tip.querySelector('.td').textContent = tipDate(i, L);
    tip.querySelector('.tv b').textContent = SC[i];
    tip.querySelector('.tc').textContent = T[L].based(CALLS[i % 7]);
    tip.style.left = Math.max(4, Math.min(893 - 172, 4 + 29.76 * i + 13 - 86)).toFixed(1) + 'px';
  };
  // hover bar i (or none with -1)
  const hoverBar = ({ app, q, qa }, i, L) => {
    const bars = q('.bars'), on = i >= 0;
    const was = bars.classList.contains('hov');
    bars.classList.toggle('hov', on);
    if (!on) bars.classList.remove('set');
    qa('.bar.on, .xl .on').forEach(e => e.classList.remove('on'));
    if (on) {
      q(`.bar[data-i="${i}"]`).classList.add('on'); q(`.xl [data-i="${i}"]`).classList.add('on');
      tipFor(q, i, L);
      if (was) bars.classList.add('set');
    }
    q('.tip').classList.toggle('on', on);
  };

  LX.scene('system', {
    cls: 'sc-ds',
    html: () => chat() + html('en'),
    // the page's screenshots of this screen: light, dark, and Hebrew right to left (all without a hover)
    stills: {
      light: { set: ({ app }) => { app.querySelector('.pre').remove(); } },
      dark: { cls: 'dk', set: ({ app }) => { app.querySelector('.pre').remove(); } },
      rtl: { cls: 'rtl', set: ({ app }) => { app.querySelector('.pre').remove(); setLang(app, 'he'); } },
    },
    cursor: [0, 0],
    hold: 1600,
    rest: 5,
    times: [0, 3.36, 6.01, 9.42, 11.37, 13.32, 18.4, 21.82, 25.16],
    beats: [
      'Agent evaluation opens in the light theme.',
      'Hovering a score bar shows its day and calls.',
      'The theme button turns the whole app dark.',
      'The chart is hovered again, now in the dark theme.',
      'The language menu puts the sidebar and this screen in Hebrew.',
      'The layout mirrors right to left, except the time axis.',
      'The theme returns to light, still in Hebrew.',
      'Tooltips read in Hebrew with the same scores.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // after a jump the clock restarts, so the offset is taken again; in normal play it stays put and nothing drifts
      // c.beat() takes one frame, so a beat is entered one frame early and what follows starts on time
      const B = async (i, t0) => { await at(t0 - 0.016); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - t0 * 1000; };
      let L = 'en';
      app.classList.remove('dk', 'rtl');

      // the cursor's place now, in app pixels
      const where = () => { const m = new DOMMatrixReadOnly(getComputedStyle(c.P.cursor).transform); return [m.m41, m.m42]; };
      // the plot's box in app pixels
      const plot = () => { const [x0, y0] = c.pt(q('.plot'), { x: 0, y: 0 }); return [x0, y0]; };
      let hov = -1;
      const setHov = i => { if (i !== hov) { hov = i; hoverBar(c, i, L); } };
      const hit = ([x, y]) => { const [x0, y0] = plot(); const i = Math.round((x - x0 - 17) / 29.76); return y >= y0 - 8 && y <= y0 + 262 && i >= 0 && i < 30 ? i : -1; };
      // move the cursor in a straight line at an even speed, as the recording's pointer does
      const glide = (to, d) => {
        const P = c.P, [x, y] = to, x0 = P.cx, y0 = P.cy;
        P.cx = x; P.cy = y; P.place(); P.follow(x, y);
        if (c.ff) return Promise.resolve();
        P.anim(P.cursor, [{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x}px,${y}px)` }], { duration: d, easing: 'linear' });
        return c.wait(d);
      };
      // the lit bar is the one the cursor was over `lag` ms before: the recorded page answers the pointer late on some passes
      const sweep = async (to, d, lag = 8) => {
        const P = c.P, from = [P.cx, P.cy], t0 = P.t;
        const m = glide(to, d);
        if (c.ff) { setHov(hit(to)); return; }
        for (let e = 0; e < d; e = P.t - t0) {
          await c.wait(Math.min(8, d - e));
          const k = Math.max(0, Math.min(1, (P.t - t0 - lag) / d));
          setHov(hit([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]));
        }
        await m;
        if (lag) c.wait(lag).then(() => setHov(hit(to)), () => {}); else setHov(hit(to));
      };
      const tip = q('.ttip');
      const ttip = (text, on = true) => {
        if (on) { tip.textContent = text; tip.classList.add('on'); c.anim(tip, [{ opacity: 0 }, { opacity: 1 }], { duration: 60, easing: 'linear' }); }
        else { tip.classList.remove('on'); c.anim(tip, [{ opacity: 1 }, { opacity: 0 }], { duration: 60, easing: 'linear' }); }
      };

      // 1. the chat home for a moment, then the Agent evaluation screen, light
      await B(0, 0);
      const ph = q('.pre-ph');
      for (const [t, s] of [[0.04, 'pe'], [0.12, 'perf'], [0.24, 'perfo'], [0.32, 'perform'], [0.4, 'performin'], [0.48, 'performing']]) { await at(t); ph.textContent = 'Who are my top ' + s; }
      await at(0.64);
      q('.pre').remove();
      const nav = q('.sb-i.on');
      nav.classList.add('nobg');
      c.jump([136, 404]);
      await at(0.72); nav.classList.remove('nobg');

      // 2. sweep the score chart
      await B(1, 3.36);
      await sweep([630, 360], 360);
      await at(4.22); await sweep([900, 404], 370);
      await at(5.1); await sweep([1080, 342], 380);

      // 3. the theme button: dark
      await B(2, 6.01);
      await sweep([110, 848], 370);
      await at(6.4); ttip('Dark mode');
      await at(6.74); await c.click(q('.ds-th'), { after: 20 });
      await at(6.8); app.classList.add('dk'); tip.textContent = 'Light mode';

      // 4. the chart again, in dark
      await B(3, 9.42);
      // the sweep starts while the tooltip is still up; a stop mid-sweep must not leave a stray rejection
      const s1 = sweep([900, 404], 400); s1.catch(() => {});
      await at(9.48); ttip('', false);
      await s1;
      await at(10.4); await sweep([630, 378], 370, 40);

      // 5. the language menu: Hebrew
      await B(4, 11.37);
      await sweep([191, 795], 420);
      await c.click(q('.sb-lang'));
      const lm = q('.lm');
      await at(11.84);
      lm.classList.add('on'); q('.sb-lang').classList.add('open');
      c.anim(lm, [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 120, easing: 'ease-out' });
      await at(12.56);
      const he = q('.lr[data-l="HE"]');
      const m = glide([132, 466], 420);
      await at(12.96); c.hover(he);
      await m;
      await at(13.0); await c.click(he, { after: 0 });
      await at(13.06);
      L = 'he'; hov = -1;
      setLang(app, 'he');
      c.anim(q('.mn'), [{ transform: 'translateX(259px)' }, { transform: 'none' }], { duration: 250, easing: 'cubic-bezier(.4,0,.2,1)' });

      // 6. right to left, in dark: sweep the chart
      await B(5, 13.32);
      // phones: frame the mirrored header, the right-aligned title and the filters, not the parked cursor; the frame
      // ends at the main column's right edge, so the breadcrumbs and the first filter (where each row starts) stay whole
      c.cam([929, 300]);
      await at(16.27); await sweep([810, 404], 340);
      await at(17.31); await sweep([540, 378], 390);
      // a held frame (reduced motion, or a step) on a phone shows the mirrored layout, not the parked cursor
      if (c.ff) c.cam([929, 300]);

      // 7. the theme button: back to light
      await B(6, 18.4);
      const tip2 = q('.ttip');
      await sweep([1326, 847], 390);
      tip2.textContent = 'מצב בהיר'; tip2.classList.add('on'); c.anim(tip2, [{ opacity: 0 }, { opacity: 1 }], { duration: 100, easing: 'linear' });
      await at(19.18); await c.click(q('.ds-th'), { after: 20 });
      await at(19.24); app.classList.remove('dk'); tip2.textContent = 'מצב כהה';

      // 8. Hebrew tooltips in light
      await B(7, 21.82);
      const s2 = sweep([810, 404], 380); s2.catch(() => {});
      await at(21.84); tip2.classList.remove('on'); c.anim(tip2, [{ opacity: 1 }, { opacity: 0 }], { duration: 80, easing: 'linear' });
      await s2;
      await at(23.0); await sweep([630, 270], 380);
      await at(25.16);
    },
  });
})();
