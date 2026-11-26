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
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

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
        st: st, pr: hi[i] ? 3 : done[i] ? (rnd() < .7 ? 1 : 2) : (rnd() < .6 ? 2 : 1), who: st === 'Pending' && !hi[i] && rnd() < .35 ? '' : of(WHO),
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
    function paint(keep) {
      list = rows(); var pages = Math.max(1, Math.ceil(list.length / PER)); if (!keep) S.page = 0; S.page = Math.min(S.page, pages - 1);
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
      foot.querySelector('.ct').innerHTML = picked ? '<b>' + picked + '</b> selected<button type="button" class="lv-t" data-do="done">Mark done</button><button type="button" class="lv-t" data-do="mine">Assign to me</button><button type="button" class="lv-t" data-do="none">Clear</button>'
        : list.length ? '<span class="rg"><b>' + (at + 1) + '–' + (at + page.length) + '</b> of </span><span class="of">' + num(list.length) + '</span> calls' : '<span class="of">0</span> calls';
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
    tx.addEventListener('input', function () { ask.classList.toggle('has', !!tx.value.trim()); note.textContent = ''; });
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
    function exportCsv() {
      var cols = shown(), csv = [cols.map(function (i) { return COLS[i][0]; }).join(',')].concat(list.map(function (r) {
        var v = [r.t + ': ' + r.sm, r.id, day(r.off) + ' ' + hm(r.m), r.st, PR[r.pr], r.who || 'Unassigned', r.out ? 'Outbound' : 'Inbound', hm(r.len), r.se, r.sc];
        return cols.map(function (i) { return '"' + String(v[i]).replace(/"/g, '""') + '"'; }).join(','); })).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'northwind-calls.csv'; document.body.appendChild(a); a.click(); a.remove();
      flash(el, 'Exported ' + num(list.length) + ' calls to northwind-calls.csv');
    }
    var up = document.createElement('input'); up.type = 'file'; up.multiple = true; up.accept = 'audio/*,.csv,.zip'; up.hidden = true; el.appendChild(up);
    var proc = el.querySelector('.dt-proc'), procN = 3;
    up.addEventListener('change', function () { var n = up.files.length; if (!n) return; procN += n; proc.lastChild.textContent = 'Processing ' + procN; flash(el, n + (n > 1 ? ' files are' : ' file is') + ' being processed'); up.value = ''; });

    function openCall(r) {
      each(set.children, function (x) { x.classList.toggle('hot', +x.dataset.n === r.n); });
      var found = r.se === 'Negative' ? (r.t === 'Refunds & Credits' ? 'The customer asked for a refund and left without one.' : 'The customer was unhappy when the call ended.') : r.se === 'Neutral' ? 'The request was handled; the customer did not say how it went.' : 'The request was handled and the customer said thanks.';
      var s = sheet(el, ui, '<header>Call<small>' + r.id + '</small></header><div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500;text-wrap:balance">' + r.sm + '</p><p>' + found + '</p></div>' +
        '<dl><dt>Topic</dt><dd>' + esc(r.t) + '</dd><dt>When</dt><dd>' + day(r.off) + ' · ' + hm(r.m) + '</dd><dt>Length</dt><dd>' + Math.floor(r.len / 60) + ' min ' + r.len % 60 + ' sec · ' + (r.out ? 'Outbound' : 'Inbound') + '</dd><dt>Status</dt><dd><i class="dt-st ' + STC[r.st] + '">' + r.st + '</i></dd>' +
        '<dt>Priority</dt><dd>' + PR[r.pr] + '</dd><dt>Assigned to</dt><dd>' + (r.who ? K.av(r.who) + r.who : 'Unassigned') + '</dd><dt>Sentiment</dt><dd>' + r.se + '</dd><dt>Score</dt><dd><span class="lv-sc ' + (r.sc < 60 ? 'b1' : r.sc < 70 ? 'b2' : r.sc < 80 ? 'b3' : r.sc < 90 ? 'b4' : 'b5') + '">' + r.sc + '</span></dd></dl>' +
        (r.al ? '<h4>Alert</h4><p class="lv-p">This call raised an alert: Refund refused.</p>' : '') +
        '<div class="ft">' + K.act(r.who === ME ? 'Assigned to you' : 'Assign to me') + K.act(r.st === 'Done' ? 'Done' : 'Mark done', 'ink') + '</div>', function () { each(set.children, function (x) { x.classList.remove('hot'); }); });
      var b = s.querySelectorAll('.ft .act'); b[0].disabled = r.who === ME; b[1].disabled = r.st === 'Done';
      b[0].addEventListener('click', function () { r.who = ME; paint(true); openCall(r); flash(el, 'Assigned to you'); });
      b[1].addEventListener('click', function () { r.st = 'Done'; paint(true); openCall(r); flash(el, 'Marked done'); });
    }

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
        if (act !== 'none') { keys.forEach(function (k) { if (act === 'done') D[k].st = 'Done'; else D[k].who = ME; }); flash(el, keys.length + (keys.length > 1 ? ' calls ' : ' call ') + (act === 'done' ? 'marked done' : 'assigned to you')); }
        S.sel = {}; paint(true); return; }
      if (t.closest('.dt-foot .sig')) { S.saved = true; paint(true); flash(el, 'Saved as a signal: ' + S.conds.map(function (c) { return c.k + ' ' + label(c); }).join(', ')); return; }
      if ((x = t.closest('.dt-top .act'))) { if (x.classList.contains('ink')) up.click(); else exportCsv(); return; }
      if ((x = t.closest('.dt-set .dt-r'))) { openCall(D[+x.dataset.n]); return; }
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.dt-tabs span,.dt-r.hd .h,.dt-set .dt-r,.ck')) { e.preventDefault(); e.target.click(); } });
    /* another screen can send its reader here with the filter already on (Newsroom: "See the 211 calls") */
    L.data.filter = function (conds, range, tab) { S.conds = conds.map(function (c) { c.fresh = 1; if (c.k === 'Signal' || c.k === 'Agent' || c.k === 'From') { c.set = {}; D.filter(function (r) { return c.k !== 'Signal' ? r.who : r.se === 'Negative' || r.al || /Refund|Cancel|Complaint/.test(r.t); }).slice(0, c.n).forEach(function (r) { c.set[r.n] = 1; }); } return c; }); S.tab = tab || 0; S.sort = 2; S.dir = 1; S.q = si.value = ''; tx.value = ''; if (range != null) S.range = range; S.saved = false; S.sel = {}; shut(el); paint(); };
    paint();
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
    var avg = 76, vals = base, from = 0;
    function paint() {
      var f = FORMS[S.form], n = RANGE[S.range][1]; vals = f[1]; from = 30 - n;
      var shown = vals.slice(from); avg = Math.round(shown.reduce(function (a, v) { return a + v; }, 0) / n);
      var Y = function (v) { return Math.max(0, Math.min(100, (v - 50) / 40 * 100)); };
      bars.forEach(function (b, i) { b.hidden = i < from; b.style.height = Y(vals[i]).toFixed(1) + '%'; b.style.animationDelay = (i - from) * 22 + 'ms'; b.classList.toggle('low', vals[i] <= avg - 8); b.firstChild.textContent = vals[i]; });
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
    }
    /* a day under the pointer */
    var tip = el.querySelector('.sx-tip');
    plot.addEventListener('pointermove', function (e) {
      var b = e.target.closest('.ae-b'); if (!b) { tip.classList.remove('on'); each(bars, function (x) { x.classList.remove('at'); }); return; }
      if (b.classList.contains('at')) return; each(bars, function (x) { x.classList.toggle('at', x === b); });
      var i = +b.dataset.b, v = vals[i], d = v - avg, f = FORMS[S.form];
      ui.tip(b, '<strong>' + date(i, 1) + '</strong><span class="big">' + v + ' <small>/ 100</small></span><span>' + (d ? Math.abs(d) + (Math.abs(d) > 1 ? ' pts ' : ' pt ') + (d < 0 ? 'under' : 'over') + ' the average' : 'On the average') + ' · ' + num(1290 + (i * 37) % 11 * 14 - (new Date(2026, 8, 13 + i).getDay() % 6 ? 0 : 420)) + ' calls</span>' +
        (b.classList.contains('low') ? '<span class="why">Fell most: <b>' + f[3] + '</b>, ' + f[4] + '</span>' : ''));
    });
    plot.addEventListener('pointerleave', function () { tip.classList.remove('on'); each(bars, function (x) { x.classList.remove('at'); }); });

    /* the agents in a band, lowest first. Under 60 on Service quality is the storyboard's eight; the rest are made from a seed */
    var FIRST = ['Ana', 'Ben', 'Carla', 'Dev', 'Elif', 'Finn', 'Gia', 'Hugo', 'Ida', 'Jamal', 'Kira', 'Liam', 'Mina', 'Nils', 'Oren', 'Pia'], CRIT = ['Explains the refund policy', 'Verifies identity', 'Sets a clear next step', 'Shows empathy', 'Greets by name', 'Confirms the booking'];
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
      b[0].addEventListener('click', function () { go('data', [], null, 5); });
      if (b[1]) b[1].addEventListener('click', function () {
        var who = story ? AG.filter(function (a) { return a[2] === 1; }) : AG; s.querySelector('.ae-ag').classList.add('made'); if (!story) each(s.querySelectorAll('.ae-ag .ts'), function (x) { x.style.display = 'inline'; });
        b[1].disabled = true; b[1].classList.add('made'); b[1].textContent = who.length + ' tasks created';
        who.forEach(function (a) { task({ col: 0, src: 'Agent evaluation', when: 'Today', title: 'Coach ' + a[0] + ' on: ' + (a[2] === 1 ? 'Explains the refund policy' : a[2]), ev: 'Score ' + a[1] + ' · ' + f[0], who: '' }); });
        flash(el, who.length + ' coaching tasks added to Workflows');
      });
    }
    el.addEventListener('click', function (e) {
      var t = e.target, x;
      if (acts[0].contains(t)) { menu(el, acts[0], [{ head: 'Evaluation form' }].concat(FORMS.map(function (f, i) { return { t: f[0], v: i, on: i === S.form }; })), function (it) { S.form = it.v; shut(el); paint(); }, true); return; }
      if (acts[1].contains(t)) { menu(el, acts[1], RANGE.map(function (r, i) { return { t: r[0], v: i, on: i === S.range }; }), function (it) { S.range = it.v; paint(); }, true); return; }
      if ((x = t.closest('.sx-seg span'))) { S.trend = x !== seg.firstChild; paint(); return; }
      if ((x = t.closest('[data-g]'))) { band(BANDS.indexOf(x.dataset.g)); return; }
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
      return '<div class="ac-card' + (t.id === S.at ? ' hot' : '') + (t.fresh ? ' land' : '') + '" data-id="' + t.id + '" tabindex="0"><small><u' + (t.hi ? ' class="hi"' : '') + '></u>' + t.src + ' · ' + t.when + (t.hi ? '<span class="hp"> · High</span>' : '') + '</small><p>' + esc(t.title) + '</p><span class="cev">' + t.ev + '</span>' +
        '<footer>' + (t.who ? K.av(t.who) + t.who : '<span style="color:var(--mut)">Not assigned</span>') + (t.tag ? '<span class="sx-tag' + (t.tag === 'Resolved' ? ' ok' : '') + '">' + t.tag + '</span>' : '') + '</footer>' +
        '<div class="qa">' + moves.map(function (m) { return '<button type="button" data-do="' + m[0] + '"' + (m[2] ? ' class="go"' : '') + '>' + m[1] + '</button>'; }).join('') + '</div></div>';
    };
    function paint() {
      var f = WHOF[S.who][1], g = S.by < 0 ? function () { return true; } : BYF[S.by][1];
      bar.innerHTML = WHOF.map(function (w, i) { return '<button type="button" class="sx-chip' + (i === S.who ? ' on' : '') + '" data-w="' + i + '">' + w[0] + '</button>'; }).join('') + '<i class="gap"></i>' +
        BYF.map(function (b, i) { return '<button type="button" class="sx-chip' + (i === S.by ? ' on' : '') + '" data-b="' + i + '">' + b[0] + ' <b>' + T.filter(b[1]).length + '</b></button>'; }).join('');
      board.innerHTML = COLS.map(function (n, c) {
        var list = T.filter(function (t) { return t.col === c && f(t) && g(t); }).sort(function (a, b) { return (b.top || 0) - (a.top || 0) || a.id - b.id; }), all = S.open[c] || list.length <= SHOW + 1, more = list.length - SHOW;
        return '<section class="ac-col" data-c="' + c + '"><h4>' + n + '<i>' + list.length + '</i></h4>' + (list.length ? (all ? list : list.slice(0, SHOW)).map(card).join('') : '<span class="ac-more">Nothing here</span>') +
          (!all ? '<button type="button" class="ac-more">+' + more + ' more</button>' : S.open[c] && list.length > SHOW + 1 ? '<button type="button" class="ac-more">Show less</button>' : '') + '</section>'; }).join('');
      T.forEach(function (t) { t.fresh = 0; });
    }
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
      timers.push(setTimeout(function () {
        var row = document.createElement('div'); row.className = 'sg-r land'; row.tabIndex = 0; row._info = { q: it.q.map(function (q, n) { return [n ? 'Oct 11' : 'Oct 12', q, n ? 'Ryan Cole · 4 min 2 sec' : 'Maya Collins · 5 min 37 sec']; }) };
        row.innerHTML = '<i class="tg" role="switch" tabindex="0"></i><span class="nm">' + esc(it.name) + '<span class="sx-tag nw">New</span><small>' + esc(it.rule.replace(/\.$/, '')) + '</small></span>' + spark(it.d) + '<span class="ct"><b>' + it.n + '</b>calls in 14 days</span><span class="sx-tag">Active</span>';
        reset(); list.insertBefore(row, list.firstChild); count(); nn.classList.remove('up'); void nn.offsetWidth; nn.classList.add('up'); flash(el, it.name + ' is now a signal');
      }, 900));
    }
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
      if (S.tab) { var list = SEC[NAMES[S.tab]].filter(keep); sec.innerHTML = '<div class="sx-h"><b>' + NAMES[S.tab] + '</b><span>' + list.length + (list.length === 1 ? ' story' : ' stories') + (S.today ? ' today' : ' in the last 7 days') + '</span></div><div class="nr-list">' + (list.map(item).join('') || '<p class="lv-p" style="padding:18px 0">No stories today in this section.</p>') + '</div>'; }
      else el.querySelector('.nr-side .nr-list').innerHTML = front.replace(/<div class="nr-item/g, '<button type="button" class="nr-item').replace(/<\/span><\/div>/g, '</span></button>');
    }
    function story(s) {
      var kind = s[1].split(' · ')[0], sg = kind === 'Signal' ? s[1].split(' · ')[1] : null, n = (/(\d+) calls/.exec(s[0]) || [])[1];
      var st = sheet(el, ui, '<header>Story<small>' + s[1].split(' · ').slice(-1)[0] + '</small></header><div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500;text-wrap:balance">' + s[0] + '</p></div>' +
        '<dl><dt>Section</dt><dd>' + (kind === 'Alert' ? 'Alerts' : kind === 'Signal' ? 'Signals' : kind) + '</dd><dt>Source</dt><dd>' + s[1].split(' · ').slice(0, 2).join(' · ') + '</dd><dt>Heading</dt><dd><span class="sx-tag ' + s[3].replace(' thread', '') + '">' + s[2] + '</span></dd></dl>' +
        '<h4>Why you’re seeing this</h4><p class="lv-p">' + WHY[s[2]] + '</p><div class="ft">' + K.act('See the calls') + K.act('Create a task', 'ink') + '</div>');
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
          : '<dl>' + (x.folder ? '<dt>Folder</dt><dd>' + esc(x.folder) + '</dd>' : '') + '<dt>' + (x.kind ? 'Page' : 'Size') + '</dt><dd>' + esc(x.a) + '</dd><dt>Status</dt><dd>' + esc(x.b) + '</dd><dt>Used in</dt><dd>' + (x.used ? x.used + ' answers in 30 days' : 'No answers yet') + '</dd></dl>') +
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
      '<div class="hp-body"><section class="hp-qa">' + QA.map(function (q, i) { return '<div class="hp-q' + (i ? '' : ' on') + '"><button type="button" aria-expanded="' + !i + '">' + q[0] + ic('<path d="M5 7.5l4 4 4-4"/>') + '</button><p>' + q[1] + '</p></div>'; }).join('') + '</section>' +
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
    var set = page('Settings', 'sx-settings', '<div class="top"><div><h2>Settings</h2><p>Your workspace, your profile and what Hear tells you about.</p></div></div><div class="st-body">' +
      '<section><h3>Workspace</h3><label class="st-f">Name<input type="text" data-k="ws" value="Northwind"></label><label class="st-f">Time zone<select data-k="tz"><option>Lisbon (GMT+1)</option><option>London (GMT+1)</option><option>New York (GMT−4)</option><option>Tel Aviv (GMT+3)</option></select><small>Dates and times of calls are shown in it</small></label></section>' +
      '<section><h3>Profile</h3><label class="st-f">Your name<input type="text" data-k="me" value="Maya Chen"></label><label class="st-f">Role<input type="text" data-k="role" value="QA lead"></label></section>' +
      '<section><h3>Notifications</h3>' + NOTE.map(function (n, i) { return '<div class="st-r"><span><b>' + n[0] + '</b><small>' + n[1] + '</small></span><i class="tg' + (n[2] ? '' : ' off') + '" role="switch" tabindex="0" aria-checked="' + !!n[2] + '" data-n="' + i + '"></i></div>'; }).join('') + '</section>' +
      '<section><h3>People<small class="st-n"></small></h3><div class="st-team"></div><div class="kn-in st-inv">' + ic('<path d="M9 4v10M4 9h10"/>') + '<input type="email" placeholder="Invite by email, then press Enter" aria-label="Invite by email"></div></section></div>');
    if (set) {
      var team = set.querySelector('.st-team'), wsB = document.getElementById('ws'), meB = document.querySelector('.side .me');
      var people = function () { set.querySelector('.st-n').textContent = TEAM.length + ' in the workspace';
        team.innerHTML = TEAM.map(function (p, i) { return '<div class="st-r">' + av(p[0]) + '<span><b>' + esc(p[0]) + '</b><small>' + esc(p[1]) + '</small></span><button type="button" class="lv-in" data-p="' + i + '">' + p[2] + ic('<path d="M5 7.5l4 4 4-4"/>') + '</button></div>'; }).join(''); };
      people();
      set.addEventListener('input', function (e) { var k = e.target.dataset.k, v = e.target.value.trim(); if (!k) return;
        if (k === 'ws' && v) { wsB.querySelector('.ws__name').textContent = v; wsB.querySelector('.ws__mark').textContent = v[0].toUpperCase(); wsB.dataset.tip = v; }
        if (k === 'me' && v) { meB.querySelector('b').textContent = v.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); meB.querySelector('span').firstChild.textContent = v; TEAM[0][0] = v; people(); }
        if (k === 'role') meB.querySelector('small').textContent = v; });
      set.addEventListener('change', function (e) { if (e.target.dataset.k) flash(set, e.target.dataset.k === 'tz' ? 'Time zone: ' + e.target.value : 'Saved'); });
      set.addEventListener('click', function (e) { var t = e.target, x;
        if ((x = t.closest('.tg'))) { var off = !x.classList.contains('off'); x.classList.toggle('off', off); x.setAttribute('aria-checked', !off); flash(set, NOTE[+x.dataset.n][0] + (off ? ': off' : ': on')); return; }
        if ((x = t.closest('[data-p]'))) { var p = TEAM[+x.dataset.p]; menu(set, x, ROLES.map(function (r) { return { t: r, v: r, on: p[2] === r }; }).concat(+x.dataset.p ? [{ t: 'Remove from the workspace', v: '', sep: 1 }] : []), function (it) { if (it.v) p[2] = it.v; else TEAM.splice(TEAM.indexOf(p), 1); people(); flash(set, it.v ? p[0] + ' is now ' + it.v : p[0] + ' removed'); }, true); } });
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
})();
