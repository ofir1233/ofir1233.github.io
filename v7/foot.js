/* v7 - foot: the footer signs itself. Loaded deferred.
   When about a third of the footer is in view the pen starts (class "signed" lets every mask stroke run in its turn, see v7/foot.css).
   A click on the signature goes to the top, as the name in the header does; hovering it after the first run signs once more.
   The sky moves a little slower than the page, so the footer has depth. */
(function () {
  var ft = document.querySelector('footer.ft'); if (!ft) return;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  ft.classList.add('js');
  if (calm || !('IntersectionObserver' in window)) { ft.classList.add('signed'); return; }
  var sign = ft.querySelector('.ft-sign'), sky = ft.querySelector('.ft-sky img'), done = false, busy = false;
  var all = parseFloat(getComputedStyle(ft.querySelector('.ft-sig')).getPropertyValue('--all')) || 3;
  function write() {
    if (busy) return; busy = true;
    ft.classList.remove('signed'); void ft.offsetWidth; ft.classList.add('signed');
    setTimeout(function () { busy = false; done = true; }, all * 1000 + 300);
  }
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { write(); io.disconnect(); } }, { threshold: .3 }).observe(ft);
  sign.addEventListener('pointerenter', function (e) { if (done && e.pointerType === 'mouse') write(); });
  var tick = false;
  function par() {
    tick = false; var r = ft.getBoundingClientRect(), vh = innerHeight;
    if (r.top > vh || r.bottom < 0) return;
    var p = Math.min(1, Math.max(0, (vh - r.top) / Math.min(r.height, vh)));
    sky.style.setProperty('--py', ((1 - p) * -46).toFixed(1) + 'px');
  }
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(par); } }, { passive: true });
  addEventListener('resize', par); par();
})();
