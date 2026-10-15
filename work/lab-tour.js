// Design Lab tour: the Chat home loads and a camera frames it, a title card makes one claim, a question is typed and
// answered with a count and topic bars, the camera moves in on the answer and back, then hard cuts to Topics (the flow
// view), Compliance (the trend lines rise in turn) and the Actions board, with a short end card before the board returns.
(() => {
  if (!window.LX) return;
  const { ic, av, prio } = LX;
  LX.addIcons({
    trHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    trTopics: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    trMini: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
    trRadar: 'M19.4 7.5A9 9 0 1 0 21 12M16 9.5A4.5 4.5 0 1 0 16.5 12M12 12l7.5-7.5',
    trPen: 'M11.5 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5.5M17.8 3.7a1.8 1.8 0 0 1 2.5 2.5l-8 8-3.3.8.8-3.3z',
    trSlash: 'M6.5 3.5h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3zM14 8l-4 8',
    trMic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21M9 21h6',
    trUp: 'M12 20V4.5M5 11.5l7-7 7 7',
    trUpv: 'M7 10v11M14.5 5.9L13.5 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h2.8a2 2 0 0 0 1.8-1.1L11.5 3a2.9 2.9 0 0 1 3 2.9z',
    trDnv: 'M17 14V3M9.5 18.1l1-4.1H4.7a2 2 0 0 1-1.9-2.6l2.3-7A2 2 0 0 1 7 3h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2.8a2 2 0 0 0-1.8 1.1L12.5 21a2.9 2.9 0 0 1-3-2.9z',
    trRegen: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 4v4.5H8',
    trCopy: 'M10 9h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 21h-9a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 10 9zM15.5 9V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5',
    trVdots: 'M12 5h.01M12 12h.01M12 19h.01',
    trArrow: 'M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5',
    trInfo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16.5v-5M12 8h.01',
    trDdown: 'M7 6.5l5 5 5-5M7 12.5l5 5 5-5',
    trStar: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4',
  });
  // the Hear mark: a sound wave drawn as an H
  const MARK = 'M43.7 0C44.9-.2 46.6-.2 47.7.3 48.8.8 49.8 1.7 50.3 2.7 50.8 3.7 51 4.4 51 6.5 51 8.6 50.3 13.1 50.3 15.2 50.3 17.3 49.9 18 50.8 19.2 51.7 20.4 54.7 21.4 55.7 22.2 56.7 23 56.8 23.2 56.8 23.8 56.8 24.4 57.2 24.6 56 25.5 54.8 26.4 52.5 25.3 49.7 29 46.9 32.7 41.4 44.3 39.2 47.8 37 51.3 37.6 49.5 36.7 50 35.8 50.5 34.7 50.7 33.7 50.7 32.7 50.8 31.4 50.7 30.5 50.3 29.6 49.9 28.9 49.8 28.3 48.2 27.8 46.6 27.3 43.4 27.2 40.7 27.1 38 27.7 34.2 27.5 32.2 27.3 30.2 26.9 29.3 26.2 28.5 25.5 27.7 24.4 27.2 23.3 27.3 22.2 27.4 20.6 28.2 19.7 28.8 18.8 29.4 18.8 29.2 17.7 31 16.6 32.8 14.1 37.9 12.8 39.5 11.5 41.1 11 40.7 10 40.7 9 40.7 7.5 40.2 6.7 39.5 5.9 38.8 5.5 38.2 5.3 36.3 5.1 34.4 5.8 29.9 5.5 28.2 5.2 26.5 4 26.5 3.3 26 2.6 25.5 1.8 25.6 1.2 25.2.7 24.8-.1 24.1 0 23.7.1 23.3.5 23 1.5 22.7 2.5 22.4 5.1 22.3 6.2 21.8 7.3 21.3 7.3 21 8 19.7 8.7 18.4 9.5 15.4 10.2 14 10.9 12.6 11.4 11.8 12 11.2 12.6 10.6 12.7 10.5 13.5 10.2 14.3 9.9 16.2 9.5 17 9.5 17.8 9.5 17.9 9.9 18.3 10.3 18.7 10.8 18.7 10.6 19.3 12.2 19.9 13.8 20.9 18.4 21.7 20 22.5 21.6 23.5 21.3 24.3 21.5 25.1 21.7 25.5 21.9 26.7 21 27.9 20.1 30.2 18.1 31.5 16 32.8 13.9 33.8 10.2 34.7 8.3 35.6 6.4 36 5.9 37 4.7 38 3.5 39.4 2.1 40.5 1.3 41.6.5 42.5.2 43.7 0z';
  const mark = (inner = '') => `<svg class="tr-mk" viewBox="0 0 57 51" aria-hidden="true">${inner}<path d="${MARK}"/></svg>`;
  // the dotted ring around the focused mark
  const ring = () => `<svg viewBox="0 0 57 57" aria-hidden="true">${Array.from({ length: 28 }, (_, i) => {
    const a = i / 28 * Math.PI * 2, o = [.9, .45, .7, .3, .8, .5, .35][i % 7];
    return `<circle cx="${(28.5 + 27.2 * Math.cos(a)).toFixed(2)}" cy="${(28.5 + 27.2 * Math.sin(a)).toFixed(2)}" r="1" opacity="${o}"/>`;
  }).join('')}</svg>`;

  // ---------- the sidebar: the Northwind workspace; the pages after Chat show the longer Operations group ----------
  const NAV = [['h', 'Main'], ['trHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['trTopics', 'Topics'], ['report', 'Reports'], ['trMini', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge'], ['spark', 'Magic API'],
    ['h', 'Operations'], ['trRadar', 'AI Tasks'], ['users', 'Customers'], ['bolt', 'Actions'], ['bag', 'Marketplace']];
  const shell = () => LX.shell({ active: 'Chat', nav: NAV })
    .replace('<span class="sb-tile">H</span>', '<span class="sb-tile">N</span>')
    .replace('<b>Hear</b><small>', '<b>Northwind</b><small>')
    .replace(/<svg class="hmark "[\s\S]*?<\/svg>Hear/, `${mark()}Hear`)
    .replace(/<i class="av me"[^>]*>U<\/i><b>You<\/b>/, '<i class="av me" style="--c:#e0473f">OF</i><b>Ofir</b>')
    .replace('<div class="sb-user">', `<div class="tr-hist"><div class="tr-hh">${ic('down')}History${ic('trPen')}</div><div class="tr-hi">Welcome to Hear</div></div><div class="sb-user">`);

  // ---------- Chat ----------
  const CHIPS = [['What drove escalations this week?', 241], ['Which agents need coaching?', 212], ['Any compliance gaps?', 168]];
  const BARS = [['Delivery delays', 16, 1], ['Billing', 4, 75 / 298], ['Product setup', 3, 57 / 298]];
  const chat = () => `<header class="tr-top"><b>Dashboard</b></header>
    <div class="tr-logo">${mark(`<defs><linearGradient id="tr-g" x1="1" y1="0" x2=".15" y2="1"><stop offset="0" stop-color="#74c0f4"/><stop offset=".55" stop-color="#4f9fe8"/><stop offset="1" stop-color="#3b88df"/></linearGradient></defs>`).replace('</svg>', `<path class="b" d="${MARK}"/></svg>`)}</div>
    <div class="tr-ring hid">${ring()}</div>
    <div class="tr-greet"><span>Good</span> <span>evening,</span> <span>Ofir.</span></div>
    <div class="tr-sub">What would you like to explore for Northwind?</div>
    <div class="tr-pill"><i></i><span>Analyzing yesterday’s calls...</span></div>
    <div class="tr-sug hid"><h6>AI suggestions</h6><div class="tr-chips">${CHIPS.map(([t, w]) => `<span style="width:${w}px">${t}</span>`).join('')}</div></div>
    <div class="tr-bub hid">What drove escalations this week?</div>
    <div class="tr-think hid"><i class="tr-sph"></i>Thinking...</div>
    <p class="tr-ans">${['Escalations hit', ' <b>23 this week</b>, and', ' one topic', ' drives most', ' of them:'].map(p => `<span class="hid">${p}</span>`).join('')}</p>
    <div class="tr-card tr-kpi hid">
      <div class="tr-kl k1">Escalations this week</div>
      <div class="tr-kn n1">23</div><span class="tr-delta hid">+34%</span><i class="tr-ul hid"></i>
      <div class="tr-kl k2 hid">Driven by delivery</div>
      <div class="tr-kn n2 hid">70%</div>
    </div>
    <div class="tr-card tr-tcard hid">
      <div class="tr-ov">Escalations by topic</div>
      <div class="tr-bars">${BARS.map(([l, v, f]) => `<div>${l}<i><s style="width:${(f * 100).toFixed(2)}%"></s></i><b>${v}</b></div>`).join('')}</div>
    </div>
    <div class="tr-acts hid">${['trUpv', 'trDnv', 'trRegen', 'trCopy', 'trVdots'].map(n => ic(n)).join('')}</div>
    <div class="tr-rel hid"><h6>Related</h6><div>Who handled them?${ic('trArrow')}</div><div>Show the calls${ic('trArrow')}</div></div>
    <div class="tr-comp hid"><div class="tr-in ph"></div><div class="tr-tools">${ic('at')}${ic('trSlash')}</div>
      <div class="tr-slot" data-s="mic"><span class="mic">${ic('trMic')}</span><span class="send">${ic('trUp')}</span><span class="busy"><b></b><b></b><b></b></span></div></div>`;

  // ---------- Topics: the flow view ----------
  const GRN = '#4a9e77', ORG = '#e6ab40', RED = '#ff6d57';
  const ZC = [GRN, ORG, RED];
  // topic nodes: name, sub-line, y0, y1, color, share of the node into Good / Medium / Poor silence, label box [x, y, w, h], inline sub-line
  const TOP = [
    ['E-ticket Delivery', '2,451 · 11%', 218.75, 280.28, GRN, [.92, .08, 0], [311, 233.77, 118, 31.5]],
    ['Complaints &amp; Follow-up', '702 · 3.2%', 284.03, 301.66, GRN, [.85, .15, 0], [311, 285.34, 207, 15], 1],
    ['Schedule Changes', '1,329 · 6.0%', 305.41, 338.77, GRN, [.92, .08, 0], [311, 306.59, 129.5, 31]],
    ['Trip Status', '3,968 · 18%', 343.77, 443.39, ORG, [0, 0, 1], [311, 378.08, 94, 31]],
    ['Seating &amp; Extras', '1,061 · 4.8%', 448.39, 475.02, ORG, [.9, .1, 0], [311, 453.71, 176, 16], 1],
    ['Itinerary Questions', '2,377 · 11%', 481.27, 540.95, ORG, [.68, .32, 0], [311, 495.11, 133, 32]],
    ['Online Booking', '4,412 · 20%', 547.2, 657.96, ORG, [.75, .25, 0], [311, 586.08, 112, 33]],
    ['Refunds &amp; Credits', '1,583 · 7.1%', 664.21, 703.95, ORG, [.42, .58, 0], [311, 668.58, 128, 31]],
    ['Accessibility Requests', '873 · 3.9%', 710.2, 732.12, ORG, [1, 0, 0], [311, 712.91, 202, 16.5], 1],
    [null, null, 737.12, 747.12, RED, [.65, .35, 0]],
    ['Changes &amp; Cancellations', '2,206 · 10%', 752.12, 807.5, RED, [.82, .18, 0], [311, 764.81, 165, 30]],
  ];
  // zone columns: bar x, three nodes [y0, y1], labels [name, sub, box]
  const ZONES = [
    [664, [[227.5, 571.41], [586.41, 686.79], [703.04, 800]], [['Good · &lt;5%', '14,074 · 64%', [572.5, 382.95, 87.5, 33]], ['Medium · 5%–10%', '4,108 · 19%', [536, 620.6, 124, 32]], ['Poor · &gt;10%', '3,968 · 18%', [574, 736.52, 86, 30]]]],
    [1029, [[227.5, 404.25], [420.5, 671.63], [687.88, 800]], [['Good · &lt;3.0′', '7,250 · 33%', [935, 300.87, 90, 30]], ['Medium · 3.0′–6.0′', '10,301 · 47%', [904, 530.06, 121, 32]], ['Poor · &gt;6.0′', '4,599 · 21%', [942.5, 727.44, 82.5, 33]]]],
    [1396, [[226.25, 433.62], [447.37, 629.96], [647.46, 800]], [['Good · &gt;4.3', '8,467 · 38%', [1304, 314.94, 88.5, 30]], ['Medium · 3.8–4.3', '7,455 · 34%', [1275, 522.67, 117.5, 32]], ['Poor · &lt;3.8', '6,228 · 28%', [1310, 708.73, 82.5, 30]]]],
  ];
  // flows between zone columns, in calls: [from zone][to zone]
  const S2H = [[2480, 7690, 3904], [802, 2611, 695], [3968, 0, 0]];
  const H2S = [[4105, 2210, 935], [3060, 3655, 3586], [1302, 1590, 1707]];
  const TX = 297.5, BW = 6;
  const ribbon = (x0, a0, b0, x1, a1, b1) => {
    const m = (x0 + x1) / 2, f = n => n.toFixed(2);
    return `M${f(x0)} ${f(a0)}C${f(m)} ${f(a0)} ${f(m)} ${f(a1)} ${f(x1)} ${f(a1)}L${f(x1)} ${f(b1)}C${f(m)} ${f(b1)} ${f(m)} ${f(b0)} ${f(x0)} ${f(b0)}Z`;
  };
  // a link drawn as strands with hairline gaps: from [a0, b0] at x0 to [a1, b1] at x1, split by weights
  const strands = (x0, a0, b0, x1, a1, b1, w, col) => {
    const tot = w.reduce((s, v) => s + v, 0);
    let p = 0, out = '';
    for (const v of w) {
      if (!v) continue;
      const q0 = p / tot, q1 = (p + v) / tot; p += v;
      const g = .09;
      const ya0 = a0 + (b0 - a0) * q0 + g, yb0 = a0 + (b0 - a0) * q1 - g, ya1 = a1 + (b1 - a1) * q0 + g, yb1 = a1 + (b1 - a1) * q1 - g;
      if (yb0 - ya0 < .2 && yb1 - ya1 < .2) continue;
      out += `<path d="${ribbon(x0, ya0, Math.max(ya0 + .2, yb0), x1, ya1, Math.max(ya1 + .2, yb1))}" fill="${col}"/>`;
    }
    return out;
  };
  const sankey = () => {
    let links = '';
    // topics to silence: outgoing stacked Good, Medium, Poor at the topic; incoming stacked in topic order at the zone
    const sil = ZONES[0], inc = [0, 1, 2].map(z => TOP.reduce((s, t) => s + (t[3] - t[2]) * t[5][z], 0));
    const at = [0, 1, 2].map(z => sil[1][z][0]);
    const comp = [[], [], []];
    TOP.forEach(t => {
      let y = t[2];
      t[5].forEach((fr, z) => {
        if (!fr) return;
        const th = (t[3] - t[2]) * fr, tt = th * (sil[1][z][1] - sil[1][z][0]) / inc[z];
        links += strands(TX + BW, y, y + th, sil[0], at[z], at[z] + tt, [1], ZC[z]);
        comp[z].push(th);
        y += th; at[z] += tt;
      });
    });
    // zone to zone: each band keeps faint strands for the topics inside it
    const step = (from, to, flows, mix) => {
      const tin = [0, 1, 2].map(z => flows.reduce((s, r) => s + r[z], 0));
      const tat = [0, 1, 2].map(z => to[1][z][0]);
      flows.forEach((r, a) => {
        const [s0, s1] = from[1][a], tot = r.reduce((s, v) => s + v, 0);
        let y = s0;
        r.forEach((v, z) => {
          if (!v) return;
          const th = (s1 - s0) * v / tot, tt = (to[1][z][1] - to[1][z][0]) * v / tin[z];
          links += strands(from[0] + BW, y, y + th, to[0], tat[z], tat[z] + tt, mix[a], ZC[z]);
          y += th; tat[z] += tt;
        });
      });
    };
    step(ZONES[0], ZONES[1], S2H, comp);
    step(ZONES[1], ZONES[2], H2S, [[5, 3, 4, 2, 6, 3], [4, 6, 3, 5, 2, 4, 3], [3, 5, 4, 2]]);
    const bars = TOP.map(t => `<rect x="${TX}" y="${t[2]}" width="${BW}" height="${(t[3] - t[2]).toFixed(2)}" rx="1" fill="${t[4]}"/>`).join('')
      + ZONES.map(([x, ns]) => ns.map(([a, b], z) => `<rect x="${x}" y="${a}" width="${BW}" height="${(b - a).toFixed(2)}" rx="1" fill="${ZC[z]}"/>`).join('')).join('');
    return `<svg class="tp-sk" viewBox="0 0 1440 900" aria-hidden="true"><g class="lk">${links}</g>${bars}</svg>`;
  };
  const STAR = c => `<svg class="tp-st" viewBox="0 0 24 24" aria-hidden="true" style="color:${c}"><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18"/></svg>`;
  const topics = () => `<section class="tr-pg tr-tp">
    <header class="tp-hd"><b>Topics</b>${ic('right', 'chev')}<span class="ws">Northwind</span>${ic('right', 'chev')}<span class="cnt">13 topics · 22,150 calls</span>
      <span class="srch">Search topics...${ic('search')}</span>
      <span class="vw"><span class="on">Flow</span><span>Landscape</span><span>Pulse</span></span></header>
    <span class="tp-tg" style="left:274px;width:126px"><i></i>Color by topic</span><span class="tp-tg" style="left:411px;width:122px"><i></i>Overall score</span>
    <span class="tp-mc">Manage columns</span>
    <div class="tp-card hid">
      <span class="tp-ch t">Topic</span><span class="tp-ch s">Silence time</span><span class="tp-ch h">Handle time</span><span class="tp-ch f">Satisfaction</span>
      ${sankey()}
      ${TOP.filter(t => t[0]).map(t => { const [x, y, w, h] = t[6]; return `<span class="tp-lb${t[7] ? ' in' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${STAR(t[4] === GRN ? '#3f9c7c' : t[4] === ORG ? '#e5b640' : '#e86a6e')}<b>${t[0]}</b><small>${t[1]}</small></span>`; }).join('')}
      ${ZONES.map(z => z[2].map(([n, s, [x, y, w, h]], k) => `<span class="tp-zl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><i style="background:${ZC[k]}"></i><b>${n}</b><small>${s}</small></span>`).join('')).join('')}
      <span class="tp-ft">Band per topic · splits = share of calls in each zone (Good / Medium / Poor) · hover a topic for its averages · <i>✱</i> Sentiment/Trend models only</span>
      <span class="tp-lg"><span class="sv">Severity</span><span><i style="background:#ff6a56"></i>Low score</span><span><i style="background:#e0ae55"></i>Medium</span><span><i style="background:#4e9980"></i>High score</span></span>
    </div>
  </section>`;

  // ---------- Compliance: the home tab ----------
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
  const ALERTS = [['NF', '#8fa88f', 'Nora Fields', 17], ['CN', '#3f86ee', 'Clara Nash', 15], ['DL', '#f0705c', 'Diane Lowe', 14], ['DS', '#f0705c', 'Derek S', 13],
    ['AR', '#5fa38f', 'Aaron Reyes', 12], ['SK', '#7fa9be', 'Selma K', 12], ['RC', '#8fa88f', 'Rosa Costa', 12]];
  const kpi = (x, label, v) => `<div class="cp-k" style="left:${x}px"><span class="l">${label}${ic('trInfo')}</span><span class="v">${v}<small>%</small></span></div>`;
  const compliance = () => {
    const pts = s => s[2].map((v, k) => v == null ? null : `${X(k).toFixed(1)},${Y(v).toFixed(1)}`).filter(Boolean).join(' ');
    return `<section class="tr-pg tr-cp">
    <header class="cp-c cp-hd"><span class="crumb">Compliance</span>${ic('right', 'chev')}
      <span class="tabs"><span class="on">Home</span><span>Agents</span><span>Reports</span></span></header>
    <section class="cp-c cp-pre"><b>Preset</b><span class="sel">Select a preset${ic('down')}</span><span class="clr">Clear preset</span>${ic('trDdown', 'dd')}</section>
    <section class="cp-c cp-kpi">${kpi(21.5, 'Sales without alerts', '72.6')}${kpi(405.5, 'Valid sales', '93.8')}${kpi(789.5, 'Agents above the success metric', '88.7')}<i class="kd" style="left:382.5px"></i><i class="kd" style="left:766.5px"></i></section>
    <section class="cp-c cp-tr"><h4>Compliance trend by section</h4><span class="m">last 6 weeks · target 80%</span>
      ${SER.map((s, j) => `<span class="lg" style="left:${[292, 395, 540, 651, 810][j] - 274.5}px"><i style="background:${s[1]}"></i>${s[0]}</span>`).join('')}</section>
    <svg class="cp-pl" viewBox="0 0 1440 900" aria-hidden="true">
      ${[0, 20, 40, 60, 80, 100].map(v => `<line class="gl" x1="330" x2="1378" y1="${Y(v)}" y2="${Y(v)}"/><text class="yt" x="327" y="${Y(v) + 3.6}">${v}</text>`).join('')}
      ${TICKS.map(k => `<text class="xt" x="${X(k).toFixed(1)}" y="556.6">${day(k)}</text>`).join('')}
      <g class="tg hid"><line x1="330" x2="1378" y1="395" y2="395"/><rect x="1294" y="378" width="79" height="14" rx="2"/><text x="1333.5" y="388.6">target (80%)</text></g>
      ${SER.map((s, j) => `<g class="sr" data-j="${j}"><polyline points="${pts(s)}" stroke="${s[1]}"/></g>`).join('')}
      <g class="dts hid">${SER.map(s => s[2].map((v, k) => v == null ? '' : `<circle cx="${X(k).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.9" fill="${s[1]}"/>`).join('')).join('')}</g>
    </svg>
    <section class="cp-c cp-al"><h4>Critical alerts by agent</h4>
      ${ALERTS.map(([ini, col, n, v], k) => `<div class="ar" style="top:${51 + 36 * k}px"><i class="am" style="background:${col}">${ini}</i><span class="an">${n}</span><i class="at"><b style="width:${(v / 17 * 963).toFixed(0)}px"></b></i><span class="av">${v}</span></div>`).join('')}</section>
  </section>`;
  };

  // ---------- Actions: the board ----------
  const SRC = { alert: ['alert', 'Alert'], call: ['phone', 'Call'], eval: ['shield', 'Agent evaluation'], signal: ['pulse', 'Signal'], form: ['doc', 'Feedback form'] };
  const PR = { 3: 'High', 2: 'Medium', 1: 'Low' };
  const TAG = { esc: ['fwd', 'Escalated'], res: ['check', 'Resolved'], dup: ['copy', 'Duplicate'], na: ['ban', 'Not actionable', 'dark'] };
  // priority, source, date, title, body, mentions-you comments, tag, [initials, name], counters
  const CARDS = {
    P1: [3, 'alert', 'Today', 'Customer asked twice for a refund, was offered only a voucher', 'Cancelled JFK–LHR flight. The customer requested a cash refund twice; the agent offered a voucher both times.', 3, 0, ['DB', 'Daniel Brooks'], [['sqcheck', '0/2'], ['msg', '3'], ['clip', '1']]],
    P2: [2, 'call', 'Yesterday', 'Reason for Call tagged as Billing — should be Service outage', '<b>@AI,</b> the Reason for Call parameter is tagged incorrectly. This was a service outage.', 0, 0, ['MC', 'Maya Collins'], [['msg', '2']]],
    P3: [3, 'eval', 'Yesterday', 'Recording disclosure missing in the first 30 seconds', 'Agent evaluation flagged the call: the mandatory recording disclosure was never read.', 0, 0, null, [['sqcheck', '0/1']]],
    P4: [2, 'signal', 'Oct 9', 'Callback promised within 24 hours', 'The agent promised to call the customer back about a seat change.', 0, 0, false],
    I1: [3, 'alert', 'Oct 9', 'Technical failure blocked a booking', 'The booking engine timed out at payment; the customer could not complete the booking.', 5, 0, ['RC', 'Ryan Cole'], [['sqcheck', '2/4'], ['msg', '5'], ['clip', '2']]],
    I2: [3, 'eval', 'Oct 8', 'Identity verification skipped before a ticket change', 'The agent changed the passenger name without verifying identity. Compliance review needed.', 0, 0, ['PN', 'Paula Nunes'], [['sqcheck', '1/2'], ['msg', '2']]],
    I3: [2, 'call', 'Oct 7', 'Seat upgrade charged twice', 'Customer was charged twice for a business upgrade. The agent opened a refund request.', 0, 0, ['AW', 'Alex Ward'], [['sqcheck', '1/1'], ['msg', '4'], ['clip', '1']]],
    I4: [2, 'alert', 'Oct 6', 'Unusual silence time on Trip Status calls', 'Silence time averaged 16% this week, double the usual. Agents wait on the booking system.', 0, 0, false],
    D1: [2, 'alert', 'Oct 4', 'Lost baggage claim escalated to the ground team', 'Claim reference passed to the ground team; the customer received the bag the next day.', 0, 'esc', ['SC', 'Sofia Cruz'], [['sqcheck', '2/2'], ['msg', '3'], ['clip', '1']]],
    D2: [1, 'call', 'Oct 3', 'Re-analyze sentiment on a VIP escalation', 'Sentiment was re-analyzed after the transcript was corrected; the call now reads neutral.', 0, 'res', ['MC', 'Maya Collins'], [['sqcheck', '1/1'], ['msg', '1']]],
    C1: [2, 'alert', 'Oct 9', 'Duplicate: booking engine timeout', 'Same incident as an earlier report. Closed as a duplicate.', 0, 'dup', ['RC', 'Ryan Cole'], [['msg', '1']]],
    C2: [1, 'form', 'Sep 29', 'Feedback form: website search is slow', 'Customer feedback about the website search. Not a contact-center issue.', 0, 'na', null, [['clip', '1']]],
  };
  const card = id => {
    const [p, src, date, title, body, men, tag, who, cnt] = CARDS[id];
    const [si, sl] = SRC[src];
    const tg = tag && TAG[tag];
    return `<article class="cd">
      <div class="cd-m"><span class="cd-p p${p}">${prio(p)}${PR[p]}</span><span class="cd-s">${ic(si)}<span>${sl}</span><i>·</i><span>${date}</span></span></div>
      <h4 class="cd-t">${title}</h4><p class="cd-b">${body}</p>
      ${men ? `<div class="cd-x">${ic('at')}<b>Mentions you</b><span>· ${men} comments</span></div>` : ''}
      ${tg ? `<span class="cd-g ${tg[2] || ''}">${ic(tg[0])}${tg[1]}</span>` : ''}
      ${who === false ? '' : `<div class="cd-f">${who ? av(who[0]) + `<b>${who[1]}</b>` : av('') + '<b class="none">Not assigned</b>'}<span class="cd-c">${(cnt || []).map(([i, v]) => `<span>${ic(i)}<span>${v}</span></span>`).join('')}</span></div>`}
    </article>`;
  };
  const col = (k, cls, name, n, meta, ids, more, extra = '') => `<section class="col ${cls}" style="left:${{ pe: 273, ip: 564, dn: 855, ca: 1146 }[k]}px">
    <div class="col-h"><b>${name}</b><em>${n}</em><small>${meta}</small>${ic('more')}</div>
    <div class="col-l">${extra}${ids.map(card).join('')}${more ? `<div class="cl-more">${more}</div>` : ''}</div></section>`;
  const actions = () => `<section class="tr-pg tr-ac">
    <header class="ac-head"><h3>Actions</h3><span class="ac-search">Search workflows...${ic('search')}</span><span class="ac-new">${ic('plus')}New task</span><span class="ac-ver"><span>V1</span><span class="on">V2</span></span></header>
    <div class="ac-scope"><span class="on">Everyone</span><span>Assigned to me</span><span>Mentioned me</span><span>Not assigned</span></div>
    <i class="ac-sep"></i>
    ${[['Assignee', 'All', 731, 121], ['Status', 'All', 862, 106], ['Priority', 'All', 978, 109], ['Labels', 'All', 1097, 105], ['Date', 'Any time', 1212, 135]].map(([l, v, x, w]) => `<span class="ac-pill" style="left:${x}px;width:${w}px">${l} <b>${v}</b>${ic('down')}</span>`).join('')}
    <span class="ac-pill r2" style="left:274px;width:144px">Close reason <b>All</b>${ic('down')}</span>
    <div class="ac-chips">${[['High priority', 4], ['Open action items', 7], ['From alerts', 5], ['From agent evaluation', 2], ['No call attached', 4]].map(([l, n]) => `<span class="chip">${l}<em>${n}</em></span>`).join('')}</div>
    <div class="ac-showing">Showing <b>17</b> of <b>17</b> workflows</div>
    ${col('pe', '', 'Pending', 6, 'oldest 4d', ['P1', 'P2', 'P3', 'P4'])}
    ${col('ip', '', 'In progress', 5, 'oldest 6d', ['I1', 'I2', 'I3', 'I4'])}
    ${col('dn', 'done', 'Done', 4, '16 total', ['D1', 'D2'], '+12 older items', `<div class="cr"><h4>Close reasons</h4><p>6 most recent · Done and Cancelled</p><div class="cr-bar">${[[3, '#1b1b1b'], [1, '#727272'], [1, '#b7b6b9'], [1, '#cfcfcf']].map(([n, c]) => `<i style="flex:${n};background:${c}"></i>`).join('')}</div><ul>${[['Resolved', 3, '#1b1b1b'], ['Duplicate', 1, '#727272'], ['Not actionable', 1, '#b7b6b9'], ['Escalated', 1, '#cfcfcf']].map(([l, n, c]) => `<li><i style="background:${c}"></i>${l}<b>${n}</b></li>`).join('')}</ul></div>`)}
    ${col('ca', 'canc', 'Cancelled', 2, '6 total', ['C1', 'C2'], '+4 older items')}
  </section>`;

  const html = () => `<div class="tr-cam" data-cam="c0" data-pg="chat">${shell()}${chat()}${topics()}${compliance()}${actions()}</div>
    <div class="tr-navy tr-tc hid">
      <div class="tr-ey">Hear · Design Lab</div>
      <div class="tr-hl"><span>Thousands</span> <span>of</span> <span>calls.</span><br><span>One</span> <span class="cl">clear</span> <span>answer.</span></div>
      <i class="tr-rg hid"></i>
    </div>
    <div class="tr-navy tr-ec hid"><div class="tr-wm"><span>Hear.</span></div><i class="tr-rg hid"></i></div>`;

  // camera presets: translate x, y and scale of the app inside the window; phones frame the chat column in a portrait window
  // (the phone close-up keeps the question, the answer cards and the composer whole, a few pixels clear of every edge)
  const CAM = {
    w: { c0: [0, 0, 1], c1: [72, 45, .9], c2: [-418.5, -77.29, 1.40063] },
    n: { c0: [57.8, 98.6, .78], c1: [109, 82, .72], c2: [70.8, 76.3, .765] },
  };
  const OUT3 = 'cubic-bezier(.33,1,.68,1)';

  // the answer, settled: for a reduced-motion frame or a jump
  LX.scene('tour', {
    cls: 'sc-tr',
    html,
    cam0: [720, 450],
    hold: 900,
    times: [0, 2.35, 6.55, 10.1, 15.85, 20.1, 23.53, 26.9, 33.0],
    beats: [
      'The Chat home opens for the Northwind demo.',
      'A title card reads “Thousands of calls. One clear answer.”',
      'A question about escalations is typed and sent.',
      'The answer counts 23 escalations and ranks their topics.',
      'The view moves in close on the answer, then back.',
      'Topics shows how calls flow into each score zone.',
      'Compliance trend lines rise into place one section at a time.',
      'The tour ends on Actions, the board for follow-up work.',
    ],
    rest: 3,
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      // (each change lands a third of a frame before its first changed frame in the recording, so on a 30 fps clock it shows
      // on that frame and in real time it falls between that frame and the one before; at() resolves to how late it woke, in ms)
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 - 12 + off - c.P.t)).then(() => Math.max(0, c.P.t - off - t * 1000));
      // a beat starts on its own frame: in normal play the script goes on at once (the engine's beat() would cost a tick);
      // during a jump it waits, so a held jump still stops before the beat draws anything
      const B = async (i, t0) => { const lag = await at(t0), ff = c.ff, p = c.beat(i); if (ff) { await p; off = c.P.t - t0 * 1000; return 0; } p.catch(() => {}); return lag; };
      // an animation that starts where the clock already is (a script wakes up to a frame after its time)
      const A = (lag, el, kf, o) => { const a = c.anim(el, kf, o); if (!c.ff && lag > 0 && lag < 120) a.currentTime = lag; return a; };
      // keyframes from [[t, value], …] on the recording's clock
      const KF = (pts, f) => { const t0 = pts[0][0], d = pts[pts.length - 1][0] - t0; return [pts.map(([t, v]) => ({ offset: (t - t0) / d, ...f(v) })), d * 1000]; };
      const show = (el, ms, o = {}) => { el.classList.remove('hid'); if (ms) c.anim(el, [{ opacity: 0, transform: o.from || 'none' }, { opacity: 1, transform: 'none' }], { duration: ms, easing: o.ease || OUT3, delay: o.delay || 0, fill: 'backwards' }); };
      const hide = (el, ms, ease = 'linear') => { el.classList.add('hid'); if (ms) c.anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: ease }); };
      const mode = () => (app.closest('.lx') || app).classList.contains('lx-cam') ? 'n' : 'w';
      const cam = q('.tr-cam');
      const tf = n => { const [x, y, s] = CAM[mode()][n]; return `translate(${x}px, ${y}px) scale(${s})`; };
      const camTo = (n, ms, easing) => {
        const from = tf(cam.dataset.cam);
        cam.dataset.cam = n;
        if (ms) c.anim(cam, [{ transform: from }, { transform: tf(n) }], { duration: ms, easing });
      };
      // a camera move along the recording's measured progress: [[t, share of the way], …] (one translate() scale() list throughout)
      const camPath = (lag, n, pts) => {
        const [x0, y0, s0] = CAM[mode()][cam.dataset.cam], [x1, y1, s1] = CAM[mode()][n];
        cam.dataset.cam = n;
        const [kf, d] = KF(pts, p => ({ transform: `translate(${(x0 + p * (x1 - x0)).toFixed(2)}px, ${(y0 + p * (y1 - y0)).toFixed(2)}px) scale(${(s0 + p * (s1 - s0)).toFixed(5)})` }));
        return A(lag, cam, kf, { duration: d, easing: 'linear' });
      };
      // the editor's push and settle around the cards: the framed app scaled by z about the middle of the window
      // (the same translate() scale() list at every step, so the browser interpolates it as one move)
      const base = () => (mode() === 'n' && cam.dataset.pg !== 'chat' ? [72, 45, .9] : CAM[mode()][cam.dataset.cam]);
      const zt = z => {
        const [x, y, s] = base(), [cx, cy] = mode() === 'n' ? [c.P.camX + 240, c.P.camY + 300] : [720, 450];
        return `translate(${(cx + z * (x - cx)).toFixed(2)}px, ${(cy + z * (y - cy)).toFixed(2)}px) scale(${(z * s).toFixed(5)})`;
      };
      const zoom = (lag, pts) => { const [kf, d] = KF(pts, z => ({ transform: zt(z) })); return A(lag, cam, kf, { duration: d, easing: 'linear' }); };
      // phones: a camera cut while a card covers the window
      const camNow = (x, y) => { if (c.P.root.classList.contains('lx-cam')) c.P.camTo(x - 240, y - 300, true); };
      // an element's box moved over time
      const box = (el, to, ms, easing) => {
        const cs = el.style, from = {};
        for (const k in to) from[k] = cs[k] || getComputedStyle(el)[k];
        for (const k in to) cs[k] = to[k] + 'px';
        if (ms) c.anim(el, [from, Object.fromEntries(Object.entries(to).map(([k, v]) => [k, v + 'px']))], { duration: ms, easing });
      };
      // text that arrives a few characters at a time on the recording's own schedule: [[t, chars], …]
      const typeAt = async (el, text, kf) => { for (const [t, n] of kf) { await at(t); el.textContent = text.slice(0, n); } };
      const countAt = async (el, kf, fmt = v => String(v)) => { for (const [t, v] of kf) { await at(t); el.textContent = fmt(v); } };
      const page = p => { cam.dataset.pg = p; };
      const nav = name => { qa('.lx-sb .sb-i.on').forEach(e => e.classList.remove('on')); q(`.lx-sb .sb-i[data-nav="${name}"]`).classList.add('on'); };

      const comp = q('.tr-comp'), inp = q('.tr-in'), slot = q('.tr-slot'), logo = q('.tr-logo'), rng = q('.tr-ring');
      const tc = q('.tr-tc'), ec = q('.tr-ec');

      // 1. the Chat home loads, the camera pulls back to frame the app, the placeholder types an example
      // (the greeting's reveal starts before the first beat resolves, so the first painted frame is already mid-reveal)
      // (the recording sharpens each word from a blur as it rises into place; here each word's darkness and rise follow
      // the recording frame by frame: [t, opacity, px below its place], measured per word at full size)
      const GREET = [
        [[0, .71, 7.3], [.033, .71, 7.3], [.067, .87, 3.7], [.1, .93, 2.8], [.133, .96, .85], [.167, .99, 0], [.2, 1, 0]],
        [[0, .43, 12.7], [.033, .43, 12.7], [.067, .69, 8.2], [.1, .83, 4.5], [.133, .91, 1.7], [.167, .98, .85], [.2, 1, .5], [.233, 1, 0]],
        [[0, 0, 18], [.033, 0, 18], [.067, .27, 16.3], [.1, .55, 10.7], [.133, .82, 4.5], [.167, .9, 2.8], [.2, .91, 1.9], [.233, .95, .85], [.267, .97, .6], [.333, 1, 0]],
      ];
      qa('.tr-greet span').forEach((w, i) => { const [kf, d] = KF(GREET[i].map(([t, o, y]) => [t, [o, y]]), ([o, y]) => ({ opacity: o, transform: `translateY(${y}px)` })); c.anim(w, kf, { duration: d, easing: 'linear', fill: 'backwards' }); });
      c.anim(q('.tr-sub'), [{ opacity: 0 }, { opacity: 1 }], { duration: 140, delay: 130, easing: 'linear', fill: 'backwards' });
      await B(0, 0);
      c.cam([720, 450]);
      // the composer fades up fast, then eases in (0 at 0.40, 60% at 0.433, 78% at 0.467, 88% at 0.50)
      const lc = await at(.405);
      comp.classList.remove('hid');
      A(lc, comp, [{ opacity: 0 }, { opacity: .6, offset: .19 }, { opacity: .78, offset: .41 }, { opacity: .88, offset: .63 }, { opacity: 1 }], { duration: 160, easing: 'linear' });
      await at(.73); inp.classList.add('ty');
      const ph = typeAt(inp, 'What drove escalations thi', [[.73, 1], [.83, 2], [.93, 4], [1.03, 5], [1.13, 7], [1.23, 9], [1.33, 10], [1.43, 12], [1.53, 14], [1.63, 15], [1.68, 16], [1.73, 18], [1.83, 19], [1.93, 21], [2.03, 22], [2.08, 23], [2.13, 24], [2.27, 26]]);
      await at(.8); camTo('c1', 570, OUT3);
      await at(.833); q('.tr-pill span').textContent = 'Processing sentiment signals...';
      await ph;

      // 2. the title card: the app pushes in about 15% about the middle of the window, then the navy card cuts in over it
      // where the recording's dip is half-way (5% of the way at 2.433, 61% at 2.467; the dissolve and its blur are left
      // out, so the app and the card never show at once); the push follows the recording's measured scale frame by frame
      const lp = await B(1, 2.35);
      cam.style.transform = zt(1.15);
      zoom(lp, [[2.35, 1], [2.367, 1.0125], [2.4, 1.043], [2.433, 1.073], [2.467, 1.105], [2.5, 1.138], [2.533, 1.15]]);
      const lt = await at(2.467);
      tc.classList.remove('hid');
      const words = [q('.tr-tc .tr-ey'), ...qa('.tr-hl > span')];
      // each word comes into focus in place on the solid card (the recording sharpens it from a blur; here it only fades in,
      // on the same schedule)
      [2.82, 2.82, 2.88, 2.93, 2.96, 3.04, 3.1].forEach((t, i) => A(lt, words[i], [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: Math.max(0, (t - .09 - 2.467) * 1000), easing: OUT3, fill: 'backwards' }));
      await at(3.67);
      c.anim(q('.tr-hl .cl'), [{ transform: 'scale(1)' }, { transform: 'scale(1.11)', offset: .075 }, { transform: 'scale(1.16)', offset: .15 }, { transform: 'scale(1.16)', offset: .325 }, { transform: 'scale(1.075)', offset: .4 }, { transform: 'scale(.96)', offset: .5 }, { transform: 'scale(.975)', offset: .575 }, { transform: 'scale(1.01)', offset: .65 }, { transform: 'scale(1.01)', offset: .825 }, { transform: 'scale(1)' }], { duration: 400, easing: 'linear' });
      await at(3.7);
      const r1 = q('.tr-tc .tr-rg');
      r1.classList.remove('hid');
      c.anim(r1, [{ opacity: 1, width: '124px', height: '124px' }, { opacity: 1, width: '162px', height: '162px', offset: .74 }, { opacity: 0, width: '166px', height: '166px' }], { duration: 270, easing: 'linear', fill: 'forwards' });
      await at(4.2);
      r1.classList.add('hid');
      inp.textContent = 'Which agents'; q('.tr-pill span').textContent = 'Building your briefing...';
      // back in the app: under the card the app, still pushed in about 5%, settles back into its frame, and the card cuts
      // away where the recording's dip back is half-way (its measured brightness: 21% of the way at 6.07, 42% at 6.10,
      // 71% at 6.13), so the app shows from 6.133 still settling and the card never fades over it
      const settle = lag => {
        cam.style.transform = '';
        zoom(lag, [[5.93, 1.05], [6.033, 1.048], [6.067, 1.0425], [6.1, 1.0275], [6.133, 1.0125], [6.167, 1.0065], [6.2, 1.004], [6.233, 1.0022], [6.267, 1.0008], [6.3, 1]]);
      };
      // a jump or a held step passes over it, so the title step still ends on the card; the next beat then clears it
      if (!c.ff) { settle(await at(5.93)); await at(6.133); tc.classList.add('hid'); }

      // 3. the composer takes focus, suggestions appear, the question is typed
      await B(2, 6.55);
      if (!tc.classList.contains('hid')) { tc.classList.add('hid'); settle(0); }
      c.cam([720, 450]);
      ['.tr-greet', '.tr-sub', '.tr-pill'].forEach(s => q(s).classList.add('hid'));
      logo.classList.add('small');
      inp.textContent = ''; inp.classList.remove('ph');
      // the composer opens upward from where it sat (its foot stays put), then settles up to its focused place
      comp.classList.add('tall');
      Object.assign(comp.style, { left: '543px', width: '612px', height: '181px', top: '327px' });
      c.anim(comp, [{ top: '370.5px' }, { top: '327px' }], { duration: 270, delay: 30, easing: OUT3, fill: 'backwards' });
      slot.dataset.s = 'off';
      await at(6.74); q('.tr-sug').classList.remove('hid');
      const chips = qa('.tr-chips span');
      [q('.tr-sug h6'), ...chips].forEach((el, i) => c.anim(el, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: [70, 70, 100, 70][i], delay: [0, 0, 30, 110][i], easing: OUT3, fill: 'backwards' }));
      // the focus ring comes up over about a tenth of a second
      await at(6.77); comp.classList.add('fo');
      c.anim(comp, [{ borderColor: '#e3e3e3', boxShadow: '0 2px 8px rgba(0,0,0,.06), 0 0 0 0 rgba(140,182,255,0)' }, { borderColor: '#82a0e0', boxShadow: '0 0 0 .75px #82a0e0, 0 0 0 4px rgba(140,182,255,.36)' }], { duration: 130, easing: 'linear' });
      // the mark's coral turns to the blue gradient in one move; the dotted ring gathers around it
      await at(6.84); logo.classList.add('blue');
      c.anim(q('.tr-logo .b'), [{ opacity: 0 }, { opacity: 1 }], { duration: 210, easing: 'linear' });
      await at(6.97); rng.classList.remove('hid');
      c.anim(rng, [{ opacity: 0 }, { opacity: .35, offset: .55 }, { opacity: 1 }], { duration: 430, easing: 'linear' });
      c.anim(rng, [{ transform: 'scale(.7)' }, { transform: 'none' }], { duration: 400, easing: OUT3 });
      // the question is typed on the recording's own key schedule
      const ty = typeAt(inp, 'What drove escalations this week?', [[7.333, 1], [7.467, 2], [7.5, 3], [7.533, 4], [7.567, 5], [7.7, 6], [7.833, 7], [7.867, 8], [7.9, 9], [8.033, 10], [8.1, 11], [8.167, 12], [8.3, 13], [8.333, 14], [8.433, 15], [8.5, 16], [8.533, 17], [8.567, 18], [8.667, 19], [8.7, 20], [8.767, 21], [8.867, 22], [8.9, 23], [8.967, 24], [9.067, 25], [9.1, 26], [9.133, 27], [9.167, 28], [9.233, 29], [9.333, 30], [9.433, 31], [9.467, 32], [9.533, 33]]);
      await at(7.367); slot.dataset.s = 'pale';
      await at(7.467); slot.dataset.s = 'send';
      await ty;

      // 4. send: the thread opens, the answer streams with its cards
      await B(3, 10.1);
      c.cam([720, 450]);
      inp.textContent = ''; inp.classList.remove('ty');
      app.classList.add('sent');
      hide(q('.tr-sug'), 100);
      hide(logo, 130); hide(rng, 130);
      show(q('.tr-bub'), 70, { from: 'translateY(4px)' });
      show(q('.tr-think'), 100, { ease: 'linear' });
      // the composer keeps its focused height for a moment, then drops to the foot of the thread, shrinking as it goes
      // (the measured path, with the recording's dropped frames smoothed out), and finally settles to its chat height
      const DROP = [[10.1, 327, 181], [10.167, 335, 177], [10.233, 350, 172], [10.267, 392, 157], [10.3, 470, 140], [10.333, 560, 128], [10.367, 630, 120],
        [10.4, 680, 116], [10.433, 715, 115], [10.467, 740, 115], [10.5, 755, 115], [10.533, 762, 115], [10.6, 765, 115]];
      Object.assign(comp.style, { top: '765px', height: '115px', left: '547.5px', width: '603.5px' });
      c.anim(comp, DROP.map(([t, y, h]) => {
        const k = Math.min(1, Math.max(0, (t - 10.233) / .3));
        return { offset: (t - 10.1) / .5, top: y + 'px', height: h + 'px', left: (543 + 4.5 * k).toFixed(1) + 'px', width: (612 - 8.5 * k).toFixed(1) + 'px' };
      }), { duration: 500, easing: 'linear' });
      await at(10.233); comp.classList.remove('tall');
      await at(10.5); slot.dataset.s = 'busy';
      // the composer keeps focus: its caret comes back and blinks while the answer is prepared
      await at(10.633); inp.classList.add('ty', 'bl');
      await at(10.7); box(comp, { top: 779, height: 91 }, 200, OUT3);
      await at(12.267);
      q('.tr-think').classList.add('hid');
      c.anim(q('.tr-slot .busy'), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.8)' }], { duration: 60, easing: 'linear', fill: 'forwards' });
      const parts = qa('.tr-ans > span'), acts = q('.tr-acts');
      const sh = (lag, el, ms) => { el.classList.remove('hid'); A(lag, el, [{ opacity: 0 }, { opacity: 1 }], { duration: ms, easing: 'linear', fill: 'backwards' }); };
      // an element that fades up and rises into place on the recording's measured curve: [[t, opacity, px below], …]
      const riseIn = (lag, el, pts) => { el.classList.remove('hid'); const [kf, d] = KF(pts.map(([t, o, y]) => [t, [o, y]]), ([o, y]) => ({ opacity: o, transform: `translateY(${y}px)` })); return A(lag, el, kf, { duration: d, easing: 'linear', fill: 'backwards' }); };
      // the first words and the action row fade up together, each rising a few pixels
      const l1 = await at(12.3);
      riseIn(l1, parts[0], [[12.3, 0, 4], [12.333, .36, 3], [12.367, .5, 1.2], [12.4, .62, .6], [12.433, .76, 0], [12.467, 1, 0]]);
      acts.classList.add('early');
      riseIn(l1, acts, [[12.3, 0, 4.5], [12.333, .46, 3.75], [12.367, .7, 1.9], [12.433, .98, .6], [12.467, 1, 0]]);
      await at(12.333); slot.dataset.s = 'mic';
      // the rest of the sentence streams in as whole phrases, each complete on its first frame
      await at(12.5); parts[1].classList.remove('hid');
      await at(12.7); parts[2].classList.remove('hid');
      await at(12.767); parts[3].classList.remove('hid');
      await at(12.933); parts[4].classList.remove('hid');
      // the actions drop below the cards and Related fades up in place (39% at 13.033, 85% at 13.067), then the count card
      // fades up while it rises about 14 px into place; its frame comes up last (faint until about 13.3)
      riseIn(await at(13.0), q('.tr-rel'), [[13.0, 0, 0], [13.033, .39, 0], [13.067, .85, 0], [13.1, .95, 0], [13.167, 1, 0]]);
      const lk = await at(13.033), kpi = q('.tr-kpi');
      acts.classList.remove('early');
      riseIn(lk, kpi, [[13.033, 0, 14], [13.067, .22, 10.5], [13.1, .42, 6.5], [13.167, .6, 4], [13.233, .82, 2], [13.267, .92, 1.5], [13.3, .97, 1], [13.367, 1, 0]]);
      A(lk, kpi, [{ borderColor: 'rgba(232,232,232,0)' }, { borderColor: 'rgba(232,232,232,.3)', offset: .45 }, { borderColor: '#e8e8e8' }], { duration: 300, easing: 'linear' });
      const n1 = q('.tr-kpi .n1'), n2 = q('.tr-kpi .n2');
      const vals = qa('.tr-bars b');
      vals.forEach(v => { v.textContent = '0'; });
      await Promise.all([
        countAt(n1, [[13.067, 3], [13.1, 7], [13.167, 11], [13.233, 13], [13.267, 15], [13.3, 17], [13.333, 18], [13.367, 19], [13.467, 20], [13.5, 21], [13.567, 22], [13.767, 23]]),
        // the topic card fades up quickly and rises about 9 px into place
        (async () => { riseIn(await at(13.433), q('.tr-tcard'), [[13.433, 0, 11], [13.467, .35, 8.75], [13.5, .53, 5], [13.533, .72, 2.5], [13.567, .8, 0], [13.6, .86, 0], [13.633, .91, 0], [13.667, .97, 0], [13.7, 1, 0]]); })(),
        countAt(vals[0], [[13.47, 11], [13.5, 12], [13.53, 14], [13.57, 15], [13.67, 16]]),
        countAt(vals[1], [[13.47, 1], [13.5, 2], [13.53, 3], [13.67, 4]]),
        countAt(vals[2], [[13.47, 0], [13.53, 1], [13.63, 2], [13.73, 3]]),
        (async () => {
          // the second figure fades up over about 200 ms, rising about 8 px
          const l2 = await at(13.467); n2.textContent = '0%';
          [q('.tr-kpi .k2'), n2].forEach(el => riseIn(l2, el, [[13.467, 0, 8], [13.5, .23, 7], [13.533, .47, 4.5], [13.567, .66, 3], [13.6, .8, 2.5], [13.633, .93, 1.8], [13.667, .97, .8], [13.7, 1, 0]]));
          await countAt(n2, [[13.53, 11], [13.57, 19], [13.63, 28], [13.67, 34], [13.73, 42], [13.77, 47], [13.83, 52], [13.87, 56], [13.9, 60], [13.97, 63], [14.03, 65], [14.07, 67], [14.1, 68], [14.13, 69], [14.27, 70]], v => v + '%');
        })(),
        (async () => { await at(14.07); show(q('.tr-delta'), 60, { ease: 'linear' }); })(),
      ]);
      await at(14.27); const ul = q('.tr-ul'); ul.classList.remove('hid'); c.anim(ul, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 130, easing: 'linear' });
      await at(15.833); q('.tr-delta').classList.add('hid');

      // 5. the camera moves in on the answer, holds, and pulls back
      // (both moves follow the recording's measured progress: in, a fast start with a long settle; out, a quicker settle)
      const lc2 = await B(4, 15.85);
      camPath(lc2, 'c2', [[15.85, 0], [15.867, .23], [15.9, .43], [15.933, .49], [15.967, .545], [16, .6], [16.033, .67], [16.067, .735], [16.1, .79], [16.133, .825],
        [16.167, .862], [16.233, .89], [16.3, .915], [16.367, .945], [16.433, .963], [16.5, .975], [16.667, .99], [16.833, 1]]);
      const lc1 = await at(18.9);
      camPath(lc1, 'c1', [[18.9, 0], [18.933, .12], [18.967, .27], [19, .38], [19.033, .48], [19.067, .64], [19.1, .74], [19.133, .8], [19.167, .85], [19.233, .9],
        [19.267, .93], [19.3, .95], [19.333, .965], [19.4, .98], [19.5, 1]]);
      await at(19.57);
      comp.classList.add('fo'); inp.classList.add('ty', 'bl');

      // 6. a hard cut to Topics: the frame first, the chart a beat later, its words a frame after that
      await B(5, 20.1);
      app.classList.remove('sent'); page('tp'); nav('Topics');
      // phones cut with the app to the page's header and options, so the window is not an empty grey before the chart;
      // the camera moves down as the chart appears, to every topic label and the first score column, clear of the sidebar
      camNow(552, 340);
      const tcard = q('.tp-card');
      await at(20.37); tcard.classList.remove('hid'); tcard.classList.add('bare');
      c.cam([552, 475]);
      await at(20.43); tcard.classList.remove('bare');

      // 7. a hard cut to Compliance: each trend line waits as a flat line on 0, then rises in turn; the dots and target line fade in
      await B(6, 23.53);
      page('cp'); nav('Compliance');
      c.cam([560, 400]); // phones: the KPIs and the left of the trend chart
      const sr = qa('.cp-pl .sr');
      sr.forEach(g => { g.style.transform = 'scaleY(0.001)'; });
      const rise = async (j, t0, t1) => { await at(t0); sr[j].style.transform = ''; c.anim(sr[j], [{ transform: 'scaleY(0.001)' }, { transform: 'scaleY(.6)', offset: .62 }, { transform: 'scaleY(1)' }], { duration: (t1 - t0) * 1000, easing: 'linear' }); };
      const dots = (async () => { await at(24.13); show(q('.cp-pl .dts'), 140, { ease: 'linear' }); show(q('.cp-pl .tg'), 140, { ease: 'linear' }); })();
      // the first line climbs almost straight and eases only at the very top (measured: 41% at 23.77, 86% at 23.97, 98% at 24.07)
      const l0 = await at(23.6); sr[0].style.transform = '';
      const [rkf, rd] = KF([[23.6, .001], [23.633, .07], [23.667, .13], [23.7, .2], [23.733, .29], [23.767, .39], [23.8, .48], [23.833, .56], [23.867, .64], [23.9, .71], [23.933, .78], [23.967, .85], [24, .9], [24.033, .94], [24.067, .98], [24.1, 1]], v => ({ transform: `scaleY(${v})` }));
      A(l0, sr[0], rkf, { duration: rd, easing: 'linear' });
      await rise(1, 23.87, 24.43);
      await rise(2, 24.2, 24.73);
      await rise(3, 24.53, 25.03);
      await rise(4, 24.83, 25.33);
      await dots;

      // 8. a hard cut to the Actions board; the end card, then the board again
      await B(7, 26.9);
      page('ac'); nav('Actions');
      c.cam([552, 420]); // phones: the first column whole, clear of the sidebar, and most of the second
      // the board pushes in about 17%, and the end card cuts in over it where the recording's dip is half-way (30% of the
      // way at 30.067, 52% at 30.133; the dissolve and its blur are left out, so the board and the card never show at once);
      // phones cut the camera to the middle with the card, then the wordmark arrives
      const le = await at(30.02);
      cam.style.transform = zt(1.17);
      zoom(le, [[30.02, 1], [30.067, 1.055], [30.1, 1.076], [30.133, 1.096], [30.167, 1.113], [30.2, 1.127], [30.233, 1.139], [30.267, 1.153], [30.3, 1.16], [30.367, 1.167], [30.45, 1.17]]);
      const wm = q('.tr-wm span');
      wm.classList.add('hid');
      await at(30.133); ec.classList.remove('hid'); camNow(720, 450);
      await at(30.445); show(wm, 200);
      await at(31.17);
      c.anim(wm, [{ transform: 'scale(1)' }, { transform: 'scale(1.065)', offset: .03 }, { transform: 'scale(1.16)', offset: .2 }, { transform: 'scale(1.16)', offset: .3 }, { transform: 'scale(.99)', offset: .39 }, { transform: 'scale(.957)', offset: .48 }, { transform: 'scale(.994)', offset: .6 }, { transform: 'scale(1.015)', offset: .9 }, { transform: 'scale(1)' }], { duration: 330, easing: 'linear' });
      const r2 = q('.tr-ec .tr-rg');
      r2.classList.remove('hid');
      c.anim(r2, [{ opacity: .9, width: '126px', height: '126px' }, { opacity: .85, width: '340px', height: '340px', offset: .3 }, { opacity: .6, width: '440px', height: '440px', offset: .7 }, { opacity: 0, width: '480px', height: '480px' }], { duration: 330, easing: 'linear', fill: 'forwards' });
      await at(31.6); r2.classList.add('hid');
      // the wordmark dims away on the plain card a moment before the card goes (the recording blurs it out)
      const lw = await at(32.55);
      A(lw, wm, [{ opacity: 1 }, { opacity: .62, offset: .14 }, { opacity: .56, offset: .43 }, { opacity: .45, offset: .71 }, { opacity: 0 }], { duration: 117, easing: 'linear', fill: 'forwards' });
      // under the card the board is back in its frame, pushed in about 6%, and settles; the card cuts away where the
      // recording's dip back is half-way (29% of the way at 32.70, 60% at 32.733), and phones cut the camera back with it
      const lb = await at(32.63);
      cam.style.transform = '';
      zoom(lb, [[32.63, 1.058], [32.667, 1.047], [32.7, 1.031], [32.733, 1.016], [32.767, 1.009], [32.8, 1.0062], [32.833, 1.0045], [32.867, 1.0034], [32.9, 1.0012], [32.933, 1]]);
      await at(32.733); ec.classList.add('hid'); camNow(552, 420);
      await at(33.0);
    },
  });
})();
