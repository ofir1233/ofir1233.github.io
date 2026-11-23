/* Topics block prototype: from pencil to a live screen. Each stage adds a medium:
     1 Sketch        graphite: the wireframe's real layout, drawn on the page itself (SVG paths made from the lo page's DOM)
     2 Wireframe     gray boxes: each pencilled part settles into the real wireframe (the lo page, revealed where its sketch was)
     3 Finished      the coloured interface: the hi page takes over region by region
     4 Hear's world  paint: the sky is brushed in behind the window, then clouds, the city, flowers and wisteria (placeholders)
     5 In use        life: a drawn cursor drives the real hi page with real events; then the page is the visitor's
   Everything in stages 1 to 4 is a pure function of the time t (play, scrub, jump). Stage 5 follows the same clock but also
   depends on the live page answering.   URL: ?t=seconds | ?t=end   ?auto=0 */
(function () {
  'use strict';
  var fig = document.querySelector('.tp-fig');
  if (!fig) return;
  var $ = function (s) { return fig.querySelector(s); };
  var stage = $('.ct-stage'), win = $('.hs-win'), lo = $('.tp-lo'), hi = $('.tp-hi'), sk = $('.tp-sketch'), pencil = $('.tp-pencil'), ptr = $('.tp-ptr');
  var glow = $('.tp-glow'), sun = $('.tp-sun'), far = $('.tp-far'), mid = $('.tp-mid'), near = $('.tp-near'), sky = $('.tp-sky'), skyImg = $('.tp-sky-img'), strokesG = $('.tp-strokes');
  var art = { city: $('.a-city'), front: $('.a-cloud-front'), hyd: $('.a-hyd'), wist: $('.a-wisteria') };
  var block = fig.closest('.tp-block'), stepsEl = block.querySelector('.tp-steps'), stepLis = [].slice.call(stepsEl.children), says = [].slice.call(block.querySelectorAll('.tp-say span')), again = block.querySelector('.tp-again');
  var qs = new URLSearchParams(location.search);
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ── small maths ── */
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var outC = function (k) { return 1 - Math.pow(1 - k, 3); };
  var ioC = function (k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  var ioS = function (k) { return .5 - Math.cos(Math.PI * k) / 2; };
  var f1 = function (v) { return (Math.round(v * 10) / 10).toString(); };
  var hyp = Math.hypot;

  /* ── state ── */
  var REST = -.5, W = 1440, H = 810, tier = '', s = 1, lastCw = 0;
  var G = null, S = null, B = [0, 2.3, 3.8, 5.8, 7.6, 11], T = 11;
  var time = REST, playing = false, stopAt = 0, last = 0, started = false, loaded = 0;
  var readyDone, ready = new Promise(function (r) { readyDone = r; });

  /* The wireframe is given the finished page's measures (card inset, type sizes, five topics, six rows), so every box in one page
     sits exactly on the same box in the other. Only the skin differs. */
  var SHARED = '.side{box-sizing:border-box!important;padding:22px 14px 20px 18px!important}' +
    '.ask-on .tp .key>span{margin-right:5px!important}.ask-on .tp .key>i{width:18px!important}.ask-on .tp-kpis small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.px-small .side{display:none!important}.px-small .stage{--side:0px!important}' +
    '.px-phone .tp-col:last-child,.px-phone .tp-def p,.px-phone .tp-def .tp-n,.px-phone .top .act,.px-phone .tp-kpis>div:nth-child(n+3),.px-phone .tp-h .tp-n,.px-phone .tp-h .sub,.px-phone .key .tp-n,.px-phone .tp-hint{display:none!important}' +
    '.px-phone .tp-body{grid-template-columns:minmax(0,1fr)!important}.px-phone .tp .card{padding:20px 20px 14px!important}.px-phone .tp .top p{white-space:normal}' +
    '.tp.is-swap .card,.tp-map.is-new .tp-tile,.tp-list.is-new .tp-row{animation:none!important}';
  var LO_MATCH = '.tp-tip{display:none!important}.lofi .tp .card{inset:14px!important}' +
    '.lofi .tp .top p{font-size:15px!important}' +
    '.lofi .tp-def{margin-top:18px!important;font-size:14.5px!important}' +
    '.lofi .tp .tp-kpis{margin-top:18px!important}.lofi .tp .tp-kpis>div{padding-top:18px!important;padding-bottom:18px!important}' +
    '.lofi .tp .tp-kpis small{font-size:14px!important}.lofi .tp .tp-kpis b{font-size:40px!important}' +
    '.lofi .tp .tp-kpis i{font-size:13.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.lofi .tp-body{margin-top:22px!important;gap:36px!important}' +
    '.lofi .tp-h{height:36px!important;font-size:14.5px!important}.lofi .tp-h>b{font-size:19px!important}' +
    '.lofi .tp .key,.lofi .tp-foot{font-size:13.5px!important;padding-top:13px!important}' +
    '.lofi .tp-row{grid-template-columns:minmax(0,1fr) 206px 92px!important;gap:18px!important}' +
    '.lofi .tp-row .nm{font-size:16.5px!important}.lofi .tp-row .nm small{display:none!important}' +
    '.lofi .tp-row .sc{display:flex;align-items:baseline;justify-content:flex-end;gap:10px}' +
    '.lofi .tp-row .sc small{order:-1;margin:0!important;font-size:13px!important;overflow:visible}' +
    '.lofi .tp-row .sc b{min-width:26px;font-size:23px!important}' +
    '.lofi .tp-bars{gap:4px!important;height:32px!important}.lofi .tp-bars i{flex:1 1 0;min-width:0}' +
    '.lofi .tp-foot .mod{display:none!important}';
  function matchWire() {
    try {
      var L = lo.contentDocument, D = hi.contentDocument;
      var b = L.querySelector('#tp-view button[data-i="0"]'); if (b && !b.classList.contains('on')) b.click();
      var n = [].filter.call(D.querySelectorAll('.tp-row'), function (r) { return !r.hidden; }).length || 6;
      [].forEach.call(L.querySelectorAll('.tp-row'), function (r) { r.hidden = (+r.style.order || 0) >= n; });
    } catch (e) {}
  }

  /* ── the frame: both pages drawn at one size, scaled into the window (1440 wide, 860 without the sidebar, a tall 460 on a phone) ── */
  function fit() {
    var cw = win.clientWidth; if (!cw || Math.abs(cw - lastCw) < .5) return; lastCw = cw;
    var t = cw >= 900 ? [1440, 810, ''] : cw >= 560 ? [860, 484, 's'] : [460, 560, 'p'];
    W = t[0]; H = t[1]; tier = t[2];
    [lo, hi].forEach(function (f) {
      f.style.width = W + 'px'; f.style.height = H + 'px';
      try { var c = f.contentDocument.documentElement.classList; c.toggle('px-small', tier !== ''); c.toggle('px-phone', tier === 'p'); f.contentWindow.dispatchEvent(new Event('resize')); } catch (e) {}
    });
    win.style.aspectRatio = (W - 6) + ' / ' + (H - 6); s = cw / (W - 6); fig.style.setProperty('--s', s);
    if (loaded === 2) later();
  }
  var mT1, mT2;
  function later() { clearTimeout(mT1); clearTimeout(mT2); mT1 = setTimeout(remeasure, 90); mT2 = setTimeout(remeasure, 520); }
  function remeasure() { if (loaded < 2) return; matchWire(); measure(); buildSketch(); schedule(); buildWorld(); if (wantEnd && !started) time = T; render(true); }

  /* ── measuring: every region comes from the pages' own DOM (app pixels) ── */
  var mk = function (b) { return { x: b.left, y: b.top, w: b.width, h: b.height, r: b.right, b: b.bottom, cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; };
  var R = function (e) { return mk(e.getBoundingClientRect()); };
  var vis = function (e) { return !!e && !e.hidden && e.getClientRects().length > 0 && e.getBoundingClientRect().width > 0; };
  var TX = function (e) { var g = e.ownerDocument.createRange(); g.selectNodeContents(e); return mk(g.getBoundingClientRect()); };
  function measure() {
    var D = hi.contentDocument;
    var q = function (sel) { var e = D.querySelector(sel); return vis(e) ? e : null; };
    var all = function (sel) { return [].filter.call(D.querySelectorAll(sel), vis); };
    var g = {};
    var side = q('.side'); g.side = side ? R(side).r : 0;
    var nav = q('#nav-topics'); g.nav = nav ? R(nav) : null;
    g.h2 = TX(q('.tp .top h2'));
    g.kpis = R(q('.tp-kpis')); g.body = R(q('.tp-body'));
    g.kp = all('.tp-kpis>div').map(function (e) { return { cell: R(e), num: TX(e.querySelector('b')) }; });
    var cols = all('.tp-col'); g.col1 = R(cols[0]); g.col2 = cols[1] ? R(cols[1]) : null;
    g.kTop = g.kpis.y; g.bodyTop = (g.kpis.b + g.body.y) / 2; g.split = g.col2 ? (g.col1.r + g.col2.x) / 2 : W;
    g.map = R(q('#tp-map'));
    g.tiles = all('.tp-tile').map(function (e) { var sc = e.querySelector('.sc b'); return { el: e, r: R(e), k: +e.dataset.k, s: +sc.textContent, sc: TX(sc), open: e.classList.contains('can-open') }; });
    g.order = g.tiles.slice().sort(function (a, b) { return a.s - b.s || b.r.w * b.r.h - a.r.w * a.r.h; });
    g.dark = g.order[0];
    g.rows = all('.tp-row').map(function (e) { return { r: R(e) }; }).sort(function (a, b) { return a.r.y - b.r.y; });
    var box = function (x, y, r, b) { return { x: x, y: y, w: r - x, h: b - y, r: r, b: b }; };
    g.R = { side: g.side > 0 ? box(0, 0, g.side, H) : null, head: box(g.side, 0, W, g.kTop), met: box(g.side, g.kTop, W, g.bodyTop), map: box(g.side, g.bodyTop, g.split, H), list: g.col2 ? box(g.split, g.bodyTop, W, H) : null };
    g.box = box;
    G = g;
  }

  /* ── stage 1: the pencil drawing. Strokes are generated from the wireframe's DOM; nothing is traced from a picture ── */
  var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  var GLY = { '0': [[[5, 1], [2, 4], [2, 12], [5, 15], [8, 12], [8, 4], [5, 1]]], '1': [[[2.4, 4.6], [5.6, 1]], [[5.6, 1], [5.4, 8], [5.6, 15]]], '2': [[[1.5, 4], [4, 1], [7.5, 2], [8, 6], [1.5, 15], [9, 15]]],
    '3': [[[1.5, 2], [5, 1], [8, 3.5], [5, 7.5], [8.5, 11], [5.5, 15], [1.5, 13.5]]], '4': [[[6.6, 1], [3.4, 6], [1, 10.6], [9.6, 10.4]], [[7, 4.6], [6.9, 10], [7.1, 15.5]]], '5': [[[8.4, 1.2], [2.8, 1]], [[2.8, 1], [2.5, 4], [2.2, 6.9]], [[2.2, 6.9], [5.4, 5.9], [8.3, 8.6], [8, 12.6], [5, 15], [1.5, 13.4]]],
    '6': [[[7.5, 1.5], [3, 5], [1.8, 11], [5, 15], [8.3, 12], [6, 8], [2.2, 10]]], '7': [[[1.5, 1.3], [9, 1]], [[9, 1], [6.4, 7], [4.4, 15]]], '8': [[[5, 7.5], [2.2, 4.5], [5, 1], [7.8, 4.5], [5, 7.5], [1.6, 11.5], [5, 15], [8.4, 11.5], [5, 7.5]]],
    '9': [[[8, 6], [5, 8.5], [2, 5], [5, 1], [8, 5], [7.5, 11], [4, 15]]], ',': [[[3.5, 13.5], [3.8, 15.5], [2, 18]]], '.': [[[3.4, 14], [4.2, 15], [3.4, 15.2]]], '+': [[[1.5, 8.5], [8.5, 8.5]], [[5, 5], [5, 12]]], '-': [[[2, 8.5], [8, 8.5]]] };
  var GW = { ',': .5, '.': .5 };
  var parts = [], NS = 'http://www.w3.org/2000/svg';
  function buildSketch() {
    var L = lo.contentDocument; seed = 7; parts = [];
    var X = function (v) { return (v - 3) * s; };
    var wr = function (b) { return { x: X(b.x), y: X(b.y), w: b.w * s, h: b.h * s, r: X(b.r), b: X(b.b), cx: X(b.cx), cy: X(b.cy) }; };
    var Rw = function (e) { return wr(R(e)); }, Tw = function (e) { return wr(TX(e)); };
    var all = function (sel, root) { return [].filter.call((root || L).querySelectorAll(sel), vis); };
    var one = function (sel, root) { var e = (root || L).querySelector(sel); return vis(e) ? e : null; };
    var add = function (g, d, len, w, o) { parts.push({ g: g, d: d, len: Math.max(4, len), w: (w || 1.2) * (.9 + .25 * rnd()), o: (o || .86) * (.72 + .28 * rnd()) }); };
    var P = function (pts) {      /* a hand's line: through the points, rounded */
      var d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
      for (var i = 1; i < pts.length - 1; i++) d += 'Q' + f1(pts[i][0]) + ' ' + f1(pts[i][1]) + ' ' + f1((pts[i][0] + pts[i + 1][0]) / 2) + ' ' + f1((pts[i][1] + pts[i + 1][1]) / 2);
      return d + 'L' + f1(pts[pts.length - 1][0]) + ' ' + f1(pts[pts.length - 1][1]);
    };
    var ln = function (g, x1, y1, x2, y2, o) {      /* a ruled-by-hand line: a little wobble, a little overshoot at both ends */
      o = o || {};
      var dx = x2 - x1, dy = y2 - y1, len = hyp(dx, dy) || 1, ux = dx / len, uy = dy / len, ov = o.over === undefined ? 3 : o.over, a = ov * (.2 + rnd()), b = ov * (.2 + rnd());
      x1 -= ux * a; y1 -= uy * a; x2 += ux * b; y2 += uy * b; dx = x2 - x1; dy = y2 - y1; len += a + b;
      var n = Math.max(2, Math.round(len / 52)), amp = o.amp === undefined ? .8 : o.amp, pts = [], tilt = (rnd() - .5) * Math.min(2.4, len * .012);
      for (var i = 0; i <= n; i++) { var f = i / n, j = (rnd() - .5) * 2 * amp + tilt * (f - .5) * 2; pts.push([x1 + dx * f - uy * j, y1 + dy * f + ux * j]); }
      add(g, P(pts), len, o.w, o.o);
    };
    var bx = function (g, r, o) { o = o || {}; ln(g, r.x, r.y, r.r, r.y, o); ln(g, r.r, r.y, r.r, r.b, o); ln(g, r.r, r.b, r.x, r.b, o); ln(g, r.x, r.b, r.x, r.y, o);
      if (o.dbl) { var q = { over: o.over, amp: (o.amp || .8) * 1.3, w: (o.w || 1.2) * .8, o: .45 }; ln(g, r.x + 1, r.y - 1, r.r, r.y + .6, q); ln(g, r.x - .8, r.b + 1, r.r + 1, r.b - .4, q); } };
    var zig = function (g, x, cy, w, h, o) {      /* a scribble standing for a line of words */
      o = o || {}; if (w < 5) return;
      var step = Math.max(3.4, h * 1.1), n = Math.max(2, Math.round(w / step)), pts = [];
      for (var i = 0; i <= n; i++) pts.push([x + w * i / n + (rnd() - .5) * step * .35, cy + ((i % 2) ? -1 : 1) * h * .5 * (.55 + .5 * rnd())]);
      add(g, P(pts), w * 1.6, o.w || 1, o.o || .78);
    };
    var words = function (g, e, o) { if (!e) return; var t = Tw(e); zig(g, t.x, t.cy, t.w, Math.max(3, t.h * (o && o.k || .34)), o); };
    var num = function (g, e, o) {      /* the real number, written by hand at the real size */
      if (!e) return; var t = Tw(e), str = e.textContent.trim(), tot = 0, i, x = t.x;
      for (i = 0; i < str.length; i++) tot += GW[str[i]] || 1;
      var adv = t.w / tot, gh = t.h * .84, top = t.cy - gh * .5, lean = gh * .08;
      for (i = 0; i < str.length; i++) {
        var gl = GLY[str[i]], cw = adv * (GW[str[i]] || 1), gw = Math.min(cw * .84, gh * .62), ox = x + (cw - gw) / 2, jy = (rnd() - .5) * gh * .07;
        if (gl) gl.forEach(function (pl) {
          var pts = pl.map(function (p) { return [ox + p[0] / 10 * gw + lean * (1 - p[1] / 16) + (rnd() - .5) * gw * .09, top + jy + p[1] / 16 * gh + (rnd() - .5) * gh * .04]; });
          add(g, P(pts), gh * 2.2, (o && o.w) || 1.9, 1.05);
        });
        x += cw;
      }
    };
    var hatch = function (g, r, gap, o) {      /* shading: the darker the box in the real screen, the closer the hatching */
      var x = r.x + 3, y = r.y + 3, w = r.w - 6, h = r.h - 6;
      for (var c = gap * (.5 + .4 * rnd()); c < w + h; c += gap * (.82 + .36 * rnd())) ln(g, x + Math.max(0, c - h), y + Math.min(c, h), x + Math.min(c, w), y + Math.max(0, c - w), { over: 0, amp: .6, w: o.w, o: o.o });
    };
    var pill = function (g, e) { if (!e) return; var r = Rw(e); if (r.w < 8) return; bx(g, { x: r.x + 1, y: r.cy - 3, r: r.x + 7, b: r.cy + 3 }, { over: .6, amp: .2, w: .8, o: .6 }); zig(g, r.x + 11, r.cy, r.w - 15, 2.6, { w: .8, o: .55 }); };
    var w = win.clientWidth, h = win.clientHeight;

    /* 0: the frame */
    bx(0, { x: 5, y: 5, r: w - 5, b: h - 5 }, { over: 6, amp: 1, w: 1.6, o: .92, dbl: 1 });
    /* 1: the sidebar */
    var side = one('.side');
    if (side) {
      var sr = Rw(side); ln(1, sr.r, 6, sr.r, h - 6, { w: 1.3 });
      var mark = one('.ws__mark'); if (mark) bx(1, Rw(mark), { over: 1.5, amp: .4 });
      words(1, one('.ws__name')); var nw = one('.side .new'); if (nw) { bx(1, Rw(nw), { over: 2.5 }); words(1, nw, { k: .3 }); }
      all('.side .nv').forEach(function (e) {
        var ic = e.querySelector('svg.i'), ir = ic && vis(ic) ? Rw(ic) : null, t = Tw(e), er = Rw(e);
        if (e.classList.contains('on')) bx(1, er, { over: 2, amp: .5 });
        if (ir) bx(1, { x: ir.x + 2, y: ir.y + 2, r: ir.r - 2, b: ir.b - 2 }, { over: .8, amp: .25, w: .9, o: .7 });
        var x0 = ir ? ir.r + 6 * s : t.x; zig(1, x0, er.cy, Math.min(t.r, er.r - 8) - x0, 3.2, { w: 1 });
      });
      var me = one('.side .me'); if (me) { var mr = Rw(me); bx(1, mr, { over: 2 }); var mb = me.querySelector('b'); if (mb) bx(1, Rw(mb), { over: 1, amp: .4 }); var ms = me.querySelector('span'); if (ms) words(1, ms, { k: .2 }); }
    }
    /* 2: the title and the definition */
    var h2 = one('.tp .top h2'); if (h2) { var ht = Tw(h2); zig(2, ht.x, ht.cy, ht.w, ht.h * .42, { w: 2.3, o: .95 }); zig(2, ht.x + 2, ht.cy + 1, ht.w - 3, ht.h * .3, { w: 1.6, o: .7 }); }
    words(2, one('.tp .top p'), { k: .3, w: .95 });
    all('.tp .top .act').forEach(function (e) { bx(2, Rw(e), { over: 2 }); words(2, e, { k: .24, w: .9 }); });
    var pick = one('.tp-pick'); if (pick) { bx(2, Rw(pick), { over: 2 }); words(2, pick, { k: .24, w: .9 }); }
    words(2, one('.tp-def p'), { k: .3, w: .95 }); pill(2, one('.tp-def .tp-n'));
    /* 3: the row of numbers */
    var kp = one('.tp-kpis');
    if (kp) {
      var kr = Rw(kp); ln(3, kr.x, kr.y, kr.r, kr.y, { w: 1.1 });
      all('.tp-kpis>div').forEach(function (e, i) {
        var c = Rw(e); if (i) ln(3, c.x, c.y + 2, c.x, c.b - 2, { w: 1, over: 2 });
        words(3, e.querySelector('small'), { k: .3, w: .9 }); num(3, e.querySelector('b'), { w: 2.5 }); words(3, e.querySelector('i'), { k: .28, w: .85, o: .62 });
      });
      ln(3, kr.x, kr.b, kr.r, kr.b, { w: 1.1 });
    }
    /* 4: the map of topics */
    var c1 = one('.tp-col');
    if (c1) {
      var mt = one('#tp-mt'); if (mt) { var m = Tw(mt); zig(4, m.x, m.cy, m.w, m.h * .36, { w: 1.7, o: .9 }); }
      pill(4, one('.tp-h .tp-n', c1)); var sg = one('.tp-seg', c1); if (sg) { var g1 = Rw(sg); bx(4, g1, { over: 1.5, amp: .4, w: 1 }); ln(4, g1.x + g1.w * .33, g1.y, g1.x + g1.w * .33, g1.b, { over: 0, w: .8 }); ln(4, g1.x + g1.w * .64, g1.y, g1.x + g1.w * .64, g1.b, { over: 0, w: .8 }); }
      all('.tp-tile').forEach(function (e) {
        var r = Rw(e), tb = e.querySelector('.tb'), d = 2 * s, rr = { x: r.x + d, y: r.y + d, r: r.r - d, b: r.b - d, w: r.w - 2 * d, h: r.h - 2 * d };
        bx(4, rr, { over: 4, amp: .9, w: 1.45, o: .92, dbl: 1 });
        var lv = tb ? (tb.className.match(/\bb([1-5])\b/) || [])[1] : 0;
        if (lv === '1') { hatch(4, rr, 5.5, { w: 1, o: .62 }); hatch(4, rr, 9, { w: .9, o: .4 }); } else if (lv === '5') hatch(4, rr, 11, { w: .9, o: .42 }); else if (lv === '4') hatch(4, rr, 19, { w: .85, o: .34 });
        var nm = e.querySelector('.tb .nm'); if (vis(nm)) { var n = Tw(nm); zig(4, n.x, n.cy, n.w, n.h * .34, { w: 1.4, o: .9 }); }
        var cl = e.querySelector('.tb .cl'); if (vis(cl)) words(4, cl, { k: .3, w: .85, o: .6 });
        var em = e.querySelector('.tb em'); if (vis(em)) bx(4, Rw(em), { over: 1, amp: .3, w: .9, o: .7 });
        var sc = e.querySelector('.tb .sc b'); if (vis(sc)) num(4, sc, { w: 2.7 });
        var sm = e.querySelector('.tb .sc small'); if (vis(sm)) words(4, sm, { k: .3, w: .85, o: .6 });
      });
      all('.tp .key>i:not(.tp-n)').forEach(function (e) { bx(4, Rw(e), { over: .8, amp: .25, w: .85, o: .65 }); });
      all('.tp .key>span').forEach(function (e) { words(4, e, { k: .26, w: .8, o: .55 }); });
      pill(4, one('.tp .key .tp-n'));
    }
    /* 5: the list of days */
    var c2 = all('.tp-col')[1];
    if (c2) {
      var lb = one('.tp-h>b', c2); if (lb) { var l1 = Tw(lb); zig(5, l1.x, l1.cy, l1.w, l1.h * .36, { w: 1.7, o: .9 }); }
      pill(5, one('.tp-h .tp-n', c2)); var s2 = one('.tp-seg', c2); if (s2) { var g2 = Rw(s2); bx(5, g2, { over: 1.5, amp: .4, w: 1 }); ln(5, g2.x + g2.w * .3, g2.y, g2.x + g2.w * .3, g2.b, { over: 0, w: .8 }); ln(5, g2.x + g2.w * .66, g2.y, g2.x + g2.w * .66, g2.b, { over: 0, w: .8 }); }
      all('.tp-row', c2).sort(function (a, b) { return R(a).y - R(b).y; }).forEach(function (e, i) {
        var r = Rw(e); if (i) ln(5, r.x + 8, r.y, r.r - 8, r.y, { w: .8, o: .45 });
        var nm = e.querySelector('.nm'); if (vis(nm)) { var n = Tw(nm); zig(5, n.x, n.cy, n.w, n.h * .32, { w: 1.3, o: .88 }); }
        var d = '', tot = 0; [].forEach.call(e.querySelectorAll('.tp-bars i'), function (b) { var q = Rw(b), x = q.cx + (rnd() - .5) * .8; d += 'M' + f1(x) + ' ' + f1(q.b + rnd()) + 'L' + f1(x + (rnd() - .5)) + ' ' + f1(q.y - rnd()); tot += q.h + 2; });
        if (d) add(5, d, tot * .8, 1.15, .8);
        var sc = e.querySelector('.sc b'); if (vis(sc)) num(5, sc, { w: 2 });
        var sm = e.querySelector('.sc small'); if (vis(sm)) words(5, sm, { k: .28, w: .8, o: .55 });
      });
      var ft = one('.tp-foot', c2); if (ft) { var fd = ft.querySelector('.dash'); if (vis(fd)) { var q = Rw(fd); ln(5, q.x, q.cy, q.r, q.cy, { over: 0, w: .9, o: .6 }); } var fs = ft.querySelector('span'); if (vis(fs)) words(5, fs, { k: .28, w: .8, o: .55 }); }
    }
    /* into the page: one group a region, a light underdrawing and the firm strokes over it */
    sk.innerHTML = ''; sk.setAttribute('viewBox', '0 0 ' + f1(w) + ' ' + f1(h));
    var groups = [];
    for (var gi = 0; gi < 6; gi++) { var ge = document.createElementNS(NS, 'g'), u = document.createElementNS(NS, 'g'), f = document.createElementNS(NS, 'g'); u.setAttribute('opacity', '.3'); ge.appendChild(u); ge.appendChild(f); sk.appendChild(ge); groups.push({ g: ge, u: u, f: f }); }
    parts.forEach(function (p) {
      var a = document.createElementNS(NS, 'path'); a.setAttribute('d', p.d); a.setAttribute('stroke-width', f1(p.w * .9)); a.setAttribute('stroke-opacity', f1(p.o)); groups[p.g].u.appendChild(a);
      var b = document.createElementNS(NS, 'path'); b.setAttribute('d', p.d); b.setAttribute('stroke-width', p.w.toFixed(2)); b.setAttribute('stroke-opacity', p.o.toFixed(2)); b.setAttribute('pathLength', '1'); b.style.strokeDasharray = '1.02'; b.style.strokeDashoffset = '0'; groups[p.g].f.appendChild(b);
      p.el = b; p.k = 1;
    });
    G.groups = groups; G.ww = w; G.wh = h;
    fig.classList.add('is-ready');
  }

  /* ── the clock ── */
  var D1 = 2.05;
  function schedule() {
    var o = {}, i;
    /* stage 1: each region gets a share of the drawing time by how much there is to draw in it */
    var tot = [0, 0, 0, 0, 0, 0], sum = 0; parts.forEach(function (p) { tot[p.g] += p.len; });
    var wgt = tot.map(function (v) { return v ? Math.pow(v, .55) : 0; }); wgt.forEach(function (v) { sum += v; });
    var t0 = 0, acc = [0, 0, 0, 0, 0, 0]; o.reg = [];
    for (i = 0; i < 6; i++) { var d = D1 * wgt[i] / sum; o.reg.push([t0, t0 + d]); t0 += d; }
    parts.forEach(function (p) {
      var rg = o.reg[p.g], d = rg[1] - rg[0], a = acc[p.g] / tot[p.g], share = p.len / tot[p.g];
      p.t0 = rg[0] + a * d * .93; p.t1 = Math.min(rg[1] + .05, p.t0 + Math.max(.05, share * d * 3.2)); acc[p.g] += p.len;
    });
    var b1 = D1 + .1;
    /* stage 2: the parts settle into the wireframe in the order they were drawn */
    o.lo = {}; var c = b1 + .05; ['side', 'head', 'met', 'map', 'list'].forEach(function (k) { if (G.R[k]) { o.lo[k] = [c, c + .62]; c += .2; } });
    var b2 = c + .62 - .2 + .12; o.loDone = c + .42; o.paper = [b1, b1 + 1.1];
    /* stage 3: the Hear look */
    c = b2; o.hi = {};
    if (G.R.side) { o.hi.side = [c, c + .7]; c += .2; }
    o.hi.head = [c, c + .7]; c += .3; o.hi.met = c; c += .3; o.hi.tile = c; o.hi.map = [c + .1, c + .7]; c += .35;
    if (G.R.list) { o.hi.lhead = [c, c + .4]; o.hi.row = c + .05; c += .05 + .07 * G.rows.length + .45; } else c += .5;
    c = Math.max(c, o.hi.tile + .11 * (G.tiles.length - 1) + .45); o.hiDone = c; var b3 = c + .05;
    /* stage 4: paint */
    o.w = b3; var b4 = b3 + 1.75;
    /* stage 5: in use */
    o.u = b4; T = b4 + (tier === 'p' ? 2.2 : 3.45);
    B = [0, b1, b2, b3, b4, T]; S = o;
  }

  /* ── masks: a list of soft shapes, each bounded by a real region ── */
  var FULL = 'linear-gradient(#000,#000)';
  function shapes() {
    var out = [];
    var put = function (r, img) { out.push([r.x - .5, r.y - .5, r.w + 1, r.h + 1, img]); };
    return { out: out,
      grow: function (r, k, ox, oy, soft) {
        if (k <= 0) return; if (k >= 1) return put(r, FULL);
        var fr = Math.max(hyp(ox - r.x, oy - r.y), hyp(r.r - ox, oy - r.y), hyp(ox - r.x, r.b - oy), hyp(r.r - ox, r.b - oy)), rad = k * (fr + soft);
        put(r, 'radial-gradient(circle at ' + f1(ox - r.x + .5) + 'px ' + f1(oy - r.y + .5) + 'px,#000 ' + f1(Math.max(0, rad - soft)) + 'px,transparent ' + f1(rad) + 'px)');
      },
      wipe: function (r, k, soft) {
        if (k <= 0) return; if (k >= 1) return put(r, FULL);
        var x = k * (r.w + soft); put(r, 'linear-gradient(90deg,#000 ' + f1(Math.max(0, x - soft)) + 'px,transparent ' + f1(x) + 'px)');
      } };
  }
  function setMask(f, ls, done) {
    if (done) { f.style.visibility = 'visible'; f.style.maskImage = f.style.webkitMaskImage = 'none'; return; }
    if (!ls.length) { f.style.visibility = 'hidden'; return; }
    var im = [], po = [], si = [];
    ls.forEach(function (l) { im.push(l[4]); po.push(f1(l[0]) + 'px ' + f1(l[1]) + 'px'); si.push(f1(l[2]) + 'px ' + f1(l[3]) + 'px'); });
    f.style.visibility = 'visible'; f.style.maskImage = f.style.webkitMaskImage = im.join(','); f.style.maskPosition = f.style.webkitMaskPosition = po.join(','); f.style.maskSize = f.style.webkitMaskSize = si.join(',');
  }
  var LOK = ['side', 'head', 'met', 'map', 'list'];
  function loK(k, t) { return S.lo[k] ? ioC(seg(t, S.lo[k][0], S.lo[k][1])) : 0; }
  function loLayers(t) { var sh = shapes(); LOK.forEach(function (k) { var r = G.R[k]; if (r) sh.grow(r, loK(k, t), r.x + r.w * .12, r.y + r.h * .1, 80); }); return sh.out; }
  function hiLayers(t) {
    var sh = shapes(), g = G, h = S.hi, i;
    if (h.side && g.nav) sh.grow(g.R.side, ioC(seg(t, h.side[0], h.side[1])), g.nav.cx, g.nav.cy, 70);
    sh.grow(g.R.head, ioC(seg(t, h.head[0], h.head[1])), g.h2.x, g.h2.cy, 110);
    for (i = 0; i < g.kp.length; i++) sh.grow(g.box(i ? g.kp[i].cell.x : g.side, g.kTop, i < g.kp.length - 1 ? g.kp[i + 1].cell.x : W, g.bodyTop), ioC(seg(t, h.met + .06 * i, h.met + .06 * i + .5)), g.kp[i].num.cx, g.kp[i].num.cy, 60);
    var mapK = ioC(seg(t, h.map[0], h.map[1]));
    if (mapK < 1) g.order.forEach(function (tl, j) { sh.grow(tl.r, ioC(seg(t, h.tile + .11 * j, h.tile + .11 * j + .45)), tl.sc.cx, tl.sc.cy, 36); });
    sh.grow(g.R.map, mapK, g.dark.r.cx, g.dark.r.cy, 90);
    if (g.R.list) {
      var n = g.rows.length;
      sh.wipe(g.box(g.split, g.bodyTop, W, n ? g.rows[0].r.y : H), ioS(seg(t, h.lhead[0], h.lhead[1])), 80);
      for (i = 0; i < n; i++) sh.wipe(g.box(g.split, g.rows[i].r.y, W, g.rows[i].r.b), ioS(seg(t, h.row + .07 * i, h.row + .07 * i + .45)), 80);
      if (n) sh.wipe(g.box(g.split, g.rows[n - 1].r.b, W, H), ioS(seg(t, h.row + .07 * n, h.row + .07 * n + .45)), 80);
    }
    return sh.out;
  }

  /* ── stage 4: the brush. Wide strokes are the mask of the sky, drawn the way the pencil lines were: each one travels from the
        lower left to the upper right. They are laid in a frame turned 15 degrees, measured from the window's centre at its 924px size:
        [across the strokes, start, end, width]. Together they leave the heading's corner and the bottom left clean ── */
  var BR = [[-15, -780, 900, 140], [-120, -780, 900, 140], [90, -640, 900, 140], [-225, -760, 900, 132], [195, -330, 900, 140], [-330, 330, 900, 140], [285, 0, 900, 110], [360, 270, 900, 100]], brush = [], TOP = 230;
  function buildWorld() {
    var sw = stage.offsetWidth, sh = stage.offsetHeight, vw = document.documentElement.clientWidth, sr = stage.getBoundingClientRect(), Lx = sr.left, small = sw < 700;
    fig.style.setProperty('--sw', sw + 'px'); fig.style.setProperty('--sh', sh + 'px'); fig.style.setProperty('--L', Lx + 'px');
    TOP = small ? 90 : 340; var hgt = sh + (small ? 170 : 470), k = sw / 924, cx = Lx + sw / 2, cy = TOP + sh / 2;
    sky.setAttribute('viewBox', '0 0 ' + vw + ' ' + hgt);
    var m = sky.querySelector('mask'); m.setAttribute('x', 0); m.setAttribute('y', 0); m.setAttribute('width', vw); m.setAttribute('height', hgt);
    var fl = sky.querySelector('filter'); fl.setAttribute('x', f1(cx - 1150 * k)); fl.setAttribute('y', f1(cy - 620 * k)); fl.setAttribute('width', f1(2300 * k)); fl.setAttribute('height', f1(1240 * k));
    skyImg.setAttribute('x', 0); skyImg.setAttribute('y', 0); skyImg.setAttribute('width', vw); skyImg.setAttribute('height', hgt);
    strokesG.setAttribute('transform', 'rotate(-15 ' + f1(cx) + ' ' + f1(cy) + ')');
    strokesG.innerHTML = ''; brush = [];
    BR.forEach(function (b) {
      var v = b[0], u1 = b[1], u2 = b[2];
      if (small) { if (v < -230) return; u1 = Math.max(u1, -640); }      /* a phone: nothing above the window, where the steps are */
      var p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M' + f1(cx + u1 * k) + ' ' + f1(cy + v * k) + 'L' + f1(cx + u2 * k) + ' ' + f1(cy + v * k));
      p.setAttribute('stroke-width', f1(b[3] * k)); p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1.01'; p.style.strokeDashoffset = '1'; strokesG.appendChild(p); brush.push({ el: p, k: -1 });
    });
  }

  /* ── stage 5: a drawn cursor drives the real page. Positions are a function of t; the page answers real pointer events ── */
  var use = { on: false, clicked: false, x: 0, y: 0, tile: null, par: null };
  function hiDoc() { return hi.contentDocument; }
  function fire(type, x, y) {
    var d = hiDoc(), el = d.elementFromPoint(x, y); if (!el) return null;
    el.dispatchEvent(new hi.contentWindow.PointerEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'mouse', view: hi.contentWindow }));
    return el;
  }
  function useReset() {
    if (!use.on) return; use.on = false; use.clicked = false; use.left = false;
    try { hi.contentWindow.hearTopics.close(); hiDoc().getElementById('tp').dispatchEvent(new hi.contentWindow.PointerEvent('pointerleave')); hi.contentWindow.hearTopics.hot(-1, -1, 'force'); } catch (e) {}
    setTimeout(function () { if (!use.on) later(); }, 420);
  }
  function useAt(t) {
    var v = t - S.u, g = G;
    if (v < 0 || !g.dark) { useReset(); ptr.style.opacity = 0; return; }
    if (t >= T && !use.on) { ptr.style.opacity = 0; return; }      /* jumped to the end without playing: nothing was asked */
    var tl = g.tiles.filter(function (x) { return x === g.dark; })[0], tr = R(tl.el);
    var p0 = g.col2 ? { x: g.col2.cx - 40, y: g.body.y + 70 } : { x: W * .72, y: H * .34 }, p1 = { x: tr.r - 30, y: tr.y + tr.h * .34 }, p2 = p1;
    var ps = [].slice.call(tl.el.querySelectorAll('.tp-p')), low = null;
    ps.forEach(function (b) { var n = +b.querySelector('em').textContent; if (low === null || n < low.n) low = { n: n, el: b }; });
    var canAsk = tier !== 'p' && low && tl.open;
    if (canAsk && v > .9) { var pr = R(low.el); if (pr.w > 4) p2 = { x: pr.cx + pr.w * .18, y: pr.cy + pr.h * .2 }; }
    var a = ioC(seg(v, .1, .75)), b = canAsk ? ioC(seg(v, 1.3, 1.75)) : 0;
    var x = p0.x + (p1.x - p0.x) * a, y = p0.y + (p1.y - p0.y) * a - Math.sin(Math.PI * a) * 26;
    x += (p2.x - p1.x) * b; y += (p2.y - p1.y) * b;
    var end = T - S.u, alpha = seg(v, 0, .2) * (1 - seg(v, end - .35, end - .05));
    ptr.style.opacity = alpha.toFixed(3); ptr.style.transform = 'translate(' + f1((x - 3) * s) + 'px,' + f1((y - 3) * s) + 'px)';
    if (v > end - .3) {      /* the drawn cursor goes: leave the hover, so the page is not left dimmed; what was asked stays open */
      if (!use.left) { use.left = true; try { hiDoc().getElementById('tp').dispatchEvent(new hi.contentWindow.PointerEvent('pointerleave')); } catch (e) {} }
      return;
    }
    use.left = false;
    var nowT = performance.now();
    if (!use.on || Math.abs(x - use.x) + Math.abs(y - use.y) > .4 || nowT - (use.at || 0) > 140) { use.on = true; use.x = x; use.y = y; use.at = nowT; try { fire('pointermove', x, y); } catch (e) {} }
    var tc = 2.05;
    ptr.classList.toggle('down', canAsk && v >= tc - .02 && v < tc + .16);
    if (canAsk && v >= tc && !use.clicked) { use.clicked = true; try { low.el.dispatchEvent(new hi.contentWindow.MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y, view: hi.contentWindow })); } catch (e) {} }
    if (v < tc - .05 && use.clicked) { use.clicked = false; try { hi.contentWindow.hearTopics.close(); } catch (e) {} }
  }

  /* ── drawing the block at time t ── */
  var pen = { x: 0, y: 0, r: 0, set: false };
  function drawSketch(t, snap) {
    var g = G, w = g.ww, h = g.wh, i;
    if (t >= S.loDone + .1) { sk.style.display = 'none'; pencil.style.opacity = 0; return; }
    sk.style.display = '';
    var fo = t < 0 ? 1 - seg(t, REST + .08, -.1) : 1, act = null;
    for (i = 0; i < parts.length; i++) {
      var p = parts[i], k = t < 0 ? 1 : seg(t, p.t0, p.t1);
      if (k !== p.k) { p.k = k; p.el.style.strokeDashoffset = (1.01 * (1 - k)).toFixed(4); }
      if (t >= 0 && k > 0 && k < 1) act = p;
    }
    var pk = ioC(seg(t, S.paper[0], S.paper[1]));
    g.groups.forEach(function (gr, j) {
      var o = j === 0 ? 1 - seg(pk, .1, .8) : 1 - seg(loK(LOK[j - 1], t), .12, .7);
      gr.g.style.opacity = o.toFixed(3); gr.f.style.opacity = t < 0 ? fo.toFixed(3) : 1;
    });
    /* the pencil: lying on the sheet at rest, at the tip of the stroke while it draws, lifted away when the drawing is done */
    var ox = win.offsetLeft, oy = win.offsetTop, tx, ty, tr, al = 1;
    if (t < 0) { tx = ox + w * .57; ty = oy + h + 17; tr = -5; }
    else if (act) { var pt = act.el.getPointAtLength(act.el.getTotalLength() * act.k); tx = ox + pt.x; ty = oy + pt.y; tr = -52 + (pt.x / w - .5) * 16; }
    else { tx = pen.x; ty = pen.y; tr = pen.r; }
    var lift = seg(t, B[1] - .08, B[1] + .3); al = 1 - lift;
    if (!pen.set || snap || t < 0) { pen.x = tx; pen.y = ty; pen.r = tr; pen.set = true; } else { pen.x += (tx - pen.x) * .42; pen.y += (ty - pen.y) * .42; pen.r += (tr - pen.r) * .2; }
    pencil.style.opacity = al.toFixed(3);
    pencil.style.transform = 'translate(' + f1(pen.x - 4 + lift * 30) + 'px,' + f1(pen.y - 12 - lift * 26) + 'px) rotate(' + f1(pen.r) + 'deg) scale(' + (tier === 'p' ? .6 : tier === 's' ? .8 : 1) + ')';
  }
  var amb = 0, sp = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, p: 0, vp: 0, held: false };
  function drawWorld(t) {
    var u = t - S.w, i;
    for (i = 0; i < brush.length; i++) { var k = ioS(seg(u, .1 * i, .1 * i + .8)); if (k !== brush[i].k) { brush[i].k = k; brush[i].el.style.strokeDashoffset = (1.01 * (1 - k)).toFixed(4); } }
    far.style.visibility = u > 0 ? 'visible' : 'hidden';
    var dr = Math.sin(amb * .11), dr2 = Math.sin(amb * .083 + 1.7), part = sp.p * 9;
    var put = function (e, k, x, y, extra) { e.style.opacity = clamp(k).toFixed(3); e.style.transform = 'translate(' + f1(x) + 'px,' + f1(y) + 'px)' + (extra || ''); };
    var a = outC(seg(u, .55, 1.35)); put(art.city, a * 1.6, -part * .6, (1 - a) * 34);                       /* the city rises */
    a = outC(seg(u, .85, 1.5)); put(art.hyd, a * 1.6, -part, (1 - a) * 18, ' scale(' + (.94 + .06 * a).toFixed(3) + ')');      /* flowers settle in front of it */
    a = outC(seg(u, .9, 1.65)); put(art.front, a * 1.5, (1 - a) * 54 + dr2 * 8 + part, dr * 2);              /* one cloud arrives in front of the corner */
    a = seg(u, .75, 1.75); var sway = Math.pow(1 - a, 2) * Math.cos(a * 9) * 5 + Math.sin(amb * .5) * .45;       /* the wisteria hangs in and settles once */
    put(art.wist, seg(u, .75, 1.15), part * .5, -(1 - outC(a)) * 22, ' rotate(' + sway.toFixed(2) + 'deg)');
    skyImg.style.transform = 'translate(' + f1(dr * 5) + 'px,0)';
    sun.style.opacity = seg(u, 1.0, 1.6).toFixed(3);
    glow.style.opacity = (.3 * ioS(seg(u, .2, 1.4))).toFixed(3);
    far.style.transform = 'translate(' + f1(sp.x * -6) + 'px,' + f1(sp.y * -4) + 'px)';
    mid.style.transform = 'translate(' + f1(sp.x * -13) + 'px,' + f1(sp.y * -8) + 'px)';
    near.style.transform = 'translate(' + f1(sp.x * -26) + 'px,' + f1(sp.y * -14) + 'px)';
    try { var st = hiDoc().getElementById('stage'); st.style.setProperty('--tx', sp.x.toFixed(4)); st.style.setProperty('--ty', sp.y.toFixed(4)); } catch (e) {}
  }
  function drawSteps(t) {
    var cur = 0, i; for (i = 1; i < 5; i++) if (t >= B[i]) cur = i;
    var live = t >= T, si = live ? 5 : cur;
    stepLis.forEach(function (li, j) {
      var k = seg(t, B[j], B[j + 1]);
      li.querySelector('.tp-line i').style.transform = 'scaleX(' + k.toFixed(4) + ')';
      li.classList.toggle('on', j === cur && !live && t > REST); li.classList.toggle('done', k >= 1);
      li.querySelector('button').setAttribute('aria-current', j === cur ? 'step' : 'false');
    });
    says.forEach(function (e, j) {
      var o = j === si ? (j === 0 ? 1 : j === 5 ? seg(t, T - .01, T) : seg(t, B[j], B[j] + .28)) : 0;
      if (j < 4 && j === cur && !live) o *= 1 - seg(t, B[j + 1] - .1, B[j + 1]);
      e.style.opacity = o.toFixed(3); e.style.pointerEvents = o > .5 ? '' : 'none';
    });
    fig.classList.toggle('is-usable', live);
  }
  function render(snap) {
    if (!G || !S) return;
    var t = time;
    drawSteps(t);
    stage.style.setProperty('--win', ioC(seg(t, S.paper[0], S.paper[1])).toFixed(4));
    drawSketch(t, snap);
    setMask(lo, t < B[1] ? [] : loLayers(t), t >= S.loDone);
    setMask(hi, t < B[2] ? [] : hiLayers(t), t >= S.hiDone);
    drawWorld(t);
    useAt(t);
  }

  /* ── one loop: the play clock, the idle drift of the world, and the pointer's spring (following: stiffness 110, damping 21;
        let go: stiffness 15, damping 4.6). The window itself, a thing being read, stays still ── */
  var looping = false, inView = false;
  function loop(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    if (playing) { time = Math.min(stopAt, time + dt); if (time >= stopAt) playing = false; }
    var worldOn = time > S.w && !calm;
    if (worldOn) amb += dt;
    var k = sp.held ? 110 : 15, c = sp.held ? 21 : 4.6, n = Math.max(1, Math.ceil(dt / .008)), h = dt / n, pt = sp.held ? 1 : 0;
    for (var i = 0; i < n; i++) {
      sp.vx += (k * (sp.tx - sp.x) - c * sp.vx) * h; sp.x += sp.vx * h; sp.vy += (k * (sp.ty - sp.y) - c * sp.vy) * h; sp.y += sp.vy * h;
      sp.vp += (40 * (pt - sp.p) - 11 * sp.vp) * h; sp.p += sp.vp * h;
    }
    var moving = sp.held || Math.abs(sp.x) + Math.abs(sp.y) + Math.abs(sp.vx) + Math.abs(sp.vy) + Math.abs(sp.p) > .004;
    render(false);
    if (playing || (inView && (worldOn || moving))) requestAnimationFrame(loop); else looping = false;
  }
  function kick() { if (!looping && G) { looping = true; last = performance.now(); requestAnimationFrame(loop); } }
  if (fine && !calm) {
    fig.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = stage.getBoundingClientRect();
      sp.tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1)); sp.ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
      sp.held = true; kick();
    });
    fig.addEventListener('pointerleave', function () { sp.held = false; sp.tx = sp.ty = 0; kick(); });
  }

  /* ── playing, scrubbing ── */
  function playRange(a, b) { started = true; time = a; stopAt = b; playing = true; pen.set = false; render(true); kick(); }
  function seek(t) { started = true; playing = false; time = Math.max(REST, Math.min(T, t)); render(true); kick(); }
  again.addEventListener('click', function () { if (G) playRange(REST, T); });
  var sd = null, swallow = false;
  function timeAt(x) {
    for (var i = 0; i < 4; i++) { var r = stepLis[i].getBoundingClientRect(); if (x < r.left) return B[i]; if (x <= r.right) return B[i] + (x - r.left) / r.width * (B[i + 1] - B[i]); }
    return B[4];
  }
  stepsEl.addEventListener('pointerdown', function (e) { if (e.button) return; sd = { x: e.clientX, id: e.pointerId, moved: false }; });
  stepsEl.addEventListener('pointermove', function (e) {
    if (!sd || e.pointerId !== sd.id || !G) return;
    if (!sd.moved && Math.abs(e.clientX - sd.x) > 5) { sd.moved = true; try { stepsEl.setPointerCapture(sd.id); } catch (er) {} }
    if (sd.moved) seek(timeAt(e.clientX));
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) { stepsEl.addEventListener(ev, function () { if (sd && sd.moved) { swallow = true; setTimeout(function () { swallow = false; }, 0); } sd = null; }); });
  stepLis.forEach(function (li, i) {
    var b = li.querySelector('button');
    b.addEventListener('click', function () { if (swallow || !G) return; playRange(i ? B[i] : REST, B[i + 1]); });      /* one step, then it holds: the steps are also the way to compare */
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? .25 : e.key === 'ArrowLeft' ? -.25 : 0; if (!d || !G) return;
      e.preventDefault(); seek(Math.min(B[4], time + d));
    });
  });

  /* ── loading ── */
  var wantT = qs.get('t'), wantEnd = wantT === 'end' || calm, auto = qs.get('auto') !== '0' && wantT === null && !calm;
  function onLoad(f, isLo) {
    try {
      var d = f.contentDocument, st = d.createElement('style');
      st.textContent = SHARED + (isLo ? LO_MATCH : ''); d.head.appendChild(st);
      var c = d.documentElement.classList; c.toggle('px-small', tier !== ''); c.toggle('px-phone', tier === 'p'); f.contentWindow.dispatchEvent(new Event('resize'));
    } catch (e) {}
    loaded++;
    if (loaded === 2) {
      Promise.all([lo.contentDocument.fonts.ready, hi.contentDocument.fonts.ready, document.fonts.ready]).then(function () {
        matchWire();
        requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(function () {
          remeasure();
          if (wantEnd) { time = T; started = true; } else if (wantT !== null) { time = Math.max(REST, Math.min(T, +wantT || 0)); started = true; }
          render(true); readyDone(); watch(); kick();
        }, 160); }); });
      });
    }
  }
  [lo, hi].forEach(function (f, i) {
    var done = false, go = function () { if (done) return; try { if (!f.contentWindow.hearTopics) return; } catch (e) { return; } done = true; onLoad(f, i === 0); };
    f.addEventListener('load', go); go();
  });
  function watch() {
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) kick(); }, { rootMargin: '200px' }).observe(fig);
    if (!auto) return;
    new IntersectionObserver(function (es, io) {
      if (es[0].isIntersecting && !started) { io.disconnect(); setTimeout(function () { if (!started) playRange(REST, T); }, 500); }
    }, { threshold: .5 }).observe(stage);
  }
  new ResizeObserver(function () { fit(); }).observe(win);
  fit();

  window.tpProto = { ready: ready, seek: seek, play: playRange, REST: REST, get T() { return T; }, get B() { return B.slice(); }, get S() { return S; }, get G() { return G; }, get t() { return time; }, get parts() { return parts.length; }, get playing() { return playing; } };
})();
