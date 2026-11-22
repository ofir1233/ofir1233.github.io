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

/* the Design plate: when its screen comes on, the sign-in page is drawn as on a design canvas, as a sequence of gestures - travel, a short
   pause, press, drag, release, and the thing settling - each with its own length, the way a hand works: quick on the drag, unhurried
   on what appears. The glass is dragged out, the card set into it, the first field drawn and duplicated, the gap measured, the button's
   corners dialled round; then the finished screen rests and it starts over. */
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
  function box(el){ var c = el === card; return el === glass ? { x: 0, y: 0, w: el.offsetWidth, h: el.offsetHeight } : { x: card.offsetLeft + (c ? 0 : el.offsetLeft), y: card.offsetTop + (c ? 0 : el.offsetTop), w: el.offsetWidth, h: el.offsetHeight }; }
  function clear(){ run++; timers.forEach(clearTimeout); timers = []; parts.forEach(function(e){ e.classList.remove('show'); }); btn.classList.remove('sq'); card.classList.remove('fin', 'c0'); glass.classList.remove('g0');
    [sel, gap, prop, cur].forEach(function(e){ e.classList.remove('show'); }); cur.classList.remove('down'); prop.classList.remove('edit'); }
  function play(){ clear(); card.classList.add('hd-run', 'c0'); glass.classList.add('g0'); var me = run, g = box(glass), k = box(card), e = box(email), p = box(pass), b = box(btn), W = g.w;
    function wait(ms){ return new Promise(function(res){ timers.push(setTimeout(function(){ if (me === run) res(); }, ms)); }); }
    function len(d){ glass.style.setProperty('--d', d + 'ms'); }
    function curAt(x, y){ cur.style.translate = Math.round(x) + 'px ' + Math.round(y) + 'px'; }
    function selAt(x, y, w, h){ sel.style.left = x + 'px'; sel.style.top = y + 'px'; sel.style.width = w + 'px'; sel.style.height = h + 'px'; }
    function jump(f){ sel.style.transition = cur.style.transition = 'none'; f(); sel.offsetWidth; cur.offsetWidth; sel.style.transition = cur.style.transition = ''; }
    function move(x, y, d){ len(d); curAt(x - 3, y - 2); return wait(d); }                         /* the cursor travels, its tip to x,y */
    function press(){ cur.classList.add('down'); return wait(110); }
    function lift(){ cur.classList.remove('down'); return wait(130); }
    function draw(r, d){ jump(function(){ selAt(r.x, r.y, 0, 0); }); sel.classList.add('show'); len(d); selAt(r.x, r.y, r.w, r.h); curAt(r.x + r.w - 3, r.y + r.h - 2); return wait(d); }   /* drag a shape out from its corner */
    (function size(){ if (me !== run) return; if (sel.classList.contains('show')) lab.textContent = sel.offsetWidth + ' × ' + sel.offsetHeight; requestAnimationFrame(size); })();
    glass.style.setProperty('--dy', (e.y - p.y) + 'px'); propN.textContent = '6';
    jump(function(){ curAt(W + 46, -34); selAt(0, 0, 0, 0); });
    (async function(){
      await wait(350); cur.classList.add('show');
      await move(g.x, g.y, 760); await wait(150);
      await press(); await draw(g, 720); await lift();
      glass.classList.remove('g0'); await wait(620);                                        /* the glass comes up slowly, on its own time */
      len(460); selAt(k.x, k.y, k.w, k.h); curAt(k.x + k.w - 3, k.y + k.h - 2); await wait(460);   /* the selection steps in to the card */
      await wait(90); card.classList.remove('c0'); await wait(380);
      title.classList.add('show'); await wait(480);
      sel.classList.remove('show'); await move(e.x, e.y, 540); await wait(140);
      await press(); await draw(e, 580); await lift();
      email.classList.add('show'); await wait(420);
      await move(e.x + e.w * .62, e.y + e.h * .52, 380); await wait(130); await press();   /* take the field and pull a copy down */
      len(480); pass.classList.add('show'); selAt(p.x, p.y, p.w, p.h); curAt(p.x + p.w * .62 - 3, p.y + p.h * .52 - 2); await wait(480); await lift();
      await wait(180); gap.style.left = (e.x + e.w / 2) + 'px'; gap.style.top = (e.y + e.h) + 'px'; gap.style.height = (p.y - e.y - e.h) + 'px'; gap.querySelector('b').textContent = p.y - e.y - e.h; gap.classList.add('show');
      await wait(820); gap.classList.remove('show'); sel.classList.remove('show'); await wait(160);
      row.classList.add('show'); await move(b.x, b.y, 460); await wait(130);
      await press(); btn.classList.add('sq'); await draw(b, 560); await lift(); btn.classList.add('show'); await wait(300);
      prop.style.left = (W - 30) + 'px'; prop.style.top = (b.y - 8) + 'px'; prop.classList.add('show');
      await move(W + 30, b.y + 36, 520); await wait(120); await press(); prop.classList.add('edit'); btn.classList.remove('sq');
      await new Promise(function(res){ var t0 = performance.now(); (function tick(t){ if (me !== run) return; var u = Math.min(1, (t - t0) / 850), s = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        propN.textContent = Math.round(6 + 21 * s); if (u < 1) requestAnimationFrame(tick); else res(); })(t0); });   /* the number runs up as the corners round */
      await lift(); await wait(380); prop.classList.remove('show', 'edit'); sel.classList.remove('show');
      for (var i = 0; i < rest.length; i++) { rest[i].classList.add('show'); await wait(120); }
      await wait(160); card.classList.add('fin');
      await move(W + 80, g.h * .78, 900); cur.classList.remove('show');
      await wait(2700);
      card.classList.add('c0'); await wait(260); glass.classList.add('g0'); await wait(1050);
      play();
    })(); }
  function see(on){ if (on === shown) return; shown = on; if (on) play(); else { clear(); card.classList.remove('hd-run'); } }
  var ol = li.parentNode;
  function check(){ if (ol.classList.contains('hw-pin')) see(li.classList.contains('on')); }
  new MutationObserver(check).observe(li, { attributes: true, attributeFilter: ['class'] }); check();
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (!ol.classList.contains('hw-pin')) see(es[0].isIntersecting); }, { threshold: .5 }).observe(li);
})();
