/* FYI case study, layer: The cast.
   Pick a face: the cut-out comes forward on its ground colour, its role is set in type,
   and the same face lands in a chat thread. Nothing plays by itself except the first arrival. */
(function () {
  'use strict';
  var sec = document.getElementById('fya-cast');
  if (!sec) return;
  var root = sec.querySelector('.fyacast');
  if (!root) return;
  var q = function (s) { return root.querySelector(s); };
  var plate = q('.fyacast-plate'), cut = q('.fyacast-l.cut img'), sh = q('.fyacast-l.sh img'),
    say = q('.fyacast-say'), tag = say && say.querySelector('.fya-tag'), role = q('.fyacast-role b'), line = q('.fyacast-line'),
    me = q('.fyacast-me'), av = me && me.querySelector('.a-av'), re = q('.fyacast-re'), ret = q('.fyacast-ret'),
    btns = [].slice.call(root.querySelectorAll('.fyacast-f'));
  if (!plate || !cut || !sh || !btns.length) return;

  var IMG = '../img/fyi/';
  var CAST = {
    hamster: { role: 'drummer', a: 'a', genre: 'Punk, fast', line: 'Small, loud, and already two bars ahead.', g: '#e8336f', alt: 'A hamster with a mohawk, round sunglasses and drumsticks' },
    dog: { role: 'sax', a: 'a', genre: 'Late jazz', line: 'Has not opened the chart since the first rehearsal.', g: '#1d53c4', alt: 'A golden retriever in a cap with a saxophone, eyes closed' },
    alpaca: { role: 'selector', a: 'a', genre: 'Dub reggae', line: 'Arrives on the offbeat. Leaves when the record ends.', g: '#d98f2f', alt: 'An alpaca in a knit beanie with a hoop earring' },
    cat: { role: 'singer', a: 'a', genre: 'Soul, one take', line: 'Does one take. Insists it was the first one.', g: '#5a2fc0', alt: 'A tabby cat at a vintage microphone' },
    parrot: { role: 'MC', a: 'an', genre: 'Freestyle rap', line: 'Repeats nothing. Remembers everything.', g: '#e12a86', alt: 'A grey parrot in a backwards cap, beak open' },
    beagle: { role: 'beatmaker', a: 'a', genre: 'Boom bap', line: 'Hears a kick drum in every closing door.', g: '#1fa9d6', alt: 'A beagle in a beanie and sunglasses with headphones round its neck' },
    rabbit: { role: 'producer', a: 'a', genre: 'Electronic', line: 'Calls it finished. Opens the project again.', g: '#163a8c', alt: 'A white rabbit in a mirrored visor at a keyboard' },
    tortoise: { role: 'listener', a: 'a', genre: 'Ambient, long', line: 'Put out one track. It is still playing.', g: '#ead0a8', alt: 'A tortoise in over-ear headphones, eyes closed' }
  };
  var still = false;
  try { still = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var held = function () { return !!(window.FX && window.FX.held); };
  var now = root.getAttribute('data-on') || 'hamster', run = 0, timers = [];
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  var clear = function () { timers.forEach(clearTimeout); timers = []; };
  var loaded = {};
  var load = function (id) {
    if (loaded[id]) return loaded[id];
    loaded[id] = ['a-', 's-'].map(function (p) {
      var im = new Image(); im.src = IMG + p + id + '.webp';
      return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
    });
    return loaded[id];
  };

  function words(c, id) {
    plate.style.setProperty('--g', c.g);
    if (me) me.style.setProperty('--g', c.g);
    cut.src = IMG + 'a-' + id + '.webp'; cut.alt = c.alt;
    sh.src = IMG + 's-' + id + '.webp';
    if (tag) tag.textContent = c.genre;
    if (role) role.textContent = c.role;
    if (line) line.textContent = c.line;
  }
  function thread(c, id) {
    if (av) av.style.backgroundImage = 'url(' + IMG + 'f-' + id + '.webp)';
    if (ret) ret.textContent = 'Good. We needed ' + c.a + ' ' + c.role + '.';
  }
  /* on a phone the faces are one scrolling row: keep the pressed one in view, sideways only */
  var row = q('.fyacast-pick');
  function show(b) {
    if (!row || row.scrollWidth <= row.clientWidth + 1) return;
    var left = Math.max(0, b.offsetLeft - (row.clientWidth - b.offsetWidth) / 2);
    try { row.scrollTo({ left: left, behavior: still ? 'auto' : 'smooth' }); } catch (e) { row.scrollLeft = left; }
  }
  function mark(id) {
    /* one tab stop for the eight faces: the pressed one. Arrows move between them. */
    btns.forEach(function (b) {
      var on = b.getAttribute('data-id') === id;
      b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1;
      if (on) show(b);
    });
    root.setAttribute('data-on', id);
  }

  /* beats: 0 the old one steps back, 160 the new one comes forward (600), 320 the face lands in the thread, 800 the reply */
  function pick(id, first) {
    var c = CAST[id];
    if (!c || (id === now && !first)) return;
    now = id; mark(id); clear();
    var my = ++run;
    if (still) { root.classList.remove('is-out', 'is-pre'); words(c, id); thread(c, id); if (me) me.classList.remove('is-hid'); if (re) re.classList.remove('is-hid'); return; }
    var ready = Promise.all(load(id));
    if (!first) root.classList.add('is-out');
    if (me) me.classList.add('is-hid');
    if (re) re.classList.add('is-hid');
    later(function () {
      ready.then(function () {
        if (my !== run) return;
        words(c, id);
        root.classList.add('is-pre'); root.classList.remove('is-out');
        void plate.offsetWidth;
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (my === run) root.classList.remove('is-pre'); }); });
        later(function () { thread(c, id); if (me) me.classList.remove('is-hid'); }, 160);
        later(function () { if (re) re.classList.remove('is-hid'); }, 640);
      });
    }, first ? 0 : 160);
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { pick(b.getAttribute('data-id')); });
    b.addEventListener('keydown', function (e) {
      var i = btns.indexOf(b), d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : e.key === 'Home' ? -i : e.key === 'End' ? btns.length - 1 - i : 0;
      if (!d) return;
      e.preventDefault();
      var n = btns[(i + d + btns.length) % btns.length];
      n.focus(); pick(n.getAttribute('data-id'));
    });
  });

  /* the first arrival, once, when the stage is on screen */
  var arrived = false;
  function arrive() {
    if (arrived) return; arrived = true;
    btns.forEach(function (b) { load(b.getAttribute('data-id')); });
    if (still || held()) { // reduced motion or a paused page: the stage is simply there
      var f = root.closest('.fya'); if (f) f.classList.add('now');
      root.classList.remove('is-pre'); if (me) me.classList.remove('is-hid'); if (re) re.classList.remove('is-hid');
      if (f) { void f.offsetWidth; f.classList.remove('now'); }
      return;
    }
    pick(now, true);
  }
  if (!still && 'IntersectionObserver' in window && !held()) {
    root.classList.add('is-pre');
    if (me) me.classList.add('is-hid');
    if (re) re.classList.add('is-hid');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); arrive(); } });
    }, { threshold: 0.45 });
    io.observe(plate);
    if (me) io.observe(me.parentNode);
  } else { arrived = true; btns.forEach(function (b) { load(b.getAttribute('data-id')); }); }

  /* depth: the cut-out and its shadow part a little under the pointer. Mouse only. */
  var fine = false;
  try { fine = matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
  if (fine && !still) {
    var tx = 0, ty = 0, x = 0, y = 0, raf = 0, stage = q('.fyacast-stage') || root;
    var step = function () {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      plate.style.setProperty('--mx', x.toFixed(3)); plate.style.setProperty('--my', y.toFixed(3));
      if (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002) raf = requestAnimationFrame(step);
      else { raf = 0; if (!tx && !ty) root.classList.remove('is-live'); }
    };
    var go = function () { root.classList.add('is-live'); if (!raf) raf = requestAnimationFrame(step); };
    stage.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var r = plate.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
      go();
    });
    stage.addEventListener('pointerleave', function () { tx = 0; ty = 0; go(); });
  }
})();
