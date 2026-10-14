// Live Design Lab screens: each window draws the app as HTML at its native 1440×900 and scales it to fit, so text and
// lines stay sharp at any size. A scripted scene runs on its own clock, which only moves while the window is on screen,
// the tab is visible and the reader has not paused it. With reduced motion a scene opens on a still and steps on request.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SCENES = {};
  const CANCEL = Symbol('cancel');
  // a scene cut short by a seek or a reset rejects its pending waits with CANCEL; that is not an error
  addEventListener('unhandledrejection', e => { if (e.reason === CANCEL) e.preventDefault(); });
  const players = [];
  const W = 1440, H = 900;
  // on a narrow screen the window turns portrait and frames a 480×600 part of the app, following the cursor
  const VW = 480, VH = 600, NARROW = 640;
  const LX = window.LX = { players, reduce, W, H };
  // test hook: with ?lxclock=manual in the address the clock only moves through LX.advance(ms), so frames can be compared exactly
  LX.manual = /[?&]lxclock=manual\b/.test(location.search);
  if (LX.manual) document.documentElement.classList.add('lx-manual');

  // one ticker for every window
  let last = 0, raf = 0;
  const tick = now => {
    const dt = last ? Math.min(50, now - last) : 16; last = now;
    let any = false;
    for (const p of players) if (p.live()) { p.advance(dt); any = true; }
    if (any) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
  };
  const wake = () => { if (!raf && !LX.manual) { last = 0; raf = requestAnimationFrame(tick); } };

  // icons: 24-unit outline strokes in the Lucide manner, drawn at the size the class sets
  const P = {
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20.5 20.5L16 16',
    plus: 'M12 5v14M5 12h14', x: 'M6 6l12 12M18 6L6 18', check: 'M5 12.5l4.5 4.5L19 7',
    down: 'M6 9l6 6 6-6', right: 'M9 6l6 6-6 6', left: 'M15 6l-6 6 6 6',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
    alert: 'M12 4L2.8 19.5h18.4zM12 10v4.5M12 17.4v.1',
    phone: 'M6.5 3.5h3l1.6 4.4-2.2 1.4a11.5 11.5 0 0 0 5.8 5.8l1.4-2.2 4.4 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z',
    shield: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.1-7.5 9.5-4.3-1.4-7.5-4.9-7.5-9.5V6zM9 12l2 2 4-4',
    shieldPlain: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.1-7.5 9.5-4.3-1.4-7.5-4.9-7.5-9.5V6z',
    pulse: 'M3 12h4l2.5-6 5 12 2.5-6h4',
    doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M8.5 13h7M8.5 16.5h5',
    file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5',
    sqcheck: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8.5 12l2.5 2.5 4.5-5',
    msg: 'M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z',
    clip: 'M20.5 11.5l-8.2 8.2a5 5 0 0 1-7-7l8.2-8.2a3.3 3.3 0 0 1 4.7 4.7l-8.2 8.2a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6',
    at: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM16 8v5.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1',
    fwd: 'M15 14l5-5-5-5M20 9H9.5A5.5 5.5 0 0 0 4 14.5V20',
    copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
    ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.6 5.6l12.8 12.8',
    play: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8.5v7l5.5-3.5z',
    archive: 'M3.5 4.5h17v4h-17zM5 8.5v10a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-10M10 12.5h4',
    grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM17 14v6M14 17h6',
    term: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM7 10l2.5 2L7 14M12 14h4',
    book: 'M5 19.5V5a2 2 0 0 1 2-2h12v15H7a2 2 0 0 0-2 2zM5 19.5A1.5 1.5 0 0 0 6.5 21H19',
    users: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.3A6.5 6.5 0 0 1 21.5 20',
    bolt: 'M13 2.5L4.5 13.5H12l-1 8 8.5-11H12z',
    bag: 'M5 7h14l-1 13H6zM9 7a3 3 0 0 1 6 0',
    news: 'M5 4h11a1 1 0 0 1 1 1v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM17 9h2.5a.5.5 0 0 1 .5.5V19a2 2 0 0 1-2 2M7.5 8h6M7.5 11.5h6M7.5 15h4',
    video: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM10 9.5v5l4-2.5z',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
    moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
    out: 'M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10',
    lang: 'M3.5 5.5h9M8 3.5v2M5 9.5a8 8 0 0 0 6 4.5M11 5.5a10 10 0 0 1-6.5 9M13 20.5l4-9 4 9M14.4 17.5h5.2',
    glasses: 'M3 13a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0zM14 13a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0zM10 13h4M4 8.5l2-3.5h12l2 3.5',
    robot: 'M12 4a6 6 0 0 0-6 6v1a6 6 0 0 0 6 6M12 4a6 6 0 0 1 6 6v1a6 6 0 0 1-6 6M9.5 10.5h.01M14.5 10.5h.01M12 17v3M8 20h8',
    report: 'M6 3.5h12a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1zM8.5 8h7M8.5 12h7',
    chat: 'M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z',
    db: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6',
    topics: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  };
  // a scene can add its own outline icons: LX.addIcons({ name: 'svg path d' })
  LX.addIcons = o => Object.assign(P, o);
  // filled glyphs
  const F = {
    spark: 'M11 2.5l2.1 6.4 6.4 2.1-6.4 2.1L11 19.5l-2.1-6.4-6.4-2.1 6.4-2.1zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z',
    dot: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  };
  const ic = (n, cls = '') => F[n] ? `<svg class="i f ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${F[n]}"/></svg>` : `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n] || ''}"/></svg>`;
  LX.ic = ic;
  // priority: three rising bars, the first n of them dark
  LX.prio = n => `<svg class="prio" viewBox="0 0 13 10" aria-hidden="true">${[[0, 6], [5, 3], [10, 0]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="2.6" height="${10 - y}" rx="1.2" class="${i < n ? 'on' : ''}"/>`).join('')}</svg>`;
  const AV = { AW: '#4488f4', RC: '#66ac8c', PN: '#d396e0', JS: '#64a498', SC: '#eeaa9e', MW: '#fc6e4c', LC: '#94a484', DB: '#78a8b2', MC: '#d598d8', U: '#d64545' };
  LX.av = (ini, cls = '') => ini ? `<i class="av ${cls}" style="--c:${AV[ini] || '#999'}">${ini}</i>` : `<i class="av none ${cls}"></i>`;
  // the Hear mark: two slanted strokes crossed by a bar
  LX.mark = (cls = '') => `<svg class="hmark ${cls}" viewBox="0 0 20 16" aria-hidden="true"><path d="M7.5 1.5L3.5 14.5M15 1.5L11 14.5M1.5 6.5h14.5l2.5-2"/></svg>`;

  // the Design Lab shell: sidebar card with the brand block, workspace, Ask AI, versions, the nav and the user row
  const NAV = [
    ['report', 'Reports'], ['grid', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge'], ['spark', 'Magic API'],
    ['h', 'Operations'], ['robot', 'AI Tasks'], ['users', 'Customers'], ['bolt', 'Actions'], ['bag', 'Marketplace'],
    ['news', 'News · Directions', 1], ['video', 'Demos', 1], ['story', 'Storybook', 1],
  ];
  // the full nav starts with the Main group; a scene passes nav: [...LX.NAV_MAIN, ...LX.NAV] and a scroll to match its recording
  LX.NAV = NAV;
  LX.NAV_MAIN = [['h', 'Main'], ['chat', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['topics', 'Topics']];
  LX.shell = (o = {}) => `<aside class="lx-sb${o.dark ? ' dark' : ''}">
    <div class="sb-brand"><span class="sb-tile">H</span><span class="sb-name"><b>Hear</b><small>Powered by ${LX.mark()}Hear</small></span></div>
    <div class="sb-row"><span class="sb-org"><i class="dotc"></i>Northwind${ic('down')}</span><span class="sb-bell">${ic('bell')}<b>2</b></span></div>
    <div class="sb-row"><span class="sb-ai">${ic('spark')}<span>A…</span><kbd>Ctrl J</kbd></span><span class="sb-ver"><span>V1</span><span class="on">V2</span></span></div>
    <div class="sb-nav"><div class="sb-list" style="transform:translateY(${-(o.scroll ?? 0)}px)">${(o.nav || NAV).map(([icn, l, dev]) => icn === 'h' ? `<div class="sb-h">${l}</div>` : `<div class="sb-i${l === o.active ? ' on' : ''}${dev ? ' dev' : ''}" data-nav="${l}">${icn === 'story' ? LX.mark('sm') : ic(icn)}<span>${l}</span>${dev ? '<em>DEV</em>' : ''}</div>`).join('')}</div></div>
    <div class="sb-user"><span class="sb-me">${LX.av('U', 'me')}<b>You</b></span><span class="sb-lang">${ic('lang')}EN${ic('down')}</span></div>
    <div class="sb-tools">${ic('gear')}<i></i>${ic('moon')}<i></i>${ic('glasses')}<i></i>${ic('out')}</div>
    <span class="sb-tab">${ic('right')}</span>
  </aside>`;

  const tpl = document.createElement('template');
  const make = html => { tpl.innerHTML = String(html).trim(); return tpl.content.firstElementChild; };
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  LX.make = make; LX.EASE = EASE;

  class Player {
    constructor(root) {
      this.root = root; // .lx[data-lab]: the window that draws the app
      this.def = SCENES[root.dataset.lab];
      this.app = root.querySelector('.lx-app');
      this.stage = root.closest('[data-lx-stage]') || root.closest('figure') || root.parentElement;
      this.beatsEl = this.stage.querySelector('.lx-beats');
      this.pp = this.stage.querySelector('.lx-pp');
      this.now = this.stage.querySelector('.lx-now');
      this.stage.classList.add('lx-ready');
      this.loops = this.def.loops ?? Infinity;
      this.n = (this.beatsEl && this.beatsEl.children.length) || this.def.n || (this.def.beats || []).length;
      this.rest = this.def.rest ?? this.n - 1;
      this.t = 0; this.waits = []; this.anims = new Set(); this.token = 0;
      this.visible = false; this.seen = false; this.done = false; this.started = false;
      this.solo = false; this.parked = false;
      this.user = !reduce; this.ff = false; this.stopAt = -1; this.stopHold = false; this.cur = -1;
      this.buildBeats(); this.bindPP();
    }
    live() { return this.visible && this.user && this.started && !this.done && (!LX.held || this.solo) && !LX.dialog && !document.hidden; }
    advance(dt) {
      this.t += dt;
      if (LX.manual) this.anims.forEach(a => { try { const end = a.effect.getComputedTiming().endTime; const ct = (a.currentTime || 0) + dt; if (ct >= end) { a.finish(); this.anims.delete(a); } else a.currentTime = ct; } catch (e) { this.anims.delete(a); } });
      if (!this.waits.length) return;
      const due = [], keep = [];
      for (const w of this.waits) (w.at <= this.t ? due : keep).push(w);
      this.waits = keep; due.forEach(w => w.ok());
    }
    sync() {
      const on = this.live();
      this.root.classList.toggle('lx-paused', !on);
      this.anims.forEach(a => { try {
        const end = a.effect ? a.effect.getComputedTiming().endTime : 0;
        if (a.playState === 'finished' || (a.currentTime ?? 0) >= end) { if (a.playState !== 'finished') a.finish(); this.anims.delete(a); }
        else if (on && !LX.manual) a.play(); else a.pause();
      } catch (e) { this.anims.delete(a); } });
      if (this.pp) {
        const mode = reduce ? (this.stepping ? 'pause' : 'play') : this.done ? 'replay' : (this.user && (!LX.held || this.solo) ? 'pause' : 'play');
        this.pp.dataset.mode = mode;
        this.pp.setAttribute('aria-label', mode === 'replay' ? 'Replay the demo' : mode === 'pause' ? 'Pause the demo' : 'Play the demo');
      }
      this.stage.classList.toggle('lx-on', on);
      if (on) wake();
    }
    wait(ms) {
      const tok = this.token;
      if (this.ff) return Promise.resolve().then(() => { if (tok !== this.token) throw CANCEL; });
      return new Promise((ok, no) => { this.waits.push({ at: this.t + ms, ok: () => (tok === this.token ? ok() : no(CANCEL)), no }); wake(); });
    }
    anim(el, kf, o) {
      const opts = typeof o === 'number' ? { duration: o } : (o || {});
      const a = el.animate(kf, { duration: 300, easing: EASE, fill: 'none', ...opts });
      if (this.ff) { a.finish(); return a; }
      this.anims.add(a);
      a.addEventListener('finish', () => this.anims.delete(a));
      if (!this.live() || LX.manual) a.pause();
      return a;
    }
    show(i) {
      this.shown = i;
      if (this.beatsEl) [...this.beatsEl.children].forEach((li, k) => { const on = k === i; li.classList.toggle('on', on); li.classList.toggle('done', k < i); const b = li.querySelector('button'); if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      this.stage.dataset.beat = i;
      this.stage.style.setProperty('--prog', (i + 1) / this.n);
      if (this.now && this.beatsEl) { const l = this.beatsEl.children[i] && this.beatsEl.children[i].querySelector('.l'); this.now.innerHTML = l ? `<b>${String(i + 1).padStart(2, '0')} / ${String(this.n).padStart(2, '0')}</b>` : ''; if (l) this.now.append(l.textContent); }
      this.stage.dispatchEvent(new CustomEvent('lx:beat', { detail: { i, ff: this.ff } }));
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
    unff() { this.ff = false; this.app.offsetWidth; this.root.classList.remove('lx-ff'); }
    reset() {
      this.token++;
      const old = this.waits; this.waits = []; old.forEach(w => w.no(CANCEL));
      this.anims.forEach(a => { try { a.cancel(); } catch (e) {} }); this.anims.clear();
      this.t = 0;
      const html = typeof this.def.html === 'function' ? this.def.html() : this.def.html;
      this.app.className = 'lx-app ' + (this.def.cls || '');
      this.app.innerHTML = html + '<i class="lx-cur" aria-hidden="true"><b></b></i>';
      this.cursor = this.app.querySelector('.lx-cur');
      const [x, y] = this.def.cursor || [W / 2, H / 2];
      this.cx = x; this.cy = y; this.place();
      this.cursor.style.opacity = this.def.cursor ? 1 : 0;
      const f = this.def.cam0 || [x, y]; this.camX = this.camY = undefined; this.follow(f[0], f[1], true);
    }
    place() { this.cursor.style.transform = `translate(${this.cx}px,${this.cy}px)`; }
    // camera (narrow screens only): x, y is the top-left of the visible part, in app pixels
    camTo(x, y, now = false) {
      x = Math.max(0, Math.min(W - VW, x)); y = Math.max(0, Math.min(H - VH, y));
      this.camX = x; this.camY = y;
      if (now) { this.app.style.transition = 'none'; }
      this.app.style.setProperty('--cx', x.toFixed(1)); this.app.style.setProperty('--cy', y.toFixed(1));
      if (now) { this.app.offsetWidth; this.app.style.transition = ''; }
    }
    // keep a point in view, panning only when it nears the edge of the frame
    follow(x, y, now = false) {
      if (!this.root.classList.contains('lx-cam')) return;
      const m = 70, cx = this.camX ?? 0, cy = this.camY ?? 0;
      if (now || x < cx + m || x > cx + VW - m || y < cy + m || y > cy + VH - m) this.camTo(x - VW / 2, y - VH / 2, now || this.ff);
    }
    // run from beat k; hold=true stops on the state at the end of beat k (reduced motion, or a click while paused)
    async run(k = 0, hold = false) {
      this.reset();
      const tok = this.token;
      const last = this.n - 1;
      this.done = false;
      this.ff = k > 0 || hold; this.stopAt = hold ? (k >= last ? Infinity : k + 1) : k; this.stopHold = hold && k < last;
      if (hold) this.user = false;
      this.root.classList.toggle('lx-ff', this.ff);
      this.started = true; this.sync();
      const c = this.ctx();
      try {
        for (let n = 1; ; n++) {
          await this.def.run(c);
          if (tok !== this.token) return;
          if (this.ff || n >= this.loops) {
            if (this.ff) this.unff();
            this.cur = last; this.show(last); this.done = n >= this.loops; this.sync(); if (this.done || hold) return;
          }
          // a looping scene holds its last frame, then dips to the page and starts over on a fresh screen
          await this.wait(this.def.hold ?? 3000);
          const out = this.anim(this.app, [{ opacity: 1 }, { opacity: 0 }], { duration: 320, fill: 'forwards' });
          await out.finished.catch(() => {});
          if (tok !== this.token) return;
          this.reset(); this.token = tok; try { out.cancel(); } catch (e) {}
          this.anim(this.app, [{ opacity: 0 }, { opacity: 1 }], 320);
        }
      } catch (e) { if (e !== CANCEL) console.error(e); }
    }
    // start again from beat 0; a window showing a later state dips first, so the two frames never overlap
    restart() {
      if (this.dipping) return;
      if (!this.started || reduce || (!this.done && !(this.shown > 0))) return this.run(0);
      this.dipping = true;
      const tok = this.token;
      this.app.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {}).then(() => {
        this.dipping = false;
        if (tok === this.token) this.run(0);
        this.app.getAnimations().forEach(x => x.cancel());
        this.app.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: EASE });
      });
    }
    buildBeats() {
      if (!this.beatsEl) return;
      this.beatsEl.style.setProperty('--n', (this.def.beats || []).length || this.beatsEl.children.length);
      if (!this.beatsEl.children.length) this.beatsEl.innerHTML = (this.def.beats || []).map((b, i) => `<li><button type="button"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="l">${b}</span></button></li>`).join('');
      const go = i => {
        this.parked = false;
        if (reduce) { this.stopStep(); this.run(i, true); } else if (this.user && (!LX.held || this.solo) && (!this.done || this.dipping)) this.run(i); else this.run(i, true);
      };
      [...this.beatsEl.querySelectorAll(':scope > li > button')].forEach((b, i) => b.addEventListener('click', () => go(i)));
    }
    bindPP() {
      const rp = this.stage.querySelector('.lx-rp');
      if (rp) rp.addEventListener('click', () => { this.solo = LX.held; this.parked = false; this.stopStep(); this.user = true; this.restart(); });
      if (reduce) this.stage.classList.add('lx-rm');
      if (!this.pp) return;
      if (!this.pp.querySelector('svg')) this.pp.innerHTML = '<svg class="m-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg><svg class="m-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.3v13.4a.7.7 0 0 0 1.1.6l10.3-6.7a.7.7 0 0 0 0-1.2L9.1 4.7A.7.7 0 0 0 8 5.3z"/></svg><svg class="m-replay" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4"/></svg>';
      this.pp.addEventListener('click', () => {
        if (reduce) { if (this.stepping) this.stopStep(); else this.stepThrough(); return; }
        const fresh = !this.started || this.done || this.parked;
        if (LX.held && !this.solo) this.solo = true;
        else if (!fresh) { this.user = !this.user; this.sync(); if (this.user) this.show(this.cur); return; }
        this.user = true;
        if (fresh) { this.parked = false; this.restart(); } else { this.sync(); this.show(this.cur); }
      });
    }
    // reduced motion: Play steps through the beats as instant state changes
    stepThrough() {
      let i = this.stepped ? (this.shown ?? -1) + 1 : 0;
      if (i >= this.n) i = 0;
      this.stepped = true;
      this.stepping = true;
      const next = () => { if (!this.stepping) return; this.run(i, true); this.sync(); i++; if (i < this.n) this.stepT = setTimeout(next, 1800); else { this.stepping = false; this.sync(); } };
      next();
    }
    stopStep() { if (this.stepping) { this.stepping = false; clearTimeout(this.stepT); this.sync(); } }
    ctx() {
      if (this._cx && this._cx.tok === this.token) return this._cx;
      const P = this, app = this.app;
      const q = s => app.querySelector(s), qa = s => [...app.querySelectorAll(s)];
      const k = () => app.getBoundingClientRect().width / W || 1;
      // a point in app pixels: [x, y], or an element and where in it (fractions)
      const pt = (t, o = {}) => {
        if (Array.isArray(t)) return t;
        const r = t.getBoundingClientRect(), a = app.getBoundingClientRect(), kk = k();
        return [(r.left - a.left + r.width * (o.x ?? .5)) / kk + (o.dx || 0), (r.top - a.top + r.height * (o.y ?? .5)) / kk + (o.dy || 0)];
      };
      const c = {
        q, qa, make, P, app, stage: P.stage, ic, tok: P.token,
        get ff() { return P.ff; },
        wait: ms => P.wait(ms),
        beat: i => P.beat(i),
        anim: (el, kf, o) => P.anim(el, kf, o),
        pt,
        // the cursor glides in a straight line with a light ease, at about the speed of the recordings
        async move(t, o = {}) {
          const [x, y] = pt(t, o), x0 = P.cx, y0 = P.cy;
          P.cx = x; P.cy = y; P.place(); P.follow(x, y);
          if (P.ff) return;
          const d = o.d ?? Math.max(220, Math.min(520, Math.hypot(x - x0, y - y0) * 0.55));
          P.anim(P.cursor, [{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x}px,${y}px)` }], { duration: d, easing: 'cubic-bezier(.35,.1,.25,1)' });
          await P.wait(d);
        },
        jump(t, o = {}) { const [x, y] = pt(t, o); P.cx = x; P.cy = y; P.place(); P.follow(x, y); },
        // frame a point on a narrow screen (a no-op on wide ones)
        cam(t, o = {}) { const [x, y] = pt(t, o); if (P.root.classList.contains('lx-cam')) P.camTo(x - VW / 2, y - VH / 2, P.ff); },
        // a click: the dot dips and rings once; the element presses if asked
        async click(el, o = {}) {
          if (!P.ff) P.anim(P.cursor.firstElementChild, [{ transform: 'scale(1)' }, { transform: 'scale(.72)', offset: .35 }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });
          if (el && o.press) P.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${o.press})` }, { transform: 'scale(1)' }], { duration: 200, easing: 'ease-out' });
          await P.wait(o.after ?? 60);
        },
        hover(el, on = true) { if (el) el.classList.toggle('hv', on); },
        cls(el, name, on = true) { el.classList.toggle(name, on); },
        add(parent, html, how = 'fade', o = {}) {
          const el = typeof html === 'string' ? make(html) : html;
          if (o.before) parent.insertBefore(el, o.before); else if (o.prepend) parent.prepend(el); else parent.append(el);
          if (how && how !== 'none') c.enter(el, how, o);
          return el;
        },
        enter(el, how = 'fade', o = {}) {
          const from = { up: 'translateY(8px)', down: 'translateY(-8px)', right: 'translateX(24px)', left: 'translateX(-24px)', pop: 'scale(.96)', fade: 'none' }[how] || 'none';
          return P.anim(el, [{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: o.d || 160, easing: EASE, delay: o.delay || 0, fill: 'backwards' });
        },
        leave(el, o = {}) {
          const a = P.anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: o.d || 120, fill: 'forwards' });
          return a.finished.then(() => { if (!o.keep) el.remove(); }, () => {});
        },
        // type into an element character by character, with the caret showing while it types
        async type(el, text, o = {}) {
          const ms = o.ms || 68;
          el.classList.add('is-typing'); el.classList.remove('is-empty');
          let s = o.keep ? el.textContent : '';
          for (const ch of text) {
            s += ch; el.textContent = s;
            if (o.onChar) o.onChar(s);
            await c.wait(ms * (ch === ' ' ? 1.1 : /[,.!?]/.test(ch) ? 1.8 : 1));
          }
          if (!o.caret) el.classList.remove('is-typing');
        },
        async stream(el, text, o = {}) {
          const wps = o.wps || 18, words = text.split(/(\s+)/);
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
        // move the inner content of a scroller (no native scrolling, so it stays on the clock)
        scroll(el, y, ms = 0) {
          const from = +(el.dataset.y || 0); el.dataset.y = y;
          el.style.transform = `translateY(${-y}px)`;
          if (ms) P.anim(el, [{ transform: `translateY(${-from}px)` }, { transform: `translateY(${-y}px)` }], { duration: ms, easing: 'cubic-bezier(.3,.7,.2,1)' });
          return c.wait(ms);
        },
        // FLIP: measure, change, then glide what moved from where it was
        flip(els, change, o = {}) {
          const kk = k(), before = new Map(els.map(e => [e, e.getBoundingClientRect()]));
          change();
          if (P.ff || o.d === 0) return;
          els.forEach(e => { const a = before.get(e), b = e.getBoundingClientRect(); const dx = (a.left - b.left) / kk, dy = (a.top - b.top) / kk; if (dx || dy) P.anim(e, [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: o.d || 320, easing: EASE }); });
        },
      };
      c.tok = this.token;
      this._cx = c;
      return c;
    }
  }

  // the camera is a phone layout: it needs a narrow window and a phone-width screen
  const PHONE = matchMedia('(max-width: 719px)');
  const fit = el => {
    const w = el.getBoundingClientRect().width; if (!w) return;
    if (el._st) {
      // a still can name a tighter crop for narrow screens
      const c = (w < NARROW && el._st.mcrop) || el._st.crop || [0, 0, W, H];
      if (c !== el._crop) { el._crop = c; el.style.aspectRatio = `${c[2]} / ${c[3]}`; const a = el.querySelector('.lx-app'); a.style.setProperty('--cx', c[0]); a.style.setProperty('--cy', c[1]); }
      el.style.setProperty('--k', (el.getBoundingClientRect().width / c[2]).toFixed(5)); return;
    }
    const narrow = w < NARROW && PHONE.matches, was = el.classList.contains('lx-cam');
    el.classList.toggle('lx-cam', narrow);
    el.style.setProperty('--k', (w / (narrow ? VW : W)).toFixed(5));
    if (narrow !== was && el._lx) { const p = el._lx; p.camX = p.camY = undefined; p.follow(p.cx, p.cy, true); }
  };
  // "Pause demos": one switch for every live screen on the page, remembered for this reader when storage allows
  LX.held = false;
  try { LX.held = localStorage.getItem('lab-demos') === 'held'; } catch (e) {}
  LX.hold = on => {
    LX.held = !!on;
    try { localStorage.setItem('lab-demos', on ? 'held' : 'on'); } catch (e) {}
    document.querySelectorAll('.lx-all').forEach(b => { b.toggleAttribute('data-held', LX.held); const t = b.querySelector('.t'); if (t) t.textContent = LX.held ? 'Play demos' : 'Pause demos'; });
    players.forEach(p => {
      p.solo = false;
      if (!LX.held && p.parked && p.visible && !reduce) { p.parked = false; p.user = true; p.restart(); }
      p.sync();
    });
  };
  // boot once the page has parsed; a scene registered later (its script arrived after boot) joins when it registers
  let booted = false, went = false, ro = null, io = null;
  const first = p => { p.seen = true; if (reduce || LX.held) { p.parked = !reduce; p.run(p.rest, true); } else p.run(0); };
  const launch = p => { if (reduce) first(p); if (io) io.observe(p.root); else { p.visible = true; if (!p.seen) first(p); } };
  // a still: one state of a scene, drawn once and cropped to a part of the app (no cursor, no clock)
  const still = r => {
    const def = SCENES[r.dataset.lab], st = def.stills && def.stills[r.dataset.still];
    if (!st) return;
    let app = r.querySelector('.lx-app');
    if (!app) { r.insertAdjacentHTML('afterbegin', '<div class="lx-app" aria-hidden="true"></div>'); app = r.querySelector('.lx-app'); }
    app.className = `lx-app ${def.cls || ''} ${st.cls || ''}`;
    app.innerHTML = typeof def.html === 'function' ? def.html() : def.html;
    if (st.set) st.set({ app, q: s => app.querySelector(s), qa: s => [...app.querySelectorAll(s)], make });
    r._st = st; r.classList.add('lx-still');
    r._lx = { still: true }; fit(r); if (ro) ro.observe(r);
  };
  const init = r => {
    if (r._lx || !SCENES[r.dataset.lab]) return;
    if (r.dataset.still) return still(r);
    if (!r.querySelector('.lx-app')) r.insertAdjacentHTML('afterbegin', '<div class="lx-app" aria-hidden="true"></div>');
    fit(r); if (ro) ro.observe(r);
    const p = new Player(r); r._lx = p; players.push(p); p.reset();
    if (reduce) { p.cur = p.rest; p.show(p.rest); }
    if (went) { launch(p); p.sync(); }
  };
  LX.scene = (name, def) => { SCENES[name] = def; if (booted) document.querySelectorAll('.lx[data-lab]').forEach(r => { if (r.dataset.lab === name) init(r); }); };
  const start = () => {
    if (booted) return; booted = true;
    ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => fit(e.target))) : null;
    if (!ro) addEventListener('resize', () => players.forEach(p => fit(p.root)));
    io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
      const p = e.target._lx;
      p.visible = e.isIntersecting && e.intersectionRatio >= .4;
      const full = e.isIntersecting && (e.intersectionRatio >= .8 || e.intersectionRect.height >= innerHeight * .75);
      if (full && !p.seen) first(p);
      else if (full && p.parked && !LX.held && !reduce) { p.parked = false; p.user = true; p.restart(); }
      p.sync();
    }), { threshold: [0, .2, .4, .6, .8, 1] }) : null;
    document.querySelectorAll('.lx[data-lab]').forEach(init);
    // a page's figure viewer pauses every screen while it is open
    const d = document.querySelector('dialog.cv'); if (d) new MutationObserver(() => { LX.dialog = d.open; players.forEach(p => p.sync()); }).observe(d, { attributes: true, attributeFilter: ['open'] });
    const once = () => { if (!went) { went = true; players.forEach(launch); } };
    if (!ro) addEventListener('resize', () => document.querySelectorAll('.lx-still').forEach(fit));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(once); setTimeout(once, 500);
    document.addEventListener('visibilitychange', () => players.forEach(p => p.sync()));
    document.querySelectorAll('.lx-all').forEach(b => b.addEventListener('click', () => LX.hold(!LX.held)));
    LX.hold(LX.held);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
  LX.start = start;
  LX.advance = async ms => {
    for (let s = 0; s < ms; s += 16) {
      for (const p of players) if (p.live()) p.advance(Math.min(16, ms - s));
      await new Promise(r => setTimeout(r, 0));
    }
  };
})();
