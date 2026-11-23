/* FYI case study, layer: The colour.
   A thread on the iPhone is built from the app's own parts (FX.k), and every part is tagged with the job its colour does.
   Choose a colour and the parts that do not wear it step back. On first view the phone shows all its colours, then everything but pink steps back, once, in about half a second. */
(function () {
  var root = document.getElementById('fya-colour'); if (!root) return;
  var box = root.querySelector('.fyac'), kit = root.querySelector('.fyac-kit'), stage = root.querySelector('.fyac-stage'),
    rows = [].slice.call(root.querySelectorAll('.fyac-r[data-k]')), nameEl = root.querySelector('.fyac-say b'), jobEl = root.querySelector('.fyac-say span');
  var FX = window.FX, K = FX && FX.k, ic = FX && FX.ic;
  if (!box || !kit || !stage || !rows.length || !K || !ic) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LEAD = 300, DWELL = 90;

  /* ---- the thread ---- */
  var t = function (s) { return '<span class="fyac-t">' + s + '</span>'; };
  kit.innerHTML = K.hd({ tabs: false })
    + '<div class="fyac-th">'
    + '<div class="a-callbar">' + ic('video') + '<span class="tx">Theo started a video call</span><span class="a-stack">' + K.av('t', 's') + '</span><span class="j">Join</span></div>'
    + K.b(t('Dock Hall 3 signed. Fri Nov 20, doors at 9'), { who: 'k', t: '6:40 PM' })
    + K.b('perfect, sending to the DJ', { o: 1, t: '6:41 PM', rd: 2 })
    + K.ai({ title: 'Catch up', body: '<ul><li>' + t('Launch night is on.') + '<br>' + K.src('Kofi · Wed 6:40 PM') + '</li></ul>' })
    + K.ticket({ pub: 1, going: 4 })
    + '<div class="a-chip st-need"><span class="ck"></span>' + t('Final stems ·') + '<span class="nw">No date</span></div>'
    + '</div>'
    + '<div class="a-comp"><span class="kb">' + K.knot() + '</span><div class="a-rec"><span class="dot"></span><span class="tmr">0:07</span>' + K.wave(22, 8) + '<span class="mc">' + ic('up') + '</span></div></div>';

  /* which job each part's colour does: [selector, part, surface] */
  [['.a-hd .bk', 'ground'], ['.a-hd .a-pj', 'print'], ['.a-hd .nm', 'ground'], ['.a-hd .sub', 'ground'], ['.a-hd .acts', 'ground'],
    ['.a-callbar', '', 'live'], ['.a-callbar > .i', 'live'], ['.a-callbar .tx', 'ground'], ['.a-callbar .a-stack', 'people'], ['.a-callbar .j', 'live'],
    ['.a-b[data-w]', '', 'ground'], ['.a-b .who', 'people'], ['.a-b[data-w] .fyac-t', 'ground'], ['.a-b[data-w] .tm', 'ground'], ['.a-b.o', 'you'],
    ['.a-ai .knot', 'ai'], ['.a-ai .hd > span:not(.vis)', 'ground'], ['.a-ai .vis', 'ai'], ['.a-ai .fyac-t', 'ground'], ['.a-ai .a-src', 'ai'],
    ['.a-tk', '', 'ground'], ['.a-tk .perf', '', 'ground'], ['.a-pub', 'print'], ['.a-tk .ps', 'print'], ['.a-tk .db', 'print'], ['.a-tk .inf', 'ground'], ['.a-go', 'you'], ['.a-may', 'ground'],
    ['.a-tk .cnt .a-stack', 'people'], ['.a-tk .cnt > span:last-child', 'ground'],
    ['.a-chip', '', 'ground'], ['.a-chip .ck', 'ground'], ['.a-chip .fyac-t', 'ground'], ['.a-chip .nw', 'signal'],
    ['.a-comp .kb', 'ai'], ['.a-rec', '', 'ground'], ['.a-rec .dot', 'signal'], ['.a-rec .tmr', 'ground'], ['.a-rec .a-wave', 'ground'], ['.a-rec .mc', 'you']
  ].forEach(function (m) { [].forEach.call(kit.querySelectorAll(m[0]), function (el) { if (m[1]) el.dataset.c = m[1]; if (m[2]) el.dataset.s = m[2]; }); });

  /* ---- one colour alone ---- */
  var locked = '', shown = null, dwT = 0, firstT = 0, first = false;
  function say(k) {
    if (!nameEl || !jobEl) return;
    var row = k && rows.filter(function (r) { return r.dataset.k === k; })[0];
    nameEl.textContent = row ? row.querySelector('b').textContent : nameEl.dataset.rest;
    jobEl.textContent = row ? row.querySelector('.fyac-job').textContent : '';
  }
  function show(k) {
    if (k === shown) return; shown = k;
    if (k) box.dataset.one = k; else delete box.dataset.one;
    rows.forEach(function (r) { r.classList.toggle('cur', r.dataset.k === k); });
    say(k);
  }
  function lock(k) {
    locked = locked === k ? '' : k;
    rows.forEach(function (r) { r.setAttribute('aria-pressed', r.dataset.k === locked ? 'true' : 'false'); });
    show(locked);
  }
  function peek(k) { clearTimeout(dwT); dwT = setTimeout(function () { show(k || locked); }, k ? DWELL : 140); }
  function mine() { first = true; clearTimeout(firstT); }

  /* on first view everything but pink steps back, once */
  function settle() {
    if (first) return; first = true;
    var now = reduce || (window.FX && FX.held);
    firstT = setTimeout(function () { if (!locked) lock('you'); }, now ? 0 : LEAD);
  }

  rows.forEach(function (r) {
    var k = r.dataset.k;
    r.addEventListener('click', function () { mine(); clearTimeout(dwT); lock(k); });
    r.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { mine(); peek(k); } });
    r.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') peek(''); });
    r.addEventListener('focus', function () { if (r.matches(':focus-visible')) { mine(); peek(k); } });
    r.addEventListener('blur', function () { peek(''); });
  });
  /* the parts answer too: point at one and its colour stands alone */
  var roleOf = function (el) {
    var p = el.closest && el.closest('[data-c], [data-s]'); if (!p || !kit.contains(p)) return '';
    var k = (p.dataset.c || p.dataset.s).split(' ')[0]; return k === 'ground' ? '' : k;
  };
  kit.addEventListener('pointerover', function (e) { if (e.pointerType !== 'mouse') return; var k = roleOf(e.target); mine(); peek(k); });
  kit.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') peek(''); });
  kit.addEventListener('click', function (e) { var k = roleOf(e.target); if (k) { mine(); clearTimeout(dwT); lock(k); } });
  root.addEventListener('keydown', function (e) { if (e.key === 'Escape' && locked) { clearTimeout(dwT); lock(locked); } });

  show('');
  if (window.IntersectionObserver && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting && en.intersectionRatio >= .55) { settle(); io.disconnect(); } });
    }, { threshold: [0, .55] });
    io.observe(stage);
  } else settle();
})();
