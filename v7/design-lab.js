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
