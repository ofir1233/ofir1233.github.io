// Case-study pages: reveal on scroll, videos that load and play only in view, version tabs, compare slider, figure viewer, reading progress.
(() => {
  const root = document.documentElement; root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // reveal
  const rvs = document.querySelectorAll('.rv');
  if (hasIO && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    rvs.forEach(el => io.observe(el));
  } else rvs.forEach(el => el.classList.add('in'));

  // videos: <video data-src data-poster muted loop playsinline preload="none">
  const vids = document.querySelectorAll('video[data-src]');
  let viewing = false, openV = null; // set by the figure viewer below
  const load = v => { if (!v.src) { v.src = v.dataset.src; } };
  vids.forEach(v => { if (v.dataset.poster) v.poster = v.dataset.poster; v.setAttribute('tabindex', '0'); v.title = 'Click to pause or play'; });
  if (hasIO) {
    // a clip just below the fold waits for the first scroll, so the first load stays light
    let moved = scrollY > 0; const wait = new Set();
    const seen = v => { const r = v.getBoundingClientRect(); return r.top < innerHeight - 80 && r.bottom > 80; };
    const vo = new IntersectionObserver(es => es.forEach(e => { const v = e.target; const inV = !!v.closest('.cv'); if (e.isIntersecting) { if (!moved && !inV && !v.src && !seen(v)) { wait.add(v); return; } load(v); if (!reduce && !v.dataset.paused && (!viewing || inV)) v.play().catch(() => {}); } else if (!inV) v.pause(); }), { rootMargin: '200px 0px' });
    vids.forEach(v => vo.observe(v));
    if (!moved) addEventListener('scroll', () => { moved = true; wait.forEach(v => { vo.unobserve(v); vo.observe(v); }); wait.clear(); }, { passive: true, once: true });
  } else vids.forEach(v => { load(v); v.controls = true; });
  if (reduce) vids.forEach(v => { v.controls = true; });
  const toggle = v => { load(v); if (v.paused) { delete v.dataset.paused; v.play().catch(() => {}); } else { v.dataset.paused = '1'; v.pause(); } };
  vids.forEach(v => {
    // on the page a click enlarges the clip; in the viewer it pauses or plays
    v.addEventListener('click', () => { if (v.controls) return; if (openV && !v.closest('.cv')) openV(v); else toggle(v); });
    v.addEventListener('keydown', e => {
      if (e.key === 'Enter' && openV && !v.closest('.cv')) { e.preventDefault(); openV(v); }
      else if ((e.key === ' ' || e.key === 'Enter') && !v.controls) { e.preventDefault(); toggle(v); }
    });
  });

  // version tabs: .vtabs > [role=tablist] > button[role=tab][aria-controls], panels [role=tabpanel]
  document.querySelectorAll('.vtabs').forEach(box => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const show = (t, focus) => {
      tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t));
      t.addEventListener('keydown', e => {
        const k = e.key; let j = null;
        if (k === 'ArrowRight') j = (i + 1) % tabs.length; else if (k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length; else if (k === 'Home') j = 0; else if (k === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); show(tabs[j], true); }
      });
    });
    const sel = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]; if (sel) show(sel);
  });

  // compare slider: .compare with <input type=range> + .handle; sets --pos on the box
  document.querySelectorAll('.compare').forEach(box => {
    const r = box.querySelector('input[type="range"]'); if (!r) return;
    const set = () => box.style.setProperty('--pos', r.value + '%');
    r.addEventListener('input', set); set();
  });

  // figure viewer: one calm dark dialog for the page's screenshots (caption, ← →, click to zoom and pan, swipe, Esc) and for clips
  // (the playing video itself moves into the dialog, so playback carries on, and moves back on close). The page behind stays locked.
  // data-full = larger file, optional
  const ico = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  const I_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="i-play"><path d="M8 5.5v13a.6.6 0 0 0 .9.5l10.4-6.5a.6.6 0 0 0 0-1L8.9 5a.6.6 0 0 0-.9.5z"/></svg>';
  const I_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="i-pause"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>';
  const I_ZOOM = ico('M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5');
  const pics = [...document.querySelectorAll('.chapter figure img')].filter(im => !im.closest('.compare, a, button') && im.getAttribute('alt'));
  const capOf = el => {
    const f = el.closest('figure'), c = f && f.querySelector('figcaption');
    if (!c) return { t: '', d: '' };
    const b = c.querySelector(':scope > b, :scope > strong'), tidy = x => x.replace(/\s+/g, ' ').trim();
    const t = b ? tidy([...b.childNodes].map(n => n.textContent.trim()).filter(Boolean).join(' ')) : '';
    const d = tidy([...c.childNodes].filter(n => n !== b).map(n => n.textContent).join(''));
    return { t, d };
  };
  const mark = (host, btn) => {
    if (!host || host.querySelector(':scope > .zx-i')) return null;
    host.classList.add('zx');
    const m = document.createElement(btn ? 'button' : 'span'); m.className = 'zx-i'; m.innerHTML = I_ZOOM;
    if (btn) { m.type = 'button'; m.tabIndex = -1; m.setAttribute('aria-label', 'Enlarge video'); } else m.setAttribute('aria-hidden', 'true');
    host.append(m); return m;
  };
  let dlg = null;
  if (typeof HTMLDialogElement === 'function' && (pics.length || vids.length)) {
    dlg = document.createElement('dialog'); dlg.className = 'cv';
    dlg.setAttribute('aria-labelledby', 'cv-t'); dlg.setAttribute('aria-describedby', 'cv-d');
    dlg.innerHTML = `<div class="cv-in">
      <div class="cv-top"><p class="cv-n" aria-live="polite"></p><button type="button" class="cv-b cv-x" aria-label="Close">${ico('M6 6l12 12M18 6L6 18')}</button></div>
      <div class="cv-stage"><div class="cv-sc"><img class="cv-img" alt="" decoding="async" draggable="false"></div></div>
      <div class="cv-bot"><button type="button" class="cv-b cv-p" aria-label="Previous image">${ico('M15 5l-7 7 7 7')}</button><button type="button" class="cv-b cv-pp" aria-label="Pause">${I_PLAY}${I_PAUSE}</button>
        <div class="cv-mid"><h2 class="cv-t" id="cv-t"></h2><p class="cv-d" id="cv-d"></p><p class="cv-h"></p></div>
        <button type="button" class="cv-b cv-nx" aria-label="Next image">${ico('M9 5l7 7-7 7')}</button></div>
    </div>`;
    document.body.append(dlg);
  }
  if (dlg) {
    const $ = s => dlg.querySelector(s), stage = $('.cv-stage'), sc = $('.cv-sc'), img = $('.cv-img'), pp = $('.cv-pp');
    const pad = k => String(k).padStart(2, '0');
    let list = [], i = 0, it = null, from = null, zoom = false, fit = null, mode = 'i', vid = null, ph = null, shut = 0;
    const touch = matchMedia('(hover: none)').matches;
    const size = () => {
      const r = stage.getBoundingClientRect(), gap = innerWidth <= 600 ? 12 : 40, aw = Math.max(40, r.width - gap), ah = Math.max(40, r.height - gap);
      if (mode === 'v') {
        const nw = vid.videoWidth || +vid.getAttribute('width') || 16, nh = vid.videoHeight || +vid.getAttribute('height') || 9, s = Math.min(aw / nw, ah / nh);
        vid.style.width = Math.round(nw * s) + 'px'; vid.style.height = Math.round(nh * s) + 'px'; return;
      }
      const nw = it.w, nh = it.h, s = Math.min(aw / nw, ah / nh, 1.5), zs = Math.min(2, Math.max(1, s * 1.6));
      fit = { w: Math.round(nw * s), h: Math.round(nh * s), zw: Math.round(nw * zs), zh: Math.round(nh * zs) };
      const can = zs > s * 1.3; if (!can) zoom = false;
      stage.classList.toggle('can', can); stage.classList.toggle('zoom', zoom);
      const parts = [];
      if (list.length > 1 && !zoom) parts.push(touch ? 'Swipe to browse' : '← → to browse');
      if (can) parts.push(zoom ? (touch ? 'Drag to pan · tap to fit' : 'Scroll to pan · click to fit') : (touch ? 'Tap to zoom' : 'Click the image to zoom'));
      if (!touch) parts.push('Esc to close');
      $('.cv-h').textContent = parts.join(' · ');
      img.style.width = (zoom ? fit.zw : fit.w) + 'px'; img.style.height = (zoom ? fit.zh : fit.h) + 'px';
    };
    const caption = c => { $('.cv-t').textContent = c.t; $('.cv-t').hidden = !c.t; $('.cv-d').textContent = c.d; $('.cv-d').hidden = !c.d; };
    const show = n => {
      const N = list.length; i = (n + N) % N; zoom = false;
      const el = list[i];
      it = { el, src: el.dataset.full || el.currentSrc || el.src, w: +el.getAttribute('width') || el.naturalWidth || 1200, h: +el.getAttribute('height') || el.naturalHeight || 800 };
      $('.cv-n').innerHTML = N > 1 ? `<b>${pad(i + 1)}</b> / ${pad(N)}` : '';
      caption(capOf(el)); img.alt = el.alt || '';
      if (img.getAttribute('src') !== it.src) { if (!reduce) img.classList.add('ld'); img.src = it.src; }
      size(); sc.scrollTo(0, 0);
      const me = it;
      (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).then(() => {
        if (it !== me) return;
        if (img.naturalWidth && el.dataset.full) { it.w = img.naturalWidth; it.h = img.naturalHeight; }
        size(); img.classList.remove('ld');
      });
      if (N > 1) [list[(i + 1) % N], list[(i - 1 + N) % N]].forEach(x => { const p = new Image(); p.src = x.dataset.full || x.currentSrc || x.src; });
    };
    const lock = on => { root.style.overflow = on ? 'hidden' : ''; root.style.scrollbarGutter = on ? 'stable' : ''; };
    const syncPP = () => { const on = !!vid && !vid.paused; dlg.classList.toggle('playing', on); pp.setAttribute('aria-label', on ? 'Pause' : 'Play'); };
    const begin = (el, m) => {
      clearTimeout(shut); from = el; mode = m;
      dlg.classList.remove('out'); dlg.classList.toggle('vid', m === 'v'); dlg.classList.toggle('one', m === 'v' || list.length < 2);
      lock(true); if (!dlg.open) dlg.showModal();
    };
    const openPic = el => {
      if (dlg.open) return;
      list = pics.filter(x => x.getClientRects().length && !x.closest('[hidden]'));
      if (!list.includes(el)) list = [el];
      stage.classList.remove('v');
      begin(el, 'i'); show(list.indexOf(el));
      $('.cv-x').focus({ preventScroll: true });
    };
    const openVid = v => {
      if (dlg.open) return;
      load(v); list = []; viewing = true;
      vids.forEach(x => { if (x !== v) x.pause(); });
      begin(v, 'v');
      ph = document.createElement('div'); ph.className = 'cv-ph'; ph.setAttribute('aria-hidden', 'true');
      ph.style.aspectRatio = (+v.getAttribute('width') || 16) + ' / ' + (+v.getAttribute('height') || 9);
      if (v.poster) ph.style.backgroundImage = `url("${v.poster}")`;
      v.replaceWith(ph); sc.append(v); vid = v;
      stage.classList.add('v'); stage.classList.remove('can', 'zoom');
      $('.cv-n').textContent = ''; caption(capOf(ph));
      $('.cv-h').textContent = v.controls ? (touch ? '' : 'Esc to close') : (touch ? 'Tap the clip to pause or play' : 'Click the clip to pause or play · Esc to close');
      if (!reduce && !v.dataset.paused) v.play().catch(() => {});
      syncPP(); size();
      $('.cv-x').focus({ preventScroll: true });
    };
    const close = () => {
      if (!dlg.open) return;
      const done = () => { clearTimeout(shut); dlg.classList.remove('out'); if (dlg.open) dlg.close(); };
      if (reduce) done(); else { dlg.classList.add('out'); shut = setTimeout(done, 180); }
    };
    dlg.addEventListener('close', () => {
      if (vid) {
        vid.style.width = ''; vid.style.height = '';
        if (ph && ph.isConnected) ph.replaceWith(vid);
        ph = null; vid = null; viewing = false;
        if (!reduce) vids.forEach(x => { const r = x.getBoundingClientRect(); if (r.bottom > -200 && r.top < innerHeight + 200 && x.src && !x.dataset.paused) x.play().catch(() => {}); });
      }
      lock(false); it = null;
      if (from && from.isConnected) from.focus({ preventScroll: true });
      from = null;
    });
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target === sc || e.target === stage) close(); });
    $('.cv-x').addEventListener('click', close);
    $('.cv-p').addEventListener('click', () => show(i - 1));
    $('.cv-nx').addEventListener('click', () => show(i + 1));
    pp.addEventListener('click', () => { if (vid) toggle(vid); });
    ['play', 'pause'].forEach(t => dlg.addEventListener(t, syncPP, true));
    dlg.addEventListener('keydown', e => {
      const k = e.key;
      if (mode === 'i' && list.length > 1 && (k === 'ArrowRight' || k === 'ArrowLeft')) { e.preventDefault(); show(i + (k === 'ArrowRight' ? 1 : -1)); }
      else if (mode === 'i' && list.length > 1 && (k === 'Home' || k === 'End')) { e.preventDefault(); show(k === 'Home' ? 0 : list.length - 1); }
      else if (k === 'Tab') {
        const f = [...dlg.querySelectorAll('button, video')].filter(x => x.getClientRects().length && getComputedStyle(x).visibility !== 'hidden'), a = f.indexOf(document.activeElement);
        e.preventDefault(); if (f.length) f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    // click or tap the image to zoom and pan; the point under the pointer stays in view
    let sx = null, sy = 0, moved = false;
    img.addEventListener('click', e => {
      if (!stage.classList.contains('can') || moved) return;
      const r = img.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      zoom = !zoom; size();
      if (zoom) sc.scrollTo(img.offsetLeft + fit.zw * px - sc.clientWidth / 2, img.offsetTop + fit.zh * py - sc.clientHeight / 2);
    });
    // the page under the dialog stays put (wheel and touch), except while panning a zoomed image
    const keep = e => { if (e.target.closest && e.target.closest('.cv-d')) return; if (!(zoom && mode === 'i' && sc.contains(e.target))) e.preventDefault(); };
    dlg.addEventListener('wheel', keep, { passive: false });
    dlg.addEventListener('touchmove', keep, { passive: false });
    // swipe to step on touch (not while zoomed, where a swipe pans)
    stage.addEventListener('pointerdown', e => { moved = false; sx = null; if (mode === 'i' && e.pointerType !== 'mouse' && !zoom && list.length > 1) { sx = e.clientX; sy = e.clientY; } });
    stage.addEventListener('pointerup', e => {
      if (sx === null) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) { moved = true; show(i + (dx < 0 ? 1 : -1)); }
    });
    stage.addEventListener('pointercancel', () => { sx = null; });
    let rt = 0; addEventListener('resize', () => { if (!dlg.open || !(it || vid)) return; cancelAnimationFrame(rt); rt = requestAnimationFrame(size); });

    // openers
    pics.forEach(im => {
      im.tabIndex = 0; im.setAttribute('role', 'button'); im.setAttribute('aria-label', (im.alt || 'Image') + '. Open larger');
      im.classList.add('zx-img'); mark(im.parentElement, false);
      im.addEventListener('click', () => openPic(im));
      im.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPic(im); } });
    });
    vids.forEach(v => {
      v.title = v.controls ? '' : 'Click to enlarge';
      const b = mark(v.parentElement, true); if (b) b.addEventListener('click', () => openVid(v));
    });
    openV = openVid;
  }

  // reading progress on the top bar
  const bar = document.querySelector('.progress');
  if (bar) {
    let raf = 0;
    const upd = () => { raf = 0; const h = root.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd();
  }
  // e-cs: hero window title, chapter scroll-spy (hero chips + a floating rail on wide screens)
  const heroBar = document.querySelector('.hero-fig .shot.win > .bar');
  const caseName = document.querySelector('.cs-hero > .label b');
  if (heroBar && caseName && !heroBar.querySelector('.cs-t')) { const t = document.createElement('em'); t.className = 'cs-t'; t.textContent = caseName.textContent.trim(); heroBar.append(t); }
  const toc = document.querySelector('.cs-hero .toc');
  if (toc) {
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    if (links.length && secs.every(Boolean)) {
      const rail = document.createElement('nav'); rail.className = 'cs-rail'; rail.setAttribute('aria-label', 'Chapters');
      links.forEach(a => { const c = a.cloneNode(true); c.className = ''; c.tabIndex = -1; rail.append(c); });
      rail.setAttribute('aria-hidden', 'true');
      document.body.append(rail);
      const rl = [...rail.children], end = document.querySelector('.next');
      let cur = -2, shown = null, raf2 = 0;
      const spy = () => {
        raf2 = 0;
        const line = innerHeight * .38; let i = -1;
        secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) i = k; });
        if (i !== cur) { cur = i; [links, rl].forEach(set => set.forEach((a, k) => { if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); })); }
        const tb = toc.getBoundingClientRect().bottom, et = end ? end.getBoundingClientRect().top : Infinity;
        const on = tb < 0 && i >= 0 && et > innerHeight * .5;
        if (on !== shown) { shown = on; rail.classList.toggle('on', on); rail.setAttribute('aria-hidden', on ? 'false' : 'true'); rl.forEach(a => { a.tabIndex = on ? 0 : -1; }); }
      };
      addEventListener('scroll', () => { if (!raf2) raf2 = requestAnimationFrame(spy); }, { passive: true });
      addEventListener('resize', () => { if (!raf2) raf2 = requestAnimationFrame(spy); });
      spy();
    }
  }
})();

// Porcelain & Evergreen: light/dark switch in the top bar (dark by default, the choice is remembered; same key as the home page)
(() => {
  const root = document.documentElement, tg = document.querySelector('.theme-tg'), meta = document.querySelector('meta[name="theme-color"]');
  if (!tg) return;
  const apply = t => {
    root.dataset.theme = t;
    if (tg) { tg.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'); tg.setAttribute('aria-pressed', t === 'dark'); }
    if (meta) meta.content = t === 'dark' ? '#101614' : '#f3f4f2';
  };
  apply(root.dataset.theme === 'light' ? 'light' : 'dark');
  if (tg) tg.addEventListener('click', () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(t);
    try { localStorage.setItem('ofir-theme', t); } catch (e) {}
  });
})();
