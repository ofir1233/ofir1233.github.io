/* Live: the Studio's product screens, working. screens.js draws each screen as the portfolio's storyboard (a few steps that are
   played). In the Studio on its own (no ?screen=key) every screen is opened by hand, so its controls have to answer: owner,
   26.11.2026: "go over every page, make sure the functions work, the filters in Data and so on". screens.js calls
   window.hearLive[key](el, ui, kit) once, the first time a screen is opened; from then on the screen keeps what was done on it.
   Nothing here runs for the portfolio. All names and numbers are SAMPLE DATA. */
(function () {
  var L = window.hearLive = {};
  var ic = function (d, c) { return '<svg class="i' + (c ? ' ' + c : '') + '" viewBox="0 0 18 18">' + d + '</svg>'; };
  var X = '<path d="M5.5 5.5l7 7M12.5 5.5l-7 7"/>', TICK = '<path d="M4 9.5l3.2 3.2L14 5.8"/>';
  var num = function (n) { return n.toLocaleString('en-US'); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var each = function (list, fn) { [].forEach.call(list, fn); };
  /* the stage is zoomed to fit the window: a rect is in screen px, a style is not */
  var zoom = function (n) { return n.getBoundingClientRect().width / n.offsetWidth || 1; };

  /* ---------- shared: a menu under a button, a short note, the side sheet with a way out ---------- */
  var openMenu = null;
  function closeMenu() { if (openMenu) { openMenu.remove(); openMenu = null; } }
  /* items: {t: text, v: value, on: chosen, sub: a quiet second line, sep: a rule above, check: a tick that toggles and keeps the menu} */
  function menu(el, anchor, items, pick, right) {
    var was = openMenu && openMenu._a === anchor; closeMenu(); if (was) return null;
    var m = document.createElement('div'); m.className = 'lv-menu'; m._a = anchor;
    m.innerHTML = items.map(function (it, i) {
      return (it.sep ? '<hr>' : '') + (it.head ? '<small>' + it.head + '</small>' : '<button type="button" data-i="' + i + '" class="' + (it.on ? 'on' : '') + (it.check ? ' chk' : '') + '">' +
        (it.check ? '<i>' + ic(TICK) + '</i>' : '') + '<span>' + it.t + (it.sub ? '<small>' + it.sub + '</small>' : '') + '</span>' + (!it.check && it.on ? ic(TICK) : '') + (it.more ? ic('<path d="M7 5l4 4-4 4"/>') : '') + '</button>');
    }).join('');
    el.appendChild(m);
    var z = zoom(el), a = anchor.getBoundingClientRect(), r = el.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    var x = right ? (a.right - r.left) / z - w : (a.left - r.left) / z, y = (a.bottom - r.top) / z + 6;
    if (y + h > el.offsetHeight - 12) y = Math.max(12, (a.top - r.top) / z - h - 6);
    m.style.left = Math.max(12, Math.min(el.offsetWidth - w - 12, x)) + 'px'; m.style.top = y + 'px';
    m.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var it = items[+b.dataset.i];
      if (it.check) { it.on = !it.on; b.classList.toggle('on', it.on); pick(it, m); return; }
      closeMenu(); pick(it, m);
    });
    openMenu = m; return m;
  }
  addEventListener('pointerdown', function (e) { if (openMenu && !openMenu.contains(e.target) && !(openMenu._a && openMenu._a.contains(e.target))) closeMenu(); }, true);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && openMenu) { closeMenu(); e.stopImmediatePropagation(); } });      /* Esc closes the menu and nothing behind it */

  function flash(el, text) {
    var f = el.querySelector('.lv-flash'); if (!f) { f = document.createElement('div'); f.className = 'lv-flash'; f.setAttribute('role', 'status'); el.appendChild(f); }
    f.textContent = text; f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
    clearTimeout(f._t); f._t = setTimeout(function () { f.classList.remove('on'); }, 2600);
  }
  /* the side sheet of screens.js, with a cross: opened by hand, it has to be closed by hand */
  function sheet(el, ui, html, onClose) {
    ui.side(html);
    var side = el.querySelector('.sx-side'), hd = side.querySelector('header');
    var x = document.createElement('button'); x.type = 'button'; x.className = 'lv-x'; x.setAttribute('aria-label', 'Close'); x.innerHTML = ic(X);
    if (hd) hd.appendChild(x);
    var shut = function () { side.classList.remove('on'); el.classList.remove('side-on'); each(el.querySelectorAll('.hot'), function (n) { n.classList.remove('hot'); }); if (onClose) onClose(); };
    x.addEventListener('click', shut); side._shut = shut;
    return side;
  }
  function shut(el) { var s = el.querySelector('.sx-side'); if (s && s.classList.contains('on') && s._shut) s._shut(); }
  /* Esc closes the sheet that is open on the screen in view (a menu, if one is open, goes first) */
  addEventListener('keydown', function (e) { if (e.key !== 'Escape' || openMenu) return; var on = document.querySelector('.s5 .sx.on'); if (on && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) shut(on); });
  function copy(text) { try { navigator.clipboard.writeText(text); } catch (e) {} }
  L.kit = { menu: menu, flash: flash, sheet: sheet, shut: shut, ic: ic, num: num, esc: esc, each: each, zoom: zoom, copy: copy, X: X, TICK: TICK };

  /* ---------- Data ---------- */
  /* 2,000 calls, made once from a fixed seed, so the page says the same thing on every load. They are made to the numbers the page
     already carries: 148 need review, 62 are high priority, 17 raised an alert, 1,204 are done; 318 are about refunds, 141 of those
     ran over five minutes and 86 of those were unhappy. The first nine are the nine the storyboard shows. */
  L.data = function (el, ui, K) {
    KIT = K;
    var seed = 20261013, rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var of = function (a) { return a[Math.floor(rnd() * a.length)]; };
    var last = {}, say = function (tp) { var t; do t = of(tp[2]); while (t === last[tp[0]]); last[tp[0]] = t; return t; };      /* a topic never says the same thing on two calls in a row */
    var shuffle = function (a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var WHO = ['Daniel Brooks', 'Maya Collins', 'Ryan Cole', 'Paula Nunes', 'Sofia Cruz', 'Alex Ward', 'Nina Vargas', 'Omar Haddad'], ME = 'Maya Chen';
    var TOPICS = [['Refunds & Credits', 0, ['Asks when the refund for a cancelled flight will arrive', 'The refund came short, the seat fee is missing', 'Wants the credit turned back into a refund', 'Charged a fee on a refund that should be free', 'Asks for a refund after a three-hour delay', 'The refund went to a card that is closed', 'Was promised a refund by email and got a voucher', 'Asks why the taxes were not refunded', 'Refund approved two weeks ago, still not paid', 'Wants a refund for a bag that was paid twice']],
      ['Online Booking', 300, ['Books a return trip and asks about the fare rules', 'The payment page froze at the last step', 'Adds a child to an existing booking', 'Cannot find the booking made this morning', 'Asks to pay for part of the trip with points', 'Booked the wrong date and wants it fixed at once', 'The promo code is not accepted at checkout', 'Asks whether the price shown includes a bag', 'Wants to book for a group of twelve', 'The site logged out in the middle of a booking']],
      ['Trip Status', 270, ['Asks whether the evening flight is on time', 'Wants the gate for a connecting flight', 'Asks how long the delay will be', 'Checks that the booking is confirmed', 'Asks whether the connection will be held', 'The app shows two different departure times', 'Asks if the flight is boarding yet', 'Wants to know why the flight shows as cancelled', 'Asks which belt the bags arrive on']],
      ['E-ticket Delivery', 170, ['The e-ticket never reached the inbox', 'Asks for the ticket to be sent to a second address', 'The ticket shows the wrong middle name', 'The ticket attachment will not open', 'Needs the ticket as a PDF for a visa', 'Got the ticket for only one of two travelers']],
      ['Itinerary Questions', 160, ['Asks how long the layover in Lisbon is', 'Wants to know which terminal the flight leaves from', 'Asks whether the bags are checked through', 'Asks if a visa is needed for the stopover', 'Wants the full itinerary read back', 'Asks whether a meal is served on the second leg']],
      ['Changes & Cancellations', 150, ['Moves the flight to a day later', 'Cancels one traveler out of a group of four', 'Asks what a change will cost before deciding', 'Wants to change the name on a ticket', 'Cancels the return and keeps the outbound', 'Asks to move to an earlier flight today']],
      ['Schedule Changes', 130, ['The flight moved by three hours, asks for an earlier one', 'Got a schedule email and asks what changed', 'The new time misses the connection', 'The flight now leaves a day earlier', 'Asks for a hotel after an overnight change']],
      ['Seating & Extras', 120, ['Moves to an aisle seat', 'Pays for extra legroom on the long leg', 'Asks to sit the family together', 'Adds a special meal to the booking', 'Wants a window seat on both flights', 'Asks whether the seat reclines']],
      ['Accessibility Requests', 90, ['Books wheelchair help at both airports', 'Asks to travel with a service dog', 'Needs help boarding with a walking frame', 'Asks to bring an oxygen concentrator on board']],
      ['Complaints & Follow-up', 90, ['Follows up on a complaint filed last week', 'Complains about a rude answer at the gate', 'Asks for a reply to a complaint from August', 'Complains that the lounge was closed']],
      ['Baggage', 90, ['A bag did not arrive, files a report', 'Asks how much a second bag costs', 'The bag arrived with a broken wheel', 'Asks whether skis count as a bag', 'Wants the lost-bag claim number again']],
      ['Loyalty Points', 70, ['Points from the last trip are missing', 'Asks how many points an upgrade takes', 'Wants to move points to a family member', 'Asks when the points expire']],
      ['Payment Issues', 42, ['The card was charged twice', 'The payment was declined with money in the account', 'Asks for an invoice with the company name', 'A pending charge has not been released']]];
    var TW = TOPICS.slice(1).reduce(function (a, t) { return a + t[1]; }, 0);
    var topic = function () { var r = rnd() * TW; for (var i = 1; i < TOPICS.length; i++) { r -= TOPICS[i][1]; if (r < 0) return TOPICS[i]; } return TOPICS[1]; };
    var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var day = function (off) { var d = new Date(2026, 9, 13 - off); return MON[d.getMonth()] + ' ' + d.getDate(); };
    var hm = function (m) { return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); };
    var secs = function (s) { var p = s.split(':'); return p[0] * 60 + +p[1]; };
    /* the storyboard's nine: alert, call, summary, id, time, status, priority, who, length, sentiment, score, outbound */
    var A = [[1, 'Refunds & Credits', 'Asks twice for a refund on a cancelled flight, is offered a voucher', '00002000-r4k', '14:02', 'In progress', 3, 'Daniel Brooks', '6:12', 'Negative', 38, 0],
      [0, 'Online Booking', 'Books two seats to Lisbon and adds a bag at checkout', '00001999-b7m', '13:47', 'Done', 1, 'Maya Collins', '3:05', 'Positive', 82, 0],
      [0, 'Trip Status', 'Asks whether the 18:40 to Madrid is still on time', '00001998-t2x', '13:31', 'Done', 1, 'Ryan Cole', '2:40', 'Neutral', 71, 0],
      [1, 'Refunds & Credits', 'A refund promised ten days ago has not arrived', '00001997-r9d', '13:18', 'In progress', 3, 'Paula Nunes', '7:48', 'Negative', 41, 0],
      [0, 'Seating & Extras', 'Moves to an aisle seat and pays for extra legroom', '00001996-s5q', '12:56', 'Done', 1, 'Sofia Cruz', '1:52', 'Positive', 88, 0],
      [0, 'Refunds & Credits', 'Offered a credit in place of the refund and refuses it', '00001995-r1h', '12:40', 'Pending', 3, 'Alex Ward', '5:27', 'Negative', 35, 1],
      [0, 'Schedule Changes', 'Flight moved by four hours, asks for an earlier one', '00001994-c3v', '12:22', 'Pending', 2, '', '4:10', 'Neutral', 66, 0],
      [1, 'Refunds & Credits', 'Third call about the same refund, asks for a manager', '00001993-r6w', '12:05', 'In progress', 3, 'Maya Collins', '9:03', 'Negative', 29, 0],
      [0, 'E-ticket Delivery', 'The e-ticket never reached the inbox, sent again by email', '00001992-e8n', '11:51', 'Done', 1, 'Ryan Cole', '2:15', 'Positive', 79, 1]];
    var D = A.map(function (r, n) { var t = r[4].split(':'); return { n: n, al: r[0], t: r[1], sm: r[2], id: r[3], off: 0, m: t[0] * 60 + +t[1], st: r[5], pr: r[6], who: r[7], len: secs(r[8]), se: r[9], sc: r[10], out: r[11], rev: 0 }; });
    var N = 2000, ids = []; for (var i = 9; i < N; i++) ids.push(i);
    var o1 = shuffle(ids.slice()), o2 = shuffle(ids.slice()), ref = {}, done = {}, hi = {}, al = {}, rev = {};
    o1.slice(0, 314).forEach(function (k, n) { ref[k] = n < 82 ? 3 : n < 137 ? 2 : 1; });      /* 3 long and unhappy, 2 long, 1 short */
    o2.slice(0, 1200).forEach(function (k) { done[k] = 1; });
    o2.slice(1200, 1258).forEach(function (k, n) { hi[k] = 1; if (n < 14) al[k] = 1; });
    o2.slice(1258, 1406).forEach(function (k) { rev[k] = 1; });
    var off = 0, clock = 11 * 60 + 51, ABC = 'abcdefghjkmnpqrstvwxz';
    for (i = 9; i < N; i++) {
      clock -= 14 + Math.round(rnd() * 36); if (clock < 8 * 60) { off = Math.min(89, off + 1); clock = 19 * 60 + 55 - Math.round(rnd() * 20); }
      var tp = ref[i] ? TOPICS[0] : topic(), r = rnd();
      var se = ref[i] === 3 ? 'Negative' : ref[i] === 2 ? 'Neutral' : ref[i] ? (r < .4 ? 'Negative' : r < .8 ? 'Neutral' : 'Positive') : (r < .06 ? 'Negative' : r < .22 ? 'Neutral' : 'Positive');
      var st = done[i] ? 'Done' : al[i] || rnd() < .4 ? 'In progress' : 'Pending';
      D.push({ n: i, al: al[i] ? 1 : 0, t: tp[0], sm: say(tp), id: ('0000000' + (N - i)).slice(-8) + '-' + tp[0][0].toLowerCase() + Math.floor(rnd() * 9 + 1) + of(ABC), off: off, m: clock,
        st: st, pr: hi[i] ? 3 : done[i] ? (rnd() < .7 ? 1 : 2) : (rnd() < .6 ? 2 : 1), who: st === 'Pending' && rnd() < (hi[i] ? .45 : .35) ? '' : of(WHO),
        len: ref[i] > 1 ? 305 + Math.round(rnd() * 250) : ref[i] ? 90 + Math.round(rnd() * 205) : 80 + Math.round(rnd() * 320),
        se: se, sc: se === 'Negative' ? 24 + Math.round(rnd() * 26) : se === 'Neutral' ? 58 + Math.round(rnd() * 20) : 78 + Math.round(rnd() * 20), out: rnd() < .18 ? 1 : 0, rev: rev[i] ? 1 : 0 });
    }
    var mean = function (list, f) { return list.length ? list.reduce(function (a, r) { return a + r[f]; }, 0) / list.length : 0; };
    var ALLSC = Math.round(mean(D, 'sc')), ALLLEN = Math.round(mean(D, 'len'));

    /* what is being looked at */
    var TABS = [['All calls', function () { return true; }], ['Needs review', function (r) { return r.rev; }], ['High priority', function (r) { return r.pr === 3; }], ['Alerts', function (r) { return r.al; }], ['Done', function (r) { return r.st === 'Done'; }], ['Agent evaluation', function (r) { return r.who; }]];
    var RANGE = [['Today', 1], ['Last 7 days', 7], ['Last 30 days', 30], ['Last 90 days', 90]];
    var COLS = [['Call', 't'], ['ID', 'n'], ['Call date', 'n'], ['Status', 'st'], ['Priority', 'pr'], ['Assigned to', 'who'], ['Direction', 'out'], ['Length', 'len'], ['Sentiment', 'se'], ['Score', 'sc']];
    var S = { tab: 0, q: '', range: 3, conds: [], sort: 2, dir: 1, page: 0, hide: {}, sel: {}, saved: false };
    var PER = 9, PR = ['', 'Low', 'Medium', 'High'], STC = { 'In progress': 'ip', 'Done': 'dn', 'Pending': 'pd' };
    var test = function (c, r) {
      if (c.k === 'Topic') return r.t === c.v; if (c.k === 'Status') return r.st === c.v; if (c.k === 'Priority') return PR[r.pr] === c.v;
      if (c.k === 'Sentiment') return r.se === c.v; if (c.k === 'Direction') return (r.out ? 'Outbound' : 'Inbound') === c.v;
      if (c.k === 'Assigned to') return c.v === 'Unassigned' ? !r.who : r.who === c.v; if (c.k === 'Alert') return !!r.al;
      if (c.set) return !!c.set[r.n];
      if (c.k === 'Length') return c.op === 'over' ? r.len > c.n * 60 : r.len < c.n * 60; if (c.k === 'Score') return c.op === 'over' ? r.sc > c.n : r.sc < c.n;
      return true;
    };
    var label = function (c) { return c.k === 'Length' ? c.op + ' ' + c.n + ' min' : c.k === 'Score' ? c.op + ' ' + c.n : c.k === 'Alert' ? 'raised' : c.v; };
    function rows() {
      var q = S.q.toLowerCase(), days = RANGE[S.range][1], f = TABS[S.tab][1];
      var out = D.filter(function (r) { return r.off < days && f(r) && S.conds.every(function (c) { return test(c, r); }) && (!q || (r.t + ' ' + r.sm + ' ' + r.id + ' ' + r.who).toLowerCase().indexOf(q) >= 0); });
      var k = COLS[S.sort][1], d = S.dir;
      /* the newest call has the lowest n: "Call date, newest first" is n going up */
      out.sort(function (a, b) { var x = a[k], y = b[k]; if (k === 'n') return (x - y) * d; return x < y ? d : x > y ? -d : a.n - b.n; });
      /* Agent evaluation is the view a coach opens: the lowest scores lead, until a column is asked for */
      if (S.tab === 5 && S.sort === 2 && S.dir === 1) out.sort(function (a, b) { return a.sc - b.sc || a.n - b.n; });
      return out;
    }

    /* the page's parts */
    var card = el.querySelector('.card'), tabs = el.querySelector('.dt-tabs'), bar = el.querySelector('.dt-bar'), head = el.querySelector('.dt-r.hd'), body = el.querySelector('.dt-body'), foot = el.querySelector('.dt-foot');
    el.classList.add('lv'); el.dataset.st = 0;
    each(bar.querySelectorAll('.dt-f'), function (c) { c.remove(); });
    body.innerHTML = '<div class="dt-set all"></div>'; var set = body.firstChild;
    var dateB = bar.querySelector('.dt-btn'), addB = bar.querySelector('.dt-btn.add'), nEl = bar.querySelector('.dt-n'), colB = bar.querySelectorAll('.dt-btn')[2];
    dateB.classList.add('lv-b'); addB.classList.add('lv-b'); colB.classList.add('lv-b');
    /* the field that was a picture of a field */
    var ask = el.querySelector('.dt-ask'), tx0 = ask.querySelector('.tx'), tx = document.createElement('input');
    tx.className = 'tx'; tx.type = 'text'; tx.placeholder = 'Filter in plain words'; tx.setAttribute('aria-label', 'Filter in plain words'); tx.autocomplete = 'off'; tx0.replaceWith(tx);
    var send = ask.querySelector('.dt-send'); send.setAttribute('role', 'button');
    var sr = el.querySelector('.dt-search'), si = document.createElement('input');
    si.type = 'text'; si.placeholder = 'Search calls'; si.setAttribute('aria-label', 'Search calls'); si.autocomplete = 'off'; sr.querySelector('span').replaceWith(si);
    var note = document.createElement('p'); note.className = 'lv-note'; ask.insertAdjacentElement('afterend', note);
    /* what is selected, and what can be done with it: a bar of its own over the table's foot, so the count under it stays the table's */
    var selbar = document.createElement('div'); selbar.className = 'lv-selbar'; selbar.setAttribute('role', 'toolbar');
    selbar.innerHTML = '<span></span><button type="button" class="lv-t" data-do="done">Mark done</button><button type="button" class="lv-t" data-do="mine">Assign to me</button><button type="button" class="lv-t" data-do="csv">Export</button><button type="button" class="lv-t x" data-do="none" aria-label="Clear the selection">' + ic(X) + '</button>';
    el.appendChild(selbar);
    /* the plain-words field shows what it can be asked, while it is empty and in focus */
    var EX = ['refund calls over 5 minutes where the customer was unhappy', 'high priority calls nobody is assigned to', 'calls that scored under 60 last week', 'outbound calls about baggage'];
    var sugg = document.createElement('div'); sugg.className = 'lv-sugg';
    sugg.innerHTML = '<small>Try asking for</small>' + EX.map(function (q) { return '<button type="button" tabindex="-1">' + ic('<path d="M9 2.5l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/>') + q + '</button>'; }).join('');
    ask.appendChild(sugg);
    var hint = function () { ask.classList.toggle('sg', document.activeElement === tx && !tx.value.trim()); };
    tx.addEventListener('focus', hint); tx.addEventListener('blur', function () { setTimeout(hint, 120); });
    sugg.addEventListener('mousedown', function (e) { var b = e.target.closest('button'); if (!b) return; e.preventDefault(); tx.value = b.textContent; ask.classList.add('has'); hint(); submit(); });

    var cell = function (r) {
      return ['<span class="cl"><b>' + esc(r.t) + (r.al ? ic('<path d="M9 3.4 15.2 14H2.8z"/><path d="M9 7.6v3M9 12.2v.1"/>', 'wn') : '') + '</b><small>' + r.sm + '</small></span>',
        '<span class="id">' + r.id + '<button type="button" class="cp" aria-label="Copy the call id">' + ic('<rect x="6.5" y="6.5" width="8" height="8" rx="2"/><path d="M4 11.5h-.2a1.3 1.3 0 0 1-1.3-1.3V4.8a1.3 1.3 0 0 1 1.3-1.3h5.4a1.3 1.3 0 0 1 1.3 1.3V5"/>') + '</button></span>',
        '<span class="dc">' + day(r.off) + '<small>' + hm(r.m) + '</small></span>',
        '<span><i class="dt-st ' + STC[r.st] + '">' + r.st + '</i></span>',
        '<span class="pr"><i class="p' + r.pr + '"><u></u><u></u><u></u></i>' + PR[r.pr] + '</span>',
        r.who ? '<span class="ag">' + K.av(r.who) + '<em>' + r.who + '</em></span>' : '<span class="ag none"><i class="sx-av"></i><em>Unassigned</em></span>',
        '<span class="dr">' + (r.out ? 'Outbound' : 'Inbound') + '</span>',
        '<span class="du">' + hm(r.len) + '</span>',
        '<span class="se"><i class="' + (r.se === 'Negative' ? 'neg' : r.se === 'Neutral' ? 'neu' : '') + '"></i>' + r.se + '</span>',
        '<span class="sc ' + (r.sc < 60 ? 'b1' : r.sc < 70 ? 'b2' : r.sc < 80 ? 'b3' : r.sc < 90 ? 'b4' : 'b5') + '">' + r.sc + '</span>'];
    };
    /* the call keeps room for its title in a narrow window: the table scrolls sideways before the id runs over the title */
    var WIDTH = ['minmax(250px,1fr)', '108px', '60px', '96px', '80px', '134px', '66px', '46px', '98px', '42px'];
    var shown = function () { return COLS.map(function (c, i) { return i; }).filter(function (i) { return !S.hide[i]; }); };
    var list = [], first = true;
    /* the table takes the rows its height has room for (a row is 56px), so a tall window is not half empty and a short one is not squeezed */
    function fit() { var h = body.clientHeight; return h ? Math.max(5, Math.floor(h / 56)) : 9; }
    function paint(keep) {
      PER = fit(); list = rows(); var pages = Math.max(1, Math.ceil(list.length / PER)); if (!keep) S.page = 0; S.page = Math.min(S.page, pages - 1);
      var cols = shown(), page = list.slice(S.page * PER, S.page * PER + PER), filtered = S.conds.length || S.q;
      el.style.setProperty('--dt-cols', '16px ' + cols.map(function (i) { return WIDTH[i]; }).join(' '));
      el.style.setProperty('--dt-min', (16 + cols.reduce(function (w, i) { return w + (parseInt(WIDTH[i], 10) || 250) + 14; }, 0)) + 'px');
      el.classList.toggle('flt', !!filtered); el.classList.toggle('cnd', S.conds.length > 0 && list.length > 0);
      each(tabs.children, function (t, i) { t.classList.toggle('on', i === S.tab); });
      /* the bar: the range, the conditions, the way to add one */
      dateB.innerHTML = ic('<rect x="3" y="4" width="12" height="11" rx="2.5"/><path d="M3 7.5h12M6.5 2.5v3M11.5 2.5v3"/>') + RANGE[S.range][0] + K.chev;
      each(bar.querySelectorAll('.dt-f'), function (c) { c.remove(); });
      addB.insertAdjacentHTML('beforebegin', S.conds.map(function (c, i) { return '<span class="dt-f' + (c.ai ? '' : ' man') + (c.fresh ? ' lv-new' : '') + '" data-i="' + i + '" style="--n:' + i + '">' + c.k + ' <b>' + esc(label(c)) + '</b><button type="button" aria-label="Remove ' + c.k + '">' + ic(X, 'x') + '</button></span>'; }).join(''));
      S.conds.forEach(function (c) { c.fresh = 0; });
      nEl.innerHTML = '<b>' + num(list.length) + '</b> of ' + num(N) + ' calls';
      colB.innerHTML = ic('<rect x="3" y="3.5" width="12" height="11" rx="2.5"/><path d="M7.2 3.5v11M10.8 3.5v11"/>') + 'Columns<b>' + cols.length + '</b>';
      var allSel = page.length && page.every(function (r) { return S.sel[r.n]; });
      head.innerHTML = '<i class="ck' + (allSel ? ' on' : '') + '" role="checkbox" tabindex="0" aria-label="Select the page">' + ic(TICK) + '</i>' + cols.map(function (i) {
        return '<span class="h' + (i === S.sort ? ' srt' : '') + (i === 7 ? ' du' : '') + (i === 9 ? ' rt' : '') + (i === 8 ? ' se' : '') + '" data-c="' + i + '" role="button" tabindex="0">' + COLS[i][0] + (i === S.sort ? ic(S.dir > 0 ? '<path d="M9 4v10M5.5 10.5 9 14l3.5-3.5"/>' : '<path d="M9 14V4M5.5 7.5 9 4l3.5 3.5"/>') : '') + '</span>'; }).join('');
      set.innerHTML = page.length ? page.map(function (r, n) { var c = cell(r);
        return '<div class="dt-r' + (S.sel[r.n] ? ' sel' : '') + '" data-n="' + r.n + '" style="--n:' + n + '" tabindex="0"><i class="ck' + (S.sel[r.n] ? ' on' : '') + '" role="checkbox" aria-label="Select the call">' + ic(TICK) + '</i>' + cols.map(function (i) { return c[i]; }).join('') + '</div>'; }).join('')
        : '<div class="lv-none"><b>No calls match</b><span>Nothing in ' + RANGE[S.range][0].toLowerCase() + ' fits ' + (S.q ? '“' + esc(S.q) + '”' : 'these conditions') + '.</span><button type="button" class="act">Clear the filters</button></div>';
      if (!first) { set.classList.remove('is-new'); void set.offsetWidth; set.classList.add('is-new'); } first = false;
      /* the foot: what is shown, what was found against all calls, the pages */
      var picked = Object.keys(S.sel).length, at = S.page * PER;
      selbar.classList.toggle('on', picked > 0); el.classList.toggle('pk', picked > 0); if (picked) selbar.firstChild.innerHTML = '<b>' + picked + '</b> selected';
      foot.querySelector('.ct').innerHTML = list.length ? '<span class="rg"><b>' + (at + 1) + '–' + (at + page.length) + '</b> of </span><span class="of">' + num(list.length) + '</span> calls' : '<span class="of">0</span> calls';
      var sc = Math.round(mean(list, 'sc')), ln = Math.round(mean(list, 'len')), av = foot.querySelector('.av'), bcls = function (v) { return v < 60 ? 'b1' : v < 80 ? 'b3' : 'hi'; };
      av.innerHTML = list.length ? '<i></i><span>Average score <b class="p ' + bcls(sc) + '">' + sc + '</b><small>against <b class="p ' + bcls(ALLSC) + '">' + ALLSC + '</b><em> for all calls</em></small></span><i></i><span class="ln">Average length <b>' + hm(ln) + '</b><small>against <b>' + hm(ALLLEN) + '</b></small></span>' : '';
      var sig = foot.querySelector('.sig'); sig.textContent = S.saved ? 'Saved as a signal' : 'Save as a signal'; sig.classList.toggle('made', S.saved); sig.disabled = S.saved;
      var pg = foot.querySelector('.pg'), near = [0, 1, 2].map(function (d) { return Math.max(0, Math.min(pages - 3, S.page - 1)) + d; }).filter(function (p) { return p >= 0 && p < pages; });
      pg.innerHTML = '<button type="button" data-p="' + (S.page - 1) + '"' + (S.page ? '' : ' disabled') + ' aria-label="Previous page">' + ic('<path d="M11 5l-4 4 4 4"/>') + '</button>' +
        near.map(function (p) { return '<button type="button" data-p="' + p + '"' + (p === S.page ? ' class="on"' : '') + '>' + (p + 1) + '</button>'; }).join('') +
        (pages > near[near.length - 1] + 1 ? (pages > near[near.length - 1] + 2 ? '<em>…</em>' : '') + '<button type="button" class="last" data-p="' + (pages - 1) + '">' + pages + '</button>' : '') +
        '<button type="button" data-p="' + (S.page + 1) + '"' + (S.page < pages - 1 ? '' : ' disabled') + ' aria-label="Next page">' + ic('<path d="M7 5l4 4-4 4"/>') + '</button>';
    }
    /* the views count themselves, so a tab never promises a number the table does not show */
    each(tabs.children, function (t, i) { t.setAttribute('role', 'button'); t.tabIndex = 0; var s = t.querySelector('small'); if (s) s.textContent = num(D.filter(TABS[i][1]).length); });

    /* a filter in plain words: each thing the sentence names becomes one condition anyone can read and remove */
    var WORDS = [['Topic', 'Refunds & Credits', /refund|credit/], ['Topic', 'Online Booking', /booking|\bbook\b/], ['Topic', 'Trip Status', /trip status|on time|flight status/], ['Topic', 'E-ticket Delivery', /e-?ticket/],
      ['Topic', 'Itinerary Questions', /itinerar|layover/], ['Topic', 'Changes & Cancellations', /cancel|change/], ['Topic', 'Schedule Changes', /schedule/], ['Topic', 'Seating & Extras', /seat|legroom|upgrade/],
      ['Topic', 'Accessibility Requests', /accessib|wheelchair/], ['Topic', 'Complaints & Follow-up', /complain|follow.?up/], ['Topic', 'Baggage', /bag(gage)?s?\b|luggage/], ['Topic', 'Loyalty Points', /loyalty|points/], ['Topic', 'Payment Issues', /payment|charged/],
      ['Sentiment', 'Negative', /unhappy|negative|angry|upset|frustrat|annoyed|not happy/], ['Sentiment', 'Positive', /\bhappy|positive|satisfied|pleased/], ['Sentiment', 'Neutral', /neutral/],
      ['Status', 'In progress', /in progress|being worked|open/], ['Status', 'Pending', /pending|waiting|not started/], ['Status', 'Done', /\bdone\b|resolved|closed|finished/],
      ['Priority', 'High', /high priority|urgent|high-priority/], ['Priority', 'Medium', /medium priority/], ['Priority', 'Low', /low priority/],
      ['Direction', 'Outbound', /outbound|we called/], ['Direction', 'Inbound', /inbound/], ['Assigned to', 'Unassigned', /unassigned|not assigned|no owner|nobody/], ['Alert', 'raised', /alert/]];
    function read(text) {
      var s = ' ' + text.toLowerCase() + ' ', out = [], has = {}, m;
      WORDS.forEach(function (w) { if (has[w[0]]) return; if (w[1] === 'Positive' && /unhappy|not happy/.test(s)) return; if (w[1] === 'Changes & Cancellations' && /schedule/.test(s)) return;
        if (w[2].test(s)) { has[w[0]] = 1; out.push({ k: w[0], v: w[1] }); } });
      WHO.forEach(function (w) { if (!has['Assigned to'] && s.indexOf(w.toLowerCase()) >= 0 || !has['Assigned to'] && new RegExp('\\b' + w.split(' ')[0].toLowerCase() + '\\b').test(s)) { has['Assigned to'] = 1; out.push({ k: 'Assigned to', v: w }); } });
      if ((m = /(over|more than|longer than|above|at least)\s+(\d+)\s*(min|minute)/.exec(s))) out.push({ k: 'Length', op: 'over', n: +m[2] });
      else if ((m = /(under|less than|shorter than|below)\s+(\d+)\s*(min|minute)/.exec(s))) out.push({ k: 'Length', op: 'under', n: +m[2] });
      else if (/\blong\b/.test(s)) out.push({ k: 'Length', op: 'over', n: 5 }); else if (/\bshort\b/.test(s)) out.push({ k: 'Length', op: 'under', n: 2 });
      if ((m = /scor\w*\s+(?:of\s+)?(under|below|less than|lower than)\s+(\d+)/.exec(s))) out.push({ k: 'Score', op: 'under', n: +m[2] });
      else if ((m = /scor\w*\s+(?:of\s+)?(over|above|more than|higher than)\s+(\d+)/.exec(s))) out.push({ k: 'Score', op: 'over', n: +m[2] });
      else if (/low scor|scored low|bad scor/.test(s)) out.push({ k: 'Score', op: 'under', n: 60 }); else if (/high scor|scored high|best scor/.test(s)) out.push({ k: 'Score', op: 'over', n: 90 });
      var range = /today/.test(s) ? 0 : /last week|this week|7 days|past week/.test(s) ? 1 : /last month|this month|30 days/.test(s) ? 2 : -1;
      return { conds: out, range: range };
    }
    var busy = 0;
    function submit() {
      var text = tx.value.trim(); if (!text || busy) return;
      var got = read(text); note.textContent = '';
      if (!got.conds.length && got.range < 0) { note.textContent = 'No filter found in that. Try “refund calls over 5 minutes where the customer was unhappy”.'; return; }
      /* a beat while it is read, then the conditions land one after the other and the table answers */
      busy = 1; ask.classList.add('rd');
      setTimeout(function () { busy = 0; ask.classList.remove('rd', 'has');
        S.conds = S.conds.filter(function (c) { return !c.ai; }).concat(got.conds.map(function (c) { c.ai = 1; c.fresh = 1; return c; }));
        if (got.range >= 0) S.range = got.range; S.saved = false; S.sel = {}; paint(); }, 520);
    }
    tx.addEventListener('input', function () { ask.classList.toggle('has', !!tx.value.trim()); note.textContent = ''; hint(); });
    tx.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    send.addEventListener('click', submit);
    si.addEventListener('input', function () { S.q = si.value.trim(); paint(); });
    /* "/" goes to the search, as its key says */
    addEventListener('keydown', function (e) { if (e.key === '/' && el.classList.contains('on') && K.stage.classList.contains('s5') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); si.focus(); } });

    var VALUES = { 'Topic': TOPICS.map(function (t) { return t[0]; }), 'Status': ['Pending', 'In progress', 'Done'], 'Priority': ['High', 'Medium', 'Low'], 'Assigned to': ['Unassigned'].concat(WHO), 'Sentiment': ['Negative', 'Neutral', 'Positive'], 'Direction': ['Inbound', 'Outbound'],
      'Length': [['over', 5], ['over', 10], ['under', 2]], 'Score': [['under', 60], ['under', 70], ['over', 90]] };
    function addCond(c) { S.conds = S.conds.filter(function (x) { return x.k !== c.k; }).concat([c]); c.fresh = 1; S.saved = false; S.sel = {}; paint(); }
    function fields() {
      menu(el, addB, [{ head: 'Filter by' }].concat(Object.keys(VALUES).map(function (k) { return { t: k, v: k, more: 1 }; })), function (it) {
        setTimeout(function () { menu(el, addB, [{ head: it.v }].concat(VALUES[it.v].map(function (v) { return typeof v === 'string' ? { t: v, v: { k: it.v, v: v } } : { t: v[0] + ' ' + v[1] + (it.v === 'Length' ? ' min' : ''), v: { k: it.v, op: v[0], n: v[1] } }; })), function (p) { addCond(p.v); }); }, 0);
      });
    }
    function exportCsv(only) {
      var cols = shown(), src = only || list, csv = [cols.map(function (i) { return COLS[i][0]; }).join(',')].concat(src.map(function (r) {
        var v = [r.t + ': ' + r.sm, r.id, day(r.off) + ' ' + hm(r.m), r.st, PR[r.pr], r.who || 'Unassigned', r.out ? 'Outbound' : 'Inbound', hm(r.len), r.se, r.sc];
        return cols.map(function (i) { return '"' + String(v[i]).replace(/"/g, '""') + '"'; }).join(','); })).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'northwind-calls.csv'; document.body.appendChild(a); a.click(); a.remove();
      flash(el, 'Exported ' + num(src.length) + (src.length === 1 ? ' call' : ' calls') + ' to northwind-calls.csv');
    }
    var up = document.createElement('input'); up.type = 'file'; up.multiple = true; up.accept = 'audio/*,.csv,.zip'; up.hidden = true; el.appendChild(up);
    var proc = el.querySelector('.dt-proc'), procN = 3, PROC = [['calls-oct-13-evening.zip', '212 calls · transcribing'], ['callback-queue.csv', '48 calls · scoring'], ['lisbon-desk-oct-12.zip', '96 calls · scoring']];
    proc.setAttribute('role', 'button'); proc.tabIndex = 0;
    proc.addEventListener('click', function (e) { e.stopPropagation(); menu(el, proc, [{ head: 'Being processed' }].concat(PROC.map(function (f) { return { t: f[0], sub: f[1], v: 0 }; })), function () {}); });
    up.addEventListener('change', function () { var n = up.files.length; if (!n) return; each(up.files, function (f) { PROC.unshift([f.name, 'just added · transcribing']); }); procN += n; proc.lastChild.textContent = 'Processing ' + procN; flash(el, n + (n > 1 ? ' files are' : ' file is') + ' being processed'); up.value = ''; });

    /* ---------- Explore: the call itself ---------- */
    /* owner, 26.11.2026: "the Explore screen does not exist when you enter a call". A row opened a small sheet of the row's own
       fields. Now it opens the call's page, as the product's Data does: the analysis on the left (what the call was, how it ended,
       the evaluation with the moments behind its low scores, the signals, the caller's other calls) and the evidence on the right
       (the recording in chapters and the transcript, which follows playback; any time on the page seeks). SAMPLE call, made from
       the row so the page always agrees with the table. */
    var ex = document.createElement('div'); ex.className = 'glass sx lv'; ex.id = 'sx-explore'; K.stage.appendChild(ex);
    var CRIT = ['Greeting', 'Verification', 'Discovery', 'Resolution', 'Compliance', 'Empathy', 'Closing'];
    var FOUND = { Greeting: ['Opened without the company name', 0], Verification: ['Checked one detail, not two', 2], Discovery: ['Did not ask what the customer needed first', 1], Resolution: ['The request was left open at the end of the call', -3], Compliance: ['The recording disclosure was not read', 0], Empathy: ['No acknowledgement of the customer’s frustration', 5], Closing: ['Closed without confirming the next step', -1] };
    var band = function (v) { return v < 60 ? 'b1' : v < 70 ? 'b2' : v < 80 ? 'b3' : v < 90 ? 'b4' : 'b5'; };
    var mmss = function (s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); };
    function script(r) {
      var a = (r.who || 'Maya Collins').split(' ')[0], bad = r.se === 'Negative', fam = /Refund/.test(r.t) ? 0 : /Booking|Seating|Loyalty|Payment/.test(r.t) ? 1 : /Status|E-ticket|Itinerary|Baggage|Accessib/.test(r.t) ? 2 : 3;
      var open = [['A', 'Thank you for calling Northwind, this is ' + a + '. How can I help?']], check = [['A', 'Of course. Can I have your booking reference and your date of birth?'], ['C', 'It’s NW4K7P, the third of May, 1984.'], ['A', 'Thank you, I have the booking in front of me.']];
      var mid = [
        bad ? [['C', 'My flight was cancelled and I want my money back.'], 0, ['A', 'I can see the cancellation. I can offer you a voucher for the full amount.'], ['C', 'I’d like a refund for the cancelled flight, please.', 1], ['A', 'I understand. The voucher is valid for a year on any route.'], ['C', 'I asked for a refund, not a voucher.', 1], ['A', 'Let me check what I can do. One moment, please.'], ['A', 'I’ve opened a refund request. It can take up to ten working days.'], ['C', 'Ten days. Please send me that in writing.']]
            : [['C', 'My flight was cancelled and I’d like to know when the refund arrives.'], 0, ['A', 'I can see the cancellation. The refund was approved on Monday.'], ['C', 'So when does it reach my card?'], ['A', 'Within five working days. I’ll send you the confirmation now.'], ['C', 'That’s what I needed, thank you.']],
        [['C', 'I’m trying to book two seats and the page froze at the last step.'], 0, ['A', 'I see the booking did not go through. I can finish it for you now.'], ['C', 'Yes, please. And add one bag.'], ['A', 'Done. Two seats and one bag, 312 euros in all.'], ['C', 'Great, thank you.']],
        [['C', 'I wanted to check that everything is in order for my flight this evening.'], 0, ['A', 'It is on time. Boarding is from gate B12 at five past six.'], ['C', 'And my bag is checked through?'], ['A', 'Yes, to your final stop. You don’t need to collect it on the way.'], ['C', 'Perfect, thanks.']],
        [['C', 'I need to move my flight to a day later.'], 0, ['A', 'I can move you to the same time on Thursday. There is a change fee of 45 euros.'], ['C', 'That’s fine, go ahead.'], ['A', 'It’s done. The new ticket is on its way to your inbox.'], ['C', 'Thank you.']]][fam];
      var end = bad ? [['A', 'You’ll have an email within the hour. Is there anything else?'], ['C', fam ? 'No. This is the second time I’ve had to call about this.' : 'No. Goodbye.']] : [['A', 'You’ll have an email in a few minutes. Is there anything else I can help with?'], ['C', 'No, that’s all. Thanks, ' + a + '.'], ['A', 'Thank you for flying Northwind. Have a good day.']];
      var lines = open.concat([mid[0]], check, mid.slice(2), end), n = lines.length;
      return lines.map(function (l, i) { return { who: l[0], text: l[1], hot: l[2], at: Math.round(r.len * (i === 0 ? .01 : (i + .35) / (n + .4))), ch: i < 1 ? 0 : i < 5 ? 1 : i < n - end.length - 1 ? 2 : i < n - end.length ? 3 : 4 }; });
    }
    var CH = ['Greeting', 'Verification', 'The request', 'Resolution', 'Closing'], playing = 0, timer = 0, T0 = 0, speed = 1, cur = null;
    function explore(r) {
      cur = r; clearInterval(timer); playing = 0; T0 = 0; speed = 1;
      var lines = script(r), seed = r.n * 31 + 7, rr = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }, bad = r.se === 'Negative';
      /* the seven criteria average to the call's score: an unhappy call opens and verifies well enough and fails where it counts */
      var OFF = bad ? [22, 16, 4, -18, -14, -12, 2] : [6, -3, 2, 4, 5, -8, -6], jit = CRIT.map(function () { return Math.round((rr() - .5) * 8); }), mj = Math.round(jit.reduce(function (x, y) { return x + y; }, 0) / 7);
      var sc = CRIT.map(function (c, i) { return Math.max(18, Math.min(99, r.sc + OFF[i] + jit[i] - mj)); });
      var low = CRIT.map(function (c, i) { return [c, sc[i], i]; }).filter(function (x) { return x[1] < 70; }).sort(function (x, y) { return x[1] - y[1]; });
      var chs = CH.map(function (c, k) { var mine = lines.filter(function (l) { return l.ch === k; }); return { n: c, at: mine.length ? mine[0].at : 0 }; }).filter(function (c, k) { return lines.some(function (l) { return l.ch === k; }); });
      chs.forEach(function (c, k) { c.at = k ? c.at : 0; c.end = chs[k + 1] ? chs[k + 1].at : r.len; });
      var pos = list.indexOf(r), NB = 110, wave = '';
      /* the recording, drawn: one stroke for each moment, in the colour of who is speaking then */
      for (var w = 0; w < NB; w++) { var tk = (w + .5) / NB * r.len, sp = 'A'; lines.forEach(function (l) { if (l.at <= tk) sp = l.who; });
        var near = lines.some(function (l) { return Math.abs(l.at - tk) < r.len / NB * .7; }); wave += '<i class="' + (sp === 'A' ? 'a' : 'c') + '" style="height:' + Math.round(near ? 16 + rr() * 14 : 34 + rr() * 66) + '%"></i>'; }
      var seekB = function (s, label) { return '<button type="button" class="ex-at" data-t="' + s + '">' + ic('<path d="M6 4.2v9.6l7.5-4.8z"/>') + (label || mmss(s)) + '</button>'; };
      var sig = [['Reason for call', r.t], ['What the customer wanted', r.sm], ['Resolved on the call', r.st === 'Done' ? 'Yes' : 'No'], ['Refund asked for', /Refund/.test(r.t) ? 'Yes' : 'No'], ['Customer effort', bad ? 'High: asked more than once' : 'Low'], ['Next step', r.st === 'Done' ? 'None' : r.st === 'Pending' ? 'Waiting for an owner' : 'With ' + (r.who || 'the team')]];
      var hist = [[day(r.off + 3 + r.n % 4), r.t, Math.max(25, r.sc - 6 + r.n % 9)], [day(r.off + 11 + r.n % 6), ['Trip Status', 'Online Booking', 'Baggage'][r.n % 3], 60 + r.n % 35]].slice(0, bad ? 2 : 1);
      ex.innerHTML = '<div class="card"><div class="ex-top"><button type="button" class="ex-back">' + ic('<path d="M11 5l-4 4 4 4"/>') + 'Data</button>' + (pos >= 0 ? '<span class="ex-nav"><button type="button" class="ex-pv"' + (pos ? '' : ' disabled') + ' aria-label="Previous call">' + ic('<path d="M11 5l-4 4 4 4"/>') + '</button><em>' + num(pos + 1) + ' of ' + num(list.length) + '</em><button type="button" class="ex-nx"' + (pos < list.length - 1 ? '' : ' disabled') + ' aria-label="Next call">' + ic('<path d="M7 5l4 4-4 4"/>') + '</button></span>' : '') + '<span class="ex-id">' + r.id + '</span><span class="sp"></span>' + K.act(r.who === ME ? 'Assigned to you' : 'Assign to me', 'ex-mine') + K.act(r.st === 'Done' ? 'Done' : 'Mark done', 'ink ex-done') + '</div>' +
        '<div class="ex-cols"><div class="ex-l"><div class="ex-story"><h2>' + esc(r.t) + (r.al ? '<span class="sx-tag ex-al">' + ic('<path d="M9 3.4 15.2 14H2.8z"/><path d="M9 7.6v3M9 12.2v.1"/>') + 'Alert · Refund refused</span>' : '') + '</h2><p>' + r.sm + '.</p>' +
          '<div class="ex-tags"><span>' + day(r.off) + ' · ' + hm(r.m) + '</span><span>' + (r.out ? 'Outbound' : 'Inbound') + '</span><span>' + (r.who ? K.av(r.who) + r.who : 'Unassigned') + '</span><span>' + PR[r.pr] + ' priority</span><i class="dt-st ' + STC[r.st] + '">' + r.st + '</i></div></div>' +
        '<div class="ex-out"><div><small>Sentiment</small><b><i class="dot ' + (bad ? 'neg' : r.se === 'Neutral' ? 'neu' : 'pos') + '"></i>' + r.se + '</b></div><div><small>Resolution</small><b>' + (r.st === 'Done' ? 'Resolved' : 'Open') + '</b></div><div><small>Churn risk</small><b>' + (bad ? 'High' : r.se === 'Neutral' ? 'Medium' : 'Low') + '</b></div><div><small>Handle time</small><b>' + mmss(r.len) + '</b></div><div><small>Score</small><b><span class="lv-sc ' + band(r.sc) + '">' + r.sc + '</span></b></div></div>' +
        '<section class="ex-sec"><header><b>Evaluation</b><span>' + r.sc + ' / 100 · all calls average ' + ALLSC + '</span></header><div class="ex-ev">' + CRIT.map(function (c, i) { var f = FOUND[c], li = lines[f[1] < 0 ? lines.length + f[1] : Math.min(lines.length - 1, f[1])], isLow = sc[i] < 70;
            return '<div class="ex-cr' + (isLow ? ' low' : '') + '"' + (isLow ? ' role="button" tabindex="0"' : '') + '><span>' + c + '</span><i><u class="' + band(sc[i]) + '" style="width:' + sc[i] + '%"></u></i><b class="lv-sc ' + band(sc[i]) + '">' + sc[i] + '</b>' + (isLow ? ic('<path d="M5 7.5l4 4 4-4"/>') + '<p>' + f[0] + '.<em>“' + li.text + '”</em>' + seekB(li.at, 'Play from ' + mmss(li.at)) + '</p>' : '') + '</div>'; }).join('') + '</div>' +
          (low.length ? '' : '<p class="ex-note">Every criterion passed. Nothing to review on this call.</p>') + '</section>' +
        (r.al ? '<section class="ex-sec"><header><b>Alerts on this call</b><span>1 monitor fired</span></header>' + lines.filter(function (l) { return l.hot; }).map(function (l) { return '<div class="ex-alr"><span class="sx-tag ex-al">Refund refused</span><em>“' + l.text + '”</em>' + seekB(l.at) + '</div>'; }).join('') + '</section>' : '') +
        '<section class="ex-sec"><header><b>Signals</b><span>' + sig.length + ' read from the call</span></header><dl class="ex-sig">' + sig.map(function (s) { return '<dt>' + s[0] + '</dt><dd>' + esc(s[1]) + '</dd>'; }).join('') + '</dl></section>' +
        '<section class="ex-sec"><header><b>The caller’s other calls</b><span>' + hist.length + ' in the last 90 days</span></header>' + hist.map(function (h) { return '<div class="ex-h"><span>' + h[0] + '</span><b>' + esc(h[1]) + '</b><span class="lv-sc ' + band(h[2]) + '">' + h[2] + '</span></div>'; }).join('') + '</section>' +
        '<section class="ex-ask"><div class="ex-msgs"></div><div class="ex-chips">' + ['Summarize this call', bad ? 'Why was the customer unhappy?' : 'What went well?', 'What should the agent do next time?'].map(function (q) { return '<button type="button">' + q + '</button>'; }).join('') + '</div><form class="ex-comp"><input type="text" placeholder="Ask about this call" aria-label="Ask about this call" autocomplete="off"><button type="submit" aria-label="Send">' + ic('<path d="M9 13.5v-9M5.2 8.3 9 4.5l3.8 3.8"/>') + '</button></form></section></div>' +
        '<aside class="ex-r"><div class="ex-play"><button type="button" class="ex-pp" aria-label="Play">' + ic('<path d="M6 3.8v10.4l8-5.2z"/>') + '</button><span class="ex-t">0:00</span><div class="ex-bar" role="slider" tabindex="0" aria-label="Seek"><span class="ex-wave">' + wave + '</span><b class="ex-ph"></b>' + chs.map(function (c) { return '<s style="left:' + (c.at / r.len * 100).toFixed(2) + '%"></s>'; }).join('') + lines.filter(function (l) { return l.hot; }).map(function (l) { return '<u style="left:' + (l.at / r.len * 100).toFixed(2) + '%"></u>'; }).join('') + '</div><span class="ex-d">' + mmss(r.len) + '</span><button type="button" class="ex-sp">1×</button></div>' +
          '<div class="ex-chs">' + chs.map(function (c, k) { return '<button type="button" data-t="' + c.at + '" data-k="' + k + '">' + c.n + '</button>'; }).join('') + '</div>' +
          '<label class="ex-find">' + ic('<circle cx="8" cy="8" r="4.5"/><path d="M11.5 11.5l3.5 3.5"/>') + '<input type="text" placeholder="Find in the transcript" aria-label="Find in the transcript" autocomplete="off"><em></em></label><div class="ex-tr">' + lines.map(function (l, i) { return '<button type="button" class="ex-ln ' + (l.who === 'A' ? 'a' : 'c') + (l.hot ? ' hot' : '') + '" data-t="' + l.at + '" data-i="' + i + '"><small>' + mmss(l.at) + '</small><span><b>' + (l.who === 'A' ? (r.who || 'Agent') : 'Customer') + '</b>' + l.text + '</span></button>'; }).join('') + '</div></aside></div></div>';
      var ph = ex.querySelector('.ex-ph'), wv = [].slice.call(ex.querySelectorAll('.ex-wave i')), wAt = 0, tEl = ex.querySelector('.ex-t'), pp = ex.querySelector('.ex-pp'), tr = ex.querySelector('.ex-tr'), lns = [].slice.call(tr.children), chb = [].slice.call(ex.querySelectorAll('.ex-chs button')), at = -1;
      ex._seek = function (s, go2) { T0 = Math.max(0, Math.min(r.len, s)); ph.style.left = (T0 / r.len * 100) + '%'; tEl.textContent = mmss(T0);
        var wNow = Math.round(T0 / r.len * NB); for (var k2 = Math.min(wAt, wNow); k2 < Math.max(wAt, wNow); k2++) wv[k2].classList.toggle('p', k2 < wNow); wAt = wNow;
        var i = -1; lines.forEach(function (l, k) { if (l.at <= T0 + .01) i = k; });
        if (i !== at) { at = i; lns.forEach(function (b, k) { b.classList.toggle('on', k === i); }); if (i >= 0) { var b = lns[i]; tr.scrollTo({ top: b.offsetTop - tr.clientHeight / 2 + b.offsetHeight / 2, behavior: 'smooth' }); } }
        chb.forEach(function (b, k) { b.classList.toggle('on', T0 >= chs[k].at && T0 < chs[k].end); });
        if (go2 && !playing) ex._play(); };
      ex._play = function () { playing = !playing; pp.innerHTML = ic(playing ? '<path d="M6 4v10M12 4v10"/>' : '<path d="M6 3.8v10.4l8-5.2z"/>'); pp.classList.toggle('on', !!playing); pp.setAttribute('aria-label', playing ? 'Pause' : 'Play'); clearInterval(timer);
        if (playing) { if (T0 >= r.len) ex._seek(0); timer = setInterval(function () { if (!ex.classList.contains('on') || !K.stage.classList.contains('s5')) { ex._play(); return; } ex._seek(T0 + .25 * speed); if (T0 >= r.len) ex._play(); }, 250); } };
      ex._seek(0);
      var find = ex.querySelector('.ex-find input'), found = ex.querySelector('.ex-find em');
      find.addEventListener('input', function () { var q = find.value.trim().toLowerCase(), n = 0; lns.forEach(function (b, k) { var hit = q && lines[k].text.toLowerCase().indexOf(q) >= 0; b.classList.toggle('dim', !!q && !hit); if (hit) n++; }); found.textContent = q ? n + (n === 1 ? ' line' : ' lines') : ''; });
      try { history.replaceState(null, '', '#data/' + r.n); } catch (e) {}
      each(K.stage.querySelectorAll('.sx'), function (x) { x.classList.toggle('on', x === ex); });
      ex.querySelector('.card').scrollTop = 0;
    }
    function exBack() { try { history.replaceState(null, '', '#data'); } catch (e) {} clearInterval(timer); playing = 0; each(K.stage.querySelectorAll('.sx'), function (x) { x.classList.toggle('on', x === el); }); paint(true); }
    var ANS = function (q, r) { var bad = r.se === 'Negative', s = q.toLowerCase();
      return /summar/.test(s) ? r.sm + '. The call took ' + mmss(r.len) + ' and ended ' + (r.st === 'Done' ? 'resolved' : 'open') + '; the customer sounded ' + r.se.toLowerCase() + '.'
        : /unhappy|why|wrong/.test(s) ? (bad ? 'The customer had to ask more than once and did not get what they asked for the first time. The low criteria in the evaluation point at the same moments.' : 'Nothing on this call suggests the customer was unhappy: the request was handled and the tone stayed ' + r.se.toLowerCase() + '.')
        : /well|good/.test(s) ? 'The agent verified the customer before opening the booking and confirmed what was done before closing.'
        : /next|coach|should/.test(s) ? (bad ? 'Offer what the customer asked for first, and say the next step with a date before closing.' : 'Keep the same structure. One small thing: confirm the customer’s email before sending the confirmation.')
        : 'This sample answers about the summary, the customer’s mood and what to do next time. In Hear the answer is built from this call’s transcript.'; };
    ex.addEventListener('click', function (e) {
      var t = e.target, x, r = cur; if (!r) return;
      if (t.closest('.ex-back')) { exBack(); return; }
      if ((x = t.closest('.ex-pv,.ex-nx'))) { var to = list[list.indexOf(r) + (x.classList.contains('ex-nx') ? 1 : -1)]; if (to) explore(to); return; }
      if ((x = t.closest('.ex-at,.ex-ln,.ex-chs button'))) { e.stopPropagation(); ex._seek(+x.dataset.t, true); return; }
      if (t.closest('.ex-pp')) { ex._play(); return; }
      if ((x = t.closest('.ex-sp'))) { speed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1; x.textContent = speed + '×'; return; }
      if ((x = t.closest('.ex-bar'))) { var b = x.getBoundingClientRect(); ex._seek((e.clientX - b.left) / b.width * r.len); return; }
      if ((x = t.closest('.ex-cr.low'))) { x.classList.toggle('open'); return; }
      if (t.closest('.ex-id')) { copy(r.id); flash(ex, 'Call id copied'); return; }
      if ((x = t.closest('.ex-mine,.ex-done'))) { var mine = x.classList.contains('ex-mine'), tm = T0, said = ex.querySelector('.ex-msgs').innerHTML; if (mine) r.who = ME; else r.st = 'Done';
        explore(r); ex._seek(tm); ex.querySelector('.ex-msgs').innerHTML = said; flash(ex, mine ? 'Assigned to you' : 'Marked done'); return; }      /* the page is drawn again from the call; the place in the recording and the conversation stay */
            if ((x = t.closest('.ex-chips button'))) { exAsk(x.textContent); return; }
    });
    function exAsk(q) { var m = ex.querySelector('.ex-msgs'), r = cur; m.insertAdjacentHTML('beforeend', '<div class="you">' + esc(q) + '</div><div class="it think"><i></i><i></i><i></i></div>'); var th = m.lastChild; th.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      setTimeout(function () { if (!th.isConnected) return; th.className = 'it'; th.textContent = ANS(q, r); th.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 900); }
    ex.addEventListener('submit', function (e) { e.preventDefault(); var i = ex.querySelector('.ex-comp input'), v = i.value.trim(); if (!v) return; i.value = ''; exAsk(v); });
    ex.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.ex-cr.low')) { e.preventDefault(); e.target.click(); }
      if (e.target.matches('.ex-bar') && cur) { if (e.key === 'ArrowRight') ex._seek(T0 + 5); if (e.key === 'ArrowLeft') ex._seek(T0 - 5); } });
    addEventListener('keydown', function (e) { var here = ex.classList.contains('on') && K.stage.classList.contains('s5'), typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName); if (!here) return;
      if (e.key === 'Escape' && !document.querySelector('.lv-menu')) { if (typing) document.activeElement.blur(); else exBack(); }
      /* space plays and pauses, as in any player */
      if (e.key === ' ' && !typing && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); ex._play(); } });

    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if ((x = t.closest('.dt-tabs span'))) { S.tab = [].indexOf.call(tabs.children, x); S.sel = {}; S.sort = 2; S.dir = 1; shut(el); paint(); return; }
      if (t.closest('.dt-f button')) { S.conds.splice(+t.closest('.dt-f').dataset.i, 1); S.saved = false; if (!S.conds.some(function (c) { return c.ai; })) { tx.value = ''; ask.classList.remove('has'); } paint(); return; }
      if (t.closest('.lv-none .act')) { S.conds = []; S.q = si.value = tx.value = ''; S.range = 3; ask.classList.remove('has'); paint(); return; }
      if (dateB.contains(t)) { menu(el, dateB, RANGE.map(function (r, i) { return { t: r[0], v: i, on: i === S.range }; }), function (it) { S.range = it.v; S.sel = {}; paint(); }); return; }
      if (addB.contains(t)) { fields(); return; }
      if (colB.contains(t)) { menu(el, colB, [{ head: 'Columns' }].concat(COLS.map(function (c, i) { return { t: c[0], v: i, on: !S.hide[i], check: 1 }; }).slice(1)), function (it, m) {
        if (it.on) delete S.hide[it.v]; else S.hide[it.v] = 1; if (S.hide[S.sort]) { S.sort = 0; S.dir = 1; } paint(true); }, true); return; }
      if ((x = t.closest('.dt-r.hd .h'))) { var c = +x.dataset.c; if (S.sort === c) S.dir = -S.dir; else { S.sort = c; S.dir = c === 1 || c === 2 || c === 4 || c === 7 ? 1 : -1; }      /* first click: newest, highest priority and longest first; names A to Z and scores lowest first */ paint(); return; }
      if ((x = t.closest('.dt-r.hd .ck'))) { var pg = list.slice(S.page * PER, S.page * PER + PER), on = !pg.every(function (r) { return S.sel[r.n]; }); pg.forEach(function (r) { if (on) S.sel[r.n] = 1; else delete S.sel[r.n]; }); paint(true); return; }
      if ((x = t.closest('.dt-set .ck'))) { var n = +x.parentNode.dataset.n; if (S.sel[n]) delete S.sel[n]; else S.sel[n] = 1; paint(true); return; }
      if ((x = t.closest('.cp'))) { copy(x.parentNode.textContent); flash(el, 'Call id copied'); return; }
      if ((x = t.closest('.pg button'))) { if (!x.disabled) { S.page = +x.dataset.p; paint(true); } return; }
      if ((x = t.closest('.lv-t'))) { var act = x.dataset.do, keys = Object.keys(S.sel);
        if (act === 'csv') { exportCsv(keys.map(function (k) { return D[k]; })); return; }
        if (act !== 'none') { keys.forEach(function (k) { if (act === 'done') D[k].st = 'Done'; else D[k].who = ME; }); flash(el, keys.length + (keys.length > 1 ? ' calls ' : ' call ') + (act === 'done' ? 'marked done' : 'assigned to you')); }
        S.sel = {}; paint(true); return; }
      if (t.closest('.dt-foot .sig')) { S.saved = true; paint(true);
        /* the filter becomes a rule that goes on watching: it is a row in Signals from now on */
        signal({ name: S.conds.map(function (c) { return label(c); }).join(' · ').replace(/^./, function (m) { return m.toUpperCase(); }), rule: 'Calls where ' + S.conds.map(function (c) { return c.k.toLowerCase() + ' is ' + label(c); }).join(' and '), n: list.filter(function (r) { return r.off < 14; }).length });
        flash(el, 'Saved. It is now a signal, and goes on watching'); return; }
      if ((x = t.closest('.dt-top .act'))) { if (x.classList.contains('ink')) up.click(); else exportCsv(); return; }
      if ((x = t.closest('.dt-set .dt-r'))) { explore(D[+x.dataset.n]); return; }
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.dt-tabs span,.dt-r.hd .h,.dt-set .dt-r,.ck')) { e.preventDefault(); e.target.click(); } });
    /* another screen can send its reader here with the filter already on (Newsroom: "See the 211 calls") */
    L.data.filter = function (conds, range, tab) { S.conds = conds.map(function (c) { c.fresh = 1; if (c.k === 'Signal' || c.k === 'Agent' || c.k === 'From') { c.set = {}; D.filter(function (r) { return c.k !== 'Signal' ? r.who : r.se === 'Negative' || r.al || /Refund|Cancel|Complaint/.test(r.t); }).slice(0, c.n).forEach(function (r) { c.set[r.n] = 1; }); } return c; }); S.tab = tab || 0; S.sort = 2; S.dir = 1; S.q = si.value = ''; tx.value = ''; if (range != null) S.range = range; S.saved = false; S.sel = {}; shut(el); paint(); };
    paint();
    var deep = /^#data\/(\d+)$/.exec(location.hash); if (deep && D[+deep[1]]) explore(D[+deep[1]]);
    var fitT = 0; addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(function () { if (el.classList.contains('on') && fit() !== PER) paint(true); }, 120); });
    new MutationObserver(function () { if (el.classList.contains('on') && fit() !== PER) paint(true); }).observe(el, { attributes: true, attributeFilter: ['class'] });
    if (L.data.wait) { L.data.filter.apply(null, L.data.wait); L.data.wait = null; }
  };
  /* ---------- Agent evaluation ---------- */
  /* The chart answers the pointer (any day, not only the storyboard's Sep 30), Bars and Trend are two drawings of the same thirty
     days, the two menus change what is measured and for how long, and every band of the spread opens the agents in it. */
  L.agents = function (el, ui, K) {
    KIT = K; el.classList.add('lv'); el.dataset.st = 0;
    var plot = el.querySelector('.ae-plot'), bars = [].slice.call(plot.querySelectorAll('.ae-b')), avgEl = plot.querySelector('.ae-avg'), dates = el.querySelector('.ae-dates');
    var base = bars.map(function (b) { return +b.textContent; }), kp = el.querySelectorAll('.kpis>div'), acts = el.querySelectorAll('.top .act'), seg = el.querySelector('.sx-seg');
    var FORMS = [['Service quality', base, [27, 193, 349, 138, 8], 'Explains the refund policy', '81 → 52'],
      ['Sales conversations', base.map(function (v, i) { return v + 4 + (i * 7) % 3 - 1 - (i > 8 && i < 12 ? 11 : 0); }), [41, 236, 318, 115, 5], 'Offers the upgrade', '77 → 49'],
      ['Compliance', base.map(function (v, i) { return (i > 16 && i < 21 ? v + 8 : v) - 3 + (i * 5) % 3 - 1 - (i > 24 && i < 28 ? 12 : 0); }), [19, 171, 352, 162, 11], 'Reads the recording disclosure', '88 → 61']];
    var RANGE = [['Last 7 days', 7], ['Last 14 days', 14], ['Last 30 days', 30]], BANDS = ['90–100', '80–89', '70–79', '60–69', 'under 60'];
    var S = { form: 0, range: 2, trend: false }, WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Sep', 'Oct'];
    var date = function (i, wd) { var d = new Date(2026, 8, 13 + i); return (wd ? WD[d.getDay()] + ', ' : '') + MON[d.getMonth() - 8] + ' ' + d.getDate(); };
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'lv-trend'); svg.setAttribute('preserveAspectRatio', 'none'); plot.appendChild(svg);
    each(seg.children, function (s) { s.setAttribute('role', 'button'); s.tabIndex = 0; });
    acts[0].classList.add('lv-b'); acts[1].classList.add('lv-b');
    each([kp[2]].concat([].slice.call(el.querySelectorAll('.ae-strip i,.ae-leg span'))), function (n) { n.setAttribute('role', 'button'); n.tabIndex = 0; });
    var CRIT, avg = 76, vals = base, from = 0, gband = function (v) { return v < 60 ? 'g1' : v < 70 ? 'g2' : v < 80 ? 'g3' : v < 90 ? 'g4' : 'g5'; };
    each(plot.querySelectorAll('.ae-y'), function (y, k) { var v = [25, 50, 75, 100][k]; y.textContent = v; y.style.bottom = 'calc(30px + (100% - 30px) * ' + v / 100 + ')'; });
    var subEl = el.querySelector('.ae-sub'); if (subEl) subEl.textContent = 'Height is the day’s score, 0 to 100';
    var critEl = document.createElement('div'); critEl.className = 'ae-crit'; el.querySelector('.ae-dist').insertAdjacentElement('afterend', critEl);
    function paint() {
      var f = FORMS[S.form], n = RANGE[S.range][1]; vals = f[1]; from = 30 - n;
      var shown = vals.slice(from); avg = Math.round(shown.reduce(function (a, v) { return a + v; }, 0) / n);
      /* critic, 26.11.2026: the axis began at 50, so a 66 read as a collapse, and coral followed a third rule (8 points under the
         average). The height is the score on 0 to 100 and the colour is the score's band, the same bands as every score in the Studio */
      var Y = function (v) { return Math.max(0, Math.min(100, v)); };
      bars.forEach(function (b, i) { b.hidden = i < from; b.style.height = Y(vals[i]).toFixed(1) + '%'; b.style.animationDelay = (i - from) * 22 + 'ms'; b.className = 'ae-b ' + gband(vals[i]) + (vals[i] < 60 ? ' low' : ''); b.firstChild.textContent = vals[i]; });
      var cs = FORMS[S.form][5] || (FORMS[S.form][5] = CRIT.map(function (c, k) { return [c, c === f[3] ? avg - 9 : Math.max(55, Math.min(95, avg + [6, 3, -2, 5, 8, 1, -4, 2][k]))]; }).sort(function (a, b) { return a[1] - b[1]; }));
      critEl.innerHTML = '<div class="sx-h"><b>By criterion</b><span>the center’s average, lowest first</span></div><div class="ae-crl">' + cs.map(function (c) { return '<div><span>' + c[0] + '</span><i><u class="' + gband(c[1]) + '" style="width:' + c[1] + '%"></u></i><b>' + c[1] + '</b></div>'; }).join('') + '</div>';
      avgEl.style.bottom = 'calc(30px + (100% - 30px) * ' + (Y(avg) / 100).toFixed(3) + ')'; avgEl.firstChild.textContent = 'Avg ' + avg;
      dates.innerHTML = [0, Math.floor((n - 1) / 2), n - 1].map(function (k, j) { return '<span style="' + (j === 0 ? 'left:0' : j === 2 ? 'right:0' : 'left:' + ((k + .5) / n * 100).toFixed(2) + '%;translate:-50% 0') + '">' + date(from + k) + '</span>'; }).join('');
      svg.setAttribute('viewBox', '0 0 ' + n * 10 + ' 100');
      svg.innerHTML = '<path d="' + shown.map(function (v, i) { return (i ? 'L' : 'M') + (i * 10 + 5) + ' ' + (100 - Y(v)).toFixed(1); }).join('') + '" fill="none" stroke="#139FFD" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
      plot.classList.toggle('trend', S.trend); each(seg.children, function (s, i) { s.classList.toggle('on', !!i === S.trend); });
      acts[0].innerHTML = f[0] + K.chev; acts[1].innerHTML = RANGE[S.range][0] + K.chev;
      kp[1].querySelector('b').firstChild.textContent = avg; kp[1].querySelector('i').textContent = (S.form ? '▼ 2 pts' : '▲ 1 pt') + ' against the ' + n + ' days before';
      kp[2].querySelector('b').textContent = f[2][4];
      each(el.querySelectorAll('.ae-strip i'), function (x, i) { x.style.flex = Math.max(f[2][i], 14); });
      each(el.querySelectorAll('.ae-leg span b'), function (x, i) { x.textContent = f[2][i]; });
      plot.classList.remove('draw'); void plot.offsetWidth; plot.classList.add('draw');
      if (el.classList.contains('agv')) paintA();
    }
    /* a day under the pointer */
    var tip = el.querySelector('.sx-tip');
    plot.addEventListener('pointermove', function (e) {
      var b = e.target.closest('.ae-b'); if (!b) { tip.classList.remove('on'); each(bars, function (x) { x.classList.remove('at'); }); return; }
      if (b.classList.contains('at')) return; each(bars, function (x) { x.classList.toggle('at', x === b); });
      var i = +b.dataset.b, v = vals[i], d = v - avg, f = FORMS[S.form];
      ui.tip(b, '<strong>' + date(i, 1) + '</strong><span class="big">' + v + ' <small>/ 100</small></span><span>' + (d ? Math.abs(d) + (Math.abs(d) > 1 ? ' pts ' : ' pt ') + (d < 0 ? 'under' : 'over') + ' the average' : 'On the average') + ' · ' + num(1290 + (i * 37) % 11 * 14 - (new Date(2026, 8, 13 + i).getDay() % 6 ? 0 : 420)) + ' calls</span>' +
        (v <= avg - 8 ? '<span class="why">Fell most: <b>' + f[3] + '</b>, ' + f[4] + '</span>' : ''));
    });
    plot.addEventListener('pointerleave', function () { tip.classList.remove('on'); each(bars, function (x) { x.classList.remove('at'); }); });

    /* the agents in a band, lowest first. Under 60 on Service quality is the storyboard's eight; the rest are made from a seed */
    var FIRST = ['Ana', 'Ben', 'Carla', 'Dev', 'Elif', 'Finn', 'Gia', 'Hugo', 'Ida', 'Jamal', 'Kira', 'Liam', 'Mina', 'Nils', 'Oren', 'Pia']; CRIT = ['Explains the refund policy', 'Verifies identity', 'Sets a clear next step', 'Shows empathy', 'Greets by name', 'Confirms the booking', 'Reads the recording disclosure', 'Sums up before closing']      /* the eight the page's first line counts */;
    function band(g) {
      var f = FORMS[S.form], count = f[2][g], lo = [90, 80, 70, 60, 44][g], hi = [100, 89, 79, 69, 59][g], story = g === 4 && !S.form, seed = g * 31 + S.form * 7 + 5;
      var r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      var AG = story ? [['Selma K.', 48, 1], ['Jonas R.', 51, 1], ['Priya N.', 52, 'Verifies identity'], ['Tomas V.', 54, 1], ['Leah M.', 55, 1], ['Dario F.', 56, 'Sets a clear next step'], ['Noor A.', 57, 1], ['Kyle B.', 59, 'Shows empathy']]
        : FIRST.slice(0).sort(function () { return r() - .5; }).slice(0, Math.min(8, count)).map(function (n, k) { return [n + ' ' + 'ABDFGKLMNRSTV'[Math.floor(r() * 13)] + '.', Math.round(lo + (hi - lo) * k / 8 + r() * (hi - lo) / 8), CRIT[Math.floor(r() * CRIT.length)]]; });
      each(el.querySelectorAll('[data-g]'), function (x) { x.classList.toggle('hot', x.dataset.g === BANDS[g]); }); kp[2].classList.toggle('hot', g === 4);
      el.classList.add('bnd');
      var s = sheet(el, ui, '<header>' + (g === 4 ? 'Under 60' : 'Score ' + BANDS[g]) + '<small>' + count + ' of 715 agents</small></header>' +
        (story ? '<div class="a" style="margin-top:14px"><p><span class="ae-xs">They average <b>54</b> across 1,212 calls. </span><b>Five of the eight are weakest on the same criterion</b>, the one that fell on Sep 30.</p></div>' : '<div class="a" style="margin-top:14px"><p>' + (g === 4 ? 'The agents to coach first.' : g < 2 ? 'The agents others can learn from.' : 'Inside the range most of the center is in.') + ' ' + f[0] + ', ' + RANGE[S.range][0].toLowerCase() + '.</p></div>') +
        '<h4 class="ae-h4">Lowest first · weakest criterion' + (count > AG.length ? ' · ' + AG.length + ' of ' + count : '') + '</h4>' +
        '<ul class="ae-ag">' + AG.map(function (a, n) { return '<li style="--i:' + n + '">' + K.av(a[0]) + '<span>' + a[0] + '<small>' + (a[2] === 1 ? '<u>Explains the refund policy</u><i class="ts"> · Task set</i>' : a[2] + (g === 4 && !story ? '<i class="ts"> · Task set</i>' : '')) + '</small></span><em class="' + (g === 4 ? '' : 'g' + (5 - g)) + '">' + a[1] + '</em></li>'; }).join('') + '</ul>' +
        (story ? '<p class="ae-nt">Selma, Jonas, Tomas, Leah and Noor share <b>Explains the refund policy</b>. The other three are weakest elsewhere.</p>' : '') +
        '<div class="ft">' + K.act('Open the list') + (g === 4 ? K.act('Create ' + (story ? 5 : AG.length) + ' coaching tasks', 'ink') : '') + '</div>', function () { el.classList.remove('bnd'); });
      var b = s.querySelectorAll('.ft .act');
      b[0].addEventListener('click', function () { showAgents(g); });
      if (b[1]) b[1].addEventListener('click', function () {
        var who = story ? AG.filter(function (a) { return a[2] === 1; }) : AG; s.querySelector('.ae-ag').classList.add('made'); if (!story) each(s.querySelectorAll('.ae-ag .ts'), function (x) { x.style.display = 'inline'; });
        b[1].disabled = true; b[1].classList.add('made'); b[1].textContent = who.length + ' tasks created';
        who.forEach(function (a) { task({ col: 0, src: 'Agent evaluation', when: 'Today', title: 'Coach ' + a[0] + ' on: ' + (a[2] === 1 ? 'Explains the refund policy' : a[2]), ev: 'Score ' + a[1] + ' · ' + f[0], who: '' }); });
        flash(el, who.length + ' coaching tasks added to Workflows');
      });
    }
    /* ---------- the agents themselves (owner, 26.11.2026: "a lot more than this"). The page said 715 agents and showed none of
       them: only a chart and a strip. Agents is the list: every agent with team, calls, score, weakest criterion and the month's
       move; it can be searched, cut by band and sorted, and an agent opens with the criteria behind the score. Made from a seed,
       to the counts the strip shows (and, on Service quality, with the storyboard's eight under 60). ---------- */
    var TEAMS = ['Atlas', 'Birch', 'Cedar', 'Delta'], NAMES = ['Ana', 'Ben', 'Carla', 'Dev', 'Elif', 'Finn', 'Gia', 'Hugo', 'Ida', 'Jamal', 'Kira', 'Liam', 'Mina', 'Nils', 'Oren', 'Pia', 'Quinn', 'Rosa', 'Sami', 'Tara', 'Uri', 'Vera', 'Wes', 'Yara', 'Zane', 'Alma', 'Boaz', 'Cleo', 'Dina', 'Eli', 'Faye', 'Gus', 'Hana', 'Ivo', 'Joan', 'Kai', 'Lena', 'Milo', 'Nora', 'Omri', 'Paz', 'Rafi', 'Shai', 'Tess', 'Uma', 'Vik', 'Wren', 'Zoe'];
    var RANGE5 = [[90, 99], [80, 89], [70, 79], [60, 69], [44, 59]], STORY = [['Selma K.', 48, 0], ['Jonas R.', 51, 0], ['Priya N.', 52, 1], ['Tomas V.', 54, 0], ['Leah M.', 55, 0], ['Dario F.', 56, 2], ['Noor A.', 57, 0], ['Kyle B.', 59, 3]], made = {};
    function agents() {
      if (made[S.form]) return made[S.form];
      var seed = 4711 + S.form * 97, r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }, pool = [], out = [], cnt = FORMS[S.form][2];
      NAMES.forEach(function (n) { 'ABCDEFGHJKLMNPRSTVWZ'.split('').forEach(function (l) { pool.push(n + ' ' + l + '.'); }); });
      for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
      cnt.forEach(function (n, g) { for (var k = 0; k < n; k++) { var st = g === 4 && !S.form && STORY[k];
        out.push({ n: st ? st[0] : pool.pop(), g: g, s: st ? st[1] : RANGE5[g][0] + Math.floor(r() * (RANGE5[g][1] - RANGE5[g][0] + 1)), team: TEAMS[Math.floor(r() * 4)], calls: 60 + Math.floor(r() * 190), weak: st ? CRIT[st[2]] : CRIT[Math.floor(r() * CRIT.length)], d: Math.round((r() - .5) * 12) }); } });
      return (made[S.form] = out);
    }
    var A = { q: '', band: -1, sort: 's', dir: 1, page: 0 }, PERA = 9, gcl = function (s) { return s < 60 ? 'g1' : s < 70 ? 'g2' : s < 80 ? 'g3' : s < 90 ? 'g4' : 'g5'; };
    var tabsA = document.createElement('div'); tabsA.className = 'dt-tabs ag-tabs'; tabsA.innerHTML = '<span role="button" tabindex="0" class="on">Overview</span><span role="button" tabindex="0">Agents<small>715</small></span>';
    var view = document.createElement('div'); view.className = 'ag-view';
    view.innerHTML = '<div class="ag-bar"><div class="dt-search ag-search">' + ic('<circle cx="8" cy="8" r="4.5"/><path d="M11.5 11.5l3.5 3.5"/>') + '<input type="text" placeholder="Search agents" aria-label="Search agents" autocomplete="off"></div><span class="ag-chips"></span><span class="sp"></span><span class="ag-n"></span></div>' +
      '<div class="ag-r hd">' + [['n', 'Agent'], ['s', 'Score'], ['team', 'Team'], ['calls', 'Calls'], ['weak', 'Weakest criterion'], ['d', '30 days']].map(function (c) { return '<span role="button" tabindex="0" data-c="' + c[0] + '">' + c[1] + '</span>'; }).join('') + '</div><div class="ag-rows"></div>' +
      '<div class="ag-foot"><span class="ct"></span><span class="sp"></span><button type="button" class="ag-pv" aria-label="Previous page">' + ic('<path d="M11 5l-4 4 4 4"/>') + '</button><button type="button" class="ag-nx" aria-label="Next page">' + ic('<path d="M7 5l4 4-4 4"/>') + '</button></div>';
    var sxb = el.querySelector('.sx-body'); sxb.insertAdjacentElement('beforebegin', tabsA); sxb.insertAdjacentElement('afterend', view);
    var rowsEl = view.querySelector('.ag-rows'), agList = [];
    function paintA() {
      var all = agents(), q = A.q.toLowerCase(), f = FORMS[S.form];
      agList = all.filter(function (a) { return (A.band < 0 || a.g === A.band) && (!q || (a.n + ' ' + a.team + ' ' + a.weak).toLowerCase().indexOf(q) >= 0); });
      var k = A.sort, d = A.dir; agList.sort(function (x, y) { return x[k] < y[k] ? -d : x[k] > y[k] ? d : x.n < y.n ? -1 : 1; });
      PERA = Math.max(5, Math.floor(rowsEl.clientHeight / 46) || 9);
      var pages = Math.max(1, Math.ceil(agList.length / PERA)); A.page = Math.min(A.page, pages - 1); var at = A.page * PERA, page = agList.slice(at, at + PERA);
      view.querySelector('.ag-chips').innerHTML = '<button type="button" class="sx-chip' + (A.band < 0 ? ' on' : '') + '" data-g="-1">All</button>' + BANDS.map(function (b, g) { return '<button type="button" class="sx-chip' + (A.band === g ? ' on' : '') + '" data-g="' + g + '"><i class="' + ['g5', 'g4', 'g3', 'g2', 'g1'][g] + '"></i>' + b + ' <b>' + f[2][g] + '</b></button>'; }).join('');
      view.querySelector('.ag-n').innerHTML = '<b>' + num(agList.length) + '</b> ' + (agList.length === 1 ? 'agent' : 'agents') + ' · ' + f[0];
      each(view.querySelectorAll('.ag-r.hd span'), function (h) { var on = h.dataset.c === A.sort; h.classList.toggle('srt', on); var sv = h.querySelector('svg'); if (sv) sv.remove(); if (on) h.insertAdjacentHTML('beforeend', ic(A.dir < 0 ? '<path d="M9 4v10M5.5 10.5 9 14l3.5-3.5"/>' : '<path d="M9 14V4M5.5 7.5 9 4l3.5 3.5"/>')); });
      rowsEl.innerHTML = page.length ? page.map(function (a, i) { return '<div class="ag-r" data-i="' + (at + i) + '" tabindex="0" style="--n:' + i + '"><span class="nm">' + K.av(a.n) + a.n + '</span><span><b class="ag-sc ' + gcl(a.s) + '">' + a.s + '</b></span><span>Team ' + a.team + '</span><span class="nu">' + a.calls + '</span><span>' + a.weak + '</span><span class="dl ' + (a.d < 0 ? 'dn' : a.d > 0 ? 'up' : '') + '">' + (a.d ? (a.d > 0 ? '▲ ' : '▼ ') + Math.abs(a.d) + (Math.abs(a.d) === 1 ? ' pt' : ' pts') : 'no change') + '</span></div>'; }).join('')
        : '<div class="lv-none"><b>No agents match</b><span>Nothing fits “' + esc(A.q) + '”' + (A.band < 0 ? '' : ' in ' + BANDS[A.band]) + '.</span></div>';
      rowsEl.classList.remove('is-new'); void rowsEl.offsetWidth; rowsEl.classList.add('is-new');
      view.querySelector('.ct').innerHTML = agList.length ? '<b>' + (at + 1) + '–' + (at + page.length) + '</b> of ' + num(agList.length) : '';
      view.querySelector('.ag-pv').disabled = !A.page; view.querySelector('.ag-nx').disabled = A.page >= pages - 1;
    }
    function showAgents(g) { el.classList.add('agv'); each(tabsA.children, function (t, i) { t.classList.toggle('on', i === 1); }); if (g != null) { A.band = g; A.page = 0; } shut(el); paintA(); }
    function showOverview() { el.classList.remove('agv'); each(tabsA.children, function (t, i) { t.classList.toggle('on', i === 0); }); shut(el); }
    function agent(a) {
      var seed = a.s * 7 + a.calls, r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }, d = a.s - avg;
      var cr = CRIT.map(function (c) { return [c, c === a.weak ? Math.max(20, a.s - 14 - Math.floor(r() * 8)) : Math.max(30, Math.min(99, a.s + Math.round((r() - .35) * 16)))]; }).sort(function (x, y) { return x[1] - y[1]; });
      var TOP = ['Refunds & Credits', 'Online Booking', 'Trip Status', 'Schedule Changes', 'Baggage'], calls = [0, 1, 2].map(function (k) { return ['Oct ' + (12 - k * 2 - Math.floor(r() * 2)), TOP[Math.floor(r() * TOP.length)], Math.max(20, Math.min(99, a.s + Math.round((r() - .5) * 22)))]; });
      each(rowsEl.children, function (x) { x.classList.toggle('hot', agList[+x.dataset.i] === a); });
      var s = sheet(el, ui, '<header>' + a.n + '<small>Team ' + a.team + ' · ' + a.calls + ' calls</small></header>' +
        '<div class="ag-hero"><b class="ag-sc ' + gcl(a.s) + '">' + a.s + '</b><span><strong>' + (d ? Math.abs(d) + (Math.abs(d) === 1 ? ' pt ' : ' pts ') + (d < 0 ? 'under' : 'over') + ' the center’s ' + avg : 'On the center’s average') + '</strong>' + FORMS[S.form][0] + ' · ' + (a.d ? (a.d > 0 ? 'up ' : 'down ') + Math.abs(a.d) + ' in 30 days' : 'no change in 30 days') + '</span></div>' +
        '<h4>By criterion · lowest first</h4><div class="ag-cr">' + cr.map(function (c, n) { return '<div style="--i:' + n + '"><span>' + c[0] + '</span><i><u class="' + gcl(c[1]) + '" style="width:' + c[1] + '%"></u></i><b>' + c[1] + '</b></div>'; }).join('') + '</div>' +
        '<h4>Latest calls</h4>' + calls.map(function (c) { return '<button type="button" class="ag-call"><span>' + c[0] + '</span><b>' + esc(c[1]) + '</b><em class="ag-sc ' + gcl(c[2]) + '">' + c[2] + '</em></button>'; }).join('') +
        '<div class="ft">' + K.act('See the calls') + K.act('Create a coaching task', 'ink') + '</div>', function () { each(rowsEl.children, function (x) { x.classList.remove('hot'); }); });
      var b = s.querySelectorAll('.ft .act'), calls2 = function () { go('data', [{ k: 'Agent', v: a.n, n: a.calls }]); };
      b[0].addEventListener('click', calls2); each(s.querySelectorAll('.ag-call'), function (x) { x.addEventListener('click', calls2); });
      b[1].addEventListener('click', function () { task({ col: 0, src: 'Agent evaluation', when: 'Today', hi: a.s < 60 ? 1 : 0, title: 'Coach ' + a.n + ' on: ' + a.weak, ev: 'Score ' + a.s + ' · ' + FORMS[S.form][0], who: '' }); b[1].disabled = true; b[1].classList.add('made'); b[1].textContent = 'Task created'; flash(el, 'Coaching task added to Workflows'); });
    }
    kp[0].setAttribute('role', 'button'); kp[0].tabIndex = 0;
    view.querySelector('.ag-search input').addEventListener('input', function (e) { A.q = e.target.value.trim(); A.page = 0; paintA(); });
    addEventListener('resize', function () { if (el.classList.contains('on') && el.classList.contains('agv')) paintA(); });
    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if ((x = t.closest('.ag-tabs span'))) { if (x === tabsA.firstChild) showOverview(); else showAgents(); return; }
      if (kp[0].contains(t)) { showAgents(-1); return; }
      if ((x = t.closest('.ag-chips .sx-chip'))) { A.band = +x.dataset.g; A.page = 0; paintA(); return; }
      if ((x = t.closest('.ag-r.hd span'))) { if (A.sort === x.dataset.c) A.dir = -A.dir; else { A.sort = x.dataset.c; A.dir = /^(calls|d)$/.test(A.sort) ? -1 : 1; } A.page = 0; paintA(); return; }
      if ((x = t.closest('.ag-pv,.ag-nx'))) { A.page += x.classList.contains('ag-nx') ? 1 : -1; paintA(); return; }
      if ((x = t.closest('.ag-rows .ag-r'))) { agent(agList[+x.dataset.i]); return; }
    });
    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if (acts[0].contains(t)) { menu(el, acts[0], [{ head: 'Evaluation form' }].concat(FORMS.map(function (f, i) { return { t: f[0], v: i, on: i === S.form }; })), function (it) { S.form = it.v; shut(el); paint(); }, true); return; }
      if (acts[1].contains(t)) { menu(el, acts[1], RANGE.map(function (r, i) { return { t: r[0], v: i, on: i === S.range }; }), function (it) { S.range = it.v; paint(); }, true); return; }
      if ((x = t.closest('.sx-seg span'))) { S.trend = x !== seg.firstChild; paint(); return; }
      if ((x = t.closest('.ae-dist [data-g]'))) { band(BANDS.indexOf(x.dataset.g)); return; }
      if (kp[2].contains(t)) { band(4); return; }
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"]')) { e.preventDefault(); e.target.click(); } });
    paint();
  };

  /* one screen sends its reader to another with the thing already done there: Data with a filter on, Workflows with a new task */
  var KIT = null;
  function go(key, conds, range, tab) {
    if (key === 'data') { if (L.data.filter) L.data.filter(conds || [], range, tab); else L.data.wait = [conds || [], range, tab]; }
    var m = (window.hearScreens && window.hearScreens.all || []).filter(function (x) { return x.key === key; })[0]; if (m) m.open(); return m;
  }
  function task(t) { if (L.actions.add) L.actions.add(t); else (L.actions.wait = L.actions.wait || []).push(t); }
  function signal(g) { if (L.signals.add) L.signals.add(g); else (L.signals.wait = L.signals.wait || []).push(g); }

  /* ---------- Workflows ---------- */
  /* The board is drawn from a list of tasks, so a task can be filtered, started, reassigned, resolved, reopened, opened and written
     on, and every count is counted. The first task is the storyboard's (the refund asked for twice) with all it carries there. */
  L.actions = function (el, ui, K) {
    KIT = K; el.classList.add('lv'); el.dataset.st = 0;
    var ME = 'Maya Chen', WHO = [ME, 'Daniel Brooks', 'Maya Collins', 'Ryan Cole', 'Paula Nunes', 'Sofia Cruz', 'Alex Ward'], COLS = ['Pending', 'In progress', 'Done', 'Cancelled'];
    var T = [
      { col: 0, src: 'Alert', when: 'Today', hi: 1, title: 'Customer asked twice for a refund, was offered only a voucher', ev: '<b>02:41</b>“…a refund, not a voucher.”', who: 'Daniel Brooks', story: 1, me: 1 },
      { col: 0, src: 'Call', when: 'Yesterday', title: 'Reason for call tagged as Billing, should be Flight change', ev: '<b>00:38</b>“I need to move my flight.”', who: 'Maya Collins' },
      { col: 0, src: 'Agent evaluation', when: 'Yesterday', hi: 1, title: 'Recording disclosure missing in the first 30 seconds', ev: 'No recording notice before 00:30', who: '', me: 1 },
      { col: 0, src: 'Call', when: 'Oct 11', title: 'Seat upgrade charged twice on one booking', ev: '<b>04:05</b>“You charged me twice.”', who: 'Paula Nunes' },
      { col: 0, src: 'Alert', when: 'Oct 11', hi: 1, title: 'A refund promised ten days ago has not arrived', ev: '<b>01:05</b>“It has been ten days.”', who: 'Paula Nunes' },
      { col: 0, src: 'Call', when: 'Oct 10', title: 'Customer was told the wrong baggage fee', ev: '<b>03:30</b>“The site says 30, not 45.”', who: '' },
      { col: 1, src: 'Alert', when: 'Oct 10', hi: 1, title: 'Technical failure blocked a booking at payment', ev: '<b>03:12</b>“It says payment failed.”', who: 'Ryan Cole' },
      { col: 1, src: 'Agent evaluation', when: 'Oct 9', title: 'Identity verification skipped before a ticket change', ev: 'No ID question before 01:55', who: 'Paula Nunes' },
      { col: 1, src: 'Call', when: 'Oct 9', title: 'Promised callback was not made within 24 hours', ev: '<b>01:12</b>“Nobody called me back.”', who: 'Sofia Cruz' },
      { col: 1, src: 'Call', when: 'Oct 8', title: 'Refund policy explained wrongly on a cancelled flight', ev: '<b>02:10</b>“Refunds take sixty days.”', who: ME },
      { col: 1, src: 'Call', when: 'Oct 8', title: 'Customer asked for the call recording', ev: '<b>05:48</b>“Can you send me this call?”', who: 'Alex Ward', me: 1 },
      { col: 2, src: 'Alert', when: 'Oct 5', title: 'Lost baggage claim escalated to the ground team', ev: 'Ground team found the bag, Oct 6', who: 'Sofia Cruz', tag: 'Escalated' },
      { col: 2, src: 'Call', when: 'Oct 4', title: 'Sentiment re-analyzed on a VIP escalation', ev: 'Sentiment corrected to Negative', who: 'Maya Collins', tag: 'Resolved' },
      { col: 2, src: 'Call', when: 'Oct 3', title: 'Payment page outage reported to engineering', ev: 'Fixed by engineering, Oct 3', who: 'Ryan Cole', tag: 'Resolved' },
      { col: 2, src: 'Call', when: 'Oct 2', title: 'Wrong fare quoted on a group booking', ev: 'Fare honoured, customer told', who: ME, tag: 'Resolved' },
      { col: 3, src: 'Alert', when: 'Oct 10', title: 'Duplicate: booking engine timeout', ev: 'Same failure as the Oct 10 alert', who: 'Ryan Cole', tag: 'Duplicate' },
      { col: 3, src: 'Feedback', when: 'Sep 30', title: 'Website search is slow', ev: 'Not about a call', who: '', tag: 'Not actionable' }];
    T.forEach(function (t, i) { t.id = i; });
    var S = { who: 0, by: -1, open: {}, at: -1 }, uid = T.length;
    var WHOF = [['Everyone', function () { return true; }], ['Assigned to me', function (t) { return t.who === ME; }], ['Mentions me', function (t) { return t.me; }]];
    var BYF = [['High priority', function (t) { return t.hi && t.col < 2; }], ['From alerts', function (t) { return t.src === 'Alert'; }], ['From agent evaluation', function (t) { return t.src === 'Agent evaluation'; }]];
    var bar = el.querySelector('.ac-bar'), board = el.querySelector('.ac-board'), SHOW = 3;
    var card = function (t) {
      var moves = t.col === 0 ? [['who', 'Reassign'], ['start', 'Start', 'go'], ['done', 'Resolve']] : t.col === 1 ? [['who', 'Reassign'], ['back', 'Back'], ['done', 'Resolve', 'go']] : [['open', 'Reopen']];
      return '<div class="ac-card' + (t.id === S.at ? ' hot' : '') + (t.fresh ? ' land' : '') + '" data-id="' + t.id + '" tabindex="0" draggable="true"><small><u' + (t.hi ? ' class="hi"' : '') + '></u>' + t.src + ' · ' + t.when + (t.hi ? '<span class="hp"> · High</span>' : '') + '</small><p>' + esc(t.title) + '</p><span class="cev">' + t.ev + '</span>' +
        '<footer>' + (t.who ? K.av(t.who) + t.who : '<span style="color:var(--mut)">Not assigned</span>') + (t.tag ? '<span class="sx-tag' + (t.tag === 'Resolved' ? ' ok' : '') + '">' + t.tag + '</span>' : '') + '</footer>' +
        '<div class="qa">' + moves.map(function (m) { return '<button type="button" data-do="' + m[0] + '"' + (m[2] ? ' class="go"' : '') + '>' + m[1] + '</button>'; }).join('') + '</div></div>';
    };
    function paint() {
      var f = WHOF[S.who][1], g = S.by < 0 ? function () { return true; } : BYF[S.by][1];
      bar.innerHTML = WHOF.map(function (w, i) { return '<button type="button" class="sx-chip' + (i === S.who ? ' on' : '') + '" data-w="' + i + '">' + w[0] + '</button>'; }).join('') + '<i class="gap"></i>' +
        BYF.map(function (b, i) { return '<button type="button" class="sx-chip' + (i === S.by ? ' on' : '') + '" data-b="' + i + '">' + b[0] + ' <b>' + T.filter(b[1]).length + '</b></button>'; }).join('');
      board.innerHTML = COLS.map(function (n, c) {
        var list = T.filter(function (t) { return t.col === c && f(t) && g(t); }).sort(function (a, b) { return (b.top || 0) - (a.top || 0) || a.id - b.id; }), all = S.open[c] || list.length <= SHOW, more = list.length - SHOW;
        return '<section class="ac-col" data-c="' + c + '"><h4>' + n + '<i>' + list.length + '</i></h4>' + (list.length ? (all ? list : list.slice(0, SHOW)).map(card).join('') : '<span class="ac-more">Nothing here</span>') +
          (!all ? '<button type="button" class="ac-more">+' + more + ' more</button>' : S.open[c] && list.length > SHOW ? '<button type="button" class="ac-more">Show less</button>' : '') + '</section>'; }).join('');
      /* a column shows the cards it has room for: measured from the cards just drawn, and drawn once more if the number changed */
      var one = board.querySelector('.ac-card'), col = board.querySelector('.ac-col');
      if (one && col && !again) { var room = Math.max(2, Math.floor((col.clientHeight - 78) / (one.offsetHeight + 10))); if (room !== SHOW) { SHOW = room; again = 1; paint(); again = 0; return; } }
      T.forEach(function (t) { t.fresh = 0; });
    }
    var again = 0, fitT = 0;
    addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(function () { if (el.classList.contains('on')) paint(); }, 150); });
    function move(t, col, tag, out) { t.col = col; t.tag = tag || ''; if (out) t.ev = esc(out); t.fresh = 1; t.top = ++uid; if (col >= 2) t.hi = t.hi && 0; paint(); }
    var note = function (t, text) { flash(el, text); };

    function open(t) {
      S.at = t.id; paint();
      t.checks = t.checks || [['Listen to the call', 0], [t.story ? 'Refund the customer' : t.src === 'Agent evaluation' ? 'Talk it through with the agent' : 'Fix it for the customer', 0], [t.story ? 'Book coaching with Selma K.' : 'Tell the customer what was done', 0]];
      t.cm = t.cm || (t.story ? [['Maya Collins', '10:05', '<em>@Alex Ward</em> second refund complaint on this route this week, worth a look.'], ['Daniel Brooks', '10:20', 'On it, calling after 14:00.']] : []);
      var closed = t.col >= 2, quote = /“/.test(t.ev);
      var s = sheet(el, ui, '<header>Task<small>From ' + (t.src === 'Alert' ? 'an alert' : t.src === 'Call' ? 'a call' : t.src.toLowerCase()) + ' · ' + t.when + '</small></header>' +
        '<div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500;text-wrap:balance">' + esc(t.title) + '</p>' + (t.story ? '<p>Cancelled JFK–LHR flight. The customer asked for a cash refund twice and the agent offered a voucher both times.</p>' : '') + '</div>' +
        '<dl><dt>Source</dt><dd><span class="sx-tag blue">' + t.src + '</span>' + (t.story ? 'Refund refused' : '') + '</dd><dt>Status</dt><dd>' + COLS[t.col] + (t.tag ? ' · ' + t.tag : '') + '</dd><dt>Priority</dt><dd><button type="button" class="lv-in" data-do="pri">' + (t.hi ? 'High' : 'Normal') + K.chev + '</button></dd>' +
        '<dt>Assignee</dt><dd><button type="button" class="lv-in" data-do="who">' + (t.who ? K.av(t.who) + t.who : 'Not assigned') + K.chev + '</button></dd></dl>' +
        (t.story ? '<div class="ac-ev heard"><h4>From the call · agent Selma K.</h4><i class="cm-tl"><s></s><u style="left:22%"></u><u style="left:43.3%"></u></i><p><b>01:22</b>“I’d like a refund for the cancelled flight.”</p><p><b>02:41</b>“I asked for a refund, not a voucher.”</p></div>'
          : !closed ? '<div class="ac-ev heard"><h4>' + (quote ? 'From the call' : 'What was found') + '</h4><p>' + t.ev + '</p></div>' : '') +
        (closed ? '<div class="ac-out"><h4>Outcome</h4><p class="lv-p">' + t.ev + '</p></div>'
          : '<h4>Checklist</h4>' + t.checks.map(function (c, i) { return '<button type="button" class="ac-check' + (c[1] ? ' done' : '') + '" data-k="' + i + '"><i>' + (c[1] ? '✓' : '') + '</i>' + c[0] + '</button>'; }).join('') +
            '<div class="ac-out"><h4>Outcome</h4><div class="f"><input type="text" placeholder="What was done" aria-label="Outcome" value="' + esc(t.out || '').replace(/"/g, '&quot;') + '"></div></div>') +
        '<div class="ac-cm"><h4>Comments<small>' + (t.cm.length || '') + '</small></h4>' + t.cm.map(function (c) { return '<p>' + (c[0] === 'Hear AI' ? '<i class="sx-av ai">AI</i>' : K.av(c[0])) + '<span><b>' + c[0] + '</b><small>' + c[1] + '</small><br>' + c[2] + '</span></p>'; }).join('') +
        '<div class="in"><input type="text" placeholder="Write a comment" aria-label="Write a comment"><small>@ a teammate, or @AI</small></div></div>' +
        '<div class="ft">' + (closed ? K.act('Reopen', 'ink') : K.act(t.col ? 'Back to Pending' : 'Start') + K.act('Close as Resolved', 'ink')) + '</div>', function () { S.at = -1; paint(); });
      var out = s.querySelector('.ac-out input'), cm = s.querySelector('.ac-cm input'), ft = s.querySelectorAll('.ft .act');
      if (out) out.addEventListener('input', function () { t.out = out.value; });
      cm.addEventListener('keydown', function (e) { var v = cm.value.trim(); if (e.key !== 'Enter' || !v) return;
        t.cm.push([ME, 'now', esc(v).replace(/@(AI|[A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+)/g, '<em>@$1</em>')]);
        if (/@ai\b/i.test(v)) t.cm.push(['Hear AI', 'now', t.story ? 'The customer asked for a cash refund at 01:22 and 02:41 and was offered a voucher both times. A refund is due under the cancellation policy.' : 'From the call: ' + t.ev.replace(/<[^>]+>/g, ' ').trim() + '. The checklist has ' + t.checks.filter(function (c) { return !c[1]; }).length + ' steps left.']);
        open(t); var again = el.querySelector('.sx-side .ac-cm input'); again.focus(); again.scrollIntoView({ block: 'nearest' }); });
      s.addEventListener('click', function (e) { var x = e.target.closest('[data-k],[data-do]'); if (!x) return;
        if (x.dataset.k) { var c = t.checks[+x.dataset.k]; c[1] = !c[1]; x.classList.toggle('done', !!c[1]); x.firstChild.textContent = c[1] ? '✓' : ''; return; }
        if (x.dataset.do === 'who') menu(el, x, [{ t: 'Not assigned', v: '', on: !t.who }].concat(WHO.map(function (w) { return { t: w === ME ? w + ' (me)' : w, v: w, on: t.who === w }; })), function (it) { t.who = it.v; open(t); });
        if (x.dataset.do === 'pri') menu(el, x, [{ t: 'High', v: 1, on: !!t.hi }, { t: 'Normal', v: 0, on: !t.hi }], function (it) { t.hi = it.v; open(t); }); });
      if (closed) ft[0].addEventListener('click', function () { move(t, 0); open(t); note(t, 'Reopened in Pending'); });
      else { ft[0].addEventListener('click', function () { move(t, t.col ? 0 : 1); open(t); note(t, t.col ? 'Started' : 'Back in Pending'); });
        ft[1].addEventListener('click', function () { S.at = -1; shut(el); move(t, 2, 'Resolved', (t.out || '').trim() || 'Resolved by ' + ME + ', today'); note(t, 'Closed as Resolved'); }); }
    }
    function fresh() {
      var s = sheet(el, ui, '<header>New task</header><div class="lv-form"><label>What needs doing<textarea rows="3" placeholder="Describe the task in a sentence"></textarea></label>' +
        '<label>Assignee<select>' + ['Not assigned'].concat(WHO).map(function (w) { return '<option>' + w + '</option>'; }).join('') + '</select></label>' +
        '<label>Priority<select><option>Normal</option><option>High</option></select></label></div><div class="ft">' + K.act('Cancel') + K.act('Create task', 'ink') + '</div>');
      var ta = s.querySelector('textarea'), sel = s.querySelectorAll('select'), b = s.querySelectorAll('.ft .act'); b[1].disabled = true; setTimeout(function () { ta.focus(); }, 300);
      ta.addEventListener('input', function () { b[1].disabled = !ta.value.trim(); });
      b[0].addEventListener('click', function () { shut(el); });
      b[1].addEventListener('click', function () { shut(el); add({ col: 0, src: 'Manual', when: 'Today', title: ta.value.trim(), ev: 'Added by ' + ME, who: sel[0].selectedIndex ? sel[0].value : '', hi: sel[1].selectedIndex }); flash(el, 'Task added to Pending'); });
    }
    function add(t) { t.id = T.length; t.fresh = 1; t.top = ++uid; T.push(t); S.open[t.col] = S.open[t.col] || false; if (el.isConnected) paint(); }
    el.addEventListener('click', function (e) {
      var t = e.target, x, c;
      if ((x = t.closest('.ac-bar .sx-chip'))) { if (x.dataset.w) S.who = +x.dataset.w; else S.by = S.by === +x.dataset.b ? -1 : +x.dataset.b; paint(); return; }
      if ((x = t.closest('button.ac-more'))) { c = +x.parentNode.dataset.c; S.open[c] = !S.open[c]; paint(); return; }
      if (t.closest('.top .act')) { fresh(); return; }
      if ((x = t.closest('.qa button'))) { var k = T[+x.closest('.ac-card').dataset.id], d = x.dataset.do;
        if (d === 'who') menu(el, x, [{ t: 'Not assigned', v: '', on: !k.who }].concat(WHO.map(function (w) { return { t: w === ME ? w + ' (me)' : w, v: w, on: k.who === w }; })), function (it) { k.who = it.v; paint(); flash(el, it.v ? 'Assigned to ' + it.v : 'Unassigned'); });
        else if (d === 'start') { move(k, 1); flash(el, 'Started'); } else if (d === 'back') { move(k, 0); flash(el, 'Back in Pending'); }
        else if (d === 'done') { if (S.at === k.id) { S.at = -1; shut(el); } move(k, 2, 'Resolved', 'Resolved by ' + ME + ', today'); flash(el, 'Closed as Resolved'); }
        else if (d === 'open') { move(k, 0); flash(el, 'Reopened in Pending'); }
        return; }
      if ((x = t.closest('.ac-card'))) { open(T[+x.dataset.id]); return; }
    });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.classList.contains('ac-card')) open(T[+e.target.dataset.id]); });
    /* a board is worked by hand: a card is picked up and put down in another column, and what that column means happens to it */
    var drag = -1, lit = function (c) { each(board.querySelectorAll('.ac-col'), function (x) { x.classList.toggle('drop', x === c); }); };
    board.addEventListener('dragstart', function (e) { var c = e.target.closest && e.target.closest('.ac-card'); if (!c) return; drag = +c.dataset.id; try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(drag)); } catch (x) {} setTimeout(function () { c.classList.add('drag'); board.classList.add('dragging'); }, 0); });
    board.addEventListener('dragover', function (e) { var c = e.target.closest('.ac-col'); if (drag < 0 || !c) return; e.preventDefault(); lit(+c.dataset.c === T[drag].col ? null : c); });
    board.addEventListener('dragleave', function (e) { if (!board.contains(e.relatedTarget)) lit(null); });
    board.addEventListener('drop', function (e) { var c = e.target.closest('.ac-col'), t = T[drag]; if (!c || !t) return; e.preventDefault(); var to = +c.dataset.c; drag = -1; board.classList.remove('dragging');
      if (to === t.col) { paint(); return; }
      if (S.at === t.id && to >= 2) { S.at = -1; shut(el); }
      move(t, to, to === 2 ? 'Resolved' : to === 3 ? 'Cancelled' : '', to === 2 ? 'Resolved by ' + ME + ', today' : to === 3 ? 'Cancelled by ' + ME + ', today' : null); flash(el, 'Moved to ' + COLS[to]); });
    board.addEventListener('dragend', function () { drag = -1; board.classList.remove('dragging'); lit(null); each(board.querySelectorAll('.ac-card.drag'), function (x) { x.classList.remove('drag'); }); });
    L.actions.add = add;
    (L.actions.wait || []).forEach(add); L.actions.wait = null;
    paint();
  };
  /* ---------- Signals ---------- */
  /* A signal can be switched off and on, opened (each with its own calls, not only the storyboard's first), edited, and a new one
     is written by whoever is at the keyboard: the page reads the sentence, previews what it would catch, and saves it as a row. */
  L.signals = function (el, ui, K) {
    KIT = K; el.classList.add('lv'); el.dataset.st = 0;
    var INFO = {
      'Cancellation intent': { n: 58, u: 17, why: [['Refund not received', 31], ['Schedule change', 16], ['Long wait on hold', 11]], q: [['2:02 pm', '“If this isn’t refunded today I’m <u>canceling everything</u>.”', 'Daniel Brooks · 6 min 12 sec'], ['1:18 pm', '“I’d rather <u>book with someone else</u> next time.”', 'Maya Collins · 4 min 40 sec'], ['12:05 pm', '“Just <u>cancel the whole trip</u>, please.”', 'Ryan Cole · 9 min 3 sec'], ['11:40 am', '“<u>Close my account</u>, I’m done waiting.”', 'Sofia Cruz · 11 min 26 sec']] },
      'Refund refused': { n: 16, u: 5, why: [['A voucher offered instead', 9], ['Outside the refund window', 4], ['Told to call back', 3]], q: [['2:41 pm', '“I asked for <u>a refund, not a voucher</u>.”', 'Daniel Brooks · 6 min 12 sec'], ['11:15 am', '“So you are <u>not refunding me</u> at all?”', 'Alex Ward · 10 min 36 sec'], ['10:52 am', '“You said the <u>refund was on its way</u>.”', 'Paula Nunes · 7 min 48 sec']] },
      'Disclosure missing': { n: 14, u: 3, why: [['Outbound sales calls', 8], ['Call-backs', 4], ['Transfers', 2]], q: [['4:20 pm', 'No recording notice <u>before 00:30</u>.', 'Ryan Cole · 3 min 5 sec'], ['1:02 pm', 'The notice was read <u>at 01:10</u>, after the booking details.', 'Sofia Cruz · 4 min 10 sec'], ['9:48 am', 'No recording notice <u>before 00:30</u>.', 'Alex Ward · 2 min 40 sec']] },
      'Upgrade offer missed': { q: [['3:15 pm', '“Is there <u>a better seat</u> on this one?”', 'Maya Collins · 3 min 20 sec'], ['10:07 am', '“I would have <u>paid for more room</u>.”', 'Ryan Cole · 5 min 2 sec']] },
      'Long silence': { q: [['1:44 pm', '<u>24 seconds</u> of silence while the booking loaded.', 'Sofia Cruz · 4 min 51 sec'], ['9:12 am', '<u>31 seconds</u> on hold without a word.', 'Alex Ward · 6 min 30 sec']] },
      'Competitor mentioned': { q: [['12:30 pm', '“<u>The other airline</u> would have changed it for free.”', 'Paula Nunes · 5 min 14 sec'], ['11:02 am', '“I found it cheaper <u>on another carrier</u>.”', 'Daniel Brooks · 2 min 58 sec']] },
      'Praise for the agent': { q: [['Sep 27', '“Thank you, <u>Sofia</u>, you saved my trip.”', 'Sofia Cruz · 3 min 44 sec']] } };
    /* what a sentence is about: its name as a signal, what else it catches, two calls it would have caught */
    var KNOWN = [[/supervisor|manager|in charge/, 'Supervisor requested', 'Also catches “a manager” and “someone in charge”', ['“Can I <u>speak to your supervisor</u>, please?”', '“I want <u>a manager</u> on the line.”'], 23],
      [/lawyer|legal|sue|court/, 'Legal threat', 'Also catches “my lawyer” and “take this to court”', ['“You will hear from <u>my lawyer</u>.”', '“I will <u>take this to court</u> if I have to.”'], 9],
      [/hold|wait|queue/, 'Long wait mentioned', 'Also catches “on hold” and “been waiting”', ['“I have been <u>on hold for forty minutes</u>.”', '“Why is <u>the wait</u> always this long?”'], 61],
      [/price|expensive|cost|cheaper/, 'Price objection', 'Also catches “too expensive” and “cheaper elsewhere”', ['“That is <u>too expensive</u> for a change.”', '“It was <u>cheaper</u> last week.”'], 47],
      [/rude|shout|swear|angry/, 'Heated call', 'Also catches raised voices and “this is unacceptable”', ['“This is <u>unacceptable</u>.”', '“Do not <u>talk to me like that</u>.”'], 18],
      [/thank|praise|great service|helpful/, 'Thanks for the help', 'Also catches “you were great” and “so helpful”', ['“You have been <u>so helpful</u>, thank you.”', '“<u>Great service</u>, really.”'], 84]];
    function understand(text) {
      var s = text.toLowerCase(), k = KNOWN.filter(function (r) { return r[0].test(s); })[0];
      if (k) return { name: k[1], also: k[2], q: k[3], n: k[4], rule: text };
      var words = text.replace(/[^\w\s’'-]/g, '').split(/\s+/).filter(function (w) { return w.length > 3 && !/^(the|that|this|with|when|where|customer|caller|agent|calls?|says?|asks?|about|their|they|wants?|have|from)$/i.test(w); }).slice(0, 3);
      var name = (words.join(' ') || 'New signal'); name = name.charAt(0).toUpperCase() + name.slice(1);
      return { name: name, also: 'Reads the meaning, not only the words', q: ['“…<u>' + esc(words.slice(0, 2).join(' ') || text) + '</u>…”', '“…<u>' + esc(words.slice(-2).join(' ') || text) + '</u>, please.”'], n: 6 + text.length % 23, rule: text };
    }
    var days = function (n) { var out = [], left = n; for (var d = 0; d < 14; d++) { var v = d === 13 ? left : Math.max(0, Math.round(n / 14 + ((d * 7 + n) % 5 - 2) * n / 60)); v = Math.min(v, left); out.push(v); left -= v; } return out; };
    var spark = function (a) { var u = a.reduce(function (x, y) { return x + y; }, 0) / a.length || 1; return '<span class="sp">' + a.map(function (v, d) { return '<i style="height:' + Math.min(100, Math.max(12, v / u * 50)).toFixed(0) + '%;--d:' + d + '"></i>'; }).join('') + '<u style="bottom:50%"></u></span>'; };
    var nn = el.querySelector('.sg-nn'), sub = nn.parentNode, h1 = el.querySelector('.sx-h span'), h2 = el.querySelector('.sg-h2'), list = el.querySelector('.sg-list'), fire = el.querySelector('.sg-fire');
    var box = el.querySelector('.sg-new'), fresh = el.querySelector('.sg-r.fresh'), tag = box.querySelector('.sx-tag'), nw = el.querySelector('.sg-nw'), cx = el.querySelector('.sg-cx');
    var tx = document.createElement('input'); tx.className = 'tx'; tx.type = 'text'; tx.placeholder = 'Describe the calls to catch, then press Enter'; tx.setAttribute('aria-label', 'Describe the calls to catch'); tx.autocomplete = 'off'; box.querySelector('.tx').replaceWith(tx);
    var gone = el.querySelector('.sg-r.add'); if (gone) gone.remove();
    each(el.querySelectorAll('.tg'), function (t) { t.setAttribute('role', 'switch'); t.tabIndex = 0; });
    each(el.querySelectorAll('.sg-card,.sg-list .sg-r'), function (r) { r.tabIndex = 0; });
    var nameOf = function (r) { return (r.querySelector('header b') || r.querySelector('.nm').firstChild).textContent.trim(); };
    var SER = { 'Cancellation intent': [16, 18, 17, 19, 16, 18, 17, 20, 26, 34, 44, 52, 57, 58], 'Refund refused': [4, 5, 4, 5, 4, 5, 5, 4, 5, 5, 6, 11, 15, 16], 'Disclosure missing': [2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 5, 13, 14] }, tipEl = el.querySelector('.sx-tip'), tipAt = null;
    fire.addEventListener('pointermove', function (e) { var b = e.target.closest('.sg-plot>i'); if (b === tipAt) return; tipAt = b; if (!b) { tipEl.classList.remove('on'); return; }
      var card = b.closest('.sg-card'), k = [].indexOf.call(card.querySelectorAll('.sg-plot>i'), b), ser = SER[nameOf(card)] || [], u = INFO[nameOf(card)] && INFO[nameOf(card)].u, d = new Date(2026, 8, 29 + k), v = ser[k];
      if (v == null) return; ui.tip(b, '<strong>' + ['Sep', 'Oct'][d.getMonth() - 8] + ' ' + d.getDate() + '</strong><span class="big">' + v + ' <small>calls</small></span><span>' + (u ? (v > u * 2 ? (v / u).toFixed(1) + ' times the usual ' + u : 'Usual day · ' + u) : '') + '</span>'); });
    fire.addEventListener('pointerleave', function () { tipAt = null; tipEl.classList.remove('on'); });
    function count() {
      var cards = [].slice.call(fire.children), on = cards.filter(function (c) { return !c.classList.contains('off'); }).length, rows = [].slice.call(list.children), act = rows.filter(function (r) { return !r.querySelector('.tg').classList.contains('off'); }).length;
      nn.textContent = cards.length + rows.length; sub.lastChild.textContent = ' signals · ' + on + ' triggered now';
      h1.textContent = on + (on === 1 ? ' signal' : ' signals') + ' over twice ' + (on === 1 ? 'its' : 'their') + ' usual day';
      h2.firstChild.textContent = 'The other ' + (['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][rows.length] || rows.length);
      h2.lastChild.textContent = act + ' active, inside their usual range' + (rows.length - act ? ' · ' + (rows.length - act) + ' paused' : '');
    }
    function toggle(r) {
      var t = r.querySelector('.tg'), off = !t.classList.contains('off'); t.classList.toggle('off', off); t.setAttribute('aria-checked', !off); r.classList.toggle('off', off);
      if (r.classList.contains('sg-r')) { var g = r.querySelector('.sx-tag:last-child'); if (g) g.textContent = off ? 'Paused' : 'Active';
        var ct = r.querySelector('.ct'); if (off) { r._ct = r._ct || ct.innerHTML; ct.innerHTML = '<span class="off">Off since today</span>'; } else if (r._ct && !/Off since/.test(r._ct)) ct.innerHTML = r._ct; else ct.innerHTML = '<span class="off">Counting from today</span>'; }
      count(); flash(el, nameOf(r) + (off ? ' is paused' : ' is active'));
    }
    function open(r) {
      var name = nameOf(r), d = INFO[name] || r._info || { q: [] }, card = r.classList.contains('sg-card'), desc = (r.querySelector(':scope>small') || r.querySelector('.nm small')).textContent, total = card ? r.querySelector('.fig em').textContent.replace(/\D+(\d+).*/, '$1') : (r.querySelector('.ct b') || {}).textContent;
      each(el.querySelectorAll('.sg-card,.sg-list .sg-r'), function (x) { x.classList.toggle('hot', x === r); }); el.classList.add('pk');
      var s = sheet(el, ui, '<header>' + name + '<small>' + (total ? total + ' calls in 14 days' : 'Paused') + '</small></header><div class="a" style="margin-top:14px"><p>' + desc + '.' + (d.n ? ' Over twice its usual day: <b>' + d.n + ' calls yesterday against a usual ' + d.u + '.</b>' : total ? ' Inside its usual range.' : '') + '</p></div>' +
        (d.why ? '<div class="sg-why"><h4>What the ' + d.n + ' calls are about</h4>' + d.why.map(function (w, n) { return '<div style="--i:' + n + '"><span>' + w[0] + '</span><b>' + w[1] + '</b><i><u style="width:' + (w[1] / d.why[0][1] * 100).toFixed(0) + '%"></u></i></div>'; }).join('') + '</div>' : '') +
        (d.q.length ? '<h4>' + (d.n ? 'Caught yesterday · ' + d.q.length + ' of ' + d.n : 'Calls it caught') + '</h4><ul class="sg-q">' + d.q.map(function (q, n) { return '<li style="--i:' + n + '"><b>' + q[0] + '</b><span>' + q[1] + '<small>' + q[2] + '</small></span></li>'; }).join('') + '</ul>' : '') +
        (total ? '<button type="button" class="sg-all">Open ' + (d.n ? 'all ' + d.n : 'the') + ' calls →</button>' : '') + '<div class="ft">' + K.act('Edit rule') + K.act('Create a task', 'ink') + '</div>', function () { el.classList.remove('pk'); });
      var b = s.querySelectorAll('.ft .act'), all = s.querySelector('.sg-all');
      if (all) all.addEventListener('click', function () { go('data', [{ k: 'Signal', v: name, n: d.n || Math.min(60, +total || 20) }]); });
      b[0].addEventListener('click', function () { edit(r, name, desc); });
      b[1].addEventListener('click', function () { task({ col: 0, src: 'Signal', when: 'Today', hi: d.n ? 1 : 0, title: name + ': ' + (d.n ? d.n + ' calls yesterday, usual day ' + d.u : 'look into the calls it caught'), ev: (d.q[0] ? d.q[0][1] : desc), who: '' }); b[1].disabled = true; b[1].classList.add('made'); b[1].textContent = 'Task created'; flash(el, 'Task added to Workflows'); });
    }
    function edit(r, name, desc) {
      var s = sheet(el, ui, '<header>Edit rule</header><div class="lv-form"><label>Name<input type="text" value="' + esc(name).replace(/"/g, '&quot;') + '"></label><label>Catch calls where<textarea rows="3">' + esc(desc) + '</textarea></label></div><div class="ft">' + K.act('Cancel') + K.act('Save', 'ink') + '</div>', function () { el.classList.remove('pk'); });
      var f = s.querySelectorAll('input,textarea'), b = s.querySelectorAll('.ft .act');
      b[0].addEventListener('click', function () { open(r); });
      b[1].addEventListener('click', function () { var n = f[0].value.trim() || name, t = f[1].value.trim().replace(/\.$/, '') || desc; if (INFO[name] && n !== name) { INFO[n] = INFO[name]; } else if (r._info) r._info.name = n;
        var hb = r.querySelector('header b'); if (hb) hb.textContent = n; else r.querySelector('.nm').firstChild.textContent = n; (r.querySelector(':scope>small') || r.querySelector('.nm small')).textContent = t; open(r); flash(el, 'Rule saved'); });
    }
    /* a new signal */
    var info = null, timers = [];
    function reset() { timers.forEach(clearTimeout); timers = []; el.dataset.st = 0; el.classList.remove('sd', 'sv'); box.classList.remove('done', 'found'); fresh.classList.remove('in', 'q'); tx.value = ''; tx.disabled = false; info = null; }
    function start() { shut(el); reset(); el.dataset.st = 2; setTimeout(function () { tx.focus(); }, 80); }
    function preview() {
      var text = tx.value.trim(); if (!text || info) return; info = understand(text); info.d = days(info.n); tx.disabled = true;
      box.classList.add('done'); tag.textContent = 'Reading the last 14 days…';
      fresh.innerHTML = '<span class="nm"><span>' + esc(info.name) + '<span class="sx-tag nw">Preview</span></span><small>' + info.also + '</small></span>' + spark(info.d) + '<span class="ct"><b>0</b>calls in 14 days</span>' + K.act('Save signal', 'ink') +
        '<div class="mq"><small>2 of the ' + info.n + '</small><span>' + info.q[0] + '<small> · Oct 12</small></span><span>' + info.q[1] + '<small> · Oct 11</small></span></div>';
      timers.push(setTimeout(function () { box.classList.add('found'); fresh.classList.add('in'); var nb = fresh.querySelector('.ct b'), cu = 0;
        info.d.forEach(function (v, k) { cu += v; (function (cu) { timers.push(setTimeout(function () { nb.textContent = cu; }, 500 + k * 45)); })(cu); });
        timers.push(setTimeout(function () { fresh.classList.add('q'); }, 1500)); }, 1000));
    }
    function save() {
      var sv = fresh.querySelector('.act'), pt = fresh.querySelector('.nm .sx-tag'), it = info; if (!it || sv.classList.contains('saved')) return;
      sv.classList.add('saved'); sv.textContent = 'Saved'; pt.className = 'sx-tag flip'; pt.textContent = 'Active';
      timers.push(setTimeout(function () { reset(); addRow(it); nn.classList.remove('up'); void nn.offsetWidth; nn.classList.add('up'); flash(el, it.name + ' is now a signal'); }, 900));
    }
    function addRow(it) {
      var row = document.createElement('div'); row.className = 'sg-r land'; row.tabIndex = 0; it.d = it.d || days(it.n);
      row._info = { q: (it.q || []).map(function (q, n) { return [n ? 'Oct 11' : 'Oct 12', q, n ? 'Ryan Cole · 4 min 2 sec' : 'Maya Collins · 5 min 37 sec']; }) };
      row.innerHTML = '<i class="tg" role="switch" tabindex="0"></i><span class="nm">' + esc(it.name) + '<span class="sx-tag nw">New</span><small>' + esc(it.rule.replace(/\.$/, '')) + '</small></span>' + spark(it.d) + '<span class="ct"><b>' + it.n + '</b>calls in 14 days</span><span class="sx-tag">Active</span>';
      list.insertBefore(row, list.firstChild); count();
    }
    L.signals.add = addRow; (L.signals.wait || []).forEach(addRow); L.signals.wait = null;
    tx.addEventListener('keydown', function (e) { if (e.key === 'Enter') preview(); if (e.key === 'Escape') reset(); });
    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if (nw.contains(t)) { start(); return; }
      if (cx.contains(t)) { reset(); return; }
      if (t.closest('.sg-r.fresh .act')) { save(); return; }
      if ((x = t.closest('.tg'))) { toggle(x.closest('.sg-card,.sg-r')); return; }
      if ((x = t.closest('.sg-card,.sg-list .sg-r'))) { open(x); return; }
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.tg,.sg-card,.sg-list .sg-r')) { e.preventDefault(); e.target.click(); } });
    count();
  };

  /* ---------- Newsroom ---------- */
  /* The sections are sections (each lists its own stories and they add up to the 31 on the masthead), a story opens with why it is
     here and the way to its calls, the chart answers the pointer, and Play plays: the storyboard's three slides on a clock, with a
     way back, forward and out. */
  L.news = function (el, ui, K) {
    KIT = K; el.classList.add('lv');
    var me = (window.hearScreens.all || []).filter(function (m) { return m.key === 'news'; })[0];
    /* headline, source line, where it is heading, its tag's look, today? */
    var SEC = { 'Signals': [['Cancellation intent is running at 3.4 times its usual day', 'Signal · Cancellation intent · 4:12 pm', 'Surging', 'ink', 1], ['Recording disclosure went missing on 27 calls in two days', 'Signal · Disclosure missing · since Oct 11', 'Rising', 'ink'], ['Silence on Trip Status calls is down a third', 'Signal · Long silence · since the new script', 'Improving', 'ok'],
        ['Refund refused: 16 calls yesterday against a usual 5', 'Signal · Refund refused · 9:40 am', 'Rising', 'ink', 1], ['Upgrade offers were missed on 15 calls a day, as usual', 'Signal · Upgrade offer missed · Oct 12', 'Steady', ''], ['A competitor was named on 3 calls a day, no change', 'Signal · Competitor mentioned · Oct 12', 'Steady', ''],
        ['Customers asked for a supervisor on 23 calls in two weeks', 'Signal · Supervisor requested · Oct 11', 'New', 'nw'], ['Long silences fell under 7 a day for the first time', 'Signal · Long silence · Oct 10', 'Improving', 'ok'], ['Cancellation intent first passed twice its usual day', 'Signal · Cancellation intent · Oct 9', 'New', 'nw']],
      'Agent evaluation': [['Team B handle time is up 40% on last week', 'Agent evaluation · 2:30 pm', 'Rising', 'ink', 1], ['Eight agents are under 60, five on the same criterion', 'Agent evaluation · Service quality · 11:05 am', 'New', 'nw', 1], ['The center’s average held at 76 for a third week', 'Agent evaluation · Oct 12', 'Steady', ''],
        ['Explains the refund policy fell from 81 to 52 on Sep 30', 'Agent evaluation · Service quality · Oct 12', 'Rising', 'ink'], ['27 agents scored 90 or more, two more than last month', 'Agent evaluation · Oct 11', 'Improving', 'ok'], ['Verifies identity is the weakest criterion for new hires', 'Agent evaluation · Oct 10', 'New', 'nw'],
        ['Ines Moreau led every criterion for the second week', 'Agent evaluation · Oct 9', 'Steady', ''], ['Shows empathy rose 4 points after the September workshop', 'Agent evaluation · Oct 8', 'Improving', 'ok']],
      'Compliance': [['Valid sales held above the 90% target for a sixth week', 'Compliance · weekly report', 'Steady', ''], ['Fee disclosure fell to 88%, under its 95% line', 'Compliance · Compliance review · Oct 12', 'Rising', 'ink'], ['Identity checks passed on 97% of ticket changes', 'Compliance · Oct 11', 'Steady', ''],
        ['Twelve calls are waiting in Disclosure review', 'Compliance · Disclosure review · 8:15 am', 'New', 'nw', 1], ['The vulnerability protocol was skipped on 4 calls', 'Compliance · Oct 10', 'Rising', 'ink'], ['The pass rate is back to 94% after the script fix', 'Compliance · Oct 8', 'Improving', 'ok']],
      'Alerts': [['Refund asked twice, voucher offered: 6 calls in 7 days', 'Alert · Refund refused · Oct 13', 'New', 'nw thread', 1], ['A payment failure blocked bookings for 40 minutes', 'Alert · Technical failure · Oct 10', 'Steady', ''], ['A lost-bag claim was escalated to the ground team', 'Alert · Escalation · Oct 5', 'Improving', 'ok'],
        ['A customer said they will dispute the charge', 'Alert · Chargeback risk · 10:20 am', 'New', 'nw', 1], ['Three calls in one hour asked for a manager', 'Alert · Supervisor requested · Oct 12', 'Rising', 'ink'], ['A promised callback was missed twice for one customer', 'Alert · Callback missed · Oct 11', 'Rising', 'ink'],
        ['A VIP escalation was closed within the hour', 'Alert · VIP · Oct 9', 'Improving', 'ok'], ['A duplicate alert on the booking engine was merged', 'Alert · Duplicate · Oct 10', 'Steady', '']] };
    var NAMES = ['Front page', 'Signals', 'Agent evaluation', 'Compliance', 'Alerts'], WHY = { Surging: 'It passed twice its usual level and has stayed above it for four days.', Rising: 'It has moved the wrong way for three days in a row.', New: 'It was first seen this week.', Improving: 'It has moved the right way for a week.', Steady: 'It held its level. Nothing to do; it is here so you know.' };
    var S = { tab: 0, today: false }, mast = el.querySelector('.nr-mast'), bodyEl = el.querySelector('.nr-body'), range = el.querySelector('.top .act'), share = el.querySelectorAll('.top .act')[1], front = el.querySelector('.nr-list').innerHTML;
    var sec = document.createElement('div'); sec.className = 'nr-sec'; bodyEl.appendChild(sec);
    each(mast.querySelectorAll('.tab'), function (t) { t.setAttribute('role', 'button'); t.tabIndex = 0; });
    var item = function (s) { return '<button type="button" class="nr-item' + (/thread/.test(s[3]) ? ' thread' : '') + '"><b>' + s[0] + '</b><span class="sx-tag ' + s[3].replace(' thread', '') + '">' + s[2] + '</span><span>' + s[1] + '</span></button>'; };
    var all = function () { return NAMES.slice(1).reduce(function (a, n) { return a.concat(SEC[n]); }, []); };
    var find = function (h) { return all().filter(function (s) { return s[0] === h; })[0]; };
    function paint() {
      var keep = function (s) { return !S.today || s[4]; }, total = all().filter(keep).length;
      mast.querySelector('.day').lastChild.textContent = total + ' stories ' + (S.today ? 'today' : 'in the last 7 days');
      each(mast.querySelectorAll('.tab'), function (t, i) { t.classList.toggle('on', i === S.tab); var sm = t.querySelector('small'); if (sm) sm.textContent = SEC[NAMES[i]].filter(keep).length; });
      range.innerHTML = (S.today ? 'Today' : 'Last 7 days') + K.chev;
      el.classList.toggle('sec', S.tab > 0);
      if (S.tab) { var list = SEC[NAMES[S.tab]].filter(keep); var top1 = list[0];
        sec.innerHTML = '<div class="sx-h"><b>' + NAMES[S.tab] + '</b><span>' + list.length + (list.length === 1 ? ' story' : ' stories') + (S.today ? ' today' : ' in the last 7 days') + '</span></div>' + (top1 ? '<div class="nr-cols"><button type="button" class="nr-item nr-sl"><span class="sx-tag ' + top1[3].replace(' thread', '') + '">' + top1[2] + '</span><b>' + top1[0] + '</b><span>' + top1[1] + '</span>' + ((FIG[top1[0]] || {}).p ? '<em class="p">' + FIG[top1[0]].p + '</em>' : '') + figure(top1) + '<em><strong>Why you’re seeing this</strong>' + ((FIG[top1[0]] || {}).why || WHY[top1[2]]) + '</em></button><div class="nr-list">' + list.slice(1).map(item).join('') + '</div></div>' : '<p class="lv-p" style="padding:18px 0">No stories today in this section.</p>'); }
      else el.querySelector('.nr-side .nr-list').innerHTML = front.replace(/<div class="nr-item/g, '<button type="button" class="nr-item').replace(/<\/span><\/div>/g, '</span></button>');
    }
    /* critic, 26.11.2026: a chart with no numbers under a headline that has one is decoration. A story carries a figure only when
       its numbers are known, and the bars are those numbers, each with its value: they add up to what the headline says. */
    var FIG = { 'Cancellation intent is running at 3.4 times its usual day': { v: [20, 26, 34, 44, 52, 57, 58], t: 'Calls a day', x: ['Oct 6', 'Oct 12'], p: 'In 58 calls yesterday the customer said they want to cancel or leave. A usual day has 17. Most of them are about a refund that has not arrived.' },
      'Recording disclosure went missing on 27 calls in two days': { v: [3, 3, 2, 3, 3, 13, 14], t: 'Calls a day without the disclosure', x: ['Oct 6', 'Oct 12'] },
      'Silence on Trip Status calls is down a third': { v: [12, 11, 10, 9, 8, 8, 8], t: 'Long silences a day', x: ['Oct 6', 'Oct 12'] },
      'Refund refused: 16 calls yesterday against a usual 5': { v: [4, 5, 5, 6, 11, 15, 16], t: 'Calls a day', x: ['Oct 6', 'Oct 12'] },
      'Team B handle time is up 40% on last week': { v: [5.0, 5.1, 5.4, 6.0, 6.6, 6.9, 7.0], t: 'Team B · minutes a call', x: ['Oct 7', 'Oct 13'], p: 'A call took Team B five minutes a week ago and takes seven now. The other three teams did not move. The extra time is on refund calls, where agents wait on the booking system.' },
      'Valid sales held above the 90% target for a sixth week': { v: [91, 92, 91, 93, 92, 92], t: 'Valid sales, % · by week', x: ['Sep 1', 'Oct 6'], p: 'Six weeks in a row over the 90% line. The two weeks under it in August followed the fare change; nothing since has come close.' },
      'Refund asked twice, voucher offered: 6 calls in 7 days': { v: [0, 1, 0, 1, 1, 1, 2], t: 'Calls a day', x: ['Oct 7', 'Oct 13'], why: 'First seen on Oct 8. Six calls since, two of them today.', p: 'Six customers asked for a refund on a cancelled flight twice in one call, and were offered a voucher both times. Four of the six calls were taken by two agents.' } };
    function figure(s) { var f = FIG[s[0]]; if (!f) return ''; var mx = Math.max.apply(0, f.v), last = f.v.length - 1;
      return '<h4 class="lv-wkt">' + f.t + '</h4><div class="lv-wk">' + f.v.map(function (v, d) { return '<i class="' + (d === last ? (/Rising|Surging|New/.test(s[2]) ? 'hi' : s[2] === 'Improving' ? 'ok' : '') : '') + '" style="height:' + Math.max(2, v / mx * 100).toFixed(0) + '%"><b>' + v + '</b></i>'; }).join('') + '</div><div class="lv-wkx"><span>' + f.x[0] + '</span><span>' + f.x[1] + '</span></div>'; }
    function story(s) {
      var kind = s[1].split(' · ')[0], sg = kind === 'Signal' ? s[1].split(' · ')[1] : null, n = (/(\d+) calls/.exec(s[0]) || [])[1];
      var st = sheet(el, ui, '<header>Story<small>' + s[1].split(' · ').slice(-1)[0] + '</small></header><div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500;text-wrap:balance">' + s[0] + '</p></div>' +
        '<dl><dt>Section</dt><dd>' + (kind === 'Alert' ? 'Alerts' : kind === 'Signal' ? 'Signals' : kind) + '</dd><dt>Source</dt><dd>' + s[1].split(' · ').slice(0, 2).join(' · ') + '</dd><dt>Heading</dt><dd><span class="sx-tag ' + s[3].replace(' thread', '') + '">' + s[2] + '</span></dd></dl>' +
        figure(s) +
        '<h4>Why you’re seeing this</h4><p class="lv-p">' + ((FIG[s[0]] || {}).why || WHY[s[2]]) + '</p><div class="ft">' + K.act('See the calls') + K.act('Create a task', 'ink') + '</div>');
      var b = st.querySelectorAll('.ft .act');
      b[0].addEventListener('click', function () { if (kind === 'Agent evaluation') go('agents'); else if (kind === 'Compliance') go('data', [{ k: 'Score', op: 'under', n: 60 }]); else go('data', [{ k: 'Signal', v: sg || s[1].split(' · ')[1] || 'Alert', n: +n || 24 }]); });
      b[1].addEventListener('click', function () { task({ col: 0, src: kind === 'Alert' ? 'Alert' : kind === 'Agent evaluation' ? 'Agent evaluation' : 'Newsroom', when: 'Today', hi: /Rising|Surging/.test(s[2]) ? 1 : 0, title: s[0], ev: s[1], who: '' }); b[1].disabled = true; b[1].classList.add('made'); b[1].textContent = 'Task created'; flash(el, 'Task added to Workflows'); });
    }
    /* the lead story's chart: the day under the pointer */
    var plot = el.querySelector('.nr-plot'), V = [17, 16, 17, 18, 17, 16, 17, 18, 17, 16, 17, 17, 18, 17, 16, 17, 16, 18, 17, 19, 16, 18, 17, 20, 26, 34, 44, 52, 57, 58], dot = document.createElement('i'); dot.className = 'lv-dot'; plot.appendChild(dot);
    var tip = el.querySelector('.sx-tip'), at = -1;
    plot.addEventListener('pointermove', function (e) {
      var r = plot.getBoundingClientRect(), i = Math.max(0, Math.min(29, Math.round((e.clientX - r.left) / r.width * 29))); if (i === at) return; at = i;
      var d = new Date(2026, 8, 13 + i); dot.style.left = (i / 29 * 100) + '%'; dot.style.top = (100 - V[i] / 70 * 100) + '%'; dot.classList.add('on');
      ui.tip(dot, '<strong>' + ['Sep', 'Oct'][d.getMonth() - 8] + ' ' + d.getDate() + '</strong><span class="big">' + V[i] + ' <small>calls</small></span><span>' + (V[i] > 34 ? (V[i] / 17).toFixed(1) + ' times the usual day' : V[i] > 20 ? 'Above the usual 17' : 'A usual day') + '</span>');
    });
    plot.addEventListener('pointerleave', function () { at = -1; dot.classList.remove('on'); tip.classList.remove('on'); });

    /* Play: three slides on a clock. A click on the right goes on, on the left goes back; the cross or Esc leaves */
    var st = el.querySelector('.nr-story'), LEN = [4600, 5200, 6400], at2 = -1, clock = 0;
    var ctl = document.createElement('div'); ctl.className = 'lv-story';
    ctl.innerHTML = '<div class="bar"><i><u></u></i><i><u></u></i><i><u></u></i></div><button type="button" class="x" aria-label="Close the story">' + ic(X) + '</button><button type="button" class="pv" aria-label="Previous"></button><button type="button" class="nx" aria-label="Next"></button><button type="button" class="again">' + ic('<path d="M4 9a5 5 0 1 0 1.6-3.7M4 3.5v2.3h2.3"/>') + 'Play again</button>';
    st.appendChild(ctl);
    function slide(i) {
      clearTimeout(clock); if (i > 2) { ctl.classList.add('end'); return; } at2 = i; ctl.classList.remove('end');
      me.step(i + 1, false); el.classList.add('play');
      each(ctl.querySelectorAll('.bar i'), function (b, k) { b.className = k < i ? 'done' : k === i ? 'run' : ''; var u = b.firstChild; u.style.animation = 'none'; void u.offsetWidth; u.style.animation = ''; u.style.animationDuration = LEN[i] + 'ms'; });
      clock = setTimeout(function () { slide(i + 1); }, LEN[i]);
    }
    function stop() { clearTimeout(clock); at2 = -1; el.classList.remove('play'); ctl.classList.remove('end'); me.step(0, true); paint(); }
    ctl.addEventListener('click', function (e) { e.stopPropagation(); var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('x')) stop(); else if (b.classList.contains('again')) slide(0); else if (b.classList.contains('pv')) slide(Math.max(0, at2 - 1)); else slide(at2 + 1); });
    addEventListener('keydown', function (e) { if (at2 < 0 || !el.classList.contains('on')) return; if (e.key === 'Escape') stop(); if (e.key === 'ArrowRight') slide(at2 + 1); if (e.key === 'ArrowLeft') slide(Math.max(0, at2 - 1)); });
    /* leaving the screen in the middle of the story ends it */
    new MutationObserver(function () { if (at2 >= 0 && !el.classList.contains('on')) stop(); }).observe(el, { attributes: true, attributeFilter: ['class'] });

    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if ((x = t.closest('.nr-mast .tab'))) { S.tab = [].indexOf.call(mast.querySelectorAll('.tab'), x); shut(el); paint(); return; }
      if (range.contains(t)) { menu(el, range, [{ t: 'Today', v: true, on: S.today }, { t: 'Last 7 days', v: false, on: !S.today }], function (it) { S.today = it.v; paint(); }, true); return; }
      if (share.contains(t)) { copy(location.href); flash(el, 'Link to the Newsroom copied'); return; }
      if (t.closest('.nr-play') || t.closest('.nr-feat')) { shut(el); slide(0); return; }
      if (t.closest('.nr-see')) { go('data', [{ k: 'Signal', v: 'Cancellation intent', n: 211 }]); return; }
      if ((x = t.closest('.nr-item'))) { var s = find(x.querySelector('b').textContent); if (s) story(s); return; }
      if (t.closest('.nr-lead h3,.nr-kick')) { story(SEC.Signals[0]); return; }
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.tab')) { e.preventDefault(); e.target.click(); } });
    paint();
  };
  /* ---------- Knowledge ---------- */
  /* The sidebar had the word and no page behind it. What the product's Knowledge holds, in the Studio's look: the documents (in
     folders), links and terms Hear reads before it answers. Each can be switched off, opened, removed; new ones can be added. */
  (function () {
    var stage = document.getElementById('stage'); if (!stage || new URLSearchParams(location.search).get('screen')) return;
    var nav = [].filter.call(document.querySelectorAll('.side .nv'), function (b) { return b.textContent.trim() === 'Knowledge'; })[0]; if (!nav) return;
    var DOCS = [['Policies', [['Refund_Policy.pdf', '4 pages', 'Oct 2', 212, 'When a refund is due, how long it takes and when a voucher may be offered instead.'], ['Fare_Rules.pdf', '11 pages', 'Sep 18', 164, 'What each fare class allows: changes, cancellations and their fees.'], ['Baggage_Fees.pdf', '2 pages', 'Sep 30', 97, 'Prices for a first, second and oversize bag on every route.']]],
      ['Scripts', [['Opening_Script.docx', '1 page', 'Aug 27', 143, 'The greeting: name, company and the offer to help.'], ['Recording_Disclosure.txt', '6 lines', 'Oct 11', 188, 'The notice that the call is recorded, to be read in the first 30 seconds.'], ['Verification_Steps.md', '2 pages', 'Sep 9', 121, 'The two details an agent checks before opening a booking.']]],
      ['Training', [['Onboarding_Checklist.md', '3 pages', 'Jul 14', 22, 'What a new agent covers in the first two weeks.'], ['Escalation_Matrix.md', '2 pages', 'Sep 3', 64, 'Who takes a call when it leaves the first line, by issue.'], ['Upgrade_Offers.pdf', '5 pages', 'Sep 22', 58, 'When a customer is eligible for an upgrade and how to offer it.']]]];
    var LINKS = [['northwind.example/help/refunds', 'Refunds and credits · help center', 'Read today, 6:00 am', 76], ['northwind.example/help/baggage', 'Baggage · help center', 'Read today, 6:00 am', 41], ['status.northwind.example', 'Service status', 'Read 12 min ago', 19]];
    var TERMS = [['PNR', 'The six-character booking reference'], ['Voucher', 'Credit for a future flight, offered in place of a refund'], ['Fare class', 'The letter that sets what a ticket allows'], ['Layover', 'A stop between two flights on one booking'], ['No-show', 'A traveler who did not board and did not cancel'],
      ['Chargeback', 'A payment the customer disputed with their bank'], ['Codeshare', 'A flight sold by one airline and flown by another'], ['Open jaw', 'A return trip that comes back from a different city']];
    var SAYS = { 'Refund_Policy.pdf': ['A cancelled flight is refunded in full to the original payment method within seven working days.', 'A voucher may be offered. It is never given in place of a refund the customer has asked for.'],
      'Fare_Rules.pdf': ['Flex fares change free of charge up to two hours before departure.', 'Saver fares change for a fee of 45 euros and are not refundable after 24 hours.'], 'Baggage_Fees.pdf': ['The first checked bag is 30 euros online and 45 euros at the airport.', 'Sports equipment counts as one bag up to 32 kg.'],
      'Opening_Script.docx': ['“Thank you for calling Northwind, this is [name]. How can I help?”', 'Say the company and your name before anything else.'], 'Recording_Disclosure.txt': ['“This call is recorded for quality and training.”', 'Read it in the first 30 seconds, before any booking detail.'],
      'Verification_Steps.md': ['Ask for the booking reference and the date of birth.', 'Open the booking only after both match.'], 'Onboarding_Checklist.md': ['Week one: the booking system, the opening and the disclosure.', 'Week two: refunds, changes and when to hand a call on.'],
      'Escalation_Matrix.md': ['Refund over 500 euros: team lead. Lost bag over 48 hours: ground team.', 'A customer who asks for a supervisor twice is handed on, without a third ask.'], 'Upgrade_Offers.pdf': ['Offer an upgrade when the fare allows it and a better seat is free.', 'Say the price once, and do not repeat the offer after a no.'] };
    var S = { tab: 0, q: '', shut: {} }, id = 0, I = [];
    DOCS.forEach(function (f) { f[1].forEach(function (d) { I.push({ id: id++, kind: 0, folder: f[0], name: d[0], a: d[1], b: 'Updated ' + d[2], used: d[3], text: d[4], on: 1 }); }); });
    LINKS.forEach(function (l) { I.push({ id: id++, kind: 1, name: l[0], a: l[1], b: l[2], used: l[3], text: 'Hear reads this page every morning and uses what it says today.', on: 1 }); });
    TERMS.forEach(function (t) { I.push({ id: id++, kind: 2, name: t[0], a: t[1], used: 0, on: 1 }); });
    var KIND = ['Documents', 'Links', 'Glossary'], EXT = function (n) { return (/\.(\w+)$/.exec(n) || [0, 'file'])[1].toUpperCase(); };
    var el = document.createElement('div'); el.className = 'glass sx lv'; el.id = 'sx-knowledge';
    el.innerHTML = '<div class="card"><div class="top"><div><h2>Knowledge</h2><p>What Hear reads before it scores a call or answers a question. <span class="kn-n"></span></p></div><div class="sp"></div>' +
      '<div class="dt-search kn-search">' + ic('<circle cx="8" cy="8" r="4.5"/><path d="M11.5 11.5l3.5 3.5"/>') + '<input type="text" placeholder="Search knowledge" aria-label="Search knowledge" autocomplete="off"></div>' +
      '<button class="act" type="button" data-do="link">' + ic('<path d="M7.5 10.5a3 3 0 0 0 4.2 0l2.3-2.3a3 3 0 0 0-4.2-4.2l-.8.8M10.5 7.5a3 3 0 0 0-4.2 0L4 9.8A3 3 0 0 0 8.2 14l.8-.8"/>') + 'Add a link</button><button class="act ink" type="button" data-do="up">' + ic('<path d="M9 12V4M5.5 7.3 9 3.8l3.5 3.5M3.5 14h11"/>') + 'Upload</button></div>' +
      '<div class="dt-tabs kn-tabs"></div><div class="kn-add"></div><div class="kn-body"></div></div><div class="sx-side"></div><div class="sx-tip"></div>';
    stage.appendChild(el);
    var side = el.querySelector('.sx-side'), ui = { side: function (html) { side.innerHTML = html; side.classList.add('on'); el.classList.add('side-on'); } };
    var tabs = el.querySelector('.kn-tabs'), body = el.querySelector('.kn-body'), addEl = el.querySelector('.kn-add'), si = el.querySelector('.kn-search input');
    var up = document.createElement('input'); up.type = 'file'; up.multiple = true; up.hidden = true; el.appendChild(up);
    var hit = function (x) { var q = S.q.toLowerCase(); return !q || (x.name + ' ' + x.a + ' ' + (x.folder || '')).toLowerCase().indexOf(q) >= 0; };
    var row = function (x) {
      return '<div class="kn-r' + (x.on ? '' : ' off') + (x.fresh ? ' land' : '') + '" data-id="' + x.id + '" tabindex="0">' + (x.kind === 2 ? '' : '<i class="kn-ic">' + (x.kind ? ic('<circle cx="9" cy="9" r="6.2"/><path d="M2.8 9h12.4M9 2.8c2.2 2 2.2 10.400 0 12.400M9 2.800c-2.200 2-2.200 10.400 0 12.400"/>') : EXT(x.name)) + '</i>') +
        '<span class="nm"><b>' + esc(x.name) + '</b><small>' + esc(x.a) + '</small></span><span class="st">' + (x.busy ? '<span class="sx-tag blue">Reading…</span>' : x.kind === 2 ? '' : esc(x.b)) + '</span>' +
        '<span class="us">' + (x.kind === 2 ? '' : x.busy ? '' : x.used ? '<b>' + x.used + '</b> answers used it' : 'Not used yet') + '</span><i class="tg' + (x.on ? '' : ' off') + '" role="switch" tabindex="0" aria-checked="' + !!x.on + '" aria-label="Use ' + esc(x.name) + '"></i></div>';
    };
    function paint() {
      var on = I.filter(function (x) { return x.on; }).length;
      el.querySelector('.kn-n').textContent = I.length + ' sources · ' + on + ' in use';
      tabs.innerHTML = KIND.map(function (k, i) { return '<span role="button" tabindex="0"' + (i === S.tab ? ' class="on"' : '') + '>' + k + '<small>' + I.filter(function (x) { return x.kind === i && hit(x); }).length + '</small></span>'; }).join('');
      var list = I.filter(function (x) { return x.kind === S.tab && hit(x); });
      addEl.innerHTML = S.tab === 1 ? '<div class="kn-in">' + ic('<path d="M9 4v10M4 9h10"/>') + '<input type="text" data-add="link" placeholder="Paste a link and press Enter" aria-label="Add a link"></div>'
        : S.tab === 2 ? '<div class="kn-in two">' + ic('<path d="M9 4v10M4 9h10"/>') + '<input type="text" data-add="term" placeholder="Term" aria-label="Term"><input type="text" data-add="mean" placeholder="What it means, then press Enter" aria-label="What it means"></div>' : '';
      if (!list.length) { body.innerHTML = '<div class="lv-none"><b>Nothing here</b><span>' + (S.q ? 'No ' + KIND[S.tab].toLowerCase() + ' match “' + esc(S.q) + '”.' : 'Add the first one above.') + '</span></div>'; return; }
      if (S.tab) { body.innerHTML = '<div class="kn-list">' + list.map(row).join('') + '</div>'; }
      else { var folders = []; list.forEach(function (x) { if (folders.indexOf(x.folder) < 0) folders.push(x.folder); });
        body.innerHTML = folders.map(function (f) { var inF = list.filter(function (x) { return x.folder === f; }), shut = S.shut[f] && !S.q;
          return '<section class="kn-f' + (shut ? ' shut' : '') + '"><button type="button" class="kn-fh" data-f="' + esc(f) + '">' + ic('<path d="M5 7.5l4 4 4-4"/>') + '<b>' + esc(f) + '</b><small>' + inF.length + (inF.length === 1 ? ' document' : ' documents') + '</small></button>' + (shut ? '' : '<div class="kn-list">' + inF.map(row).join('') + '</div>') + '</section>'; }).join(''); }
      I.forEach(function (x) { x.fresh = 0; });
    }
    function read(x) { x.busy = 1; x.fresh = 1; I.unshift(x); paint(); setTimeout(function () { x.busy = 0; x.b = x.kind ? 'Read just now' : 'Updated today'; paint(); }, 1600); }
    function open(x) {
      each(el.querySelectorAll('.kn-r'), function (r) { r.classList.toggle('hot', +r.dataset.id === x.id); });
      var s = sheet(el, ui, '<header>' + ['Document', 'Link', 'Term'][x.kind] + '<small>' + (x.on ? 'In use' : 'Switched off') + '</small></header><div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500;word-break:break-word">' + esc(x.name) + '</p><p>' + esc(x.kind === 2 ? x.a : x.text || 'Added by you.') + '</p></div>' +
        (x.kind === 2 ? '<h4>How Hear uses it</h4><p class="lv-p">When a call or a question says “' + esc(x.name) + '”, Hear reads it with this meaning.</p>'
          : (SAYS[x.name] ? '<h4>From the document</h4>' + SAYS[x.name].map(function (t) { return '<p class="kn-q">' + t + '</p>'; }).join('') : '') + '<dl>' + (x.folder ? '<dt>Folder</dt><dd>' + esc(x.folder) + '</dd>' : '') + '<dt>' + (x.kind ? 'Page' : 'Size') + '</dt><dd>' + esc(x.a) + '</dd><dt>Status</dt><dd>' + esc(x.b) + '</dd><dt>Used in</dt><dd>' + (x.used ? x.used + ' answers in 30 days' : 'No answers yet') + '</dd></dl>') +
        '<div class="ft">' + K0.act('Remove') + K0.act(x.on ? 'Switch off' : 'Switch on', 'ink') + '</div>', function () { each(el.querySelectorAll('.kn-r'), function (r) { r.classList.remove('hot'); }); });
      var b = s.querySelectorAll('.ft .act');
      b[0].addEventListener('click', function () { I.splice(I.indexOf(x), 1); shut(el); paint(); flash(el, x.name + ' removed'); });
      b[1].addEventListener('click', function () { x.on = !x.on; paint(); open(x); });
    }
    var K0 = { act: function (t, cls) { return '<button class="act' + (cls ? ' ' + cls : '') + '" type="button">' + t + '</button>'; } };
    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if ((x = t.closest('.kn-tabs span'))) { S.tab = [].indexOf.call(tabs.children, x); shut(el); paint(); return; }
      if ((x = t.closest('.kn-fh'))) { S.shut[x.dataset.f] = !S.shut[x.dataset.f]; paint(); return; }
      if ((x = t.closest('.top .act'))) { if (x.dataset.do === 'up') up.click(); else { S.tab = 1; paint(); addEl.querySelector('input').focus(); } return; }
      if ((x = t.closest('.kn-r .tg'))) { var it = I.filter(function (k) { return k.id === +x.parentNode.dataset.id; })[0]; it.on = !it.on; paint(); flash(el, it.name + (it.on ? ' is in use' : ' is switched off')); return; }
      if ((x = t.closest('.kn-r'))) { open(I.filter(function (k) { return k.id === +x.dataset.id; })[0]); return; }
    });
    el.addEventListener('keydown', function (e) {
      var t = e.target; if (e.key !== 'Enter' && e.key !== ' ') return;
      if (t.matches('.kn-tabs span,.kn-r,.tg')) { e.preventDefault(); t.click(); return; }
      if (e.key !== 'Enter' || !t.dataset.add) return;
      if (t.dataset.add === 'link') { var u = t.value.trim().replace(/^https?:\/\//, ''); if (!u) return; read({ id: id++, kind: 1, name: u, a: 'Added by you', b: '', used: 0, on: 1 }); flash(el, 'Reading ' + u); return; }
      var f = addEl.querySelectorAll('input'), term = f[0].value.trim(), mean = f[1].value.trim(); if (!term) { f[0].focus(); return; } if (!mean) { f[1].focus(); return; }
      I.unshift({ id: id++, kind: 2, name: term, a: mean, used: 0, on: 1, fresh: 1 }); paint(); addEl.querySelector('input').focus(); flash(el, term + ' added to the glossary');
    });
    si.addEventListener('input', function () { S.q = si.value.trim(); paint(); });
    up.addEventListener('change', function () { var n = up.files.length; each(up.files, function (f) { read({ id: id++, kind: 0, folder: 'Uploads', name: f.name, a: Math.max(1, Math.round(f.size / 1024)) + ' KB', b: '', used: 0, on: 1, text: 'Uploaded by you.' }); }); if (n) { S.tab = 0; paint(); flash(el, n + (n > 1 ? ' files are' : ' file is') + ' being read'); } up.value = ''; });
    nav.dataset.tip = 'Knowledge';
    nav.addEventListener('click', function () {
      stage.classList.remove('s1', 's2', 's3', 's4', 'is-fresh', 'is-leaving', 'ask-on'); stage.classList.add('s5');
      each(document.querySelectorAll('.side .nv.on'), function (b) { b.classList.remove('on'); }); nav.classList.add('on');
      each(stage.querySelectorAll('.sx'), function (x) { x.classList.toggle('on', x === el); });
    });
    /* the page's own screens take over again when one of them is opened */
    new MutationObserver(function () { if (!stage.classList.contains('s5') || /\bs[1234]\b/.test(stage.className)) nav.classList.remove('on'); }).observe(stage, { attributes: true, attributeFilter: ['class'] });
    paint();
  })();

  /* ---------- All apps: the sort ---------- */
  (function () {
    var b = document.querySelector('.gal__sort'), gal = b && b.closest('.glass'); if (!b || typeof GAL === 'undefined' || typeof galPaint !== 'function') return;
    var SORT = [['Recently used', function (a, c) { return a._i - c._i; }], ['Name, A to Z', function (a, c) { return a.n < c.n ? -1 : 1; }], ['Team', function (a, c) { return a.team < c.team ? -1 : a.team > c.team ? 1 : a._i - c._i; }]], at = 0;
    GAL.forEach(function (a, i) { a._i = i; });
    b.addEventListener('click', function () { menu(gal, b, SORT.map(function (o, i) { return { t: o[0], v: i, on: i === at }; }), function (it) { at = it.v; GAL.sort(SORT[at][1]); b.firstChild.textContent = SORT[at][0]; galPaint(); }, true); });
  })();

  /* ---------- Compliance (the Evaluation by agent app) and the other apps: the buttons that had no answer ---------- */
  (function () {
    var stage = document.getElementById('stage'), app = document.querySelector('.app'); if (!stage || !app || new URLSearchParams(location.search).get('screen')) return;
    var hm = document.getElementById('hm'), fb = document.querySelector('#filters button'), TEAM = ['Alpha', 'Birch', 'Delta'], teamAt = -1;
    /* a team is every third agent of the sample; the three numbers above the grid are counted again for the agents shown */
    function team(k) {
      teamAt = k; var list = rows.filter(function (r, i) { return k < 0 || i % 3 === k; });
      each(hm.rows, function (tr, i) { if (i) tr.hidden = !(k < 0 || (i - 1) % 3 === k); });
      var per = CRIT.map(function (c, i) { return [c, avg(list.map(function (r) { return r.s[i]; }))]; }).sort(function (a, b) { return a[1] - b[1]; });
      document.getElementById('kpis').innerHTML = '<div><small>Average score</small><b>' + avg(list.map(function (r) { return r.o; })) + '</b><i>' + (k < 0 ? 'All agents' : 'Team ' + TEAM[k]) + '</i></div><div><small>Evaluated calls</small><b>' + fmt(list.reduce(function (a, r) { return a + r.c; }, 0)) + '</b><i>Last 30 days</i></div><div><small>Lowest criterion</small><b>' + per[0][1] + '</b><i>' + per[0][0] + '</i></div>';
      document.getElementById('sub').textContent = 'Last 30 days · ' + list.length + ' agents · ' + CRIT.length + ' criteria';
      fb.firstChild.textContent = 'Team: ' + (k < 0 ? 'All' : TEAM[k]);
    }
    app.addEventListener('click', function (e) {
      var t = e.target, x;
      if (fb && fb.contains(t)) { menu(app, fb, [{ t: 'All teams', v: -1, on: teamAt < 0 }].concat(TEAM.map(function (n, i) { return { t: 'Team ' + n, v: i, on: teamAt === i }; })), function (it) { team(it.v); }); return; }
      if ((x = t.closest('.top .act'))) {
        if (x.classList.contains('sq')) { var wide = stage.classList.toggle('lv-wide'); x.setAttribute('aria-label', wide ? 'Back to the conversation' : 'Open full page'); dispatchEvent(new Event('resize')); }
        else if (/Share/.test(x.textContent)) { copy(location.href.split('?')[0] + '?app=' + (typeof curApp === 'string' ? curApp : 'eval')); flash(app, 'Link to this app copied'); }
        return; }
      if ((x = t.closest('.pl'))) { var was = x.classList.contains('on'); each(app.querySelectorAll('.pl.on'), function (p) { p.classList.remove('on'); }); clearTimeout(app._pl);
        if (!was) { x.classList.add('on'); flash(app, 'Playing “' + x.parentNode.textContent.trim() + '” ' + (x.getAttribute('aria-label') || '').replace('Play ', '')); app._pl = setTimeout(function () { x.classList.remove('on'); }, 6000); }
        e.stopPropagation(); return; }
      /* the other apps' ways out: all the calls behind a figure, the rest of a queue, a call sent on to coaching */
      if ((x = t.closest('#aht-a,#comp-a'))) { e.preventDefault(); var sec = x.closest('section') || x.parentNode, title = (sec.querySelector('b') || x).textContent.split(' · ')[0]; go('data', [{ k: 'From', v: title, n: +x.textContent.replace(/\D/g, '') }]); return; }
      if (t.closest('#dq-more')) { e.preventDefault(); go('data', [], null, 1); return; }
      if ((x = t.closest('.dq__acts .act'))) { if (x.disabled) return; var who = ((app.querySelector('.dq__head > :first-child, .dq__head') || {}).textContent || 'a flagged call').split('\n')[0].trim().slice(0, 60);
        task({ col: 0, src: 'Disclosure review', when: 'Today', title: 'Coach on the disclosures missed: ' + who, ev: 'Fee disclosure and cooling-off period not said', who: '' }); x.disabled = true; x.textContent = 'Sent to coaching'; flash(app, 'Coaching task added to Workflows'); return; }
      if (t.closest('#eva')) { e.preventDefault(); var td = hm.querySelector('td.sel'); if (td) go('data', [{ k: 'Agent', v: td.dataset.a.split(' ')[0] + ' · ' + td.dataset.c, n: +td.dataset.n }]); return; }
    });
  })();
  /* ---------- the rest of the sidebar: Help, Settings, the workspace and the person (owner, 26.11.2026: "still a lot of broken
     things, keep working"). Four things that looked like buttons and did nothing. ---------- */
  (function () {
    var stage = document.getElementById('stage'); if (!stage || new URLSearchParams(location.search).get('screen')) return;
    var find = function (t) { return [].filter.call(document.querySelectorAll('.side .nv'), function (b) { return b.textContent.trim() === t; })[0]; };
    var act = function (t, cls) { return '<button class="act' + (cls ? ' ' + cls : '') + '" type="button">' + t + '</button>'; };
    /* a page of its own behind a sidebar item that had none */
    function page(name, id, html) {
      var nav = find(name); if (!nav) return null;
      var el = document.createElement('div'); el.className = 'glass sx lv lv-page'; el.id = id;
      el.innerHTML = '<div class="card">' + html + '</div><div class="sx-side"></div><div class="sx-tip"></div>'; stage.appendChild(el);
      nav.dataset.tip = name;
      nav.addEventListener('click', function () {
        stage.classList.remove('s1', 's2', 's3', 's4', 'is-fresh', 'is-leaving', 'ask-on'); stage.classList.add('s5');
        each(document.querySelectorAll('.side .nv.on'), function (b) { b.classList.remove('on'); }); nav.classList.add('on');
        each(stage.querySelectorAll('.sx'), function (x) { x.classList.toggle('on', x === el); });
      });
      new MutationObserver(function () { if (!stage.classList.contains('s5') || /\bs[1234]\b/.test(stage.className)) nav.classList.remove('on'); }).observe(stage, { attributes: true, attributeFilter: ['class'] });
      return el;
    }

    /* Help: the questions a new team asks, answered in place; the tour again; a line to a person */
    var QA = [['How do I build an app?', 'Press <b>New app</b> and say what your team needs in one sentence, the way you would ask a colleague. Hear reads your conversations and lays the app out. Then change it in plain words: “add a filter by team”.'],
      ['How is a score calculated?', 'Every call is scored against the criteria in your evaluation form, from 0 to 100. An agent’s score is the average of their calls. Click any score to see how it compares with the team, and the calls behind it.'],
      ['What is a signal?', 'A rule that classifies calls on its own, written in plain words: “the customer asks to speak to a supervisor”. A signal is triggered when it catches more than twice its usual number of calls in a day.'],
      ['How do I filter calls in plain words?', 'In <b>Data</b>, write what you are looking for: “refund calls over 5 minutes where the customer was unhappy”. Each thing you name becomes a condition you can read and remove.'],
      ['Does Hear listen to calls while they happen?', 'No. Hear analyzes a call after it ends. Nothing is shown to the agent or the customer during the call.'],
      ['Who can see my apps?', 'Everyone in your workspace. <b>Share</b> copies a link to an app; people outside the workspace are asked to sign in first.']];
    var help = page('Help', 'sx-help', '<div class="top"><div><h2>Help</h2><p>Answers to what teams ask first, and a way to reach a person.</p></div><div class="sp"></div>' + act(ic('<path d="M4 9a5 5 0 1 0 1.6-3.7M4 3.5v2.3h2.3"/>') + 'Take the tour again') + '</div>' +
      '<div class="hp-body"><section class="hp-qa">' + QA.map(function (q, i) { return '<div class="hp-q' + (i ? '' : ' on') + '"><button type="button" aria-expanded="' + !i + '">' + q[0] + ic('<path d="M5 7.5l4 4 4-4"/>') + '</button><p>' + q[1] + '</p></div>'; }).join('') + '<div class="hp-keys"><h3>Keys</h3>' + [['/', 'Search calls, in Data'], ['Space', 'Play and pause a recording'], ['← →', 'Back and forward five seconds, on the recording'], ['Esc', 'Close a sheet, a menu or a call'], ['Enter', 'Open the row or card in focus']].map(function (k) { return '<div><kbd>' + k[0] + '</kbd><span>' + k[1] + '</span></div>'; }).join('') + '</div></section>' +
      '<section class="hp-ask"><h3>Ask a person</h3><p>A message goes to the Hear team. They answer on weekdays, usually within a few hours.</p><textarea rows="5" placeholder="What do you need help with?" aria-label="Your message"></textarea>' + act('Send', 'ink') + '<small class="hp-sent" hidden></small></section></div>');
    if (help) {
      var ta = help.querySelector('textarea'), send = help.querySelector('.hp-ask .act'), sent = help.querySelector('.hp-sent'); send.disabled = true;
      ta.addEventListener('input', function () { send.disabled = !ta.value.trim(); });
      help.addEventListener('click', function (e) {
        var q = e.target.closest('.hp-q button');
        if (q) { var on = !q.parentNode.classList.contains('on'); each(help.querySelectorAll('.hp-q'), function (x) { x.classList.remove('on'); x.firstChild.setAttribute('aria-expanded', 'false'); }); q.parentNode.classList.toggle('on', on); q.setAttribute('aria-expanded', on); return; }
        if (send.contains(e.target)) { ta.value = ''; send.disabled = true; sent.hidden = false; sent.textContent = 'Sent. The answer comes to maya.chen@northwind.example.'; flash(help, 'Message sent to the Hear team'); return; }
        if (e.target.closest('.top .act')) { var nw = document.getElementById('new'); if (nw) nw.click(); if (typeof tour !== 'undefined' && tour.start) setTimeout(function () { tour.start(); }, 350); }
      });
    }

    /* Settings: the workspace, the person, what Hear tells you about, and who is in */
    var NOTE = [['An app is ready', 'When Hear finishes building or changing an app', 1], ['New calls to review', 'When a review app has calls waiting', 1], ['A signal is triggered', 'When a signal passes twice its usual day', 1], ['Weekly summary', 'Monday morning, by email', 0]];
    var TEAM = [['Maya Chen', 'QA lead', 'Admin'], ['Dana Levi', 'Compliance', 'Editor'], ['Sam Rivera', 'Operations', 'Editor'], ['Selma Kaya', 'QA', 'Viewer']], ROLES = ['Admin', 'Editor', 'Viewer'];
    var av = function (n) { return '<i class="sx-av">' + n.split(/[ @.]/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase() + '</i>'; };
    var set = page('Settings', 'sx-settings', '<div class="top"><div><h2>Settings</h2><p>Your workspace, your profile and what Hear tells you about.</p></div><div class="sp"></div><span class="st-saved">All changes saved</span></div><div class="st-body">' +
      '<section><h3>Workspace</h3><label class="st-f">Name<input type="text" data-k="ws" value="Northwind"></label><label class="st-f">Time zone<select data-k="tz"><option>Lisbon (GMT+1)</option><option>London (GMT+1)</option><option>New York (GMT−4)</option><option>Tel Aviv (GMT+3)</option></select><small>Dates and times of calls are shown in it</small></label></section>' +
      '<section><h3>Profile</h3><label class="st-f">Your name<input type="text" data-k="me" value="Maya Chen"></label><label class="st-f">Role<input type="text" data-k="role" value="QA lead"></label></section>' +
      '<section><h3>Privacy</h3><div class="st-r"><span><b>Hide card numbers</b><small>In transcripts and in recordings</small></span><i class="tg" role="switch" tabindex="0" aria-checked="true" data-v="Card numbers are hidden"></i></div><div class="st-r"><span><b>Hide identity details</b><small>Dates of birth and document numbers</small></span><i class="tg" role="switch" tabindex="0" aria-checked="true" data-v="Identity details are hidden"></i></div>' +
      '<label class="st-f">Keep calls for<select data-k="keep"><option>90 days</option><option selected>1 year</option><option>3 years</option></select></label></section>' +
      '<section><h3>Notifications</h3>' + NOTE.map(function (n, i) { return '<div class="st-r"><span><b>' + n[0] + '</b><small>' + n[1] + '</small></span><i class="tg' + (n[2] ? '' : ' off') + '" role="switch" tabindex="0" aria-checked="' + !!n[2] + '" data-n="' + i + '"></i></div>'; }).join('') + '</section>' +
      '<section><h3>Connected</h3>' + [['Telephony', 'Calls arrive from your phone system as they end', 1], ['CRM', 'The customer and the booking, beside each call', 1], ['Chat and email', 'Written conversations, read like calls', 0]].map(function (c, i) { return '<div class="st-r"><span><b>' + c[0] + '</b><small>' + c[1] + '</small></span><button type="button" class="act st-con' + (c[2] ? ' on' : '') + '" data-c="' + i + '">' + (c[2] ? 'Connected' : 'Connect') + '</button></div>'; }).join('') + '</section>' +
      '<section><h3>People<small class="st-n"></small></h3><div class="st-team"></div><div class="kn-in st-inv">' + ic('<path d="M9 4v10M4 9h10"/>') + '<input type="email" placeholder="Invite by email, then press Enter" aria-label="Invite by email"></div></section></div>');
    if (set) {
      var team = set.querySelector('.st-team'), wsB = document.getElementById('ws'), meB = document.querySelector('.side .me');
      var people = function () { set.querySelector('.st-n').textContent = TEAM.length + ' in the workspace';
        team.innerHTML = TEAM.map(function (p, i) { return '<div class="st-r">' + av(p[0]) + '<span><b>' + esc(p[0]) + '</b><small>' + esc(p[1]) + '</small></span><button type="button" class="lv-in" data-p="' + i + '">' + p[2] + ic('<path d="M5 7.5l4 4 4-4"/>') + '</button></div>'; }).join(''); };
      people();
      set.addEventListener('input', function (e) { var k = e.target.dataset.k, v = e.target.value.trim(); if (!k) return;
        if (k === 'ws' && v) { wsB.querySelector('.ws__name').textContent = v; wsB.querySelector('.ws__mark').textContent = v[0].toUpperCase(); wsB.dataset.tip = v; }
        if (k === 'me' && v) { meB.querySelector('b').textContent = v.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); meB.querySelector('span').firstChild.textContent = v; TEAM[0][0] = v; people(); }
        if (k === 'role') meB.querySelector('small').textContent = v; saved(); });
      /* every change is kept as it is made, and the page says so in one place */
      var savedEl = set.querySelector('.st-saved'), savedT = 0, saved = function () { savedEl.textContent = 'Saving…'; savedEl.classList.add('busy'); clearTimeout(savedT); savedT = setTimeout(function () { savedEl.textContent = 'Saved just now'; savedEl.classList.remove('busy'); }, 700); };
      set.addEventListener('change', saved);
      set.addEventListener('click', function (e) { var t = e.target, x;
        if ((x = t.closest('.tg'))) { var off = !x.classList.contains('off'); x.classList.toggle('off', off); x.setAttribute('aria-checked', !off); saved(); return; }
        if ((x = t.closest('.st-con'))) { var on = !x.classList.contains('on'); x.classList.toggle('on', on); x.textContent = on ? 'Connected' : 'Connect'; saved(); return; }
        if ((x = t.closest('[data-p]'))) { var p = TEAM[+x.dataset.p]; menu(set, x, ROLES.map(function (r) { return { t: r, v: r, on: p[2] === r }; }).concat(+x.dataset.p ? [{ t: 'Remove from the workspace', v: '', sep: 1 }] : []), function (it) { if (it.v) p[2] = it.v; else TEAM.splice(TEAM.indexOf(p), 1); people(); saved(); if (!it.v) flash(set, p[0] + ' removed'); }, true); } });
      set.addEventListener('keydown', function (e) { var t = e.target;
        if ((e.key === 'Enter' || e.key === ' ') && t.classList.contains('tg')) { e.preventDefault(); t.click(); return; }
        if (e.key === 'Enter' && t.type === 'email') { var m = t.value.trim(); if (!/^\S+@\S+\.\S+$/.test(m)) { flash(set, 'That does not look like an email'); return; } TEAM.push([m, 'Invited', 'Viewer']); t.value = ''; people(); flash(set, 'Invitation sent to ' + m); } });
    }

    /* the workspace and the person: each opens its short menu */
    var ws = document.getElementById('ws'), me = document.querySelector('.side .me'), WS = ['Northwind', 'Northwind · Sandbox'];
    if (ws) ws.addEventListener('click', function () { var cur = ws.querySelector('.ws__name').textContent;
      menu(stage, ws, [{ head: 'Workspaces' }].concat((WS.indexOf(cur) < 0 ? [cur] : []).concat(WS).map(function (w) { return { t: w, v: w, on: w === cur }; })).concat([{ t: 'Workspace settings', v: '', sep: 1 }]), function (it) {
        if (!it.v) { find('Settings').click(); return; }
        ws.querySelector('.ws__name').textContent = it.v; ws.querySelector('.ws__mark').textContent = it.v[0]; if (it.v !== cur) flash(stage, 'Switched to ' + it.v); }); });
    if (me) { me.setAttribute('role', 'button'); me.tabIndex = 0; me.classList.add('lv-me');
      me.addEventListener('click', function () { menu(stage, me, [{ t: 'Profile and settings', v: 'set' }, { t: 'Help', v: 'help' }, { t: 'Sign out', v: 'out', sep: 1 }], function (it) { if (it.v === 'out') location.href = 'login.html'; else find(it.v === 'set' ? 'Settings' : 'Help').click(); }); });
      me.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); me.click(); } }); }
  })();
  /* ---------- where you are survives a reload (owner, 26.11.2026: "a lot more than this"). The page in view is written in the
     address, and a reload, or a link sent to someone, opens it again. Not with the portfolio's flags or the welcome. ---------- */
  (function () {
    var side = document.querySelector('.side'), q = new URLSearchParams(location.search); if (!side || q.get('screen') || q.get('welcome') || q.get('topics') || q.get('app')) return;
    var name = function (b) { return b.id === 'nav-all' ? 'apps' : (b.querySelector('.lbl') || b).textContent.replace(/^\d+/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
    side.addEventListener('click', function (e) {
      var b = e.target.closest('.nv,#new'); if (!b || b.id === 'bell') return;
      var n = b.id === 'new' ? '' : name(b);
      setTimeout(function () { if (n && location.hash.indexOf('#' + n + '/') === 0) return; try { history.replaceState(null, '', n ? '#' + n : location.pathname + location.search); } catch (e) {} }, 0);
    });
    var open = function () { var h = location.hash.slice(1).split('/')[0]; if (!h) return;
      var b = [].filter.call(side.querySelectorAll('.nv'), function (x) { return x.id !== 'bell' && name(x) === h; })[0]; if (b) b.click(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', open); else setTimeout(open, 0);
  })();
})();
