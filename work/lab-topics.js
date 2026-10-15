// Topics, Ultra version, with the Ask AI side panel: hovering Most to gain lights up Online Booking on the treemap,
// hovering the topic opens its three parameters, Handle time is clicked and the Ask AI panel slides in while the page
// narrows (the treemap re-tiles as it goes), the answer explains the cause, and a follow-up asks which signals to set up.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    tqHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    tqGrid: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    tqMini: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
    tqSpk: 'M10 3.5l1.6 4.4L16 9.5l-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6zM18 14l.8 2.2 2.2.8-2.2.8L18 20l-.8-2.2L15 17l2.2-.8zM18 3.5v3M16.5 5h3',
    tqHead: 'M9 20.5v-3.2A7 7 0 1 1 19 11l1.5 3-1.5.6V17a1.5 1.5 0 0 1-1.5 1.5H16v2M13 11.5a2.2 2.2 0 1 0-2.2-2.2c0 1.6 1.6 1.5 1.6 3',
    tqShield: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.1-7.5 9.5-4.3-1.4-7.5-4.9-7.5-9.5V6zM9 12l2 2 4-4',
    tqClock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2',
    tqPen: 'M11.5 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5.5M17.8 3.7a1.8 1.8 0 0 1 2.5 2.5l-8 8-3.3.8.8-3.3z',
    tqExp: 'M14.5 4H20v5.5M20 4l-6.5 6.5M9.5 20H4v-5.5M4 20l6.5-6.5',
    tqSlash: 'M6.5 3.5h11a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3zM14 8l-4 8',
    tqMic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM18.5 11a6.5 6.5 0 0 1-13 0M12 17.5V21M9 21h6',
    tqUp: 'M12 19V5.5M6.5 11L12 5.5l5.5 5.5',
    tqUpv: 'M7 10v11M14.5 5.9L13.5 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7A2 2 0 0 1 17 21H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h2.8a2 2 0 0 0 1.8-1.1L11.5 3a2.9 2.9 0 0 1 3 2.9z',
    tqDnv: 'M17 14V3M9.5 18.1l1-4.1H4.7a2 2 0 0 1-1.9-2.6l2.3-7A2 2 0 0 1 7 3h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-2.8a2 2 0 0 0-1.8 1.1L12.5 21a2.9 2.9 0 0 1-3-2.9z',
    tqRegen: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 4v4.5H8',
    tqCopy: 'M10 9h9a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 21h-9a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 10 9zM15.5 9V5A1.5 1.5 0 0 0 14 3.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5',
    tqVdots: 'M12 5h.01M12 12h.01M12 19h.01',
    tqArrow: 'M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5',
    tqPtr: 'M6 3.5l12.5 7-5.6 1.6L10 17.5z',
  });
  // the Ask AI sparkle as the recording draws it: a large four-point star low in the box, a smaller one at the upper left
  // and a small one at the upper right (filled, concave sides)
  const star = (x, y, r, k = .22) => `M${x} ${y - r}Q${x + k * r} ${y - k * r} ${x + r} ${y}Q${x + k * r} ${y + k * r} ${x} ${y + r}Q${x - k * r} ${y + k * r} ${x - r} ${y}Q${x - k * r} ${y - k * r} ${x} ${y - r}z`;
  LX.addIcons({ tqSpark: star(12, 16.4, 7.2) + star(6.4, 6.4, 4.1) + star(16.2, 3.9, 2.7) });
  // the Hear mark, filled coral at the top of the rail
  const MARK = 'M43.7 0C44.9-.2 46.6-.2 47.7.3 48.8.8 49.8 1.7 50.3 2.7 50.8 3.7 51 4.4 51 6.5 51 8.6 50.3 13.1 50.3 15.2 50.3 17.3 49.9 18 50.8 19.2 51.7 20.4 54.7 21.4 55.7 22.2 56.7 23 56.8 23.2 56.8 23.8 56.8 24.4 57.2 24.6 56 25.5 54.8 26.4 52.5 25.3 49.7 29 46.9 32.7 41.4 44.3 39.2 47.8 37 51.3 37.6 49.5 36.7 50 35.8 50.5 34.7 50.7 33.7 50.7 32.7 50.8 31.4 50.7 30.5 50.3 29.6 49.9 28.9 49.8 28.3 48.2 27.8 46.6 27.3 43.4 27.2 40.7 27.1 38 27.7 34.2 27.5 32.2 27.3 30.2 26.9 29.3 26.2 28.5 25.5 27.7 24.4 27.2 23.3 27.3 22.2 27.4 20.6 28.2 19.7 28.8 18.8 29.4 18.8 29.2 17.7 31 16.6 32.8 14.1 37.9 12.8 39.5 11.5 41.1 11 40.7 10 40.7 9 40.7 7.5 40.2 6.7 39.5 5.9 38.8 5.5 38.2 5.3 36.3 5.1 34.4 5.8 29.9 5.5 28.2 5.2 26.5 4 26.5 3.3 26 2.6 25.5 1.8 25.6 1.2 25.2.7 24.8-.1 24.1 0 23.7.1 23.3.5 23 1.5 22.7 2.5 22.4 5.1 22.3 6.2 21.8 7.3 21.3 7.3 21 8 19.7 8.7 18.4 9.5 15.4 10.2 14 10.9 12.6 11.4 11.8 12 11.2 12.6 10.6 12.7 10.5 13.5 10.2 14.3 9.9 16.2 9.5 17 9.5 17.8 9.5 17.9 9.9 18.3 10.3 18.7 10.8 18.7 10.6 19.3 12.2 19.9 13.8 20.9 18.4 21.7 20 22.5 21.6 23.5 21.3 24.3 21.5 25.1 21.7 25.5 21.9 26.7 21 27.9 20.1 30.2 18.1 31.5 16 32.8 13.9 33.8 10.2 34.7 8.3 35.6 6.4 36 5.9 37 4.7 38 3.5 39.4 2.1 40.5 1.3 41.6.5 42.5.2 43.7 0z';

  // ---------- data ----------
  // score color: 20 coral to 80 slate, through a warm gray at 50
  const STOPS = [[20, [247, 119, 90]], [35, [242, 169, 156]], [50, [216, 207, 207]], [65, [146, 152, 153]], [80, [79, 99, 98]]];
  const col = s => {
    s = Math.max(20, Math.min(80, s));
    for (let i = 1; i < STOPS.length; i++) if (s <= STOPS[i][0]) {
      const [a, A] = STOPS[i - 1], [b, B] = STOPS[i], t = (s - a) / (b - a);
      return `rgb(${A.map((v, k) => Math.round(v + (B[k] - v) * t)).join(',')})`;
    }
    return 'rgb(79,99,98)';
  };
  const n = v => v.toLocaleString('en-US');
  // the ten highest-volume topics: name, calls, score, change, New, fill, daily bar heights (px)
  const TOP = [
    ['Online Booking', 4412, 43, '▼9 pts', 1, '#e3bfb5', [17,16,17,17,17,17,17,17,17,17,17,16,17,17,17,17,17,17,17,16,17,17,16,15,14,13,13,13,13,13]],
    ['Trip Status', 3968, 63, '▼5 pts', 0, '#959fa3', [24,23,23,23,23,23,23,23,23,23,23,23,23,23,22,22,22,22,22,22,22,23,22,22,22,22,21,21,20,20]],
    ['E-ticket Delivery', 2451, 72, '▼1 pts', 0, '#687c7d', [28,27,27,27,27,27,27,27,27,27,27,26,26,25,25,25,25,25,25,25,25,25,26,25,26,26,27,27,27,27]],
    ['Itinerary Questions', 2377, 43, '▼5 pts', 0, '#e3bfb7', [15,16,15,15,16,15,16,16,16,15,16,15,15,15,14,14,14,14,14,14,15,14,14,14,14,14,14,13,14,14]],
    ['Changes & Cancellations', 2206, 34, '▼13 pts', 1, '#f0a294', [18,17,16,17,18,18,18,19,19,18,18,18,17,16,16,16,15,16,15,14,15,14,14,14,12,12,12,11,12,12]],
    ['Refunds & Credits', 1583, 36, '▼9 pts', 1, '#efa799', [14,15,15,15,14,14,14,15,15,15,15,14,14,13,13,13,14,15,15,15,16,15,13,13,12,11,11,10,10,10]],
    ['Schedule Changes', 1329, 63, '0 pts', 0, '#959fa3', [20,20,21,21,21,21,21,21,21,21,21,20,22,21,21,21,22,21,21,21,21,21,21,21,21,22,21,22,21,21]],
    ['Seating & Extras', 1061, 49, '▼3 pts', 0, '#d7d0d0', [18,18,18,18,18,18,18,18,18,18,18,18,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17]],
    ['Accessibility Requests', 873, 44, '▲5 pts', 0, '#e1c2ba', [18,18,19,19,19,19,19,19,19,20,19,19,19,18,19,20,19,20,19,20,20,19,20,21,21,21,20,20,20,20]],
    ['Complaints & Follow-up', 702, 72, '▼7 pts', 0, '#6a7c7f', [23,22,23,23,23,23,23,23,23,22,23,23,22,23,23,23,23,22,23,23,23,22,21,21,20,19,19,19,18,17]],
  ].map(([name, calls, s, d, nw, fill, bars]) => ({ name, calls, s, d, nw, fill, bars, dark: s >= 70 }));
  // each topic's three parameters (only the three topics the cursor opens): name, value, score, fill, all-topics line
  const PAR = {
    0: [['Satisfaction', '4.1 / 5', 44, '#d9d4d1', 'all topics 4.2', 'avg 4.2'], ['Silence time', '3.4% of call time', 77, '#4c6766', 'all topics 4.6%', 'avg 4.6%'], ['Handle time', '5.9 min', 9, '#ff6d53', 'all topics 4.2 min', 'avg 4.2 min']],
    2: [['Satisfaction', '4.3 / 5', 59, '#bcc4c7', 'all topics 4.2', 'avg 4.2'], ['Silence time', '2.7% of call time', 86, '#4f6362', 'all topics 4.6%', 'avg 4.6%'], ['Handle time', '2.2 min', 71, '#7f8a8b', 'all topics 4.2 min', 'avg 4.2 min']],
    3: [['Satisfaction', '3.8 / 5', 22, col(22), 'all topics 4.2', 'avg 4.2'], ['Silence time', '4.0% of call time', 71, col(71), 'all topics 4.6%', 'avg 4.6%'], ['Handle time', '4.3 min', 36, col(36), 'all topics 4.2 min', 'avg 4.2 min']],
  };
  // a topic's daily row while one of its parameters is hovered: value, change, swatch, bars, all-topics score, bar color.
  // Online Booking's three trends are read from the recording; the other topics are only hovered for a frame or two, so
  // their bars barely start to move before the pointer leaves, and they follow the topic's own curve at the new level
  const lvl = (i, s) => TOP[i].bars.map(h => Math.round(h * s / TOP[i].s));
  const TREND = {
    0: {
      sil: [77, '▼9 pts', '#4c6766', [26,27,28,30,30,30,31,31,30,30,30,30,31,30,30,29,28,28,28,28,28,28,29,27,26,25,25,25,25,25], 65],
      sat: [44, '▼3 pts', '#e3bfb6', [16,17,16,16,16,19,16,15,16,16,17,16,16,16,17,18,19,18,16,18,19,19,16,16,15,15,15,15,15,14], 47],
      ht: [9, '▼14 pts', '#ff6d53', [8,7,6,7,6,5,4,4,4,5,4,5,5,6,5,5,6,7,6,6,7,4,3,3,2,2,3,2,2,2], 41, '#ff6b55'],
    },
    2: { sil: [86, '▼7 pts', '#4f6362', lvl(2, 86), 65], sat: [59, '▲8 pts', '#bcc4c7', lvl(2, 59), 47], ht: [71, '▼4 pts', '#7f8a8b', lvl(2, 71), 41] },
    3: { ht: [36, '▲10 pts', col(36), lvl(3, 36), 41] },
  };
  const PK = ['sat', 'sil', 'ht'];
  const STATUS = s => s >= 65 ? ['Good', '#596561'] : s >= 35 ? ['Medium', '#d8c9c9'] : ['Poor', '#f2654f'];

  // ---------- squarified treemap with gaps ----------
  const worst = (row, s) => { const t = row.reduce((a, b) => a + b, 0); return Math.max(...row.map(r => Math.max(s * s * r / (t * t), t * t / (s * s * r)))); };
  const squarify = (vals, X, Y, W, H, g = 6) => {
    const tot = vals.reduce((a, b) => a + b, 0), k = W * H / tot, A = vals.map(v => v * k), out = [];
    let x = X, y = Y, w = W, h = H, i = 0;
    while (i < A.length) {
      const s = Math.min(w, h); let row = [A[i]], j = i + 1, b = worst(row, s);
      while (j < A.length) { const r2 = [...row, A[j]], w2 = worst(r2, s); if (w2 <= b) { row = r2; b = w2; j++; } else break; }
      const t = row.reduce((a, c) => a + c, 0);
      if (w >= h) { const cw = t / h; let yy = y; row.forEach(a => { const rh = a / cw; out.push([x, yy, cw, rh]); yy += rh; }); x += cw; w -= cw; }
      else { const rh = t / w; let xx = x; row.forEach(a => { const cw = a / rh; out.push([xx, y, cw, rh]); xx += cw; }); y += rh; h -= rh; }
      i = j;
    }
    const E = .5;
    return out.map(([x, y, w, h]) => { const l = x > X + E ? g / 2 : 0, r = x + w < X + W - E ? g / 2 : 0, t = y > Y + E ? g / 2 : 0, bb = y + h < Y + H - E ? g / 2 : 0; return [x + l, y + t, w - l - r, h - t - bb]; });
  };

  // ---------- the icon rail ----------
  const RAIL = [['tqSpark', 77, 'ai'], ['hr', 100], ['tqHome', 124], ['news', 160], ['db', 196], ['db', 231], ['tqGrid', 267, 'on'], ['doc', 303], ['tqMini', 339], ['hr', 362],
    ['term', 385], ['alert', 421], ['tqShield', 457], ['tqShield', 493], ['book', 529], ['tqSpk', 565], ['hr', 588], ['tqHead', 611], ['users', 647], ['bolt', 683], ['bag', 719], ['hr', 800], ['gear', 825]];
  const rail = () => `<aside class="tq-rail"><svg class="mk" viewBox="0 0 57 51" aria-hidden="true"><path d="${MARK}"/></svg>${RAIL.map(([k, y, c]) => k === 'hr' ? `<i class="hr" style="top:${y - 13}px"></i>` : `<span class="ri${c ? ' ' + c : ''}" style="top:${y - 13}px">${ic(k, k === 'tqSpark' ? 'f' : '')}</span>`).join('')}<span class="col">${ic('left')}</span></aside>`;

  // ---------- page parts ----------
  const header = () => `<header class="tq-hd"><b class="cr">Topics</b>${ic('right', 'chv')}<span class="ws">Northwind</span>${ic('right', 'chv')}<span class="cnt">13 topics · 22,150 calls</span>
    <span class="srch">Search topics...${ic('search')}</span><span class="seg vw"><i>Flow</i><i class="on">Landscape</i><i>Pulse</i></span></header>
    <div class="tq-sr"><span class="sel"><span class="l">Score</span><b>Satisfaction</b><span class="p">+2</span><svg viewBox="0 0 6 4" aria-hidden="true"><path d="M0 0h6L3 4z"/></svg></span>
      <p class="def">Equal-weight average of <b>Satisfaction</b>, <b>Silence time</b> and <b>Handle time</b> · 0–100, higher is better</p>
      <span class="vl">Version</span><span class="seg ver"><i>Current</i><i>Facelift</i><i>Refined</i><i class="on">Ultra</i></span></div>
    <div class="tq-kpis">
      <div class="tq-k"><h6>Calls</h6><div class="v"><b>22,150</b></div><p>13 topics · Sep 14 – Oct 13, 2026</p></div>
      <div class="tq-k"><h6>Average score</h6><div class="v"><b>51</b><span>/ 100</span></div><p>Call-weighted · ▼7 pts in 30 days<i class="dt"></i></p></div>
      <div class="tq-k gain"><h6>Most to gain</h6><div class="v"><b>+1.6</b><span>pts if lifted to the average</span></div><p><b>Online Booking</b> · 4,412 calls at 43</p></div>
      <div class="tq-k"><h6>New topics</h6><div class="v"><b>4</b><span>of 13</span></div><p>Online Booking · Changes &amp; Cancellations · Refunds &amp; Credits</p></div>
    </div>`;

  // tile content in the wide and the narrow layout: padding, title, calls, score size, "avg score", New pill place, kind
  const TS = {
    w: [[24, 17.8, 14, 59, 1, 'tr'], [18, 15, 13, 49, 1], [17, 15, 13.1, 47.5, 1], [17, 15, 13.1, 47.5, 1], [17, 15, 13.1, 40, 1, 'tr'], [11, 13.3, 12.5, 28, 1, 'tr'], [12, 13.3, 12, 28, 1], [12, 13.3, 12, 26, 0], [12, 13.3, 12, 0, 0], [8, 12, 0, 0, 0, 0, 'in']],
    n: [[18, 15, 13, 49, 0, 'br'], [18, 15, 13, 49, 1], [17, 15, 13, 41, 1], [17, 15, 13, 41, 1], [16, 15, 13, 36, 0, 'br'], [12, 13.3, 12, 26, 0, 'br'], [13, 13.3, 12, 0, 0], [10, 12, 0, 0, 0, 0, 'in'], [9, 0, 0, 0, 0, 0, 'only'], [9, 0, 0, 0, 0, 0, 'only']],
  };
  // where the recording's text sits against these paddings, measured per tile: extra top padding, and how far the score sits lower (px)
  const NUDGE = { w: [[0, 3], [0, 3], [0, 1], [0, 1], [0, 3], [4, 3], [0, 4], [0, 1], [3.5, 0], [0, 0]], n: [[0, 0], [0, 2], [0, 0], [0, 0], [0, 0], [2, 0], [0, 0], [0, 0], [0, 0], [0, 0]] };
  const tileBody = (i, m) => {
    const t = TOP[i], [p, ts, cs, ss, avg, pill, kind] = TS[m][i], [pt, sy] = NUDGE[m][i], pad = `padding:${p + pt}px ${p}px ${p}px`;
    // the calls line sits closer under a small title than under a large one
    const cm = ts <= 13.3 ? 1.5 : ts >= 17 ? 3 : 5;
    if (kind === 'only') return `<div class="tb" style="padding:${p}px"><span class="only">${t.s}</span></div>`;
    // in the narrow tiles the recording breaks "Ticket Changes / & Cancellations" and "Refunds & / Payments"
    const nm = `<b class="tt" style="font-size:${ts}px">${m === 'n' && i === 4 ? t.name.replace('& ', '&amp;&nbsp;') : m === 'n' && i === 5 ? t.name.replace('& ', '&amp;<br>') : t.name.replace('&', '&amp;')}</b>`;
    if (kind === 'in') return `<div class="tb" style="${pad}">${nm}<span class="inl">${n(t.calls)} · ${t.s}</span></div>`;
    const pl = t.nw && pill ? `<span class="new ${pill}">New</span>` : '';
    return `<div class="tb" style="${pad}">${pill === 'tr' ? `<div class="th">${nm}${pl}</div>` : nm}<span class="cl" style="font-size:${cs}px;margin-top:${cm}px">${n(t.calls)} calls</span>
      ${ss ? `<div class="sc"${sy ? ` style="transform:translateY(${sy}px)"` : ''}><b style="font-size:${ss}px">${t.s}</b>${avg ? '<span>avg score</span>' : ''}${pill === 'br' ? pl : ''}</div>` : ''}</div>`;
  };
  const mix = (hex, a) => { const v = [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16)); return `rgb(${v.map(x => Math.round(255 + (x - 255) * a)).join(',')})`; };
  const drill = i => {
    const t = TOP[i], P = PAR[i];
    return `<div class="dl" style="background:${mix(t.fill, .4)}"><div class="dh"><b>${t.name}</b><span>avg score ${t.s}</span></div>${P.map(([nm, v, s, f], k) =>
      `<div class="sb${s >= 70 ? ' dk' : ''}" data-p="${PK[k]}" style="background:${f}"><b>${nm}</b><small>${v}</small><em>${s}</em>${ic('plus', 'pl')}</div>`).join('')}</div>`;
  };
  // the first frame is drawn before the script runs (and is what shows until the window is on screen), so the tiles
  // start laid out for the wide treemap area
  const tiles = () => { const R0 = squarify(TOP.map(t => t.calls), 0, 0, 775, 481); return TOP.map((t, i) => `<div class="tq-t${t.dark ? ' dk' : ''}" data-i="${i}" style="background:${t.fill};left:${R0[i][0]}px;top:${R0[i][1]}px;width:${R0[i][2]}px;height:${R0[i][3]}px">${tileBody(i, 'w')}${PAR[i] ? drill(i) : ''}</div>`).join(''); };

  // a day's colour is its score: the row's score, moved by how far that day's bar is from the row's mean height (0.37 px a point)
  const dayCols = (hs, s) => { const m = hs.reduce((a, b) => a + b, 0) / hs.length; return hs.map(h => col(s + (h - m) / .37)); };
  const barsHTML = (hs, s) => { const cs = dayCols(hs, s); return hs.map((h, j) => `<i><u style="height:${Math.max(1, h - .5)}px;background:${cs[j]}"></u></i>`).join(''); };
  // where each row's bars sit, measured from the recording (px, up is negative)
  const BDY = [-1, -2, -1, -2.5, 1.5, -1.5, -4.5, -2, 0, -9];
  const REF = s => (s * .37).toFixed(1);
  const W2 = [4, 8, 9];
  const rows = () => TOP.map((t, i) => `<div class="tq-r${W2.includes(i) ? ' w2' : ''}" data-i="${i}" style="top:${(i * 41.1).toFixed(1)}px"><div class="g">
      <div class="nm"><b>${t.name.replace('&', '&amp;')}</b><small>${n(t.calls)} calls</small></div>
      <div class="sp"${BDY[i] ? ` style="transform:translateY(${BDY[i]}px)"` : ''}><div class="bars">${barsHTML(t.bars, t.s)}</div><i class="ref" style="bottom:${REF(51)}px"></i></div>
      <div class="vv"><span><i class="sw" style="background:${col(t.s)}"></i><b>${t.s}</b></span><small>${t.d}</small></div></div></div>`).join('');

  const cards = () => `<div class="tq-low">
    <section class="tq-card tq-tm"><h4>10 highest-volume topics</h4><p class="sub">Area = calls · Color = average score</p>
      <div class="ctl"><span class="lbl">View</span><span class="seg s1"><i>5</i><i class="on">10</i><i>All</i></span><span class="seg s2"><i class="on">Boxes</i><i>Circles</i></span></div>
      <div class="tq-area">${tiles()}</div>
      <div class="tq-ft"><span class="lg">Avg score<span class="po">Poor</span><b>20</b><i class="gb"><u style="left:51.67%"></u></i><b>80</b><span>Good</span></span><span class="hint">${ic('tqPtr')}Hover a topic to see the parameters behind its score</span></div>
    </section>
    <section class="tq-card tq-dy"><h4>Daily score</h4><p class="sub">Height = average score, 0–100</p>
      <div class="sort"><span class="lbl">Sort</span><span class="seg"><i class="on">Most calls</i><i>Lowest score</i><i>Biggest drop</i></span></div>
      <div class="tq-list">${rows()}</div>
      <div class="tq-ax"><div class="sp">${['Sep 14', 'Sep 21', 'Sep 28', 'Oct 5', 'Oct 12'].map((d, k) => `<span style="left:${((k * 7 + .5) / 30 * 100).toFixed(2)}%">${d}</span>`).join('')}</div></div>
      <div class="tq-lg">Score<b>20</b><i class="gb"><u class="at" style="left:51.67%"></u></i><b>80</b><i class="ds"></i><span>all topics</span><b class="atv">51</b></div>
      <div class="tq-mod"><i></i>Modeled · Change = last 7 days vs first 7</div>
    </section></div>`;

  // ---------- the Ask AI panel ----------
  const globe = () => '<i class="glb"></i>';
  const A1 = ['The 5.9 min handle time is likely driven by complex', 'itineraries, extensive verification steps, and gaps', 'in agents’ fare-rule knowledge, pushing it above',
    'the 4.4 min average and yielding a low score of 9.', 'Compared to other topics, Online Booking has the', 'longest handle time and the poorest score,', 'marking it as a clear bottleneck. Next steps: (1)',
    'coach agents on streamlined verification and', 'fare-rule shortcuts; (2) enrich the knowledge', 'base with quick-reference guides for common', 'flight scenarios; (3) audit the call flow to',
    'eliminate redundant prompts or automate data', 'capture.'];
  const A2 = ['Set up alerts for: •Handle-time spikes on Online', 'Booking (e.g., >5 min avg over 24 h); •Increasing', 'silence percentage (>4 % of call time); •Drop in',
    'post-call satisfaction (<4.0) for the same topic;', 'and •Rapid growth in call volume indicating an', 'emerging issue. These signals will flag the', 'problem before it impacts overall performance.'];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ans = (lines, cls) => `<div class="ans ${cls} hid">${lines.map(l => `<span>${esc(l)}</span>`).join('')}</div>`;
  const acts = cls => `<div class="acts ${cls} hid">${['tqUpv', 'tqDnv', 'tqRegen', 'tqCopy', 'tqVdots'].map(k => ic(k, k === 'tqVdots' ? 'vd' : '')).join('')}</div>`;
  const rel = (items, cls) => `<div class="rel ${cls} hid"><h6>Related</h6>${items.map(t => `<div class="ri">${t}${ic('tqArrow')}</div>`).join('')}</div>`;
  const panel = () => `<section class="tq-pn">
    <div class="ph"><span class="tile">${ic('tqSpark', 'f')}</span><b>Ask AI</b><small class="st">New conversation</small>
      ${ic('tqClock', 'h1')}${ic('tqPen', 'h2')}${ic('tqExp', 'h3')}${ic('x', 'h4')}</div>
    <div class="chips"><span>Topics${ic('x')}</span><span>Project · Northwind</span></div>
    <div class="conv"><div class="scr">
      <div class="bub q1">What’s driving Handle time on “Online<br>Booking”? (5.9 min · score 9)</div>
      <div class="think t1">${globe()}Thinking...</div>
      ${ans(A1, 'a1')}${acts('c1')}${rel(['Boosting satisfaction scores', 'Reducing silence time', 'Analyzing emerging topics'], 'r1')}
      <div class="bub q2 hid">Which signals should I set up to catch this<br>early?</div>
      <div class="think t2 hid">${globe()}Thinking...</div>
      ${ans(A2, 'a2')}${acts('c2')}${rel(['Handle time trend analysis', 'Agent coaching impact', 'Knowledge-base usage metrics'], 'r2')}
    </div></div>
    <div class="comp"><div class="tx"><span class="ph0">Ask anything about this page...</span><span class="ty"></span></div>
      ${ic('at', 'at')}${ic('tqSlash', 'sl')}<span class="slot" data-s="busy"><span class="mic">${ic('tqMic')}</span><span class="send">${ic('tqUp')}</span><span class="busy"><i class="bw"><b></b><b></b><b></b></i></span></span></div>
  </section>`;

  const html = () => `<div class="tq-root">${rail()}<div class="tq-main">${header()}${cards()}</div>${panel()}</div>`;

  // ---------- tooltips ----------
  const tipPar = (i, k) => {
    const [nm, v, s, , all] = PAR[i][k], [st, sc] = STATUS(s);
    return `<div class="pt"><div class="r1"><strong>${nm}</strong><span>${n(TOP[i].calls)} calls</span></div><div class="cx">${TOP[i].name}</div>
      <div class="r3"><span class="sc"><strong>${s}</strong>score</span><span class="stt"><i style="background:${sc}"></i>${st}</span></div><hr>
      <div class="v">${v}</div><div class="cm">${all}</div><div class="ac">Click to ask AI about it</div></div>`;
  };
  const tipTopic = i => {
    const t = TOP[i], [st, sc] = STATUS(t.s);
    return `<div class="tt"><div class="r1"><strong>${t.name}</strong>${t.nw ? '<span class="nw"><i></i>New</span>' : ''}<span class="c">${n(t.calls)} calls</span></div><div class="lbl">Average score</div>
      <div class="r3"><span class="sc"><strong>${t.s}</strong>/ 100</span><span class="stt"><i style="background:${sc}"></i>${st}</span></div><hr>
      ${PAR[i].map(([nm, v, s, f, , avg]) => `<div class="m"><strong>${nm}</strong><i class="mb"><u style="width:${s}%;background:${f}"></u></i><em>${s}</em></div><div class="mv">${v} · ${avg}</div>`).join('')}<hr>
      <div class="ft">Equal-weight average of 3 metrics</div><div class="ac">Click to open in Pulse</div></div>`;
  };

  LX.scene('topics', {
    cls: 'sc-tq',
    html,
    cursor: [576, 134],
    cam0: [840, 400],
    hold: 2400,
    rest: 3,
    times: [0, 8.6, 12.9, 19.1, 32.2],
    beats: [
      'Most to gain lights up a topic, then its scores.',
      'Clicking its worst score, Handle time, opens Ask AI.',
      'The answer explains what drives the long handle time.',
      'A follow-up asks which signals would catch it early.',
    ],
    async run(c) {
      const { q, qa, app } = c, P = c.P;
      let off = 0;
      // a moment already reached goes on at once, so several steps due in the same frame all land in that frame
      let due = 0;
      const at = t => { due = t * 1000 + off; const ms = due - c.P.t; return ms > 0 || c.ff ? c.wait(Math.max(0, ms)) : Promise.resolve(); };
      // the clock only wakes a step once per frame, so a step can start a few ms after its moment: its animations are
      // started that much in, which keeps every motion on the recording's timeline at any frame rate
      const lag = () => Math.max(0, Math.min(40, c.P.t - due));
      // the player keeps every animation it starts and plays or pauses them all when it syncs (pause, play, scroll, tab
      // switch); one this scene cancels must leave that list too, or the next sync would start it again from the top
      const own = a => { const cc = a.cancel; a.cancel = () => { P.anims.delete(a); cc.call(a); }; return a; };
      const anim = (el, kf, o = {}) => { const l = lag(); return own(c.anim(el, kf, l ? { ...o, delay: (o.delay || 0) - l } : o)); };
      // a jump to a later beat fast-forwards to it; the clock then carries on from there, and a blinking caret starts again
      const B = async (i, t0) => { await at(t0); const ff = c.ff; await c.beat(i); if (ff) { off = c.P.t - t0 * 1000; if (!c.ff && caretM === 'blink') caret('blink'); } };

      const root = q('.tq-root'), main = q('.tq-main'), area = q('.tq-area'), pn = q('.tq-pn');
      const T = qa('.tq-t'), R = qa('.tq-r'), gain = q('.tq-k.gain'), dsub = q('.tq-dy .sub');
      const tip = c.make('<div class="tq-tip"></div>'); P.cursor.append(tip);
      // the composer caret runs on the player clock, as in the recording: it blinks (0.53 s on, 0.53 s off) while the box is
      // idle and holds steady while text is typed. S is the clock time, in s, when an "on" phase starts
      const tyEl = q('.comp .ty'), CK = [{ opacity: 1 }, { opacity: 1, offset: .502 }, { opacity: 0, offset: .502 }, { opacity: 0 }];
      let caretA = null, caretM = 'off', caretS = 0;
      const caret = (m, S) => {
        caretM = m; if (S != null) caretS = S;
        if (caretA) { caretA.cancel(); caretA = null; }
        tyEl.classList.toggle('cu', m === 'on' || (m === 'blink' && c.ff));
        if (m === 'blink' && !c.ff) caretA = own(c.anim(tyEl, CK, { pseudoElement: '::after', duration: 1056, iterations: Infinity, easing: 'linear', delay: caretS * 1000 + off - P.t, fill: 'none' }));
      };

      // ---------- layout: the main column's width drives the KPI row and the cards; the treemap re-tiles for it ----------
      let mode = 'w';
      const subLayout = (el, w, h) => {
        const p = w > 250 ? 14 : 10, top = p === 14 ? 47 : 40;
        const dh = el.querySelector('.dh'); dh.style.cssText = `left:${p}px;right:${p}px;top:${p === 14 ? 14 : 9}px`; dh.classList.toggle('sm', p === 10);
        squarify([1, 1, 1], p, top, w - 2 * p, h - top - (p === 14 ? 13 : 10)).forEach(([x, y, sw, sh], k) => {
          const s = el.querySelectorAll('.sb')[k];
          s.style.cssText = `left:${x}px;top:${y}px;width:${sw}px;height:${sh}px;background:${s.style.background}`;
          s.classList.toggle('nos', sh < 90); s.classList.toggle('tiny', sw < 70 || sh < 50);
        });
      };
      const tile = () => {
        const W = area.clientWidth, H = area.clientHeight, m = W < 650 ? 'n' : 'w';
        if (m !== mode) { mode = m; T.forEach((el, i) => { el.querySelector('.tb').outerHTML = tileBody(i, m); }); }
        squarify(TOP.map(t => t.calls), 0, 0, W, H).forEach(([x, y, w, h], i) => {
          const el = T[i]; el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.width = w + 'px'; el.style.height = h + 'px';
          const d = el.querySelector('.dl'); if (d) subLayout(d, w, h);
        });
      };
      // the page keeps the Ask AI column solid on a window that fades at the bottom: with every move of the panel the scene
      // gives the window around it (a .ct-win, if there is one) the column's width as --tq-col, so the column's left edge
      // stays at the panel's left edge, a little inside the gap before it: 0 while the panel is closed, 27.5% when it is open
      const W0 = 1348, W1 = 955;
      const setW = w => {
        main.style.width = w + 'px'; pn.style.left = (78 + w + 14) + 'px';
        const host = P.root.closest('.ct-win');
        if (host) { const f = Math.max(0, Math.min(1, (W0 - w) / (W0 - W1))); host.style.setProperty('--tq-col', f ? (27.5 * f).toFixed(3) + '%' : '0%'); }
        const nar = w < 1180; root.classList.toggle('nar', nar);
        tile();
      };
      setW(W0);

      // ---------- small on-clock helpers ----------
      const fadeIn = (el, d, delay = 0) => { if (!c.ff) anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: d, delay, easing: 'linear', fill: 'backwards' }); };
      const show = (el, d, delay) => { el.classList.remove('hid'); fadeIn(el, d, delay); };
      // a Related row arrives: it fades in while settling a few pixels leftward
      const rowIn = (el, d, delay) => { if (!c.ff) anim(el, [{ opacity: 0, transform: 'translateX(3px)' }, { opacity: 1, transform: 'none' }], { duration: d, delay, easing: 'linear', fill: 'backwards' }); };
      // the send button: busy dots, mic, or arrow. The app fades the old state out over the new one:
      // mic -> arrow crossfades; arrow -> dots keeps the blue square while the arrow slides out to the left and the
      // dots slide in from the right;
      // dots -> mic shrinks the blue square a little as it fades, and the mic comes up through it
      const slot = q('.slot');
      const slotTo = (s, ms = 0) => {
        const old = slot.dataset.s; if (old === s) return;
        slot.dataset.s = s;
        if (!ms || c.ff) return;
        const o = slot.querySelector('.' + old), nw = slot.querySelector('.' + s);
        o.style.display = 'grid'; o.style.zIndex = 1;
        const kf = old === 'busy' && s === 'mic'
          ? [{ opacity: 1, transform: 'scale(1)' }, { opacity: .8, transform: 'scale(.86)', offset: .15 }, { opacity: .35, transform: 'scale(.86)', offset: .45 }, { opacity: .12, transform: 'scale(.86)', offset: .7 }, { opacity: 0, transform: 'scale(.86)' }]
          : [{ opacity: 1 }, { opacity: 0 }];
        const a = anim(o, kf, { duration: ms, easing: 'linear', fill: 'forwards' });
        const done = () => { o.style.display = ''; o.style.zIndex = ''; };
        a.finished.then(() => { done(); a.cancel(); }, done);
        if (old === 'send' && s === 'busy') {
          anim(o.querySelector('.i'), [{ transform: 'translateX(0)' }, { transform: 'translateX(-13px)' }], { duration: ms, easing: 'cubic-bezier(.4,0,.8,.6)' });
          anim(nw.querySelector('.bw'), [{ transform: 'translateX(15px)' }, { transform: 'translateX(0)' }], { duration: 170, delay: 15, easing: 'cubic-bezier(.5,1,.89,1)', fill: 'backwards' });
          return;
        }
        const late = old === 'busy' ? ms * .3 : 0;
        anim(nw, [{ opacity: 0 }, { opacity: 1 }], { duration: old === 'busy' ? ms * .3 : ms, delay: late, easing: 'linear', fill: 'backwards' });
      };
      // the busy dots rise and fall in a wave (one cycle a second, each dot 0.135 s behind the one before);
      // S is the clock time, in s, when the first dot starts to rise
      const BOUNCE = [
        { transform: 'translateY(0)', opacity: .4, offset: 0, easing: 'ease-in-out' },
        { transform: 'translateY(-4.3px)', opacity: 1, offset: .25 },
        { transform: 'translateY(-4.3px)', opacity: 1, offset: .5, easing: 'ease-in-out' },
        { transform: 'translateY(0)', opacity: .4, offset: .85 },
        { transform: 'translateY(0)', opacity: .4, offset: 1 },
      ];
      let busyA = [];
      const busyOff = () => { busyA.forEach(a => { try { a.cancel(); } catch (e) {} }); busyA = []; };
      const busyOn = S => {
        busyOff(); if (c.ff) return;
        busyA = qa('.slot .busy b').map((b, k) => own(c.anim(b, BOUNCE, { duration: 1000, iterations: Infinity, easing: 'linear', delay: S * 1000 + off - P.t + k * 135, fill: 'backwards' })));
      };

      // ---------- the daily rows: a hovered parameter swaps its topic's row to that parameter's trend; bars grow or shrink ----------
      // each bar eases to its new height over 0.27 s, its colour a little ahead; a new target that arrives mid-move carries the bar's speed on
      // (a cubic from the current height and speed to the target at rest, sampled into keyframes on the player clock)
      const BD = 270, barMove = new Map();
      const herm = (m, s) => { const s2 = s * s, s3 = s2 * s; return { h: (2 * s3 - 3 * s2 + 1) * m.h0 + (s3 - 2 * s2 + s) * m.v0 * BD + (3 * s2 - 2 * s3) * m.h1, v: ((6 * s2 - 6 * s) * m.h0 + (3 * s2 - 4 * s + 1) * m.v0 * BD + (6 * s - 6 * s2) * m.h1) / BD }; };
      const setBars = (row, hs, fixed, sc) => {
        const dc = dayCols(hs, sc);
        row.querySelectorAll('.bars u').forEach((u, j) => {
          const h1 = Math.max(1, hs[j] - .5), bg = fixed || dc[j];
          const prev = barMove.get(u), cs = getComputedStyle(u), b0 = cs.backgroundColor;
          let h0 = parseFloat(cs.height), v0 = 0;
          if (prev) { const sNow = (P.t - lag() - prev.t0) / BD; if (sNow < 1) ({ h: h0, v: v0 } = herm(prev, sNow)); try { prev.a.cancel(); } catch (e) {} barMove.delete(u); }
          u.style.height = h1 + 'px'; u.style.background = bg;
          if (c.ff || (Math.abs(h0 - h1) < .05 && !v0 && b0 === getComputedStyle(u).backgroundColor)) return;
          const m = { h0, v0, h1, t0: P.t - lag() }, kf = [];
          for (let k = 0; k <= 12; k++) { const sk = k / 12, sc = Math.min(1, sk * 1.5), cp = sc * sc * (3 - 2 * sc); kf.push({ offset: sk, height: herm(m, sk).h.toFixed(2) + 'px', backgroundColor: `color-mix(in srgb, ${bg} ${(cp * 100).toFixed(1)}%, ${b0})` }); }
          m.a = anim(u, kf, { duration: BD, easing: 'linear' }); barMove.set(u, m);
        });
      };
      const setRef = (row, s) => {
        const r = row.querySelector('.ref'), b0 = getComputedStyle(r).bottom, b1 = REF(s) + 'px';
        r.style.bottom = b1;
        if (!c.ff && b0 !== b1) anim(r, [{ bottom: b0 }, { bottom: b1 }], { duration: 270, easing: 'ease-in-out' });
      };
      const rowTo = (i, k) => {
        const row = R[i], t = TOP[i], nm = row.querySelector('.nm small'), vv = row.querySelector('.vv');
        if (k) {
          const [v, d, sw, bars, all, fixed] = TREND[i][k], [name, val] = PAR[i][PK.indexOf(k)];
          nm.innerHTML = `<b>${name}</b> · ${val}`; vv.querySelector('b').textContent = v; vv.querySelector('small').textContent = d; vv.querySelector('.sw').style.background = sw;
          setBars(row, bars, fixed, v); setRef(row, all);
        } else {
          nm.textContent = `${n(t.calls)} calls`; vv.querySelector('b').textContent = t.s; vv.querySelector('small').textContent = t.d; vv.querySelector('.sw').style.background = col(t.s);
          setBars(row, t.bars, null, t.s); setRef(row, 51);
        }
      };
      let trow = null, tkey = null;
      const setTrend = (i, k) => {
        if (i === trow && k === tkey) return;
        if (trow !== null && trow !== i) rowTo(trow, null);
        trow = i; tkey = k;
        if (i !== null) rowTo(i, k);
        const all = k ? TREND[i][k][4] : 51;
        dsub.innerHTML = k ? `Trend: <b>${PAR[i][PK.indexOf(k)][0]}</b> · height = score` : 'Height = average score, 0–100';
        q('.tq-lg .atv').textContent = all; q('.tq-lg .at').style.left = ((all - 20) / 60 * 100).toFixed(2) + '%';
      };

      // ---------- hover state: one call sets what the pointer is over ----------
      // o: { kpi, topic (index, opens it), row (that topic lit from the Daily list), sub ('sat'|'sil'|'ht'), tip (html or ''),
      //      fade ([delay, duration] of the opening topic's parameter tiles, ms), shut (how long a closing topic holds, ms) }
      // what the pointer is over dims the rest, outlines the tile and lights its Daily row. These run on the player clock:
      // a dim comes in quickly (0.07 s) and lifts slowly (0.3 s), as in the recording; an outline shows at once and fades out
      const DIM_IN = [70, 'ease-out'], DIM_OUT = [300, 'cubic-bezier(.15,.75,.35,1)'], LINE_OUT = [120, 'linear'];
      const fx = new Map();
      const flip = (el, cls, on, t, prop, dIn, dOut, pseudo) => {
        if (el.classList.contains(cls) === on) return;
        const key = pseudo ? t.dataset.fx || (t.dataset.fx = Math.random().toString(36).slice(2)) : t;
        const v0 = getComputedStyle(t, pseudo || null)[prop], prev = fx.get(key);
        if (prev) { try { prev.cancel(); } catch (e) {} fx.delete(key); }
        el.classList.toggle(cls, on);
        const d = on ? dIn : dOut;
        if (c.ff || !d) return;
        const v1 = getComputedStyle(t, pseudo || null)[prop]; if (v0 === v1) return;
        fx.set(key, anim(t, [{ [prop]: v0 }, { [prop]: v1 }], { duration: d[0], easing: d[1], ...(pseudo ? { pseudoElement: pseudo } : {}) }));
      };
      let tipOn = false;
      const hov = (o = {}) => {
        const hi = o.topic ?? (o.kpi ? 0 : o.row ?? null);
        flip(gain, 'hv', !!o.kpi, gain, 'borderColor', DIM_IN, DIM_OUT);
        T.forEach((el, i) => {
          // a topic that closes while the pointer moves on shows its label in full on the pale open colour, outlined, for
          // a frame or two; then it dims and the outline goes, both at once
          const was = el.classList.contains('dr'), dr = o.topic === i && !!PAR[i], shut = was && !dr && hi !== null && i !== hi, SHUT = [o.shut || 66, 'steps(1, end)'];
          flip(el, 'dim', hi !== null && i !== hi, el, 'opacity', shut ? SHUT : DIM_IN, DIM_OUT);
          flip(el, 'tg', hi === i, el, 'opacity', null, was ? SHUT : LINE_OUT, '::after');
          if (shut && !c.ff) { const pale = el.querySelector('.dl').style.background; anim(el, [{ backgroundColor: pale }, { backgroundColor: pale }], { duration: SHUT[0], easing: 'linear' }); }
          el.classList.toggle('dr', dr);
          // the tile's own label goes at once and the header shows; the tile's colour pales as its three parameter tiles fade in
          if (dr && !was && !c.ff) {
            const dl = el.querySelector('.dl');
            anim(dl, [{ backgroundColor: TOP[i].fill }, { backgroundColor: dl.style.background }], { duration: 120, easing: 'linear' });
            const [fd, fl] = o.fade || [0, 120];
            dl.querySelectorAll('.sb').forEach(s => anim(s, [{ opacity: 0 }, { opacity: 1 }], { duration: fl, delay: fd, easing: 'linear', fill: 'backwards' }));
          }
          el.querySelectorAll('.sb').forEach(s => s.classList.toggle('on', o.topic === i && s.dataset.p === o.sub));
        });
        R.forEach((el, i) => { flip(el, 'dim', hi !== null && i !== hi, el.querySelector('.g'), 'opacity', DIM_IN, DIM_OUT); flip(el, 'on', hi === i, el, 'backgroundColor', DIM_IN, DIM_OUT); });
        const tk = o.topic != null && o.sub && TREND[o.topic] && TREND[o.topic][o.sub] ? o.sub : null;
        if (tk) setTrend(o.topic, tk); else setTrend(trow === null ? null : trow, null);
        tip.innerHTML = o.tip || ''; tip.classList.toggle('on', !!o.tip);
        if (o.tip && !tipOn && !c.ff) anim(tip, [{ opacity: 0 }, { opacity: 1 }], { duration: 90, easing: 'linear' });
        tipOn = !!o.tip;
      };
      const FBt = { topic: 0, tip: tipTopic(0) }, FB = k => ({ topic: 0, sub: PK[k], tip: tipPar(0, k) });
      const TC = k => k == null ? { topic: 2, tip: tipTopic(2) } : { topic: 2, sub: PK[k], tip: tipPar(2, k) };
      const opening = (o, f) => ({ ...o, fade: f });

      // ---------- the pointer: waypoints from the recording, [t, x, y] ----------
      const glide = (pts, ease) => {
        const t0 = pts[0][0], t1 = pts[pts.length - 1][0], [, x1, y1] = pts[pts.length - 1];
        P.cx = x1; P.cy = y1; P.place();
        if (c.ff) return;
        anim(P.cursor, pts.map(([t, x, y]) => ({ offset: (t - t0) / (t1 - t0), transform: `translate(${x}px,${y}px)` })), { duration: (t1 - t0) * 1000, easing: ease || 'linear' });
      };
      const press = () => { if (!c.ff) anim(P.cursor.firstElementChild, [{ transform: 'scale(1)', easing: 'ease-in-out' }, { transform: 'scale(.81)', offset: .55 }, { transform: 'scale(.79)', offset: .78, easing: 'ease-in-out' }, { transform: 'scale(1)' }], { duration: 150, easing: 'linear' }); };
      const EIO = 'cubic-bezier(.45,0,.3,1)';
      // a Related row under the moving pointer: its arrow darkens at once; over the label, the label and its rule darken too
      const relAt = async (rows, steps) => {
        for (const [t, k, cls, on, d] of steps) {
          await at(t); const r = rows[k], c0 = getComputedStyle(r), v0 = [c0.color, c0.borderBottomColor];
          r.classList.toggle(cls, on);
          if (d && !c.ff) { const c1 = getComputedStyle(r); anim(r, [{ color: v0[0], borderBottomColor: v0[1] }, { color: c1.color, borderBottomColor: c1.borderBottomColor }], { duration: d, easing: 'linear' }); }
        }
      };

      // ---------- 1. Most to gain lights up Online Booking; the topic opens into its parameters ----------
      await B(0, 0);
      glide([[0, 576, 134], [.33, 577, 149], [.47, 579, 166], [.6, 581, 179], [.7, 582, 186]]);
      await at(.7); glide([[.7, 582, 186], [1.4, 582, 188]]);
      await at(1.4); glide([[1.4, 582, 188], [1.5, 609, 188], [1.67, 657, 188], [1.8, 752, 188], [1.93, 830, 188], [2.07, 885, 189], [2.2, 915, 189], [2.27, 922, 189]]);
      await at(1.87); hov({ kpi: 1 });
      await at(4.23); c.cam([300, 450]);
      glide([[4.23, 922, 189], [4.3, 899, 201], [4.4, 849, 224], [4.47, 801, 246], [4.53, 708, 291], [4.6, 671, 308], [4.67, 544, 369], [4.73, 467, 405], [4.8, 433, 420], [4.83, 401, 435],
        [4.87, 374, 449], [4.93, 306, 481], [5, 290, 489], [5.03, 276, 496], [5.1, 254, 506], [5.2, 252, 507]]);
      await at(4.48); hov({});
      await at(4.632); hov(opening(TC(), [0, 50]));
      await at(4.67); hov(TC(1));
      await at(4.73); hov(TC(0));
      await at(4.83); hov({ ...opening(FBt, [-15, 75]), shut: 33 });
      await at(4.85); hov(FB(2));
      await at(4.97); hov(FB(0));
      await at(5.02); hov(FBt);
      await at(5.05); hov(FB(1));
      await at(6.23); glide([[6.23, 252, 507], [6.33, 244, 495], [6.43, 238, 486], [6.53, 220, 464], [6.63, 211, 451], [6.73, 206, 444]]);
      await at(6.33); hov(FBt);
      await at(6.43); hov(FB(0));
      await at(7.83); glide([[7.83, 206, 444], [7.93, 219, 448], [8.07, 253, 461], [8.13, 275, 469], [8.23, 299, 478], [8.27, 318, 485], [8.4, 331, 490], [8.5, 344, 496]]);
      // on a phone the camera eases right so the Handle time tooltip, with its "Click to ask AI about it", is in frame
      await at(8.22); hov(FBt); c.cam([352, 450]);
      await at(8.25); hov(FB(2));

      // ---------- 2. Handle time is clicked: the Ask AI panel slides in and the page narrows ----------
      await B(1, 8.6);
      await at(10.4); press();
      await at(10.47);
      q('.tq-rail .ai').classList.add('on');
      fadeIn(q('.q1'), 70); fadeIn(q('.t1'), 70);
      busyOn(10.64);
      // one width animation drives both: the panel's left edge and the main column (strong ease-out, a quarter second)
      const D = 250, s0 = 10465 + off;
      c.cam([1200, 400]);
      if (c.ff) setW(W1);
      else for (;;) { const t = Math.min(1, (P.t - s0) / D), e = 1 - Math.pow(1 - t, 4); setW(W0 + (W1 - W0) * e); if (t >= 1) break; await c.wait(16); }
      caret('on');
      await at(11); caret('blink', 11.5);
      // the first answer fades in where "Thinking..." was; the send button goes idle and Related follows, row by row
      await at(11.91); slotTo('mic', 180);
      await at(11.92);
      q('.t1').classList.add('hid'); q('.ph .h3').classList.add('en');
      show(q('.a1'), 140); show(q('.c1'), 140);
      const r1 = q('.r1'), rr1 = [...r1.querySelectorAll('.ri')];
      r1.classList.remove('hid'); fadeIn(r1.querySelector('h6'), 130, 10);
      [50, 60, 90].forEach((dl, k) => rowIn(rr1[k], 80, dl));
      await at(12.08); q('.ph .st').textContent = 'What’s driving Handle time o...';
      await at(12.1); busyOff();

      // the pointer sweeps over to read the answer, passing over the treemap and the Daily card
      await at(12.63);
      glide([[12.63, 344, 496], [12.7, 363, 492], [12.83, 414, 480], [12.93, 501, 460], [13, 537, 451], [13.1, 669, 421], [13.23, 831, 383], [13.33, 974, 350], [13.43, 1051, 333], [13.5, 1137, 313], [13.6, 1187, 300], [13.67, 1206, 296]]);
      hov(opening(TC(), [25, 50]));
      await at(12.67); hov(TC(1));
      await at(12.85); hov(TC(2));
      await at(12.89); hov(TC());

      // ---------- 3. the answer is read ----------
      await B(2, 12.9);
      await at(12.92); hov({ topic: 3, tip: tipTopic(3), fade: [70, 80] });
      await at(13.05); hov({ topic: 3, sub: 'ht', tip: tipPar(3, 2) });
      await at(13.09); hov({ row: 3 });
      await at(13.19); hov({ row: 0 });
      await at(13.29); hov({});
      c.cam([1200, 400]);
      await at(15.23); glide([[15.23, 1206, 296], [15.33, 1218, 305], [15.53, 1269, 337], [15.7, 1312, 366], [15.83, 1331, 377]]);
      await at(17.13); glide([[17.13, 1331, 377], [17.33, 1293, 401], [17.5, 1247, 430], [17.67, 1196, 461], [17.73, 1187, 467]]);
      await at(18.87); glide([[18.87, 1187, 467], [19.07, 1196, 524], [19.27, 1214, 666], [19.47, 1230, 773], [19.63, 1235, 812], [19.7, 1236, 816]]);
      c.cam([1200, 600]);

      // ---------- 4. the follow-up is typed and sent; the second answer scrolls into view ----------
      await B(3, 19.1);
      await relAt(rr1, [[19.2, 0, 'hv', true], [19.23, 0, 'ht', true], [19.265, 0, 'hv', false], [19.265, 0, 'ht', false], [19.265, 1, 'hv', true],
        [19.3, 1, 'hv', false], [19.3, 2, 'hv', true], [19.3, 2, 'ht', true], [19.33, 2, 'hv', false], [19.365, 2, 'ht', false]]);
      await at(20.11); press();
      const comp = q('.comp'), ty = q('.comp .ty'), ph0 = q('.comp .ph0');
      const Q = 'Which signals should I set up to catch this early?';
      // keystroke times read from the recording, one per character
      const KT = [20.733, 20.833, 20.867, 20.933, 21, 21.033, 21.1, 21.133, 21.2, 21.233, 21.3, 21.333, 21.433, 21.467, 21.5, 21.533, 21.633, 21.667, 21.7, 21.733,
        21.8, 21.833, 21.95, 22, 22.033, 22.067, 22.1, 22.133, 22.2, 22.267, 22.333, 22.4, 22.467, 22.5, 22.533, 22.6, 22.633, 22.7, 22.733, 22.833,
        22.867, 22.9, 23, 23.033, 23.067, 23.1, 23.2, 23.233, 23.3, 23.333];
      let fade = null;
      await at(20.71); slotTo('send', 150);
      for (let k = 1; k <= Q.length; k++) {
        await at(KT[k - 1]);
        if (k === 1) {
          caret('on');
          // the placeholder does not vanish: it fades slowly under the typed text
          if (!c.ff) fade = anim(ph0, [{ opacity: 1 }, { opacity: 0 }], { duration: 2500, easing: 'linear', fill: 'forwards' });
          else ph0.style.opacity = 0;
        }
        const s = Q.slice(0, k);
        // "early" no longer fits on the first line: it wraps and the composer grows up by a line
        if (k === 49) comp.classList.add('tw2');
        ty.innerHTML = k >= 49 ? esc(Q.slice(0, 43)) + '<br>' + esc(s.slice(44)) : esc(s);
      }
      // after the last key the caret blinks again, its first "on" phase starting with that key; Enter does not reset it
      await at(23.34); caret('blink', 23.333);
      // Enter: the composer clears (its placeholder does not come back), the question joins the conversation and the app thinks again
      await at(23.91);
      ty.textContent = ''; comp.classList.remove('tw2');
      if (fade) fade.cancel(); ph0.style.opacity = 0;
      q('.ph .h3').classList.remove('en');
      r1.classList.add('hid');
      show(q('.q2'), 150); show(q('.t2'), 150);
      busyOn(23.89);
      await at(23.97); slotTo('busy', 95);
      await at(25.04); slotTo('mic', 180);
      await at(25.05);
      q('.t2').classList.add('hid'); q('.ph .h3').classList.add('en');
      show(q('.a2'), 170); show(q('.c2'), 170);
      // the conversation scrolls up so the new answer is in view: it settles 6 px as the answer replaces "Thinking...",
      // then at 25.10 a smooth scroll runs fast and slows into place (0.23 s), as the recording's frames trace it
      const scr = q('.scr'); scr.style.transform = 'translateY(-227px)';
      if (!c.ff) anim(scr, [{ offset: 0, transform: 'translateY(0)' }, { offset: 25 / 290, transform: 'translateY(-6px)' }, { offset: 60 / 290, transform: 'translateY(-6px)', easing: 'cubic-bezier(0,.7,.5,1)' }, { offset: 1, transform: 'translateY(-227px)' }], { duration: 290, delay: -10, easing: 'linear' });
      await at(25.06); q('.c1').classList.add('hid');
      const r2 = q('.r2'), rr2 = [...r2.querySelectorAll('.ri')];
      r2.classList.remove('hid'); fadeIn(r2.querySelector('h6'), 70, 40);
      [60, 100, 150].forEach((dl, k) => fadeIn(rr2[k], 70, dl));
      await at(25.23); busyOff();
      await at(25.67); glide([[25.67, 1236, 816], [25.83, 1237, 773], [26, 1238, 675], [26.13, 1240, 530], [26.3, 1241, 467]]);
      await relAt(rr2, [[25.865, 2, 'hv', true], [25.9, 2, 'ht', true], [25.93, 2, 'hv', false], [25.93, 1, 'hv', true], [25.975, 2, 'ht', false, 50],
        [25.99, 1, 'hv', false], [25.99, 0, 'hv', true], [26.02, 0, 'hv', false]]);
      await at(27.63); glide([[27.63, 1241, 467], [28.13, 1187, 432]], EIO);
      await at(29.4); glide([[29.4, 1187, 432], [29.6, 1225, 451], [29.8, 1302, 488], [30, 1331, 503]]);
      await at(32.2);
    },
  });
})();
