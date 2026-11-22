/* v7 - turns: "Three decisions I reversed". A row is crossed out when it is read, not when its first pixel shows:
   the row has to be well inside the window. Rows that arrive together go one after the other, 300ms apart. Each row plays once. */
(function () {
  var list = document.querySelector('#turns .tn');
  if (!list) return;
  var rows = [].slice.call(list.querySelectorAll('.tn-row'));
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;   // everything is shown as it is, crossed out

  list.classList.add('tn-live');
  var io = new IntersectionObserver(function (entries) {
    var n = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--d', (n++ * 300) + 'ms');
      e.target.classList.add('on');
      io.unobserve(e.target);
    });
  }, { threshold: 0.7, rootMargin: '0px 0px -8% 0px' });
  rows.forEach(function (r) { io.observe(r); });
})();
