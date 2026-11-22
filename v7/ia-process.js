/* v7 - ia-process: this section's behaviour. Loaded deferred, after the page's own scripts. */

// The eight-phase dial (owner, 22.11.2026: "the hand is stuck in place and it looks bad").
// All eight phases stand on one arc and the hand travels between them: it pulls back, is let go, passes the phase by a
// hair and settles. Ticks rise under it as it passes, the chip fills when it lands, and the centre reads whatever the hand
// points at. On first view the hand sweeps the whole arc once and the dial draws itself under it.
(() => {
  const sec = document.getElementById('process');
  if (!sec || !sec.hasAttribute('data-pz')) return;
  const ol = sec.querySelector('.phases'); if (!ol) return;
  const src = [...ol.children].map(li => { const h = li.querySelector('h3'), p = li.querySelector('p'), a = li.querySelector('a.pz-see'); if (a) a.tabIndex = -1; return { n: h ? h.textContent.trim() : '', t: p ? p.textContent.trim() : '', href: a ? a.getAttribute('href') : '', see: a ? a.textContent.trim() : '' }; });
  const N = src.length; if (N < 2) return;

  const NS = 'http://www.w3.org/2000/svg', D = Math.PI / 180;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = n => String(n).padStart(2, '0');
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const sv = (tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };
  const arrow = d => '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';

  /* ── the parts ── */
  const pz = el('div', 'pz');
  const face = sv('svg', { class: 'pz-face', 'aria-hidden': 'true', focusable: 'false' });
  const defs = sv('defs', {}), gFill = sv('linearGradient', { id: 'pz-gf', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0 }), gLine = sv('linearGradient', { id: 'pz-gl', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0 }), gShade = sv('linearGradient', { id: 'pz-gs', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0 });
  gFill.innerHTML = '<stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".5" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>';
  gLine.innerHTML = '<stop offset="0" stop-color="#171b20" stop-opacity=".1"/><stop offset=".7" stop-color="#171b20" stop-opacity="0"/>';
  gShade.innerHTML = '<stop offset="0" stop-color="#171b20" stop-opacity=".15"/><stop offset=".5" stop-color="#171b20" stop-opacity="0"/>';
  defs.append(gFill, gLine, gShade);
  const shade = sv('circle', { class: 'pz-shade', stroke: 'url(#pz-gs)' }), plate = sv('circle', { class: 'pz-plate', fill: 'url(#pz-gf)', stroke: 'url(#pz-gl)' });
  const track = sv('path', { class: 'pz-track' }), done = sv('path', { class: 'pz-done' }), gT = sv('g', { class: 'pz-ticks' });
  const ghosts = [0, 1, 2].map(() => sv('line', { class: 'pz-ghost' }));
  const hand = sv('g', { class: 'pz-hand' }), hLine = sv('path', { class: 'pz-hl' }), hHalo = sv('circle', { class: 'pz-hh' }), hDot = sv('circle', { class: 'pz-hd' });
  hand.append(hHalo, hLine, hDot); face.append(defs, shade, plate, track, done, gT, ...ghosts, hand);

  const stops = el('div', 'pz-stops'); stops.setAttribute('role', 'group'); stops.setAttribute('aria-label', 'Phases');
  const btns = src.map((p, i) => {
    const b = el('button', 'pz-stop'); b.type = 'button';
    b.append(el('span', 'pz-num', pad(i + 1)), el('span', 'pz-name', p.n));
    b.setAttribute('aria-label', 'Phase ' + (i + 1) + ' of ' + N + ': ' + p.n);
    b.addEventListener('click', () => go(i, true));
    stops.append(b); return b;
  });
  // the quiet clock: a thin ring closes around the chip the hand rests on, then the hand leaves
  const ring = sv('svg', { class: 'pz-ring', viewBox: '0 0 60 60', 'aria-hidden': 'true', focusable: 'false' });
  const rc = sv('circle', { cx: 30, cy: 30, r: 27, pathLength: 100 }); ring.append(rc);

  const core = el('div', 'pz-core'), read = el('div', 'pz-read'); read.setAttribute('aria-hidden', 'true');
  // a phase whose work is on this page carries one link to it; it comes in a moment after the hand has landed
  const items = src.map(p => {
    const d = el('div', 'pz-item'); d.append(el('h3', '', p.n), el('p', '', p.t.replace(/(\w)-(?=\w)/g, '$1‑'))); // compound words never break at their hyphen
    if (p.href) { const a = el('a', 'pz-link'); a.href = p.href; a.tabIndex = -1; a.innerHTML = '<span>See it on this page</span>' + arrow('M8 13V3M4 7l4-4 4 4'); a.addEventListener('click', () => stopAuto()); d.append(a); }
    read.append(d); return d;
  });
  const links = items.map(d => d.querySelector('.pz-link'));
  const ctl = el('div', 'pz-ctl');
  ctl.innerHTML = '<button type="button" data-d="-1" aria-label="Previous phase">' + arrow('M13 8H3M7 4 3 8l4 4') + '</button><span class="pz-count" aria-hidden="true"><b>' + pad(1) + '</b><i>/</i><span>' + pad(N) + '</span></span><button type="button" data-d="1" aria-label="Next phase">' + arrow('M3 8h10M9 4l4 4-4 4') + '</button>';
  const cnt = ctl.querySelector('b');
  const sr = el('p', 'pz-sr'); sr.setAttribute('aria-live', 'polite');
  core.append(read, ctl); pz.append(face, stops, core, sr); ol.before(pz); sec.classList.add('pz-on');

  /* ── geometry: one arc, eight stops. Wide: names stand outside the arc and the text sits in the bowl. Phone: a shallow arc, the text under it. ── */
  let G = null, ticks = [], trackLen = 0;
  const aOf = i => -G.TH + i * G.STEP;
  const f1 = v => v.toFixed(1);

  const layout = () => {
    const W = pz.clientWidth; if (!W) return false;
    const mode = W >= 900 ? 'wide' : W >= 720 ? 'mid' : 'small';
    const TH = mode === 'small' ? 64 : 84, chip = mode === 'small' ? 32 : 40;
    const side = mode === 'wide' ? 128 : mode === 'mid' ? 36 : chip / 2 + 4;
    const R = Math.min(mode === 'wide' ? 432 : mode === 'mid' ? 360 : 300, (W - 2 * side) / (2 * Math.sin(TH * D)));
    const top = mode === 'wide' ? 58 : chip / 2 + 8, A = R * (1 - Math.cos(TH * D));
    const tps = mode === 'small' ? 8 : 10;
    G = { W, mode, TH, R, STEP: 2 * TH / (N - 1), cx: W / 2, cy: top + R, top, A, chip, tps,
          rT: R - chip / 2 - 8, h1: chip / 2 + 6, h2: mode === 'small' ? 42 : mode === 'wide' ? 78 : 72, bulge: mode === 'small' ? 6 : 9, sig: (2 * TH / (N - 1)) * .2 };
    G.faceH = Math.ceil(top + A + chip / 2 + 10);
    pz.dataset.mode = mode; pz.style.setProperty('--chip', chip + 'px');
    face.setAttribute('viewBox', '0 0 ' + W + ' ' + G.faceH); face.setAttribute('width', W); face.setAttribute('height', G.faceH);
    const x0 = G.cx - R * Math.sin(TH * D), x1 = G.cx + R * Math.sin(TH * D), y0 = G.cy - R * Math.cos(TH * D);
    const d = 'M' + f1(x0) + ' ' + f1(y0) + 'A' + f1(R) + ' ' + f1(R) + ' 0 0 1 ' + f1(x1) + ' ' + f1(y0);
    track.setAttribute('d', d); done.setAttribute('d', d); trackLen = R * 2 * TH * D;
    const rp = R - G.h2 - 20, yP = G.cy - rp, yE = top + A + chip / 2;
    [gFill, gLine, gShade].forEach(gr => { gr.setAttribute('y1', f1(yP)); gr.setAttribute('y2', f1(yE)); });
    [plate, shade].forEach(c => { c.setAttribute('cx', G.cx); c.setAttribute('cy', f1(G.cy)); c.setAttribute('r', f1(rp)); });
    // ticks: a scale under the rim, eight to ten marks between two phases
    gT.textContent = ''; ticks = [];
    const K = (N - 1) * tps;
    for (let k = 0; k <= K; k++) {
      const a = -TH + k * (2 * TH / K), s = Math.sin(a * D), c = Math.cos(a * D);
      const len = k % tps === 0 ? (mode === 'small' ? 8 : 11) : k % (tps / 2) === 0 ? (mode === 'small' ? 7 : 9) : (mode === 'small' ? 4.5 : 6);
      const ln = sv('line', { x1: f1(G.cx + G.rT * s), y1: f1(G.cy - G.rT * c) });
      gT.append(ln); ticks.push({ a, s, c, len, h: 0, key: '', ln });
    }
    // the hand, drawn pointing straight up; it is turned about the centre of the arc
    const yT = G.cy - (R - G.h1), yB = G.cy - (R - G.h2), cx = G.cx;
    hLine.setAttribute('d', 'M' + f1(cx - .5) + ' ' + f1(yT) + 'L' + f1(cx + .5) + ' ' + f1(yT) + 'L' + f1(cx + 1.15) + ' ' + f1(yB) + 'L' + f1(cx - 1.15) + ' ' + f1(yB) + 'Z');
    hDot.setAttribute('cx', cx); hDot.setAttribute('cy', f1(yB)); hDot.setAttribute('r', mode === 'small' ? 3.6 : 4.4);
    hHalo.setAttribute('cx', cx); hHalo.setAttribute('cy', f1(yB)); hHalo.setAttribute('r', mode === 'small' ? 8 : 10);
    ghosts.forEach(g => { g.setAttribute('x1', cx); g.setAttribute('x2', cx); g.setAttribute('y1', f1(yT + 2)); g.setAttribute('y2', f1(yB)); });
    // stops and their names
    btns.forEach((b, i) => {
      const a = aOf(i), s = Math.sin(a * D), c = Math.cos(a * D);
      b.style.left = f1(G.cx + R * s) + 'px'; b.style.top = f1(G.cy - R * c) + 'px';
      const nm = b.children[1], off = chip / 2 + 15;
      nm.style.left = f1(chip / 2 + off * s) + 'px'; nm.style.top = f1(chip / 2 - off * c) + 'px';
      nm.style.translate = f1(-50 + 50 * s) + '% ' + f1(-50 - 50 * c) + '%';
    });
    place();
    return true;
  };
  // where the text stands: centred in the bowl when there is room, tucked under the hand on a phone.
  // Owner, 22.11.2026 night: "the title is tight to the margins". The name now starts 46px under the top of the bowl
  // (it was 2px), the hand is shorter so its dot never comes near the name, and the dial is a little larger.
  const place = () => {
    if (!G) return;
    core.style.paddingTop = '0px';
    const g = G, coreH = core.offsetHeight, yTop = g.top + g.h2 + (g.mode === 'small' ? 34 : 20 + (g.mode === 'wide' ? 46 : 38));
    let ty = yTop;
    if (g.mode === 'small') {
      const hH = items[0].firstChild.offsetHeight, limit = g.top + g.A + g.chip / 2 + 12;
      read.style.setProperty('--pz-gap', Math.max(10, Math.round(limit - ty - hH)) + 'px');
    } else {
      read.style.removeProperty('--pz-gap');
      const yBot = g.top + g.A + g.chip / 2;
      ty = yTop + Math.max(0, (yBot - yTop - coreH) * .46);
    }
    core.style.paddingTop = Math.round(ty) + 'px';
    pz.style.minHeight = g.faceH + 'px';
  };

  /* ── drawing one frame from the hand's angle ── */
  const hist = [], past = [], shown = [];
  const intro = { on: false, done: reduce, to: -999 };
  let prevA = 0;
  const render = (a, dt, now) => {
    const g = G;
    hand.setAttribute('transform', 'rotate(' + a.toFixed(3) + ' ' + g.cx + ' ' + f1(g.cy) + ')');
    const v = dt ? Math.abs(a - prevA) / dt * 1000 : 0; prevA = a;
    const fast = clamp((v - 14) / (g.STEP * 1.5), 0, 1);
    if (intro.on) intro.to = Math.max(intro.to, a);
    const lim = intro.done ? 999 : intro.to;
    done.style.strokeDasharray = f1(intro.on ? 0 : clamp((a + g.TH) / (2 * g.TH), 0, 1) * trackLen) + ' ' + f1(trackLen + 20); // the first sweep only draws the dial: no progress is shown and then taken back
    track.style.strokeDasharray = intro.done ? 'none' : f1(clamp((lim + g.TH) / (2 * g.TH), 0, 1) * trackLen) + ' ' + f1(trackLen + 20);
    let hot = false; const fall = dt ? Math.pow(.5, dt / 120) : 1;
    for (let i = 0; i < ticks.length; i++) {
      const t = ticks[i], d = (t.a - a) / g.sig, lens = Math.exp(-d * d);
      t.h = Math.max(t.h * fall, lens * fast); if (t.h < .004) t.h = 0; else hot = true;
      const L = t.len + g.bulge * Math.max(lens * .8, t.h);
      const base = t.a <= a + .01 ? .46 : .22, al = (base + (.85 - base) * lens) * (1 - t.h) + t.h, h = t.h;
      const col = 'rgba(' + Math.round(23 - 4 * h) + ',' + Math.round(27 + 132 * h) + ',' + Math.round(32 + 221 * h) + ',' + al.toFixed(2) + ')';
      const key = (L * 10 | 0) + col + (t.a <= lim + .01 ? 1 : 0);
      if (key !== t.key) {
        t.key = key; const r = g.rT - L;
        t.ln.setAttribute('x2', f1(g.cx + r * t.s)); t.ln.setAttribute('y2', f1(g.cy - r * t.c));
        t.ln.setAttribute('stroke', col); t.ln.style.opacity = t.a <= lim + .01 ? 1 : 0;
      }
    }
    // a short trail behind a fast hand
    for (let j = 0; j < 3; j++) {
      let ag = a; const want = now - 26 * (j + 1);
      for (let k = hist.length - 1; k >= 0; k--) { if (hist[k][0] <= want) { ag = hist[k][1]; break; } if (k === 0) ag = hist[0][1]; }
      const gap = (j + 1) * g.STEP * .085; if (Math.abs(a - ag) > gap) ag = a + (ag < a ? -gap : gap);
      const op = clamp(Math.abs(a - ag) / gap, 0, 1) * [.4, .24, .12][j];
      ghosts[j].setAttribute('transform', 'rotate(' + ag.toFixed(3) + ' ' + g.cx + ' ' + f1(g.cy) + ')'); ghosts[j].style.opacity = op.toFixed(2);
      if (op > .01) hot = true;
    }
    for (let i = 0; i < N; i++) {
      const p = aOf(i) < a - g.STEP * .35;
      if (p !== past[i]) { past[i] = p; btns[i].classList.toggle('is-past', p); }
      if (!shown[i] && (intro.done || (intro.on && a >= aOf(i) - 1.5))) { shown[i] = true; btns[i].classList.add('in'); }
    }
    return hot;
  };

  /* ── the hand's motion ── */
  const bez = (x1, y1, x2, y2) => t => { let u = t; for (let i = 0; i < 7; i++) { const w = 1 - u, x = 3 * w * w * u * x1 + 3 * w * u * u * x2 + u * u * u - t, dx = 3 * w * w * x1 + 6 * w * u * (x2 - x1) + 3 * u * u * (1 - x2); if (Math.abs(dx) < 1e-5) break; u = clamp(u - x / dx, 0, 1); } const w = 1 - u; return 3 * w * w * u * y1 + 3 * w * u * u * y2 + u * u * u; };
  const sweepEase = bez(.5, 0, .2, 1);
  let cur = 0, ang = 0, anim = null, raf = 0, lastT = 0, showI = 0;

  // o: { ant: pull-back in degrees, over: how far past the phase, dur: time to reach the phase, ease: a plain eased sweep, onLand, onDone }
  const move = (to, o) => {
    const from = ang, dir = to >= from ? 1 : -1, a0 = from - dir * (o.ant || 0), span = Math.abs(to - a0);
    const m = { from, to, dir, a0, span, t0: performance.now(), tA: o.ant ? 150 : 0, landed: false, o };
    if (o.ease) { m.ease = o.ease; m.tT = o.dur; m.tL = o.dur; m.tS = 0; m.over = 0; }
    else {
      // a spring let go from rest: how far it overshoots sets the damping, how long it takes to arrive sets the stiffness
      const f = clamp((o.over || 0) / span, .004, .2), ln = Math.log(f), z = -ln / Math.sqrt(Math.PI * Math.PI + ln * ln), q = Math.sqrt(1 - z * z);
      m.wd = (Math.PI - Math.acos(z)) / o.dur; m.z = z; m.q = q; m.w0 = m.wd / q;
      m.tL = o.dur; m.tT = Math.PI / m.wd; m.over = span * f; m.tS = 520;
    }
    anim = m;
    if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); }
  };
  const posAt = (m, t) => {
    if (t < m.tA) return m.from - m.dir * (m.from - m.a0) * m.dir * (1 - Math.cos(Math.PI * t / m.tA)) / 2;
    t -= m.tA;
    if (m.ease) return t >= m.tT ? m.to : m.a0 + (m.to - m.a0) * m.ease(t / m.tT);
    if (t < m.tT) return m.to - m.dir * m.span * Math.exp(-m.z * m.w0 * t) * (Math.cos(m.wd * t) + m.z / m.q * Math.sin(m.wd * t));
    t -= m.tT;
    if (t < m.tS) { const u = t / m.tS; return m.to + m.dir * m.over * Math.exp(-5.5 * u) * (Math.cos(7.854 * u) + .7 * Math.sin(7.854 * u)); } // starts with no speed, so the settle joins the swing without a jump
    return m.to;
  };
  const frame = now => {
    raf = 0; const dt = clamp(now - lastT, 1, 50); lastT = now;
    if (anim) {
      const m = anim, t = Math.max(0, now - m.t0); // a frame's own clock can start a hair before the move was asked for
      ang = posAt(m, t);
      if (!m.landed && t >= m.tA) {
        const i = clamp(Math.round((ang + G.TH) / G.STEP), 0, N - 1);
        if (i !== showI) { showI = i; mark(i, 'scan'); if (!intro.on && aOf(i) !== m.to) nudge(btns[i]); }
      }
      if (!m.landed && t >= m.tA + m.tL) { m.landed = true; if (m.o.onLand) m.o.onLand(); }
      if (anim === m && t >= m.tA + m.tT + m.tS) { ang = m.to; anim = null; if (m.o.onDone) m.o.onDone(); }
    }
    hist.push([now, ang]); if (hist.length > 14) hist.shift();
    const hot = render(ang, dt, now);
    if ((anim || hot) && !raf) raf = requestAnimationFrame(frame);
  };
  const still = () => { hist.length = 0; if (G) render(ang, 0, performance.now()); };

  /* ── what the centre and the chips do ── */
  const mark = (i, cls) => items.forEach((it, k) => { it.classList.remove('on', 'scan', 'dim'); if (k === i) it.classList.add(cls); if (links[k]) links[k].tabIndex = k === i && cls === 'on' ? 0 : -1; });
  const again = (e, cls) => { e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); };
  const nudge = b => again(b, 'pass');
  const rove = () => btns.forEach((b, i) => { if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); b.tabIndex = i === cur ? 0 : -1; });
  let said = false, lastN = 0;
  const depart = () => {
    btns.forEach(b => b.classList.remove('is-on', 'land'));
    ring.classList.remove('on'); if (ringAnim) { ringAnim.onfinish = null; ringAnim.cancel(); ringAnim = null; }
    mark(showI, 'dim');
  };
  const land = j => {
    showI = j; mark(j, 'on');
    btns.forEach((b, i) => b.classList.toggle('is-on', i === j));
    if (!reduce) again(btns[j], 'land');
    if (cnt.textContent !== pad(j + 1)) { cnt.style.setProperty('--d', j + 1 >= lastN ? 1 : -1); cnt.textContent = pad(j + 1); if (!reduce) again(cnt, 'roll'); }
    lastN = j + 1;
    if (said) sr.textContent = 'Phase ' + (j + 1) + ' of ' + N + ': ' + src[j].n + '. ' + src[j].t + (src[j].see ? ' ' + src[j].see + '.' : '');
  };
  const go = (j, user, focus) => {
    j = (j % N + N) % N;
    if (user) stopAuto();
    if (focus) btns[j].focus({ preventScroll: true });
    if (!G) return;
    if (intro.on || !intro.done) { intro.on = false; intro.done = true; pz.classList.add('pz-live'); }
    if (j === cur && (!anim || anim.to === aOf(j)) && btns[j].classList.contains('is-on')) return;
    cur = j; rove(); said = !!user;
    if (reduce) { anim = null; ang = aOf(j); land(j); still(); return; }
    depart();
    const steps = Math.abs(aOf(j) - ang) / G.STEP, k = Math.min(steps, 4), px = 180 / Math.PI / G.R * Math.sqrt(G.R / 410); // a pixel at the rim, in degrees; a small dial swings a little less
    move(aOf(j), { ant: (anim || user) ? 0 : (9 + 2 * k) * px, over: (8 + 2.5 * k) * px, dur: Math.min(1040, 330 + 100 * steps), onLand: () => land(j), onDone: dwell });
  };

  /* ── first view: the hand runs the whole arc once, the dial draws itself under it, and the hand comes home to 01 ── */
  const start = () => {
    if (intro.done || intro.on || !G) return;
    intro.on = true; pz.classList.add('pz-live'); ang = aOf(0); intro.to = ang; showI = 0; mark(0, 'scan'); hist.length = 0;
    move(aOf(N - 1), { ease: sweepEase, dur: 900, onDone: () => {
      intro.done = true;
      setTimeout(() => {
        if (!intro.on) return;
        const px = 180 / Math.PI / G.R * Math.sqrt(G.R / 410);
        move(aOf(0), { over: 12 * px, dur: 700, onLand: () => land(0), onDone: () => { intro.on = false; dwell(); } });
      }, 200);
    } });
  };

  /* ── it moves on by itself while it is in view and left alone; a thin ring on the chip shows how long it stays ── */
  let auto = !reduce, left = N + 1, ringAnim = null, hover = false, focused = false, inView = false;
  const DWELL = 3600;
  const held = () => hover || focused || !inView || document.hidden;
  const sync = () => { if (ringAnim) { if (held()) ringAnim.pause(); else ringAnim.play(); } };
  function dwell() {
    if (!auto || anim || !rc.animate) return;
    btns[cur].append(ring); void ring.offsetWidth; ring.classList.add('on');
    ringAnim = rc.animate([{ strokeDashoffset: 100 }, { strokeDashoffset: 0 }], { duration: DWELL, easing: 'linear', fill: 'forwards' });
    ringAnim.onfinish = () => { if (!auto) return; if (--left <= 0) { stopAuto(); return; } go(cur + 1); };
    sync();
  }
  function stopAuto() {
    if (!auto) return; auto = false;
    ring.classList.remove('on'); if (ringAnim) { ringAnim.onfinish = null; ringAnim.cancel(); ringAnim = null; }
  }

  /* ── hands on ── */
  stops.addEventListener('keydown', e => {
    const m = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (e.key in m) { e.preventDefault(); go(cur + m[e.key], true, true); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); go(e.key === 'Home' ? 0 : N - 1, true, true); }
  });
  ctl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(cur + +b.dataset.d, true); });
  ctl.addEventListener('keydown', e => { const m = { ArrowRight: 1, ArrowLeft: -1 }; if (e.key in m) { e.preventDefault(); go(cur + m[e.key], true); } });
  pz.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hover = true; sync(); } });
  pz.addEventListener('pointerleave', () => { hover = false; sync(); });
  pz.addEventListener('focusin', () => { focused = true; sync(); });
  pz.addEventListener('focusout', e => { if (!pz.contains(e.relatedTarget)) { focused = false; sync(); } });
  document.addEventListener('visibilitychange', sync);
  // a sideways swipe over the text steps a phase
  let sx = 0, sy = 0, sd = false;
  read.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sd = true; sx = e.clientX; sy = e.clientY; } });
  read.addEventListener('pointerup', e => { if (!sd) return; sd = false; const dx = e.clientX - sx, dy = e.clientY - sy; if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.5) go(cur + (dx < 0 ? 1 : -1), true); });
  read.addEventListener('pointercancel', () => { sd = false; });

  /* ── set up ── */
  const fit = () => {
    if (!layout()) return;
    ticks.forEach(t => { t.h = 0; });
    if (anim && !intro.on) { anim = null; ang = aOf(cur); land(cur); } else if (!anim) ang = aOf(cur);
    still();
  };
  rove(); mark(0, 'scan');
  if (reduce) { pz.classList.add('pz-live'); intro.done = true; }
  fit();
  if (reduce) land(0);
  let lastW = pz.clientWidth;
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { const w = pz.clientWidth; if (w !== lastW) { lastW = w; fit(); } else place(); }).observe(pz);
    new ResizeObserver(() => place()).observe(read);
  } else addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { es.forEach(e => { inView = e.isIntersecting; }); sync(); }, { threshold: .2 }).observe(pz);
    if (!reduce) { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); if (!G) fit(); start(); } }, { threshold: .5 }); io.observe(pz); }
  } else { inView = true; if (!reduce) start(); }
})();
