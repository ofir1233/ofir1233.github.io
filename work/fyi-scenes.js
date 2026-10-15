// FYI case study: the live scenes and static frames. Each scene is isolated, so one failing scene cannot stop the others.
// FYI: the app's building blocks as HTML strings, shared by every scene and static frame.
// All sizes are points in the 390 x 844 screen; the styles live in fyi-live.css.
(() => {
  const FX = window.FX, ic = FX.ic;
  // one gradient for every AI mark on the page (violet appears only where AI acted)
  if (!document.getElementById('fx-ai-g')) document.body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="fx-ai-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6650F0"/><stop offset="1" stop-color="#9638F0"/></linearGradient></defs></svg>');

  const P = { m: ['M', 'Maya', 'maya'], t: ['T', 'Theo', 'theo'], i: ['I', 'Ines', 'ines'], k: ['K', 'Kofi', 'kofi'], j: ['J', 'June', 'gray'], s: ['S', 'Sol', 'gray'], a: ['A', 'Ari', 'gray'] };
  const K = FX.k = {
    P,
    // the AI knot: two crossed orbits and a sparkle
    knot: (cls = '') => `<svg class="knot ${cls}" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="url(#fx-ai-g)" stroke-width="1.9"><g class="o1"><ellipse cx="12" cy="12.5" rx="9" ry="3.9" transform="rotate(45 12 12.5)"/></g><g class="o2"><ellipse cx="12" cy="12.5" rx="9" ry="3.9" transform="rotate(-45 12 12.5)"/></g></g><path fill="url(#fx-ai-g)" d="M19.2 1.6l.85 2.35 2.35.85-2.35.85-.85 2.35-.85-2.35-2.35-.85 2.35-.85z"/></svg>`,
    spark: () => `<svg class="i f sp" viewBox="0 0 24 24" aria-hidden="true"><path fill="url(#fx-ai-g)" d="M11 2.5l2.1 6.4 6.4 2.1-6.4 2.1L11 19.5l-2.1-6.4-6.4-2.1 6.4-2.1z"/></svg>`,
    // a person: their initial in their tint, on the tint at 22% over black
    av: (p, size = '', on = false) => `<span class="a-av ${size} p-${p}${on ? ' on' : ''}">${P[p][0]}</span>`,
    stack: (ps, size = 's') => `<span class="a-stack">${[...ps].map(p => K.av(p, size)).join('')}</span>`,
    group: (size = 'm') => `<span class="a-av ${size} g-cu"></span>`,
    name: p => P[p][1],
    tint: p => `var(--${P[p][2]})`,
    cov: (x, lb = '', cls = '') => `<span class="cov cov-${x} ${cls}">${lb ? `<span class="a-lb">${lb}</span>` : ''}</span>`,

    // status bar sits in the shell; these are the app's screens
    wall: () => '<div class="fx-wall"></div>',
    hd: (o = {}) => `<div class="a-hd"><div class="a-nav"><span class="bk">${ic('back')}</span><span class="who">${o.av || K.group('m')}<span style="min-width:0"><div class="nm">${o.name || 'Copper Hours'}</div><div class="sub${o.live ? ' live' : ''}">${o.sub ?? 'Theo, Ines, Kofi, You'}</div></span></span><span class="acts">${ic('phone')}${ic('video')}</span></div>${o.tabs === false ? '' : `<div class="a-seg"><span class="${(o.on || 0) === 0 ? 'on' : ''}">Chat</span><span class="${o.on === 1 ? 'on' : ''}">Tasks${o.tasks ? ` <i class="n">${o.tasks}</i>` : ''}</span><span class="${o.on === 2 ? 'on' : ''}">Project</span></div>`}</div>`,
    comp: (ph = 'Message') => `<div class="a-comp"><span class="kb">${K.knot()}</span><span class="in"><span class="tx" data-ph="${ph}"></span>${ic('plus')}</span><span class="mc">${ic('mic')}</span></div>`,
    tabbar: (on = 0) => `<div class="a-tabbar">${[['chat', 'Chats'], ['folder', 'Projects'], ['ticket', 'Events'], ['phone', 'Calls'], ['', 'AI']].map(([i, t], k) => `<span class="${k === on ? 'on' : ''}">${i ? ic(i) : K.knot()}${t}</span>`).join('')}</div>`,
    lt: (title = 'Chats') => `<div class="a-lt"><div class="row"><span>Edit</span>${ic('compose')}</div><h3>${title}</h3><div class="a-srch">${ic('search')}Search</div></div>`,

    // messages
    tm: (t, o = {}) => `<span class="tm">${t}${o.rd ? `<span class="rd">${ic(o.rd === 2 ? 'dcheck' : 'check')}</span>` : ''}</span>`,
    b: (text, o = {}) => `<div class="a-b${o.o ? ' o' : ''}${o.tl === false ? '' : ' tl'}${o.cls ? ' ' + o.cls : ''}"${o.id ? ` data-id="${o.id}"` : ''}>${o.who ? `<span class="who" style="--c:${K.tint(o.who)}">${K.name(o.who)}</span>` : ''}${text}${o.t ? K.tm(o.t, o) : ''}</div>`,
    sys: html => `<div class="a-sys">${html}</div>`,
    pill: t => `<div class="a-pill">${t}</div>`,
    wave: (n = 30, seed = 3) => { let h = ''; for (let i = 0; i < n; i++) { const v = .25 + .75 * Math.abs(Math.sin(i * 1.7 + seed) * Math.cos(i * .53 + seed * .3)); h += `<i style="height:${Math.round(v * 100)}%"></i>`; } return `<span class="a-wave">${h}</span>`; },
    voice: (o = {}) => `<div class="a-b a-voice${o.o ? ' o' : ''} tl"${o.id ? ` data-id="${o.id}"` : ''}><span class="pl">${ic('play')}</span>${K.wave(o.n || 30, o.seed || 3)}<span class="d">${o.d || '0:21'}</span></div>`,
    tr: (text, o = {}) => `<div class="a-tr${o.l ? ' l' : ''}"><small>Transcript</small>${text}</div>`,
    file: (o = {}) => `<div class="a-b a-file${o.o ? ' o' : ''} tl"><span class="ft">${ic('file')}<svg class="ring" viewBox="0 0 46 46"><circle cx="23" cy="23" r="22"/></svg></span><div><div class="fn">${o.name || 'copper-hours_stems_v4.zip'}</div><div class="fm">${o.meta || '2.1 GB · full size'}</div></div>${o.t ? K.tm(o.t, o) : ''}</div>`,
    typing: () => '<div class="a-typing"><i></i><i></i><i></i></div>',
    seen: (ps, txt) => `<div class="a-seen">${K.stack(ps, 'xs')}${txt}</div>`,
    rx: (kind = 'fl', n = '', by = '') => `<span class="a-rx">${kind === 'fl' ? `<svg class="i f fl" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.5 2.5c.4 3.2 4.8 5.4 4.8 10.6a5.3 5.3 0 0 1-10.6.2c0-2 1-3.6 2.3-4.6.2 1.4.9 2.4 2 2.8-.6-3.3.3-6.3 1.5-9z"/></svg>` : ic('heart', 'hr')}${by ? K.av(by, 'xs') : ''}${n}</span>`,

    // AI: a layer in the thread, never a bubble
    ai: (o = {}) => `<div class="a-ai${o.cls ? ' ' + o.cls : ''}"><div class="hd">${K.knot(o.think ? 'think' : '')}<span>${o.title || 'FYI AI'}</span>${o.vis === false ? '' : `<span class="vis">${o.vis && o.vis !== 'you' ? o.vis : ic('lock') + 'Only you'}</span>`}</div>${o.body || ''}</div>`,
    src: t => `<span class="a-src">↳ ${t}</span>`,
    sug: (text, go = 'Make task') => `<div class="a-sug">${K.knot()}<span>${text}</span><span class="go">${go}</span><span class="x">${ic('x')}</span></div>`,
    chip: (text, st = 'appr', o = {}) => `<div class="a-chip st-${st}${o.o ? ' o' : ''}"><span class="ck"></span>${text}</div>`,

    // events
    poster: (o = {}) => `<div class="ps"${o.style ? ` data-ps="${o.style}"` : ''}><i class="arcs"></i><span class="pt">Copper Hours<br>Launch Night</span><span class="pd">Dock Hall 3</span></div>`,
    ticket: (o = {}) => `<div class="a-tk${o.l ? ' l' : ''}">${o.pub ? `<span class="a-pub">${ic('globe')}Public</span>` : ''}${K.poster(o)}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Fri · Doors <span data-bind="doors">${o.doors || '9 PM'}</span></div><div class="pl">Dock Hall 3</div></div></div><div class="a-rv"><span class="a-go">${ic('check')}Going</span><span class="a-may">Maybe</span><span class="cnt">${K.stack('mtik', 'xs')}<span>Going · <b class="gn">${o.going ?? 1}</b></span></span></div></div>`,
  };
})();

