/* v7 - path: the Experience rail. Loaded deferred.
   The rail runs from the first dot to the last. It fills with the scroll, up to a line at 60% of the window.
   A row arrives (.on, once) when its dot is well inside the window; its dot takes colour (.lit) when the filled line reaches it. */
(() => {
  const xp = document.querySelector('#path .xp'); if (!xp) return;
  const rail = xp.querySelector('.xp-rail'), past = xp.querySelector('.xp-past');
  const jobs = [...xp.querySelectorAll('.xp-job')], dots = jobs.map(j => j.querySelector('.xp-dot'));
  if (!rail || !dots.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let top = 0, len = 1;

  // where the rail stands: measured, so it stays true when a "Read more" opens or the layout changes
  const centre = d => { const b = d.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; };
  const measure = () => {
    const r = xp.getBoundingClientRect(), a = centre(dots[0]), z = centre(dots[dots.length - 1]);
    top = a[1] - r.top; len = Math.max(1, z[1] - a[1]);
    rail.style.setProperty('--rt', top.toFixed(1) + 'px'); rail.style.setProperty('--rh', len.toFixed(1) + 'px');
    rail.style.left = (a[0] - r.left - 1).toFixed(1) + 'px';
  };

  if (reduce) { measure(); jobs.forEach(j => j.classList.add('on', 'lit')); if (past) past.classList.add('on'); addEventListener('resize', measure); if ('ResizeObserver' in window) new ResizeObserver(measure).observe(xp); return; }

  xp.classList.add('xp-js');
  let raf = 0;
  const upd = () => {
    raf = 0;
    const r = xp.getBoundingClientRect(), vh = innerHeight;
    if (r.top > vh * 1.4 || r.bottom < -vh * .4) return;
    const line = vh * .6, arrive = vh * .84;
    const p = Math.min(1, Math.max(0, (line - (r.top + top)) / len));
    rail.style.setProperty('--p', p.toFixed(4));
    const end = r.top + top + len * p;
    let row = 0; // rows that arrive in the same frame come in one after the other
    dots.forEach((d, i) => {
      const y = centre(d)[1], j = jobs[i];
      if (!j.classList.contains('on') && y <= arrive) { j.style.setProperty('--row', row++); j.classList.add('on'); xp.classList.add('go'); if (past && past.contains(j)) past.classList.add('on'); }
      j.classList.toggle('lit', j.classList.contains('on') && y <= end + 1);
    });
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(upd); };
  const all = () => { measure(); req(); };
  measure();
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', all);
  if ('ResizeObserver' in window) new ResizeObserver(all).observe(xp);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all);
  upd();
})();
