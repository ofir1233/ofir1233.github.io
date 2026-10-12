// Case-study pages: reveal on scroll, videos that load and play only in view, version tabs, compare slider, lightbox, reading progress.
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
  const load = v => { if (!v.src) { v.src = v.dataset.src; } };
  vids.forEach(v => { if (v.dataset.poster) v.poster = v.dataset.poster; v.setAttribute('tabindex', '0'); v.title = 'Click to pause or play'; });
  if (hasIO) {
    const vo = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { load(v); if (!reduce && !v.dataset.paused) v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '200px 0px' });
    vids.forEach(v => vo.observe(v));
  } else vids.forEach(v => { load(v); v.controls = true; });
  if (reduce) vids.forEach(v => { v.controls = true; });
  const toggle = v => { load(v); if (v.paused) { delete v.dataset.paused; v.play().catch(() => {}); } else { v.dataset.paused = '1'; v.pause(); } };
  vids.forEach(v => {
    v.addEventListener('click', () => { if (!v.controls) toggle(v); });
    v.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(v); } });
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

  // lightbox for stills marked data-zoom (data-full = larger file, optional)
  let lb = null;
  const close = () => { if (lb) { lb.remove(); lb = null; document.body.style.overflow = ''; } };
  document.querySelectorAll('img[data-zoom]').forEach(img => {
    img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', (img.alt || 'Image') + '. Open larger');
    const open = () => {
      lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', img.alt || 'Image');
      const big = new Image(); big.src = img.dataset.full || img.currentSrc || img.src; big.alt = img.alt;
      const b = document.createElement('button'); b.className = 'pill'; b.type = 'button'; b.textContent = 'Close';
      lb.append(big, b); document.body.append(lb); document.body.style.overflow = 'hidden'; b.focus();
      lb.addEventListener('click', () => { close(); img.focus(); });
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // reading progress on the top bar
  const bar = document.querySelector('.progress');
  if (bar) {
    let raf = 0;
    const upd = () => { raf = 0; const h = root.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')'; };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true }); upd();
  }
})();
