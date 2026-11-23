/* v7 - plan: the eight-phase line. The stop under the pointer, the finger or the keyboard is the one whose sentence shows; the blue line runs to it.
   Nothing moves by itself, apart from the line being drawn once when it is first seen. A phase whose work the reader already stayed on
   (five seconds, the postcard's record in close.js) says "You read this above". */
(function () {
  var ol = document.querySelector('#process .plan'); if (!ol) return;
  var lis = [].slice.call(ol.children), n = lis.length, cur = -1;
  var wide = matchMedia('(min-width: 761px)');
  function pick(i, by) {
    if (by) ol.classList.add('used');
    if (i === cur) return; cur = i;
    lis.forEach(function (li, k) { li.classList.toggle('on', k === i); li.classList.toggle('past', k < i); var b = li.querySelector('.pl-stop'); if (b) b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    ol.style.setProperty('--p', (i / (n - 1)).toFixed(4));
  }
  lis.forEach(function (li, i) {
    var b = li.querySelector('.pl-stop'); if (!b) return; b.style.setProperty('--i', i);
    b.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && wide.matches) pick(i, true); });
    b.addEventListener('focus', function () { pick(i, true); });
    b.addEventListener('click', function () { pick(i, true); });
    b.addEventListener('keydown', function (e) { var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); var t = lis[Math.max(0, Math.min(n - 1, i + d))].querySelector('.pl-stop'); if (t) t.focus(); });
  });
  pick(0);
  var read = function () { var r = window.v7Read; if (!r) return; [].forEach.call(ol.querySelectorAll('.pl-t a[data-sec]'), function (a) { if (r[a.getAttribute('data-sec')] >= 5) a.textContent = 'You read this above'; }); };
  if (!('IntersectionObserver' in window)) return;
  ol.classList.add('pl-js');
  var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect(); read(); ol.classList.add('in'); }, { threshold: .5 });
  io.observe(ol);
})();
