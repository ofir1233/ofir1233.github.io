/* v7 - Explainable scores (work/explainable-scores.html): the sticky stage of Topics (v7/topics-story.js), holding the real screen.
   The stage shows Hear Studio's Evaluation by agent app, live with demo data, drawn at one size (1037 x 792) and scaled. Each step
   sets the app to one state (window.hearExplain.step, hear-v7/plan/explain/explain.js) and moves a gentle camera to the one part that
   matters: the grid, the low scores, the card on a score, the calls. The camera moves only when the step changes: a reader clicking
   inside the app is never pulled away from what they opened. */
(() => {
  const stage = document.querySelector('.es-stage');
  if (!stage) return;
  const view = stage.querySelector('.es-view'), cam = stage.querySelector('.es-cam'), frame = cam.querySelector('iframe'), load = stage.querySelector('.es-load');
  const steps = [...document.querySelectorAll('.in-st')], meter = stage.querySelector('.in-meter');
  const IW = 1037, IH = 792, calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches, narrow = () => innerWidth <= 860;
  let cur = -1, api = null;

  /* frame the step's part: as large as the window allows (never past 1.75x), centred, never showing past the app's edges */
  const aim = instant => {
    if (!api || cur < 0) return;
    const r = api.rect(cur, narrow()); if (!r) return;
    const W = view.clientWidth, H = view.clientHeight, pad = narrow() ? 8 : 18;
    const s = Math.min((W - 2 * pad) / r.w, (H - 2 * pad) / r.h, 1.75);
    const fit = (t, span, room) => span <= room ? (room - span) / 2 : Math.min(0, Math.max(room - span, t));
    const tx = fit(W / 2 - (r.x + r.w / 2) * s, IW * s, W), ty = fit(H / 2 - (r.y + r.h / 2) * s, IH * s, H);
    if (instant) cam.style.transition = 'none';
    cam.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(4)})`;
    if (instant) { void cam.offsetWidth; cam.style.transition = ''; }
  };
  const apply = n => {
    if (n === cur) return;
    cur = n;
    steps.forEach((s, i) => s.classList.toggle('on', i === n));
    [...meter.children].forEach((b, i) => { if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    if (api) { api.step(n); aim(calm()); }
  };

  /* the app is ready once its explain script has run */
  const hook = () => {
    let w; try { w = frame.contentWindow; } catch (e) { return; }
    if (api || !w || !w.hearExplain) return;
    api = w.hearExplain;
    if (cur >= 0) api.step(cur);
    requestAnimationFrame(() => { aim(true); cam.classList.add('on'); if (load) load.hidden = true; });
  };
  frame.addEventListener('load', hook);
  addEventListener('message', e => { if (e.origin === location.origin && e.data && e.data.hearExplain === 'ready') hook(); });

  /* the step in front is the last one whose top has passed the reading line; on a phone the line sits just under the stage */
  const line = () => narrow() ? stage.getBoundingClientRect().bottom + 90 : innerHeight * .52;
  const pick = () => { const m = line(); let n = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < m) n = i; }); apply(n); };
  let raf = 0; addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; pick(); }); }, { passive: true });
  addEventListener('resize', () => { pick(); aim(true); });

  steps.forEach((_, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Step ' + (i + 1) + ': ' + steps[i].querySelector('h2').textContent); meter.append(b);
    b.addEventListener('click', () => { const r = steps[i].getBoundingClientRect(); scrollTo({ top: scrollY + r.top - line() + 40, behavior: calm() ? 'auto' : 'smooth' }); }); });

  pick(); hook();
})();
