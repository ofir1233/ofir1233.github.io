/* v7 - web-fyi: this section's behaviour. Loaded deferred, after the page's own scripts. */

// Brand & website: the v7 site itself runs in the frame. It is drawn at a real desktop (or phone) width and scaled to fit,
// so the type stays sharp. The page keeps its own scroll until the visitor clicks in; leaving the frame gives the scroll back.
(function () {
  var fig = document.querySelector('#web .wv'); if (!fig) return;
  var win = fig.querySelector('.wv-win'), frame = fig.querySelector('.wv-app'), go = fig.querySelector('.wv-go');
  var phone = matchMedia('(max-width: 700px)');
  function fit() { var w = phone.matches ? 390 : 1440; fig.style.setProperty('--s', (win.clientWidth / w).toFixed(5)); }
  fit(); addEventListener('resize', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(win);
  function on(v) { fig.classList.toggle('is-on', v); frame.tabIndex = v ? 0 : -1; var dn = win.querySelector('.wv-done'); if (dn) dn.tabIndex = v ? 0 : -1; if (v) { try { frame.contentWindow.focus(); } catch (e) {} } }
  go.addEventListener('click', function () { on(true); });
  fig.addEventListener('mouseleave', function () { on(false); });
  document.addEventListener('pointerdown', function (e) { if (!fig.contains(e.target)) on(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') on(false); });
  frame.addEventListener('load', function () {
    if (!frame.getAttribute('src')) return;
    fig.classList.add('is-live');
    try { frame.contentWindow.addEventListener('keydown', function (e) { if (e.key === 'Escape') { on(false); go.focus(); } }); } catch (e) {}
  });
  function load() { if (!frame.getAttribute('src')) frame.src = frame.getAttribute('data-src'); }
  /* The invitation. On touch the word is Tap. While the frame is in view and nobody is inside it, the page in the frame slides down
     a little and returns every few seconds, and the button plays one beat with it (v7/web-fyi.css). */
  var word = go.querySelector('b'); if (word && matchMedia('(hover: none)').matches) word.textContent = 'Tap to scroll the live site';
  /* On touch nothing visible lets the reader out of the frame, so a Done chip stands where the invitation was while the frame is theirs. */
  var done = document.createElement('button'); done.type = 'button'; done.className = 'wv-done'; done.tabIndex = -1;
  done.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>Done';
  done.setAttribute('aria-label', 'Done: give the scroll back to this page');
  done.addEventListener('click', function () { on(false); go.focus({ preventScroll: true }); });
  win.appendChild(done);
  /* The beat plays three times, then the invitation rests. */
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches, inView = false, raf = 0, timer = 0, beats = 0;
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function slide(from, to, ms, done) {
    var t0 = performance.now(), w; try { w = frame.contentWindow; } catch (e) { return; }
    (function step(now) {
      var t = Math.min(1, (now - t0) / ms);
      try { w.scrollTo({ top: from + (to - from) * ease(t), behavior: 'instant' }); } catch (e) { return; }
      if (t < 1 && !fig.classList.contains('is-on')) raf = requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  function beat() {
    if (!inView || document.hidden || fig.classList.contains('is-on')) return;
    if (++beats > 3) { clearInterval(timer); timer = 0; return; }
    go.classList.remove('beat'); void go.offsetWidth; go.classList.add('beat');
    var w, y; try { w = frame.contentWindow; y = w.scrollY; } catch (e) { return; }
    if (!fig.classList.contains('is-live') || y > 4) return;
    var d = phone.matches ? 210 : 170;
    setTimeout(function () { slide(0, d, 760, function () { setTimeout(function () { if (!fig.classList.contains('is-on')) slide(d, 0, 900); }, 520); }); }, 120);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      inView = es[0].isIntersecting;
      if (inView && !fig.classList.contains('seen')) { fig.classList.add('seen'); setTimeout(function () { fig.classList.add('ready'); }, 900); }
      clearInterval(timer); timer = 0;
      if (inView && !calm && beats < 3) { if (!beats) setTimeout(beat, 1300); timer = setInterval(beat, 6400); }
    }, { threshold: .55 }).observe(win);
  } else fig.classList.add('seen', 'ready');
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { load(); io.disconnect(); } }, { rootMargin: '700px 0px' }); io.observe(fig); } else load();
})();
