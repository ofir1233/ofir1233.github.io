// The stages around live Lab windows: the active step's tab fills over its beat, read from the player's own
// clock (so ?lxclock=manual frames are exact), and a still can jump the live demo to the step it shows.
(() => {
  const LX = window.LX;
  if (!LX) return;
  const reduce = !!LX.reduce;

  const stage = root => {
    const P = root._lx;
    if (!P || !P.def) { setTimeout(() => stage(root), 30); return; }
    const fig = root.closest('[data-lx-stage]');
    const times = P.def.times || [];
    let beat = Math.max(0, P.shown ?? 0), since = P.t, raf = 0;
    const fill = () => {
      const dur = ((times[beat + 1] ?? times[beat] + 1.5) - (times[beat] ?? 0)) * 1000;
      const p = reduce ? 1 : Math.max(0, Math.min(1, (P.t - since) / dur));
      const li = P.beatsEl && P.beatsEl.children[beat];
      if (li) { const b = li.firstElementChild, v = p.toFixed(3); if (b.style.getPropertyValue('--p') !== v) b.style.setProperty('--p', v); }
    };
    const frame = () => { raf = 0; fill(); if (P.live() && !document.hidden) raf = requestAnimationFrame(frame); };
    const kick = () => { if (!raf && !LX.manual) raf = requestAnimationFrame(frame); };
    fig.addEventListener('lx:beat', e => { beat = Math.max(0, e.detail.i); since = P.t; fill(); kick(); });
    new MutationObserver(kick).observe(fig, { attributes: true, attributeFilter: ['class'] });
    if (LX.manual) { const adv = LX.advance; LX.advance = async ms => { await adv(ms); fill(); }; }
    fill(); kick();
  };

  // "Watch it open": a link to the demo that, once the engine runs, also jumps it to the step and puts focus on that step's tab
  const jumps = () => document.querySelectorAll('.ct-jump[data-beat]').forEach(b => b.addEventListener('click', e => {
    const root = document.querySelector('.ct-hero .lx[data-lab]'), P = root && root._lx;
    if (!P || !P.beatsEl) return;
    e.preventDefault();
    const btn = P.beatsEl.querySelectorAll('button')[+b.dataset.beat];
    P.seen = true;
    if (btn) { btn.click(); btn.focus({ preventScroll: true }); }
    // the whole figure when it fits the screen, else the window and its steps, with the steps at the bottom
    const fig = root.closest('[data-lx-stage]'), rail = fig.querySelector('.ct-rail');
    const tall = fig.getBoundingClientRect().height > innerHeight;
    (tall && rail ? rail : fig).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: tall && rail ? 'end' : 'center' });
  }));

  LX.stage = stage; // for windows that join after the page has started
  const go = () => { document.querySelectorAll('[data-lx-stage] .lx[data-lab]:not([data-still])').forEach(stage); jumps(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(go, 0)); else setTimeout(go, 0);
})();
