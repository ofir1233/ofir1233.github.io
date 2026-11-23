/* v7 - design-lab: this section's behaviour. Loaded deferred, after the page's own scripts. */
/* The frame runs the real Hear Studio pages (hear-v7/plan) in an iframe and plays them like a visitor would:
   a pointer moves, clicks and types. Nothing is recorded. Pausing holds the frame; the app inside never takes the pointer. */
(function () {
  var fig = document.querySelector('#design-lab .hs-fig');
  if (!fig) return;
  var stage = fig.querySelector('.hs-win'), frame = fig.querySelector('.hs-app'), ptr = fig.querySelector('.hs-ptr');
  var bar = fig.querySelector('.hs-bar'), pp = bar.querySelector('.hs-pp'), now = bar.querySelector('.hs-now'), kEl = bar.querySelector('.hs-k'), tEl = bar.querySelector('.hs-t');
  var items = [].slice.call(bar.querySelectorAll('.hs-segs li'));
  var BASE = frame.getAttribute('data-base'), W = 1440, TRIM = 3;      // TRIM: the app's outermost pixels are a translucent edge; they stay outside the frame
  var ASK = 'A heatmap of evaluation criteria by agent for the last 30 days';
  var EST = [7600, 5600, 6400, 16000];                       // rough length of each step, for the strip only
  var paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches, inView = false, started = false, touched = false;
  var run = 0, step = 0, stepMs = 0, stepDone = false, scale = 1;

  /* On a phone the whole app at this size cannot be read, so the frame moves in: on the card while it signs in and asks,
     on the built screen once Hear has built it. [left, top, zoom] in the app's own pixels. */
  var cam = [0, 0, 1];
  function at(x, y) { return ((x - cam[0]) * scale * cam[2]) + 'px ' + ((y - cam[1]) * scale * cam[2]) + 'px'; }
  function shoot() {
    var z = stage.clientWidth < 560 ? (step === 3 ? 1.72 : 1.62) : 1;
    cam = z === 1 ? [0, 0, 1] : step === 3 ? [556, 0, z] : [717 - 717 / z, Math.max(0, 470 - 402 / z), z];
    frame.style.transform = 'translate(' + (-cam[0] * scale * z).toFixed(1) + 'px,' + (-cam[1] * scale * z).toFixed(1) + 'px) scale(' + (scale * z).toFixed(4) + ')';
  }
  function fit() { scale = stage.clientWidth / (W - 2 * TRIM); fig.style.setProperty('--s', scale); shoot(); if (!started) ptr.style.translate = at(1000, 560); }
  new ResizeObserver(fit).observe(stage); fit();

  var going = function () { return inView && !paused; };
  /* depth: the mouse over the frame is passed to the page inside as a position only; with no mouse, the picture drifts while it plays */
  var depth = window.v7Depth ? window.v7Depth(frame, stage) : null;
  if (depth) setInterval(function () { depth.drift(going()); }, 300);
  function button() {
    pp.setAttribute('aria-label', paused ? 'Play the demo' : 'Pause the demo');
    fig.classList.toggle('is-paused', paused);
  }
  function setStep(k) {
    step = k; stepMs = 0; stepDone = false; shoot();
    items.forEach(function (li, i) { li.classList.toggle('on', i === k); li.classList.toggle('done', i < k); li.style.setProperty('--p', i < k ? 1 : 0); });
    bar.style.setProperty('--p', 0);
    var name = items[k].querySelector('button').getAttribute('data-l');
    if (tEl.textContent !== name) {
      kEl.textContent = 'Step ' + (k + 1) + ' of ' + items.length; tEl.textContent = name;
      now.classList.remove('swap'); void now.offsetWidth; now.classList.add('swap');      // the new name rises into place
    }
  }
  var last = performance.now();
  (function tick(t) {
    var dt = Math.min(100, t - last); last = t;
    if (going() && started) { stepMs += dt; var pr = stepDone ? 1 : Math.min(0.96, stepMs / EST[step]); items[step].style.setProperty('--p', pr); bar.style.setProperty('--p', pr); }
    if (stage.scrollTop || stage.scrollLeft) { stage.scrollTop = 0; stage.scrollLeft = 0; }      // a moved-in frame is larger than its window; nothing may scroll it
    if (!paused && document.activeElement === frame) frame.blur();      // the pages focus their own field; the keyboard stays with this page
    requestAnimationFrame(tick);
  })(last);

  /* Waiting counts only while the demo is on screen and playing; a newer run cancels an older one. */
  function Stale() {}
  function wait(ms, my) {
    return new Promise(function (res, rej) {
      var left = ms, prev = performance.now();
      (function w() {
        if (my !== run) return rej(new Stale());
        var t = performance.now(); if (going()) left -= Math.min(100, t - prev); prev = t;
        if (left <= 0) res(); else setTimeout(w, 30);
      })();
    });
  }
  function until(fn, my, max) {
    var t0 = performance.now();
    return new Promise(function (res, rej) {
      (function w() {
        if (my !== run) return rej(new Stale());
        var r = null; try { r = fn(); } catch (e) {}
        if (r || performance.now() - t0 > (max || 20000)) res(r); else setTimeout(w, 120);
      })();
    });
  }
  var doc = function () { return frame.contentDocument; };
  function load(page, my) {
    return new Promise(function (res) {
      frame.addEventListener('load', function () { res(); }, { once: true });
      frame.src = BASE + page;
    }).then(function () { fig.classList.add('is-live'); return wait(350, my); });
  }
  function move(el, my, fx, ms) {
    var r = el.getBoundingClientRect();
    ptr.style.transitionDuration = (ms || 800) + 'ms';
    ptr.style.translate = at(r.left - TRIM + r.width * (fx == null ? 0.5 : fx), r.top - TRIM + r.height / 2);
    return wait((ms || 800) + 160, my);
  }
  function press(my) { ptr.classList.add('down'); return wait(130, my).then(function () { ptr.classList.remove('down'); }); }

  async function type(inp, text, ms, my) {
    for (var i = 0; i < text.length; i++) { inp.value = text.slice(0, i + 1); inp.dispatchEvent(new Event('input', { bubbles: true })); await wait(ms + Math.round(ms * .35 * Math.sin(i * 1.7)), my); }
  }
  async function play(from) {
    var my = ++run, k = from; touched = false;
    try {
      for (;;) {
        if (k === 0) {
          setStep(0); await load('login.html', my);
          await wait(900, my);
          var mail = await until(function () { return doc().querySelector('input[type="email"]'); }, my);
          var pass = doc().querySelector('input[type="password"]'), sign = doc().querySelector('button[type="submit"]');
          /* No password field and no form submit: a browser must not offer to save anything. The dots are typed as plain dots. */
          var cs = doc().defaultView.getComputedStyle(pass), keep = {};
          ['width', 'height', 'boxSizing', 'display', 'margin', 'padding', 'border', 'borderRadius', 'background', 'font', 'color', 'outline', 'letterSpacing'].forEach(function (k) { keep[k] = cs[k]; });
          pass.type = 'text'; pass.setAttribute('autocomplete', 'off'); pass.setAttribute('data-lpignore', 'true'); pass.setAttribute('data-1p-ignore', '');
          for (var k2 in keep) pass.style[k2] = keep[k2];
          pass.style.border = ''; pass.style.borderWidth = cs.borderWidth; pass.style.borderStyle = 'solid';
          var form = sign.form; if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
          await move(mail, my, 0.3); await press(my); await wait(250, my);
          await type(mail, 'maya.chen@northwind.com', 44, my);
          await wait(300, my);
          await move(pass, my, 0.3, 520); await press(my); mail.classList.remove('is-focus'); pass.classList.add('is-focus');
          await wait(250, my);
          await type(pass, '•••••••••••', 58, my);
          await wait(380, my);
          await move(sign, my, 0.5, 620); await press(my);
          var nav = new Promise(function (res) { frame.addEventListener('load', res, { once: true }); });
          frame.src = BASE + 'studio.html?welcome=1'; await nav; stepDone = true; k = 1;
        } else if (k === 1) { await load('studio.html?welcome=1', my); }
        else { await load('studio.html', my); }

        if (k === 1) {
          setStep(1);
          var later = await until(function () { var b = doc().getElementById('wl-later'); return b && b.offsetWidth ? b : null; }, my);
          await wait(3000, my);
          await move(later, my); await press(my); later.click(); stepDone = true;
          await wait(1200, my); k = 2;
        }

        var ta = await until(function () { return [].filter.call(doc().querySelectorAll('textarea'), function (t) { return t.offsetWidth > 0; })[0]; }, my);
        var box = ta.closest('.cmp') || ta.parentElement.parentElement, feed = function () { ta.dispatchEvent(new Event('input', { bubbles: true })); };
        if (k === 2) {
          setStep(2);
          await move(ta, my, 0.25); await press(my); box.classList.add('is-focus');
          await wait(420, my);
          for (var i = 0; i < ASK.length; i++) { ta.value = ASK.slice(0, i + 1); feed(); await wait(34 + (ASK[i] === ' ' ? 30 : 0) + Math.round(14 * Math.sin(i * 1.7)), my); }
          stepDone = true; await wait(650, my);
        } else { ta.value = ASK; feed(); await wait(500, my); }

        setStep(3);
        var send = box.querySelector('.send') || doc().querySelector('.send');
        await move(send, my); await press(my); send.click();
        await wait(500, my);
        ptr.style.transitionDuration = '900ms'; ptr.style.translate = at(1180, 700);
        await until(function () { return /app is ready/.test(doc().body.innerText); }, my, 30000);
        stepDone = true;
        await wait(3800, my);
        k = 0;
      }
    } catch (e) { if (!(e instanceof Stale)) throw e; }
  }

  pp.addEventListener('click', function () {
    paused = !paused; button();
    if (!paused && (touched || !started)) { started = true; play(step); }
  });
  items.forEach(function (li, i) {
    li.querySelector('button').addEventListener('click', function () { paused = false; started = true; button(); setStep(i); play(i); });
  });
  /* The frames never take the pointer (owner, 22.11.2026: a hover inside the app broke the staged steps). */
  /* Inside a rounded frame the app's sidebar sits too close to the corner: a little more room, here only. */
  frame.addEventListener('load', function () { try { var st = doc().createElement('style'); st.textContent = '.side{box-sizing:border-box!important;padding:26px 16px 24px 22px!important}'; doc().head.appendChild(st); } catch (e) {} });
  frame.addEventListener('load', function () { try { doc().addEventListener('pointerdown', function () { if (paused) touched = true; }); } catch (e) {} });
  new IntersectionObserver(function (es) {
    inView = es[0].isIntersecting;
    if (inView && !started && !paused) { started = true; play(0); }
  }, { threshold: 0.35 }).observe(stage);
  button(); setStep(0);
})();

