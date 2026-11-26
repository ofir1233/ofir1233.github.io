// FYI case study: one phone, one continuous thread. The page scrolls through five stops
// (hero, Task, Vote, Event, Project); the phone stays in place and never goes dark.
// The app is built from the shared kit (FX.k, fyi-scenes.js) and styled by fyi-live.css.
// Each stop plays its beat once, on arrival; coming back shows the end state.
// Freeze for checks: ?stop=0..4 (end state of that stop), ?stop=1j (after the jump back), ?doors=10
(() => {
  const FX = window.FX, K = FX && FX.k;
  if (!K) return;
  const ic = FX.ic;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 1000px)');
  const qs = new URLSearchParams(location.search);
  const run = document.getElementById('fy2-run');
  if (!run) return;
  const sections = [...run.querySelectorAll('.fy2-s')];
  const SB = FX.sb || '';
  const q = s => `<span class="fy2-q">“${s}”</span>`;

  // ---------- the app ----------
  const row = (key, lead, title, meta, src) => `<div class="a-trow" data-k="${key}">${lead}<div class="bdy"><div class="tt">${title}</div><div class="mt">${meta}</div><div class="mt fy2-from">${K.src(src)}</div></div></div>`;
  const chk = `<span class="a-chk">${ic('check')}</span>`;
  const POLL = [['a', 'Horizon'], ['b', 'Grooves'], ['c', 'Stack']];
  const html = () => `<div class="fy2-view fy2-chat">${K.wall()}<div class="a-th"><div class="a-msgs">`
    + `<div data-k="voice">${K.voice({ o: 1, seed: 5, d: '0:21' })}${K.tr('What if it\'s a night.')}</div>`
    + `<div data-k="ask">${K.b('Theo, when can you have the visualizer cut?', { o: 1 })}</div>`
    + `<div data-k="theo">${K.b('I\'ll have the visualizer cut by Nov 12. need the final stems first though', { who: 't' })}</div>`
    + `<div data-k="sug">${K.sug('<small>Looks like a task</small>Visualizer cut · Nov 12')}</div>`
    + `<div data-k="chip">${K.chip(`Visualizer cut · ${K.av('t', 's')}Theo · Nov 12`, 'appr').replace('class="a-chip', 'class="a-chip t4-chip')}</div>`
    + `<div data-k="sys1">${K.sys('<b>Maya</b> made this a task for Theo')}</div>`
    + `<div data-k="kofi1">${K.b('need a cover for the posters by Nov 6', { who: 'k' })}</div>`
    + `<div data-k="poll"><div class="a-poll"><span class="who" style="--c:${K.tint('i')}">Ines</span><div class="q">Which cover?<span class="pn">Poll · 0 votes</span></div>${POLL.map(([x, n]) => `<div class="r" data-r="${x}"><i class="bar"></i>${K.cov(x)}<span class="t">${x.toUpperCase()} · ${n}</span><span class="a-stack"></span><span class="v">0</span></div>`).join('')}</div></div>`
    + `<div data-k="sys2">${K.sys('<b>Cover B</b> chosen · 3 of 4 votes')}</div>`
    + `<div data-k="kofi2">${K.b('Dock Hall 3 signed. Fri, Nov 20, doors at 9', { who: 'k' })}</div>`
    + `<div data-k="draft">${K.ai({ title: 'Drafted from this chat', vis: false, body: '<div><b>Copper Hours: Launch Night</b><br>Fri, Nov 20 · Doors 9 PM · Dock Hall 3</div><div class="ft">Check before you publish</div>' })}</div>`
    + `<div data-k="tk">${K.ticket({ pub: 1, going: 27 })}</div>`
    + `<div data-k="sys3">${K.sys('<b>You</b> moved doors to 10 PM')}</div>`
    + `</div></div>${K.comp()}</div>`
    + `<div class="fy2-view fy2-tasks a-tasks"><h5 class="st-appr">Approved</h5>${row('trow', chk, 'Visualizer cut', `${K.av('t', 's')}Theo · Thu, Nov 12`, `Theo: ${q('I\'ll have the visualizer cut by Nov 12')}`)}</div>`
    + `<div class="fy2-view fy2-proj a-tasks"><h5>Task</h5>${row('pj1', chk, 'Visualizer cut', `${K.av('t', 's')}Theo · Thu, Nov 12`, `Theo: ${q('I\'ll have the visualizer cut by Nov 12')}`)}`
    + `<h5>Decision</h5>${row('pj2', K.cov('b', '', 'fy2-th'), 'Cover B · Grooves', '3 of 4 votes', `Ines: ${q('Which cover?')}`)}`
    + `<h5>Event</h5>${row('pj3', '<span class="ps fy2-th"></span>', 'Copper Hours: Launch Night', 'Fri, Nov 20 · Going 27', `Kofi: ${q('Dock Hall 3 signed')}`)}</div>`
    + K.hd({ sub: '' }).replace('Tasks</span>', 'Tasks <i class="n">1</i></span>');

  const FOCUS = [['theo', 'sug', 'chip'], ['theo', 'chip', 'sys1'], ['kofi1', 'poll', 'sys2'], ['kofi2', 'draft', 'tk', 'sys3'], []];

  class App {
    constructor(dev, fixed) {
      this.dev = dev; this.fixed = fixed;
      dev.innerHTML = `<div class="fx-body"><div class="fx-screen"><div class="fx-app fx-static fy2-app">${html()}</div>${SB}<i class="fx-island"></i><i class="fx-home"></i></div></div>`;
      this.app = dev.querySelector('.fx-app');
      this.it = {}; this.app.querySelectorAll('[data-k]').forEach(e => { this.it[e.dataset.k] = e; });
      this.tabs = [...this.app.querySelectorAll('.a-seg > span')];
      this.S = { theo: 0, sug: 0, made: 0, tab: 0, poll: 0, votes: 0, ev: 0, doors: '9 PM', ring: 0 };
      this.cur = -1; this.done = []; this.timers = []; this.ff = false;
      this.fit();
    }
    fit() { const w = this.dev.getBoundingClientRect().width; if (w) this.dev.style.setProperty('--k', w / 418); }
    el(k) { return this.it[k]; }
    // everything on the glass follows from the state: what exists, what is in focus, which tab is open
    paint() {
      const S = this.S, c = this.cur, vis = {
        voice: 1, ask: 1, theo: S.theo, sug: S.sug && !S.made, chip: S.made, sys1: S.made,
        kofi1: c >= 2 && S.poll, poll: c >= 2 && S.poll, sys2: c >= 2 && S.votes >= 3,
        kofi2: c >= 3 && S.ev >= 1, draft: c >= 3 && S.ev >= 2, tk: c >= 3 && S.ev >= 3, sys3: c >= 3 && S.ev >= 3 && S.doors === '10 PM',
      };
      const focus = FOCUS[Math.max(0, c)] || [];
      for (const k in vis) {
        const e = this.it[k], on = !!vis[k];
        if (on && e.hidden && !this.ff && !reduce) { e.classList.remove('fy2-in'); void e.offsetWidth; e.classList.add('fy2-in'); }
        e.hidden = !on;
        e.classList.toggle('fy2-dim', focus.length > 0 && !focus.includes(k));
      }
      this.app.dataset.tab = S.tab;
      this.tabs.forEach((t, i) => t.classList.toggle('on', i === S.tab));
      this.app.querySelector('.a-seg .n').hidden = !S.made;
      this.app.querySelectorAll('.a-poll .r').forEach(r => {
        const b = r.dataset.r === 'b', n = b ? S.votes : 0;
        r.querySelector('.bar').style.width = (n / 4 * 100) + '%';
        r.querySelector('.v').textContent = n;
        r.classList.toggle('mine', b && n > 0);
        const st = r.querySelector('.a-stack'), want = b ? 'mti'.slice(0, n) : '';
        if (st.dataset.v !== want) { st.dataset.v = want; st.innerHTML = [...want].map(p => K.av(p, 's')).join(''); }
      });
      this.app.querySelector('.a-poll .pn').textContent = `Poll · ${S.votes} vote${S.votes === 1 ? '' : 's'}`;
      this.app.querySelectorAll('[data-bind="doors"]').forEach(e => { e.textContent = S.doors; });
      this.it.theo.classList.toggle('fy2-ring', !!S.ring);
      this.dev.dispatchEvent(new CustomEvent('fy2:paint', { bubbles: true }));
    }
    set(p) { Object.assign(this.S, p); this.paint(); }
    // a drawn touch: a ring on the control, then the press
    tap(sel) {
      const t = this.app.querySelector(sel); if (!t || this.ff || reduce) return;
      t.classList.remove('fy2-tap'); void t.offsetWidth; t.classList.add('fy2-tap');
    }
    // the beats of each stop: [ms from arrival, what changes]
    steps(n) {
      const s = p => () => this.set(p);
      return [
        [[600, s({ theo: 1 })], [1500, s({ sug: 1 })], [2900, () => this.tap('.a-sug .go')], [3350, s({ made: 1 })]],
        [[350, s({ tab: 1, ring: 0 })]],
        [[0, s({ tab: 0, ring: 0 })], [250, s({ poll: 1 })], [1000, s({ votes: 1 })], [1600, s({ votes: 2 })], [2200, s({ votes: 3 })]],
        [[0, s({ tab: 0, ring: 0 })], [250, s({ ev: 1 })], [900, s({ ev: 2 })], [1900, s({ ev: 3 })]],
        [[350, s({ tab: 2, ring: 0 })]],
      ][n];
    }
    clear() { this.timers.forEach(clearTimeout); this.timers = []; }
    // bring every earlier stop to its end state, with no motion
    finish(upTo) {
      this.ff = true;
      for (let i = 0; i <= upTo; i++) if (!this.done[i]) { this.steps(i).forEach(([, f]) => f()); this.done[i] = true; }
      this.ff = false;
    }
    go(n, still) {
      if (n === this.cur) return;
      this.clear();
      const prev = this.cur;
      if (prev >= 0 && !this.done[prev]) { this.finish(prev); }
      this.finish(n - 1);
      this.cur = n;
      this.dev.dataset.stop = n;
      if (this.done[n] || still || reduce) {
        this.ff = true; this.steps(n).forEach(([, f]) => f()); this.ff = false; this.done[n] = true;
        // a stop left and re-entered shows its own tab again
        this.set({ tab: n === 1 ? 1 : n === 4 ? 2 : 0, ring: 0 });
      } else {
        this.paint();
        const st = this.steps(n); let last = 0;
        st.forEach(([ms, f]) => { last = Math.max(last, ms); this.timers.push(setTimeout(f, ms)); });
        this.timers.push(setTimeout(() => { this.done[n] = true; }, last + 20));
      }
    }
    // the proof of the page: from the task back to the message it came from
    jump() {
      this.clear();
      if (this.cur !== 1) return false;
      this.done[1] = true;
      if (this.S.tab === 0) { this.set({ tab: 1, ring: 0 }); return false; }
      this.set({ tab: 0 });
      this.timers.push(setTimeout(() => this.set({ ring: 1 }), reduce ? 0 : 420));
      return true;
    }
    doors(late) { this.set({ doors: late ? '10 PM' : '9 PM' }); }
  }

  // ---------- the page ----------
  const pinDev = document.getElementById('fy2-dev');
  let main = null; const minis = [];
  const build = () => {
    if (wide.matches) { if (!main) main = new App(pinDev, null); }
    else if (!minis.length) run.querySelectorAll('.fy2-m .fy2-dev').forEach(d => { const a = new App(d, +d.dataset.fixed); minis.push(a); });
  };
  build();
  const apps = () => (wide.matches ? [main] : minis).filter(Boolean);
  const appFor = sec => (wide.matches ? main : minis[+sec.dataset.stop]);

  // the objects that leave the glass: each lands once, from the place on the glass it came from
  const land = (sec, app, still) => {
    let wait = 0;
    sec.querySelectorAll('.fy2-out').forEach((o, i) => {
      if (o.classList.contains('is-out')) return;
      o.classList.add('is-out');
      if (still || reduce || !wide.matches || !o.animate) return;
      const src = app.el(srcOf(o, app)), a = src && src.getBoundingClientRect(), b = o.getBoundingClientRect();
      if (!a || !a.width || !b.width) return;
      const s = Math.max(.2, Math.min(1, a.width / b.width));
      o.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${s})`, opacity: 0 }, { opacity: 1, offset: .25 }, { transform: 'none', opacity: 1 }],
        { duration: 760, delay: i * 180, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      wait = 780 + i * 180;
    });
    setTimeout(() => { sec.classList.add('is-landed'); ask(); }, wait);
  };
  // the task card points at its row while the Tasks tab is open, and at Theo's message after the jump
  const srcOf = (o, app) => (o.dataset.out === 'task2' && app.S.tab === 1 ? 'trow' : o.dataset.src);
  // when each stop lets its object out (ms after arrival), so the object follows the message and never leads it
  const OUT = [3600, 900, 2800, 2500, 900];

  let cur = -1, outT = 0;
  const arrive = (n, still) => {
    if (n === cur) return;
    cur = n; clearTimeout(outT);
    run.querySelectorAll('.fy2-go').forEach(g => { g.textContent = '↳ Go to Theo’s message'; });
    run.dataset.stop = n;
    const sec = sections[n], app = main;
    if (!app) return;
    const fresh = !app.done[n];
    app.go(n, still);
    if (sec.classList.contains('is-landed') || still || reduce || !fresh) land(sec, app, true);
    else outT = setTimeout(() => land(sec, app), OUT[n]);
    sections.forEach((s, i) => { if (i < n) land(s, app, true); });
  };

  // ---------- the thread from the message to the thing ----------
  const svg = document.getElementById('fy2-lines');
  const NS = 'http://www.w3.org/2000/svg';
  const paths = {};
  const lineFor = key => paths[key] || (paths[key] = svg.appendChild(Object.assign(document.createElementNS(NS, 'path'), {})));
  const draw = () => {
    if (!wide.matches || !main) { svg.style.display = 'none'; return; }
    svg.style.display = '';
    const vh = innerHeight, seen = {};
    const sec = sections[cur];
    if (sec && sec.classList.contains('is-landed')) {
      const sr = sec.getBoundingClientRect(), near = 1 - Math.min(1, Math.abs((sr.top + sr.height / 2) - vh / 2) / (vh * .42));
      const glass = main.app.getBoundingClientRect();
      sec.querySelectorAll('.fy2-out').forEach(o => {
        const src = main.el(srcOf(o, main)); if (!src || src.hidden) return;
        // the source is the bubble or row itself, not its full-width wrapper
        const inner = src.firstElementChild && !src.classList.contains('a-trow') ? src.firstElementChild : src;
        const a = inner.getBoundingClientRect(), b = o.getBoundingClientRect();
        if (!a.width || a.bottom < glass.top + 60 || a.top > glass.bottom - 30) return;
        const key = o.dataset.out, p = lineFor(key); seen[key] = 1;
        const x1 = Math.min(a.right + 4, glass.right - 6), y1 = Math.max(glass.top + 70, Math.min(glass.bottom - 40, a.top + a.height / 2)), x2 = b.left, y2 = b.top + Math.min(b.height / 2, 90);
        const mx = (x1 + x2) / 2;
        p.setAttribute('d', `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`);
        p.setAttribute('pathLength', 1);
        const ok = near > .12 && (cur === 1 ? (main.S.tab === 1 || main.S.ring) : main.S.tab === (cur === 4 ? 2 : 0));
        p.style.opacity = ok ? Math.min(1, near * 1.6) : 0;
        p.classList.toggle('on', !!ok);
      });
    }
    for (const k in paths) if (!seen[k]) { paths[k].style.opacity = 0; paths[k].classList.remove('on'); }
  };

  // ---------- scroll ----------
  let raf = 0;
  const tick = () => {
    raf = 0;
    if (wide.matches) {
      const mid = innerHeight * .36; let n = 0;
      sections.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) n = i; });
      arrive(n);
      draw();
    }
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', () => { build(); apps().forEach(a => a.fit()); ask(); });
  run.addEventListener('fy2:paint', () => { ask(); setTimeout(ask, 460); setTimeout(ask, 900); });

  // narrow screens: one phone per station, each plays once when it is on screen
  if (!wide.matches) {
    minis.forEach((a, n) => {
      a.finish(n - 1); a.cur = -1;
      const sec = sections[n];
      const start = () => { a.go(n, false); setTimeout(() => land(sec, a, true), reduce ? 0 : OUT[n] - 400); };
      if (!('IntersectionObserver' in window) || reduce) { a.go(n, true); land(sec, a, true); return; }
      new IntersectionObserver((es, io) => { if (es.some(e => e.isIntersecting)) { io.disconnect(); start(); } }, { threshold: .5 }).observe(a.dev);
      a.go = App.prototype.go.bind(a);
    });
  }

  // ---------- the controls ----------
  run.querySelectorAll('.fy2-press').forEach(b => b.addEventListener('click', () => {
    const a = appFor(b.closest('.fy2-s')); if (!a) return;
    if (a.cur !== 1) a.go(1, true);
    const at = a.jump();
    b.querySelector('.fy2-go').textContent = at ? '↳ Back to the task' : '↳ Go to Theo’s message';
    if (!wide.matches) a.dev.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }));
  const doors = document.getElementById('fy2-doors');
  let late = false;
  const setDoors = v => {
    late = v;
    doors.setAttribute('aria-pressed', late);
    doors.textContent = late ? 'Move doors back to 9 PM' : 'Move doors to 10 PM';
    const flash = e => { if (reduce) return; e.classList.remove('fy2-flash'); void e.offsetWidth; e.classList.add('fy2-flash'); };
    apps().forEach(a => { if (a.cur >= 3 || a.fixed === 3) { if (a.S.ev < 3) a.finish(3); a.doors(late); a.app.querySelectorAll('[data-bind="doors"]').forEach(flash); } });
    setTimeout(() => run.querySelectorAll('.fy2-web [data-bind="doors"]').forEach(e => { e.textContent = late ? '10 PM' : '9 PM'; flash(e); }), reduce ? 0 : 350);
  };
  if (doors) doors.addEventListener('click', () => setDoors(!late));

  // the closing row comes in once, when it is on screen
  const left = document.getElementById('fy2-left');
  if (left) {
    if (!('IntersectionObserver' in window)) left.classList.add('is-in');
    else new IntersectionObserver((es, io) => { if (es.some(e => e.isIntersecting)) { io.disconnect(); left.classList.add('is-in'); } }, { threshold: .4 }).observe(left);
  }

  // ---------- first frame ----------
  const fz = qs.get('stop');
  const startUp = () => {
    apps().forEach(a => a.fit());
    if (fz !== null && wide.matches) {
      const n = Math.max(0, Math.min(4, parseInt(fz, 10) || 0));
      sections[n].scrollIntoView();
      main.finish(n); arrive(n, true); land(sections[n], main, true);
      if (/j$/.test(fz)) { main.set({ tab: 0, ring: 1 }); }
      if (qs.get('doors') === '10') setDoors(true);
      setTimeout(draw, 80);
      return;
    }
    tick();
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(startUp, 60));
})();
