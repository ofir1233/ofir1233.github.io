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
