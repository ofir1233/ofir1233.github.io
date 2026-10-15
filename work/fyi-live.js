// FYI live phones: a small scene player. Each phone runs a scripted scene on its own clock, which only moves while the
// phone is on screen, the tab is visible and the reader has not paused it. Beats can be jumped to; with reduced motion a
// scene opens on its finished state and plays only on request.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCENES = {};
  const CANCEL = Symbol('cancel');
  // a scene cut short by a seek or a reset rejects its pending waits with CANCEL; that is not an error
  addEventListener('unhandledrejection', e => { if (e.reason === CANCEL) e.preventDefault(); });
  const players = [];
  const FX = window.FX = { scene(name, def) { SCENES[name] = def; }, players, reduce };

  // one ticker for every phone
  let last = 0, raf = 0;
  const tick = now => {
    const dt = last ? Math.min(50, now - last) : 16; last = now;
    let any = false;
    for (const p of players) if (p.live()) { p.advance(dt); any = true; }
    if (any) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
  };
  const wake = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };


  // icons: 24-point strokes in the iOS manner
  const P = {
    back: 'M15 5l-7 7 7 7', fwd: 'M9 5l7 7-7 7', down: 'M6 9l6 6 6-6',
    phone: 'M6.5 3.5h3l1.6 4.4-2.2 1.4a11.5 11.5 0 0 0 5.8 5.8l1.4-2.2 4.4 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
    video: 'M3.5 7.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2zM15.5 10.5l5-3v9l-5-3',
    plus: 'M12 5v14M5 12h14', x: 'M6 6l12 12M18 6L6 18',
    mic: 'M9 6.5a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21',
    up: 'M12 19V5M6 11l6-6 6 6',
    check: 'M5 12.5l4.5 4.5L19 7', dcheck: 'M2.5 12.5l4 4L15 7.5M11 16l.5.5L21.5 7.5',
    cal: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 10h16M8.5 3v4M15.5 3v4',
    pin: 'M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21zM12 12.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    users: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.3A6.5 6.5 0 0 1 21.5 20',
    file: 'M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5zM13.5 3v5.5H19',
    music: 'M9 18V5.5l11-2V16M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
    image: 'M3.5 6.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM20.5 15.5l-4.5-4.5-8.5 8.5M9 11a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 9 11z',
    share: 'M12 3.5v12M7.5 8L12 3.5 16.5 8M5 13.5v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2',
    search: 'M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM16 16l4.5 4.5',
    compose: 'M12 20h8M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
    chat: 'M20.5 11.5a8.5 8 0 0 1-12.4 7.1L3.5 20l1.4-4.1A8 8 0 1 1 20.5 11.5z',
    folder: 'M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
    mega: 'M3.5 10v4h3l8.5 4.5v-13L6.5 10zM18.5 9a4 4 0 0 1 0 6',
    tasks: 'M10 6.5h10M10 12h10M10 17.5h10M3.5 6.5l1.5 1.5 2.5-2.5M3.5 12l1.5 1.5 2.5-2.5M3.5 17.5l1.5 1.5 2.5-2.5',
    reply: 'M9.5 6.5L4.5 11.5l5 5M4.5 11.5h10a5 5 0 0 1 5 5v1.5',
    smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5v.5M15 9.5v.5',
    copy: 'M9 9h10v11H9zM15 9V5.5a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15H9',
    wand: 'M4 20l11-11M13.5 4.5v2M17.5 6.5l-1.4 1.4M19.5 10.5h-2M15 9l-1.5-1.5',
    lang: 'M3.5 5.5h9M8 3.5v2M5 9.5a8 8 0 0 0 6 4.5M11 5.5a10 10 0 0 1-6.5 9M13 20.5l4-9 4 9M14.4 17.5h5.2',
    screen: 'M3.5 5.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM8.5 20.5h7M12 16.5v4M9.5 10l2.5-2.5 2.5 2.5M12 7.5v5.5',
    sync: 'M4.5 12a7.5 7.5 0 0 1 13.1-5M19.5 12a7.5 7.5 0 0 1-13.1 5M18 3v4.2h-4.2M6 21v-4.2h4.2',
    head: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 1 2-2h1v7H6a2 2 0 0 1-2-2zM20 15a2 2 0 0 0-2-2h-1v7h1a2 2 0 0 0 2-2z',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.4 3.8 5.5 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.5-3.8-9S9.5 5.4 12 3z',
    ticket: 'M3.5 8.5V7a1.5 1.5 0 0 1 1.5-1.5h14A1.5 1.5 0 0 1 20.5 7v1.5a2.5 2.5 0 0 0 0 5V17a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17v-3.5a2.5 2.5 0 0 0 0-5zM14.5 5.5v13',
    bell: 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
    poster: 'M6 3.5h12a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5zM8 15.5h8M8 18h5M8 7l3 4 2-2 3 4',
    story: 'M8 3.5h8a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3zM8.5 6.5h7',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    lock: 'M6 11h12v9.5H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
    bolt: 'M13 3L5 13.5h6l-1 7.5 8-10.5h-6z',
    flag: 'M5 21V4M5 4.5h11l-2 4 2 4H5',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    cam: 'M3.5 8a2 2 0 0 1 2-2h2l1.5-2h6l1.5 2h2a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    speaker: 'M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11',
    layers: 'M12 3.5l9 4.5-9 4.5L3 8zM3 12.5l9 4.5 9-4.5M3 16.5l9 4.5 9-4.5',
    wave: 'M3 12h2M7 8v8M11 5v14M15 9v6M19 7v10M21 12h0',
  };
  const F = {
    spark: 'M11 2.5l2.1 6.4 6.4 2.1-6.4 2.1L11 19.5l-2.1-6.4-6.4-2.1 6.4-2.1zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z',
    play: 'M8 5.3v13.4a.7.7 0 0 0 1.1.6l10.3-6.7a.7.7 0 0 0 0-1.2L9.1 4.7A.7.7 0 0 0 8 5.3z',
    pause: 'M6.5 5h3.5v14H6.5zM14 5h3.5v14H14z',
    hang: 'M2.6 13.4c5.2-5 13.6-5 18.8 0 .5.5.5 1.3 0 1.8l-1.8 1.8c-.4.4-1 .5-1.5.2l-2.6-1.4c-.4-.2-.6-.6-.6-1v-2a10.6 10.6 0 0 0-5.8 0v2c0 .4-.2.8-.6 1l-2.6 1.4c-.5.3-1.1.2-1.5-.2l-1.8-1.8c-.5-.5-.5-1.3 0-1.8z',
    heart: 'M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7.3a4.6 4.6 0 0 1 8 2.8c0 5.8-8 10.4-8 10.4z',
    dot: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  };
  const ic = (n, cls = '') => F[n] ? `<svg class="i f ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${F[n]}"/></svg>` : `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n] || ''}"/></svg>`;
  FX.ic = ic;
  // the FYI mark: the wordmark inside an outlined speech bubble, tail at the bottom left
  FX.mark = (cls = '') => `<svg class="fx-mark ${cls}" viewBox="0 0 124 108" fill="none" stroke="currentColor" stroke-width="7.5" stroke-linejoin="miter" stroke-linecap="square" aria-hidden="true"><path class="bub" d="M6 6h112v68H42L20 98V74H6z"/><path class="ltr" d="M30 25v32M30 28h20M30 41h15M58 25l11 15 11-15M69 40v17M94 25v32"/></svg>`;
  const SB = '<div class="fx-sb" aria-hidden="true"><span>9:41</span><span class="ic"><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 16 12"><path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .5 10.4 10.4 0 0 0 .8 3.4L2 4.7a8.6 8.6 0 0 1 6-2.4zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4.1a6.7 6.7 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3zM8 9.4 10 7.5a3 3 0 0 0-4 0z"/></svg><svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="8" rx="2.2"/><path d="M25 4v4a2 2 0 0 0 0-4z" opacity=".45"/></svg></span></div>';
  FX.sb = SB;
  const shell = dev => {
    if (dev.querySelector('.fx-body')) return;
    dev.insertAdjacentHTML('afterbegin', `<div class="fx-body"><div class="fx-screen" aria-hidden="true"><div class="fx-app"></div>${SB}<i class="fx-island"></i><i class="fx-home"></i></div></div>`);
  };

  const tpl = document.createElement('template');
  const make = html => { tpl.innerHTML = String(html).trim(); return tpl.content.firstElementChild; };
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const SPRING = 'cubic-bezier(.34,1.4,.5,1)';

  // keyboard rows for the typing scenes
  const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  const keyboard = () => `<div class="fx-kb" aria-hidden="true"><div class="fx-kb-sug"><span>“creators”</span><span>the</span><span>I</span></div>${ROWS.map((r, i) => `<div class="fx-kb-r r${i}">${i === 2 ? '<b class="fx-k w">⇧</b>' : ''}${[...r].map(ch => `<b class="fx-k" data-k="${ch}">${ch}</b>`).join('')}${i === 2 ? '<b class="fx-k w">⌫</b>' : ''}</div>`).join('')}<div class="fx-kb-r r3"><b class="fx-k w2">123</b><b class="fx-k w2">☺</b><b class="fx-k sp" data-k=" ">space</b><b class="fx-k w3">return</b></div></div>`;

  class Player {
    constructor(root) {
      this.root = root; // the element with data-scene: one .fx-dev, or a stage that holds several phones
      this.def = SCENES[root.dataset.scene];
      this.devs = root.matches('.fx-dev') ? [root] : [...root.querySelectorAll('.fx-dev')];
      this.apps = this.devs.map(d => d.querySelector('.fx-app'));
      this.screens = this.devs.map(d => d.querySelector('.fx-screen'));
      this.app = this.apps[0];
      this.stage = root.closest('[data-fx-stage]') || root.parentElement;
      this.beatsEl = this.stage.querySelector('.fx-beats');
      this.pp = this.stage.querySelector('.fx-pp');
      this.now = this.stage.querySelector('.fx-now');
      this.loops = this.def.loops ?? 1;
      this.n = (this.beatsEl && this.beatsEl.children.length) || this.def.n || (this.def.beats || []).length;
      this.rest = this.def.rest ?? this.n - 1;
      this.replays = 0;
      this.t = 0; this.waits = []; this.anims = new Set(); this.token = 0;
      this.visible = false; this.seen = false; this.left = false; this.done = false; this.started = false;
      this.solo = false; this.parked = false; // solo: this stage plays while the page's demos are paused; parked: shown at rest while paused
      this.user = !reduce; this.ff = false; this.stopAt = -1; this.stopHold = false; this.cur = -1;
      this.touches = this.screens.map(sc => { const t = make('<span class="fx-touch" aria-hidden="true"></span>'); sc.append(t); return t; });
      this.buildBeats(); this.bindPP();
    }
    live() { return this.visible && this.user && this.started && !this.done && (!FX.held || this.solo) && !FX.dialog && !document.hidden; }
    advance(dt) {
      this.t += dt;
      if (!this.waits.length) return;
      const due = [], keep = [];
      for (const w of this.waits) (w.at <= this.t ? due : keep).push(w);
      this.waits = keep; due.forEach(w => w.ok());
    }
    sync() {
      const on = this.live();
      this.devs.forEach(d => d.classList.toggle('fx-paused', !on));
      // an animation held at its end is finished, not resumed: play() there would rewind it to 0
      this.anims.forEach(a => { try {
        const end = a.effect ? a.effect.getComputedTiming().endTime : 0;
        if (a.playState === 'finished' || (a.currentTime ?? 0) >= end) { if (a.playState !== 'finished') a.finish(); this.anims.delete(a); }
        else if (on) a.play(); else a.pause();
      } catch (e) { this.anims.delete(a); } });
      if (this.pp) {
        const mode = reduce ? (this.stepping ? 'pause' : 'play') : this.done ? 'replay' : (this.user && (!FX.held || this.solo) ? 'pause' : 'play');
        this.pp.dataset.mode = mode;
        this.pp.setAttribute('aria-label', mode === 'replay' ? 'Replay the demo' : mode === 'pause' ? 'Pause the demo' : 'Play the demo');
        const t = this.pp.querySelector('.t'); if (t) t.textContent = mode === 'replay' ? 'Replay' : mode === 'pause' ? 'Pause' : 'Play';
      }
      this.stage.classList.toggle('fx-on', on);
      this.stage.style.setProperty('--prog', this.done ? 1 : Math.max(0, this.shown ?? 0) / this.n);
      if (on) wake();
    }
    wait(ms) {
      const tok = this.token;
      if (this.ff) return Promise.resolve().then(() => { if (tok !== this.token) throw CANCEL; });
      return new Promise((ok, no) => { this.waits.push({ at: this.t + ms, ok: () => (tok === this.token ? ok() : no(CANCEL)), no }); wake(); });
    }
    anim(el, kf, o) {
      const opts = typeof o === 'number' ? { duration: o } : (o || {});
      const a = el.animate(kf, { duration: 420, easing: EASE, fill: 'none', ...opts });
      if (this.ff) { a.finish(); return a; }
      this.anims.add(a);
      a.addEventListener('finish', () => this.anims.delete(a));
      if (!this.live()) a.pause();
      return a;
    }
    show(i) {
      const had = this.beatsEl && this.beatsEl.contains(document.activeElement);
      this.shown = i;
      if (this.beatsEl) [...this.beatsEl.children].forEach((li, k) => { const on = k === i; li.classList.toggle('on', on); li.classList.toggle('done', k < i); const b = li.querySelector('button'); if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      this.stage.dataset.beat = i;
      if (this.dots) this.dots.forEach((d, k) => { d.classList.toggle('done', k < i); if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      this.stage.style.setProperty('--prog', Math.max(0, i) / this.n);
      if (this.now && this.beatsEl) { const l = this.beatsEl.children[i] && this.beatsEl.children[i].querySelector('.l'); this.now.textContent = l ? l.textContent : ''; }
      // the one-line rail on phones hides the beat that just ended; keep keyboard focus on the current one
      if (had && i >= 0 && !this.stage.classList.contains('st-all') && matchMedia('(max-width: 760px)').matches) { const b = this.beatsEl.children[i] && this.beatsEl.children[i].querySelector('button'); if (b && b !== document.activeElement) b.focus({ preventScroll: true }); }
      this.stage.dispatchEvent(new CustomEvent('fx:beat', { detail: { i, ff: this.ff } }));
    }
    // scripts call "await c.beat(i)" at the start of each beat; a held jump stops here, before beat i draws anything
    beat(i) {
      this.cur = i;
      if (this.ff && this.stopAt >= 0 && i >= this.stopAt) {
        this.unff();
        if (this.stopHold) { this.stopHold = false; this.user = false; this.show(Math.max(0, i - 1)); this.sync(); return this.wait(0); }
      }
      this.show(i);
      return this.wait(0);
    }
    unff() { this.ff = false; this.app.offsetWidth; this.devs.forEach(d => d.classList.remove('fx-ff')); this.stage.classList.remove('fx-ff'); }
    reset() {
      this.token++;
      const old = this.waits; this.waits = []; old.forEach(w => w.no(CANCEL));
      this.anims.forEach(a => { try { a.cancel(); } catch (e) {} }); this.anims.clear();
      this.t = 0;
      const html = typeof this.def.html === 'function' ? this.def.html() : this.def.html;
      this.apps.forEach((app, i) => { app.className = 'fx-app ' + (this.def.cls || ''); app.innerHTML = Array.isArray(html) ? html[i] : html; });
      this.touches.forEach(t => { t.style.opacity = 0; });
      this.screens.forEach((sc, i) => { const sb = sc.querySelector('.fx-sb span'); if (sb) sb.textContent = (Array.isArray(this.def.time) ? this.def.time[i] : this.def.time) || '9:41'; });
      if (this.def.reset) this.def.reset(this.stage);
    }
    // run from beat k; hold=true stops on the state at the end of beat k (reduced motion, or a click while paused)
    async run(k = 0, hold = false) {
      this.reset();
      const tok = this.token;
      const last = this.n - 1;
      this.done = false; this.left = false;
      this.ff = k > 0 || hold; this.stopAt = hold ? (k >= last ? Infinity : k + 1) : k; this.stopHold = hold && k < last;
      if (hold) this.user = false;
      this.devs.forEach(d => d.classList.toggle('fx-ff', this.ff)); this.stage.classList.toggle('fx-ff', this.ff);
      this.started = true; this.sync();
      const c = this.ctx(0);
      try {
        for (let n = 1; ; n++) {
          await this.def.run(c);
          if (tok !== this.token) return;
          if (this.ff || n >= this.loops) { // the end: hold the finished state
            if (this.ff) this.unff();
            this.cur = last; this.show(last); this.done = true; this.sync(); return;
          }
          await this.wait(this.def.hold || 2600);
          const fades = this.apps.map(app => this.anim(app, [{ opacity: 1 }, { opacity: 0 }], { duration: 380, fill: 'forwards' }).finished.catch(() => {}));
          await Promise.all(fades);
          if (tok !== this.token) return;
          this.reset(); this.token = tok; // the same run on a fresh screen
          this.apps.forEach(app => this.anim(app, [{ opacity: 0 }, { opacity: 1 }], 380));
        }
      } catch (e) { if (e !== CANCEL) console.error(e); }
    }
    // start again from beat 0. A phone showing a later state dips to black first, so a finished conversation never cuts
    // straight to an empty first beat: one dip, and the two frames never overlap
    restart() {
      if (this.dipping) return; // one dip at a time: a second click during it changes nothing
      if (!this.started || reduce || (!this.done && !(this.shown > 0))) return this.run(0);
      this.dipping = true;
      // page parts a scene names (06's formats) go dark with the phone
      const tok = this.token, els = [...this.apps, ...(this.def.dip ? this.def.dip(this.stage) : [])];
      Promise.all(els.map(a => a.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {}))).then(() => {
        this.dipping = false;
        if (tok === this.token) this.run(0); // a step picked during the dip has already restarted the scene
        els.forEach(a => a.getAnimations().forEach(x => x.cancel()));
        // the fade-in runs on the page clock, so a pause pressed during the dip never leaves the phone dark
        this.apps.forEach(a => a.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: EASE }));
      });
    }
    buildBeats() {
      if (!this.beatsEl) return;
      if (!this.beatsEl.children.length) this.beatsEl.innerHTML = (this.def.beats || []).map((b, i) => `<li><button type="button"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="l">${b}</span></button></li>`).join('');
      const go = i => {
        // on phones a step picked from the full list may sit far below the phone: bring the phone into view first
        if (matchMedia('(max-width: 760px)').matches) { const r = this.root.getBoundingClientRect(); if ((Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) / r.height < .6) this.root.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
        this.parked = false;
        if (reduce) { this.stopStep(); this.run(i, true); } else if (this.user && (!FX.held || this.solo) && (!this.done || this.dipping)) this.run(i); else this.run(i, true);
      };
      [...this.beatsEl.querySelectorAll(':scope > li > button')].forEach((b, i) => { b.removeAttribute('tabindex'); b.addEventListener('click', () => go(i)); });
      const mini = make(`<div class="fx-mini"><div class="fx-dots" role="group" aria-label="Steps">${Array.from({ length: this.n }, (_, i) => `<button type="button" aria-label="Step ${i + 1}"></button>`).join('')}</div><button type="button" class="fx-allb" aria-expanded="false">All steps</button></div>`);
      this.beatsEl.after(mini);
      this.dots = [...mini.querySelectorAll('.fx-dots button')];
      this.dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
      const ab = mini.querySelector('.fx-allb');
      ab.addEventListener('click', () => { const on = !this.stage.classList.contains('st-all'); this.stage.classList.toggle('st-all', on); ab.setAttribute('aria-expanded', String(on)); });
    }
    bindPP() {
      const rp = this.stage.querySelector('.fx-rp');
      if (rp) rp.addEventListener('click', () => { this.solo = FX.held; this.parked = false; this.stopStep(); this.user = true; this.restart(); });
      if (reduce) {
        this.stage.classList.add('fx-rm');
        const bar = this.stage.querySelector('.st-bar');
        if (bar) {
          const mk = (cls, label, d) => { const b = make(`<button type="button" class="fx-step ${cls}" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg></button>`); bar.append(b); return b; };
          mk('fx-prev', 'Step back', 'M15 5l-7 7 7 7').addEventListener('click', () => { this.stopStep(); this.run(Math.max(0, (this.shown ?? 0) - 1), true); });
          mk('fx-next', 'Step forward', 'M9 5l7 7-7 7').addEventListener('click', () => { this.stopStep(); this.run(Math.min(this.n - 1, (this.shown ?? -1) + 1), true); });
        }
      }
      if (!this.pp) return;
      if (!this.pp.querySelector('svg')) this.pp.innerHTML = '<svg class="m-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg><svg class="m-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.3v13.4a.7.7 0 0 0 1.1.6l10.3-6.7a.7.7 0 0 0 0-1.2L9.1 4.7A.7.7 0 0 0 8 5.3z"/></svg><svg class="m-replay" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4"/></svg>';
      this.pp.addEventListener('click', () => {
        if (reduce) { if (this.stepping) this.stopStep(); else this.stepThrough(); return; }
        const fresh = !this.started || this.done || this.parked;
        if (FX.held && !this.solo) this.solo = true; // plays this stage only; the page's demos stay paused
        else if (!fresh) { this.user = !this.user; this.sync(); if (this.user) this.show(this.cur); return; }
        this.user = true;
        if (fresh) { this.parked = false; this.restart(); } else { this.sync(); this.show(this.cur); }
      });
    }
    // reduced motion: Play steps through the beats as instant state changes
    stepThrough() {
      let i = (this.shown ?? -1) + 1;
      if (i >= this.n) i = 0;
      this.stepping = true;
      const next = () => { if (!this.stepping) return; this.run(i, true); this.sync(); i++; if (i < this.n) this.stepT = setTimeout(next, 1600); else { this.stepping = false; this.sync(); } };
      next();
    }
    stopStep() { if (this.stepping) { this.stepping = false; clearTimeout(this.stepT); this.sync(); } }
    ctx(idx = 0) {
      this._cx = this._cx || [];
      if (this._cx[idx] && this._cx[idx].tok === this.token) return this._cx[idx];
      const P = this, app = this.apps[idx], scr = this.screens[idx], touch = this.touches[idx];
      const q = s => app.querySelector(s), qa = s => [...app.querySelectorAll(s)];
      const k = () => scr.getBoundingClientRect().width / 390 || 1;
      const c = {
        q, qa, make, P, app, stage: P.stage, ic: (...a) => FX.ic(...a),
        tok: P.token,
        get ff() { return P.ff; },
        on: j => P.ctx(j),
        page: sel => P.stage.querySelector(sel),
        wait: ms => P.wait(ms),
        beat: i => P.beat(i),
        anim: (el, kf, o) => P.anim(el, kf, o),
        // add an element with an entrance (up | pop | fade | down | right | left | none)
        add(parent, html, how = 'up', o = {}) {
          const el = typeof html === 'string' ? make(html) : html;
          if (o.before) parent.insertBefore(el, o.before); else if (o.prepend) parent.prepend(el); else parent.append(el);
          if (how && how !== 'none') c.enter(el, how, o);
          return el;
        },
        enter(el, how = 'up', o = {}) {
          const from = { up: 'translateY(16px) scale(.98)', pop: 'scale(.86)', down: 'translateY(-14px)', right: 'translateX(26px)', left: 'translateX(-26px)', fade: 'none', rise: 'translateY(100%)' }[how] || 'none';
          return P.anim(el, [{ opacity: how === 'rise' ? 1 : 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: o.d || (how === 'pop' ? 480 : 420), easing: how === 'pop' ? SPRING : EASE, delay: o.delay || 0, fill: 'backwards' });
        },
        leave(el, how = 'fade', o = {}) {
          const to = { fade: 'none', down: 'translateY(16px)', up: 'translateY(-16px)', pop: 'scale(.9)', sink: 'translateY(100%)' }[how] || 'none';
          const a = P.anim(el, [{ opacity: 1, transform: 'none' }, { opacity: how === 'sink' ? 1 : 0, transform: to }], { duration: o.d || 300, fill: 'forwards' });
          return a.finished.then(() => { if (!o.keep) el.remove(); }, () => {});
        },
        // push a message into a bottom-anchored list: the list slides up by the new item's height
        async push(list, html, how = 'up', o = {}) {
          const el = typeof html === 'string' ? make(html) : html;
          list.append(el);
          const h = el.getBoundingClientRect().height / k() + (parseFloat(getComputedStyle(list).rowGap) || 0);
          P.anim(list, [{ transform: `translateY(${h}px)` }, { transform: 'none' }], { duration: o.d || 460 });
          c.enter(el, how, { d: o.d || 460 });
          return el;
        },
        // replace one item of a bottom-anchored list with another, sliding the list by the change in height
        swap(oldEl, html, how = 'fade', o = {}) {
          const el = typeof html === 'string' ? make(html) : html;
          const list = oldEl.parentElement, h0 = oldEl.getBoundingClientRect().height / k();
          oldEl.replaceWith(el);
          const d = el.getBoundingClientRect().height / k() - h0;
          if (d) P.anim(list, [{ transform: `translateY(${d}px)` }, { transform: 'none' }], { duration: o.d || 380 });
          c.enter(el, how, { d: o.d || 380 });
          return el;
        },
        // insert into the middle of a bottom-anchored list: what sits above it moves up
        insert(before, html, how = 'fade', o = {}) {
          const el = typeof html === 'string' ? make(html) : html;
          const list = before.parentElement;
          list.insertBefore(el, before);
          const h = el.getBoundingClientRect().height / k();
          P.anim(el, [{ height: '0px', opacity: 0, overflow: 'hidden' }, { height: h + 'px', opacity: 1, overflow: 'hidden' }], { duration: o.d || 380 });
          return el;
        },
        // tap: a touch dot over the element, a press on the element
        async tap(el, o = {}) {
          if (!el) return;
          const r = el.getBoundingClientRect(), s = scr.getBoundingClientRect(), kk = k();
          const x = (r.left - s.left + r.width * (o.x ?? .5)) / kk, y = (r.top - s.top + r.height * (o.y ?? .5)) / kk;
          const t = touch; t.style.left = x + 'px'; t.style.top = y + 'px';
          if (P.ff) { t.style.opacity = 0; return; }
          P.anim(t, [{ opacity: 0, transform: 'translate(-50%,-50%) scale(1.5)' }, { opacity: 1, transform: 'translate(-50%,-50%) scale(1)', offset: .45 }, { opacity: 1, transform: 'translate(-50%,-50%) scale(.82)', offset: .7 }, { opacity: 0, transform: 'translate(-50%,-50%) scale(1.1)' }], { duration: o.long ? 1100 : 620, easing: 'ease-out' });
          await c.wait(o.long ? 380 : 240);
          if (!o.noPress) P.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${o.press || .96})` }, { transform: 'scale(1)' }], { duration: o.long ? 700 : 300, easing: 'ease-out' });
          await c.wait(o.long ? 720 : 200);
        },
        // type into an element character by character; flashes keys when a keyboard is open
        async type(el, text, o = {}) {
          const cps = o.cps || 24, kb = q('.fx-kb');
          el.classList.add('is-typing'); el.classList.remove('is-empty');
          let s = o.keep ? el.textContent : '';
          for (const ch of text) {
            s += ch; el.textContent = s;
            if (kb && !P.ff) { const key = kb.querySelector(`[data-k="${ch.toLowerCase() === ' ' ? ' ' : CSS.escape(ch.toLowerCase())}"]`); if (key) P.anim(key, [{ background: '#6b6b72', transform: 'translateY(-3px) scale(1.12)' }, { background: '', transform: 'none' }], 200); }
            await c.wait((1000 / cps) * (ch === ' ' ? 1.6 : /[,.!?]/.test(ch) ? 2.6 : 1));
          }
          if (!o.caret) el.classList.remove('is-typing');
        },
        // stream words into an element, like a model answer
        async stream(el, text, o = {}) {
          const wps = o.wps || 16, words = text.split(/(\s+)/);
          el.classList.add('is-streaming');
          let s = '';
          for (const w of words) { s += w; el.textContent = s; if (w.trim()) await c.wait(1000 / wps); }
          el.classList.remove('is-streaming');
        },
        async count(el, a, b, ms = 900, fmt = n => Math.round(n).toLocaleString('en-US')) {
          if (P.ff) { el.textContent = fmt(b); return; }
          const steps = Math.max(6, Math.round(ms / 50));
          for (let i = 1; i <= steps; i++) { const e = 1 - Math.pow(1 - i / steps, 3); el.textContent = fmt(a + (b - a) * e); await c.wait(ms / steps); }
        },
        keyboard(show = true) {
          const host = q('.fx-kbhost') || app;
          let kb = q('.fx-kb');
          if (show && !kb) { kb = c.add(host, keyboard(), 'rise', { d: 380 }); app.classList.add('kb-open'); }
          else if (!show && kb) { app.classList.remove('kb-open'); c.leave(kb, 'sink', { d: 320 }); }
          return c.wait(show ? 260 : 220);
        },
        // move the inner content of a scroller (no native scrolling, so it stays on the clock)
        scroll(el, y, ms = 700) {
          const from = el.dataset.y || 0; el.dataset.y = y;
          el.style.transform = `translateY(${-y}px)`;
          P.anim(el, [{ transform: `translateY(${-from}px)` }, { transform: `translateY(${-y}px)` }], { duration: ms, easing: 'cubic-bezier(.3,.7,.2,1)' });
          return c.wait(ms);
        },
        cls(el, name, on = true) { el.classList.toggle(name, on); },
        time(t) { const sb = scr.querySelector('.fx-sb span'); if (sb) sb.textContent = t; },
        tag(t) { const el = P.stage.querySelector('.demo-tag'); if (el) el.textContent = t; },
        haptic(el) { return P.anim(el, [{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], 180); },
      };
      this._cx[idx] = c;
      return c;
    }
  }

  const fit = dev => { const w = dev.getBoundingClientRect().width; if (w) dev.style.setProperty('--k', (w / 418).toFixed(5)); };
  // "Pause demos": one switch for every phone on the page, remembered for this reader when storage allows
  FX.held = false;
  try { FX.held = localStorage.getItem('fyi-demos') === 'held'; } catch (e) {}
  FX.hold = on => {
    FX.held = !!on;
    try { localStorage.setItem('fyi-demos', on ? 'held' : 'on'); } catch (e) {}
    document.querySelectorAll('.fx-all').forEach(b => { b.toggleAttribute('data-held', FX.held); const t = b.querySelector('.t'); if (t) t.textContent = FX.held ? 'Play demos' : 'Pause demos'; });
    players.forEach(p => {
      p.solo = false;
      // a phone parked at rest while demos were paused plays from the start once they play again
      if (!FX.held && p.parked && p.visible && !reduce) { p.parked = false; p.user = true; p.restart(); }
      p.sync();
    });
  };
  // static frames (the spec view, the compare slider, the state strips) are drawn once from templates
  FX.statics = {};
  const start = () => {
    const ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => fit(e.target))) : null;
    document.querySelectorAll('[data-static]').forEach(el => {
      const f = FX.statics[el.dataset.static]; if (!f) return;
      if (el.matches('.fx-dev')) { shell(el); fit(el); if (ro) ro.observe(el); el.querySelector('.fx-app').innerHTML = f(); el.querySelector('.fx-app').className = 'fx-app fx-static'; }
      else el.innerHTML = `<div class="fx-app fx-static">${f()}</div>`;
    });
    const roots = [...document.querySelectorAll('[data-scene]')].filter(r => SCENES[r.dataset.scene]);
    roots.forEach(r => {
      const devs = r.matches('.fx-dev') ? [r] : [...r.querySelectorAll('.fx-dev')];
      devs.forEach(d => { shell(d); fit(d); if (ro) ro.observe(d); });
      const p = new Player(r); r._fx = p; players.push(p); p.reset();
      if (reduce) { p.cur = p.rest; p.show(p.rest); }
    });
    if (!ro) addEventListener('resize', () => document.querySelectorAll('.fx-dev').forEach(fit));
    // first view: play from the start, or show the rest frame (reduced motion, or demos paused)
    const first = p => { p.seen = true; if (reduce || FX.held) { p.parked = !reduce; p.run(p.rest, true); } else p.run(0); };
    // a finished scene coming back into view dips to black before it replays, like the hero's loop
    const again = p => { p.replays++; p.restart(); };
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
      const p = e.target._fx;
      // play and pause at 45% visible, but start (or replay) only once the phone is nearly whole, so the first beat is seen
      p.visible = e.isIntersecting && e.intersectionRatio >= .45;
      p.devs.forEach(d => d.classList.toggle('fx-off', !e.isIntersecting));
      const full = e.isIntersecting && (e.intersectionRatio >= .85 || e.intersectionRect.height >= innerHeight * .8);
      if (!e.isIntersecting && p.done) p.left = true;
      if (full && !p.seen) first(p);
      else if (full && p.parked && !FX.held && !reduce) { p.parked = false; p.user = true; p.restart(); }
      // a finished scene plays again when it comes back into view, twice at most; after that only Replay plays it
      else if (full && p.done && p.left && !reduce && !FX.held && p.user && p.loops === 1 && p.replays < 2) { p.left = false; again(p); }
      p.sync();
    }), { threshold: [0, .1, .2, .3, .45, .55, .65, .75, .85, .95, 1] }) : null;
    // the page's figure viewer pauses every phone while it is open
    const watchDialog = () => { const d = document.querySelector('dialog.cv'); if (!d) return; new MutationObserver(() => { FX.dialog = d.open; players.forEach(p => p.sync()); }).observe(d, { attributes: true, attributeFilter: ['open'] }); };
    watchDialog();
    // reduced motion: every phone shows its rest frame from the start, so nothing changes as it scrolls in
    const go = () => { players.forEach(p => { if (reduce) first(p); if (io) io.observe(p.root); else { p.visible = true; if (!p.seen) first(p); } }); };
    // fonts first, so text measures right; never wait long for them
    let went = false; const once = () => { if (!went) { went = true; go(); } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(once); setTimeout(once, 400);
    document.addEventListener('visibilitychange', () => players.forEach(p => p.sync()));
    document.querySelectorAll('.fx-all').forEach(b => b.addEventListener('click', () => FX.hold(!FX.held)));
    FX.hold(FX.held);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => queueMicrotask(start)); else queueMicrotask(start);
  FX.start = start;
})();
