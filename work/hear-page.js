/* Hear's company page on LinkedIn, as a mockup. Opened from the campaign block on the home page (v7/feed.js).
   The frame is there first; the name, the buttons and the filter arrive a moment later (CSS alone: .seq in hear-page.css).
   Pictures are plain images: each fades in once it has loaded, nothing else.
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
    { kind: 'painting', t: 'AI agents get reviewed too. Every conversation, as soon as it ends.', name: 'Who checks the bot?', sub: 'A robot waiter, sure of itself', ratio: '1600/832',
      small: '../img/cw-robot-s.webp', full: '../img/cw-robot.webp', alt: 'Painting of a café terrace. A robot waiter in a bow tie pours coffee with great pride, past the cup and onto a plate of macarons, while the guests stare. The bill on the table reads Who checks the bot?' },
    { kind: 'painting', t: 'Zero blind spots. 100% interaction coverage.', name: 'A sample sees 2%', sub: 'The harbour watchman and one sailboat', ratio: '1600/832',
      small: '../img/cw-lookout-s.webp', full: '../img/cw-lookout.webp', alt: 'Painting of a harbour. A watchman on a lookout tower studies one distant sailboat through a telescope while, beneath him, a boat fills with water, gulls steal fish and a dog swims off with a baguette. The board on the tower reads A sample sees 2%.' },
    { kind: 'painting', t: 'They say it on the call, before they cancel.', name: 'They said it before they left', sub: 'A ferry, and letters nobody opened', ratio: '1600/832',
      small: '../img/cw-ferry-s.webp', full: '../img/cw-ferry.webp', alt: 'Painting of a ferry pier. A shopkeeper with a bunch of flowers watches a ferry full of people leave; beside him a letterbox overflows with unopened envelopes. The steam of the ferry writes They said it before they left.' },
    { kind: 'film', t: 'Said out loud. A 42-second film.', name: 'Said out loud', sub: 'Film · 42 seconds', dur: 42,
      video: '../hear-v7/media/film.mp4', ratio: '16/9',
      small: '../img/cw-film-1.webp', full: '../img/cw-film-1.webp', alt: 'The opening frame of the film Said out loud.' },
    { kind: 'painting', t: 'A sample hears 2%. Hear hears 100%.', name: 'A sample against everything', sub: 'A cloud of balloons beside one small cart',
      small: '../img/cw-balloons-s.webp', full: '../img/cw-balloons.webp', alt: 'Painting of a promenade. A huge bunch of balloons carries the figure 100%, next to a small cart marked 2%.' },
    { kind: 'painting', t: 'Every conversation. Not a sample.', name: '100% coverage', sub: 'Written in the sky by a plane',
      small: '../img/cw-plane-s.webp', full: '../img/cw-plane.webp', alt: 'Painting of a woman on a terrace looking at the city. A plane has written 100% coverage in the sky.' },
    { kind: 'painting', t: 'Front-page news: what your customers actually said.', name: 'The morning paper', sub: 'The front page, held at a café',
      small: '../img/cw-paper-s.webp', full: '../img/cw-paper.webp', alt: 'Painting of two hands holding a Hear newspaper at a café. The headline reads What your customers actually said.' },
    { kind: 'film', t: 'One sentence. A 49-second film.', name: 'One sentence', sub: 'Film · 49 seconds', dur: 49,
      video: '../hear-v7/media/film-one-sentence.mp4', ratio: '16/9',
      small: '../img/cw-film-2.webp', full: '../img/cw-film-2.webp', alt: 'The opening frame of the film One sentence: a painted contact center.' },
    { kind: 'painting', t: 'Your bill, please.', name: 'Your bill, please', sub: 'A café receipt on the table',
      small: '../img/cw-receipt-s.webp', full: '../img/cw-receipt.webp', alt: 'Painting of a café table with a coffee, a croissant and a Hear receipt that ends with Just growth delivered.' },
    { kind: 'painting', t: 'We hear every call. Even in Rome. Hall 7, Booth 7062 at FX World, Fiera Roma.', name: 'FX World, Rome', sub: 'A street sign and a banner by the Colosseum',
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
      var media = '<div class="pt' + (p.video ? ' vd' : '') + (p.loop ? ' lo' : '') + '" style="aspect-ratio:' + (p.ratio || '1200/628') + '">' +
        '<img class="pt-f w" src="' + p.full + '" alt="' + esc(p.alt) + '"' + (i ? ' loading="lazy"' : '') + ' decoding="async">' +
        (p.video ? '<video muted playsinline preload="none"' + (p.loop ? ' loop' : '') + ' data-src="' + p.video + '" aria-label="' + esc(p.alt) + '"></video>' : '') +
        (film ? '<button type="button" class="vd-play" aria-label="Play the film">' + ICON.play + ICON.pause + ICON.again + '</button>' +
          '<span class="vd-time" aria-hidden="true">' + clock(p.dur) + '</span>' +
          '<button type="button" class="vd-snd" aria-pressed="false">' + ICON.sound + '<span>Sound off</span></button>' +
          '<i class="vd-bar" aria-hidden="true"><b></b></i>' : '') +
        '</div>';
      return '<article class="lp" data-kind="' + p.kind + '" id="post' + i + '">' +
        '<header class="lp-h"><img class="lp-av" src="../img/cw-cloud.webp" alt="" width="320" height="320" decoding="async"><div class="lp-who"><b>Hear</b><span>AI contact center intelligence platform</span></div>' +
        (p.pin ? '<span class="lp-pin">' + ICON.pin + 'Pinned</span>' : '') + '</header>' +
        '<p class="lp-t">' + esc(p.t) + '</p>' + media +
        '<div class="lp-row"><button type="button" class="lp-act lk-like" aria-pressed="false">' + ICON.like + '<span>Like</span></button>' +
        '<span class="lp-dr" aria-hidden="true">' + ICON.comment + 'Comment</span>' +
        '<span class="lp-dr" aria-hidden="true">' + ICON.repost + 'Repost</span><span class="lp-dr" aria-hidden="true">' + ICON.send + 'Send</span></div></article>';
    }).join('');
    posts = [].slice.call(feed.querySelectorAll('.lp'));

    rail.innerHTML = POSTS.map(function (p, i) {
      return '<li data-kind="' + p.kind + '"><button type="button" data-i="' + i + '"' + (i ? '' : ' aria-current="true"') + '><img src="' + p.small + '" alt="" loading="lazy" decoding="async"><span><b>' + esc(p.name) + '</b><span>' + esc(p.sub) + '</span></span></button></li>';
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
    addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(mark); }, { passive: true });
    feed._mark = mark;

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
      mark();
    }); });
  }
  function jump(i, smooth) {
    var a = posts[i]; if (!a) return; if (a.hidden) page.querySelector('.lk-chips button').click();
    scrollTo({ top: a.getBoundingClientRect().top + scrollY - 78, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }

  /* ── arriving. A link to one post (#post3) goes straight to it ── */
  var at = /^#post(\d+)$/.exec(location.hash);
  build();
  wait(document.querySelector('#cover .pt-f'));
  if (at) { var land = function () { jump(+at[1], false); }; land(); addEventListener('load', land); }

  /* ── leaving and coming back (Back / Forward): no film keeps playing or sounding behind the next page ── */
  addEventListener('pagehide', function () { vids.forEach(function (v) { if (!v.paused) v.pause(); hush(v); }); });
  addEventListener('pageshow', function (e) {
    if (!e.persisted || reduce) return;
    vids.forEach(function (v) { var r = v.getBoundingClientRect(), see = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0); if (v.paused && !v.ended && !v._user && r.height && see >= r.height * .6) play(v); });
  });
})();
