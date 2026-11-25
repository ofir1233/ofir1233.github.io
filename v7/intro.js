/* v7 - Introduction: one stage, seven arrangements (v7/intro.css). Each step of the text names where every shape stands;
   moving between steps moves the same shapes there, so the picture turns into the next one instead of being swapped. */
(() => {
  const sv = document.getElementById('in-sv');
  if (!sv) return;
  const stage = sv.parentElement, steps = [...document.querySelectorAll('.in-st')], meter = stage.querySelector('.in-meter');
  const mk = (cls, id) => { const e = document.createElement('div'); e.className = cls; if (id) e.id = id; sv.append(e); return e; };

  /* the shapes: 52 squares (calls, then changes), six areas with their lines, labels, four next stories */
  const D = Array.from({ length: 52 }, (_, i) => mk('in-d', 'd' + i));
  const AREAS = ['Brand', 'Product', 'Design system', 'Website', 'Research', 'Front-end code'];
  const LN = AREAS.map((_, i) => mk('in-ln', 'l' + i));
  const CH = AREAS.map((a, i) => { const e = mk('in-ch', 'c' + i); e.textContent = a; return e; });
  const LB = Array.from({ length: 4 }, (_, i) => mk('in-lb', 'b' + i));
  const NEXT = [['Compliance', 'compliance.html'], ['Actions', 'actions.html'], ['Newsroom', 'newsroom.html'], ['Data & Signals', 'data.html']];
  const CD = NEXT.map(([t, h], i) => { const a = document.createElement('a'); a.className = 'in-cd'; a.id = 'k' + i; a.href = h; a.tabIndex = -1; a.innerHTML = '<small>0' + (i + 1) + '</small>' + t; sv.append(a); return a; });
  const W = ['w1', 'w2', 'w3'].map(id => document.getElementById(id));

  /* a fixed scatter for the calls, the same on every visit */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const CLOUD = D.map(() => [30 + rnd() * 230, 110 + rnd() * 300, .3 + rnd() * .6]);
  const OUT = [6, 17, 23, 38, 47];

  /* each step: {id: [x, y, w, h, opacity, rotate, class]}, labels [{t, x, y, c}] */
  const S = [];
  const put = (o, el, ...v) => { o[el.id] = v; };
  // 1. every call, read by AI
  S[0] = (() => { const o = {}; D.forEach((d, i) => put(o, d, CLOUD[i][0], CLOUD[i][1], 8, 8, CLOUD[i][2]));
    put(o, W[0], 320, 105, 250, 300, 1); return { o, lb: [{ t: 'Calls', x: 30, y: 432 }, { t: 'Hear reads every one', x: 320, y: 422 }] }; })();
  // 2. one designer, brand to code
  S[1] = (() => { const o = {}, cx = 300, cy = 250;
    D.forEach((d, i) => put(o, d, i ? 296 : 293, i ? 246 : 243, i ? 8 : 14, i ? 8 : 14, i ? 0 : 1, 0, i ? '' : 'me'));
    AREAS.forEach((_, i) => { const a = (-60 + i * 60) * Math.PI / 180, px = cx + 200 * Math.cos(a), py = cy + 160 * Math.sin(a), dx = px - cx, dy = py - cy, L = Math.hypot(dx, dy);
      put(o, CH[i], px - 66, py - 17, 132, 34, 1); put(o, LN[i], cx + 16 * dx / L, cy + 16 * dy / L, L * .78 - 16, 1.5, 1, Math.atan2(dy, dx) * 180 / Math.PI); });
    put(o, W[0], 285, 235, 30, 30, 0); return { o, lb: [{ t: 'Hear’s only designer', x: 300, y: 272, c: 1 }] }; })();
  // 3. Figma alone is no longer enough
  S[2] = { o: { w1: [30, 92, 255, 300, 1], w2: [315, 92, 255, 300, 1] },
    lb: [{ t: 'The mockup', x: 30, y: 64 }, { t: 'The product', x: 315, y: 64 }, { t: '<b>1</b>76 calls, not 50  <b>2</b>Hebrew turns 89% around', x: 30, y: 418 }, { t: '<b>3</b>The reader’s own day  <b>4</b>Words the AI writes', x: 30, y: 446 }] };
  // 4. one source of truth
  S[3] = { o: { w1: [60, 66, 360, 124, 1], w2: [60, 212, 360, 84, 1], w3: [60, 318, 360, 84, 1], l0: [44, 74, 320, 1.5, 1, 90] },
    lb: [{ t: 'Screens', x: 440, y: 120 }, { t: 'Components', x: 440, y: 246 }, { t: 'Tokens', x: 440, y: 352 }, { t: 'One source, in code: 122 Storybook stories', x: 60, y: 428 }] };
  // 5. so I built the Lab
  S[4] = { o: { w1: [30, 100, 260, 300, 1], w2: [310, 100, 260, 300, 1], w3: [300, 240, 20, 20, 0] },
    lb: [{ t: 'As shipped', x: 30, y: 72 }, { t: 'My fix', x: 310, y: 72 }, { t: 'Same data, same width, a real AI model', x: 300, y: 426, c: 1 }] };
  // 6. a fix has to beat the real screen
  S[5] = (() => { const o = { w1: [30, 40, 260, 136, 1], w2: [310, 40, 260, 136, 1] };
    D.forEach((d, i) => { const c = i % 13, r = (i / 13) | 0, out = OUT.includes(i); put(o, d, 30 + c * 520 / 12, 250 + r * 40 + (out ? 6 : 0), 20, 20, 1, 0, out ? 'out' : 'kept'); });
    return { o, lb: [{ t: '52 changes on seven screens, each beside the live one', x: 30, y: 214 }, { t: '47 kept · 5 removed', x: 30, y: 422 }] }; })();
  // 7. what came out of it
  S[6] = (() => { const o = {}; CD.forEach((c, i) => put(o, c, 30 + (i % 2) * 280, 84 + ((i / 2) | 0) * 214, 260, 190, 1));
    return { o, lb: [{ t: 'Next: the product stories', x: 30, y: 54 }] }; })();

  const ALL = [...D, ...LN, ...CH, ...CD, ...W], last = {};
  let cur = -1, lbT;
  const apply = n => {
    if (n === cur) return;
    const back = n < cur; cur = n;
    sv.dataset.s = n;
    const { o, lb } = S[n];
    ALL.forEach((el, k) => {
      const v = o[el.id] || [...(last[el.id] || [300, 260, 0, 0]).slice(0, 4), 0];
      last[el.id] = v;
      const [x, y, w, h, op, r = 0, cls = ''] = v;
      el.style.transform = `translate(${x}px, ${y}px)` + (r ? ` rotate(${r}deg)` : '');
      el.style.width = w + 'px'; el.style.height = h + 'px'; el.style.opacity = op;
      if (el.classList.contains('in-d')) { el.classList.toggle('me', cls === 'me'); el.classList.toggle('out', cls === 'out'); el.classList.toggle('kept', cls === 'kept');
        el.style.setProperty('--dl', (back ? 51 - k : k) * 9 + 'ms'); }
      else if (el.classList.contains('in-cd')) el.style.setProperty('--dl', CD.indexOf(el) * 70 + 'ms');
      else if (el.classList.contains('in-ch') || el.classList.contains('in-ln')) el.style.setProperty('--dl', 120 + (+el.id.slice(1)) * 50 + 'ms');
    });
    /* labels leave first, then come back in their new places with their new words */
    LB.forEach(b => { b.style.opacity = 0; });
    clearTimeout(lbT);
    lbT = setTimeout(() => LB.forEach((b, i) => { const l = lb[i];
      if (!l) return; b.innerHTML = l.t; b.style.transform = `translate(${l.x}px, ${l.y}px)` + (l.c ? ' translateX(-50%)' : ''); b.style.opacity = 1; }), first ? 0 : 380);
    steps.forEach((s, i) => s.classList.toggle('on', i === n));
    [...meter.children].forEach((b, i) => { if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  };

  /* fit the 600 x 520 stage into whatever room it has */
  /* the drawings use x 30-570, y 40-500: fit that band, not the whole board, so a phone gets them as large as it can */
  const fit = () => { const pad = Math.min(36, stage.clientWidth * .05), w = stage.clientWidth - 2 * pad, h = stage.clientHeight - 36, s = Math.min(w / 540, h / 470, 1.1);
    sv.style.transform = `translate(${pad + (w - 540 * s) / 2 - 30 * s}px, ${(h - 470 * s) / 2 - 40 * s}px) scale(${s})`; };

  /* the step in front is the last one whose top has passed the reading line */
  /* on a phone the stage holds the top of the screen, so the reading line sits just under it */
  const line = () => innerWidth <= 860 ? stage.getBoundingClientRect().bottom + 90 : innerHeight * .52;
  const pick = () => { const m = line(); let n = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < m) n = i; }); apply(n); };
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { fit(); pick(); });

  steps.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + steps[i].querySelector('h2').textContent); meter.append(b);
    b.addEventListener('click', () => { const r = steps[i].getBoundingClientRect(); scrollTo({ top: scrollY + r.top - line() + 40, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }); });

  let first = true;
  sv.classList.add('still'); fit(); pick(); first = false;
  requestAnimationFrame(() => requestAnimationFrame(() => sv.classList.remove('still')));
})();
