/* Product screens added to Hear Studio for the portfolio: the Design Lab's screens (work/lab-*.js) carried into the Studio look and
   made simple: one page each, only what the story needs. studio.html?screen=compliance | agents | actions | news | data | signals | demos
   opens one directly and adds only that item to the sidebar. Each screen has a few steps the portfolio page plays:
   window.hearScreens.step(i) shows step i, .steps lists their sentences. All names and numbers are SAMPLE DATA. */
(function () {
  var stage = document.getElementById('stage');
  var key = new URLSearchParams(location.search).get('screen');
  if (!stage || !key) return;
  var MK = typeof MARK === 'string' ? '<svg viewBox="0 0 69 60" aria-hidden="true"><path d="' + MARK + '"/></svg>' : '';
  var chev = '<svg class="i" viewBox="0 0 18 18"><path d="M5 7.5l4 4 4-4"/></svg>';
  var av = function (n) { return '<i class="sx-av">' + n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2) + '</i>'; };
  var top = function (h, p, acts) { return '<div class="top"><div><h2>' + h + '</h2><p>' + p + '</p></div><div class="sp"></div>' + (acts || '') + '</div>'; };
  var act = function (t, cls) { return '<button class="act' + (cls ? ' ' + cls : '') + '" type="button">' + t + '</button>'; };
  var kpis = function (a) { return '<div class="kpis">' + a.map(function (k) { return '<div><small>' + k[0] + '</small><b>' + k[1] + '</b><i>' + k[2] + '</i></div>'; }).join('') + '</div>'; };
  var timers = [];
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  var type = function (node, text, done) {
    node.textContent = ''; node.classList.add('typing');
    text.split('').forEach(function (c, i) { later(function () { node.textContent = text.slice(0, i + 1); if (i === text.length - 1) { node.classList.remove('typing'); if (done) done(); } }, 28 * (i + 1)); });
  };
  var lv = function (s) { return s < 60 ? 'l1' : s < 70 ? 'l2' : s < 75 ? 'l3' : s < 80 ? 'l4' : 'l5'; };

  var S = {};

  /* ---------- Compliance ---------- */
  S.compliance = {
    nav: 'Compliance', icon: '<path d="M9 2.5 3.5 4.6v4.2c0 3.2 2.2 5.6 5.5 6.7 3.3-1.1 5.5-3.5 5.5-6.7V4.6z"/><path d="M6.5 9l1.8 1.8 3.3-3.6"/>',
    steps: ['Every agent is checked against the same five rules.', 'A failing score opens the agent against the team.', 'Ask AI names the calls that pulled it down.'],
    build: function () {
      var A = ['Evan', 'Lucy', 'Aaron', 'Stefan', 'Iris', 'Ada', 'Tara', 'Martina', 'Shaw', 'Selma'];
      var C = [['Fee disclosure', [85, 90, 67, 100, 87, 94, 78, 82, 79, 92]], ['Consent to continue', [81, 72, 87, 89, 82, 88, 65, 91, 76, 79]], ['Identity verification', [90, 89, 76, 100, 75, 98, 92, 93, 82, 85]],
        ['Vulnerable customer protocol', [88, 70, 72, 61, 76, 87, 87, 89, 68, 54]], ['Risk warning disclosure', [69, 88, 83, 85, 85, 70, 86, 74, 92, 77]]];
      var cls = function (v) { return v < 60 ? ' low' : v < 70 ? ' mid' : ''; };
      var g = '<div class="rw"></div>' + A.map(function (a) { return '<div class="hd"><b>' + a + '</b></div>'; }).join('');
      C.forEach(function (c, r) { g += '<div class="rw">' + c[0] + '</div>' + c[1].map(function (v, i) { return '<div class="c' + cls(v) + '" data-c="' + r + '-' + i + '">' + v + '</div>'; }).join(''); });
      g += '<div class="rw ft">Failing criteria</div>' + A.map(function (a, i) { var n = C.filter(function (c) { return c[1][i] < 70; }).length; return '<div class="ft">' + (n ? '<b>' + n + '</b>' : '–') + '</div>'; }).join('');
      return top('Compliance', 'How every agent did against the center’s rules. 5 criteria · 26 agents · last 6 weeks', act('Last 6 weeks' + chev) + act('Share')) +
        kpis([['Sales without alerts', '72.6<small>%</small>', '▲ 2.1 pts against the 6 weeks before'], ['Valid sales', '93.8<small>%</small>', 'target 90%'], ['Agents above the success metric', '88.7<small>%</small>', '23 of 26 agents']]) +
        '<div class="sx-body"><div class="sx-h"><b>Criteria by agent</b><span>Only a failing score takes colour</span><span class="sx-seg r"><span class="on">Agents</span><span>Teams</span></span></div>' +
        '<div class="cm-grid">' + g + '</div>' +
        '<div class="sx-note"><span>Score</span><i style="background:rgba(24,36,48,.07)"></i><span>70 and up</span><i style="background:#A9DAFE"></i><span>60–69</span><i style="background:#232323"></i><span>under 60</span></div></div>';
    },
    show: function (el, i, ui) {
      var c = el.querySelector('[data-c="3-9"]');
      if (i >= 1) c.classList.add('hot');
      if (i === 1) {
        ui.tip(c, '<strong>Selma K. · Vulnerable customer protocol</strong><span>12 of 26 calls failed this rule</span>' +
          '<div class="m"><b>Selma</b><i><u style="width:54%"></u></i><em>54</em></div><div class="m t"><b>Team</b><i><u style="width:81%"></u></i><em>81</em></div><b class="go">Ask AI which calls →</b>', 'below');
      }
      if (i === 2) ui.side('<header>' + MK + 'Ask AI<small>Selma K.</small></header><div class="q">Which calls pulled Selma’s Vulnerable customer protocol score down?</div>' +
        '<div class="a"><p><b>12 calls</b> failed, and 9 of them share one cause: the customer said they were struggling to pay and the protocol questions were skipped.</p>' +
        '<ul><li><b>Oct 9</b>Customer mentions a missed payment at 02:14. No affordability check.</li><li><b>Oct 7</b>Bereavement mentioned. The sale continues without a pause.</li><li><b>Oct 3</b>Customer asks to stop twice. The script carries on.</li></ul></div>');
    }
  };

  /* ---------- Agent evaluation ---------- */
  S.agents = {
    nav: 'Agent evaluation', icon: '<circle cx="9" cy="6" r="2.8"/><path d="M3.5 15c.6-3 2.7-4.6 5.5-4.6s4.9 1.6 5.5 4.6"/>',
    steps: ['Each day’s bar is the average score of every agent.', 'A low day turns dark. Hovering shows the calls behind it.', 'The spread shows who needs coaching: 8 agents under 60.'],
    build: function () {
      var D = [76, 76, 75, 75, 74, 74, 76, 74, 74, 75, 75, 75, 76, 76, 77, 76, 77, 66, 68, 67, 67, 77, 77, 77, 77, 81, 80, 81, 76, 75];
      var bars = D.map(function (v, i) { return '<i class="ae-b ' + (v < 70 ? 'l1 low' : v < 76 ? 'l3' : v < 80 ? 'l4' : 'l5') + '" data-b="' + i + '" style="height:' + ((v - 50) / 36 * 100).toFixed(1) + '%"><em>' + v + '</em></i>'; }).join('');
      var G = [['90–100', 27, 'l5'], ['80–89', 193, 'l4'], ['70–79', 349, 'l3'], ['60–69', 138, 'l2'], ['under 60', 8, 'l1']];
      return top('Agent evaluation', 'An AI score for every agent, with the calls it is based on. 715 agents · 8 criteria', act('Service quality' + chev) + act('Last 30 days' + chev)) +
        kpis([['Agents', '715', 'active in the last 30 days'], ['Average score', '76<small>/ 100</small>', '▲ 1 pt against the 30 days before'], ['Under 60', '8', 'agents to coach first']]) +
        '<div class="sx-body"><div class="sx-h"><b>Average score over time</b><span>Height and colour are that day’s score</span><span class="sx-seg r"><span class="on">Bars</span><span>Trend</span></span></div>' +
        '<div class="ae-plot">' + bars + '</div><div class="ae-dates"><span>Sep 13</span><span>Sep 20</span><span>Sep 27</span><span>Oct 4</span><span>Oct 12</span></div>' +
        '<div class="ae-dist"><div class="sx-h"><b>Agents by average score</b><span>715 agents</span></div><div class="ae-strip">' + G.map(function (g) { return '<i class="' + g[2] + '" data-g="' + g[0] + '" style="flex:' + Math.max(g[1], 14) + '"></i>'; }).join('') + '</div>' +
        '<div class="ae-leg">' + G.map(function (g) { return '<span data-g="' + g[0] + '"><i class="' + g[2] + '"></i>' + g[0] + ' <b>' + g[1] + '</b></span>'; }).join('') + '</div></div></div>';
    },
    show: function (el, i, ui) {
      if (i === 1) { var b = el.querySelector('[data-b="17"]'); b.classList.add('hot'); ui.tip(b, '<strong>Wed, Sep 30</strong><span class="big">66 <small>/ 100</small></span><span>Based on 3,104 calls · 10 pts under the week before</span>', 'top'); }
      if (i === 2) { [].forEach.call(el.querySelectorAll('[data-g="under 60"]'), function (x) { x.classList.add('hot'); }); ui.tip(el.querySelector('.ae-strip [data-g="under 60"]'), '<strong>8 agents under 60</strong><span>Average 54 · 1,212 calls in 30 days</span><b class="go">Open the list →</b>', 'topright'); }
    }
  };

  /* ---------- Actions ---------- */
  S.actions = {
    nav: 'Actions', icon: '<rect x="2.5" y="3" width="3.6" height="12" rx="1.2"/><rect x="7.2" y="3" width="3.6" height="8" rx="1.2"/><rect x="11.9" y="3" width="3.6" height="10" rx="1.2"/>',
    steps: ['Each finding is a task with its source and an owner.', 'Hovering a card shows what can be done with it.', 'The task opens with the call it came from.', 'Closed work keeps its reason.'],
    build: function () {
      var card = function (src, hi, title, who, tag, cls) { return '<div class="ac-card' + (cls ? ' ' + cls : '') + '"><small><u' + (hi ? ' class="hi"' : '') + '></u>' + src + '</small><p>' + title + '</p><footer>' + (who ? av(who) + who : '<span style="color:var(--mut)">Not assigned</span>') + (tag ? '<span class="sx-tag">' + tag + '</span>' : '') + '</footer><div class="qa"><span>Assign</span><span>Start</span><span>Close</span></div></div>'; };
      var col = function (n, c, cards, more) { return '<section class="ac-col"><h4>' + n + '<i>' + c + '</i></h4>' + cards + (more ? '<span class="ac-more">+' + more + ' more</span>' : '') + '</section>'; };
      return top('Actions', 'Findings from alerts, signals and evaluations, each one with an owner.', act('<svg class="i" viewBox="0 0 18 18"><path d="M9 3.5v11M3.5 9h11"/></svg>New task', 'ink')) +
        '<div class="ac-bar"><span class="sx-chip on">Everyone</span><span class="sx-chip">Assigned to me</span><span class="sx-chip">Mentions me</span><i class="gap"></i><span class="sx-chip">High priority <b>4</b></span><span class="sx-chip">From alerts <b>5</b></span><span class="sx-chip">From agent evaluation <b>2</b></span></div>' +
        '<div class="ac-board">' +
        col('Pending', 6, card('Alert · Today · High', 1, 'Customer asked twice for a refund, was offered only a voucher', 'Daniel Brooks', '', 'src') + card('Call · Yesterday', 0, 'Reason for call tagged as Billing, should be Service outage', 'Maya Collins') + card('Agent evaluation · Yesterday · High', 1, 'Recording disclosure missing in the first 30 seconds', ''), 3) +
        col('In progress', 5, card('Alert · Oct 10 · High', 1, 'Technical failure blocked a booking at payment', 'Ryan Cole') + card('Agent evaluation · Oct 9', 0, 'Identity verification skipped before a ticket change', 'Paula Nunes'), 3) +
        col('Done', 4, card('Alert · Today', 0, 'Customer asked twice for a refund, was offered only a voucher', 'Daniel Brooks', 'Resolved', 'moved') + card('Alert · Oct 5', 0, 'Lost baggage claim escalated to the ground team', 'Sofia Cruz', 'Escalated') + card('Call · Oct 4', 0, 'Sentiment re-analysed on a VIP escalation', 'Maya Collins', 'Resolved'), 2) +
        col('Cancelled', 2, card('Alert · Oct 10', 0, 'Duplicate: booking engine timeout', 'Ryan Cole', 'Duplicate') + card('Feedback · Sep 30', 0, 'Website search is slow', '', 'Not actionable')) + '</div>';
    },
    show: function (el, i, ui) {
      var c = el.querySelector('.ac-card.src');
      if (i === 1 || i === 2) c.classList.add('hot');
      if (i === 2) ui.side('<header>Task<small>From an alert · Today</small></header><div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500">Customer asked twice for a refund, was offered only a voucher</p><p>Cancelled JFK–LHR flight. The customer asked for a cash refund twice and the agent offered a voucher both times.</p></div>' +
        '<dl><dt>Source</dt><dd><span class="sx-tag blue">Alert</span>Refund refused</dd><dt>Priority</dt><dd>High</dd><dt>Assignee</dt><dd>' + av('Daniel Brooks') + 'Daniel Brooks</dd><dt>Call</dt><dd>Oct 13 · 6 min 12 sec</dd></dl>' +
        '<h4>Checklist</h4><div class="ac-check done"><i>✓</i>Listen to the call</div><div class="ac-check" data-late><i></i>Refund the customer</div><div class="ac-check"><i></i>Coach the agent on the refund policy</div>' +
        '<div class="ft">' + act('Reassign') + act('Close as Resolved', 'ink') + '</div>');
      if (i === 2) { var late = el.querySelector('.sx-side [data-late]'), tick = function () { late.classList.add('done'); late.firstChild.textContent = '✓'; }; if (ui.jump) tick(); else later(tick, 1500); }
    }
  };

  /* ---------- Newsroom ---------- */
  S.news = {
    nav: 'Newsroom', icon: '<rect x="2.5" y="3.5" width="13" height="11" rx="2"/><path d="M5.5 7h4M5.5 10h7"/>',
    steps: ['Newsroom writes what changed in the calls as stories.', 'Play opens the month as a 75-second story.', 'It counts the 38,214 calls analysed in July.', 'Then it names the one thing that changed most.'],
    build: function () {
      var N = [['“Cancellation intent” is surging past its 30-day baseline', 'Signal · 240% over baseline · 4:12 pm', 'Surging', 'ink'], ['Team B handle time is up 40% since Monday', 'Agent performance · 2:30 pm', 'Rising', 'blue'], ['Missed upgrade offers: 2 stories from 214 eligible calls', 'Daily alerts report', 'New', 'blue'], ['Most requested refund reason: schedule change', 'Weekly summary · 3 stories', 'Steady', ''], ['Silence on Trip Status calls is down a third', 'Signal · since the new script', 'Improving', 'blue'], ['Three agents moved above the success metric', 'Agent evaluation · this week', 'Steady', '']];
      return top('Newsroom', 'What changed in your calls, written as stories you can read or play.', act('Last 7 days' + chev) + act('Share')) +
        '<div class="sx-body nr-body"><section class="nr-col"><div class="nr-feat"><small>Monthly recap · Story</small><h3>38,214 calls. One story.</h3><p>The day you never caught your breath, the topic that took over, and the agent who carried the floor.</p><span class="nr-play"><svg viewBox="0 0 12 12"><path d="M2.5 1.2v9.6L10.5 6z"/></svg>Play · 75 sec</span></div>' +
        '<div class="nr-chart"><div class="sx-h"><b>Call volume</b><span>July, by day</span></div><div class="nr-plot"><svg viewBox="0 0 600 150" preserveAspectRatio="none"><path d="M0 120C40 118 70 112 110 110S170 116 210 96 270 30 310 26 370 70 410 78 480 62 520 66 570 52 600 48V150H0z" fill="#DCEFFE"/><path d="M0 120C40 118 70 112 110 110S170 116 210 96 270 30 310 26 370 70 410 78 480 62 520 66 570 52 600 48" fill="none" stroke="#139FFD" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg><i class="g" style="top:33%"></i><i class="g" style="top:66%"></i><span class="pk"><b>1,912 calls</b> Jul 14</span></div><div class="ae-dates"><span>Jul 1</span><span>Jul 8</span><span>Jul 15</span><span>Jul 22</span><span>Jul 31</span></div></div></section>' +
        '<section class="nr-col"><div class="sx-h"><b>Developments</b><span>31 this week</span></div>' + N.map(function (n) { return '<div class="nr-item"><b>' + n[0] + '</b><span class="sx-tag ' + n[3] + '">' + n[2] + '</span><span>' + n[1] + '</span></div>'; }).join('') + '</section></div>' +
        '<div class="nr-story" data-s="0"><div class="pr"><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="sl s0"><small>July 2026 · Your recap</small><h3>Chief, your month was loud.</h3><p>Let’s listen back.</p></div>' +
        '<div class="sl s1"><small>Calls analysed</small><h3>38,214</h3><p>9% more than June</p></div>' +
        '<div class="sl s2"><small>What changed most</small><h3>Cancellation intent rose 240% after the fare change.</h3><p>July 14 to July 19</p></div></div>';
    },
    show: function (el, i) {
      var st = el.querySelector('.nr-story');
      st.classList.toggle('on', i >= 1);
      if (i >= 1) { st.dataset.s = i - 1; [].forEach.call(st.querySelectorAll('.pr i'), function (x, n) { x.classList.toggle('on', n < i); }); }
    }
  };

  /* ---------- Data ---------- */
  S.data = {
    nav: 'Data', icon: '<ellipse cx="9" cy="4.8" rx="5.5" ry="2.3"/><path d="M3.5 4.8v8.4c0 1.3 2.5 2.3 5.5 2.3s5.5-1 5.5-2.3V4.8M3.5 9c0 1.3 2.5 2.3 5.5 2.3s5.5-1 5.5-2.3"/>',
    steps: ['Every call is a row: who, what about, and how it scored.', 'A filter is asked for in plain words.', 'It becomes three conditions, and 86 calls remain.'],
    build: function () {
      var R = [['Oct 13 · 14:02', 'Daniel Brooks', 'Refunds & Credits', '6:12', 'Negative', 38, 1], ['Oct 13 · 13:47', 'Maya Collins', 'Online Booking', '3:05', 'Positive', 82, 0], ['Oct 13 · 13:31', 'Ryan Cole', 'Trip Status', '2:40', 'Neutral', 71, 0], ['Oct 13 · 13:18', 'Paula Nunes', 'Refunds & Credits', '7:48', 'Negative', 41, 1],
        ['Oct 13 · 12:56', 'Sofia Cruz', 'Seating & Extras', '1:52', 'Positive', 88, 0], ['Oct 13 · 12:40', 'Alex Ward', 'Refunds & Credits', '5:27', 'Negative', 35, 1], ['Oct 13 · 12:22', 'Daniel Brooks', 'Schedule Changes', '4:10', 'Neutral', 66, 0], ['Oct 13 · 12:05', 'Maya Collins', 'Refunds & Credits', '9:03', 'Negative', 29, 1], ['Oct 13 · 11:51', 'Ryan Cole', 'E-ticket Delivery', '2:15', 'Positive', 79, 0]];
      return top('Data', 'Every call, with what was said and how it scored.', act('Columns' + chev) + act('Export')) +
        '<div class="dt-ask"><svg class="i" viewBox="0 0 18 18"><path d="M9 2.5l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/></svg><span class="tx"></span><span class="n"><b>2,000</b> calls</span></div>' +
        '<div class="dt-chips"><span class="sx-chip">Topic <b>Refunds & Credits</b></span><span class="sx-chip">Duration <b>over 5 min</b></span><span class="sx-chip">Sentiment <b>Negative</b></span></div>' +
        '<div class="sx-body" style="margin-top:0"><div class="dt-tbl"><div class="dt-r hd"><span>Call</span><span>Agent</span><span>Topic</span><span>Duration</span><span>Sentiment</span><span style="text-align:right">Score</span></div>' +
        R.map(function (r) { return '<div class="dt-r' + (r[6] ? ' hit' : '') + '"><b>' + r[0] + '</b><span class="ag">' + av(r[1]) + r[1] + '</span><span>' + r[2] + '</span><span>' + r[3] + '</span><span class="se"><i class="' + (r[4] === 'Negative' ? 'neg' : r[4] === 'Neutral' ? 'neu' : '') + '"></i>' + r[4] + '</span><span class="sc ' + lv(r[5]) + '">' + r[5] + '</span></div>'; }).join('') + '<div class="dt-sum"><span>Showing <b>4</b> of <b>86</b> calls</span><span>Average score <b>36</b></span><span>Average duration <b>7:07</b></span><span class="go">Save this filter as a signal →</span></div></div></div>';
    },
    show: function (el, i, ui) {
      var tx = el.querySelector('.dt-ask .tx'), n = el.querySelector('.dt-ask .n'), text = 'refund calls over 5 minutes where the customer was unhappy';
      n.innerHTML = i === 2 ? '<b>86</b> of 2,000 calls' : '<b>2,000</b> calls';
      if (i === 0) tx.textContent = ''; else if (i === 1 && !ui.jump) type(tx, text); else tx.textContent = text;
    }
  };

  /* ---------- Signals ---------- */
  S.signals = {
    nav: 'Signals', icon: '<path d="M2.5 9h3l2-5 3 10 2-5h3"/>',
    steps: ['A signal is a rule that classifies calls on its own.', 'Opening one shows the calls it caught.', 'A new signal is written in plain words.'],
    build: function () {
      var G = [['Cancellation intent', 'The customer says they want to cancel or leave', 412, 'Firing', 'ink', [4, 5, 4, 6, 5, 7, 6, 9, 12, 16, 21, 24, 26, 28]], ['Refund refused', 'A refund is asked for and not offered', 96, 'Firing', 'ink', [8, 7, 9, 8, 10, 9, 11, 10, 12, 14, 13, 16, 18, 19]],
        ['Recording disclosure missing', 'No disclosure in the first 30 seconds', 58, 'Firing', 'ink', [6, 5, 6, 7, 6, 8, 7, 9, 8, 10, 12, 11, 13, 14]], ['Upgrade offer missed', 'An eligible customer is not offered an upgrade', 214, 'Quiet', '', [14, 15, 13, 14, 16, 15, 14, 13, 15, 14, 13, 14, 15, 14]],
        ['Long silence', 'More than 20 seconds with nobody speaking', 131, 'Quiet', '', [10, 9, 11, 10, 9, 10, 11, 9, 10, 9, 10, 11, 10, 9]], ['Competitor mentioned', 'The customer names another airline', 47, 'Quiet', '', [5, 6, 5, 4, 6, 5, 5, 6, 4, 5, 6, 5, 4, 5]], ['Praise for the agent', 'The customer thanks the agent by name', 302, 'Paused', '', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]];
      return top('Signals', 'Rules that classify calls on their own. 7 signals · 3 firing now', act('<svg class="i" viewBox="0 0 18 18"><path d="M9 3.5v11M3.5 9h11"/></svg>New signal', 'ink')) +
        '<div class="sg-new"><svg class="i" viewBox="0 0 18 18"><path d="M9 2.5l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/></svg><span class="tx"></span><span class="sx-tag blue">Classifying 2,000 calls…</span></div>' +
        '<div class="sx-body"><div class="sg-list"><div class="sg-r new"><i class="tg"></i><span class="nm">Switching to a competitor<small>The customer says they will switch to a competitor</small></span><span class="sp">' + [2, 1, 2, 1, 3, 2, 1, 2, 3, 2, 1, 3, 2, 4].map(function (v) { return '<i style="height:' + v * 22 + '%"></i>'; }).join('') + '</span><span class="ct"><b>23</b>calls in 14 days</span><span class="sx-tag blue">New</span></div>' + G.map(function (g, k) {
          return '<div class="sg-r" data-g="' + k + '"><i class="tg' + (g[3] === 'Paused' ? ' off' : '') + '"></i><span class="nm">' + g[0] + '<small>' + g[1] + '</small></span><span class="sp">' + g[5].map(function (v, d) { return '<i' + (g[4] && d > 9 ? ' class="pk"' : '') + ' style="height:' + Math.max(8, v / 28 * 100) + '%"></i>'; }).join('') + '</span><span class="ct"><b>' + g[2] + '</b>calls in 14 days</span><span class="sx-tag ' + g[4] + '">' + g[3] + '</span></div>';
        }).join('') + '</div></div>';
    },
    show: function (el, i, ui) {
      var fresh = el.querySelector('.sg-r.new'), tag = el.querySelector('.sg-new .sx-tag');
      fresh.classList.remove('in'); tag.textContent = 'Classifying 2,000 calls…';
      if (i === 1) {
        el.querySelector('[data-g="0"]').classList.add('hot');
        ui.side('<header>Cancellation intent<small>412 calls</small></header><div class="a" style="margin-top:14px"><p>The customer says they want to cancel or leave. Firing since Oct 9: <b>240% over its 30-day baseline.</b></p></div><h4>Caught today</h4>' +
          '<ul><li><b>14:02</b>“If this isn’t refunded today I’m cancelling everything.”</li><li><b>13:18</b>“I’d rather book with someone else next time.”</li><li><b>12:05</b>“Just cancel the whole trip, please.”</li></ul><div class="ft">' + act('Edit rule') + act('Create a task', 'ink') + '</div>');
      }
      if (i === 2) {
        var box = el.querySelector('.sg-new'), tx = box.querySelector('.tx'), text = 'The customer says they will switch to a competitor';
        box.classList.remove('done');
        var found = function () { tag.textContent = '23 calls found'; fresh.classList.add('in'); };
        if (ui.jump) { tx.textContent = text; box.classList.add('done'); found(); } else type(tx, text, function () { box.classList.add('done'); later(found, 1300); });
      }
    }
  };

  /* ---------- Demos ---------- */
  S.demos = {
    nav: 'Demos', icon: '<rect x="2.5" y="3.5" width="13" height="11" rx="2.4"/><path d="M7.6 6.8v4.4L11.4 9z"/>',
    steps: ['A demo is a script that drives the product’s own screens.', 'Opening one shows its steps, line by line.', 'Play runs the steps on the working screens.', 'The same script plays in Hebrew.'],
    build: function () {
      var D = [['Your July recap', 'The month as a story: volume, the topic that took over, the agent of the month.', '75 sec · 8 steps', ['Open Newsroom', 'Play the monthly recap', 'Count the calls']], ['The Monday loop', 'From an alert to a task to a closed loop, on one customer.', '40 sec · 6 steps', ['Open an alert', 'Create a task', 'Assign it']], ['The daily signal', 'A signal fires, the calls behind it open, a task is created.', '30 sec · 5 steps', ['Open Signals', 'Open the firing signal', 'Read a call']],
        ['Explain a score', 'A topic’s score opens into its three parameters and Ask AI.', '30 sec · 6 steps', ['Open Topics', 'Point at Online Booking', 'Open the score']], ['The morning scan', 'Compliance, then the agents who need coaching today.', '45 sec · 7 steps', ['Open Compliance', 'Find the failing score', 'Ask AI which calls']], ['Filter in plain words', 'A question typed into Data becomes a filter.', '20 sec · 4 steps', ['Open Data', 'Type the question', 'Read the result']]];
      return top('Demos', 'Scripts that drive the product’s own screens, in English or Hebrew. 6 sequences', act('<svg class="i" viewBox="0 0 18 18"><path d="M9 3.5v11M3.5 9h11"/></svg>New sequence', 'ink')) +
        '<div class="sx-body"><div class="dm-grid">' + D.map(function (d, k) { return '<div class="dm-card" data-d="' + k + '"><b>' + d[0] + '</b><p>' + d[1] + '</p><ol>' + d[3].map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol><footer><span>' + d[2] + '</span><span><svg viewBox="0 0 12 12"><path d="M2.5 1.2v9.6L10.5 6z"/></svg>Play</span></footer></div>'; }).join('') + '</div></div>';
    },
    show: function (el, i, ui) {
      if (!i) return;
      var EN = ['Open Topics on the Northwind project', 'Point at Online Booking: 4,412 calls at 43', 'Open the score: three parameters', 'Click Handle time and ask AI what drives it', 'Read the answer aloud', 'Close on the task it creates'];
      var HE = ['פתח את Topics בפרויקט Northwind', 'הצבע על Online Booking: 4,412 שיחות בציון 43', 'פתח את הציון: שלושה פרמטרים', 'לחץ על Handle time ושאל את ה-AI מה מניע אותו', 'הקרא את התשובה בקול', 'סיים במשימה שנוצרת'];
      var L = i === 3 ? HE : EN, at = i === 1 ? -1 : 2;
      el.querySelector('[data-d="3"]').classList.add('hot');
      ui.side('<header>Explain a score<small>30 sec · 6 steps</small></header><div class="ac-bar" style="margin-top:16px"><span class="sx-seg"><span' + (i === 3 ? '' : ' class="on"') + '>English</span><span' + (i === 3 ? ' class="on"' : '') + '>Hebrew</span></span></div>' +
        '<div class="dm-script" style="margin-top:14px"' + (i === 3 ? ' dir="rtl"' : '') + '>' + L.map(function (t, n) { return '<div class="dm-line' + (n === at ? ' on' : n < at ? ' done' : '') + '"><b>' + (n + 1) + '</b>' + t + '</div>'; }).join('') + '</div>' +
        '<div class="ft">' + act('Edit script') + act(at < 0 ? 'Play' : 'Playing · step 3 of 6', 'ink') + '</div>');
    }
  };

  var def = S[key];
  if (!def) return;

  /* the sidebar item: only the screen that is open is added, so the menu stays short */
  var after = document.getElementById('nav-topics') || [].filter.call(document.querySelectorAll('.side .nv'), function (b) { return /Workflows/.test(b.textContent); })[0];
  var nav = document.createElement('button');
  nav.className = 'nv'; nav.type = 'button'; nav.dataset.tip = def.nav;
  nav.innerHTML = '<svg class="i" viewBox="0 0 18 18">' + def.icon + '</svg><span class="lbl">' + def.nav + '</span>';
  after.insertAdjacentElement('afterend', nav);

  var el = document.createElement('div');
  el.className = 'glass sx on'; el.id = 'sx-' + key;
  el.innerHTML = '<div class="card">' + def.build() + '</div><div class="sx-side"></div><div class="sx-tip"></div>';
  stage.appendChild(el);
  var side = el.querySelector('.sx-side'), tip = el.querySelector('.sx-tip');
  var ui = {
    jump: false,
    side: function (html) { side.innerHTML = html; side.classList.add('on'); el.classList.add('side-on'); },
    tip: function (target, html, where) {
      tip.innerHTML = html; tip.classList.add('on'); tip.style.left = tip.style.top = '0px';
      var a = target.getBoundingClientRect(), r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, x, y;
      if (where === 'left') { x = a.left - r.left - w - 14; y = a.top - r.top + a.height / 2 - h / 2; }
      else if (where === 'below') { x = a.right - r.left - w; y = a.bottom - r.top + 14; }
      else if (where === 'topright') { x = a.right - r.left - w; y = a.top - r.top - h - 14; }
      else { x = a.left - r.left + a.width / 2 - w / 2; y = a.top - r.top - h - 14; }
      var z = r.width / el.offsetWidth || 1; /* the stage is zoomed to fit: rects are in screen px, styles are not */
      x = x / z + w - w / z; y = where === 'below' ? (a.bottom - r.top) / z + 14 : where === 'left' ? y / z : (a.top - r.top) / z - h - 14;
      if (where !== 'below' && where !== 'topright' && where !== 'left') x = (a.left - r.left + a.width / 2) / z - w / 2; else if (where !== 'left') x = (a.right - r.left) / z - w;
      tip.style.left = Math.max(20, Math.min(el.offsetWidth - w - 20, x)) + 'px'; tip.style.top = Math.max(20, Math.min(el.offsetHeight - h - 20, y)) + 'px';
    }
  };
  function step(i, jump) {
    timers.forEach(clearTimeout); timers = [];
    i = Math.max(0, Math.min(def.steps.length - 1, i | 0));
    el.dataset.st = i; ui.jump = !!jump;
    side.classList.remove('on'); tip.classList.remove('on'); el.classList.remove('side-on');
    [].forEach.call(el.querySelectorAll('.hot'), function (x) { x.classList.remove('hot'); });
    def.show(el, i, ui);
  }
  function open() {
    stage.classList.remove('s1', 's2', 's3', 's4', 'is-fresh', 'is-leaving', 'ask-on'); stage.classList.add('s5');
    [].forEach.call(document.querySelectorAll('.side .nv.on'), function (b) { b.classList.remove('on'); }); nav.classList.add('on');
    step(0, true);
  }
  nav.addEventListener('click', open);
  new MutationObserver(function () {
    if (stage.classList.contains('s5') && /\bs[1234]\b/.test(stage.className)) { stage.classList.remove('s5'); nav.classList.remove('on'); }
  }).observe(stage, { attributes: true, attributeFilter: ['class'] });
  window.hearScreens = { key: key, steps: def.steps, step: step, open: open };
  open();
})();
