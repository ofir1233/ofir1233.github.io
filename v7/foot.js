/* v7 - foot: the footer signs itself. Loaded deferred.
   When about a third of the footer is in view the pen starts (class "signed" lets every mask stroke run in its turn, see v7/foot.css).
   A click on the signature goes to the top, as the name in the header does; hovering it after the first run signs once more.
   The sky moves a little slower than the page, so the footer has depth. */
(function () {
  var ft = document.querySelector('footer.ft'); if (!ft) return;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  ft.classList.add('js');
  if (calm || !('IntersectionObserver' in window)) { ft.classList.add('signed'); return; }
  var sign = ft.querySelector('.ft-sign'), sky = ft.querySelector('.ft-lay') || ft.querySelector('.ft-sky img'), done = false, busy = false;
  var all = parseFloat(getComputedStyle(ft.querySelector('.ft-sig')).getPropertyValue('--all')) || 3;
  function write() {
    if (busy) return; busy = true;
    ft.classList.remove('signed'); void ft.offsetWidth; ft.classList.add('signed');
    setTimeout(function () { busy = false; done = true; }, all * 1000 + 300);
  }
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { write(); io.disconnect(); } }, { threshold: .6 }).observe(sign);
  sign.addEventListener('pointerenter', function (e) { if (done && e.pointerType === 'mouse') write(); });
  var tick = false;
  function par() {
    tick = false; var r = ft.getBoundingClientRect(), vh = innerHeight;
    if (r.top > vh || r.bottom < 0) return;
    var p = Math.min(1, Math.max(0, (vh - r.top) / Math.min(r.height, vh)));
    sky.style.setProperty('--py', ((1 - p) * -46).toFixed(1) + 'px');
  }
  addEventListener('scroll', (window.v7Near || function (e, f) { return f; })(ft, function () { if (!tick) { tick = true; requestAnimationFrame(par); } }), { passive: true });
  addEventListener('resize', par); par();
  /* depth under the pointer: the layers part a little as the mouse moves over the footer (eased; mouse only) */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    var step = function () {
      x += (tx - x) * .08; y += (ty - y) * .08;
      sky.style.setProperty('--mx', x.toFixed(3)); sky.style.setProperty('--my', y.toFixed(3));
      raf = (Math.abs(tx - x) > .002 || Math.abs(ty - y) > .002) ? requestAnimationFrame(step) : 0;
    };
    var go = function () { if (!raf) raf = requestAnimationFrame(step); };
    ft.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = ft.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      go();
    });
    ft.addEventListener('pointerleave', function () { tx = 0; ty = 0; go(); });
  }
})();

/* the case footer: the link to the page you are on goes to its top instead of reloading it */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('footer.ft .ft-nav a[aria-current]');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
