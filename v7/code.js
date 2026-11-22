/* v7 - code ("How I work"): on a wide window the frame stays in place and the three screens change inside it as the page scrolls;
   the short index beside the heading marks the step on show and jumps to it. On a narrow window the three are a plain list. */
(function(){
  var ol = document.querySelector('#code .hw-steps'); if (!ol) return;
  var steps = [].slice.call(ol.children), links = [].slice.call(document.querySelectorAll('#code .hw-nav a'));
  var mq = matchMedia('(min-width: 900px)'), cur = -1, TOP = 118;
  /* the text of each step moves into the index beside the heading: it opens under the step on show */
  links.forEach(function(l, i){ var c = steps[i] && steps[i].querySelector('.hw-cap'); if (!c) return; var d = document.createElement('span'); d.className = 'hw-d';
    var t = c.querySelector('p'), g = c.querySelector('.hw-tag'); d.innerHTML = '<span>' + (t ? t.innerHTML : '') + (g ? '<small>' + g.innerHTML + '</small>' : '') + '</span>'; l.appendChild(d); });
  function range(){ return Math.max(1, ol.offsetHeight - steps[0].offsetHeight); }
  function mark(i){ if (i === cur) return; cur = i; steps.forEach(function(s, k){ s.classList.toggle('on', k === i); }); links.forEach(function(a, k){ a.classList.toggle('on', k === i); }); }
  function set(){
    var pin = mq.matches; ol.classList.toggle('hw-pin', pin); if (!pin) { cur = -1; return; }
    var p = (TOP - ol.getBoundingClientRect().top) / range();
    mark(Math.max(0, Math.min(steps.length - 1, Math.floor(p * steps.length))));
  }
  links.forEach(function(a, i){ a.addEventListener('click', function(e){ if (!mq.matches) return; e.preventDefault();
    scrollTo({ top: ol.getBoundingClientRect().top + scrollY - TOP + range() * (i + .5) / steps.length, behavior: 'smooth' }); }); });
  addEventListener('scroll', set, { passive: true }); addEventListener('resize', set); set();
})();

/* the sign-in page in the Design step: drawn at 760 px and scaled to its frame; under the mouse its layers move in depth,
   followed closely and let go with weight (the same spring as the page it comes from). */
[].forEach.call(document.querySelectorAll('#code .hw-live'), function(fig){
  var st = fig.querySelector('.hl'); if (!st) return;
  function fit(){ st.style.setProperty('--k', (fig.clientWidth / 760).toFixed(5)); }
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(fig); addEventListener('resize', fit); fit();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, last = 0, over = false;
  function tick(t){ var dt = Math.min(.034, (t - last) / 1000 || .016); last = t;
    var k = over ? 110 : 15, c = over ? 21 : 4.6;
    vx += ((tx - x) * k - vx * c) * dt; vy += ((ty - y) * k - vy * c) * dt; x += vx * dt; y += vy * dt;
    st.style.setProperty('--tx', x.toFixed(4)); st.style.setProperty('--ty', y.toFixed(4));
    if (Math.abs(tx - x) > .0008 || Math.abs(ty - y) > .0008 || Math.abs(vx) > .002 || Math.abs(vy) > .002) raf = requestAnimationFrame(tick);
    else { raf = 0; x = tx; y = ty; vx = vy = 0; st.style.setProperty('--tx', x); st.style.setProperty('--ty', y); } }
  function go(){ if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  fig.addEventListener('pointermove', function(e){ if (e.pointerType !== 'mouse') return; over = true; var r = fig.getBoundingClientRect();
    tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)); ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2)); go(); });
  fig.addEventListener('pointerleave', function(){ over = false; tx = 0; ty = 0; go(); });
});

/* the chat on the System plate: when its screen comes on, the question is typed into the field and sent, then the answer is written
   word by word. Without motion (or without this script) the finished conversation simply stands there. */
(function(){
  var hc = document.querySelector('#code .hc'), li = hc && hc.closest('li'); if (!hc || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var q = hc.querySelector('.hc-q'), a = hc.querySelector('.hc-a'), t = hc.querySelector('.hc-t'), text = q.textContent, run = 0, shown = false;
  (function wrap(n){ [].slice.call(n.childNodes).forEach(function(c){
    if (c.nodeType === 3) { var f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(function(p){ if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { var s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s); } }); n.replaceChild(f, c); }
    else wrap(c); }); })(a);
  var words = [].slice.call(a.querySelectorAll('.w'));
  function reset(){ run++; hc.classList.add('run'); hc.classList.remove('typing'); q.classList.add('off'); words.forEach(function(w){ w.classList.add('off'); }); t.textContent = ''; }
  function play(){ reset(); var me = run, i = 0; hc.classList.add('typing');
    (function type(){ if (me !== run) return; if (i < text.length) { t.textContent = text.slice(0, ++i); setTimeout(type, 26 + Math.random() * 30); return; }
      setTimeout(function(){ if (me !== run) return; hc.classList.remove('typing'); t.textContent = ''; q.classList.remove('off'); var k = 0;
        setTimeout(function write(){ if (me !== run) return; if (k < words.length) { words[k++].classList.remove('off'); setTimeout(write, 55); } }, 520); }, 380); })(); }
  function see(on){ if (on === shown) return; shown = on; if (on) setTimeout(play, 350); else reset(); }
  reset();
  var ol = li.parentNode;
  function check(){ if (ol.classList.contains('hw-pin')) see(li.classList.contains('on')); }
  new MutationObserver(check).observe(li, { attributes: true, attributeFilter: ['class'] }); check();
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (!ol.classList.contains('hw-pin')) see(es[0].isIntersecting); }, { threshold: .5 }).observe(li);
  else see(true);
})();

