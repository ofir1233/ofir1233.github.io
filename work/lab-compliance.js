// Compliance: the home tab's trend chart is swept with the cursor, the Agents tab swaps in a heatmap of criteria by
// agent, cells are hovered, one cell opens a popover that places the agent against the team, and Explore in Chat
// hands that cell to Ask AI, which answers with the calls that pulled the score down.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    cpHome: 'M3.5 10.5L12 3.5l8.5 7V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19zM9.5 20.5v-6h5v6',
    cpTopics: 'M5.5 4h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    cpApps: 'M5.5 4h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
    cpInfo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5v-5M12 8h.01',
    cpDdown: 'M7 6.5l5 5 5-5M7 12.5l5 5 5-5',
    cpHist: 'M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4h4M12 8v4.3l2.8 1.8',
    cpEdit: 'M11 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5M17.3 3.7a2 2 0 0 1 2.9 2.9L12.5 14.3l-3.8 1 1-3.8z',
    cpExp: 'M14.5 4.5h5v5M19.5 4.5l-6 6M9.5 19.5h-5v-5M4.5 19.5l6-6',
    cpSlash: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM14.2 7.5l-4.4 9',
    cpMic: 'M12 3.5a2.6 2.6 0 0 1 2.6 2.6v5.6a2.6 2.6 0 0 1-5.2 0V6.1A2.6 2.6 0 0 1 12 3.5zM6.5 11.3a5.5 5.5 0 0 0 11 0M12 16.8v3.7M9 20.5h6',
    cpUp: 'M7.5 10.5v9.5h-3v-9.5zM7.5 10.5l3.6-6.6a1.9 1.9 0 0 1 3.4 1.5l-.8 3.6h5.2a2 2 0 0 1 2 2.4l-1.4 6.6a2 2 0 0 1-2 1.5H7.5',
    cpDown: 'M7.5 13.5V4h-3v9.5zM7.5 13.5l3.6 6.6a1.9 1.9 0 0 0 3.4-1.5l-.8-3.6h5.2a2 2 0 0 0 2-2.4l-1.4-6.6a2 2 0 0 0-2-1.5H7.5',
    cpRe: 'M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4',
    cpCopy: 'M10 9h8.5A1.5 1.5 0 0 1 20 10.5V19a1.5 1.5 0 0 1-1.5 1.5H10A1.5 1.5 0 0 1 8.5 19v-8.5A1.5 1.5 0 0 1 10 9zM15.5 9V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3',
    cpKebab: 'M12 5.5h.01M12 12h.01M12 18.5h.01',
    cpArrow: 'M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5',
  });
  // the Lab's AI glyph: a large four-point star with small ones beside it
  const SPARK = '<svg class="cp-sp" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 7.5l1.9 5.1 5.1 1.9-5.1 1.9L13 21.5l-1.9-5.1L6 14.5l5.1-1.9zM6 2.5l.8 2.2 2.2.8-2.2.8L6 8.5l-.8-2.2-2.2-.8 2.2-.8zM18.5 3l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"/></svg>';
  // the Thinking globe: a dotted sphere whose dot field drifts sideways, clipped to a disc
  const GLOBE = '<i class="cp-globe"><i></i></i>';

  // ---------- the sidebar: Main and Intelligence, not scrolled ----------
  const NAV = [['h', 'Main'], ['cpHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['cpTopics', 'Topics'], ['report', 'Reports'], ['cpApps', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shield', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge'],
    ['news', 'News · Directions', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1]];

  // ---------- demo data ----------
  // the trend chart: one value per day, 11 Sep to 11 Oct (null = no calls that day)
  const SER = [
    ['Fee disclosure', '#73999e', [88.86, null, 91.68, 89.70, 87.7, 90.9, 90.9, 89.1, null, 89.7, 87.4, 88.9, 88.6, 89.1, 89.4, null, 88.6, 87.18, 86.95, 87.77, 86.3, 87.7, null, 87.1, 86.1, 88.9, 88.6, 87.1, 86.9, null, 88.8]],
    ['Consent to continue', '#1677ff', [81.08, null, 83.17, 82.71, 79.4, 79.7, 79.2, 82.6, null, 79.4, 82.9, 80.3, 77.7, 80.0, 80.8, null, 83.2, 82.99, 81.79, 86.12, 86.0, 83.7, null, 84.0, 84.3, 85.7, 85.4, 86.0, 84.0, null, 86.6]],
    ['Identity verification', '#da98e2', [89.07, null, 92.95, 88.77, 90.3, 89.7, 89.1, 92.6, null, 90.0, 91.4, 93.7, 92.0, 93.1, 94.3, null, 90.9, 92.75, 93.62, 92.13, 93.7, 90.9, null, 92.0, 91.4, 93.4, 92.0, 89.7, 90.3, null, 90.9]],
    ['Vulnerable cust. protocol', '#a7949a', [83.02, null, 80.03, 83.75, 78.3, 83.7, 82.9, 81.7, null, 82.6, 81.7, 78.6, 80.9, 82.6, 82.3, null, 80.9, 80.17, 79.21, 82.00, 79.4, 78.3, null, 80.0, 78.9, 77.1, 80.6, 78.3, 80.0, null, 79.4]],
    ['Risk warning disclosure', '#4a4a4a', [76.41, null, 75.48, 72.44, 76.3, 73.1, 76.6, 73.1, null, 71.7, 71.7, 72.9, 70.0, 71.1, 69.4, null, 70.3, 67.36, 70.23, 69.79, 70.3, 68.3, null, 66.6, 67.7, 65.7, 66.3, 65.7, 68.6, null, 68.9]],
  ];
  const X = k => 333 + 34.8 * k, Y = v => 535 - 1.75 * v;
  const day = k => (k < 20 ? `${11 + k} Sep` : `${k - 19} Oct`);
  const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  // critical alerts by agent: initials, monogram color, name, count
  const ALERTS = [['NF', '#8fa388', 'Nora Fields', 17], ['CN', '#458af4', 'Clara Nash', 15], ['DL', '#fe6e5a', 'Diane Lowe', 14], ['DS', '#fe6e5a', 'Derek S', 13],
    ['AR', '#62a69b', 'Aaron Reyes', 12], ['SK', '#7dabb4', 'Selma K', 12], ['RC', '#8fa388', 'Rosa Costa', 12]];
  // the heatmap: id, name (two lines where it wraps), five criteria scores
  const CRIT = ['Fee disclosure', 'Consent to continue', 'Identity verification', 'Vulnerable cust. protocol', 'Risk warning disclosure'];
  const AG = [
    [101, 'Evan Doyle', [85, 81, 90, 88, 69]], [102, 'Lucy Yates', [90, 72, 89, 70, 68]], [103, 'Aaron<br>Reyes', [67, 67, 76, 72, 68]],
    [104, 'Stefan M', [100, 89, 100, 61, 85]], [105, 'Iris Gale', [87, 82, 75, 76, 85]], [106, 'Ada Pierce', [94, 88, 98, 87, 70]],
    [107, 'Tara Banks', [78, 65, 92, 87, 66]], [108, 'Martinez N', [82, 91, 93, 89, 74]], [109, 'Shaw R', [79, 76, 82, 68, 62]],
    [110, 'Alma Young', [92, 79, 85, 100, 69]], [111, 'Derek S', [77, 65, 86, 54, 55]], [112, 'Selma K', [80, 66, 79, 60, 65]],
    [113, 'Megan Kerr', [81, 81, 87, 80, 60]], [114, 'Ethan Bell-<br>Davies', [84, 85, 77, 71, 77]], [115, 'Nora<br>Fields', [78, 67, 59, 73, 36]],
  ];
  const bin = v => (v >= 90 ? 'b9' : v >= 80 ? 'b8' : v >= 70 ? 'b7' : v >= 60 ? 'b6' : 'b5');
  const CX = i => 480 + 66.6 * i, RY = r => 301 + 34.25 * r;

  // ---------- markup ----------
  const kpi = (x, label, v) => `<div class="kp" style="left:${x}px"><span class="kp-l">${label}${ic('cpInfo')}</span><span class="kp-v">${v}<small>%</small></span></div>`;
  const chart = () => {
    const pts = s => s[2].map((v, k) => v == null ? null : [X(k), Y(v)]).filter(Boolean);
    const lines = SER.map(s => `<polyline points="${pts(s).map(p => p.map(n => n.toFixed(1)).join(',')).join(' ')}" stroke="${s[1]}"/>`).join('');
    const dots = SER.map((s, j) => s[2].map((v, k) => v == null ? '' : `<circle cx="${X(k).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="${s[1]}" data-k="${k}"/>`).join('')).join('');
    return `<svg class="cp-plot" viewBox="300 340 1110 230" aria-hidden="true">
      ${[0, 20, 40, 60, 80, 100].map(v => `<line class="gl" x1="330" x2="1378" y1="${Y(v)}" y2="${Y(v)}"/><text class="yt" x="327" y="${Y(v) + 3.6}">${v}</text>`).join('')}
      ${TICKS.map(k => `<text class="xt" x="${X(k).toFixed(1)}" y="556.6">${day(k)}</text>`).join('')}
      <line class="tg" x1="330" x2="1378" y1="395" y2="395"/>
      <rect class="tgb" x="1294" y="378" width="79" height="14" rx="2"/><text class="tgt" x="1333.5" y="388.6">target (80%)</text>
      <line class="hl" x1="0" x2="0" y1="360" y2="535"/>
      <g class="ln">${lines}</g><g class="dt">${dots}</g>
    </svg>`;
  };
  const home = () => `<div class="cp-home">
    <section class="card kpi">${kpi(23, 'Sales without alerts', '72.6')}${kpi(406, 'Valid sales', '93.8')}${kpi(790, 'Agents above the success metric', '88.7')}<i class="kd" style="left:383px"></i><i class="kd" style="left:767px"></i></section>
    <section class="card trend"><h4>Compliance trend by section</h4><span class="tr-m">last 6 weeks · target 80%</span>
      <div class="lg">${SER.map((s, j) => `<span style="left:${[18, 121, 258, 392, 553][j]}px"><i style="background:${s[1]}"></i>${s[0]}</span>`).join('')}</div></section>
    ${chart()}
    <div class="cp-tip"></div>
    <section class="card al"><h4>Critical alerts by agent</h4>
      ${ALERTS.map(([ini, col, n, v], k) => `<div class="ar" style="top:${53 + 36 * k}px"><i class="am" style="background:${col}">${ini}</i><span class="an">${n}</span><i class="at"><b style="width:${(v / 17 * 963).toFixed(0)}px"></b></i><span class="av">${v}</span></div>`).join('')}</section>
  </div>`;
  const heat = () => `<div class="cp-ag">
    <section class="card hm">
      <span class="po"><i class="sw"></i>Problems only</span>
      <span class="hl5">${[['b9', '≥90'], ['b8', '80'], ['b7', '70'], ['b6', '60'], ['b5', '&lt;60']].map(([b, l], j) => `<span style="left:${[917, 965, 1010, 1053, 1098][j]}px"><i class="${b}"></i>${l}</span>`).join('')}</span>
      <i class="hm-sep"></i><i class="hm-ft"></i><i class="hm-col"></i>${[140, 174, 208.5, 242.5, 277].map(y => `<i class="hm-row" style="top:${y}px"></i>`).join('')}
      <span class="ov cr">Criterion</span><span class="ov fc">Failing criteria</span>
    </section>
    <div class="hm-grid">
      ${AG.map(([id, n, v], i) => {
        const avg = Math.round(v.reduce((a, b) => a + b, 0) / 5), fail = v.filter(s => s < 70).length, two = n.includes('<br>');
        return `<div class="hc${two ? ' two' : ''}" style="left:${CX(i).toFixed(1)}px"><b>${id}</b><span class="hn">${n}</span><span class="ha${avg < 70 ? ' low' : ''}">${avg}</span></div>
          ${v.map((s, r) => `<i class="cl ${bin(s)}" data-c="${i}" data-r="${r}" style="left:${CX(i).toFixed(1)}px;top:${RY(r).toFixed(2)}px">${i < 14 ? s : ''}</i>`).join('')}
          <span class="fl${fail ? ' on' : ''}" style="left:${(CX(i) + 28.5).toFixed(1)}px">${fail}</span>`;
      }).join('')}
    </div>
    ${CRIT.map((c, r) => `<span class="crit" data-r="${r}" style="top:${RY(r).toFixed(2)}px"><i class="grip"></i><i class="cd"></i>${c}</span>`).join('')}
    <div class="pop">
      <h5>Martinez N</h5>${ic('x', 'px')}
      <p class="ps">#108 · Fee disclosure · selected date<br>range</p>
      <span class="pt b8">82</span><b class="pd">−1 vs team average</b><span class="pr">Top 47% · 29th of 62 agents</span>
      <span class="ov pa">Across all 62 agents</span>
      <div class="hist">${[6, 3, 8, 31, 39, 23, 16, 18, 8, 11].map((h, j) => `<i${j === 5 ? ' class="me"' : ''} style="height:${h}px"></i>`).join('')}<i class="avg"></i></div>
      <span class="hx l">Low 62</span><span class="hx m">Team avg 83</span><span class="hx r">High 100</span>
      <p class="pn">Opens Chat, which looks up this agent’s calls.<br>Nothing extra loads until you click.</p>
      <span class="pb">${SPARK}Explore in Chat</span><span class="pl">Open agent evaluation</span>
    </div>
  </div>`;
  const ASK = 'Why is Martinez N’s Fee disclosure 82?';
  const modal = () => `<div class="cp-dim"></div><div class="cp-mo">
    <div class="mo-h"><span class="mo-tile">${SPARK}</span><h4>Ask AI</h4><span class="mo-sub">New conversation</span>
      <span class="mo-ic">${ic('cpHist')}${ic('cpEdit')}${ic('cpExp', 'ex')}${ic('x')}</span></div>
    <div class="mo-chips"><span>Compliance${ic('x')}</span><span>Project · Northwind</span></div>
    <div class="mo-q">${ASK}</div>
    <div class="mo-think">${GLOBE}Thinking...</div>
    <div class="mo-a">
      <p class="a0">The score of <b>82</b> is the average of <b>9 calls</b> between 11 Sep 2026 and 11 Oct 2026.</p>
      <h6 class="h1">Calls that pulled it down most</h6>
      <ul>
        <li><b>Call 88279</b> · Score 64 — Missed: Stated the annual management fee. “It’s the standard fee, same as <br>everyone pays.”</li>
        <li><b>Call 75279</b> · Score 68 — Missed: Confirmed the customer understood the fees. “The fees are all in the <br>documents we’ll send you.”</li>
      </ul>
      <h6 class="h2">Pattern</h6>
      <p class="a1">Stated the annual management fee was missed in 2 of 9 calls. 3 other agents miss it too, so it may be a <br>script or process issue, not only coaching.</p>
      <div class="mo-act">${ic('cpUp')}${ic('cpDown')}${ic('cpRe')}${ic('cpCopy')}${ic('cpKebab')}</div>
      <h5>Related</h5>
      <ol>${['Open the lowest-scoring call', 'Compare with team average', 'Draft coaching notes'].map(r => `<li>${r}${ic('cpArrow')}</li>`).join('')}</ol>
    </div>
    <div class="mo-cm"><span class="ph">Ask anything about this page...</span><span class="mo-ics">${ic('at')}${ic('cpSlash')}</span>${ic('cpMic', 'mic')}<span class="busy"><i></i><i></i><i></i></span></div>
  </div>`;

  const html = () => `${LX.shell({ active: 'Compliance', nav: NAV, scroll: 12 })}
    <header class="card hd"><span class="crumb">Compliance</span>${ic('right', 'chev')}
      <span class="tabs"><span class="tb on" data-t="home">Home</span><span class="tb" data-t="ag">Agents</span><span class="tb">Reports</span><span class="tb">Agents (Mock)</span></span></header>
    <section class="card pre"><b>Preset</b><span class="sel">Select a preset${ic('down')}</span><span class="clr">Clear preset</span>${ic('cpDdown', 'dd')}</section>
    ${home()}${heat()}${modal()}`;

  // the five rows of a chart tooltip for day k
  const tipRows = k => `<div class="tp-h">${day(k)}</div>${SER.map(s => `<div class="tp-r"><i style="background:${s[1]}"></i>${s[0]}:<b>${s[2][k] == null ? '–' : s[2][k].toFixed(2) + '%'}</b></div>`).join('')}`;
  LX.scene('compliance', {
    cls: 'sc-cp',
    html,
    cursor: [137, 579],
    cam0: [520, 330], // phones open on the KPIs and the trend
    hold: 400,
    times: [0, 2.1, 4.6, 6.85, 9.85, 13.2, 15.3, 23.0],
    beats: [
      'Compliance opens on its KPIs and a trend per criterion.',
      'Hovering the trend shows every criterion\'s score that day.',
      'The Agents tab shows a heatmap of criteria by agent.',
      'Hovering a cell tints it and marks its row.',
      'A click opens a popover comparing agent and team.',
      'Explore in Chat hands that cell to Ask AI.',
      'The answer names the calls that pulled the score down.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // c.beat() takes one frame, so a beat is entered one frame early; the offset is taken again only after a jump
      const B = async (i, t0) => { await at(t0 - 0.016); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - t0 * 1000; };
      // the cursor along a recorded path: [t, x, y] points on the recording's clock, straight between them
      const path = pts => {
        const P = c.P, [t0] = pts[0], [t1, x, y] = pts[pts.length - 1];
        const kf = [{ transform: `translate(${P.cx}px,${P.cy}px)`, offset: 0 }, ...pts.slice(1).map(([t, px, py]) => ({ transform: `translate(${px}px,${py}px)`, offset: (t - t0) / (t1 - t0) }))];
        P.cx = x; P.cy = y; P.place(); P.follow(x, y);
        if (c.ff) return Promise.resolve();
        P.anim(P.cursor, kf, { duration: (t1 - t0) * 1000, easing: 'linear' });
        return at(t1);
      };

      // ---- the chart tooltip: content snaps per day, the box glides between places ----
      const tip = q('.cp-tip'), hl = q('.hl');
      let tk = -1;
      const tipDay = k => {
        if (k === tk) return;
        qa('.dt circle.on').forEach(e => e.classList.remove('on'));
        tk = k;
        if (k < 0) return;
        qa(`.dt circle[data-k="${k}"]`).forEach(e => e.classList.add('on'));
        tip.innerHTML = tipRows(k);
        hl.setAttribute('x1', X(k)); hl.setAttribute('x2', X(k));
      };
      const place = (x, y) => { tip.style.left = x + 'px'; tip.style.top = y + 'px'; };
      // glide the box through measured places: [t, x, y]
      const glide = pts => {
        const [t0] = pts[0], [t1, x, y] = pts[pts.length - 1];
        place(x, y);
        if (c.ff || t1 === t0) return;
        c.anim(tip, pts.map(([t, px, py]) => ({ transform: `translate(${px - x}px,${py - y}px)`, offset: (t - t0) / (t1 - t0) })), { duration: (t1 - t0) * 1000, easing: 'linear' });
      };
      const tipShow = on => { app.classList.toggle('tipon', on); if (!on) tipDay(-1); };
      const tipFade = (d = 130) => { const a = c.anim(tip, [{ opacity: 1 }, { opacity: .25, offset: .4 }, { opacity: 0 }], { duration: d, easing: 'linear', fill: 'forwards' }); return a; };

      // ---- the heatmap hover ----
      const cell = (i, r) => q(`.cl[data-c="${i}"][data-r="${r}"]`);
      let hv = null;
      const hover = el => { if (hv) hv.classList.remove('hv'); hv = el; if (el) el.classList.add('hv'); };
      const grip = r => { qa('.crit.gr').forEach(e => e.classList.remove('gr')); if (r >= 0) q(`.crit[data-r="${r}"]`).classList.add('gr'); };

      // 1. the Compliance home, just opened
      await B(0, 0);

      // 2. a swoop over the trend chart, then a slower pass to the right
      await B(1, 2.1);
      c.cam([520, 420]); // phones: the chart's left half, where the first tooltips open
      const p1 = path([[2.13, 153, 568], [2.17, 223, 523], [2.20, 277, 490], [2.27, 312, 469], [2.33, 330, 458], [2.40, 347, 446], [2.43, 365, 435], [2.47, 418, 402], [2.53, 418, 402], [2.57, 470, 369], [2.60, 558, 313], [2.63, 611, 280], [2.73, 629, 269]]);
      await at(2.40); tipDay(0); tipShow(true); glide([[2.40, 348, 352]]);
      await at(2.43); tipDay(1); glide([[2.43, 350, 365]]);
      await at(2.47); tipDay(2); glide([[2.47, 380, 377]]);
      await at(2.57); tipDay(3); glide([[2.57, 393, 378]]);
      await at(2.60); const f1 = tipFade(); await f1.finished.catch(() => {}); tipShow(false); f1.cancel();
      await p1;
      await at(3.27);
      const p2 = path([[3.27, 655, 278], [3.33, 693, 293], [3.37, 732, 307], [3.40, 783, 328], [3.47, 847, 351], [3.53, 847, 351], [3.57, 900, 370], [3.60, 937, 386], [3.63, 976, 400], [3.67, 990, 404]]);
      c.cam([772, 420]); // phones: straight to the chart's right half (the dot's own follow would overshoot, then come back)
      await at(3.60); tipDay(17); tipShow(true); place(520, 389);
      c.anim(tip, [{ opacity: .35 }, { opacity: 1 }], { duration: 40, easing: 'linear' });
      await at(3.63); tipDay(18);
      glide([[3.63, 544, 389], [3.67, 576, 389], [3.73, 696, 389], [3.77, 761, 389], [3.80, 767, 389]]);
      await at(3.67); tipDay(19);
      await p2;

      // the flick up to the Agents tab: the tooltip steps back a day and fades
      await at(4.27);
      const p3 = path([[4.27, 970, 391], [4.33, 897, 340], [4.37, 841, 301], [4.43, 749, 236], [4.47, 694, 197], [4.53, 640, 159], [4.57, 584, 120], [4.60, 529, 81], [4.63, 473, 43]]);
      tipDay(18); glide([[4.27, 768, 389], [4.33, 752, 389]]);
      await at(4.37); const f2 = tipFade(60); await f2.finished.catch(() => {}); tipShow(false); f2.cancel();
      await p3;

      // 3. the Agents tab: the content swaps at once, the tab highlight a frame later
      await B(2, 4.6);
      await at(4.70); await c.click(q('.tb[data-t="ag"]'), { after: 0 });
      await at(4.73); app.classList.add('ag');
      c.cam([504, 330]); // phones: the criteria and the first four columns, from the card's left edge (no label cut)
      await at(4.80); q('.tb[data-t="home"]').classList.remove('on'); q('.tb[data-t="ag"]').classList.add('on');

      // 4. hover cells across the grid
      await B(3, 6.85);
      await path([[6.87, 476, 62], [6.93, 479, 100], [7.00, 484, 149], [7.07, 491, 208], [7.13, 494, 236], [7.17, 498, 266], [7.20, 502, 305], [7.27, 503, 314]]);
      hover(cell(0, 0));
      await at(7.30); grip(0);
      await at(7.77);
      const p4 = path([[7.77, 522, 319], [7.83, 548, 327], [7.93, 571, 334], [8.00, 598, 342], [8.07, 629, 349]]);
      await at(7.83); hover(null);
      await at(7.93); hover(cell(1, 0));
      await at(7.97); grip(1); hover(cell(1, 1));
      await at(8.03); hover(cell(2, 1));
      await p4;
      await at(8.63);
      const p5 = path([[8.63, 640, 349], [8.75, 660, 348], [8.87, 730, 350], [9.00, 766, 349]]);
      await at(8.72); hover(cell(3, 1));
      await at(8.90); hover(cell(4, 1));
      await p5;
      await at(9.53);
      const p6 = path([[9.53, 786, 346], [9.57, 801, 343], [9.60, 823, 340], [9.63, 846, 335], [9.67, 869, 332], [9.77, 914, 323], [9.80, 936, 320], [9.87, 974, 313]]);
      await at(9.60); hover(cell(5, 1));
      await at(9.70); hover(cell(6, 0));
      await at(9.77); grip(0);
      await at(9.83); hover(cell(7, 0));
      await p6;

      // 5. a click on Martinez N's Fee disclosure: the cell is selected and the popover opens
      await B(4, 9.85);
      c.cam([974, 500]); // phones: the popover
      await at(9.90); await c.click(cell(7, 0), { after: 0 });
      await at(9.93);
      hover(null); cell(7, 0).classList.add('sel');
      app.classList.add('pop-on');
      c.anim(q('.pop'), [{ opacity: .15 }, { opacity: .6, offset: .35 }, { opacity: .85, offset: .65 }, { opacity: 1 }], { duration: 140, easing: 'ease-out' });

      // 6. Explore in Chat: the popover goes, the Ask AI modal opens with the question already sent
      await B(5, 13.2);
      const btn = q('.pb');
      await at(13.27);
      const p7 = path([[13.27, 974, 335], [13.33, 974, 369], [13.37, 974, 402], [13.47, 974, 502], [13.57, 974, 569], [13.63, 974, 624]]);
      await at(13.37); grip(-1);
      await p7;
      btn.classList.add('dn');
      await c.click(btn, { press: .97, after: 0 });
      await at(13.67);
      btn.classList.remove('dn'); app.classList.remove('pop-on');
      await at(13.77);
      app.classList.add('asked');
      c.cam([974, 431]); // phones: the Ask AI sheet's top: the header, the chips, the question handed over from the cell, and the composer
      c.anim(q('.cp-dim'), [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' });
      c.anim(q('.cp-mo'), [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' });
      const glb = q('.cp-globe i'), dots = qa('.busy i');
      c.anim(glb, [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }], { duration: 1600, easing: 'linear' });
      dots.forEach((d, i) => c.anim(d, [{ opacity: .45, transform: 'translateY(0)' }, { opacity: 1, transform: 'translateY(-2px)', offset: .3 }, { opacity: .45, transform: 'translateY(0)', offset: .6 }, { opacity: .45, transform: 'translateY(0)' }], { duration: 600, delay: i * 120, iterations: 3, easing: 'ease-in-out' }));
      // the composer opens unfocused (gray edge, caret blinking); the focus ring comes on about half a second later
      await at(14.30); q('.mo-cm').classList.add('fo');

      // 7. the answer: the calls that pulled the score down, a pattern, and related follow-ups
      await B(6, 15.3);
      await at(15.33);
      app.classList.add('done');
      c.cam([974, 600]); // phones: down the sheet to the whole answer, its sections, the related list and the composer
      c.anim(q('.mo-cm .mic'), [{ opacity: 0 }, { opacity: 1 }], { duration: 100, easing: 'linear' });
      await at(15.37);
      c.anim(q('.mo-a'), [{ opacity: .25 }, { opacity: .85, offset: .5 }, { opacity: 1 }], { duration: 60, easing: 'linear' });
      c.anim(q('.mo-q'), [{ transform: 'translateY(3px)' }, { transform: 'none' }], { duration: 60, easing: 'ease-out' });
      qa('.mo-a ol li').forEach((li, i) => c.anim(li, [{ opacity: 0, transform: 'translate(3px,1px)' }, { opacity: 1, transform: 'none' }], { duration: 60, delay: i * 30, easing: 'ease-out', fill: 'backwards' }));
      await at(15.53);
      q('.mo-sub').textContent = ASK;
      await at(16.23);
      const drift = path([[16.23, 968, 621], [16.33, 926, 600], [16.40, 892, 582], [16.47, 862, 566], [16.53, 845, 558], [16.60, 821, 545], [16.63, 809, 539]]);
      c.cam([974, 600]); // the camera stays on the answer while the dot drifts
      await drift;
      await at(22.6);
    },
  });
})();
