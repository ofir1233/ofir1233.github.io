/* v7 - Topics (work/topics.html): the same sticky stage as the Introduction (v7/intro.css, v7/topics-story.css).
   Thirteen shapes carry the whole story: rows of a table of calls, then the topics as boxes sized by calls and shaded by score,
   then the one with the most to gain, then the corner of the screen Ask AI answers beside. Demo data, from the Lab's Topics screen. */
(() => {
  const sv = document.getElementById('in-sv');
  if (!sv) return;
  const stage = sv.parentElement, steps = [...document.querySelectorAll('.in-st')], meter = stage.querySelector('.in-meter');
  const mk = (tag, cls, id) => { const e = document.createElement(tag); e.className = cls; if (id) e.id = id; sv.append(e); return e; };

  /* the topics: name, calls, score (the equal-weight average of satisfaction, silence time and handle time) */
  const T = [['Online Booking', 4412, 43], ['Trip Status', 3968, 63], ['E-ticket Delivery', 2451, 72], ['Itinerary Questions', 2377, 43],
    ['Changes & Cancellations', 2206, 34], ['Refunds & Credits', 1583, 36], ['Schedule Changes', 1329, 63], ['Seating & Extras', 1061, 49],
    ['Accessibility Requests', 873, 44], ['Complaints & Follow-up', 702, 72], ['Baggage', 640, 52], ['Loyalty Points', 388, 41], ['Payment Issues', 160, 34]];
  const shade = s => s < 40 ? 'q1' : s < 50 ? 'q2' : s < 60 ? 'q3' : s < 70 ? 'q4' : 'q5';
  const BX = T.map(([n, c, s], i) => { const e = mk('div', 'in-bx ' + shade(s), 'x' + i);
    e.innerHTML = '<b>' + n.replace('&', '&amp;') + '</b><small>' + c.toLocaleString('en-US') + ' calls</small><em>' + s + '</em>'; return e; });
  const OPS = ['List · a sort', 'Flow · a view', 'Circles · a toggle', 'Boxes · chosen'].map((t, i) => { const e = mk('div', 'in-op' + (i === 3 ? ' on' : ''), 'o' + i); e.textContent = t; return e; });
  const LB = Array.from({ length: 4 }, (_, i) => mk('div', 'in-lb', 'b' + i));
  const W = ['tw', 'sp', 'ap'].map(id => document.getElementById(id));

  /* a squarified treemap of the topics inside one rectangle, 3px between boxes */
  const tree = (x, y, w, h) => {
    const total = T.reduce((a, t) => a + t[1], 0), A = T.map(t => t[1] * w * h / total), out = [];
    const worst = (r, l) => { const s = r.reduce((a, b) => a + b, 0); return Math.max(l * l * Math.max(...r) / (s * s), s * s / (l * l * Math.min(...r))); };
    const lay = r => { const s = r.reduce((a, b) => a + b, 0);
      if (w >= h) { const cw = s / h; let yy = y; r.forEach(a => { out.push([x, yy, cw, a / cw]); yy += a / cw; }); x += cw; w -= cw; }
      else { const rh = s / w; let xx = x; r.forEach(a => { out.push([xx, y, a / rh, rh]); xx += a / rh; }); y += rh; h -= rh; } };
    let row = [], i = 0;
    while (i < A.length) { const l = Math.min(w, h); if (!row.length || worst([...row, A[i]], l) <= worst(row, l)) row.push(A[i++]); else { lay(row); row = []; } }
    if (row.length) lay(row);
    return out.map(([a, b, c, d]) => [a + 1.5, b + 1.5, Math.max(0, c - 3), Math.max(0, d - 3)]);
  };
  const boxes = (o, x, y, w, h, fade) => tree(x, y, w, h).forEach((r, i) => {
    /* a name needs room for two lines, its calls and the score; a narrow box keeps only the score, a sliver nothing */
    const size = r[2] < 34 || r[3] < 30 ? 'mini ' : r[2] < 92 || r[3] < 74 ? 'tiny ' : '';
    o['x' + i] = [...r, fade && !fade.includes(i) ? .28 : 1, 0, size + (fade && fade.includes(i) ? 'lit' : '')]; });

  /* each step: {id: [x, y, w, h, opacity, rotate, class]}, labels [{t, x, y}], tags {box index: words on the box} */
  const S = [];
  // 1. a table of calls: the same thirteen shapes are its rows, and nothing says which topic a call is
  S[0] = (() => { const o = { tw: [60, 52, 480, 404, 1] };
    BX.forEach((b, i) => { o[b.id] = [74, 86 + i * 27, 452, 19, 1, 0, 'row']; });
    return { o, lb: [{ t: '22,150 calls in one table. No topics.', x: 60, y: 474 }] }; })();
  // 2. four shapes tried, boxes chosen
  S[1] = (() => { const o = { tw: [30, 96, 540, 352, 1] };
    OPS.forEach((e, i) => { o[e.id] = [30 + i * 136, 46, 132, 32, 1]; });
    boxes(o, 40, 124, 520, 314);
    return { o, lb: [{ t: 'Size = calls · Shade = score, darker is lower', x: 30, y: 466 }] }; })();
  // 3. the most to gain, beside the lowest score
  S[2] = (() => { const o = { tw: [30, 66, 340, 384, 1], sp: [390, 66, 180, 210, 1] };
    boxes(o, 40, 94, 320, 346, [0, 4]);
    return { o, tag: { 0: 'Most to gain', 4: 'Lowest score' },
      lb: [{ t: 'Cause: long verification', x: 390, y: 298 }, { t: 'Fix: a shorter script', x: 390, y: 324 }, { t: 'The topic with the most calls', x: 390, y: 350 }, { t: 'moves the whole center most', x: 390, y: 370 }] }; })();
  // 4. Ask AI answers beside the screen
  S[3] = (() => { const o = { tw: [30, 66, 200, 384, 1], ap: [250, 66, 320, 384, 1] };
    boxes(o, 38, 94, 184, 346, [0]);
    return { o, lb: [{ t: 'The answer comes from the calls behind the score', x: 30, y: 474 }] }; })();

  const ALL = [...BX, ...OPS, ...W], last = {};
  let cur = -1, lbT, first = true;
  const apply = n => {
    if (n === cur) return;
    const back = n < cur; cur = n; sv.dataset.s = n;
    const { o, lb, tag = {} } = S[n];
    ALL.forEach(el => {
      const v = o[el.id] || [...(last[el.id] || [300, 260, 0, 0]).slice(0, 4), 0];
      last[el.id] = v;
      const [x, y, w, h, op, r = 0, cls = ''] = v;
      el.style.transform = `translate(${x}px, ${y}px)` + (r ? ` rotate(${r}deg)` : '');
      el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.opacity = op;
      if (el.classList.contains('in-bx')) { const k = +el.id.slice(1);
        ['row', 'tiny', 'mini', 'lit'].forEach(c => el.classList.toggle(c, cls.split(' ').includes(c)));
        if (tag[k]) el.dataset.tag = tag[k]; else delete el.dataset.tag;
        el.style.setProperty('--dl', (back ? 12 - k : k) * 28 + 'ms'); }
      else if (el.classList.contains('in-op')) el.style.setProperty('--dl', +el.id.slice(1) * 60 + 'ms');
      else el.style.setProperty('--dl', '0ms');
    });
    LB.forEach(b => { b.style.opacity = 0; });
    clearTimeout(lbT);
    lbT = setTimeout(() => LB.forEach((b, i) => { const l = lb[i]; if (!l) return;
      b.innerHTML = l.t; b.style.transform = `translate(${l.x}px, ${l.y}px)`; b.style.opacity = 1; }), first ? 0 : 420);
    steps.forEach((s, i) => s.classList.toggle('on', i === n));
    [...meter.children].forEach((b, i) => { if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  };

  /* fit the 600 x 520 board (drawings in x 30-570, y 40-500) into whatever room the stage has */
  const fit = () => { const pad = Math.min(36, stage.clientWidth * .05), w = stage.clientWidth - 2 * pad, h = stage.clientHeight - 36, s = Math.min(w / 540, h / 470, 1.1);
    sv.style.transform = `translate(${pad + (w - 540 * s) / 2 - 30 * s}px, ${(h - 470 * s) / 2 - 40 * s}px) scale(${s})`; };
  /* the step in front is the last one whose top has passed the reading line; on a phone the line sits just under the stage */
  const line = () => innerWidth <= 860 ? stage.getBoundingClientRect().bottom + 90 : innerHeight * .52;
  const pick = () => { const m = line(); let n = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < m) n = i; }); apply(n); };
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { fit(); pick(); });

  steps.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + steps[i].querySelector('h2').textContent); meter.append(b);
    b.addEventListener('click', () => { const r = steps[i].getBoundingClientRect(); scrollTo({ top: scrollY + r.top - line() + 40, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }); });

  sv.classList.add('still'); fit(); pick(); first = false;
  requestAnimationFrame(() => requestAnimationFrame(() => sv.classList.remove('still')));
})();
