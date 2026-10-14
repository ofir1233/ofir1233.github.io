// Agent evaluation: the cursor sweeps the average-score bars (each hover shows the day, the score and the calls behind
// it), drags across the coral dip to zoom to seven days, then opens Ask AI from the sidebar, types why the score
// dropped and gets a general answer. The chat closes and the zoomed bars are hovered again.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    aeBug: 'M9 7.5V6.5a3 3 0 0 1 6 0v1M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6zM12 20v-9M6.5 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M21 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4M8 2l1.9 1.9M16 2l-1.9 1.9',
    aeUser: 'M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM12 13a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM6.6 19.4a6 6 0 0 1 10.8 0',
    aeLine: 'M3.5 3.5v15a2 2 0 0 0 2 2h15M19 9l-5 5-4-4-3 3',
    aeCal: 'M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6A1.5 1.5 0 0 1 5 4.5zM8 2.5v4M16 2.5v4M3.5 9.5h17M7.5 13h.01M10.5 13h.01M13.5 13h.01M16.5 13h.01M7.5 16.5h.01M10.5 16.5h.01M13.5 16.5h.01M16.5 16.5h.01',
    aeInfo: 'M12 21.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zM12 16.5v-5M12 8h.01',
    aeUp: 'M6 15l6-6 6 6',
    aeHist: 'M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4h4M12 8v4.3l2.8 1.8',
    aeEdit: 'M11 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5M17.3 3.7a2 2 0 0 1 2.9 2.9L12.5 14.3l-3.8 1 1-3.8z',
    aeExp: 'M14.5 4.5h5v5M19.5 4.5l-6 6M9.5 19.5h-5v-5M4.5 19.5l6-6',
    aeSlash: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM14.2 7.5l-4.4 9',
    aeMic: 'M12 3.5a2.6 2.6 0 0 1 2.6 2.6v5.6a2.6 2.6 0 0 1-5.2 0V6.1A2.6 2.6 0 0 1 12 3.5zM6.5 11.3a5.5 5.5 0 0 0 11 0M12 16.8v3.7M9 20.5h6',
    aeSend: 'M12 19V5.5M6.5 11L12 5.5l5.5 5.5',
    aeTup: 'M7.5 10.5v9.5h-3v-9.5zM7.5 10.5l3.6-6.6a1.9 1.9 0 0 1 3.4 1.5l-.8 3.6h5.2a2 2 0 0 1 2 2.4l-1.4 6.6a2 2 0 0 1-2 1.5H7.5',
    aeTdn: 'M7.5 13.5V4h-3v9.5zM7.5 13.5l3.6 6.6a1.9 1.9 0 0 0 3.4-1.5l-.8-3.6h5.2a2 2 0 0 0 2-2.4l-1.4-6.6a2 2 0 0 0-2-1.5H7.5',
    aeRe: 'M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4',
    aeCopy: 'M10 9h8.5A1.5 1.5 0 0 1 20 10.5V19a1.5 1.5 0 0 1-1.5 1.5H10A1.5 1.5 0 0 1 8.5 19v-8.5A1.5 1.5 0 0 1 10 9zM15.5 9V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3',
    aeKebab: 'M12 5.5h.01M12 12h.01M12 18.5h.01',
    aeArrow: 'M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5',
  });
  // the Lab's AI glyph: one large four-point star with two small ones above it
  const SPARK = '<svg class="ae-sp" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 8l1.9 5.1 5.1 1.9-5.1 1.9L11 22l-1.9-5.1L4 15l5.1-1.9zM5.5 2.5l.75 2 2 .75-2 .75-.75 2-.75-2-2-.75 2-.75zM18 3l.7 1.8 1.8.7-1.8.7L18 8l-.7-1.8-1.8-.7 1.8-.7z"/></svg>';

  // ---------- demo data: 30 daily scores, Sun Sep 13 to Mon Oct 12 ----------
  const SC = [76, 76, 75, 75, 74, 74, 76, 74, 74, 75, 74, 75, 75, 74, 75, 76, 77, 66, 68, 67, 67, 77, 77, 77, 77, 81, 80, 81, 76, 75];
  const TOP = [306, 306, 307, 308, 310, 310, 306, 311, 311, 309, 309, 308, 307, 309, 308, 306, 302, 329, 324, 328, 326, 303, 303, 302, 304, 294, 296, 294, 305, 307];
  const CL = ['d1d1d1', 'd1d1d1', 'd2d2d2', 'd5d5d5', 'd8cfce', 'd6d0ce', 'cfd1d0', 'd8cfcf', 'd9cdcc', 'd6d4d0', 'd6d0ce', 'd6d4d5', 'd6d6d6', 'd6d0d2', 'd5d5d5', 'd0d0d0', 'c3c5c5', 'edad9e', 'e9b3a8', 'ecafa3', 'e8b2a7', 'c6c8c9', 'c5c7c7', 'c3c5c5', 'c6c8c8', 'a7adb0', 'adb3b6', 'a5aeb0', 'cbcbcb', 'd5d5d5'];
  // calls depend only on the weekday (Sun..Sat); Sep 13 is a Sunday
  const CALLS = ['1,618', '3,177', '3,236', '3,118', '3,060', '2,883', '1,324'];
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dm = k => (k < 18 ? `Sep ${13 + k}` : `Oct ${k - 17}`);
  // the plot: value 0 at y 483, 100 at y 248; 30 bars from x 424, or the 7 zoomed days (Sep 28 to Oct 4)
  const PX = 424, PY = 483, PW = 888;
  const B30 = k => [29.65 * k, 26];
  const Z7 = [[424, 547], [551, 674], [678, 802], [806, 930], [934, 1058], [1062, 1185], [1189, 1312]];
  const B7 = j => [Z7[j][0] - PX, Z7[j][1] - Z7[j][0]];
  const BANDS = [['90–100', 27, '#424f52', '#4f5b57', 32], ['80–89', 193, '#8b979b', '#8e9897', 240], ['70–79', 349, '#d6d6d6', '#d5d5d2', 436], ['60–69', 138, '#eca798', '#eea697', 171], ['<60', 8, '#f8705a', '#fa6d59', 8]];
  const FOOT = (r, n) => `${r} · ${n} days · Time unit: Day · Scroll to zoom · drag to select · double-click to reset`;
  const ASK = 'Why did the score drop between Sep 30 and Oct 3?';

  // ---------- markup ----------
  const bars = (set, ks, geo) => `<div class="bars ${set}">${ks.map((k, j) => { const [x, w] = geo(j); return `<i class="bar" data-k="${k}" style="left:${x.toFixed(2)}px;width:${w}px;height:${PY - TOP[k]}px;background:#${CL[k]}"></i>`; }).join('')}</div>`;
  const vals = (set, ks, geo) => `<div class="vl ${set}">${ks.map((k, j) => { const [x, w] = geo(j); return `<span data-k="${k}" style="left:${(x + w / 2).toFixed(2)}px">${SC[k]}</span>`; }).join('')}</div>`;
  const K30 = [...Array(30).keys()], K7 = [15, 16, 17, 18, 19, 20, 21];
  const chart = () => `<section class="card ch">
      <h3 class="ct">Average score over time</h3><p class="cs">Height and color = that period’s score · hover for calls</p>
      <span class="rz">Reset zoom</span><span class="tog"><span class="on">Bars</span><span>Trend</span></span>
      <span class="lp">Poor 55</span><i class="grad"></i><span class="lp g">95 Good</span><span class="foot">${FOOT('Sep 13 – Oct 12', 30)}</span>
    </section>
    <div class="plot">
      ${[100, 80, 60, 40, 20, 0].map(v => `<i class="gl" style="top:${(235 - v * 2.35).toFixed(1)}px"></i><span class="yl" style="top:${(235 - v * 2.35).toFixed(1)}px">${v}</span>`).join('')}
      <span class="rl">Score</span>
      <i class="selr"></i>
      ${bars('b30', K30, k => B30(k))}${bars('b7', K7, B7)}
      ${vals('b30', K30, k => B30(k))}${vals('b7', K7, B7)}
      <div class="dl b30">${[0, 5, 10, 15, 20, 25].map(k => `<span style="left:${B30(k)[0].toFixed(2)}px">${dm(k)}</span>`).join('')}</div>
      <div class="dl b7 c">${K7.map((k, j) => { const [x, w] = B7(j); return `<span style="left:${(x + w / 2).toFixed(1)}px">${dm(k)}</span>`; }).join('')}</div>
    </div>
    <div class="tip"><b class="td"></b><span class="tv"><b></b><i>⁄</i>100</span><span class="tc"></span></div>`;
  const page = () => `<header class="card hd">
      <span class="pill-ae">Agent Evaluation</span>${ic('right', 'chev')}<span class="pill-tot">Total Agents<em>715</em></span>
      <span class="btn dbg" style="left:490px;width:123px">${ic('aeBug')}Debug Query</span>
      <span class="btn" style="left:629px;width:88px">Hide Filters</span>
      <span class="btn" style="left:732px;width:174px">${ic('aeUser')}Show by agent name</span>
      <span class="seg"><span>V2</span><span>V3</span><span>V4</span><span class="on">V4 + Filter</span></span>
      <span class="evl">${ic('aeLine')}<span class="ev-l">Evaluation:</span><b>Service Quality</b>${ic('down')}</span>
    </header>
    <span class="fbtn last">Last 30 days${ic('aeCal')}</span><span class="fbtn add">${ic('plus')}Filter</span>
    <span class="fchip"><b>Agent status</b>&nbsp;: Active<i>${ic('x')}</i></span><span class="fclr">Clear all</span><span class="upto">Up to 90 days</span>
    ${chart()}
    <section class="card ca">
      <h3 class="ct">Category Averages</h3>${ic('aeUp', 'col')}
      <div class="inner">
        <div class="l1"><span class="l1s"><b>Agents by average score</b>${ic('aeInfo')}<span class="mu">· 715 agents · 8 criteria</span></span><span class="l1e">Average <b>76⁄100</b> · 8 agents below 60</span></div>
        <div class="dist">${BANDS.map(b => `<i style="width:${b[4]}px;background:${b[2]}"></i>`).join('')}</div>
        <div class="dleg">${BANDS.map((b, j) => `<span style="left:${[0, 135, 272, 408, 543][j]}px"><i style="background:${b[3]}"></i>${b[0]}<b>${b[1]} agents</b></span>`).join('')}</div>
      </div>
    </section>
    <section class="card tm"><h3 class="ct">Team Performance</h3><span class="srch">${ic('search')}Search by team name...</span><i class="tbl"></i></section>`;
  const modal = () => `<div class="ae-dim"></div><div class="ae-mo">
    <div class="mo-h"><span class="mo-tile">${SPARK}</span><h4>Ask AI</h4><span class="mo-sub">New conversation</span>
      <span class="mo-ic">${ic('aeHist')}${ic('aeEdit')}${ic('aeExp', 'ex')}${ic('x')}</span></div>
    <div class="mo-chips"><span>Agent Evaluation${ic('x')}</span><span>Project · Northwind</span></div>
    <div class="mo-empty"><span class="em-tile">${SPARK}</span><h5>Ask about what you’re looking at</h5>
      <p>I see which page you’re on and keep this conversation as you move around the <br>platform.</p>
      ${['Which agents improved the most?', 'Who needs coaching this week?', 'Compare the top and bottom teams'].map((s, i) => `<span class="sug" style="top:${384 + 43 * i}px">${s}</span>`).join('')}</div>
    <div class="mo-q">${ASK}</div>
    <div class="mo-think"><i class="ae-globe"><i></i></i>Thinking...</div>
    <div class="mo-a">
      <p>The drop is usually driven by a rise in compliance breaches, longer average handle times, or a dip in customer <br>sentiment during that period. Check the call-by-call compliance flags and the AHT trend for those dates to <br>pinpoint the cause.</p>
      <div class="mo-act">${ic('aeTup')}${ic('aeTdn')}${ic('aeRe')}${ic('aeCopy')}${ic('aeKebab')}</div>
      <h6>Related</h6>
      <ol>${['Call volume trends', 'Compliance violations', 'Average handle time'].map(r => `<li>${r}${ic('aeArrow')}</li>`).join('')}</ol>
    </div>
    <div class="mo-cm"><span class="ph">Ask anything about this page...</span><span class="tx"></span><span class="mo-ics">${ic('at')}${ic('aeSlash')}</span>${ic('aeMic', 'mic')}<span class="send">${ic('aeSend')}</span><span class="busy"><i></i><i></i><i></i></span></div>
  </div>`;
  const html = () => `${LX.shell({ active: 'Agent Evaluation', scroll: 19 })}${page()}${modal()}`;

  // states the page's reduced-motion frame and the loop share
  const tipFor = (q, k, zoom) => {
    const tip = q('.tip');
    tip.querySelector('.td').textContent = `${WD[k % 7]}, ${dm(k)}`;
    tip.querySelector('.tv b').textContent = SC[k];
    tip.querySelector('.tc').textContent = `Based on ${CALLS[k % 7]} calls`;
    const [x, w] = zoom ? B7(K7.indexOf(k)) : B30(k);
    tip.style.left = Math.max(PX, Math.min(PX + PW - 172, PX + x + w / 2 - 86)).toFixed(1) + 'px';
  };

  LX.scene('agent-eval', {
    cls: 'sc-ae',
    html,
    cursor: [136, 404],
    cam0: [568, 458], // phones open on the whole chart card, under the filters, its right edge between two bars
    hold: 400,
    rest: 6,
    times: [0, 2.52, 7.04, 8.76, 11.96, 14.12, 18.0, 26.54, 30.48],
    beats: [
      'Agent evaluation opens on its average score over time.',
      'Hovering a bar shows its day, score and calls.',
      'A drag across the coral dip zooms to seven days.',
      'The zoomed bars keep the same hover detail.',
      'Ask AI opens from the sidebar with page context.',
      'The question about the dip is typed and sent.',
      'A general answer lists likely causes and where to check.',
      'The chat closes on the zoomed chart.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock, less its 0.52 s lead-in: at(t) waits until t seconds into the take
      const T0 = 0.52;
      let off = 0;
      const at = t => c.wait(Math.max(0, (t - T0) * 1000 + off - c.P.t));
      // c.beat() takes one frame, so a beat is entered one frame early; the offset is taken again only after a jump
      const B = async (i, t0) => { await at(t0 - 0.016); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - (t0 - T0) * 1000; };
      // the cursor along a recorded path: [t, x, y] points, straight between them
      const path = pts => {
        const P = c.P, [t0] = pts[0], [t1, x, y] = pts[pts.length - 1];
        const kf = [{ transform: `translate(${P.cx}px,${P.cy}px)`, offset: 0 }, ...pts.slice(1).map(([t, px, py]) => ({ transform: `translate(${px}px,${py}px)`, offset: (t - t0) / (t1 - t0) }))];
        P.cx = x; P.cy = y; P.place(); P.follow(x, y);
        if (c.ff) return Promise.resolve();
        P.anim(P.cursor, kf, { duration: (t1 - t0) * 1000, easing: 'linear' });
        return at(t1);
      };
      // hover bar k (or none with -1): the tooltip jumps, the other bars fade back
      let zoom = false, hk = -1;
      const hov = k => {
        if (k === hk) return;
        const was = hk >= 0;
        hk = k;
        qa('.bar.on, .vl span.on').forEach(e => e.classList.remove('on'));
        app.classList.toggle('hov', k >= 0);
        app.classList.toggle('set', was && k >= 0);
        if (k < 0) return;
        const set = zoom ? '.b7' : '.b30';
        q(`${set} .bar[data-k="${k}"]`).classList.add('on'); q(`.vl${set} [data-k="${k}"]`).classList.add('on');
        tipFor(q, k, zoom);
      };
      const seq = async list => { for (const [t, k] of list) { await at(t); hov(k); } };
      const ai = q('.sb-ai');

      // 1. the 30-day chart, just opened
      await B(0, T0);

      // 2. sweep the bars: each hover shows the day, the score and the calls it rests on
      await B(1, 3.04);
      // phones: the camera follows the tooltip along the sweep, a pan for each stretch of bars
      const cams = async list => { for (const [t, x, y] of list) { await at(t); c.cam([x, y]); } };
      path([[3.04, 136, 404], [3.11, 206, 391], [3.18, 266, 380], [3.26, 337, 366], [3.33, 408, 352], [3.40, 468, 340], [3.88, 468, 340], [4.24, 684, 332], [4.72, 684, 332], [5.08, 898, 358], [5.56, 898, 358], [5.84, 1008, 324], [6.36, 1008, 324], [6.76, 1196, 306], [7.12, 1196, 306], [7.56, 934, 404]]);
      cams([[3.04, 560, 360], [4.72, 950, 360], [6.36, 1150, 360], [7.12, 960, 360]]);
      await seq([[3.40, 1], [3.96, 3], [4.00, 4], [4.08, 5], [4.12, 6], [4.20, 7], [4.24, 8], [4.76, 9], [4.80, 10], [4.84, 11], [4.92, 12], [4.96, 14], [5.04, 15], [5.08, 16],
        [5.64, 17], [5.76, 18], [5.84, 19], [6.40, 20], [6.44, 21], [6.52, 22], [6.60, 23], [6.64, 24], [6.72, 25], [6.76, 26], [7.16, 25], [7.24, 23], [7.28, 22], [7.36, 20], [7.44, 19], [7.48, 18], [7.52, 17]]);

      // 3. drag across the dip (Sep 29 to Oct 3): the chart zooms to Sep 28 to Oct 4
      await B(2, 7.56);
      const dot = c.P.cursor.firstElementChild, sel = q('.selr');
      // the selection snaps to whole bars; the bar under the dot stays lit, the tooltip is hidden
      app.classList.add('drag'); q('.tip').classList.add('off');
      if (!c.ff) c.anim(dot, [{ transform: 'scale(1)' }, { transform: 'scale(.58)' }], { duration: 60, easing: 'ease-out', fill: 'forwards' });
      sel.style.width = '62px';
      path([[7.56, 934, 404], [7.92, 1044, 404]]);
      for (const [t, w, k] of [[7.68, 92, 18], [7.80, 121, 19], [7.88, 0, 20], [7.92, 151, 20]]) { await at(t); if (w) sel.style.width = w + 'px'; hov(k); }
      await at(7.94);
      dot.getAnimations().forEach(a => a.cancel());
      await at(7.96);
      zoom = true; hk = -1;
      app.classList.remove('drag'); app.classList.add('zoom', 'dim'); q('.tip').classList.remove('off');
      app.classList.remove('hov', 'set');
      qa('.bar.on, .vl span.on').forEach(e => e.classList.remove('on'));
      q('.foot').textContent = FOOT('Sep 28 – Oct 4', 7);
      await at(8.0); app.classList.remove('dim');

      // 4. hover in the zoomed view
      await B(3, 9.28);
      path([[9.28, 1044, 404], [9.60, 746, 378], [10.36, 746, 378], [10.70, 972, 386], [11.44, 972, 386], [11.72, 1088, 386]]);
      cams([[9.28, 760, 360], [10.36, 990, 360]]);
      await seq([[9.32, 19], [9.44, 18], [9.60, 17], [10.48, 18], [10.68, 19], [11.72, 20]]);

      // 5. Ask AI from the sidebar: the modal opens with the page and the project as context
      await B(4, 12.48);
      path([[12.48, 1088, 386], [12.52, 1052, 378], [12.60, 838, 334], [12.68, 624, 288], [12.76, 400, 240], [12.84, 162, 188], [12.92, 89, 174]]);
      await seq([[12.56, 19], [12.60, 18], [12.64, 17], [12.68, 16], [12.76, 15], [12.80, -1]]);
      await at(12.90); c.hover(ai);
      await at(12.94); await c.click(ai, { after: 0 });
      app.classList.add('asked');
      c.cam([240, 300]); // phones: the Ask AI sheet, in the top-left corner the click left the camera in
      c.anim(q('.ae-dim'), [{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      c.anim(q('.ae-mo'), [{ opacity: 0, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 250, easing: 'ease-out' });
      const tx = q('.mo-cm .tx');
      tx.classList.add('is-typing');

      // 6. the question is typed, then sent
      await B(5, 14.64);
      c.cam([240, 300]); // phones: the camera stays on the sheet while the question is typed in its composer
      await at(14.68);
      const ph = q('.mo-cm .ph'), cm = q('.mo-cm');
      cm.classList.add('has');
      c.anim(ph, [{ opacity: 1 }, { opacity: 0 }], { duration: 1500, easing: 'linear', fill: 'forwards' });
      c.anim(q('.send'), [{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'linear' });
      for (let i = 1; i <= ASK.length; i++) { await at(14.68 + (i - 1) * (17.0 - 14.68) / (ASK.length - 1)); tx.textContent = ASK.slice(0, i); }
      await at(17.46);
      // the composer stays empty after the send: only the caret, no placeholder (a class, so jumps and reduced motion match)
      tx.textContent = ''; cm.classList.remove('has'); cm.classList.add('wait', 'used');
      ph.getAnimations().forEach(a => a.cancel());
      app.classList.add('sent');
      c.cam([240, 300]); // phones: the sent question and Thinking, on the same sheet
      c.anim(q('.mo-q'), [{ opacity: 0, transform: 'translateY(9px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' });
      c.anim(q('.mo-think'), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 160, delay: 60, easing: 'ease-out', fill: 'backwards' });
      const glb = q('.ae-globe i'), dots = qa('.busy i');
      c.anim(glb, [{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }], { duration: 1100, easing: 'linear' });
      dots.forEach((d, i) => c.anim(d, [{ opacity: .45, transform: 'translateY(0)' }, { opacity: 1, transform: 'translateY(-2px)', offset: .3 }, { opacity: .45, transform: 'translateY(0)', offset: .6 }, { opacity: .45, transform: 'translateY(0)' }], { duration: 600, delay: i * 120, iterations: 2, easing: 'ease-in-out' }));

      // 7. the answer: likely causes and where to check, with related topics
      await B(6, 18.52);
      c.cam([240, 300]); // phones: the answer, the related list and the composer, all on the sheet
      app.classList.add('done'); cm.classList.remove('wait');
      c.anim(q('.mo-a'), [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 200, easing: 'ease-out' });
      qa('.mo-a li').forEach((li, i) => c.anim(li, [{ opacity: 0, transform: 'translate(3px,1px)' }, { opacity: 1, transform: 'none' }], { duration: 120, delay: 80 + i * 40, easing: 'ease-out', fill: 'backwards' }));
      c.anim(q('.mo-cm .mic'), [{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: 80, easing: 'linear', fill: 'backwards' });
      await at(18.72);
      q('.mo-sub').textContent = ASK; app.classList.add('named');

      // 8. the chat closes; focus is back on Ask AI, and the zoomed bars are hovered again
      await B(7, 27.06);
      c.anim(q('.ae-dim'), [{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
      const out = c.anim(q('.ae-mo'), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(16px) scale(.985)' }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
      await out.finished.catch(() => {});
      app.classList.remove('asked'); ai.classList.add('fv');
      c.cam([595, 455]); // phones: the zoomed chart from its title to the Sep 30 bar, so the last hovers and their tooltips need no pan
      await at(29.76);
      path([[29.76, 89, 174], [29.82, 110, 182], [29.90, 226, 242], [29.98, 341, 304], [30.06, 456, 360], [30.14, 572, 420], [30.20, 630, 450]]);
      await at(29.84); c.hover(ai, false);
      await seq([[30.04, 15], [30.12, 16]]);
      await at(30.80);
      path([[30.80, 630, 450], [30.88, 687, 453], [30.96, 756, 458], [31.0, 760, 458]]);
      await seq([[30.88, 17]]);
      await at(31.0);
    },
  });
})();