/* The Topics block: one screen at two fidelities, side by side under one line the reader moves (owner, 23.11.2026: "a line you can move to
   compare the two versions"). Two live pages, the wireframe underneath and the finished one above it, cut at the line. Nothing plays by itself:
   the line arrives once from the right edge to the middle, then it is the reader's. */
(function () {
  var fig = document.querySelector('#design-lab .tp-fig');
  if (!fig) return;
  var stage = fig.querySelector('.hs-win'), lo = fig.querySelector('.tp-app');
  var hi = lo.cloneNode(false); hi.classList.add('tp-hi'); hi.setAttribute('data-src', lo.getAttribute('data-src').replace('topics=lo', 'topics=hi')); hi.setAttribute('title', 'Hear Studio, the Topics screen, finished'); hi.setAttribute('tabindex', '-1'); lo.setAttribute('tabindex', '-1');
  stage.appendChild(hi);
  var cut = document.createElement('div'); cut.className = 'tp-cut'; cut.setAttribute('role', 'slider'); cut.tabIndex = 0;
  cut.setAttribute('aria-label', 'Compare the two versions: wireframe on the left, finished screen on the right'); cut.setAttribute('aria-valuemin', '0'); cut.setAttribute('aria-valuemax', '100');
  cut.innerHTML = '<i></i>'; stage.appendChild(cut);
  var ends = document.createElement('div'); ends.className = 'tp-ends'; ends.setAttribute('aria-hidden', 'true'); ends.innerHTML = '<span>Low fidelity</span><span>High fidelity</span>';
  fig.querySelector('.ct-stage').insertAdjacentElement('afterend', ends);
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 1440, p = calm ? 50 : 96, n = 0, seen = false, came = calm, used = false;
  function draw() { hi.style.clipPath = 'inset(0 0 0 ' + (3 + p / 100 * (W - 6)).toFixed(1) + 'px)'; cut.style.left = p + '%'; ends.style.setProperty('--p', p + '%'); cut.setAttribute('aria-valuenow', Math.round(p)); cut.setAttribute('aria-valuetext', Math.round(p) + '% wireframe'); }
  /* both pages are drawn at the same size so they line up to the pixel: 1440 in a wide frame, 860 without the sidebar in a medium one, a tall 460 on a phone */
  function fit() {
    var cw = stage.clientWidth, t = cw >= 900 ? [1440, 810, ''] : cw >= 560 ? [860, 484, 's'] : [460, 560, 'p']; W = t[0];
    [lo, hi].forEach(function (f) {
      f.style.width = t[0] + 'px'; f.style.height = t[1] + 'px';
      try { var c = f.contentDocument.documentElement.classList; c.toggle('px-small', t[2] !== ''); c.toggle('px-phone', t[2] === 'p'); f.contentWindow.dispatchEvent(new Event('resize')); } catch (e) {}
    });
    stage.style.aspectRatio = (t[0] - 6) + ' / ' + (t[1] - 6); fig.style.setProperty('--s', cw / (t[0] - 6)); draw();
  }
  new ResizeObserver(fit).observe(stage); fit();
  function arrive() {
    if (came || !seen || n < 2) return; came = true;
    var t0 = performance.now() + 500, from = p;
    (function step(t) {
      if (used) return;
      var k = Math.max(0, Math.min(1, (t - t0) / 900)); k = 1 - Math.pow(1 - k, 3);
      p = from + (50 - from) * k; draw(); if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  [lo, hi].forEach(function (f, i) {
    f.addEventListener('load', function () {
      if (!f.getAttribute('src')) return;
      try {
        var d = f.contentDocument, st = d.createElement('style');
        st.textContent = '.side{box-sizing:border-box!important;padding:22px 14px 20px 18px!important}.tp-tip{display:none!important}' +
          '.px-small .side{display:none!important}.px-small .stage{--side:0px!important}' +
          '.px-phone .tp-col:last-child,.px-phone .tp-def p,.px-phone .tp-def .tp-n,.px-phone .top .act,.px-phone .tp-kpis>div:nth-child(n+3),.px-phone .tp-h .tp-n,.px-phone .tp-h .sub,.px-phone .key .tp-n,.px-phone .tp-hint{display:none!important}' +
          '.px-phone .tp-body{grid-template-columns:minmax(0,1fr)!important}.px-phone .tp .card{padding:20px 20px 14px!important}.px-phone .tp .top p{white-space:normal}';
        d.head.appendChild(st); fit();
        f.contentWindow.hearTopics.fidelity(i ? 'hi' : 'lo');
      } catch (e) {}
      n++; if (n === 2) { fig.classList.add('is-live'); arrive(); }
    });
  });
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { lo.src = lo.getAttribute('data-src'); hi.src = hi.getAttribute('data-src'); io.disconnect(); } }, { rootMargin: '700px 0px' }).observe(stage);
  new IntersectionObserver(function (es, io) { if (es[0].isIntersecting) { seen = true; io.disconnect(); arrive(); } }, { threshold: 0.5 }).observe(stage);
  function to(x) { var r = stage.getBoundingClientRect(); p = Math.max(4, Math.min(96, (x - r.left) / r.width * 100)); used = came = true; draw(); }
  cut.addEventListener('pointerdown', function (e) { cut.setPointerCapture(e.pointerId); fig.classList.add('is-drag'); to(e.clientX); e.preventDefault(); });
  cut.addEventListener('pointermove', function (e) { if (cut.hasPointerCapture(e.pointerId)) to(e.clientX); });
  ['pointerup', 'pointercancel'].forEach(function (ev) { cut.addEventListener(ev, function () { fig.classList.remove('is-drag'); }); });
  cut.addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowRight' ? 4 : e.key === 'ArrowLeft' ? -4 : e.key === 'Home' ? -100 : e.key === 'End' ? 100 : 0; if (!d) return;
    e.preventDefault(); p = Math.max(4, Math.min(96, p + d)); used = came = true; draw();
  });
  draw();
})();
