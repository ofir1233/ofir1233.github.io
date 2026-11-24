/* v7 - cs2: the case page's two controls, and the running head. Styles and reasons: v7/cs2.css.
   - Steppers (.c2-steps): tabs and back/next buttons, arrow keys inside the tab list. Nothing advances by itself.
   - Live product (.c2-live button): the real screen loads in a frame only when the reader asks, scaled to the column.
   - The top bar's running head and progress line, from the sections' data-ch. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('.c2-steps'), function (box) {
    var tabs = [].slice.call(box.querySelectorAll('.c2-tab')), panels = [].slice.call(box.querySelectorAll('.c2-panel')),
      prev = box.querySelector('[data-go="-1"]'), next = box.querySelector('[data-go="1"]'), count = box.querySelector('.c2-nav span'), cur = 0;
    function show(i, focus) {
      cur = Math.max(0, Math.min(tabs.length - 1, i));
      tabs.forEach(function (t, k) { var on = k === cur; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; panels[k].hidden = !on; });
      if (prev) prev.disabled = cur === 0; if (next) next.disabled = cur === tabs.length - 1;
      if (count) count.textContent = (cur + 1) + ' of ' + tabs.length;
      if (focus) tabs[cur].focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { show(k); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, true); }
      });
    });
    if (prev) prev.addEventListener('click', function () { show(cur - 1); });
    if (next) next.addEventListener('click', function () { show(cur + 1); });
    show(0);
  });

  [].forEach.call(document.querySelectorAll('[data-live]'), function (btn) {
    var frame = document.getElementById(btn.getAttribute('aria-controls')); if (!frame) return;
    function fit() { var f = frame.querySelector('iframe'); if (f) f.style.transform = 'scale(' + (frame.clientWidth / 1440) + ')'; }
    btn.addEventListener('click', function () {
      var open = frame.hidden;
      if (open && !frame.querySelector('iframe')) {
        var f = document.createElement('iframe'); f.src = btn.getAttribute('data-live'); f.title = btn.getAttribute('data-title') || 'The live screen'; f.loading = 'eager';
        frame.appendChild(f);
      }
      frame.hidden = !open; btn.setAttribute('aria-expanded', open);
      var t = btn.querySelector('.c2-bt'); if (t) t.textContent = open ? btn.getAttribute('data-close') : btn.getAttribute('data-open');
      if (open) { fit(); frame.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }
    });
    addEventListener('resize', fit);
  });

  /* phones: a wide annotated still (one with pins and wider than 1.3:1) is wrapped so it can be panned, pins and all */
  [].forEach.call(document.querySelectorAll('.c2 .c2-shot'), function (shot) {
    var img = shot.querySelector(':scope > img'); if (!img || !shot.querySelector(':scope > .c2-pin')) return;
    var w = +img.getAttribute('width'), h = +img.getAttribute('height'); if (!w || !h || w / h < 1.3) return;
    var pan = document.createElement('div'); pan.className = 'c2-pan';
    [].slice.call(shot.children).forEach(function (n) { if (n === img || n.classList.contains('c2-pin')) pan.appendChild(n); });
    shot.insertBefore(pan, shot.firstChild); shot.classList.add('is-pan');
    var hint = document.createElement('span'); hint.className = 'c2-panhint'; hint.textContent = 'Drag the picture sideways to see all of it.';
    shot.parentNode.insertBefore(hint, shot.nextSibling);
    /* open the pan on the pins (their mean position), not on the picture's left edge */
    function aim() { if (shot.scrollWidth <= shot.clientWidth) return; var xs = [].map.call(pan.querySelectorAll('.c2-pin'), function (p) { return parseFloat(p.style.getPropertyValue('--x')) || 50; });
      var m = xs.reduce(function (a, b) { return a + b; }, 0) / xs.length; shot.scrollLeft = Math.max(0, pan.offsetWidth * m / 100 - shot.clientWidth / 2); }
    if (img.complete) aim(); else img.addEventListener('load', aim, { once: true }); addEventListener('resize', aim);
  });

  var run = document.querySelector('.tb-run .tb-ch'), bar = document.querySelector('.topbar .progress'), secs = [].slice.call(document.querySelectorAll('.c2 [data-ch]')), raf = 0, said = '';
  function spy() {
    raf = 0; var line = innerHeight * .38, txt = '';
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line) txt = s.getAttribute('data-ch'); });
    if (run && txt !== said) { said = txt; run.textContent = txt ? '· ' + txt : ''; }
    if (bar) { var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; bar.style.transformOrigin = '0 50%'; }
  }
  addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(spy); }, { passive: true });
  spy();
})();