// ===== s0-trailer =====
try {
// S0 · Hero trailer, "Idea to launch night". Six beats, no rail. It loops up to 3 times (the engine dips to black
// between loops), then rests on B6 (index 5). One crew, one thread: a voice note becomes replies, an AI plan, three tasks
// and, on Day 24, a promoted launch night. The plan names owners only: no message gives a date, so none is guessed.
// It makes the two tasks that 03 and 04 start from (Cover art, Venue); Theo's visualizer becomes a task on Day 3, in 04.
// Page layer: at 1200px and up the constellation cards (.constel .cc) come in at their beats and stay in for the rest of
// the visit; below that they sit in an in-flow grid, always visible. On loops 2 and 3 the card of the current beat carries
// .cur at every width (a coral outline on the page, never inside the app).
(() => {
  const EASE = 'cubic-bezier(.2,.7,.2,1)', PUSH = 'cubic-bezier(.2,.8,.2,1)', SPRING = 'cubic-bezier(.34,1.4,.5,1)';
  const VOICE = "Hear the bridge at 1:40? What if the drop isn't a post. What if it's a night.";
  const PLAN = [['Cover art', 'i'], ['Venue', 'k']]; // owners from who offered what; no dates yet
  const words = s => s.split(' ').map((w, i, a) => `<span class="w">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  const quiet = p => { p.catch(() => {}); return p; }; // a side animation that a reset may cancel

  // ---------- page layer: the constellation ----------
  const cards = stage => [...stage.querySelectorAll('.constel .cc')];
  const unmark = stage => cards(stage).forEach(el => el.classList.remove('cur'));
  const wide = () => matchMedia('(min-width: 1200px)').matches;
  // loops 2 and 3: the card of the current beat is outlined (k = -1: none)
  const cur = (c, k) => { if (c.loop > 1) cards(c.stage).forEach(el => el.classList.toggle('cur', +el.dataset.card === k)); };
  // a card comes in once: around the phone it grows out of the part of the screen it names (FLIP), elsewhere it rises
  const release = (c, k, from) => {
    const el = c.stage.querySelector(`.constel .cc[data-card="${k}"]`);
    if (!el || el.classList.contains('in')) return;
    el.classList.add('in');
    // below 1200px the cards sit in their in-flow grid, always visible: nothing to animate there
    if (c.ff || !wide()) return;
    if (from) {
      const a = from.getBoundingClientRect(), b = el.getBoundingClientRect();
      const dx = a.left + a.width / 2 - (b.left + b.width / 2), dy = a.top + a.height / 2 - (b.top + b.height / 2);
      c.anim(el, [{ opacity: 0, transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(.6)` }, { opacity: 1, offset: .28 }, { opacity: 1, transform: 'none' }], { duration: 760, easing: EASE });
    } else {
      c.anim(el, [{ opacity: 0, transform: 'translateY(14px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: EASE });
    }
  };

  // ---------- the app's pieces for this scene ----------
  const row = (av, nm, tm, pv, o = {}) => `<div class="a-row${o.cls ? ' ' + o.cls : ''}">${av}<div class="tx"><div class="l1"><span class="nm">${nm}</span><span class="tm${o.bd ? ' new' : ''}">${tm}</span></div><div class="l2"><span class="pv${o.live ? ' live' : ''}">${pv}</span>${o.bd ? `<span class="bd">${o.bd}</span>` : ''}</div></div></div>`;
  const listView = () => {
    const K = FX.k, ic = FX.ic;
    return `<div class="view t0-list">${K.lt('Chats')}<div class="a-list">`
      + row(K.group('l'), 'Copper Hours', '11:14 PM', 'Theo is typing…', { live: 1, cls: 't0-cu' })
      + row(K.av('i', 'l'), 'Ines', '10:52 PM', 'moodboard for the single')
      + row(K.av('k', 'l'), 'Kofi', '9:30 PM', `${ic('pin')}Sent a location`)
      + row(K.av('t', 'l'), 'Theo', 'Yesterday', `${ic('video')}Video call · 14 min`)
      + row('<span class="a-av l g-ll"></span>', 'Late Light Collective', 'Sun', 'Open studio on Friday')
      + row(K.av('a', 'l'), 'Ari', 'Sat', `${ic('image')}12 photos`)
      + row(K.av('j', 'l'), 'June', 'Fri', 'dinner at mine next week?')
      + `</div>${K.tabbar(0)}<i class="t0-dim"></i></div>`;
  };
  const threadView = () => {
    const K = FX.k;
    return `<div class="view t0-th">${K.wall()}<div class="a-th"><div class="a-msgs">${K.pill('Day 1 · Tue, Oct 13')}${K.sys('<b>Maya</b> created Copper Hours')}${K.file({ o: 1, meta: '2.1 GB · full size' }).replace(/<svg class="ring".*?<\/svg>/, '')}${K.voice({ o: 1, seed: 5, n: 28, d: '0:21' })}</div></div>${K.hd()}${K.comp()}</div>`;
  };
  const transcript = () => `<div class="a-tr t0-tr"><small>Transcript</small>${words(VOICE)}</div>`;
  const aiCard = () => {
    const K = FX.k, ic = FX.ic;
    const li = ([t, p]) => `<li><span class="w">${t} · </span><span class="w nm" style="color:${K.tint(p)}">${K.name(p)}</span></li>`;
    return K.ai({ title: 'Plan from this chat', think: true, cls: 't0-ai', body: `<ul>${PLAN.map(li).join('')}</ul><div class="acts wait"><span class="a-ab you">${ic('tasks')}Make 2 tasks</span></div>` });
  };
  const ticket = () => {
    const K = FX.k, ic = FX.ic;
    return `<div class="a-tk t0-tk">${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Fri · Doors 9 PM</div><div class="pl">Dock Hall 3</div><div class="t0-att">Going ·<span class="a-stack">${K.av('m', 's')}</span><b class="t0-more"></b></div></div></div><div class="t0-rv"><span class="a-go">${ic('check')}Going</span><span class="a-may">Maybe</span></div></div>`;
  };
  const promote = () => `<div class="t0-host"><span class="t0-pro">${FX.ic('mega')}Promote</span></div>`;
  const formats = () => `<div class="a-fmts t0-fm">${['Story', 'Post', 'Link page'].map(t => `<span>${t}${FX.ic('check')}</span>`).join('')}</div>`;

  // AI words: pre-split, revealed one by one behind the violet caret
  async function stream(c, li, ms) {
    li.classList.add('on', 'is-streaming');
    for (const w of li.querySelectorAll('.w')) { w.classList.add('on'); await c.wait(ms); }
    li.classList.remove('is-streaming');
  }

  FX.scene('trailer', {
    time: '11:14', n: 6, loops: 3, rest: 5, hold: 2200,
    html: () => listView() + threadView(),
    // the cards stay in for the visit; only the outline is undone
    reset(stage) { unmark(stage); },
    async run(c) {
      const K = FX.k, ic = FX.ic;
      c.loop = (c.loop || 0) + 1; // the context lives across the loops of one run
      const lv = c.q('.t0-list'), th = c.q('.t0-th'), list = c.q('.a-msgs'), comp = c.q('.a-comp'), sub = c.q('.a-nav .sub');

      // B1: Chats. Copper Hours is busy; a tap opens it
      await c.beat(0); cur(c, -1);
      const cu = c.q('.t0-cu');
      await c.wait(1150);
      const tp = quiet(c.tap(cu, { noPress: true, x: .4 }));
      await c.wait(200);
      cu.classList.add('hi');
      await tp;
      await c.wait(260);

      // B2: the thread pushes in; Maya's voice note plays and its transcript writes itself underneath
      await c.beat(1); cur(c, 0);
      th.classList.add('on'); lv.classList.add('out');
      c.anim(th, [{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 420, easing: PUSH });
      c.anim(lv, [{ transform: 'none' }, { transform: 'translateX(-30%)' }], { duration: 420, easing: PUSH });
      c.anim(lv.querySelector('.t0-dim'), [{ opacity: 0 }, { opacity: .4 }], { duration: 420, easing: PUSH });
      await c.wait(640);
      lv.remove(); // the list sits under the thread from here on: keep the phone's DOM small
      const v = c.q('.a-voice'), pl = v.querySelector('.pl'), d = v.querySelector('.d');
      await c.tap(pl, { press: .9 });
      pl.innerHTML = ic('pause'); d.textContent = '0:00';
      const tr = await c.push(list, transcript(), 'fade', { d: 380 });
      const bars = [...v.querySelectorAll('.a-wave i')], ws = [...tr.querySelectorAll('.w')];
      for (let i = 0; i < bars.length; i++) {
        bars[i].classList.add('p');
        const upto = Math.ceil((i + 1) / bars.length * ws.length);
        for (let j = 0; j < upto; j++) ws[j].classList.add('on');
        d.textContent = '0:' + String(Math.round((i + 1) / bars.length * 21)).padStart(2, '0');
        await c.wait(58);
      }
      pl.innerHTML = ic('play');
      release(c, 0, tr);
      await c.wait(760);

      // B3: the crew answers, half a second apart
      await c.beat(2); cur(c, 1);
      sub.textContent = 'Theo is typing…'; sub.classList.add('live');
      const ty = await c.push(list, K.typing(), 'fade', { d: 300 });
      await c.wait(760);
      sub.textContent = 'Theo, Ines, Kofi, You'; sub.classList.remove('live');
      c.time('11:15');
      c.swap(ty, K.b('the bridge is the video. I can see it already', { who: 't', t: '11:15 PM' }), 'up');
      await c.wait(520);
      await c.push(list, K.b('a night needs a poster. I\'m in', { who: 'i', t: '11:15 PM' }));
      await c.wait(520);
      c.time('11:16');
      const kb = await c.push(list, K.b('I know a room. Fridays in November are open', { who: 'k', t: '11:16 PM' }));
      sub.textContent = '4 here now'; sub.classList.add('live');
      await c.wait(360);
      release(c, 1, kb);
      await c.wait(760);

      // B4: FYI AI offers once; the offer grows into a private plan, streamed. Make 3 tasks fills the Tasks tab
      await c.beat(3); cur(c, 2);
      await c.wait(150);
      const sug = await c.push(list, K.sug('Plan from this chat?', 'Show'), 'up', { d: 420 });
      await c.wait(520);
      await c.tap(sug.querySelector('.go'), { press: .9 });
      const ai = c.swap(sug, aiCard(), 'up', { d: 460 });
      await c.wait(520);
      ai.querySelector('.knot').classList.remove('think');
      release(c, 2, ai);
      for (const li of ai.querySelectorAll('li')) { await stream(c, li, 75); await c.wait(100); }
      const acts = ai.querySelector('.acts');
      acts.classList.remove('wait'); c.enter(acts, 'up', { d: 320 });
      await c.wait(400);
      await c.tap(acts.querySelector('.a-ab'), { press: .93 });
      acts.innerHTML = `<span class="t0-made">${ic('check')}2 tasks added</span>`;
      c.enter(acts.firstElementChild, 'fade', { d: 260 });
      const n = c.add(c.q('.a-seg > span:nth-child(2)'), '<i class="n">2</i>', 'pop');
      cur(c, 3); release(c, 3, n);
      await c.wait(950);

      // B5: Day 24. The launch night ticket lands, posted by Maya
      await c.beat(4); cur(c, -1);
      await c.wait(200);
      const sk = await c.push(list, K.pill('Day 24 · Thu, Nov 5'), 'none');
      c.anim(sk, [{ opacity: 0, transform: 'perspective(320px) rotateX(-88deg)' }, { opacity: 1, transform: 'none' }], { duration: 460, easing: PUSH, fill: 'backwards' });
      c.time('6:10'); { const tn = c.q('.a-seg > span:nth-child(2) .n'); if (tn) tn.textContent = '4'; }
      sub.textContent = 'Theo, Ines, Kofi, You'; sub.classList.remove('live'); // weeks later: nobody is live right now
      await c.wait(420);
      const tk = await c.push(list, ticket(), 'up', { d: 560 });
      c.anim(tk.querySelector('.arcs'), [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 180, easing: EASE, fill: 'backwards' });
      await c.wait(1050);
      const host = await c.push(list, promote(), 'fade', { d: 360 });
      await c.wait(1050);

      // B6: Promote. Three formats tick on, the event goes public, the crew and 23 more are going
      await c.beat(5); cur(c, 4);
      await c.wait(240);
      await c.tap(host.querySelector('.t0-pro'));
      const fm = c.swap(host, formats(), 'fade', { d: 300 });
      [...fm.children].forEach((s, i) => {
        c.enter(s, 'pop', { delay: 80 + i * 150 });
        c.anim(s.querySelector('.i'), [{ opacity: 0, transform: 'scale(0)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: 260 + i * 150, easing: SPRING, fill: 'backwards' });
      });
      await c.wait(720);
      c.add(tk, `<span class="a-pub">${ic('globe')}Public</span>`, 'pop');
      await c.wait(320);
      c.time('9:40'); // later that evening, the RSVPs are in
      const st = tk.querySelector('.t0-att .a-stack');
      ['t', 'i', 'k'].forEach((p, i) => c.add(st, K.av(p, 's'), 'pop', { delay: i * 90 }));
      await c.wait(300);
      quiet(c.count(tk.querySelector('.t0-more'), 1, 23, 640, x => '+' + Math.round(x)));
      release(c, 4, tk);
      await c.wait(1400);
      // the scene ends after its last loop (or at once when it was jumped to): no card is current any more
      if (c.ff || c.loop >= c.P.loops) unmark(c.stage);
    },
  });
})();
} catch (e) { console.error('FYI s0-trailer', e); }

// ===== s1-origin =====
try {
// S1 · First run (01 Origin). Day 1: the clock reads 11:10 through onboarding and 11:12 when the group opens.
// Rest = B1 (index 0), end = B6.
// B1 opens on the welcome screen and rings the mark, the name and Continue; B2 pages the story; B3 to B5 set up Maya,
// the crew and the project; B6 opens the group and rings its tabs.
// Page layer (all undone in reset): the numbered rings over the phone (ring 5 is added if the page lacks it) and the
// cast cards under the stage.
(() => {
  const TAG_N = 'Latest version · demo content';
  const TIME = '11:10';
  const EASE = 'cubic-bezier(.2,.7,.2,1)';

  // ---------- the app's screens for this scene ----------
  const welcome = () => `<div class="a-welcome">${FX.mark()}<h3>Focus Your Ideas</h3><p class="sb">Messages, plans and launches for creative crews.</p><p class="terms">I agree to the <u>Terms of Service</u> and acknowledge the <u>Privacy Policy</u>.</p><div class="a-btn">Continue</div></div>`;
  const STORY = [
    ['Create &amp; elaborate on complex projects', 'Plans, files and tasks live in the chat, next to the people doing them.'],
    ['Collaborate through powerful messaging', 'Expressive tools, voice notes with transcripts, and no file size limits.'],
    ['Promote what you make', 'Turn a plan into an event and share it beyond the group.'],
  ];
  const story = () => `<div class="a-story o1-v o1-st"><span class="o1-skip">Skip</span><div class="o1-pgs"><div class="o1-trk">${STORY.map(([h, s]) => `<div class="o1-pg"><h3>${h}</h3><p class="sb">${s}</p></div>`).join('')}</div></div><div class="o1-ft"><span class="dash">${'<i><b></b></i>'.repeat(3)}</span><span class="o1-nx">${FX.ic('fwd')}</span></div></div>`;
  const profile = () => `<div class="a-pg o1-v o1-pf"><h3>One last thing</h3><p class="sb">Your name and skills help the crew know what you do.</p><div class="av"><span class="o1-avph">${FX.ic('plus')}</span></div>`
    + `<div class="a-fld"><div class="k">Name</div><div class="v"><span class="o1-tx" data-ph="Your name"></span></div></div>`
    + `<div class="a-fld"><div class="k">Role &amp; skills</div><div class="v"><span class="a-tags o1-tags" data-ph="Your role and skills"></span></div></div>`
    + `<p class="o1-use">Skills help suggest who owns a task.</p><div class="a-btn o1-go off">Continue</div></div>`;
  const CREW = [['t', 'Video director'], ['i', 'Designer'], ['k', 'Shows and venues'], ['a', 'Photographer']];
  const crew = () => { const K = FX.k; return `<div class="a-pg o1-v o1-cw"><h3>Who do you make things with?</h3><p class="sb">Pick a crew from people already on FYI.</p><div class="a-srch o1-srch">${FX.ic('search')}Search names or crafts</div><div class="a-crew">${CREW.map(([p, cr]) => `<div data-p="${p}">${K.av(p, 'm')}<div><div class="nm">${K.name(p)}</div><div class="cr">${cr}</div></div><span class="a-chk">${FX.ic('check')}</span></div>`).join('')}</div><div class="a-btn o1-go off">Continue</div></div>`; };
  const COLORS = [['Copper', 'var(--cu)'], ['Sand', '#cbb68e'], ['Rose', '#c98a9a'], ['Moss', '#8c9c68']];
  const sheet = () => { const K = FX.k, ic = FX.ic; return `<div class="a-sheet o1-np"><div class="grab"></div><div class="sh"><span class="x">${ic('x')}</span><h4>New project</h4><span class="o1-sp"></span></div>`
    + `<div class="o1-row"><span class="o1-pv"><span class="o1-gph">${ic('folder')}</span></span><div class="a-fld"><div class="k">Name</div><div class="v"><span class="o1-tx" data-ph="Project name"></span></div></div></div>`
    + `<div class="o1-cl"><div class="k">Color<span class="o1-cn"></span></div><div class="a-colors">${COLORS.map(([n, v]) => `<i data-c="${n}" style="--c:${v}"></i>`).join('')}</div></div>`
    + `<div class="a-fld"><div class="k">Crew</div><div class="v">${K.stack('mtik', 's')}<span class="o1-who">You, Theo, Ines and Kofi</span></div></div>`
    + `<div class="a-btn o1-mk">Create project</div></div>`; };
  const thread = () => { const K = FX.k; return `<div class="o1-v o1-th">${K.wall()}<div class="a-th"><div class="a-msgs">${K.pill('Today')}${K.sys('<b>Maya</b> created Copper Hours')}${K.sys('<b>Maya</b> added Theo, Ines and Kofi')}</div></div>${K.hd({ sub: '4 members' })}${K.comp()}</div>`; };

  // ---------- motion helpers (in the phone) ----------
  // a push: the new view slides in from the right; the old one moves a third as far under a solid dim, then goes
  async function push(c, from, to) {
    const dim = c.make('<i class="o1-dim"></i>');
    from.append(dim);
    c.anim(to, [{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 460, easing: EASE });
    c.anim(from, [{ transform: 'none' }, { transform: 'translateX(-30%)' }], { duration: 460, easing: EASE, fill: 'forwards' });
    c.anim(dim, [{ opacity: 0 }, { opacity: 0.4 }], { duration: 460, easing: EASE, fill: 'forwards' });
    await c.wait(470);
    from.remove();
  }
  // a tap whose result lands as the finger does, not after the press
  async function press(c, el, fn, o = {}) {
    const t = c.tap(el, o);
    t.catch(() => {});
    await c.wait(c.ff ? 0 : 230);
    fn();
    await t;
  }
  const pop = (c, el) => c.anim(el, [{ transform: 'scale(.5)' }, { transform: 'scale(1.14)', offset: 0.6 }, { transform: 'none' }], { duration: 360, easing: 'ease-out' });

  // ---------- page layer: rings, cast ----------
  // make=true adds a missing ring (the page's list may stop at 4); reset removes what was added
  const ringLi = (stage, n, make = false) => {
    let li = stage.querySelector(`.rings li[data-r="${n}"]`);
    const ol = stage.querySelector('.rings');
    if (!li && make && ol) { li = document.createElement('li'); li.dataset.r = String(n); li.dataset.o1 = ''; li.textContent = String(n); ol.append(li); }
    return li;
  };
  const glyphs = el => { const rg = document.createRange(); rg.selectNodeContents(el); return rg.getBoundingClientRect(); };
  // a ring hugs its element, in % of the rings box, which is the device box. Modes: 'box' (the element), 'text' (its
  // glyphs, not the block), 'tabs' (a tab row: from the first tab's underline to the last one's, down the row)
  function place(stage, li) {
    const box = stage.querySelector('.rings'), el = li._o1;
    if (!box || !el || !el.isConnected) return;
    const b = box.getBoundingClientRect();
    if (!b.width || !b.height) return;
    const u = b.width / 418; // one device point, in page pixels
    let r, p = Math.max(6, 11 * u), py = p;
    if (li._o1m === 'text') { r = glyphs(el); py = Math.max(3, 4 * u); } // text boxes already carry ascent and descent
    else if (li._o1m === 'tabs') { // the underline spans the middle 56% of a tab, so the ring does too, end to end
      const a = el.firstElementChild.getBoundingClientRect(), z = el.lastElementChild.getBoundingClientRect(), s = el.getBoundingClientRect();
      const l = a.left + a.width * 0.22, rt = z.right - z.width * 0.22;
      r = { left: l, top: s.top + 4 * u, width: rt - l, height: s.height - 4 * u };
      p = Math.max(6, 12 * u); py = Math.max(1, 2 * u);
    } else r = el.getBoundingClientRect();
    if (!r.width) return;
    const pc = (v, d) => (v / d * 100).toFixed(3) + '%';
    li.style.left = pc(r.left - b.left - p, b.width);
    li.style.top = pc(r.top - b.top - py, b.height);
    li.style.width = pc(r.width + 2 * p, b.width);
    li.style.height = pc(r.height + 2 * py, b.height);
  }
  function watch(stage) {
    if (stage._o1ro || !('ResizeObserver' in window)) return;
    const dev = stage.querySelector('[data-scene="origin"]');
    if (!dev) return;
    stage._o1ro = new ResizeObserver(() => stage.querySelectorAll('.rings li.on').forEach(li => place(stage, li)));
    stage._o1ro.observe(dev);
  }
  function ringOn(c, n, el, mode = 'box', delay = 0) {
    const li = ringLi(c.stage, n, true);
    if (!li || !el) return;
    li._o1 = el; li._o1m = mode; li.style.opacity = '';
    place(c.stage, li);
    li.classList.add('on');
    watch(c.stage);
    c.anim(li, [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay, easing: EASE, fill: 'backwards' });
  }
  // fades the rings out; the promise never rejects, so it can run beside a tap
  function ringOff(c, ns) {
    const lis = ns.map(n => ringLi(c.stage, n)).filter(li => li && li.classList.contains('on'));
    lis.forEach(li => { li.style.opacity = '0'; c.anim(li, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out' }); });
    return c.wait(230).then(() => lis.forEach(li => { li.classList.remove('on'); li.style.opacity = ''; li._o1 = null; }), () => {});
  }
  const castLi = (stage, p) => (stage.closest('section') || document).querySelector(`.cast li[data-p="${p}"]`);
  // instant when seeking, so a jump never shows a card still lighting up
  function lit(li, on, now) {
    if (!li) return;
    if (now) { li.style.transition = 'none'; li.classList.toggle('lit', on); void li.offsetWidth; li.style.transition = ''; } else li.classList.toggle('lit', on);
  }

  FX.scene('origin', {
    time: TIME, rest: 0,
    // B1: the welcome screen fills the glass
    html: () => `<div class="o1-v o1-new">${welcome()}</div>`,
    reset(stage) {
      const tag = stage.querySelector('.demo-tag');
      if (tag) tag.textContent = TAG_N;
      stage.querySelectorAll('.rings li[data-o1]').forEach(li => li.remove());
      stage.querySelectorAll('.rings li').forEach(li => { li.classList.remove('on'); li.removeAttribute('style'); li._o1 = null; });
      (stage.closest('section') || document).querySelectorAll('.cast li.lit').forEach(li => lit(li, false, true));
    },
    async run(c) {
      const app = c.app;
      const nv = app.querySelector('.o1-new');

      // B1: the welcome screen; the mark, the name and Continue are ringed on the page and explained in the rail
      await c.beat(0);
      const wl = nv.querySelector('.a-welcome');
      await c.wait(900);
      ringOn(c, 1, wl.querySelector('.fx-mark'), 'box', 0);
      ringOn(c, 2, wl.querySelector('h3'), 'text', 170);
      ringOn(c, 3, wl.querySelector('.a-btn'), 'box', 340);
      await c.wait(2700);

      // B2: Continue, then the story pages left as each dash fills; the first two pages hold long enough to read
      await c.beat(1);
      await ringOff(c, [1, 2, 3]);
      await c.tap(wl.querySelector('.a-btn'));
      const st = c.add(app, story(), 'none');
      await push(c, nv, st);
      const trk = st.querySelector('.o1-trk'), dash = [...st.querySelectorAll('.dash i')];
      for (let i = 0; i < 3; i++) {
        if (i) {
          const from = `translateX(${(-(i - 1) * 100 / 3).toFixed(4)}%)`, to = `translateX(${(-i * 100 / 3).toFixed(4)}%)`;
          trk.style.transform = to;
          c.anim(trk, [{ transform: from }, { transform: to }], { duration: 480, easing: EASE });
          await c.wait(490);
          trk.getAnimations().forEach(a => a.finish());
        }
        dash[i].classList.add('on');
        c.anim(dash[i].firstChild, [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: i < 2 ? 1550 : 700, easing: 'linear' });
        if (i === 2) ringOn(c, 4, st.querySelectorAll('.o1-pg h3')[2], 'text', 120);
        await c.wait(1600);
      }

      // B3: a short profile: a name (the monogram comes from it) and a role with skills
      await c.beat(2);
      const off4 = ringOff(c, [4]);
      await c.tap(st.querySelector('.o1-nx'), { press: 0.9 });
      await off4;
      const pf = c.add(app, profile(), 'none');
      await push(c, st, pf);
      await c.wait(200);
      const nm = pf.querySelector('.o1-tx'), avb = pf.querySelector('.av');
      await c.type(nm, 'M', { cps: 7, caret: true });
      avb.innerHTML = FX.k.av('m', 'xl');
      c.enter(avb.firstElementChild, 'pop');
      pf.querySelector('.o1-go').classList.remove('off');
      await c.type(nm, 'aya', { cps: 8, keep: true });
      await c.wait(260);
      const tags = pf.querySelector('.o1-tags');
      ['Artist', 'Producer', 'Vocals', 'Mixing'].forEach((t, i) => c.add(tags, `<span>${t}</span>`, 'pop', { delay: i * 120 }));
      await c.wait(1300);

      // B4: the crew, picked from people already on FYI; the cast cards on the page light with each check
      await c.beat(3);
      const go6 = pf.querySelector('.o1-go');
      await c.tap(go6);
      const cw = c.add(app, crew(), 'none');
      await push(c, pf, cw);
      await c.wait(240);
      const go = cw.querySelector('.o1-go');
      for (const p of ['t', 'i', 'k']) {
        const chk = cw.querySelector(`.a-crew [data-p="${p}"] .a-chk`);
        await press(c, chk, () => { chk.classList.add('on'); pop(c, chk); lit(castLi(c.stage, p), true, c.ff); go.classList.remove('off'); }, { noPress: true });
        await c.wait(80);
      }
      await c.wait(560);

      // B5: a new project: a name, a color, and the group's mark
      await c.beat(4);
      await c.tap(go);
      c.add(cw, '<div class="a-dim"></div>', 'fade', { d: 320 });
      const sh = c.add(cw, sheet(), 'rise', { d: 420 });
      await c.wait(480);
      await c.type(sh.querySelector('.o1-tx'), 'Copper Hours', { cps: 17 });
      await c.wait(180);
      const sw = sh.querySelector('.a-colors i'), pv = sh.querySelector('.o1-pv');
      await press(c, sw, () => {
        sw.classList.add('on');
        sh.querySelector('.o1-cn').textContent = 'Copper';
        pv.innerHTML = '<span class="a-av g-cu"></span>';
        c.enter(pv.firstElementChild, 'pop');
      }, { press: 0.88 });
      await c.wait(900);

      // B6: the group opens and the story clock moves on; once the thread is in, ring 5 marks the
      // Chat, Tasks and Project tabs
      await c.beat(5);
      await c.tap(sh.querySelector('.o1-mk'));
      const th = c.add(app, thread(), 'none');
      c.time('11:12');
      c.anim(th.querySelector('.fx-wall'), [{ opacity: 0 }, { opacity: 1 }], { duration: 800, delay: 420, easing: 'ease-out', fill: 'backwards' });
      [...th.querySelectorAll('.a-msgs > *')].forEach((m, i) => c.enter(m, 'up', { delay: 560 + i * 150 }));
      await push(c, cw, th);
      await c.wait(700);
      ringOn(c, 5, th.querySelector('.a-seg'), 'tabs');
      await c.wait(1400); // the end state holds after the run, so this only paces the rail
    },
  });
})();
} catch (e) { console.error('FYI s1-origin', e); }

// ===== s2-spark =====
try {
// S2 · The spark (02 Messaging). Day 1, 11:14 PM. Rest = end = B6.
FX.scene('spark', {
  time: '11:14', rest: 5,
  html: () => { const K = FX.k; return `${K.wall()}<div class="a-th"><div class="a-msgs">${K.pill('Today')}${K.sys('<b>Maya</b> created Copper Hours · 11:12 PM')}</div></div>${K.hd()}${K.comp()}`; },
  async run(c) {
    const K = FX.k, ic = FX.ic, list = c.q('.a-msgs'), comp = c.q('.a-comp'), sub = c.q('.a-nav .sub');

    // B1: the stems go in at full size
    await c.beat(0);
    await c.wait(500);
    const f = await c.push(list, K.file({ o: 1, meta: 'Uploading · 2.1 GB' }));
    const ring = f.querySelector('.ring circle');
    c.anim(ring, [{ strokeDashoffset: 138 }, { strokeDashoffset: 0 }], { duration: 1200, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'forwards' });
    await c.wait(1250);
    f.querySelector('.ring').remove();
    f.querySelector('.fm').textContent = '2.1 GB · full size';
    const ftm = c.make(K.tm('11:14 PM', { rd: 1 }));
    f.querySelector('div').append(ftm);
    c.enter(ftm, 'fade', { d: 240 });
    await c.wait(500);

    // B2: a voice note, recorded in the composer
    await c.beat(1);
    await c.tap(comp.querySelector('.mc'), { long: true, press: .9 });
    const rec = c.add(comp, `<div class="a-rec"><span class="dot"></span><span class="tmr">0:00</span>${K.wave(26, 8)}<span class="mc">${ic('up')}</span></div>`, 'fade', { d: 200 });
    rec.querySelectorAll('.a-wave i').forEach((b, i) => c.anim(b, [{ transform: 'scaleY(.08)' }, { transform: 'scaleY(1)' }], { duration: 260, delay: 80 + i * 52, fill: 'backwards' }));
    await c.count(rec.querySelector('.tmr'), 0, 21, 1200, n => '0:' + String(Math.round(n)).padStart(2, '0'));
    await c.wait(400);

    // B3: sent; it plays, and its transcript sits under it
    await c.beat(2);
    await c.tap(rec.querySelector('.mc'));
    c.leave(rec, 'fade', { d: 180 });
    const v = await c.push(list, K.voice({ o: 1, seed: 5, d: '0:21' }));
    await c.wait(380);
    const pl = v.querySelector('.pl');
    await c.tap(pl);
    pl.innerHTML = ic('pause');
    const bars = [...v.querySelectorAll('.a-wave i')];
    const dl = v.querySelector('.d');
    for (let i = 0; i < bars.length; i++) { bars[i].classList.add('p'); dl.textContent = '0:' + String(Math.round((i + 1) / bars.length * 21)).padStart(2, '0'); await c.wait(40); }
    pl.innerHTML = ic('play');
    const tr = await c.push(list, K.tr('Hear the bridge at 1:40? What if the drop isn\'t a post. What if it\'s a night.'), 'fade');
    await c.wait(900);

    // B4: Theo is typing
    await c.beat(3);
    sub.textContent = 'Theo is typing…'; sub.classList.add('live');
    const ty = await c.push(list, K.typing(), 'fade', { d: 300 });
    await c.wait(950);
    sub.textContent = 'Theo, Ines, Kofi, You'; sub.classList.remove('live');
    c.time('11:15');
    c.swap(ty, K.b('the bridge is the video. I can see it already', { who: 't', t: '11:15 PM' }), 'up');
    await c.wait(1100);

    // B5: Ines reacts, then replies
    await c.beat(4);
    v.classList.add('has-rx');
    c.add(v, K.rx('fl', '', 'i'), 'pop');
    await c.wait(800);
    await c.push(list, K.b('a night needs a poster. I\'m in', { who: 'i', t: '11:15 PM' }));
    await c.wait(1100);

    // B6: Kofi, and everyone has seen it
    await c.beat(5);
    await c.wait(250);
    c.time('11:16');
    await c.push(list, K.b('I know a room. Fridays in November are open', { who: 'k', t: '11:16 PM' }));
    await c.wait(500);
    c.insert(tr.nextElementSibling, K.seen('tik', 'Seen by Theo, Ines, Kofi'));
    const rd = f.querySelector('.rd'); if (rd) { rd.innerHTML = ic('dcheck'); rd.classList.add('all'); }
    await c.wait(1200);
  },
});
} catch (e) { console.error('FYI s2-spark', e); }

// ===== s3-catchup =====
try {
// S3 · Catch up (03 AI). Day 3, Thu 8:02 AM. Rest = B4 (index 3), end = B6.
// Maya comes back to 64 new messages. One tap turns the pill into a private AI card (a FLIP: the pill's label goes out,
// its outline grows into the card, then the card's content comes in). The summary streams with its sources, one source
// jumps back to Theo's message, a draft goes out as Maya's own message, and Kofi asks the AI in front of the group.
(() => {
  const EASE = 'cubic-bezier(.2,.8,.2,1)';
  const LINES = [
    ['Launch night is on. Kofi is holding Fri, Nov 20 at Dock Hall 3.', 'Kofi · Wed 6:40 PM'],
    ['Theo wants the visualizer to hit the bridge at 1:40.', 'Theo · Wed 9:12 PM'],
    ['Ines is sketching three cover directions.', 'Ines · Wed 10:03 PM'],
    ['Still open: who runs tickets?', ''],
  ];
  const DRAFT = 'Who wants to run tickets? I can set up the link if no one does.';
  const ANSWER = ['From', '<span class="mono">copper-hours_stems_v4.zip</span>:', '104', 'BPM,', 'A', 'minor,', '3:12.'];

  // points per screen pixel, for turning measured rects into the phone's own units
  const scale = c => c.app.getBoundingClientRect().width / 390 || 1;
  // words are laid out from the start (hidden), so a streaming line never reflows the card
  const words = s => (Array.isArray(s) ? s : s.split(' ')).map(w => `<i class="s3-w">${w}</i>`).join(' ');
  const plain = el => { el.textContent = el.textContent; };
  const grower = inner => `<div class="s3-g"><div class="s3-gi">${inner}</div></div>`;

  // an animation the scene has outlived is finished on the scene clock, so a resume can never replay it
  const fin = (c, a, ms) => { c.wait(ms + 40).then(() => { try { if (a.playState !== 'finished') a.finish(); } catch (e) {} }, () => {}); return a; };
  // a layout change inside the bottom-anchored list, played as a slide from where things were (transform only)
  function flip(c, list, mutate, o = {}) {
    const ref = list.firstElementChild, k = scale(c);
    const y0 = ref.getBoundingClientRect().top;
    mutate();
    const dy = (y0 - ref.getBoundingClientRect().top) / k;
    if (Math.abs(dy) > .5) fin(c, c.anim(list, [{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0px)' }], { duration: o.d || 420, easing: o.e || EASE, composite: 'add' }), o.d || 420);
    return dy;
  }
  // a row that opens from nothing (grid-template-rows 0fr to 1fr), pushing the thread up as it grows
  function grow(c, g, d = 260) {
    g.classList.add('open');
    return c.anim(g, [{ gridTemplateRows: '0fr' }, { gridTemplateRows: '1fr' }], { duration: d, easing: EASE });
  }
  // stream pre-laid words at about ten a second behind a violet caret
  async function stream(c, el, wps = 10) {
    const ws = [...el.querySelectorAll('.s3-w')];
    const car = c.make('<b class="s3-car"></b>');
    for (const w of ws) {
      w.classList.add('on'); w.append(car);
      if (!c.ff) c.anim(w, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'linear' });
      await c.wait(1000 / wps);
    }
    car.remove();
  }
  // the knot stops thinking: its orbits ease on to the next quarter turn (where the knot looks the same) and rest
  function settle(c, knot) {
    if (!knot || !knot.classList.contains('think')) return;
    const o1 = knot.querySelector('.o1'), o2 = knot.querySelector('.o2');
    const tf = getComputedStyle(o1).transform;
    knot.classList.remove('think');
    if (c.ff || !tf || tf === 'none') return;
    const m = new DOMMatrixReadOnly(tf), a = Math.atan2(m.b, m.a) * 180 / Math.PI;
    const r = (((a % 90) + 90) % 90), rest = r < .5 ? 0 : 90 - r;
    if (!rest) return;
    const o = { duration: 120 + rest * 3, easing: 'cubic-bezier(.2,.6,.3,1)' };
    c.anim(o1, [{ transform: `rotate(${a}deg)` }, { transform: `rotate(${a + rest}deg)` }], o);
    c.anim(o2, [{ transform: `rotate(${-a}deg)` }, { transform: `rotate(${-a - rest}deg)` }], o);
  }

  // the private card, born from the pill: header, then a body that opens line by line
  const card = () => {
    const K = FX.k, ic = FX.ic;
    return `<div class="a-ai s3-cu s3-mo"><div class="hd">${K.knot('think')}<span class="s3-ti">Catch up</span><span class="s3-meta">64 messages</span><span class="vis">${ic('lock')}Only you</span><span class="s3-chev">${ic('down')}</span></div>`
      + `<div class="s3-bd"><div class="s3-bdi"><div class="s3-st">Reading 64 messages…</div></div></div><span class="s3-ghost"><i></i></span></div>`;
  };
  // the answer in the group: who asked is in the header, so nobody has to guess who said it
  const groupCard = () => {
    const K = FX.k, ic = FX.ic;
    return K.ai({ title: 'FYI AI', think: true, cls: 's3-grp gap', vis: `${ic('users')}In group · asked by Kofi`, body: grower(`<div class="s3-ans">${words(ANSWER)}</div>`) });
  };

  FX.scene('catchup', {
    time: '8:02', rest: 3,
    html() {
      const K = FX.k;
      const m = (who, text, t, id) => K.b(text, { who, t, cls: 'gap', id });
      return `${K.wall()}<div class="a-th"><div class="a-msgs">${[
        m('i', 'a night needs a poster. I\'m in', '11:15 PM'),
        m('k', 'I know a room. Fridays in November are open', '11:16 PM'),
        K.pill('Yesterday'),
        '<div class="a-div">64 new messages</div>',
        m('k', 'Dock Hall 3 can do Fri, Nov 20. holding it for us', '6:40 PM'),
        m('i', 'wait. launch night is real?', '6:42 PM'),
        m('t', 'visualizer should hit the bridge at 1:40. that\'s the moment', '9:12 PM', 'theo'),
        m('i', 'sketching three cover directions tonight', '10:03 PM'),
        m('t', 'pulled stills from the bridge. the light is unreal', '10:48 PM'),
        m('i', 'send two? for the cover colors', '10:51 PM'),
        m('t', 'sending now', '10:52 PM'),
        m('i', 'got them. that teal is the poster', '10:58 PM'),
        m('k', 'the room has a real screen, by the way', '11:20 PM'),
        m('t', 'then the visualizer goes big', '11:23 PM'),
        m('i', 'ok, sleep. more tomorrow', '11:47 PM'),
        '<i class="s3-sp"></i>',
      ].join('')}</div></div>${K.hd({ tasks: 2 })}${K.comp()}`;
    },
    async run(c) {
      const K = FX.k, ic = FX.ic;
      const list = c.q('.a-msgs'), th = c.q('.a-th'), comp = c.q('.a-comp'), sub = c.q('.a-nav .sub');

      // B1: 64 new messages since last night, and a way to catch up
      await c.beat(0);
      await c.wait(450);
      c.add(c.app, `<div class="a-aipill s3-pill">${K.knot()}<span>Catch me up · 64</span></div>`, 'up', { d: 480 });
      await c.wait(1150);

      // B2: the pill becomes a private card (FLIP: label out, outline grows, content in), and the knot thinks
      await c.beat(1);
      const pill = c.q('.s3-pill');
      await c.tap(pill, { press: .95 });
      [...pill.children].forEach(ch => c.anim(ch, [{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' }));
      await c.wait(150);
      const pr = pill.getBoundingClientRect();
      let cu;
      // today's first message: the card arrives under a Thursday pill
      flip(c, list, () => { cu = c.make(card()); c.q('.s3-sp').replaceWith(c.make(K.pill('Today')), cu); }, { d: 400 });
      const cr = cu.getBoundingClientRect(), k = scale(c);
      pill.remove();
      const gh = cu.querySelector('.s3-ghost');
      if (!c.ff) {
        const ins = [pr.top - cr.top, cr.right - pr.right, cr.bottom - pr.bottom, pr.left - cr.left].map(v => Math.max(0, v / k).toFixed(2) + 'px').join(' ');
        c.anim(gh, [{ clipPath: `inset(${ins} round 19px)` }, { clipPath: 'inset(0px 0px 0px 0px round 16px)' }], { duration: 400, easing: EASE });
        c.anim(gh.firstElementChild, [{ clipPath: `inset(${ins} round 18px)` }, { clipPath: 'inset(0px 0px 0px 0px round 15px)' }], { duration: 400, easing: EASE });
        await c.wait(400);
      }
      gh.remove(); cu.classList.remove('s3-mo');
      const hd = cu.querySelector('.hd');
      [hd.querySelector('.knot'), hd.querySelector('.s3-ti'), hd.querySelector('.vis'), hd.querySelector('.s3-chev'), cu.querySelector('.s3-bd')]
        .forEach((el, i) => c.anim(el, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: i * 45, fill: 'backwards' }));
      await c.wait(950);

      // B3: the summary streams in, one line at a time
      await c.beat(2);
      settle(c, hd.querySelector('.knot'));
      const bdi = cu.querySelector('.s3-bdi');
      const tt = c.make(`<div class="s3-tt">${words('While you were away:')}</div>`);
      bdi.querySelector('.s3-st').replaceWith(tt);
      await stream(c, tt); plain(tt);
      for (const [txt] of LINES) {
        const r = c.make(grower(`<div class="s3-li"><div class="s3-tx">${words(txt)}</div></div>`));
        bdi.append(r); grow(c, r, 240);
        await c.wait(130);
        const tx = r.querySelector('.s3-tx');
        await stream(c, tx); plain(tx);
        await c.wait(120);
      }
      await c.wait(500);

      // B4: every line links to its source; Theo's chip jumps back to the message, then the thread returns
      await c.beat(3);
      const lis = [...cu.querySelectorAll('.s3-li')], chips = [];
      for (let i = 0; i < 3; i++) {
        const g = c.make(grower(K.src(LINES[i][1])));
        lis[i].append(g); grow(c, g, 280);
        const ch = g.querySelector('.a-src'); chips.push(ch);
        c.enter(ch, 'fade', { d: 300, delay: 100 });
        await c.wait(150);
      }
      await c.wait(750);
      if (!c.ff) {
        await c.tap(chips[1], { press: .94 });
        const msg = c.q('[data-id="theo"]');
        const tr = th.getBoundingClientRect(), mr = msg.getBoundingClientRect();
        const D = Math.round(((tr.top + tr.height * .44) - (mr.top + mr.height / 2)) / scale(c));
        const go = 640, hold = 1400, back = 600, T = go + hold + back;
        fin(c, c.anim(list, [
          { transform: 'translateY(0px)', easing: 'cubic-bezier(.3,.7,.2,1)' },
          { transform: `translateY(${D}px)`, offset: go / T },
          { transform: `translateY(${D}px)`, offset: (go + hold) / T, easing: 'cubic-bezier(.5,0,.2,1)' },
          { transform: 'translateY(0px)' },
        ], { duration: T, easing: 'linear', composite: 'add' }), T);
        await c.wait(go - 40);
        // outlined in 2 pt violet, pulsing twice
        const ring = c.add(msg, '<i class="s3-ring"></i>', 'none');
        c.anim(ring, [{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'none' }], { duration: 240 });
        await c.wait(300);
        for (let i = 0; i < 2; i++) {
          c.anim(ring, [{ opacity: 1, transform: 'none' }, { opacity: .3, transform: 'scale(1.025)', offset: .45 }, { opacity: 1, transform: 'none' }], { duration: 440, easing: 'ease-in-out' });
          await c.wait(460);
        }
        await c.wait(hold - 300 - 920 + 40);
        c.leave(ring, 'fade', { d: 240 });
        await c.wait(back);
      }
      await c.wait(500);

      // B5: AI drafts, Maya sends it as an ordinary message
      await c.beat(4);
      const acts = c.make(grower(`<div class="acts"><span class="a-ab s3-ask">${ic('compose')}Ask about tickets</span><span class="a-ab you">${ic('users')}Post to group</span></div>`));
      bdi.append(acts); grow(c, acts, 300);
      c.enter(acts.querySelector('.acts'), 'fade', { d: 280, delay: 120 });
      await c.wait(850);
      await c.tap(c.q('.s3-ask'));
      // the card has done its job: it folds to one private line
      const bd = cu.querySelector('.s3-bd');
      c.anim(bdi, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
      bdi.style.opacity = 0;
      bd.classList.add('s3-closed'); cu.classList.add('s3-min');
      c.anim(bd, [{ gridTemplateRows: '1fr' }, { gridTemplateRows: '0fr' }], { duration: 380, delay: 90, easing: EASE, fill: 'backwards' });
      const meta = cu.querySelector('.s3-meta'); meta.style.opacity = 1;
      c.anim(meta, [{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: 300, fill: 'backwards' });
      c.anim(cu.querySelector('.s3-chev .i'), [{ transform: 'rotate(180deg)' }, { transform: 'rotate(0deg)' }], { duration: 380, delay: 90, easing: EASE, fill: 'backwards' });
      await c.wait(520);
      // the draft goes into the composer, labeled until it is sent; the composer grows up and the thread rises with it
      const tx = comp.querySelector('.tx'), mc = comp.querySelector('.mc');
      const h0 = comp.offsetHeight;
      let g = 0;
      flip(c, list, () => {
        comp.insertAdjacentHTML('afterbegin', `<div class="a-draft">${K.spark()}Drafted with AI · edit before sending</div>`);
        tx.innerHTML = `<span class="s3-vis"></span><b class="s3-car"></b><span class="s3-rest">${DRAFT}</span>`;
        mc.classList.add('snd'); mc.innerHTML = ic('up');
        g = comp.offsetHeight - h0;
        th.style.bottom = comp.offsetHeight + 'px';
      }, { d: 380 });
      if (g > 0) c.anim(comp, [{ clipPath: `inset(${g}px 0px 0px 0px)` }, { clipPath: 'inset(0px 0px 0px 0px)' }], { duration: 380, easing: EASE });
      c.enter(mc, 'pop', { d: 380 });
      await c.wait(380);
      const vis = tx.querySelector('.s3-vis'), rest = tx.querySelector('.s3-rest');
      if (c.ff) { vis.textContent = DRAFT; rest.textContent = ''; }
      else for (let i = 1; i <= DRAFT.length; i++) { vis.textContent = DRAFT.slice(0, i); rest.textContent = DRAFT.slice(i); await c.wait(28); }
      tx.querySelector('.s3-car').remove();
      await c.wait(750);
      await c.tap(mc);
      // sent: an ordinary blue bubble, no AI mark
      const mine = c.make(K.b(DRAFT, { o: 1, t: '8:03 AM', rd: 1 }));
      flip(c, list, () => {
        comp.querySelector('.a-draft').remove(); tx.innerHTML = '';
        mc.classList.remove('snd'); mc.innerHTML = ic('mic');
        th.style.bottom = '';
        list.append(mine);
      }, { d: 460 });
      c.enter(mine, 'up', { d: 460 });
      c.time('8:03');
      await c.wait(950);

      // B6: Kofi asks the AI in the group; everyone sees the answer and who asked
      await c.beat(5);
      sub.textContent = 'Kofi is typing…'; sub.classList.add('live');
      const ty = await c.push(list, K.typing(), 'fade', { d: 300 });
      await c.wait(750);
      sub.textContent = 'Theo, Ines, Kofi, You'; sub.classList.remove('live');
      c.swap(ty, K.b('<span class="at">@AI</span> what tempo and key is the single?', { who: 'k', t: '8:04 AM' }), 'up');
      c.time('8:04');
      await c.wait(750);
      const gc = await c.push(list, groupCard());
      await c.wait(650);
      settle(c, gc.querySelector('.knot'));
      const ga = gc.querySelector('.s3-g');
      grow(c, ga, 260);
      await c.wait(120);
      await stream(c, ga.querySelector('.s3-ans'));
      await c.wait(800);
      await c.push(list, K.b('perfect, sending to the DJ', { who: 'k', t: '8:04 AM', cls: 'gap' }));
      const rd = mine.querySelector('.rd'); if (rd) rd.innerHTML = ic('dcheck');
      await c.wait(1600);
    },
  });
})();
} catch (e) { console.error('FYI s3-catchup', e); }

// ===== s4-task =====
try {
// S4 · Message to task (04 Tasks). Day 3, 8:20 AM, then Day 9. Rest = B5 (index 4), end = B6 (index 5).
// Theo promises a cut in the chat. FYI AI offers once to make it a task, Maya opens the sheet and the four fields fill from
// four phrases of Theo's message, in step with the anatomy panel on the page. Maya confirms, the task attaches to its
// message, the Tasks tab lists every promise, and on Day 9 the stems are done, so Theo's task is ready to start.
// Page layer: only the anatomy panel (.anat), driven through data-anat and .lit / .now (styled in fyi.css).
(() => {
  const EASE = 'cubic-bezier(.2,.7,.2,1)', PUSH = 'cubic-bezier(.2,.8,.2,1)', SPRING = 'cubic-bezier(.34,1.4,.5,1)';
  const AI = '#9638f0', AI0 = 'rgba(150,56,240,0)';
  // Theo's message, with the four phrases the task is built from (same numbers as the anatomy panel)
  const MSG = '<span data-a="3">I\'ll</span> have <span data-a="1">the visualizer cut</span> <span data-a="2">by Nov 12</span>. <span data-a="4">need the final stems first</span> though';
  const SEG = (390 - 24) / 3; // one in-chat tab, in points

  // ---------- page layer: the anatomy panel ----------
  // n fields filled so far; "now" marks the phrase being filled (0: none). Idempotent, so any seek can call it.
  function anat(stage, n, now = 0) {
    if (!stage) return;
    stage.dataset.anat = String(n);
    stage.querySelectorAll('.anat [data-a]').forEach(el => {
      const a = +el.dataset.a;
      el.classList.toggle('lit', a <= n);
      el.classList.toggle('now', a === now && el.matches('.anat-s [data-a]'));
    });
  }

  // ---------- small helpers ----------
  // an element's box inside the 390 x 844 screen, in points
  const box = (c, el) => {
    const a = c.app.getBoundingClientRect(), r = el.getBoundingClientRect(), k = a.width / 390 || 1;
    return { x: (r.left - a.left) / k, y: (r.top - a.top) / k, w: r.width / k, h: r.height / k };
  };
  // FLIP: change the DOM, then let every listed element glide from where it was to where it is now
  function flip(c, els, change, o = {}) {
    const k = c.app.getBoundingClientRect().width / 390 || 1;
    const before = new Map(els.map(el => [el, el.getBoundingClientRect().top]));
    change();
    if (c.ff) return;
    before.forEach((t0, el) => {
      if (!el.isConnected) return;
      const dy = (t0 - el.getBoundingClientRect().top) / k;
      if (Math.abs(dy) > .5) c.anim(el, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: o.d || 460, easing: o.ease || EASE });
    });
  }

  // ---------- the app's pieces for this scene ----------
  const sp = () => FX.k.spark();
  const theo = () => FX.k.b(MSG, { who: 't', t: '8:20 AM', cls: 't4-msg' });
  const chip = () => FX.k.chip(`Visualizer cut · ${FX.k.av('t', 's')}Theo · Nov 12`, 'appr').replace('class="a-chip', 'class="a-chip t4-chip');
  const fld = (n, k, ai, v, more = '') => `<div class="a-fld t4-f t4-wait" data-f="${n}"><div class="k">${k}<span class="sg">${sp()}${ai}</span></div><div class="v">${v}</div>${more}</div>`;
  const sheet = () => {
    const K = FX.k, ic = FX.ic;
    return `<div class="a-sheet t4-sh"><div class="grab"></div>`
      + `<div class="sh"><span class="x">${ic('x')}</span><h4>New task</h4><span class="t4-ok">${ic('check')}</span></div>`
      + fld(1, 'Name', 'from message', 'Visualizer cut, bridge at 1:40')
      + fld(2, 'Due', 'from message', `${ic('cal')}Thu, Nov 12`)
      + fld(3, 'Assigned to', 'suggested, from “I\'ll”', `<span class="a-pchip">${K.av('t', 's')}Theo</span>`)
      + fld(4, 'Waiting on', 'from message', 'Final stems<span class="t4-new">New task</span>',
        `<div class="t4-sub"><span class="a-pchip">${K.av('m', 's')}Maya</span><span class="t4-why">${sp()}suggested from role: Producer, Mixing</span></div>`
        + `<div class="t4-sub"><span class="t4-nd need">${ic('cal')}No date</span><span class="t4-none">not in the message</span></div>`)
      + `<div class="t4-st"><span>Status</span><div class="a-segc"><span class="on">Approved</span><span>In progress</span><span>Finished</span></div></div>`
      + '</div>';
  };
  const row = (cls, title, meta, o = {}) => `<div class="a-trow ${cls}"><span class="a-chk${o.chk ? ' ' + o.chk : ''}">${FX.ic('check').replace('<path', '<path pathLength="1"')}</span><div class="bdy"><div class="tt">${title}</div><div class="mt">${meta}</div>${o.more || ''}</div></div>`;
  const tasks = () => {
    const K = FX.k, ic = FX.ic;
    return `<div class="a-tasks t4-tasks">`
      + '<h5 class="st-prog">In progress</h5>'
      + row('t4-ca', 'Cover art', `${K.av('i', 's')}Ines · Fri, Nov 6`, { chk: 't4-prog' })
      + '<h5 class="st-appr t4-ap">Approved</h5>'
      + row('t4-fs', 'Final stems', `${K.av('m', 's')}Maya · <span class="need">No date</span>`)
      + row('t4-vc', 'Visualizer cut', `${K.av('t', 's')}Theo · Thu, Nov 12`, { more: `<div class="mt t4-wt"><span class="t4-wo">${ic('clock')}waiting on Final stems</span></div>` })
      + row('t4-dh', 'Confirm Dock Hall 3', `${K.av('k', 's')}Kofi · Thu, Nov 5`)
      + '<h5 class="st-done t4-fh">Finished</h5>'
      + '<div class="a-empty t4-empty">Nothing here yet</div>'
      + '</div>';
  };

  // the fields fill from the message: the value wipes in, the sparkle pops, a violet underline draws and fades
  function fill(c, f) {
    f.classList.remove('t4-wait');
    if (c.ff) return;
    [...f.querySelectorAll('.v, .t4-sub')].forEach((el, i) => c.anim(el, [{ clipPath: 'inset(-4px 100% -4px 0)' }, { clipPath: 'inset(-4px 0 -4px 0)' }], { duration: 420, delay: i * 150, easing: EASE, fill: 'backwards' }));
    [...f.querySelectorAll('.sg, .t4-why .sp')].forEach((el, i) => c.anim(el, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: 80 + i * 150, easing: SPRING, fill: 'backwards' }));
    c.anim(f, [{ opacity: 1, transform: 'scaleX(0)' }, { opacity: 1, transform: 'none', offset: .3 }, { opacity: 1, transform: 'none', offset: .6 }, { opacity: 0, transform: 'none' }], { duration: 1000, easing: 'linear', pseudoElement: '::after' });
  }
  // inside the lifted bubble, the phrase being read gets a violet underline (AI is reading it)
  function mark(c, bub, n, now) {
    bub.querySelectorAll('[data-a]').forEach(s => {
      const a = +s.dataset.a, was = s.classList.contains('lit');
      s.classList.toggle('lit', a <= n); s.classList.toggle('now', a === now);
      if (a <= n && !was && !c.ff) c.anim(s, [{ textDecorationColor: AI0 }, { textDecorationColor: AI }], { duration: 300 });
    });
  }
  // out, then in: the old content leaves, the new content arrives in the same place (never both at once)
  async function outIn(c, el, change, o = {}) {
    if (c.ff) { change(); return; }
    const d = o.d || 6;
    const a = c.anim(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateY(${-d}px)` }], { duration: o.out || 180, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
    await c.wait(o.out || 180);
    change(); a.cancel();
    c.anim(el, [{ opacity: 0, transform: `translateY(${d}px)` }, { opacity: 1, transform: 'none' }], { duration: o.in || 260, easing: 'cubic-bezier(0,0,.2,1)' });
    await c.wait(o.in || 260);
  }
  // the badge rolls one number at a time: out the top, in from the bottom
  async function roll(c, el, to) {
    for (let v = +el.textContent + 1; v <= to; v++) await outIn(c, el, () => { el.textContent = v; }, { d: 14, out: 110, in: 160 });
  }

  FX.scene('task', {
    time: '8:20', rest: 4,
    html: () => {
      const K = FX.k;
      return `<div class="view t4-chat">${K.wall()}<div class="a-th"><div class="a-msgs">${K.pill('Today')}`
        + K.b('perfect, sending to the DJ', { who: 'k', t: '8:04 AM' })
        + K.b('Theo, when can you have the visualizer cut?', { o: 1, t: '8:19 AM', rd: 2 })
        + `</div></div>${K.comp()}<i class="t4-shade"></i></div>`
        + K.hd({ tasks: '<span class="t4-num">2</span>' }).replace('<div class="a-seg">', '<div class="a-seg"><i class="t4-ind"></i>');
    },
    reset(stage) { anat(stage, 0); },
    async run(c) {
      const K = FX.k, ic = FX.ic, list = c.q('.a-msgs'), sub = c.q('.a-nav .sub'), stage = c.stage;

      // B1: Theo makes a promise in the chat
      await c.beat(0);
      anat(stage, 0);
      await c.wait(320);
      sub.textContent = 'Theo is typing…'; sub.classList.add('live');
      const ty = await c.push(list, K.typing(), 'fade', { d: 300 });
      await c.wait(900);
      sub.textContent = 'Theo, Ines, Kofi, You'; sub.classList.remove('live');
      const tb = c.swap(ty, theo(), 'up');
      await c.wait(1000);

      // B2: FYI AI offers once, quietly: a strip unfolds under the message
      await c.beat(1);
      await c.wait(420);
      const sug = c.make(K.sug('<small>Looks like a task</small>Visualizer cut · Nov 12'));
      sug.classList.add('t4-sug');
      list.append(sug);
      if (!c.ff) {
        const h = sug.offsetHeight;
        c.anim(sug, [{ height: '0px', marginTop: '0px', opacity: 0 }, { height: h + 'px', marginTop: '4px', opacity: 1, offset: .7 }, { height: h + 'px', marginTop: '4px', opacity: 1 }], { duration: 520, easing: EASE });
        const kn = sug.querySelector('.knot');
        kn.classList.add('think');
        await c.wait(1000);
        kn.classList.remove('think');
        c.anim(kn, [{ transform: 'scale(1.18)' }, { transform: 'none' }], { duration: 360, easing: SPRING });
      }
      await c.wait(760);

      // B3: Make task. The message lifts, the sheet rises under it, and four phrases become four fields
      await c.beat(2);
      await c.tap(sug.querySelector('.go'));
      await c.wait(120);
      const dim = c.add(c.app, '<div class="a-dim t4-dim"></div>', 'fade', { d: 300 });
      const sh = c.add(c.app, sheet(), 'rise', { d: 400 });
      const r = box(c, tb);
      const lift = c.add(c.app, `<div class="t4-lift" style="left:${r.x.toFixed(2)}px;top:${r.y.toFixed(2)}px;width:${(r.w + .5).toFixed(2)}px"></div>`, 'none');
      const cl = tb.cloneNode(true);
      cl.classList.add('lift');
      lift.append(cl);
      tb.style.visibility = 'hidden'; // the copy sits exactly on top: a cut, not a fade
      const top = 844 - sh.offsetHeight - 16;
      const dy = Math.max(70 - r.y, top - (r.y + r.h));
      const up = `translateY(${dy.toFixed(1)}px) scale(1.02)`;
      lift.style.transform = up;
      c.anim(lift, [{ transform: 'none' }, { transform: up }], { duration: 460, easing: PUSH });
      c.anim(cl, [{ boxShadow: '0 0 0 rgba(0,0,0,0)' }, { boxShadow: '0 16px 34px rgba(0,0,0,.7)' }], { duration: 460 });
      await c.wait(560);
      const fl = c.qa('.t4-f');
      for (let i = 0; i < 4; i++) {
        if (i) await c.wait(600);
        fill(c, fl[i]); mark(c, cl, i + 1, i + 1); anat(stage, i + 1, i + 1);
      }
      await c.wait(540);
      const ok = sh.querySelector('.t4-ok');
      ok.classList.add('on');
      if (!c.ff) c.anim(ok, [{ transform: 'scale(.8)' }, { transform: 'none' }], { duration: 420, easing: SPRING });
      await c.wait(1000);
      mark(c, cl, 4, 0); anat(stage, 4, 0);

      // B4: Maya taps the check. The sheet drops, the message settles, and the task attaches to it
      await c.beat(3);
      anat(stage, 4, 0);
      await c.tap(ok, { press: .88 });
      c.leave(sh, 'sink', { d: 360 });
      c.leave(dim, 'fade', { d: 320 });
      cl.querySelectorAll('.lit').forEach(s => { if (!c.ff) c.anim(s, [{ textDecorationColor: AI }, { textDecorationColor: AI0 }], { duration: 260 }); s.classList.remove('lit', 'now'); });
      lift.style.transform = ''; cl.classList.remove('lift');
      c.anim(lift, [{ transform: up }, { transform: 'none' }], { duration: 420, easing: PUSH });
      c.anim(cl, [{ boxShadow: '0 16px 34px rgba(0,0,0,.7)' }, { boxShadow: '0 0 0 rgba(0,0,0,0)' }], { duration: 420 });
      await c.wait(430);
      lift.remove(); tb.style.visibility = ''; // the copy has landed exactly on the message: a cut back to it
      const ch = c.swap(sug, chip(), 'pop');
      await c.wait(560);
      if (!c.ff) { // a ghost of the chip flies up into the Tasks tab
        const a = box(c, ch), b = box(c, c.q('.a-seg .n'));
        const g = c.add(c.app, `<div class="t4-ghost" style="left:${a.x.toFixed(1)}px;top:${a.y.toFixed(1)}px">${ch.outerHTML}</div>`, 'none');
        const tx = b.x + b.w / 2 - (a.x + a.w / 2), ty2 = b.y + b.h / 2 - (a.y + a.h / 2);
        const at = (f, s) => `translate(${(tx * f).toFixed(1)}px, ${(ty2 * f).toFixed(1)}px) scale(${s})`;
        c.anim(g, [
          { transform: 'none', opacity: 1, easing: 'cubic-bezier(.3,0,.6,1)' },
          { transform: `${at(0, 1)} translateY(-6px) scale(1.04)`, opacity: 1, offset: .16, easing: 'cubic-bezier(.45,0,.2,1)' },
          { transform: at(.97, .3), opacity: 1, offset: .88 },
          { transform: at(1, .16), opacity: 0 },
        ], { duration: 720, easing: 'linear', fill: 'forwards' });
        await c.wait(660);
        g.remove();
        c.anim(c.q('.a-seg .n'), [{ transform: 'none' }, { transform: 'scale(1.3)' }, { transform: 'none' }], { duration: 420, easing: SPRING });
      }
      await roll(c, c.q('.t4-num'), 4);
      await c.wait(260);
      await c.push(list, K.sys('<b>Maya</b> made this a task for Theo'));
      await c.wait(1150);

      // B5: the Tasks tab pushes in: one list for every promise in the group
      await c.beat(4);
      const segs = c.qa('.a-seg > span'), ind = c.q('.t4-ind');
      await c.tap(segs[1], { press: .94 });
      segs[0].classList.remove('on'); segs[1].classList.add('on');
      ind.style.transform = `translateX(${SEG}px)`;
      c.anim(ind, [{ transform: 'none' }, { transform: `translateX(${SEG}px)` }], { duration: 360, easing: PUSH });
      const tv = c.add(c.app, tasks(), 'none');
      const chat = c.q('.t4-chat'), shade = c.q('.t4-shade');
      c.anim(tv, [{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 460, easing: PUSH });
      chat.style.transform = 'translateX(-30%)';
      c.anim(chat, [{ transform: 'none' }, { transform: 'translateX(-30%)' }], { duration: 460, easing: PUSH });
      shade.style.opacity = '.4';
      c.anim(shade, [{ opacity: 0 }, { opacity: .4 }], { duration: 460 });
      await c.wait(520);
      // the two tasks just made from Theo's message light up once, so the eye finds them
      if (!c.ff) ['.t4-fs', '.t4-vc'].forEach((s, i) => c.anim(c.q(s), [{ backgroundColor: '#2c2c2e' }, { backgroundColor: '#1c1c1e' }], { duration: 1000, delay: i * 140, easing: 'ease-out' }));
      await c.wait(1800);

      // B6: Day 9. The stems are done, so Theo can start
      await c.beat(5);
      const fs = c.q('.t4-fs'), vc = c.q('.t4-vc');
      c.time('5:30');
      const skip = c.make('<div class="a-skip t4-skip">Day 9 · Wed, Oct 21</div>');
      flip(c, [...tv.children], () => tv.prepend(skip), { d: 420 });
      if (!c.ff) c.anim(skip, [{ opacity: 0, transform: 'perspective(320px) rotateX(-88deg)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: PUSH, fill: 'backwards' });
      await c.wait(760);
      const ck = fs.querySelector('.a-chk');
      await c.tap(ck, { press: .84 });
      ck.classList.add('done');
      if (!c.ff) {
        c.anim(ck, [{ transform: 'scale(.7)' }, { transform: 'none' }], { duration: 460, easing: SPRING });
        c.anim(ck.querySelector('path'), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 340, delay: 60, easing: EASE, fill: 'backwards' });
      }
      await c.wait(520);
      const empty = c.q('.t4-empty');
      if (!c.ff) { c.leave(empty, 'fade', { d: 180, keep: true }); await c.wait(190); }
      fs.classList.add('t4-mv');
      flip(c, [...tv.children], () => {
        empty.remove();
        c.q('.t4-fh').after(fs);
        fs.classList.add('t4-done');
        fs.querySelector('.mt').innerHTML = `${K.av('m', 's')}Maya · Done Wed, Oct 21`;
      }, { d: 520 });
      await c.wait(560);
      fs.classList.remove('t4-mv');
      // Theo's task is no longer waiting: out, then in
      const wt = vc.querySelector('.t4-wt');
      await outIn(c, wt, () => { wt.innerHTML = '<span class="ok">Ready to start</span>'; }, { out: 200, in: 300 });
      if (!c.ff) c.anim(vc, [{ backgroundColor: '#2c2c2e' }, { backgroundColor: '#1c1c1e' }], { duration: 900, easing: 'ease-out' });
      await c.wait(1800);
    },
  });
})();
} catch (e) { console.error('FYI s4-task', e); }

// ===== s5-together =====
try {
// S5 · Three phones, one playhead (05 Together). Day 19, Sat Oct 31, 7:05 PM. Rest = end = B8.
// One moment on Maya's (0), Ines's (1) and Theo's (2) phones, each drawn from its owner's view: your own messages are
// blue and on the right, everyone else's are gray under a name. A change shows first on the phone that made it, then on
// the next phone 150 ms later and on the far phone 300 ms later; on wide screens a coral packet runs along the sync line
// between them. Sync is the exception: the shared playhead lands on every phone at the same instant.
(() => {
  const V = ['m', 'i', 't'];
  const NAME = { m: 'Maya', i: 'Ines', t: 'Theo' };
  const OTHERS = { m: ['t', 'i'], i: ['t', 'm'], t: ['m', 'i'] };
  const SUB = { m: 'Theo, Ines, Kofi, You', i: 'Maya, Theo, Kofi, You', t: 'Maya, Ines, Kofi, You' };
  const LEN = 120, PH0 = 52, PH1 = 100; // a 2:00 ruler; the playhead goes from 0:52 to the bridge at 1:40
  const pct = s => (s / LEN * 100).toFixed(3) + '%';
  const mmss = s => { const r = Math.round(s); return Math.floor(r / 60) + ':' + String(r % 60).padStart(2, '0'); };
  const clk = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const svg = d => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const FLIP = svg('M3.5 8a2 2 0 0 1 2-2h2l1.5-2h6l1.5 2h2a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2zM8.7 12.4a3.3 3.3 0 0 1 5.8-2M15.3 13.1a3.3 3.3 0 0 1-5.8 2M14.8 8.6v1.9h-1.9M9.2 17.5v-1.9h1.9');
  const CUT = svg('M6.5 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6.5 20.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.8 7.7L20 17.5M8.8 16.3L20 6.5');
  const LOOP = 'M150 40C112 16 44 24 20 60C-2 94 28 140 92 146C150 152 194 122 188 86C183 58 158 38 118 33';
  const wide = () => matchMedia('(min-width: 1024px)').matches;
  const who = p => `<span class="who" style="--c:${FX.k.tint(p)}">${NAME[p]}</span>`;

  // ---- the pieces, each drawn for phone v ----
  const thread = v => { const K = FX.k; return `<div class="view t5-th">${K.wall()}<div class="a-th"><div class="a-msgs">${K.pill('Today')}${K.b('need a cover for the posters by Nov 6', { who: 'k', t: '7:02 PM' })}</div></div>${K.hd({ sub: SUB[v], tasks: 4 })}${K.comp()}<i class="t5-dim"></i></div>`; };
  const stamp = own => `<span class="t5-at">7:05 PM${own ? `<span class="rd">${FX.ic('check')}</span>` : ''}</span>`;
  const album = (v, up) => {
    const own = v === 'i';
    const covs = ['a', 'b', 'c'].map(x => `<span class="cov cov-${x}"><span class="a-lb">${x.toUpperCase()}</span>${up ? '<span class="ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14"/></svg></span>' : ''}</span>`).join('');
    return `<div class="a-b a-album t5-alb${own ? ' o' : ''} tl">${own ? '' : who('i')}<div class="t5-covs">${covs}</div>${up ? '' : stamp(own)}</div>`;
  };
  const ROWS = [['a', 'Horizon'], ['b', 'Grooves'], ['c', 'Stack']];
  const poll = v => {
    const K = FX.k, own = v === 'i';
    return `<div class="t5-pw${own ? ' o' : ''}"><div class="a-poll t5-poll${own ? ' o' : ''}">${own ? '' : who('i')}<div class="q">Which cover?<span class="pn">Poll · 0 votes</span></div>${ROWS.map(([x, n]) => `<div class="r" data-r="${x}"><i class="bar"></i>${K.cov(x)}<span class="t">${x.toUpperCase()} · ${n}</span><span class="a-stack"></span><span class="v">0</span></div>`).join('')}</div>${own ? '<div class="a-seen t5-rcpt">Delivered</div>' : ''}</div>`;
  };
  const callbar = v => { const K = FX.k, ic = FX.ic; return `<div class="a-callbar t5-cb">${ic('video')}<span class="tx">${v === 't' ? 'You started a video call' : 'Theo started a video call'}</span><span class="a-stack">${K.av('t', 's')}</span>${v === 't' ? '' : '<span class="j">Join</span>'}</div>`; };
  const tile = (p, ring) => `<div class="a-tile p-${p}${p === 't' ? ' talk' : ''}${ring ? ' t5-ring' : ''}" data-p="${p}">${FX.k.av(p)}<span class="nm">${NAME[p]}</span>${ring ? '<span class="t5-rg">Ringing</span>' : ''}</div>`;
  const call = (v, ring, tm) => {
    const K = FX.k, ic = FX.ic;
    return `<div class="view a-call t5-call"><div class="top"><div><div class="t">Copper Hours</div><div class="s t5-tm ${tm ? 'on' : 'wait'}">${tm || 'Calling'}</div></div><span class="a-notes">${K.knot()}Notes on · everyone can see</span></div>`
      + `<div class="a-tiles">${OTHERS[v].map(p => tile(p, ring.includes(p))).join('')}</div><div class="a-pip p-${v}${v === 't' ? ' talk' : ''}">${K.av(v)}</div>`
      + `<div class="a-ctl"><div class="r1"><span>${ic('cam')}</span><span>${ic('mic')}</span><span class="end">${ic('hang')}</span><span>${ic('speaker')}</span><span>${FLIP}</span></div><div class="r2"><span class="t5-shr">${ic('screen')}Sharing</span><span class="t5-syn">${ic('sync')}Sync</span></div></div></div>`;
  };
  const strip = v => `<div class="a-strip">${[...OTHERS[v], v].map(p => `<div class="a-tile p-${p}${p === 't' ? ' talk' : ''}">${FX.k.av(p)}<span class="nm">${p === v ? 'You' : NAME[p]}</span></div>`).join('')}</div>`;
  const CLIPS = [[0, 24], [25, 51], [52, 77], [78, 99], [100, 120]];
  const share = v => {
    const K = FX.k, ic = FX.ic, me = v === 't';
    return `<div class="a-share t5-sh"><div class="who">${ic('screen')}<span>${me ? 'You\'re sharing' : 'Theo is sharing'}</span><i class="t5-sp"></i><span class="sy">${me ? 'Everyone in sync' : 'Synced to Theo'}</span><span class="t5-clip">${CUT}Clip</span></div>`
      + `<div class="pv">${K.cov('b')}<span class="tc">${mmss(PH0)}</span></div>`
      + `<div class="tl"><div class="t5-mks"></div><div class="t5-ru">${[0, 30, 60, 90, 120].map(s => `<span style="left:${pct(s)}">${mmss(s)}</span>`).join('')}</div>`
      + `<div class="tr t5-v1"><span class="k">V1</span><div class="t5-trk">${CLIPS.map(([a, b]) => `<i class="cl" style="left:${pct(a)};width:calc(${pct(b - a)} - 2px)"></i>`).join('')}</div></div>`
      + `<div class="tr t5-a1"><span class="k">A1</span><i class="wf"></i></div><div class="t5-phw" style="transform:translateX(${pct(PH0)})"><i class="ph"></i></div></div></div>`;
  };
  const notes = () => {
    const K = FX.k, ic = FX.ic;
    return K.ai({ title: 'Call notes', vis: `${ic('users')}Notes were on for everyone`, cls: 't5-notes', body: `<div class="t5-meta">${ic('video')}Video call · 9 min · Maya, Ines, Theo</div><ul><li><b>Decided:</b> cover B. The arcs pulse on the snare from 1:40.</li><li><b>Next:</b> Cover art, Ines, Fri,&nbsp;Nov&nbsp;6.</li><li><b>Next:</b> Visualizer cut, Theo, Thu,&nbsp;Nov&nbsp;12.</li></ul><div class="t5-clipr"><span class="th">${K.cov('b')}${ic('play')}</span>Clip: 1:40 Bridge</div><div class="acts"><span class="a-ab">${ic('tasks')}Add to 2 tasks</span></div>` });
  };
  const here = () => `<span class="t5-here">${V.map(p => `<span class="a-av p-${p}">${NAME[p][0]}</span>`).join('')}<span>3 here now</span></span>`;

  FX.scene('together', {
    time: '7:05', rest: 7,
    html: () => V.map(thread),
    reset(stage) {
      delete stage.dataset.auto;
      stage.querySelectorAll('.trio .pk').forEach(p => p.remove());
      stage.querySelectorAll('.presence i.ping, .trio-tabs button.ping').forEach(i => i.classList.remove('ping'));
    },
    async run(c) {
      const K = FX.k, ic = FX.ic, st = c.stage, P = c.P;
      const cs = [0, 1, 2].map(j => c.on(j));
      const list = j => cs[j].q('.a-msgs');

      // page layer: Auto (below 1024px) cuts to the phone that matters; when a phone gets news, its presence glyph blinks
      // (400 ms) and its name tab shows a dot (900 ms), both on the scene clock
      const auto = j => { st.dataset.auto = String(j); st.dispatchEvent(new Event('fx:auto')); };
      const pinged = {};
      const flag = (el, key, ms) => {
        if (!el) return;
        const n = pinged[key] = (pinged[key] || 0) + 1; el.classList.add('ping');
        c.wait(ms).then(() => { if (pinged[key] === n) el.classList.remove('ping'); }, () => {});
      };
      const ping = j => {
        if (c.ff) return;
        flag(st.querySelector(`.presence i[data-p="${j}"]`), 'p' + j, 400);
        // the tab of the phone already on screen has nothing new to say
        if (String(j) !== st.dataset.show) flag(st.querySelector(`.trio-tabs button[data-v="${j}"]`), 't' + j, 900);
      };
      // a coral packet from phone a to phone j along the sync line, behind the phones, arriving after ms
      const packet = (a, j, ms) => {
        if (c.ff || !wide()) return;
        const trio = st.querySelector('.trio'), line = trio && trio.querySelector('.sync-line'); if (!line) return;
        const tr = trio.getBoundingClientRect(), lr = line.getBoundingClientRect(), A = P.devs[a].getBoundingClientRect(), B = P.devs[j].getBoundingClientRect();
        if (!A.width || !B.width) return;
        const y = lr.top + lr.height / 2 - tr.top, r = j > a;
        const x0 = (r ? A.right - 12 : A.left + 12) - tr.left, x1 = (r ? B.left + 12 : B.right - 12) - tr.left;
        const pk = document.createElement('i'); pk.className = 'pk'; pk.setAttribute('aria-hidden', 'true'); line.after(pk);
        const at = x => ({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)` });
        c.anim(pk, [at(x0), at(x1)], { duration: ms, easing: 'cubic-bezier(.45,0,.35,1)', fill: 'both' }).finished.then(() => pk.remove(), () => pk.remove());
      };
      // the playhead lands on every phone at once: the whole sync line lights for a moment
      const flash = () => {
        if (c.ff || !wide()) return;
        const line = st.querySelector('.trio .sync-line'); if (!line) return;
        c.anim(line, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(3)', offset: .18 }, { transform: 'scaleY(1)' }], { duration: 900, easing: 'ease-out' });
      };
      // a change made on phone a: packets leave, a sees it, the next phone 150 ms later, the far phone 300 ms later
      const lagOf = (a, j) => (Math.abs(a - j) === 1 ? 150 : 300);
      const spread = async (a, fn, o = {}) => {
        const lag = j => o.lag ?? lagOf(a, j);
        const rest = [0, 1, 2].filter(j => j !== a).sort((x, y) => lag(x) - lag(y));
        let tp = null;
        // the tap runs alongside; mark it handled now, so a jump that cancels the wait below leaves no stray rejection
        if (o.tap) { tp = cs[a].tap(o.tap, o.tapo); tp.catch(() => {}); if (!c.ff) await c.wait(140); }
        const pre = o.pre ?? 300;
        rest.forEach(j => packet(a, j, o.pk ?? pre + lag(j)));
        if (pre && !c.ff) await c.wait(pre);
        fn(a, cs[a], true);
        let t = 0;
        for (const j of rest) { if (!c.ff && lag(j) > t) await c.wait(lag(j) - t); t = lag(j); fn(j, cs[j], false); ping(j); }
        if (tp) await tp;
      };

      // the call clock ticks on the scene clock, so it holds while paused. Each later beat is later in the 9-minute call:
      // while playing, the timer rolls forward to that beat's time and ticks on; a jump sets it there at once
      let tick = 0, ticking = false, secs = 0;
      const setClock = s => { secs = s; cs.forEach(cj => cj.qa('.t5-tm.on').forEach(e => { e.textContent = clk(s); })); };
      const tickOn = my => (async () => { try { for (;;) { await c.wait(1000); if (my !== tick) return; setClock(secs + 1); } } catch (e) { /* the scene was reset */ } })();
      const clock = s => {
        const my = ++tick;
        if (c.ff || !ticking || s <= secs) { setClock(s); ticking = !c.ff; if (ticking) tickOn(my); return; }
        const a = secs;
        (async () => { try {
          for (let i = 1; i <= 12; i++) { await c.wait(40); if (my !== tick) return; setClock(Math.round(a + (s - a) * (1 - Math.pow(1 - i / 12, 3)))); }
          tickOn(my);
        } catch (e) { /* the scene was reset */ } })();
      };
      const stopClock = () => { tick++; ticking = false; };

      // views: the call pushes in over the thread, and slides away again when it ends
      const openCall = (j, ring) => {
        const cj = cs[j], th = cj.q('.t5-th');
        const cv = cj.add(cj.app, call(V[j], ring, ring.length === 2 ? '' : clk(secs)), 'none');
        cj.anim(cv, [{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 420 });
        cj.anim(th, [{ transform: 'none' }, { transform: 'translateX(-30%)' }], { duration: 420 });
        cj.anim(cj.q('.t5-dim'), [{ opacity: 0 }, { opacity: .4 }], { duration: 420 });
      };
      const closeCall = j => {
        const cj = cs[j], th = cj.q('.t5-th'), cv = cj.q('.t5-call'); if (!cv) return;
        const bar = cj.q('.t5-cb'); if (bar) bar.replaceWith(c.make(K.sys(`${ic('video')}Video call ended · 9 min`)));
        if (c.ff) { cv.remove(); return; }
        cj.anim(cv, [{ transform: 'none' }, { transform: 'translateX(100%)' }], { duration: 420, fill: 'forwards' }).finished.then(() => cv.remove(), () => {});
        cj.anim(th, [{ transform: 'translateX(-30%)' }, { transform: 'none' }], { duration: 420 });
        cj.anim(cj.q('.t5-dim'), [{ opacity: .4 }, { opacity: 0 }], { duration: 420 });
      };
      // someone answers: their tile wakes up on this phone (and the clock starts on Theo's when Maya joins)
      const joined = (j, p) => {
        const cj = cs[j], tl = cj.q(`.t5-call .a-tile[data-p="${p}"]`); if (!tl) return;
        tl.classList.remove('t5-ring');
        const rg = tl.querySelector('.t5-rg'); if (rg) rg.remove();
        cj.anim(tl.querySelector('.a-av'), [{ transform: 'scale(.82)', opacity: .55 }, { transform: 'none', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.34,1.4,.5,1)' });
        const w = cj.q('.t5-tm.wait'); if (w) { w.classList.replace('wait', 'on'); w.textContent = clk(secs); }
      };
      const vote = (j, p) => {
        const cj = cs[j], pl = cj.q('.t5-poll'), r = pl.querySelector('[data-r="b"]'), bar = r.querySelector('.bar'), stk = r.querySelector('.a-stack');
        const n = stk.children.length + 1;
        if (p === V[j]) r.classList.add('mine');
        bar.style.transform = `scaleX(${n / 4})`;
        cj.anim(bar, [{ transform: `scaleX(${(n - 1) / 4})` }, { transform: `scaleX(${n / 4})` }], { duration: 520 });
        cj.add(stk, K.av(p, 's'), 'pop');
        const v = r.querySelector('.v'); v.textContent = n;
        cj.anim(v, [{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 300 });
        pl.querySelector('.pn').textContent = `Poll · ${n} vote${n > 1 ? 's' : ''}`;
        if (p === V[j]) cj.add(r, `<span class="t5-ck">${ic('check')}</span>`, 'pop');
      };
      // read receipts on Ines's phone: the line under the poll names who has read it (one line height, so nothing shifts)
      const receipt = (ps, txt) => {
        const rc = cs[1].q('.t5-rcpt'); if (!rc) return;
        const rd = c.make(K.seen(ps, txt)); rd.classList.add('t5-rcpt'); rc.replaceWith(rd);
        cs[1].enter(rd, 'fade', { d: 300 });
      };
      const readTick = el => { if (el) { el.innerHTML = ic('dcheck'); el.classList.add('all'); } };

      // sharing: each person's tile flies to its slot in the strip (transform only; nothing fades), the strip takes over in
      // the same place by a cut, and the edit rises from below into the room the tiles leave
      const SH_EASE = 'cubic-bezier(.4,0,.2,1)', GREEN = '#30d158';
      const L = (a, b, p) => a + (b - a) * p;
      // a non-uniform FLIP of the tile's box, with the monogram and the name label counter-scaled so they stay round and
      // readable, and the corners and the green talk ring kept at their drawn size the whole way
      const fly = (cj, el, dst, box, ms) => {
        const T = box(el), S = box(dst), pip = el.classList.contains('a-pip'), talk = el.classList.contains('talk');
        const av = el.querySelector('.a-av'), A0 = box(av), A1 = box(dst.querySelector('.a-av'));
        // the picture-in-picture has no name yet: "You" slides in from its right edge, clipped by the box as it widens
        const nm = el.querySelector('.nm') || (pip ? cj.add(el, '<span class="nm t5-you">You</span>', 'none') : null), dn = dst.querySelector('.nm');
        const N0 = nm && dn ? box(nm) : null, N1 = N0 ? box(dn) : null;
        const n0x = N0 && pip ? T.x + T.w + 2 + N0.w / 2 : N0 && N0.x + N0.w / 2, n0y = N0 && pip ? T.y + T.h / 2 : N0 && N0.y + N0.h / 2;
        const r0 = pip ? 14 : 20, r1 = 14, fb = [], fa = [], fn = [];
        // a child of the box: centered at (X, Y) in the call, w x h on screen, while the box is at b and scaled sx, sy
        const kid = (C, X, Y, w, h, b, sx, sy) => {
          const cx = C.x + C.w / 2 - T.x, cy = C.y + C.h / 2 - T.y;
          return `translate(${((X - b.x) / sx - cx).toFixed(2)}px, ${((Y - b.y) / sy - cy).toFixed(2)}px) scale(${(w / (C.w * sx)).toFixed(4)}, ${(h / (C.h * sy)).toFixed(4)})`;
        };
        for (let i = 0; i <= 10; i++) {
          const p = i / 10, b = { x: L(T.x, S.x, p), y: L(T.y, S.y, p), w: L(T.w, S.w, p), h: L(T.h, S.h, p) };
          const sx = b.w / T.w, sy = b.h / T.h, r = L(r0, r1, p), rw = L(3, 2.5, p);
          const f = { transform: `translate(${(b.x - T.x).toFixed(2)}px, ${(b.y - T.y).toFixed(2)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`, borderRadius: `${(r / sx).toFixed(2)}px / ${(r / sy).toFixed(2)}px` };
          // the talk ring as four inset bands, each as thick on screen as the ring is drawn
          const lx = (rw / sx).toFixed(2), ly = (rw / sy).toFixed(2);
          const ring = talk ? [`inset ${lx}px 0 0 0 ${GREEN}`, `inset -${lx}px 0 0 0 ${GREEN}`, `inset 0 ${ly}px 0 0 ${GREEN}`, `inset 0 -${ly}px 0 0 ${GREEN}`] : [];
          if (pip) f.boxShadow = [...ring, `0 10px 24px rgba(0,0,0,${(.6 * (1 - p)).toFixed(3)})`, ...(talk ? [] : [`0 0 0 1px rgba(255,255,255,${(.08 * (1 - p)).toFixed(3)})`])].join(', ');
          else if (talk) f.boxShadow = ring.join(', ');
          fb.push(f);
          const aw = L(A0.w, A1.w, p);
          fa.push({ transform: kid(A0, L(A0.x + A0.w / 2, A1.x + A1.w / 2, p), L(A0.y + A0.h / 2, A1.y + A1.h / 2, p), aw, aw, b, sx, sy) });
          // the name keeps its size and lands where the strip prints it (the label's padding is 8 by 3)
          if (N0) fn.push({ transform: kid(N0, L(n0x, N1.x - 8 + N0.w / 2, p), L(n0y, N1.y - 3 + N0.h / 2, p), N0.w, N0.h, b, sx, sy), backgroundColor: `rgba(0,0,0,${(.6 * (1 - p)).toFixed(3)})` });
        }
        el.style.transformOrigin = '0 0';
        const o = { duration: ms, easing: SH_EASE, fill: 'forwards' };
        if (N0) cj.anim(nm, fn, o);
        cj.anim(av, fa, o);
        return cj.anim(el, fb, o);
      };
      const shareOn = (j, me) => {
        const cj = cs[j], cv = cj.q('.t5-call'), tiles = cv.querySelector('.a-tiles'), pip = cv.querySelector('.a-pip');
        if (me) cv.querySelector('.t5-shr').classList.add('on');
        const s1 = c.make(strip(V[j])), s2 = c.make(share(V[j]));
        const o = cv.getBoundingClientRect();
        // a jump, or a phone not on screen (below 1024px only one shows): the strip and the edit are simply there
        if (c.ff || !o.width) { tiles.remove(); pip.remove(); cv.append(s1, s2); return; }
        s1.style.visibility = 'hidden'; cv.append(s1, s2); // laid out now, so each tile knows where it lands
        const k = o.width / 390;
        const box = el => { const r = el.getBoundingClientRect(); return { x: (r.left - o.left) / k, y: (r.top - o.top) / k, w: r.width / k, h: r.height / k }; };
        const slots = [...s1.children], tl = [...tiles.children];
        tiles.style.zIndex = 5; // above the rising edit
        // the upper tile clears the way a little sooner, so the lower one never runs over it
        fly(cj, tl[0], slots[0], box, 240); fly(cj, pip, slots[2], box, 300);
        const last = fly(cj, tl[1], slots[1], box, 300);
        // the edit's top edge follows the lower tile up; it is revealed from its own bottom edge as it climbs
        const H = box(s2).h;
        cj.anim(s2, [{ transform: `translateY(${H.toFixed(1)}px)`, clipPath: `inset(0px 0px ${H.toFixed(1)}px 0px)` }, { transform: 'translateY(0px)', clipPath: 'inset(0px 0px 0px 0px)' }], { duration: 300, easing: SH_EASE, fill: 'backwards' });
        last.finished.then(() => { tiles.remove(); pip.remove(); s1.style.visibility = ''; }, () => {});
      };
      const syncOn = (j, me) => {
        const cj = cs[j], sh = cj.q('.t5-sh');
        if (me) cj.q('.t5-syn').classList.add('on');
        sh.classList.add('synced');
        cj.enter(sh.querySelector('.sy'), 'left', { d: 320 });
      };
      // Sync: every playhead moves together, and the timecode counts with it
      const scrub = () => {
        const ease = 'cubic-bezier(.33,1,.68,1)'; // the same curve as the counter
        cs.forEach(cj => { const p = cj.q('.t5-phw'); p.style.transform = `translateX(${pct(PH1)})`; cj.anim(p, [{ transform: `translateX(${pct(PH0)})` }, { transform: `translateX(${pct(PH1)})` }], { duration: 760, easing: ease }); });
        return Promise.all(cs.map(cj => cj.count(cj.q('.t5-sh .tc'), PH0, PH1, 760, mmss)));
      };
      const land = () => cs.forEach((cj, j) => {
        const mk = cj.add(cj.q('.t5-mks'), `<span class="mk" style="left:${pct(PH1)}">Bridge</span>`, 'none');
        cj.anim(mk, [{ transform: 'translateX(-50%) translateY(5px) scale(.7)', opacity: 0 }, { transform: 'translateX(-50%)', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.34,1.4,.5,1)' });
        cj.anim(cj.q('.t5-sh .pv .cov'), [{ transform: 'none' }, { transform: 'scale(1.06)', offset: .22 }, { transform: 'none', offset: .5 }, { transform: 'scale(1.035)', offset: .7 }, { transform: 'none' }], { duration: 1000, easing: 'ease-out' });
        cj.add(cj.q('.t5-sh .pv'), `<div class="a-cap"><b>${j === 2 ? 'You' : 'Theo'}:</b> watch the arcs hit the snare right here</div>`, 'up', { delay: 260, d: 380 });
      });
      // Ines circles the arcs; on Ines's phone a fingertip draws it
      const circle = (j, me) => {
        const cj = cs[j], pv = cj.q('.t5-sh .pv');
        const el = cj.add(pv, `<svg class="a-circle t5-circ" viewBox="0 0 200 160" aria-hidden="true"><path pathLength="1" d="${LOOP}"/></svg>`, 'none');
        const path = el.querySelector('path'), o = { duration: 900, easing: 'cubic-bezier(.45,.05,.45,1)' };
        cj.anim(path, [{ strokeDashoffset: 1.1 }, { strokeDashoffset: 0 }], { ...o, fill: 'backwards' });
        if (!me || c.ff) return;
        const t = P.touches[j], s = P.screens[j].getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / 390;
        if (!k) return;
        const L = path.getTotalLength(), pts = Array.from({ length: 21 }, (_, i) => path.getPointAtLength(L * i / 20));
        const ox = (r.left - s.left) / k, oy = (r.top - s.top) / k;
        t.style.left = (ox + pts[0].x) + 'px'; t.style.top = (oy + pts[0].y) + 'px';
        cj.anim(t, pts.map((p, i) => ({ transform: `translate(calc(-50% + ${(p.x - pts[0].x).toFixed(1)}px), calc(-50% + ${(p.y - pts[0].y).toFixed(1)}px)) scale(.8)`, opacity: i === 0 || i === 20 ? 0 : 1 })), o);
      };

      // B1 · Ines posts three covers: an upload on Ines's phone, an album under "Ines" on the other two
      await c.beat(0); auto(1);
      await c.wait(400);
      const mine = await cs[1].push(list(1), album('i', true));
      mine.querySelectorAll('.ring circle').forEach((r, k) => cs[1].anim(r, [{ strokeDashoffset: 88 }, { strokeDashoffset: 0 }], { duration: 900, delay: k * 90, easing: 'cubic-bezier(.4,.1,.3,1)', fill: 'both' }));
      await c.wait(820);
      await spread(1, (j, cj, me) => {
        if (!me) { cj.push(list(j), album(V[j])); return; }
        mine.querySelectorAll('.ring').forEach(r => cj.leave(r, 'fade', { d: 220 }));
        cj.enter(cj.add(mine, stamp(true), 'none'), 'fade', { d: 260 });
      });
      await c.wait(900);

      // B2 · Ines asks; Maya votes B, then Theo; the same bar fills on every phone
      await c.beat(1); auto(0);
      await c.wait(300);
      await spread(1, (j, cj) => cj.push(list(j), poll(V[j])));
      await c.wait(650);
      // a vote is also a read: on Ines's phone the receipt under the poll names each voter as the vote lands
      await spread(0, j => { vote(j, 'm'); if (j === 1) { receipt('m', 'Read by Maya'); readTick(cs[1].q('.t5-alb .rd')); } }, { tap: cs[0].q('.t5-poll [data-r="b"]'), tapo: { press: .98 } });
      await c.wait(420);
      await spread(2, j => { vote(j, 't'); if (j === 1) receipt('mt', 'Read by Maya and Theo'); }, { tap: cs[2].q('.t5-poll [data-r="b"]'), tapo: { press: .98 } });
      await c.wait(850);

      // B3 · Theo answers and starts a call; Maya and Ines join. Theo's message lands at 7:06, and every clock moves with it
      await c.beat(2); auto(2);
      await c.wait(300);
      await spread(2, (j, cj, me) => { cj.push(list(j), K.b('B. I cut the bridge to it. call?', me ? { o: 1, t: '7:06 PM', rd: 1 } : { who: 't', t: '7:06 PM' })); cj.time('7:06'); });
      await c.wait(500);
      await spread(2, (j, cj, me) => { cj.push(list(j), callbar(V[j])); if (me) openCall(2, ['m', 'i']); }, { tap: cs[2].q('.a-nav .acts svg:last-child'), tapo: { press: .86 } });
      await c.wait(500);
      await spread(0, (j, cj, me) => {
        if (me) { setClock(0); openCall(0, ['i']); clock(0); }
        else if (j === 1) cj.add(cj.q('.t5-cb .a-stack'), K.av('m', 's'), 'pop');
        else { joined(2, 'm'); readTick(cj.q('.a-b.o .rd')); } // Maya answered right under Theo's message: it was read
      }, { tap: cs[0].q('.t5-cb .j') });
      await c.wait(350);
      await spread(1, (j, cj, me) => { if (me) openCall(1, []); else joined(j, 'i'); }, { tap: cs[1].q('.t5-cb .j') });
      await c.wait(750);

      // B4 · Theo shares the cut: the tiles shrink to a strip and the edit fills the call on every phone
      await c.beat(3); auto(1); clock(184); cs.forEach(cj => cj.time('7:09')); // 03:04 into the call
      await c.wait(400);
      await spread(2, (j, cj, me) => shareOn(j, me), { tap: cs[2].q('.t5-shr'), tapo: { press: .94 } });
      await c.wait(1100);

      // B5 · Sync on, then Theo jumps to the bridge: one playhead, every phone lands on 1:40 at once
      await c.beat(4); auto(0); clock(371); cs.forEach(cj => cj.time('7:12')); // 06:11
      await c.wait(350);
      await spread(2, (j, cj, me) => syncOn(j, me), { tap: cs[2].q('.t5-syn'), tapo: { press: .94 } });
      await c.wait(550);
      const jump = cs[2].tap(cs[2].q('.t5-v1 .t5-trk'), { x: PH1 / LEN, y: .5, noPress: true });
      jump.catch(() => {});
      if (!c.ff) await c.wait(160);
      packet(2, 1, 420); packet(2, 0, 420);
      if (!c.ff) await c.wait(420);
      [0, 1].forEach(ping); flash();
      await Promise.all([scrub(), jump]);
      land();
      await c.wait(1200);

      // B6 · Ines circles the arcs (the others see it 120 ms later); Maya clips the moment, on Maya's phone only
      await c.beat(5); auto(1); clock(512); cs.forEach(cj => cj.time('7:14')); // 08:32, so the 9-minute call ends at B7
      await c.wait(350);
      await spread(1, (j, cj, me) => circle(j, me), { pre: 0, lag: 120, pk: 420 });
      await c.wait(1000);
      await cs[0].tap(cs[0].q('.t5-clip'));
      const toast = cs[0].add(cs[0].q('.t5-call'), `<div class="a-toast t5-toast">${ic('check')}Clip saved · 1:40 Bridge</div>`, 'none');
      cs[0].anim(toast, [{ transform: 'translateX(-50%) translateY(-10px) scale(.96)', opacity: 0 }, { transform: 'translateX(-50%)', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.34,1.4,.5,1)' });
      await c.wait(1100);

      // B7 · Theo ends the call; every phone is back in the thread, where the notes post for everyone at once
      await c.beat(6); auto(0); stopClock();
      await c.wait(300);
      await spread(2, (j, cj) => { closeCall(j); cj.time('7:15'); }, { tap: cs[2].q('.a-ctl .end'), tapo: { press: .88 } });
      await c.wait(500);
      const cards = await Promise.all(cs.map((cj, j) => cj.push(list(j), notes(), 'up', { d: 520 })));
      cards.forEach((el, j) => {
        const kn = el.querySelector('.knot'); if (!c.ff) kn.classList.add('think');
        [...el.querySelectorAll('.t5-meta, li, .t5-clipr, .acts')].forEach((x, k) => cs[j].enter(x, 'up', { delay: 420 + k * 130, d: 380 }));
      });
      await c.wait(420);
      cards.forEach(el => el.querySelector('.knot').classList.remove('think'));
      await c.wait(6 * 130 + 1100);

      // B8 · Who is here and who has read it are two things: three are here now, and on Ines's phone the poll shows it has
      // now been read by everyone in the group, Kofi too, who asked for the cover and is not on the call
      await c.beat(7); auto(1);
      await c.wait(400);
      cs.forEach((cj, j) => {
        const sub = cj.q('.a-nav .sub'); sub.classList.add('live'); sub.innerHTML = here();
        cj.enter(sub.firstElementChild, 'fade', { d: 320 }); ping(j);
      });
      await c.wait(1000);
      receipt('mtk', 'Read by everyone');
      ping(1);
      await c.wait(1300);
    },
  });
})();
} catch (e) { console.error('FYI s5-together', e); }

// ===== s6-launch =====
try {
// S6 · Launch night (06 Launch). Day 24, 6:10 PM, then Day 39, 8:58 PM. Rest = B6 (index 5), end = B7.
// The event is drafted from Kofi's message, posted, promoted, and at B5 the ticket walks out of the phone into three
// promo formats on the page. Try it (poster style, doors) is one small state object that every run applies, so it
// survives seeks and replays: the phone and the formats are views of one event.
(() => {
  const FMT = ['story', 'post', 'link'];
  // the event as the reader has left it: poster style, doors time, and which formats still show the old time
  const S = { ps: 'splash', doors: '9 PM', stale: { story: false, post: false, link: false } };
  const moved = () => S.doors !== '9 PM';
  const clock = () => (moved() ? '9:5' : '8:5'); // B7 runs up to doors minus 2 minutes
  const B7 = () => `On Day 39, launch night goes live at ${clock()}8 PM, before doors.`;
  // side by side (1200px and up) the formats land from the phone at B5; stacked, they sit below the phone from the start
  const WIDE = matchMedia('(min-width: 1200px)');
  const wide = () => WIDE.matches;
  const nb = t => t.replace(' ', ' '); // a time never splits across lines
  const kind = f => FMT.find(k => f.classList.contains('f-' + k));

  // ---------- page layer: Try it, the formats, the rail line for B7 (idempotent, safe to call any time) ----------
  function paint(stage) {
    stage.dataset.ps = S.ps;
    stage.querySelectorAll('.seg button[data-ps]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.ps === S.ps)));
    const db = stage.querySelector('.tryit .doors');
    if (db) { db.toggleAttribute('data-on', moved()); db.textContent = moved() ? 'Reset to 9 PM' : 'Move doors to 10 PM'; }
    let any = false;
    stage.querySelectorAll('.fmts .fmt').forEach(f => {
      const k = kind(f), old = moved() && S.stale[k];
      if (old) any = true;
      f.querySelectorAll('[data-bind="doors"]').forEach(s => { s.textContent = old ? '9 PM' : S.doors; });
      const bar = f.querySelector('.stale'); if (bar) bar.hidden = !old;
    });
    const rfa = stage.querySelector('.tryit .rfa'); if (rfa) rfa.hidden = !any;
    const last = stage.querySelector('.fx-beats > li:last-child .l'); if (last) last.textContent = B7();
  }
  const player = () => { const r = document.querySelector('[data-scene="launch"]'); return r && r._fx; };
  // any Try-it control first brings the phone to B6 and holds it there, so the ticket is in view
  const seek = () => { const p = player(); if (!p) return; p.seen = true; if (p.stopStep) p.stopStep(); p.run(5, true); };
  const flash = spans => { spans.forEach(s => s.classList.add('flash')); setTimeout(() => spans.forEach(s => s.classList.remove('flash')), 300); };
  function bind(stage) {
    if (stage._l6) return; stage._l6 = true;
    stage.querySelectorAll('.seg button[data-ps]').forEach(b => b.addEventListener('click', () => { S.ps = b.dataset.ps; paint(stage); seek(); }));
    const db = stage.querySelector('.tryit .doors');
    if (db) db.addEventListener('click', () => {
      if (moved()) { S.doors = '9 PM'; FMT.forEach(k => { S.stale[k] = false; }); } else { S.doors = '10 PM'; FMT.forEach(k => { S.stale[k] = true; }); }
      paint(stage); seek();
    });
    const refresh = ks => {
      const fs = [...stage.querySelectorAll('.fmts .fmt')].filter(f => ks.includes(kind(f)) && S.stale[kind(f)]);
      const had = document.activeElement;
      fs.forEach(f => { S.stale[kind(f)] = false; });
      paint(stage); seek();
      flash(fs.flatMap(f => [...f.querySelectorAll('[data-bind="doors"]')]));
      // the pressed button hides itself: keep keyboard focus on the next thing to do
      // (a frame later: the seek has just reset the stage, and the target must be rendered to take focus)
      if (had && had.closest && had.closest('[hidden]')) requestAnimationFrame(() => { const nx = stage.querySelector('.fmt .stale:not([hidden]) .rf') || stage.querySelector('.tryit .doors'); if (nx) nx.focus(); });
    };
    stage.querySelectorAll('.fmts .fmt').forEach(f => { const b = f.querySelector('.rf'); if (b) b.addEventListener('click', () => refresh([kind(f)])); });
    const rfa = stage.querySelector('.tryit .rfa'); if (rfa) rfa.addEventListener('click', () => refresh(FMT));
  }

  // ---------- the app's pieces for this scene ----------
  const sp = () => FX.k.spark();
  const ticket = () => { const K = FX.k, ic = FX.ic; return `<div class="a-tk l6-tk">${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Fri · Doors <span data-bind="doors">9&nbsp;PM</span></div><div class="pl">Dock Hall 3</div></div></div><div class="l6-rv"><span class="a-go">${ic('check')}Going</span><span class="a-may">Maybe</span><span class="cnt"><span class="a-stack">${K.av('m', 's')}</span><span class="l6-n">Going · <b class="gn">1</b></span></span></div></div>`; };
  const fld = (k, v, o = {}) => `<div class="a-fld l6-wait${o.cls ? ' ' + o.cls : ''}"${o.ai ? ' data-ai' : ''}>${o.pre || ''}<div class="l6-fv"><div class="k">${k}${o.ai ? `<span class="sg">${sp()}${o.ai}</span>` : ''}</div><div class="v">${v}</div></div></div>`;
  const evSheet = () => {
    const K = FX.k, ic = FX.ic;
    const seg = ['Splash', 'Ink', 'Paper'].map(s => `<span${s.toLowerCase() === S.ps ? ' class="on"' : ''}>${s}</span>`).join('');
    return `<div class="a-sheet l6-sh l6-ev"><div class="grab"></div><div class="sh"><h4>New event</h4><span class="x">${ic('x')}</span></div>`
      + `<div class="a-banner">${K.knot('think')}<span>Drafted from this chat · check before you publish</span></div>`
      + fld('Cover', 'Cover B · Grooves', { ai: 'From the Cover art task', cls: 'l6-cov', pre: '<span class="ps l6-th"><i class="arcs"></i></span>' })
      + fld('Title', 'Copper Hours: Launch Night', { ai: 'suggested' })
      + fld('When', 'Fri, Nov 20 · Doors 9 PM', { ai: 'from message' })
      + `<div class="a-two">${fld('Where', 'Dock Hall 3', { ai: 'from message' })}${fld('Hosts', K.stack('mtik', 's'), { ai: 'suggested' })}</div>`
      + fld('About', 'Live set and visualizer premiere', { ai: 'suggested' })
      + fld('Spots', '200 · RSVP required')
      + `<div class="l6-pst l6-wait"><span>Poster style</span><div class="a-segc">${seg}</div></div>`
      + `<div class="a-btn l6-post">Post to group</div></div>`;
  };
  const prSheet = () => {
    const ic = FX.ic;
    const row = (th, t, s) => `<div class="l6-row">${th}<div class="l6-tx"><div class="t">${t}</div>${s ? `<div class="s">${s}</div>` : ''}</div><span class="a-chk">${ic('check')}</span></div>`;
    return `<div class="a-sheet l6-sh l6-pr"><div class="grab"></div><div class="sh"><h4>Promote</h4><span class="x">${ic('x')}</span></div>`
      + `<div class="l6-card"><div class="l6-row l6-pub"><span class="l6-ic">${ic('globe')}</span><div class="l6-tx"><div class="t">Public event page</div><div class="s">Only the group can see it</div></div><span class="l6-sw"><i></i></span></div>`
      + `<div class="l6-row l6-link"><span class="l6-ic">${ic('link')}</span><div class="l6-tx"><div class="t">fyi/e/copper-hours</div></div><span class="cp">Copy</span></div></div>`
      + `<div class="l6-lbl">Formats</div><div class="l6-card l6-fm">`
      + row('<span class="l6-ft s9"><span class="ps"><i class="arcs"></i></span></span>', 'Story 9:16', 'For stories')
      + row('<span class="l6-ft s1"><span class="ps"><i class="arcs"></i></span></span>', 'Square post', 'For feeds')
      + row('<span class="l6-ft lp"><i></i><span class="ps"><i class="arcs"></i></span></span>', 'Link page', 'fyi/e/copper-hours')
      + `</div><div class="a-btn l6-make">Make 3 formats</div></div>`;
  };
  const rsvp = (p, html) => `<div class="l6-rs">${FX.k.av(p, 's')}<span>${html}</span></div>`;
  const skip = t => `<div class="a-pill l6-skip">${t}</div>`;

  // a time-skip pill flips in at the top of the new stretch of thread
  async function flip(c, list, t) {
    const el = await c.push(list, skip(t), 'none');
    c.anim(el, [{ opacity: 0, transform: 'perspective(320px) rotateX(-88deg)' }, { opacity: 1, transform: 'none' }], { duration: 460, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    return el;
  }
  async function openSheet(c, html) {
    const dim = c.add(c.app, '<div class="a-dim l6-dim"></div>', 'fade', { d: 260 });
    const sh = c.add(c.app, html, 'rise', { d: 360 });
    await c.wait(380);
    return [dim, sh];
  }
  function closeSheet(c, [dim, sh]) { c.leave(sh, 'sink', { d: 320 }); c.leave(dim, 'fade', { d: 280 }); return c.wait(300); }

  // B6's doors: messages are history (Kofi's line never changes); the ticket is a view, so it follows the event
  function doorsInPhone(c, list) {
    if (!moved()) return;
    c.qa('[data-bind="doors"]').forEach(s => { s.textContent = nb(S.doors); });
    const inf = c.q('.l6-tk .inf');
    if (inf && !inf.querySelector('.a-up')) c.add(inf, `<div class="a-up">Updated · Doors <s>9&nbsp;PM</s> ${nb(S.doors)}</div>`, 'fade', { d: 260 });
    c.push(list, FX.k.sys(`<b>You</b> moved doors to ${nb(S.doors)} · 27 people notified`), 'up');
  }

  // ---------- B5: the ticket walks out of the phone and lands as three formats on the page ----------
  // Each flyer is a copy of the real format, so nothing changes when it lands. It starts small behind the phone (the
  // phone sits above it), slides out past the phone's edge and grows into its slot, turning to the slot's angle.
  async function breakout(c, tk) {
    const stage = c.stage, fmts = [...stage.querySelectorAll('.fmts .fmt')];
    stage._l6land = true; // from here on the formats belong on the page, whatever the width does next
    if (c.ff || !fmts.length) { stage.dataset.out = '1'; return; }
    if (!wide()) { // stacked: the formats already sit below the phone, so their bound fields flash as the event makes them
      stage.dataset.out = '1';
      fmts.forEach((f, i) => f.querySelectorAll('[data-bind]').forEach(s => c.anim(s, [
        { backgroundColor: 'rgba(52,209,191,0)' }, { backgroundColor: 'rgba(52,209,191,.35)', offset: .2 },
        { backgroundColor: 'rgba(52,209,191,.35)', offset: .6 }, { backgroundColor: 'rgba(52,209,191,0)' },
      ], { duration: 1000, delay: i * 120, easing: 'ease-in-out' })));
      return;
    }
    const sr = stage.getBoundingClientRect(), ox = sr.left + stage.clientLeft, oy = sr.top + stage.clientTop;
    const dv = c.P.devs[0].getBoundingClientRect(), tr = tk.getBoundingClientRect();
    const dl = dv.left - ox, dt = dv.top - oy, dw = dv.width, dh = dv.height;
    const flies = fmts.map((f, i) => {
      const box = f.querySelector('.fm'), fr = f.getBoundingClientRect(), w = box.offsetWidth, h = box.offsetHeight;
      // the slot's own layout box (offsets ignore the format's tilt), and the tilt it lands at
      const x1 = fr.left - ox + box.offsetLeft + w / 2, y1 = fr.top - oy + box.offsetTop + h / 2;
      const cs = getComputedStyle(box), rot = cs.rotate === 'none' ? '0deg' : cs.rotate, tl = cs.translate === 'none' ? '0px 0px' : cs.translate;
      // start: small enough to hide behind the phone, centered on the ticket
      const s0 = Math.min(.6, dw * .7 / w, dh * .42 / h);
      const x0 = dl + dw / 2, y0 = Math.min(Math.max(tr.top - oy + tr.height / 2, dt + h * s0 / 2 + 12), dt + dh - h * s0 / 2 - 12);
      const fly = c.make(`<div class="fmt fx-vars l6-fly ${[...f.classList].filter(k => k !== 'fmt' && k !== 'l6-in').join(' ')}" aria-hidden="true" style="z-index:${fmts.length - i}"></div>`); // the far formats pass under the near ones
      const fm = box.cloneNode(true); fly.append(fm);
      stage.append(fly);
      const at = (x, y, sc) => `translate(${(x - w * sc / 2).toFixed(2)}px, ${(y - h * sc / 2).toFixed(2)}px) scale(${sc.toFixed(4)})`;
      const d = { duration: 940, delay: i * 120, easing: 'linear', fill: 'both' };
      const out = .34, e1 = 'cubic-bezier(.4,0,.6,1)', e2 = 'cubic-bezier(.2,.7,.2,1)';
      const xm = dl + dw + (x1 - (dl + dw)) * .18, ym = Math.min(y0, y1) - 26, sm = s0 + (1 - s0) * .45;
      c.anim(fly, [
        { transform: at(x0, y0, s0), easing: e1 },
        { transform: at(xm, ym, sm), offset: out, easing: e2 },
        { transform: at(x1, y1, 1) },
      ], d);
      c.anim(fm, [{ rotate: '0deg', translate: '0px 0px', easing: e1 }, { rotate: '0deg', translate: '0px 0px', offset: out, easing: e2 }, { rotate: rot, translate: tl }], d);
      return { f, fly };
    });
    // the ticket in the phone gives a small press as the copies leave it
    c.anim(tk, [{ transform: 'none' }, { transform: 'scale(.97)', offset: .3 }, { transform: 'none' }], { duration: 520 });
    for (let i = 0; i < flies.length; i++) {
      await c.wait(i ? 120 : 940);
      const { f, fly } = flies[i];
      f.classList.add('l6-in'); // the real format shows in the same frame its copy goes: the two are identical
      fly.remove(); // (a no-op if the page went narrow mid-flight and the copies were cleared)
    }
    stage.dataset.out = '1';
  }

  FX.scene('launch', {
    time: '6:10', rest: 5,
    // the formats on the page go dark with the phone when the scene restarts
    dip: stage => (wide() && stage.dataset.out ? [...stage.querySelectorAll('.fmts .fm')] : []),
    html: () => {
      const K = FX.k;
      return `${K.wall()}<div class="a-th"><div class="a-msgs">${K.pill('Sat, Oct 31')}${K.b('need a cover for the posters by Nov 6', { who: 'k', t: '7:02 PM' })}<div class="a-b a-album tl l6-alb"><span class="who" style="--c:${K.tint('i')}">Ines</span>${K.cov('a')}${K.cov('b')}${K.cov('c')}</div>${K.b('B. I cut the bridge to it. call?', { who: 't', t: '7:06 PM' })}${K.sys(`${FX.ic('video')}Video call ended · 9 min`)}${K.ai({ title: 'Call notes', vis: FX.ic('users') + 'Notes were on for everyone' })}</div></div>${K.hd({ tasks: 4 })}${K.comp()}`;
    },
    reset(stage) {
      stage._l6land = false;
      stage.querySelectorAll('.l6-fly').forEach(e => e.remove());
      stage.querySelectorAll('.fmt.l6-in').forEach(e => e.classList.remove('l6-in'));
      if (wide()) stage.removeAttribute('data-out'); else stage.dataset.out = '1';
      bind(stage); paint(stage);
    },
    async run(c) {
      const K = FX.k, ic = FX.ic, list = c.q('.a-msgs'), sub = c.q('.a-nav .sub');
      if (!wide()) c.stage.dataset.out = '1'; // stacked: the formats are on the page from the start

      // B1: Day 24. Kofi signs the room; FYI AI offers an event, once
      await c.beat(0);
      await c.wait(260);
      await flip(c, list, 'Day 24 · Thu, Nov 5');
      await c.wait(380);
      await c.push(list, K.b('Dock Hall 3 signed. Fri Nov 20, doors at 9', { who: 'k', t: '6:10 PM' }));
      await c.wait(480);
      const sug = await c.push(list, K.sug('Make this an event?', 'Draft event'), 'up');
      sug.classList.add('l6-sug');
      await c.wait(620);

      // B2: the draft sheet; FYI AI fills it from the chat, a host checks it
      await c.beat(1);
      await c.tap(sug.querySelector('.go'));
      const ev = await openSheet(c, evSheet());
      const flds = [...ev[1].querySelectorAll('.a-fld, .l6-pst')]; // the values arrive empty and fill in, one by one
      await c.wait(120);
      for (const f of flds) {
        f.classList.remove('l6-wait');
        const v = f.querySelector('.v, .a-segc'), sg = f.querySelector('.sg'), th = f.querySelector('.l6-th');
        if (v) c.anim(v, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], { duration: 300, easing: 'cubic-bezier(.3,.6,.2,1)' });
        if (th) c.enter(th, 'pop', { d: 380 });
        if (sg) c.enter(sg, 'fade', { d: 300 });
        if (f.hasAttribute('data-ai') && !c.ff) f.classList.add('ai-fill');
        await c.wait(150);
      }
      await c.wait(220);
      ev[1].querySelector('.a-banner .knot').classList.remove('think');
      await c.wait(1300); // the filled sheet holds long enough to read as a host checking it
      flds.forEach(f => f.classList.remove('ai-fill'));
      await c.wait(160);

      // B3: posted to the group; the crew taps Going
      await c.beat(2);
      await c.tap(ev[1].querySelector('.l6-post'), { press: .98 });
      closeSheet(c, ev).catch(() => {});
      await c.wait(160);
      const evm = c.swap(sug, `<div class="l6-evm">${ticket()}<div class="l6-host"><span class="l6-pro">${ic('mega')}Promote</span></div></div>`, 'up', { d: 460 });
      const tk = evm.querySelector('.l6-tk'), gn = tk.querySelector('.gn'), st = tk.querySelector('.cnt .a-stack');
      await c.wait(520);
      for (const [p, n] of [['t', 2], ['i', 3], ['k', 4]]) {
        c.add(st, K.av(p, 's'), 'pop');
        gn.textContent = n;
        c.anim(gn, [{ transform: 'translateY(6px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260 });
        await c.wait(210);
      }
      await c.wait(520);

      // B4: Promote. One switch makes the event public
      await c.beat(3);
      await c.tap(evm.querySelector('.l6-pro'));
      const pr = await openSheet(c, prSheet());
      const sh = pr[1], sw = sh.querySelector('.l6-sw');
      await c.wait(200);
      await c.tap(sw, { noPress: true });
      sh.classList.add('on');
      c.anim(sw, [{ backgroundColor: '#2c2c2e' }, { backgroundColor: '#34d1bf' }], { duration: 260 });
      c.anim(sw.firstElementChild, [{ transform: 'none' }, { transform: 'translateX(20px)' }], { duration: 260, easing: 'cubic-bezier(.3,1.3,.5,1)' });
      sh.querySelector('.l6-pub .s').textContent = 'Anyone with the link can RSVP';
      await c.wait(160);
      for (const ck of sh.querySelectorAll('.l6-fm .a-chk')) { ck.classList.add('on'); c.enter(ck, 'pop', { d: 320 }); await c.wait(110); }
      await c.wait(560);

      // B5: three formats, made from the event, walk out of the phone onto the page
      await c.beat(4);
      await c.tap(sh.querySelector('.l6-make'), { press: .98 });
      await closeSheet(c, pr);
      await breakout(c, tk);
      c.add(tk, `<span class="a-pub">${ic('globe')}Public</span>`, 'pop');
      c.swap(evm.querySelector('.l6-host'), `<div class="a-fmts">${['Story', 'Post', 'Link page'].map(t => `<span>${ic('check')}${t}</span>`).join('')}</div>`, 'fade');
      const toast = c.add(c.app, '<div class="a-toast l6-toast"><span class="ps l6-tth"><i class="arcs"></i></span>3 formats ready</div>', 'none');
      c.anim(toast, [{ opacity: 0, transform: 'translate(-50%, -16px)' }, { opacity: 1, transform: 'translate(-50%, 0)' }], { duration: 380, fill: 'backwards' });
      await c.wait(1000);

      // B6: RSVPs come back into the same thread, later that evening
      await c.beat(5); c.time('9:40');
      c.anim(toast, [{ opacity: 1, transform: 'translate(-50%, 0)' }, { opacity: 0, transform: 'translate(-50%, -16px)' }], { duration: 280, fill: 'forwards' }).finished.then(() => toast.remove(), () => {});
      await c.wait(200);
      c.count(gn, 4, 27, 1100).catch(() => {});
      await c.push(list, rsvp('j', '<b>June</b> is going'), 'up');
      await c.wait(340);
      await c.push(list, rsvp('s', '<b>Sol</b> is going'), 'up');
      await c.wait(340);
      await c.push(list, rsvp('a', '<b>Ari</b> and 20 others are going'), 'up');
      await c.wait(460);
      gn.textContent = '27';
      doorsInPhone(c, list);
      await c.wait(800);

      // B7: Day 39, two minutes to doors
      await c.beat(6);
      c.time(clock() + '8');
      await flip(c, list, 'Day 39 · Fri, Nov 20');
      sub.innerHTML = '<i class="l6-ln"></i>Live now'; sub.classList.add('live');
      c.enter(sub, 'fade', { d: 300 });
      await c.wait(420);
      await c.push(list, K.b('visualizer is loaded', { who: 't', t: clock() + '6 PM' }));
      await c.wait(460);
      await c.push(list, K.b('posters are up by the door', { who: 'i', t: clock() + '7 PM' }));
      await c.wait(460);
      await c.push(list, K.b('doors.', { who: 'k', t: clock() + '8 PM' }));
      await c.wait(420);
      const go = await c.push(list, K.sys('<i class="l6-pulse"></i><b>Launch Night</b> has started'), 'up');
      c.anim(go.querySelector('.l6-pulse'), [{ boxShadow: '0 0 0 0 rgba(52,209,191,.7)' }, { boxShadow: '0 0 0 9px rgba(52,209,191,0)' }], { duration: 1100, delay: 200, easing: 'ease-out' });
      await c.wait(1400);
    },
  });

  // bind Try it as soon as the page is parsed (the engine also calls reset, which binds once)
  const stages = () => [...document.querySelectorAll('[data-scene="launch"]')].map(r => r.closest('[data-fx-stage]')).filter(Boolean);
  const init = () => stages().forEach(st => { bind(st); paint(st); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  // crossing 1200px: stacked shows the formats at once; side by side takes them back to crop marks until B5 lands them
  WIDE.addEventListener('change', () => stages().forEach(st => {
    if (!wide()) { st.querySelectorAll('.l6-fly').forEach(e => e.remove()); st.dataset.out = '1'; }
    else if (!st._l6land) { st.removeAttribute('data-out'); st.querySelectorAll('.fmt.l6-in').forEach(e => e.classList.remove('l6-in')); }
  }));
})();
} catch (e) { console.error('FYI s6-launch', e); }

// ===== statics =====
try {
// Static frames: F1 (the composed Copper Hours thread, used by the spec view in 07 and the compare slider in 08) and the
// state strips in 07. Real components from the same kit as the live phones; nothing here moves.
(() => {
  const FX = window.FX, K = FX.k, ic = FX.ic;

  const f1 = () => `${K.wall()}<div class="a-th f1-th"><div class="a-msgs">
      ${K.voice({ o: 1, seed: 5, d: '0:21' }).replace('class="a-b a-voice o tl"', 'class="a-b a-voice o tl" data-spec="1"')}
      ${K.tr('What if it\'s a night.')}
      <div class="a-ai f1-ai gap" data-spec="2"><div class="hd">${K.knot()}<span>Catch up</span><span class="vis">${ic('lock')}Only you</span></div><ul><li>Launch night is on: Fri, Nov 20.<br><span data-spec="3">${K.src('Kofi · Wed 6:40 PM')}</span></li></ul></div>
      ${K.b('Who wants to run tickets? I can set up the link if no one does.', { o: 1, t: '8:03 AM', rd: 2, id: 'o', cls: 'gap' }).replace('data-id="o"', 'data-spec="4"')}
      ${K.b('I\'ll have the visualizer cut by Nov&nbsp;12…', { who: 't', t: '8:20 AM', cls: 'gap', id: 't' }).replace('data-id="t"', 'data-spec="5"')}
      <div class="a-chip st-appr" data-spec="6"><span class="ck"></span>Visualizer cut · ${K.av('t', 'xs')} Theo · Nov 12</div>
      <div class="a-tk f1-tk" data-spec="7">${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Fri · Doors 9 PM</div><div class="pl">Dock Hall 3</div></div></div></div>
    </div></div>${K.hd({ tasks: 4 })}${K.comp().replace('class="a-comp"', 'class="a-comp" data-spec="8"')}`;
  FX.statics.f1 = f1;
  FX.statics['f1-flat'] = () => `${f1()}${FX.sb}<i class="fx-island"></i><i class="fx-home"></i>`;

  // state strips: each state of three components, labeled
  const fig = (html, cap, w) => `<figure><div class="fx-app fx-static"${w ? ` style="width:${w}px"` : ''}>${html}</div><figcaption>${cap}</figcaption></figure>`;
  const line = t => `<ul><li>${t}</li></ul>`;
  const strips = {
    ai: [
      [K.ai({ title: 'Catch up', think: true, body: '<div class="st-think"><i></i><i></i><i></i></div>' }), 'Thinking'],
      [K.ai({ title: 'Catch up', body: '<ul><li><span class="is-streaming">Launch night is on. Kofi is holding</span></li></ul>' }), 'Streaming'],
      [K.ai({ title: 'Catch up', body: line('Launch night is on.<br>' + K.src('Kofi · Wed 6:40 PM')) }), 'Only you'],
      [K.ai({ title: 'FYI AI', vis: 'In group · asked by Kofi', body: '<p>From copper-hours_stems_v4.zip: 104 BPM, A minor, 3:12.</p>' }), 'In group'],
      [`<div class="st-draft"><span class="a-draft">${K.knot()}Drafted with AI · edit before sending</span><span class="st-in">Who wants to run tickets?</span></div>`, 'Drafted'],
      [K.ai({ title: 'Catch up', body: '<p class="st-part">Couldn\'t read 1 voice note. Summarize without it?</p><div class="acts"><span class="a-ab">Summarize</span></div>' }), 'Partial'],
      [`<div class="st-off">${K.knot()}AI is off in this group · set by an admin</div>`, 'Off'],
    ],
    task: [
      [K.sug('Looks like a task: Visualizer cut · Nov 12'), 'Suggested'],
      [`<div class="a-chip st-need"><span class="ck"></span>Visualizer cut · <span class="nw">Needs an owner</span></div>`, 'Needs an owner'],
      [K.chip(`Visualizer cut · ${K.av('t', 'xs')} Theo · Nov 12`, 'appr'), 'Approved'],
      [K.chip(`Visualizer cut · ${K.av('t', 'xs')} Theo · Nov 12`, 'prog'), 'In progress'],
      [K.chip(`Visualizer cut · waiting on Final stems`, 'appr'), 'Waiting on Final stems'],
      [`<div class="a-chip st-over"><span class="ck"></span>Cover art · ${K.av('i', 'xs')} Ines · <span class="od">Fri, Nov 6</span></div>`, 'Overdue'],
      [`<div class="a-chip st-done"><span class="ck">${ic('check')}</span>Final stems · ${K.av('m', 'xs')} Maya</div>`, 'Finished'],
    ],
    event: [
      [`<div class="a-tk st-tk st-draft-tk"><span class="st-only">Only hosts see this</span>${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Draft · Doors 9 PM</div><div class="pl">Dock Hall 3</div></div></div></div>`, 'Draft'],
      [`<div class="a-tk st-tk"><span class="a-pub">${ic('globe')}Public</span>${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Fri · Doors 9 PM</div><div class="pl">Dock Hall 3</div></div></div></div>`, 'Published'],
      [`<div class="a-tk st-tk">${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt"><span class="a-up">Updated · Doors <s>9&nbsp;PM</s> 10&nbsp;PM</span></div><div class="pl">Dock Hall 3</div></div></div></div>`, 'Updated'],
      [`<div class="a-tk st-tk">${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Full · 200 going</div><div class="pl">Waitlist open</div></div></div></div>`, 'Full'],
      [`<div class="a-tk st-tk st-cx">${K.poster()}<div class="perf"></div><div class="stub"><span class="db"><b>NOV</b><span>20</span></span><div class="inf"><div class="tt">Canceled</div><div class="pl">The venue closed for repairs</div></div></div></div>`, 'Canceled'],
    ],
  };
  document.querySelectorAll('.strip-row[data-strip]').forEach(row => {
    const set = strips[row.dataset.strip]; if (!set) return;
    row.innerHTML = set.map(([h, cap]) => fig(h, cap)).join('');
  });
  // the strips' looping parts (the thinking knot, the caret) hold still while their row is off screen: a spinning SVG
  // re-lays out and repaints every frame, and would otherwise do so behind every phone that plays
  if ('IntersectionObserver' in window) {
    const sio = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('fx-off', !e.isIntersecting)));
    document.querySelectorAll('.strip-row[data-strip]').forEach(row => { row.classList.add('fx-off'); sio.observe(row); });
  }
})();
} catch (e) { console.error('FYI statics', e); }
