/* Hear's company page on LinkedIn, as a mockup. Opened from the campaign block on the home page (v7/feed.js).
   The frame is there first; the name, the buttons and the filter arrive a moment later (CSS alone: .seq in hear-page.css).
   One post is heard at a time: a painting waits as a grey print with its words in ink, opens in colour from the words when it
   reaches the middle of the screen, and then has depth under the mouse (its planes are separate pictures). See pick() and open().
   Films play without sound while they are on screen and stop when they leave. A film is shown only once it is really drawing frames. */
(function () {
  var root = document.getElementById('hp'); if (!root) return;
  var page = document.getElementById('page');
  var feed = document.getElementById('feed'), rail = document.getElementById('rail');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IO = 'IntersectionObserver' in window;

  /* a picture that has not arrived yet waits unseen and fades in when it has (opacity only).
     One that does not arrive shows its description on the pale ground */
  function wait(f) {
    function show() { f.classList.remove('w'); }
    if (f.complete) { show(); return; }
    f.classList.add('w');
    f.addEventListener('load', show, { once: true }); f.addEventListener('error', show, { once: true });
  }
  function play(v) { if (!v.getAttribute('src')) v.src = v.getAttribute('data-src'); var pr = v.play(); if (pr && pr.catch) pr.catch(function (e) { if (!e || e.name !== 'AbortError') v.parentNode.classList.add('idle'); }); } /* a play that was only interrupted (scrolled past) is not a refusal */

  /* ── part two: the posts ── */
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var ICON = {
    like: '<svg ' + S + '><path d="M7 10v10H4V10h3Zm0 0 4-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 17 20H7"/></svg>',
    comment: '<svg ' + S + '><path d="M4 5h16v11H10l-5 4v-4H4V5Z"/><path d="M8 9h8M8 12.5h5"/></svg>',
    repost: '<svg ' + S + '><path d="M7 4 4 7l3 3"/><path d="M4 7h11a4 4 0 0 1 4 4v1"/><path d="m17 20 3-3-3-3"/><path d="M20 17H9a4 4 0 0 1-4-4v-1"/></svg>',
    send: '<svg ' + S + '><path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z"/><path d="m10 13 4-4"/></svg>',
    pin: '<svg ' + S + '><path d="M9 4h6l-1 6 3 3H7l3-3-1-6ZM12 13v7"/></svg>',
    sound: '<svg ' + S + '><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path class="w" d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>',
    play: '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5L7 4.5Z"/></svg>',
    again: '<svg class="i-again" ' + S + ' stroke-width="2"><path d="M5.2 12a6.8 6.8 0 1 0 2.2-5"/><path d="M5 4.2v4.300h4.300"/></svg>',
    pause: '<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.500z"/></svg>',
  };
  var POSTS = [
    { kind: 'painting', pin: true, t: 'New feature release: Hear Studio is here.', name: 'Hear Studio launch', sub: 'Balloon letters over the parade',
      video: '../hear-v7/plan/login/welcome-parade-loop.mp4', loop: true, ratio: '16/9',
      small: '../img/cw-loop-s.webp', full: '../img/cw-loop.webp', alt: 'A moving painting of a city parade. Coral balloon letters over the street spell Hear Studio.' },
    { kind: 'painting', t: 'AI agents get reviewed too. Every conversation, as soon as it ends.', name: 'Who checks the bot?', dp: { n: 'robot', mid: 1, cx: '43%', cy: '84%' }, sub: 'A robot waiter, sure of itself', ratio: '1600/832',
      small: '../img/cw-robot-s.webp', full: '../img/cw-robot.webp', alt: 'Painting of a café terrace. A robot waiter in a bow tie pours coffee with great pride, past the cup and onto a plate of macarons, while the guests stare. The bill on the table reads Who checks the bot?' },
    { kind: 'painting', t: 'Zero blind spots. 100% interaction coverage.', name: 'A sample sees 2%', dp: { n: 'lookout', mid: 1, cx: '52%', cy: '42%' }, sub: 'The harbour watchman', ratio: '1600/832',
      small: '../img/cw-lookout-s.webp', full: '../img/cw-lookout.webp', alt: 'Painting of a harbour. A watchman on a lookout tower studies one distant sailboat through a telescope while, beneath him, a boat fills with water, gulls steal fish and a dog swims off with a baguette. The board on the tower reads A sample sees 2%.' },
    { kind: 'painting', t: 'They say it on the call, before they cancel.', name: 'They said it before they left', dp: { n: 'ferry', cx: '68%', cy: '22%', vars: '--fx:-1.2%;--fy:-1%;--fs:.05;--fo:60% 30%;--nx:19px;--ny:11px' }, sub: 'A ferry, unopened letters', ratio: '1600/832',
      small: '../img/cw-ferry-s.webp', full: '../img/cw-ferry.webp', alt: 'Painting of a ferry pier. A shopkeeper with a bunch of flowers watches a ferry full of people leave; beside him a letterbox overflows with unopened envelopes. The steam of the ferry writes They said it before they left.' },
    { kind: 'film', t: 'One sentence. A 49-second film.', name: 'One sentence', sub: 'Film · 49 seconds', dur: 49,
      video: '../hear-v7/media/film-one-sentence.mp4', ratio: '16/9',
      small: '../img/cw-film-2.webp', full: '../img/cw-film-2.webp', alt: 'The opening frame of the film One sentence: a painted contact center.' },
    { kind: 'painting', t: 'A sample hears 2%. Hear hears 100%.', name: 'A sample against everything', dp: { cx: '62%', cy: '34%' }, sub: 'Balloons beside one cart',
      small: '../img/cw-balloons-s.webp', full: '../img/cw-balloons.webp', alt: 'Painting of a promenade. A huge bunch of balloons carries the figure 100%, next to a small cart marked 2%.' },
    { kind: 'painting', t: 'Every conversation. Not a sample.', name: '100% coverage', dp: { n: 'plane', cx: '62%', cy: '22%' }, sub: 'Written in the sky by a plane',
      small: '../img/cw-plane-s.webp', full: '../img/cw-plane.webp', alt: 'Painting of a woman on a terrace looking at the city. A plane has written 100% coverage in the sky.' },
    { kind: 'painting', t: 'Front-page news: what your customers actually said.', name: 'The morning paper', dp: { n: 'paper', cx: '50%', cy: '52%' }, sub: 'The front page, held at a café',
      small: '../img/cw-paper-s.webp', full: '../img/cw-paper.webp', alt: 'Painting of two hands holding a Hear newspaper at a café. The headline reads What your customers actually said.' },
    { kind: 'film', t: 'Said out loud. A 42-second film.', name: 'Said out loud', sub: 'Film · 42 seconds', dur: 42,
      video: '../hear-v7/media/film.mp4', ratio: '16/9',
      small: '../img/cw-film-1.webp', full: '../img/cw-film-1.webp', alt: 'The opening frame of the film Said out loud.' },
    { kind: 'painting', t: 'Your bill, please.', name: 'Your bill, please', dp: { cx: '60%', cy: '58%' }, sub: 'A café receipt on the table',
      small: '../img/cw-receipt-s.webp', full: '../img/cw-receipt.webp', alt: 'Painting of a café table with a coffee, a croissant and a Hear receipt that ends with Just growth delivered.' },
    { kind: 'painting', t: 'We hear every call. Even in Rome. Hall 7, Booth 7062 at FX World, Fiera Roma.', name: 'FX World, Rome', dp: { cx: '74%', cy: '24%' }, sub: 'A sign by the Colosseum',
      small: '../img/cw-rome-s.webp', full: '../img/cw-rome.webp', alt: 'Painting of a street in Rome. A telephone handset rests on the Colosseum, and a banner reads We hear every call. Even here.' }
  ];
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function clock(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
  var posts = [], vids = [];
  function box(v) { return v.parentNode; }
  function hush(o) { o.muted = true; var s = box(o).querySelector('.vd-snd'); if (s) { s.setAttribute('aria-pressed', 'false'); s.lastChild.textContent = 'Sound off'; } }
  function build() {
    if (feed._b) return; feed._b = 1;
    feed.innerHTML = POSTS.map(function (p, i) {
      var film = p.video && !p.loop;
      var d = p.dp, L = d && d.n ? '../img/dp-' + d.n + '-' : '';
      var media = d ?
        /* a painting: its planes underneath, the whole picture as a grey print on top (it opens from the words), and the words in full ink */
        '<div class="pt dp" role="img" aria-label="' + esc(p.alt) + '" style="aspect-ratio:' + (p.ratio || '1200/628') + ';--cx:' + d.cx + ';--cy:' + d.cy + ';' + (d.vars || '') + '">' +
          '<div class="dp-scene"><img class="dp-far" src="' + (L ? L + 'far.webp' : p.full) + '" alt="" loading="lazy" decoding="async">' +
          (d.mid ? '<img class="dp-mid" src="' + L + 'mid.webp" alt="" loading="lazy" decoding="async">' : '') +
          (L ? '<img class="dp-near" src="' + L + 'near.webp" alt="" loading="lazy" decoding="async">' : '') + '<i class="dp-light"></i></div>' +
          '<img class="pt-f w dp-grey" src="' + p.full + '" alt="" loading="lazy" decoding="async">' +
          (L ? '<img class="dp-words" src="' + p.full + '" alt="" loading="lazy" decoding="async" style="-webkit-mask-image:url(' + L + 'words.png);mask-image:url(' + L + 'words.png)">' : '') +
        '</div>' :
        '<div class="pt' + (p.video ? ' vd' : '') + (p.loop ? ' lo' : '') + '" style="aspect-ratio:' + (p.ratio || '1200/628') + '">' +
        '<img class="pt-f w" src="' + p.full + '" alt="' + esc(p.alt) + '"' + (i ? ' loading="lazy"' : '') + ' decoding="async">' +
        (p.video ? '<video muted playsinline preload="none"' + (p.loop ? ' loop' : '') + ' data-src="' + p.video + '" aria-label="' + esc(p.alt) + '"></video>' : '') +
        (film ? '<button type="button" class="vd-play" aria-label="Play the film">' + ICON.play + ICON.pause + ICON.again + '</button>' +
          '<span class="vd-time" aria-hidden="true">' + clock(p.dur) + '</span>' +
          '<button type="button" class="vd-snd" aria-pressed="false">' + ICON.sound + '<span>Sound off</span></button>' +
          '<i class="vd-bar" aria-hidden="true"><b></b></i>' : '') +
        '</div>';
      return '<article class="lp' + (i ? '' : ' heard') + '" data-kind="' + p.kind + '" id="post' + i + '">' +
        '<header class="lp-h"><img class="lp-av" src="../img/cw-cloud.webp" alt="" width="320" height="320" decoding="async"><div class="lp-who"><b>Hear</b><span>AI contact center intelligence platform</span></div>' +
        (p.pin ? '<span class="lp-pin">' + ICON.pin + 'Pinned</span>' : '') + '</header>' +
        '<p class="lp-t">' + esc(p.t) + '</p>' + media +
        '<div class="lp-row"><button type="button" class="lp-act lk-like" aria-pressed="false">' + ICON.like + '<span>Like</span></button>' +
        '<span class="lp-dr" aria-hidden="true">' + ICON.comment + 'Comment</span>' +
        '<span class="lp-dr" aria-hidden="true">' + ICON.repost + 'Repost</span><span class="lp-dr" aria-hidden="true">' + ICON.send + 'Send</span></div></article>';
    }).join('');
    posts = [].slice.call(feed.querySelectorAll('.lp'));

    rail.innerHTML = POSTS.map(function (p, i) {
      return '<li' + (i ? '' : ' class="heard"') + ' data-kind="' + p.kind + '"><button type="button" data-i="' + i + '"' + (i ? '' : ' aria-current="true"') + '><img src="' + p.small + '" alt="" loading="lazy" decoding="async"><span><b>' + esc(p.name) + '</b><span>' + esc(p.sub) + '</span></span></button></li>';
    }).join('');
    var rows = [].slice.call(rail.querySelectorAll('button'));
    rail.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) jump(+b.getAttribute('data-i'), true); });
    /* the marker follows the last post whose top has passed the upper part of the screen; at the foot of the page, the last one */
    var tick = 0;
    function mark() {
      tick = 0; var line = innerHeight * .42, k = -1, last = -1;
      posts.forEach(function (a, i) { if (a.hidden) return; last = i; if (k < 0) k = i; if (a.getBoundingClientRect().top < line) k = i; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) k = last;
      rows.forEach(function (r, j) { if (j === k) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current'); });
    }
    addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(function () { mark(); pick(); }); }, { passive: true });
    feed._mark = mark;

    /* ── one post is heard at a time. A post waits as a grey print with only its words in ink. The one nearest the middle of the
       screen opens: colour floods out from the words (0.9 s), its planes separate (0.8 s), and then it has depth: under the mouse
       the far plane goes against the pointer and the near one with it; with no mouse on it, it answers the scroll.
       A post that has been heard keeps its colour, and so does its row in the index. LinkedIn's card itself never moves. ── */
    var lis = [].slice.call(rail.children), live = null, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    function spring(fr) { /* the spring of Hear's role cards: quick and damped while following, one soft swing past level when let go */
      var tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, last = 0;
      function step(t) {
        var dt = Math.min(.034, (t - last) / 1000 || .016); last = t;
        var k = fr._over ? 110 : 15, c = fr._over ? 21 : 4.6;
        vx += ((tx - x) * k - vx * c) * dt; vy += ((ty - y) * k - vy * c) * dt; x += vx * dt; y += vy * dt;
        fr.style.setProperty('--tx', x.toFixed(4)); fr.style.setProperty('--ty', y.toFixed(4));
        raf = Math.abs(tx - x) > .0008 || Math.abs(ty - y) > .0008 || Math.abs(vx) > .002 || Math.abs(vy) > .002 ? requestAnimationFrame(step) : 0;
      }
      fr._to = function (a, b) { tx = a; ty = b; if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } };
    }
    function near(e, fr) { var r = fr.getBoundingClientRect(); fr._to(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)), Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2))); }
    function byScroll() { /* walking past a window */
      if (!live || !live._to || live._over || reduce) return;
      var r = live.getBoundingClientRect(); live._to(0, Math.max(-1, Math.min(1, ((r.top + r.height / 2) - innerHeight / 2) / (innerHeight / 2))));
    }
    var pics = posts.map(function (a) { return a.querySelector('.pt'); });
    pics.forEach(function (fr) {
      if (!fr.classList.contains('dp') || reduce) return;
      spring(fr);
      if (fine) {
        fr.addEventListener('pointermove', function (e) { if (e.pointerType !== 'mouse' || fr !== live || !fr.classList.contains('live')) return; fr._over = true; near(e, fr); });
        fr.addEventListener('pointerleave', function () { fr._over = false; byScroll(); });
      } else if (window.v7Gyro) window.v7Gyro.watch(fr, function (a, b, off) {   /* a phone: the open post follows its tilt (v7/gyro.js) */
        if (fr !== live || !fr.classList.contains('live')) return;
        if (off) { fr._over = false; byScroll(); } else { fr._over = true; fr._to(a, b); }
      });
    });
    function whenThere(fr, go) { /* the planes must have arrived before the grey print opens onto them */
      var w = [].filter.call(fr.querySelectorAll('.dp-scene img'), function (m) { return !m.complete; });
      if (!w.length) { go(); return; }
      var n = w.length; w.forEach(function (m) { m.loading = 'eager'; var one = function () { if (!--n) go(); }; m.addEventListener('load', one, { once: true }); m.addEventListener('error', one, { once: true }); });
    }
    function open(i) {
      var fr = pics[i], a = posts[i];
      if (a.classList.contains('heard')) { arm(fr); return; }
      a.classList.add('heard'); if (lis[i]) lis[i].classList.add('heard');
      if (!fr.classList.contains('dp')) return;
      whenThere(fr, function () {
        fr.classList.add('open');
        setTimeout(function () { fr.classList.add('done'); arm(fr); }, reduce ? 0 : 1100);
      });
      var nx = pics[i + 1]; if (nx) [].forEach.call(nx.querySelectorAll('.dp-scene img'), function (m) { m.loading = 'eager'; });
    }
    function arm(fr) { if (fr === live && fr.classList.contains('done') && !reduce) { fr.classList.add('live'); byScroll(); } }
    function pick() {
      var best = -1, bd = 1e9;
      pics.forEach(function (fr, i) {
        if (posts[i].hidden) return;
        var r = fr.getBoundingClientRect(), see = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0), d = Math.abs((r.top + r.height / 2) - innerHeight * .46);
        if (see > r.height * .55 && d < bd) { bd = d; best = i; }
      });
      var fr = best < 0 ? null : pics[best];
      if (fr === live) { byScroll(); return; }
      if (live) { live.classList.remove('live'); live._over = false; if (live._to) live._to(0, 0); }
      live = fr; if (fr) open(best);
    }
    feed._pick = pick;
    addEventListener('resize', pick);
    setTimeout(pick, 700);

    [].forEach.call(feed.querySelectorAll('.pt-f'), wait);

    /* films: play muted while six tenths are on screen, stop when they leave; one sound at a time.
       A film gets its file only then, so it starts at its first frame, which is the still already on screen.
       It is shown (.on) only once a frame has really been drawn, so there is never a blank or a jump */
    vids = [].slice.call(feed.querySelectorAll('video'));
    vids.forEach(function (v) {
      var b = box(v), snd = b.querySelector('.vd-snd'), pl = b.querySelector('.vd-play'), bar = b.querySelector('.vd-bar b'), tm = b.querySelector('.vd-time');
      var said = POSTS[posts.indexOf(b.parentNode)].dur || 0;
      function shown() { b.classList.add('on'); }
      function name() { if (pl) pl.setAttribute('aria-label', v.ended ? 'Play the film again' : v.paused ? 'Play the film' : 'Pause the film'); }
      function start() { v._user = false; if (v.ended) v.currentTime = 0; play(v); }
      v.addEventListener('playing', function () {
        b.classList.add('run'); b.classList.remove('idle', 'end'); name();
        var art = b.parentNode, k = posts.indexOf(art); if (!art.classList.contains('heard')) { art.classList.add('heard'); var li = rail.children[k]; if (li) li.classList.add('heard'); }
        if (!b.classList.contains('on') && v.requestVideoFrameCallback) v.requestVideoFrameCallback(shown);
      });
      v.addEventListener('pause', function () { b.classList.remove('run'); if (!v.ended && v._user) b.classList.add('idle'); name(); });
      v.addEventListener('ended', function () { b.classList.remove('run'); b.classList.add('idle', 'end'); name(); });
      v.addEventListener('timeupdate', function () {
        if (v.currentTime > (v.requestVideoFrameCallback ? .3 : 0)) shown(); /* where the frame callback does not exist, or never came */
        var d = v.duration || said; if (!d) return;
        if (bar) bar.style.transform = 'scaleX(' + Math.min(1, v.currentTime / d) + ')';
        if (tm) tm.textContent = clock(Math.min(said || d, d - v.currentTime)); /* never more than the length the post names */
      });
      /* the round button: with the mouse it is there when the film is still; from the keyboard it is always reachable, and also pauses */
      if (pl) pl.addEventListener('click', function () { if (!v.paused && !v.ended) { v._user = true; v.pause(); } else start(); });
      v.addEventListener('click', function () { if (v.loop) return; if (v.paused) start(); else { v._user = true; v.pause(); } });
      if (snd) snd.addEventListener('click', function () {
        var on = v.muted; vids.forEach(hush);
        v.muted = !on; snd.setAttribute('aria-pressed', on ? 'true' : 'false'); snd.lastChild.textContent = on ? 'Sound on' : 'Sound off';
        if (on && v.paused) start();
      });
      if (reduce && !v.loop) b.classList.add('idle');
    });
    /* reduced motion: nothing starts by itself, but a film that was started still stops when it leaves */
    if (IO) {
      var vio = new IntersectionObserver(function (es) { es.forEach(function (e) {
        var v = e.target;
        if (e.intersectionRatio >= .6) { if (!reduce && v.paused && !v.ended && !v._user) play(v); }
        else if (!v.paused) { v.pause(); hush(v); if (reduce && !v.loop) box(v).classList.add('idle'); }
      }); }, { threshold: [0, .6] });
      vids.forEach(function (v) { vio.observe(v); });
    }

    feed.addEventListener('click', function (e) {
      var like = e.target.closest('.lk-like');
      if (like) { var on = like.getAttribute('aria-pressed') !== 'true'; like.setAttribute('aria-pressed', on ? 'true' : 'false'); like.lastChild.textContent = on ? 'Liked' : 'Like'; }
    });

    /* All / Paintings / Films */
    var chips = [].slice.call(page.querySelectorAll('.lk-chips button'));
    chips.forEach(function (c) { c.addEventListener('click', function () {
      var f = c.getAttribute('data-f');
      chips.forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
      posts.forEach(function (a) { a.hidden = f !== 'all' && a.getAttribute('data-kind') !== f; });
      [].forEach.call(rail.children, function (li) { li.hidden = f !== 'all' && li.getAttribute('data-kind') !== f; });
      mark(); pick();
    }); });
  }
  function jump(i, smooth) {
    var a = posts[i]; if (!a) return; if (a.hidden) page.querySelector('.lk-chips button').click();
    scrollTo({ top: a.getBoundingClientRect().top + scrollY - 66, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }

  /* ── arriving. A link to one post (#post3) goes straight to it ── */
  var at = /^#post(\d+)$/.exec(location.hash);
  build();
  wait(document.querySelector('#cover .pt-f'));
  if (at) { var land = function () { jump(+at[1], false); }; land(); addEventListener('load', land); }

  /* ── the cover has depth too: the people and the window frames move a little in front of the sky; the sky and its words stay put ── */
  (function () {
    var c = document.getElementById('cover'), top = c && c.closest('.lk-top'), cv = c && c.querySelector('.cv');
    if (!cv || reduce || !matchMedia('(hover:hover) and (pointer:fine) and (min-width:641px)').matches) return;
    var ims = [].slice.call(cv.querySelectorAll('img')), n = ims.length, tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, last = 0, over = false;
    function step(t) {
      var dt = Math.min(.034, (t - last) / 1000 || .016); last = t; var k = over ? 110 : 15, d = over ? 21 : 4.6;
      vx += ((tx - x) * k - vx * d) * dt; vy += ((ty - y) * k - vy * d) * dt; x += vx * dt; y += vy * dt;
      c.style.setProperty('--tx', x.toFixed(4)); c.style.setProperty('--ty', y.toFixed(4));
      raf = Math.abs(tx - x) > .0008 || Math.abs(ty - y) > .0008 || Math.abs(vx) > .002 || Math.abs(vy) > .002 ? requestAnimationFrame(step) : 0;
    }
    function go() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); } }
    setTimeout(function () { ims.forEach(function (m) { m.addEventListener('load', function () { if (!--n) c.classList.add('cv-on'); }, { once: true }); m.src = m.getAttribute('data-src'); }); }, 1600);
    top.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || !c.classList.contains('cv-on')) return; over = true; c.classList.add('live'); var r = c.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2)); ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2)); go();
    });
    top.addEventListener('pointerleave', function () { over = false; tx = ty = 0; go(); });
  })();

  /* ── leaving and coming back (Back / Forward): no film keeps playing or sounding behind the next page ── */
  addEventListener('pagehide', function () { vids.forEach(function (v) { if (!v.paused) v.pause(); hush(v); }); });
  addEventListener('pageshow', function (e) {
    if (!e.persisted || reduce) return;
    vids.forEach(function (v) { var r = v.getBoundingClientRect(), see = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0); if (v.paused && !v.ended && !v._user && r.height && see >= r.height * .6) play(v); });
  });
})();
