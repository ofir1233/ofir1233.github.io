// FYI case study: the page around the phones (hero echo, trio tabs, spec view,
// Try it). Scenes live in fyi-scenes.js; everything here also works with reduced motion.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // light/dark switch in the top bar (light by default; the choice is remembered under the home page's key).
  // The listener runs first at the button and stops there, so a second binding elsewhere can never toggle twice.
  const root = document.documentElement, tg = document.querySelector('.theme-tg'), meta = document.querySelector('meta[name="theme-color"]');
  const applyTheme = t => {
    root.dataset.theme = t;
    if (tg) { tg.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); tg.setAttribute('aria-pressed', String(t === 'dark')); }
    if (meta) meta.content = t === 'dark' ? '#101614' : '#f3f4f2';
  };
  applyTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  if (tg && !tg.dataset.bound) {
    tg.dataset.bound = '1';
    tg.addEventListener('click', e => {
      e.stopImmediatePropagation();
      const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(t);
      try { localStorage.setItem('ofir-theme', t); } catch (err) {}
    }, true);
  }

  // hero: the echo rings widen a little as the hero scrolls away
  const hero = document.querySelector('.fyi-hero'), echo = hero && hero.querySelector('.echo');
  if (echo && !reduce) {
    let raf = 0;
    const upd = () => { raf = 0; const r = hero.getBoundingClientRect(); const k = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height))); echo.style.setProperty('--echo', (1 + k * .06).toFixed(4)); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  }

  // 05: whose phone to show below 1024px (Auto follows the story)
  document.querySelectorAll('.st-trio').forEach(st => {
    const btns = [...st.querySelectorAll('.trio-tabs button')];
    const set = v => {
      st.dataset.view = v;
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
      st.dataset.show = v === 'auto' ? (st.dataset.auto || '1') : v;
      st.querySelectorAll('.presence i').forEach((i, k) => i.classList.toggle('on', String(k) === st.dataset.show));
    };
    btns.forEach(b => b.addEventListener('click', () => set(b.dataset.v)));
    st.addEventListener('fx:auto', () => { if (st.dataset.view === 'auto') set('auto'); });
    set(reduce ? '0' : 'auto');
  });

  // 07: spec view markers outline their part
  document.querySelectorAll('.spec').forEach(sp => {
    const dev = sp.querySelector('.spec-dev'), box = sp.querySelector('.spec-box'), items = [...sp.querySelectorAll('.spec-list li')];
    const marks = [...sp.querySelectorAll('.marks li')];
    const part = m => dev.querySelector(`[data-spec="${m}"]`);
    const place = () => {
      const fd = dev.querySelector('.fx-dev'); if (!fd) return;
      const d = fd.getBoundingClientRect(); if (!d.width) return;
      marks.forEach(mk => { const el = part(mk.dataset.m); if (!el) return; const r = el.getBoundingClientRect(); mk.style.left = ((r.left - d.left - 15) / d.width * 100).toFixed(2) + '%'; mk.style.top = ((r.top - d.top + Math.min(r.height / 2, 14)) / d.height * 100).toFixed(2) + '%'; });
    };
    let cur = null;
    const show = m => {
      cur = m; items.forEach(li => li.classList.toggle('on', li.dataset.m === m));
      const el = m && part(m); if (!el) { box.classList.remove('on'); return; }
      const d = dev.getBoundingClientRect(), r = el.getBoundingClientRect();
      Object.assign(box.style, { left: r.left - d.left - 3 + 'px', top: r.top - d.top - 3 + 'px', width: r.width + 6 + 'px', height: r.height + 6 + 'px' });
      box.classList.add('on');
    };
    // hover is for a mouse only: a tap's emulated mouse events would clear the outline right after drawing it
    const narrow = matchMedia('(max-width: 860px)');
    items.forEach(li => {
      const b = li.querySelector('button');
      b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(li.dataset.m); });
      b.addEventListener('focus', () => show(li.dataset.m));
      b.addEventListener('click', () => {
        show(li.dataset.m);
        const el = part(li.dataset.m);
        if (el && narrow.matches) el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    marks.forEach(mk => mk.addEventListener('click', () => show(cur === mk.dataset.m ? null : mk.dataset.m)));
    sp.querySelector('.spec-list').addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') show(null); });
    const again = () => { place(); if (cur) show(cur); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(again));
    setTimeout(again, 500);
    if ('ResizeObserver' in window) new ResizeObserver(again).observe(dev); else addEventListener('resize', again);
  });

  // 06: the formats row is a tab stop only where it scrolls
  const fm = document.querySelector('.fmts');
  if (fm) {
    const mq = matchMedia('(max-width: 760px)');
    const ti = () => mq.matches ? fm.setAttribute('tabindex', '0') : fm.removeAttribute('tabindex');
    ti(); mq.addEventListener('change', ti);
  }
})();
