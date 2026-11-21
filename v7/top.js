/* v7 - top: this section's behaviour. Loaded deferred, after the page's own scripts.
   Three glass windows sit side by side on one rail inside the painting. Each is a zoom into one held moment of a live Design Lab
   window (data-crop = x,y,w,h in the app's own 1440x900 pixels; data-mcrop for phones; data-tz-beat = the step the scene rests on).
   One number, x (0..2), says which window is in the middle: wide windows with motion allowed pin the section and take x from the
   page scroll; everywhere else the rail is a native swipeable row and x follows its scroll. The steps on the left read and set x. */
(function(){
  var top = document.getElementById('top'); if (!top) return;
  var frame = top.querySelector('.tz-frame'), track = top.querySelector('.tz-track'), rail = top.querySelector('.tz-rail'), list = top.querySelector('.tz-steps');
  if (!frame || !track || !rail || !list) return;
  var wins = [].slice.call(rail.children), steps = [].slice.call(list.children), N = wins.length;
  if (!N || steps.length !== N) return;
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var wide = matchMedia('(min-width: 1000px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
  var phone = matchMedia('(max-width: 719px)');
  var clamp = function(v, a, b){ return Math.max(a, Math.min(b, v)); };
  var pinned = false, cur = 0, tgt = 0, raf = 0, centers = [], fw = 0, active = -1;
  // the scroll's share for each move between two windows (the rest is rest: a window stays put while it is read)
  var MOVES = [[.24, .42], [.60, .78]], STOPS = [.10, .51, .90];

  list.classList.add('live');

  /* crop and scale: the app keeps its native size, the view is scaled so the crop fills the window */
  function crops(){
    wins.forEach(function(w){
      var c = ((phone.matches && w.dataset.mcrop) || w.dataset.crop || '0,0,1440,900').split(',').map(Number), el = w.querySelector('.tz-crop');
      el.style.setProperty('--cx', c[0]); el.style.setProperty('--cy', c[1]); el.style.aspectRatio = c[2] + ' / ' + c[3]; w._cw = c[2];
    });
    measure();
  }
  function measure(){
    wins.forEach(function(w){ var el = w.querySelector('.tz-crop'), cw = el.clientWidth; if (cw) el.style.setProperty('--s', (cw / w._cw).toFixed(5)); });
    centers = wins.map(function(w){ return w.offsetLeft + w.offsetWidth / 2; });
    fw = track.clientWidth;
    // the list keeps the height of its tallest state, so opening a longer line never moves the heading or the button
    var shut = 0, tall = 0;
    steps.forEach(function(li){ var d = li.querySelector('.tz-d'); shut += li.querySelector('.tz-step').offsetHeight + parseFloat(getComputedStyle(li).paddingBottom); tall = Math.max(tall, d ? d.scrollHeight : 0); });
    list.style.minHeight = Math.ceil(shut + tall) + 'px';
    if (pinned) apply(cur); else { track.scrollLeft = at(cur) - fw / 2; apply(cur); }
  }
  // the rail position (px) of a fractional window index
  function at(x){ var i = clamp(Math.floor(x), 0, N - 1), j = Math.min(N - 1, i + 1); return centers[i] + (centers[j] - centers[i]) * (x - i); }
  function fromScroll(){ var c = track.scrollLeft + fw / 2; for (var i = 0; i < N - 1; i++) { if (c <= centers[i + 1]) return clamp(i + (c - centers[i]) / (centers[i + 1] - centers[i]), 0, N - 1); } return N - 1; }

  function apply(x, sp){
    if (pinned) rail.style.transform = 'translate3d(' + (fw / 2 - at(x)).toFixed(2) + 'px,0,0)';
    frame.style.setProperty('--px', (x - (N - 1) / 2).toFixed(4));
    var k = clamp(Math.round(x), 0, N - 1);
    wins.forEach(function(w, i){ w.style.setProperty('--a', Math.min(1, Math.abs(i - x)).toFixed(4)); });
    steps.forEach(function(s, i){ s.style.setProperty('--sp', (sp ? sp[i] : clamp(x - i, 0, 1)).toFixed(4)); });
    if (k !== active) {
      active = k;
      wins.forEach(function(w, i){ w.classList.toggle('on', i === k); });
      steps.forEach(function(s, i){ s.classList.toggle('on', i === k); s.classList.toggle('done', i < k); var b = s.querySelector('.tz-step'); if (i === k) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    }
  }

  /* pinned: the page scroll is the clock */
  var prog = [0, 0, 0];
  function span(){ return Math.max(1, top.offsetHeight - innerHeight); }
  function onScroll(){
    if (!pinned) return;
    var p = clamp(-top.getBoundingClientRect().top / span(), 0, 1), x = 0;
    MOVES.forEach(function(m){ var t = clamp((p - m[0]) / (m[1] - m[0]), 0, 1); x += t * t * (3 - 2 * t); });
    // the line under a number fills while its window is the one being read, and is full once the next window arrives
    for (var i = 0; i < N; i++) { var a = i ? MOVES[i - 1][1] : 0, b = MOVES[i] ? MOVES[i][1] : 1; prog[i] = clamp((p - a) / (b - a), 0, 1); }
    tgt = x; if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick(){
    raf = 0; cur += (tgt - cur) * .15;
    if (Math.abs(tgt - cur) < .0012) cur = tgt; else raf = requestAnimationFrame(tick);
    apply(cur, prog);
  }
  /* free: the rail's own scroll is the clock */
  var st = 0;
  track.addEventListener('scroll', function(){ if (pinned || st) return; st = requestAnimationFrame(function(){ st = 0; if (pinned) return; cur = fromScroll(); apply(cur); }); }, { passive: true });

  function go(i){
    if (pinned) scrollTo({ top: top.getBoundingClientRect().top + scrollY + span() * STOPS[i], behavior: 'smooth' });
    else track.scrollTo({ left: centers[i] - fw / 2, behavior: reduce.matches ? 'auto' : 'smooth' });
  }
  steps.forEach(function(s, i){ s.querySelector('.tz-step').addEventListener('click', function(){ go(i); }); });

  function mode(){
    var on = wide.matches;
    if (on !== pinned) {
      pinned = on; root.classList.toggle('tz-scroll', on);
      if (on) track.scrollLeft = 0; else { rail.style.transform = ''; cur = Math.round(cur); }
    }
    crops();
    if (pinned) { onScroll(); cur = tgt; apply(cur, prog); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', mode);
  [wide, phone].forEach(function(m){ if (m.addEventListener) m.addEventListener('change', mode); });
  if ('ResizeObserver' in window) new ResizeObserver(function(){ measure(); }).observe(track);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  mode();

  /* the live windows: each rests on one moment of its scene (no clock, no loop). A window is a player of work/lab-live.js.
     The page holds far-off windows back (data-lab-wait) and wakes each when it comes into view; the windows waiting at the side
     of the rail are clipped, so they would wake only as they slide in. Here all three are woken together once the section is
     within two screens. Each is marked seen, so the lab does not start it, and held on its step; the lab may still start one
     on its own (reduced motion opens every window on its rest step), so the hold is checked again for a few seconds. */
  function hold(){
    var all = true;
    wins.forEach(function(w){
      var r = w.querySelector('.lx'); if (!r) return;
      // the page's own waker copies data-lab-wait back later, so the attribute stays for it to find
      if (!r.dataset.lab && r.dataset.labWait) r.dataset.lab = r.dataset.labWait;
      var p = r._lx, k = +r.dataset.tzBeat;
      if (!p || !p.run) { all = false; if (window.LX && LX.init && r.dataset.lab) LX.init(r); return; }
      p.seen = true; p.parked = false;
      // data-tz-beat="-1": the scene's opening frame, before its first step
      if (k < 0) { if (r._tzTok === p.token) return; p.reset(); p.user = false; p.started = false; r._tzTok = p.token; p.sync(); return; }
      if (r._tzHeld && p.shown === k && !p.user) return;
      r._tzHeld = true; p.run(k, true); p.sync();
    });
    return all;
  }
  var tries = 0, woke = false;
  function wake(){ if (woke) return; woke = true; (function wait(){ var ok = hold(); if (++tries < 80 && (!ok || tries < 36)) setTimeout(wait, ok ? 250 : 100); else measure(); })(); }
  if ('IntersectionObserver' in window) { var near = new IntersectionObserver(function(es){ if (es.some(function(e){ return e.isIntersecting; })) { near.disconnect(); wake(); } }, { rootMargin: '1600px 0px' }); near.observe(top); }
  else wake();
})();
