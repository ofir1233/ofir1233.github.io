/* v7 - the phone's tilt stands in for the mouse (owner, 24.11.2026: "the depth does not work on the phone; use the phone's sense of
   direction, it comes back all over the site"). On a touch screen every depth that follows the mouse on a desktop (the opening's layers,
   the How I work plates, the Topics window, the Studio frames, the FYI door and cut-out, the Hear page's posts) follows how the phone is
   held instead. A depth calls v7Gyro.watch(el, fn): fn(x, y) gets -1..1 while el is on screen, fn(0, 0, true) when it leaves.
   The rest is how the visitor holds the phone, and it follows them slowly (about 3 s), so only a turn of the wrist moves the picture,
   never the way they happen to hold it. About 16 degrees is the whole travel.
   iPhone asks the visitor once, on their first tap (the system's own question); if they say no, nothing changes and it never asks
   again in this tab. Android needs no question. Nothing with a mouse or with reduced motion. Pages that call watch() before this file
   has run use the small queue set in the page's <head> (window.v7Gyro.q). */
(function () {
  var q = (window.v7Gyro && window.v7Gyro.q) || [], list = [], io = null;
  var ok = false;
  try { ok = 'DeviceOrientationEvent' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
  if (ok && 'IntersectionObserver' in window) io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { list.forEach(function (w) { if (w.el !== e.target) return; w.on = e.isIntersecting; if (!w.on) w.fn(0, 0, true); }); });
  });
  window.v7Gyro = { watch: function (el, fn) { if (!ok || !el || !fn) return; list.push({ el: el, fn: fn, on: !io }); if (io) io.observe(el); } };
  q.forEach(function (a) { window.v7Gyro.watch(a[0], a[1]); });
  if (!ok) return;

  var b0 = null, g0 = 0, t0 = 0, x = 0, y = 0, raf = 0, SPAN = 16;
  function clamp(v) { return v < -1 ? -1 : v > 1 ? 1 : v; }
  function read(e) {
    if (e.beta == null || e.gamma == null) return;
    var a = (screen.orientation && screen.orientation.angle) || window.orientation || 0, b = e.beta, g = e.gamma, s;
    if (a === 90) { s = b; b = -g; g = s; } else if (a === -90 || a === 270) { s = b; b = g; g = -s; }   /* held sideways: the axes turn with it */
    var now = performance.now();
    if (b0 === null) { b0 = b; g0 = g; t0 = now; }
    var f = 1 - Math.exp(-Math.min(.25, (now - t0) / 1000) / 3); t0 = now;
    b0 += (b - b0) * f; g0 += (g - g0) * f;
    x += (clamp((g - g0) / SPAN) - x) * .4; y += (clamp((b - b0) / SPAN) - y) * .4;
    if (!raf) raf = requestAnimationFrame(send);
  }
  function send() { raf = 0; list.forEach(function (w) { if (w.on) w.fn(x, y, false); }); }
  /* listen at once (Android and most phones simply send it); only where nothing arrives and the browser has a question to ask
     (iPhone) is the visitor asked, on their next tap */
  var heard = false;
  addEventListener('deviceorientation', function (e) { if (e.beta != null) heard = true; read(e); }, { passive: true });
  var D = window.DeviceOrientationEvent;
  if (typeof D.requestPermission !== 'function') return;
  var said = null; try { said = sessionStorage.getItem('v7gyro'); } catch (e) {}
  if (said === 'no') return;
  function ask() {
    if (heard) { off(); return; }
    var p; try { p = D.requestPermission(); } catch (e) { return; }   /* not a tap the browser counts: wait for the next one */
    off();
    p.then(function (r) { if (r !== 'granted') try { sessionStorage.setItem('v7gyro', 'no'); } catch (e) {} }, function () { on(); });
  }
  function on() { addEventListener('click', ask, true); addEventListener('touchend', ask, true); }
  function off() { removeEventListener('click', ask, true); removeEventListener('touchend', ask, true); }
  setTimeout(function () { if (!heard) on(); }, 900);
})();
