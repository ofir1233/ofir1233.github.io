/* FYI case study, layer: The reason.
   The thread is the natural layout. "Scattered" is a transform on each part, worked out from where the part sits in the thread,
   so one button moves the same nine things between the ground and the chat. */
(function () {
  var root = document.querySelector('#fya-why .fyw'); if (!root) return;
  var stage = root.querySelector('.fyw-stage'), btn = root.querySelector('.fyw-go'), its = [].slice.call(root.querySelectorAll('.fyw-it'));
  if (!stage || !btn || !its.length) return;
  var txt = btn.querySelector('span') || btn;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // where each part lies when loose: centre x, centre y (share of the stage) and its lean. Wide ground first, then the width of a phone
  var WIDE = [[.70, .06, 4], [.22, .10, -5], [.80, .25, -4], [.27, .29, 3], [.57, .44, 6], [.18, .57, -4], [.36, .91, 2], [.81, .70, 5], [.45, .72, -7]];
  var SLIM = [[.70, .05, 4], [.30, .14, -5], [.70, .23, -3], [.32, .33, 3], [.70, .42, 6], [.27, .53, -4], [.40, .93, 2], [.71, .65, 5], [.27, .79, -6]];
  var timer = 0, armed = 0, touched = false, seen = false, watch = null;

  function place() {
    root.classList.add('still');
    var was = root.dataset.state; root.dataset.state = 'one';
    var s = stage.getBoundingClientRect(), slim = s.width < 440, T = slim ? SLIM : WIDE, k = slim ? .6 : s.width < 620 ? .8 : 1;
    its.forEach(function (el, i) {
      var r = el.getBoundingClientRect(), t = T[i % T.length], hw = r.width * k / 2 + 14, hh = r.height * k / 2 + 14;
      var cx = Math.max(hw, Math.min(s.width - hw, t[0] * s.width)), cy = Math.max(hh, Math.min(s.height - hh - 22, t[1] * s.height));
      el.style.setProperty('--sx', Math.round(cx - (r.left - s.left + r.width / 2)) + 'px');
      el.style.setProperty('--sy', Math.round(cy - (r.top - s.top + r.height / 2)) + 'px');
      el.style.setProperty('--sr', t[2] + 'deg'); el.style.setProperty('--ss', k);
    });
    root.dataset.state = was;
    void root.offsetWidth; root.classList.remove('still');
  }
  function set(state, quick) {
    var one = state === 'one';
    its.forEach(function (el, i) { el.style.setProperty('--d', (quick ? 0 : one ? i * 70 : (its.length - 1 - i) * 35) + 'ms'); });
    clearTimeout(timer);
    if (quick) { root.classList.add('still'); root.dataset.state = state; void root.offsetWidth; root.classList.remove('still'); }
    else { root.classList.add('fly'); timer = setTimeout(function () { root.dataset.state = state; timer = setTimeout(function () { root.classList.remove('fly'); }, one ? 1350 : 1050); }, 150); }
    btn.classList.toggle('quiet', one);
    txt.textContent = one ? 'Scatter it again' : 'Gather it into one chat';
  }
  function disarm() { clearTimeout(armed); armed = 0; btn.classList.remove('arm'); }

  place();
  set(calm ? 'one' : 'scatter', true);
  btn.hidden = false;
  btn.addEventListener('click', function () { touched = true; disarm(); set(root.dataset.state === 'one' ? 'scatter' : 'one', calm); });

  var raf = 0, w0 = stage.offsetWidth;
  if (window.ResizeObserver) new ResizeObserver(function () {
    if (stage.offsetWidth === w0) return; w0 = stage.offsetWidth;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(place);
  }).observe(stage);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  window.addEventListener('load', place);

  // plays once by itself, and only while its sign can be seen: the button is whole and in the upper two thirds of the screen,
  // the line on it fills for 1.6 s, then the parts gather. A pause on the page (FX.held) takes the sign away and nothing plays
  function held() { return !!(window.FX && FX.held); }
  if (!calm && window.IntersectionObserver) {
    new IntersectionObserver(function (es) {
      if (!es[es.length - 1].isIntersecting) return disarm();
      if (seen || touched || armed || held()) return;
      btn.classList.add('arm');
      armed = setTimeout(function () { armed = 0; btn.classList.remove('arm'); if (touched || held()) return; seen = true; set('one'); }, 1700);
      if (watch) watch();
    }, { threshold: 1, rootMargin: '0px 0px -35% 0px' }).observe(btn);
    // the pause button marks itself with data-held. While the line fills, a short watch also covers a pause button that came later
    var drop = function () { if (armed && held()) disarm(); };
    if (window.MutationObserver) [].forEach.call(document.querySelectorAll('.fx-all'), function (b) { new MutationObserver(drop).observe(b, { attributes: true, attributeFilter: ['data-held'] }); });
    watch = function () { if (armed) { drop(); setTimeout(watch, 120); } };
  }
})();
