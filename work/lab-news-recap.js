// Newsroom monthly recap: the Newsroom at rest with its ticker, then the recap card's story plays full screen. Twelve
// slides walk through July (the call count, the peak day, the topic, escalations, a quote, the agent of the month,
// sentiment and CSAT), a summary card closes it, and the overlay cuts back to the Newsroom with "Watch again".
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    nrHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    nrGrid: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    nrCal: 'M5 5.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1zM4 10h16M8 3.5v4M16 3.5v4',
    nrHead: 'M4 17v-4a8 8 0 0 1 16 0v4M4 15.5h2.5a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM20 15.5h-2.5a1 1 0 0 0-1 1V19a1 1 0 0 0 1 1H19a1 1 0 0 0 1-1z',
    nrWave: 'M15.5 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
    nrLink: 'M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1',
    nrDl: 'M12 4v12M7 11.5l5 5 5-5',
    nrRe: 'M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4',
  });
  const SPK = '<svg class="nr-spk" viewBox="0 0 24 24" aria-hidden="true"><path class="b" d="M3.5 9.5h3.5L12 5v14l-5-4.5H3.5z"/><path class="w" d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  const TRI = '<svg class="tri" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L1.9.7a.6.6 0 0 0-.9.5z"/></svg>';
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
  const CLAP = '<svg class="clap" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 10.6l3.6-5.2a1.3 1.3 0 0 1 2.1 1.5l-1.6 2.4 4-5a1.3 1.3 0 0 1 2.1 1.6l-1.3 1.8a1.3 1.3 0 0 1 2.1 1.5l-1 1.5a1.3 1.3 0 0 1 2 1.6l-4 5.6a5.6 5.6 0 0 1-8.6.6 5.4 5.4 0 0 1-.6-6.9z" fill="#f4b740" stroke="#c98a1c" stroke-width="1.1" stroke-linejoin="round"/></svg>';

  // the sidebar: the stock Lab shell with this recording's brand card (Project / Org) and the Main and Intelligence groups
  const NAV = [['h', 'Main'], ['nrHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['nrGrid', 'Topics'], ['doc', 'Reports'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shield', 'Compliance'], ['news', 'News · Directions', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1]];
  const shell = () => LX.shell({ active: 'News', nav: NAV })
    .replace('<div class="sb-brand">', '<div class="sb-brand"><div class="nr-bt">')
    .replace('</small></span></div>', '</small></span></div><i class="nr-bl"></i><div class="nr-seg"><span class="on">Project</span><span>Org</span></div></div>')
    .replace(/<div class="sb-row"><span class="sb-ai">[\s\S]*?<\/div>/, '');

  // the "Just detected" ticker: [time, text, dot]
  const TICK = [['4:12pm', 'Cancellation intent spiking (+240%)', 'r'], ['2:30pm', 'Team B handle time +40%', 'g'], ['11:20am', '“Escalation risk” monitor first trigger', 'r'],
    ['10:20am', 'Fraud storm — 18× in 2h', 'r'], ['9:15am', 'Diane crosses 90 on empathy', 'n'], ['8:30am', 'Wait times trending past SLA', 'r']];
  const ticks = () => TICK.map(([t, s, d]) => `<span class="ti"><em>${t}</em><i class="${d}"></i><b>${s}</b></span>`).join('');
  const SRC = [['Weekly Agent Performance Summary', '4 stories', 'All booking calls · Jun 25 – Jul 2'], ['Missed Upgrade Offers', '2 stories', 'Upgrade-eligible calls · Jun 25 – Jul 2'],
    ['Daily Alerts Report', '1 story', 'Booking calls · daily · Jul 2'], ['Most Requested Dates', '1 story', 'Booking demand · trailing 30 days']];
  // the spike chart on the Newsroom: the recorded line, every 24 px
  const LINE = [[623, 692.5], [647, 690.5], [671, 689], [695, 687.5], [719, 687.5], [743, 689.5], [767, 694], [791, 697.5], [815, 697.5], [839, 692.5], [863, 684.5], [887, 675.5], [911, 668.5], [935, 667.5], [959, 669.5], [983, 669.5], [1007, 660.5], [1031, 634.5], [1055, 597], [1079, 560], [1103, 535.5], [1127, 536], [1151, 551], [1175, 570.5], [1199, 586.5], [1223, 594.5], [1247, 601.5], [1271, 605.5], [1295, 606.5], [1319, 602.5], [1343, 595], [1367, 585], [1391, 575]];
  // sentiment, three months, every 16 px (story slide 10)
  const SENT = [[453, 610], [469, 614], [485, 619], [501, 623], [517, 624], [533, 621], [549, 611.5], [565, 600], [581, 588.5], [597, 582], [613, 583], [629, 588], [645, 594], [661, 596.5], [677, 593], [693, 584], [709, 573], [725, 562], [741, 554], [757, 549.5], [773, 546], [789, 544], [805, 542], [821, 539], [837, 536], [853, 534], [869, 530], [885, 526], [901, 521], [917, 514.5], [933, 508], [948, 502], [952, 499]];
  // a smooth path through points (Catmull-Rom as cubic Béziers)
  const smooth = P => P.map((p, i) => {
    if (!i) return `M${p[0]} ${p[1]}`;
    const a = P[i - 2] || P[i - 1], b = P[i - 1], d = P[i + 1] || p;
    const c1 = [b[0] + (p[0] - a[0]) / 6, b[1] + (p[1] - a[1]) / 6], c2 = [p[0] - (d[0] - b[0]) / 6, p[1] - (d[1] - b[1]) / 6];
    return `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p[0]} ${p[1]}`;
  }).join('');

  const words = (s, cls = '') => s.split(' ').map(w => `<span class="w ${cls}">${w}</span>`).join(' ');
  const acc = w => `<span class="w acc">${w}<i class="pr"></i></span>`;
  const eye = s => `<div class="se">${s}</div>`;
  const bars = (lab, h, hi, val, pitch) => `<div class="sbx" style="--pitch:${pitch}px">${lab.map((l, i) => `<div class="sb${i === hi ? ' hi' : ''}"><div class="sb-p"><i style="height:${h[i]}px">${i === hi ? `<b class="sv">${val}</b>` : ''}</i></div><span>${l}</span></div>`).join('')}</div>`;
  const hbars = rows => `<div class="hbx">${rows.map(([l, w, v, k]) => `<div class="hb ${k}"><span class="hl">${l}</span><div class="ht"><i style="width:${w}px"></i></div><b class="hv">${v}</b></div>`).join('')}</div>`;
  const sl = (k, inner, cls = '') => `<div class="st-sl s${k} ${cls}" data-s="${k}"><div class="st-bg"></div><div class="st-c">${inner}</div><div class="st-fx"></div></div>`;

  const html = () => `<div class="nr">${shell()}
    <header class="nr-top">
      <span class="nr-bc"><b>News</b>${ic('right')}<span>Northwind</span>${ic('right')}<span class="nr-chip">feed · illustrative data</span></span>
      <span class="nr-ct" style="left:642px;width:140px">${ic('nrCal')}Last 7 days<i class="car"></i></span>
      <span class="nr-ct" style="left:790px;width:92px">Surface<i class="car"></i></span>
      <span class="nr-ct" style="left:890px;width:127px"><span class="g">Version ·</span><b>Full</b>${ic('down')}</span>
      <span class="nr-share">Share</span>
    </header>
    <div class="nr-eye">Conversation intelligence</div>
    <h3 class="nr-h">Newsroom</h3>
    <div class="nr-meta"><span>Jul 2 · covers Jun 25 – Jul 2</span><span>29 stories · <b>10 need attention</b></span></div>
    <i class="nr-rule"></i>
    <div class="nr-tick"><span class="nr-live"><i></i>Just detected</span><div class="nr-tv"><div class="nr-tt">${ticks()}${ticks()}</div></div></div>
    <aside class="nr-src">
      <div class="nr-sh">Sources</div>
      <div class="nr-all"><b>All developments</b><em>29</em></div>
      <div class="nr-sg">Distilled from reports</div>
      ${SRC.map(([t, n, s]) => `<div class="nr-si"><b>${t}</b><span><strong>${n}</strong> · ${s}</span></div>`).join('')}
      <div class="nr-sg">Detected live</div>
      <div class="nr-si"><b>Live detections</b><span><strong>21 developments</strong> · Not from a scheduled report</span></div>
    </aside>
    <aside class="nr-gl"><div class="nr-sh">At a glance</div><div class="nr-gr"><span>Calls handled</span><b>1,284</b><em>↑ 12%</em></div></aside>
    <section class="nr-recap">
      <div class="nr-re">Monthly recap · Story</div>
      <h4 class="nr-rh">38,214 calls. One story.</h4>
      <p class="nr-rb">The day you never caught your breath, the topic that took over, and the agent who carried<br>the floor — one minute, scored.</p>
      <div class="nr-rp"><span class="nr-play">${TRI}<span><span class="nr-lb">Play</span> · 75 sec</span></span><span class="nr-rd">1–31 July 2026</span></div>
    </section>
    <section class="nr-chart">
      <svg class="nr-cs" viewBox="603 505 812 225" aria-hidden="true"><defs><linearGradient id="nr-ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e9e9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
        <path d="${smooth(LINE)}L1391 729L623 729z" fill="url(#nr-ar)"/>
        <path d="M623 667.5H1395" class="dl"/><path d="M1106 540V690" class="dl"/>
        <path d="${smooth(LINE)}" class="ln"/><circle cx="1106" cy="536" r="3.6" class="pk"/>
        <text x="625" y="664">baseline</text><text x="633" y="711" text-anchor="middle">Mon</text><text x="913" y="711" text-anchor="middle">Wed</text><text x="1106" y="711" text-anchor="middle">Fri</text><text x="1386" y="711" text-anchor="middle">Sun</text></svg>
      <div class="nr-sy"><span class="nr-se"><i></i>Signals · Spike</span><span class="nr-sw">this week</span></div>
      <h4 class="nr-st">“Cancellation intent” is surging<br>past its 30-day baseline</h4>
      <p class="nr-sb">Churn-intent language is being extracted from a fast-growing share of calls — the signal's hit rate ran 240% above its 30-day average this week, concentrated Wednesday afternoon across Teams B and C.</p>
    </section>
  </div>
  <div class="st" aria-hidden="true">
    <div class="st-sl s0" data-s="0"><div class="st-c"><span class="gt-r">${ic('nrHead')}</span><div class="gt-l">Sound on · Your July recap</div></div></div>
    ${sl(1, `${eye('July 2026 · Your recap')}<div class="sh">${words('Chief, your month')}<br>${words('was')} ${acc('loud.')}</div><div class="ss">Let’s listen back.</div>`)}
    ${sl(2, `${eye('Every call, heard')}<div class="sn"><span class="snv">38214</span><i class="pr"></i></div><div class="ss">calls analyzed in July</div>`)}
    ${sl(3, `${eye('Peak day')}<div class="sh">${words('Tuesday, July 14.')}<br>${acc('2,120')} ${words('calls in one day.')}</div>${bars(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [79, 112, 91, 85, 96, 51, 40], 1, '2,120', 81)}`, 'grid')}
    ${sl(4, `${eye('Topic of the month')}<div class="sh">${words('Refunds &amp; payments')}<br>${words('owned July.')}</div>${bars(['Refunds', 'Booking', 'Tickets', 'Flights', 'Changes'], [112, 88, 61, 59, 49], 0, '4,890', 121.5)}`, 'grid')}
    ${sl(5, `<div class="sh big">One moment<br>stood ${acc('out.')}</div>`)}
    ${sl(6, `${eye('The achievement')}<div class="sh">${words('Escalations down 8%')}<br>${words('while volume rose 12%.', 'l2')}</div><div class="ss">That’s not luck. That’s coaching.</div>${hbars([['Call volume', 325, '+12%', 'n'], ['Escalations', 125, '-8%', 'a']])}`, 'dots')}
    ${sl(7, `<div class="sq">${words('“Honestly? I called to cancel.')}<br>${words('Twenty minutes later I upgraded.')}<br>${words('Thank whoever trained that agent.”')}</div><div class="ss sa">customer · retention call · Jul 22</div>`)}
    ${sl(8, `<div class="sh big mvp">And your ${acc('MVP')}<br>was...</div>`)}
    ${sl(9, `${eye('Agent of the month')}<div class="sh">Hannah Moore</div><div class="ss">Best QA score on the floor — three months running.</div>
      <div class="rg"><svg viewBox="0 0 178 178" aria-hidden="true"><circle cx="89" cy="89" r="82" class="tr"/><circle cx="89" cy="89" r="82" class="ar" pathLength="100"/></svg><div class="rg-t"><b>94%</b><span>top QA score</span></div></div>`, 'dots')}
    ${sl(10, `${eye('Customer sentiment')}<div class="sh">${words('Three months, straight up.')}</div><div class="ss">+3pts vs June · avg sentiment</div>
      <div class="lc"><svg viewBox="410 470 620 170" aria-hidden="true"><defs><linearGradient id="nr-sa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="nr-sc"><rect class="lc-cl" x="440" y="470" width="514" height="170"/></clipPath></defs>
        <path d="M453 517H953M453 554H953M453 591H953" class="gd"/>
        <path d="${smooth(SENT)}L952 625L453 625z" fill="url(#nr-sa)" clip-path="url(#nr-sc)"/>
        <path d="${smooth(SENT)}" class="ln" pathLength="100"/><circle cx="952" cy="499" r="10" class="hl"/><circle cx="952" cy="499" r="5" class="dt"/></svg><b class="lc-v">72%</b></div>`, 'grid')}
    ${sl(11, `${eye('vs target')}<div class="sh">${words('You beat your CSAT target')}<br>${words('by 6 points.')}</div>${hbars([['Target', 244, '66', 'n'], ['You', 266, '72', 'a']])}`, 'grid')}
    ${sl(12, `${eye('Hear · AI')}<div class="sh">${words('That was')} ${acc('July.')}</div><div class="ss">August is already talking. → Share your recap</div>`)}
    <div class="st-sum"><div class="sum-c">
      <div class="sum-e">Hear · July 2026</div><div class="sum-t">That was July.</div>
      <div class="sum-g">${[['38,214', 'Calls analyzed'], ['-8%', 'Escalations'], ['72%', 'Avg sentiment'], ['Hannah M. · 94%', 'Top agent']].map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
      <div class="sum-f">For Chief’s team · powered by Hear.ai</div></div>
      <div class="sum-p"><span class="clp">${CLAP}</span><span>${ic('nrLink')}Copy link</span><span>${ic('nrDl')}Download image</span><span>${ic('nrRe')}Replay</span><span class="pri">Open the full report →</span></div>
    </div>
    <div class="st-bar">${'<span><i></i></span>'.repeat(12)}</div>
    <span class="st-btn snd">${SPK}</span><span class="st-btn cls">${ic('x')}</span>
  </div>`;

  // a small seeded random source, so every loop throws the same confetti
  const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
  const CF = ['#1677f8', '#1677f8', '#8db6f4', '#d79be6', '#ef5f55', '#f2c14e', '#5aa57f', '#e9eef7'];

  LX.scene('news-recap', {
    cls: 'sc-nr',
    html,
    cam0: [836, 450],
    hold: 1800,
    rest: 2,
    // when each beat starts and when the last one ends (s), for progress bars outside the window
    times: [0, 4.13, 22.1, 32.05, 43.7, 57.65, 73.3, 85.15, 96.47],
    beats: [
      'Play on the monthly recap card opens a full-screen story.',
      'The story opens on July: 38,214 calls analyzed.',
      'The peak day: 2,120 calls on Tuesday, July 14.',
      'Refunds and payments was the topic that owned July.',
      'Escalations fell 8% while call volume rose 12%.',
      'A customer quote, then the agent of the month.',
      'Sentiment climbed three months and beat the CSAT target.',
      'A shareable summary card, then back to the Newsroom.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // a jump (fast-forward) re-bases the clock at the beat it lands on; in normal play the clock never drifts
      const B = async (i, t0) => { const ff = c.ff; await at(t0); await c.beat(i); if (ff) off = c.P.t - t0 * 1000; c.cam([836, 450]); };
      const now = () => (c.P.t - off) / 1000;
      // an animation that starts at recording time t0 and holds its first frame until then (or joins partway when t0 has passed)
      const A = (el, kf, t0, d, o = {}) => c.anim(el, kf, { duration: d * 1000, delay: (t0 - now()) * 1000, fill: 'backwards', easing: 'cubic-bezier(.22,1,.36,1)', ...o });
      const S = k => q(`.st-sl[data-s="${k}"]`);
      const segs = qa('.st-bar i');
      const seg = (i, t0, t1, a = 0, b = 1) => { const e = segs[i]; e.style.transform = `scaleX(${b})`; return A(e, [{ transform: `scaleX(${a})` }, { transform: `scaleX(${b})` }], t0, t1 - t0, { easing: 'linear' }); };
      const rise = (els, t0, step = .05, d = .5, y = 20) => els.forEach((e, i) => A(e, [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], t0 + i * step, d));
      const fade = (el, t0, d = .4) => A(el, [{ opacity: 0 }, { opacity: 1 }], t0, d, { easing: 'ease-out' });
      // the accent word: a quick scale and one crisp ring that opens and fades
      const pop = (w, t0, s = 1.12) => {
        A(w, [{ transform: 'scale(1)' }, { transform: `scale(${s})`, offset: .45 }, { transform: 'scale(1)' }], t0 + .2, .4, { easing: 'ease-in-out', fill: 'none' });
        const r = w.querySelector('.pr');
        if (r) A(r, [{ opacity: .9, transform: 'translate(-50%,-50%) scale(.16)' }, { opacity: .4, transform: 'translate(-50%,-50%) scale(.9)', offset: .55 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1)' }], t0, .6, { easing: 'cubic-bezier(.15,.7,.3,1)', fill: 'none' });
      };
      let cur = null;
      // a slide change: the old slide eases out, the backgrounds swap at the midpoint, the new one rises in
      const go = async (k, t0, hard = false) => {
        const nx = S(k);
        await at(t0);
        if (cur && !hard) {
          c.anim(cur.querySelector('.st-c'), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.98)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
          await at(t0 + .2);
        }
        if (cur) cur.classList.remove('on');
        nx.classList.add('on'); cur = nx;
        if (!hard) A(nx.querySelector('.st-c'), [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], now(), .3, { easing: 'ease-out' });
        return nx;
      };
      // confetti: crisp paper bits thrown from a point; air drag slows them and they flutter down at a steady speed
      // (the origin in recording pixels, scaled to the story's frame; the flight keeps the recording's pixels, so the
      // phone's smaller frame shows the recording's density instead of the whole burst squeezed into it)
      const confetti = (host, ox, oy, n, seed, d = 2.3, pw = 1) => {
        if (c.ff) return;
        const W = host.offsetWidth, H = host.offsetHeight, r = rng(seed);
        const k = 2.4, K = 12;
        for (let i = 0; i < n; i++) {
          const e = document.createElement('i');
          const w = 6 + r() * 4, h = r() < .3 ? w : 9 + r() * 4;
          e.className = 'cf';
          e.style.cssText = `left:${(ox * W / 1440 - w / 2).toFixed(1)}px;top:${(oy * H / 900 - h / 2).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;background:${CF[Math.floor(r() * CF.length)]}`;
          host.append(e);
          const ang = -Math.PI / 2 + (r() * 2 - 1) * 1.3, sp = (500 + r() * 1100) * pw, vt = 280 + r() * 380;
          const vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp, rot = r() * 360, spin = (r() * 2 - 1) * 600, tl = d * (.8 + r() * .2);
          const kf = [];
          for (let j = 0; j < K; j++) {
            const t = tl * j / (K - 1), f = (1 - Math.exp(-k * t)) / k;
            const x = vx * f, y = vt * t + (vy - vt) * f;
            kf.push({ transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(rot + spin * f * 2).toFixed(0)}deg)`, opacity: j < K - 4 ? 1 : (K - 1 - j) / 4 });
          }
          const a = c.anim(e, kf, { duration: tl * 1000, easing: 'linear', fill: 'none' });
          a.finished.then(() => e.remove(), () => {});
        }
      };

      const tv = q('.nr-tt');
      // the ticker runs at 44.5 px/s for the whole take; at t = 0 the 2:30pm item sits 117 px into the strip
      let tick = null;
      const ticker = (t0 = 0) => {
        if (c.ff || tick) return;
        const w = tv.offsetWidth / 2, x0 = tv.children[1].offsetLeft - 117 + 44.5 * t0;
        tick = c.anim(tv, [{ transform: 'translateX(0)' }, { transform: `translateX(${-w}px)` }], { duration: w / 44.5 * 1000, iterations: Infinity, iterationStart: ((x0 % w) + w) % w / w, easing: 'linear', fill: 'none' });
      };

      // 1. the Newsroom at rest, then Play opens the story on its sound gate
      await B(0, 0);
      c.cam([836, 450]);
      ticker();
      await at(2.37);
      app.classList.add('story');
      const gate = await go(0, 2.37, true);
      fade(gate.querySelector('.st-c'), 2.37, .46);
      A(gate.querySelector('.gt-r'), [{ transform: 'scale(1)' }, { transform: 'scale(1.125)' }, { transform: 'scale(1)' }], 2.6, 1.5, { easing: 'ease-in-out', fill: 'none' });
      seg(0, 2.37, 4.13, 0, .59);

      // 2. "Chief, your month was loud." and the count-up to 38214
      await B(1, 4.13);
      const s1 = await go(1, 4.13, true);
      seg(0, 4.13, 13.6);
      fade(s1.querySelector('.se'), 4.5, .4);
      rise(s1.querySelectorAll('.w'), 4.55, .07);
      fade(s1.querySelector('.ss'), 4.85, .5);
      pop(s1.querySelector('.acc'), 5.35);
      await at(14.0); seg(1, 14.0, 20.8);
      const s2 = await go(2, 14.33);
      const nv = s2.querySelector('.snv'), num = s2.querySelector('.sn');
      if (c.ff) nv.textContent = '38214';
      else {
        A(num, [{ transform: 'scale(1.14)' }, { transform: 'scale(1.14)', offset: .9 }, { transform: 'scale(1)' }], now(), 16.4 - now(), { easing: 'ease-out', fill: 'none' });
        for (;;) {
          const u = Math.min(1, Math.max(0, (now() - 14.35) / 1.9));
          nv.textContent = Math.round(38214 * (1 - Math.pow(1 - u, 3.5)));
          if (u >= 1 || now() >= 16.17) break;
          await c.wait(33);
        }
        nv.textContent = '38214';
        A(s2.querySelector('.pr'), [{ opacity: .55, transform: 'translate(-50%,-50%) scale(.82)' }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1.05)' }], 16.4, .5, { easing: 'ease-out', fill: 'none' });
      }

      // 3. the peak day and its weekday bars
      await B(2, 22.1);
      seg(2, 21.9, 31.8);
      const s3 = await go(3, 22.1);
      const growBars = (s, starts, hi, over) => s.querySelectorAll('.sb i').forEach((b, i) => {
        const h = parseFloat(b.style.height);
        if (i === hi) A(b, [{ height: '0px' }, { height: `${over}px`, offset: .62 }, { height: `${h - 2}px`, offset: .85 }, { height: `${h}px` }], starts[i], .97, { easing: 'cubic-bezier(.3,.7,.4,1)' });
        else A(b, [{ height: '0px' }, { height: `${h}px` }], starts[i], .45, { easing: 'ease-out' });
      });
      rise(s3.querySelectorAll('.w'), 22.17, .045);
      pop(s3.querySelector('.acc'), 22.8, 1.1);
      growBars(s3, [22.8, 22.87, 22.97, 23.05, 23.13, 23.25, 23.32], 1, 122);
      fade(s3.querySelector('.sv'), 23.27, .3);

      // 4. the topic of the month
      await B(3, 32.05);
      seg(3, 31.6, 42.4);
      const s4 = await go(4, 32.05);
      rise(s4.querySelectorAll('.w'), 32.1, .07);
      growBars(s4, [32.67, 32.75, 32.83, 32.91, 32.99], 0, 122);
      fade(s4.querySelector('.sv'), 33.2, .3);

      // 5. one moment stood out: escalations down while volume rose
      await B(4, 43.7);
      seg(4, 43.5, 45.8);
      const s5 = await go(5, 43.7);
      pop(s5.querySelector('.acc'), 44.2, 1.1);
      await at(47.4); seg(5, 47.4, 56.4);
      const s6 = await go(6, 47.7);
      if (!c.ff) {
        const fx = s6.querySelector('.st-fx'), W = fx.offsetWidth, H = fx.offsetHeight;
        for (let i = 0; i < 10; i++) {
          const e = document.createElement('i'), a = i / 10 * Math.PI * 2 + .3, r = (60 + (i % 3) * 10) * W / 1440;
          e.className = 'sp'; e.style.cssText = `left:${W / 2 - 2}px;top:${255 * H / 900 - 2}px`;
          fx.append(e);
          A(e, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translate(${(Math.cos(a) * r).toFixed(1)}px,${(Math.sin(a) * r).toFixed(1)}px)` }], 48.2, .55, { easing: 'ease-out', fill: 'both' });
        }
      }
      fade(s6.querySelector('.se'), 47.9, .4);
      rise(s6.querySelectorAll('.w'), 47.95, .045);
      fade(s6.querySelector('.ss'), 48.0, .4);
      const hb = (s, t1, t2, over) => {
        const [a, b] = s.querySelectorAll('.ht i'), [va, vb] = s.querySelectorAll('.hv');
        A(a, [{ width: '0px' }, { width: a.style.width }], t1, .77, { easing: 'cubic-bezier(.2,.7,.3,1)' });
        A(b, [{ width: '0px' }, { width: `${over}px`, offset: .6 }, { width: b.style.width }], t2, .9, { easing: 'cubic-bezier(.3,.7,.4,1)' });
        fade(va, t1, .3); fade(vb, t2, .3);
      };
      hb(s6, 48.43, 48.57, 134);

      // 6. a customer's words, then the agent of the month
      await B(5, 57.65);
      seg(6, 57.3, 63.2);
      const s7 = await go(7, 57.65);
      rise(s7.querySelectorAll('.w'), 57.85, .035, .45, 8);
      fade(s7.querySelector('.sa'), 58.35, .4);
      if (!c.ff) [[677, 59.3], [899, 62.5]].forEach(([x, t]) => {
        const fx = s7.querySelector('.st-fx'), W = fx.offsetWidth, H = fx.offsetHeight, e = document.createElement('i');
        e.className = 'sr'; e.innerHTML = STAR; e.style.left = `${x * W / 1440 - 5}px`;
        fx.append(e);
        const d = 63.4 - t;
        A(e, [{ transform: 'translateY(0) rotate(0deg)' }, { transform: `translateY(${60 * d * H / 900}px) rotate(${d * 40}deg)` }], t, d, { easing: 'linear', fill: 'none' });
      });
      await at(63.1); seg(7, 63.1, 65.4);
      const s8 = await go(8, 63.35);
      pop(s8.querySelector('.acc'), 63.85, 1.1);
      await at(67.1); seg(8, 67.1, 73.0);
      const s9 = await go(9, 67.45);
      rise([...s9.querySelectorAll('.se, .sh, .ss')], 67.5, .08, .5, 14);
      await at(68.1);
      confetti(s9.querySelector('.st-fx'), 720, 320, 110, 7, 2.3);
      A(s9.querySelector('.ar'), [{ strokeDashoffset: 100 }, { strokeDashoffset: 6 }], 68.2, 1, { easing: 'ease-in-out' });
      fade(s9.querySelector('.rg-t'), 68.6, .3);

      // 7. sentiment, three months straight up, and CSAT against target
      await B(6, 73.3);
      seg(9, 73.0, 79.0);
      const s10 = await go(10, 73.3);
      fade(s10.querySelector('.se'), 73.4, .4);
      rise(s10.querySelectorAll('.w'), 73.45, .06);
      fade(s10.querySelector('.ss'), 73.6, .4);
      A(s10.querySelector('.ln'), [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], 74.03, 1.07, { easing: 'ease-in-out' });
      A(s10.querySelector('.lc-cl'), [{ transform: 'scaleX(0)' }, { transform: 'none' }], 74.03, 1.07, { easing: 'ease-in-out' });
      A(s10.querySelector('.dt'), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], 75.17, .15, { easing: 'ease-out' });
      fade(s10.querySelector('.hl'), 75.17, .2);
      fade(s10.querySelector('.lc-v'), 75.2, .25);
      await at(78.9); seg(10, 78.9, 84.9);
      const s11 = await go(11, 79.3);
      fade(s11.querySelector('.se'), 79.4, .4);
      rise(s11.querySelectorAll('.w'), 79.4, .05);
      hb(s11, 79.9, 80.03, 285);

      // 8. "That was July.", the summary card, and back to the Newsroom
      await B(7, 85.15);
      seg(11, 84.8, 90.2);
      const s12 = await go(12, 85.15);
      fade(s12.querySelector('.se'), 85.2, .4);
      rise(s12.querySelectorAll('.w'), 85.25, .06);
      fade(s12.querySelector('.ss'), 85.5, .4);
      pop(s12.querySelector('.acc'), 85.75, 1.1);
      await at(85.65);
      confetti(s12.querySelector('.st-fx'), 750, 300, 90, 11, 2.4, .72);
      await at(89.45);
      c.anim(s12, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
      await at(89.75);
      s12.classList.remove('on'); cur = null;
      await at(92.2);
      app.classList.add('sum');
      A(q('.st-sum'), [{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], 92.2, .25, { easing: 'ease-out' });
      await at(95.23);
      app.classList.remove('story', 'sum');
      ticker(95.23);
      q('.nr-play .nr-lb').textContent = 'Watch again';
      q('.nr-play').classList.add('fo');
      q('.nr-recap').classList.add('seen');
      await at(96.47);
    },
  });
})();
