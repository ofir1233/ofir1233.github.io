/* v7 - sme: "Structure Meets Expression". Splits STRUCTURE into letters (each settles on the baseline in turn), loads the painted word
   only when the part comes near, and plays the drawing once, when it is in view. Without the script everything simply shows.
   Styles and the reason: v7/sme.css. */
(function () {
  var root = document.querySelector('#system .sm'); if (!root) return;
  var s = root.querySelector('.sm-s'), img = root.querySelector('.sm-e');
  if (s && !s.querySelector('i')) {
    var w = s.textContent; s.textContent = '';
    w.split('').forEach(function (c, n) { var i = document.createElement('i'); i.textContent = c; i.style.setProperty('--i', n); s.appendChild(i); });
  }
  if (!('IntersectionObserver' in window)) { if (img && img.dataset.src) img.src = img.dataset.src; return; }
  root.classList.add('js');
  function load() { if (img && img.dataset.src) { img.srcset = img.dataset.srcset || ''; img.src = img.dataset.src; img.removeAttribute('data-src'); } }
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '1000px 0px' }).observe(root);
  new IntersectionObserver(function (es, io) {
    if (!es[0].isIntersecting) return; io.disconnect();
    function go() { root.classList.add('in'); }
    /* the brush waits for its paint, but never longer than a moment */
    if (!img || img.complete && img.naturalWidth) go();
    else { var t = setTimeout(go, 1600); img.addEventListener('load', function () { clearTimeout(t); go(); }, { once: true }); }
  }, { threshold: .45 }).observe(root.querySelector('.sm-art') || root);
})();
