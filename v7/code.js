/* v7 - code ("How I work"): the short index beside the heading marks the step whose screen is in the middle of the window. */
(function(){
  var links = [].slice.call(document.querySelectorAll('#code .hw-nav a')); if (!links.length || !('IntersectionObserver' in window)) return;
  var steps = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  function mark(i){ links.forEach(function(a, k){ a.classList.toggle('on', k === i); }); }
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) mark(steps.indexOf(e.target)); }); }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(function(s){ if (s) io.observe(s); }); mark(0);
})();

/* the sign-in page in the Design step: drawn at 760 px and scaled to its frame; under the mouse its layers move in depth,
   followed closely and let go with weight (the same spring as the page it comes from). */
[].forEach.call(document.querySelectorAll('#code .hw-live'), function(fig){
  var st = fig.querySelector('.hl'); if (!st) return;
  function fit(){ st.style.setProperty('--k', (fig.clientWidth / 760).toFixed(5)); }
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(fig); addEventListener('resize', fit); fit();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, last = 0, over = false;
  function tick(t){ var dt = Math.min(.034, (t - last) / 1000 || .016); last = t;
    var k = over ? 110 : 15, c = over ? 21 : 4.6;
    vx += ((tx - x) * k - vx * c) * dt; vy += ((ty - y) * k - vy * c) * dt; x += vx * dt; y += vy * dt;
    st.style.setProperty('--tx', x.toFixed(4)); st.style.setProperty('--ty', y.toFixed(4));
    if (Math.abs(tx - x) > .0008 || Math.abs(ty - y) > .0008 || Math.abs(vx) > .002 || Math.abs(vy) > .002) raf = requestAnimationFrame(tick);
    else { raf = 0; x = tx; y = ty; vx = vy = 0; st.style.setProperty('--tx', x); st.style.setProperty('--ty', y); } }
  function go(){ if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  fig.addEventListener('pointermove', function(e){ if (e.pointerType !== 'mouse') return; over = true; var r = fig.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)); ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2)); go(); });
  fig.addEventListener('pointerleave', function(){ over = false; tx = 0; ty = 0; go(); });
});
