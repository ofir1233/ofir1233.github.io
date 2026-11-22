/* v7 - product: this section's behaviour. Loaded deferred, after the page's own scripts. */
/* Each product window is Hear Studio itself with one screen open (hear-v7/plan/screens, and Topics). The page only tells the
   screen which step to show, where the camera looks, and draws the player under the frame. The screen never takes the pointer. */
(function () {
  var figs = [].slice.call(document.querySelectorAll('.px-fig'));
  if (!figs.length) return;
  var TRIM = 3, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = '<svg class="pa" viewBox="0 0 18 18" aria-hidden="true"><rect x="4" y="3.5" width="3.4" height="11" rx="1"/><rect x="10.6" y="3.5" width="3.4" height="11" rx="1"/></svg><svg class="pl" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3.2v11.6a.6.6 0 0 0 .9.5l9.4-5.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5z"/></svg><svg class="rp" viewBox="0 0 18 18" aria-hidden="true"><path d="M9 3.6a5.6 5.6 0 1 0 5.4 7"/><path d="M8.6.9v5.4l4-2.7z"/></svg>';
  var TOPICS = {
    steps: ['Every topic is a box: its size is the calls, its colour is the score.', 'A topic opens into the three scores behind it.', 'Ask AI explains what drives a score, from the calls behind it.'],
    step: function (w, i) {
      var t = w.hearTopics;
      if (i < 2) t.close();
      if (i === 0) t.hot(-1, -1, 'force'); else if (i === 1) t.hot(0, -1, 'map'); else t.ask(0, 2);
    }
  };
  /* THE CAMERA (owner, 22.11.2026: "a busy screen cannot be shown whole: the animation has to focus on one part at a time", and later
     the same day: "more thought in the animation, more exact timings, a more calculated experience").
     Every step is a list of shots: [after ms, selector in the screen, options]. The frame moves in on what the selector finds, measured
     live in the screen, so it holds at any size and with the sidebar folded. null is the whole screen: only the opening shot uses it.
     Options: pad (px of air), max (zoom limit), fit 'w' (fill the width and start at the top, for tall panels), part [x0,y0,x1,y1]
     (a fraction of a wide block, for tables), tap (false: nothing is pressed on this step), now (the screen changes as the frame leaves), from (what is pressed to open a panel
     that is not there yet), keep (the frame moves on, the light stays where it is: reading down a tall panel), small (a shot for the phone only), grow (what the step opens beside it) and
     pad2 (the air once that has opened: the frame arrives a little wide and pushes in on the answer). A shot with no part (or with lit) is also lit: everything
     around it is dimmed and out of focus.
     One step is one sentence, in this order (BEAT below holds the numbers):
       1. the frame travels to the place: longer for a longer way, and it always lands softly;
       2. a short stillness, then a press is shown on the thing that opens;
       3. the screen answers (a popover, a panel);
       4. as it opens, the lit area grows around it and the frame pushes in on it, in one move.
     When what the step is about does not exist yet (a side panel), the frame holds where it is, the screen opens it, and then the frame
     goes to it. Nothing opens while the picture is still travelling. */
  var SHOTS = {
    topics: [
      [[0, null], [1700, '.tp-col:first-child', { pad: 22 }]],
      [[0, '#tp-map [data-k="0"]', { pad: 56, max: 2.1 }]],
      [[0, '.ask-on .tp-ask', { fit: 'w', pad: 26, max: 2, from: '#tp-map [data-k="0"] .tp-p[data-p="2"]' }], [5200, '.ask-on .tp-ask', { fit: 'w', part: [0, .17, 1, 1], keep: true, pad: 26, max: 2 }]]
    ],
    compliance: [
      [[0, null], [1700, '.cm-grid', { part: [0, 0, .6, 1], max: 1.7 }], [4000, '.cm-grid', { part: [.4, 0, 1, 1], max: 1.7 }]],
      [[0, '[data-c="3-9"]', { pad: 180, pad2: 46, max: 1.85, grow: '.sx-tip.on' }]],
      [[0, '.sx-side.on', { fit: 'w', pad: 26, max: 2, from: '.sx-tip.on .go' }], [3600, '.sx-side.on', { fit: 'w', part: [0, .16, 1, 1], keep: true, small: true, pad: 26, max: 2 }]]
    ],
    agents: [
      [[0, null], [1700, '.ae-plot, .ae-dates', { pad: 30, ax: .62 }]],
      [[0, '[data-b="17"]', { pad: 130, pad2: 50, max: 1.85, grow: '.sx-tip.on' }]],
      [[0, '.ae-strip i:last-child', { pad: 170, pad2: 54, max: 1.85, grow: '.sx-tip.on' }]]
    ],
    actions: [
      [[0, null], [1700, '.ac-col:first-child', { pad: 24, max: 1.9 }]],
      [[0, '.ac-card.src', { pad: 70, max: 1.8 }]],
      [[0, '.sx-side.on', { fit: 'w', pad: 26, max: 2, from: '.ac-card.src' }], [2900, '.sx-side.on', { fit: 'w', part: [0, .3, 1, 1], keep: true, pad: 26, max: 2 }]],
      [[0, '.ac-col:nth-child(3), .ac-col:nth-child(4)', { part: [0, 0, 1, .64], lit: true, pad: 22, max: 1.9, tap: false }]]
    ],
    news: [
      [[0, null], [1700, '.nr-col:last-child', { pad: 22, max: 1.7 }], [5000, '.nr-feat', { pad: 30, max: 1.9 }]],
      [[0, '.nr-play', { pad: 120, max: 1.9 }], [700, '.nr-story', { part: [.15, .15, .85, .85], tap: false }]],
      [[0, '.nr-story', { part: [.15, .15, .85, .85], tap: false, now: true }]],
      [[0, '.nr-story', { part: [.15, .15, .85, .85], tap: false, now: true }]]
    ],
    data: [
      [[0, null], [1700, '.dt-top, .dt-tabs, .dt-bar', { part: [0, 0, .6, 1], pad: 26, max: 1.7 }], [4400, '.dt-tbl', { part: [0, .05, .56, .65], max: 1.7 }]],
      [[0, '.dt-ask', { part: [0, 0, .455, 1], pad: 14, max: 1.75 }]],
      [[0, '.dt-cam.a', { part: [0, 0, 1, 1], pad: 14, max: 1.55, tap: false }], [800, '.dt-cam.c', { part: [0, 0, 1, 1], pad: 14, max: 1.6, small: true }], [3400, '.dt-tbl', { part: [.44, .07, 1, .67], max: 1.6 }], [6000, '.dt-cam.c', { part: [0, 0, 1, 1], pad: 14, max: 1.6 }]]
    ],
    signals: [
      [[0, null], [1700, '.sg-list', { part: [0, 0, .6, .58], max: 1.7 }], [4300, '.sg-list', { part: [.42, 0, 1, .58], max: 1.7 }]],
      [[0, '.sg-r[data-g="0"]', { part: [0, 0, .66, 1], pad: 70, max: 1.6 }], [1500, '.sx-side.on', { fit: 'w', pad: 26, max: 2 }]],
      [[0, '.sg-new', { part: [0, 0, .66, 1], pad: 70, max: 1.7, tap: false }], [5200, '.sg-new, .sg-r.fresh', { part: [.38, 0, 1, 1], pad: 40, max: 1.7 }]]
    ]
  };
  /* ONE CALL, FOLLOWED. The same sample call (Oct 13: a refund asked twice, a voucher offered) is in four of the screens: a box on the
     Topics map, a line in the Ask AI answer in Compliance, a task in Actions, a story in Newsroom. The text beside each window says so,
     and its button shows it: the window stops on the step where the call is, and the frame goes to the call itself.
     k: the step; sel: where the call is in the screen; act: what the screen is asked to do when the step's own action does not show it;
     late: the call is in a panel that slides in, so the frame waits for the panel. */
  var THREAD = {
    /* Refunds & Credits is the sixth topic and the map opens on five boxes: the map is asked for ten, and the frame goes to its box,
       with its neighbours in view so its size and colour mean something (undo puts five back). os: the same on a phone, closer. */
    topics: { k: 0, sel: '#tp-map [data-k="5"]', o: { pad: 120, max: 1.7 }, os: { pad: 26, max: 2.6, gx: 3, gy: 3 },
      act: function (w) { var t = w.hearTopics, b = w.document.querySelector('#tp-view button[data-i="1"]'); t.close(); if (b && !b.classList.contains('on')) b.click(); t.hot(5, -1, 'map'); },
      undo: function (w) { var b = w.document.querySelector('#tp-view button[data-i="0"]'); if (b && !b.classList.contains('on')) b.click(); } },
    compliance: { k: 2, sel: '.sx-side.on li:first-child', o: { pad: 54, max: 2, gx: 10, gy: 0 }, late: true },
    /* the task, from its header ("From an alert") down to its facts: priority, who has it, which call. A phone cannot read all of that
       at once: it reads the task first, then (then:) the frame moves down to the facts. */
    actions: { k: 2, sel: function (small) { return small ? '.sx-side.on header, .sx-side.on .a' : '.sx-side.on header, .sx-side.on .a, .sx-side.on dl'; },
      o: { pad: 40, max: 2, gx: 16, gy: 10 }, os: { pad: 20, max: 2, gx: 14, gy: 10 }, late: true,
      then: function (small) { return small ? { at: 2600, sel: '.sx-side.on dl', o: { pad: 22, max: 2, gx: 14, gy: 10 } } : null; } },
    news: { k: 0, sel: '.nr-col:last-child .nr-item:nth-child(5)', o: { pad: 70, max: 1.9, gx: 14, gy: 0 }, os: { pad: 15, max: 2.2, gx: 10, gy: 0 } }
  };
  /* How long each step lasts once the frame has landed on it (the way there is added: see P.off). */
  var DUR = { topics: [5400, 4400, 10200], compliance: [6600, 4400, 7600], agents: [5600, 4400, 4600], actions: [5600, 4200, 7400, 4600], news: [8600, 4600, 4400, 5000], data: [6600, 4800, 9400], signals: [7600, 6600, 9000] };
  /* the beat, in ms */
  var BEAT = {
    still: 300,        /* the frame has landed; nothing moves: long enough for the eye to arrive too */
    press: 150,        /* from the press showing to the screen answering */
    opens: 70,         /* the popover is in the page (it is still fading in): the lit area opens around it as it appears, not after */
    morph: 520,        /* the lit area grows around what opened, and the frame re-centres */
    wait: 240,         /* before the screen opens something the frame is not yet on */
    slide: 900,        /* a side panel has slid in and can be measured */
    panel: 860         /* a side panel slides in, and the frame travels to it, in the same time and on the same curve */
  };
  var EASE = 'cubic-bezier(.62,.02,.2,1)', SETTLE = 'cubic-bezier(.3,.85,.25,1)';
  /* Drawn inside the screen, over everything: a rim around the part the camera looks at, which also tints everything outside it,
     four soft-focus panels around it (a clipped backdrop blur does not hold inside a scaled frame, so the blur is four plain boxes),
     and the press. */
  var VEIL =
    '#px-rim{position:fixed;left:0;top:0;width:100px;height:100px;z-index:2147483001;pointer-events:none;opacity:0;border-radius:var(--r,8px);' +
    'box-shadow:0 0 0 var(--h,1px) rgba(255,255,255,.9),0 24px 60px -24px rgba(12,38,78,.45),0 0 0 4000px rgba(228,238,249,.4)}' +
    '.px-soft{position:fixed;z-index:2147483000;pointer-events:none;opacity:0;-webkit-backdrop-filter:blur(1.1px);backdrop-filter:blur(1.1px)}' +
    '#px-rim.on,.px-soft.on{opacity:1}' +
    '#px-tap{position:fixed;z-index:2147483002;pointer-events:none;border-radius:50%;opacity:0;background:rgba(19,159,253,.22);box-shadow:inset 0 0 0 var(--h,1px) rgba(255,255,255,.95),0 0 0 var(--h,1px) rgba(11,111,207,.55)}' +
    '#px-tap.go{animation:px-tap .54s cubic-bezier(.3,.6,.2,1) both}' +
    /* it closes in on the thing, then lets go: a press, not a ripple */
    '@keyframes px-tap{0%{opacity:0;transform:scale(1.25)}28%{opacity:1;transform:scale(.8)}100%{opacity:0;transform:scale(1.5)}}';
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var players = figs.map(function (fig) {
    var win = fig.querySelector('.px-win'), frame = fig.querySelector('.px-app');
    /* The steps sit under the frame as sentences: each one is a button, and its top line is the clock. */
    var box = document.createElement('div');
    box.className = 'px-steps';
    box.innerHTML = '<ol aria-label="Steps in the demo"></ol><button type="button" class="px-pp">' + ICON + '<span></span></button><p class="px-free">Paused. Pick a step, or press play.</p>';
    fig.insertAdjacentElement('afterend', box);
    var pp = box.querySelector('.px-pp'), beats = box.querySelector('ol');
    var tabs = fig.querySelector('.px-tabs');
    var P = { fig: fig, inView: false, paused: reduce, live: false, k: 0, ms: 0, steps: [], dur: [], api: null, s: 1, w: 1120, small: false, loops: 0, rest: false, win: win, si: 0, re: [], q: [], off: 0,
      c: { x: 0, y: 0, z: 1 }, r: null, lit: false, thr: null, undo: null, onfree: null };
    P.depth = window.v7Depth ? window.v7Depth(frame, win) : { drift: function () {} };
    var key = function () { return fig.getAttribute('data-px'); };
    var H = function () { return Math.round(P.w * 9 / 16); };
    var px = function (n) { return n.toFixed(1) + 'px'; };
    /* On a phone the frame is too small for the whole app: the sidebar steps aside and the screen is drawn at 860 wide. */
    function fit() {
      var small = win.clientWidth < 520, w = small ? 860 : 1120;
      frame.style.width = w + 'px'; frame.style.height = Math.round(w * 9 / 16) + 'px';
      P.s = win.clientWidth / (w - 2 * TRIM); P.w = w; P.small = small;
      fig.style.setProperty('--s', P.s);
      try { frame.contentDocument.documentElement.classList.toggle('px-small', small); } catch (e) {}
      look(0);
    }
    /* what a selector covers, in the screen's own px: the box around every visible thing it finds */
    function rectOf(sel, part, rest) {
      var d = frame.contentDocument, els = d.querySelectorAll(sel), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
      [].forEach.call(els, function (el) {
        var r = el.getBoundingClientRect(), dx = 0, dy = 0; if (r.width < 2 || r.height < 2) return;
        if (rest) {                              /* where it will be once it has slid in: its own slide, and the slide of what carries it, are taken off */
          try { var k = r.width / (el.offsetWidth || r.width), a = el, up = 0;
            while (a && a.nodeType === 1 && a !== d.body && up++ < 8) {
              var m = new frame.contentWindow.DOMMatrixReadOnly(frame.contentWindow.getComputedStyle(a).transform);
              if (Math.abs(m.a - 1) < .01 && Math.abs(m.d - 1) < .01) { dx += m.e * k; dy += m.f * k; }
              a = a.parentElement;
            } } catch (e) {}
        }
        n++; x0 = Math.min(x0, r.left - dx); y0 = Math.min(y0, r.top - dy); x1 = Math.max(x1, r.right - dx); y1 = Math.max(y1, r.bottom - dy);
      });
      if (!n) return null;
      x0 = Math.max(0, x0); y0 = Math.max(0, y0); x1 = Math.min(P.w, x1); y1 = Math.min(H(), y1);
      if (x1 - x0 < 4 || y1 - y0 < 4) return null;
      if (part) { var w = x1 - x0, h = y1 - y0; return [x0 + w * part[0], y0 + h * part[1], w * (part[2] - part[0]), h * (part[3] - part[1])]; }
      return [x0, y0, x1 - x0, y1 - y0];
    }
    /* a step's shots; a shot marked small is for the phone only (its frame is shorter, so a panel needs reading down) */
    function shotsOf(k) { var st = (SHOTS[key()] || [])[k]; return st && !P.small ? st.filter(function (x) { return !(x[2] && x[2].small); }) : st; }
    /* the framing options once the step has opened what it opens */
    function fin(o) { if (o.pad2 == null) return o; var n = {}; for (var k in o) n[k] = o[k]; n.pad = o.pad2; return n; }
    function shot() { if (P.thr && P.live) return P.thr; var st = P.live && !reduce && shotsOf(P.k); return (st && st[Math.min(P.si, st.length - 1)]) || null; }
    /* the place the current shot is about; with full, what the step opened is counted in */
    function target(full, rest) {
      var sh = shot(), o = (sh && sh[2]) || {};
      if (!sh || !sh[1]) return null;
      try { var sel = full && o.grow ? sh[1] + ', ' + o.grow : sh[1]; P.rad = o.part ? 0 : radOf(sel); return rectOf(sel, o.part, rest); } catch (e) { return null; }
    }
    /* The corner of what a selector covers, in the screen's px: the corner of the thing itself, or, when it is a plain box, of what
       sits in its corner (a map tile's face, the first card of a column). The lit area takes its corner from here, so its shape is
       the shape of the part it marks (owner, 22.11.2026 night: "it is not about more or less, it must fit the part it marks"). */
    function radOf(sel) {
      var d = frame.contentDocument, w = frame.contentWindow, best = 0;
      [].forEach.call(d.querySelectorAll(sel), function (el) {
        var r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
        var v = parseFloat(w.getComputedStyle(el).borderTopLeftRadius) || 0;
        if (!v) { var kids = el.querySelectorAll('*'), n = Math.min(kids.length, 60);
          for (var i = 0; i < n && !v; i++) { var b = kids[i].getBoundingClientRect(); if (b.width > 8 && Math.abs(b.left - r.left) < 6 && Math.abs(b.top - r.top) < 6) v = parseFloat(w.getComputedStyle(kids[i]).borderTopLeftRadius) || 0; } }
        best = Math.max(best, Math.min(v, r.width / 2, r.height / 2));
      });
      return best;
    }
    /* Where the frame must be to show r. Returns the camera {x, y, z} in the screen's px. */
    function frameFor(r, o) {
      var W = P.w, h = H(), z = 1, cx = W / 2, cy = h / 2;
      if (r) {
        /* a phone cannot read a block as wide or as high as the screen, the labels would be four pixels high: it looks at one part of it,
           where reading starts, or where the step says (ax, 0..1 along the block). The Newsroom story is shown whole. */
        if (P.small && o.fit !== 'w' && (r[2] > W * .5 || r[3] > h * .6) && !(key() === 'news' && P.k > 0)) {
          var nw = Math.min(r[2], W * .34), nh = Math.min(r[3], h * .36);
          r = [r[0] + (r[2] - nw) * (o.ax || 0), r[1] + (r[3] - nh) * (o.ay || 0), nw, nh];
        }
        var pad = o.pad == null ? 28 : o.pad, max = (o.max || 2.2) * (P.small ? 1.3 : 1);
        z = o.fit === 'w' ? W / (r[2] + 2 * pad) : Math.min(W / (r[2] + 2 * pad), h / (r[3] + 2 * pad));
        z = Math.max(1, Math.min(max, z));
        cx = r[0] + r[2] / 2; cy = r[1] + r[3] / 2;
        /* taller or wider than the frame at this zoom: start at its top left, where it is read from */
        if (r[3] * z > h - 24) cy = r[1] - 14 / z + h / z / 2;
        if (r[2] * z > W - 24) cx = r[0] - 14 / z + W / z / 2;
      } else if (P.small && P.live && !reduce) {
        /* a phone never shows the whole screen at once, it would be too small to read: with no place of its own, the frame is on the
           top left, where the title is. The Newsroom story fills the screen, so it is shown whole. */
        if (!(key() === 'news' && P.k > 0)) { z = 1.45; cx = 0; cy = 0; }
      }
      return { x: Math.min(0, Math.max(W - W * z, W / 2 - cx * z)), y: Math.min(0, Math.max(h - h * z, h / 2 - cy * z)), z: z };
    }
    /* How long a move takes: a longer way takes longer, a change of zoom counts as way, and nothing is rushed or dragged out. */
    function span(c) {
      var d = Math.hypot(c.x - P.c.x, c.y - P.c.y) * P.s + Math.abs(Math.log(c.z / P.c.z)) * 620;
      return d < 2 ? 0 : Math.round(Math.max(680, Math.min(1280, 560 + d * .6)));
    }
    /* Move the frame, and the lit area with it, to r in ms. With no r the whole screen is shown and nothing is lit. */
    function move(r, o, ms, ease) {
      var c = frameFor(r, o), d = null;
      try { d = frame.contentDocument; } catch (e) {}
      if (ms == null) ms = span(c);
      ease = ease || EASE;
      frame.style.transition = 'opacity .45s, transform ' + ms + 'ms ' + ease;
      frame.style.transform = 'translate(' + (c.x * P.s).toFixed(1) + 'px,' + (c.y * P.s).toFixed(1) + 'px) scale(' + (P.s * c.z).toFixed(4) + ')';
      P.c = c; P.r = r;
      var rim = d && d.getElementById('px-rim'), soft = d ? d.querySelectorAll('.px-soft') : [];
      if (!rim || (o.keep && P.lit)) return ms;
      var lit = !!(r && (!o.part || o.lit) && !P.rest), geo = ms + 'ms ' + ease, was = P.lit;
      if (lit) {                                 /* how much of the frame it fills: over three quarters, and dimming the rest is only haze at the edges */
        var vw = P.w / c.z, vh = H() / c.z, vx = -c.x / c.z, vy = -c.y / c.z;
        var iw = Math.max(0, Math.min(vx + vw, r[0] + r[2]) - Math.max(vx, r[0])), ih = Math.max(0, Math.min(vy + vh, r[1] + r[3]) - Math.max(vy, r[1]));
        if (iw * ih > vw * vh * .74) lit = false;
      }
      var set = function (el, css) { for (var k in css) el.style[k] = css[k]; };
      if (lit) {
        /* the hairline is 1px on the page at any zoom; the corner is the marked part's own corner plus the air around it, so the
           two curves are concentric. A part with square corners gets a nearly square frame. */
        /* the air between the part and its rim: 6 all round, unless the shot says otherwise (text that starts at the part's own edge
           needs more at the sides; rows ruled by hairlines need none above and below, or the rules show inside the rim) */
        var gx = o.gx == null ? 6 : o.gx, gy = o.gy == null ? 6 : o.gy, g = Math.max(0, Math.min(gx, gy));
        var x = r[0] - gx, y = r[1] - gy, w = r[2] + 2 * gx, h = r[3] + 2 * gy, k = P.s * c.z;
        var T = was ? 'opacity .3s ease, left ' + geo + ', top ' + geo + ', width ' + geo + ', height ' + geo + ', border-radius ' + geo : 'opacity .46s ease ' + Math.round(ms * .5) + 'ms';
        var boxes = [[0, 0, P.w, Math.max(0, y)], [0, y + h, P.w, H()], [0, y, Math.max(0, x), h], [x + w, y, P.w, h]];
        if (!was) { rim.style.transition = 'none'; [].forEach.call(soft, function (el) { el.style.transition = 'none'; }); }
        var place = function () {
          rim.style.setProperty('--r', (P.rad ? Math.min(P.rad + g, w / 2, h / 2) : 4).toFixed(2) + 'px'); rim.style.setProperty('--h', (1 / k).toFixed(2) + 'px');
          set(rim, { left: px(x), top: px(y), width: px(w), height: px(h) });
          [].forEach.call(soft, function (el, i) { set(el, { left: px(boxes[i][0]), top: px(boxes[i][1]), width: px(boxes[i][2]), height: px(boxes[i][3]) }); });
        };
        if (!was) { place(); void rim.offsetWidth; }
        rim.style.transition = T; [].forEach.call(soft, function (el) { el.style.transition = T; });
        if (was) place();
      } else {
        rim.style.transition = 'opacity .26s ease'; [].forEach.call(soft, function (el) { el.style.transition = 'opacity .26s ease'; });
      }
      rim.classList.toggle('on', lit); [].forEach.call(soft, function (el) { el.classList.toggle('on', lit); });
      P.lit = lit;
      return ms;
    }
    function unlight() {
      try {
        var d = frame.contentDocument, all = [d.getElementById('px-rim')].concat([].slice.call(d.querySelectorAll('.px-soft')));
        all.forEach(function (el) { if (el) { el.style.transition = 'opacity .22s ease'; el.classList.remove('on'); } });
      } catch (e) {}
      P.lit = false;
    }
    /* the frame as the current shot wants it, now (a resize, a pause, a jump) */
    function look(ms) { var sh = shot(); return move(target(true), fin((sh && sh[2]) || {}), ms); }
    /* a window that is not the one playing shows a clear screen: no haze, no rim (owner, 22.11 night: "everything feels smeared") */
    P.clear = function () { if (P.lit) unlight(); };
    P.relight = function () { if (P.live && !P.rest && !P.lit) { try { look(); } catch (e) {} } };
    /* a press, shown on the thing that is about to open */
    function tap(r) {
      try {
        var d = frame.contentDocument, el = d.getElementById('px-tap'), k = P.s * P.c.z, size = 34 / k;
        el.style.setProperty('--h', (1 / k).toFixed(2) + 'px');
        el.style.width = el.style.height = px(size); el.style.left = px(r[0] + r[2] / 2 - size / 2); el.style.top = px(r[1] + r[3] / 2 - size / 2);
        el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
      } catch (e) {}
    }
    new ResizeObserver(fit).observe(win); fit();
    function button() { pp.setAttribute('aria-label', P.rest ? 'Replay the demo' : P.paused ? 'Play the demo' : 'Pause the demo'); pp.lastChild.textContent = P.rest ? 'Replay' : P.paused ? 'Play' : 'Pause'; fig.classList.toggle('is-paused', P.paused); box.classList.toggle('is-paused', P.paused); box.classList.toggle('is-rest', !!P.rest && !P.paused); }
    /* things that happen later in the step, on the step's own clock: a pause holds them too */
    function at(ms, fn) { P.q.push({ t: P.ms + ms, fn: fn }); P.q.sort(function (a, b) { return a.t - b.t; }); }
    var act = function () { try { P.api(P.k); } catch (e) {} };
    /* after the screen has answered: take in what opened, in one move */
    function settle() {
      var sh = shot(), o = (sh && sh[2]) || {}, r = target(true), a = P.r;
      if (!r) return;
      if (a && Math.abs(a[0] - r[0]) < 4 && Math.abs(a[1] - r[1]) < 4 && Math.abs(a[2] - r[2]) < 4 && Math.abs(a[3] - r[3]) < 4) return;
      move(r, fin(o), a ? BEAT.morph : null, a ? SETTLE : EASE);
    }
    /* One shot, played. first: this shot opens the step, so it is the one that makes the screen act. */
    function beat(first) {
      var sh = shot(), o = (sh && sh[2]) || {}, r = target(false);
      if (!sh || !sh[1]) {                       /* the whole screen: the screen resets as the frame pulls back */
        if (first) act();
        /* a phone has no room for the opening view of the whole screen: it opens on the first part, and holds there */
        var st0 = shotsOf(P.k);
        if (first && P.small && P.live && !reduce && st0 && st0[1] && st0[1][1]) {
          P.si = 1; var r1 = target(false);
          if (r1) { P.off = move(r1, st0[1][2] || {}); at(P.off + 200, settle); return; }
          P.si = 0;
        }
        P.off = move(null, o); return;
      }
      if (!first) { at(move(r, o) + 60, settle); return; }
      if (!r) {                                  /* not there yet: hold, let the screen open it, then go to it */
        P.r = null;
        /* what opens it is pressed first, where the frame already is; then the light goes out (it never slides across the screen),
           the screen opens the panel, and in the same instant the frame leaves for where the panel will stand: the two arrive together */
        var fr = null, t0 = BEAT.wait;
        try { fr = o.from ? rectOf(o.from) : null; } catch (e) {}
        if (fr) { at(BEAT.still, function () { tap(fr); }); t0 = BEAT.still + BEAT.press; } else unlight();
        at(t0, function () { unlight(); act(); var to = target(true, true); if (to) move(to, fin(o), BEAT.panel); });
        at(t0 + BEAT.slide, settle);
        at(t0 + BEAT.slide + 1400, settle);
        return;
      }
      /* what the last step left open over the screen closes as the frame leaves it, not when the next thing opens */
      try { [].forEach.call(frame.contentDocument.querySelectorAll('.sx-tip.on'), function (t) { t.classList.remove('on'); }); } catch (e) {}
      if (o.now) act();                          /* a slide that fills the screen: it changes as the frame moves, not after */
      var ms = move(r, o);
      P.off = ms;                                /* the step's clock starts when the frame has landed */
      if (o.now) return;
      if (o.tap !== false) at(ms + BEAT.still, function () { tap(target(false) || r); });
      at(ms + BEAT.still + (o.tap !== false ? BEAT.press : 0), act);
      at(ms + BEAT.still + BEAT.press + BEAT.opens, settle);
      at(ms + BEAT.still + BEAT.press + BEAT.opens + 1300, settle);
    }
    function show(k, hold) {
      if (P.thr && P.onfree) { try { P.onfree(); } catch (e) {} }
      P.k = k; P.ms = 0; P.si = 0; P.q = []; P.off = 0; P.thr = null;
      if (P.undo) { try { P.undo(frame.contentWindow); } catch (e) {} P.undo = null; }
      [].forEach.call(beats.children, function (li, i) { li.classList.toggle('on', i === k); li.classList.toggle('done', i < k); li.style.setProperty('--p', 0); if (li.firstChild) li.firstChild.setAttribute('aria-current', i === k ? 'step' : 'false'); });
      if (P.rest) { P.rest = false; button(); } P.re.forEach(clearTimeout); P.re = [];
      var st = shotsOf(k);
      if (P.paused || reduce) {
        /* paused, a step is shown finished, on its closest shot: no sequence to wait for */
        if (st) P.si = st.length - 1;
        act();
        if (hold) return;                        /* the caller takes the frame somewhere itself, in one move */
        look(reduce ? 0 : 700);
        [560, 1300].forEach(function (ms) { P.re.push(setTimeout(function () { look(reduce ? 0 : 640); }, ms)); });
        return;
      }
      beat(true);
    }
    P.tick = function (dt) {
      if (!P.live || P.paused || P.rest || !P.inView || fig.closest('article.spot.r8-cov')) return;
      P.ms += dt;
      var d = (P.dur[P.k] || 5200) + P.off, li = beats.children[P.k];
      var st = shotsOf(P.k);
      if (st && P.si < st.length - 1 && P.ms >= st[P.si + 1][0] + P.off) { P.si++; beat(false); }
      while (P.q.length && P.q[0].t <= P.ms) P.q.shift().fn();
      if (li) li.style.setProperty('--p', Math.min(1, P.ms / d));
      if (P.ms >= d) {
        /* two times through, then it rests on its last step: a window that loops for ever pulls the eye from the text beside it */
        if (P.k === P.steps.length - 1 && ++P.loops >= 2) { P.rest = true; button(); return; }
        show((P.k + 1) % P.steps.length);
      }
      if (document.activeElement === frame) frame.blur();
    };
    frame.addEventListener('load', function () {
      if (!frame.getAttribute('src')) return;
      var w = frame.contentWindow, d = frame.contentDocument;
      try {
        var st = d.createElement('style'), HOLD = '.stage,.stage *{transition-property:none!important}';
        st.textContent = '.tp-hint,.tp-tip,.ask-on .tp-foot{display:none!important}.px-small .side{display:none!important}.px-small .stage{--side:0px!important}' +
          /* a phone shows Topics as the map alone: with the day list beside it the boxes are too small to open into their three scores */
          '.px-small .tp-body{grid-template-columns:minmax(0,1fr)!important}.px-small .tp-col:last-child{display:none!important}' +
          /* a side panel slides in on the camera's own curve and in the camera's time: the panel and the frame arrive together */
          '.sx-side{transition:transform .86s cubic-bezier(.62,.02,.2,1),opacity .5s ease!important}.tp-ask{transition:transform .86s cubic-bezier(.62,.02,.2,1),opacity .45s ease!important}' +
          '@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}' + VEIL + HOLD;
        d.head.appendChild(st);
        /* the sidebar is folded to its rail: the screen is the subject, and it gets the room */
        var sg = d.querySelector('.stage'); if (sg) sg.classList.add('is-rail');
        ['px-rim', 'px-tap'].forEach(function (id) { var el = d.createElement('div'); el.id = id; d.body.appendChild(el); });
        for (var q = 0; q < 4; q++) { var sf = d.createElement('div'); sf.className = 'px-soft'; d.body.appendChild(sf); }
        P.lit = false; P.r = null;
        void d.body.offsetWidth; fit(); w.dispatchEvent(new Event('resize'));
        /* the fold is in place: from here the screen's own transitions run again */
        st.textContent = st.textContent.replace(HOLD, '');
      } catch (e) {}
      if (w.hearScreens) { P.steps = w.hearScreens.steps; P.dur = DUR[key()] || w.hearScreens.dur || []; P.api = function (i) { w.hearScreens.step(i); }; }
      else if (w.hearTopics) { P.steps = TOPICS.steps; P.dur = DUR.topics; P.api = function (i) { TOPICS.step(w, i); }; }
      else return;
      beats.style.setProperty('--n', P.steps.length);
      beats.innerHTML = P.steps.map(function (s, i) { return '<li><button type="button"><span class="n">' + two(i + 1) + '</span><span class="l">' + s + '</span></button></li>'; }).join('');
      P.live = true; fig.classList.add('is-live', 'lx-ready'); box.classList.add('on'); box.classList.remove('is-loading');
      show(reduce ? P.steps.length - 1 : 0);
    });
    /* Show the call: the window stops on its step, shown finished, and the frame goes to the call in ONE move. Where the call is in
       a panel that slides in, the light goes out, the panel leaves, and the frame leaves in the same instant for where the call will
       stand: they arrive together (860ms), and the light comes back over the second half. Play carries on from that step.
       No "Paused" note here: the reader asked for this, and the button beside the text says what comes next. */
    P.follow = function () {
      var th = THREAD[key()]; if (!th || !P.live) return false;
      var o = (P.small && th.os) || th.o || {}, sel = typeof th.sel === 'function' ? th.sel(P.small) : th.sel, ms;
      P.loops = 0; P.paused = true; box.classList.remove('by-user');
      show(th.k, true);
      if (th.act) { try { th.act(frame.contentWindow, P.small); } catch (e) {} }
      P.undo = th.undo || null;
      P.thr = [0, sel, o];
      if (th.late && !reduce) { unlight(); var to = target(true, true); ms = to ? move(to, fin(o), BEAT.panel) : BEAT.panel; }
      else ms = look(reduce ? 0 : null);
      [ms + 300, ms + 1500].forEach(function (t) { P.re.push(setTimeout(function () { if (P.thr) { if (P.r) settle(); else look(reduce ? 0 : null); } }, t)); });
      var nxt = th.then && th.then(P.small);
      if (nxt && !reduce) P.re.push(setTimeout(function () { if (!P.thr) return; P.thr = [0, nxt.sel, nxt.o]; look(null); }, ms + nxt.at));
      button(); return ms + 1;                   /* how long the way there takes (+1, so it is never 0) */
    };
    P.held = function () { return !!P.thr; };
    /* the reader has gone on: the window lets the call go and plays again */
    P.release = function () { if (!P.thr) return; P.paused = reduce; box.classList.remove('by-user'); button(); show(P.k); };
    pp.addEventListener('click', function () {
      /* it played twice and came to rest: the button is then a replay, and starts it from the top */
      if (P.rest && !P.paused) { P.loops = 0; show(0); return; }
      if (P.thr) { P.paused = false; box.classList.remove('by-user'); button(); show(P.k); return; }
      P.paused = !P.paused; box.classList.toggle('by-user', P.paused); button(); });
    beats.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !P.live) return;
      P.loops = 0; show([].indexOf.call(beats.children, b.parentElement));
    });
    if (tabs) tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.getAttribute('aria-pressed') === 'true') return;
      [].forEach.call(tabs.children, function (x) { x.setAttribute('aria-pressed', x === b); });
      P.live = false; P.k = 0; P.si = 0; P.q = []; fig.classList.remove('is-live'); box.classList.add('is-loading'); fig.setAttribute('data-px', b.getAttribute('data-k')); look(0);
      var src = frame.getAttribute('data-src').replace(/\?.*$/, '?' + b.getAttribute('data-q'));
      frame.setAttribute('data-src', src);
      setTimeout(function () { frame.src = src; }, 180);
    });
    new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { frame.src = frame.getAttribute('data-src'); io.disconnect(); } }, { rootMargin: '900px 0px' }).observe(win);
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !P.inView && P.rest && P.live) { P.loops = 0; show(0); } P.inView = v; }, { threshold: 0.3 }).observe(win);
    button();
    return P;
  });
  /* A link in the text, like "Watch it open", brings the window into view and plays it from that step. */
  document.addEventListener('click', function (e) {
    var j = e.target.closest ? e.target.closest('.ct-jump[data-beat]') : null; if (!j) return;
    var host = document.querySelector(j.getAttribute('href')), b = host && host.querySelectorAll('.px-steps li button')[+j.getAttribute('data-beat')];
    if (!b) return;
    e.preventDefault(); host.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    /* the step starts when the reader has arrived, not while the page is still travelling */
    var done = false, go = function () { if (done) return; done = true; removeEventListener('scrollend', go); setTimeout(function () { b.click(); }, 250); };
    if (reduce) go(); else { addEventListener('scrollend', go); setTimeout(go, 1600); }
  });
  /* "Show it in Topics", beside a window: the window comes into view if it is not, then shows the call. When the frame has landed on
     the call, the button hands on: "Follow it into Compliance" brings the next window and shows the call there. Four presses, one
     path; the last one says so. A button reads "Follow" only while its window holds the call: when the window lets go (Play, a step,
     a tab, or the reader has moved on) it is itself again. The rule at the block's left turns blue once its stop has been shown. */
  var calls = [].slice.call(document.querySelectorAll('#product [data-follow]')), phone = matchMedia('(max-width:860px)');
  var rode = function () { var t = window.v7Thread || {}; return calls.every(function (c) { return t[c.getAttribute('data-follow')]; }); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-follow]') : null; if (!b) return;
    if (b.getAttribute('aria-disabled') === 'true') return;
    if (b._t && performance.now() - b._t < 400) return;          /* a double click must not jump a card */
    if (b.classList.contains('is-next')) { b = calls[calls.indexOf(b) + 1] || calls[0]; try { b.focus({ preventScroll: true }); } catch (x) {} }
    var card = b.closest('article.spot'), fig = card && card.querySelector('.px-fig'), p = players.filter(function (x) { return x.fig === fig; })[0];
    if (!p) return;
    /* the window may be on another of its tabs (Data, Signals): the call is in the first one */
    var tabs = fig.querySelector('.px-tabs'), first = tabs && tabs.querySelector('button');
    if (first && first.getAttribute('aria-pressed') !== 'true') first.click();
    var blk = b.closest('.pf-call'), name = b.getAttribute('data-follow'), nx = calls[calls.indexOf(b) + 1], tries = 0;
    var free = function () { if (b.getAttribute('data-l')) b.textContent = b.getAttribute('data-l'); b.classList.remove('is-next', 'is-shown', 'is-swap'); b.removeAttribute('aria-disabled'); };
    var hand = function () {
      if (!p.held()) return;
      if (!b.getAttribute('data-l')) b.setAttribute('data-l', b.textContent);
      if (blk) blk.classList.add('is-seen');
      var done = !nx && rode(), text = nx ? 'Follow it into ' + nx.getAttribute('data-follow') : done ? 'Shown in all four screens.' : 'Start it in ' + calls[0].getAttribute('data-follow');
      var set = function () {
        b.classList.remove('is-swap'); if (!p.held()) return;
        b.textContent = text; b.classList.toggle('is-next', !done); b.classList.toggle('is-shown', done);
        if (done) b.setAttribute('aria-disabled', 'true'); b._t = performance.now();
      };
      if (reduce) { set(); return; }
      b.classList.add('is-swap'); setTimeout(set, 130);          /* the words dip out and come back changed */
    };
    var go = function () {
      var ms = p.follow();
      if (!ms) { if (++tries < 30) setTimeout(go, 150); return; }
      p.onfree = free;
      (window.v7Thread = window.v7Thread || {})[name] = 1;      /* the postcard at the end of the page may say so */
      setTimeout(hand, reduce ? 0 : ms - 1 + BEAT.still);       /* when the frame has landed and the eye has arrived */
    };
    /* a phone has the block right above its window: the block goes to the top of the screen, so the words and the window are seen together */
    var r = p.win.getBoundingClientRect(), small = phone.matches && blk, top = small ? blk.getBoundingClientRect().top : r.top;
    if (top >= 60 && r.bottom <= innerHeight - 20) { go(); return; }
    (small ? blk : p.win).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: small ? 'start' : 'center' });
    var done = false, land = function () { if (done) return; done = true; removeEventListener('scrollend', land); setTimeout(go, 200); };
    if (reduce) land(); else { addEventListener('scrollend', land); setTimeout(land, 1400); }
  });
  var last = performance.now();
  /* One window plays at a time: the one in view whose middle is nearest the middle of the screen. The others hold their place.
     A card that the next card has slid over is still in view and often nearer the middle: it does not count. */
  var lead = null, since = 0;
  (function tick(t) {
    var dt = Math.min(100, t - last); last = t;
    if (t - since > 180) {
      since = t; var best = 1e9; lead = null;
      players.forEach(function (p) {
        if (!p.inView || p.fig.closest('article.spot.r8-cov')) return;
        /* how much of the window can be seen: the screen cuts it, and so does the next card as it slides over this one */
        var r = p.win.getBoundingClientRect(), top = Math.max(0, r.top), bot = Math.min(innerHeight, r.bottom), sp = p.fig.closest('article.spot'), nx = sp && sp.nextElementSibling;
        if (nx && nx.matches('article.spot')) bot = Math.min(bot, nx.getBoundingClientRect().top);
        if (bot - top < r.height * .45) return;
        var d = Math.abs(r.top + r.height / 2 - innerHeight / 2) - (bot - top); if (d < best) { best = d; lead = p; }
      });
      /* a window that still holds the call after the reader has moved on lets it go, a second and a half later */
      players.forEach(function (p) { if (p !== lead && p.held()) { if (!p.away) p.away = t; else if (t - p.away > 1500) { p.away = 0; p.release(); } } else p.away = 0; });
      players.forEach(function (p) { var card = p.fig.closest('article.spot'); if (card) card.classList.toggle('lead', p === lead); p.depth.drift(p === lead && p.live && !p.paused); if (p !== lead) { p.clear(); p.led = false; } else if (!p.led) { p.led = true; p.relight(); } });
    }
    /* one bad frame must never stop every window on the page */
    try { if (lead) lead.tick(dt); } catch (e) { if (window.console) console.error('px', e && e.stack || e); }
    requestAnimationFrame(tick);
  })(last);
})();

/* The chapter row (01 to 05) is pinned under the header. When the section ends, the page carries the row up and the header cut its
   numbers in half. It now fades over the first 18px of that climb, so it is either whole or gone. */
(function () {
  var idx = document.querySelector('#product .pf-idx'); if (!idx) return;
  var raf = 0, was = '';
  function set() {
    raf = 0;
    var cs = getComputedStyle(idx), pin = parseFloat(cs.top);
    if (cs.position !== 'sticky' || isNaN(pin)) { if (was) { idx.style.opacity = was = ''; idx.style.pointerEvents = ''; } return; }
    var up = pin - idx.getBoundingClientRect().top, o = up <= 1 ? '' : String(Math.max(0, 1 - (up - 1) / 18).toFixed(3));
    if (o !== was) { idx.style.opacity = was = o; idx.style.pointerEvents = o && +o < .5 ? 'none' : ''; }
  }
  function ask() { if (!raf) raf = requestAnimationFrame(set); }
  addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); ask();
})();
