// Topics, Ultra version, with the Ask AI side panel: hovering Most to gain lights up Flight Booking on the treemap,
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
    ['Flight Booking', 4879, 43, '▼9 pts', 1, '#e3bfb5', [17,16,17,17,17,17,17,17,17,17,17,16,17,17,17,17,17,17,17,16,17,17,16,15,14,13,13,13,13,13]],
    ['Booking Status', 3832, 63, '▼5 pts', 0, '#959fa3', [24,23,23,23,23,23,23,23,23,23,23,23,23,23,22,22,22,22,22,22,22,23,22,22,22,22,21,21,20,20]],
    ['Ticket Confirmation', 2689, 72, '▼1 pts', 0, '#687c7d', [28,27,27,27,27,27,27,27,27,27,27,26,26,25,25,25,25,25,25,25,25,25,26,25,26,26,27,27,27,27]],
    ['Existing Flight Details', 2594, 43, '▼5 pts', 0, '#e3bfb7', [15,16,15,15,16,15,16,16,16,15,16,15,15,15,14,14,14,14,14,14,15,14,14,14,14,14,14,13,14,14]],
    ['Ticket Changes & Cancellations', 2142, 34, '▼13 pts', 1, '#f0a294', [18,17,16,17,18,18,18,19,19,18,18,18,17,16,16,16,15,16,15,14,15,14,14,14,12,12,12,11,12,12]],
    ['Refunds & Payments', 1761, 36, '▼9 pts', 1, '#efa799', [14,15,15,15,14,14,14,15,15,15,15,14,14,13,13,13,14,15,15,15,16,15,13,13,12,11,11,10,10,10]],
    ['Flight Details Change', 1404, 63, '0 pts', 0, '#959fa3', [20,20,21,21,21,21,21,21,21,21,21,20,22,21,21,21,22,21,21,21,21,21,21,21,21,22,21,22,21,21]],
    ['Seats & Upgrades', 1214, 49, '▼3 pts', 0, '#d7d0d0', [17,18,19,18,20,19,18,17,18,19,18,20,17,17,17,17,17,17,17,17,17,16,17,17,17,17,17,17,17,17]],
    ['Medical & Special Assistance', 904, 44, '▲5 pts', 0, '#e1c2ba', [18,18,19,19,19,19,19,19,19,20,19,19,19,18,19,20,19,20,19,20,20,19,20,21,21,21,20,20,20,20]],
    ['Customer Relations & Follow-up', 619, 72, '▼7 pts', 0, '#6a7c7f', [23,22,23,23,23,23,23,23,23,22,23,23,22,23,23,23,23,22,23,23,23,22,21,21,20,19,19,19,18,17]],
  ].map(([name, calls, s, d, nw, fill, bars]) => ({ name, calls, s, d, nw, fill, bars, dark: s >= 70 }));
  // each topic's three parameters (only the three topics the cursor opens): name, value, score, fill, all-topics line
  const PAR = {
    0: [['Satisfaction', '4.1 / 5', 44, '#d9d4d1', 'all topics 4.2', 'avg 4.2'], ['Silence time', '3.4% of call time', 77, '#4c6766', 'all topics 4.6%', 'avg 4.6%'], ['Handle time', '5.9 min', 9, '#ff6d53', 'all topics 4.2 min', 'avg 4.2 min']],
    2: [['Satisfaction', '4.3 / 5', 59, '#bcc4c7', 'all topics 4.2', 'avg 4.2'], ['Silence time', '2.7% of call time', 86, '#4f6362', 'all topics 4.6%', 'avg 4.6%'], ['Handle time', '2.2 min', 71, '#7f8a8b', 'all topics 4.2 min', 'avg 4.2 min']],
    3: [['Satisfaction', '3.8 / 5', 22, col(22), 'all topics 4.2', 'avg 4.2'], ['Silence time', '4.0% of call time', 71, col(71), 'all topics 4.6%', 'avg 4.6%'], ['Handle time', '4.3 min', 36, col(36), 'all topics 4.2 min', 'avg 4.2 min']],
  };
  // Flight Booking's daily row while a parameter is hovered: value, change, swatch, bars, all-topics score
  const TREND = {
    sil: [77, '▼9 pts', '#4c6766', [26,27,28,30,30,30,31,31,30,30,30,30,31,30,30,29,28,28,28,28,28,28,29,27,26,25,25,25,25,25], 65],
    sat: [44, '▼3 pts', '#e3bfb6', [16,17,16,16,16,19,16,15,16,16,17,16,16,16,17,18,19,18,16,18,19,19,16,16,15,15,15,15,15,14], 47],
    ht: [9, '▼14 pts', '#ff6d53', [9,7,7,7,7,5,5,5,5,5,5,5,5,7,5,5,7,7,7,7,7,5,3,3,2,2,2,2,2,2], 41],
  };
  const PK = ['sat', 'sil', 'ht'];
  const STATUS = s => s >= 65 ? ['Good', '#596561'] : s >= 40 ? ['Medium', '#d8c9c9'] : ['Poor', '#f2654f'];

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
  const RAIL = [['spark', 77, 'ai'], ['hr', 100], ['tqHome', 124], ['news', 160], ['db', 196], ['db', 231], ['tqGrid', 267, 'on'], ['doc', 303], ['tqMini', 339], ['hr', 362],
    ['term', 385], ['alert', 421], ['tqShield', 457], ['tqShield', 493], ['book', 529], ['tqSpk', 565], ['hr', 588], ['tqHead', 611], ['users', 647], ['bolt', 683], ['bag', 719], ['hr', 800], ['gear', 825]];
  const rail = () => `<aside class="tq-rail"><svg class="mk" viewBox="0 0 57 51" aria-hidden="true"><path d="${MARK}"/></svg>${RAIL.map(([k, y, c]) => k === 'hr' ? `<i class="hr" style="top:${y - 13}px"></i>` : `<span class="ri${c ? ' ' + c : ''}" style="top:${y - 13}px">${ic(k)}</span>`).join('')}<span class="col">${ic('left')}</span></aside>`;

  // ---------- page parts ----------
  const header = () => `<header class="tq-hd"><b class="cr">Topics</b>${ic('right', 'chv')}<span class="ws">Demo inv</span>${ic('right', 'chv')}<span class="cnt">13 topics · 23,109 calls</span>
    <span class="srch">Search topics...${ic('search')}</span><span class="seg vw"><i>Flow</i><i class="on">Landscape</i><i>Pulse</i></span></header>
    <div class="tq-sr"><span class="sel"><span class="l">Score</span><b>Satisfaction</b><span class="p">+2</span><svg viewBox="0 0 6 4" aria-hidden="true"><path d="M0 0h6L3 4z"/></svg></span>
      <p class="def">Equal-weight average of <b>Satisfaction</b>, <b>Silence time</b> and <b>Handle time</b> · 0–100, higher is better</p>
      <span class="vl">Version</span><span class="seg ver"><i>Current</i><i>Facelift</i><i>Refined</i><i class="on">Ultra</i></span></div>
    <div class="tq-kpis">
      <div class="tq-k"><h6>Calls</h6><div class="v"><b>23,109</b></div><p>13 topics · Sep 14 – Oct 13, 2026</p></div>
      <div class="tq-k"><h6>Average score</h6><div class="v"><b>51</b><span>/ 100</span></div><p>Call-weighted · ▼7 pts in 30 days<i class="dt"></i></p></div>
      <div class="tq-k gain"><h6>Most to gain</h6><div class="v"><b>+1.7</b><span>pts if lifted to the average</span></div><p><b>Flight Booking</b> · 4,879 calls at 43</p></div>
      <div class="tq-k"><h6>New topics</h6><div class="v"><b>4</b><span>of 13</span></div><p>Flight Booking · Ticket Changes &amp; Cancellations · Refunds &amp; Payments</p></div>
    </div>`;

  // tile content in the wide and the narrow layout: padding, title, calls, score size, "avg score", New pill place, kind
  const TS = {
    w: [[24, 17.8, 14, 59, 1, 'tr'], [18, 17.8, 14, 49, 1], [17, 15, 13.1, 47.5, 1], [17, 15, 13.1, 47.5, 1], [17, 15, 13.1, 40, 1, 'tr'], [11, 13.3, 12.5, 28, 1, 'tr'], [12, 13.3, 12, 28, 1], [12, 13.3, 12, 26, 0], [12, 13.3, 12, 0, 0], [8, 12, 0, 0, 0, 0, 'in']],
    n: [[18, 15, 13, 46, 0, 'br'], [18, 15, 13, 49, 1], [17, 15, 13, 41, 1], [17, 15, 13, 41, 1], [16, 15, 13, 36, 0, 'br'], [12, 13.3, 12, 26, 0, 'br'], [13, 13.3, 12, 0, 0], [10, 12, 0, 0, 0, 0, 'in'], [9, 0, 0, 0, 0, 0, 'only'], [9, 0, 0, 0, 0, 0, 'only']],
  };
  const tileBody = (i, m) => {
    const t = TOP[i], [p, ts, cs, ss, avg, pill, kind] = TS[m][i];
    if (kind === 'only') return `<div class="tb" style="padding:${p}px"><span class="only">${t.s}</span></div>`;
    const nm = `<b class="tt" style="font-size:${ts}px">${t.name.replace('&', '&amp;')}</b>`;
    if (kind === 'in') return `<div class="tb" style="padding:${p}px">${nm}<span class="inl">${n(t.calls)} · ${t.s}</span></div>`;
    const pl = t.nw && pill ? `<span class="new ${pill}">New</span>` : '';
    return `<div class="tb" style="padding:${p}px">${pill === 'tr' ? `<div class="th">${nm}${pl}</div>` : nm}<span class="cl" style="font-size:${cs}px">${n(t.calls)} calls</span>
      ${ss ? `<div class="sc"><b style="font-size:${ss}px">${t.s}</b>${avg ? '<span>avg score</span>' : ''}${pill === 'br' ? pl : ''}</div>` : ''}</div>`;
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

  const barsHTML = (hs, c) => hs.map(h => `<i><u style="height:${Math.max(1, h - .5)}px;background:${c || col((h + .5) / .37)}"></u></i>`).join('');
  const REF = s => (s * .37).toFixed(1);
  const rows = () => TOP.map((t, i) => `<div class="tq-r" data-i="${i}" style="top:${(i * 41.1).toFixed(1)}px"><div class="g">
      <div class="nm"><b>${t.name.replace('&', '&amp;')}</b><small>${n(t.calls)} calls</small></div>
      <div class="sp"><div class="bars">${barsHTML(t.bars)}</div><i class="ref" style="bottom:${REF(51)}px"></i></div>
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
    'the 4.4 min average and yielding a low score of 9.', 'Compared to other topics, Flight Booking has the', 'longest handle time and the poorest score,', 'marking it as a clear bottleneck. Next steps: (1)',
    'coach agents on streamlined verification and', 'fare-rule shortcuts; (2) enrich the knowledge', 'base with quick-reference guides for common', 'flight scenarios; (3) audit the call flow to',
    'eliminate redundant prompts or automate data', 'capture.'];
  const A2 = ['Set up alerts for: •Handle-time spikes on Flight', 'Booking (e.g., >5 min avg over 24 h); •Increasing', 'silence percentage (>4 % of call time); •Drop in',
    'post-call satisfaction (<4.0) for the same topic;', 'and •Rapid growth in call volume indicating an', 'emerging issue. These signals will flag the', 'problem before it impacts overall performance.'];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ans = (lines, cls) => `<div class="ans ${cls} hid">${lines.map(l => `<span>${esc(l)}</span>`).join('')}</div>`;
  const acts = cls => `<div class="acts ${cls} hid">${['tqUpv', 'tqDnv', 'tqRegen', 'tqCopy', 'tqVdots'].map(k => ic(k, k === 'tqVdots' ? 'vd' : '')).join('')}</div>`;
  const rel = (items, cls) => `<div class="rel ${cls} hid"><h6>Related</h6>${items.map(t => `<div class="ri">${t}${ic('tqArrow')}</div>`).join('')}</div>`;
  const panel = () => `<section class="tq-pn">
    <div class="ph"><span class="tile">${ic('spark')}</span><b>Ask AI</b><small class="st">New conversation</small>
      ${ic('tqClock', 'h1')}${ic('tqPen', 'h2')}${ic('tqExp', 'h3')}${ic('x', 'h4')}</div>
    <div class="chips"><span>Topics${ic('x')}</span><span>Project · Northwind</span></div>
    <div class="conv"><div class="scr">
      <div class="bub q1">What’s driving Handle time on “Flight<br>Booking”? (5.9 min · score 9)</div>
      <div class="think t1">${globe()}Thinking...</div>
      ${ans(A1, 'a1')}${acts('c1')}${rel(['Boosting satisfaction scores', 'Reducing silence time', 'Analyzing emerging topics'], 'r1')}
      <div class="bub q2 hid">Which signals should I set up to catch this<br>early?</div>
      <div class="think t2 hid">${globe()}Thinking...</div>
      ${ans(A2, 'a2')}${acts('c2')}${rel(['Handle time trend analysis', 'Agent coaching impact', 'Knowledge-base usage metrics'], 'r2')}
    </div></div>
    <div class="comp"><div class="tx"><span class="ph0">Ask anything about this page...</span><span class="ty"></span></div>
      ${ic('at', 'at')}${ic('tqSlash', 'sl')}<span class="slot" data-s="busy"><span class="mic">${ic('tqMic')}</span><span class="send">${ic('tqUp')}</span><span class="busy"><b></b><b></b><b></b></span></span></div>
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
      'Most to gain lights up Flight Booking, then its scores.',
      'Clicking its worst score, Handle time, opens Ask AI.',
      'The answer explains what drives the long handle time.',
      'A follow-up asks which signals would catch it early.',
    ],
    async run(c) {
      const { q, qa, app } = c, P = c.P;
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      const B = async (i, t0) => { await at(t0); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - t0 * 1000; };

      const root = q('.tq-root'), main = q('.tq-main'), area = q('.tq-area'), pn = q('.tq-pn');
      const T = qa('.tq-t'), R = qa('.tq-r'), gain = q('.tq-k.gain'), dsub = q('.tq-dy .sub');
      const tip = c.make('<div class="tq-tip"></div>'); P.cursor.append(tip);

      // ---------- layout: the main column's width drives the KPI row and the cards; the treemap re-tiles for it ----------
      let mode = 'w';
      const subLayout = (el, w, h) => {
        const p = w > 250 ? 14 : 10, top = p === 14 ? 47 : 40;
        el.querySelector('.dh').style.cssText = `left:${p}px;right:${p}px;top:${p === 14 ? 14 : 9}px`;
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
      const setW = w => {
        main.style.width = w + 'px'; pn.style.left = (78 + w + 14) + 'px';
        const nar = w < 1180; root.classList.toggle('nar', nar);
        tile();
      };
      setW(1348);

      // ---------- hover state: one call sets what the pointer is over ----------
      const row0 = R[0], b0 = row0.querySelector('.bars'), base0 = b0.innerHTML;
      const setTrend = k => {
        const nm = row0.querySelector('.nm small'), vv = row0.querySelector('.vv');
        if (k) {
          const [v, d, sw, bars, all] = TREND[k], name = PAR[0][PK.indexOf(k)][0], val = PAR[0][PK.indexOf(k)][1];
          nm.innerHTML = `<b>${name}</b> · ${val}`; vv.querySelector('b').textContent = v; vv.querySelector('small').textContent = d; vv.querySelector('.sw').style.background = sw;
          b0.innerHTML = barsHTML(bars, k === 'ht' ? '#ff6b55' : null); row0.querySelector('.ref').style.bottom = REF(all) + 'px';
          dsub.innerHTML = `Trend: <b>${name}</b> · height = score`; q('.tq-lg .atv').textContent = all; q('.tq-lg .at').style.left = ((all - 20) / 60 * 100).toFixed(2) + '%';
        } else {
          nm.textContent = '4,879 calls'; vv.querySelector('b').textContent = 43; vv.querySelector('small').textContent = '▼9 pts'; vv.querySelector('.sw').style.background = col(43);
          b0.innerHTML = base0; row0.querySelector('.ref').style.bottom = REF(51) + 'px';
          dsub.textContent = 'Height = average score, 0–100'; q('.tq-lg .atv').textContent = 51; q('.tq-lg .at').style.left = '51.67%';
        }
      };
      let trend = null;
      // o: { kpi, topic (index, opens it), row (Daily row lit), sub ('sat'|'sil'|'ht'), tip (html or '') }
      const hov = (o = {}) => {
        const hi = o.topic ?? (o.kpi ? 0 : o.row ?? null);
        gain.classList.toggle('hv', !!o.kpi);
        T.forEach((el, i) => {
          el.classList.toggle('dim', hi !== null && i !== hi);
          el.classList.toggle('tg', hi === i && (o.kpi || o.topic === i));
          el.classList.toggle('dr', o.topic === i && !!PAR[i]);
          el.querySelectorAll('.sb').forEach(s => s.classList.toggle('on', o.topic === i && s.dataset.p === o.sub));
        });
        R.forEach((el, i) => { el.classList.toggle('dim', hi !== null && i !== hi); el.classList.toggle('on', hi === i); });
        const tr = o.topic === 0 && o.sub ? o.sub : null;
        if (tr !== trend) { trend = tr; setTrend(tr); }
        tip.innerHTML = o.tip || ''; tip.classList.toggle('on', !!o.tip);
      };
      const FBt = { topic: 0, tip: tipTopic(0) }, FB = k => ({ topic: 0, sub: PK[k], tip: tipPar(0, k) });

      // ---------- the pointer: waypoints from the recording, [t, x, y] ----------
      const glide = (pts, ease) => {
        const t0 = pts[0][0], t1 = pts[pts.length - 1][0], [, x1, y1] = pts[pts.length - 1];
        P.cx = x1; P.cy = y1; P.place();
        if (c.ff) return;
        c.anim(P.cursor, pts.map(([t, x, y]) => ({ offset: (t - t0) / (t1 - t0), transform: `translate(${x}px,${y}px)` })), { duration: (t1 - t0) * 1000, easing: ease || 'linear' });
      };
      const press = () => { if (!c.ff) c.anim(P.cursor.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(.8)', offset: .4 }, { transform: 'scale(1)' }], { duration: 140, easing: 'ease-out' }); };
      const EIO = 'cubic-bezier(.45,0,.3,1)';

      // ---------- 1. Most to gain lights up Flight Booking; the topic opens into its parameters ----------
      await B(0, 0);
      glide([[0, 576, 134], [.33, 577, 149], [.47, 579, 166], [.6, 581, 179], [.7, 582, 186]]);
      await at(.7); glide([[.7, 582, 186], [1.4, 582, 188]]);
      await at(1.4); glide([[1.4, 582, 188], [1.5, 609, 188], [1.67, 657, 188], [1.8, 752, 188], [1.93, 830, 188], [2.07, 885, 189], [2.2, 915, 189], [2.27, 922, 189]]);
      await at(1.86); hov({ kpi: 1 });
      await at(4.23); c.cam([300, 450]);
      glide([[4.23, 922, 189], [4.3, 899, 201], [4.4, 849, 224], [4.47, 801, 246], [4.53, 708, 291], [4.6, 671, 308], [4.67, 544, 369], [4.73, 467, 405], [4.8, 433, 420], [4.83, 401, 435],
        [4.87, 374, 449], [4.93, 306, 481], [5, 290, 489], [5.03, 276, 496], [5.1, 254, 506], [5.2, 252, 507]]);
      await at(4.47); hov({});
      await at(4.63); hov({ topic: 2, tip: tipTopic(2) });
      await at(4.67); hov({ topic: 2, sub: 'sil', tip: tipPar(2, 1) });
      await at(4.73); hov({ topic: 2, sub: 'sat', tip: tipPar(2, 0) });
      await at(4.83); hov(FBt);
      await at(4.87); hov(FB(2));
      await at(4.97); hov(FB(0));
      await at(5.03); hov(FBt);
      await at(5.07); hov(FB(1));
      await at(6.23); glide([[6.23, 252, 507], [6.33, 244, 495], [6.43, 238, 486], [6.53, 220, 464], [6.63, 211, 451], [6.73, 206, 444]]);
      await at(6.33); hov(FBt);
      await at(6.43); hov(FB(0));
      await at(7.83); glide([[7.83, 206, 444], [7.93, 219, 448], [8.07, 253, 461], [8.13, 275, 469], [8.23, 299, 478], [8.27, 318, 485], [8.4, 331, 490], [8.5, 344, 496]]);
      await at(8.23); hov(FBt);
      await at(8.27); hov(FB(2));

      // ---------- 2. Handle time is clicked: the Ask AI panel slides in and the page narrows ----------
      await B(1, 8.6);
      await at(10.4); press();
      await at(10.47);
      q('.tq-rail .ai').classList.add('on');
      const W0 = 1348, W1 = 955, D = 250;
      if (c.ff) setW(W1);
      else for (let s = 0; ; s += 16) { const t = Math.min(1, s / D), e = 1 - Math.pow(1 - t, 4); setW(W0 + (W1 - W0) * e); if (t >= 1) break; await c.wait(16); }
      c.cam([1200, 400]);
      await at(11.9);
      const st = q('.ph .st');
      q('.t1').classList.add('hid'); st.textContent = 'What’s driving Handle time o...'; q('.ph .h3').classList.add('en');
      q('.slot').dataset.s = 'mic';
      [q('.a1'), q('.c1')].forEach(el => { el.classList.remove('hid'); c.enter(el, 'fade', { d: 150 }); });
      const r1 = q('.r1'); r1.classList.remove('hid');
      [...r1.children].forEach((el, k) => c.enter(el, 'fade', { d: 130, delay: k < 3 ? 0 : 40 }));

      // the pointer sweeps over to read the answer, passing over the treemap and the Daily card
      await at(12.63);
      glide([[12.63, 344, 496], [12.7, 363, 492], [12.83, 414, 480], [12.93, 501, 460], [13, 537, 451], [13.1, 669, 421], [13.23, 831, 383], [13.33, 974, 350], [13.43, 1051, 333], [13.5, 1137, 313], [13.6, 1187, 300], [13.67, 1206, 296]]);
      hov({ topic: 2, tip: tipTopic(2) });
      await at(12.67); hov({ topic: 2, sub: 'sil', tip: tipPar(2, 1) });
      await at(12.87); hov({ topic: 2, tip: tipTopic(2) });

      // ---------- 3. the answer is read ----------
      await B(2, 12.9);
      await at(12.93); hov({ topic: 3, tip: tipTopic(3) });
      await at(13.07); hov({ row: 3 });
      await at(13.2); hov({});
      c.cam([1200, 400]);
      await at(15.23); glide([[15.23, 1206, 296], [15.33, 1218, 305], [15.53, 1269, 337], [15.7, 1312, 366], [15.83, 1331, 377]]);
      await at(17.13); glide([[17.13, 1331, 377], [17.33, 1293, 401], [17.5, 1247, 430], [17.67, 1196, 461], [17.73, 1187, 467]]);
      await at(18.87); glide([[18.87, 1187, 467], [19.07, 1196, 524], [19.27, 1214, 666], [19.47, 1230, 773], [19.63, 1235, 812], [19.7, 1236, 816]]);
      c.cam([1200, 600]);

      // ---------- 4. the follow-up is typed and sent; the second answer scrolls into view ----------
      await B(3, 19.1);
      await at(20.1); press();
      const comp = q('.comp'), ty = q('.comp .ty'), ph0 = q('.comp .ph0'), slot = q('.slot');
      const Q = 'Which signals should I set up to catch this early?';
      let fade = null;
      for (let k = 1; k <= Q.length; k++) {
        await at(20.7 + (k - 1) * (2.63 / (Q.length - 1)));
        if (k === 1) {
          slot.dataset.s = 'send';
          if (!c.ff) { c.anim(slot.querySelector('.send'), [{ opacity: 0 }, { opacity: 1 }], { duration: 130 }); fade = c.anim(ph0, [{ opacity: 1 }, { opacity: 0 }], { duration: 2500, easing: 'linear', fill: 'forwards' }); }
          else ph0.style.opacity = 0;
        }
        const s = Q.slice(0, k);
        if (s.endsWith(' earl')) comp.classList.add('tw2');
        ty.innerHTML = comp.classList.contains('tw2') ? esc(Q.slice(0, 43)) + '<br>' + esc(s.slice(44)) : esc(s);
      }
      await at(23.93);
      ty.textContent = ''; comp.classList.remove('tw2');
      if (fade) fade.cancel(); ph0.style.opacity = 0;
      slot.dataset.s = 'busy'; q('.ph .h3').classList.remove('en');
      r1.classList.add('hid');
      const q2 = q('.q2'), t2 = q('.t2');
      q2.classList.remove('hid'); c.enter(q2, 'fade', { d: 150 });
      t2.classList.remove('hid'); c.enter(t2, 'fade', { d: 150 });
      await at(25.03);
      t2.classList.add('hid'); q('.ph .h3').classList.add('en');
      [q('.a2'), q('.c2')].forEach(el => { el.classList.remove('hid'); c.enter(el, 'fade', { d: 170 }); });
      await at(25.07);
      c.scroll(q('.scr'), 227, c.ff ? 0 : 230);
      await at(25.2);
      q('.c1').classList.add('hid');
      const r2 = q('.r2'); r2.classList.remove('hid');
      [...r2.children].forEach((el, k) => c.enter(el, 'fade', { d: 140, delay: k * 50 }));
      slot.dataset.s = 'mic';
      await at(25.67); glide([[25.67, 1236, 816], [25.83, 1237, 773], [26, 1238, 675], [26.13, 1240, 530], [26.3, 1241, 467]]);
      await at(27.63); glide([[27.63, 1241, 467], [28.13, 1187, 432]], EIO);
      await at(29.4); glide([[29.4, 1187, 432], [29.6, 1225, 451], [29.8, 1302, 488], [30, 1331, 503]]);
      await at(32.2);
    },
  });
})();
