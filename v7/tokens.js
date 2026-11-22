/* v7 - tokens: Foundations, colour. Loaded deferred. Styles and the reason for the part: v7/tokens.css.
   The picture is cut into its nine colours once, in the browser: every pixel is given to the colour it belongs to, and each colour
   becomes its own layer over a pencil underdrawing of the same picture. The product screen beside it is tagged the same way (data-t).
   - First view: the colours arrive in four beats, one per role (ground, structure, voice, meaning), and build the picture and the
     screen together ("build"). The words change four times, not nine. It plays once, only while in view, never because of the mouse.
   - After that: a colour under the mouse stays alone in both ("one"): a chip, a place in the picture, or a part of the product screen.
     Leaving brings everything back ("all"). A click keeps the colour; a second click lets it go.
   Nothing here changes a size. With reduced motion there is no build and the changes are immediate. */
(function () {
  var root = document.querySelector('#system .tk'); if (!root) return;
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* key, role, name, hex, the job, where it is in the picture, where it is in the product */
  var T = [
    ['P', 'Ground', 'Paper', 'F4F3F1', 'The page everything rests on.', 'the bare canvas and the white walls', 'the page, and the white of a card'],
    ['S', 'Ground', 'Sky', 'CFE4F6', 'The room the product sits in.', 'light in the clouds and on the water', 'the space behind every card'],
    ['G', 'Structure', 'Glass Grey', 'CBD3DA', 'It holds the layout without drawing a box.', 'the shade on the white walls', 'hairlines, avatars, quiet chips'],
    ['K', 'Structure', 'Ink', '181818', 'Words, and the one decision on a screen.', 'the darkest strokes', 'text and the main button'],
    ['B', 'Voice', 'Hear Blue', '139FFD', "The product's voice: live, selected, in focus.", 'the sky and its mirror in the water', 'a good score, the focus ring'],
    ['D', 'Voice', 'Deep Blue', '0B6FCF', 'Blue that can be read.', 'the glass towers and the deep water', 'links and labels on white'],
    ['C', 'Meaning', 'Coral', 'FF6F52', 'Something needs attention.', 'the boat, the awnings, the lighthouse', 'a low score, an alert'],
    ['E', 'Meaning', 'Green', '4BA373', 'It went well.', 'the trees, the shutters, one boat', 'a finished call, a number that rose'],
    ['L', 'Meaning', 'Lilac', 'D59BE0', 'The AI is speaking.', 'the flowers and one sail', 'an AI-made filter, an AI answer']
  ];
  var touch = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ALL = ['The palette', 'Nine colours, one job each', 'Four roles, shared by the picture and the screen.', (touch ? 'Tap' : 'Point at') + ' a colour, here or in the picture, to see it alone in both.', ''];
  /* the build's four beats: role, its colours, the sentence, where it is in the picture, where in the product */
  var BEATS = [
    ['Ground', 'PS', 'What everything rests on.', 'the bare canvas, the light in the clouds', 'the page and the space behind a card'],
    ['Structure', 'GK', 'The layout and the words.', 'shade on the walls, the darkest strokes', 'hairlines, text, the main button'],
    ['Voice', 'BD', 'The product speaking.', 'the sky, the water, the glass towers', 'scores, links, the focus ring'],
    ['Meaning', 'CEL', 'Small, and only with a reason.', 'a boat, the trees, the flowers', 'an alert, a finished call, an AI filter']
  ];
  var GAP = 280, HOLD = 760;
  var stage = root.querySelector('.tk-stage'), frame = root.querySelector('.tk-pic .tk-frame'), img = root.querySelector('.tk-full'),
    under = root.querySelector('.tk-under'), box = root.querySelector('.tk-layers'), pal = root.querySelector('.tk-pal'),
    say = root.querySelector('.tk-say'), re = root.querySelector('.tk-re');
  var chips = [].slice.call(root.querySelectorAll('.tk-c')), parts = [].slice.call(root.querySelectorAll('[data-t]'));
  var F = {}; [].forEach.call(root.querySelectorAll('[data-f]'), function (el) { F[el.getAttribute('data-f')] = el; });
  var idx = {}; T.forEach(function (t, i) { idx[t[0]] = i; });
  var layers = [], mode = 'all', locked = null, timer = 0, textT = 0, offT = 0, step = -1, inView = false, started = false, ready = false, paused = false;
  var beatT = [], top = null, tw = 0, th = 0, shown = '';
  root.classList.add('js');

  function setMode(m) { mode = m; root.setAttribute('data-mode', m); }
  /* keys: the letters that are lit; null means every colour */
  function lit(keys) {
    parts.forEach(function (el) { el.classList.toggle('off', keys !== null && keys.indexOf(el.getAttribute('data-t')) < 0); });
    if (keys !== null) layers.forEach(function (c, i) { c.classList.toggle('on', keys.indexOf(T[i][0]) >= 0); });
  }
  /* t: a colour's row from T, a beat's row from BEATS (b = its number), or null for the whole palette */
  function text(t, b) {
    clearTimeout(textT); if (!calm) say.classList.add('sw');
    textT = setTimeout(function () {
      say.classList.toggle('hint', !t);
      if (b) {
        F.role.textContent = 'Role'; F.n.textContent = '0' + b + ' / 04'; F.name.textContent = t[0]; F.hex.textContent = '';
        F.say.textContent = t[2]; F.pic.textContent = t[3]; F.ui.textContent = t[4];
      } else {
        F.role.textContent = t ? t[1] : ALL[0];
        F.n.textContent = t ? ('0' + (idx[t[0]] + 1)) + ' / 09' : '';
        F.name.textContent = t ? t[2] : ALL[1];
        F.hex.textContent = t ? '#' + t[3] : '';
        F.say.textContent = t ? t[4] : ALL[2];
        F.pic.textContent = t ? t[5] : ALL[3];
        F.ui.textContent = t ? t[6] : ALL[4];
      }
      say.classList.remove('sw');
    }, calm ? 0 : 150);
  }
  function mark(cur) {
    chips.forEach(function (c) {
      var k = c.getAttribute('data-k');
      c.classList.toggle('cur', k === cur); c.setAttribute('aria-pressed', k === locked ? 'true' : 'false');
    });
  }
  function stop() { clearTimeout(timer); clearTimeout(offT); beatT.forEach(clearTimeout); beatT = []; paused = false; }

  function all() {
    stop(); shown = ''; setMode('all'); lit(null); text(null); mark(null);
    chips.forEach(function (c) { c.classList.add('in'); });
    /* the whole picture fades in over the layers; only then are they put away */
    offT = setTimeout(function () { if (mode === 'all') layers.forEach(function (c) { c.classList.remove('on'); }); }, calm ? 0 : 460);
  }
  function one(k) {
    if (mode === 'one' && shown === k) return;
    stop(); started = true; shown = k; setMode('one'); lit(k); text(T[idx[k]]); mark(k);
    chips.forEach(function (c) { c.classList.add('in'); });
    say.setAttribute('aria-live', 'polite'); if (!calm) re.hidden = false;
  }
  function build() {
    if (calm) return;
    stop(); locked = null; step = -1; shown = ''; started = true; say.removeAttribute('aria-live');
    setMode('build'); lit(''); mark(null);
    chips.forEach(function (c) { c.classList.remove('in'); });
    timer = setTimeout(next, 260);
  }
  function next() {
    if (mode !== 'build') return;
    step++;
    if (!inView || step >= BEATS.length) { all(); re.hidden = false; say.setAttribute('aria-live', 'polite'); return; }
    var bt = BEATS[step], before = ''; for (var i = 0; i < step; i++) before += BEATS[i][1];
    text(bt, step + 1);
    /* the words lead by a breath, then the role's colours arrive one after the other */
    bt[1].split('').forEach(function (k, j) {
      beatT.push(setTimeout(function () {
        if (mode !== 'build') return;
        var keys = before + bt[1].slice(0, j + 1);
        chips.forEach(function (c) { c.classList.toggle('in', keys.indexOf(c.getAttribute('data-k')) >= 0); });
        lit(keys);
      }, 160 + j * GAP));
    });
    timer = setTimeout(next, 160 + (bt[1].length - 1) * GAP + HOLD);
  }

  chips.forEach(function (c) {
    var k = c.getAttribute('data-k');
    c.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' && mode !== 'build') one(k); });
    c.addEventListener('focus', function () { if (mode !== 'build' && c.matches(':focus-visible')) one(k); });
    c.addEventListener('click', function () { if (locked === k) { locked = null; all(); } else { locked = k; one(k); } });
  });
  function rest() { if (mode !== 'one') return; if (locked) one(locked); else all(); }
  pal.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') rest(); });
  pal.addEventListener('focusout', function (e) { if (!pal.contains(e.relatedTarget)) rest(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mode === 'one' && (locked || root.contains(document.activeElement))) { locked = null; all(); } });
  document.addEventListener('pointerdown', function (e) { if (locked && mode === 'one' && !root.contains(e.target)) { locked = null; all(); } });
  if (re) re.addEventListener('click', build);

  /* Pointing at the world itself: a place in the picture names its colour, and so does a part of the product screen. */
  function free() { return ready && mode !== 'build' && mode !== 'wait'; }
  function at(e) {
    if (!top) return null;
    var r = frame.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * tw), y = Math.floor((e.clientY - r.top) / r.height * th);
    if (x < 0 || y < 0 || x >= tw || y >= th) return null;
    var k = top[y * tw + x]; return k === 255 ? null : T[k][0];
  }
  function pick(k) { if (locked === k) { locked = null; all(); } else { locked = k; shown = ''; one(k); } }
  var mv = 0, last = null;
  frame.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || !free()) return; last = e;
    if (!mv) mv = requestAnimationFrame(function () { mv = 0; var k = at(last); if (k) one(k); });
  });
  frame.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') rest(); });
  frame.addEventListener('click', function (e) { if (!free()) return; var k = at(e); if (k) pick(k); });
  var ui = root.querySelector('.tk-ui .tk-frame');
  if (ui) {
    ui.addEventListener('pointerover', function (e) { if (e.pointerType !== 'mouse' || !free()) return; var el = e.target.closest('[data-t]'); if (el && ui.contains(el)) one(el.getAttribute('data-t')); });
    ui.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') rest(); });
    ui.addEventListener('click', function (e) { if (!free()) return; var el = e.target.closest('[data-t]'); if (el && ui.contains(el)) pick(el.getAttribute('data-t')); });
  }

  /* ---- the picture, cut into its colours ---- */
  function ss(x, a, b) { var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
  function band(x, a, b, f) { return ss(x, a - f, a + f) * (1 - ss(x, b - f, b + f)); }
  function hue(h, a, b, f) { return a <= b ? band(h, a, b, f) : Math.max(band(h, a, 400, f), band(h, -40, b, f)); }
  function prep(done) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(540, Math.min(img.naturalWidth, Math.round(frame.clientWidth * dpr))), h = Math.round(w * 2 / 3), n = w * h;
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var cx = c.getContext('2d', { willReadFrequently: true }), src;
    try { cx.drawImage(img, 0, 0, w, h); src = cx.getImageData(0, 0, w, h).data; } catch (e) { done(false); return; }
    var L = new Float32Array(n), out = T.map(function () { return new Uint8ClampedArray(n * 4); }), base = new Uint8ClampedArray(n * 4);
    var W = new Float32Array(9), y = 0, rows = 72, tp = new Uint8Array(n);
    function slice() {
      var end = Math.min(h, y + rows);
      for (; y < end; y++) for (var x = 0, i = y * w, p = i * 4; x < w; x++, i++, p += 4) {
        var r = src[p], g = src[p + 1], b = src[p + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn, v = mx / 255, s = mx ? d / mx : 0, hh = 0;
        L[i] = (.299 * r + .587 * g + .114 * b) / 255;
        if (d) { hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; }
        var bl = hue(hh, 186, 250, 6), sat = bl ? ss(s, .33, .39) : 0;
        W[0] = ss(v, .84, .92) * (1 - ss(s, .09, .15));
        W[1] = bl ? bl * band(s, .09, .36, .03) * ss(v, .72, .80) : 0;
        W[2] = (1 - ss(s, .14, .22)) * band(v, .38, .86, .04);
        W[3] = Math.max(1 - ss(v, .24, .34), (1 - ss(s, .2, .3)) * (1 - ss(v, .34, .42)));
        W[4] = sat ? bl * sat * ss(v, .64, .72) : 0;
        W[5] = sat ? bl * sat * band(v, .24, .68, .04) : 0;
        W[6] = hue(hh, 338, 36, 6) * ss(s, .26, .36) * ss(v, .42, .52);
        W[7] = hue(hh, 66, 186, 6) * ss(s, .12, .2) * ss(v, .2, .3);
        W[8] = hue(hh, 250, 338, 6) * ss(s, .08, .14) * ss(v, .36, .46);
        var bk = 255, bw = .12;
        for (var k = 0; k < 9; k++) if (W[k] > .004) { var o = out[k]; o[p] = r; o[p + 1] = g; o[p + 2] = b; o[p + 3] = W[k] * 255; if (W[k] > bw) { bw = W[k]; bk = k; } }
        tp[i] = bk;
      }
      if (y < h) setTimeout(slice, 0); else draw();
    }
    function draw() {
      /* the underdrawing: the picture's light as a pale wash on paper, its edges as pencil */
      var ks = .9 * w / 600;
      for (var yy = 0, i = 0, p = 0; yy < h; yy++) for (var x = 0; x < w; x++, i++, p += 4) {
        var gx = x > 0 && x < w - 1 ? L[i + 1] - L[i - 1] : 0, gy = yy > 0 && yy < h - 1 ? L[i + w] - L[i - w] : 0;
        var f = .86 + .12 * L[i] - Math.min(.26, Math.sqrt(gx * gx + gy * gy) * ks);
        base[p] = 244 * f; base[p + 1] = 243 * f; base[p + 2] = 241 * f; base[p + 3] = 255;
      }
      under.width = w; under.height = h; under.getContext('2d').putImageData(new ImageData(base, w, h), 0, 0);
      out.forEach(function (o) {
        var ly = document.createElement('canvas'); ly.className = 'tk-ly'; ly.width = w; ly.height = h;
        ly.getContext('2d').putImageData(new ImageData(o, w, h), 0, 0); box.appendChild(ly); layers.push(ly);
      });
      top = tp; tw = w; th = h;
      done(true);
    }
    slice();
  }
  function go() { if (inView && !started && ready && !calm) build(); }
  function load() {
    function onImg() {
      prep(function (ok) {
        if (ok) root.classList.add('ready');
        ready = true;
        /* a colour chosen before the layers were ready is shown now */
        if (mode === 'one') lit(locked || (root.querySelector('.tk-c.cur') || chips[0]).getAttribute('data-k'));
        go();
      });
    }
    img.loading = 'eager';
    if (img.complete && img.naturalWidth) onImg(); else { img.addEventListener('load', onImg, { once: true }); img.addEventListener('error', function () { ready = true; go(); }, { once: true }); }
  }

  if (!('IntersectionObserver' in window)) { setMode('all'); load(); return; }
  if (calm) setMode('all'); else { setMode('wait'); lit(''); }
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '900px 0px' }).observe(root);
  var stIn = false, paIn = false;
  function seen() { inView = stIn && (paIn || innerWidth <= 760); if (inView && !started) go(); }
  new IntersectionObserver(function (es) { stIn = es[0].isIntersecting && es[0].intersectionRatio >= .6; seen(); }, { threshold: [0, .6, .8] }).observe(stage);
  new IntersectionObserver(function (es) { paIn = es[0].isIntersecting && es[0].intersectionRatio >= .9; seen(); }, { threshold: [0, .9] }).observe(pal);
})();
