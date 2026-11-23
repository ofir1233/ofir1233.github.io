/* FYI case study, layer: The structure.
   Five stops on one line. Choosing a stop lights the line from the first message to it and says its rule.
   At rest the whole line is lit and the sentence is the claim. Nothing plays by itself: the line is drawn once on arrival. */
(function () {
  var root = document.getElementById('fya-map'); if (!root) return;
  var box = root.querySelector('.fym'), say = root.querySelector('.fym-say');
  var nodes = [].slice.call(root.querySelectorAll('.fym-n'));
  if (!box || nodes.length < 2) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CLAIM = say ? say.textContent : '';
  var RULE = nodes.map(function (n) { var r = n.querySelector('.fym-r'); return r ? r.textContent : ''; });

  /* the parts, from the app's own kit */
  var K = window.FX && window.FX.k;
  function fill(name, html) { var el = root.querySelector('[data-m="' + name + '"]'); if (el) el.innerHTML = '<span class="fym-k fx-app fx-static fya-kit">' + html + '</span>'; }
  if (K) try {
    fill('voice', K.voice({ o: true, n: 25 }));
    fill('ai', K.ai({ title: 'Catch up', body: '<ul><li>Launch night is on.<br>' + K.src('Kofi · Wed 6:40 PM') + '</li></ul>' }));
    fill('task', K.b('I\'ll have the visualizer cut by Nov 12.', { who: 't' }) + K.chip('Visualizer cut · Nov 12', 'appr').replace('class="a-chip', 'class="a-chip t4-chip'));
    var fld = function (k, v) { return '<div class="a-fld"><div class="k">' + k + '<span class="sg">from message</span></div><div class="v">' + v + '</div></div>'; };
    fill('event', fld('When', 'Fri, Nov 20 · Doors 9 PM') + fld('Where', 'Dock Hall 3'));
  } catch (e) {}

  /* the parts are fixed sizes: scale them to the tile */
  function fit() {
    var t = root.querySelector('.fym-mini'); if (!t || !t.clientWidth) return;
    var pad = parseFloat(getComputedStyle(t).paddingLeft) || 16;
    box.style.setProperty('--z', Math.max(.4, Math.min(.86, (t.clientWidth - pad * 2) / 256)).toFixed(3));
  }
  fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(box); else addEventListener('resize', fit);

  /* choose a stop. -1 is rest: the whole line, and the claim */
  var pin = -1, cur = -2, swapT = 0, want = CLAIM, narrow = matchMedia('(max-width: 960px)');
  function show(i) {
    if (i === cur) return; cur = i;
    var rest = i < 0;
    box.classList.toggle('has', !rest);
    nodes.forEach(function (n, k) {
      n.classList.toggle('on', rest || k < i);
      n.classList.toggle('hit', rest || k <= i);
      n.classList.toggle('sel', k === i);
      n.classList.toggle('off', !rest && k > i);
    });
    if (!say) return;
    /* narrow: the rule sits under the chosen stop, so the claim stays on top */
    var txt = rest || narrow.matches ? CLAIM : RULE[i];
    if (txt === want) return; want = txt;
    var put = function () { say.textContent = txt; say.classList.remove('swap'); };
    clearTimeout(swapT);
    if (reduce) return put();
    say.classList.add('swap'); swapT = setTimeout(put, 150);
  }
  function press(i) {
    pin = i;
    nodes.forEach(function (n, k) { n.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    show(i);
  }
  function rove(i) { nodes.forEach(function (n, k) { n.tabIndex = k === i ? 0 : -1; }); }

  var hoverT = 0, fine = matchMedia('(hover: hover) and (pointer: fine)').matches, row = root.querySelector('.fym-row');
  nodes.forEach(function (n, i) {
    n.addEventListener('click', function () { rove(i); press(pin === i ? -1 : i); });
    n.addEventListener('focus', function () { rove(i); if (n.matches(':focus-visible')) show(i); });
    n.addEventListener('blur', function () { show(pin); });
    if (fine) n.addEventListener('pointerenter', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { show(i); }, 120); });
    n.addEventListener('keydown', function (e) {
      var to = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? nodes.length - 1 : -1;
      if (e.key === 'Escape') { press(-1); return; }
      if (to >= 0 && to < nodes.length) { e.preventDefault(); rove(to); nodes[to].focus(); show(to); }
    });
  });
  if (fine && row) row.addEventListener('pointerleave', function () { clearTimeout(hoverT); show(pin); });
  rove(0);

  /* arrival: the line is drawn once, from the first message to the public page */
  function held() { return !!(window.FX && window.FX.held); }
  if (reduce || held() || !('IntersectionObserver' in window)) { show(-1); return; }
  var io = new IntersectionObserver(function (es) {
    if (!es[0].isIntersecting) return;
    io.disconnect();
    if (cur !== -2) return; // the reader got here first
    box.classList.add('draw'); void box.offsetWidth;
    show(-1);
    setTimeout(function () { box.classList.remove('draw'); }, 800);
  }, { threshold: .35 });
  io.observe(box);
})();
