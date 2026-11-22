/* v7 - product: this section's behaviour. Loaded deferred, after the page's own scripts. */
/* Each product window is Hear Studio itself with one screen open (hear-v7/plan/screens, and Topics). The page only tells the
   screen which step to show and draws the player under the frame. Paused, the screen takes the pointer. */
(function () {
  var figs = [].slice.call(document.querySelectorAll('.px-fig'));
  if (!figs.length) return;
  var TRIM = 3, reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ICON = '<svg class="pa" viewBox="0 0 18 18" aria-hidden="true"><rect x="4" y="3.5" width="3.4" height="11" rx="1"/><rect x="10.6" y="3.5" width="3.4" height="11" rx="1"/></svg><svg class="pl" viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3.2v11.6a.6.6 0 0 0 .9.5l9.4-5.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5z"/></svg>';
  var TOPICS = {
    steps: ['Every topic is a box: its size is the calls, its colour is the score.', 'A topic opens into the three scores behind it.', 'Ask AI explains what drives a score, from the calls behind it.'],
    dur: [5200, 5200, 9500],
    step: function (w, i) {
      var t = w.hearTopics;
      if (i < 2) t.close();
      if (i === 0) t.hot(-1, -1, 'force'); else if (i === 1) t.hot(0, -1, 'map'); else t.ask(0, 2);
    }
  };
  /* The camera: on a step that is about one place, the frame moves in on it. [x, y, zoom], in the screen's own 1120 x 630. */
  var CAMS = {
    compliance: [null, [880, 440, 1.32], [770, 270, 1.16]],
    agents: [null, [740, 330, 1.28], [860, 470, 1.34]],
    actions: [null, [500, 300, 1.42], [720, 270, 1.14], [770, 300, 1.34]],
    data: [null, [640, 190, 1.26], [640, 300, 1.14]],
    signals: [null, [720, 270, 1.14], [640, 200, 1.26]]
  };
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var players = figs.map(function (fig) {
    var win = fig.querySelector('.px-win'), frame = fig.querySelector('.px-app');
    /* The steps sit under the frame as sentences: each one is a button, and its top line is the clock. */
    var box = document.createElement('div');
    box.className = 'px-steps';
    box.innerHTML = '<ol aria-label="Steps in the demo"></ol><button type="button" class="px-pp">' + ICON + '<span></span></button><p class="px-free">Paused. The screen is yours: try it.</p>';
    fig.insertAdjacentElement('afterend', box);
    var pp = box.querySelector('.px-pp'), beats = box.querySelector('ol');
    var tabs = fig.querySelector('.px-tabs');
    var P = { fig: fig, inView: false, paused: reduce, live: false, k: 0, ms: 0, steps: [], dur: [], api: null, s: 1, w: 1120, small: false, loops: 0, rest: false, act: 0, win: win };
    /* On a phone the frame is too small for the whole app: the sidebar steps aside and the screen is drawn at 860 wide. */
    function fit() {
      var small = win.clientWidth < 520, w = small ? 860 : 1120;
      frame.style.width = w + 'px'; frame.style.height = Math.round(w * 9 / 16) + 'px';
      P.s = win.clientWidth / (w - 2 * TRIM); P.w = w; P.small = small;
      fig.style.setProperty('--s', P.s); cam();
      try { frame.contentDocument.documentElement.classList.toggle('px-small', small); } catch (e) {}
    }
    function cam() {
      var all = CAMS[fig.getAttribute('data-px')], c = (!reduce && P.live && all && all[P.k]) || null, W = P.w, H = Math.round(P.w * 9 / 16);
      /* on a phone the screen is drawn without its sidebar, so the same place sits elsewhere, and the frame moves in closer */
      if (c && P.small) c = c[2] < 1.2 ? [860, 170, 1.5] : [(c[0] - 204) * .94, c[1] * .77, c[2] * 1.5];
      /* a phone never shows the whole screen at once, it would be too small to read: a step with no place of its own opens on the top left, where the title is */
      if (!c && P.small && P.live && !reduce && !(fig.getAttribute('data-px') === 'news' && P.k > 0)) c = [0, 0, 1.45]; /* the Newsroom story fills the screen: it is shown whole */
      var z = c ? c[2] : 1;
      var tx = c ? Math.min(0, Math.max(W - W * z, W / 2 - c[0] * z)) : 0, ty = c ? Math.min(0, Math.max(H - H * z, H / 2 - c[1] * z)) : 0;
      frame.style.transform = 'translate(' + (tx * P.s).toFixed(1) + 'px,' + (ty * P.s).toFixed(1) + 'px) scale(' + (P.s * z).toFixed(4) + ')';
    }
    new ResizeObserver(fit).observe(win); fit();
    function button() { pp.setAttribute('aria-label', P.paused ? 'Play the demo' : 'Pause the demo'); pp.lastChild.textContent = P.paused ? 'Play' : 'Pause'; fig.classList.toggle('is-paused', P.paused); box.classList.toggle('is-paused', P.paused); cam(); }
    function show(k) {
      P.k = k; P.ms = 0;
      [].forEach.call(beats.children, function (li, i) { li.classList.toggle('on', i === k); li.classList.toggle('done', i < k); li.style.setProperty('--p', 0); });
      P.rest = false; clearTimeout(P.act);
      /* the frame travels first, and the screen acts once it is nearly there, so nothing opens while the picture is still moving */
      var moves = !reduce && (CAMS[fig.getAttribute('data-px')] || [])[k];
      cam();
      if (moves) P.act = setTimeout(function () { try { P.api(k); } catch (e) {} }, 620); else { try { P.api(k); } catch (e) {} }
    }
    P.tick = function (dt) {
      if (!P.live || P.paused || P.rest || !P.inView || fig.closest('article.spot.r8-cov')) return;
      P.ms += dt;
      var d = P.dur[P.k] || 5200, li = beats.children[P.k];
      if (li) li.style.setProperty('--p', Math.min(1, P.ms / d));
      if (P.ms >= d) {
        /* two times through, then it rests on its last step: a window that loops for ever pulls the eye from the text beside it */
        if (P.k === P.steps.length - 1 && ++P.loops >= 2) { P.rest = true; return; }
        show((P.k + 1) % P.steps.length);
      }
      if (document.activeElement === frame) frame.blur();
    };
    frame.addEventListener('load', function () {
      if (!frame.getAttribute('src')) return;
      var w = frame.contentWindow, d = frame.contentDocument;
      try { var st = d.createElement('style'); st.textContent = '.side{box-sizing:border-box!important;padding:22px 14px 20px 18px!important}.tp-hint,.tp-tip,.ask-on .tp-foot{display:none!important}.px-small .side{display:none!important}.px-small .stage{--side:0px!important}@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}'; d.head.appendChild(st); fit(); st = d.createElement('style'); st.textContent = ''; d.head.appendChild(st); w.dispatchEvent(new Event('resize')); } catch (e) {}
      if (w.hearScreens) { P.steps = w.hearScreens.steps; P.dur = w.hearScreens.dur || []; P.api = function (i) { w.hearScreens.step(i); }; }
      else if (w.hearTopics) { P.steps = TOPICS.steps; P.dur = TOPICS.dur; P.api = function (i) { TOPICS.step(w, i); }; }
      else return;
      beats.style.setProperty('--n', P.steps.length);
      beats.innerHTML = P.steps.map(function (s, i) { return '<li><button type="button"><span class="n">' + two(i + 1) + '</span><span class="l">' + s + '</span></button></li>'; }).join('');
      P.live = true; fig.classList.add('is-live', 'lx-ready'); box.classList.add('on'); box.classList.remove('is-loading');
      show(reduce ? P.steps.length - 1 : 0);
    });
    pp.addEventListener('click', function () { P.paused = !P.paused; button(); });
    beats.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || !P.live) return;
      P.loops = 0; show([].indexOf.call(beats.children, b.parentElement));
    });
    if (tabs) tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.getAttribute('aria-pressed') === 'true') return;
      [].forEach.call(tabs.children, function (x) { x.setAttribute('aria-pressed', x === b); });
      P.live = false; P.k = 0; fig.classList.remove('is-live'); box.classList.add('is-loading'); fig.setAttribute('data-px', b.getAttribute('data-k')); cam();
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
  var last = performance.now();
  /* One window plays at a time: the one in view whose middle is nearest the middle of the screen. The others hold their place. */
  var lead = null, since = 0;
  (function tick(t) {
    var dt = Math.min(100, t - last); last = t;
    if (t - since > 180) {
      since = t; var best = 1e9; lead = null;
      players.forEach(function (p) { if (!p.inView) return; var r = p.win.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - innerHeight / 2); if (d < best) { best = d; lead = p; } });
    }
    if (lead) lead.tick(dt);
    requestAnimationFrame(tick);
  })(last);
})();
