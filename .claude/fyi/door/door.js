/* FYI door: "Out of the glass". One timeline, rendered as a pure function of t, so it can play, jump and be shot. */
(() => {
  const root = document.getElementById('fyi');
  if (!root) return;
  const $ = (s, r = root) => r.querySelector(s), $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const stage = $('#stage'), stin = $('#stin'), ph = $('#ph'), phTilt = $('#phTilt'), view = $('#view'), roll = $('#roll');
  const rec = $('#rec'), recSh = $('#recSh'), recDisc = $('#recDisc'), pst = $('#pst'), tkt = $('#tkt'), tktIn = $('#tktIn');
  const wvBack = $('#wvBack'), wvFront = $('#wvFront'), ink = $('#ink'), hint = $('#hint'), sk = $('#sk'), bgCyan = $('.bg-cyan'), bgDots = $('.bg-dots');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MQ = matchMedia('(max-width:860px)');
  if (RM) root.classList.add('rm');

  /* ---- time */
  const BEATS = [[0, 3.8], [3.8, 8.15], [8.15, 12.9]];
  const END = BEATS[2][1];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const lerp = (a, b, p) => a + (b - a) * p;
  const out3 = x => 1 - Math.pow(1 - x, 3);
  const io = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const back = x => { const c1 = 1.55, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const bump = x => Math.sin(Math.PI * x);

  /* ---- thread parts */
  const rvs = $$('.rv').map(el => ({ el, at: +el.dataset.at }));
  const vts = $$('.vt').map(el => ({ el, at: +el.dataset.at }));
  const recAvs = $$('#recAv img').map((el, i) => ({ el, at: 7.6 + i * .13 }));
  const vnBars = $('#vnBars'), vnTime = $('#vnTime');
  const VN = 22, vnEls = [];
  for (let i = 0; i < VN; i++) {
    const b = document.createElement('i');
    const h = 4 + 16 * Math.abs(Math.sin(i * 1.7) * .62 + Math.sin(i * .63 + 1) * .38) * (.55 + .45 * Math.sin((i + 1) / (VN + 1) * Math.PI));
    b.style.height = h.toFixed(1) + 'px'; vnBars.appendChild(b); vnEls.push(b);
  }
  const trText = $('#trText');
  const words = trText.textContent.trim().split(/\s+/);
  trText.innerHTML = words.map(w => `<span>${w}</span>`).join(' ');
  const wordEls = $$('span', trText);
  const pollN = $('#pollN'), covB = $('#covB'), evSt = $('#evSt'), evDraft = $('#evDraft'), evLive = $('#evLive'), evPub = $('#evPub'), evN = $('#evN'), tktN = $('#tktN');
  const trks = $$('.trk-b');

  /* ---- geometry (stage px) */
  let S = 1, mobile = false, vh = 454, G = null, wave = null, inkEls = {};
  const box = el => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
  function rel(el) { const o = stin.getBoundingClientRect(), b = el.getBoundingClientRect(); return { x: (b.left - o.left) / S, y: (b.top - o.top) / S, w: b.width / S, h: b.height / S }; }

  function measure() {
    mobile = MQ.matches;
    if (!mobile) { const room = Math.max(0, Math.min(110, window.innerWidth - stage.getBoundingClientRect().right)); S = Math.min(1, (stage.clientWidth + room - 2) / 808); stin.style.transform = S < 1 ? `scale(${S})` : ''; stage.style.height = S < 1 ? (620 * S) + 'px' : ''; }
    else { S = 1; stin.style.transform = ''; stage.style.height = ''; }
    root.classList.add('measuring');
    roll.style.transform = 'none';
    vh = view.clientHeight; roll.style.setProperty('--vh', vh + 'px');
    const sr = stin.getBoundingClientRect();
    G = {
      W: stin.offsetWidth, H: stin.offsetHeight, ph: box(ph), vn: rel($('#vn')), thumbB: rel($('#thumbB')), evArt: rel($('#evArt')), card: rel($('.ev-c')), poll: rel($('#poll')),
      rec: box(rec), pst: box(pst), tkt: box(tkt), hint: box(hint),
      bleed: Math.max(0, Math.min(112, (window.innerWidth - sr.right) / S)),
      hx: parseFloat(getComputedStyle(rec).getPropertyValue('--hx')) || 0, hy: parseFloat(getComputedStyle(rec).getPropertyValue('--hy')) || 0, hs: parseFloat(getComputedStyle(rec).getPropertyValue('--hs')) || 1
    };
    root.classList.remove('measuring');
    buildWave(); buildInk(); buildSketch();
    render(T);
  }

  /* ---- the wave */
  function buildWave() {
    const pr = G.ph.x + G.ph.w;
    let x0, x1, cy, hMin, hMax, pow;
    if (!mobile) { x0 = G.vn.x + G.vn.w + 5; x1 = G.W + G.bleed - 4; cy = G.vn.y + G.vn.h / 2; hMin = 15; hMax = 300; pow = 1.22; }
    else { x0 = -14; x1 = G.W + 22; cy = G.ph.y - 34; hMin = 12; hMax = 178; pow = 1.5; }
    const bars = []; let x = x0, w = mobile ? 3.4 : 3, i = 0; const g = mobile ? 1.062 : 1.082;
    while (x + w < x1 && i < 60) {
      const u = (x - x0) / (x1 - x0);
      const f = .3 + .7 * Math.abs(Math.sin(i * 1.7 + .4) * .6 + Math.sin(i * .63 + 1.3) * .4);
      const h = Math.max(w * 1.6, (hMin + (hMax - hMin) * Math.pow(u, pow)) * f);
      bars.push({ x, w, h, front: mobile || x < pr + 1 });
      x += w * 1.74; w *= g; i++;
    }
    const N = bars.length;
    bars.forEach((b, k) => { b.at = .62 + 1.5 * (k / N); b.drip = (!mobile && (k === N - 3 || k === N - 6 || k === N - 8)) ? 22 + ((k * 37) % 30) : 0; });
    const defs = id => `<defs>
      <pattern id="pp${id}" patternUnits="userSpaceOnUse" width="720" height="360"><image href="a/paint-pink.jpg" width="720" height="360" preserveAspectRatio="none"/></pattern>
      <filter id="wr${id}" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
      ${id === 'b' ? halftone(x1, cy, hMax) : ''}</defs>`;
    const off = { c: [-4, 3.5], v: [3.5, -3], m: [0, 0] };
    const rects = (list, cls) => list.map(b => { const k = Math.min(1, b.w / 9), dx = off[cls][0] * k, dy = off[cls][1] * k, id = bars.indexOf(b);
      return `<rect class="${cls}" data-k="${id}" data-dy="${dy.toFixed(2)}" x="${(b.x + dx).toFixed(1)}" width="${b.w.toFixed(1)}" rx="${(b.w / 2).toFixed(1)}" y="${cy}" height="0"/>` + (b.drip ? `<rect class="${cls} dr" data-k="${id}" data-dy="${dy.toFixed(2)}" x="${(b.x + dx + b.w * .22).toFixed(1)}" width="${(b.w * .3).toFixed(1)}" rx="${(b.w * .15).toFixed(1)}" y="${cy}" height="0"/>` : ''); }).join('');
    const group = (list, id) => `${defs(id)}<g filter="url(#wr${id})" ${id === 'b' ? 'mask="url(#wmb)"' : ''}>
      <g fill="#22cdf0">${rects(list, 'c')}</g>
      <g fill="#7a2cff">${rects(list, 'v')}</g>
      <g fill="url(#pp${id})">${rects(list, 'm')}</g></g>`;
    wvBack.innerHTML = group(bars.filter(b => !b.front), 'b');
    wvFront.innerHTML = group(bars.filter(b => b.front), 'f');
    bars.forEach((b, k) => { b.els = $$(`rect[data-k="${k}"]:not(.dr)`, stin); b.drs = $$(`rect.dr[data-k="${k}"]`, stin); });
    wave = { bars, cy, x0, x1 };
  }
  function halftone(x1, cy, hMax) {
    const zone = 250, xs = x1 - zone, pitch = 8.5; let c = '';
    for (let r = 0, y = cy - hMax / 2 - 14; y < cy + hMax / 2 + 70; y += pitch * .866, r++)
      for (let x = xs + (r % 2 ? pitch / 2 : 0); x < x1 + pitch; x += pitch) {
        const u = clamp((x - xs) / zone), rad = pitch * .78 * Math.pow(1 - u, .62);
        if (rad > .35) c += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(2)}"/>`;
      }
    return `<mask id="wmb" maskUnits="userSpaceOnUse" x="-200" y="${cy - 400}" width="${x1 + 400}" height="800"><rect x="-200" y="${cy - 400}" width="${xs + 201}" height="800" fill="#fff"/><g fill="#fff">${c}</g></mask>`;
  }

  /* ---- ink */
  function arrow(x1, y1, x2, y2, bend, head = 11) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, c1x = lerp(x1, x2, .3) + nx * bend * 1.1, c1y = lerp(y1, y2, .3) + ny * bend * 1.1, c2x = lerp(x1, x2, .72) + nx * bend * .8, c2y = lerp(y1, y2, .72) + ny * bend * .8;
    const a = Math.atan2(y2 - c2y, x2 - c2x), h = (d) => `${(x2 - Math.cos(a + d) * head).toFixed(1)} ${(y2 - Math.sin(a + d) * head).toFixed(1)}`;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}M${h(.5)}L${x2.toFixed(1)} ${y2.toFixed(1)}L${h(-.42)}`;
  }
  function buildInk() {
    const pr = G.ph.x + G.ph.w, P = [];
    const add = (id, d, cls = '') => P.push(`<path id="ink-${id}" class="${cls}" pathLength="1" d="${d}"/>`);
    if (!mobile) {
      const cy = G.vn.y + G.vn.h / 2;
      add('hint', arrow(G.hint.x - 4, G.hint.y + G.hint.h * .62, pr + 9, cy + 6, -16));
      const disc = { x: G.rec.x + G.rec.w * .68, y: G.rec.y + G.rec.h * .5 - G.rec.h * .9 * .44 - G.rec.w * .45 };
      const ty = G.thumbB.y + G.thumbB.h * .5 - vh;                  // measured with the roll at 0, so it sits one page lower
      add('rec', arrow(pr + 10, ty, disc.x - 6, disc.y - 12, -26));
      const ey = G.card.y + G.card.h * .16 - 2 * vh;
      add('pst', arrow(pr + 10, ey, G.pst.x - 4, G.pst.y + 34, -20));
      const t = G.tkt, cx = t.x + t.w * .44, cy2 = t.y + t.h * .5, rx = t.w * .55, ry = t.h * .66;
      add('tkt', `M${cx - rx * .9} ${cy2 + ry * .2}C${cx - rx * 1.05} ${cy2 - ry * .9} ${cx + rx * .2} ${cy2 - ry * 1.25} ${cx + rx * .92} ${cy2 - ry * .55}C${cx + rx * 1.3} ${cy2 + ry * .1} ${cx + rx * .7} ${cy2 + ry * 1.05} ${cx - rx * .1} ${cy2 + ry * 1.02}C${cx - rx * .8} ${cy2 + ry} ${cx - rx * 1.12} ${cy2 + ry * .3} ${cx - rx * .8} ${cy2 - ry * .35}`);
    } else {
      const bx = G.vn.x + G.vn.w * .62, by = G.vn.y - 4;
      add('up', arrow(bx, by, bx + 34, G.ph.y + 22, 14, 9), 'pk');
      add('hint', arrow(G.hint.x + 18, G.hint.y + 4, G.vn.x + 22, G.vn.y + G.vn.h + 7, -14, 9), 'pk');
    }
    ink.innerHTML = `<defs><filter id="inkr" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.6"/></filter></defs><g filter="url(#inkr)">${P.join('')}</g>`;
    inkEls = {}; $$('path', ink).forEach(p => inkEls[p.id.slice(4)] = p);
  }
  /* ---- the plan in ink: each thing has its place before it exists */
  function buildSketch() {
    const P = [], f = n => n.toFixed(1);
    const boxLines = (x, y, w, h, o = 7) => `M${f(x - o)} ${f(y + 1)}L${f(x + w + o * .6)} ${f(y - 1)}M${f(x + w + 1)} ${f(y - o)}L${f(x + w - 1)} ${f(y + h + o * .7)}M${f(x + w + o * .8)} ${f(y + h)}L${f(x - o * .5)} ${f(y + h + 1.5)}M${f(x - 1)} ${f(y + h + o)}L${f(x + 1)} ${f(y - o * .6)}`;
    const zig = (x, y, w, a, n) => { let d = `M${f(x)} ${f(y)}`; for (let i = 1; i <= n; i++) d += `L${f(x + w * i / n)} ${f(y + (i % 2 ? -a : a))}`; return d; };
    const g = (b, deg, d) => P.push(`<g transform="rotate(${deg} ${f(b.x + b.w / 2)} ${f(b.y + b.h / 2)})"><path d="${d}"/></g>`);
    // wave
    let d = '', first = true;
    for (const b of wave.bars) { if (!mobile && b.front) continue; const x = b.x + b.w / 2; d += `${first ? 'M' : 'L'}${f(x - b.w * .3)} ${f(wave.cy - b.h / 2 - 3)}L${f(x + b.w * .3)} ${f(wave.cy + b.h / 2 + 3)}`; first = false; }
    P.push(`<path d="${d}"/>`);
    // record: sleeve and disc
    const r = G.rec, cx = r.x + r.w * .5 + r.w * .9 * .2, cy = r.y + r.h * .5 - r.h * .9 * .44, R = r.w * .45;
    g(r, -7, boxLines(r.x, r.y, r.w, r.h) + `M${f(cx - R)} ${f(cy)}a${f(R)} ${f(R)} 0 1 1 ${f(2 * R)} 0a${f(R)} ${f(R)} 0 1 1 ${f(-2 * R + 3)} ${f(-5)}M${f(cx - R * .36)} ${f(cy)}a${f(R * .36)} ${f(R * .36)} 0 1 1 ${f(R * .72)} 0a${f(R * .36)} ${f(R * .36)} 0 1 1 ${f(-R * .72 + 2)} -2`);
    // poster: picture box, title, details
    const p = G.pst, m = p.w * .04, ih = p.h * .58;
    g(p, 3, boxLines(p.x, p.y, p.w, p.h) + boxLines(p.x + m, p.y + m, p.w - 2 * m, ih, 3) + `M${f(p.x + m)} ${f(p.y + m)}L${f(p.x + p.w - m)} ${f(p.y + m + ih)}M${f(p.x + p.w - m)} ${f(p.y + m)}L${f(p.x + m)} ${f(p.y + m + ih)}`
      + zig(p.x + m * 1.5, p.y + p.h * .71, p.w * .72, p.h * .022, 13) + zig(p.x + m * 1.5, p.y + p.h * .79, p.w * .5, p.h * .022, 9) + `M${f(p.x + m * 1.5)} ${f(p.y + p.h * .9)}h${f(p.w * .26)}M${f(p.x + p.w * .4)} ${f(p.y + p.h * .9)}h${f(p.w * .22)}`);
    // ticket
    const t = G.tkt;
    g(t, -9, `M${f(t.x + 8)} ${f(t.y + 6)}H${f(t.x + t.w - 6)}V${f(t.y + t.h - 6)}H${f(t.x + 6)}Z` + `M${f(t.x + t.w * .72)} ${f(t.y + 10)}v8m0 6v8m0 6v8m0 6v8`);
    sk.innerHTML = `<defs><filter id="skr" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".014" numOctaves="2" seed="11" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter></defs><g filter="url(#skr)">${P.join('')}</g>`;
  }
  const inkSet = (id, d, o = 1) => { const p = inkEls[id]; if (p) { p.style.setProperty('--d', d.toFixed(3)); p.style.setProperty('--o', o.toFixed(3)); } };

  /* ---- render */
  let T = 0, lastN = -1, lastVotes = -1, lastBeat = -1;
  function render(t) {
    if (!G) return;
    T = t;
    const beat = t <= 0 ? 0 : t <= BEATS[1][0] ? 1 : t <= BEATS[2][0] ? 2 : 3;
    if (beat !== lastBeat) { root.dataset.beat = beat; trks.forEach((b, i) => b.setAttribute('aria-current', String(i + 1 === beat))); lastBeat = beat; }
    trks.forEach((b, i) => b.style.setProperty('--f', seg(t, BEATS[i][0], BEATS[i][1]).toFixed(3)));

    // thread
    const sc = io(seg(t, 3.8, 4.5)) + io(seg(t, 8.15, 8.85));
    roll.style.transform = `translate3d(0,${(-vh * sc).toFixed(1)}px,0)`;
    for (const r of rvs) r.el.style.setProperty('--p', out3(seg(t, r.at, r.at + .38)).toFixed(3));
    for (const v of vts) { v.el.style.setProperty('--p', seg(t, v.at, v.at + .12).toFixed(2)); v.el.style.setProperty('--pb', back(seg(t, v.at, v.at + .34)).toFixed(3)); }
    const vp = seg(t, .5, 2.45);
    root.classList.toggle('is-voice', t > .38 && t < 2.5);
    vnEls.forEach((b, i) => b.classList.toggle('on', (i + .5) / VN < vp));
    const sec = t > .38 && t < 2.5 ? Math.round(21 * vp) : 21;
    const lab = '0:' + String(sec).padStart(2, '0'); if (vnTime.textContent !== lab) vnTime.textContent = lab;
    wordEls.forEach((w, i) => w.style.setProperty('--w', seg(t, 1.65 + i * (.95 / wordEls.length), 1.8 + i * (.95 / wordEls.length)).toFixed(2)));
    const votes = vts.filter(v => t >= v.at + .1).length;
    if (votes !== lastVotes) { pollN.textContent = `Poll · ${votes} vote${votes === 1 ? '' : 's'}`; lastVotes = votes; }
    covB.style.setProperty('--win', seg(t, 6.55, 6.8).toFixed(2));
    evPub.style.setProperty('--press', (1 - .14 * bump(seg(t, 9.8, 10.05))).toFixed(3));
    const live = seg(t, 10, 10.2);
    evDraft.style.opacity = (1 - live).toFixed(2); evLive.style.opacity = live.toFixed(2);
    const pub = t >= 10.02; if (evSt.classList.contains('pub') !== pub) { evSt.classList.toggle('pub', pub); evSt.textContent = pub ? 'Public' : 'Draft'; }
    const n = Math.round(4 + 23 * out3(seg(t, 11.25, 12.5)));
    if (n !== lastN) { evN.textContent = n; tktN.textContent = n; lastN = n; }

    // wave
    for (const b of wave.bars) {
      const p = back(seg(t, b.at, b.at + .44)), h = Math.max(0, b.h * p), d = b.drip ? (p > .9 ? out3(seg(t, b.at + .35, b.at + 1.3)) * b.drip + b.w * .6 : 0) : 0;
      if (b.h0 !== h) { b.h0 = h; for (const e of b.els) { e.setAttribute('y', (wave.cy - h / 2 + +e.dataset.dy).toFixed(1)); e.setAttribute('height', h.toFixed(1)); } }
      if (b.drip && b.d0 !== d) { b.d0 = d; const y0 = wave.cy + b.h / 2 - b.w * .6; for (const e of b.drs) { e.setAttribute('y', (y0 + +e.dataset.dy).toFixed(1)); e.setAttribute('height', d.toFixed(1)); } }
    }
    wvFront.style.opacity = mobile ? 1 : (1 - seg(t, 3.8, 4.1)).toFixed(2);
    bgCyan.style.setProperty('--on', io(seg(t, .7, 2.2)).toFixed(3));
    bgDots.style.setProperty('--on', io(seg(t, 10.9, 11.7)).toFixed(3));

    // record
    const e1 = seg(t, 6.75, 7.6), e2 = io(seg(t, 10.0, 10.95));
    const src = { x: G.thumbB.x, y: G.thumbB.y - vh, w: G.thumbB.w }, hero = { x: G.rec.x + G.hx, y: G.rec.y + G.hy, w: G.rec.w * G.hs };
    const f1 = out3(e1), fs = back(e1);
    let rx = lerp(src.x, hero.x, f1), ry = lerp(src.y, hero.y, f1) - bump(e1) * 26, rw = lerp(src.w, hero.w, clamp(fs, 0, 1.2));
    rx = lerp(rx, G.rec.x, e2); ry = lerp(ry, G.rec.y, e2); rw = lerp(rw, G.rec.w, e2);
    rec.style.transform = `translate3d(${(rx - G.rec.x).toFixed(1)}px,${(ry - G.rec.y).toFixed(1)}px,0) scale(${(rw / G.rec.w).toFixed(4)})`;
    rec.style.visibility = t >= 6.75 ? 'visible' : 'hidden';
    rec.style.setProperty('--lift', out3(seg(t, 6.75, 7.5)).toFixed(3));
    rec.style.setProperty('--out', back(seg(t, 7.4, 8.05)).toFixed(3));
    rec.style.setProperty('--inkp', io(seg(t, 7.55, 8.15)).toFixed(3));
    for (const a of recAvs) { a.el.style.setProperty('--p', seg(t, a.at, a.at + .1).toFixed(2)); a.el.style.setProperty('--pb', back(seg(t, a.at, a.at + .36)).toFixed(3)); }

    // poster
    const pf = seg(t, 10.15, 10.9), pe = out3(pf), pt = io(seg(t, 10.95, 11.3));
    const ps = { x: G.evArt.x, y: G.evArt.y - 2 * vh, w: G.evArt.w }, land = { x: G.pst.x + (mobile ? 0 : 14), y: G.pst.y - 8, w: G.pst.w * 1.04 };
    const qx = lerp(lerp(ps.x, land.x, pe), G.pst.x, pt), qy = lerp(lerp(ps.y, land.y, pe) - bump(pf) * 34, G.pst.y, pt), qw = lerp(lerp(ps.w, land.w, clamp(back(pf), 0, 1.2)), G.pst.w, pt);
    pst.style.transform = `translate3d(${(qx - G.pst.x).toFixed(1)}px,${(qy - G.pst.y).toFixed(1)}px,0) scale(${(qw / G.pst.w).toFixed(4)})`;
    pst.style.visibility = t >= 10.15 ? 'visible' : 'hidden';
    pst.classList.toggle('fly', t < 10.94);
    pst.style.setProperty('--r', lerp(lerp(0, 6, pe), 3, pt).toFixed(2) + 'deg');
    pst.style.setProperty('--lift', (out3(seg(t, 10.15, 10.6)) * (1 - pt)).toFixed(3));

    // ticket
    const tp = seg(t, 11.2, 11.62), tb = back(tp);
    tktIn.style.transform = `scale(${lerp(.25, 1, tb).toFixed(3)}) rotate(${lerp(-34, -9, tb).toFixed(2)}deg)`;
    tkt.style.visibility = t >= 11.2 ? 'visible' : 'hidden';
    tktIn.style.opacity = seg(t, 11.2, 11.3).toFixed(2);

    // ink and the invitation
    const rest = 1 - seg(t, .05, .4);
    hint.style.opacity = rest.toFixed(2); hint.style.pointerEvents = rest > .5 ? '' : 'none';
    inkSet('hint', 1, rest);
    inkSet('rec', io(seg(t, 6.6, 7.0)), 1 - seg(t, 8.15, 8.4));
    inkSet('pst', io(seg(t, 11.3, 11.8)));
    inkSet('tkt', io(seg(t, 12.0, 12.6)));
    inkSet('up', io(seg(t, 1.2, 1.7)), 1 - seg(t, 3.8, 4.1));
  }

  /* ---- playing */
  let raf = 0, stopAt = END, last = 0, playing = false;
  function tick(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    let t = T + dt;
    if (t >= stopAt) { t = stopAt; playing = false; }
    render(t);
    if (playing) raf = requestAnimationFrame(tick);
  }
  function play(from, to) {
    cancelAnimationFrame(raf);
    if (RM) { render(to); return; }
    stopAt = to; playing = true; render(from); last = performance.now(); raf = requestAnimationFrame(tick);
  }
  function jump(from, to) {
    cancelAnimationFrame(raf); playing = false;
    if (RM) { render(to); return; }
    if (Math.abs(T - from) < .02) { play(from, to); return; }
    stin.classList.add('cut');
    setTimeout(() => { render(from); void stin.offsetWidth; stin.classList.remove('cut'); setTimeout(() => play(from, to), 140); }, 170);
  }
  trks.forEach((b, i) => b.addEventListener('click', () => { started = true; jump(BEATS[i][0], BEATS[i][1]); }));
  const trk = $('.trk');
  let drag = null;
  const tAt = x => { const r = trk.getBoundingClientRect(), u = clamp((x - r.left) / r.width, 0, .9999) * 3, i = Math.floor(u); return lerp(BEATS[i][0], BEATS[i][1], u - i); };
  trk.addEventListener('pointerdown', e => { drag = { x: e.clientX, on: false, id: e.pointerId }; });
  trk.addEventListener('pointermove', e => {
    if (!drag) return;
    if (!drag.on && Math.abs(e.clientX - drag.x) > 6) { drag.on = true; trk.setPointerCapture(drag.id); cancelAnimationFrame(raf); playing = false; started = true; root.classList.add('is-scrub'); }
    if (drag.on) render(tAt(e.clientX));
  });
  const dragEnd = () => { if (drag && drag.on) { root.classList.remove('is-scrub'); skipClick = true; setTimeout(() => skipClick = false, 0); } drag = null; };
  trk.addEventListener('pointerup', dragEnd); trk.addEventListener('pointercancel', dragEnd);
  let skipClick = false;
  trk.addEventListener('click', e => { if (skipClick) { e.stopPropagation(); e.preventDefault(); } }, true);
  const playAll = () => { started = true; jump(0, END); };
  hint.addEventListener('click', playAll);
  $('#vnPlay').addEventListener('click', playAll);

  /* ---- depth under the pointer: a spring */
  const dps = $$('.dp', stin).map(el => ({ el, d: +el.dataset.depth || 0 }));
  const sp = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, on: false, raf: 0, last: 0 };
  function springTick(now) {
    const dt = Math.min(.032, (now - sp.last) / 1000); sp.last = now;
    const k = sp.on ? 110 : 15, c = sp.on ? 21 : 4.6;
    for (let i = 0; i < 2; i++) {                                    // two sub-steps keep the stiff spring stable
      const h = dt / 2;
      sp.vx += (k * (sp.tx - sp.x) - c * sp.vx) * h; sp.x += sp.vx * h;
      sp.vy += (k * (sp.ty - sp.y) - c * sp.vy) * h; sp.y += sp.vy * h;
    }
    applyDepth();
    const still = !sp.on && Math.abs(sp.x) < .001 && Math.abs(sp.y) < .001 && Math.abs(sp.vx) < .001 && Math.abs(sp.vy) < .001;
    if (still) { sp.x = sp.y = 0; applyDepth(); sp.raf = 0; } else sp.raf = requestAnimationFrame(springTick);
  }
  function applyDepth() {
    const calm = Math.abs(sp.vx) + Math.abs(sp.vy) < .04;
    for (const o of dps) { const x = sp.x * o.d, y = sp.y * o.d * .7; o.el.style.translate = (o.el === ph && calm) ? `${Math.round(x)}px ${Math.round(y)}px` : `${x.toFixed(2)}px ${y.toFixed(2)}px`; }
    recSh.style.translate = `${(-sp.x * 16).toFixed(2)}px ${(-sp.y * 11).toFixed(2)}px`;
    recDisc.style.translate = `${(-sp.x * 5).toFixed(2)}px ${(-sp.y * 4).toFixed(2)}px`;
  }
  const kick = () => { if (!sp.raf) { sp.last = performance.now(); sp.raf = requestAnimationFrame(springTick); } };
  if (!RM && matchMedia('(hover:hover)').matches) {
    root.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      const r = root.getBoundingClientRect();
      sp.tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
      sp.ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
      sp.on = true; kick();
    });
    root.addEventListener('pointerleave', () => { sp.on = false; sp.tx = sp.ty = 0; kick(); });
  }

  /* ---- start */
  const q = new URLSearchParams(location.search);
  let started = false;
  const ready = () => {
    measure();
    if (q.has('t')) { started = true; render(q.get('t') === 'end' ? END : +q.get('t')); return; }
    if (RM) { started = true; render(END); return; }
    render(0);
    if (q.get('auto') === '0') return;
    const obs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting) && !started) { started = true; obs.disconnect(); setTimeout(() => play(0, END), 700); } }, { threshold: .55 });
    obs.observe(stage);
  };
  let rz = 0;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measure, 120); });
  MQ.addEventListener('change', () => measure());
  const imgs = $$('img').filter(i => !i.complete).map(i => new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }));
  Promise.all([document.fonts ? document.fonts.ready : 0, ...imgs]).then(ready);

  window.__door = { seek: t => { cancelAnimationFrame(raf); playing = false; started = true; render(t); }, play: (a = 0, b = END) => { started = true; play(a, b); }, measure, END, BEATS, point: (x, y, on = true) => { sp.tx = x; sp.ty = y; sp.on = on; kick(); } };
})();
