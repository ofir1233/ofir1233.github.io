// Case-study pages: reveal on scroll, videos that load and play only in view, version tabs, compare slider, figure viewer, reading progress, the running head.
(() => {
  const root = document.documentElement; root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // reveal
  const rvs = document.querySelectorAll('.rv');
  if (hasIO && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    // what is on screen when the page opens is simply there; only what the reader scrolls to comes in
    rvs.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('in'); else io.observe(el); });
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
    let touched = false;
    r.addEventListener('input', () => { touched = true; set(); }); set();
    ['pointerdown', 'keydown'].forEach(ev => r.addEventListener(ev, () => { touched = true; }));
    // The line moves once by itself when the picture has come into view: a little to the left, a little to the right, and back.
    // That is how the reader learns it can be dragged. A touch on it at any time ends the move where the hand is.
    if (hasIO && !reduce) {
      const io = new IntersectionObserver(es => {
        if (!es[0].isIntersecting) return; io.disconnect();
        const from = +r.value, keys = [[0, from], [560, from - 18], [1320, from + 12], [1900, from]];
        const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        let t0 = null;
        const step = t => {
          if (touched) return; if (t0 == null) t0 = t;
          const ms = t - t0; let i = 1; while (i < keys.length - 1 && ms > keys[i][0]) i++;
          const k0 = keys[i - 1], k1 = keys[i], k = Math.min(1, Math.max(0, (ms - k0[0]) / (k1[0] - k0[0])));
          box.style.setProperty('--pos', (k0[1] + (k1[1] - k0[1]) * ease(k)).toFixed(2) + '%');
          if (ms < keys[keys.length - 1][0]) requestAnimationFrame(step); else set();
        };
        setTimeout(() => requestAnimationFrame(step), 500);
      }, { threshold: .6 });
      io.observe(box);
    }
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
    // the bar is clear at the very top of the page; once the page moves it takes the paper and a hairline (html.tb-stuck)
    const upd = () => { raf = 0; const h = root.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; root.classList.toggle('tb-stuck', scrollY > 8); };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd();
  }
  // e-cs: hero window title, chapter scroll-spy (the chips in the hero and the running head in the top bar)
  const heroBar = document.querySelector('.hero-fig .shot.win > .bar');
  const caseName = document.querySelector('.cs-hero > .label b');
  if (heroBar && caseName && !heroBar.querySelector('.cs-t')) { const t = document.createElement('em'); t.className = 'cs-t'; t.textContent = caseName.textContent.trim(); heroBar.append(t); }
  const toc = document.querySelector('.cs-hero .toc');
  if (toc) {
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1)));
    if (links.length && secs.every(Boolean)) {
      // the running head in the top bar, as in a book: the case's name, then the chapter being read ("Actions · 02 The board").
      // On a chapter change the old line lifts 8px and fades (160ms) and the new one rises (220ms, after 60ms). The head is centred,
      // so its left edge moves when the chapter's name is longer or shorter: the whole head slides to its new place in the same 220ms.
      const run = document.querySelector('.tb-run'), runCh = run && run.querySelector('.tb-ch'), runCase = run && run.querySelector('.tb-case');
      const setRun = k => {
        if (!runCh || !runCase) return;
        const txt = k >= 0 ? links[k].textContent.replace(/\s+/g, ' ').trim() : '';
        const old = runCh.querySelector('.tb-l:not(.out)');
        if ((old ? old.textContent : '') === txt) return;
        const x0 = runCase.getBoundingClientRect().left;
        runCh.querySelectorAll('.tb-l.out').forEach(n => n.remove());
        let nu = null;
        if (txt) { nu = document.createElement('span'); nu.className = 'tb-l pre'; nu.textContent = txt; }
        if (reduce) { if (old) old.remove(); if (nu) { nu.classList.remove('pre'); runCh.append(nu); } return; }
        if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 220); }
        if (nu) runCh.append(nu);
        const dx = x0 - runCase.getBoundingClientRect().left;
        run.classList.remove('flip'); run.style.translate = dx ? dx.toFixed(1) + 'px 0' : '';
        void run.offsetWidth; // the start positions are read before the move begins
        run.classList.add('flip'); run.style.translate = '';
        if (nu) nu.classList.remove('pre');
      };
      let cur = -2, raf2 = 0;
      const spy = () => {
        raf2 = 0;
        const line = innerHeight * .38; let i = -1;
        secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) i = k; });
        if (i !== cur) { cur = i; links.forEach((a, k) => { if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }); setRun(i); }
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

// Turn the page: on the way to the next case its title, the big line of the Next card, is the thing that travels to the top of
// the next page (v7/case.css names it for the browser's page transition). The mark is set only for that one press.
(() => {
  const root = document.documentElement, next = document.querySelector('a.next');
  if (!next) return;
  next.addEventListener('click', e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) root.classList.add('to-next'); });
  addEventListener('pageshow', () => root.classList.remove('to-next'));
})();

// smooth scrolling switches on after load (html.ready), so a link to a #section opens right there, as on the homepage
(() => { const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('ready'))); if (document.readyState === 'complete') ready(); else addEventListener('load', ready, { once: true }); })();

/* Read more, on closing: the folded blocks leave the page at once, so the summary is brought back into view instead of the page jumping to somewhere else. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('details.more').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) return;
    const r = d.getBoundingClientRect();
    if (r.top < 90 || r.top > innerHeight - 60) d.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }));
})();

/* Decisions open folded: the question and the option that was chosen. One outline button under the chosen option opens what was
   ruled out and the reasoning. Without this script everything is shown. A link that lands on a decision opens it. */
(function () {
  var all = [].slice.call(document.querySelectorAll('.decision'));
  all.forEach(function (d) {
    var opts = d.querySelector('.opts'); if (!opts || !opts.querySelector('.opt.chosen')) return;
    var n = opts.querySelectorAll('.opt:not(.chosen)').length; if (!n) return;
    var why = d.querySelector(':scope > .because') || d.querySelector(':scope > p'); if (why) why.classList.add('dc-why');
    var li = document.createElement('li'), b = document.createElement('button');
    li.className = 'dc-t'; b.type = 'button'; b.className = 'dc-btn';
    var closed = n === 1 ? 'The option I ruled out' : 'The ' + n + ' options I ruled out';
    var set = function (open) { d.classList.toggle('dc-open', open); b.setAttribute('aria-expanded', open ? 'true' : 'false'); b.textContent = open ? 'Show less' : closed; };
    b.addEventListener('click', function () { set(!d.classList.contains('dc-open')); });
    li.appendChild(b); opts.appendChild(li); d.classList.add('dc-fold'); set(false);
    d.dcOpen = function () { set(true); };
  });
  var land = function () { var id = location.hash.slice(1), t = id && document.getElementById(id), d = t && t.closest && t.closest('.decision'); if (d && d.dcOpen) d.dcOpen(); };
  addEventListener('hashchange', land); land();
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; var t = document.getElementById(a.getAttribute('href').slice(1)), d = t && t.closest('.decision'); if (d && d.dcOpen) d.dcOpen(); });
  addEventListener('beforeprint', function () { all.forEach(function (d) { if (d.dcOpen) d.dcOpen(); }); });
})();
