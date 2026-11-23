/* FYI case study, layer: The reason.
   The thread sits in the story's iPhone. This script puts each callout at the height of the part it names,
   plays one short arrival when the phone comes into view, and lets a callout, a part, or a role light its part of the thread. */
(function () {
  var root = document.querySelector('#fya-why .fyw'); if (!root) return;
  var ph = root.querySelector('.fyw-ph'), dev = root.querySelector('.fyw-dev'), th = root.querySelector('.fyw-thread');
  var its = [].slice.call(root.querySelectorAll('.fyw-it')), lbs = [].slice.call(root.querySelectorAll('.fyw-lb'));
  if (!ph || !dev || !th || !its.length || !lbs.length) return;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var roles = [].slice.call(root.querySelectorAll('.fyw-who li[data-parts]'));
  var lock = null, hov = null;   // each is { key, parts:[indexes] } or null

  // layout sizes, not painted boxes, so the transform of the arrival never moves a callout. 14 is the bezel, 418 the frame's own width
  function place() {
    var k = dev.offsetWidth / 418;
    lbs.forEach(function (l) {
      var it = its[+l.dataset.i]; if (!it) return;
      l.style.setProperty('--y', Math.round((14 + th.offsetTop + it.offsetTop + it.offsetHeight / 2) * k) + 'px');
    });
  }
  function show() {
    var s = hov || lock, on = s ? s.parts : [];
    root.classList.toggle('pick', !!s);
    its.forEach(function (el, i) { el.classList.toggle('on', on.indexOf(i) >= 0); });
    lbs.forEach(function (l) { var i = +l.dataset.i; l.classList.toggle('on', on.indexOf(i) >= 0); l.setAttribute('aria-pressed', lock && lock.key === 'p' + i ? 'true' : 'false'); });
    roles.forEach(function (li, r) { li.classList.toggle('on', !!s && s.key === 'r' + r); });
  }
  // a role only acts while it stands beside the phone, where the reader can see what it lights
  function beside() { return !window.matchMedia || matchMedia('(min-width: 1140px)').matches; }
  function wire(el, sel, key, role) {
    el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && (!role || beside())) { hov = sel; show(); } });
    el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hov = null; show(); } });
    el.addEventListener('click', function () { if (role && !beside()) return; lock = lock && lock.key === sel.key ? null : sel; hov = null; show(); });
    if (key) {
      el.addEventListener('focus', function () { if (el.matches(':focus-visible') && (!role || beside())) { hov = sel; show(); } });
      el.addEventListener('blur', function () { if (hov === sel) { hov = null; show(); } });
    }
    if (role) el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
  }
  var parts = its.map(function (el, i) { return { key: 'p' + i, parts: [i] }; });
  lbs.forEach(function (l) { var p = parts[+l.dataset.i]; if (p) wire(l, p, true, false); });
  its.forEach(function (el, i) { wire(el, parts[i], false, false); });
  roles.forEach(function (li, r) {
    var ps = li.dataset.parts.split(',').map(Number).filter(function (n) { return n >= 0 && n < its.length; });
    if (ps.length) wire(li, { key: 'r' + r, parts: ps }, true, true);
  });
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lock) { lock = null; show(); } });

  root.classList.add('js');
  place();
  if (window.ResizeObserver) new ResizeObserver(place).observe(ph);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  window.addEventListener('load', place);

  // one arrival, the first time the phone is seen. Reduced motion or a paused page shows the thread as it is
  if (!calm && window.IntersectionObserver && !(window.FX && FX.held)) {
    root.classList.add('pre');
    var io = new IntersectionObserver(function (es) {
      if (!es[es.length - 1].isIntersecting) return;
      io.disconnect();
      root.classList.add('in'); void root.offsetWidth; root.classList.remove('pre');
      setTimeout(function () { root.classList.remove('in'); }, 760);
    }, { threshold: .3 });
    io.observe(ph);
  }
})();
