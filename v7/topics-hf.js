/* v7 - Topics in high fidelity (work/topics.html), owner 25.11. The same story as the wireframe (v7/topics-story.js): thirteen shapes
   carry it, first as rows of a table of calls, then as the topics, boxes sized by calls and shaded by score, then the one with the most
   to gain, then the corner of the screen Ask AI answers beside. Now drawn in Hear's look (v7/hf-story.css, v7/topics-hf.css) on the
   painted sky. The boxes take the Topics screen's own five blues (hear-v7/plan/topics/topics.css): the lower the score, the deeper the
   blue. The rows are calls from the Data screen's demo (hear-v7/plan/screens/screens.js); the topics, scores and Ask AI's answer are
   the Topics screen's demo data. */
(() => {
  const sv = document.getElementById('in-sv');
  if (!sv) return;
  const stage = sv.parentElement, steps = [...document.querySelectorAll('.in-st')], meter = stage.querySelector('.in-meter');
  const mk = (tag, cls, id) => { const e = document.createElement(tag); e.className = cls; if (id) e.id = id; sv.append(e); return e; };
  const esc = s => s.replace(/&/g, '&amp;');

  /* the topics: name, calls, score (the equal-weight average of satisfaction, silence time and handle time) */
  const T = [['Online Booking', 4412, 43], ['Trip Status', 3968, 63], ['E-ticket Delivery', 2451, 72], ['Itinerary Questions', 2377, 43],
    ['Changes & Cancellations', 2206, 34], ['Refunds & Credits', 1583, 36], ['Schedule Changes', 1329, 63], ['Seating & Extras', 1061, 49],
    ['Accessibility Requests', 873, 44], ['Complaints & Follow-up', 702, 72], ['Baggage', 640, 52], ['Loyalty Points', 388, 41], ['Payment Issues', 160, 34]];
  /* thirteen calls, as the Data screen lists them: time, what happened, the call's score. No topic column, nothing to start from */
  const C = [['14:02', 'Asks twice for a refund on a cancelled flight, is offered a voucher', 38], ['13:47', 'Books two seats to Lisbon and adds a bag at checkout', 82],
    ['13:31', 'Asks whether the 18:40 to Madrid is still on time', 71], ['13:18', 'A refund promised ten days ago has not arrived', 41],
    ['12:56', 'Moves to an aisle seat and pays for extra legroom', 88], ['12:40', 'Offered a credit in place of the refund and refuses it', 35],
    ['12:22', 'Flight moved by four hours, asks for an earlier one', 66], ['12:05', 'Third call about the same refund, asks for a manager', 29],
    ['11:51', 'The e-ticket never reached the inbox, sent again by email', 79], ['10:52', 'The refund went to an old card, wants it sent again', 44],
    ['Oct 12', 'Cancelled within 24 hours and was still charged a fee', 33], ['Oct 12', 'Only part of the refund came, the bag fee is missing', 47],
    ['Oct 12', 'Refund for a delayed flight was turned down, asks why', 39]];
  const band = s => s < 40 ? 'b1' : s < 50 ? 'b2' : s < 60 ? 'b3' : s < 70 ? 'b4' : 'b5';
  const BX = T.map(([n, c, s], i) => { const e = mk('div', 'in-bx ' + band(s), 'x' + i), [t, d, cs] = C[i];
    e.innerHTML = `<span class="rw"><i>${t}</i><span>${esc(d)}</span><em class="hf-sc ${cs < 70 ? 'lo' : 'hi'}">${cs}</em></span>` +
      `<b>${esc(n)}</b><small>${c.toLocaleString('en-US')} calls</small><em class="sc">${s}</em>`; return e; });
  const OPS = ['List', 'Flow', 'Circles', 'Boxes'].map((t, i) => { const e = mk('div', 'in-op' + (i === 3 ? ' on' : ''), 'o' + i); e.textContent = t; return e; });
  const LB = Array.from({ length: 2 }, (_, i) => mk('div', 'in-lb', 'b' + i));
  const W = ['tw', 'sp', 'ap'].map(id => document.getElementById(id));

  /* a squarified treemap of the topics inside one rectangle, 4px between boxes */
  const tree = (x, y, w, h) => {
    const total = T.reduce((a, t) => a + t[1], 0), A = T.map(t => t[1] * w * h / total), out = [];
    const worst = (r, l) => { const s = r.reduce((a, b) => a + b, 0); return Math.max(l * l * Math.max(...r) / (s * s), s * s / (l * l * Math.min(...r))); };
    const lay = r => { const s = r.reduce((a, b) => a + b, 0);
      if (w >= h) { const cw = s / h; let yy = y; r.forEach(a => { out.push([x, yy, cw, a / cw]); yy += a / cw; }); x += cw; w -= cw; }
      else { const rh = s / w; let xx = x; r.forEach(a => { out.push([xx, y, a / rh, rh]); xx += a / rh; }); y += rh; h -= rh; } };
    let row = [], i = 0;
    while (i < A.length) { const l = Math.min(w, h); if (!row.length || worst([...row, A[i]], l) <= worst(row, l)) row.push(A[i++]); else { lay(row); row = []; } }
    if (row.length) lay(row);
    return out.map(([a, b, c, d]) => [a + 2, b + 2, Math.max(0, c - 4), Math.max(0, d - 4)]);
  };
  const boxes = (o, x, y, w, h, lit) => tree(x, y, w, h).forEach((r, i) => {
    /* a name needs room for two lines, its calls and the score; a narrow box keeps only the score, a sliver nothing */
    const size = r[2] < 38 || r[3] < 34 ? 'mini ' : (r[2] < 104 && !(r[2] >= 84 && r[3] >= 120)) || r[3] < 84 ? 'tiny ' : '';
    o['x' + i] = [...r, lit && !lit.includes(i) ? .3 : 1, 0, size + (lit && lit.includes(i) ? 'lit' : '')]; });

  /* the room the story is drawn in: 540 wide on a wide screen, 400 on a phone, and as tall as the stage's shape allows, inside the
     margin of sky the high-fidelity stories keep (v7/wf-story.js) */
  const phone = () => innerWidth <= 860;
  const inset = () => { const w = stage.clientWidth, h = stage.clientHeight;
    return phone() ? { x: 14, t: 14, b: 40 } : { x: Math.round(w * .085), t: Math.round(h * .075), b: Math.round(h * .085) + 24 }; };
  const room = () => { const m = inset(), w = stage.clientWidth - 2 * m.x, h = stage.clientHeight - m.t - m.b, base = phone() ? 400 : 540;
    return [base, Math.round(Math.max(base * .8, Math.min(base * 1.3, base * h / w)))]; };

  /* each step: {id: [x, y, w, h, opacity, rotate, class]}, notes [{t, x, y}], tags {box index: words on the box} */
  const layout = (RW, RH) => { const S = [], HD = 52, NB = 44;
    // 1. a table of calls: the same thirteen shapes are its rows, and nothing says which topic a call is
    S[0] = (() => { const o = { tw: [0, 0, RW, RH - NB, 1] }, rh = (RH - NB - HD - 8) / 13;
      BX.forEach((b, i) => { o[b.id] = [0, HD + i * rh, RW, rh, 1, 0, 'row'] });
      return { o, lb: [{ t: '22,150 calls in one table. No topics.', x: 0, y: RH - 32 }] }; })();
    // 2. four shapes tried, boxes chosen
    S[1] = (() => { const o = { tw: [0, 48, RW, RH - 48 - NB, 1] }, cw = (RW - 24) / 4;
      OPS.forEach((e, i) => { o[e.id] = [i * (cw + 8), 0, cw, 34, 1]; });
      boxes(o, 10, 48 + HD, RW - 20, RH - 48 - NB - HD - 10);
      return { o, lb: [{ t: 'Size is calls · Shade is score, darker is lower', x: 0, y: RH - 32 }] }; })();
    // 3. the most to gain, beside the lowest score
    S[2] = (() => { const th = Math.round(RH * (phone() ? .54 : .64)), o = { tw: [0, 0, RW, th, 1], sp: [0, th + 12, RW, RH - th - 12, 1] };
      boxes(o, 10, HD, RW - 20, th - HD - 10, [0, 4]);
      return { o, tag: { 0: 'Most to gain', 4: 'Lowest score' }, lb: [] }; })();
    // 4. Ask AI answers beside the screen
    S[3] = (() => { const tw = Math.round(RW * .34), o = { tw: [0, 0, tw, RH, 1], ap: [tw + 12, 0, RW - tw - 12, RH, 1] };
      boxes(o, 8, HD, tw - 16, RH - HD - 8, [0]);
      return { o, lb: [] }; })();
    return S; };

  const ALL = [...BX, ...OPS, ...W], last = {};
  let S = [], cur = -1, lbT, first = true;
  const apply = (n, force) => {
    if (n === cur && !force) return;
    const back = n < cur; cur = n; sv.dataset.s = n;
    stage.style.setProperty('--s', n); stage.style.setProperty('--sky', (n / (steps.length - 1) * 100).toFixed(1) + '%');
    const { o, lb, tag = {} } = S[n];
    ALL.forEach(el => {
      const v = o[el.id] || [...(last[el.id] || [200, 200, 0, 0]).slice(0, 4), 0];
      last[el.id] = v;
      const [x, y, w, h, op, r = 0, cls = ''] = v;
      el.style.transform = `translate(${x}px, ${y}px)` + (r ? ` rotate(${r}deg)` : '');
      el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.opacity = op;
      if (el.classList.contains('in-bx')) { const k = +el.id.slice(1);
        ['row', 'tiny', 'mini', 'lit'].forEach(c => el.classList.toggle(c, cls.split(' ').includes(c)));
        if (tag[k]) el.dataset.tag = tag[k]; else delete el.dataset.tag;
        el.style.setProperty('--dl', (back ? 12 - k : k) * 30 + 'ms'); }
      else if (el.classList.contains('in-op')) el.style.setProperty('--dl', +el.id.slice(1) * 70 + 'ms');
      else el.style.setProperty('--dl', '0ms');
    });
    LB.forEach(b => { b.style.opacity = 0; });
    clearTimeout(lbT);
    lbT = setTimeout(() => LB.forEach((b, i) => { const l = lb[i]; if (!l) return;
      b.innerHTML = l.t; b.style.transform = `translate(${l.x}px, ${l.y}px)`; b.style.opacity = 1; }), first ? 0 : 700);
    steps.forEach((s, i) => s.classList.toggle('on', i === n));
    [...meter.children].forEach((b, i) => { if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  };

  /* fit the room into the stage, inside its margin of sky */
  const fit = () => { const [RW, RH] = room(), m = inset(), w = stage.clientWidth - 2 * m.x, h = stage.clientHeight - m.t - m.b, s = Math.min(w / RW, h / RH, 1.15);
    sv.style.width = RW + 'px'; sv.style.height = RH + 'px';
    sv.style.transform = `translate(${m.x + (w - RW * s) / 2}px, ${m.t + (h - RH * s) / 2}px) scale(${s})`;
    S = layout(RW, RH); };
  /* the step in front is the last one whose top has passed the reading line; on a phone the line sits just under the stage */
  const line = () => innerWidth <= 860 ? stage.getBoundingClientRect().bottom + 90 : innerHeight * .52;
  const pick = () => { const m = line(); let n = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < m) n = i; }); apply(n); };
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { sv.classList.add('still'); fit(); apply(cur, true); requestAnimationFrame(() => sv.classList.remove('still')); });

  steps.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + steps[i].querySelector('h2').textContent); meter.append(b);
    b.addEventListener('click', () => { const r = steps[i].getBoundingClientRect(); scrollTo({ top: scrollY + r.top - line() + 40, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }); });

  /* Hear's world: a cloud far behind and one in front, low on the left, from the home page's art (as in v7/wf-story.js) */
  const art = (cls, name) => { const p = document.createElement('picture'); p.className = 'hf-art ' + cls; p.setAttribute('aria-hidden', 'true');
    p.innerHTML = `<source type="image/avif" srcset="../img/topics/${name}.avif?v=1"><img src="../img/topics/${name}.webp" alt="" decoding="async" draggable="false">`; return p; };
  sv.before(art('hf-cb', 'cloud-back')); sv.after(art('hf-cf', 'cloud-front'));

  sv.classList.add('still'); fit(); pick(); first = false;
  requestAnimationFrame(() => requestAnimationFrame(() => sv.classList.remove('still')));
})();
