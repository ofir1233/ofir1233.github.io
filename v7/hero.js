/* v7 - header.
   - once the page has moved the bar takes a paper ground (html.hv-stuck);
   - the section links sit in a capsule, and a soft pill slides to the link under the pointer, then back to the section being read. */
(function(){
  var root = document.documentElement, on = null, nav = document.querySelector('nav.nav');
  function set(){
    var s = scrollY > 8; if (s !== on) { on = s; root.classList.toggle('hv-stuck', s); }
  }
  /* a 9px mark at the top of the page says when the page has moved, so a scroll never has to measure the page for it */
  if ('IntersectionObserver' in window && document.body) {
    var mark = document.createElement('div'); mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:9px;pointer-events:none;visibility:hidden';
    document.body.appendChild(mark);
    new IntersectionObserver(function(es){ var s = !es[es.length - 1].isIntersecting; if (s !== on) { on = s; root.classList.toggle('hv-stuck', s); } }).observe(mark);
  } else { addEventListener('scroll', set, { passive: true }); addEventListener('resize', set); }
  set();
  if (!nav) return;
  var ul = nav.querySelector('ul'); if (!ul) return;

  var cap = document.createElement('span'), ind = document.createElement('span');
  cap.className = 'hv-cap'; ind.className = 'hv-ind'; cap.setAttribute('aria-hidden', 'true'); ind.setAttribute('aria-hidden', 'true');
  ul.insertBefore(ind, ul.firstChild); ul.insertBefore(cap, ul.firstChild);
  var hover = null, point = null, wait = 0, arrived = false;
  function links(){ return [].filter.call(ul.querySelectorAll('li > a[href^="#"]'), function(a){ return a.offsetParent && a.parentNode !== ul.lastElementChild && !a.closest('li:last-of-type'); }); }
  function place(){
    var ls = links(); if (!ls.length) { cap.style.opacity = ind.style.opacity = 0; return; }
    var r = ul.getBoundingClientRect(), a = ls[0].getBoundingClientRect(), b = ls[ls.length - 1].getBoundingClientRect();
    cap.style.opacity = 1; cap.style.left = (a.left - r.left - 5) + 'px'; cap.style.width = (b.right - a.left + 10) + 'px';
    var now = point || ul.querySelector('li > a[aria-current]'), t = hover || now;
    ls.forEach(function(l){ l.classList.toggle('hv-on', l === t); });
    /* the dot is where the reader is, not where the pointer is: it travels from link to link, and between two named parts
       (the decisions, the plan, the postcard) it waits under the last one as a ring */
    if (now && ls.indexOf(now) < 0) now = null;
    var d = now;
    if (!d) ls.forEach(function(l){ var sec = document.getElementById(l.getAttribute('href').slice(1)); if (sec && sec.getBoundingClientRect().top < innerHeight * .5) d = l; });   /* the last named part already passed, by its place on the page */
    /* the ring waits only while its part is still on screen; once that part has left the window, nothing is marked */
    if (!now && d) { var ds = document.getElementById(d.getAttribute('href').slice(1)); if (ds && ds.getBoundingClientRect().bottom < innerHeight * .25) d = null; }
    if (!d) { ind.style.opacity = 0; return; }
    /* the journey ends at Contact: when the postcard is at reading height the dot travels to the Contact button (520ms) and goes into it; the button
       answers in blue for 600ms, once. Scrolling back up puts the dot back under the last part. */
    var ct = document.getElementById('contact'), cta = ul.querySelector('li:last-child > a[href="#contact"]');
    if (ct && cta && cta.offsetParent && !hover && ct.getBoundingClientRect().top < innerHeight * .5) {
      if (ind.style.opacity === '1' && !ind.classList.contains('gone')) { var c = cta.getBoundingClientRect(); ind.classList.add('gone'); ind.style.left = (c.left - r.left) + 'px'; ind.style.width = c.width + 'px';
        if (!arrived) { arrived = true; setTimeout(function(){ cta.classList.add('hv-arrive'); setTimeout(function(){ cta.classList.remove('hv-arrive'); }, 600); }, 420); } }
      else if (!ind.classList.contains('gone')) ind.style.opacity = 0;
      return; }
    if (ind.classList.contains('gone')) { ind.classList.remove('gone'); ind.style.opacity = 0; }
    ind.classList.toggle('rest', !now);
    var q = d.getBoundingClientRect(), fresh = ind.style.opacity !== '1';
    if (fresh) ind.style.transition = 'none';
    ind.style.left = (q.left - r.left) + 'px'; ind.style.width = q.width + 'px'; ind.style.top = (q.bottom - r.top - 6) + 'px';
    if (fresh) { ind.offsetWidth; ind.style.transition = ''; }
    ind.style.opacity = 1;
  }
  /* the eight-phase plan points back up the page: while a phase whose work is shown above is in hand, the dot stands under that part's name (plan.js) */
  window.v7NavPoint = function (sec) { var a = sec ? ul.querySelector('li > a[href="#' + sec + '"]') : null; if (a === point) return; point = a; place(); };
  ul.addEventListener('pointerover', function(e){ var a = e.target.closest && e.target.closest('a'); if (a && links().indexOf(a) >= 0) { hover = a; place(); } });
  ul.addEventListener('pointerleave', function(){ hover = null; place(); });
  ul.addEventListener('focusin', function(e){ if (links().indexOf(e.target) >= 0) { hover = e.target; place(); } });
  ul.addEventListener('focusout', function(){ hover = null; place(); });
  new MutationObserver(place).observe(ul, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  addEventListener('scroll', function(){ if (wait) return; wait = setTimeout(function(){ wait = 0; if (!ul.querySelector('li > a[aria-current]')) place(); }, 160); }, { passive: true });
  addEventListener('resize', place); if (document.fonts && document.fonts.ready) document.fonts.ready.then(place); place();
})();

/* On a phone the header pill floats over the text. It steps out of the way while the reader goes down, and is back the moment they turn up. */
(function () {
  var root = document.documentElement, nav = document.querySelector('nav.nav'); if (!nav) return;
  var small = window.matchMedia('(max-width: 899px)'), last = window.scrollY, tick = false;
  function run() {
    tick = false;
    var y = window.scrollY, d = y - last;
    if (!small.matches || y < 160) root.classList.remove('hv-down');
    else if (d > 8) root.classList.add('hv-down');
    else if (d < -8) root.classList.remove('hv-down');
    if (Math.abs(d) > 8) last = y;
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
  nav.addEventListener('focusin', function () { root.classList.remove('hv-down'); });
})();

/* The painter signs the sky (owner, 24.11.2026: bigger, on a slant, and blended in: "you can see the sky's brush strokes through the
   signature"). The writing is the footer's signature (one source: footer .ft-sig): its centre-line strokes are cloned into a mask
   that uncovers the name stroke by stroke. The name is not a white image laid on the sky: it is the sky's own paint, lightened toward
   white (feColorMatrix on the same sky picture), so every stroke of the blue runs on through the letters; the dark strokes let more blue
   through and the white catches on the light ridges, as a dry brush dragged over thick paint. A thin ridge of light and shade
   (img/me-v7-sky-sig-ridge.webp) gives the paint its body; the brush shape (thick on the downstrokes) is img/me-v7-sky-sig-shape.webp.
   Everything is laid on the painting's own pixels (viewBox = the 1920x1280 picture), rising to the right over the open sky between the
   trees; the front gulls and a wisp of cloud (.me-v7-front) cross it a little. It is written once: in the pinned stage as soon as the
   picture has grown to fill the stage (.me-grown, set by the page's pin script); in the plain layout 400 ms after the sky is in view.
   Never during the paint-in, and it never replays. Reduced motion: complete. */
(function () {
  var fig = document.querySelector('#about .me-photo.me-v7'), box = fig && fig.querySelector('.me-v7-sig'), src = document.querySelector('footer.ft .ft-sig');
  var pen = src && src.querySelector('mask > g');
  if (!box || !pen) return;
  /* where the name lies in the picture: wide windows show the whole sky, a phone a narrower slice of it, so there it is a little smaller */
  var NS = 'http://www.w3.org/2000/svg', small = matchMedia('(max-width: 860px)');
  function at(x, y, w) { return 'translate(' + x + ' ' + y + ') rotate(-8) scale(' + (w / 1203).toFixed(5) + ')'; }
  var T = small.matches ? at(440, 238, 800) : at(470, 228, 860);
  function el(name, at, kids) { var e = document.createElementNS(NS, name); for (var k in at) e.setAttribute(k, at[k]); (kids || []).forEach(function (c) { e.appendChild(c); }); return e; }
  var all = { maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1280 };
  var strokes = pen.cloneNode(true); strokes.setAttribute('transform', T); strokes.setAttribute('stroke-width', '36');
  var write = el('mask', Object.assign({ id: 'hsig-m' }, all), [strokes]);
  var shape = el('mask', Object.assign({ id: 'hsig-s' }, all), [el('image', { href: 'img/me-v7-sky-sig-shape.webp?v=2', width: 1203, height: 306, transform: T })]);
  var paint = el('filter', { id: 'hsig-f', filterUnits: 'userSpaceOnUse', x: 400, y: 80, width: 980, height: 390, 'color-interpolation-filters': 'sRGB' },
    [el('feColorMatrix', { type: 'matrix', values: '0 .55 0 0 .58  0 .55 0 0 .64  0 0 .3 0 .72  0 2.4 0 0 -.36' })]);
  /* the sky's own paint: the very file the page already chose for the sky picture (its width depends on the screen), never a second download */
  var pic = fig.querySelector('.me-v7-sky'), sky = el('image', { href: (pic && (pic.currentSrc || pic.src)) || 'img/me-v7-blvd-sky-1920.webp?v=3', width: 1920, height: 1280, preserveAspectRatio: 'none', filter: 'url(#hsig-f)' });
  var svg = el('svg', { viewBox: '0 0 1920 1280', focusable: 'false' }, [
    el('defs', {}, [write, shape, paint]),
    el('g', { mask: 'url(#hsig-m)' }, [el('g', { mask: 'url(#hsig-s)' }, [sky]), el('image', { href: 'img/me-v7-sky-sig-ridge.webp?v=2', width: 1203, height: 306, transform: T })])
  ]);
  box.appendChild(svg);
  if (pic && !pic.currentSrc) pic.addEventListener('load', function () { sky.setAttribute('href', pic.currentSrc || pic.src); }, { once: true });
  var placed = [strokes, shape.firstChild, svg.lastChild.lastChild];
  small.addEventListener && small.addEventListener('change', function () { T = small.matches ? at(440, 238, 800) : at(470, 228, 860); placed.forEach(function (e) { e.setAttribute('transform', T); }); });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  box.classList.add('js');
  var root = document.documentElement, pin = fig.closest('.me-pin'), signed = false, timer = 0, tick = false;
  function ready() {
    if (root.classList.contains('hp-wait') || root.classList.contains('hp-on')) return false; // a picture is signed when it is finished, not while it is being painted
    if (root.classList.contains('me-scroll')) return !!pin && pin.classList.contains('me-grown');
    var r = fig.getBoundingClientRect(); return r.top < innerHeight * .6 && r.bottom > 200;
  }
  function stop() { removeEventListener('scroll', ask); removeEventListener('resize', ask); if (mo) mo.disconnect(); if (mr) mr.disconnect(); }
  function check() {
    tick = false; if (signed) return;
    if (!ready()) { if (timer) { clearTimeout(timer); timer = 0; } return; }
    if (timer) return;
    timer = setTimeout(function () { timer = 0; if (!ready()) return; signed = true; box.classList.add('signed'); stop(); }, Math.max(root.classList.contains('me-scroll') ? 180 : 400, 1500 - performance.now()));
  }
  function ask() { if (!tick) { tick = true; requestAnimationFrame(check); } }
  var mo = pin && 'MutationObserver' in window ? new MutationObserver(ask) : null;
  if (mo) mo.observe(pin, { attributes: true, attributeFilter: ['class'] });
  var mr = 'MutationObserver' in window ? new MutationObserver(ask) : null;
  if (mr) mr.observe(root, { attributes: true, attributeFilter: ['class'] });
  addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); ask();
})();
