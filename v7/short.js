/* THE SHORT VERSION. Hear's Newsroom tells a month of calls as a short story on blue slides. The same format tells this portfolio:
   six slides, thirty seconds, for a reader who has no more than that. Every line on a slide is already written on the page
   (the headline, the four figures under it, How I work, Product, Experience); nothing here is a new claim.
   One button in the top bar opens it. It is a dialog: Esc closes it, the arrows move, Space pauses, the six lines of the clock
   are six buttons. */
(function () {
  var openers = document.querySelectorAll('[data-short]');
  if (!openers.length || typeof HTMLDialogElement !== 'function') { [].forEach.call(openers, function (b) { b.hidden = true; }); return; }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* the five timed slides add up to thirty seconds */
  var S = [
    { k: 'Ofir Nona, the short version', h: 'Six years of product design, in thirty seconds.', p: 'In the format of Newsroom, a screen I designed for Hear.', ms: 6000 },
    { k: 'Before Hear, at Tap Mobile', n: 100, suf: ' million', p: 'Downloads of one of the consumer apps I worked on.', ms: 5000 },
    { k: 'Years as the only designer at Hear', n: 3, suf: '+', p: 'An AI product that reads every call in a contact center.', ms: 5000 },
    { k: 'What I designed there', h: 'Five product areas on one design system.', p: '<span>Topics · Compliance</span><i class="j"></i><span>Agent evaluation · Actions</span><br><span>Newsroom, Data &amp; Signals</span>', list: true, ms: 6000 },
    { k: 'How I work', h: 'I design and build with Claude Code.', p: 'I design in a working React app.<br>My <span>front-end</span> code goes into Hear through pull requests.', ms: 8000 },
    { k: 'That was the short version', h: 'I design experiences for AI products.', p: 'The long version is one scroll away.', end: true, ms: 0 }
  ];
  var dlg = null, card, live, slides, segs, pp, count, k = 0, t = 0, paused = reduce, raf = 0, last = 0, from = null, shut = 0, num = 0;

  function build() {
    dlg = document.createElement('dialog');
    dlg.className = 'sv'; dlg.tabIndex = -1; dlg.setAttribute('aria-label', 'Ofir Nona, the short version: six slides');
    var h = '<div class="sv-card"><button type="button" class="sv-x" aria-label="Close"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="sv-slides">';
    S.forEach(function (s, i) {
      h += '<div class="sv-s' + (s.n != null ? ' is-num' : '') + (s.list ? ' is-list' : '') + (s.end ? ' is-end' : '') + '" data-i="' + i + '" hidden><small>' + s.k + '</small>' +
        /* the number a reader sees counts up; a screen reader hears the number itself, once */
        (s.n != null ? '<h3><span class="sv-n" aria-hidden="true" data-n="' + s.n + '">' + s.n + '</span><span class="sv-vh">' + s.n + '</span>' + (s.suf.charAt(0) === ' ' ? '<i>' + s.suf + '</i>' : '<i class="sup">' + s.suf + '</i>') + '</h3>' : '<h3>' + s.h + '</h3>') +
        (s.p ? '<p>' + s.p + '</p>' : '') +
        (s.end ? '<div class="sv-act"><a class="sv-go" href="#contact">Contact me</a><button type="button" class="sv-more">See the work</button></div>' : '') + '</div>';
    });
    h += '</div><div class="sv-bar"><button type="button" class="sv-pp">Pause</button><ol class="sv-segs">' + S.map(function (s, i) { return '<li><button type="button" aria-label="Slide ' + (i + 1) + ' of ' + S.length + '"><b><i></i></b></button></li>'; }).join('') + '</ol><p class="sv-c" aria-hidden="true"></p></div></div>';
    dlg.innerHTML = h;
    document.body.appendChild(dlg);
    card = dlg.querySelector('.sv-card'); live = dlg.querySelector('.sv-slides'); slides = [].slice.call(dlg.querySelectorAll('.sv-s')); segs = [].slice.call(dlg.querySelectorAll('.sv-segs i'));
    pp = dlg.querySelector('.sv-pp'); count = dlg.querySelector('.sv-c');
    dlg.querySelector('.sv-x').addEventListener('click', close);
    dlg.querySelector('.sv-more').addEventListener('click', function () { var top = scrollY < 240, el = document.getElementById('design-lab'); close(); if (top && el) setTimeout(function () { el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 220); });
    dlg.querySelector('.sv-go').addEventListener('click', function () {
      close(true);
      setTimeout(function () { var c = document.getElementById('contact-h'); if (c) { c.tabIndex = -1; c.focus({ preventScroll: true }); } }, 280);
    });
    pp.addEventListener('click', function () { if (k === S.length - 1) { go(0); paused = reduce; } else paused = !paused; label(); });
    [].forEach.call(dlg.querySelectorAll('.sv-segs button'), function (b, i) { b.addEventListener('click', function () { go(i); }); });
    /* a press on the slide moves it: the right two thirds go on, the left third goes back. The foot is not part of it. */
    card.addEventListener('click', function (e) {
      if (e.target.closest('button, a, .sv-bar')) return;
      var r = card.getBoundingClientRect(); if ((e.clientX - r.left) < r.width * .34) go(k - 1); else go(k + 1);
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });       /* a press on the haze around the card */
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(k + 1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(k - 1); }
      else if (e.key === ' ' && !e.target.closest('button, a')) { e.preventDefault(); pp.click(); }
      else if (/^(PageDown|PageUp|ArrowDown|ArrowUp|Home|End)$/.test(e.key)) e.preventDefault();
    });
    /* the page behind stays where it is (two fingers may still zoom) */
    dlg.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    dlg.addEventListener('touchmove', function (e) { if (!e.touches || e.touches.length < 2) e.preventDefault(); }, { passive: false });
  }
  function label() {
    var endS = k === S.length - 1;
    pp.textContent = endS ? 'Replay' : paused ? 'Play' : 'Pause';
    card.classList.toggle('at-end', endS);
    /* slides that change by themselves are not read out one over the other; a held slide is */
    live.setAttribute('aria-live', paused || endS ? 'polite' : 'off');
  }
  function go(i) {
    if (i < 0) i = 0; if (i > S.length - 1) return;
    k = i; t = 0;
    slides.forEach(function (el, j) { el.hidden = j !== k; el.classList.remove('in'); });
    var el = slides[k]; void el.offsetWidth; el.classList.add('in');
    segs.forEach(function (s, j) { s.style.transform = 'scaleX(' + (j < k || (j === k && !S[k].ms) ? 1 : 0) + ')'; });
    [].forEach.call(dlg.querySelectorAll('.sv-segs button'), function (b, j) { if (j === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    count.textContent = (k + 1) + ' / ' + S.length;
    /* a large number counts up to itself; from 0 to 3 is three ticks and reads as a flicker, so a small one just stands */
    var n = el.querySelector('.sv-n'); num = 0;
    if (n) { if (reduce || +n.getAttribute('data-n') < 10) n.textContent = n.getAttribute('data-n'); else { n.textContent = '0'; num = performance.now(); } }
    label();
  }
  function tick(now) {
    raf = requestAnimationFrame(tick);
    var dt = Math.min(120, now - last); last = now;
    if (num) {
      var el = slides[k].querySelector('.sv-n'), to = +el.getAttribute('data-n'), u = Math.min(1, (now - num - 260) / 900);
      if (u > 0) el.textContent = String(Math.round(to * (1 - Math.pow(1 - u, 3))));
      if (u >= 1) num = 0;
    }
    if (paused || document.hidden || !S[k].ms) return;
    t += dt;
    segs[k].style.transform = 'scaleX(' + Math.min(1, t / S[k].ms).toFixed(4) + ')';
    if (t >= S[k].ms) go(k + 1);
  }
  function open(e) {
    if (!dlg) build();
    if (dlg.open && !dlg.classList.contains('out')) return;
    /* a press while the card is still leaving brings it back */
    clearTimeout(shut); from = e && e.currentTarget; paused = reduce;
    dlg.classList.remove('out'); if (!dlg.open) dlg.showModal(); go(0);
    pp.focus({ preventScroll: true });
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  }
  function close(keep) {
    if (!dlg || !dlg.open) return;
    cancelAnimationFrame(raf);
    var done = function () { clearTimeout(shut); dlg.classList.remove('out'); if (dlg.open) dlg.close(); if (keep !== true && from && from.focus) from.focus({ preventScroll: true }); };
    if (reduce) done(); else { dlg.classList.add('out'); shut = setTimeout(done, 200); }
  }
  [].forEach.call(openers, function (b) { b.addEventListener('click', open); });
})();
