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
    shSlash: 'M6.5 3.5h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3zM14 8l-4 8',
    shMic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21M9 21h6',
    shUp: 'M12 19V5.5M6.5 11L12 5.5l5.5 5.5',
    shUpv: 'M7 10v11M14.5 5.9L13.5 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h2.8a2 2 0 0 0 1.8-1.1L11.5 3a2.9 2.9 0 0 1 3 2.9z',
    shDnv: 'M17 14V3M9.5 18.1l1-4.1H4.7a2 2 0 0 1-1.9-2.6l2.3-7A2 2 0 0 1 7 3h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2.8a2 2 0 0 0-1.8 1.1L12.5 21a2.9 2.9 0 0 1-3-2.9z',
    shRegen: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 4v4.5H8',
    shCopy: 'M10 9h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 21h-9a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 10 9zM15.5 9V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5',
    shVdots: 'M12 5h.01M12 12h.01M12 19h.01',
  });
  // the Hear mark: a sound wave drawn as an H, traced from the recording
  const MARK = 'M43.7 0C44.9-.2 46.6-.2 47.7.3 48.8.8 49.8 1.7 50.3 2.7 50.8 3.7 51 4.4 51 6.5 51 8.6 50.3 13.1 50.3 15.2 50.3 17.3 49.9 18 50.8 19.2 51.7 20.4 54.7 21.4 55.7 22.2 56.7 23 56.8 23.2 56.8 23.8 56.8 24.4 57.2 24.6 56 25.5 54.8 26.4 52.5 25.3 49.7 29 46.9 32.7 41.4 44.3 39.2 47.8 37 51.3 37.6 49.5 36.7 50 35.8 50.5 34.7 50.7 33.7 50.7 32.7 50.8 31.4 50.7 30.5 50.3 29.6 49.9 28.9 49.8 28.3 48.2 27.8 46.6 27.3 43.4 27.2 40.7 27.1 38 27.7 34.2 27.5 32.2 27.3 30.2 26.9 29.3 26.2 28.5 25.5 27.7 24.4 27.2 23.3 27.3 22.2 27.4 20.6 28.2 19.7 28.8 18.8 29.4 18.8 29.2 17.7 31 16.6 32.8 14.1 37.9 12.8 39.5 11.5 41.1 11 40.7 10 40.7 9 40.7 7.5 40.2 6.7 39.5 5.9 38.8 5.5 38.2 5.3 36.3 5.1 34.4 5.8 29.9 5.5 28.2 5.2 26.5 4 26.5 3.3 26 2.6 25.5 1.8 25.6 1.2 25.2.7 24.8-.1 24.1 0 23.7.1 23.3.5 23 1.5 22.7 2.5 22.4 5.1 22.3 6.2 21.8 7.3 21.3 7.3 21 8 19.7 8.7 18.4 9.5 15.4 10.2 14 10.9 12.6 11.4 11.8 12 11.2 12.6 10.6 12.7 10.5 13.5 10.2 14.3 9.9 16.2 9.5 17 9.5 17.8 9.5 17.9 9.9 18.3 10.3 18.7 10.8 18.7 10.6 19.3 12.2 19.9 13.8 20.9 18.4 21.7 20 22.5 21.6 23.5 21.3 24.3 21.5 25.1 21.7 25.5 21.9 26.7 21 27.9 20.1 30.2 18.1 31.5 16 32.8 13.9 33.8 10.2 34.7 8.3 35.6 6.4 36 5.9 37 4.7 38 3.5 39.4 2.1 40.5 1.3 41.6.5 42.5.2 43.7 0z';
  const mark = (inner = '') => `<svg class="sh-mk" viewBox="0 0 57 51" aria-hidden="true">${inner}<path d="${MARK}"/></svg>`;
  const ring = () => `<svg viewBox="0 0 57 57" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => {
    const a = i / 28 * Math.PI * 2, o = [.9, .45, .7, .3, .8, .5, .35][i % 7];
    return `<circle cx="${(28.5 + 27.2 * Math.cos(a)).toFixed(2)}" cy="${(28.5 + 27.2 * Math.sin(a)).toFixed(2)}" r="1" opacity="${o}"/>`;
  }).join('')}</svg>`;

  // the sidebar: the stock Lab shell with this workspace's brand block, nav, history and user row
  const NAV = [['h', 'Main'], ['shHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['shTopics', 'Topics'], ['report', 'Reports'], ['shMini', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shield', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge'], ['spark', 'Magic API'],
    ['h', 'Operations'], ['shRadar', 'AI Tasks']];
  const shell = () => LX.shell({ active: 'Chat', nav: NAV })
    .replace('<span class="sb-tile">H</span>', '<span class="sb-tile">DI</span>')
    .replace('<b>Hear</b><small>', '<b>Demo inv</b><small>')
    .replace(/<svg class="hmark "[\s\S]*?<\/svg>Hear/, `${mark()}Hear`)
    .replace(/<i class="av me"[^>]*>U<\/i><b>You<\/b>/, '<i class="av me" style="--c:#e0473f">OF</i><b>Ofir</b>')
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
      <div class="sh-logo">${mark(`<defs><linearGradient id="sh-g" x1="1" y1="0" x2=".15" y2="1"><stop offset="0" stop-color="#62b4f2"/><stop offset=".55" stop-color="#2f86ea"/><stop offset="1" stop-color="#1f6be0"/></linearGradient></defs>`).replace('</svg>', `<path class="b" d="${MARK}"/></svg>`)}</div>
      <div class="sh-ring hid">${ring()}</div>
      <div class="sh-greet"><span>Good</span> <span>evening,</span> <span>Ofir.</span></div>
      <div class="sh-sub">What would you like to explore for Demo inv?</div>
      <div class="sh-pill"><i></i><span>Analyzing yesterday’s calls...</span></div>
      <div class="sh-sug hid"><h6>AI suggestions</h6>${CHIPS.map(r => `<div class="sh-chips">${r.map(t => `<span>${t}</span>`).join('')}</div>`).join('')}</div>
      <div class="sh-thr"><div class="sh-tin">
        <div class="sh-bub b1 hid" style="top:104.5px">What drove escalations this week?</div>
        <div class="sh-think t1 hid" style="top:164.6px"><i class="sh-sph"></i>Thinking...</div>
        ${chunks('a1', 168, ['Escalations hit', ' <b>23 this</b>', '<b> week</b> —', ' one topic', ' accounts for', ' almost all', ' of it:'])}
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
        ${acts('x1', 545)}
        <div class="sh-bub b2 hid" style="top:576px">Who handled them?</div>
        <div class="sh-think t2 hid" style="top:637px"><i class="sh-sph"></i>Thinking...</div>
        ${chunks('a2', 639, ['Nine agents', ' took the', ' 16 delivery', ' escalations —', ' one pattern', ' stands out:'])}
        ${table()}
        ${acts('x2', 892)}
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

  // camera presets (translate x, y, scale) for a wide window and for the portrait window on phones
  const CAM = {
    w: { c0: [0, 0, 1], c1: [86.4, 54, .88], c2: [-456, -95.3, 1.4475] },
    n: { c0: [-11, 63, .86], c1: [74, 85.2, .76], c2: [22, 20, .86] },
  };
  const OUT3 = 'cubic-bezier(.33,1,.68,1)', EXPO = 'cubic-bezier(.16,1,.3,1)', INOUT = 'cubic-bezier(.45,0,.55,1)';

  LX.scene('showcase', {
    cls: 'sc-sh',
    html,
    cam0: [720, 450],
    hold: 1800,
    // each beat ends on the state it names, so a reduced-motion step shows the title card, the push-in and the spotlight
    times: [0, 2.27, 5.87, 10.55, 16.57, 19.63, 27.4, 30.2, 31.97],
    beats: [
      'The Chat home opens on a demo workspace.',
      'A title card makes one claim about your calls.',
      'The engine types the first question and sends it.',
      'The answer streams in with a count and a chart.',
      'The camera pushes in on the answer and its cards.',
      'A follow-up asks who handled them; a table answers.',
      'The screen dims and lifts the agent table out.',
      'An end card counts up the time to answer.',
    ],
    rest: 5,
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // a beat re-bases the clock only when a jump has just landed on it, so small waits never add up to drift
      const B = async (i, t0) => { await at(t0); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - t0 * 1000; };
      const show = (el, ms, o = {}) => { el.classList.remove('hid'); return c.anim(el, [{ opacity: 0, transform: o.from || 'none' }, { opacity: 1, transform: 'none' }], { duration: ms, easing: o.ease || OUT3, delay: o.delay || 0, fill: 'backwards' }); };
      const hide = (el, ms, ease = 'linear') => { el.classList.add('hid'); if (ms) c.anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: ease }); };
      const mode = () => (app.closest('.lx') || app).classList.contains('lx-cam') ? 'n' : 'w';
      const tf = n => { const [x, y, s] = CAM[mode()][n]; return `translate(${x}px, ${y}px) scale(${s})`; };
      const cam = q('.sh-cam'), spot = q('.sh-spot');
      const camTo = (n, ms, easing) => {
        const from = tf(cam.dataset.cam);
        cam.dataset.cam = spot.dataset.cam = n;
        if (ms) [cam, spot].forEach(el => c.anim(el, [{ transform: from }, { transform: tf(n) }], { duration: ms, easing }));
      };
      // an element's box (top, height, left, width) moved over time
      const box = (el, to, ms, easing) => {
        const cs = el.style, from = {};
        for (const k in to) from[k] = cs[k] || getComputedStyle(el)[k];
        for (const k in to) cs[k] = to[k] + 'px';
        if (ms) c.anim(el, [from, Object.fromEntries(Object.entries(to).map(([k, v]) => [k, v + 'px']))], { duration: ms, easing });
      };
      // text that arrives a few characters at a time on the recording's own schedule: [[t, chars], …]
      const typeAt = async (el, text, kf) => {
        for (let n = 1; n <= text.length; n++) {
          let t = kf[kf.length - 1][0];
          for (let k = 1; k < kf.length; k++) if (n <= kf[k][1]) { const [t0, n0] = kf[k - 1], [t1, n1] = kf[k]; t = t0 + (t1 - t0) * (n - n0) / (n1 - n0); break; }
          await at(t); el.textContent = text.slice(0, n);
        }
      };
      const countAt = async (el, kf, fmt = v => String(v)) => { for (const [t, v] of kf) { await at(t); el.textContent = fmt(v); } };
      const stream = async (sel, ts) => { const parts = qa(sel + ' > span'); for (let i = 0; i < parts.length; i++) { await at(ts[i]); show(parts[i], 100, { ease: 'linear' }); } };

      const comp = q('.sh-comp'), inp = q('.sh-in'), slot = q('.sh-slot'), logo = q('.sh-logo'), rng = q('.sh-ring');
      const tc = q('.sh-tc'), ec = q('.sh-ec');

      // 1. the Chat home loads, the camera pulls back to frame the app, the placeholder types an example
      await B(0, 0);
      qa('.sh-greet span').forEach((w, i) => c.anim(w, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 160, delay: i * 35, easing: OUT3, fill: 'backwards' }));
      c.anim(q('.sh-sub'), [{ opacity: 0 }, { opacity: 1 }], { duration: 130, delay: 70, easing: 'linear', fill: 'backwards' });
      await at(.3); show(comp, 250, { ease: 'ease-out' });
      await at(.67); inp.classList.add('is-typing');
      const ph = typeAt(inp, 'What drove escalations th', [[.67, 1], [2.27, 25]]);
      await at(.7); camTo('c1', 600, OUT3);
      await at(.733); q('.sh-pill span').textContent = 'Processing sentiment signals...';
      await ph;

      // 2. the title card: one claim
      await B(1, 2.27);
      show(tc, 400);
      const words = [q('.sh-tc .sh-ey'), ...qa('.sh-hl > span'), q('.sh-tsub')];
      [2.73, 2.82, 2.87, 2.94, 3.02, 3.06, 3.10, 3.20, 3.20].forEach((t, i) => c.anim(words[i], [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 450, delay: Math.max(0, (t - .09 - 2.27) * 1000), easing: OUT3, fill: 'backwards' }));
      await at(3.5);
      c.anim(q('.sh-hl .pc'), [{ transform: 'scale(1)' }, { transform: 'scale(1.04)', offset: .1 }, { transform: 'scale(1.16)', offset: .33 }, { transform: 'scale(.96)', offset: .57 }, { transform: 'scale(.96)', offset: .9 }, { transform: 'scale(1)' }], { duration: 300, easing: 'linear' });
      await at(3.57);
      const pr = q('.sh-ringp i');
      c.anim(pr, [{ opacity: 1, transform: 'scale(.63)' }, { opacity: 1, transform: 'scale(.7)', offset: .083 }, { opacity: 1, transform: 'scale(1.14)', offset: .27 }, { opacity: 1, transform: 'scale(1.215)', offset: .45 }, { opacity: 1, transform: 'scale(1.23)', offset: .64 }, { opacity: 0, transform: 'scale(1.24)' }], { duration: 360, easing: 'linear' });
      await at(4.2);
      inp.textContent = 'Which agents'; q('.sh-pill span').textContent = 'Building your briefing...';

      // 3. back in the app: the composer takes focus, suggestions appear, the engine types the question and sends it
      await B(2, 5.87);
      hide(q('.sh-tsub'), 100);
      await at(6.0); hide(tc, 270, INOUT);
      await at(6.6);
      ['.sh-greet', '.sh-sub', '.sh-pill'].forEach(s => q(s).classList.add('hid'));
      logo.classList.add('small');
      inp.textContent = ''; inp.classList.remove('ph');
      comp.classList.add('tall');
      Object.assign(comp.style, { left: '541.5px', width: '615px', height: '177px', top: '381px' });
      box(comp, { top: 329.5 }, 200, OUT3);
      slot.dataset.s = 'off';
      await at(6.73); show(q('.sh-sug h6'), 100, { ease: 'linear' }); q('.sh-sug').classList.remove('hid');
      const chipEls = qa('.sh-chips span');
      chipEls.forEach((el, i) => c.anim(el, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 100, delay: [40, 40, 100, 100][i], easing: OUT3, fill: 'backwards' }));
      await at(6.8); comp.classList.add('fo');
      await at(6.87); logo.classList.add('blue'); c.anim(q('.sh-logo .b'), [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' });
      await at(7.0); rng.classList.remove('hid'); c.anim(rng, [{ opacity: 0, transform: 'scale(.57)' }, { opacity: 1, transform: 'none' }], { duration: 500, easing: OUT3 });
      await at(7.47);
      const ty = typeAt(inp, 'What drove escalations this week?', [[7.45, 1], [7.53, 2], [7.63, 3], [7.73, 4], [8.08, 7], [8.67, 14], [9.10, 24], [9.47, 29], [9.80, 33]]);
      await at(7.5); slot.dataset.s = 'send';
      await ty;

      // the send closes step 3: the question leaves the composer and lands in the thread
      await at(10.4);
      inp.textContent = '';
      app.classList.add('sent');
      hide(q('.sh-sug'), 100);
      await at(10.47);
      hide(logo, 80); hide(rng, 80);
      show(q('.b1'), 80, { from: 'translateY(4px)' });
      show(q('.t1'), 60);
      // the composer drops to the foot of the thread on the recording's measured curve
      const drop = [[0, 0], [.16, .07], [.33, .19], [.49, .66], [.66, .82], [.83, .94], [1, 1]];
      const A0 = { top: 329.5, height: 177, left: 541.5, width: 615 }, A1 = { top: 761, height: 106, left: 547, width: 604 };
      Object.assign(comp.style, { top: '761px', height: '106px', left: '547px', width: '604px' });
      c.anim(comp, drop.map(([o, p]) => ({ offset: o, ...Object.fromEntries(Object.keys(A0).map(k => [k, (A0[k] + (A1[k] - A0[k]) * p).toFixed(1) + 'px'])) })), { duration: 400, easing: 'linear' });
      comp.classList.remove('tall');
      await at(10.53); slot.dataset.s = 'busy';

      // 4. the engine thinks, then the answer streams with its cards
      await B(3, 10.55);
      await at(10.93); box(comp, { top: 782.5, height: 88.5 }, 300, OUT3);
      await at(12.9);
      q('.t1').classList.add('hid'); slot.dataset.s = 'mic';
      q('.x1').classList.remove('hid');
      await stream('.a1', [12.9, 13.07, 13.13, 13.3, 13.4, 13.53, 13.67]);
      await at(13.7); show(q('.sh-kpi'), 200, { ease: 'linear' });
      const n1 = q('.sh-kpi .n1'), n2 = q('.sh-kpi .n2');
      n1.textContent = '3';
      await countAt(n1, [[13.73, 3], [13.83, 7], [13.87, 10], [13.9, 13], [13.93, 15], [14.03, 18]]);
      await at(14.1); show(q('.sh-topic'), 370, { ease: 'linear' });
      const vals = qa('.sh-bars b');
      vals.forEach(v => { v.textContent = '0'; });
      const bars = Promise.all([
        countAt(vals[0], [[14.13, 11], [14.2, 13], [14.23, 14], [14.3, 15], [14.4, 16]]),
        countAt(vals[1], [[14.2, 2], [14.23, 3], [14.4, 4]]),
        countAt(vals[2], [[14.27, 1], [14.33, 2], [14.43, 3]]),
        countAt(n1, [[14.1, 19], [14.13, 20], [14.2, 21], [14.3, 22], [14.47, 23]]),
        (async () => {
          await at(14.2); q('.sh-kpi .l2').classList.remove('hid'); n2.classList.remove('hid');
          await countAt(n2, [[14.2, 2], [14.23, 10], [14.3, 21], [14.33, 28], [14.4, 36], [14.43, 42], [14.47, 48], [14.53, 56], [14.63, 59], [14.67, 63], [14.7, 64], [14.73, 66], [14.83, 69], [14.93, 70]], v => v + '%');
        })(),
      ]);
      await at(14.73); show(q('.sh-delta'), 100, { ease: 'linear' });
      await bars;
      await at(14.93); q('.sh-ul').classList.remove('hid'); c.anim(q('.sh-ul'), [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 100, easing: 'linear' });
      await at(16.53); q('.sh-delta').classList.add('hid');

      // 5. the camera pushes in on the answer, holds, and pulls back
      await B(4, 16.57);
      camTo('c2', 900, EXPO);

      // 6. the camera pulls back; the follow-up is typed, sent and answered with a table
      await B(5, 19.63);
      camTo('c1', 570, 'cubic-bezier(.2,.8,.2,1)');
      await at(20.2);
      inp.classList.add('is-typing');
      await at(20.9);
      const t2 = typeAt(inp, 'Who handled them?', [[20.9, 1], [22.13, 17]]);
      await at(20.97); slot.dataset.s = 'send';
      await t2;
      await at(22.73); inp.textContent = '';
      await at(22.8);
      show(q('.b2'), 100, { from: 'translateY(4px)' }); show(q('.t2'), 80); slot.dataset.s = 'busy';
      await at(24.73);
      q('.t2').classList.add('hid'); slot.dataset.s = 'mic'; hide(q('.x1'), 100);
      await stream('.a2', [24.73, 24.87, 24.93, 25.13, 25.27, 25.33]);
      await at(25.53);
      c.scroll(q('.sh-tin'), 241, 270);
      // the table: card and header, then its rows in turn
      await at(25.6);
      const tbl = q('.sh-tbl'), rows = qa('.sh-tbl .sh-tr.r');
      rows.forEach(r => r.classList.add('hid'));
      show(tbl, 100, { ease: 'linear' });
      await at(25.63); show(rows[0], 80, { ease: 'linear' });
      await at(25.67); show(rows[1], 80, { ease: 'linear' });
      await at(25.73); show(rows[2], 130, { ease: 'linear' }); q('.x2').classList.remove('hid');

      // 7. spotlight: the screen dims and the table is lifted out onto a plate
      await B(6, 27.4);
      const dim = q('.sh-dim');
      show(dim, 270);
      const plate = c.add(spot, `<div class="sh-plate"><i class="bg hid"></i>${table('top:15px;height:198px', '')}</div>`, 'none');
      await at(27.47);
      // on a phone the plate leans right a little so its rim stays inside the portrait frame
      const lifted = mode() === 'n' ? 'translate(22px, -6.8px) scale(1.04)' : 'translateY(-6.8px) scale(1.06)';
      plate.style.transform = lifted;
      c.anim(plate, [{ transform: 'none' }, { transform: lifted }], { duration: 260, easing: OUT3 });
      await at(27.63); show(plate.querySelector('.bg'), 100, { ease: 'linear' });

      // 8. the spotlight lifts and the end card counts up the time it took
      await B(7, 30.2);
      plate.style.transform = '';
      c.anim(plate, [{ transform: lifted }, { transform: 'none' }], { duration: 230, easing: OUT3 });
      hide(plate.querySelector('.bg'), 230);
      // the dim lifts slowly, then the plain screen cuts back in
      await at(30.23); const lift = c.anim(dim, [{ opacity: 1 }, { opacity: .58 }], { duration: 290, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' });
      await at(30.53); lift.cancel(); dim.classList.add('hid'); plate.remove();
      await at(30.57);
      show(ec, 350);
      const num = q('.sh-num span'), lab = q('.sh-ec .sh-ey'), esub = q('.sh-esub');
      lab.classList.add('hid'); esub.classList.add('hid'); num.classList.add('hid');
      await at(30.93); show(num, 420, { from: 'scale(.96)', ease: OUT3 });
      const cnt = countAt(num, [[30.93, 1], [31.03, 4], [31.07, 7], [31.1, 9], [31.13, 11], [31.2, 13], [31.27, 16], [31.3, 17], [31.33, 19], [31.4, 20], [31.43, 22], [31.47, 23], [31.53, 24], [31.6, 25], [31.63, 26], [31.67, 27], [31.7, 28], [31.83, 29], [31.9, 30]], v => v + 's');
      await at(31.0); show(lab, 330, { ease: 'linear' });
      await at(31.27); show(esub, 400, { ease: 'linear' });
      await cnt;
      await at(31.97);
    },
  });
})();
