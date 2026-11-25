/* v7 - sme: "Structure Meets Expression". Splits STRUCTURE into letters (each settles on the baseline in turn), loads the painted word
   only when the part comes near, and plays the drawing once, when it is in view (.in). The type never waits for the image:
   only the brush and the colour spec do (.p, when the image is there, or after 1.6s at most). Without the script everything shows.
   Styles and the reason: v7/sme.css. */
(function () {
  var root = document.querySelector('#system .sm'); if (!root) return;
  var s = root.querySelector('.sm-s'), img = root.querySelector('.sm-e');
  if (s && !s.querySelector('i')) {
    var w = s.textContent; s.textContent = '';
    w.split('').forEach(function (c, n) { var i = document.createElement('i'); i.textContent = c; i.style.setProperty('--i', n); s.appendChild(i); });
  }
  function load() { if (img && img.dataset.src) { img.srcset = img.dataset.srcset || ''; img.src = img.dataset.src; img.removeAttribute('data-src'); } }
  if (!('IntersectionObserver' in window)) { load(); return; }
  root.classList.add('js');
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '3000px 0px' }).observe(root);
  new IntersectionObserver(function (es, io) {
    if (!es[0].isIntersecting) return; io.disconnect();
    root.classList.add('in');
    function paint() { root.classList.add('p'); }
    if (!img || img.complete && img.naturalWidth) paint();
    else { var t = setTimeout(paint, 700); img.addEventListener('load', function () { clearTimeout(t); paint(); }, { once: true }); }
  }, { threshold: .12 }).observe(root.querySelector('.sm-art') || root);
})();
