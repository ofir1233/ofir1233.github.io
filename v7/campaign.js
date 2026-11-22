/* v7 - campaign: the six LinkedIn paintings in one large post. Loaded deferred.
   It plays through the six once while it is on screen, then rests on the first. A click, a key or a pointer over it stops the playing.
   Only the picture on show and the next one are downloaded. */
(function () {
  var root = document.getElementById('campaign'); if (!root) return;
  var art = root.querySelector('.cw-art'), imgs = [].slice.call(art.querySelectorAll('img')), txt = root.querySelector('.cw-post-t');
  var btns = [].slice.call(root.querySelectorAll('.cw-rail button')), nEl = root.querySelector('.cw-n');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var k = 0, auto = !reduce, inView = false, over = false, timer = 0, swap = 0, D = 5200;
  root.style.setProperty('--cw-d', D + 'ms');

  function load(i) { var im = imgs[(i + imgs.length) % imgs.length]; if (im && !im.getAttribute('src')) im.src = im.getAttribute('data-src'); }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function show(i, user) {
    k = (i + imgs.length) % imgs.length;
    load(k); load(k + 1);
    imgs.forEach(function (im, j) { im.classList.toggle('on', j === k); });
    btns.forEach(function (b, j) { b.setAttribute('aria-pressed', j === k ? 'true' : 'false'); });
    art.setAttribute('aria-label', 'Enlarge the painting: ' + imgs[k].alt);
    if (nEl) nEl.textContent = two(k + 1) + ' / ' + two(imgs.length);
    var t = btns[k].getAttribute('data-t');
    clearTimeout(swap);
    if (reduce) txt.textContent = t;
    else { txt.classList.add('out'); swap = setTimeout(function () { txt.textContent = t; txt.classList.remove('out'); }, 260); }
    if (user) { auto = false; var b = btns[k]; if (b.scrollIntoView && b.offsetParent && root.querySelector('.cw-rail').scrollWidth > root.querySelector('.cw-rail').clientWidth + 4) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
    plan();
  }
  function plan() {
    clearTimeout(timer);
    var run = auto && inView && !over && !document.hidden;
    root.classList.remove('is-auto');
    if (!run) return;
    void root.offsetWidth; root.classList.add('is-auto');
    timer = setTimeout(function () { var n = (k + 1) % imgs.length; if (n === 0) auto = false; show(n); }, D);
  }
  btns.forEach(function (b, i) { b.addEventListener('click', function () { show(i, true); }); });
  root.querySelector('.cw-stage').addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { over = true; plan(); } });
  root.querySelector('.cw-stage').addEventListener('pointerleave', function () { over = false; plan(); });
  document.addEventListener('visibilitychange', plan);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView) { load(k); load(k + 1); } plan(); }, { threshold: .45 }).observe(root.querySelector('.cw-post'));
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { load(0); o.disconnect(); } }, { rootMargin: '600px 0px' }).observe(root);
  else load(0);

  /* the large view */
  var dlg;
  function open(src, alt, tall) {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'cw-dlg';
      dlg.innerHTML = '<img alt=""><button type="button" aria-label="Close">×</button>';
      document.body.appendChild(dlg);
      dlg.addEventListener('click', function () { dlg.close(); });
    }
    var im = dlg.querySelector('img'); im.src = src; im.alt = alt || '';
    dlg.classList.toggle('tall', !!tall);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.scrollTop = 0;
  }
  art.addEventListener('click', function () { auto = false; plan(); open(imgs[k].getAttribute('data-src'), imgs[k].alt); });
  [].forEach.call(root.querySelectorAll('[data-full]'), function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-full'), b.getAttribute('data-alt'), b.hasAttribute('data-tall')); }); });
})();
