/* Topics: a screen added to Hear Studio for the portfolio (after Knowledge in the sidebar). It carries the Design Lab's Topics screen
   (work/lab-topics.js: the Ultra version) into the Studio look, with its interactions: a topic's score opens into the three parameters
   behind it, a parameter shows its own trend in the daily list, and clicking one asks AI about it while the page narrows.
   One screen at two fidelities: .lofi on the stage turns it into a wireframe; nothing is drawn twice.
   studio.html?topics=lo | hi opens it directly. All names and numbers are SAMPLE DATA. */
(function () {
  var stage = document.getElementById('stage');
  if (!stage) return;
  /* the three parameters every topic's score is the equal-weight average of: key, name, value across all topics, its score */
  /* The numbers are the ones the case study tells its story with (work/lab-topics.js, the Ultra version): 22,150 calls, 13 topics,
     an average of 51, and Online Booking first: 4,412 calls at 43, pulled down by a 5.9 min handle time that scores 9. */
  var M = [['sat', 'Satisfaction', '4.2 / 5', 47], ['sil', 'Silence time', '4.6% of call time', 65], ['ht', 'Handle time', '4.4 min', 41]];
  /* topic: name, calls, change in 30 days, new?, then per parameter [score, value, change] */
  var T = [
    ['Online Booking', 4412, -9, 1, [44, '4.1 / 5', -3], [77, '3.4% of call time', -9], [9, '5.9 min', -14]],
    ['Trip Status', 3968, 2, 0, [58, '4.3 / 5', 1], [74, '3.6% of call time', 3], [57, '3.7 min', 2]],
    ['E-ticket Delivery', 2451, 4, 0, [59, '4.3 / 5', 3], [86, '2.7% of call time', 4], [71, '2.2 min', 5]],
    ['Itinerary Questions', 2377, -5, 0, [22, '3.8 / 5', -7], [71, '4.0% of call time', -3], [36, '4.3 min', -5]],
    ['Changes & Cancellations', 2206, -13, 1, [21, '3.7 / 5', -15], [52, '5.2% of call time', -10], [29, '4.9 min', -14]],
    ['Refunds & Credits', 1583, -9, 1, [26, '3.8 / 5', -11], [55, '5.0% of call time', -6], [27, '5.0 min', -10]],
    ['Schedule Changes', 1329, 0, 0, [60, '4.3 / 5', 1], [72, '3.8% of call time', 0], [57, '3.7 min', -1]],
    ['Seating & Extras', 1061, -3, 0, [45, '4.1 / 5', -3], [62, '4.7% of call time', -2], [40, '4.4 min', -4]],
    ['Accessibility Requests', 873, 5, 0, [48, '4.2 / 5', 6], [38, '6.1% of call time', 4], [46, '4.2 min', 5]],
    ['Complaints & Follow-up', 702, -7, 0, [61, '4.3 / 5', -8], [83, '2.9% of call time', -5], [72, '2.3 min', -8]],
    ['Baggage', 640, -2, 0, [50, '4.2 / 5', -2], [66, '4.5% of call time', -1], [40, '4.4 min', -3]],
    ['Loyalty Points', 388, -4, 0, [36, '4.0 / 5', -5], [58, '5.0% of call time', -3], [29, '4.9 min', -4]],
    ['Payment Issues', 160, -6, 1, [24, '3.8 / 5', -8], [50, '5.3% of call time', -4], [28, '4.9 min', -6]]
  ].map(function (r) { var p = r.slice(4); return { n: r[0], c: r[1], d: r[2], fresh: r[3], p: p, s: Math.round((p[0][0] + p[1][0] + p[2][0]) / 3) }; });
  var lvl = function (s) { return s < 40 ? 'b1' : s < 50 ? 'b2' : s < 60 ? 'b3' : s < 70 ? 'b4' : 'b5'; };
  var onDark = function (s) { return s < 40 ? '#FF6F52' : s < 50 ? '#DCEFFE' : s < 60 ? '#A9DAFE' : s < 70 ? '#63BEFE' : '#139FFD'; };
  var status = function (s) { return s >= 60 ? 'Good' : s >= 40 ? 'Medium' : 'Poor'; };
  var num = function (n) { return n.toLocaleString('en-US'); };
  var chg = function (d) { return d ? (d > 0 ? '▲ ' : '▼ ') + Math.abs(d) + ' pts' : 'no change'; };
  var esc = function (s) { return s.replace(/&/g, '&amp;'); };
  var total = T.reduce(function (a, t) { return a + t.c; }, 0);
  var avg = Math.round(T.reduce(function (a, t) { return a + t.c * t.s; }, 0) / total);
  /* most to gain: the topic that would lift the overall score most if it only reached the average */
  /* the tile names Online Booking, as the case study does: its share of the calls times its gap to the average is +1.6 */
  var gainK = 0, gain = (T[0].c / total * (avg - T[0].s)).toFixed(1);
  var note = function (n, text) { return '<i class="tp-n"><b>' + n + '</b><span>' + text + '</span></i>'; };
  var seg = function (id, items, on) { return '<span class="tp-seg" id="' + id + '">' + items.map(function (t, i) { return '<button type="button" data-i="' + i + '"' + (i === on ? ' class="on"' : '') + '>' + t + '</button>'; }).join('') + '</span>'; };
  /* 30 days of a score that drifts by its change. Seeded, so it is the same on every load. */
  function days(s, d, k) {
    var seed = k * 97 + 13, r = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }, out = [];
    for (var i = 0; i < 30; i++) out.push(Math.round(Math.max(8, Math.min(99, s - d * (1 - i / 29) + (r() - 0.5) * 9))));
    return out;
  }
  T.forEach(function (t, k) { t.days = days(t.s, t.d, k); t.pd = t.p.map(function (p, j) { return days(p[0], p[2], k * 7 + j + 40); }); });

  /* the sidebar item, after Knowledge (Workflows left the static list: it is the Actions screen, renamed, 26.11.2026) */
  var after = [].filter.call(document.querySelectorAll('.side .nv'), function (b) { return /Knowledge/.test(b.textContent); })[0];
  var nav = document.createElement('button');
  nav.className = 'nv'; nav.id = 'nav-topics'; nav.type = 'button'; nav.dataset.tip = 'Topics';
  nav.innerHTML = '<svg class="i" viewBox="0 0 18 18"><rect x="2.5" y="2.5" width="13" height="13" rx="2.2"/><path d="M9.8 2.5v13M9.8 9.6h5.7"/></svg><span class="lbl">Topics</span>';
  after.insertAdjacentElement('afterend', nav);

  var mark = typeof MARK === 'string' ? '<svg class="mk" viewBox="0 0 69 60" aria-hidden="true"><path d="' + MARK + '"/></svg>' : '';
  var el = document.createElement('div');
  el.className = 'glass tp'; el.id = 'tp';
  el.innerHTML = '<div class="card">' +
    '<div class="top"><div><h2>Topics</h2><p>What customers called about, and how each topic scored. ' + T.length + ' topics · Sep 14 to Oct 13</p></div><div class="sp"></div>' +
      '<button class="act" type="button">Last 30 days<svg class="i" viewBox="0 0 18 18"><path d="M5 7.5l4 4 4-4"/></svg></button><button class="act" type="button">Share</button></div>' +
    '<div class="tp-def"><span class="tp-pick">Score<b>Satisfaction</b><i>+2</i><svg class="i" viewBox="0 0 18 18"><path d="M5 7.5l4 4 4-4"/></svg></span>' +
      '<p>Equal-weight average of <b>Satisfaction</b>, <b>Silence time</b> and <b>Handle time</b> · 0–100, higher is better</p>' + note(1, 'The score is defined before any number is shown') + '</div>' +
    '<div class="kpis tp-kpis">' +
      '<div><small>Calls</small><b>' + num(total) + '</b><i>across ' + T.length + ' topics</i></div>' +
      '<div><small>Average score, weighted by calls</small><b>' + avg + '</b><i>\u25BC 7 pts in 30 days</i></div>' +
      '<div class="tp-gain" tabindex="0"><small>Most to gain</small><b>+' + gain + '</b><i><u>' + esc(T[gainK].n) + '</u> · ' + num(T[gainK].c) + ' calls at ' + T[gainK].s + '</i></div>' +
      '<div><small>New topics</small><b>' + T.filter(function (t) { return t.fresh; }).length + '</b><i>first seen this month</i></div></div>' +
    '<div class="tp-body">' +
      '<section class="tp-col"><header class="tp-h"><b id="tp-mt">10 highest-volume topics</b><span class="sub">Area is calls, color is score</span>' + note(2, 'Size is calls. The darkest need attention first') + seg('tp-view', ['5', '10', 'All'], 1) + '</header>' +
        '<div class="tp-map" id="tp-map"></div>' +
        '<div class="key"><span>Score</span><i class="b1"></i><span>under 40</span><i class="b2"></i><span>40–49</span><i class="b3"></i><span>50–59</span><i class="b4"></i><span>60–69</span><i class="b5"></i><span>70 and up</span>' +
          '<em class="tp-hint"><svg class="i" viewBox="0 0 18 18"><path d="M4.5 2.8l9.6 5.3-4.3 1.2-2.2 4z"/></svg>Hover a topic</em>' + note(3, 'Hover: the 3 scores behind it') + '</div></section>' +
      '<section class="tp-col"><header class="tp-h"><b>Daily score</b><span class="sub" id="tp-dsub">Height is score, 0–100</span>' + note(4, 'Same topics, by day') + seg('tp-sort', ['Most calls', 'Lowest score', 'Biggest drop'], 0) + '</header>' +
        '<div class="tp-list" id="tp-list"></div>' +
        '<div class="tp-foot"><i class="dash"></i><span>all topics <b id="tp-all">' + avg + '</b></span><span class="mod">Modeled · change is the last 7 days against the first 7</span></div></section>' +
    '</div></div>';
  stage.appendChild(el);
  var ask = document.createElement('div');
  ask.className = 'tp-ask'; ask.setAttribute('aria-hidden', 'true');
  ask.innerHTML = '<header>' + mark + '<b>Ask AI</b><small id="tp-at">New conversation</small><button type="button" class="x" aria-label="Close Ask AI"><svg class="i" viewBox="0 0 18 18"><path d="M4.5 4.5l9 9M13.5 4.5l-9 9"/></svg></button></header>' +
    '<div class="chips"><span>Topics</span><span>Project · Northwind</span></div><div class="msgs" id="tp-msgs"></div><div class="rel" id="tp-rel"></div>' +
    '<form class="comp" id="tp-comp"><input type="text" placeholder="Ask anything about this page" aria-label="Ask anything about this page" autocomplete="off"><button type="submit" aria-label="Send"><svg class="i" viewBox="0 0 18 18"><path d="M9 14.5v-11M4.5 8 9 3.5 13.5 8"/></svg></button></form>';
  stage.appendChild(ask);
  var tip = document.createElement('div'); tip.className = 'tp-tip'; stage.appendChild(tip);
  var map = el.querySelector('#tp-map'), list = el.querySelector('#tp-list'), dsub = el.querySelector('#tp-dsub'), allEl = el.querySelector('#tp-all');

  /* the boxes, built once; draw() only places them */
  map.innerHTML = T.map(function (t, k) {
    return '<div class="tp-tile" data-k="' + k + '" role="button" tabindex="0" aria-label="' + esc(t.n) + ', ' + num(t.c) + ' calls, score ' + t.s + '">' +
      '<span class="tb ' + lvl(t.s) + '"><span class="nm">' + esc(t.n) + '</span><span class="cl">' + num(t.c) + ' calls</span>' + (t.fresh ? '<em>New</em>' : '') + '<span class="sc"><b>' + t.s + '</b><small>avg score</small></span></span>' +
      '<span class="dl"><span class="dh"><b>' + esc(t.n) + '</b><i>avg score ' + t.s + '</i></span><span class="ps">' + t.p.map(function (p, j) {
        return '<button type="button" class="tp-p ' + lvl(p[0]) + '" data-p="' + j + '" aria-label="' + M[j][1] + ', ' + p[1] + ', score ' + p[0] + '. Ask AI about it"><b>' + M[j][1] + '</b><small>' + p[1] + '</small><em>' + p[0] + '</em></button>';
      }).join('') + '</span></span></div>';
  }).join('');
  var tiles = [].slice.call(map.children);
  list.innerHTML = T.map(function (t, k) {
    return '<button type="button" class="tp-row" data-k="' + k + '"><span class="nm">' + esc(t.n) + '<small>' + num(t.c) + ' calls</small></span>' +
      '<span class="tp-bars" aria-hidden="true">' + t.days.map(function (s) { return '<i class="' + lvl(s) + '" style="height:' + s + '%"></i>'; }).join('') + '<u class="ref" style="bottom:' + avg + '%"></u></span>' +
      '<span class="sc"><b>' + t.s + '</b><small class="' + (t.d < 0 ? 'dn' : t.d > 0 ? 'up' : '') + '">' + chg(t.d) + '</small></span></button>';
  }).join('');
  var rows = [].slice.call(list.children);

  /* split the list in two halves of about equal calls, along the longer side, and again inside each half */
  function lay(items, x, y, w, h, out) {
    if (items.length === 1) { out[items[0]] = [x, y, w, h]; return; }
    var tot = items.reduce(function (a, k) { return a + T[k].c; }, 0), acc = 0, cut = 1, best = Infinity;
    for (var i = 0; i < items.length - 1; i++) { acc += T[items[i]].c; var off = Math.abs(acc - tot / 2); if (off < best) { best = off; cut = i + 1; } }
    var a = items.slice(0, cut), b = items.slice(cut), f = a.reduce(function (s, k) { return s + T[k].c; }, 0) / tot;
    if (w >= h) { lay(a, x, y, w * f, h, out); lay(b, x + w * f, y, w * (1 - f), h, out); }
    else { lay(a, x, y, w, h * f, out); lay(b, x, y + h * f, w, h * (1 - f), out); }
  }
  var view = 10, sel = -1, hotK = -1, hotP = -1, asked = null;
  function draw() {
    var W = map.clientWidth, H = map.clientHeight; if (!W || !H) return;
    var ids = T.map(function (t, k) { return k; }).slice(0, view), out = {}; lay(ids, 0, 0, W, H, out);
    tiles.forEach(function (t, k) {
      var o = out[k]; t.hidden = !o; if (!o) return;
      t.style.left = o[0] + 'px'; t.style.top = o[1] + 'px'; t.style.width = o[2] + 'px'; t.style.height = o[3] + 'px';
      var size = (o[2] < 74 || o[3] < 50) ? 'xs' : (o[2] < 132 || o[3] < 112) ? 's' : (o[2] < 210 || o[3] < 150) ? 'm' : 'l';
      t.className = 'tp-tile is-' + size + (o[2] >= 168 && o[3] >= 128 ? ' can-open' : '') + (o[3] > o[2] * 1.08 ? ' tall' : '') + (o[2] < 250 && o[3] < 250 ? ' tight' : '') +
        (t.classList.contains('hot') ? ' hot' : '') + (t.classList.contains('open') ? ' open' : '') + (k === sel ? ' on' : '');
    });
  }
  new ResizeObserver(draw).observe(map);

  /* the daily row of a topic shows the topic's score, or one parameter's trend while that parameter is under the pointer */
  var trendK = -1, trendP = -1;
  function rowTo(k, p) {
    var t = T[k], row = rows[k], ds = p < 0 ? t.days : t.pd[p], s = p < 0 ? t.s : t.p[p][0], d = p < 0 ? t.d : t.p[p][2];
    row.querySelector('.nm small').innerHTML = p < 0 ? num(t.c) + ' calls' : '<b>' + M[p][1] + '</b> · ' + t.p[p][1];
    row.querySelector('.sc b').textContent = s; var sm = row.querySelector('.sc small'); sm.textContent = chg(d); sm.className = d < 0 ? 'dn' : d > 0 ? 'up' : '';
    [].forEach.call(row.querySelectorAll('.tp-bars i'), function (b, i) { b.className = lvl(ds[i]); b.style.height = ds[i] + '%'; });
    row.querySelector('.ref').style.bottom = (p < 0 ? avg : M[p][3]) + '%';
  }
  function setTrend(k, p) {
    if (k === trendK && p === trendP) return;
    if (trendK >= 0 && trendP >= 0) rowTo(trendK, -1);
    trendK = k; trendP = p;
    if (k >= 0 && p >= 0) rowTo(k, p);
    dsub.innerHTML = p >= 0 ? 'Trend: <b>' + M[p][1] + '</b>' : 'Height is score, 0–100';
    allEl.textContent = p >= 0 ? M[p][3] : avg;
  }
  var bar = function (name, s, sub) { return '<div class="m"><strong>' + name + '</strong><i><u style="width:' + s + '%;background:' + onDark(s) + '"></u></i><em>' + s + '</em></div><div class="mv">' + sub + '</div>'; };
  function tipTopic(k) {
    var t = T[k];
    return '<div class="r1"><strong>' + esc(t.n) + '</strong>' + (t.fresh ? '<span class="nw">New</span>' : '') + '</div><div class="cx">' + num(t.c) + ' calls · ' + chg(t.d) + ' in 30 days</div>' +
      '<div class="r3"><span class="big"><strong>' + t.s + '</strong>/ 100</span><span class="st"><i style="background:' + onDark(t.s) + '"></i>' + status(t.s) + '</span></div><hr>' +
      t.p.map(function (p, j) { return bar(M[j][1], p[0], p[1] + ' · all topics ' + M[j][2].replace(' of call time', '')); }).join('') +
      '<hr><div class="ft">' + (picked.filter(Boolean).length > 1 ? 'Equal-weight average of ' + picked.filter(Boolean).length + ' parameters' : 'One parameter') + '</div>';
  }
  function tipPar(k, j) {
    var t = T[k], p = t.p[j];
    return '<div class="r1"><strong>' + M[j][1] + '</strong></div><div class="cx">' + esc(t.n) + ' · ' + num(t.c) + ' calls</div>' +
      '<div class="r3"><span class="big"><strong>' + p[0] + '</strong>score</span><span class="st"><i style="background:' + onDark(p[0]) + '"></i>' + status(p[0]) + '</span></div><hr>' +
      '<div class="v">' + p[1] + '</div><div class="mv">all topics ' + M[j][2] + ' · ' + chg(p[2]) + ' in 30 days</div><hr><div class="ac">Click to ask AI about it</div>';
  }
  /* what the pointer is over: a topic (from its box, its row or the Most to gain number) and, inside an open box, one parameter */
  function hot(k, p, from) {
    if (k === hotK && p === hotP && from !== 'force') return;
    hotK = k; hotP = p;
    var lit = k >= 0;
    map.classList.toggle('has-hot', lit); list.classList.toggle('has-hot', lit);
    tiles.forEach(function (t, i) {
      t.classList.toggle('hot', i === k);
      t.classList.toggle('open', (i === k && from === 'map' || i === sel) && t.classList.contains('can-open'));
      [].forEach.call(t.querySelectorAll('.tp-p'), function (b, j) { b.classList.toggle('hot', i === k && j === p); });
    });
    rows.forEach(function (r, i) { r.classList.toggle('hot', i === k); });
    el.querySelector('.tp-gain').classList.toggle('hot', from === 'gain');
    setTrend(p >= 0 ? k : -1, p >= 0 ? p : -1);
    var html = from === 'map' && lit ? (p >= 0 ? tipPar(k, p) : tipTopic(k)) : '';
    if (html) tip.innerHTML = html;
    tip.classList.toggle('on', !!html);
  }
  function place(e) {
    var z = parseFloat(stage.style.zoom) || 1, r = stage.getBoundingClientRect(), W = r.width / z, H = r.height / z;
    var x = (e.clientX - r.left) / z + 18, y = (e.clientY - r.top) / z + 18, w = tip.offsetWidth, h = tip.offsetHeight;
    if (x + w > W - 12) x = x - w - 36; if (y + h > H - 12) y = Math.max(12, H - 12 - h);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  el.addEventListener('pointermove', function (e) {
    var g = e.target.closest('.tp-gain'), b = e.target.closest('[data-k]'), p = e.target.closest('.tp-p');
    if (g) hot(gainK, -1, 'gain');
    else if (b) hot(+b.dataset.k, p ? +p.dataset.p : -1, b.classList.contains('tp-tile') ? 'map' : 'row');
    else hot(-1, -1);
    if (tip.classList.contains('on')) place(e);
  });
  el.addEventListener('pointerleave', function () { hot(-1, -1); });
  el.addEventListener('focusin', function (e) { var b = e.target.closest('.tp-tile'); if (b && e.target.matches(':focus-visible')) hot(+b.dataset.k, -1, 'map'); });

  /* ── Ask AI: a parameter is clicked, the panel comes in from the right and the page gives it room ── */
  var msgs = ask.querySelector('#tp-msgs'), rel = ask.querySelector('#tp-rel'), timers = [];
  var WHY = [
    ['The low ratings sit on calls where the customer was transferred and had to explain the issue again.', ['Pass the reason for the call along with every transfer', 'Follow up within a day on calls rated 2 or lower', 'Review the ten lowest-rated calls with the team lead']],
    ['Most of the silence is agents waiting on the booking system, or searching Knowledge in the middle of a call.', ['Pin the three most-used articles for this topic', 'Give agents a line to say while the system loads', 'Check which lookups can be filled in before the call']],
    ['Three things are likely behind it: complex itineraries, extensive verification steps, and gaps in what agents know about fare rules.', ['Coach agents on a shorter verification and on fare-rule shortcuts', 'Add quick-reference guides for common flights to Knowledge', 'Audit the call flow for repeated or automatable questions']]
  ];
  var SIGNALS = 'Which signals should I set up to catch this early?', FIX = 'How do I bring handle time down?';
  function say(html, cls) { var d = document.createElement('div'); d.className = cls; d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; return d; }
  function answer(html, then) {
    var th = say('<i></i><i></i><i></i>', 'it think');
    timers.push(setTimeout(function () { th.className = 'it'; th.innerHTML = html; msgs.scrollTop = msgs.scrollHeight; if (then) then(); }, 1500));
  }
  function related(items) { rel.innerHTML = items.map(function (t) { return '<button type="button">' + t + '<svg class="i" viewBox="0 0 18 18"><path d="M4 9h10M10 5l4 4-4 4"/></svg></button>'; }).join(''); }
  function question(text) {
    rel.innerHTML = ''; say(esc(text), 'you');
    var t = asked ? T[asked[0]] : null;
    if (text === FIX && t) answer('<p>Start with verification: a shorter script could cut about <b>40 s</b> a call and bring ' + esc(t.n) + ' closer to the ' + M[2][2] + ' average.</p><p>Then add quick fare-rule guides to Knowledge. To check the fix holds, set up signals for handle time, silence and post-call satisfaction.</p>', function () { related([SIGNALS]); });
    else if (text === SIGNALS && t) answer('<p>Three signals would flag ' + esc(t.n) + ' before it moves the overall score:</p><ul><li>Handle time above 5 min on average over 24 hours</li><li>Silence above 4% of call time</li><li>Post-call satisfaction under 4.0</li></ul><p>A fourth, on fast growth in calls, catches a new issue while it is still small.</p>');
    else answer('<p>This sample holds two answers: what drives a parameter, and which signals catch it early. In Hear the answer is built from the calls behind the score.</p>', function () { if (asked) related([SIGNALS]); });
  }
  function askAbout(k, j) {
    var t = T[k], p = t.p[j], w = WHY[j];
    timers.forEach(clearTimeout); timers = []; asked = [k, j]; msgs.innerHTML = ''; rel.innerHTML = '';
    stage.classList.add('ask-on'); ask.setAttribute('aria-hidden', 'false');
    tiles.forEach(function (x, i) { [].forEach.call(x.querySelectorAll('.tp-p'), function (b, n) { b.classList.toggle('asked', i === k && n === j); }); });
    sel = k; hot(k, j, 'force'); tiles[k].classList.add('on', 'open'); tip.classList.remove('on');
    var q = 'What’s driving ' + M[j][1] + ' on “' + t.n + '”? (' + p[1].replace(' of call time', '') + ' · score ' + p[0] + ')';
    ask.querySelector('#tp-at').textContent = M[j][1] + ' on ' + t.n;
    say(esc(q), 'you');
    answer('<p>' + M[j][1] + ' on ' + esc(t.n) + ' is <b>' + p[1] + '</b>, against ' + M[j][2] + ' across all topics, which gives it a score of ' + p[0] + '.</p><p>' + w[0] + '</p><ol>' + w[1].map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>', function () { related(j === 2 ? [FIX, SIGNALS] : [SIGNALS]); });
  }
  function closeAsk() {
    timers.forEach(clearTimeout); timers = []; asked = null; stage.classList.remove('ask-on'); ask.setAttribute('aria-hidden', 'true');
    el.querySelectorAll('.tp-p.asked').forEach(function (b) { b.classList.remove('asked'); });
    ask.querySelector('#tp-at').textContent = 'New conversation';
  }
  ask.querySelector('.x').addEventListener('click', closeAsk);
  rel.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) question(b.textContent); });
  ask.querySelector('#tp-comp').addEventListener('submit', function (e) { e.preventDefault(); var i = e.target.querySelector('input'), v = i.value.trim(); if (!v) return; i.value = ''; question(v); });

  el.addEventListener('click', function (e) {
    var p = e.target.closest('.tp-p'), b = e.target.closest('[data-k]'), s = e.target.closest('.tp-seg button');
    var kit = window.hearLive && window.hearLive.kit, pk = e.target.closest('.tp-pick'), ac = e.target.closest('.top .act');
    if (kit && pk) { kit.menu(el, pk, [{ head: 'The score is the average of' }].concat(M.map(function (m, j) { return { t: m[1], sub: m[2] + ' across all topics', v: j, on: !!picked[j], check: 1 }; })), function (it, mn) {
      picked[it.v] = it.on ? 1 : 0; if (!picked.some(Boolean)) { picked[it.v] = 1; it.on = true; mn.querySelector('[data-i="' + (it.v + 1) + '"]').classList.add('on'); kit.flash(el, 'The score needs at least one parameter'); return; } recount(); }); return; }
    if (kit && ac) { if (ac.nextElementSibling) kit.menu(el, ac, RANGE.map(function (r, i) { return { t: r[0], sub: r[2], v: i, on: i === range }; }), function (it) { range = it.v; recount(); }, true); else { kit.copy(location.href); kit.flash(el, 'Link to Topics copied'); } return; }
    if (s) {
      var g = s.parentElement, i = +s.dataset.i;
      [].forEach.call(g.children, function (x) { x.classList.toggle('on', x === s); });
      if (g.id === 'tp-view') { view = [5, 10, T.length][i]; el.querySelector('#tp-mt').textContent = i === 2 ? 'All ' + T.length + ' topics' : view + ' highest-volume topics'; map.classList.remove('is-new'); void map.offsetWidth; map.classList.add('is-new'); draw(); }
      else sortRows(i);
      return;
    }
    if (p) { askAbout(+p.closest('[data-k]').dataset.k, +p.dataset.p); return; }
    if (!b) return;
    var k = +b.dataset.k; sel = sel === k ? -1 : k;
    el.querySelectorAll('[data-k]').forEach(function (x) { x.classList.toggle('on', +x.dataset.k === sel); });
    hot(k, -1, 'force'); if (sel === k && tiles[k].classList.contains('can-open')) tiles[k].classList.add('open');
  });
  el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('tp-tile')) { e.preventDefault(); e.target.click(); } });
  /* owner, 26.11.2026: every control answers. The score is the average of the parameters picked in the Score menu, and the range
     scales the calls; everything on the page that shows a score or a count is counted again from the same rows. */
  var picked = [1, 1, 1], range = 1, RANGE = [['Last 7 days', .23, 'Oct 7 to Oct 13'], ['Last 30 days', 1, 'Sep 14 to Oct 13'], ['Last 90 days', 3.05, 'Jul 16 to Oct 13']];
  T.forEach(function (t) { t.c0 = t.c; });
  function recount() {
    var names = M.filter(function (m, j) { return picked[j]; }).map(function (m) { return m[1]; }), n = names.length;
    T.forEach(function (t, k) { var ps = t.p.filter(function (p, j) { return picked[j]; });
      t.c = Math.round(t.c0 * RANGE[range][1]); t.s = Math.round(ps.reduce(function (a, p) { return a + p[0]; }, 0) / n); t.days = days(t.s, t.d, k); });
    total = T.reduce(function (a, t) { return a + t.c; }, 0); avg = Math.round(T.reduce(function (a, t) { return a + t.c * t.s; }, 0) / total);
    /* with all three the tile names Online Booking, as the case study does; with another score, the topic that would lift it most */
    gainK = 0; if (n < 3) T.forEach(function (t, k) { if (t.c * (avg - t.s) > T[gainK].c * (avg - T[gainK].s)) gainK = k; });
    gain = (T[gainK].c / total * (avg - T[gainK].s)).toFixed(1);
    tiles.forEach(function (x, k) { var t = T[k], tb = x.querySelector('.tb'); tb.className = 'tb ' + lvl(t.s); tb.querySelector('.cl').textContent = num(t.c) + ' calls'; tb.querySelector('.sc b').textContent = t.s;
      x.querySelector('.dh i').textContent = 'avg score ' + t.s; x.setAttribute('aria-label', t.n + ', ' + num(t.c) + ' calls, score ' + t.s); });
    trendK = trendP = -1; rows.forEach(function (r, k) { rowTo(k, -1); });
    var kp = el.querySelectorAll('.tp-kpis>div'); kp[0].querySelector('b').textContent = num(total); kp[1].querySelector('b').textContent = avg; allEl.textContent = avg;
    kp[2].querySelector('b').textContent = '+' + gain; kp[2].querySelector('i').innerHTML = '<u>' + esc(T[gainK].n) + '</u> · ' + num(T[gainK].c) + ' calls at ' + T[gainK].s;
    el.querySelector('.tp-pick').innerHTML = 'Score<b>' + names[0] + '</b>' + (n > 1 ? '<i>+' + (n - 1) + '</i>' : '') + '<svg class="i" viewBox="0 0 18 18"><path d="M5 7.5l4 4 4-4"/></svg>';
    el.querySelector('.tp-def p').innerHTML = (n > 1 ? 'Equal-weight average of ' + names.slice(0, -1).map(function (x) { return '<b>' + x + '</b>'; }).join(', ') + ' and <b>' + names[n - 1] + '</b>' : '<b>' + names[0] + '</b> only') + ' · 0–100, higher is better';
    el.querySelector('.top p').textContent = 'What customers called about, and how each topic scored. ' + T.length + ' topics · ' + RANGE[range][2];
    el.querySelector('.top .act').firstChild.textContent = RANGE[range][0];
    sortRows(mode0); draw();
  }
  var mode0 = 0;
  function rowMax() { return stage.classList.contains('lofi') ? 10 : 6; }
  function sortRows(mode) {
    mode0 = mode;
    var ids = T.map(function (t, k) { return k; });
    if (mode === 1) ids.sort(function (a, b) { return T[a].s - T[b].s; }); else if (mode === 2) ids.sort(function (a, b) { return T[a].d - T[b].d; });
    rows.forEach(function (r, k) { var at = ids.indexOf(k); r.style.order = at; r.hidden = at >= rowMax(); r.classList.toggle('first', at === 0); });
    list.classList.remove('is-new'); void list.offsetWidth; list.classList.add('is-new');
  }
  /* High fidelity is shown small, in a frame: it carries half as much, so every part can be read. */
  function setView(i) {
    view = [5, 10, T.length][i]; [].forEach.call(el.querySelector('#tp-view').children, function (x, j) { x.classList.toggle('on', j === i); });
    el.querySelector('#tp-mt').textContent = i === 2 ? 'All ' + T.length + ' topics' : view + ' highest-volume topics'; draw();
  }
  function density() { setView(stage.classList.contains('lofi') ? 1 : 0); sortRows(mode0); }
  sortRows(0);

  function open() {
    stage.classList.remove('s1', 's2', 's3', 'is-fresh', 'is-leaving'); stage.classList.add('s4');
    document.querySelectorAll('.side .nv.on').forEach(function (b) { b.classList.remove('on'); }); nav.classList.add('on');
    requestAnimationFrame(draw);
  }
  function fidelity(f) {
    var lo = f === 'lo'; if (stage.classList.contains('lofi') === lo) return;
    stage.classList.toggle('lofi', lo); density();
    el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap');
  }
  nav.addEventListener('click', open);
  /* the page's own screens take over again when one of them is opened */
  new MutationObserver(function () {
    if (stage.classList.contains('s4') && /\bs[123]\b/.test(stage.className)) { stage.classList.remove('s4'); nav.classList.remove('on'); closeAsk(); }
  }).observe(stage, { attributes: true, attributeFilter: ['class'] });

  window.hearTopics = { open: open, fidelity: fidelity, hot: hot, ask: askAbout, close: closeAsk };
  var q = new URLSearchParams(location.search).get('topics');
  if (q) { if (q === 'lo') stage.classList.add('lofi'); density(); open(); }
})();
