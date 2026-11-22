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
  function on(v) { fig.classList.toggle('is-on', v); frame.tabIndex = v ? 0 : -1; if (v) { try { frame.contentWindow.focus(); } catch (e) {} } }
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
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { load(); io.disconnect(); } }, { rootMargin: '700px 0px' }); io.observe(fig); } else load();
})();