/* the Design plate: when its screen comes on, the sign-in page is drawn as on a design canvas - the cursor drags out the glass, then the card
   on it, the first field, duplicates it, the gap is measured, the button's corners are rounded - then the finished screen rests and it starts over. */
(function(){
  var card = document.querySelector('#hw-1 .hl-card'), li = card && card.closest('li'); if (!card || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var glass = card.parentNode;
  function q(s){ return card.querySelector(s); }
  var title = q('.hl-t'), email = q('.hl-in.on'), pass = q('.hl-in:not(.on)'), row = q('.hl-row'), btn = q('.hl-btn:not(.g)'), rest = [q('.hl-or'), q('.hl-btn.g'), q('.hl-foot')];
  var hd = document.createElement('div'); hd.className = 'hd';
  hd.innerHTML = '<span class="hd-sel"><i></i><i></i><i></i><i></i><b></b></span><span class="hd-gap"><b></b></span><span class="hd-prop"><small>Radius</small><b>6</b></span><span class="hd-cur"><svg viewBox="0 0 24 24"><path d="M4 3l6.5 17 2.6-7.1L20 10.2z"/></svg><b>Ofir</b></span>';
  glass.appendChild(hd);
  var sel = hd.children[0], lab = sel.querySelector('b'), gap = hd.children[1], prop = hd.children[2], propN = prop.querySelector('b'), cur = hd.children[3];
  var parts = [title, email, pass, row, btn].concat(rest), run = 0, timers = [], shown = false;
  function box(el){ var c = el === card || el === glass; return { x: el === glass ? 0 : c ? card.offsetLeft : card.offsetLeft + el.offsetLeft, y: el === glass ? 0 : c ? card.offsetTop : card.offsetTop + el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }; }
  function setSel(b, zero){ sel.style.left = b.x + 'px'; sel.style.top = b.y + 'px'; sel.style.width = (zero ? 0 : b.w) + 'px'; sel.style.height = (zero ? 0 : b.h) + 'px'; lab.textContent = b.w + ' × ' + b.h; }
  function curTo(x, y){ cur.style.translate = x + 'px ' + y + 'px'; }
  function end(b){ curTo(b.x + b.w - 3, b.y + b.h - 2); }
  function clear(){ run++; timers.forEach(clearTimeout); timers = []; parts.forEach(function(e){ e.classList.remove('show'); }); btn.classList.remove('sq'); card.classList.remove('fin', 'c0'); glass.classList.remove('g0');
    [sel, gap, prop, cur].forEach(function(e){ e.classList.remove('show'); }); }
  function play(){ clear(); card.classList.add('hd-run', 'c0'); glass.classList.add('g0'); var me = run, g = box(glass), k = box(card), e = box(email), p = box(pass), b = box(btn), W = g.w;
    function at(t, f){ timers.push(setTimeout(function(){ if (me === run) f(); }, t)); }
    setSel(g, true); curTo(W + 30, 30); propN.textContent = '6';
    at(350, function(){ cur.classList.add('show'); curTo(-3, -2); });
    at(1100, function(){ sel.classList.add('show'); setSel(g); end(g); });
    at(1750, function(){ glass.classList.remove('g0'); });
    at(2450, function(){ setSel(k); end(k); });
    at(2950, function(){ card.classList.remove('c0'); });
    at(3300, function(){ title.classList.add('show'); });
    at(3800, function(){ sel.classList.remove('show'); curTo(e.x - 3, e.y - 2); });
    at(4450, function(){ setSel(e, true); });
    at(4550, function(){ sel.classList.add('show'); setSel(e); end(e); });
    at(5200, function(){ email.classList.add('show'); });
    at(5900, function(){ pass.classList.add('show'); setSel(p); curTo(p.x + p.w * .6, p.y + p.h * .55); });
    at(6550, function(){ gap.style.left = (e.x + e.w / 2) + 'px'; gap.style.top = (e.y + e.h) + 'px'; gap.style.height = (p.y - e.y - e.h) + 'px'; gap.querySelector('b').textContent = p.y - e.y - e.h; gap.classList.add('show'); });
    at(7600, function(){ gap.classList.remove('show'); row.classList.add('show'); btn.classList.add('sq'); btn.classList.add('show'); setSel(b); end(b); });
    at(8350, function(){ prop.style.left = (W - 30) + 'px'; prop.style.top = (b.y - 8) + 'px'; prop.classList.add('show'); curTo(W + 24, b.y + 34); });
    at(8950, function(){ propN.textContent = '27'; btn.classList.remove('sq'); });
    at(9900, function(){ prop.classList.remove('show'); rest.forEach(function(r, i){ at(i * 130, function(){ r.classList.add('show'); }); }); });
    at(10500, function(){ sel.classList.remove('show'); card.classList.add('fin'); curTo(W + 60, g.h * .8); });
    at(11000, function(){ cur.classList.remove('show'); });
    at(13800, function(){ card.classList.add('c0'); });
    at(14200, function(){ glass.classList.add('g0'); });
    at(14900, play); }
  function see(on){ if (on === shown) return; shown = on; if (on) play(); else { clear(); card.classList.remove('hd-run'); } }
  var ol = li.parentNode;
  function check(){ if (ol.classList.contains('hw-pin')) see(li.classList.contains('on')); }
  new MutationObserver(check).observe(li, { attributes: true, attributeFilter: ['class'] }); check();
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (!ol.classList.contains('hw-pin')) see(es[0].isIntersecting); }, { threshold: .5 }).observe(li);
})();
