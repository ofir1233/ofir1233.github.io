/* v7 - header: once the page has moved the bar takes a paper ground (html.hv-stuck) */
(function(){
  var root = document.documentElement, on = null;
  function set(){ var s = scrollY > 8; if (s !== on) { on = s; root.classList.toggle('hv-stuck', s); } }
  addEventListener('scroll', set, { passive: true }); set();
})();
