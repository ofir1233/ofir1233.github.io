/* FYI case study, layer: The structure.
   Eight pieces on one line. Choosing a piece runs the line back to the first stop in pink, stop by stop,
   and the voice note plays when the line arrives. Until the reader chooses, the block walks itself back once, then rests with the whole line lit. */
(function () {
  var root = document.getElementById('fya-map'); if (!root) return;
  var box = root.querySelector('.fym'), map = root.querySelector('.fym-map'), crew = root.querySelector('.fym-crew'), rail = root.querySelector('.fym-rail');
  var nodes = [].slice.call(root.querySelectorAll('.fym-n'));
  if (!box || !map || !crew || !rail || nodes.length < 2) return;
  var say = root.querySelector('.fym-say'), who = root.querySelector('.fym-who'), rule = root.querySelector('.fym-rule'), hops = root.querySelector('.fym-hops'), clock = root.querySelector('.fym-clock');
  var base = rail.querySelector('.b'), pink = rail.querySelector('.p');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DWELL = 3600;

  var NAME = ['Voice note', 'Transcript', 'Private catch-up', 'Task', 'Vote on covers', 'Event draft', 'Public event page', 'Formats'];
  var RULE = nodes.map(function (n) { var r = n.querySelector('.fym-r'); return r ? r.textContent : ''; });
  var TAB = [0, 0, 0, 0, 0, 0, 2, 2], SEG = [0, 0, 0, 1, 0, 0, -1, -1]; // where each piece lives: app tab, thread tab

  /* the pieces themselves, from the app's own kit */
  var K = window.FX && window.FX.k, bars = [];
  function fill(name, html, cls) { var el = root.querySelector('[data-m="' + name + '"]'); if (el) el.innerHTML = cls === false ? html : '<span class="fym-k fx-app fx-static fya-kit">' + html + '</span>'; return el; }
  if (K) try {
    fill('voice', K.voice({ o: true }));
    fill('tr', K.tr('What if the drop isn\'t a post. What if it\'s a night.'));
    fill('ai', K.ai({ title: 'Catch up', body: '<ul><li>Launch night is on.<br>' + K.src('Kofi · Wed 6:40 PM') + '</li></ul>' }));
    fill('task', K.b('I\'ll have the visualizer cut by Nov 12.', { who: 't' }) + K.chip('Visualizer cut · ' + K.av('t', 's') + 'Theo · Nov 12', 'appr').replace('class="a-chip', 'class="a-chip t4-chip'));
    var row = function (x, t, n, w, mine, ps) { return '<div class="r' + (mine ? ' mine' : '') + '"><i class="bar" style="width:' + w + '%"></i>' + K.cov(x) + '<span class="t">' + t + '</span>' + (ps ? K.stack(ps, 's') : '') + '<span class="v">' + n + '</span></div>'; };
    var pl = fill('poll', '<div class="a-poll">' + row('a', 'A · Horizon', 1, 25, 0, 'i') + row('b', 'B · Grooves', 3, 75, 1, 'mtk') + row('c', 'C · Stack', 0, 0, 0, '') + '</div>'); if (pl) pl.firstChild.classList.add('pl');
    fill('event', '<div class="a-banner">' + K.knot() + '<span>Drafted from this chat · check before you publish</span></div><div class="a-fld"><div class="k">When<span class="sg">from message</span></div><div class="v">Fri, Nov 20 · Doors 9 PM</div></div>');
    fill('tabs', '<span class="fym-set">' + K.av('m', 'l') + 'Settings</span>' + K.tabbar(0), false);
    fill('thread', K.hd({ tasks: 4 }), false);
    bars = [].slice.call(root.querySelectorAll('[data-m="voice"] .a-wave i'));
  } catch (e) {}
  var tabs = [].slice.call(root.querySelectorAll('.fym-nv .a-tabbar > span')), segs = [].slice.call(root.querySelectorAll('.fym-nv .a-seg > span'));

  /* the line: one path through every stop, measured from the page as it is laid out */
  var L = [], total = 0, wide = true;
  function build() {
    var mr = map.getBoundingClientRect(), cr = crew.getBoundingClientRect(); if (!mr.width) return;
    var pts = nodes.map(function (n) { var d = n.querySelector('.fym-dot').getBoundingClientRect(); return [d.left + d.width / 2 - mr.left, d.top + d.height / 2 - mr.top]; });
    var XR = cr.right - mr.left - 22, XL = cr.left - mr.left + 22, mid = (XR + XL) / 2, f = function (v) { return Math.round(v * 10) / 10; };
    wide = Math.abs(pts[0][1] - pts[1][1]) < 3;
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]), tmp = base; L = [0];
    for (var k = 1; k < pts.length; k++) {
      var p = pts[k - 1], q = pts[k], dx = q[0] - p[0], dy = q[1] - p[1];
      if (Math.abs(dy) < 3 || (!wide && Math.abs(dx) < 3)) d += ' L' + f(q[0]) + ' ' + f(q[1]);
      else { // the line turns round the end of a row
        var X = p[0] > mid ? XR : XL, s = X > p[0] ? 1 : -1, r = Math.min(22, Math.abs(dy) / 2), v = dy > 0 ? 1 : -1;
        d += ' L' + f(X - s * r) + ' ' + f(p[1]) + ' Q' + f(X) + ' ' + f(p[1]) + ' ' + f(X) + ' ' + f(p[1] + v * r) + ' L' + f(X) + ' ' + f(q[1] - v * r) + ' Q' + f(X) + ' ' + f(q[1]) + ' ' + f(X - s * r) + ' ' + f(q[1]) + ' L' + f(q[0]) + ' ' + f(q[1]);
      }
      tmp.setAttribute('d', d); L[k] = tmp.getTotalLength();
    }
    total = L[L.length - 1];
    rail.setAttribute('width', mr.width); rail.setAttribute('height', mr.height);
    pink.setAttribute('d', d);
    if (cur >= 0) dash(0, L[cur]);
  }
  function dash(a, b) { pink.style.strokeDasharray = Math.max(0.01, b - a) + ' ' + (total + 10); pink.style.strokeDashoffset = -a; }

  /* choose a piece */
  var cur = -1, raf = 0, timers = [], swapT = 0;
  function stop() { cancelAnimationFrame(raf); timers.forEach(clearTimeout); timers = []; }
  function wave() { bars.forEach(function (b, k) { timers.push(setTimeout(function () { b.classList.add('p'); }, reduce ? 0 : 60 + k * 18)); }); }
  function text(i) {
    var put = function () { if (who) who.textContent = ('0' + (i + 1)) + ' · ' + NAME[i]; if (rule) rule.textContent = RULE[i]; if (hops) hops.textContent = i ? 'Step ' + (i + 1) + ' of ' + nodes.length : 'The source'; if (say) say.classList.remove('swap'); };
    clearTimeout(swapT);
    if (reduce || !say) return put();
    say.classList.add('swap'); swapT = setTimeout(put, 150);
  }
  function select(i, instant) {
    if (i < 0 || i >= nodes.length) return;
    stop(); cur = i; box.classList.add('lit');
    nodes.forEach(function (n, k) { n.setAttribute('aria-pressed', k === i ? 'true' : 'false'); n.tabIndex = k === i ? 0 : -1; n.classList.toggle('sel', k === i); n.classList.toggle('off', k > i); n.classList.toggle('hit', k === i || (!!instant && k < i)); });
    tabs.forEach(function (t, k) { t.classList.toggle('on', k === TAB[i]); });
    segs.forEach(function (t, k) { t.classList.toggle('on', k === SEG[i]); });
    bars.forEach(function (b) { b.classList.remove('p'); });
    text(i);
    var end = L[i] || 0;
    if (instant || reduce || !end) { nodes.forEach(function (n, k) { if (k < i) n.classList.add('hit'); }); dash(0, end); if (instant) bars.forEach(function (b) { b.classList.add('p'); }); else wave(); return; }
    var dur = 300 + 170 * i, t0 = performance.now();
    dash(end, end);
    raf = requestAnimationFrame(function step(t) {
      var u = Math.min(1, (t - t0) / dur), e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, a = end * (1 - e);
      dash(a, end);
      for (var k = i - 1; k >= 0; k--) if (L[k] >= a - 1) nodes[k].classList.add('hit');
      if (u < 1) raf = requestAnimationFrame(step); else wave();
    });
  }

  /* the walk: one lap from the last piece back to the first, only on screen, only until the reader takes over */
  var auto = !reduce, seen = false, next = nodes.length - 1, walkT = 0;
  function held() { return !!(window.FX && window.FX.held); }
  function rest() { if (held() && cur < 0) select(nodes.length - 1, true); } // paused before arriving: the finished state, never a dead diagram
  function tick() {
    clearTimeout(walkT);
    if (!wide) { box.classList.remove('auto'); if (cur < 0) select(nodes.length - 1, true); return; } // one column: no walk, the whole line is lit until a piece is tapped
    rest();
    if (!auto || !seen || held() || document.hidden) { box.classList.remove('auto'); return; }
    if (next < 0) { auto = false; box.classList.remove('auto'); select(nodes.length - 1, true); return; } // the lap is done: rest on the whole line
    box.classList.add('auto');
    select(next); next--;
    if (clock) { clock.classList.remove('go'); void clock.offsetWidth; clock.classList.add('go'); }
    walkT = setTimeout(tick, DWELL);
  }
  function take() { if (!auto) return; auto = false; clearTimeout(walkT); box.classList.remove('auto'); }

  var hoverT = 0, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  nodes.forEach(function (n, i) {
    n.addEventListener('click', function () { take(); if (cur !== i) select(i); });
    n.addEventListener('focus', function () { if (n.matches(':focus-visible')) { take(); if (cur !== i) select(i); } });
    if (fine) {
      n.addEventListener('pointerenter', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { take(); if (cur !== i) select(i); }, 110); });
      n.addEventListener('pointerleave', function () { clearTimeout(hoverT); });
    }
    n.addEventListener('keydown', function (e) {
      var to = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : -1;
      if (to >= 0 && to < nodes.length) { e.preventDefault(); nodes[to].focus(); }
    });
  });

  nodes.forEach(function (n, i) { n.tabIndex = i ? -1 : 0; }); // one tab stop for the eight; arrows move inside
  build();
  if (window.ResizeObserver) new ResizeObserver(build).observe(map); else addEventListener('resize', build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  addEventListener('load', build);

  if (reduce || held() || !wide) select(nodes.length - 1, true); // the finished state: the whole line, back to the source
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    var r = es[0].intersectionRatio, was = seen; seen = r >= .5 || (seen && r > .2);
    rest();
    if (seen && !was) tick(); else if (!seen) { clearTimeout(walkT); box.classList.remove('auto'); }
  }, { threshold: [0, .2, .35, .5, .75] }).observe(map);
  else { seen = true; tick(); }
  var all = document.querySelector('.fx-all');
  if (all && window.MutationObserver) new MutationObserver(tick).observe(all, { attributes: true, attributeFilter: ['data-held'] });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) tick(); });
})();
