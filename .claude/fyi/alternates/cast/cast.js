/* FYI door, direction "Pick who you are".
   The wall is the sign-up screen made big: point at an animal and it speaks, choose one and it walks into the phone. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var IMG = 'img/';
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)');
  var SMALL = matchMedia('(max-width: 760px)');
  var FINE = matchMedia('(hover: hover) and (pointer: fine)');

  /* x, y, w: place on the 780 x 606 stage. r: lean. z under 3 stands behind the phone. s: how far the animal leans out of its card. */
  var CAST = [
    { id: 'hamster', role: 'the drummer', noun: 'DRUMMER', kind: 'PUNK, FAST', kindUi: 'Punk, fast',
      head: ['You count', 'it in. Nobody', 'is ready.'], line: 'Small, loud, and already two bars ahead.',
      x: 2, y: 34, w: 172, r: -6, z: 2, s: 1.12, g: '#e8336f', side: 'l', face: [0.0608, 0.0622, 0.8011] },
    { id: 'dog', role: 'the sax', noun: 'SAX', kind: 'LATE JAZZ', kindUi: 'Late jazz',
      head: ['You play it', 'slow, with your', 'eyes shut.'], line: 'Has not opened the chart since the first rehearsal.',
      x: 114, y: 160, w: 144, r: 5, z: 2, s: 1.15, g: '#1d53c4', side: 'l', face: [0.1657, 0, 0.7459] },
    { id: 'alpaca', role: 'the selector', noun: 'SELECTOR', kind: 'DUB REGGAE', kindUi: 'Dub reggae',
      head: ['You are', 'in no hurry.', 'None at all.'], line: 'Arrives on the offbeat. Leaves when the record ends.',
      x: 0, y: 266, w: 162, r: 4, z: 5, s: 1.15, g: '#d98f2f', side: 'l', face: [0.105, 0.0489, 0.8011] },
    { id: 'cat', role: 'the singer', noun: 'SINGER', kind: 'SOUL, ONE TAKE', kindUi: 'Soul, one take',
      head: ['You take', 'the mic.', 'Naturally.'], line: 'Does one take. Insists it was the first one.',
      x: 108, y: 380, w: 154, r: -4, z: 6, s: 1.1, g: '#5a2fc0', side: 'l', flat: true, face: [0.1243, 0, 0.7735] },
    { id: 'parrot', role: 'the MC', noun: 'MC', kind: 'FREESTYLE RAP', kindUi: 'Freestyle rap',
      head: ['You have', 'something', 'to say.'], line: 'Repeats nothing. Remembers everything.',
      x: 524, y: 26, w: 152, r: 4, z: 2, s: 1.15, g: '#e12a86', side: 'r', face: [0.1713, 0.0178, 0.7735] },
    { id: 'beagle', role: 'the beatmaker', noun: 'BEATMAKER', kind: 'BOOM BAP', kindUi: 'Boom bap',
      head: ['You nod', 'first. Then', 'the room does.'], line: 'Hears a kick drum in every closing door.',
      x: 634, y: 142, w: 170, r: -5, z: 4, s: 1.15, g: '#1fa9d6', side: 'r', face: [0.1105, 0.0533, 0.8011] },
    { id: 'rabbit', role: 'the producer', noun: 'PRODUCER', kind: 'ELECTRONIC', kindUi: 'Electronic',
      head: ['You turn', 'one knob', 'for an hour.'], line: 'Calls it finished. Opens the project again.',
      x: 520, y: 292, w: 150, r: -3, z: 5, s: 1.1, g: '#163a8c', side: 'r', flat: true, face: [0.0994, 0.1156, 0.8011] },
    { id: 'tortoise', role: 'the listener', noun: 'LISTENER', kind: 'AMBIENT, LONG', kindUi: 'Ambient, long',
      head: ['You let', 'the note', 'ring.'], line: 'Put out one track. It is still playing.',
      x: 638, y: 376, w: 168, r: 6, z: 6, s: 1.22, g: '#ead0a8', side: 'r', face: [0.1436, 0, 0.7459] }
  ];
  var BY = {}; CAST.forEach(function (c) { BY[c.id] = c; });
  var REST_HEAD = ['Before you', 'come in, pick', 'who you are.'];

  /* ---------------------------------------------------------------- a seeded hand */
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* ---------------------------------------------------------------- marker lettering: single strokes, drawn here, written on in order */
  var G = {
    A: [70, 'M6 100 L34 2 L64 100', 'M18 64 L53 62'], B: [62, 'M11 1 L10 100', 'M10 3 C56 -3 58 44 13 48 C68 50 64 103 10 98'],
    C: [64, 'M59 19 C40 -8 6 14 6 52 C6 92 42 108 61 82'], D: [68, 'M11 1 L10 100', 'M10 3 C76 0 74 100 10 98'],
    E: [56, 'M52 1 L11 2 L10 100 L54 99', 'M11 50 L45 49'], F: [54, 'M52 1 L11 2 L10 100', 'M11 50 L44 49'],
    G: [70, 'M60 19 C40 -8 6 14 6 52 C6 96 50 108 62 78 L62 57 L39 57'], H: [68, 'M11 0 L10 100', 'M58 0 L58 100', 'M10 51 L58 49'],
    I: [22, 'M11 0 L11 100'], J: [48, 'M38 0 L38 72 C38 104 8 104 4 80'], K: [62, 'M11 0 L10 100', 'M56 1 L12 57', 'M27 42 L58 100'],
    L: [52, 'M11 0 L10 99 L50 100'], M: [86, 'M8 100 L15 1 L43 70 L71 1 L78 100'], N: [70, 'M10 100 L11 1 L60 99 L60 0'],
    O: [74, 'M37 1 C-5 0 -4 100 37 100 C78 100 79 2 37 1'], P: [60, 'M11 0 L10 100', 'M10 3 C66 -4 64 57 11 54'],
    Q: [74, 'M37 1 C-5 0 -4 100 37 100 C78 100 79 2 37 1', 'M46 76 L68 105'], R: [62, 'M11 0 L10 100', 'M10 3 C66 -4 64 55 11 52', 'M29 52 L58 100'],
    S: [58, 'M52 17 C40 -8 4 0 8 28 C12 52 52 46 52 74 C52 106 10 104 4 82'], T: [60, 'M2 1 L58 0', 'M30 1 L30 100'],
    U: [68, 'M10 0 L10 66 C10 110 58 110 58 66 L58 0'], V: [66, 'M4 0 L33 100 L62 0'], W: [92, 'M4 0 L24 100 L46 30 L68 100 L88 0'],
    X: [62, 'M6 0 L56 100', 'M56 0 L6 100'], Y: [62, 'M4 0 L31 53 L58 0', 'M31 53 L31 100'], Z: [60, 'M6 1 L54 0 L6 100 L56 99'],
    ',': [20, 'M10 90 L3 112']
  };
  /* text -> an svg of round marker strokes with an ink keyline under them. cap: height of a capital in px. */
  function marker(text, o) {
    var rnd = rng(hash(text) + 7), x = 0, ink = '', top = '', n = 0, track = o.track == null ? 13 : o.track;
    var up = text.toUpperCase();
    for (var i = 0; i < up.length; i++) {
      var ch = up[i];
      if (ch === ' ') { x += 34; continue; }
      var g = G[ch]; if (!g) continue;
      var rot = (rnd() - .5) * 6, dy = (rnd() - .5) * 8, sc = .96 + rnd() * .09;
      var tf = 'translate(' + x.toFixed(1) + ' ' + dy.toFixed(1) + ') rotate(' + rot.toFixed(1) + ' ' + (g[0] / 2) + ' 50) scale(' + sc.toFixed(3) + ')';
      for (var k = 1; k < g.length; k++) {
        var p = '<path pathLength="1" style="--d:' + (o.delay || 0 + n * (o.step || 30)) + '" transform="' + tf + '" d="' + g[k] + '"/>';
        ink += p; top += p; n++;
      }
      x += g[0] * sc + track;
    }
    var W = x - track, pad = 20, k2 = o.cap / 100;
    var w = (W + pad * 2) * k2, h = (100 + pad * 2) * k2;
    return { w: w, n: n, html: '<svg class="mk ' + (o.cls || '') + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" viewBox="' + (-pad) + ' ' + (-pad) + ' ' + (W + pad * 2).toFixed(1) + ' ' + (100 + pad * 2) + '" aria-hidden="true" focusable="false">' +
      '<g transform="skewX(-7)" stroke="' + (o.key || '#171b20') + '" stroke-width="' + (o.keyW || 30) + '">' + ink + '</g>' +
      '<g transform="skewX(-7)" stroke="' + o.color + '" stroke-width="' + (o.sw || 14) + '">' + top + '</g></svg>' };
  }

  /* ---------------------------------------------------------------- ink over the picture: one mark per animal, each a picture of its sound */
  function smooth(pts) { /* Catmull-Rom through the points, as cubic beziers */
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function ticks(r, x, y, ang, len, n, gap, cls) {
    var a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), out = '';
    for (var i = 0; i < n; i++) {
      var ox = x - dy * gap * i + (r() - .5) * 1.5, oy = y + dx * gap * i + (r() - .5) * 1.5, l = len * (.75 + r() * .5);
      out += '<path class="' + (cls || '') + '" d="M' + ox.toFixed(1) + ' ' + oy.toFixed(1) + ' L' + (ox + dx * l).toFixed(1) + ' ' + (oy + dy * l).toFixed(1) + '"/>';
    }
    return out;
  }
  function coil(r, x0, y0, x1, y1, loops, rad, cls) {
    var pts = [], N = loops * 10;
    for (var i = 0; i <= N; i++) { var t = i / N, a = t * loops * Math.PI * 2 - 1.2; pts.push([x0 + (x1 - x0) * t + Math.cos(a) * rad * (1 + (r() - .5) * .25), y0 + (y1 - y0) * t + Math.sin(a) * rad * (1 + (r() - .5) * .25)]); }
    return '<path class="' + (cls || '') + '" d="' + smooth(pts) + '"/>';
  }
  function wave(r, x0, y0, x1, y1, n, amp, cls, sharp) {
    var pts = [], N = n * (sharp ? 2 : 8), L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
    for (var i = 0; i <= N; i++) {
      var t = i / N, v = sharp ? (i % 2 ? 1 : -1) : Math.sin(t * n * Math.PI * 2);
      v *= amp * (1 + (r() - .5) * .3);
      pts.push([x0 + (x1 - x0) * t + nx * v, y0 + (y1 - y0) * t + ny * v]);
    }
    var d = sharp ? 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L') : smooth(pts);
    return '<path class="' + (cls || '') + '" d="' + d + '"/>';
  }
  function arcs(r, cx, cy, r0, dr, n, a0, a1, cls) {
    var out = '';
    for (var i = 0; i < n; i++) {
      var R = r0 + dr * i, pts = [];
      for (var k = 0; k <= 6; k++) { var a = (a0 + (a1 - a0) * k / 6 + (r() - .5) * 3) * Math.PI / 180; pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
      out += '<path class="' + (cls || '') + '" d="' + smooth(pts) + '"/>';
    }
    return out;
  }
  function loop(r, cx, cy, rx, ry, turns, cls) {
    var pts = [], N = Math.round(turns * 14);
    for (var i = 0; i <= N; i++) { var a = i / 14 * Math.PI * 2 - 2.2, g = 1 + i / N * .14; pts.push([cx + Math.cos(a) * rx * g + (r() - .5), cy + Math.sin(a) * ry * g + (r() - .5)]); }
    return '<path class="' + (cls || '') + '" d="' + smooth(pts) + '"/>';
  }
  /* card space is 100 x 124.3 */
  var INK = {
    hamster: function (r) { return ticks(r, 88, 62, -32, 20, 3, 8); },                                  /* hits */
    dog: function (r) { return coil(r, 88, 70, 124, 44, 4, 6.5); },                                      /* a long curl of breath */
    alpaca: function (r) { return wave(r, -16, 100, 40, 110, 3, 4.2) + wave(r, -12, 110, 36, 119, 3, 3.6); },   /* the offbeat, twice */
    cat: function (r) { return loop(r, 80, 74, 17, 23, 1.7); },                                          /* the mic, circled */
    beagle: function (r) { return ticks(r, 62, 118, -64, 20, 6, 6.4); },                                 /* bars, counted */
    parrot: function (r) { return arcs(r, 70, 58, 26, 10, 3, -40, 26); },                                /* a voice, leaving */
    rabbit: function (r) { return wave(r, 64, 12, 122, 4, 5, 6, '', true); },                           /* a saw wave */
    tortoise: function (r) { return wave(r, 40, -9, 122, 8, 2, 7); }                                     /* one slow wave */
  };


  /* ---------------------------------------------------------------- build the wall */
  var door = $('#fyi'), wrap = $('.wrap', door), stage = $('#stage'), stageIn = $('#stageIn'), wall = $('#wall');
  var phone = $('#phone'), screen = $('#screen'), slot = $('#slot'), me = $('#me'), burst = $('#burst');
  var cards = {};
  CAST.forEach(function (c, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'card' + (c.flat ? ' flat' : ''); b.dataset.id = c.id; b.dataset.side = c.side;
    b.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-label', c.role.charAt(0).toUpperCase() + c.role.slice(1) + ', ' + c.kindUi.toLowerCase() + '. ' + c.line + ' Choose.');
    b.style.cssText = '--x:' + c.x + ';--y:' + c.y + ';--w:' + c.w + ';--r:' + c.r + ';--z:' + c.z + ';--g:' + c.g + ';--as:' + c.s + ';--sil:url(' + IMG + 's-' + c.id + '.webp);' +
      '--bt:' + (5.2 + (i * 37 % 10) / 4) + 's;--bd:-' + (i * 1.7) + 's;--hx:' + (i % 2 ? '0%' : '100%') + ';--hy:' + (i % 3 ? '0%' : '100%') + ';' + (c.id === 'tortoise' ? '--dot:rgba(23,27,32,.28);' : '');
    var the = marker('THE', { cap: 15, color: '#fff', sw: 15, keyW: 34, cls: 'mk-the', step: 26 });
    var cap = Math.min(40, 30 * (c.w * 1.02) / marker(c.noun, { cap: 30, color: '#fff' }).w);
    var noun = marker(c.noun, { cap: cap, color: '#fff', cls: 'mk-noun', delay: 0, step: 26 });
    var kind = marker(c.kind, { cap: 13, color: '#ff2d8f', key: '#fff', keyW: 0, sw: 15, track: 15, step: 12 });
    /* the write-on runs the, then the noun, then the kind of music */
    var html =
      '<span class="tilt">' +
        '<span class="shape"><span class="back"></span>' + (c.flat ? '' : '<span class="cut"><i><img class="lay sil" src="' + IMG + 's-' + c.id + '.webp" alt="" decoding="async"></i></span>') + '</span>' +
        '<span class="gr"><img src="' + IMG + 'g-' + c.id + '.webp" alt="" decoding="async"></span>' +
        '<span class="an"><span class="breath"><img class="lay ani" src="' + IMG + 'a-' + c.id + '.webp" alt="" decoding="async"></span></span>' +
        '<svg class="ink" viewBox="0 0 100 124.3" aria-hidden="true" focusable="false">' + INK[c.id](rng(hash(c.id))) + '</svg>' +
        '<span class="peel">' + marker('YOU', { cap: 24, color: '#fff', keyW: 32, sw: 15 }).html + '</span>' +
        '<span class="voice">' + the.html + noun.html + '<span class="tag">' + kind.html + c.line + '</span></span>' +
      '</span>';
    b.innerHTML = html;
    /* stagger the three pieces of lettering */
    var d0 = 0;
    [['.mk-the', 26], ['.mk-noun', 26], ['.tag .mk', 12]].forEach(function (pair) {
      var paths = b.querySelectorAll(pair[0] + ' g:first-child path'), tops = b.querySelectorAll(pair[0] + ' g:last-child path');
      for (var k = 0; k < paths.length; k++) { paths[k].style.setProperty('--d', d0 + k * pair[1]); tops[k].style.setProperty('--d', d0 + k * pair[1]); }
      d0 += paths.length * pair[1] + 40;
    });
    b.querySelectorAll('.peel .mk path').forEach(function (p) { p.style.strokeDashoffset = 0; });
    wall.appendChild(b);
    cards[c.id] = { c: c, el: b, tilt: $('.tilt', b), gr: $('.gr img', b), ani: $('.ani', b), sil: $('.sil', b), ink: $('.ink', b),
      tx: 0, ty: 0, vx: 0, vy: 0, gx: 0, gy: 0, ox: 0, oy: 0, vox: 0, voy: 0, pox: 0, poy: 0, l: 0, vl: 0, gl: 0 };
  });

  /* ---------------------------------------------------------------- paint on the page behind the wall */
  (function paint() {
    var r = rng(41), sp = '';
    for (var i = 0; i < 90; i++) { var t = r(), a = r() * 6.28, d = 36 + r() * 46; var px = -20 + t * 820, py = 468 - Math.sin(t * 3.1) * 150 + (t > .5 ? -60 * (t - .5) : 0); sp += '<circle cx="' + (px + Math.cos(a) * d).toFixed(1) + '" cy="' + (py + Math.sin(a) * d).toFixed(1) + '" r="' + (.6 + r() * 1.7).toFixed(1) + '"/>'; }
    $('#paint').innerHTML =
      '<defs>' +
        '<filter id="spray" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="13" result="b"/><feTurbulence type="fractalNoise" baseFrequency="1.15" numOctaves="2" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3 2.05" result="g"/><feComposite in="b" in2="g" operator="in"/></filter>' +
        '<pattern id="ht" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><circle cx="4.5" cy="4.5" r="1.7" fill="#171b20"/></pattern>' +
        '<radialGradient id="htm"><stop offset=".15" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>' +
        '<mask id="htk"><circle cx="704" cy="96" r="150" fill="url(#htm)"/></mask><mask id="htk2"><circle cx="60" cy="540" r="130" fill="url(#htm)"/></mask>' +
      '</defs>' +
      '<g filter="url(#spray)" fill="none" stroke-linecap="round">' +
        '<path d="M-20 520 C 110 470, 230 600, 400 470 S 640 230, 800 290" stroke="#ff2d8f" stroke-width="84" opacity=".9"/>' +
        '<path d="M40 70 C 90 40, 150 60, 210 30" stroke="#19d9ff" stroke-width="46" opacity=".75"/>' +
        '<path d="M650 540 C 700 560, 740 520, 780 540" stroke="#7a3cff" stroke-width="40" opacity=".6"/>' +
      '</g>' +
      '<g fill="#ff2d8f" opacity=".55">' + sp + '</g>' +
      '<rect x="540" y="-60" width="320" height="320" fill="url(#ht)" mask="url(#htk)" opacity=".2"/>' +
      '<rect x="-80" y="400" width="300" height="290" fill="url(#ht)" mask="url(#htk2)" opacity=".16"/>';
  })();

  /* ---------------------------------------------------------------- phone contents */
  var thumbs = $('#thumbs');
  CAST.forEach(function (c) { var t = document.createElement('i'); t.dataset.id = c.id; t.style.backgroundImage = 'url(' + IMG + 'f-' + c.id + '.webp)'; thumbs.appendChild(t); });
  var CREW = { Maya: 'cat', Theo: 'hamster', Ines: 'rabbit', Kofi: 'beagle', Ari: 'tortoise' }, SUBS = ['dog', 'parrot', 'alpaca'];
  var IC = {
    pin: '<svg width="13" height="14" viewBox="0 0 13 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 13S1.5 8.6 1.5 5.4a5 5 0 0 1 10 0C11.500 8.600 6.500 13 6.500 13Z"/><circle cx="6.5" cy="5.4" r="1.6"/></svg>',
    video: '<svg width="15" height="12" viewBox="0 0 15 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="1" y="1.5" width="8.5" height="9" rx="2"/><path d="M9.5 5l4-2.5v7L9.500 7"/></svg>',
    photo: '<svg width="14" height="13" viewBox="0 0 14 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="1" y="1" width="12" height="11" rx="2.5"/><path d="M1.500 9.500l3.500-3 3 2.500 2-1.500 2.500 2"/></svg>'
  };
  function face(id) { return 'url(' + IMG + 'f-' + id + '.webp)'; }
  function crewFor(mine) {
    var out = {}, subs = SUBS.slice();
    Object.keys(CREW).forEach(function (n) { out[n] = CREW[n] === mine ? subs.shift() : CREW[n]; });
    return out;
  }
  function fillChats(mine) {
    var k = crewFor(mine);
    var rows = [
      { quad: [k.Maya, k.Theo, k.Ines, mine || k.Kofi], n: 'Copper Hours', t: '11:14 PM', s: 'Theo is typing<span class="dots"><i></i><i></i><i></i></span>', ty: 1 },
      { a: k.Ines, n: 'Ines', t: '10:52 PM', s: 'moodboard for the single' },
      { a: k.Kofi, n: 'Kofi', t: '9:30 PM', s: IC.pin + 'Sent a location' },
      { a: k.Theo, n: 'Theo', t: 'Yesterday', s: IC.video + 'Video call · 14 min' },
      { a: k.Ari, n: 'Ari', t: 'Sat', s: IC.photo + '12 photos' }
    ];
    $('#chList').innerHTML = rows.map(function (r, i) {
      var av = r.quad ? '<span class="av quad">' + r.quad.map(function (q) { return '<i style="background-image:' + face(q) + '"></i>'; }).join('') + '</span>' : '<span class="av" style="background-image:' + face(r.a) + '"></span>';
      return '<div class="row" style="--i:' + i + '">' + av + '<div class="row-m"><div class="row-1"><b>' + r.n + '</b><time>' + r.t + '</time></div><div class="row-2' + (r.ty ? ' ty' : '') + '">' + r.s + '</div></div></div>';
    }).join('');
  }
  fillChats(null);

  /* where the visitor's picture sits on each screen, in screen px */
  function off(el, root) { var x = 0, y = 0; while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return [x, y]; }
  function measureMe() {
    var s = off(slot, screen), h = off($('#chMe'), screen), d = slot.offsetWidth;
    me.style.setProperty('--sx', s[0] + 'px'); me.style.setProperty('--sy', s[1] + 'px');
    burst.style.setProperty('--sx', s[0] + 'px'); burst.style.setProperty('--sy', s[1] + 'px');
    me.style.setProperty('--hx', h[0] + 'px'); me.style.setProperty('--hy', h[1] + 'px'); me.style.setProperty('--hk', (34 / d).toFixed(4));
  }

  /* ---------------------------------------------------------------- the heading rewrites itself */
  var hd = $('#fyi-h'), headNow = '', headT = 0;
  function setHead(lines, now) {
    var key = lines.join('|'); if (key === headNow) { clearTimeout(headT); return; }
    clearTimeout(headT);
    headT = setTimeout(function () {
      headNow = key;
      hd.querySelectorAll('.hd-in.out').forEach(function (n) { n.remove(); });
      var old = $('.hd-in', hd), nw = document.createElement('span'), i = 0;
      nw.className = 'hd-in in';
      nw.innerHTML = lines.map(function (ln) { return '<span class="ln">' + ln.split(' ').map(function (w) { return '<span class="w" style="--i:' + (i++) + '">' + w + '</span>'; }).join(' ') + '</span>'; }).join(' ');
      if (old) { old.classList.remove('in'); old.classList.add('out'); old.setAttribute('aria-hidden', 'true'); setTimeout(function () { old.remove(); }, 300); }
      hd.appendChild(nw);
    }, now ? 0 : 70);
  }
  /* first paint: no animation */
  (function () { headNow = REST_HEAD.join('|'); $('.hd-in', hd).innerHTML = REST_HEAD.map(function (l) { return '<span class="ln">' + l + '</span>'; }).join(' '); })();

  /* ---------------------------------------------------------------- state */
  var S = { on: null, chosen: null, over: false, mx: 0, my: 0, seq: 0, timers: [], raf: 0, last: 0, k: 1, glance: null, seen: false };
  var go = $('#go'), goL = $('.btn-l', go), goF = $('.btn-face', go), again = $('#again'), say = $('#say');

  function setOn(id, opt) {
    if (S.on === id) return;
    if (S.on) cards[S.on].el.classList.remove('on');
    S.on = id;
    thumbs.querySelectorAll('i').forEach(function (t) { t.classList.toggle('pt', t.dataset.id === id); });
    door.classList.toggle('pointing', !!id);
    if (id) cards[id].el.classList.add('on');
    if (!opt || opt.head !== false) setHead(id ? BY[id].head : (S.chosen ? BY[S.chosen].head : REST_HEAD));
    kick();
  }

  /* ---------------------------------------------------------------- depth: every layer on a spring */
  function spring(o, p, v, target, k, c, dt) { var a = (target - o[p]) * k - o[v] * c; o[v] += a * dt; o[p] += o[v] * dt; }
  function layers(cd, tx, ty, flat) {
    cd.gr.style.transform = 'translate(' + (-tx * 5).toFixed(2) + 'px,' + (-ty * 5).toFixed(2) + 'px)';
    var t = 'translate(' + (tx * 7).toFixed(2) + 'px,' + (ty * 7 + 8).toFixed(2) + 'px) scale(' + cd.c.s + ')';
    cd.ani.style.transform = t; if (cd.sil) cd.sil.style.transform = t;
    cd.ink.style.transform = 'translate(' + (tx * 13).toFixed(2) + 'px,' + (ty * 13).toFixed(2) + 'px)';
    cd.tilt.style.transform = flat ? '' : 'perspective(700px) rotateY(' + (tx * 7).toFixed(2) + 'deg) rotateX(' + (-ty * 7).toFixed(2) + 'deg)';
  }
  function targets() {
    var sr = stageIn.getBoundingClientRect(), k = S.k, on = S.on ? cards[S.on] : null;
    CAST.forEach(function (c) {
      var cd = cards[c.id], cx = sr.left + (c.x + c.w / 2) * k, cy = sr.top + (c.y + c.w * .62) * k;
      if (S.over) {
        var dx = S.mx - cx, dy = S.my - cy, dist = Math.hypot(dx, dy), f = c.id === S.on ? 1 : Math.pow(Math.max(0, 1 - dist / (430 * k)), 1.4) * .7;
        cd.gx = Math.max(-1, Math.min(1, dx / (c.w * .62 * k))) * f; cd.gy = Math.max(-1, Math.min(1, dy / (c.w * .78 * k))) * f;
      } else if (S.glance && S.glance.id === c.id) { cd.gx = S.glance.x; cd.gy = S.glance.y; }
      else { cd.gx = 0; cd.gy = 0; }
      cd.gl = c.id === S.on ? 1 : 0;
      cd.pox = 0; cd.poy = 0;
      if (on && on !== cd) {
        var vx = (c.x + c.w / 2) - (on.c.x + on.c.w / 2), vy = (c.y + c.w * .62) - (on.c.y + on.c.w * .62), d = Math.hypot(vx, vy) || 1, p = 20 * Math.max(0, 1 - d / 330);
        cd.pox = vx / d * p; cd.poy = vy / d * p;
      }
    });
  }
  function frame(t) {
    S.raf = 0;
    if (SMALL.matches) return;
    var dt = Math.min(.034, (t - S.last) / 1000 || .016); S.last = t;
    targets();
    var follow = S.over || S.glance, K = follow ? 110 : 15, C = follow ? 21 : 4.6, busy = false;
    CAST.forEach(function (c) {
      var cd = cards[c.id];
      for (var n = 0; n < 2; n++) {
        spring(cd, 'tx', 'vx', cd.gx, K, C, dt / 2); spring(cd, 'ty', 'vy', cd.gy, K, C, dt / 2);
        spring(cd, 'ox', 'vox', cd.pox, 110, 21, dt / 2); spring(cd, 'oy', 'voy', cd.poy, 110, 21, dt / 2);
        spring(cd, 'l', 'vl', cd.gl, 170, 22, dt / 2);
      }
      layers(cd, cd.tx, cd.ty);
      cd.el.style.transform = 'translate(' + cd.ox.toFixed(2) + 'px,' + (cd.oy - cd.l * 6).toFixed(2) + 'px) rotate(' + (c.r * (1 - .72 * cd.l)).toFixed(2) + 'deg) scale(' + (1 + .13 * cd.l).toFixed(4) + ')';
      if (Math.abs(cd.vx) + Math.abs(cd.vy) + Math.abs(cd.vox) + Math.abs(cd.voy) + Math.abs(cd.vl) > .002 || Math.abs(cd.gx - cd.tx) + Math.abs(cd.gy - cd.ty) + Math.abs(cd.gl - cd.l) + Math.abs(cd.pox - cd.ox) > .002) busy = true;
    });
    if (busy || S.over || S.glance) S.raf = requestAnimationFrame(frame);
  }
  function kick() { if (!S.raf && !SMALL.matches && !REDUCE.matches) { S.last = performance.now(); S.raf = requestAnimationFrame(frame); } else if (REDUCE.matches && !SMALL.matches) still(); }
  /* reduced motion: no springs, the pointed card simply stands forward */
  function still() { CAST.forEach(function (c) { var cd = cards[c.id], on = c.id === S.on; layers(cd, 0, 0, true); cd.el.style.transform = on ? 'rotate(' + (c.r * .28) + 'deg) scale(1.13)' : ''; }); }

  /* ---------------------------------------------------------------- pointing */
  stage.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse' || SMALL.matches) return;
    S.over = true; S.mx = e.clientX; S.my = e.clientY; S.glance = null; S.seen = true;
    var b = e.target.closest && e.target.closest('.card');
    setOn(b ? b.dataset.id : null); kick();
  });
  stage.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'mouse') return; S.over = false; var a = document.activeElement; if (!(a && wall.contains(a) && a.matches(':focus-visible'))) setOn(null); kick(); });
  wall.addEventListener('focusin', function (e) { var b = e.target.closest('.card'); if (b && b.matches(':focus-visible')) { S.seen = true; setOn(b.dataset.id); if (SMALL.matches) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: REDUCE.matches ? 'auto' : 'smooth' }); } });
  wall.addEventListener('focusout', function () { if (!S.over && !SMALL.matches) setOn(null); });
  wall.addEventListener('click', function (e) { var b = e.target.closest('.card'); if (b) choose(b.dataset.id); });

  /* ---------------------------------------------------------------- the choose moment */
  var SLOW = +(new URLSearchParams(location.search).get('slow')) || 1;   /* test only: the shooter slows CSS and WAAPI by the same factor */
  function after(ms, fn) { var id = S.seq; S.timers.push(setTimeout(function () { if (id === S.seq) fn(); }, ms * SLOW)); }
  function cancel() { S.seq++; S.timers.forEach(clearTimeout); S.timers = []; document.querySelectorAll('.fly').forEach(function (f) { f.remove(); }); $('#cont').classList.remove('press'); }
  function label(text, faceId) {
    goL.textContent = text; goL.classList.remove('swap'); void goL.offsetWidth; goL.classList.add('swap');
    go.classList.toggle('has', !!faceId); if (faceId) goF.style.backgroundImage = face(faceId);
  }
  function faceRect(cd) {
    /* the face circle of the animal as it stands on the card right now, in viewport px */
    var r = cd.ani.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var m = new DOMMatrixReadOnly(getComputedStyle(cd.el).transform), sc = Math.hypot(m.a, m.b) * (SMALL.matches ? 1 : S.k), th = Math.atan2(m.b, m.a);
    var w0 = cd.el.offsetWidth * (820 / 724) * cd.c.s * sc, h0 = w0 * 948 / 820, f = cd.c.face;
    var ox = ((48 + (f[0] + f[2] / 2) * 724) / 820 - .5) * w0, oy = ((48 + f[1] * 900 + f[2] * 724 / 2) / 948 - .5) * h0;
    return { x: cx + ox * Math.cos(th) - oy * Math.sin(th), y: cy + ox * Math.sin(th) + oy * Math.cos(th), d: f[2] * 724 / 820 * w0, rot: th * 180 / Math.PI };
  }
  function showSignup(clear) {
    screen.classList.remove('chats');
    if (clear) { me.className = 'me back'; screen.classList.remove('has'); $('#upWho').innerHTML = '<b>Nobody yet</b><span>&nbsp;</span>'; thumbs.querySelectorAll('.sel').forEach(function (t) { t.classList.remove('sel'); }); }
  }
  function landed(c) {
    measureMe();
    me.style.backgroundImage = face(c.id); me.className = 'me at-slot land';
    screen.classList.add('has');
    burst.classList.remove('fire'); void burst.offsetWidth; burst.classList.add('fire');
    var who = $('#upWho'); who.innerHTML = '<b>' + c.role.charAt(0).toUpperCase() + c.role.slice(1) + '</b><span>' + c.kindUi + '</span>'; who.classList.remove('pop'); void who.offsetWidth; who.classList.add('pop');
    thumbs.querySelectorAll('i').forEach(function (t) { t.classList.toggle('sel', t.dataset.id === c.id); });
  }
  function toChats(c) {
    fillChats(c.id);
    me.className = 'me at-head';
    screen.classList.add('chats');
  }
  function choose(id) {
    var c = BY[id], cd = cards[id];
    if (S.chosen === id && screen.classList.contains('chats')) return;
    cancel();
    S.chosen = id; S.seen = true; S.glance = null;
    thumbs.querySelectorAll('.pt').forEach(function (t) { if (t.dataset.id !== S.on) t.classList.remove('pt'); });
    try { localStorage.setItem('fyi-as', id); } catch (e) {}
    CAST.forEach(function (k) { cards[k.id].el.classList.toggle('gone', k.id === id); cards[k.id].el.setAttribute('aria-pressed', k.id === id ? 'true' : 'false'); });
    go.href = '/work/fyi.html?as=' + id;
    setHead(c.head, true);
    say.textContent = 'You are ' + c.role + '. Chats are open.';
    again.hidden = false;

    if (REDUCE.matches) {
      door.classList.add('picked'); showSignup(true); landed(c); toChats(c); label('Come in as ' + c.role, id); return;
    }
    var from = faceRect(cd);
    showSignup(true);
    door.classList.add('flying');
    /* the picture lifts off its card, swings wide toward the viewer, and drops into the slot */
    var pic = document.createElement('i'), gc = document.createElement('i'), gm = document.createElement('i');
    pic.className = 'fly pic'; gc.className = 'fly c'; gm.className = 'fly m';
    [gc, gm, pic].forEach(function (n) { n.style.width = n.style.height = from.d + 'px'; document.body.appendChild(n); });
    pic.style.backgroundImage = face(id);
    var DUR = 700, sr = slot.getBoundingClientRect();
    var to = { x: sr.left + sr.width / 2, y: sr.top + sr.height / 2, d: sr.width };
    var dx = to.x - from.x, dy = to.y - from.y, dist = Math.hypot(dx, dy) || 1;
    var bend = Math.min(150, 50 + dist * .28), cxp = from.x + dx * .5 + (dy / dist) * bend * (dx > 0 ? 1 : -1) * .5, cyp = Math.min(from.y, to.y) + dy * .1 - bend;
    var kf = [], N = 30, ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };   /* slow off the card, no long tail into the slot */
    for (var i = 0; i <= N; i++) {
      var u = i / N, t = ease(u), a = 1 - t;
      var x = a * a * from.x + 2 * a * t * cxp + t * t * to.x, y = a * a * from.y + 2 * a * t * cyp + t * t * to.y;
      var sc = (1 + (to.d / from.d - 1) * t) * (1 + (SMALL.matches ? .16 : .34) * Math.sin(Math.PI * t)), rot = from.rot * a + Math.sin(Math.PI * t) * (dx > 0 ? 16 : -16);
      kf.push({ transform: 'translate(' + (x - from.d / 2).toFixed(1) + 'px,' + (y - from.d / 2).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg) scale(' + sc.toFixed(3) + ')', offset: u });
    }
    pic.animate(kf, { duration: DUR, fill: 'both' });
    pic.animate([{ boxShadow: '0 0 0 0 #fff, 0 0 0 0 rgba(23,27,32,0)' }, { boxShadow: '0 0 0 4px #fff, 0 18px 30px -8px rgba(23,27,32,.45)' }], { duration: 140, fill: 'both' });
    gc.animate(kf, { duration: DUR, delay: 46, fill: 'both' }); gm.animate(kf, { duration: DUR, delay: 92, fill: 'both' });
    [gc, gm].forEach(function (g) { g.animate([{ opacity: 0 }, { opacity: .7, offset: .15 }, { opacity: .7, offset: .8 }, { opacity: 0 }], { duration: DUR + 92, fill: 'both' }); });
    label('Come in as ' + c.role, id);
    after(DUR, function () { pic.remove(); landed(c); door.classList.add('picked'); door.classList.remove('flying'); });
    after(DUR + 100, function () { gc.remove(); gm.remove(); });
    after(DUR + 480, function () { $('#cont').classList.add('press'); });
    after(DUR + 620, function () { $('#cont').classList.remove('press'); toChats(c); });
  }
  again.addEventListener('click', function () {
    cancel(); S.chosen = null; door.classList.remove('picked', 'flying'); showSignup(true); again.hidden = true;
    CAST.forEach(function (k) { cards[k.id].el.classList.remove('gone'); cards[k.id].el.setAttribute('aria-pressed', 'false'); });
    go.href = '/work/fyi.html'; label('FYI case study', null); setHead(S.on && !SMALL.matches ? BY[S.on].head : REST_HEAD, true);
    try { localStorage.removeItem('fyi-as'); } catch (e) {}
    say.textContent = 'Pick who you are.';
    if (SMALL.matches) requestAnimationFrame(rowScroll);
  });

  /* ---------------------------------------------------------------- one quiet idle beat: now and then an animal glances at the phone */
  var gi = 0, ORDER = ['dog', 'beagle', 'cat', 'parrot', 'alpaca', 'rabbit', 'hamster', 'tortoise'];
  function glance() {
    if (S.over || S.seen || S.chosen || S.on || SMALL.matches || REDUCE.matches || document.hidden) return;
    var id = ORDER[gi++ % ORDER.length], c = BY[id], dir = c.side === 'l' ? 1 : -1, t0 = performance.now();
    S.glance = { id: id, x: 0, y: 0 };
    thumbs.querySelectorAll('i').forEach(function (t) { t.classList.toggle('pt', t.dataset.id === id); });
    (function step(t) {
      if (!S.glance || S.glance.id !== id) return;
      var u = (t - t0) / 1100;
      if (u >= 1) { S.glance = null; thumbs.querySelectorAll('.pt').forEach(function (n) { if (!S.on) n.classList.remove('pt'); }); kick(); return; }
      S.glance.x = dir * Math.sin(Math.min(1, u * 1.6) * Math.PI / 2) * .9; S.glance.y = -.35 * Math.sin(u * Math.PI);
      requestAnimationFrame(step);
    })(t0);
    kick();
  }
  var idle = setInterval(glance, 2600); setTimeout(glance, 900);

  /* ---------------------------------------------------------------- phone widths: the row. The card in the middle is the one pointed at. */
  var rowRaf = 0;
  function rowScroll() {
    rowRaf = 0; if (!SMALL.matches) return;
    var wr = wall.getBoundingClientRect(), mid = wr.left + wr.width / 2, best = null, bd = 1e9;
    CAST.forEach(function (c) {
      var cd = cards[c.id], r = cd.el.getBoundingClientRect(), d = (r.left + r.width / 2 - mid);
      var n = Math.max(-1, Math.min(1, d / 190));
      cd.el.style.transform = '';
      layers(cd, -n * .9, 0, true);
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = c.id; }
    });
    setOn(best, { head: !!S.rowMoved && !S.chosen });
  }
  wall.addEventListener('scroll', function () { if (!SMALL.matches) return; if (!rowRaf) rowRaf = requestAnimationFrame(rowScroll); }, { passive: true });
  ['touchstart', 'wheel', 'keydown'].forEach(function (ev) { wall.addEventListener(ev, function () { S.rowMoved = true; }, { passive: true }); });

  /* ---------------------------------------------------------------- layout modes */
  function fit() {
    if (SMALL.matches) {
      S.k = 1; wrap.style.removeProperty('--k');
      if (!S.rowInit) { S.rowInit = true; var d = cards.dog.el; wall.scrollLeft = d.offsetLeft - (wall.clientWidth - d.offsetWidth) / 2; }
      rowScroll();
    } else {
      S.rowInit = false;
      var avail = wrap.clientWidth - 80 - 8, k = Math.min(1, Math.max(.5, (avail - Math.min(372, avail * .36)) / 780));
      S.k = k; wrap.style.setProperty('--k', k.toFixed(4));
      CAST.forEach(function (c) { layers(cards[c.id], 0, 0); });
      if (S.on && !cards[S.on].el.matches(':focus-visible')) setOn(null);
      if (REDUCE.matches) still();
    }
    measureMe();
  }
  addEventListener('resize', fit); SMALL.addEventListener('change', fit);
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureMe);
})();
