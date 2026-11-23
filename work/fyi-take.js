// FYI inner page, wide screens: one 3D phone carries every live screen and travels between the parts as the page scrolls.
// The page works without this file (flat phones beside the text); fyi.html loads it only when WebGL and motion are available.
(function () {
  'use strict';
  var F = window.FYI3D, FX = window.FX, d = document, html = d.documentElement;
  var host = d.getElementById('ot-stage'), story = d.querySelector('.ot-story'), fin = d.querySelector('.ot-fin');
  var els = [].slice.call(d.querySelectorAll('.ot-part'));
  if (!F || !FX || !host || !els.length) { html.classList.remove('ot-3d'); return; }

  // The scenes measure their own layout with getBoundingClientRect. Under a 3D matrix those numbers come out skewed,
  // so a read from inside a screen is taken with the matrix lifted for the length of the read (a transform does not touch layout).
  var gb = Element.prototype.getBoundingClientRect, rb = Range.prototype.getBoundingClientRect;
  function neutral(el, read) {
    var flat = el && el.closest ? el.closest('.f3-flat') : null, cam = flat && flat.parentElement;
    if (!cam) return read();
    var a = flat.style.transform, b = cam.style.transform;
    flat.style.transform = 'none'; cam.style.transform = 'none';
    try { return read(); } finally { flat.style.transform = a; cam.style.transform = b; }
  }
  Element.prototype.getBoundingClientRect = function () { var el = this; return neutral(el, function () { return gb.call(el); }); };
  Range.prototype.getBoundingClientRect = function () { var r = this, n = r.commonAncestorContainer; if (n && n.nodeType !== 1) n = n.parentElement; return neutral(n, function () { return rb.call(r); }); };

  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var smooth = function (v) { v = clamp(v); return v * v * (3 - 2 * v); };
  var ease = function (v) { v = clamp(v); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };

  function boot() {
    // the phone is as tall as the window allows, and no wider than leaves room for the art on its right
    var scale = function () { var w = innerWidth, edge = Math.max(40, (w - 1240) / 2 + 40) + Math.min(470, w * .35); return Math.max(3, Math.min(5.8, innerHeight * .79 / F.H, (w - edge - 90) * (340 / 740) / F.W)); };
    var st = new F.Stage(host, { pxPerMm: scale(), fov: 24, maxDpr: 2, floorZ: -38 });
    st.onresize = function () { st.setScale(scale()); };

    // three phones: the first carries the story, the other two only join it for "Three phones show the same moment"
    var phones = [0, 1, 2].map(function (k) { var p = F.makePhone(); p.visible = k === 0; st.scene.add(p); p.userData.hole.visible = true; p.userData.hole.material.opacity = 1; return p; });
    var rigs = phones.map(function (p) { return new F.Rig(p, {}, 60, 15.5); });
    var screen = function (phone, el) { var o = new F.CSS3DObject(el); o.scale.setScalar(F.PT); o.position.z = F.D / 2 + .08; o.visible = false; el.classList.add('f3-flat'); phone.add(o); return o; };

    var parts = els.map(function (el, i) {
      var root = el.querySelector('[data-scene]'), p = root && root._fx;
      var devs = !root ? [] : root.matches('.fx-dev') ? [root] : [].slice.call(root.querySelectorAll('.fx-dev'));
      var pt = { el: el, i: i, copy: el.querySelector('.ot-copy'), player: p, trio: devs.length > 1, played: false, o: -1 };
      pt.objs = devs.map(function (dv, k) { return screen(phones[k], dv); });
      if (p) {
        // this page decides when a scene is in view, not the scene engine's own observer
        var vis = false;
        Object.defineProperty(p, 'visible', { configurable: true, get: function () { return vis; }, set: function () {} });
        p.seen = true; p.replays = 9; p.parked = false;
        pt.view = function (b) { if (vis !== b) { vis = b; p.sync(); } };
      }
      return pt;
    });
    var TRIO = parts.findIndex(function (p) { return p.trio; });

    // where the phone rests in each part (millimetres and degrees). Whole turns are kept in the numbers, so the way from
    // one part to the next is itself the move: a turn about its own axis, a flip onto its face while the night passes.
    // the phone stands left of the middle of the free region, so what leaves the glass has room on its right
    var midX = function (pt) { var r = gb.call(pt.copy), w = st.w; return ((Math.max(r.right, w * .36) + w) / 2 - w / 2) / st.pxPerMm; };
    var freeX = function (pt) { var r = gb.call(pt.copy), w = st.w, pw = F.W * st.pxPerMm, edge = Math.max(r.right, w * .36), lo = edge + 62 + pw / 2, mid = (edge + w) / 2, want = w - 428 * (pw / 340) - pw / 2; return (Math.max(lo, Math.min(mid, want)) - w / 2) / st.pxPerMm; };
    var S3 = .7, G3 = F.W * S3 + 9;
    var trio = function (pt) { var r = gb.call(pt.copy), w = st.w, edge = Math.max(r.right, w * .36), room = (w - edge - 88) / st.pxPerMm; S3 = Math.max(.5, Math.min(.7, (room - 18) / (3 * F.W))); G3 = F.W * S3 + 9; return ((edge + 48 + w - 40) / 2 - w / 2) / st.pxPerMm; };
    var REST = [
      function (pt) { return { x: freeX(pt), y: -3, z: 0, rx: 7, ry: -22, rz: 5, s: 1 }; },
      function (pt) { return { x: freeX(pt), y: -3, z: 0, rx: 3, ry: -9 - 360, rz: 0, s: 1 }; },
      function (pt) { return { x: freeX(pt), y: -3, z: 0, rx: 4, ry: 10 - 360, rz: -2, s: 1 }; },
      function (pt) { return { x: freeX(pt), y: -3, z: 0, rx: 5 + 360, ry: -12 - 360, rz: 1.5, s: 1 }; },
      function (pt) { return { x: freeX(pt), y: -3, z: 0, rx: 3 + 360, ry: 9 - 360, rz: 0, s: 1 }; },
      function (pt) { var c = trio(pt); return { x: c - G3, y: -5, z: 0, rx: 2 + 360, ry: 0 - 360, rz: 0, s: S3 }; },
      function (pt) { return { x: freeX(pt), y: -3, z: 0, rx: 4 + 360, ry: -10 - 360, rz: 1, s: 1 }; }
    ];
    var rest = function (i) { return (REST[i] || REST[REST.length - 1])(parts[i]); };

    // the ending: over the last screen of the story the art goes back into the glass, the phone comes to the middle and faces you,
    // the crew gathers around it, and from there the whole picture leaves with the page instead of being cut by the next section
    var FIN = null, yEnd = 0, E = 1, finItems = fin ? [].slice.call(fin.querySelectorAll('.oa')) : [], finOn = false, lastSy = 1, lastFo = -1;
    var geo = [], T = 0;
    var measure = function () {
      var top0 = story.offsetTop; T = innerHeight * .9;
      if (fin) { var sF = .8, kF = st.pxPerMm, fs = fin.style; yEnd = top0 + story.offsetHeight - innerHeight; E = innerHeight * .9;
        FIN = { x: 0, y: -(st.h * .08) / kF, z: 0, rx: 360, ry: -360, rz: 0, s: sF };
        fs.setProperty('--px', (st.w / 2).toFixed(1) + 'px'); fs.setProperty('--py', (st.h / 2 - FIN.y * kF).toFixed(1) + 'px'); fs.setProperty('--u', (F.W * kF / 340 * sF).toFixed(4)); }
      geo = parts.map(function (pt) { return { top: top0 + pt.el.offsetTop, len: pt.el.offsetHeight }; });
      // where the phone rests on the screen in each part: the art of that part is placed around this point
      parts.forEach(function (pt, i) { var r = rest(i), k = st.pxPerMm, es = pt.el.style;
        es.setProperty('--px', (st.w / 2 + (r.x + (pt.trio ? G3 : 0)) * k).toFixed(1) + 'px'); es.setProperty('--py', (st.h / 2 - r.y * k).toFixed(1) + 'px');
        var u0 = F.W * k / 340, px = st.w / 2 + (r.x + (pt.trio ? G3 : 0)) * k, ua = pt.trio ? u0 : Math.min(u0, (st.w - px - 22) / 590);
        es.setProperty('--u', ua.toFixed(4)); es.setProperty('--g3', (G3 * k / u0).toFixed(1)); es.setProperty('--s3', S3.toFixed(3)); });
    };
    measure();

    var DBG = false, cur = -1, mx = .5, my = .5, first = true, lastAwake = 0, lastOwner = -1, lastY = -1, snap = false, fake = null, A = window.OTArt, pmx = '', pmy = '';
    addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; st.start(); }, { passive: true });
    // past the end the stage rides off the screen with the page, so its own "am I on screen" check sleeps it and, being moved away,
    // it could never see itself return: while the story is in reach, the scroll position says it is on screen
    addEventListener('scroll', function () { if (FIN && scrollY < yEnd + innerHeight * 1.2) st.visible = true; st.dirty = true; st.start(); }, { passive: true });
    addEventListener('resize', function () { measure(); st.dirty = true; st.start(); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); st.dirty = true; st.start(); }).observe(story);

    function show(i) {
      if (i === cur) return;
      var old = parts[cur], pt = parts[i];
      if (old) { old.objs.forEach(function (o) { o.visible = false; }); if (old.view) old.view(false); }
      pt.objs.forEach(function (o) { o.visible = true; });
      cur = i;
    }
    function play(pt) {
      var p = pt.player; if (!p) return;
      pt.view(true);
      if (!pt.played) { pt.played = true; if (FX.held) { p.parked = true; p.run(p.rest, true); } else { p.user = true; p.run(0); } }
      else if (p.done && !FX.held) { p.user = true; p.restart(); }
    }
    function copy(pt, o, dy) {
      if (Math.abs(o - pt.o) < .002 && o !== 0 && o !== 1) return;
      if (o === pt.o) return;
      pt.o = o; pt.copy.style.setProperty('--o', o.toFixed(3)); pt.copy.style.setProperty('--dy', dy.toFixed(1) + 'px'); pt.copy.classList.toggle('on', o > .01);
    }

    st.onFrame(function (dt) {
      var y = fake == null ? scrollY : fake, n = parts.length, i = 0, u = 1;
      for (var k = n - 1; k > 0; k--) if (y >= geo[k].top - T) { i = k; break; }
      if (i > 0) u = clamp((y - (geo[i].top - T)) / T);
      var travelling = i > 0 && u < 1, e = ease(u);
      var pose = travelling ? F.mix(rest(i - 1), rest(i), e) : rest(i);
      if (lastY >= 0 && Math.abs(y - lastY) > innerHeight * 1.5) snap = true;   // a jump (a link, a reload): no flight across the page
      lastY = y;
      if (travelling) pose.z += Math.sin(Math.PI * e) * 34;            // it comes toward you on the way
      // while a part holds, the phone keeps turning a little with the scroll, and leans a little toward the pointer
      var h = clamp((y - geo[i].top) / Math.max(1, geo[i].len - T));
      pose.ry += (h - .5) * (parts[i].trio ? 0 : 7) + (mx - .5) * 6; pose.rx += (my - .5) * -4;

      var x = FIN ? clamp((y - (yEnd - E)) / E) : 0;
      if (x > 0) pose = F.mix(pose, FIN, ease(x));
      // the screen sleeps for the trip and wakes on arrival; the screens change over while it is dark
      var awake = !travelling ? 1 : u < .5 ? 1 - smooth(u / .2) : smooth((u - .8) / .2);
      var owner = travelling && u < .5 ? i - 1 : i;
      show(owner);
      if (awake > .98 && (lastAwake <= .98 || owner !== lastOwner) || first) play(parts[owner]);
      lastOwner = owner;
      if (A) for (var a = 0; a < n; a++) { var on = a === owner && awake > .98 && x < .04; if (parts[a].art !== on) { parts[a].art = on; A.set(parts[a].el, on); } }
      var sx = (mx - .5).toFixed(2), sy = (my - .5).toFixed(2);
      if (sx !== pmx) { pmx = sx; story.style.setProperty('--mx', sx); }
      if (sy !== pmy) { pmy = sy; story.style.setProperty('--my', sy); }
      if (awake < .5 && parts[owner].view) parts[owner].view(false);
      lastAwake = awake;

      // the other two phones come in from the right edge of the screen, already facing forward, and leave the same way
      rigs[0].to(pose); if (first || snap) rigs[0].snap(pose);
      phones[0].userData.hole.material.opacity = 1 - awake;
      if (TRIO >= 0) {
        var R = rest(TRIO);
        for (var j = 1; j < 3; j++) {
          var in3 = i === TRIO ? (travelling ? ease((u - .46 - (j - 1) * .12) / .4) : 1) : (i === TRIO + 1 && travelling ? 1 - smooth((u - (2 - j) * .07) / .3) : 0);
          var tx = R.x + j * G3, off = st.mmW / 2 + F.W - tx;
          var pj = { x: tx + (1 - in3) * off, y: R.y, z: 0, rx: i === TRIO && !travelling ? pose.rx : R.rx, ry: (i === TRIO && !travelling ? pose.ry : R.ry) - j * 2, rz: 0, s: R.s };
          var vis = in3 > .001;
          if (vis && !phones[j].visible || snap) rigs[j].snap(pj);
          phones[j].visible = vis; rigs[j].to(pj);
          phones[j].userData.hole.material.opacity = owner === TRIO ? 1 - awake * smooth((in3 - .85) / .15) : 1;
          parts[TRIO].objs[j].visible = vis && owner === TRIO;
        }
      }
      snap = false;

      // the text of each part: it leaves upward as the phone sets off and the next one arrives from below
      for (var c = 0; c < n; c++) {
        var o = 0, dy = 0;
        if (c === i) { o = travelling ? smooth((u - .6) / .4) : 1; dy = (1 - o) * 40; if (x > 0) { o = 1 - smooth(x / .3); dy = -(1 - o) * 40; } }
        else if (c === i - 1 && travelling) { o = 1 - smooth(u / .36); dy = -(1 - o) * 40; }
        copy(parts[c], o, dy);
      }

      if (FIN) {
        var fo = smooth((x - .5) / .4), sy = Math.round(Math.min(0, yEnd - y)), gather = x > .6;
        if (fo !== lastFo) { lastFo = fo; fin.style.setProperty('--fo', fo.toFixed(3)); }
        if (sy !== lastSy) { lastSy = sy; story.style.setProperty('--sy', sy + 'px'); }
        if (gather !== finOn) { finOn = gather; finItems.forEach(function (it) { it.classList.toggle('go', gather); }); }
      }
      if (DBG) window.__ot.dbg = { y: Math.round(y), i: i, u: +u.toFixed(3), x: +x.toFixed(3), awake: +awake.toFixed(2), owner: owner, geo: geo.map(function (g) { return [Math.round(g.top), Math.round(g.len)]; }).concat([[Math.round(yEnd - E), Math.round(E)]]), T: Math.round(T) };
      var moving = false;
      for (var r = 0; r < 3; r++) if (phones[r].visible && rigs[r].step(dt)) moving = true;
      if (first) { first = false; requestAnimationFrame(function () { host.classList.add('on'); }); }
      return moving;
    });
    window.__ot = { st: st, parts: parts, phones: phones };
    DBG = /[?&]dbg(&|$)/.test(location.search);   // ?dbg: the state of the page for a test script
    // ?at=2.3 opens on part 2, 30% of the way through it; with &still the page itself stays at the top (for a headless still)
    var m = /[?&]at=([\d.]+)/.exec(location.search);
    if (/[?&]still/.test(location.search)) host.style.transition = 'none';
    if (m) { var jump = function () { var v = +m[1], k = Math.min(parts.length - 1, Math.floor(v)); html.style.scrollBehavior = 'auto'; measure(); var to = geo[k].top + geo[k].len * (v - k); snap = true; if (/[?&]still/.test(location.search)) { fake = to; st.dirty = true; st.start(); } else scrollTo(0, to); }; if (d.readyState === 'complete') setTimeout(jump, 60); else addEventListener('load', function () { setTimeout(jump, 60); }); }
  }

  // the scene engine builds its players when the document is ready; wait for them
  var tries = 0;
  (function wait() {
    var r = els[0].querySelector('[data-scene]');
    if (r && r._fx) { try { boot(); } catch (err) { html.classList.remove('ot-3d'); if (window.console) console.error(err); } }
    else if (tries++ < 300) setTimeout(wait, 16);
    else html.classList.remove('ot-3d');
  })();
})();
