/* v7 - code ("How I work"): the short index beside the heading marks the step whose screen is in the middle of the window. */
(function(){
  var links = [].slice.call(document.querySelectorAll('#code .hw-nav a')); if (!links.length || !('IntersectionObserver' in window)) return;
  var steps = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); });
  function mark(i){ links.forEach(function(a, k){ a.classList.toggle('on', k === i); }); }
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) mark(steps.indexOf(e.target)); }); }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(function(s){ if (s) io.observe(s); }); mark(0);
})();
