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
    nrWave: 'M15.5 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
    nrLink: 'M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1',
    nrDl: 'M12 4v12M7 11.5l5 5 5-5',
    nrRe: 'M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4',
  });
  const SPK = '<svg class="nr-spk" viewBox="0 0 24 24" aria-hidden="true"><path class="b" d="M4.5 9.4h4L12 7.35Q13.5 7.2 13.5 8.5Q15 13.05 13.5 17.6Q13.5 18.9 12 18.75L8.5 16.9h-4z"/><path class="w" d="M15 10.5a3.6 3.6 0 0 1 0 5M16 8.5a6 6 0 0 1 0 9"/></svg>';
  const TRI = '<svg class="tri" viewBox="0 0 10 12" aria-hidden="true"><path d="M1 1.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L1.9.7a.6.6 0 0 0-.9.5z"/></svg>';
  const HP = '<svg class="hp" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15.5v-3a7 8 0 0 1 14 0v3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><rect x="3.6" y="13.2" width="4.4" height="7" rx="1.8" fill="currentColor"/><rect x="16" y="13.2" width="4.4" height="7" rx="1.8" fill="currentColor"/></svg>';
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
  const TICK = [['4:12pm', 'Cancellation intent spiking (+240%)', 'r'], ['2:30pm', 'Team B handle time +40%', 'g'], ['11:20am', '"Distressed Client" monitor first trigger', 'r'],
    ['10:20am', 'Fraud storm – 18× in 2h', 'r'], ['9:15am', 'Diane crosses 90 on empathy', 'n'], ['8:30am', 'Wait times trending past SLA', 'r']];
  const ticks = () => TICK.map(([t, s, d]) => `<span class="ti"><em>${t}</em><i class="${d}"></i><b${s[0] === '"' ? ' class="q"' : ''}>${s}</b></span>`).join('');
  const SRC = [['Weekly Agent Performance Summary', '4 stories', 'All booking calls · Jul 25 – Aug 1'], ['Missed Upgrade Offers', '2 stories', 'Upgrade-eligible calls · Jul 25 – Aug 1'],
    ['Daily Alerts Report', '1 story', 'Booking calls · daily · Aug 1'], ['Most Requested Dates', '1 story', 'Booking demand · trailing 30 days']];
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

  // the count, one cell per digit (see the CSS)
  const digits = v => [...String(v)].map(d => `<i class="dg">${d}</i>`).join('');
  const words = (s, cls = '') => s.split(' ').map(w => `<span class="w ${cls}">${w}</span>`).join(' ');
  const acc = w => `<span class="w acc">${w}<i class="pr"></i></span>`;
  const eye = s => `<div class="se">${s}</div>`;
  const bars = (lab, h, hi, val, pitch) => `<div class="sbx" style="--pitch:${pitch}px">${lab.map((l, i) => `<div class="sb${i === hi ? ' hi' : ''}"><div class="sb-p"><i style="height:${h[i]}px">${i === hi ? `<b class="sv">${val}</b>` : ''}</i></div><span>${l}</span></div>`).join('')}</div>`;
  const hbars = rows => `<div class="hbx">${rows.map(([l, w, v, k]) => `<div class="hb ${k}"><span class="hl">${l}</span><div class="ht"><i style="width:${w}px"></i></div><b class="hv">${v}</b></div>`).join('')}</div>`;
  const sl = (k, inner, cls = '', bg = '') => `<div class="st-sl s${k} ${cls}" data-s="${k}"><div class="st-bg">${bg}</div><div class="st-c">${inner}</div><div class="st-fx"></div></div>`;

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
    <div class="nr-meta"><span>Aug 1 · covers Jul 25 – Aug 1</span><span>29 stories · <b>10 need attention</b></span></div>
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
      <p class="nr-rb">The day you never caught your breath, the topic that took over, and the agent who carried<br>the floor — 75 seconds, scored.</p>
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
    <div class="st-sl s0" data-s="0"><div class="st-c"><span class="gt-r">${HP}</span><div class="gt-l">Sound on · Your July recap</div></div></div>
    ${sl(1, `${eye('July 2026 · Your recap')}<div class="sh">${words('Chief, your month')}<br>${words('was')} ${acc('loud.')}</div><div class="ss">Let’s listen back.</div>`)}
    ${sl(2, `${eye('Every call, heard')}<div class="sn"><span class="snv">${digits(38214)}</span><i class="pr"></i></div><div class="ss">calls analyzed in July</div>`, '', '<div class="st-gl"></div>')}
    ${sl(3, `${eye('Peak day')}<div class="sh">${words('Tuesday, July 14.')}<br>${acc('2,120')} ${words('calls in one day.')}</div>${bars(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [79, 112, 91, 85, 96, 51, 40], 1, '2,120', 81)}`, 'grid')}
    ${sl(4, `${eye('Topic of the month')}<div class="sh">${words('Refunds &amp; payments')}<br>${words('owned July.')}</div>${bars(['Refunds', 'Booking', 'Tickets', 'Flights', 'Changes'], [115, 88, 61, 59, 49], 0, '4,890', 121.5)}`, 'grid')}
    ${sl(5, `<div class="sh big">One moment<br>stood ${acc('out.')}</div>`)}
    ${sl(6, `${eye('The achievement')}<div class="sh">${words('Escalations down 8%')}<br>${words('while volume rose 12%.', 'l2')}</div><div class="ss">That’s not luck. That’s coaching.</div>${hbars([['Call volume', 325, '+12%', 'n'], ['Escalations', 125, '-8%', 'a']])}`, 'dots')}
    ${sl(7, `<div class="sq">${words('“Honestly? I called to cancel.')}<br>${words('Twenty minutes later I upgraded.')}<br>${words('Thank whoever trained that agent.”')}</div><div class="ss sa">customer · retention call · Jul 22</div>`)}
    ${sl(8, `<div class="sh big mvp">And your ${acc('MVP')}<br>was...</div>`)}
    ${sl(9, `${eye('Agent of the month')}<div class="sh">Hannah Moore</div><div class="ss">Best QA score on the floor — three months running.</div>
      <div class="rg"><svg viewBox="0 0 178 178" aria-hidden="true"><circle cx="89" cy="89" r="82" class="tr"/><circle cx="89" cy="89" r="82" class="ar" pathLength="100"/></svg><div class="rg-t"><b>94%</b><span>top QA score</span></div></div>`, 'dots')}
    ${sl(10, `${eye('Customer sentiment')}<div class="sh">${words('Three months, straight up.')}</div><div class="ss">+3pts vs June · avg sentiment</div>
      <div class="lc"><svg viewBox="410 470 620 170" aria-hidden="true"><defs><linearGradient id="nr-sa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".19"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><clipPath id="nr-sc"><rect class="lc-cl" x="440" y="470" width="514" height="170"/></clipPath></defs>
        <path d="M453 517H953M453 554H953M453 591H953" class="gd"/>
        <path d="${smooth(SENT)}L952 625L453 625z" class="lc-ar" fill="url(#nr-sa)" clip-path="url(#nr-sc)"/>
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
  // the recording's paper colors, in its proportions: mostly light blue and lilac, no white
  const CF = ['#1677f8', '#8db6f4', '#8db6f4', '#d79be6', '#d79be6', '#ef5f55', '#f2c14e', '#5aa57f'];

  LX.scene('news-recap', {
    cls: 'sc-nr',
    html,
    cam0: [836, 450],
    hold: 1800,
    rest: 2,
    // when each beat starts and when the last one ends (s), for progress bars outside the window
    times: [0, 4.13, 22.12, 32.03, 43.72, 57.7, 73.28, 85.15, 96.47],
    beats: [
      'Play on the monthly recap card opens a full-screen story.',
      'A count-up shows 38,214 calls analyzed in July.',
      'The peak day is Tuesday, July 14, with 2,120 calls.',
      'A slide names the topic of the month.',
      'Escalations are down 8% while call volume is up 12%.',
      'A customer quote leads into the agent of the month.',
      'Sentiment rises over three months, and CSAT beats its target.',
      'A shareable summary card ends the story, then the Newsroom returns.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // a jump (fast-forward) re-bases the clock at the beat it lands on; in normal play the clock never drifts
      const B = async (i, t0) => { const ff = c.ff; await at(t0); await c.beat(i); if (ff) off = c.P.t - t0 * 1000; c.cam([836, 450]); };
      const now = () => (c.P.t - off) / 1000;
      // the recording's curves, measured frame by frame
      const EO2 = 'cubic-bezier(.5,1,.89,1)', EO3 = 'cubic-bezier(.33,1,.68,1)', EIO = 'cubic-bezier(.45,0,.55,1)';
      // an animation that starts at recording time t0 and holds its first frame until then (or joins partway when t0 has passed)
      const A = (el, kf, t0, d, o = {}) => c.anim(el, kf, { duration: d * 1000, delay: (t0 - now()) * 1000, fill: 'backwards', easing: EO2, ...o });
      const S = k => q(`.st-sl[data-s="${k}"]`);
      // the progress segments fill linearly; one that has not reached its end when the next slide starts snaps full then
      const segs = qa('.st-bar i');
      const seg = (i, t0, t1, a = 0, b = 1, fin = b) => { const e = segs[i]; e.style.transform = `scaleX(${fin})`; return A(e, [{ transform: `scaleX(${a})` }, { transform: `scaleX(${b})` }], t0, t1 - t0, { easing: 'linear' }); };
      // the recording's text entrance: each word fades up from 12 px in 0.6 s, in a left-to-right stagger
      const rise = (els, t0, step = .06, d = .6, y = 12) => [...els].forEach((e, i) => A(e, [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'none' }], t0 + i * step, d));
      const fade = (el, t0, d = .4) => A(el, [{ opacity: 0 }, { opacity: 1 }], t0, d, { easing: 'ease-out' });
      // the accent word: one crisp ring opens from the word and fades; the word swells about 1.16×, dips just under its
      // size and settles (K: the recording's measured [time, scale] keys)
      const pop = (w, t0, d, K) => {
        const k0 = K[0][0], D = K[K.length - 1][0] - k0;
        A(w, K.map(([t, s], i) => ({ transform: `scale(${s})`, offset: (t - k0) / D, easing: i ? EIO : EO2 })), k0, D, { easing: 'linear', fill: 'none' });
        const r = w.querySelector('.pr');
        if (r) A(r, [{ opacity: .9, transform: 'translate(-50%,-50%) scale(.22)', easing: 'ease-out' }, { opacity: .7, transform: 'translate(-50%,-50%) scale(.93)', offset: .75, easing: 'ease-out' }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1)' }], t0, d, { easing: 'linear', fill: 'none' });
      };
      // a bar that grows past its value and settles back (the highlighted bar of each chart)
      const spring = (el, prop, over, fin, t0, dUp, hold, dBack) => {
        const T = dUp + hold + dBack, k = [{ [prop]: '0px', easing: EO2 }, { [prop]: `${over}px`, offset: dUp / T }];
        if (hold) k.push({ [prop]: `${over}px`, offset: (dUp + hold) / T });
        k[k.length - 1].easing = EIO; k.push({ [prop]: `${fin}px` });
        el.style[prop] = `${fin}px`;
        return A(el, k, t0, T, { easing: 'linear' });
      };
      const early = async (i, t0, t1) => { await at(t0); return c.ff ? null : seg(i, t0, t1); };
      let cur = null, gone = null;
      // a slide change keeps the recording's moments, but the two slides' content is never on screen together (the
      // recording dissolves them through a blur; here one leaves before the other comes). The new background still
      // dissolves in from 0.18 s before the slide's own time t0, over 0.58 s, quicker through the middle than at the end,
      // so it changes under the old content and then under the new, never under both. The switch is at tm, the
      // recording's half-way point: the old content is gone just before it and the new content only starts showing at
      // it. bgIn() starts that background (the new content stays hidden); leave() fades the old content out by tm: the
      // small print and charts go first, the headline goes word by word, left to right (the quote line by line, with its
      // own step); go() switches the slide at t0 and lets its content in at tm
      let pre = null;
      const bgIn = async (k, t0) => {
        const tb = t0 - .184;
        await at(tb);
        if (c.ff || !cur) return;
        const nx = S(k);
        cur.querySelectorAll('.st-c, .st-fx').forEach(e => { e.style.zIndex = 2; });
        nx.querySelector('.st-c').style.opacity = 0;
        nx.classList.add('on');
        pre = { nx, bg: A(nx.querySelector('.st-bg'), [{ opacity: 0 }, { opacity: 1 }], tb, .576, { easing: 'cubic-bezier(.22, .48, .51, .65)' }) };
      };
      // the old slide's content fades from o0 and is fully out 10 ms before tm
      const outAll = (old, o0, tm, step = 0) => {
        const fx = [], out = (e, t, d) => fx.push(A(e, [{ opacity: 1 }, { opacity: 0 }], t, d, { easing: 'ease-in-out', fill: 'forwards' }));
        const D = tm - .01 - o0, dN = Math.min(D, step ? .22 : Math.max(.15, D - .3));
        old.querySelectorAll('.st-c, .st-fx').forEach(e => { e.style.zIndex = 2; });
        [...old.querySelector('.st-c').children].forEach(e => {
          // each headline word takes up to 0.3 s, 22 ms after the word before it, the run centred in the window (the quote
          // fills it); a short window shortens the words to 0.12 s, then tightens the step
          const ws = e.querySelectorAll('.w'), n = ws.length;
          if (n > 2) {
            let st = step || .022, dW = step ? D - st * (n - 1) : Math.min(D - st * (n - 1), .3);
            if (dW < .12) { dW = Math.min(.12, D); st = (D - dW) / (n - 1); }
            const s0 = o0 + (D - dW - st * (n - 1)) / 2;
            ws.forEach((w, i) => out(w, s0 + i * st, dW));
          } else if (e.matches('.sh, .sn')) out(e, o0, D);
          else out(e, o0, dN);
        });
        out(old.querySelector('.st-fx'), o0, dN);
        // a reset (a beat click or Replay before go()) cancels these fades, so the promise may reject with nobody waiting on it
        const done = Promise.all(fx.map(a => a.finished)); done.catch(() => {});
        gone = { old, done };
      };
      const leave = async (o0, tm, step = 0) => {
        await at(o0);
        // a jump skips it (and a held jump stops before the next beat with this slide whole); go() then clears it
        const old = cur;
        if (!old || c.ff) return;
        outAll(old, o0, tm, step);
      };
      // cd: how long the new content takes to fade in from tm (a headline without its own word entrance takes longer)
      const go = async (k, t0, hard = false, cd = .2, tm = t0) => {
        const nx = S(k);
        await at(t0);
        qa('.st-sl.on').forEach(s => { if (s !== cur && s !== nx && !(gone && s === gone.old)) s.classList.remove('on'); });
        const old = cur, p = pre && pre.nx === nx ? pre : null;
        pre = null; nx.querySelector('.st-c').style.opacity = '';
        nx.classList.add('on'); cur = nx;
        if (!old) return nx;
        if (hard) { old.classList.remove('on'); return nx; }
        // after a jump (or a held stop) nothing has left yet: the old content goes now, still ahead of tm
        if (!(gone && gone.old === old) && !c.ff) {
          if (now() < tm - .07) outAll(old, now(), tm);
          else old.querySelectorAll('.st-c, .st-fx').forEach(e => { e.style.opacity = 0; });
        }
        const left = gone && gone.old === old ? gone.done : Promise.resolve();
        gone = null;
        // (after a jump there was no bgIn(): the background then comes in from t0)
        const bg = p ? p.bg : A(nx.querySelector('.st-bg'), [{ opacity: 0 }, { opacity: 1 }], t0, .32, { easing: 'ease-in-out' });
        Promise.all([bg.finished, left]).then(() => { if (cur !== old) old.classList.remove('on'); }, () => {});
        A(nx.querySelector('.st-c'), [{ opacity: 0 }, { opacity: 1 }], tm, cd, { easing: cd > .2 ? 'ease-in-out' : 'ease-out' });
        return nx;
      };
      // confetti: crisp paper bits thrown up from a point at t0, fitted to the recording's spread frame by frame. The throw
      // dies quickly sideways and slowly upward while gravity pulls every bit down, so the burst blooms compactly, hangs
      // at the top and then falls out of the bottom of the frame. P: cone half-angle, speed range and bias, drags, gravity.
      // (the origin in recording pixels, scaled to the story's frame; the flight keeps the recording's pixels). Past the
      // middle of its flight each bit dims to half strength by the time it leaves, as the recording's bits do.
      const confetti = (host, t0, ox, oy, n, seed, P) => {
        if (c.ff) return;
        const W = host.offsetWidth, H = host.offsetHeight, r = rng(seed), K = 26, y0 = oy * H / 900;
        const pos = (vx, vy, t) => [vx * (1 - Math.exp(-P.kx * t)) / P.kx, vy * (1 - Math.exp(-P.ky * t)) / P.ky + P.g * t * t / 2];
        for (let i = 0; i < n; i++) {
          const e = document.createElement('i');
          const w = 6 + r() * 4, h = r() < .3 ? w : 9 + r() * 4;
          e.className = 'cf';
          e.style.cssText = `left:${(ox * W / 1440 - w / 2).toFixed(1)}px;top:${(y0 - h / 2).toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;background:${CF[Math.floor(r() * CF.length)]}`;
          host.append(e);
          const ang = -Math.PI / 2 + (r() * 2 - 1) * P.th, sp = P.s0 + (P.s1 - P.s0) * Math.pow(r(), P.pw);
          const vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp, rot = r() * 360, spin = (r() * 2 - 1) * 420;
          // each bit's flight ends when it has fallen out of the frame (a bit still inside at 3.2 s fades in its last 0.2 s)
          let tl = .1;
          while (tl < 3.2 && y0 + pos(vx, vy, tl)[1] < H + 14) tl += .02;
          const kf = [];
          for (let j = 0; j < K; j++) {
            const t = tl * j / (K - 1), [x, y] = pos(vx, vy, t);
            const u = t / tl, o = Math.min(u > .55 ? 1 - .5 * (u - .55) / .45 : 1, tl >= 3.2 && t > tl - .2 ? (tl - t) / .2 : 1);
            kf.push({ transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(rot + spin * t).toFixed(0)}deg)`, opacity: +o.toFixed(3) });
          }
          const a = A(e, kf, t0, tl, { easing: 'linear', fill: 'none' });
          a.finished.then(() => e.remove(), () => {});
        }
      };

      const tv = q('.nr-tt');
      // the ticker runs at 44.95 px/s for the whole take (its loop is the recording's 1,685 px); at t = 0 the 2:30pm item
      // sits 112 px into the strip
      let tick = null;
      const ticker = (t0 = 0) => {
        if (c.ff || tick) return;
        const V = 44.95, w = tv.offsetWidth / 2, x0 = tv.children[1].offsetLeft - 112 + V * t0;
        tick = c.anim(tv, [{ transform: 'translateX(0)' }, { transform: `translateX(${-w}px)` }], { duration: w / V * 1000, iterations: Infinity, iterationStart: ((x0 % w) + w) % w / w, easing: 'linear', fill: 'none' });
      };

      // 1. the Newsroom at rest, then Play opens the story on its sound gate
      await B(0, 0);
      c.cam([836, 450]);
      ticker();
      await at(2.35);
      app.classList.add('story');
      const gate = await go(0, 2.35, true);
      A(gate.querySelector('.st-c'), [{ opacity: 0 }, { opacity: 1 }], 2.35, .45);
      A(gate.querySelector('.st-c'), [{ transform: 'translateY(8px)' }, { transform: 'none' }], 2.35, .75);
      // the headphones ring breathes once (64 → 72 px) and the bar's first segment starts, then resets with slide one
      A(gate.querySelector('.gt-r'), [{ transform: 'scale(1)', easing: 'ease-in-out' }, { transform: 'scale(1.125)', offset: .45, easing: 'ease-in-out' }, { transform: 'scale(1)' }], 2.55, 1.55, { easing: 'linear', fill: 'none' });
      seg(0, 2.35, 4.13, 0, .59);

      // 2. "Chief, your month was loud." and the count-up to 38214
      await B(1, 4.13);
      const s1 = await go(1, 4.13, true);
      A(s1.querySelector('.st-bg'), [{ opacity: 0 }, { opacity: 1 }], 4.135, .42, { easing: 'ease-out' });
      seg(0, 4.1, 13.6);
      fade(s1.querySelector('.se'), 4.5, .42);
      rise(s1.querySelectorAll('.w'), 4.555, .07);
      fade(s1.querySelector('.ss'), 4.86, .45);
      pop(s1.querySelector('.acc'), 5.42, .48, [[5.515, 1], [5.54, 1.14], [5.58, 1.14], [5.61, 1.11], [5.64, .99], [5.68, .965], [5.74, 1]]);
      await at(14.0); seg(1, 14.0, 20.8);
      await bgIn(2, 14.35);
      await leave(14.22, 14.49);
      const s2 = await go(2, 14.35, false, .25, 14.49);
      const nv = s2.querySelector('.snv'), num = s2.querySelector('.sn');
      if (c.ff) nv.innerHTML = digits(38214);
      else {
        // the number counts at 1.14× and drops to its size as it lands; the slide's glow brightens once and fades
        A(num, [{ transform: 'scale(1.14)' }, { transform: 'scale(1.14)', offset: (16.3 - 14.35) / 2.07, easing: EIO }, { transform: 'scale(1)' }], 14.35, 2.07, { easing: 'linear', fill: 'none' });
        A(s2.querySelector('.st-gl'), [{ opacity: 0, easing: 'ease-out' }, { opacity: 1, offset: .14, easing: 'ease-out' }, { opacity: 0 }], 16.33, .65, { easing: 'linear', fill: 'none' });
        for (;;) {
          const u = Math.min(1, Math.max(0, (now() - 14.32) / 1.82));
          nv.innerHTML = digits(Math.round(38214 * (1 - Math.pow(1 - u, 2.9))));
          if (u >= 1 || now() >= 16.14) break;
          await c.wait(33);
        }
        nv.innerHTML = digits(38214);
      }

      // 3. the peak day and its weekday bars
      const e2 = await early(2, 21.9, 31.8);
      await bgIn(3, 22.12);
      await leave(21.99, 22.26);
      await B(2, 22.12);
      if (!e2) seg(2, 21.9, 31.8);
      const s3 = await go(3, 22.12, false, .2, 22.26);
      const growBars = (s, starts, hi, over, d = .47, hold = .13, back = .41, df = .47) => s.querySelectorAll('.sb i').forEach((b, i) => {
        const h = parseFloat(b.style.height);
        if (i === hi) spring(b, 'height', over, h, starts[i], d, hold, back);
        else A(b, [{ height: '0px' }, { height: `${h}px` }], starts[i], df, { easing: EO3 });
      });
      fade(s3.querySelector('.se'), 22.2, .4);
      rise(s3.querySelectorAll('.w'), 22.06, .048);
      pop(s3.querySelector('.acc'), 22.72, .48, [[22.855, 1], [22.917, 1.12], [22.95, 1.155], [22.983, 1.16], [23.017, 1.03], [23.05, .95], [23.083, .955], [23.117, .985], [23.15, 1]]);
      growBars(s3, [22.8, 22.87, 22.97, 23.05, 23.13, 23.25, 23.33], 1, 124, .47, .15, .25);
      fade(s3.querySelector('.sv'), 23.27, .3);

      // 4. the topic of the month
      const e3 = await early(3, 31.6, 42.4);
      await bgIn(4, 32.03);
      await leave(31.92, 32.2);
      await B(3, 32.03);
      if (!e3) seg(3, 31.6, 42.4);
      const s4 = await go(4, 32.03, false, .2, 32.2);
      fade(s4.querySelector('.se'), 32.1, .4);
      rise(s4.querySelectorAll('.w'), 31.88, .05);
      growBars(s4, [32.66, 32.742, 32.836, 32.93, 33.018], 0, 122, .4, .2, .13, .52);
      fade(s4.querySelector('.sv'), 33.05, .24);

      // 5. one moment stood out: escalations down while volume rose
      const e4 = await early(4, 43.5, 45.8);
      await bgIn(5, 43.72);
      await leave(43.59, 43.86);
      await B(4, 43.72);
      if (!e4) seg(4, 43.5, 45.8);
      const s5 = await go(5, 43.72, false, .25, 43.86);
      pop(s5.querySelector('.acc'), 44.1, .6, [[44.18, 1], [44.265, 1.17], [44.31, 1.175], [44.35, 1.01], [44.38, .978], [44.415, 1]]);
      await at(47.4); seg(5, 47.4, 56.4);
      await bgIn(6, 47.8);
      await leave(47.65, 47.92);
      const s6 = await go(6, 47.8, false, .2, 47.92);
      // a few grey sparks burst from the eyebrow: most stay close, a few fly further; they slow down, sink and fade one by one
      if (!c.ff) {
        const fx = s6.querySelector('.st-fx'), W = fx.offsetWidth, H = fx.offsetHeight, r = rng(5), k = W / 1440;
        for (let i = 0; i < 12; i++) {
          const e = document.createElement('i'), a = i / 12 * Math.PI * 2 + r() * .5, v = (70 + Math.pow(r(), 1.6) * 300) * k, z = 3 + Math.round(r() * 3), life = .7 + r() * .2;
          e.className = 'sp'; e.style.cssText = `left:${W / 2 - z / 2}px;top:${257 * H / 900 - z / 2}px;width:${z}px;height:${z}px`;
          fx.append(e);
          const kf = [];
          for (let j = 0; j <= 8; j++) {
            const t = life * j / 8, f = (1 - Math.exp(-2.6 * t)) / 2.6;
            kf.push({ transform: `translate(${(Math.cos(a) * v * f).toFixed(1)}px,${(Math.sin(a) * v * f * .85 + 150 * k * t * t / 2).toFixed(1)}px)`, opacity: j < 5 ? .95 : .95 * (8 - j) / 3.5 });
          }
          A(e, kf, 48.15, life, { easing: 'linear', fill: 'none' });
        }
      }
      fade(s6.querySelector('.se'), 47.75, .4);
      rise(s6.querySelectorAll('.w'), 47.73, .05);
      fade(s6.querySelector('.ss'), 47.85, .4);
      const hb = (s, t1, d1, t2, dUp, dBack, over) => {
        const [a, b] = s.querySelectorAll('.ht i');
        A(a, [{ width: '0px' }, { width: a.style.width }], t1, d1, { easing: 'cubic-bezier(.2,.7,.3,1)' });
        spring(b, 'width', over, parseFloat(b.style.width), t2, dUp, 0, dBack);
      };
      hb(s6, 48.42, .7, 48.58, .52, .45, 134);

      // 6. a customer's words, then the agent of the month
      const e5 = await early(6, 57.3, 63.2);
      await bgIn(7, 57.7);
      await leave(57.55, 57.85);
      await B(5, 57.7);
      if (!e5) seg(6, 57.3, 63.2);
      const s7 = await go(7, 57.7, false, .2, 57.85);
      rise(s7.querySelectorAll('.w'), 57.61, .055, .55, 8);
      if (!c.ff) [[677, 59.3], [899, 62.5]].forEach(([x, t]) => {
        const fx = s7.querySelector('.st-fx'), W = fx.offsetWidth, H = fx.offsetHeight, e = document.createElement('i');
        e.className = 'sr'; e.innerHTML = STAR; e.style.left = `${x * W / 1440 - 5}px`;
        fx.append(e);
        const d = 63.4 - t;
        A(e, [{ transform: 'translateY(0) rotate(0deg)' }, { transform: `translateY(${60 * d * H / 900}px) rotate(${d * 40}deg)` }], t, d, { easing: 'linear', fill: 'none' });
      });
      await at(63.1); seg(7, 63.1, 65.3);
      await bgIn(8, 63.33);
      await leave(63.31, 63.6, .028);
      const s8 = await go(8, 63.33, false, .25, 63.6);
      pop(s8.querySelector('.acc'), 63.72, .42, [[63.818, 1], [63.85, 1.147], [63.883, 1.157], [63.917, 1.157], [63.95, 1.037], [63.983, .961], [64.017, .952], [64.05, .978], [64.083, 1.008], [64.117, 1.012], [64.15, 1]]);
      await bgIn(9, 67.45);
      await at(67.25); seg(8, 67.25, 73.0, 0, .93, 1);
      await leave(67.32, 67.59);
      const s9 = await go(9, 67.45, false, .2, 67.59);
      // the ring starts empty; its arc sweeps to 94% as the confetti flies
      fade(s9.querySelector('.rg'), 67.665, .3);
      A(s9.querySelector('.ar'), [{ strokeDashoffset: 100, opacity: 0 }, { strokeDashoffset: 100, opacity: 1, offset: .001 }, { strokeDashoffset: 6, opacity: 1 }], 68.22, 1.08, { easing: 'ease-in-out' });
      fade(s9.querySelector('.rg-t'), 68.64, .3);
      rise([...s9.querySelectorAll('.se, .sh, .ss')], 67.37, .05, .55, 12);
      await at(67.95);
      confetti(s9.querySelector('.st-fx'), 67.999, 718, 380, 110, 167, { th: 1.254, s0: 264, s1: 887, pw: .672, kx: 1.337, ky: .194, g: 732 });

      // 7. sentiment, three months straight up, and CSAT against target
      const e6 = await early(9, 73.0, 79.0);
      await bgIn(10, 73.28);
      await leave(73.16, 73.43);
      await B(6, 73.28);
      if (!e6) seg(9, 73.0, 79.0);
      const s10 = await go(10, 73.28, false, .2, 73.43);
      fade(s10.querySelector('.se'), 73.4, .4);
      rise(s10.querySelectorAll('.w'), 73.29, .05);
      fade(s10.querySelector('.ss'), 73.4, .4);
      // the line draws with a slow start; the area under it fades in as a whole
      A(s10.querySelector('.ln'), [{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], 74.02, 1.24, { easing: 'cubic-bezier(.6,0,.35,1)' });
      A(s10.querySelector('.lc-ar'), [{ opacity: 0 }, { opacity: 1 }], 74.47, .55, { easing: 'cubic-bezier(.3,.5,.5,1)' });
      A(s10.querySelector('.dt'), [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], 75.17, .15, { easing: 'ease-out' });
      fade(s10.querySelector('.hl'), 75.17, .2);
      fade(s10.querySelector('.lc-v'), 75.2, .25);
      await bgIn(11, 79.27);
      await at(79.1); seg(10, 79.1, 84.85, 0, .95, 1);
      await leave(79.13, 79.41);
      const s11 = await go(11, 79.27, false, .2, 79.41);
      fade(s11.querySelector('.se'), 79.4, .4);
      rise(s11.querySelectorAll('.w'), 79.17, .05);
      hb(s11, 79.87, .77, 80.02, .61, .44, 283);

      // 8. "That was July.", the summary card, and back to the Newsroom
      const e7 = await early(11, 84.8, 90.2);
      await bgIn(12, 85.15);
      await leave(85.02, 85.3);
      await B(7, 85.15);
      if (!e7) seg(11, 84.8, 90.2);
      const s12 = await go(12, 85.15, false, .2, 85.3);
      fade(s12.querySelector('.se'), 85.05, .4);
      rise(s12.querySelectorAll('.w'), 85.0, .05);
      fade(s12.querySelector('.ss'), 85.13, .45);
      pop(s12.querySelector('.acc'), 85.78, .4, [[85.797, 1], [85.88, 1.18], [85.912, 1.18], [85.945, 1.02], [85.975, .96], [86.04, 1]]);
      // thrown from the eyebrow: it blooms to the top of the frame in 0.7 s, hangs, and falls out of the bottom by 88.0 s
      await at(85.6);
      confetti(s12.querySelector('.st-fx'), 85.662, 723, 397, 112, 86, { th: 1.325, s0: 438, s1: 1016, pw: 1.004, kx: 1.417, ky: .21, g: 827 });
      // the slide goes in three steps: the small print, then the headline, then the background
      await at(89.3);
      const gone12 = (el, t0, d, e) => el && A(el, [{ opacity: 1 }, { opacity: 0 }], t0, d, { easing: e, fill: 'forwards' });
      s12.querySelectorAll('.se, .ss').forEach(e => gone12(e, 89.318, .3, 'ease-out'));
      gone12(s12.querySelector('.sh'), 89.42, .27, EIO);
      gone12(s12.querySelector('.st-bg'), 89.49, .3, EIO);
      await at(89.8);
      s12.classList.remove('on'); cur = null;
      await at(92.19);
      app.classList.add('sum');
      A(q('.st-sum'), [{ opacity: 0, transform: 'translateY(9px)' }, { opacity: 1, transform: 'none' }], 92.19, .28, { easing: 'ease-out' });
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
