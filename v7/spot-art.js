/* v7 - the depth of the Product cards' painted scenes (see v7/spot-art.css). With a mouse, the scene of the card under the pointer
   follows it, eased (about 0.4 s to settle); on a phone, the way it is held (v7/gyro.js). Nothing with reduced motion. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  [].forEach.call(document.querySelectorAll('#product .sa-stage'), function (st) {
    var card = st.closest('.spot'), x = 0, y = 0, gx = 0, gy = 0, raf = 0;
    function tick() {
      x += (gx - x) * .12; y += (gy - y) * .12;
      st.style.setProperty('--tx', x.toFixed(4)); st.style.setProperty('--ty', y.toFixed(4));
      raf = (Math.abs(gx - x) + Math.abs(gy - y) > .002) ? requestAnimationFrame(tick) : 0;
    }
    function go(a, b) { gx = a; gy = b; if (!raf) raf = requestAnimationFrame(tick); }
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
