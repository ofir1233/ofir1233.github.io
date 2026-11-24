/* v7 - the depth of the Product cards' painted scenes (see v7/spot-art.css). With a mouse, the scene of the card under the pointer
   follows it, eased (about 0.4 s to settle); on a phone, the way it is held (v7/gyro.js). Nothing with reduced motion. */
/* The steps under each app window are shortened on the side the painted scene is on, so they end before the paint begins
   (owner, 24.11.2026). Measured in the card's own units, so a card that is receding (scaled) measures the same. */
(function () {
  var mq = matchMedia('(min-width: 861px)'), GAP = 14;
  var cards = [].slice.call(document.querySelectorAll('#product .spot.has-art'));
  function clear(card) {
    var st = card.querySelector('.sa-stage'), md = card.querySelector('.media');
    if (!st || !md || !mq.matches) { card.style.removeProperty('--sa-cl'); card.style.removeProperty('--sa-cr'); return; }
    var rc = card.getBoundingClientRect(), k = rc.width / (card.offsetWidth || 1) || 1;
    var rs = st.getBoundingClientRect(), rm = md.getBoundingClientRect();
    var l = Math.max(0, Math.round((rs.right - rm.left) / k - 4 + GAP)), r = Math.max(0, Math.round((rm.right - rs.left) / k - 4 + GAP));
    var left = rs.left - rc.left < rc.right - rs.right; // the scene sits in the card's left half
    var cl = left && rs.right > rm.left ? l + 'px' : '0px', cr = !left && rs.left < rm.right ? r + 'px' : '0px';
    if (card.style.getPropertyValue('--sa-cl') !== cl) card.style.setProperty('--sa-cl', cl);
    if (card.style.getPropertyValue('--sa-cr') !== cr) card.style.setProperty('--sa-cr', cr);
  }
  function all() { cards.forEach(clear); }
  all();
  if ('ResizeObserver' in window) { var ro = new ResizeObserver(all); cards.forEach(function (c) { ro.observe(c); }); }
  else addEventListener('resize', all);
  if (mq.addEventListener) mq.addEventListener('change', all);
})();
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  [].forEach.call(document.querySelectorAll('#product .sa-stage'), function (st) {
    var card = st.closest('.spot'), x = 0, y = 0, gx = 0, gy = 0, raf = 0;
    function tick() {
      x += (gx - x) * .12; y += (gy - y) * .12;
      st.style.setProperty('--tx', x.toFixed(4)); st.style.setProperty('--ty', y.toFixed(4));
      raf = (Math.abs(gx - x) + Math.abs(gy - y) > .002) ? requestAnimationFrame(tick) : 0;
      if (!raf && !gx && !gy) st.classList.remove('sa-live');
    }
    function go(a, b) { gx = a; gy = b; if (a || b) st.classList.add('sa-live'); if (!raf) raf = requestAnimationFrame(tick); }
    if (fine) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        go(Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1)), Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1)));
      }, { passive: true });
      card.addEventListener('pointerleave', function () { go(0, 0); });
    } else if (window.v7Gyro) {
      window.v7Gyro.watch(st, function (a, b, off) { go(off ? 0 : a, off ? 0 : b); });
    }
  });
})();
