/* v7 - depth: the Studio pages inside a frame have their own depth (the sky moves one way, the glass plate leans the other; their
   listener is on the page's .stage). The frames never take the pointer, so the page outside passes the mouse on: only the position,
   never a hover or a click, so nothing inside lights up or opens. With no mouse over the frame, the picture drifts slowly by itself
   while it plays, so the depth is always there. Mouse devices only; nothing under reduced motion. */
window.v7Depth = function (frame, host) {
  var none = { drift: function () {} };
  if (!frame || !host || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover:hover) and (pointer:fine)').matches) return none;
  var over = false, on = false, raf = 0;
  /* Once an app is open, Studio itself only moves the sky a little. Inside a frame on this page the screen is a picture, not a tool:
     the sky travels further, and under the mouse the glass leans toward it. */
  var CSS = '@media (hover:hover) and (pointer:fine){.bg{scale:1.1!important;translate:calc(var(--tx,0)*-26px) calc(var(--ty,0)*-15px)!important}' +
    '.v7-over .glass.sx,.v7-over .glass.tp{transform:perspective(1900px) rotateX(calc(var(--ty,0)*-1.5deg)) rotateY(calc(var(--tx,0)*2deg))}}';
  function doc() { try { return frame.contentDocument; } catch (e) { return null; } }
  frame.addEventListener('load', function () {
    var d = doc(); if (!d || !d.head) return;
    var st = d.createElement('style'); st.textContent = CSS; d.head.appendChild(st);
  });
  function send(type, fx, fy) {
    try {
      var w = frame.contentWindow, d = frame.contentDocument, st = d && d.querySelector('.stage'); if (!st) return;
      var o = { bubbles: false, pointerType: 'mouse', clientX: fx * w.innerWidth, clientY: fy * w.innerHeight };
      st.dispatchEvent(new w.PointerEvent(type, o));
      var wl = d.getElementById('welcome'); if (wl && !wl.hidden) wl.dispatchEvent(new w.PointerEvent(type, o));
    } catch (e) {}
  }
  function mark(v) { var d = doc(); if (d && d.documentElement) d.documentElement.classList.toggle('v7-over', v); }
  host.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    if (!over) { over = true; mark(true); }
    var r = host.getBoundingClientRect(); send('pointermove', (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  });
  host.addEventListener('pointerleave', function () { over = false; mark(false); if (!on) send('pointerleave', .5, .5); });
  function loop(t) {
    raf = 0; if (!on) return;
    if (!over) { var a = t / 1000; send('pointermove', .5 + Math.sin(a * .5) * .3, .5 + Math.cos(a * .37) * .26); }
    raf = requestAnimationFrame(loop);
  }
  return { drift: function (v) { v = !!v; if (v === on) return; on = v; if (on) { if (!raf) raf = requestAnimationFrame(loop); } else if (!over) send('pointerleave', .5, .5); } };
};
