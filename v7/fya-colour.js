/* FYI case study, layer: The colour.
   A piece of the thread is built from the app's own parts (FX.k), and every part is tagged with the job its colour does.
   Choose a job on the left and the parts that do not wear it step back. The thin bar over the thread is each job's share of the tile, measured from the parts' own boxes. */
(function () {
  var root = document.getElementById('fya-colour'); if (!root) return;
  var box = root.querySelector('.fyac'), tile = root.querySelector('.fyac-tile'), kit = root.querySelector('.fyac-kit'), fit = root.querySelector('.fyac-fit'),
    stage = root.querySelector('.fyac-stage'), roles = root.querySelector('.fyac-roles'), rows = [].slice.call(root.querySelectorAll('.fyac-r[data-k]')), all = root.querySelector('.fyac-all'),
    says = root.querySelector('.fyac-says'), nameEl = root.querySelector('.fyac-name'), ruleEl = root.querySelector('.fyac-rule'), hxEl = root.querySelector('.fyac-hx');
  var FX = window.FX, K = FX && FX.k, ic = FX && FX.ic;
  if (!box || !tile || !kit || !fit || !rows.length || !nameEl || !ruleEl || !K || !ic) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEAD = 700, HOLD = 2200, DWELL = 90, ORDER = rows.map(function (r) { return r.dataset.k; });

  /* ---- the thread ---- */
  var t = function (s) { return '<span class="fyac-t">' + s + '</span>'; };
  var fmt = function (s) { return '<span data-s="ground">' + ic('check') + '<em data-c="ground">' + s + '</em></span>'; };
  kit.innerHTML =
    '<div class="fyac-col">'
    + '<div class="a-callbar">' + ic('video') + '<span class="tx">Theo started a video call</span><span class="a-stack">' + K.av('t', 's') + '</span><span class="j">Join</span></div>'
    + K.b(t('Dock Hall 3 signed. Fri Nov 20, doors at 9'), { who: 'k', t: '6:40 PM' })
    + K.b('perfect, sending to the DJ', { o: 1, t: '6:41 PM', rd: 2 })
    + K.ai({ title: 'Catch up', body: '<ul><li>' + t('Launch night is on.') + '<br>' + K.src('Kofi · Wed 6:40 PM') + '</li></ul><div class="acts"><span class="a-ab">Summarize</span></div>' })
    + '<div class="a-poll o t5-poll"><div class="q">Which cover?<span>Poll · 1 vote</span></div>'
    + '<div class="r"><i class="bar"></i><span class="t">A · Horizon</span><span class="v">0</span></div>'
    + '<div class="r mine"><i class="bar" style="width:100%"></i><span class="t">B · Grooves</span>' + K.stack('m', 's') + '<span class="v">1</span></div></div>'
    + '</div><div class="fyac-col">'
    + K.ticket({ pub: 1, going: 4 })
    + '<div class="a-fmts">' + fmt('Story') + fmt('Post') + fmt('Link page') + '</div>'
    + '<div class="a-fld need"><div class="k">Due</div><div class="v">No date</div></div>'
    + '</div>'
    + '<div class="a-comp"><span class="kb">' + K.knot() + '</span><div class="a-rec"><span class="dot"></span><span class="tmr">0:07</span>' + K.wave(44, 8) + '<span class="mc">' + ic('up') + '</span></div></div>';

  /* which job each part's colour does: [selector, part, surface] */
  [['.a-callbar', '', 'live'], ['.a-callbar > .i', 'live'], ['.a-callbar .tx', 'ground'], ['.a-callbar .a-stack', 'people'], ['.a-callbar .j', 'live'],
    ['.a-b[data-w]', '', 'ground'], ['.a-b .who', 'people'], ['.a-b[data-w] .fyac-t', 'ground'], ['.a-b[data-w] .tm', 'ground'], ['.a-b.o', 'you'],
    ['.a-ai .knot', 'ai'], ['.a-ai .hd > span:not(.vis)', 'ground'], ['.a-ai .vis', 'ai'], ['.a-ai .fyac-t', 'ground'], ['.a-ai .a-src', 'ai'], ['.a-ai .a-ab', 'ai'],
    ['.a-poll', '', 'ground'], ['.a-poll .q', 'ground'], ['.a-poll .r', '', 'ground'], ['.a-poll .bar', 'you'], ['.a-poll .t', 'ground'], ['.a-poll .a-stack', 'people'], ['.a-poll .v', 'ground'],
    ['.a-tk', '', 'ground'], ['.a-tk .perf', '', 'ground'], ['.a-pub', 'print'], ['.a-tk .ps', 'print'], ['.a-tk .db', 'print'], ['.a-tk .inf', 'ground'], ['.a-go', 'you'], ['.a-may', 'ground'],
    ['.a-tk .cnt .a-stack', 'people'], ['.a-tk .cnt > span:last-child', 'ground'], ['.a-fmts .i', 'you'],
    ['.a-fld', '', 'ground'], ['.a-fld .k', 'ground'], ['.a-fld .v', 'signal'],
    ['.a-comp', '', 'ground'], ['.a-comp .kb', 'ai'], ['.a-rec', '', 'ground'], ['.a-rec .dot', 'signal'], ['.a-rec .tmr', 'ground'], ['.a-rec .a-wave', 'ground'], ['.a-rec .mc', 'you']
  ].forEach(function (m) { [].forEach.call(kit.querySelectorAll(m[0]), function (el) { if (m[1]) el.dataset.c = m[1]; if (m[2]) el.dataset.s = m[2]; }); });

  /* ---- the kit is drawn in the phone's points: fit it to the tile ---- */
  var scale = 1;
  function fitKit() {
    var w = fit.clientWidth, nat = kit.offsetWidth; if (!w || !nat) return;
    scale = Math.min(1, w / nat);
    kit.style.transform = 'translateX(' + Math.max(0, (w - nat * scale) / 2) + 'px) scale(' + scale + ')';
    fit.style.height = Math.ceil(kit.offsetHeight * scale) + 'px';
    shares = null; drawBar();
  }

  /* ---- how much of the tile a job's colour takes: the boxes of its parts, a hairline as its length, black as the rest ---- */
  var shares = null;
  function measure() {
    var total = stage.getBoundingClientRect(), all = total.width * total.height, sum = {}, rest = 0; if (!all) return null;
    var area = function (el) { var r = el.getBoundingClientRect(); return r.width * r.height; };
    var edge = function (el, px) { var r = el.getBoundingClientRect(); return 2 * (r.width + r.height) * px * scale; };
    [].forEach.call(kit.querySelectorAll('[data-c]'), function (el) {
      var k = el.dataset.c; if (k === 'ground') return;
      sum[k] = (sum[k] || 0) + (el.matches('.a-ab, .kb') ? edge(el, 1) + (el.firstElementChild ? area(el.firstElementChild) : 0) : area(el));
    });
    [].forEach.call(kit.querySelectorAll('[data-s]:not([data-s="ground"])'), function (el) {
      var a = area(el); [].forEach.call(el.querySelectorAll('[data-c]'), function (c) { a -= area(c); }); sum[el.dataset.s] = (sum[el.dataset.s] || 0) + Math.max(0, a);
    });
    [].forEach.call(kit.querySelectorAll('.a-b[data-w]'), function () { sum.people = (sum.people || 0) + 28 * 28 * scale * scale; });
    [].forEach.call(kit.querySelectorAll('.a-ai'), function (el) { sum.ai = (sum.ai || 0) + edge(el, 1); });
    [].forEach.call(kit.querySelectorAll('.a-fld.need'), function (el) { sum.signal = (sum.signal || 0) + edge(el, 1); });
    Object.keys(sum).forEach(function (k) { sum[k] = sum[k] / all * 100; rest += sum[k]; });
    sum.ground = Math.max(0, 100 - rest);
    return sum;
  }
  var bar = root.querySelector('.fyac-bar'), INK = { you: '#ff2d8f', ai: 'linear-gradient(90deg,#ff2d8f,#7a2cff)', live: '#30d158', people: 'linear-gradient(90deg,#e8b45c 25%,#c3dc6b 25% 50%,#f28db2 50% 75%,#8ec8f2 75%)', print: '#f7f3ea', signal: '#ffb547', ground: '#3a3b4b' };
  function drawBar() {
    if (!bar) return; shares = shares || measure(); if (!shares) return;
    bar.innerHTML = ORDER.map(function (k) { return '<i data-k="' + k + '" style="background:' + INK[k] + ';' + (k === 'ground' ? 'flex:1 1 0' : 'width:' + (shares[k] || 0).toFixed(2) + '%') + '"></i>'; }).join('');
  }

  /* ---- one colour alone ---- */
  var locked = '', shown = '', swT = 0, dwT = 0;
  function say(k, now) {
    var row = k && rows.filter(function (r) { return r.dataset.k === k; })[0];
    var put = function () {
      nameEl.textContent = row ? row.querySelector('b').textContent : nameEl.dataset.rest;
      ruleEl.textContent = row ? row.dataset.rule : ruleEl.dataset.rest;
      if (hxEl) hxEl.innerHTML = row ? row.querySelector('.fyac-hex').innerHTML : '';
      says.classList.remove('sw');
    };
    clearTimeout(swT);
    if (reduce || now) return put();
    says.classList.add('sw'); swT = setTimeout(put, 150);
  }
  function show(k) {
    if (k === shown) return; shown = k;
    if (k) box.dataset.one = k; else delete box.dataset.one;
    rows.forEach(function (r) { r.classList.toggle('cur', r.dataset.k === k); });
    if (all) all.classList.toggle('cur', !k);
    say(k);
  }
  function lock(k) {
    locked = locked === k ? '' : k;
    rows.forEach(function (r) { r.setAttribute('aria-pressed', r.dataset.k === locked ? 'true' : 'false'); });
    if (all) all.setAttribute('aria-pressed', locked ? 'false' : 'true');
    show(locked);
  }
  function peek(k) { clearTimeout(dwT); dwT = setTimeout(function () { show(k || locked); }, k ? DWELL : 140); }

  /* ---- on first view pink alone stands once, under its clock line, then the tile rests ---- */
  var walkT = 0, walked = false, walking = false;
  function stopWalk() { if (!walking) return; walking = false; clearTimeout(walkT); box.classList.remove('walk'); }
  function walk() {
    if (walked || reduce || locked || (window.FX && FX.held)) return; walked = walking = true;
    box.style.setProperty('--fyac-hold', HOLD + 'ms');
    walkT = setTimeout(function () {
      if (window.FX && FX.held) { stopWalk(); return; }
      box.classList.add('walk'); show('you');
      walkT = setTimeout(function () { stopWalk(); show(locked); }, HOLD);
    }, LEAD);
  }
  function mine() { stopWalk(); walked = true; }

  rows.forEach(function (r) {
    var k = r.dataset.k;
    r.addEventListener('click', function () {
      mine(); clearTimeout(dwT); lock(k);
    });
    r.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { mine(); peek(k); } });
    r.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') peek(''); });
    r.addEventListener('focus', function () { if (r.matches(':focus-visible')) { mine(); peek(k); } });
    r.addEventListener('blur', function () { peek(''); });
  });
  /* All lets go of a kept colour */
  if (all) all.addEventListener('click', function () { mine(); clearTimeout(dwT); if (locked) lock(locked); else show(''); });
  /* the parts answer too: point at one and its colour stands alone */
  var roleOf = function (el) { var p = el.closest && el.closest('[data-c], [data-s]'); return p && kit.contains(p) ? (p.dataset.c || p.dataset.s).split(' ')[0] : ''; };
  kit.addEventListener('pointerover', function (e) { if (e.pointerType !== 'mouse') return; var k = roleOf(e.target); if (k) { mine(); peek(k); } });
  kit.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') peek(''); });
  kit.addEventListener('click', function (e) { var k = roleOf(e.target); if (k) { mine(); clearTimeout(dwT); lock(k); } });
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && locked) { clearTimeout(dwT); lock(locked); } });

  fitKit(); say('', true);
  if (window.ResizeObserver) new ResizeObserver(fitKit).observe(fit); else addEventListener('resize', fitKit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitKit(); if (!shown) say('', true); });
  if (window.IntersectionObserver && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && en.intersectionRatio >= .55) walk();
        else if (!en.isIntersecting && walking) { stopWalk(); show(locked); }
        if (walked && !walking) io.disconnect();
      });
    }, { threshold: [0, .55] });
    io.observe(tile);
  }
})();
