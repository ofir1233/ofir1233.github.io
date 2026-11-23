/* FYI case study, layer: The kit.
   Fills each tile of the wall with one real component from the app's kit (FX.k builders, a-* styles) and makes it do its
   own job. Every part has three states (0 resting, 1 in use, 2 done). The control above the wall sets all of them, tile
   after tile; a part used by hand runs through to its own end. Nothing here reaches outside #fya-kit. */
(function () {
  var root = document.getElementById('fya-kit'), FX = window.FX, K = FX && FX.k;
  if (!root || !K || !FX.ic) return;
  var ic = FX.ic, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STEP = 90, LAG = 60, seen = false, wave = 0, lag = 0;
  var parts = {}, order = [], state = {}, timers = {};
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var btn = function (html, cls, attrs) { return html.replace(new RegExp('<span class="' + cls + '">([\\s\\S]*?)</span>'), '<button type="button" class="' + cls + '" ' + attrs + '>$1</button>'); };
  var later = function (k, fn, ms) { var id = setTimeout(fn, ms); (timers[k] = timers[k] || []).push(id); return id; };
  var clear = function (k) { (timers[k] || []).forEach(clearTimeout); timers[k] = []; };

  var segs = [].slice.call(root.querySelectorAll('.fyak-seg button'));
  var sync = function () {
    if (wave) return;
    var all = order.length ? state[order[0]] : 0;
    order.forEach(function (k) { if (state[k] !== all) all = -1; });
    segs.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.s === all)); });
  };
  // a part reports its state: the number drives the styles, the word is read under the tile
  // (after a press on the control above, the word follows its tile by LAG ms and ticks in)
  var say = function (p, w) {
    if (p.cap.textContent === w) return;
    p.cap.textContent = w; p.cap.classList.remove('fyak-in'); p.cap.getBoundingClientRect(); p.cap.classList.add('fyak-in');
  };
  var put = function (k, s, word) {
    var p = parts[k], w = word || p.words[s]; state[k] = s; p.fig.dataset.s = s;
    clearTimeout(p.wt);
    if (p.cap) { if (lag) p.wt = setTimeout(function () { say(p, w); }, lag); else p.cap.textContent = w; }
    sync();
  };
  var part = function (k, words, build) {
    var fig = root.querySelector('.fyak-t[data-k="' + k + '"]'), c = fig && fig.querySelector('.fyak-c'); if (!c) return;
    var p = parts[k] = { fig: fig, c: c, cap: fig.querySelector('.fyak-s'), words: words };
    fig.style.setProperty('--i', order.length); order.push(k);
    try { p.set = build(c, k, p); p.set(0); } catch (e) { order.pop(); delete parts[k]; }
  };
  var all = function (s) {
    var n = ++wave;
    segs.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.s === s)); });
    order.forEach(function (k, i) { setTimeout(function () { if (wave !== n) return; lag = reduce ? 0 : LAG; parts[k].set(s); lag = 0; }, reduce ? 0 : i * STEP); });
    setTimeout(function () { if (wave === n) { wave = 0; sync(); } }, reduce ? 0 : order.length * STEP + 20);
  };
  segs.forEach(function (b) { b.addEventListener('click', function () { all(+b.dataset.s); }); });

  // voice note: the bars fill as it plays, then the transcript is there
  part('voice', ['Resting', 'Playing', 'Played'], function (c, k) {
    c.innerHTML = '<div class="fyak-col">' + btn(K.voice({ o: 1, seed: 5 }), 'pl', 'aria-label="Play the voice note"') + K.tr('What if it\'s a night.') + '</div>';
    var pl = c.querySelector('.pl'), bars = [].slice.call(c.querySelectorAll('.a-wave i')), d = c.querySelector('.d');
    var fill = function (n) { bars.forEach(function (b, i) { b.classList.toggle('p', i < n); }); d.textContent = '0:' + ('0' + Math.round(21 * n / bars.length)).slice(-2); };
    var on = false, face = function (p) { on = p; pl.innerHTML = ic(p ? 'pause' : 'play'); pl.setAttribute('aria-label', p ? 'Pause the voice note' : 'Play the voice note'); };
    var set = function (s, flow) {
      clear(k); put(k, s); face(s === 1 && !reduce);
      if (s === 0) { fill(0); d.textContent = '0:21'; return; }
      if (s === 2 || reduce) { fill(s === 2 ? bars.length : 13); return; }
      var i = 0, run = function () {
        fill(++i);
        if (i < bars.length) return later(k, run, 70);
        if (flow) return later(k, function () { set(2); }, 260);
        // held "in use": it plays once and rests on the played frame
        later(k, function () { face(false); put(k, 1, 'Played'); }, 260);
      };
      fill(0); later(k, run, 120);
    };
    pl.addEventListener('click', function () { on ? set(0) : set(1, true); });
    return set;
  });

  // poll: your vote moves the bars
  part('poll', ['Open', 'You voted', 'All votes in'], function (c, k) {
    var rows = [['a', 'A · Horizon'], ['b', 'B · Grooves'], ['c', 'C · Stack']], mine = null;
    c.innerHTML = '<div class="a-poll t5-poll"><div class="q">Which cover?<span class="pn"></span></div>' + rows.map(function (r) {
      return '<button type="button" class="r" data-r="' + r[0] + '" aria-pressed="false"><i class="bar"></i><span class="cov cov-' + r[0] + '"></span><span class="t">' + r[1] + '</span><span class="a-stack"></span><span class="v">0</span></button>'; }).join('') + '</div>';
    var paint = function () {
      var v = { t: 'b' }, n = 0; if (mine) v.m = mine; if (state[k] === 2) { v.i = 'b'; v.k = 'a'; }
      [].forEach.call(c.querySelectorAll('.r'), function (r) {
        var who = Object.keys(v).filter(function (p) { return v[p] === r.dataset.r; }); n += who.length;
        r.classList.toggle('mine', mine === r.dataset.r); r.setAttribute('aria-pressed', String(mine === r.dataset.r));
        r.querySelector('.bar').style.width = who.length * 25 + '%';
        r.querySelector('.a-stack').innerHTML = who.map(function (p) { return K.av(p, 's'); }).join('');
        r.querySelector('.v').textContent = who.length;
      });
      c.querySelector('.pn').textContent = 'Poll · ' + n + ' vote' + (n === 1 ? '' : 's');
    };
    var set = function (s) { if (s === 0) mine = null; else if (!mine) mine = 'b'; put(k, s); paint(); };
    c.addEventListener('click', function (e) {
      var r = e.target.closest('.r'); if (!r) return;
      mine = mine === r.dataset.r ? null : r.dataset.r; put(k, mine ? Math.max(1, state[k]) : 0); paint();
    });
    return set;
  });

  // event ticket: Going is a toggle and the count follows; when the doors move, the stub says so
  part('ticket', ['Invited', 'Going', 'Updated'], function (c, k, p) {
    var h = K.ticket({ pub: true, going: 3 }).replace(K.stack('mtik', 'xs'), K.stack('tik', 'xs')).replace('class="a-pub"', 'class="a-pub off"');
    c.innerHTML = btn(btn(h, 'a-go', 'aria-pressed="false"'), 'a-may', 'aria-pressed="false"');
    var go = c.querySelector('.a-go'), may = c.querySelector('.a-may'), tt = c.querySelector('.tt'), cnt = c.querySelector('.cnt'), pub = c.querySelector('.a-pub');
    var set = function (s, flow, maybe) {
      var g = s > 0;
      put(k, s, maybe ? 'Maybe' : '');
      go.setAttribute('aria-pressed', String(g)); may.setAttribute('aria-pressed', String(!!maybe));
      cnt.innerHTML = K.stack(g ? 'mti' : 'tik', 'xs') + '<span><b class="gn" aria-label="' + (g ? 4 : 3) + ' going">' + (g ? 4 : 3) + '</b></span>';
      tt.innerHTML = s === 2 ? '<span class="a-up">Updated · Doors <s>9&nbsp;PM</s> 10&nbsp;PM</span>' : 'Fri · Doors 9&nbsp;PM';
    };
    go.addEventListener('click', function () { set(go.getAttribute('aria-pressed') === 'true' ? 0 : 1); });
    may.addEventListener('click', function () { set(0, false, may.getAttribute('aria-pressed') !== 'true'); });
    p.pub = function (on) { if (pub) pub.classList.toggle('off', !on); };
    return set;
  });

  // task: approved, in progress, finished
  part('task', ['Approved', 'In progress', 'Finished'], function (c, k) {
    var st = ['appr', 'prog', 'done'];
    c.innerHTML = '<div class="fyak-task">' + K.chip('Visualizer cut · ' + K.av('t', 'xs') + ' Theo · Nov 12') + '<div class="a-segc" role="group" aria-label="Status">' +
      ['Approved', 'In progress', 'Finished'].map(function (t, i) { return '<button type="button" data-i="' + i + '" aria-pressed="false"><span>' + t + '</span></button>'; }).join('') + '</div></div>';
    var chip = c.querySelector('.a-chip'), ck = chip.querySelector('.ck'), bs = [].slice.call(c.querySelectorAll('.a-segc button'));
    var set = function (s) {
      put(k, s); chip.className = 'a-chip st-' + st[s]; ck.innerHTML = s === 2 ? ic('check') : '';
      bs.forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === s)); b.firstChild.classList.toggle('on', i === s); });
    };
    bs.forEach(function (b) { b.addEventListener('click', function () { set(+b.dataset.i); }); });
    return set;
  });

  // AI card: it thinks, then writes, then shows where each line came from
  part('ai', ['Ready', 'Writing', 'Answered'], function (c, k) {
    var L = [['Launch night is on: Fri, Nov 20.', 'Kofi · Wed 6:40 PM'], ['Theo has the cut by Nov 12.', 'Theo · 8:20 AM']];
    c.innerHTML = K.ai({ title: 'Catch up', body: '<div class="fyak-aib" aria-live="off"></div>' });
    var body = c.querySelector('.fyak-aib'), knot = c.querySelector('.knot');
    var act = function (t) { return '<div class="acts"><button type="button" class="a-ab">' + t + '</button></div>'; };
    var list = function (n, cls) { return '<ul>' + L.slice(0, n).map(function (l, i) { return '<li><span class="tx' + (cls && i === n - 1 ? ' is-streaming' : '') + '">' + l[0] + '</span><br>' + K.src(l[1]) + '</li>'; }).join('') + '</ul>'; };
    var set = function (s, flow) {
      clear(k); put(k, s); knot.classList.remove('think');
      if (s === 0) { body.innerHTML = '<p>64 new messages since you left.</p>' + act('Summarize'); return; }
      if (s === 2) { body.innerHTML = list(2) + act('Summarize again'); return; }
      if (reduce) { body.innerHTML = list(2, true); return; }
      put(k, 1, 'Thinking'); knot.classList.add('think'); body.innerHTML = '<div class="st-think"><i></i><i></i><i></i></div>';
      later(k, function () {
        put(k, 1); knot.classList.remove('think');
        var n = 0, line = function () {
          body.innerHTML = list(n + 1, true);
          var tx = body.querySelectorAll('.tx')[n], src = body.querySelectorAll('.a-src')[n], full = L[n][0], i = 0;
          tx.textContent = ''; src.classList.add('wait');
          (function type() {
            i = Math.min(full.length, i + 2); tx.textContent = full.slice(0, i);
            if (i < full.length) return later(k, type, 26);
            if (n === L.length - 1 && !flow) { src.classList.remove('wait'); return; }   // held "in use": the caret stays at the end
            tx.classList.remove('is-streaming'); src.classList.remove('wait');
            later(k, ++n < L.length ? line : function () { set(2); }, 320);
          })();
        };
        line();
      }, 950);
    };
    c.addEventListener('click', function (e) { if (!e.target.closest('.a-ab')) return; set(1, true); var b = c.querySelector('.a-ab'); if (b) b.focus(); });
    return set;
  });

  // composer: a real field. With text in it the mic becomes Send, and Send puts the message in the thread
  part('comp', ['Empty', 'Typing', 'Sent'], function (c, k) {
    var LINE = "Who's on tickets?";
    c.innerHTML = '<div class="fyak-col"><div class="fyak-slot" aria-live="polite"></div><form class="a-comp" novalidate><span class="kb">' + K.knot() + '</span><label class="in"><input class="tx" type="text" maxlength="22" placeholder="Message" aria-label="Message" autocomplete="off" enterkeyhint="send">' + ic('plus') + '</label><button type="submit" class="mc" aria-label="Send" disabled>' + ic('mic') + '</button></form></div>';
    var slot = c.querySelector('.fyak-slot'), inp = c.querySelector('input'), mc = c.querySelector('.mc'), form = c.querySelector('form');
    var lit = function () { var on = !!inp.value.trim(); if (on !== mc.classList.contains('snd')) { mc.classList.toggle('snd', on); mc.innerHTML = ic(on ? 'up' : 'mic'); mc.disabled = !on; } };
    var bubble = function (t, read) { slot.innerHTML = K.b(esc(t), { o: 1, t: '8:03 AM', rd: read ? 2 : 1 }); };
    var set = function (s) {
      clear(k); put(k, s); inp.value = '';
      if (s === 2) bubble(LINE, true); else slot.innerHTML = '';
      if (s === 1) { if (reduce) inp.value = LINE; else (function type(i) { inp.value = LINE.slice(0, i); lit(); if (i < LINE.length) later(k, function () { type(i + 1); }, 34); })(1); }
      lit();
    };
    inp.addEventListener('input', function () { clear(k); lit(); put(k, inp.value.trim() ? 1 : (slot.firstChild ? 2 : 0)); });
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var t = inp.value.trim(); if (!t) return; clear(k);
      inp.value = ''; lit(); bubble(t, false); put(k, 2);
      later(k, function () { var rd = slot.querySelector('.rd'); if (rd) rd.innerHTML = ic('dcheck'); }, 900);
    });
    return set;
  });

  // file: the ring closes as it sends
  part('file', ['Ready', 'Sending', 'Sent'], function (c, k) {
    var h = K.file({ o: 1, t: '8:03 AM', rd: 2 }).replace(/<div>(<div class="fn">)/, '<div class="fyak-fb">$1').replace(/<(\/?)div/g, '<$1span').replace('8:03 AM<span class="rd"', '<span class="rd"');
    c.innerHTML = h.replace('<span class="a-b a-file', '<button type="button" class="a-b a-file').replace(/<\/span>$/, '</button>');
    var b = c.querySelector('.a-file'), ring = c.querySelector('.ring circle'), fm = c.querySelector('.fm');
    var arc = function (f, d) { ring.style.setProperty('--d', (reduce ? 0 : d) + 's'); ring.style.strokeDashoffset = 138 * (1 - f); };
    var set = function (s, flow) {
      clear(k); put(k, s); b.classList.toggle('sent', s === 2);
      b.setAttribute('aria-label', s === 0 ? 'Send the file' : s === 1 ? 'Sending the file' : 'File sent. Start again');
      fm.textContent = s === 1 ? 'Sending' : '2.1 GB · full size';
      if (s !== 1) return arc(s === 2 ? 1 : 0, 0);
      arc(0, 0); ring.getBoundingClientRect();
      if (!flow || reduce) return arc(.62, 1.3);
      arc(1, 2.2); later(k, function () { set(2); }, 2350);
    };
    b.addEventListener('click', function () { state[k] === 0 ? set(1, true) : set(0); });
    return set;
  });

  // switches: Public prints the slip on the ticket
  part('sw', ['Private', 'Public', 'Public, RSVP required'], function (c, k) {
    c.innerHTML = '<div class="fyak-set">' + ['Public', 'RSVP required'].map(function (t) { return '<div class="fyak-row"><span>' + t + '</span><button type="button" class="a-switch" role="switch" aria-checked="false" aria-label="' + t + '"></button></div>'; }).join('') + '</div>';
    var sw = [].slice.call(c.querySelectorAll('.a-switch')), on = [false, false];
    var paint = function () {
      sw.forEach(function (b, i) { b.classList.toggle('on', on[i]); b.setAttribute('aria-checked', String(on[i])); });
      put(k, on[0] && on[1] ? 2 : on[0] || on[1] ? 1 : 0, on[0] ? '' : on[1] ? 'Private, RSVP required' : '');
      if (parts.ticket && parts.ticket.pub) parts.ticket.pub(on[0]);
    };
    sw.forEach(function (b, i) { b.addEventListener('click', function () { on[i] = !on[i]; paint(); }); });
    return function (s) { on = [s > 0, s > 1]; paint(); };
  });

  // the wave runs in the order the tiles are read
  order = [].map.call(root.querySelectorAll('.fyak-t'), function (f) { return f.dataset.k; }).filter(function (k) { return parts[k]; });
  order.forEach(function (k, i) { parts[k].fig.style.setProperty('--i', i); });

  // first view: the parts wake one after another. After that the wall changes only when the reader presses
  if (!('IntersectionObserver' in window)) return;
  if (!reduce) root.classList.add('fyak-pre');
  var wall = root.querySelector('.fyak-wall') || root, first = root.querySelector('.fyak-tile') || wall;
  var io = new IntersectionObserver(function (es) {
    if (seen || !es[es.length - 1].isIntersecting) return; seen = true; io.disconnect();
    root.classList.remove('fyak-pre');
    if (reduce) return;
    setTimeout(function () { order.forEach(function (k) { parts[k].fig.style.removeProperty('--i'); }); }, order.length * STEP + 800);
  }, { threshold: .4 });
  io.observe(first);
})();
