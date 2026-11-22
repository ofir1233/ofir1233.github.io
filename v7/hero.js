/* v7 - header.
   - once the page has moved the bar takes a paper ground (html.hv-stuck);
   - the section links sit in a capsule, and a soft pill slides to the link under the pointer, then back to the section being read;
   - a blue line under the bar shows how far down the page the reader is;
   - beside Contact, the local time in Tel Aviv. */
(function(){
  var root = document.documentElement, on = null, nav = document.querySelector('nav.nav');
  function set(){
    var s = scrollY > 8; if (s !== on) { on = s; root.classList.toggle('hv-stuck', s); }
    if (nav) { var max = document.documentElement.scrollHeight - innerHeight; nav.style.setProperty('--hp', max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0); }
  }
  addEventListener('scroll', set, { passive: true }); addEventListener('resize', set); set();
  if (!nav) return;
  var ul = nav.querySelector('ul'); if (!ul) return;

  var cap = document.createElement('span'), ind = document.createElement('span');
  cap.className = 'hv-cap'; ind.className = 'hv-ind'; cap.setAttribute('aria-hidden', 'true'); ind.setAttribute('aria-hidden', 'true');
  ul.insertBefore(ind, ul.firstChild); ul.insertBefore(cap, ul.firstChild);
  var hover = null;
  function links(){ return [].filter.call(ul.querySelectorAll('li > a[href^="#"]'), function(a){ return a.offsetParent && a.parentNode !== ul.lastElementChild && !a.closest('li:last-of-type'); }); }
  function place(){
    var ls = links(); if (!ls.length) { cap.style.opacity = ind.style.opacity = 0; return; }
    var r = ul.getBoundingClientRect(), a = ls[0].getBoundingClientRect(), b = ls[ls.length - 1].getBoundingClientRect();
    cap.style.opacity = 1; cap.style.left = (a.left - r.left - 5) + 'px'; cap.style.width = (b.right - a.left + 10) + 'px';
    var t = hover || ul.querySelector('li > a[aria-current]');
    ls.forEach(function(l){ l.classList.toggle('hv-on', l === t); });
    if (!t || ls.indexOf(t) < 0) { ind.style.opacity = 0; return; }
    var q = t.getBoundingClientRect(); ind.style.opacity = 1; ind.style.left = (q.left - r.left) + 'px'; ind.style.width = q.width + 'px';
  }
  ul.addEventListener('pointerover', function(e){ var a = e.target.closest && e.target.closest('a'); if (a && links().indexOf(a) >= 0) { hover = a; place(); } });
  ul.addEventListener('pointerleave', function(){ hover = null; place(); });
  ul.addEventListener('focusin', function(e){ if (links().indexOf(e.target) >= 0) { hover = e.target; place(); } });
  ul.addEventListener('focusout', function(){ hover = null; place(); });
  new MutationObserver(place).observe(ul, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  addEventListener('resize', place); if (document.fonts && document.fonts.ready) document.fonts.ready.then(place); place();

  var last = ul.querySelector('li:last-of-type');
  if (last && last.querySelector('a')) {
    var st = document.createElement('span'); st.className = 'hv-time'; st.innerHTML = '<i aria-hidden="true"></i><span>Tel Aviv</span> <b></b>';
    last.insertBefore(st, last.firstChild);
    var out = st.querySelector('b'), fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' }); } catch (e) {}
    var clock = function(){ if (fmt) out.textContent = fmt.format(new Date()); };
    clock(); setInterval(clock, 20000);
  }
})();
