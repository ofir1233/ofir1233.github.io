/* v7 - the low-fidelity case stories (work/actions.html, work/explainable-scores.html): the sticky stage of the Introduction (v7/intro.css), one part per step (v7/wf-story.css, and each case's scenes file).
   The step in front shows its scene; the scene plays its one motion when it comes in (.go), and plays it again each time the reader
   comes back to it, so a step always shows the same thing happening. */
(() => {
  const sv = document.getElementById('in-sv');
  if (!sv) return;
  const stage = sv.parentElement, steps = [...document.querySelectorAll('.in-st')], meter = stage.querySelector('.in-meter');
  const sc = [...sv.querySelectorAll('.aw-sc')], calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = -1, goT = 0;

  const apply = n => {
    if (n === cur) return;
    cur = n; sv.dataset.s = n;
    clearTimeout(goT);
    sc.forEach((s, i) => { s.classList.toggle('on', i === n); s.classList.remove('go'); });
    /* the scene settles in first, then its motion starts */
    if (calm()) sc[n].classList.add('go'); else goT = setTimeout(() => sc[n].classList.add('go'), 260);
    steps.forEach((s, i) => s.classList.toggle('on', i === n));
    [...meter.children].forEach((b, i) => { if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  };

  /* each scene fills the board: its parts' box, scaled up to 1.45x and centred in the 540 x 460 room */
  const frame = s => { let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
    [...s.children].forEach(c => { x1 = Math.min(x1, c.offsetLeft); y1 = Math.min(y1, c.offsetTop); x2 = Math.max(x2, c.offsetLeft + c.offsetWidth); y2 = Math.max(y2, c.offsetTop + c.offsetHeight); });
    const w = x2 - x1, h = y2 - y1, k = Math.min(540 / w, 460 / h, 1.45);
    s.style.setProperty('--k', k.toFixed(4)); s.style.setProperty('--tx', ((540 - w * k) / 2 - x1 * k).toFixed(1) + 'px'); s.style.setProperty('--ty', ((460 - h * k) / 2 - y1 * k).toFixed(1) + 'px'); };
  const frames = () => sc.forEach(frame);
  /* fit the 600 x 520 board (scenes in x 30-570, y 40-500) into whatever room the stage has */
  const fit = () => { const pad = Math.min(36, stage.clientWidth * .05), w = stage.clientWidth - 2 * pad, h = stage.clientHeight - 36, s = Math.min(w / 540, h / 460, 1.15);
    sv.style.transform = `translate(${pad + (w - 540 * s) / 2 - 30 * s}px, ${(h - 460 * s) / 2 - 40 * s}px) scale(${s})`; };
  /* the step in front is the last one whose top has passed the reading line; on a phone the line sits just under the stage */
  const line = () => innerWidth <= 860 ? stage.getBoundingClientRect().bottom + 90 : innerHeight * .52;
  const pick = () => { const m = line(); let n = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < m) n = i; }); apply(n); };
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { fit(); pick(); });

  steps.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + steps[i].querySelector('h2').textContent); meter.append(b);
    b.addEventListener('click', () => { const r = steps[i].getBoundingClientRect(); scrollTo({ top: scrollY + r.top - line() + 40, behavior: calm() ? 'auto' : 'smooth' }); }); });

  frames(); fit(); pick();
  if (document.fonts) document.fonts.ready.then(frames);
})();
