/* FYI door, prototype. One loop: springs for the door angle and the pointer, a timed tween for the takeover.
   Everything that depends on the doorway is placed here from one measured rectangle (.dr-slot). */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var sec = $('#fyi'), door = $('.dr-door'), front = $('.dr-face.front');

  if (Q.has('flat')) {              // the screen alone, straight on
    document.documentElement.classList.add('flat');
    var fb = document.createElement('div'); fb.className = 'flatbox'; fb.appendChild(front); document.body.appendChild(fb);
    return;
  }

  var U = { w: 418, h: 872, T: 34, r: 70 };            // the phone, in its own units
  var slot = $('.dr-slot'), stage = $('.dr-stage'), scene = $('.dr-scene'), copy = $('.dr-copy');
  var room = $('.dr-room'), roomOut = $('.dr-room.out'), jamb = $('.dr-jamb'), haze = $('.dr-haze');
  var pl = { far: $('.pl.far'), her: $('.pl.her'), him: $('.pl.him'), hand: $('.pl.hand') };
  var hingeA = $('.dr-hinge.a'), hingeB = $('.dr-hinge.b');
  var beamP = $('.dr-beam .p'), beamC = $('.dr-beam .c'), fall = $('#dr-fall'), fall2 = $('#dr-fall2'), litC = $('#dr-litc rect'), h2 = $('.dr-copy h2');
  var lit = $('.dr-lit polygon'), litG = $('#dr-litg');
  var shadow = $('.dr-shadow polygon'), blur = $('#dr-blur feGaussianBlur');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var RAD = Math.PI / 180;

  /* ---------- build the edge of the phone: straight runs and faceted corners, each facing outward ---------- */
  (function buildEdge() {
    var frag = document.createDocumentFragment();
    function shade(phi) {                      // light from the upper left of the phone
      var b = .5 + .5 * Math.cos((phi - 215) * RAD);
      return .30 + .62 * b;
    }
    function side(px, py, phi, len) {
      var e = document.createElement('i'); e.className = 'dr-side';
      var s = shade(phi), c = function (v) { return Math.round(v * s); };
      e.style.width = len + 'px'; e.style.height = U.T + 'px';
      e.style.background = 'linear-gradient(180deg, rgb(' + c(236) + ',' + c(237) + ',' + c(242) + ') 0, rgb(' + c(150) + ',' + c(151) + ',' + c(158) + ') 9%, rgb(' + c(122) + ',' + c(123) + ',' + c(130) + ') 50%, rgb(' + c(96) + ',' + c(97) + ',' + c(104) + ') 91%, rgb(' + c(190) + ',' + c(191) + ',' + c(197) + ') 100%)';
      e.style.setProperty('--lf', Math.max(0, -Math.cos(phi * RAD)).toFixed(2));
      e.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0) rotateZ(' + (phi - 90) + 'deg) rotateX(-90deg) translateX(' + (-len / 2) + 'px)';
      frag.appendChild(e);
    }
    var r = U.r, w = U.w, h = U.h;
    side(w, h / 2, 0, h - 2 * r + 1); side(w / 2, h, 90, w - 2 * r + 1); side(0, h / 2, 180, h - 2 * r + 1); side(w / 2, 0, 270, w - 2 * r + 1);
    var N = 8, d = 90 / N, seg = 2 * r * Math.tan(d / 2 * RAD) + .8;
    [[w - r, h - r, 0], [r, h - r, 90], [r, r, 180], [w - r, r, 270]].forEach(function (c) {
      for (var i = 0; i < N; i++) { var phi = c[2] + d * (i + .5); side(c[0] + r * Math.cos(phi * RAD), c[1] + r * Math.sin(phi * RAD), phi, seg); }
    });
    // keys on the free edge: action, volume up, volume down. Small plates standing 2.5 units off the band.
    [[176, 34], [250, 62], [330, 62]].forEach(function (k) {
      var e = document.createElement('i'); e.className = 'dr-key';
      e.style.width = k[1] + 'px'; e.style.height = '12px';
      e.style.transform = 'translate3d(-2.5px,' + (k[0] + k[1] / 2) + 'px,-11px) rotateZ(90deg) rotateX(-90deg) translateX(' + (-k[1] / 2) + 'px)';
      frag.appendChild(e);
    });
    door.appendChild(frag);
  })();

  /* ---------- layout ---------- */
  var L = null;
  function proj(x, z) { return L.cam.x + (x - L.cam.x) * L.P / (L.P - z); }
  function freeEdge(ang, hx) { var a = ang * RAD, w = U.w * L.k; return proj(hx - w * Math.cos(a), w * Math.sin(a)); }
  function angleForGap(frac) {            // the angle at which the doorway shows this fraction of its width
    var lo = 0, hi = 89;
    for (var i = 0; i < 30; i++) { var m = (lo + hi) / 2; ((freeEdge(m, L.hx) - L.slot.x) / L.slot.w < frac) ? lo = m : hi = m; }
    return (lo + hi) / 2;
  }
  function measure() {
    var sr = sec.getBoundingClientRect(), r = slot.getBoundingClientRect(), st = stage.getBoundingClientRect(), cr = copy.getBoundingClientRect();
    L = { W: sr.width, H: sr.height, mobile: matchMedia('(max-width:760px)').matches };
    L.k = r.width / U.w;
    L.slot = { x: r.left - sr.left, y: r.top - sr.top, w: r.width, h: r.height };
    var e = 3;                                                             // the door overlaps the opening by this much
    L.hole = { x: L.slot.x + e, y: L.slot.y + e, w: L.slot.w - 2 * e, h: L.slot.h - 2 * e, r: (U.r - 4) * L.k };
    L.end = L.mobile ? { x: 0, y: st.top - sr.top - 22, w: L.W, h: L.H - (st.top - sr.top - 22), r: 0 }
                     : { x: L.slot.x - 96, y: 0, w: L.W - (L.slot.x - 96), h: L.H, r: 0 };
    L.hx = L.slot.x + L.slot.w; L.hy = L.slot.y;
    L.P = L.mobile ? 1300 : 1600;
    L.cam = { x: L.slot.x + L.slot.w / 2 - 1.1 * L.slot.w, y: L.slot.y + L.slot.h * .5 };
    scene.style.perspectiveOrigin = L.cam.x + 'px ' + L.cam.y + 'px';
    scene.style.perspective = L.P + 'px';
    L.rest = angleForGap(.27); L.near = angleForGap(.5); L.open = 118;
    L.copyLeft = cr.left - sr.left;
    var hr = h2.getBoundingClientRect(); L.h2top = hr.top - sr.top;
    litC.setAttribute('x', (hr.left - sr.left - 6).toFixed(1)); litC.setAttribute('y', (hr.top - sr.top - 6).toFixed(1));
    litC.setAttribute('width', (hr.width + 12).toFixed(1)); litC.setAttribute('height', (hr.height + 12).toFixed(1));
    // the picture: which part of it the doorway shows at rest, and at the end
    var s0 = 1.03 * L.hole.h / 1395;
    L.img0 = { s: s0, x: 200, y: 12 };
    var s1 = Math.max(L.end.w / 962, L.end.h / 1292);
    L.img1 = { s: s1, x: (1024 - L.end.w / s1) / 2, y: Math.min(184, 1500 - L.end.h / s1) };
  }

  /* ---------- state ---------- */
  var S = { ang: 0, angV: 0, angT: 0, px: 0, pxV: 0, pxT: 0, py: 0, pyV: 0, pyT: 0, take: 0, flick: 0 };
  var mode = 'idle', overBtn = false, inside = false, focusNear = false, prox = 0, seq = null, lastIdle = 0, clock = 0, frozen = false, raf = 0, lastT = 0;
  var FOLLOW = { k: 110, c: 21 }, FREE = { k: 15, c: 4.6 };

  function spring(v, vel, target, p, dt) { var a = -p.k * (v - target) - p.c * vel; vel += a * dt; return [v + vel * dt, vel]; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function step(dt) {
    clock += dt;
    var following = inside || focusNear || overBtn || mode !== 'idle';
    if (mode === 'idle') S.angT = lerp(L.rest, L.near, Math.max(prox, (focusNear || overBtn) ? .85 : 0));
    if (seq) {
      seq.t += dt;
      if (seq.phase === 'open') {
        S.angT = L.open;
        S.take = ease(clamp((seq.t - .16) / .95, 0, 1));
        if (seq.t > 1.2) { seq.phase = 'hold'; seq.t = 0; if (Q.has('go')) location.href = door.href; }
      } else if (seq.phase === 'hold') {
        S.take = 1;
        if (seq.t > 1.5) { seq.phase = 'back'; seq.t = 0; }
      } else {
        S.take = 1 - ease(clamp(seq.t / .7, 0, 1));
        S.angT = L.rest;
        if (seq.t > .9) { seq = null; mode = 'idle'; lastIdle = clock; }
      }
    }
    // one quiet beat while nobody is near: a push from inside, and the light dips once
    if (mode === 'idle' && !following && !reduce.matches && clock - lastIdle > 6.5) { lastIdle = clock; S.angV += 34; S.flick = 1; }
    S.flick = Math.max(0, S.flick - dt * 2.2);
    var p = following ? FOLLOW : FREE, r;
    r = spring(S.ang, S.angV, S.angT, p, dt); S.ang = r[0]; S.angV = r[1];
    r = spring(S.px, S.pxV, S.pxT, p, dt); S.px = r[0]; S.pxV = r[1];
    r = spring(S.py, S.pyV, S.pyT, p, dt); S.py = r[0]; S.pyV = r[1];
  }

  function settled() {
    return !seq && Math.abs(S.ang - S.angT) < .01 && Math.abs(S.angV) < .01 && Math.abs(S.px - S.pxT) < .001 && Math.abs(S.pxV) < .001 && Math.abs(S.py - S.pyT) < .001 && S.flick === 0;
  }

  /* ---------- draw ---------- */
  function pts(a) { return a.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function render() {
    var t = S.take, H0 = L.hole, H1 = L.end;
    var hole = { x: lerp(H0.x, H1.x, t), y: lerp(H0.y, H1.y, t), w: lerp(H0.w, H1.w, t), h: lerp(H0.h, H1.h, t), r: lerp(H0.r, H1.r, t) };
    var hx = lerp(L.hx, L.W + 60 + U.T * L.k, t * t), hy = lerp(L.hy, L.hy, t);
    var ang = S.ang, a = ang * RAD;
    // how far the doorway is uncovered, from the real projection of the free edge
    var fe = freeEdge(Math.min(ang, 89.5), hx), gap = clamp((fe - hole.x) / H0.w, 0, 1);
    if (ang > 89.5 || t > .02) gap = Math.max(gap, clamp((ang - 60) / 40, 0, 1));
    var o = clamp((ang - L.rest) / (L.near - L.rest), -1, 4);              // 0 at rest, 1 with the pointer near
    var full = clamp((ang - L.near) / (L.open - L.near), 0, 1);            // 0..1 past that, to fully open

    // room
    var clip = 'inset(' + hole.y.toFixed(1) + 'px ' + (L.W - hole.x - hole.w).toFixed(1) + 'px ' + (L.H - hole.y - hole.h).toFixed(1) + 'px ' + hole.x.toFixed(1) + 'px round ' + hole.r.toFixed(1) + 'px)';
    room.style.clipPath = clip;
    roomOut.style.clipPath = clip;
    var s = lerp(L.img0.s, L.img1.s, t), ix = lerp(L.img0.x, L.img1.x, t), iy = lerp(L.img0.y, L.img1.y, t);
    var cx = hole.x + hole.w / 2, cy = hole.y + hole.h * .46, bx = hole.x - ix * s, by = hole.y - iy * s;
    var oo = clamp(o, 0, 1.4), amp = L.k / .688;
    function place(el, par, grow, lean) {
      var e = 1 + grow, x = cx - (cx - bx) * e + S.px * par * amp + lean * amp, y = cy - (cy - by) * e + S.py * par * .45 * amp;
      el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) scale(' + (s * e).toFixed(4) + ')';
    }
    place(pl.far, -8, 0, 0);
    var q = 1 - t;
    place(pl.her, 3, .01 * oo * q + .004 * t, -4 * oo * q);
    place(pl.him, 7, .016 * oo * q + .008 * t, -3 * oo * q);
    place(pl.hand, 14, (.03 * oo + .03 * full) * q + .02 * t, -3 * oo * q);
    haze.style.opacity = (1 - t).toFixed(3);
    jamb.style.cssText = 'left:' + hole.x.toFixed(1) + 'px;top:' + hole.y.toFixed(1) + 'px;width:' + hole.w.toFixed(1) + 'px;height:' + hole.h.toFixed(1) + 'px;border-radius:' + hole.r.toFixed(1) + 'px;--jamb:' + clamp(1 - t * .7, 0, 1).toFixed(3);

    // door
    door.style.transform = 'translate3d(' + (hx - U.w).toFixed(2) + 'px,' + hy.toFixed(2) + 'px,0) scale3d(' + L.k + ',' + L.k + ',' + L.k + ') rotateY(' + ang.toFixed(3) + 'deg)';
    door.style.setProperty('--sheen', clamp(.35 + .5 * Math.sin(a), 0, 1).toFixed(3));
    door.style.setProperty('--glow', clamp(.25 + .9 * gap, 0, 1).toFixed(3));
    var hop = clamp(1 - t * 3, 0, 1), hxr = hx - 4;
    hingeA.style.cssText = 'transform:translate(' + hxr.toFixed(1) + 'px,' + (hy + L.slot.h * .17).toFixed(1) + 'px);opacity:' + hop;
    hingeB.style.cssText = 'transform:translate(' + hxr.toFixed(1) + 'px,' + (hy + L.slot.h * .76).toFixed(1) + 'px);opacity:' + hop;

    // shadow of the door on the wall: light from the upper left, in front
    var w = U.w * L.k, z = w * Math.sin(a), fx = hx - w * Math.cos(a), lx = .16, ly = .4, y0 = L.slot.y + 14, y1 = L.slot.y + L.slot.h - 4;
    shadow.setAttribute('points', pts([[hx, y0], [hx, y1], [fx + z * lx, y1 + z * ly], [fx + z * lx, y0 + z * ly]]));
    blur.setAttribute('stdDeviation', (5 + z * .06).toFixed(1));
    shadow.style.opacity = (.34 * clamp(1 - t * 2.5, 0, 1)).toFixed(3);

    // light on the page: two misregistered halftone plates, and a tint where it reaches the heading
    var flick = 1 - .4 * S.flick * (.5 + .5 * Math.sin(clock * 46));
    var g = clamp(gap + t * .5, 0, 1.5) * flick, g1 = clamp(g, 0, 1);
    var span = L.mobile ? L.W * 1.2 : hole.x - L.copyLeft;
    var reach = span * (.3 + .62 * Math.min(g, 1)) * lerp(1, .86, t);
    var jx = hole.x + 4, yT = hole.y + hole.h * lerp(.2, .02, t), yB = hole.y + hole.h * lerp(.86, .98, t), ym = (yT + yB) / 2;
    var up = lerp(-.06, -.2, g1), dn = lerp(.14, .3, g1), far = reach * 1.1;
    var P = [[jx, yT], [jx - far, yT + far * up], [jx - far, yB + far * dn], [jx, yB]];
    var C = [[jx, yT - 5], [jx - far, yT + far * (up - .03) - 5], [jx - far, yB + far * (dn + .03) + 7], [jx, yB + 7]];
    var rcx = jx + 14, rcy = ym, litPts = [[jx, yT - 400], [jx - reach * 2, yT - 400], [jx - reach * 2, yB + 400], [jx, yB + 400]];
    var lx1 = jx, lx2 = jx - reach * 1.22, ly1 = 0, ly2 = 0, litK = 1;
    if (L.mobile) {                        // at phone width the copy is above the room, so the light turns upward as the room takes the block
      var rv = (hole.y - L.h2top + 40) * (.3 + .62 * g1), top = hole.y + 4;
      var U1 = [[0, top], [-rv * .2, top - rv * 1.1], [L.W + rv * .2, top - rv * 1.1], [L.W, top]];
      P = P.map(function (p, i) { return [lerp(p[0], U1[i][0], t), lerp(p[1], U1[i][1], t)]; });
      C = C.map(function (p, i) { return [lerp(p[0], U1[i][0] + (i === 1 ? -8 : i === 2 ? 8 : 0), t), lerp(p[1], U1[i][1] - (i === 1 || i === 2 ? 10 : 0), t)]; });
      rcx = lerp(rcx, L.W * .5, t); rcy = lerp(rcy, top + 10, t); reach = lerp(reach, rv * .46, t);
      litPts = [[0, top], [0, top - rv * 2], [L.W, top - rv * 2], [L.W, top]]; lx1 = lx2 = 0; ly1 = top; ly2 = top - rv * 1.25; litK = clamp(t * 2 - .6, 0, 1);
    }
    beamP.setAttribute('points', pts(P)); beamC.setAttribute('points', pts(C)); lit.setAttribute('points', pts(litPts));
    [fall, fall2].forEach(function (f) {
      f.setAttribute('cx', rcx.toFixed(1)); f.setAttribute('cy', rcy.toFixed(1)); f.setAttribute('r', reach.toFixed(1));
      f.setAttribute('gradientTransform', L.mobile ? 'translate(' + rcx.toFixed(1) + ' 0) scale(' + lerp(1, 1.6, t).toFixed(2) + ' 1) translate(' + (-rcx).toFixed(1) + ' 0)' : 'translate(0 ' + ym.toFixed(1) + ') scale(1 ' + lerp(1.15, 1.5, t).toFixed(2) + ') translate(0 ' + (-ym).toFixed(1) + ')');
    });
    litG.setAttribute('x1', lx1); litG.setAttribute('x2', lx2); litG.setAttribute('y1', ly1); litG.setAttribute('y2', ly2);
    beamP.style.opacity = clamp(.55 + .5 * g, 0, .92).toFixed(3);
    beamC.style.opacity = clamp(.5 + .4 * g, 0, .85).toFixed(3);
    lit.style.opacity = (litK * clamp(.45 + .6 * g, 0, 1)).toFixed(3);
  }

  /* ---------- loop ---------- */
  function frame(now) {
    raf = 0;
    var dt = Math.min(.05, (now - lastT) / 1000 || .016); lastT = now;
    var n = Math.max(1, Math.round(dt * 240)), h = dt / n;
    for (var i = 0; i < n; i++) step(h);
    render();
    if (!frozen) raf = requestAnimationFrame(frame);
  }
  function wake() { if (!raf && !frozen) { lastT = performance.now(); raf = requestAnimationFrame(frame); } }

  /* ---------- input ---------- */
  function pointer(e) {
    if (e.pointerType === 'touch') return;
    var sr = sec.getBoundingClientRect(), x = e.clientX - sr.left, y = e.clientY - sr.top;
    var cx = L.slot.x + L.slot.w / 2, cy = L.slot.y + L.slot.h / 2;
    inside = true;
    prox = clamp(1 - (Math.hypot(x - cx, (y - cy) * .7) - L.slot.w * .45) / (L.W * .36), 0, 1);
    S.pxT = clamp((x - cx) / (L.W * .5), -1, 1); S.pyT = clamp((y - cy) / (L.H * .5), -1, 1);
    wake();
  }
  function leave() { inside = false; prox = 0; S.pxT = 0; S.pyT = 0; lastIdle = clock; wake(); }
  function go(e) {
    if (e) { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); }
    if (mode !== 'idle') return;
    if (reduce.matches) {                  // no swing: the open state, then the page
      mode = 'still'; S.ang = S.angT = L.open; S.angV = 0; S.take = 1; render();
      setTimeout(function () { if (Q.has('go')) { location.href = door.href; return; } S.take = 0; S.ang = S.angT = L.rest; mode = 'idle'; render(); }, 1500);
      return;
    }
    mode = 'open'; seq = { phase: 'open', t: 0 }; wake();
  }
  sec.addEventListener('pointermove', pointer);
  sec.addEventListener('pointerleave', leave);
  door.addEventListener('click', go);
  $('.dr-btn').addEventListener('click', go);
  room.addEventListener('click', go);
  $('.dr-btn').addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { overBtn = true; wake(); } });
  $('.dr-btn').addEventListener('pointerleave', function () { overBtn = false; wake(); });
  [door, $('.dr-btn')].forEach(function (el) {
    el.addEventListener('focus', function () { if (el.matches(':focus-visible')) { focusNear = true; wake(); } });
    el.addEventListener('blur', function () { focusNear = false; lastIdle = clock; wake(); });
  });

  function init() {
    measure();
    S.ang = S.angT = L.rest; S.angV = 0;
    if (Q.get('state') === 'near') { prox = 1; inside = true; S.ang = L.near; S.pxT = S.px = -.35; S.pyT = S.py = .1; }
    if (Q.get('state') === 'open') { mode = 'still'; S.ang = S.angT = L.open; S.take = 1; }
    render();
    if (Q.has('still') || reduce.matches) frozen = true; else wake();
  }
  var rz; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { var a = S.ang - (L ? L.rest : 0); measure(); if (mode === 'idle') S.ang = L.rest + a; render(); wake(); }, 60); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); render(); });
  init();

  // for filming and review: freeze the clock and move it by hand
  window.__door = {
    freeze: function () { frozen = true; if (raf) cancelAnimationFrame(raf); raf = 0; },
    advance: function (ms) { var n = Math.round(ms / 1000 * 240); for (var i = 0; i < n; i++) step(1 / 240); render(); return { ang: S.ang, take: S.take }; },
    go: function () { go(null); }, state: function () { return { S: S, L: L, mode: mode }; }
  };
})();
