/* FYI door: what the phone sees.
   One simulation clock drives everything (planes, ring, waveform, note, door), so the
   whole sequence can be stepped frame by frame: window.__lens.manual(true); __lens.advance(ms). */
(function () {
  'use strict';
  var PROTOTYPE = true;                       // true: show the sent state 1.5 s, then reset. false: go to DEST.
  var DEST = '/work/fyi.html#from-note';
  var HOLD = 1.7;                             // seconds of holding that send the note
  var SENT_SHOW = 1.5, RESET = 0.7, GO_AT = 1.2;
  var NB = 18;                                // bars each side of the button

  var $ = function (s) { return document.querySelector(s); };
  var door = $('#fyi'), lens = $('#lens'), glass = $('#glass'), puck = $('#puck');
  var far = $('.pl.far'), woman = $('.pl.woman'), man = $('.pl.man'), hand = $('.pl.hand');
  var glow = $('.glow'), ring = $('#ring'), dot = $('#dot'), ripple = $('#ripple'), puckSvg = puck.querySelector('svg');
  var hint = $('#hint'), hintT = $('#hint-t'), rec = $('#rec'), timer = $('#timer'), timeEl = $('#time');
  var note = $('#sent'), mini = $('#mini'), dur = $('#dur'), live = $('#live');
  var fr = [$('.fringe.c'), $('.fringe.m')];
  var stickers = [].slice.call(document.querySelectorAll('.st')).map(function (el) {
    return { el: el, z: +el.dataset.z, r: +el.dataset.r };
  });
  var cv = $('#wave'), ctx = cv.getContext('2d');

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var HOVER = window.matchMedia('(hover: hover)').matches;

  var S = {
    t: 0,
    nx: 0, ny: 0, vx: 0, vy: 0, tx: 0, ty: 0, follow: false,   // pointer, on the spring
    a: 0, va: 0,                                              // thumb pose: 0 resting, 1 pressed
    prox: 0, over: false,
    phase: 'idle', h: 0, ts: 0, tr: 0, dAt: 0,
    idleT: 3.1, hintO: 1, hintWant: 'Hold to record', hintShown: 'Hold to record', hintUntil: 0,
    amps: [], shownTime: '', timerOn: false
  };
  var G = { w: 0, h: 0, px: 0, py: 0, dpr: 1, recW: 96, noteW: 164, tg: [], rot: -5.6, sc: 1.046 };

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }

  function miniH(v) { return Math.round(5 + v * 21); }
  function newAmps() {
    // speech has phrases: a slow envelope under quick syllables
    var a = [], ph = Math.random() * 6.28, i;
    for (i = 0; i < NB; i++) {
      var env = .55 + .45 * Math.sin(ph + i * .62);
      a.push(clamp(.22 + env * (.35 + Math.random() * .65), .18, 1));
    }
    S.amps = a;
    var kids = mini.children;
    if (kids.length !== NB) { mini.innerHTML = new Array(NB + 1).join('<i></i>'); kids = mini.children; }
    for (i = 0; i < NB; i++) kids[i].style.height = miniH(a[i]) + 'px';
  }
  newAmps();

  function measure() {
    lens.classList.toggle('narrow', glass.clientWidth < 412);
    var r = glass.getBoundingClientRect(), cs = getComputedStyle(rec), i;
    G.w = r.width; G.h = r.height;
    G.px = puck.offsetLeft + puck.offsetWidth / 2; G.py = puck.offsetTop + puck.offsetHeight / 2;
    var ls = getComputedStyle(lens);
    G.rot = parseFloat(ls.getPropertyValue('--press-rot')) || -5.6; G.sc = parseFloat(ls.getPropertyValue('--press-sc')) || 1.046;
    G.recW = parseFloat(cs.getPropertyValue('--rec-w')) || 96; G.noteW = parseFloat(cs.getPropertyValue('--note-w')) || 164;
    // where each bar of the sent note sits on the glass (the note is right-anchored, so this holds at any width)
    G.tg = [];
    for (i = 0; i < mini.children.length; i++) {
      var k = mini.children[i], b = k.getBoundingClientRect();
      G.tg.push(b.width ? { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 } : null);
    }
    G.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = Math.round(G.w * G.dpr); cv.height = Math.round(G.h * G.dpr);
    drawn = true;
  }

  /* ---------------------------------------------------------------- input */
  function onMove(e) {
    if (e.pointerType === 'touch') return;
    var r = door.getBoundingClientRect(), g = glass.getBoundingClientRect();
    var cx = g.left + g.width / 2, cy = g.top + g.height / 2;
    // measured from the middle of the window, across the whole block
    S.tx = clamp((e.clientX - cx) / (r.width * .42), -1, 1);
    S.ty = clamp((e.clientY - cy) / (g.height * .62), -1, 1);
    S.follow = true;
    var dx = e.clientX - (g.left + G.px), dy = e.clientY - (g.top + G.py);
    S.prox = clamp(1 - (Math.sqrt(dx * dx + dy * dy) - 40) / 230, 0, 1);
  }
  function onLeave() { S.follow = false; S.tx = 0; S.ty = 0; S.prox = 0; }
  door.addEventListener('pointermove', onMove);
  door.addEventListener('pointerleave', onLeave);

  function startHold() {
    if (S.phase !== 'idle' && S.phase !== 'falling') return;
    if (S.phase === 'idle') { newAmps(); S.h = 0; }
    S.phase = 'holding';
    live.textContent = 'Recording. Keep holding.';
  }
  function endHold() {
    if (S.phase !== 'holding') return;
    S.phase = 'falling';
    S.hintWant = 'Keep holding'; S.hintUntil = S.t + 2.4;
    live.textContent = 'Let go too soon. Hold the button to send.';
  }
  puck.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    e.preventDefault(); puck.focus({ preventScroll: true });
    try { puck.setPointerCapture(e.pointerId); } catch (err) {}
    startHold();
  });
  puck.addEventListener('pointerup', endHold);
  puck.addEventListener('pointercancel', endHold);
  puck.addEventListener('lostpointercapture', endHold);
  puck.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  puck.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') S.over = true; });
  puck.addEventListener('pointerleave', function () { S.over = false; });
  puck.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) startHold(); }
  });
  puck.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); endHold(); } });
  puck.addEventListener('blur', endHold);
  puck.addEventListener('click', function (e) { e.preventDefault(); });

  /* ---------------------------------------------------------------- simulation */
  function spring(pos, vel, target, k, c, dt) { vel += (k * (target - pos) - c * vel) * dt; return [pos + vel * dt, vel]; }

  function step(dt) {
    var rm = RM.matches, r;
    S.t += dt;

    // pointer: following 110 / 21, released 15 / 4.6
    var tx = S.tx, ty = S.ty;
    if (!HOVER && !rm) {                     // no pointer on a phone: the room drifts slowly on its own
      tx = Math.sin(S.t * .55) * .55; ty = Math.sin(S.t * .37 + 1) * .35;
    }
    if (rm) { tx = 0; ty = 0; }
    var k = S.follow ? 110 : 15, c = S.follow ? 21 : 4.6;
    r = spring(S.nx, S.vx, tx, k, c, dt); S.nx = r[0]; S.vx = r[1];
    r = spring(S.ny, S.vy, ty, k, c, dt); S.ny = r[0]; S.vy = r[1];

    // the hold
    if (S.phase === 'holding') {
      S.h += dt / HOLD;
      if (S.h >= 1) {
        S.h = 1; S.phase = 'sent'; S.ts = 0; S.hintWant = 'Sent'; S.hintUntil = 0;
        door.classList.add('is-sent');
        live.textContent = 'Note sent to Copper Hours. Opening the FYI case study.';
      }
    } else if (S.phase === 'falling') {
      S.h -= dt * Math.max(1.5, 4.2 * S.h);
      if (S.h <= 0) { S.h = 0; S.phase = 'idle'; S.idleT = 0; }
    } else if (S.phase === 'sent') {
      S.ts += dt;
      if (!PROTOTYPE && S.ts >= GO_AT) { S.phase = 'gone'; window.location.href = DEST; }
      if (PROTOTYPE && S.ts >= SENT_SHOW) { S.phase = 'reset'; S.tr = 0; S.hintWant = 'Hold to record'; door.classList.remove('is-sent'); }
    } else if (S.phase === 'reset') {
      S.tr += dt;
      if (S.tr >= RESET) { S.phase = 'idle'; S.h = 0; S.idleT = 1.2; live.textContent = ''; }
    } else if (S.phase === 'idle') {
      S.idleT += dt;
    }

    // thumb pose
    var target = 0;
    if (S.phase === 'holding') target = 1;
    else if (S.phase === 'sent') target = S.ts < .24 ? 1 : .1;
    else if (S.phase === 'idle') {
      target = Math.max(.3 * S.prox, S.over ? .45 : 0);
      if (!rm && target < .05) {             // one quiet beat: the thumb dips toward the button, the button answers
        var u = S.idleT % 4.6;
        if (u > 3.3) target = .26 * Math.pow(Math.sin(Math.PI * (u - 3.3) / 1.3), 2);
      }
    }
    if (rm) { S.a = S.phase === 'holding' || (S.phase === 'sent' && S.ts < .24) ? 1 : .3; S.va = 0; }
    else {
      var pressing = S.phase === 'holding';
      r = spring(S.a, S.va, target, pressing ? 190 : 80, pressing ? 21 : 13, dt); S.a = r[0]; S.va = r[1];
    }

    // the words beside the button: fade out, change, fade in
    if (S.hintUntil && S.t > S.hintUntil && S.phase === 'idle') { S.hintWant = 'Hold to record'; S.hintUntil = 0; }
    var ho = 1;
    if (S.phase === 'holding') ho = 0;
    else if (S.phase === 'sent' && S.ts < .3) ho = 0;
    if (S.hintWant !== S.hintShown) { ho = 0; if (S.hintO < .05) S.hintShown = S.hintWant; }
    S.hintO += (ho - S.hintO) * Math.min(1, dt * 15);
  }

  /* ---------------------------------------------------------------- drawing */
  var drawn = false;
  function bar(x, y, w, h, ang, color, alpha) {
    if (alpha <= .003) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = alpha; ctx.fillStyle = color;
    var r = w / 2; h = Math.max(h, w); ctx.beginPath();
    ctx.moveTo(-r, -h / 2 + r); ctx.arc(0, -h / 2 + r, r, Math.PI, 0); ctx.lineTo(r, h / 2 - r); ctx.arc(0, h / 2 - r, r, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function mix(f) {                            // pink to white
    return 'rgb(255,' + Math.round(lerp(45, 255, f)) + ',' + Math.round(lerp(143, 255, f)) + ')';
  }
  // hw: how far the waveform has grown out of the button (0..1). fly: seconds since sent, or -1.
  function drawWave(hw, fly) {
    if (hw <= 0 && fly < 0 && !drawn) return;
    ctx.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
    ctx.clearRect(0, 0, G.w, G.h);
    drawn = hw > 0 || fly >= 0;
    if (!drawn) return;
    var half = Math.min(G.px, G.w - G.px) - 10, start = 62, span = half - start;
    var pitch = span / NB, bw = Math.max(3, pitch * .54), rise = G.h * .055, maxH = G.h * .13;
    var q = hw * NB, rm = RM.matches, pass, side, k;
    var out = fly >= 0 ? clamp(1 - (fly - .47) / .08, 0, 1) : 1;
    // three passes: ink shadow, cyan misprint, pink
    for (pass = 0; pass < 3; pass++) {
      for (k = 0; k < NB; k++) {
        var s = q - k; if (s <= 0) continue;
        var born = easeOut(s / .9), fade = clamp((NB + .4 - s) / 1.6, 0, 1);
        var dx = start + (s - .5) * pitch;
        var wig = rm || fly >= 0 ? 1 : 1 + .22 * Math.sin(S.t * 13 + k * 1.9) * (1 - s / NB * .6);
        var hh = (8 + S.amps[k] * maxH * (1 - .3 * s / NB) * wig) * born;
        var y = G.py - rise * Math.pow(dx / half, 2), ang = Math.atan(-2 * rise * dx / (half * half));
        var f = 0, tg = G.tg[k], w = bw, col = '#ff2d8f';
        if (fly >= 0) {                        // the recording gathers itself into the note under the thread
          f = ease((fly - .03 - (NB - 1 - k) * .006) / .34);
          if (!tg) fade *= 1 - clamp(f * 2.5, 0, 1);
          col = mix(clamp((f - .72) / .28, 0, 1));
        }
        for (side = -1; side <= 1; side += 2) {
          var x = G.px + side * dx, yy = y, a = side * ang, h2 = hh;
          if (f > 0 && tg) {
            x = lerp(x, tg.x, f) + side * Math.sin(Math.PI * f) * G.w * .05;
            yy = lerp(y, tg.y, f); a *= 1 - f; h2 = lerp(hh, miniH(S.amps[k]), f); w = lerp(bw, 3, clamp((f - .4) / .6, 0, 1));
          }
          if (pass === 0) bar(x, yy + 1.5, w + 3, h2 + 3, a, '#0e0a2c', .5 * fade * (1 - f) * out);
          else if (pass === 1) bar(x - 1.8, yy + 1.4, w, h2, a, '#19c8f0', .9 * fade * (1 - f) * out);
          else bar(x, yy, w, h2, a, col, fade * out);
        }
      }
    }
  }

  function fmt(sec) { return '0:0' + sec.toFixed(1); }
  function px(v) { return v.toFixed(2) + 'px'; }

  function render() {
    var w = G.w, a = S.a, nx = S.nx, ny = S.ny, rm = RM.matches;
    var d = 0, m = 0, hw = S.h, ringO = 1, flash = 0, fly = -1, noteO = 0;
    if (S.phase === 'sent') {
      d = rm ? 0 : ease((S.ts - .5) / .8); S.dAt = d;
      m = ease((S.ts - .04) / .36);
      fly = rm ? 9 : S.ts; hw = 1; noteO = clamp((S.ts - .41) / .08, 0, 1);
      if (rm) noteO = 1;
      flash = clamp(1 - S.ts / .45, 0, 1);
    } else if (S.phase === 'reset') {
      d = S.dAt * (1 - ease(S.tr / .62));
      noteO = clamp(1 - S.tr / .22, 0, 1); m = 1 - ease((S.tr - .16) / .4); hw = 0;
      ringO = clamp(1 - S.tr / .3, 0, 1);
    }

    // planes: the room goes one way, the people the other, the hand furthest
    far.style.transform = 'translate3d(' + px(-nx * w * .016) + ',' + px(-ny * w * .01) + ',0) scale(' + (1.05 + .075 * d - .012 * a).toFixed(4) + ')';
    woman.style.transform = 'translate3d(' + px(nx * w * .013 + d * w * .032) + ',' + px(ny * w * .007) + ',0) scale(' + (1 + .05 * d).toFixed(4) + ')';
    man.style.transform = 'translate3d(' + px(nx * w * .026 - d * w * .036) + ',' + px(ny * w * .014) + ',0) scale(' + (1 + .05 * d + .008 * a).toFixed(4) + ')';
    var rot = lerp(2.5, G.rot, a), sc = lerp(.94, G.sc, a) + .012 * Math.abs(nx) + .03 * d;
    hand.style.transform = 'translate3d(' + px(nx * w * .05 - d * w * .06) + ',' + px(ny * w * .028 + d * w * .045) + ',0) rotate(' + (rot - nx * .8).toFixed(3) + 'deg) scale(' + sc.toFixed(4) + ')';

    glow.style.opacity = clamp(Math.max(0, a - .1) * (S.phase === 'holding' || S.phase === 'sent' ? 1.05 : .5), 0, 1).toFixed(3);

    lens.style.transform = d > .001 ? 'scale(' + (1 + .028 * d).toFixed(4) + ')' : '';

    // misprint: the two colours slide apart as the view turns
    fr[0].style.transform = 'translate(' + px(-7 - nx * 4 - d * 3) + ',' + px(5 - ny * 2.5 + d * 2) + ')';
    fr[1].style.transform = 'translate(' + px(7 + nx * 4 + d * 3) + ',' + px(-5 + ny * 2.5 - d * 2) + ')';
    for (var i = 0; i < stickers.length; i++) {
      var st = stickers[i];
      st.el.style.transform = 'translate3d(' + px(nx * w * st.z) + ',' + px(ny * w * st.z * .7) + ',0) rotate(' + (st.r + nx * 1.6).toFixed(2) + 'deg)';
    }

    // the button
    var hShow = S.phase === 'sent' || S.phase === 'reset' ? 1 : S.h;
    ring.style.strokeDasharray = (hShow * 100).toFixed(2) + ' 100';
    ring.style.opacity = hShow > .002 ? ringO : 0;
    var press = clamp((a - .55) / .45, 0, 1);
    var breathe = rm ? 0 : .04 * Math.sin(S.t * 2.1);
    dot.style.transform = 'scale(' + (1 + breathe - .22 * press + (S.over && S.phase === 'idle' ? .08 : 0) + (S.phase === 'sent' ? 1.2 * flash : 0)).toFixed(3) + ')';
    dot.style.opacity = S.phase === 'sent' ? (1 - .55 * flash).toFixed(3) : 1;
    puckSvg.style.transform = 'scale(' + (1 - .04 * press + (S.phase === 'sent' ? .1 * Math.sin(Math.PI * clamp(S.ts / .32, 0, 1)) : 0)).toFixed(4) + ')';
    // the button's answer to the idle beat
    var rp = 0;
    if (S.phase === 'idle' && !rm && S.prox < .05 && !S.over) { rp = (S.idleT % 4.6 - 3.9) / .7; }
    if (rp > 0 && rp < 1) { ripple.style.opacity = (.8 * (1 - rp)).toFixed(3); ripple.style.transform = 'scale(' + (1 + .42 * easeOut(rp)).toFixed(3) + ')'; }
    else ripple.style.opacity = 0;

    // words
    if (hintT.textContent !== S.hintShown) hintT.textContent = S.hintShown;
    hint.style.opacity = S.hintO.toFixed(3);
    hint.style.transform = 'translateX(' + px((1 - S.hintO) * -10) + ') scale(' + (.94 + .06 * S.hintO).toFixed(3) + ')';
    var sec = S.phase === 'sent' ? HOLD : S.phase === 'reset' ? 0 : S.h * HOLD;
    var tt = fmt(sec);
    if (tt !== S.shownTime) { timeEl.textContent = tt; S.shownTime = tt; }
    var on = S.phase === 'holding' || S.phase === 'sent' || (S.phase === 'falling' && S.h > .02);
    if (on !== S.timerOn) { timer.classList.toggle('on', on); S.timerOn = on; }

    // the recorder opens into the sent note
    rec.style.width = px(lerp(G.recW, G.noteW, m));
    timer.style.opacity = (S.phase === 'sent' ? 1 - clamp((S.ts - .3) / .1, 0, 1) : 1 - clamp(m * 3, 0, 1)).toFixed(3);
    note.style.opacity = noteO.toFixed(3);

    drawWave(hw, fly);
  }

  /* ---------------------------------------------------------------- clock */
  var manual = false, last = 0, visible = true;
  function frame(now) {
    requestAnimationFrame(frame);
    if (manual || !visible) { last = now; return; }
    var dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    var n = Math.max(1, Math.ceil(dt / (1 / 240)));
    for (var i = 0; i < n; i++) step(dt / n);
    render();
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { rootMargin: '200px' }).observe(door);
  if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); render(); }).observe(glass);
  window.addEventListener('resize', function () { measure(); render(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); render(); });
  dur.textContent = '0:0' + Math.round(HOLD);
  measure(); render();
  requestAnimationFrame(function (t) { last = t; frame(t); });

  // for filming and frame strips
  window.__lens = {
    S: S, G: G,
    manual: function (v) { manual = v; },
    advance: function (ms) { var n = Math.max(1, Math.round(ms / (1000 / 240))); for (var i = 0; i < n; i++) step(ms / 1000 / n); render(); },
    pointer: function (x, y) { S.tx = x; S.ty = y; S.follow = true; },
    release: onLeave, start: startHold, end: endHold
  };
})();
