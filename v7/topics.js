/* Topics block prototype: from pencil to a live screen. Each stage adds a medium, and NOTHING CROSS-FADES: every mark has one
   unbroken life, and each change is the change of a material.
     1 Sketch         graphite: the wireframe's real layout drawn on the page by an unseen hand (SVG strokes made from the lo page's DOM)
     2 Wireframe      graphite becomes structure: each stroke tightens onto the real border, each hatching closes into its fill, each
                      scribble flattens into a bar the real words come out of, each hand-written number settles into its numeral
     3 High fidelity  structure takes on colour: the finished page's own elements start in the wireframe's skin and change it, in the
                      order the light reaches them (a bloom from the top left), tiles poured, bars grown, numbers counted
     4 Hear's world   paint: the sky is brushed in behind the window, then the city, flowers, wisteria and a cloud arrive (draft plates)
     5 In use         life: a drawn cursor (a tap ring on a phone) drives the real hi page with real events; then it is the visitor's
   Everything in stages 1 to 4 is a pure function of the time t (play, scrub, jump). Stage 5 follows the same clock but also
   depends on the live page answering.   URL: ?t=seconds | ?t=end   ?auto=0

   ┌─ THE CLOCK ─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │ schedule() lays the durations below end to end: B = [0, b1, b2, b3, b4, T] are the stage boundaries. On the desktop     │
   │ layout they come to about:                                                                                              │
   │   rest      -0.35 .. 0      the sheet with its faint construction lines and the invitation to play                      │
   │   stage 1    0    .. 2.12   S1.DRAW of strokes, six regions overlapping (S.reg), then S1.HOLD                           │
   │   stage 2    2.12 .. 4.1    the sheet turns into the window (S.paper); the regions tighten one after another (S2.REG),  │
   │                             every part at its own p.t0 and locked at p.L; then the wireframe's notes pop on             │
   │   stage 3    4.1  .. 6.3    notes off, the bloom (S3.BLOOM), then numbers, tiles, legend, rows, shadows (S.hi)          │
   │   stage 4    then S4.LEN    unchanged                                                                                   │
   │   stage 5    then S5        unchanged                                                                                   │
   │ What must hold whatever you change: both pages stay registered (the sketch is generated from the lo page's rects, the   │
   │ finished page's wireframe skin from the lo page's computed styles); every frame is a pure function of t; every inline   │
   │ style put on a product page goes through a Driver and is taken back (D2 at S.loDone, D3 at S.hiDone); B and S keep      │
   │ their fields (the steps bar, the captions and stages 4 and 5 read B[1..5], S.loDone, S.hiDone, S.paper, S.w and S.u).   │
   └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ */
