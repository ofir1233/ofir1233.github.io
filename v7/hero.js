/* v7 - header.
   - once the page has moved the bar takes a paper ground (html.hv-stuck);
   - the section links sit in a capsule, and a soft pill slides to the link under the pointer, then back to the section being read. */
(function(){
  var root = document.documentElement, on = null, nav = document.querySelector('nav.nav');
  function set(){
    var s = scrollY > 8; if (s !== on) { on = s; root.classList.toggle('hv-stuck', s); }
  }
  addEventListener('scroll', set, { passive: true }); addEventListener('resize', set); set();
  if (!nav) return;
  var ul = nav.querySelector('ul'); if (!ul) return;

  var cap = document.createElement('span'), ind = document.createElement('span');
  cap.className = 'hv-cap'; ind.className = 'hv-ind'; cap.setAttribute('aria-hidden', 'true'); ind.setAttribute('aria-hidden', 'true');
  ul.insertBefore(ind, ul.firstChild); ul.insertBefore(cap, ul.firstChild);
  var hover = null, wait = 0, arrived = false;
  function links(){ return [].filter.call(ul.querySelectorAll('li > a[href^="#"]'), function(a){ return a.offsetParent && a.parentNode !== ul.lastElementChild && !a.closest('li:last-of-type'); }); }
  function place(){
    var ls = links(); if (!ls.length) { cap.style.opacity = ind.style.opacity = 0; return; }
    var r = ul.getBoundingClientRect(), a = ls[0].getBoundingClientRect(), b = ls[ls.length - 1].getBoundingClientRect();
    cap.style.opacity = 1; cap.style.left = (a.left - r.left - 5) + 'px'; cap.style.width = (b.right - a.left + 10) + 'px';
    var now = ul.querySelector('li > a[aria-current]'), t = hover || now;
    ls.forEach(function(l){ l.classList.toggle('hv-on', l === t); });
    /* the dot is where the reader is, not where the pointer is: it travels from link to link, and between two named parts
       (the decisions, the plan, the postcard) it waits under the last one as a ring */
    if (now && ls.indexOf(now) < 0) now = null;
    var d = now;
    if (!d) ls.forEach(function(l){ var sec = document.getElementById(l.getAttribute('href').slice(1)); if (sec && sec.getBoundingClientRect().top < innerHeight * .5) d = l; });   /* the last named part already passed, by its place on the page */
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

/* The painter signs the canvas. The drawing is the footer's signature (one source: footer .ft-sig), cloned into .hsig on the
   hero picture. It is written once: in the pinned stage as soon as the picture has grown to fill the stage (the page's pin script
   sets .me-grown on .me-pin; owner, 22.11.2026: the signature is seen in the top section when the picture with the background grows, not only at the end); in the plain layout 400 ms after the picture's lower corner is in view and the opening has come in.
   It never replays. Reduced motion: shown complete. Styles in v7/hero.css. */
(function () {
  var fig = document.querySelector('#about .me-photo.me-v7'), box = fig && fig.querySelector('.hsig'), src = document.querySelector('footer.ft .ft-sig');
  if (!box || !src) return;
  var svg = src.cloneNode(true), mask = svg.querySelector('mask'), img = svg.querySelector('image');
  if (!mask || !img) return;
  svg.setAttribute('class', 'hsig-svg'); svg.removeAttribute('style'); mask.id = 'hsig-m'; img.setAttribute('mask', 'url(#hsig-m)');
  box.appendChild(svg);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  box.classList.add('js');
  var root = document.documentElement, pin = fig.closest('.me-pin'), signed = false, timer = 0, tick = false;
  function ready() {
    if (root.classList.contains('hp-wait') || root.classList.contains('hp-on')) return false; // a picture is signed when it is finished, not while it is being painted
    if (root.classList.contains('me-scroll')) return !!pin && pin.classList.contains('me-grown');
    var r = fig.getBoundingClientRect(); return r.bottom < innerHeight - 8 && r.bottom > 140;
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
