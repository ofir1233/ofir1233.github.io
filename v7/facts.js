/* v7 - facts: the four figures on the opening picture, one at a time (v7/facts.css). They turn on a clock once the picture has
   grown; the scroll only decides whether they are there. Pointing at a figure in the list opens it and holds it. */
(function () {
  var about = document.getElementById('about'), pin = about && about.querySelector('.me-pin'), ol = about && about.querySelector('ol.me-facts');
  if (!pin || !ol) return;
  var lis = [].slice.call(ol.children), wide = matchMedia('(min-width: 861px)'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dial = document.createElement('div'); dial.className = 'me-dial';
  var short = lis.map(function (li) { var v = li.querySelector('.me-v'), s = v.querySelector('small'); return s ? v.textContent.replace(s.textContent, '').trim() + 'M' : v.textContent.trim(); });
  var btns = lis.map(function (li, i) { var b = document.createElement('button'); b.type = 'button'; b.textContent = short[i]; b.setAttribute('aria-label', li.querySelector('.me-k').textContent + ': ' + li.querySelector('.me-v').textContent.trim()); dial.appendChild(b); return b; });
  ol.parentNode.insertBefore(dial, ol.nextSibling);
  var cur = -1, timer = 0, held = false, HOLD = 2800;
  function show(i) {
    if (i === cur) return;
    lis.forEach(function (li, k) { li.classList.toggle('was', k === cur && cur !== -1); li.classList.toggle('cur', k === i); });
    btns.forEach(function (b, k) { b.classList.toggle('on', k === i); });
    cur = i;
  }
  function tick() { clearTimeout(timer); if (reduce || held || !pin.classList.contains('me-grown')) return; timer = setTimeout(function () { show((cur + 1) % lis.length); tick(); }, HOLD); }
  btns.forEach(function (b, i) {
    b.addEventListener('mouseenter', function () { held = true; clearTimeout(timer); show(i); });
    b.addEventListener('focus', function () { held = true; clearTimeout(timer); show(i); });
    b.addEventListener('click', function () { show(i); });
  });
  dial.addEventListener('mouseleave', function () { held = false; tick(); });
  dial.addEventListener('focusout', function () { held = false; tick(); });
  function state() { if (!wide.matches) { clearTimeout(timer); return; } if (pin.classList.contains('me-grown')) { if (cur === -1) show(0); tick(); } else { clearTimeout(timer); lis.forEach(function (li) { li.classList.remove('was'); }); show(0); } }
  new MutationObserver(state).observe(pin, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else tick(); });
  show(0); state();
})();