(function () {
  'use strict';
  var fig = document.querySelector('.tp-fig');
  if (!fig) return;
  var $ = function (s) { return fig.querySelector(s); };
  var stage = $('.ct-stage'), win = $('.hs-win'), lo = $('.tp-lo'), hi = $('.tp-hi'), sk = $('.tp-sketch'), ptr = $('.tp-ptr'), tap = $('.tp-tap');
  var sheet = $('.tp-sheet'), frameEl = $('.tp-frame'), invite = $('.tp-invite');
  var glow = $('.tp-glow'), far = $('.tp-far'), mid = $('.tp-mid'), near = $('.tp-near'), sky = $('.tp-sky'), skyImg = $('.tp-sky-img'), strokesG = $('.tp-strokes');
  var art = { city: $('.a-city'), back: $('.a-cloud-back'), front: $('.a-cloud-front'), hyd: $('.a-hyd'), wist: $('.a-wisteria') };
  var block = fig.closest('.tp-block'), stepsEl = block.querySelector('.tp-steps'), stepLis = [].slice.call(stepsEl.children), sayEl = block.querySelector('.tp-say'), says = [].slice.call(sayEl.children), again = block.querySelector('.tp-again');
  var qs = new URLSearchParams(location.search);
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var narrow = window.matchMedia('(max-width:899px)');

  /* ══ THE TIME WINDOWS, in seconds ══ (see the note at the top; schedule() lays them on the clock) */
  var REST = -.35;                /* the resting frame, before 0: the sheet, its construction lines, the invitation */
  var S1 = {                      /* stage 1, drawing the sketch */
    DRAW: 2.0,                    /* all the strokes; the six regions share it by how much there is to draw in each */
    OVER: .34,                    /* how far a region's window reaches into the next one's: the hand never waits */
    SPEED: 1500, MIN: .05, MAX: .2,      /* one stroke: pixels a second, and its shortest and longest time */
    LAP: .55,                     /* the next stroke starts when this much of the one before is still to be drawn */
    HOLD: .12 };                  /* the finished drawing, still */
  var S2 = {                      /* stage 2, sketch to wireframe */
    PAPER: .9,                    /* the sheet of paper becoming the window, from the stage's start */
    GROUND: .32,                  /* the paper's colour travelling to the app's grounds */
    GUIDE: .3,                    /* the construction lines taken back */
    REG: [0, .08, .22, .34, .46, .56],     /* when each region starts: frame, sidebar, head, numbers, map, list */
    SPAN: .42, EACH: .04,         /* the parts of a region start within SPAN, EACH apart where there are few */
    TIGHT: .3,                    /* an outline relaxing onto its border */
    CLOSE: .32,                   /* hatching closing into its fill */
    FLAT: .2, SWEEP0: .12, SWEEP: [.14, .3],      /* a scribble flattening into a bar; then the words come out of it, left to right */
    NUM: .26, BLEND: .09,         /* a hand-written number settling; the real numeral taking over */
    TICK: .22, ICON: .2,
    PULSE: .28,                   /* the small spring of a part that has just locked in */
    NOTE: .28, NOTE_EACH: .05,    /* the wireframe's numbered notes pop on, last */
    HOLD: .12 };                  /* the finished wireframe, still */
  var S3 = {                      /* stage 3, wireframe to finished. Times from the stage's start */
    NOTE_OFF: .16, NOTE_EACH: .04,       /* the notes lift off first */
    SEG: [.04, .3],               /* the wireframe's two switches fold away (the finished screen has none) */
    BLOOM: [0, 1.1], SOFT: 260, EASE: 1.5,      /* the light: a soft bloom from the top left (fast at first, then settling), and the width of its edge */
    CARD: [.05, .6],               /* the card's corners round (in both pages at once) */
    GRAY: [.1, .7],             /* colour comes back to the sidebar */
    SKIN: .34, SKIN_LAG: .03,     /* a button or pill takes its finished shape, just after the light reaches it */
    KPI: .5, KPI_LAG: .04,        /* a number counts up to its value */
    TILE0: .74, TILE: .42, TILE_EACH: .085, TILE_LAST: .48, LAND: .36,      /* the tiles are poured, in reading order, the darkest last */
    KEY0: 1.02, KEY: .34, KEY_EACH: .03,  /* the legend slides to its finished measure */
    ROW0: .96, ROW_EACH: .07, BARS: .3, BAR: .13, POP: .2,      /* the rows: thirty bars grown left to right, then the score lands */
    SHADE: [1.3, 1.85],          /* shadows settle last */
    HOLD: .1 };                   /* the finished screen, still */
  var S4 = { LEN: 1.75 };         /* stage 4, Hear's world */
  var S5 = {                      /* stage 5, in use. Times from the stage's start */
    IN: [.1, .25],                /* the cursor appears, at the window's bottom edge */
    MOVE: [.15, .65],             /* up to the darkest topic: it opens to its three scores */
    AIM: [1.15, 1.42],            /* after reading them, down to the lowest of the three */
    CLICK: 1.74,                  /* asks AI about it */
    THINK: .9,                    /* the product's own pause before it answers (1.5 s there), shortened for the scripted click only */
    TAIL: .45,                    /* the answer, read, before the screen is handed over */
    OUT: [.25, .5],               /* after the click the cursor has done its job: it goes */
    NOASK: 2.0,                   /* the stage's length where the topic cannot open (a narrow window) */
    TAP: .7, RING: .32, TAPLEN: 1.8 };      /* a phone: one tap on the first topic, its ring, the stage's length */

  /* ── small maths ── */
  var clamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var seg = function (t, a, b) { return clamp((t - a) / (b - a)); };
  var outC = function (k) { return 1 - Math.pow(1 - k, 3); };
  var ioC = function (k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  var ioS = function (k) { return .5 - Math.cos(Math.PI * k) / 2; };
  var back = function (k, o) { o = o === undefined ? 1.6 : o; var q = k - 1; return k <= 0 ? 0 : k >= 1 ? 1 : 1 + (o + 1) * q * q * q + o * q * q; };      /* arrives, goes a little past, settles */
  var pls = function (u) { return u <= 0 || u >= 1 ? 0 : Math.exp(-4.2 * u) * Math.sin(u * Math.PI * 2) * (1 - u) * 2.1; };      /* a spring's kick: up, a small dip, rest (peak about 1) */
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var f1 = function (v) { return (Math.round(v * 10) / 10).toString(); };
  var f2 = function (v) { return (Math.round(v * 100) / 100).toString(); };
  var hyp = Math.hypot;

  /* ── state ── */
  var W = 1150, H = 664, tier = '', s = 1, lastCw = 0;
  var G = null, S = null, SK = null, B = [0, 2.12, 4.1, 6.3, 8.05, 11.1], T = 11.1;
  var time = REST, playing = false, stopAt = 0, last = 0, started = false, loaded = 0, played = false;
  var readyDone, ready = new Promise(function (r) { readyDone = r; });

  /* The wireframe is given the finished page's measures (card inset, type sizes, five topics, six rows), so every box in one page
     sits exactly on the same box in the other. Only the skin differs. The rest is what this block needs from the product page and
     the page does not have yet: a map that keeps its shape when Ask AI opens, an "Ask AI" that does not wrap, a phone that taps. */
  var SHARED = '.side{box-sizing:border-box!important;padding:22px 14px 20px 18px!important}' +
    '.ask-on .tp .key>span{margin-right:5px!important}.ask-on .tp .key>i{width:18px!important}.ask-on .tp-kpis small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    /* when the panel opens the map gets the larger share of what is left, so the five tiles narrow together and none changes place */
    '.tp-body{transition:grid-template-columns .32s cubic-bezier(.2,.8,.2,1)}.ask-on .tp-body{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)!important}' +
    '.tp-ask header b{flex:none;white-space:nowrap}' +
    /* a name too long for its score (Satisfaction, once the panel has narrowed the tile) ends in an ellipsis, not in a cut letter */
    '.tp-p b{max-width:100%;overflow:hidden;text-overflow:ellipsis}.tp-tile.tight .tp-p{padding-left:8px!important;padding-right:6px!important}' +
    /* the longest topic name is not cut in the list: the 30 days give it 10px, the gaps 10 more (both pages) */
    '.stage:not(.ask-on) .tp-row{grid-template-columns:minmax(0,1fr) 196px 92px!important;gap:13px!important}' +
    '.px-small .side{display:none!important}.px-small .stage{--side:0px!important}' +
    '.px-phone .tp-col:last-child,.px-phone .tp-def p,.px-phone .tp-def .tp-n,.px-phone .top .act,.px-phone .tp-kpis>div:nth-child(n+3),.px-phone .tp-h .tp-n,.px-phone .tp-h .sub,.px-phone .key .tp-n,.px-phone .tp-hint{display:none!important}' +
    '.px-phone .tp-body{grid-template-columns:minmax(0,1fr)!important}.px-phone .tp .card{padding:20px 20px 14px!important}.px-phone .tp .top p{white-space:normal}' +
    /* a phone has no hover: no tooltip; a tapped topic shows its three scores, and they do not open the panel (it has no phone layout) */
    '.px-phone .tp-tip{display:none!important}.px-phone .tp-p{pointer-events:none}.px-phone .tp-p small{display:none!important}' +
    '.px-phone .tp-p b{font-size:11px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}' +
    '.tp.is-swap .card,.tp-map.is-new .tp-tile,.tp-list.is-new .tp-row{animation:none!important}' +
    /* while this block drives a page's elements, frame by frame, nothing of the page's own may ease behind it */
    '.px-drive,.px-drive *{transition:none!important}' +
    /* a number rolling in: the outgoing copy rides one step above the element's own text */
    '.px-roll{position:relative}.px-roll::after{content:attr(data-px);position:absolute;left:0;top:calc(var(--pt,0px) * -1);white-space:nowrap;color:var(--pc);pointer-events:none}';
  var LO_MATCH = '.tp-tip{display:none!important}.lofi .tp .card{inset:14px!important}' +
    '.lofi .tp .top p{font-size:15px!important}' +
    '.lofi .tp-def{margin-top:18px!important;font-size:14.5px!important}' +
    '.lofi .tp .tp-kpis{margin-top:18px!important}.lofi .tp .tp-kpis>div{padding-top:18px!important;padding-bottom:18px!important}' +
    '.lofi .tp .tp-kpis small{font-size:14px!important}.lofi .tp .tp-kpis b{font-size:40px!important}' +
    '.lofi .tp .tp-kpis i{font-size:13.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.lofi .tp-body{margin-top:22px!important;gap:36px!important}' +
    '.lofi .tp-h{height:36px!important;font-size:14.5px!important}.lofi .tp-h>b{font-size:19px!important}' +
    '.lofi .tp .key,.lofi .tp-foot{font-size:13.5px!important;padding-top:13px!important}' +
    '.lofi .tp-row{grid-template-columns:minmax(0,1fr) 196px 92px!important;gap:13px!important}' +
    '.lofi .tp-row .nm{font-size:16.5px!important}.lofi .tp-row .nm small{display:none!important}' +
    '.lofi .tp-row .sc{display:flex;align-items:baseline;justify-content:flex-end;gap:10px}' +
    '.lofi .tp-row .sc small{order:-1;margin:0!important;font-size:13px!important;overflow:visible}' +
    '.lofi .tp-row .sc b{min-width:26px;font-size:23px!important}' +
    '.lofi .tp-bars{gap:4px!important;height:32px!important}.lofi .tp-bars i{flex:1 1 0;min-width:0}' +
    '.lofi .tp-foot .mod{display:none!important}' +
    /* the wireframe was drawn for a wider frame than this one. Its notes and its two switches are set a little tighter so each row
       fits its column (a note that still cannot fit is cut with an ellipsis, never laid over its neighbour), and the note in the
       legend no longer makes that row taller than the finished page's, so the map is the same height in both pages */
    '.lofi .tp .tp-n{min-width:0;font-size:11.5px!important;gap:5px!important;padding-right:8px!important}.lofi .tp .tp-n span{min-width:0;overflow:hidden;text-overflow:ellipsis}' +
    '.lofi .tp-h{gap:7px!important}.lofi .tp-h .tp-n{flex:0 1 auto!important}.lofi .tp-seg button{padding:0 7px!important;font-size:11.5px!important}' +
    '.lofi .tp .key{gap:4px!important}.lofi .tp .key>span{margin-right:2px!important}.lofi .tp .key>i:not(.tp-n){width:14px!important}' +
    '.lofi .tp .key .tp-n{flex:0 1 auto!important;margin-top:-6px!important;margin-bottom:-6px!important}';
  function matchWire() {
    try {
      var L = lo.contentDocument, D = hi.contentDocument;
      var b = L.querySelector('#tp-view button[data-i="0"]'); if (b && !b.classList.contains('on')) b.click();
      var n = [].filter.call(D.querySelectorAll('.tp-row'), function (r) { return !r.hidden; }).length || 6;
      [].forEach.call(L.querySelectorAll('.tp-row'), function (r) { r.hidden = (+r.style.order || 0) >= n; });
    } catch (e) {}
  }
  /* A keyboard goes into the live screen for what the block is about, the five topics and the three scores behind each, and then
     out again. The rest of the product page
     (the sidebar would leave the screen, the head's buttons do nothing here) is taken out of reach, for the pointer too. */
  function tameHi() {
    try {
      var D = hi.contentDocument, st = D.getElementById('stage'), ask = D.querySelector('.tp-ask');
      [D.querySelector('.side'), D.querySelector('.tp .top'), D.querySelector('.tp-def')].forEach(function (e) { if (e) e.inert = true; });
      var gain = D.querySelector('.tp-gain'); if (gain) gain.tabIndex = -1;
      [].forEach.call(D.querySelectorAll('.tp-row'), function (r) { r.tabIndex = -1; });
      var sync = function () { if (ask) ask.inert = !st.classList.contains('ask-on'); };
      new hi.contentWindow.MutationObserver(sync).observe(st, { attributes: true, attributeFilter: ['class'] }); sync();
    } catch (e) {}
  }

  /* ── the frame: both pages drawn at one size, scaled into the window. The desktop size is the smallest the product page lays
        out in full (below 1238 wide it stops drawing itself smaller, so everything in it is larger in the window; 1150 x 664 keeps
        the five topics in their places and the darkest one tall enough to open). 860 without the sidebar, a tall 460 on a phone ── */
  function fit() {
    var cw = win.clientWidth; if (!cw || Math.abs(cw - lastCw) < .5) return; lastCw = cw;
    var t = cw >= 760 ? [1150, 664, ''] : cw >= 560 ? [860, 484, 's'] : [460, 560, 'p'];
    W = t[0]; H = t[1]; tier = t[2];
    [lo, hi].forEach(function (f) {
      f.style.width = W + 'px'; f.style.height = H + 'px';
      try { var c = f.contentDocument.documentElement.classList; c.toggle('px-small', tier !== ''); c.toggle('px-phone', tier === 'p'); f.contentWindow.dispatchEvent(new Event('resize')); } catch (e) {}
    });
    win.style.aspectRatio = (W - 6) + ' / ' + (H - 6); s = cw / (W - 6); fig.style.setProperty('--s', s);
    block.classList.toggle('is-touch', tier === 'p' || !fine); block.classList.toggle('is-plain', tier === 's');      /* which wording the last two lines use */
    if (loaded === 2) later();
  }
  var mT1, mT2;
  function later(hiOnly) { clearTimeout(mT1); clearTimeout(mT2); mT1 = setTimeout(function () { remeasure(hiOnly); }, 90); if (!hiOnly) mT2 = setTimeout(remeasure, 520); }
  /* hiOnly: the live page was put back after stage 5; the drawing, made from the wireframe page, has not changed and is left alone */
  function remeasure(hiOnly) { if (loaded < 2) return; matchWire(); measure(); if (hiOnly !== true || !SK) { buildSketch(); buildSkin(); buildWorld(); } schedule(); if (wantEnd && !started) time = T; render(); }

  /* ── measuring: every region comes from the pages' own DOM (app pixels) ── */
  var mk = function (b) { return { x: b.left, y: b.top, w: b.width, h: b.height, r: b.right, b: b.bottom, cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; };
  var R = function (e) { return mk(e.getBoundingClientRect()); };
  var vis = function (e) { return !!e && !e.hidden && e.getClientRects().length > 0 && e.getBoundingClientRect().width > 0; };
  var TX = function (e) { var g = e.ownerDocument.createRange(); g.selectNodeContents(e); return mk(g.getBoundingClientRect()); };
  function measure() {
    var D = hi.contentDocument;
    if (G && D.getElementById('stage').classList.contains('ask-on')) return;      /* the panel is open: the map is not at its own size */
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

  /* ── colours and shadows, read from the pages' computed styles ── */
  var GRAPH = [39, 40, 43];
  function col(str) { var m = /rgba?\(([^)]+)\)/.exec(str || ''); if (!m) return [0, 0, 0, 0]; var a = m[1].split(/[,\s\/]+/).filter(Boolean).map(Number); return [a[0], a[1], a[2], a.length > 3 ? a[3] : 1]; }
  function rgb(c) { return 'rgb(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ')'; }
  function rgba(c) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (Math.round(c[3] * 1000) / 1000) + ')'; }
  function mixC(a, b, k) { if (a[3] < .004) return [b[0], b[1], b[2], b[3] * k]; if (b[3] < .004) return [a[0], a[1], a[2], a[3] * (1 - k)]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)]; }
  function lum(c) { return (.2126 * c[0] + .7152 * c[1] + .0722 * c[2]) / 255; }
  function shadows(str) {
    if (!str || str === 'none') return [];
    return str.split(/,(?![^(]*\))/).map(function (p) { p = p.trim(); var m = /rgba?\([^)]+\)/.exec(p); return m ? { c: col(m[0]), rest: p.replace(m[0], '').trim(), inset: /inset/.test(p) } : null; }).filter(Boolean);
  }
  /* one shadow list fading out while another fades in: each layer keeps its shape, only its strength changes */
  function shadowMix(a, b, ka, kb) {
    var out = [];
    if (ka > .004) a.forEach(function (x) { out.push(rgba([x.c[0], x.c[1], x.c[2], x.c[3] * ka]) + ' ' + x.rest); });
    if (kb > .004) b.forEach(function (x) { out.push(rgba([x.c[0], x.c[1], x.c[2], x.c[3] * kb]) + ' ' + x.rest); });
    return out.length ? out.join(',') : 'none';
  }
  var clampN = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* ── the driver: every inline style this file puts on an element of a product page goes through one of these, so that all of
        it can be taken back and the page is left exactly as it was ── */
  function Driver() { this.m = new Map(); }
  Driver.prototype.put = function (el, prop, val) {
    var d = this.m.get(el);
    if (!d) { if (val === null) return; this.m.set(el, d = {}); }
    if (d[prop] === val) return;
    if (val === null) { if (prop in d) { el.style.removeProperty(prop); delete d[prop]; } return; }
    d[prop] = val; el.style.setProperty(prop, val);
  };
  Driver.prototype.mask = function (el, val) { this.put(el, '-webkit-mask-image', val); this.put(el, 'mask-image', val); };
  Driver.prototype.clear = function () { this.m.forEach(function (d, el) { for (var p in d) el.style.removeProperty(p); }); this.m.clear(); };
  var D2 = new Driver(), DN = new Driver(), D3 = new Driver();      /* stage 2 on the wireframe page; its notes and switches; stage 3 on the finished page */

  /* ── stage 1, the material: graphite. Every stroke is a path made from the wireframe's own DOM, and every stroke carries two
        shapes: A, as the hand drew it (wobble, overshoot, lean), and B, what it becomes (the true border, the bar of a line of
        text, the centre line of a numeral). Stage 1 draws A along its length; stage 2 moves A to B and the ink with it. ── */
  var NS = 'http://www.w3.org/2000/svg';
  var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }, rr = function (a, b) { return a + (b - a) * rnd(); };
  /* Byrd's numerals as centre lines (thinned from the font itself, in ems from the pen position on the baseline): a hand-written
     number is this line loosened, and it settles back onto it, under the real numeral */
  var GLY = {"0":{a:0.736,s:[[[0.346,-0.662],[0.454,-0.65],[0.504,-0.625],[0.554,-0.579],[0.592,-0.517],[0.608,-0.467],[0.621,-0.375],[0.608,-0.242],[0.592,-0.192],[0.558,-0.133],[0.487,-0.071],[0.429,-0.05],[0.388,-0.046],[0.304,-0.05],[0.263,-0.063],[0.225,-0.083],[0.158,-0.154],[0.125,-0.233],[0.113,-0.304],[0.117,-0.438],[0.154,-0.546],[0.179,-0.579],[0.242,-0.633],[0.287,-0.654],[0.346,-0.662]]]},"1":{a:0.427,s:[[[0.275,-0.588],[0.171,-0.563],[0.125,-0.537],[0.092,-0.529]],[[0.279,-0.588],[0.283,-0.071]]]},"2":{a:0.659,s:[[[0.075,-0.563],[0.1,-0.613],[0.125,-0.629],[0.208,-0.654],[0.267,-0.662],[0.404,-0.658],[0.458,-0.642],[0.512,-0.6],[0.537,-0.533],[0.537,-0.492],[0.521,-0.438],[0.483,-0.4],[0.446,-0.375],[0.237,-0.275],[0.171,-0.225],[0.138,-0.179],[0.121,-0.075],[0.129,-0.063],[0.529,-0.058]]]},"3":{a:0.674,s:[[[0.092,-0.608],[0.1,-0.621],[0.15,-0.642],[0.258,-0.662],[0.388,-0.658],[0.442,-0.646],[0.483,-0.625],[0.525,-0.583],[0.537,-0.512],[0.517,-0.45],[0.492,-0.425],[0.45,-0.408],[0.421,-0.367]],[[0.3,-0.367],[0.421,-0.367]],[[0.421,-0.367],[0.45,-0.329],[0.5,-0.308],[0.521,-0.292],[0.546,-0.254],[0.558,-0.204],[0.554,-0.154],[0.537,-0.117],[0.512,-0.092],[0.438,-0.058],[0.342,-0.046],[0.275,-0.046],[0.154,-0.063],[0.096,-0.083],[0.083,-0.096]]]},"4":{a:0.734,s:[[[0.333,-0.679],[0.313,-0.671],[0.283,-0.646],[0.138,-0.375],[0.117,-0.275],[0.125,-0.267],[0.508,-0.267]],[[0.517,-0.512],[0.512,-0.271]],[[0.517,-0.267],[0.629,-0.267]],[[0.512,-0.263],[0.517,-0.079]]]},"5":{a:0.691,s:[[[0.537,-0.646],[0.154,-0.646],[0.142,-0.596],[0.142,-0.392],[0.154,-0.379],[0.342,-0.383],[0.404,-0.375],[0.467,-0.358],[0.517,-0.333],[0.563,-0.279],[0.571,-0.237],[0.567,-0.163],[0.546,-0.117],[0.504,-0.079],[0.454,-0.058],[0.362,-0.046],[0.254,-0.05],[0.188,-0.063],[0.1,-0.092],[0.079,-0.117]]]},"6":{a:0.725,s:[[[0.613,-0.563],[0.596,-0.6],[0.579,-0.617],[0.512,-0.646],[0.458,-0.658],[0.329,-0.658],[0.258,-0.633],[0.221,-0.608],[0.175,-0.563],[0.133,-0.487],[0.113,-0.396],[0.113,-0.304],[0.125,-0.292]],[[0.129,-0.292],[0.146,-0.308],[0.212,-0.325],[0.271,-0.362],[0.325,-0.379],[0.4,-0.388],[0.463,-0.383],[0.496,-0.375],[0.558,-0.338],[0.579,-0.317],[0.596,-0.283],[0.604,-0.242],[0.6,-0.163],[0.588,-0.133],[0.55,-0.087],[0.496,-0.058],[0.438,-0.046],[0.371,-0.042],[0.267,-0.063],[0.196,-0.113],[0.167,-0.146],[0.142,-0.196],[0.129,-0.287]]]},"7":{a:0.628,s:[[[0.092,-0.646],[0.5,-0.65],[0.508,-0.642]],[[0.508,-0.637],[0.487,-0.537],[0.217,-0.058],[0.204,-0.046],[0.15,-0.025]]]},"8":{a:0.736,s:[[[0.512,-0.375],[0.525,-0.4],[0.571,-0.442],[0.583,-0.463],[0.596,-0.542],[0.575,-0.6],[0.529,-0.637],[0.454,-0.662],[0.317,-0.667],[0.221,-0.646],[0.179,-0.621],[0.146,-0.583],[0.133,-0.525],[0.15,-0.458],[0.192,-0.412],[0.208,-0.404],[0.225,-0.371]],[[0.229,-0.371],[0.508,-0.371]],[[0.225,-0.367],[0.2,-0.333],[0.175,-0.321],[0.142,-0.287],[0.129,-0.267],[0.113,-0.2],[0.121,-0.15],[0.138,-0.121],[0.188,-0.075],[0.225,-0.058],[0.313,-0.042],[0.412,-0.042],[0.492,-0.054],[0.558,-0.083],[0.6,-0.129],[0.617,-0.179],[0.604,-0.263],[0.588,-0.292],[0.525,-0.342],[0.512,-0.367]]]},"9":{a:0.725,s:[[[0.592,-0.417],[0.575,-0.521],[0.546,-0.571],[0.475,-0.633],[0.408,-0.658],[0.333,-0.667],[0.283,-0.662],[0.237,-0.654],[0.188,-0.629],[0.133,-0.575],[0.121,-0.55],[0.113,-0.504],[0.121,-0.433],[0.138,-0.396],[0.175,-0.358],[0.237,-0.329],[0.333,-0.321],[0.417,-0.333],[0.479,-0.358],[0.512,-0.383],[0.579,-0.4],[0.592,-0.412]],[[0.596,-0.412],[0.608,-0.383],[0.596,-0.246],[0.554,-0.154],[0.504,-0.1],[0.479,-0.083],[0.425,-0.058],[0.383,-0.05],[0.313,-0.046],[0.237,-0.054],[0.183,-0.071],[0.133,-0.096],[0.108,-0.142]]]},",":{a:0.23,s:[[[0.117,-0.067],[0.142,-0.037],[0.138,0.054],[0.117,0.092],[0.083,0.1]]]},".":{a:0.23,s:[[[0.112,-0.062],[0.118,-0.06]]]},"+":{a:0.54,s:[[[0.267,-0.467],[0.267,-0.313]],[[0.108,-0.308],[0.263,-0.308]],[[0.271,-0.308],[0.429,-0.308]],[[0.267,-0.304],[0.267,-0.15]]]},"-":{a:0.5,s:[[[0.113,-0.313],[0.379,-0.313]]]},"−":{a:0.54,s:[[[0.108,-0.308],[0.429,-0.308]]]}};
  var G_ASC = .8375, G_CA = 1.194, G_STEM = .124, XH = .54;      /* the baseline within a text rect, the rect's height in ems, a stem's width, the x-height */
  var marks = [], lparts = [], regs = [], notes = [], segsLo = [], clipN = 0, ZS = 1, CP = null;
  var svg = function (n) { return document.createElementNS(NS, n); };
  function P(pts) {      /* a hand's line: through the points, rounded */
    var d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) d += 'Q' + f1(pts[i][0]) + ' ' + f1(pts[i][1]) + ' ' + f1((pts[i][0] + pts[i + 1][0]) / 2) + ' ' + f1((pts[i][1] + pts[i + 1][1]) / 2);
    return d + 'L' + f1(pts[pts.length - 1][0]) + ' ' + f1(pts[pts.length - 1][1]);
  }
  function PL(pts) { var d = '', i; for (i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + f2(pts[i][0]) + ' ' + f2(pts[i][1]); return d; }
  function pathOf(m, e) {
    var d = '', i, j;
    for (i = 0; i < m.subs.length; i++) {
      var A = m.subs[i].A, Bp = m.subs[i].B, pts = A;
      if (e !== 0) { pts = []; for (j = 0; j < A.length; j++) pts.push([A[j][0] + (Bp[j][0] - A[j][0]) * e, A[j][1] + (Bp[j][1] - A[j][1]) * e]); }
      d += m.smooth ? P(pts) : PL(pts);
    }
    return d;
  }
  function ink(subs, o) {
    var el = svg('path'), len = 0;
    subs.forEach(function (sb) { for (var i = 1; i < sb.A.length; i++) len += hyp(sb.A[i][0] - sb.A[i - 1][0], sb.A[i][1] - sb.A[i - 1][1]); if (!sb.B) sb.B = sb.A; });
    var w0 = (o.w || 1.2) * (o.even ? 1 : rr(.88, 1.14)), o0 = Math.min(1, (o.o || .85) * (o.even ? 1 : rr(.76, 1)));
    var m = { el: el, subs: subs, smooth: o.smooth !== false, len: Math.max(4, len), w0: w0, w1: o.w1 === undefined ? w0 : o.w1, o0: o0, o1: o.o1 === undefined ? 1 : o.o1, c1: o.c1 || GRAPH, ph: o.ph === undefined ? 2 : o.ph, on: 1, k: -1, e: 0, ik: '', g: o.g || 0 };
    m.dA = pathOf(m, 0);
    el.setAttribute('d', m.dA); el.setAttribute('pathLength', '1'); el.style.strokeDasharray = '1.03';
    el.setAttribute('stroke-linecap', o.cap || 'round');
    (o.into || regs[CP.r].el).appendChild(el); marks.push(m); CP.marks.push(m); mInk(m, 0, 0, 0, 1);
    return m;
  }
  /* a stroke at a moment: k, how much of it is drawn (0 takes it away); e, how far from A to B */
  function mSet(m, k, e) {
    if (k <= 0) { if (m.on) { m.on = 0; m.el.style.display = 'none'; } return; }
    if (!m.on) { m.on = 1; m.el.style.display = ''; }
    if (m.k !== k) { m.k = k; m.el.style.strokeDashoffset = (1.03 * (1 - k)).toFixed(4); }
    if (e !== undefined && m.e !== e) { m.e = e; m.el.setAttribute('d', e === 0 ? m.dA : pathOf(m, e)); }
  }
  /* its ink: width, colour and strength each on their way from graphite to what the stroke becomes; a, an extra fade */
  function mInk(m, wk, ck, ok, a) {
    var key = wk + '|' + ck + '|' + ok + '|' + a; if (m.ik === key) return; m.ik = key;
    m.el.setAttribute('stroke-width', f2(lerp(m.w0, m.w1, wk)));
    m.el.setAttribute('stroke', ck <= 0 ? '#27282b' : rgb([lerp(GRAPH[0], m.c1[0], ck), lerp(GRAPH[1], m.c1[1], ck), lerp(GRAPH[2], m.c1[2], ck)]));
    m.el.setAttribute('stroke-opacity', (lerp(m.o0, m.o1, ok) * a).toFixed(3));
  }
  function mPath(m, d) { if (m.e !== d) { m.e = d; m.el.setAttribute('d', d); } }

  /* a line ruled by hand from a to b: wobble, a little tilt, overshoot (or a stop short) at both ends. It becomes the straight
     line o.to (the true edge), with nothing past the corners */
  function edge(ax, ay, bx, by, o) {
    o = o || {};
    var dx = bx - ax, dy = by - ay, len = hyp(dx, dy) || 1, ux = dx / len, uy = dy / len, ov = o.over === undefined ? 3 : o.over;
    var a = ov * rr(.1, 1) * (rnd() < .14 ? -.35 : 1), b = ov * rr(.1, 1) * (rnd() < .14 ? -.35 : 1);
    var n = Math.max(2, Math.round(len / 44)), amp = o.amp === undefined ? .7 : o.amp, tilt = (rnd() - .5) * Math.min(2.2, len * .01), p1 = rr(0, 6.3), fq = rr(.7, 1.9), A = [], Bp = [], i, tb = o.to || [ax, ay, bx, by];
    for (i = 0; i <= n; i++) {
      var f = i / n, g = -a / len + f * (1 + (a + b) / len), j = amp * (Math.sin(p1 + f * Math.PI * fq) * .55 + (rnd() - .5) * .9) + tilt * (f - .5) * 2;
      A.push([ax + dx * g - uy * j, ay + dy * g + ux * j]); Bp.push([tb[0] + (tb[2] - tb[0]) * f, tb[1] + (tb[3] - tb[1]) * f]);
    }
    return ink([{ A: A, B: Bp }], o);
  }
  /* a pill or a circle, drawn in one go round: the loop does not quite close; it becomes the true rounded outline */
  function ring(r, rad, o) {
    var pts = [], q, i, x0 = r.x + rad, x1 = r.r - rad, y0 = r.y + rad, y1 = r.b - rad;
    var arc = function (cx, cy, a0) { for (q = 0; q <= 4; q++) { var a = a0 + q * Math.PI / 8; pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); } };
    if (x1 - x0 > 5) pts.push([(x0 + x1) / 2, r.y]);
    arc(x1, y0, -Math.PI / 2); if (y1 - y0 > 5) pts.push([r.r, (y0 + y1) / 2]);
    arc(x1, y1, 0); if (x1 - x0 > 5) pts.push([(x0 + x1) / 2, r.b]);
    arc(x0, y1, Math.PI / 2); if (y1 - y0 > 5) pts.push([r.x, (y0 + y1) / 2]);
    arc(x0, y0, Math.PI); pts.push(pts[0].slice(), pts[1].slice());
    var cx = (r.x + r.r) / 2, cy = (r.y + r.b) / 2, n = pts.length, amp = o.amp === undefined ? .5 : o.amp, grow = rr(.03, .09) * (rnd() < .5 ? -1 : 1), p1 = rr(0, 6.3);
    var A = pts.map(function (p, j) { var f = j / (n - 1), sc = 1 + grow * (f - .4) + Math.sin(p1 + f * 7) * .03; return [cx + (p[0] - cx) * sc + (rnd() - .5) * amp, cy + (p[1] - cy) * sc + (rnd() - .5) * amp]; });
    return ink([{ A: A, B: pts }], o);
  }
  function buildSketch() {
    D2.clear(); DN.clear(); D3.clear(); rollsOff(); FRM = null; paperK = -1;
    var L = lo.contentDocument, LW = lo.contentWindow, st = L.getElementById('stage');
    ZS = (parseFloat(st.style.zoom) || 1) * s; seed = 7; marks = []; lparts = []; notes = []; segsLo = []; clipN = 0;
    var w = win.clientWidth, h = win.clientHeight, rg = L.createRange();
    sk.innerHTML = '';
    regs = [0, 1, 2, 3, 4, 5].map(function () { var e = svg('svg'), df = svg('defs'); e.setAttribute('class', 'tp-sk'); e.setAttribute('viewBox', '0 0 ' + f1(w) + ' ' + f1(h)); e.appendChild(df); sk.appendChild(e); return { el: e, defs: df, parts: [], clean: -1, end: 0 }; });
    var X = function (v) { return (v - 3) * s; };
    var wr = function (b) { return { x: X(b.x), y: X(b.y), w: b.w * s, h: b.h * s, r: X(b.r), b: X(b.b), cx: X(b.cx), cy: X(b.cy) }; };
    var Rw = function (e) { return wr(R(e)); };
    var CS = function (e) { return LW.getComputedStyle(e); };
    var one = function (sel, root) { var e = (root || L).querySelector(sel); return vis(e) ? e : null; };
    var sideEl = one('.side'), grayed = !!sideEl && /grayscale/.test(CS(sideEl).filter);
    var tone = function (c, r) { if (r !== 1 || !grayed) return c; var g = lum(c) * 255; return [g, g, g, c[3]]; };
    var newPart = function (r, at, el) { var p = { r: r, at: at, el: el, marks: [], out: [], par: null, len: S2.TIGHT, t0: 0, L: 0, amp: 0, dirty: 0 }; regs[r].parts.push(p); lparts.push(p); CP = p; return p; };

    /* what an element paints of its own: a fill, and lines (a full outline, or single sides) */
    var decor = function (e, cs, r) {
      var d = { fill: null, lines: '', lc: null, lw: 0, rad: 0, shadow: cs.boxShadow !== 'none', border: 0 }, bg = col(cs.backgroundColor);
      if (bg[3] > .02) d.fill = tone(bg, r);
      shadows(cs.boxShadow).forEach(function (x) {
        if (!x.inset || x.c[3] < .05) return; var n = x.rest.replace('inset', '').trim().split(/\s+/).map(parseFloat);
        if (!n[0] && !n[1] && !n[2] && n[3] > 0) { d.lines = 'trbl'; d.lc = tone(x.c, r); d.lw = n[3]; }
        else if (n[0] < 0 && !n[1] && !n[2]) { d.lines += 'r'; d.lc = tone(x.c, r); d.lw = -n[0]; }
        else if (n[1] > 0 && !n[0] && !n[2]) { d.lines += 't'; d.lc = tone(x.c, r); d.lw = n[1]; }
      });
      ['Top', 'Right', 'Bottom', 'Left'].forEach(function (sd) {
        var bw = parseFloat(cs['border' + sd + 'Width']); if (!(bw > 0) || cs['border' + sd + 'Style'] === 'none') return;
        var c = col(cs['border' + sd + 'Color']); if (c[3] > .02) { d.lines += sd[0].toLowerCase(); d.lc = tone(c, r); d.lw = bw; d.border = 1; }
      });
      d.rad = /%/.test(cs.borderTopLeftRadius) ? 999 : parseFloat(cs.borderTopLeftRadius) || 0;
      return d;
    };
    /* the outline of a box as the hand draws it: four ruled lines that overshoot the corners, or one loop for a pill */
    var outline = function (q, d, o) {
      o = o || {};
      var lw = d.lines ? Math.max(.5, d.lw * ZS) : .9, i = lw / 2, rad = Math.min(d.rad * ZS, q.w / 2, q.h / 2), mn = Math.min(q.w, q.h), c1 = d.lines ? d.lc : d.fill;
      var base = { ph: 0, w: o.w || clampN(.95 + mn * .01, .95, 1.5), o: o.o || .92, over: o.over === undefined ? clampN(mn * .1, .8, 5) : o.over, amp: o.amp === undefined ? clampN(.28 + mn * .005, .3, .85) : o.amp, w1: lw, c1: c1, o1: c1[3] };
      var ln = function (ax, ay, bx, by, to, x) { var oo = {}, kk; for (kk in base) oo[kk] = base[kk]; if (x) for (kk in x) oo[kk] = x[kk]; oo.to = to; return edge(ax, ay, bx, by, oo); };
      if (d.lines && d.lines !== 'trbl') {
        if (/t/.test(d.lines)) ln(q.x, q.y + i, q.r, q.y + i, [q.x, q.y + i, q.r, q.y + i], { over: Math.min(base.over, 3) });
        if (/b/.test(d.lines)) ln(q.x, q.b - i, q.r, q.b - i, [q.x, q.b - i, q.r, q.b - i], { over: Math.min(base.over, 3) });
        if (/l/.test(d.lines)) ln(q.x + i, q.y, q.x + i, q.b, [q.x + i, q.y, q.x + i, q.b], { over: Math.min(base.over, 3) });
        if (/r/.test(d.lines)) ln(q.r - i, q.y, q.r - i, q.b, [q.r - i, q.y, q.r - i, q.b], { over: Math.min(base.over, 3) });
        return;
      }
      if (rad > mn * .3 && mn < 44) { ring({ x: q.x + i, y: q.y + i, r: q.r - i, b: q.b - i }, Math.max(.5, rad - i), base); return; }
      var c = rad * .55, x0 = q.x + i, y0 = q.y + i, x1 = q.r - i, y1 = q.b - i;
      ln(x0, y0, x1, y0, [x0 + c, y0, x1 - c, y0]); ln(x0, y0, x0, y1, [x0, y0 + c, x0, y1 - c]); ln(x0, y1, x1, y1, [x0 + c, y1, x1 - c, y1]); ln(x1, y0, x1, y1, [x1, y0 + c, x1, y1 - c]);
      if (o.dbl) {      /* a large box is gone over twice; the second pass melts into the first as they straighten */
        var x2 = { o: .4, w: base.w * .8, amp: base.amp * 1.5, o1: 0 };
        ln(x0 + rr(-1, 2), y0 + rr(-1.2, 1.2), x1 + rr(-2, 1), y0 + rr(-1.2, 1.2), [x0 + c, y0, x1 - c, y0], x2); ln(x0 + rr(-1.2, 1.2), y1 + rr(-1, 1), x1, y1 + rr(-1.2, 1.2), [x0 + c, y1, x1 - c, y1], x2);
        ln(x0 + rr(-1.2, 1.2), y0, x0 + rr(-1.2, 1.2), y1, [x0, y0 + c, x0, y1 - c], x2);
      }
    };
    /* shading: one quick zigzag, back and forth without lifting, closer the darker the fill; small overshoots past the edge.
       It becomes the fill: the strokes thicken until they close, inside a clip that tightens onto the box */
    var hatch = function (p, q, d) {
      var dk = 1 - lum(d.fill); if (dk < .035) return;
      var lw = d.lines === 'trbl' ? Math.max(.5, d.lw * ZS) : 0, x = q.x + lw, y = q.y + lw, bw = q.w - 2 * lw, bh = q.h - 2 * lw; if (bw < 3 || bh < 3) return;
      var mn = Math.min(bw, bh), sp = Math.min(dk > .5 ? 3.3 : dk > .2 ? 5.8 : dk > .12 ? 8.2 : 12, Math.max(1.7, mn / 3.2)), rad = Math.max(0, Math.min(d.rad * ZS, q.w / 2, q.h / 2) - lw);
      /* its own small svg under the region's strokes, so that its grain can leave as it closes, on its own time */
      var id = 'tpc' + (clipN++), cp = svg('clipPath'), cr = svg('rect'), g = svg('g'), hs = svg('svg'), df = svg('defs'), pd = Math.min(5, mn * .4), m6 = pd + 5;
      hs.setAttribute('class', 'tp-sk'); hs.setAttribute('viewBox', f2(x - m6) + ' ' + f2(y - m6) + ' ' + f2(bw + 2 * m6) + ' ' + f2(bh + 2 * m6)); hs.style.left = f2(x - m6) + 'px'; hs.style.top = f2(y - m6) + 'px'; hs.style.width = f2(bw + 2 * m6) + 'px'; hs.style.height = f2(bh + 2 * m6) + 'px';
      cp.setAttribute('id', id); cp.appendChild(cr); df.appendChild(cp); hs.appendChild(df); g.setAttribute('clip-path', 'url(#' + id + ')'); hs.appendChild(g); sk.insertBefore(hs, regs[p.r].el);
      p.h = { g: g, svg: hs, cr: cr, x: x, y: y, w: bw, h: bh, rx: rad, pad: pd, m: [], on: 1, ck: -1, cl: -1 };
      var run = function (dir, gap, op) {
        var lines = [], c, drift = 0, j;
        for (c = gap * rr(.5, 1); c < bw + bh; c += gap * 1.414 * rr(.68, 1.34)) {
          drift = clampN(drift + rr(-.5, .5) * gap, -gap * .7, gap * .7); var c2 = clampN(c + drift, 1, bw + bh - 1);
          var a = [x + Math.max(0, c - bh), y + Math.min(c, bh)], b = [x + Math.min(c2, bw), y + Math.max(0, c2 - bw)], dx = b[0] - a[0], dy = b[1] - a[1], ln = hyp(dx, dy) || 1, e1 = rr(-.8, 3.2), e2 = rr(-.8, 3.6);
          a = [a[0] - dx / ln * e1, a[1] - dy / ln * e1]; b = [b[0] + dx / ln * e2, b[1] + dy / ln * e2];
          if (dir < 0) { a[0] = 2 * x + bw - a[0]; b[0] = 2 * x + bw - b[0]; }
          lines.push([a, b]);
        }
        for (j = 0; j < lines.length;) {
          var n = Math.round(rr(4, 8)), pts = [], i2; for (i2 = 0; i2 < n && j < lines.length; i2++, j++) { if (j % 2) pts.push(lines[j][1], lines[j][0]); else pts.push(lines[j][0], lines[j][1]); }
          p.h.m.push(ink([{ A: pts }], { into: g, ph: 1, w: rr(.85, 1.15), o: op, w1: gap * 3.4, c1: d.fill, o1: 1 }));
        }
      };
      run(1, sp, .34 + dk * .5); if (dk > .5) run(-1, sp * 1.8, .5);
      hatchAt(p, 0, 1);
    };
    /* one word as the hand writes it when it only means "words here": a run of strokes with the word's own rhythm (as many as it
       has letters, taller where they are tall, below the line where they hang). It becomes a calm bar, as long as the word */
    var scrib = function (x0, x1, base, em, str, o) {
      var xh = em * XH, n = str.length, A = [], i, gapx = Math.min(em * .07, (x1 - x0) * .08); x0 += gapx; x1 -= gapx;
      var ww = x1 - x0, wts = [], tot = 0, drift = rr(-.1, .1) * xh, tilt = rr(-.08, .08) * xh;
      if (ww / n < 2.3) { n = Math.max(1, Math.round(ww / 2.6)); }
      for (i = 0; i < n; i++) { var ch = str[Math.min(str.length - 1, Math.floor(i * str.length / n))], wt = /[iltfjI1.,:;'|·]/.test(ch) ? .55 : /[mwMW]/.test(ch) ? 1.5 : rr(.85, 1.15); wts.push([ch, wt]); tot += wt; }
      var x = x0; A.push([x, base + drift - xh * rr(.25, .8)]);
      for (i = 0; i < n; i++) {
        var c = wts[i][0], step = ww * wts[i][1] / tot, by = base + drift + tilt * (i / n - .5), up = /[A-Zbdfhklt0-9]/.test(c) ? rr(1.25, 1.6) : rr(.75, 1.15), dn = /[gjpqy,]/.test(c) ? rr(.35, .6) : rr(-.12, .12);
        if (/[.·:;'\-–]/.test(c)) up = rr(.15, .45);
        A.push([x + step * rr(.1, .42), by + xh * dn]); A.push([x + step * rr(.58, .98), by - xh * up]); x += step;
      }
      A.push([x1 + rr(-.5, .8), base + drift - xh * rr(0, .45)]);
      var bw = xh * .84, y = base - xh * .5, b0 = x0 - gapx + bw / 2, b1 = Math.max(b0 + .2, x1 + gapx - bw / 2), Bp = A.map(function (q, j) { return [b0 + (b1 - b0) * j / (A.length - 1), y]; });
      var m = ink([{ A: A, B: Bp }], { w: o.w, o: o.o, w1: bw, c1: o.c1, o1: o.o1 }); m.bar = [b0, b1, y, x0, x1, bw]; return m;
    };
    var words = function (p, e, cs, r, clipR) {
      var tw = L.createTreeWalker(e, 4), nd, x0 = 1e9, x1 = -1e9, op = +cs.opacity || 1;
      while ((nd = tw.nextNode())) {
        var pe = nd.parentElement; if (!vis(pe)) continue;
        var pcs = pe === e ? cs : CS(pe), txt = nd.textContent, re = /\S+/g, mt, c = tone(col(pcs.color), r), heavy = +pcs.fontWeight >= 600;
        while ((mt = re.exec(txt))) {
          rg.setStart(nd, mt.index); rg.setEnd(nd, mt.index + mt[0].length); var q = wr(mk0(rg.getBoundingClientRect())); if (q.w < 1 || q.x > clipR - 3) continue;
          var xr = Math.min(q.r, clipR), em = q.h / G_CA, base = q.y + q.h * G_ASC;
          p.words.push(scrib(q.x, xr, base, em, mt[0], { w: clampN(em * .09, .8, 2.3) * (heavy ? 1.3 : 1), o: heavy ? .95 : .82, c1: c, o1: .3 * op * c[3] }));
          x0 = Math.min(x0, q.x); x1 = Math.max(x1, xr); p.em = Math.max(p.em || 0, em);
        }
      }
      return [x0, x1];
    };
    var mk0 = function (b) { return { x: b.left, y: b.top, w: b.width, h: b.height, r: b.right, b: b.bottom, cx: b.left + b.width / 2, cy: b.top + b.height / 2 }; };
    var ampOf = function (q) { var mx = Math.max(q.w, q.h); return mx > 300 ? 0 : clampN(1.5 / (mx / 2), .006, .05); };

    var boxPart = function (r, e, d, par, o) {
      o = o || {}; var q = Rw(e), p = newPart(r, atBox, e); p.par = par; p.d = d; p.keepBg = !!o.keepBg; p.mode = o.mode || 'decor';
      outline(q, d, o); p.out = p.marks.slice();
      if (d.fill && !o.keepBg) hatch(p, q, d);
      p.len = p.h ? S2.CLOSE : S2.TIGHT; p.amp = o.still || (d.lines && d.lines !== 'trbl') ? 0 : ampOf(q);
      return p;
    };
    var textPart = function (r, e, cs, d, par) {
      var q = Rw(e), p = newPart(r, atText, e); p.par = par; p.words = []; p.er = q;
      if (d.lines) { outline(q, d, {}); p.out = p.marks.slice(); p.amp = ampOf(q); }
      var x = words(p, e, cs, r, q.r + .5);
      if (!p.words.length && !p.out.length) { regs[r].parts.pop(); lparts.pop(); return null; }
      p.x0 = p.out.length ? q.x : Math.min(x[0], q.r); p.x1 = p.out.length ? q.r : Math.max(x[1], p.x0 + 1); p.soft = clampN((p.em || 8) * 1.7, 9, 24);
      p.len = Math.max(p.out.length ? S2.TIGHT : 0, S2.SWEEP0 + clampN((p.x1 - p.x0) / 900, S2.SWEEP[0], S2.SWEEP[1]));
      return p;
    };
    /* a small filled thing with a letter in it (the avatar, a count): outline, shading, and its letter fades up inside the fill */
    var badgePart = function (r, e, cs, d, par) {
      var p = boxPart(r, e, d, par, { mode: 'op' }); p.words = []; words(p, e, cs, r, 1e9); p.words.forEach(function (m) { m.c1 = tone(col(cs.color), r); m.o1 = .5; });
      return p;
    };
    /* a number, written by hand: Byrd's own centre lines, loosened (lean, bounce, a wavering line); it settles onto the numeral */
    var numPart = function (r, e, cs, par) {
      var nd = null, i; for (i = 0; i < e.childNodes.length; i++) if (e.childNodes[i].nodeType === 3 && e.childNodes[i].textContent.trim()) { nd = e.childNodes[i]; break; }
      if (!nd) return null;
      var p = newPart(r, atNum, e), str = nd.textContent, c = tone(col(cs.color), r), heavy = +cs.fontWeight >= 600 ? 1.14 : 1; p.par = par;
      for (i = 0; i < str.length; i++) {
        var g = GLY[str[i]]; if (!g) continue;
        rg.setStart(nd, i); rg.setEnd(nd, i + 1); var q = wr(mk0(rg.getBoundingClientRect())); if (q.w < .5) continue;
        var em = q.h / G_CA, base = q.y + q.h * G_ASC, lean = rr(.06, .13), sc = rr(.94, 1.03), jx = rr(-.03, .03), jy = rr(-.045, .03), p1 = rr(0, 6.3), p2 = rr(0, 6.3);
        g.s.forEach(function (stp) {
          var A = [], Bp = [], acc = 0;
          stp.forEach(function (pt, j) {
            if (j) acc += hyp(pt[0] - stp[j - 1][0], pt[1] - stp[j - 1][1]);
            Bp.push([q.x + pt[0] * em, base + pt[1] * em]);
            var nx = Math.sin(p1 + acc * 9) * .022 + Math.sin(p2 + acc * 21) * .008, ny = Math.cos(p2 + acc * 8) * .02;
            A.push([q.x + (g.a / 2 + (pt[0] - g.a / 2) * sc + jx + (-pt[1] - .35) * lean + nx) * em, base + (pt[1] * sc + jy + ny) * em]);
          });
          ink([{ A: A, B: Bp }], { smooth: false, even: 1, w: clampN(em * .07, 1, 2.6), o: .95, w1: G_STEM * heavy * em, c1: c, o1: c[3] });
        });
      }
      p.len = S2.NUM + S2.BLEND * 1.7; p.amp = .035; p.origin = '0 85%';
      return p;
    };
    /* the thirty days of a row: quick ticks, left to right; each becomes its bar */
    var ticksPart = function (r, e, par) {
      var p = newPart(r, atTicks, e); p.par = par; p.ticks = [];
      [].forEach.call(e.querySelectorAll('i'), function (b) {
        if (!vis(b)) return; var q = Rw(b), c = tone(col(CS(b).backgroundColor), r);
        p.ticks.push(ink([{ A: [[q.cx + rr(-.5, .5), q.b + rr(-.4, .9)], [q.cx + rr(-.7, .7), q.y - rr(-.8, 1.6)]], B: [[q.cx, q.b], [q.cx, q.y]] }], { smooth: false, cap: 'butt', w: 1.05, o: .82, w1: q.w, c1: c, o1: c[3] }));
      });
      var ref = e.querySelector('.ref');
      if (vis(ref)) { var q2 = Rw(ref), rc = col(CS(ref).borderTopColor), y = q2.y + .5 * ZS; p.ref = edge(q2.x, y, q2.r, y, { over: 2, amp: .5, w: .8, o: .5, w1: Math.max(.5, parseFloat(CS(ref).borderTopWidth) * ZS), c1: rc, o1: rc[3] * .55, to: [q2.x, y, q2.r, y] }); }      /* the real line is dashed: the pencilled one ends at the same overall strength */
      p.len = S2.TICK + .08;
      return p;
    };
    var iconPart = function (r, e, par) {
      var q = Rw(e); if (q.w < 3 || q.h < 3) return null;
      var p = newPart(r, atIcon, e), i = Math.min(q.w, q.h) * .12; p.par = par;
      ring({ x: q.x + i, y: q.y + i, r: q.r - i, b: q.b - i }, Math.min(q.w, q.h) * .28, { w: .9, o: .72, amp: .6, ph: 2 });
      p.len = S2.ICON; return p;
    };

    /* the walk: every element that paints something gets its strokes, in the order of the page (which is the order a hand
       would take: a box, then what is in it) */
    var SKIP = '.dl,.tp-tip,.tp-ask,.sp,.sub,.tp-hint', NUMS = '.tp-kpis b,.tp-tile .sc b,.tp-row .sc b';
    var hasText = function (e) { for (var i = 0; i < e.childNodes.length; i++) if (e.childNodes[i].nodeType === 3 && e.childNodes[i].textContent.trim()) return true; return false; };
    var walk = function (r, e, par) {
      if (!vis(e) || e.matches(SKIP)) return;
      var tag = e.tagName.toLowerCase(), cs = CS(e);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
      if (e.matches('.tp-n')) { notes.push(e); return; }
      if (tag === 'svg') { iconPart(r, e, par); return; }
      if (e.matches(NUMS)) { numPart(r, e, cs, par); return; }
      if (e.matches('.tp-bars')) { ticksPart(r, e, par); return; }
      var d = decor(e, cs, r);
      if (hasText(e)) { if (d.fill && (lum(d.fill) < .93 || d.rad > 900) && !/^(p|h2|span)$/.test(tag)) badgePart(r, e, cs, d, par); else textPart(r, e, cs, d, par); return; }
      var p = par;
      if (d.fill || d.lines) { var bp = boxPart(r, e, d, par, {}); if (bp.h) p = bp; }
      if (e.matches('.tp-seg')) segsLo.push(e);
      var kids = [].slice.call(e.children);
      if (e.matches('.tp-list')) kids.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      kids.forEach(function (c) { walk(r, c, p); });
    };

    /* 0: the sheet's construction lines (they are there before anything is drawn), the frame, the card */
    var card = one('.tp .card'), kp = one('.tp-kpis'), body = one('.tp-body'), cols = [].filter.call(L.querySelectorAll('.tp-col'), vis), gp = newPart(0, atGuides, null), gl = [];
    if (card) {
      var cq = Rw(card), kq = kp ? Rw(kp) : null, bq = body ? Rw(body) : null, pad = kq ? kq.x : cq.x + 20;
      if (sideEl) gl.push([Rw(sideEl).r, 0, Rw(sideEl).r, h]);
      gl.push([pad, 0, pad, h], [kq ? kq.r : cq.r - 20, 0, kq ? kq.r : cq.r - 20, h]);
      if (kq) gl.push([0, kq.y, w, kq.y], [0, kq.b, w, kq.b]);
      if (bq) gl.push([0, bq.y, w, bq.y]);
      if (cols.length > 1) { var sx = (Rw(cols[0]).r + Rw(cols[1]).x) / 2; gl.push([sx, bq ? bq.y - 14 : 0, sx, h]); }
      gl.forEach(function (g) { edge(g[0], g[1], g[2], g[3], { over: 0, amp: .28, w: .75, o: .27, g: 1, ph: 0 }); });
    }
    var fp = newPart(0, atFrame, null), fo = { ph: 0, over: 4, amp: .8, w: 1.5, o: .9 }, fr = function (a, b, c, d2, to, x) { var oo = {}, kk; for (kk in fo) oo[kk] = fo[kk]; if (x) for (kk in x) oo[kk] = x[kk]; oo.to = to; edge(a, b, c, d2, oo); };
    fr(6, 6, w - 6, 6, [-4, -4, w + 4, -4]); fr(6, 6, 6, h - 6, [-4, -4, -4, h + 4]); fr(6, h - 6, w - 6, h - 6, [-4, h + 4, w + 4, h + 4]); fr(w - 6, 6, w - 6, h - 6, [w + 4, -4, w + 4, h + 4]);
    fr(5, 7.2, w - 8, 5.4, [-4, -4, w + 4, -4], { o: .4, w: 1.1 }); fr(7.4, 5, 5.6, h - 8, [-4, -4, -4, h + 4], { o: .4, w: 1.1 });
    if (card) { var cd = decor(card, CS(card), 0); boxPart(0, card, cd, null, { keepBg: 1, dbl: 1, still: 1, over: 5, w: 1.4 }); }
    /* 1 to 5: the sidebar, the head, the numbers, the map, the list */
    if (sideEl) { var sd = decor(sideEl, CS(sideEl), 1); boxPart(1, sideEl, sd, null, { keepBg: 1, still: 1, w: 1.3 }); [].forEach.call(sideEl.children, function (c) { walk(1, c, null); }); }
    [one('.tp .top'), one('.tp-def')].forEach(function (e) { if (e) walk(2, e, null); });
    if (kp) walk(3, kp, null);
    if (cols[0]) walk(4, cols[0], null);
    if (cols[1]) walk(5, cols[1], null);
    fp.frame = 1; gp.guides = 1;
    SK = { w: w, h: h };
    fig.classList.add('is-ready');
  }

  /* ══ what each kind of part does with the time (stage 2; before its own start a part shows its strokes as drawn) ══ */
  function pulse(p, t) {      /* the smallest spring as a part locks in */
    if (!p.amp) return; var u = (t - p.L) / S2.PULSE;
    if (u > 0 && u < 1) { if (p.origin) D2.put(p.el, 'transform-origin', p.origin); D2.put(p.el, 'transform', 'scale(' + (1 + p.amp * pls(u)).toFixed(4) + ')'); } else { D2.put(p.el, 'transform', null); D2.put(p.el, 'transform-origin', null); }
  }
  function hatchAt(p, k, fade) {
    var h = p.h, j;
    if (k < 0) { if (h.on) { h.on = 0; h.svg.style.display = 'none'; } return; }
    if (!h.on) { h.on = 1; h.svg.style.display = ''; }
    var cl = ioS(seg(k, .12, .6)); if (h.cl !== cl) { h.cl = cl; h.svg.style.setProperty('--clean', cl.toFixed(3)); }
    var pad = h.pad * (1 - ioC(seg(k, .1, .8)));
    if (h.ck !== pad) { h.ck = pad; h.cr.setAttribute('x', f2(h.x - pad)); h.cr.setAttribute('y', f2(h.y - pad)); h.cr.setAttribute('width', f2(h.w + 2 * pad)); h.cr.setAttribute('height', f2(h.h + 2 * pad)); h.cr.setAttribute('rx', f2(h.rx + pad)); }
    if (h.fade !== fade) { h.fade = fade; h.g.setAttribute('opacity', f2(fade)); }
    if (k === 0) return;      /* not started: the strokes are as drawn (stage 1 sets them) */
    /* the strokes pale as they widen, so the box's tone travels one way, from a light hatching to its flat fill */
    var wk = ioC(seg(k, .1, 1)), ck = 1 - Math.pow(1 - seg(k, 0, .5), 2), ok = ioS(seg(k, .1, .7));
    for (j = 0; j < h.m.length; j++) { mSet(h.m[j], 1, 0); mInk(h.m[j], wk, ck, ok, 1); }
  }
  function atGuides(p, t) { for (var j = 0; j < p.marks.length; j++) { var a = B[1] + j * .02; mSet(p.marks[j], 1 - ioC(seg(t, a, a + S2.GUIDE)), 0); } }
  function atFrame(p, t) { var k = seg(t, B[1], B[1] + .5), j; for (j = 0; j < p.marks.length; j++) { if (k >= 1) mSet(p.marks[j], 0); else { mSet(p.marks[j], 1, ioC(k)); mInk(p.marks[j], 0, 0, 0, 1); } } }
  /* a box: its outline relaxes onto the true border (wobble out, overshoot back into the corners, graphite to the border's own
     colour and weight); its hatching closes into the fill; only then does the real element show its own border and fill */
  function atBox(p, t) {
    var k = seg(t, p.t0, p.t0 + S2.TIGHT), e = back(k), i = ioC(k), on = t >= p.L, el = p.el, j, m, op = p.mode === 'op';
    var fade = op ? 1 - seg(t, p.L + .05, p.L + .13) : t >= p.L ? 0 : 1;
    for (j = 0; j < p.out.length; j++) { m = p.out[j]; if (fade <= 0) mSet(m, 0); else { mSet(m, 1, e); mInk(m, i, i, i, fade); } }
    if (p.h) { hatchAt(p, fade <= 0 ? -1 : seg(t, p.t0 + .03, p.L - .01), fade); if (t < p.t0 + .03 && fade > 0) for (j = 0; j < p.h.m.length; j++) { mSet(p.h.m[j], 1, 0); mInk(p.h.m[j], 0, 0, 0, 1); } }
    if (p.words) { var kf = seg(t, p.t0, p.t0 + S2.FLAT); for (j = 0; j < p.words.length; j++) { m = p.words[j]; if (fade <= 0) mSet(m, 0); else { mSet(m, 1, back(kf, 1.1)); mInk(m, back(kf, 2.2), ioS(kf), ioS(kf), fade); } } }
    if (op) D2.put(el, 'opacity', !on ? '0' : t < p.L + .09 ? f2(seg(t, p.L, p.L + .09)) : null);
    else if (!on) { if (p.d.shadow) D2.put(el, 'box-shadow', 'none'); if (p.d.fill && !p.keepBg) D2.put(el, 'background-color', 'transparent'); if (p.d.border) D2.put(el, 'border-color', 'transparent'); }
    else { D2.put(el, 'box-shadow', null); D2.put(el, 'background-color', null); D2.put(el, 'border-color', null); }
    pulse(p, t);
  }
  /* a line of text: each word's scribble flattens into a bar; then the real words come out of the bars from the left, behind a
     soft edge, and the bars are used up as the edge passes */
  function atText(p, t) {
    var kf = seg(t, p.t0, p.t0 + S2.FLAT), ks = seg(t, p.t0 + S2.SWEEP0, p.L), el = p.el, j, m, gone = t >= p.L;
    var F = lerp(p.x0 - p.soft * .3, p.x1 + p.soft * 1.5, ioS(ks)), cut = F - p.soft * .55;
    for (j = 0; j < p.words.length; j++) {
      m = p.words[j]; var b = m.bar, xa = cut + b[5] / 2;
      if (ks >= 1 || xa >= b[1] - .2) mSet(m, 0);
      else if (ks <= 0 || xa <= b[0]) { mSet(m, 1, back(kf, 1.1)); mInk(m, back(kf, 2.2), ioS(kf), ioS(kf), 1); }
      else { mSet(m, 1); mPath(m, 'M' + f1(xa) + ' ' + f1(b[2]) + 'L' + f1(b[1]) + ' ' + f1(b[2])); mInk(m, 1, 1, 1, 1); }
    }
    if (ks <= 0) { D2.put(el, 'opacity', '0'); D2.mask(el, null); }
    else { D2.put(el, 'opacity', null); D2.mask(el, ks < 1 ? 'linear-gradient(90deg,#000 ' + f1((F - p.soft - p.er.x) / p.er.w * 100) + '%,transparent ' + f1((F - p.er.x) / p.er.w * 100) + '%)' : null); }
    if (p.out.length) { var kt = seg(t, p.t0, p.t0 + S2.TIGHT), e = back(kt), i = ioC(kt); for (j = 0; j < p.out.length; j++) { m = p.out[j]; if (gone) mSet(m, 0); else { mSet(m, 1, e); mInk(m, i, i, i, 1); } } }
    pulse(p, t);
  }
  /* a number: the hand's line settles onto the numeral's own centre line and takes its weight and colour; the real numeral comes
     up under it while the two are the same, and the line goes */
  function atNum(p, t) {
    var k = seg(t, p.t0, p.t0 + S2.NUM), e = back(k, 1.3), i = ioS(k), tb = p.t0 + S2.NUM, kin = seg(t, tb, tb + S2.BLEND), kout = seg(t, tb + S2.BLEND * .7, p.L), j;
    for (j = 0; j < p.marks.length; j++) { if (kout >= 1) mSet(p.marks[j], 0); else { mSet(p.marks[j], 1, e); mInk(p.marks[j], i, i, i, 1 - kout); } }
    D2.put(p.el, 'opacity', kin <= 0 ? '0' : kin < 1 ? f2(kin) : null);
    pulse(p, t);
  }
  function atTicks(p, t) {
    var n = p.ticks.length, gone = t >= p.L, j, a, k;
    for (j = 0; j < n; j++) { a = p.t0 + S2.TICK * .55 * j / n; k = seg(t, a, a + S2.TICK * .45); if (gone) mSet(p.ticks[j], 0); else { mSet(p.ticks[j], 1, back(k, 2)); mInk(p.ticks[j], ioS(k), ioS(k), ioS(k), 1); } }
    if (p.ref) { k = seg(t, p.t0, p.t0 + S2.TICK); if (gone) mSet(p.ref, 0); else { mSet(p.ref, 1, back(k)); mInk(p.ref, ioS(k), ioS(k), ioS(k), 1); } }
    D2.put(p.el, 'opacity', t >= p.L ? null : '0');
  }
  /* an icon: its little pencil mark is taken back along its own line while the icon springs up in its place */
  function atIcon(p, t) {
    var k = seg(t, p.t0, p.L), j;
    for (j = 0; j < p.marks.length; j++) { mSet(p.marks[j], 1 - outC(seg(k, 0, .75)), 0); }
    D2.put(p.el, 'opacity', k <= 0 ? '0' : k < 1 ? f2(seg(k, .1, .7)) : null);
    D2.put(p.el, 'transform', k > 0 && k < 1 ? 'scale(' + (.5 + .5 * back(k, 2.6)).toFixed(3) + ')' : null);
  }

  /* ── stage 3, the material: the finished page in the wireframe's skin. For every element that changes, both looks are read
        once from the two pages' computed styles (a: the wireframe's, b: the finished one's); stage 3 moves each from a to b ── */
  var K3 = null;
  function buildSkin() {
    var L = lo.contentDocument, D = hi.contentDocument, LW = lo.contentWindow, HW = hi.contentWindow, hst = D.getElementById('stage');
    if (hst.classList.contains('ask-on')) return;
    var z = parseFloat(hst.style.zoom) || 1;
    var snap = function (e, wn) { var cs = wn.getComputedStyle(e), q = e.getBoundingClientRect(); return { bg: col(cs.backgroundColor), c: col(cs.color), sh: shadows(cs.boxShadow), rad: Math.min(/%/.test(cs.borderTopLeftRadius) ? 999 : parseFloat(cs.borderTopLeftRadius) || 0, q.height / z / 2, q.width / z / 2) }; };
    var pairs = function (sel, rl, rh) { var a = (rl || L).querySelectorAll(sel), b = (rh || D).querySelectorAll(sel), out = [], i; for (i = 0; i < Math.min(a.length, b.length); i++) if (vis(a[i]) && vis(b[i])) out.push([a[i], b[i]]); return out; };
    var k = { skins: [], kpi: [], tiles: [], rows: [], key: [], z: z, ox: W * .02, oy: -H * .02 };
    k.far = hyp(W - k.ox, H - k.oy);
    ['.side .new', '.side .nv.on', '.side .me', '.tp .top .act', '.tp-pick', '.tp-pick i'].forEach(function (sel) {
      pairs(sel).forEach(function (pr) { var q = R(pr[1]); k.skins.push({ el: pr[1], a: snap(pr[0], LW), b: snap(pr[1], HW), x: q.cx, y: q.cy }); });
    });
    pairs('.tp-kpis b').forEach(function (pr) { var q = TX(pr[1]), txt = pr[1].textContent; if (pr[1].children.length) return; k.kpi.push({ el: pr[1], txt: txt, fmt: counter(txt), x: q.r, y: q.cy, h: pr[1].getBoundingClientRect().height / z, a: col(LW.getComputedStyle(pr[0]).color), b: col(HW.getComputedStyle(pr[1]).color) }); });
    pairs('.tp-tile').forEach(function (pr) {
      var tl = pr[0].querySelector('.tb'), th = pr[1].querySelector('.tb'); if (!vis(tl) || !vis(th)) return;
      var q = R(th), sc = th.querySelector('.sc b'), o = { el: th, tile: pr[1], a: snap(tl, LW), b: snap(th, HW), r: q, s: sc ? +sc.textContent : 99, kids: [] };
      ['.nm', '.cl', 'em', '.sc b', '.sc small'].forEach(function (sel) { var a = tl.querySelector(sel), b = th.querySelector(sel); if (!vis(a) || !vis(b)) return; var bq = R(b); o.kids.push({ el: b, a: snap(a, LW), b: snap(b, HW), yc: 1 - (bq.cy - q.y) / q.h, pop: sel === '.sc b', skin: sel === 'em' }); });
      k.tiles.push(o);
    });
    /* reading order, row by row; the darkest (the lowest score) last */
    k.tiles.sort(function (a, b) { return (a.r.y - b.r.y) || (a.r.x - b.r.x); });
    var dark = k.tiles.slice().sort(function (a, b) { return a.s - b.s || b.r.y - a.r.y; })[0];
    if (dark) { k.tiles.splice(k.tiles.indexOf(dark), 1); k.tiles.push(dark); }
    pairs('.tp-row').forEach(function (pr) {
      var o = { y: R(pr[1]).cy, x: R(pr[1]).r, bars: [], sc: pr[1].querySelector('.sc b'), tr: null }, la = pr[0].querySelectorAll('.tp-bars i'), ha = pr[1].querySelectorAll('.tp-bars i'), i;
      for (i = 0; i < Math.min(la.length, ha.length); i++) o.bars.push({ el: ha[i], a: col(LW.getComputedStyle(la[i]).backgroundColor), b: col(HW.getComputedStyle(ha[i]).backgroundColor), rad: parseFloat(HW.getComputedStyle(ha[i]).borderTopLeftRadius) || 0 });
      var sl = pr[0].querySelector('.sc small'), sh = pr[1].querySelector('.sc small'); if (vis(sl) && vis(sh)) o.tr = { el: sh, a: col(LW.getComputedStyle(sl).color), b: col(HW.getComputedStyle(sh).color) };
      k.rows.push(o);
    });
    k.rows.sort(function (a, b) { return a.y - b.y; });
    /* the legend is set tighter in the wireframe (its note needs the room): each piece is held where the wireframe has it */
    var kl = L.querySelector('.tp .key'), kh = D.querySelector('.tp .key');
    if (vis(kl) && vis(kh)) [].forEach.call(kh.children, function (c, i) {
      var a = kl.children[i]; if (!vis(c) || !vis(a)) return; var qa = a.getBoundingClientRect(), qb = c.getBoundingClientRect(), sw = c.tagName === 'I';
      k.key.push({ el: c, dx: (qa.left - qb.left) / z, sx: sw ? qa.width / qb.width : 1, a: sw ? snap(a, LW) : null, b: sw ? snap(c, HW) : null });
    });
    k.side = vis(D.querySelector('.side')) ? D.querySelector('.side') : null;
    var cl = L.querySelector('.tp .card'), ch = D.querySelector('.tp .card'), tp = D.getElementById('tp');
    k.cardL = cl; k.cardH = ch; k.cardA = snap(cl, LW); k.cardB = snap(ch, HW); k.tp = tp; k.tpSh = shadows(HW.getComputedStyle(tp).boxShadow); k.hst = hst;
    K3 = k;
  }
  /* a number that counts up to its own text: the same signs, separators and decimals */
  function counter(str) {
    var m = /^([+\-−]?)([\d,]+)(?:\.(\d+))?$/.exec(str.trim()); if (!m) return function () { return str; };
    var dec = m[3] ? m[3].length : 0, v = parseFloat(m[2].replace(/,/g, '') + (dec ? '.' + m[3] : '')), comma = /,/.test(m[2]);
    var v0 = v >= 1000 ? v * .962 : v >= 20 ? v * .8 : dec ? v * .5 : Math.max(0, v - 3);
    return function (kk) { var x = lerp(v0, v, kk), sx = dec ? x.toFixed(dec) : String(Math.round(x)); if (comma) sx = sx.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return m[1] + sx; };
  }
  function rollsOff() { if (K3) K3.kpi.forEach(function (q) { if (q.on) { q.on = 0; q.el.classList.remove('px-roll'); q.el.removeAttribute('data-px'); if (q.el.textContent !== q.txt) q.el.textContent = q.txt; } }); }
  /* when the light is fully on a point of the finished page (seconds from the stage's start) */
  function lit(x, y) { var k = clamp((hyp(x - K3.ox, y - K3.oy) + S3.SOFT) / (K3.far + S3.SOFT)); return S3.BLOOM[0] + (1 - Math.pow(1 - k, 1 / S3.EASE)) * (S3.BLOOM[1] - S3.BLOOM[0]); }

  /* ── the clock: the durations at the top, laid end to end ── */
  function schedule() {
    var o = {}, i;
    /* stage 1: each region gets a share of the drawing time by how much there is to draw in it, and reaches into the next one's.
       Within a region: outlines first, then shading, then what is written in the boxes */
    var wsum = 0, wg = regs.map(function (rg, r) {
      var list = []; rg.parts.forEach(function (p) { p.marks.forEach(function (m) { if (!m.g) list.push(m); }); });
      list = list.map(function (m, j) { return [m, j]; }).sort(function (a, b) { return (a[0].ph - b[0].ph) || (a[1] - b[1]); }).map(function (x) { return x[0]; });
      var c = 0; list.forEach(function (m) { m.nd = clampN(m.len / S1.SPEED, S1.MIN, S1.MAX); m.u0 = c; c += m.nd * (1 - S1.LAP); });
      rg.list = list; rg.ink = c; return c ? Math.pow(c, .5) : 0;
    });
    var nz = wg.filter(function (v) { return v > 0; }).length, lastR = 0; wg.forEach(function (v, r) { if (v > 0) lastR = r; });
    wg.forEach(function (v, r) { wsum += r === lastR ? v : v * (1 - S1.OVER); });
    var a0 = 0; o.reg = [];
    regs.forEach(function (rg, r) {
      var len = wg[r] ? S1.DRAW * wg[r] / wsum : 0; o.reg.push([a0, a0 + len]);
      rg.list.forEach(function (m) { var d = clampN(m.nd * clampN(Math.sqrt(len / Math.max(.01, rg.ink)) * 1.9, .7, 1.5), S1.MIN, S1.MAX + .06); m.d0 = a0 + Math.max(0, len - d) * (m.u0 / Math.max(.001, rg.ink)); m.d1 = m.d0 + d; });
      a0 += len * (1 - S1.OVER);
    });
    var b1 = S1.DRAW + S1.HOLD;
    /* stage 2: the parts lock in, region after region, in the order they were drawn. Something written on a shaded box waits
       until the box's fill has closed under it */
    o.paper = [b1, b1 + S2.PAPER];
    var end = b1 + .5;
    regs.forEach(function (rg, r) {
      var n = rg.parts.length, span = Math.min(S2.SPAN, n * S2.EACH), kid = 0, lastPar = null; rg.end = b1 + S2.REG[r]; rg.start = b1 + S2.REG[r];
      rg.parts.forEach(function (p, j) {
        p.t0 = b1 + S2.REG[r] + (n > 1 ? span * j / (n - 1) : 0);
        if (p.par) { if (p.par !== lastPar) { lastPar = p.par; kid = 0; } p.t0 = Math.max(p.t0, p.par.L - S2.SWEEP0 * .6 + .025 * kid++); }
        p.L = p.t0 + p.len; rg.end = Math.max(rg.end, p.L); end = Math.max(end, p.L + S2.PULSE * .5);
      });
    });
    o.lo = {}; ['frame', 'side', 'head', 'met', 'map', 'list'].forEach(function (kx, r) { o.lo[kx] = [regs[r].start, regs[r].end]; });
    o.note = end - .3; o.loDone = notes.length ? o.note + (notes.length - 1) * S2.NOTE_EACH + S2.NOTE : end;
    var b2 = o.loDone + S2.HOLD;
    /* stage 3: the Hear look */
    o.hi = { tile: 0, row: 0, end: S3.SHADE[1] };
    if (K3) {
      var nt = K3.tiles.length, nr = K3.rows.length;
      o.hi.tile = S3.TILE0; K3.tiles.forEach(function (tl, j) { tl.t0 = Math.max(S3.TILE0 + j * S3.TILE_EACH, lit(tl.r.cx, tl.r.b) + .02); tl.dur = j === nt - 1 ? S3.TILE_LAST : S3.TILE; o.hi.end = Math.max(o.hi.end, tl.t0 + tl.dur + S3.LAND * .7); });
      K3.rows.forEach(function (rw, j) { rw.t0 = Math.max(S3.ROW0 + j * S3.ROW_EACH, lit(rw.x, rw.y) + .02); o.hi.end = Math.max(o.hi.end, rw.t0 + S3.BARS + S3.BAR + S3.POP); });
      K3.skins.forEach(function (e) { e.t0 = lit(e.x, e.y) + S3.SKIN_LAG; });
      K3.kpi.forEach(function (q) { q.t0 = lit(q.x, q.y) + S3.KPI_LAG; o.hi.end = Math.max(o.hi.end, q.t0 + S3.KPI + .1); });
    }
    o.hiDone = b2 + o.hi.end;
    var b3 = o.hiDone + S3.HOLD;
    /* stage 4: paint */
    o.w = b3; var b4 = b3 + S4.LEN;
    /* stage 5: in use. Where the darkest topic can open, the stage ends a moment after the product has answered */
    o.u = b4; o.ask = tier !== 'p' && !!(G.dark && G.dark.open);
    T = b4 + (tier === 'p' ? S5.TAPLEN : o.ask ? S5.CLICK + S5.THINK + S5.TAIL : S5.NOASK);
    B = [0, b1, b2, b3, b4, T]; S = o;
  }

  /* ══ STAGE 1 · drawing the sketch ══ every stroke has its own window (m.d0 .. m.d1, from schedule) and is drawn along its
     length, fast at first and easing off, as a hand does. Before 0 the sheet holds only its construction lines. */
  function stage1Sketch(t) {
    var i, m, p;
    for (i = 0; i < lparts.length; i++) { p = lparts[i]; if (p.dirty) { p.dirty = 0; p.at(p, -9); } }
    for (i = 0; i < marks.length; i++) {
      m = marks[i]; if (m.g) { mSet(m, 1, 0); continue; }
      var x = seg(t, m.d0, m.d1); mSet(m, x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 2.3), 0); mInk(m, 0, 0, 0, 1);
    }
    for (i = 0; i < regs.length; i++) cleanAt(regs[i], 0);
  }
  function cleanAt(rg, v) { if (rg.clean !== v) { rg.clean = v; rg.el.style.setProperty('--clean', v.toFixed(3)); } }

  /* ══ STAGE 2 · sketch to wireframe ══ the sheet turns into the window (its corners, edge and shadow travel; its colour travels
     to the app's grounds as the wireframe page comes up bare under the drawing); then every part of the drawing becomes its part
     of the page (see atBox, atText, atNum, atTicks, atIcon) and the page's own element takes over under a stroke that already
     lies exactly on it. The graphite's grain leaves each region as its parts lock in. Last, the wireframe's notes pop on. */
  var FRM = null, paperK = -1, inLo = null;
  function paperAt(t) {
    var k = ioC(seg(t, S.paper[0], S.paper[1])); if (k === paperK && (k <= 0 || k >= 1)) return; paperK = k;
    if (!FRM) { var cs = getComputedStyle(frameEl); sheet.style.borderRadius = sheet.style.backgroundColor = sheet.style.boxShadow = ''; FRM = { rad: parseFloat(cs.borderTopLeftRadius) || 24, sh: shadows(cs.boxShadow), sh0: shadows(getComputedStyle(sheet).boxShadow), r0: parseFloat(getComputedStyle(sheet).borderTopLeftRadius) || 3 }; }
    stage.style.setProperty('--win', k.toFixed(4));
    sheet.style.borderRadius = f1(lerp(FRM.r0, FRM.rad, k)) + 'px';
    var kc = ioS(seg(t, S.paper[0], S.paper[0] + S2.GROUND + .1)); sheet.style.backgroundColor = rgb([lerp(249, 255, kc), lerp(247, 255, kc), lerp(242, 255, kc)]);
    sheet.style.boxShadow = shadowMix(FRM.sh0, FRM.sh, 1 - k, k);
  }
  function notesAt(t) {
    notes.forEach(function (n, i) {
      var a = S.note + i * S2.NOTE_EACH, k = seg(t, a, a + S2.NOTE), off = B[2] + i * S3.NOTE_EACH, ko = seg(t, off, off + S3.NOTE_OFF);
      DN.put(n, 'transform-origin', '9px 50%');
      if (ko > 0) { DN.put(n, 'opacity', f2(1 - ioS(ko))); DN.put(n, 'transform', 'scale(' + (1 - .32 * ko * ko).toFixed(3) + ')'); }
      else if (k >= 1) { DN.put(n, 'opacity', null); DN.put(n, 'transform', null); }
      else { DN.put(n, 'opacity', f2(seg(k, 0, .35))); DN.put(n, 'transform', 'scale(' + (.55 + .45 * back(k, 2.8)).toFixed(3) + ')'); }
    });
    /* the two switches of the wireframe have no place in the finished screen: they fold away to the right before the light comes */
    var ks = seg(t, B[2] + S3.SEG[0], B[2] + S3.SEG[1]);
    segsLo.forEach(function (e) { if (ks <= 0) { DN.put(e, 'clip-path', null); DN.put(e, 'opacity', null); } else { DN.put(e, 'clip-path', 'inset(0 0 0 ' + f1(ioC(ks) * 100) + '%)'); DN.put(e, 'opacity', f2(1 - ks * ks)); } });
  }
  function stage2Wireframe(t, sketchOn) {
    paperAt(t);
    var on = t >= B[1] && t < S.hiDone, i;
    if (on !== inLo) { inLo = on; lo.style.visibility = on ? 'visible' : 'hidden'; }
    if (!on) { D2.clear(); DN.clear(); return; }
    var gk = ioS(seg(t, B[1] + .02, B[1] + S2.GROUND)); lo.style.opacity = gk >= 1 ? '' : gk.toFixed(3);
    if (t < S.loDone) {
      for (i = 0; i < lparts.length; i++) { lparts[i].dirty = 1; lparts[i].at(lparts[i], t); }
      for (i = 0; i < regs.length; i++) cleanAt(regs[i], ioS(seg(t, regs[i].start + .02, regs[i].start + .27)));
    } else D2.clear();
    notesAt(t);
  }

  /* ══ STAGE 3 · wireframe to finished ══ the finished page lies over the wireframe, every changing element of it dressed as the
     wireframe (so nothing shows where the two meet), and the light arrives: a soft bloom from the top left brings the blue
     ground, the glass and the colour of the type. Just behind the light each thing changes its own material, in reading order:
     buttons round, the numbers roll in counting up, each tile is poured from the bottom (its score pops as the blue passes it),
     the darkest last and landing harder; the legend slides to its measure; each row's bars grow left to right and its score
     lands; shadows settle last. Everything is put back at S.hiDone. */
  var d3on = false, SKIN_P = ['border-radius', 'box-shadow', 'background-color', 'color'];
  function skinAt(el, a, b, k, kr) {
    if (k >= 1) { SKIN_P.forEach(function (pp) { D3.put(el, pp, null); }); return; }
    D3.put(el, 'border-radius', f2(Math.max(0, lerp(a.rad, b.rad, kr))) + 'px');
    D3.put(el, 'box-shadow', shadowMix(a.sh, b.sh, 1 - k, k));
    D3.put(el, 'background-color', rgba(mixC(a.bg, b.bg, k)));
    D3.put(el, 'color', rgba(mixC(a.c, b.c, k)));
  }
  function stage3Finished(t) {
    var on = t >= B[2] && t < S.hiDone && !!K3;
    if (!on) {
      if (d3on) { d3on = false; D3.clear(); rollsOff(); K3.hst.classList.remove('px-drive'); }
      hi.style.visibility = t >= S.hiDone ? 'visible' : 'hidden'; hi.style.maskImage = hi.style.webkitMaskImage = 'none';
      return;
    }
    if (!d3on) { d3on = true; K3.hst.classList.add('px-drive'); }
    var u = t - B[2], k3 = K3, i, k;
    /* the light */
    var Rb = (1 - Math.pow(1 - seg(u, S3.BLOOM[0], S3.BLOOM[1]), S3.EASE)) * (k3.far + S3.SOFT), sf = S3.SOFT, px = function (v) { return f1(Math.max(0, v)) + 'px'; };
    hi.style.visibility = 'visible';
    hi.style.maskImage = hi.style.webkitMaskImage = Rb >= k3.far + sf ? 'none' : 'radial-gradient(circle at ' + f1(k3.ox) + 'px ' + f1(k3.oy) + 'px,#000 ' + px(Rb - sf) + ',rgba(0,0,0,.8) ' + px(Rb - sf * .66) + ',rgba(0,0,0,.34) ' + px(Rb - sf * .3) + ',transparent ' + px(Rb) + ')';
    /* the card's corners, in both pages at once; colour back into the sidebar */
    k = seg(u, S3.CARD[0], S3.CARD[1]);
    var cr = f2(lerp(k3.cardA.rad, k3.cardB.rad, back(k, 1.2))) + 'px'; D3.put(k3.cardH, 'border-radius', k >= 1 ? null : cr); DN.put(k3.cardL, 'border-radius', cr);
    if (k3.side) { k = seg(u, S3.GRAY[0], S3.GRAY[1]); D3.put(k3.side, 'filter', k >= 1 ? null : 'grayscale(' + f2(1 - ioS(k)) + ')'); }
    /* buttons and pills */
    k3.skins.forEach(function (e) { var kk = seg(u, e.t0, e.t0 + S3.SKIN); skinAt(e.el, e.a, e.b, ioS(kk), back(kk, 2)); });
    /* the numbers: the wireframe's numeral rolls up and away, the finished one rolls in from below, counting up to its value,
       and settles a touch past its line */
    k3.kpi.forEach(function (q) {
      var kk = seg(u, q.t0, q.t0 + S3.KPI), el = q.el;
      if (kk <= 0 || kk >= 1) { if (q.on) { q.on = 0; el.classList.remove('px-roll'); el.removeAttribute('data-px'); if (el.textContent !== q.txt) el.textContent = q.txt; } D3.put(el, 'transform', null); D3.put(el, 'color', null); D3.put(el, '--pc', null); D3.put(el, '--pt', null); return; }
      if (!q.on) { q.on = 1; el.setAttribute('data-px', q.txt); el.classList.add('px-roll'); }
      /* the element's own text is the one coming in: it rises the last third of a line into place; the copy going out sits
         above it by (--pt) the distance that makes it start exactly where the numeral was, and has gone before the new one is up */
      var up = q.h * .3, rise = q.h * .36, yo = -up * ioS(seg(kk, 0, .42)), yi = (1 - back(seg(kk, .26, 1), 1.9)) * rise, tx = q.fmt(outC(seg(kk, .26, .9)));
      if (el.textContent !== tx) el.textContent = tx;
      D3.put(el, '--pt', f2(yi - yo) + 'px'); D3.put(el, 'transform', 'translateY(' + f2(yi) + 'px)');
      D3.put(el, 'color', rgba([q.b[0], q.b[1], q.b[2], q.b[3] * ioS(seg(kk, .28, .62))])); D3.put(el, '--pc', rgba([q.a[0], q.a[1], q.a[2], q.a[3] * (1 - ioS(seg(kk, .04, .4)))]));
    });
    /* the tiles: each simply appears in its colour, one after another (owner, 23.11: no colour poured down the tile) */
    var nt = k3.tiles.length;
    k3.tiles.forEach(function (tl, j) {
      var kk = seg(u, tl.t0, tl.t0 + tl.dur), el = tl.el, e = ioS(kk);
      D3.put(el, 'background-image', null);
      if (kk >= 1) SKIN_P.forEach(function (pp) { D3.put(el, pp, null); });
      else { D3.put(el, 'background-color', rgba(mixC(tl.a.bg, tl.b.bg, e))); D3.put(el, 'border-radius', f2(lerp(tl.a.rad, tl.b.rad, e)) + 'px'); D3.put(el, 'box-shadow', shadowMix(tl.a.sh, tl.b.sh, 1 - seg(kk, .05, .75), seg(kk, .6, 1))); }
      tl.kids.forEach(function (kd) {
        var kc = kk >= 1 ? 1 : e;
        if (kd.skin) skinAt(kd.el, kd.a, kd.b, kc, kc); else D3.put(kd.el, 'color', kc >= 1 ? null : rgba(mixC(kd.a.c, kd.b.c, kc)));
        if (kd.pop) { D3.put(kd.el, 'transform-origin', null); D3.put(kd.el, 'transform', null); }
      });
      D3.put(tl.tile, 'transform', null); D3.put(tl.tile, 'z-index', null);
    });
    /* the legend slides out to its finished measure and takes its colours */
    k3.key.forEach(function (e, j) {
      var kk = seg(u, S3.KEY0, S3.KEY0 + S3.KEY), ee = back(kk, 1.3), a = S3.KEY0 + j * S3.KEY_EACH;      /* one movement for the whole row (no piece ever crosses another); the colours follow, left to right */
      if (kk >= 1) { D3.put(e.el, 'transform', null); D3.put(e.el, 'transform-origin', null); }
      else { D3.put(e.el, 'transform-origin', '0 50%'); D3.put(e.el, 'transform', 'translateX(' + f2(e.dx * (1 - ee)) + 'px) scaleX(' + lerp(e.sx, 1, ee).toFixed(4) + ')'); }
      if (e.a) { var kc = ioS(seg(u, a, a + S3.KEY)); skinAt(e.el, e.a, e.b, kc, kc); }
    });
    /* the rows: the bars of each little chart grow from the baseline, left to right; the score lands as the last one finishes */
    k3.rows.forEach(function (rw) {
      var n = rw.bars.length, ts = rw.t0 + S3.BARS + S3.BAR * .6;
      rw.bars.forEach(function (b, j) {
        var tb = rw.t0 + S3.BARS * j / n, kk = seg(u, tb, tb + S3.BAR), pk = pls((u - tb - S3.BAR * .55) / .24), el = b.el;
        if (kk >= 1) { D3.put(el, 'background-color', null); D3.put(el, 'background-image', null); D3.put(el, 'border-radius', null); }
        else { D3.put(el, 'background-color', rgba(b.a)); D3.put(el, 'border-radius', f2(b.rad * kk) + 'px'); D3.put(el, 'background-image', kk > 0 ? 'linear-gradient(0deg,' + rgb(b.b) + ' ' + f1(ioS(kk) * 100) + '%,' + rgb(b.a) + ' ' + f1(ioS(kk) * 100) + '%)' : null); }
        D3.put(el, 'transform-origin', pk ? '50% 100%' : null); D3.put(el, 'transform', pk ? 'scaleY(' + (1 + .2 * pk).toFixed(3) + ')' : null);
      });
      if (rw.sc) { var pp = pls((u - ts) / S3.POP); D3.put(rw.sc, 'transform-origin', pp ? '100% 80%' : null); D3.put(rw.sc, 'transform', pp ? 'scale(' + (1 + .11 * pp).toFixed(4) + ')' : null); }
      if (rw.tr) { k = seg(u, ts - .05, ts + .12); D3.put(rw.tr.el, 'color', k >= 1 ? null : rgba(mixC(rw.tr.a, rw.tr.b, k))); }
    });
    /* shadows settle last: the card's, and the glass's drop shadow (its lit rim came with the light) */
    k = ioS(seg(u, S3.SHADE[0], S3.SHADE[1]));
    D3.put(k3.cardH, 'box-shadow', k >= 1 ? null : shadowMix([], k3.cardB.sh, 0, k));
    D3.put(k3.tp, 'box-shadow', k >= 1 ? null : shadowMix(k3.tpSh.filter(function (x) { return x.inset; }), k3.tpSh.filter(function (x) { return !x.inset; }), 1, k));
  }

  /* ── stage 4: the brush. Wide strokes are the mask of the sky, drawn the way the pencil lines were: each one travels from the
        lower left to the upper right, on a slight bow. They are laid in a frame turned 15 degrees, measured from the window's centre
        at a 924px stage: [across the strokes, start, end, width, bow]. No two neighbours start at the same place, so the sky's
        upper edge is a row of stroke ends, not one ruled line; the heading's corner and the bottom left stay clean ── */
  var BR = [[-15, -840, 900, 140, -30], [-120, -840, 900, 140, -40], [90, -640, 900, 140, -22], [-205, 290, 900, 132, -14], [195, -330, 900, 140, -28], [-310, 350, 900, 140, -20], [285, 0, 900, 110, -16], [360, 270, 900, 100, -34]];
  var brush = [], TOP = 340, cloudIn = 300;
  function buildWorld() {
    var sw = stage.offsetWidth, sh = stage.offsetHeight, vw = document.documentElement.clientWidth, sr = stage.getBoundingClientRect(), Lx = sr.left, small = narrow.matches;
    fig.style.setProperty('--sw', sw + 'px'); fig.style.setProperty('--sh', sh + 'px'); fig.style.setProperty('--L', Lx + 'px');
    TOP = small ? 90 : 340; var hgt = sh + (small ? 360 : 470), k = sw / 924, cx = Lx + sw / 2, cy = TOP + sh / 2, bleed = 16;
    sky.setAttribute('viewBox', '0 0 ' + vw + ' ' + hgt);
    /* the sky runs past both edges of the viewport, so the parallax never shows a bare strip */
    var m = sky.querySelector('mask'); m.setAttribute('x', -bleed); m.setAttribute('y', 0); m.setAttribute('width', vw + 2 * bleed); m.setAttribute('height', hgt);
    var fl = sky.querySelector('filter');
    /* the filter's box is in the strokes' own turned frame: wide enough that no stroke is cut by its edge */
    if (small) { fl.setAttribute('x', f1(cx - 1000)); fl.setAttribute('y', f1(cy - 200)); fl.setAttribute('width', 2000); fl.setAttribute('height', f1(sh + 700)); }
    else { fl.setAttribute('x', f1(cx - 1210 * k)); fl.setAttribute('y', f1(cy - 620 * k)); fl.setAttribute('width', f1(2360 * k)); fl.setAttribute('height', f1(1240 * k)); }
    skyImg.setAttribute('x', -bleed); skyImg.setAttribute('y', 0); skyImg.setAttribute('width', vw + 2 * bleed); skyImg.setAttribute('height', hgt);
    strokesG.setAttribute('transform', 'rotate(-15 ' + f1(cx) + ' ' + f1(cy) + ')');
    strokesG.innerHTML = ''; brush = [];
    /* a phone: nothing above or beside the window; two strokes make one painted band under it */
    var list = small ? [[(sh / 2 + 52) / k, -700 / k, 700 / k, 120 / k, -14], [(sh / 2 + 122) / k, -700 / k, 700 / k, 100 / k, -22]] : BR;
    /* the two strokes above the window start clear of the head, wherever the head ends on this screen (its last thing is the play
       button); the back cloud sits on their ends */
    var headR = again.getBoundingClientRect().right, clear = function (v, wd, gap) { return ((headR + gap - cx) / k - (v - wd / 2) * .2588) / .9659; };
    art.back.style.left = f1(Math.max(Lx + sw * .655, headR + 30)) + 'px';
    art.wist.style.left = small ? '' : f1(Math.max(Lx + sw - 285, vw - 452, headR + 6)) + 'px';      /* the wisteria too hangs clear of the head */
    fig.style.setProperty('--k', Math.max(.8, Math.min(1.06, sw / 952)).toFixed(3));
    list.forEach(function (b, bi) {
      var v = b[0], u1 = b[1], u2 = b[2];
      if (!small && v < -200) u1 = Math.max(u1, clear(v, b[3], v < -300 ? 150 : 90));
      var x1 = cx + u1 * k, x2 = cx + u2 * k, y = cy + v * k;
      var p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M' + f1(x1) + ' ' + f1(y) + 'Q' + f1((x1 + x2) / 2) + ' ' + f1(y + b[4] * k) + ' ' + f1(x2) + ' ' + f1(y));
      p.setAttribute('stroke-width', f1(b[3] * k)); p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1.01'; p.style.strokeDashoffset = '1'; strokesG.appendChild(p); brush.push({ el: p, k: -1 });
    });
    /* the front cloud comes in from beyond the right edge of the viewport, wherever that is */
    cloudIn = Math.max(120, vw - art.front.offsetLeft + 20);
  }

  /* ── stage 5: the real page is used. Positions are a function of t; the page answers real pointer events.
        With a pointer that hovers: a drawn cursor comes in from the window's bottom edge, stops on the darkest topic (it opens to
        its three scores), goes to the lowest of the three and clicks it; Ask AI opens and answers; the cursor leaves.
        On a phone: one tap, shown as a ring, opens the first topic. ── */
  var use = { on: false, clicked: false, left: false, x: 0, y: 0, at: 0, p2: null, tile: null };
  function hiDoc() { return hi.contentDocument; }
  function hiEv(type, x, y, K) { var w = hi.contentWindow; return new (K || w.PointerEvent)(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'mouse', view: w }); }
  function fire(type, x, y) { var el = hiDoc().elementFromPoint(x, y); if (el) el.dispatchEvent(hiEv(type, x, y)); return el; }
  function leave() { try { hiDoc().getElementById('tp').dispatchEvent(new hi.contentWindow.PointerEvent('pointerleave')); } catch (e) {} }
  function useReset() {
    if (!use.on && !use.clicked) return;
    var tl = use.tile; use.on = use.clicked = use.left = false; use.p2 = use.tile = null;
    try {
      if (tl && tl.classList.contains('on')) tl.click();      /* a tapped topic is let go */
      hi.contentWindow.hearTopics.close(); leave(); hi.contentWindow.hearTopics.hot(-1, -1, 'force');
    } catch (e) {}
    setTimeout(function () { if (!use.on && !use.clicked) later(true); }, 420);
  }
  function useAt(t) {
    var v = t - S.u, g = G;
    if (v < 0 || !g.dark) { useReset(); ptr.style.opacity = 0; tap.style.opacity = 0; return; }
    if (t >= T && !use.on && !use.clicked) { ptr.style.opacity = 0; tap.style.opacity = 0; return; }      /* jumped to the end without playing: nothing was asked */
    if (tier === 'p') { ptr.style.opacity = 0; useTap(v); return; }
    tap.style.opacity = 0;
    var tl = g.dark, r = tl.r, canAsk = S.ask, end = T - S.u, tc = S5.CLICK;
    /* the lowest of the three scores behind the topic */
    var low = null; [].forEach.call(tl.el.querySelectorAll('.tp-p'), function (b) { var n = +b.querySelector('em').textContent; if (low === null || n < low.n) low = { n: n, el: b }; });
    canAsk = canAsk && !!low;
    /* in from the bottom edge under the topic, to the right end of its header: the tile opens, the three scores stay readable and
       the product's own tooltip sits beside the tile; then to the lowest score */
    var p0 = { x: Math.min(W - 40, tl.sc.cx + 70), y: H + 14 }, p1 = canAsk ? { x: r.r - 30, y: r.y + 18 } : { x: r.r - 30, y: r.y + r.h * .34 }, p2 = null;
    /* the score is read from the live page: when the panel opens and the map narrows, the cursor stays on what it clicked */
    if (canAsk && v >= S5.AIM[0]) { var pr = R(low.el); p2 = pr.w > 4 ? { x: pr.cx + pr.w * .14, y: pr.cy + pr.h * .16 } : use.p2 || p1; }
    var a = ioC(seg(v, S5.MOVE[0], S5.MOVE[1])), b = p2 ? ioC(seg(v, S5.AIM[0], S5.AIM[1])) : 0;
    var x = p0.x + (p1.x - p0.x) * a, y = p0.y + (p1.y - p0.y) * a - Math.sin(Math.PI * a) * 8;
    if (p2) { x += (p2.x - p1.x) * b; y += (p2.y - p1.y) * b; }
    var out = canAsk ? [tc + S5.OUT[0], tc + S5.OUT[1]] : [end - .35, end - .05];
    ptr.style.opacity = (seg(v, S5.IN[0], S5.IN[1]) * (1 - seg(v, out[0], out[1]))).toFixed(3);
    ptr.style.transform = 'translate(' + f1((x - 3) * s) + 'px,' + f1((y - 3) * s) + 'px)';
    ptr.classList.toggle('down', canAsk && v >= tc - .06 && v < tc + .14);
    if (v < S5.MOVE[1]) { if (use.on || use.clicked) useReset(); return; }      /* not there yet (or scrubbed back): the page is not touched */
    if (v >= out[1]) {      /* the drawn cursor is gone: the hover ends, so the page is not left dimmed; what was asked stays open */
      if (!use.left) { use.left = true; leave(); }
      return;
    }
    use.left = false;
    if (canAsk && v < tc - .05 && use.clicked) { use.clicked = false; use.p2 = null; try { hi.contentWindow.hearTopics.close(); } catch (e) {} }
    /* the page feels the pointer where it rests: on the header while the scores are read, on the score once it has arrived.
       On the way between the two it feels nothing, so the other two scores do not flash; after the click it feels nothing more */
    var resting = v < S5.AIM[0] || (v >= S5.AIM[1] && !use.clicked) || !canAsk, nowT = performance.now();
    if (resting && (!use.on || Math.abs(x - use.x) + Math.abs(y - use.y) > .4 || nowT - use.at > 140)) { use.on = true; use.x = x; use.y = y; use.at = nowT; try { fire('pointermove', x, y); } catch (e) {} }
    if (canAsk && v >= tc && !use.clicked) {
      use.clicked = true; use.on = true; use.p2 = { x: x, y: y };
      var w = hi.contentWindow, st = w.setTimeout;
      try {      /* the product waits 1.5 s before it answers; for this one scripted click it waits S5.THINK */
        w.setTimeout = function (f, d) { return st.call(w, f, d === 1500 ? S5.THINK * 1000 : d); };
        low.el.dispatchEvent(hiEv('click', x, y, w.MouseEvent));
      } catch (e) {} finally { w.setTimeout = st; }
    }
  }
  function useTap(v) {
    var tl = G.tiles.filter(function (x) { return x.open; })[0]; if (!tl) return;
    var k = seg(v, S5.TAP, S5.TAP + S5.RING), d = Math.min(28, .4 * Math.min(tl.r.w, tl.r.h) * s);
    tap.style.width = tap.style.height = f1(d) + 'px'; tap.style.margin = f1(-d / 2) + 'px 0 0 ' + f1(-d / 2) + 'px';
    tap.style.opacity = v >= S5.TAP && k < 1 ? (1 - k * k).toFixed(3) : 0;
    tap.style.transform = 'translate(' + f1((tl.r.cx - 3) * s) + 'px,' + f1((tl.r.cy - 3) * s) + 'px) scale(' + (.6 + .4 * outC(k)).toFixed(3) + ')';
    if (v >= S5.TAP && !use.clicked) { use.clicked = true; use.tile = tl.el; try { if (!tl.el.classList.contains('on')) tl.el.click(); } catch (e) {} }
    if (v < S5.TAP - .05 && use.clicked) useReset();
  }

  /* ── stage 4 at time t: the sky is brushed in, then the painted things arrive whole, one after another along the brush's own
        direction (lower left to upper right): the city, the flowers, the back cloud, the wisteria, the front cloud ── */
  var amb = 0, sp = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, p: 0, vp: 0, held: false };
  function drawWorld(t) {
    var u = t - S.w, i;
    for (i = 0; i < brush.length; i++) { var k = ioS(seg(u, .1 * i, .1 * i + .8)); if (k !== brush[i].k) { brush[i].k = k; brush[i].el.style.strokeDashoffset = (1.01 * (1 - k)).toFixed(4); } }
    far.style.visibility = u > 0 ? 'visible' : 'hidden';
    var part = sp.p * 9;
    var put = function (e, o, x, y, extra) { e.style.opacity = clamp(o).toFixed(3); e.style.transform = 'translate(' + f1(x) + 'px,' + f1(y) + 'px)' + (extra || ''); };
    var a = outC(seg(u, .45, 1.0)), cut = a >= 1 ? 'none' : 'linear-gradient(0deg,#000 ' + f1(a * 115 - 15) + '%,transparent ' + f1(a * 115) + '%)';      /* the city rises: shown from the ground up, never see-through */
    art.city.style.maskImage = art.city.style.webkitMaskImage = cut; put(art.city, u >= .45 ? 1 : 0, -part * .6, (1 - a) * 12);
    a = outC(seg(u, .7, 1.05)); put(art.hyd, seg(u, .7, .82), -part, 0, ' scale(' + (.9 + .1 * a).toFixed(3) + ')');      /* the flowers grow from their base in front of it */
    a = outC(seg(u, .8, 1.3)); put(art.back, seg(u, .8, 1.0), (1 - a) * -26, 0);      /* a cloud settles on the sky's upper edge as the brush passes it */
    a = seg(u, 1.0, 1.6); var sway = 9 * Math.pow(1 - a, 2) * Math.cos(a * 6) + Math.sin(amb * .5) * .45;      /* the wisteria swings in on its hinge and settles once */
    put(art.wist, seg(u, 1.0, 1.12), part * .5, 0, ' rotate(' + sway.toFixed(2) + 'deg)');
    a = outC(seg(u, 1.05, 1.75));      /* last, one cloud drifts in from beyond the right edge, in front of the window's corner */
    put(art.front, seg(u, 1.05, 1.17), (1 - a) * cloudIn + Math.sin(amb * .157) * 20 + part, Math.sin(amb * .11) * 2, ' scaleX(-1)');
    glow.style.opacity = (.3 * ioS(seg(u, .2, 1.4))).toFixed(3);
    far.style.transform = 'translate(' + f1(sp.x * -6) + 'px,' + f1(sp.y * -4) + 'px)';
    mid.style.transform = 'translate(' + f1(sp.x * -13) + 'px,' + f1(sp.y * -8) + 'px)';
    near.style.transform = 'translate(' + f1(sp.x * -26) + 'px,' + f1(sp.y * -14) + 'px)';
    stage.style.setProperty('--rx', sp.x.toFixed(4)); stage.style.setProperty('--ry', sp.y.toFixed(4)); stage.style.setProperty('--glass', ioS(seg(u, .2, 1.2)).toFixed(3));      /* the window leans with the mouse and its glass frame comes with the sky */
    try { var st = hiDoc().getElementById('stage'); st.style.setProperty('--tx', sp.x.toFixed(4)); st.style.setProperty('--ty', sp.y.toFixed(4)); } catch (e) {}
  }

  /* ── the steps and their one line. A frame that is held (a pressed step that has played, an arrow key, a drag, ?t=) belongs to
        the stage just finished: its line is full and blue and its whole sentence shows. While the play runs, only the first words
        of each sentence show, so the eye stays on the screen ── */
  function drawSteps(t) {
    var held = !playing && !pending, cur = 0, i; for (i = 1; i < 5; i++) if (held ? t > B[i] : t >= B[i]) cur = i;
    var live = t >= T, si = live ? 5 : cur;
    stepLis.forEach(function (li, j) {
      var k = seg(t, B[j], B[j + 1]);
      li.querySelector('.tp-line i').style.transform = 'scaleX(' + k.toFixed(4) + ')';
      li.classList.toggle('on', j === cur && !live && t > REST); li.classList.toggle('done', k >= 1);
      li.querySelector('button').setAttribute('aria-current', j === cur && !live ? 'step' : 'false');
    });
    says.forEach(function (e, j) {
      var o = 0;
      if (held) o = j === si ? 1 : 0;
      else if (j === 5) o = cur === 4 && stopAt >= T ? seg(t, T - .3, T) : 0;      /* the hand-over comes in as the answer has landed */
      else if (j === cur) {
        o = j === 0 ? 1 : seg(t, B[j], B[j] + .28);
        if (j < 4 ? stopAt > B[j + 1] : stopAt >= T) o *= 1 - (j < 4 ? seg(t, B[j + 1] - .1, B[j + 1]) : seg(t, T - .45, T - .3));      /* it only leaves when the play goes on */
      }
      e.style.opacity = o.toFixed(3); e.style.pointerEvents = o > .5 ? '' : 'none';
    });
    sayEl.classList.toggle('is-held', held);
    fig.classList.toggle('is-usable', false);      /* owner, 23.11: the screen only plays, the visitor does not drive it */
    /* the live screen can be entered with the keyboard once it is the visitor's; before stage 5 it cannot be reached at all */
    if (hi.tabIndex !== -1) hi.tabIndex = -1;
    var off = t < S.u; if (hi.inert !== off) hi.inert = off;
  }
  function render() {
    if (!G || !S || !SK) return;
    var t = time, sketchOn = t < S.loDone + .05;
    drawSteps(t);
    if (invite) { var iv = played ? 0 : 1 - seg(t, REST, REST + .22); invite.style.opacity = iv.toFixed(3); invite.style.transform = 'translate(-50%,-50%) scale(' + (.92 + .08 * iv).toFixed(3) + ')'; invite.style.visibility = iv > 0 ? 'visible' : 'hidden'; invite.style.pointerEvents = iv >= 1 && !started ? 'auto' : 'none'; if (t > REST + .22) played = true; }
    sk.style.display = sketchOn ? '' : 'none';
    if (sketchOn && t < B[1]) stage1Sketch(t);
    stage2Wireframe(t, sketchOn);
    stage3Finished(t);
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
    render();
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
  var dipping = false, pending = false, dipT = 0;
  function settle() { clearTimeout(dipT); dipping = pending = false; fig.classList.remove('is-dip'); }
  function begun() { if (started) return; started = true; block.classList.add('is-started'); again.setAttribute('aria-label', 'Play again'); }
  function playRange(a, b) { begun(); settle(); time = a; stopAt = b; playing = true; render(); kick(); }
  function seek(t) { begun(); settle(); playing = false; time = Math.max(REST, Math.min(T, t)); render(); kick(); }
  /* Go to a frame that does not follow the one on screen (play again, a step out of order, an arrow key): the figure dips out,
     the frame changes while nothing shows, the figure comes back, and only then the clock starts. Where the live screen had been
     used, it is first given the time to put itself back. With reduced motion a step is shown finished, not played. */
  function go(a, b) {
    if (!G) return;
    if (calm) a = b;
    if (Math.abs(a - time) < .25 && !dipping) { if (a === b) seek(b); else playRange(a, b); return; }
    begun(); clearTimeout(dipT); playing = false; dipping = true; fig.classList.add('is-dip');
    dipT = setTimeout(function () {
      var used = use.on || use.clicked;
      time = a; stopAt = b; pending = a !== b; render();
      dipT = setTimeout(function () {
        fig.classList.remove('is-dip');
        dipT = setTimeout(function () { if (a === b) seek(b); else playRange(a, b); }, 220);
      }, used ? 340 : 0);
    }, 180);
  }
  again.addEventListener('click', function () { go(REST, T); });
  if (invite) invite.addEventListener('click', function () { if (G && !started) playRange(REST, T); });
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
    b.addEventListener('click', function () { if (swallow || !G) return; go(i ? B[i] : REST, B[i + 1]); });      /* one step, then it holds: the steps are also the way to compare */
    /* the arrow keys walk the steps: the neighbour takes the focus and its finished frame is shown; Home and End go to the ends */
    b.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? 4 : -1;
      if (n < 0 || n > 4 || !G) return;
      e.preventDefault(); stepLis[n].querySelector('button').focus(); go(B[n + 1], B[n + 1]);
    });
  });

  /* ── loading ── */
  var wantT = qs.get('t'), wantEnd = wantT === 'end' || calm, auto = qs.get('auto') !== '0' && wantT === null && !calm;
  function onLoad(f, isLo) {
    try {
      var d = f.contentDocument, st = d.createElement('style');
      /* the app's own mouse follow reads the drawn cursor's events and can throw its painted sky hundreds of pixels off, baring the dark page under it:
         the sky never moves further than its spare edge allows */
      st.textContent = SHARED + (isLo ? LO_MATCH : '') + '.bg{translate:calc(clamp(-1,var(--tx,0),1)*-16px) calc(clamp(-1,var(--ty,0),1)*-9px)!important}.tp-tip{display:none!important}'      /* and no black tooltip card over a topic (owner, 23.11) */; d.head.appendChild(st);
      var c = d.documentElement.classList; c.toggle('px-small', tier !== ''); c.toggle('px-phone', tier === 'p'); f.contentWindow.dispatchEvent(new Event('resize'));
      if (isLo) d.getElementById('stage').classList.add('px-drive');
    } catch (e) {}
    if (!isLo) tameHi();
    loaded++;
    if (loaded === 2) {
      Promise.all([lo.contentDocument.fonts.ready, hi.contentDocument.fonts.ready, document.fonts.ready]).then(function () {
        matchWire();
        requestAnimationFrame(function () { requestAnimationFrame(function () { setTimeout(function () {
          remeasure();
          if (wantEnd) { time = T; begun(); } else if (wantT !== null) { time = Math.max(REST, Math.min(T, +wantT || 0)); begun(); }
          render(); readyDone(); watch(); kick();
        }, 160); }); });
      });
    }
  }
  [lo, hi].forEach(function (f, i) {
    var done = false, go1 = function () { if (done) return; try { if (!f.contentWindow.hearTopics) return; } catch (e) { return; } done = true; onLoad(f, i === 0); };
    f.addEventListener('load', go1); go1();
  });
  function watch() {
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) kick(); }, { rootMargin: '200px' }).observe(fig);
    if (!auto) return;
    /* the play waits until the whole window is on screen (or as much of it as the screen can hold): stage 5 happens at its bottom */
    var thr = Math.max(.5, Math.min(.95, (innerHeight - 72) / stage.offsetHeight));
    new IntersectionObserver(function (es, io) {
      if (es[0].intersectionRatio >= thr - .01 && !started) { io.disconnect(); setTimeout(function () { if (!started) playRange(REST, T); }, 500); }
    }, { threshold: thr }).observe(stage);
  }
  new ResizeObserver(function () { fit(); }).observe(win);
  narrow.addEventListener('change', function () { if (loaded === 2) later(); });
  fit();

  window.tpProto = { ready: ready, seek: seek, play: playRange, go: go, REST: REST, get T() { return T; }, get B() { return B.slice(); }, get S() { return S; }, get G() { return G; }, get t() { return time; }, get parts() { return marks.length; }, get lparts() { return lparts; }, get K3() { return K3; }, get playing() { return playing; }, get dipping() { return dipping; } };
})();

