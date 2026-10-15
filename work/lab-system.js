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
    sparkles: 'M9.9 15.5a2 2 0 0 0-1.4-1.4l-6.1-1.6a.5.5 0 0 1 0-1l6.1-1.6a2 2 0 0 0 1.4-1.4l1.6-6.1a.5.5 0 0 1 1 0l1.6 6.1a2 2 0 0 0 1.4 1.4l6.1 1.6a.5.5 0 0 1 0 1l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-1 0zM20 3v4M22 5h-4M4 17v2M5 18H3',
    lout: 'M9 20.5H5.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2H9M15.5 16.5l4.5-4.5-4.5-4.5M20 12H9',
    g4: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
  });
  // the recorded sidebar's own glyphs: a shield with a check for Compliance, sparkles, an incognito hat over glasses, a log-out door
  const INC = `<svg class="i inc" viewBox="0 0 24 24" aria-hidden="true"><path class="hat" d="M5.2 10.5l1.5-4.6a2 2 0 0 1 1.9-1.4h1.7l1.7 1 1.7-1h1.7a2 2 0 0 1 1.9 1.4l1.5 4.6zM2.5 10.5h19"/><path d="M4 17a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM14 17a3 3 0 1 0 6 0 3 3 0 1 0-6 0zM10 16.4c1.3-.7 2.7-.7 4 0"/></svg>`;
  const glyphs = s => s.split(ic('spark')).join(ic('sparkles')).split(ic('glasses')).join(INC).split(ic('out')).join(ic('lout'))
    .split(`data-nav="Compliance">${ic('shieldPlain')}`).join(`data-nav="Compliance">${ic('shield')}`);

  // ---------- demo data: 30 daily scores, Sun Sep 13 to Mon Oct 12 ----------
  const SC = [76, 76, 75, 75, 74, 74, 76, 74, 74, 75, 74, 75, 75, 74, 75, 76, 77, 66, 68, 67, 67, 77, 77, 77, 77, 81, 80, 81, 76, 75];
  const TOP = [306, 306, 307, 308, 309, 309, 306, 309, 310, 308, 309, 308, 307, 309, 308, 305, 301, 327, 324, 326, 325, 302, 302, 301, 302, 292, 295, 292, 304, 307];
  const CL = ['d1d1d1', 'd1d1d1', 'd3d3d3', 'd6d6d6', 'd9cfce', 'd7d0ce', 'cfd1d1', 'd7d0d0', 'd8cfcb', 'd6d4d1', 'd6d1d2', 'd7d4d5', 'd6d6d6', 'd7d0d3', 'd6d6d6', 'd0d0d0', 'c3c5c5', 'edafa0', 'eab3a8', 'ecb0a6', 'e9b2a7', 'c7c9ca', 'c5c7c8', 'c3c5c5', 'c6c9ca', 'a8aeb1', 'aeb4b7', 'a5aeb0', 'cbcbcb', 'd5d5d5'];
  const CD = ['3d3d3d', '3d3d3d', '3c3c3c', '3b3b3b', '413c3e', '403b3d', '3d3d3d', '403c3e', '453c3c', '3d3c39', '3e3c3a', '3d3c39', '3c3c3c', '3d3d3d', '3c3c3c', '3e3e3e', '424343', '724b41', '684740', '6e4842', '6b4741', '3f4141', '404243', '414343', '404141', '49504e', '464d4b', '494f52', '3e3f42', '3c3c3c'];
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
      based: n => `Based on ${n} calls`, band: 'Agents by score band', crit: 'Criteria',
    },
    he: {
      ae: 'הערכת נציגים', total: 'סה״כ נציגים', hide: 'הסתר מסננים', show: 'הצג לפי שם נציג', evl: 'הערכה:',
      last: '<span><b>30</b> הימים האחרונים</span>', filter: 'סינון', chip: 'סטטוס נציג : פעיל', clear: 'ניקוי הכול', upto: 'עד 90 יום',
      title: 'ציון ממוצע לאורך זמן', sub: 'גובה וצבע = ציון התקופה · רחפו למספר השיחות', bars: 'עמודות', trend: 'מגמה', score: 'ציון',
      poor: 'חלש 55', good: 'טוב 95', foot: '13 בספט׳ – 12 באוק׳ · 30 ימים · יחידת זמן: יום · גללו לזום · גררו לבחירה · לחיצה כפולה לאיפוס',
      cat: 'ממוצעים לפי קטגוריה', abs: 'נציגים לפי ציון ממוצע', meta: '· 715 נציגים · 8 קריטריונים', avg: 'ממוצע <b>76/100</b> · 9 נציגים מתחת ל-60', ag: 'נציגים',
      team: 'ביצועי צוות', search: 'חיפוש לפי שם צוות...', cols: ['שם הצוות', 'מספר נציגים', 'תאריך קריאה אחרונה', 'זמן טיפול ממוצע', 'ציון ממוצע', 'סה״כ שיחות'],
      based: n => `בהתבסס על ${n} שיחות`, band: 'נציגים לפי טווח ציון', crit: 'קריטריונים',
    },
  };
  // score bands of the category bar: [range, agents, light, dark, width in px]
  const BANDS = [['90–100', 27, '#475e5d', '#6a7f80', 34], ['80–89', 198, '#889698', '#4f595b', 246], ['70–79', 341, '#d7d6d3', '#3c3c3c', 426], ['60–69', 140, '#f2a695', '#7a4b42', 175], ['<60', 9, '#fd6f56', '#bd5744', 11]];
  // a box placed from the inline start (left in English, right in Hebrew)
  const at = (s, t, w, h) => `inset-inline-start:${s}px;top:${t}px${w ? `;width:${w}px` : ''}${h ? `;height:${h}px` : ''}`;

  // ---------- the sidebar, in English or Hebrew ----------
  const NAV_HE = [['report', 'דוחות'], ['grid', 'מיני אפליקציות'], ['h', 'בינה'], ['term', 'סיגנלים'], ['alert', 'התראות'], ['shield', 'ציות'], ['shield', 'הערכת נציגים'], ['book', 'ידע'], ['spark', 'Magic API'],
    ['h', 'תפעול'], ['robot', 'משימות AI'], ['users', 'לקוחות'], ['bolt', 'פעולות'], ['bag', 'מרקטפלייס'], ['news', 'חדשות · כיוונים', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1]];
  const theme = s => s.replace(ic('moon'), `<span class="ds-th">${ic('moon', 'mo')}${ic('sun', 'su')}</span>`);
  const side = L => {
    let s = L === 'he' ? LX.shell({ active: 'הערכת נציגים', scroll: 19.5, nav: NAV_HE }) : LX.shell({ active: 'Agent Evaluation', scroll: 19.5 });
    s = glyphs(theme(s)).replace(`${ic('lang')}EN${ic('down')}`, `${ic('lang')}<span class="lg">${L === 'he' ? 'HE' : 'EN'}</span>${ic('down', 'lc')}`);
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
      <span class="btn" style="${at(485, 11, 92, 33)}">${t.hide}</span>
      <span class="btn" style="${at(588, 11, 125, 33)}">${ic('cuser')}${t.show}</span>
      <span class="evlw" style="${at(732, 11, 169, 33)}">${evl}</span>
      <span style="${at(918, 8, 211, 40)};position:absolute">${seg}</span></header>`;
    return `<header class="hd">
      <span class="crumbs" style="${at(15, 14)}">${crumbs}</span>
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
  // the score bar's hover card: each band's agents and share (the recording shows it for one frame as the pointer crosses the bar; the scene leaves it hidden, since a one-frame card reads as a flicker)
  const band = L => `<div class="bp" aria-hidden="true"><b class="bp-t">${T[L].band}</b>${BANDS.map(b => {
    const pc = Math.round(b[1] / 715 * 100);
    return `<div class="bp-r"><i style="--cl:${b[2]};--cd:${b[3]}"></i><span class="bp-n" dir="ltr">${b[0]}</span><span class="bp-k"><i style="width:${pc}%;--cl:${b[2]};--cd:${b[3]}"></i></span><span class="bp-c"><b>${b[1]}</b> (${pc}%)</span></div>`;
  }).join('')}<b class="bp-t bp-t2">${T[L].crit}</b></div>`;
  const main = L => `<div class="mn">${head(L)}<div class="bd">${filters(L)}${chart(L)}${cat(L)}${team(L)}</div>${band(L)}</div>`;

  // the language menu; in Hebrew it stays up, mirrored, for the frame after the pick: Hebrew already bold, the old row's fill not yet moved
  const menu = (he = false) => `<div class="lm${he ? ' on' : ''}">${[['IL', 'Hebrew', 'HE'], ['US', 'English', 'EN', 1], ['SA', 'Arabic', 'AR'], ['FR', 'French', 'FR'], ['DE', 'German', 'DE'], ['ES', 'Spanish', 'ES'], ['PT', 'Portuguese', 'PT'], ['RU', 'Russian', 'RU'], ['CN', 'Chinese', 'ZH'], ['JP', 'Japanese', 'JA']]
    .map(([r, n, c, on]) => `<div class="lr${on ? ' on' : ''}${he && c === 'HE' ? ' sel' : ''}" data-l="${c}"><small>${r}</small><span>${n}</span><em>${c}</em></div>`).join('')}</div>`;

  // the pre-roll: the chat home, for the first 0.64 s of the recording
  const NAV_CHAT = [['h', 'Main'], ['home', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['g4', 'Topics'], ['report', 'Reports'], ['grid', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['news', 'News · Directions', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1]];
  const chat = () => `<div class="pre">${glyphs(theme(LX.shell({ active: 'Chat', nav: NAV_CHAT })))}
    <div class="pre-hist"><span>${ic('down')}History</span>${ic('pen')}</div>
    <div class="pre-cut" aria-hidden="true">${[[46, 3], [52, 2], [57, 2], [66, 2, 1], [105, 2], [120, 2], [125, 2]].map(([x, w, d]) => `<i style="left:${x}px;width:${w}px${d ? ';top:-2px;height:3px' : ''}"></i>`).join('')}</div>
    <header class="pre-hd"><b>Dashboard</b><span class="pre-v"><small>Briefing</small><span class="on">V1</span><span>V2</span><span>V3</span><span>V4</span><span>V5</span></span></header>
    <div class="pre-c">${LX.mark('pre-mk')}<h2>Good afternoon, there.</h2><p>What would you like to explore today?</p>
      <div class="pre-box"><span class="pre-ph">Who are my top p</span><span class="pre-ic">${ic('at')}${ic('slashsq')}</span>${ic('mic', 'pre-mic')}</div>
      <span class="pre-pill"><i></i><span class="pre-sh">Identifying top topics...</span></span></div></div>`;

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
  // ---------- easing on the scene's clock ----------
  // computed colors come back as rgb() or rgba(); two colors mix with their alpha premultiplied, as CSS does
  const rgba = s => { const m = s.match(/[\d.]+/g).map(Number); return m.length === 3 ? [...m, 1] : m; };
  const mix = (a, b, k) => {
    if (!/^rgb/.test(a)) return String(parseFloat(a) + (parseFloat(b) - parseFloat(a)) * k);
    const A = rgba(a), B = rgba(b), al = A[3] + (B[3] - A[3]) * k;
    if (al <= 0) return 'rgba(0, 0, 0, 0)';
    const ch = i => ((A[i] * A[3] + (B[i] * B[3] - A[i] * A[3]) * k) / al).toFixed(1);
    return `rgba(${ch(0)}, ${ch(1)}, ${ch(2)}, ${al.toFixed(3)})`;
  };
  // read the listed properties, make the change, then ease each element from its old values to its new ones. A group is
  // [elements or selector, properties, points]; the points are the recorded progress at each 40 ms frame after the change,
  // [ms, 0..1, easing to the next point], and end on 1. Everything not listed takes its new value at once, as recorded.
  const ease = (c, change, groups) => {
    const els = g => (typeof g === 'string' ? c.qa(g) : [g].flat());
    const before = groups.map(([g, props]) => els(g).map(el => [el, props.map(p => getComputedStyle(el)[p])]));
    change();
    if (c.ff) return;
    groups.forEach(([, props, pts], n) => before[n].forEach(([el, from]) => {
      const cs = getComputedStyle(el), to = props.map(p => cs[p]);
      if (to.every((v, i) => v === from[i])) return;
      const T = pts[pts.length - 1][0];
      c.anim(el, pts.map(([ms, k, e]) => Object.assign({ offset: ms / T, easing: e || 'linear' }, ...props.map((p, i) => ({ [p]: mix(from[i], to[i], k) })))), { duration: T, easing: 'linear' });
    }));
  };
  // hover bar i (or none with -1): the tooltip and the bold label snap; a frame later the bars ease, as recorded (the
  // others dim over .13 s while the lit one comes up as fast; leaving restores them in .1 s)
  const hoverBar = (c, i, L) => {
    const { q, qa } = c;
    const bars = q('.bars'), on = i >= 0;
    // only a bar whose target changes starts a new ease, from wherever it is; the others carry on
    const go = qa('.bar').map((b, k) => [b, !on || k === i ? 1 : .45]).filter(([b, to]) => (b._to ?? 1) !== to).map(([b, to]) => [b, getComputedStyle(b).opacity, to]);
    bars.classList.toggle('hov', on);
    qa('.bar.on, .xl .on').forEach(e => e.classList.remove('on'));
    if (on) {
      q(`.bar[data-i="${i}"]`).classList.add('on'); q(`.xl [data-i="${i}"]`).classList.add('on');
      tipFor(q, i, L);
    }
    q('.tip').classList.toggle('on', on);
    const d = on ? 130 : 100;
    go.forEach(([b, from, to]) => {
      if (b._dim) b._dim.finish();
      b._to = to;
      b._dim = c.anim(b, [{ opacity: from }, { opacity: from, offset: 20 / (20 + d), easing: 'ease' }, { opacity: to }], { duration: 20 + d, easing: 'linear' });
    });
  };
  // the theme switches, with each part's recorded timing (the recording repeats its 6.88 frame at 6.92, so the dark points
  // skip that frame). The nav labels and the AI button's text are already about halfway on the first new frame; the
  // version group's edge, the key hint, the Northwind select, the headings and every surface change at once
  const NAV = '.lx-sb .sb-i:not(.on), .lx-sb .sb-i:not(.on) .i, .lx-sb .sb-ai, .lx-sb .sb-ai > .i';
  const BTN = '.mn .btn:not(.dbg), .mn .seg span.on, .mn .fbtn.add, .lx-sb .sb-lang';
  // the unselected options of the two version switches
  const OFF = '.lx-sb .sb-ver span:not(.on), .mn .seg span:not(.on)';
  const themeTo = (c, dark) => ease(c, () => c.app.classList.toggle('dk', dark), dark ? [
    [NAV, ['color'], [[0, .52], [40, .61], [80, .9], [120, .97], [160, 1]]],
    ['.lx-sb .sb-ai', ['borderColor'], [[0, .23], [40, .39], [80, .9], [120, .97], [160, 1]]],
    ['.lx-sb .sb-bell', ['borderColor'], [[0, .41], [40, .52], [80, .9], [120, .97], [160, 1]]],
    [OFF, ['color'], [[0, 0], [40, .1], [80, .75], [160, .92], [240, 1]]],
    ['.lx-sb .sb-ver span.on', ['backgroundColor', 'color'], [[0, 0], [40, .21], [80, .68], [120, .88], [160, .96], [200, 1]]],
    [BTN, ['backgroundColor', 'color', 'borderColor'], [[0, 0], [40, .2], [80, .72], [120, .9], [160, .97], [200, 1]]],
    [c.app, ['backgroundColor'], [[0, 0], [40, .07], [80, .35], [120, .53], [160, .68], [200, .82], [240, .93], [280, .98], [320, 1]]],
  ] : [
    [NAV, ['color'], [[0, .5], [40, .8], [80, .97], [120, 1]]],
    ['.lx-sb .sb-ai', ['borderColor'], [[0, .29], [40, .66], [80, 1]]],
    ['.lx-sb .sb-bell', ['borderColor'], [[0, .55], [40, .79], [80, 1]]],
    [OFF, ['color'], [[0, 0], [40, .45], [80, 1]]],
    ['.lx-sb .sb-ver span.on', ['backgroundColor', 'color'], [[0, .07], [40, .55], [80, .9], [120, 1]]],
    [BTN + ', .mn .tog span.on', ['backgroundColor', 'color', 'borderColor'], [[0, .04], [40, .54], [80, .94], [120, 1]]],
    [c.app, ['backgroundColor'], [[0, .03], [40, .24], [80, .61], [120, .78], [160, .89], [200, .96], [260, 1]]],
  ]);
  // the theme button's hover: its icon darkens (or, in dark, lightens) in .12 s
  const thHover = (c, on) => ease(c, () => c.q('.ds-th').classList.toggle('hv', on), [['.ds-th .i', ['color'], [[0, 0, 'ease'], [120, 1]]]]);

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
    // phones open on the chat home's heading and its self-typing input
    cam0: [849, 450],
    hold: 1600,
    rest: 5,
    times: [0, 3.33, 6.01, 9.42, 11.36, 13.32, 18.4, 21.82, 25.16],
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

      // the plot's box in app pixels
      const plot = () => { const [x0, y0] = c.pt(q('.plot'), { x: 0, y: 0 }); return [x0, y0]; };
      let hov = -1;
      const LAG = 10;
      // phones: a camera cut that lands with a cut in the app itself (the pre-roll's end, the switch to right to left)
      const camCut = ([x, y]) => { const P = c.P; if (P.root.classList.contains('lx-cam')) P.camTo(x - 240, y - 300, true); };
      const setHov = i => { if (i !== hov) { hov = i; hoverBar(c, i, L); } };
      // the hover area is the plot itself (to the bars' base), not the label rows under it
      const hit = ([x, y]) => { const [x0, y0] = plot(); const i = Math.round((x - x0 - 17) / 29.76); return y >= y0 - 8 && y <= y0 + 236 && i >= 0 && i < 30 ? i : -1; };
      // move the cursor in a straight line at an even speed, as the recording's pointer does; `late` is how far the clock
      // already ran past the move's start (a wait ends on the next frame), so the move picks up where it should be
      const glide = (to, d, late = 0) => {
        const P = c.P, [x, y] = to, x0 = P.cx, y0 = P.cy;
        P.cx = x; P.cy = y; P.place(); P.follow(x, y);
        if (c.ff) return Promise.resolve();
        late = Math.min(late, d);
        P.anim(P.cursor, [{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x}px,${y}px)` }], { duration: d, delay: -late, easing: 'linear' });
        return c.wait(d - late);
      };
      // the lit bar is the one the cursor was over `lag` ms before: the recorded page answers the pointer a little late
      const sweep = async (to, d, lag = LAG, late = 0) => {
        const P = c.P, from = [P.cx, P.cy], t0 = P.t - Math.min(late, d);
        const m = glide(to, d, late);
        if (c.ff) { setHov(hit(to)); return; }
        for (let e = 0; e < d; e = P.t - t0) {
          await c.wait(Math.min(8, d - e));
          const k = Math.max(0, Math.min(1, (P.t - t0 - lag) / d));
          setHov(hit([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k]));
        }
        await m;
        if (lag) c.wait(lag).then(() => setHov(hit(to)), () => {}); else setHov(hit(to));
      };
      // a move that starts at t seconds (the recording's own start and length for each move)
      const sweepAt = async (t, to, d) => { await at(t); await sweep(to, d, LAG, c.ff ? 0 : c.P.t - (t * 1000 + off)); };
      // the theme button's tooltip: a short fade in and out
      const ttip = (text, on = true, d = 50) => {
        const tip = q('.ttip');
        if (on) { if (text) tip.textContent = text; tip.classList.add('on'); c.anim(tip, [{ opacity: 0 }, { opacity: 1 }], { duration: d, easing: 'linear' }); }
        else { tip.classList.remove('on'); c.anim(tip, [{ opacity: 1 }, { opacity: 0 }], { duration: d, easing: 'linear' }); }
      };

      // 1. the chat home for a moment (its placeholder types itself, its loader turns and shimmers), then Agent evaluation, light
      await B(0, 0);
      const ph = q('.pre-ph');
      c.anim(q('.pre-pill i'), [{ transform: 'rotate(225deg)' }, { transform: 'rotate(585deg)' }], { duration: 640, easing: 'linear' });
      c.anim(q('.pre-sh'), [{ backgroundPosition: '-87px 0' }, { backgroundPosition: '-236px 0' }], { duration: 340, easing: 'linear', fill: 'forwards' });
      for (const [t, w] of [[0.04, 'pe'], [0.08, 'per'], [0.12, 'perf'], [0.24, 'perfo'], [0.28, 'perfor'], [0.32, 'perform'], [0.36, 'performi'], [0.4, 'performin'], [0.48, 'performing']]) {
        await at(t); ph.textContent = 'Who are my top ' + w;
        if (t === 0.32) ph.classList.add('cr');
      }
      await at(0.64);
      q('.pre').remove();
      camCut([240, 300]);
      // the new page draws its nav item plain for two frames, then blue on its pill in one step
      const nav = q('.sb-i.on');
      nav.classList.add('nobg');
      c.jump([136, 404]);
      await at(0.72); nav.classList.remove('nobg');

      // 2. sweep the score chart
      await B(1, 3.33);
      await sweepAt(3.337, [630, 360], 388);
      await sweepAt(4.226, [900, 404], 375);
      await sweepAt(5.099, [1080, 342], 380);

      // 3. the theme button: dark (the recorded pointer shows no click mark)
      await B(2, 6.01);
      // the tooltip fades in (50 ms) as the pointer settles on the button
      const s0 = sweepAt(6.016, [110, 848], 360); s0.catch(() => {});
      await s0;
      await at(6.378); ttip('Dark mode');
      await at(6.38); thHover(c, true);
      await at(6.8); themeTo(c, true); q('.ttip').textContent = 'Light mode';

      // 4. the chart again, in dark
      await B(3, 9.42);
      // the sweep starts while the tooltip is still up; a stop mid-sweep must not leave a stray rejection
      const s1 = sweepAt(9.423, [900, 404], 397); s1.catch(() => {});
      await at(9.44); ttip('', false);
      await at(9.46); thHover(c, false);
      await s1;
      await sweepAt(10.399, [630, 378], 373);

      // 5. the language menu: Hebrew
      await B(4, 11.36);
      await sweepAt(11.366, [191, 795], 395);
      const lm = q('.lm');
      await at(11.8);
      // the menu rises out of the select's edge while it fades in; its clip edge trails the rise (as recorded: 80 px low
      // with six rows showing and the text at 87% at 40 ms, 16 px low with nine rows at 80 ms, in place at 120 ms, fully
      // opaque at 160 ms); the select's chevron turns over in .1 s
      lm.classList.add('on');
      q('.sb-lang').classList.add('open');
      c.anim(q('.sb-lang .lc'), [{ transform: 'none' }, { transform: 'rotate(180deg)' }], { duration: 100, easing: 'ease' });
      c.anim(lm, [
        { transform: 'translateY(321px)', clipPath: 'inset(0 0 100% 0)', opacity: 0 },
        { transform: 'translateY(80px)', clipPath: 'inset(0 0 42% 0)', opacity: 0.87, offset: .25 },
        { transform: 'translateY(16px)', clipPath: 'inset(0 0 10% 0)', opacity: 0.94, offset: .5 },
        { transform: 'none', clipPath: 'inset(0 0 0 0)', opacity: 0.98, offset: .75 },
        { transform: 'none', clipPath: 'inset(0 0 0 0)', opacity: 1 }], { duration: 160, easing: 'linear' });
      await at(12.579);
      await glide([132, 466], 370);
      await at(13); c.hover(q('.lr[data-l="HE"]'));
      await at(13.07);
      L = 'he'; hov = -1;
      setLang(app, 'he');
      // phones cut with the app to its new right side: the mirrored sidebar from the active item to the language select
      camCut([1185, 580]);
      // for one frame the menu is still up, mirrored, over the new sidebar; the main column glides in from its old place
      const ds = q('.ds'), lmh = c.make(menu(true)), sl = q('.sb-lang');
      ds.append(lmh); sl.classList.add('open');
      c.anim(q('.mn'), [{ transform: 'translateX(259px)' }, { transform: 'none' }], { duration: 200, delay: 15, easing: 'ease', fill: 'backwards' });
      await at(13.1); lmh.remove(); sl.classList.remove('open');

      // 6. right to left, in dark: sweep the chart
      await B(5, 13.32);
      // phones: frame the mirrored header, the right-aligned title and the filters, not the parked cursor; the frame
      // ends at the main column's right edge, so the breadcrumbs and the first filter (where each row starts) stay whole
      c.cam([929, 300]);
      await sweepAt(16.272, [810, 404], 347);
      await sweepAt(17.314, [540, 378], 372);
      // a held frame (reduced motion, or a step) on a phone shows the mirrored header, the filters with their chip and the
      // whole title and subtitle, as the beat opens. The hovered bar and the title span more than the 480 px frame, so the
      // bar and its tooltip stay out rather than half in; 8 px lower, the next card's heading clears the bottom edge
      if (c.ff) c.cam([929, 308]);

      // 7. the theme button: back to light
      await B(6, 18.4);
      const s3 = sweepAt(18.423, [1326, 847], 351); s3.catch(() => {});
      await s3;
      thHover(c, true);
      await at(18.815); ttip('מצב בהיר');
      await at(19.225); themeTo(c, false); q('.ttip').textContent = 'מצב כהה';

      // 8. Hebrew tooltips in light
      await B(7, 21.82);
      const s2 = sweepAt(21.834, [810, 404], 374); s2.catch(() => {});
      await at(21.868); ttip('', false);
      await at(21.885); thHover(c, false);
      await at(21.938);
      await s2;
      await sweepAt(23.007, [630, 270], 375);
      await at(25.16);
    },
  });
})();
