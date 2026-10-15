// Demos engine showcase: the engine plays the Chat screen on demo data. A camera frames the app, a title card makes one
// claim, the engine types a question and sends it, the answer streams with a KPI card and a bar chart, the camera pushes
// in and back, a follow-up answers with a table, the table is lifted out of a dimmed screen, and an end card counts up.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    shHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    shTopics: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    shMini: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
    shRadar: 'M19.4 7.5A9 9 0 1 0 21 12M16 9.5A4.5 4.5 0 1 0 16.5 12M12 12l7.5-7.5',
    shPen: 'M11.5 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5.5M17.8 3.7a1.8 1.8 0 0 1 2.5 2.5l-8 8-3.3.8.8-3.3z',
    shSlash: 'M5.5 2.5h13a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3v-13a3 3 0 0 1 3-3zM14.2 7.5l-4.4 9',
    shMic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21M9 21h6',
    shUp: 'M12 19V5.5M6.5 11L12 5.5l5.5 5.5',
    shUpv: 'M7 10v11M14.5 5.9L13.5 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h2.8a2 2 0 0 0 1.8-1.1L11.5 3a2.9 2.9 0 0 1 3 2.9z',
    shDnv: 'M17 14V3M9.5 18.1l1-4.1H4.7a2 2 0 0 1-1.9-2.6l2.3-7A2 2 0 0 1 7 3h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2.8a2 2 0 0 0-1.8 1.1L12.5 21a2.9 2.9 0 0 1-3-2.9z',
    shRegen: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 4v4.5H8',
    shCopy: 'M10 9h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 21h-9a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 10 9zM15.5 9V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5',
    shVdots: 'M12 5h.01M12 12h.01M12 19h.01',
    // drawn filled (see the stylesheet): a large four-point sparkle, a small one and a dot
    shSpark: 'M12.5 6.5Q13.9 12.6 20 14 13.9 15.4 12.5 21.5 11.1 15.4 5 14 11.1 12.6 12.5 6.5zM6 2.6Q6.6 5.4 9.2 6 6.6 6.6 6 9.4 5.4 6.6 2.8 6 5.4 5.4 6 2.6zM16.3 5.2a1.3 1.3 0 1 0 2.6 0 1.3 1.3 0 1 0-2.6 0z',
    shOut: 'M10 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H10M14.5 8l4 4-4 4M18.5 12H9',
  });
  // the footer's moon and incognito icons are solid in the recording
  const solid = d => `<svg class="i f" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const INCOG = `<svg class="i sh-incog" viewBox="0 0 24 24" aria-hidden="true"><path class="h" d="M7.6 4.5h8.8l1.9 6.3H5.7zM3 11.6h18v1.9H3z"/><path d="M5.2 17.6a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 0 0-5.2 0zM13.6 17.6a2.6 2.6 0 1 0 5.2 0 2.6 2.6 0 0 0-5.2 0zM10.4 17.2c1-.7 2.2-.7 3.2 0"/></svg>`;
  // the Hear mark: a sound wave drawn as an H, traced from the recording
  const MARK = 'M43.7 0C44.9-.2 46.6-.2 47.7.3 48.8.8 49.8 1.7 50.3 2.7 50.8 3.7 51 4.4 51 6.5 51 8.6 50.3 13.1 50.3 15.2 50.3 17.3 49.9 18 50.8 19.2 51.7 20.4 54.7 21.4 55.7 22.2 56.7 23 56.8 23.2 56.8 23.8 56.8 24.4 57.2 24.6 56 25.5 54.8 26.4 52.5 25.3 49.7 29 46.9 32.7 41.4 44.3 39.2 47.8 37 51.3 37.6 49.5 36.7 50 35.8 50.5 34.7 50.7 33.7 50.7 32.7 50.8 31.4 50.7 30.5 50.3 29.6 49.9 28.9 49.8 28.3 48.2 27.8 46.6 27.3 43.4 27.2 40.7 27.1 38 27.7 34.2 27.5 32.2 27.3 30.2 26.9 29.3 26.2 28.5 25.5 27.7 24.4 27.2 23.3 27.3 22.2 27.4 20.6 28.2 19.7 28.8 18.8 29.4 18.8 29.2 17.7 31 16.6 32.8 14.1 37.9 12.8 39.5 11.5 41.1 11 40.7 10 40.7 9 40.7 7.5 40.2 6.7 39.5 5.9 38.8 5.5 38.2 5.3 36.3 5.1 34.4 5.8 29.9 5.5 28.2 5.2 26.5 4 26.5 3.3 26 2.6 25.5 1.8 25.6 1.2 25.2.7 24.8-.1 24.1 0 23.7.1 23.3.5 23 1.5 22.7 2.5 22.4 5.1 22.3 6.2 21.8 7.3 21.3 7.3 21 8 19.7 8.7 18.4 9.5 15.4 10.2 14 10.9 12.6 11.4 11.8 12 11.2 12.6 10.6 12.7 10.5 13.5 10.2 14.3 9.9 16.2 9.5 17 9.5 17.8 9.5 17.9 9.9 18.3 10.3 18.7 10.8 18.7 10.6 19.3 12.2 19.9 13.8 20.9 18.4 21.7 20 22.5 21.6 23.5 21.3 24.3 21.5 25.1 21.7 25.5 21.9 26.7 21 27.9 20.1 30.2 18.1 31.5 16 32.8 13.9 33.8 10.2 34.7 8.3 35.6 6.4 36 5.9 37 4.7 38 3.5 39.4 2.1 40.5 1.3 41.6.5 42.5.2 43.7 0z';
  const mark = (inner = '') => `<svg class="sh-mk" viewBox="0 0 57 51" aria-hidden="true">${inner}<path d="${MARK}"/></svg>`;
  const ring = () => `<svg viewBox="0 0 57 57" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => {
    const a = i / 28 * Math.PI * 2, o = [.9, .45, .7, .3, .8, .5, .35][i % 7];
    return `<circle cx="${(28.5 + 27.2 * Math.cos(a)).toFixed(2)}" cy="${(28.5 + 27.2 * Math.sin(a)).toFixed(2)}" r="1" opacity="${o}"/>`;
  }).join('')}</svg>`;

  // the sidebar: the stock Lab shell with this workspace's brand block, nav, history and user row
  const NAV = [['h', 'Main'], ['shHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['shTopics', 'Topics'], ['report', 'Reports'], ['shMini', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shield', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge'], ['shSpark', 'Magic API'],
    ['h', 'Operations'], ['shRadar', 'AI Tasks']];
  const shell = () => LX.shell({ active: 'Chat', nav: NAV })
    .replace('<span class="sb-tile">H</span>', '<span class="sb-tile">N</span>')
    .replace('<b>Hear</b><small>', '<b>Northwind</b><small>')
    .replace(/<svg class="hmark "[\s\S]*?<\/svg>Hear/, `${mark()}Hear`)
    .replace(/<i class="av me"[^>]*>U<\/i><b>You<\/b>/, '<i class="av me" style="--c:#e0473f">OF</i><b>Ofir</b>')
    .replace(/<div class="sb-tools">[\s\S]*?<\/div>/, `<div class="sb-tools">${ic('gear')}<i></i>${solid('M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z')}<i></i>${INCOG}<i></i>${ic('shOut')}</div>`)
    .replace('<div class="sb-user">', `<div class="sh-hist"><div class="sh-hh">${ic('down')}History${ic('shPen')}</div><div class="sh-hi">Welcome to Hear</div></div><div class="sb-user">`);

  const CHIPS = [['What drove escalations this week?', 'Which agents need coaching?'], ['Where are we losing customers?', 'Any compliance gaps?']];
  const acts = (cls, top) => `<div class="sh-acts ${cls} hid" style="top:${top}px">${['shUpv', 'shDnv', 'shRegen', 'shCopy', 'shVdots'].map(n => ic(n)).join('')}</div>`;
  const chunks = (cls, top, parts) => `<p class="sh-ans ${cls}" style="top:${top}px">${parts.map(p => `<span class="hid">${p}</span>`).join('')}</p>`;
  const BARS = [['Delivery delays', 16], ['Billing', 4], ['Product setup', 3]];
  const ROWS = [['Agent 4', 5, '4 of 5', 'g'], ['Agent 7', 3, '0 of 3', 'r'], ['7 others', 8, '5 of 8', 'b']];
  const table = (st = 'top:687px;height:198px', cls = ' hid') => `<div class="sh-card sh-tbl${cls}" style="${st}">
      <div class="sh-ov">Delivery escalations by agent</div>
      <div class="sh-tr h"><span class="a">Agent</span><span class="t">Taken</span><span class="f">First-contact resolution</span></div>
      <div class="sh-rows">${ROWS.map(([a, t, f, k]) => `<div class="sh-tr r"><span class="a">${a}</span><span class="t">${t}</span><span class="f"><span class="sh-chip ${k}">${f}</span></span></div>`).join('')}</div>
    </div>`;

  const html = () => `<div class="sh-cam" data-cam="c0">${shell()}
      <header class="sh-top"><b>Dashboard</b></header>
      <div class="sh-logo">${mark(`<defs><linearGradient id="sh-g" x1=".2" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#5cbaf8"/><stop offset=".5" stop-color="#43a0f3"/><stop offset="1" stop-color="#2f7fe2"/></linearGradient></defs>`).replace('</svg>', `<path class="b" d="${MARK}"/></svg>`)}</div>
      <div class="sh-ring hid">${ring()}</div>
      <div class="sh-greet"><span style="opacity:.8;transform:translateY(1px)">Good</span> <span style="opacity:.65;transform:translateY(2px)">evening,</span> <span style="opacity:.35;transform:translateY(4px)">Ofir.</span></div>
      <div class="sh-sub" style="opacity:0">What would you like to explore for Northwind?</div>
      <div class="sh-pill"><i></i><span>Analyzing yesterday’s calls...</span></div>
      <div class="sh-sug hid"><h6>AI suggestions</h6>${CHIPS.map(r => `<div class="sh-chips">${r.map(t => `<span>${t}</span>`).join('')}</div>`).join('')}</div>
      <div class="sh-thr"><div class="sh-tin">
        <div class="sh-bub b1 hid" style="top:104.5px">What drove escalations this week?</div>
        <div class="sh-think t1 hid" style="top:167.4px"><i class="sh-sph"></i>Thinking...</div>
        ${chunks('a1', 169, ['Escalations hit', ' <b>23 this</b>', '<b> week</b> –', ' one topic', ' accounts for', ' almost all', ' of it:'])}
        <div class="sh-card sh-kpi hid" style="top:215.4px;height:179px">
          <div class="sh-kl" style="top:19px">Escalations this week</div>
          <div class="sh-kn n1">23</div><span class="sh-delta hid">+34%</span><i class="sh-ul hid"></i>
          <div class="sh-kl l2 hid" style="top:108px">Driven by delivery</div>
          <div class="sh-kn n2 hid">70%</div>
        </div>
        <div class="sh-card sh-topic hid" style="top:406.4px;height:131px">
          <div class="sh-ov" style="top:20.5px">Escalations by topic</div>
          <div class="sh-bars">${BARS.map(([l, v]) => `<div>${l}<i><s style="width:${(v / 16 * 98.7).toFixed(1)}%"></s></i><b>${v}</b></div>`).join('')}</div>
        </div>
        ${acts('x1', 216)}
        <div class="sh-bub b2 hid" style="top:576px">Who handled them?</div>
        <div class="sh-think t2 hid" style="top:637px"><i class="sh-sph"></i>Thinking...</div>
        ${chunks('a2', 642, ['Nine agents', ' took the', ' 16 delivery', ' escalations –', ' one pattern', ' stands out:'])}
        ${table()}
        ${acts('x2', 688)}
      </div></div>
      <div class="sh-comp hid"><div class="sh-in ph"></div><div class="sh-tools">${ic('at')}${ic('shSlash')}</div>
        <div class="sh-slot" data-s="mic"><span class="mic">${ic('shMic')}</span><span class="send">${ic('shUp')}</span><span class="busy"><b></b><b></b><b></b></span></div></div>
    </div>
    <div class="sh-dim hid"></div>
    <div class="sh-spot" data-cam="c1"></div>
    <div class="sh-navy sh-tc hid">
      <div class="sh-ey">Hear</div>
      <div class="sh-hl"><span>Your</span> <span>team</span> <span>reads</span> <span class="pc">2%</span><br><span>of</span> <span>your</span> <span>calls.</span></div>
      <div class="sh-ringp"><i class="hid"></i></div>
      <div class="sh-tsub">We read all of them.</div>
    </div>
    <div class="sh-navy sh-ec hid">
      <div class="sh-ey">Time to answer</div>
      <div class="sh-num"><span>1s</span></div>
      <div class="sh-esub">From question to the agent who needs coaching.</div>
    </div>`;

  // camera presets (translate x, y, scale) for a wide window and for the portrait window on phones; on a phone the opening
  // frame keeps the whole composer inside the 480-wide window
  const CAM = {
    w: { c0: [0, 0, 1], c1: [86.4, 54, .88], c2: [-456, -95.3, 1.4475] },
    n: { c0: [70.9, 106.4, .765], c1: [93.8, 96.5, .735], c2: [22, 20, .86] },
  };
  const OUT3 = 'cubic-bezier(.33,1,.68,1)', QOUT = 'cubic-bezier(.5,1,.89,1)';
  // an exponential ease-out (1 − 2^(−k·x)) sampled densely near the start, where the recording's camera moves fastest
  const EXP = (k = 10, n = 28) => Array.from({ length: n + 1 }, (_, i) => { const x = Math.pow(i / n, 1.7); return [x, (1 - Math.pow(2, -k * x)) / (1 - Math.pow(2, -k))]; });
  const tfv = ([x, y, s]) => `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${s.toFixed(4)})`;
  // when each character lands, read frame by frame from the recording
  const PH = [.667, .733, .8, .867, .933, 1, 1.033, 1.133, 1.2, 1.233, 1.3, 1.333, 1.433, 1.5, 1.533, 1.6, 1.7, 1.733, 1.8, 1.833, 1.933, 2, 2.033, 2.067, 2.1, 2.25];
  const Q1 = [7.467, 7.533, 7.633, 7.7, 7.733, 7.833, 7.933, 8.033, 8.067, 8.133, 8.267, 8.333, 8.467, 8.533, 8.633, 8.667, 8.7, 8.833, 8.9, 8.9, 8.933, 9.067, 9.1, 9.2, 9.267, 9.333, 9.4, 9.433, 9.467, 9.533, 9.667, 9.7, 9.8];
  const Q2 = [20.9, 21.033, 21.067, 21.1, 21.2, 21.3, 21.4, 21.433, 21.5, 21.6, 21.667, 21.733, 21.833, 21.933, 22.033, 22.1, 22.133];

  LX.scene('showcase', {
    cls: 'sc-sh',
    html,
    cam0: [720, 450],
    hold: 1800,
    // each beat ends on the state it names, so a reduced-motion step shows the title card, the push-in and the spotlight
    times: [0, 2.27, 5.77, 10.55, 16.56, 19.63, 27.37, 30.2, 31.97],
    beats: [
      'The Chat home opens on a demo workspace.',
      'A title card says what share of calls a team reads.',
      'The engine types the first question and sends it.',
      'The answer streams in with a count and a chart.',
      'The camera pushes in on the answer and its cards.',
      'A follow-up on who handled the escalations returns a table.',
      'The agent table lifts out of a dimmed screen.',
      'An end card counts up the time to answer.',
    ],
    rest: 5,
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take. A frame of the recording shows
      // what changed during the frame before it, so every cue fires one tick (16 ms) ahead of the frame that first shows it.
      let off = 0;
      const LEAD = 16;
      const at = t => c.wait(Math.max(0, t * 1000 - LEAD + off - c.P.t));
      // a beat re-bases the clock only when a jump has just landed on it, so small waits never add up to drift
      const B = async (i, t0) => { await at(t0); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - t0 * 1000; };
      const show = (el, ms, o = {}) => { el.classList.remove('hid'); return c.anim(el, [{ opacity: 0, transform: o.from || 'none' }, { opacity: 1, transform: 'none' }], { duration: ms, easing: o.ease || OUT3, delay: o.delay || 0, fill: 'backwards' }); };
      // a card that fades in while it settles a few pixels up into place
      const rise = (el, ms, dy, o = {}) => {
        el.classList.remove('hid');
        c.anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: o.fade || ms, easing: o.ease || 'linear', fill: 'backwards' });
        c.anim(el, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: ms, easing: OUT3, fill: 'backwards' });
      };
      const hide = (el, ms, ease = 'linear') => { el.classList.add('hid'); if (ms) c.anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: ease }); };
      const mode = () => (app.closest('.lx') || app).classList.contains('lx-cam') ? 'n' : 'w';
      const cam = q('.sh-cam'), spot = q('.sh-spot');
      // the camera moves the app and the spotlight layer together; 'exp' follows the recording's exponential settle
      const camTo = (n, ms, easing, k = 10) => {
        const a = CAM[mode()][cam.dataset.cam], b = CAM[mode()][n];
        cam.dataset.cam = spot.dataset.cam = n;
        if (!ms) return;
        const kf = easing === 'exp' ? EXP(k).map(([x, p]) => ({ offset: x, transform: tfv(a.map((v, i) => v + (b[i] - v) * p)) })) : [{ transform: tfv(a) }, { transform: tfv(b) }];
        [cam, spot].forEach(el => c.anim(el, kf, { duration: ms, easing: easing === 'exp' ? 'linear' : easing }));
      };
      // an element's box (top, height, left, width) moved over time
      const box = (el, to, ms, easing) => {
        const cs = el.style, from = {};
        for (const k in to) from[k] = cs[k] || getComputedStyle(el)[k];
        for (const k in to) cs[k] = to[k] + 'px';
        if (ms) c.anim(el, [from, Object.fromEntries(Object.entries(to).map(([k, v]) => [k, v + 'px']))], { duration: ms, easing });
      };
      // text typed on the recording's own schedule: ts[n] is when the (n + 1)th character lands
      const typeAt = async (el, text, ts) => { for (let n = 0; n < ts.length; n++) { await at(ts[n]); el.textContent = text.slice(0, n + 1); } };
      const countAt = async (el, kf, fmt = v => String(v)) => { for (const [t, v] of kf) { await at(t); el.textContent = fmt(v); } };
      // keyframes pinned to the recording's frames: pts = [[t, value]...] says what the frame at t shows. Call it at at(pts[0][0]);
      // the animation starts one tick ahead of that frame and makes up any lateness of the tick that started it
      const ka = (el, pts, mk = v => ({ opacity: v })) => {
        const T0 = pts[0][0] * 1000 - LEAD, dur = pts[pts.length - 1][0] * 1000 - T0;
        el.classList.remove('hid');
        const a = c.anim(el, [{ offset: 0, ...mk(pts[0][1]) }, ...pts.map(([t, v]) => ({ offset: Math.min(1, (t * 1000 - T0) / dur), ...mk(v) }))], { duration: dur, easing: 'linear' });
        if (!c.ff) try { a.currentTime = Math.min(dur - 1, Math.max(0, c.P.t - off - T0)); } catch (e) {}
        return a;
      };
      // streamed chunks: the first fades in on the recording's curve; the rest land at full strength on the frame that first shows them
      const stream = async (sel, first, ts) => { const parts = qa(sel + ' > span'); await at(first[0][0]); ka(parts[0], first); for (let i = 1; i < parts.length; i++) { await at(ts[i - 1]); parts[i].classList.remove('hid'); } };
      // the composer caret blinks while it waits (on about .55 s, off about .5 s), read frame by frame: offs = [[off, back on]...]
      const blink = offs => (async () => { for (const [a, b] of offs) { await at(a); inp.classList.add('co'); await at(b); inp.classList.remove('co'); } })().catch(() => {});
      // the button slot (mic, send, busy): each state change is a short crossfade measured on the recording. The busy square
      // fades in over the send square, which stays solid underneath, so only the icons cross
      const sl = n => slot.querySelector('.' + n);
      const slotTo = (s, fade) => { slot.dataset.s = s; for (const [n, pts, mk] of fade) ka(sl(n), pts, mk); };
      const sc = ([k, o]) => ({ transform: `scale(${k})`, opacity: o });
      // busy dots: a wave that lifts each dot in turn, about once a second; phase = where the first dot is in its cycle
      const dots = (phase, ms) => qa('.sh-slot .busy b').forEach((d, i) => c.anim(d, [
        { offset: 0, transform: 'translateY(.9px)', opacity: .45 }, { offset: .12, transform: 'translateY(.9px)', opacity: .45, easing: 'ease-in-out' },
        { offset: .42, transform: 'translateY(-3.1px)', opacity: 1 }, { offset: .58, transform: 'translateY(-3.1px)', opacity: 1, easing: 'ease-in-out' },
        { offset: .9, transform: 'translateY(.9px)', opacity: .45 }, { offset: 1, transform: 'translateY(.9px)', opacity: .45 }],
        { duration: 1060, iterations: ms / 1060, iterationStart: ((phase - i * .115 - i * i * .005) % 1 + 1) % 1, easing: 'linear' }));

      const comp = q('.sh-comp'), inp = q('.sh-in'), slot = q('.sh-slot'), logo = q('.sh-logo'), rng = q('.sh-ring');
      const tc = q('.sh-tc'), ec = q('.sh-ec'), x1 = q('.x1'), x2 = q('.x2');

      // 1. the Chat home is finishing its entrance as the take starts: the last words of the greeting settle, the subtitle
      // and the composer fade in, then the camera pulls back while the placeholder types an example question
      await B(0, 0);
      const gw = qa('.sh-greet span'), sub = q('.sh-sub');
      [[gw[0], .8, 1, 80], [gw[1], .65, 2, 110], [gw[2], .35, 4, 180]].forEach(([w, o, y, d]) => { w.style.cssText = ''; c.anim(w, [{ opacity: o, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], { duration: d, easing: OUT3 }); });
      sub.style.opacity = ''; c.anim(sub, [{ opacity: 0 }, { opacity: 1 }], { duration: 220, delay: 30, easing: OUT3, fill: 'backwards' });
      await at(.255); show(comp, 300);
      const ph = typeAt(inp, 'What drove escalations thi', PH);
      await at(.72); camTo('c1', 600, OUT3);
      await at(.733); q('.sh-pill span').textContent = 'Processing sentiment signals...';
      await at(.85); inp.classList.add('is-typing');
      await ph;

      // 2. the title card: it cuts in over the app, the claim rises in word by word, and "2%" gets a ring and a small pop
      await B(1, 2.27);
      const words = [q('.sh-tc .sh-ey'), ...qa('.sh-hl > span'), q('.sh-tsub')];
      [2.56, 2.63, 2.685, 2.74, 2.83, 2.85, 2.92, 2.96, 2.91].forEach((t, i) => c.anim(words[i], [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: Math.max(0, (t - 2.27) * 1000), easing: 'ease-out', fill: 'backwards' }));
      // the recording washes the navy in over the app through a blur (40% of the way at 2.300, 60% at 2.333, by the
      // frame's brightness); the card cuts in between those two frames, so the app and the card never show at once, and
      // the words rise onto the solid navy
      await at(2.333); tc.classList.remove('hid');
      // a thin ring sits around the "%" first, then swells out and fades as the figure pops
      await at(3.27);
      const pr = q('.sh-ringp i');
      // radius over time, measured on the recording; the size (not a scale) changes, so the stroke stays 1.5 px
      const R = [[0, 37, 0], [.105, 37, .8], [.526, 37, .8], [.579, 64, 1], [.637, 82, 1], [.754, 88, .95], [.87, 97, .6], [.93, 103, .25], [1, 106, 0]];
      c.anim(pr, R.map(([o, r, a]) => ({ offset: o, opacity: a, left: -r + 'px', top: -r + 'px', width: 2 * r + 'px', height: 2 * r + 'px' })), { duration: 570, easing: 'linear' });
      await at(3.5);
      c.anim(q('.sh-hl .pc'), [[0, 1], [.11, 1.07], [.333, 1.17], [.557, 1], [.68, .965], [.85, .965], [1, 1]].map(([o, v]) => ({ offset: o, transform: `scale(${v})` })), { duration: 300, easing: 'linear' });
      await at(4.2);
      inp.textContent = 'Which agents'; q('.sh-pill span').textContent = 'Building your briefing...';

      // 3. back in the app: the composer takes focus, suggestions appear, the engine types the question and sends it
      // the card's words leave in the recording's order on the solid navy: the eyebrow and the sub-line fade first, then
      // line 1, then "of your calls.", which the recording keeps over the app for a few frames and which here is gone
      // before the card goes
      await B(2, 5.77);
      const hl = qa('.sh-hl > span');
      const out = (els, pts) => els.forEach(el => { el.style.opacity = 0; ka(el, pts); });
      await at(5.784);
      out([q('.sh-tc .sh-ey')], [[5.784, 1], [5.8, .81], [5.833, .58], [5.867, .36], [5.9, .25], [5.933, .12], [5.967, .06], [6.0, 0]]);
      out([q('.sh-tsub')], [[5.784, 1], [5.8, .85], [5.833, .7], [5.867, .47], [5.9, .38], [5.933, .22], [5.967, .14], [6.0, .05], [6.033, 0]]);
      await at(5.85);
      out(hl.slice(0, 4), [[5.85, 1], [5.867, .98], [5.933, .93], [6.0, .84], [6.033, .74], [6.067, .58], [6.1, 0]]);
      await at(6.0);
      out(hl.slice(4), [[6.0, 1], [6.033, .8], [6.067, .5], [6.1, .2], [6.117, 0]]);
      // the recording lifts the navy off the app through a blur (20% of the way at 6.100, 76% at 6.133, by the frame's
      // brightness); the empty card cuts away between those two frames
      await at(6.133); tc.classList.add('hid');
      await at(6.6);
      // "Ofir." lingers for a frame as the greeting goes
      gw[0].style.opacity = gw[1].style.opacity = 0; hide(q('.sh-greet'), 45);
      ['.sh-sub', '.sh-pill'].forEach(s => q(s).classList.add('hid'));
      logo.classList.add('small');
      inp.textContent = ''; inp.classList.remove('ph');
      comp.classList.add('tall');
      Object.assign(comp.style, { left: '541.5px', width: '615px', height: '177px', top: '381px' });
      box(comp, { top: 329.5 }, 200, OUT3);
      // the caret blinks off while the composer waits for the first character
      blink([[6.9, 7.467]]);
      await at(6.73); show(q('.sh-sug h6'), 70, { ease: 'linear' }); q('.sh-sug').classList.remove('hid');
      // each chip shows faintly for one frame and is solid on the next: 6.8, 6.867, 6.9 and 6.933 s
      qa('.sh-chips span').forEach((el, i) => c.anim(el, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 60, delay: [20, 87, 120, 153][i], easing: 'ease-in', fill: 'backwards' }));
      await at(6.8); comp.classList.add('fo');
      await at(6.86); logo.classList.add('blue'); c.anim(q('.sh-logo .b'), [{ opacity: 0 }, { opacity: 1 }], { duration: 170, easing: 'linear' });
      await at(7.0); rng.classList.remove('hid'); c.anim(rng, [{ opacity: 0, transform: 'scale(.57)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: OUT3 });
      const ty = typeAt(inp, 'What drove escalations this week?', Q1);
      // the send button replaces the mic with the first character: pale on the first frame, solid by the third
      await at(7.45); slotTo('send', [['send', [[7.45, 0], [7.467, .48], [7.5, .78], [7.533, 1]]], ['mic', [[7.45, 1], [7.467, .45], [7.5, 0]]]]);
      await ty;

      // the send closes step 3: the question leaves the composer, the caret goes until the composer lands, and the
      // question appears in the thread
      await at(10.4);
      inp.textContent = ''; inp.classList.remove('is-typing');
      app.classList.add('sent');
      // the mark drops with the home layout as the thread takes over, then fades
      logo.style.transform = rng.style.transform = 'translateY(25px)';
      await at(10.435); hide(q('.sh-sug'), 70);
      await at(10.44);
      show(q('.b1'), 120, { from: 'translateY(4px)', ease: 'linear' });
      show(q('.t1'), 120, { ease: 'linear' });
      // the composer drops to the foot of the thread on the recording's measured curve
      await at(10.445);
      const drop = [[0, 0], [.061, .004], [.132, .029], [.204, .071], [.276, .12], [.349, .188], [.421, .351], [.495, .653], [.566, .745], [.638, .816], [.783, .931], [.855, .983], [.928, .997], [1, 1]];
      const A0 = { top: 329.5, height: 177, left: 541.5, width: 615 }, A1 = { top: 766, height: 106, left: 547, width: 604 };
      Object.assign(comp.style, { top: '766px', height: '106px', left: '547px', width: '604px' });
      c.anim(comp, drop.map(([o, p]) => ({ offset: o, ...Object.fromEntries(Object.keys(A0).map(k => [k, (A0[k] + (A1[k] - A0[k]) * p).toFixed(1) + 'px'])) })), { duration: 461, easing: 'linear' });
      comp.classList.remove('tall');
      await at(10.445); hide(logo, 70); hide(rng, 70);
      await at(10.45); slotTo('busy', [['send', [[10.45, 1], [10.5, 1]]], ['busy', [[10.45, 0], [10.467, .5], [10.5, 1]]]]); dots(.7, 2650);

      // 4. the engine thinks, then the answer streams with its cards
      await B(3, 10.55);
      await at(10.86); inp.classList.add('is-typing');
      blink([[11.433, 11.933], [12.467, 13.033], [13.533, 14.033], [14.533, 15.1], [15.667, 16.2]]);
      await at(11.0); box(comp, { top: 782.5, height: 88.5 }, 300, OUT3);
      // the busy button dips, then fades as the mic comes back
      await at(12.85);
      slotTo('mic', [['busy', [[12.85, [1, 1]], [12.867, [.8, 1]], [12.9, [.94, .56]], [12.967, [.95, .52]], [13.0, [.97, .3]], [13.033, [1, 0]]], sc], ['mic', [[12.85, 0], [12.967, 0], [13.0, .7], [13.033, 1]]]]);
      await at(12.87);
      q('.t1').classList.add('hid');
      // the actions row arrives with the first words, just under them
      (async () => { await at(12.884); ka(x1, [[12.884, 0], [12.9, .26], [12.967, .3], [13.0, .58], [13.033, 1]]); ka(x1, [[12.884, 4], [12.967, 3], [13.0, 2.2], [13.033, 1.1], [13.067, 0]], v => ({ transform: `translateY(${v}px)` })); })().catch(() => {});
      // the answer settles about 4 px up into place while its first words fade in
      (async () => { await at(12.884); ka(q('.a1'), [[12.884, 4], [12.967, 3], [13.0, 2.2], [13.033, 1.1], [13.067, 0]], v => ({ transform: `translateY(${v}px)` })); })().catch(() => {});
      await stream('.a1', [[12.884, 0], [12.9, .33], [12.967, .35], [13.0, .66], [13.033, .96], [13.067, 1]], [13.067, 13.133, 13.3, 13.4, 13.533, 13.667]);
      // the cards take their space at once (the actions row drops below them), then fade in as they settle
      await at(13.69); x1.style.top = '545px';
      await at(13.715);
      const n1 = q('.sh-kpi .n1'), n2 = q('.sh-kpi .n2'), l2 = q('.sh-kpi .l2');
      n1.textContent = '3';
      // the card holds faint for three frames before it fills in
      const kpi = q('.sh-kpi');
      ka(kpi, [[13.717, 0], [13.733, .22], [13.8, .25], [13.833, .5], [13.867, .8], [13.9, 1]]);
      // it holds 10 px low while faint, then rises into place as it fills in
      ka(kpi, [[13.717, 10], [13.8, 9.5], [13.833, 6.8], [13.867, 3.4], [13.9, 1.1], [13.933, 0]], v => ({ transform: `translateY(${v}px)` }));
      await countAt(n1, [[13.733, 3], [13.833, 7], [13.867, 10], [13.9, 13], [13.933, 15], [14.033, 18]]);
      await at(14.09); rise(q('.sh-topic'), 380, 8, { ease: QOUT });
      const vals = qa('.sh-bars b');
      vals.forEach(v => { v.textContent = '0'; });
      const bars = Promise.all([
        countAt(vals[0], [[14.1, 11], [14.2, 13], [14.233, 14], [14.3, 15], [14.4, 16]]),
        countAt(vals[1], [[14.133, 1], [14.2, 2], [14.233, 3], [14.4, 4]]),
        countAt(vals[2], [[14.233, 1], [14.333, 2], [14.433, 3]]),
        countAt(n1, [[14.1, 19], [14.133, 20], [14.2, 21], [14.3, 22], [14.467, 23]]),
        (async () => {
          await at(14.18); n2.textContent = '2%'; show(l2, 150, { ease: 'linear' }); show(n2, 150, { ease: 'linear' });
          await countAt(n2, [[14.2, 2], [14.233, 10], [14.3, 21], [14.333, 28], [14.4, 36], [14.433, 42], [14.467, 48], [14.533, 56], [14.633, 59], [14.667, 63], [14.7, 64], [14.733, 66], [14.833, 69], [14.933, 70]], v => v + '%');
        })(),
      ]);
      await at(14.72); show(q('.sh-delta'), 110, { ease: 'linear' });
      await bars;
      // the underline draws out over a third of a second, measured frame by frame
      await at(14.95); ka(q('.sh-ul'), [[14.95, 0], [14.967, .03], [15.0, .36], [15.033, .56], [15.067, .67], [15.1, .76], [15.133, .85], [15.2, .93], [15.233, .97], [15.267, 1]], v => ({ transform: `scaleX(${v})` }));
      await at(16.53); q('.sh-delta').classList.add('hid');

      // 5. the camera pushes in on the answer and settles slowly, the way the recording eases out
      await B(4, 16.56);
      camTo('c2', 1200, 'exp');
      blink([[16.733, 17.267], [17.8, 18.333], [18.867, 19.4]]);

      // 6. the camera pulls back; the follow-up is typed, sent and answered with a table
      await B(5, 19.63);
      camTo('c1', 820, 'exp');
      // the caret is off as the camera pulls back, on again from 20.4 s; after the send it waits half a second to come back
      blink([[19.933, 20.4], [22.667, 23.2], [23.733, 24.267], [24.8, 25.333], [25.867, 26.4], [26.933, 27.467]]);
      await at(20.2);
      inp.classList.add('is-typing');
      const t2 = typeAt(inp, 'Who handled them?', Q2);
      await at(20.884); slotTo('send', [['send', [[20.884, 0], [20.9, .15], [20.933, .6], [20.967, .6], [21.0, .65], [21.033, .8], [21.067, 1]]], ['mic', [[20.884, 1], [20.9, .6], [20.933, 0]]]]);
      await t2;
      // the question leaves the composer as it is sent
      await at(22.733); inp.textContent = '';
      await at(22.76);
      show(q('.b2'), 140, { from: 'translateY(4px)', ease: 'linear' }); show(q('.t2'), 140, { ease: 'linear' });
      await at(22.784); slotTo('busy', [['send', [[22.784, 1], [22.867, 1]]], ['busy', [[22.784, 0], [22.8, .5], [22.833, .9], [22.867, 1]]]]); dots(.985, 2120);
      await at(24.684);
      slotTo('mic', [['busy', [[24.684, [1, 1]], [24.7, [.8, 1]], [24.733, [.93, .6]], [24.767, [.94, .57]], [24.8, [.96, .3]], [24.833, [.98, .15]], [24.867, [1, 0]]], sc], ['mic', [[24.684, 0], [24.767, 0], [24.8, .7], [24.833, .85], [24.867, 1]]]]);
      await at(24.7);
      q('.t2').classList.add('hid'); x1.style.opacity = 0; ka(x1, [[24.7, 1], [24.733, .55], [24.767, .52], [24.8, 0]]);
      (async () => { await at(24.717); ka(x2, [[24.717, 0], [24.733, .19], [24.767, .2], [24.8, .6], [24.833, 1]]); ka(x2, [[24.717, 4], [24.767, 3.5], [24.8, 2.5], [24.833, .8], [24.867, 0]], v => ({ transform: `translateY(${v}px)` })); })().catch(() => {});
      (async () => { await at(24.717); ka(q('.a2'), [[24.717, 3.5], [24.767, 3], [24.8, 2.2], [24.833, 0]], v => ({ transform: `translateY(${v}px)` })); })().catch(() => {});
      await stream('.a2', [[24.717, 0], [24.733, .19], [24.767, .2], [24.8, .62], [24.833, .88], [24.867, 1]], [24.833, 24.933, 25.067, 25.233, 25.333]);
      // the table takes its space (the actions row drops below it), the thread scrolls it into view and its rows arrive
      await at(25.49); x2.style.top = '892px';
      const tbl = q('.sh-tbl'), rows = qa('.sh-tbl .sh-tr.r');
      rows.forEach(r => r.classList.add('hid'));
      // the table fades in over about 200 ms while the thread scrolls; each row then fades in over about 200 ms, one after another
      await at(25.5); ka(tbl, [[25.5, 0], [25.533, .22], [25.6, .45], [25.633, .7], [25.667, .88], [25.7, 1]]);
      // the thread scrolls on the recording's measured curve: slow off the mark, fast through the middle, a long settle
      await at(25.516);
      const tin = q('.sh-tin'); tin.dataset.y = 242; tin.style.transform = 'translateY(-242px)';
      ka(tin, [[25.516, 0], [25.533, .03], [25.567, .14], [25.6, .39], [25.633, .8], [25.667, .917], [25.7, .975], [25.733, .99], [25.8, 1]], p => ({ transform: `translateY(${(-242 * p).toFixed(1)}px)` }));
      const rowIn = async (el, pts) => { await at(pts[0][0]); ka(el, pts); };
      await Promise.all([
        rowIn(rows[0], [[25.583, 0], [25.6, .15], [25.633, .55], [25.667, .85], [25.7, .95], [25.75, 1]]),
        rowIn(rows[1], [[25.617, 0], [25.65, .2], [25.683, .65], [25.75, .78], [25.783, .83], [25.817, .95], [25.85, 1]]),
        rowIn(rows[2], [[25.65, 0], [25.683, .1], [25.7, .25], [25.75, .4], [25.783, .6], [25.817, .85], [25.85, 1]]),
      ]);

      // 7. spotlight: the screen dims and the table is lifted out onto a plate
      await B(6, 27.37);
      blink([[28.033, 28.5], [29.033, 29.6]]);
      const dim = q('.sh-dim');
      show(dim, 330);
      const plate = c.add(spot, `<div class="sh-plate"><i class="bg hid"></i>${table('top:15px;height:198px', '')}</div>`, 'none');
      await at(27.43);
      // on a phone the plate leans right a little so its rim stays inside the portrait frame
      const lifted = mode() === 'n' ? 'translate(22px, -6.8px) scale(1.04)' : 'translate(.8px, -8px) scale(1.065)';
      plate.style.transform = lifted;
      c.anim(plate, [{ transform: 'none' }, { transform: lifted }], { duration: 380, easing: OUT3 });
      // the plate's white backing cuts in half-way through the recording's short fade, so its rim never shows the dimmed
      // actions row through it
      await at(27.48); plate.querySelector('.bg').classList.remove('hid');

      // 8. the spotlight lifts and the end card counts up the time it took
      await B(7, 30.2);
      blink([[30.1, 30.533]]);
      plate.style.transform = '';
      c.anim(plate, [{ transform: lifted }, { transform: 'none' }], { duration: 230, easing: OUT3 });
      // the dim lifts part way, then the plain screen cuts back in
      // (the dim is already hidden underneath, so when this partial lift ends the cut lands with no second cue)
      await at(30.25); dim.classList.add('hid'); c.anim(dim, [{ opacity: 1 }, { opacity: .9, offset: .3 }, { opacity: .78, offset: .55 }, { opacity: .55, offset: .9 }, { opacity: .5 }], { duration: 280, easing: 'linear' });
      // the plate's backing cuts away half-way through the recording's fade (gone by 30.417), as it settled back in
      await at(30.317); plate.querySelector('.bg').classList.add('hid');
      await at(30.53); plate.remove();
      // the camera pushes into the app about the middle of the frame (scale 1 to 1.16, read off the bubble's size and drift);
      // the recording washes the end card in over it through a blur, and the card cuts in where that wash is half-way
      await at(30.575);
      {
        const [x, y, k] = CAM[mode()][cam.dataset.cam], [ox, oy] = mode() === 'n' ? [720, 450] : [743, 459];
        const zf = s => ({ transform: tfv([ox * (1 - s) + x * s, oy * (1 - s) + y * s, k * s]) });
        cam.style.transform = zf(1.16).transform;
        ka(cam, [[30.575, 1], [30.6, 1.055], [30.633, 1.096], [30.667, 1.123], [30.7, 1.14], [30.767, 1.15], [30.833, 1.156], [30.9, 1.16]], zf);
      }
      const num = q('.sh-num span'), lab = q('.sh-ec .sh-ey'), esub = q('.sh-esub');
      lab.classList.add('hid'); esub.classList.add('hid'); num.classList.add('hid');
      // (45% of the way at 30.633, 59% at 30.667, by the frame's brightness: the card cuts in between those two frames, so
      // the app and the card never show at once, and the count and its lines arrive on the solid card)
      await at(30.667); ec.classList.remove('hid');
      await at(30.92); show(num, 220, { from: 'scale(.96)', ease: 'linear' });
      const cnt = countAt(num, [[30.933, 1], [31.033, 4], [31.067, 7], [31.1, 9], [31.133, 11], [31.2, 13], [31.267, 16], [31.3, 17], [31.333, 19], [31.4, 20], [31.433, 22], [31.467, 23], [31.533, 24], [31.6, 25], [31.633, 26], [31.667, 27], [31.7, 28], [31.833, 29], [31.9, 30]], v => v + 's');
      await at(31.0); show(lab, 330, { ease: 'linear' });
      await at(31.27); show(esub, 400, { ease: 'linear' });
      await cnt;
      await at(31.97);
    },
  });
})();
