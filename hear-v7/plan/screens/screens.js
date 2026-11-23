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
  var av = function (n) { var h = 0; for (var i = 0; i < n.length; i++) h += n.charCodeAt(i); return '<i class="sx-av a' + h % 5 + '">' + n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2) + '</i>'; };
  var top = function (h, p, acts) { return '<div class="top"><div><h2>' + h + '</h2><p>' + p + '</p></div><div class="sp"></div>' + (acts || '') + '</div>'; };
  var act = function (t, cls) { return '<button class="act' + (cls ? ' ' + cls : '') + '" type="button">' + t + '</button>'; };
  var kpis = function (a) { return '<div class="kpis">' + a.map(function (k) { return '<div><small>' + k[0] + '</small><b>' + k[1] + '</b><i>' + k[2] + '</i></div>'; }).join('') + '</div>'; };
  var timers = [];
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  var type = function (node, text, done) {
    node.textContent = ''; node.classList.add('typing');
    /* typed by a hand: a steady key, and a breath after each word */
    var t = 0;
    text.split('').forEach(function (c, i) { t += 30 + (i && text[i - 1] === ' ' ? 80 : 0); later(function () { node.textContent = text.slice(0, i + 1); if (i === text.length - 1) { node.classList.remove('typing'); if (done) done(); } }, t); });
  };
  var lv = function (s) { return s < 60 ? 'l1' : s < 70 ? 'l2' : s < 75 ? 'l3' : s < 80 ? 'l4' : 'l5'; };

  var S = {};

  /* ---------- Compliance ---------- */
  S.compliance = {
    nav: 'Compliance', icon: '<path d="M9 2.5 3.5 4.6v4.2c0 3.2 2.2 5.6 5.5 6.7 3.3-1.1 5.5-3.5 5.5-6.7V4.6z"/><path d="M6.5 9l1.8 1.8 3.3-3.6"/>',
    steps: ['Every agent is checked against the same five rules.', 'A failing score opens the agent, compared with the team.', 'Ask AI names the calls that pulled it down.'],
    build: function () {
      var A = ['Evan', 'Lucy', 'Aaron', 'Stefan', 'Iris', 'Ada', 'Tara', 'Martina', 'Shaw', 'Selma'];
      var C = [['Fee disclosure', [85, 90, 67, 100, 87, 94, 78, 82, 79, 92]], ['Consent to continue', [81, 72, 87, 89, 82, 88, 65, 91, 76, 79]], ['Identity verification', [90, 89, 76, 100, 75, 98, 92, 93, 82, 85]],
        ['Vulnerable customer protocol', [88, 70, 72, 61, 76, 87, 87, 89, 68, 54]], ['Risk warning disclosure', [69, 88, 83, 85, 85, 70, 86, 74, 92, 66]]];
      var cls = function (v) { return v < 60 ? ' low' : v < 70 ? ' mid' : ''; };
      var g = '<div class="rw"></div>' + A.map(function (a) { return '<div class="hd"><b>' + a + '</b></div>'; }).join('');
      C.forEach(function (c, r) { g += '<div class="rw">' + c[0] + '</div>' + c[1].map(function (v, i) { return '<div class="c' + cls(v) + '" data-c="' + r + '-' + i + '" style="--i:' + i + '">' + v + '</div>'; }).join(''); });
      g += '<div class="rw ft">Failing criteria</div>' + A.map(function (a, i) { var n = C.filter(function (c) { return c[1][i] < 70; }).length; return '<div class="ft">' + (n ? '<b>' + n + '</b>' : '–') + '</div>'; }).join('');
      return top('Compliance', 'Every agent, checked against the center’s five rules.', act('Last 6 weeks' + chev) + act('Share')) +
        kpis([['Sales without alerts', '72.6<small>%</small>', '▲ 2.1 pts against the 6 weeks before'], ['Valid sales', '93.8<small>%</small>', 'target 90%'], ['Above the success metric', '88.5<small>%</small>', '23 of 26 agents average 75 or more']]) +
        '<div class="sx-body"><div class="sx-h"><b>Criteria by agent</b><span class="cm-sub">Team B · 10 of 26 agents · pass mark 70</span><span class="sx-seg r"><span class="on">Agents</span><span>Teams</span></span></div>' +
        '<div class="cm-grid">' + g + '</div>' +
        '<div class="sx-note"><span>Only a score under the pass mark takes color</span><i style="background:rgba(24,36,48,.07)"></i><span>70 and up</span><i style="background:#FFD0C4"></i><span>60–69</span><i style="background:var(--coral)"></i><span>under 60</span></div></div>';
    },
    show: function (el, i, ui) {
      /* the page arrives: the scores land agent by agent, all of them gray; then the failing ones take their color. The sentence above
         the table says the same thing: only a failing score takes color */
      var grid = el.querySelector('.cm-grid'); grid.classList.remove('draw');
      if (i === 0 && ui && !ui.jump) { void grid.offsetWidth; grid.classList.add('draw'); }
      var c = el.querySelector('[data-c="3-9"]');
      [].forEach.call(el.querySelectorAll('.c.cov'), function (x) { x.classList.remove('cov'); });
      var cover = function (r0, r1, c0, c1) { for (var r = r0; r <= r1; r++) for (var k = c0; k <= c1; k++) { var x = el.querySelector('[data-c="' + r + '-' + k + '"]'); if (x) x.classList.add('cov'); } };
      if (i >= 1) c.classList.add('hot');
      if (i === 1) {
        var n = 3, w = 0; while (n < 6 && (w = c.offsetLeft + c.offsetWidth - el.querySelector('[data-c="3-' + (10 - n) + '"]').offsetLeft) < 216) n++;
        ui.tip(c, '<strong>Selma K.</strong><span class="t2">Vulnerable customer protocol</span><span>12 of 26 calls failed this rule</span>' +
          '<div class="m"><b>Selma</b><i><u style="width:54%"></u></i><em>54</em></div><div class="m t"><b>Team</b><i><u style="width:81%"></u></i><em>81</em></div><div class="pm"><span>pass mark 70</span></div><b class="go">Ask AI which calls →</b>', 'topright', w);
        /* three whole rows above the score when the popover fits in them; in a shorter frame it starts at the top of the table */
        var t = el.querySelector('.sx-tip'), R = el.getBoundingClientRect(), z = R.width / el.offsetWidth || 1, a0 = el.querySelector('[data-c="0-9"]').getBoundingClientRect(), a2 = el.querySelector('[data-c="2-9"]').getBoundingClientRect();
        if ((a2.bottom - a0.top) / z >= t.offsetHeight) { t.classList.add('fill'); t.style.height = (a2.bottom - a0.top) / z - 6 + 'px'; t.style.top = (a0.top - R.top) / z + 'px'; cover(0, 2, 10 - n, 9); }
        else {
          var m = 3, w2 = 0, f; do { f = el.querySelector('[data-c="3-' + (9 - m) + '"]'); w2 = c.offsetLeft - f.offsetLeft - 14; m++; } while (m < 7 && w2 < 216);
          m--; var a4 = el.querySelector('[data-c="4-9"]').getBoundingClientRect(), fr = f.getBoundingClientRect();
          t.style.width = w2 + 'px'; t.style.left = (fr.left - R.left) / z + 'px'; t.style.top = (a0.top - R.top) / z + 'px';
          if ((a4.bottom - a0.top) / z >= t.offsetHeight) { t.classList.add('fill'); t.style.height = (a4.bottom - a0.top) / z + 'px'; }
          cover(0, 4, 9 - m, 8);
        }
      }
      if (i === 2) ui.side('<header>' + MK + 'Ask AI<small>Selma K.</small></header><div class="q">Which calls pulled Selma’s Vulnerable customer protocol score down?</div>' +
        '<div class="a"><p><b>12 calls</b> failed, and 9 of them share one cause: the customer said they were struggling to pay and the protocol questions were skipped.</p>' +
        '<ul class="cm-calls">' + [['Oct 13', 'Cannot afford to rebook. Refund asked twice, voucher offered.', '01:48', '6 min 12 sec', 29], ['Oct 9', 'Customer mentions a missed payment. No affordability check.', '02:14', '8 min 40 sec', 26], ['Oct 7', 'Says the rent is due tomorrow. The sale continues.', '03:05', '7 min 21 sec', 42]]
          .map(function (q, n) { return '<li style="--i:' + n + '"><b>' + q[0] + '</b><span>' + q[1] + '<i class="cm-tl"><u style="left:' + q[4] + '%"></u></i><small>Protocol skipped at ' + q[2] + '<em> · ' + q[3] + '</em></small></span></li>'; }).join('') + '</ul></div>' +
        '<span class="sg-all">Show all 12 calls →</span><div class="cm-sug"><span>Which agents share this cause?</span><span>Draft a coaching note for Selma</span></div><div class="cm-ask">Ask a follow-up</div>');
    }
  };

  /* ---------- Agent evaluation ---------- */
  S.agents = {
    nav: 'Agent evaluation', icon: '<circle cx="9" cy="6" r="2.8"/><path d="M3.5 15c.6-3 2.7-4.6 5.5-4.6s4.9 1.6 5.5 4.6"/>',
    steps: ['Thirty days of the center’s score, against its average.', 'A day far under the average opens with what fell.', 'The 8 agents under 60, and the criterion five of them share.'],
    build: function () {
      /* Sep 13 to Oct 12. The thirty days average 76, the number in the KPI above and the dashed line on the chart. The axis runs from
         50 to 90 and says so. A day is coral when it is 8 or more points under the average: Sep 30 to Oct 3 */
      var D = [77, 77, 76, 76, 75, 75, 77, 75, 75, 76, 76, 76, 77, 77, 78, 77, 78, 66, 68, 67, 67, 79, 79, 79, 79, 82, 81, 82, 77, 76];
      var F = function (v) { return 'calc(30px + (100% - 30px) * ' + ((v - 50) / 40).toFixed(3) + ')'; };
      var bars = D.map(function (v, i) { return '<i class="ae-b' + (v <= 68 ? ' low' : '') + '" data-b="' + i + '" style="height:' + ((v - 50) / 40 * 100).toFixed(1) + '%;animation-delay:' + i * 22 + 'ms"><em>' + v + '</em></i>'; }).join('');
      var axis = [50, 60, 70, 80].map(function (v) { return '<span class="ae-y" style="bottom:' + F(v) + '">' + v + '</span>'; }).join('');
      var dates = [[0, 'Sep 13'], [7, 'Sep 20'], [14, 'Sep 27'], [21, 'Oct 4'], [29, 'Oct 12']].map(function (d) {
        return '<span style="' + (d[0] === 0 ? 'left:0' : d[0] === 29 ? 'right:0' : 'left:' + ((d[0] + .5) / 30 * 100).toFixed(2) + '%;translate:-50% 0') + '">' + d[1] + '</span>'; }).join('');
      var G = [['90–100', 27, 'g5'], ['80–89', 193, 'g4'], ['70–79', 349, 'g3'], ['60–69', 138, 'g2'], ['under 60', 8, 'g1']];
      return top('Agent evaluation', 'An AI score for every agent, with the calls it is based on. 715 agents · 8 criteria', act('Service quality' + chev) + act('Last 30 days' + chev)) +
        kpis([['Agents', '715', 'active in the last 30 days'], ['Average score', '76<small>/ 100</small>', '▲ 1 pt against the 30 days before'], ['Under 60', '8', 'agents to coach first']]) +
        '<div class="sx-body"><div class="sx-h"><b>Average score over time</b><span class="ae-sub">Coral: a day 8 or more points under the average</span><span class="sx-seg r"><span class="on">Bars</span><span>Trend</span></span></div>' +
        '<div class="ae-plot">' + axis + bars + '<i class="ae-avg" style="bottom:' + F(76) + '"><b>Avg 76</b></i></div><div class="ae-dates">' + dates + '</div>' +
        '<div class="ae-dist"><div class="sx-h"><b>Agents by average score</b><span>715 agents</span></div><div class="ae-strip">' + G.map(function (g) { return '<i class="' + g[2] + '" data-g="' + g[0] + '" style="flex:' + Math.max(g[1], 14) + '"></i>'; }).join('') + '</div>' +
        '<div class="ae-leg">' + G.map(function (g) { return '<span data-g="' + g[0] + '"><i class="' + g[2] + '"></i>' + g[0] + ' <b>' + g[1] + '</b></span>'; }).join('') + '</div></div></div>';
    },
    show: function (el, i, ui) {
      /* the page arrives in the order it is read: thirty days rise from left to right, the average is drawn across them, and only then
         do the four days far under it turn coral */
      var plot = el.querySelector('.ae-plot'); plot.classList.remove('draw');
      var hair = plot.querySelector('.ae-x'); if (hair) plot.removeChild(hair);
      if (i === 0 && ui && !ui.jump) { void plot.offsetWidth; plot.classList.add('draw'); }
      if (i === 1) { var b = el.querySelector('[data-b="17"]'); b.classList.add('hot');
        hair = document.createElement('i'); hair.className = 'ae-x'; plot.appendChild(hair);
        var pb = plot.getBoundingClientRect(), bb = b.getBoundingClientRect(), pz = pb.width / plot.offsetWidth || 1;
        hair.style.left = ((bb.left + bb.width / 2 - pb.left) / pz - .5) + 'px'; hair.style.height = Math.max(0, (bb.top - pb.top) / pz - 4) + 'px';
        ui.tip(b, '<strong>Wed, Sep 30</strong><span class="big">66 <small>/ 100</small></span><span>10 pts under the average · 3,104 calls</span><span class="why">Fell most: <b>Explains the refund policy</b>, 81 → 52</span>', 'lefttop'); }
      if (i === 2) {
        [].forEach.call(el.querySelectorAll('[data-g="under 60"]'), function (x) { x.classList.add('hot'); });
        el.querySelectorAll('.kpis>div')[2].classList.add('hot');
        /* the eight, lowest first (they average 54). Five of them are weakest on the criterion that fell for the whole center on Sep 30;
           Selma K. is the agent the Compliance screen opens and the one the task in Actions asks to coach */
        var AG = [['Selma K.', 48, 1], ['Jonas R.', 51, 1], ['Priya N.', 52, 'Verifies identity'], ['Tomas V.', 54, 1], ['Leah M.', 55, 1], ['Dario F.', 56, 'Sets a clear next step'], ['Noor A.', 57, 1], ['Kyle B.', 59, 'Shows empathy']];
        ui.side('<header>Under 60<small>8 of 715 agents</small></header><div class="a" style="margin-top:14px"><p><span class="ae-xs">They average <b>54</b> across 1,212 calls. </span><b>Five of the eight are weakest on the same criterion</b>, the one that fell on Sep 30.</p></div><h4 class="ae-h4">Lowest first · weakest criterion</h4>' +
          '<ul class="ae-ag">' + AG.map(function (a, n) { return '<li style="--i:' + n + '">' + av(a[0]) + '<span>' + a[0] + '<small>' + (a[2] === 1 ? '<u>Explains the refund policy</u>' : a[2]) + '</small></span><em>' + a[1] + '</em></li>'; }).join('') + '</ul>' +
          '<div class="ft">' + act('Open the list') + act('Create 5 coaching tasks', 'ink') + '</div>');
        /* the finding ends in the move it calls for: the five who share the criterion become five coaching tasks */
        if (ui && !ui.jump) { later(function () { var bt = el.querySelector('.sx-side .ft .ink'); if (!bt) return; bt.classList.add('press');
          later(function () { bt.classList.add('made'); bt.textContent = '5 tasks created'; }, 320); }, 5900); }
      }
    }
  };

  /* ---------- Actions ---------- */
  S.actions = {
    nav: 'Actions', icon: '<rect x="2.5" y="3" width="3.6" height="12" rx="1.2"/><rect x="7.2" y="3" width="3.6" height="8" rx="1.2"/><rect x="11.9" y="3" width="3.6" height="10" rx="1.2"/>',
    steps: ['Each finding is a task, with the line from the call that raised it.', 'A card carries its next moves: reassign, start or resolve.', 'The task opens with the call it came from, and is worked there.', 'Closed work keeps its reason.'],
    build: function () {
      /* a card: where it came from, what was found, the evidence (a line from the call with its time; once the task is closed, the
         reason it was closed), and who has it */
      var card = function (src, hi, title, ev, who, tag, cls) { return '<div class="ac-card' + (cls ? ' ' + cls : '') + '"><small><u' + (hi ? ' class="hi"' : '') + '></u>' + src.replace(' · High', '<span class="hp"> · High</span>') + '</small><p>' + title + '</p><span class="cev">' + ev + '</span><footer>' + (who ? av(who) + who : '<span style="color:var(--mut)">Not assigned</span>') + (tag ? '<span class="sx-tag' + (tag === 'Resolved' ? ' ok' : '') + '">' + tag + '</span>' : '') + '</footer><div class="qa"><span>Reassign</span><span class="go">Start</span><span>Resolve</span></div></div>'; };
      /* c2: the count once the refund task has been carried to Done (step 4) */
      var col = function (n, c, cards, more, c2) { return '<section class="ac-col"><h4>' + n + '<i>' + (c2 ? '<b class="n0">' + c + '</b><b class="n1">' + c2 + '</b>' : c) + '</i></h4>' + cards + (more ? '<span class="ac-more"><b class="w">+' + more + ' more</b><b class="t">+' + (more + 1) + ' more</b></span>' : '') + '</section>'; };
      return top('Actions', 'Every finding from a call, tracked to an owner and an outcome.', act('<svg class="i" viewBox="0 0 18 18"><path d="M9 3.5v11M3.5 9h11"/></svg>New task', 'ink')) +
        '<div class="ac-bar"><span class="sx-chip on">Everyone</span><span class="sx-chip">Assigned to me</span><span class="sx-chip">Mentions me</span><i class="gap"></i><span class="sx-chip">High priority <b>4</b></span><span class="sx-chip">From alerts <b>5</b></span><span class="sx-chip">From agent evaluation <b>2</b></span></div>' +
        '<div class="ac-board">' +
        col('Pending', 6, card('Alert · Today · High', 1, 'Customer asked twice for a refund, was offered only a voucher', '“…a refund, not a voucher.” · 02:41', 'Daniel Brooks', '', 'src') +
          card('Call · Yesterday', 0, 'Reason for call tagged as Billing, should be Flight change', '“I need to move my flight.” · 00:38', 'Maya Collins') +
          card('Agent evaluation · Yesterday · High', 1, 'Recording disclosure missing in the first 30 seconds', 'No recording notice before 00:30', ''), 3, 5) +
        col('In progress', 5, card('Alert · Oct 10 · High', 1, 'Technical failure blocked a booking at payment', '“It says payment failed.” · 03:12', 'Ryan Cole') +
          card('Agent evaluation · Oct 9', 0, 'Identity verification skipped before a ticket change', 'No ID question before 01:55', 'Paula Nunes') +
          card('Call · Oct 9', 0, 'Promised callback was not made within 24 hours', '“Nobody called me back.” · 01:12', 'Sofia Cruz'), 2) +
        col('Done', 4, card('Alert · Today', 0, 'Customer asked twice for a refund, was offered only a voucher', 'Refunded · coaching set for Oct 15', 'Daniel Brooks', 'Resolved', 'moved') +
          card('Alert · Oct 5', 0, 'Lost baggage claim escalated to the ground team', 'Ground team found the bag, Oct 6', 'Sofia Cruz', 'Escalated') +
          card('Call · Oct 4', 0, 'Sentiment re-analyzed on a VIP escalation', 'Sentiment corrected to Negative', 'Maya Collins', 'Resolved'), 2, 5) +
        col('Cancelled', 2, card('Alert · Oct 10', 0, 'Duplicate: booking engine timeout', 'Same failure as the Oct 10 alert', 'Ryan Cole', 'Duplicate') +
          card('Feedback · Sep 30', 0, 'Website search is slow', 'Not about a call', '', 'Not actionable')) + '</div>';
    },
    show: function (el, i, ui) {
      var c = el.querySelector('.ac-card.src'), m = el.querySelector('.ac-card.moved'), ce = m.querySelector('.cev'), OUT = 'Refunded · coaching set for\u00a0Oct\u00a015';
      m.classList.remove('fly'); ce.classList.remove('ans'); ce.textContent = OUT;
      if (i === 1 || i === 2) c.classList.add('hot');
      if (i === 2) ui.side('<header>Task<small>From an alert · Today</small></header><div class="a" style="margin-top:14px"><p style="font-size:19px;line-height:1.25;color:var(--ink);font-weight:500">Customer asked twice for a refund, was offered only a voucher</p><p>Cancelled JFK–LHR flight. The customer asked for a cash refund twice and the agent offered a voucher both times.</p></div>' +
        '<dl><dt>Source</dt><dd><span class="sx-tag blue">Alert</span>Refund refused</dd><dt>Priority</dt><dd>High</dd><dt>Assignee</dt><dd>' + av('Daniel Brooks') + 'Daniel Brooks</dd><dt>Call</dt><dd>Oct 13 · 6 min 12 sec</dd></dl>' +
        /* the call the task came from: its length as a line, the two moments the customer asked, and what was said */
        '<div class="ac-ev"><h4>From the call · agent Selma K.</h4><i class="cm-tl"><s></s><u style="left:22%"></u><u style="left:43.3%"></u></i><p><b>01:22</b>“I’d like a refund for the cancelled flight.”</p><p><b>02:41</b>“I asked for a refund, not a voucher.”</p></div>' +
        '<h4>Checklist</h4><div class="ac-check" data-late><i></i>Listen to the call</div><div class="ac-check" data-late><i></i>Refund the customer</div><div class="ac-check" data-late><i></i>Book coaching with Selma K.</div>' +
        /* the outcome is written here, by the person who closes the task; it is the line the card carries in Done */
        '<div class="ac-out"><h4>Outcome</h4><div class="f"><span class="tx"></span></div></div>' +
        '<div class="ft">' + act('Reassign') + act('Close as Resolved', 'ink') + '</div>');
      /* the task is worked in front of the viewer: the refund, then the coaching, and only then is it closed as Resolved */
      if (i === 2) {
        var tick = function (x) { x.classList.add('done'); x.firstChild.textContent = '✓'; };
        var otx = el.querySelector('.sx-side .ac-out .tx'), evd = el.querySelector('.sx-side .ac-ev');
        [].forEach.call(el.querySelectorAll('.sx-side [data-late]'), function (x, n) { if (ui.jump) tick(x); else later(function () { tick(x); }, [3700, 4400, 5000][n]); });
        /* then the outcome is typed, the two moments on the call are answered (coral to green), and the task is closed */
        if (ui.jump) { otx.textContent = OUT; evd.classList.add('heard'); evd.classList.add('ok'); }
        /* first the call is listened to: a playhead crosses its line and stops at the two moments (2.3 s to 3.6 s); only then is
           "Listen to the call" ticked, and the other two after it */
        else { evd.classList.add('wait'); later(function () { evd.classList.add('play'); }, 2300);
          later(function () { type(otx, OUT, function () { later(function () { evd.classList.add('ok'); }, 120); }); }, 5400); later(function () { el.querySelector('.sx-side .ft .ink').classList.add('press'); }, 7350); }
      }
      /* and it is carried to Done: the card leaves its place in Pending and lands at the top of Done, where its outcome is written */
      if (i === 3 && ui && !ui.jump && m.animate && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        c.style.display = 'block'; m.style.display = 'none'; var a = c.getBoundingClientRect();
        c.style.display = m.style.display = ''; var b = m.getBoundingClientRect(), z = el.getBoundingClientRect().width / el.offsetWidth || 1, dx = (a.left - b.left) / z, dy = (a.top - b.top) / z;
        m.classList.add('fly');
        /* it lands still carrying what the customer said; the outcome then takes that line's place */
        ce.innerHTML = c.querySelector('.cev').innerHTML; later(function () { ce.textContent = OUT; ce.classList.add('ans'); }, 1520);
        m.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(' + dx + 'px,' + (dy - 7) + 'px)', offset: .2 }, { transform: 'none' }], { duration: 1000, delay: 350, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'backwards' });
      }
    }
  };

  /* ---------- Newsroom ---------- */
  /* Owner, 23.11.2026: "looks really bad, not invested at all". Rebuilt as the front page the case study describes: the day and the
     count of stories, sections by platform area, one lead story with its evidence on the page (its source and time, a usual day to
     measure the spike against, why it is here, its calls), the month as a story you can play, and the week's other stories, each with
     a source line and one word for where it is heading. Today is Oct 13, as in the other screens, so the recap is September's. */
  S.news = {
    nav: 'Newsroom', icon: '<rect x="2.5" y="3.5" width="13" height="11" rx="2"/><path d="M5.5 7h4M5.5 10h7"/>',
    steps: ['Newsroom writes what changed in the calls as stories.', 'Play opens the month as a 75-second story.', 'It counts the 38,214 calls analyzed in September.', 'Then it names the one thing that changed most.'],
    build: function () {
      /* the lead story's evidence: the signal's calls a day, Sep 13 to Oct 12. A usual day is 17; the last 14 days add up to the 412
         the Signals screen shows; Oct 9 is the first day over twice the usual (Signals: "firing since Oct 9"); 58 is 3.4 times 17, the same figure the Signals card carries */
      var V = [17, 16, 17, 18, 17, 16, 17, 18, 17, 16, 17, 17, 18, 17, 16, 17, 16, 18, 17, 19, 16, 18, 17, 20, 26, 34, 44, 52, 57, 58];
      var n = V.length - 1, X = function (i) { return i * 10; }, Y = function (v) { return 100 - v / 70 * 100; }, pc = function (v) { return (+v).toFixed(2) + '%'; };
      var d = 'M0 ' + Y(V[0]).toFixed(2);
      for (var i = 0; i < n; i++) {
        var p0 = V[Math.max(0, i - 1)], p1 = V[i], p2 = V[i + 1], p3 = V[Math.min(n, i + 2)];
        d += 'C' + (X(i) + 10 / 3).toFixed(2) + ' ' + Y(p1 + (p2 - p0) / 6).toFixed(2) + ' ' + (X(i + 1) - 10 / 3).toFixed(2) + ' ' + Y(p2 - (p3 - p1) / 6).toFixed(2) + ' ' + X(i + 1) + ' ' + Y(p2).toFixed(2);
      }
      var yb = Y(17), W = X(n);
      /* the recap's month, day by day (Sep 1 is a Tuesday; the 30 days add up to the 38,214 on the slide). Monday Sep 21, the day of the
         schedule change, is the busiest. Refund calls a day: 963 in the week before, 2,014 in the week of Sep 21, so "doubled" can be seen */
      var M = [1442, 1313, 1315, 1250, 768, 677, 1441, 1498, 1313, 1289, 1275, 760, 677, 1493, 1362, 1354, 1302, 1226, 823, 650, 1921, 1760, 1822, 1668, 1667, 1055, 859, 1449, 1432, 1353];
      var R = [166, 165, 147, 148, 94, 83, 176, 167, 150, 155, 158, 88, 83, 166, 155, 162, 161, 147, 95, 77, 363, 345, 329, 293, 322, 201, 161, 169, 175, 157];
      var bars = M.map(function (v, k) { return '<i' + (k === 20 ? ' class="top"' : '') + ' style="height:' + (v / 1921 * 100).toFixed(1) + '%;--h:' + (v / 1921).toFixed(3) + ';--i:' + k + '"></i>'; }).join('');
      var RY = function (v) { return 100 - v / 380 * 100; }, rd = 'M0 ' + RY(R[0]).toFixed(2);
      for (var j = 0; j < R.length - 1; j++) { var q0 = R[Math.max(0, j - 1)], q1 = R[j], q2 = R[j + 1], q3 = R[Math.min(R.length - 1, j + 2)];
        rd += 'C' + (X(j) + 10 / 3).toFixed(2) + ' ' + RY(q1 + (q2 - q0) / 6).toFixed(2) + ' ' + (X(j + 1) - 10 / 3).toFixed(2) + ' ' + RY(q2 - (q3 - q1) / 6).toFixed(2) + ' ' + X(j + 1) + ' ' + RY(q2).toFixed(2); }
      /* the same thirty days, at rest on the recap's cover: what Play will listen back to */
      var wv = M.map(function (v, k) { return '<i' + (k === 20 ? ' class="top"' : '') + ' style="--h:' + (v / 1921).toFixed(3) + '"></i>'; }).join('');
      var N = [['Team B handle time is up 40% on last week', 'Agent evaluation · 2:30 pm', 'Rising', 'ink', ''],
        ['Refund asked twice, voucher offered: 6 calls in 7 days', 'Alert · Refund refused · Oct 13', 'New', 'nw', ' thread'],
        ['Recording disclosure went missing on 61 calls in 14 days', 'Signal · Disclosure missing', 'Rising', 'ink', ''],
        ['Silence on Trip Status calls is down a third', 'Signal · Long silence · since the new script', 'Improving', 'ok', ''],
        ['Valid sales held above the 90% target for a sixth week', 'Compliance · weekly report', 'Steady', '', '']];
      var tab = function (t, c, on) { return '<span class="tab' + (on ? ' on' : '') + '">' + t + (c ? '<small>' + c + '</small>' : '') + '</span>'; };
      return top('Newsroom', 'What changed in your calls, written as stories you can read or play.', act('Last 7 days' + chev) + act('Share')) +
        '<div class="nr-mast"><span class="day"><b>Tuesday, October 13</b>31 stories in the last 7 days</span><span class="sp"></span>' + tab('Front page', '', 1) + tab('Signals', 9) + tab('Agent evaluation', 8) + tab('Compliance', 6) + tab('Alerts', 8) + '</div>' +
        '<div class="sx-body nr-body"><section class="nr-lead">' +
        '<div class="nr-kick"><span class="sx-tag ink">Surging</span>Signal · Cancellation intent · 4:12 pm</div>' +
        '<h3>Cancellation intent is running at 3.4 times its usual day</h3>' +
        '<p>In 58 calls yesterday the customer said they want to cancel or leave. A usual day has 17.</p>' +
        '<div class="nr-plot"><svg viewBox="0 0 ' + W + ' 100" preserveAspectRatio="none"><clipPath id="nr-over"><rect x="0" y="-20" width="' + W + '" height="' + (yb + 20).toFixed(2) + '"/></clipPath>' +
        '<path d="' + d + 'V' + yb.toFixed(2) + 'H0Z" fill="#DCEFFE" clip-path="url(#nr-over)"/><path d="' + d + '" fill="none" stroke="#139FFD" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>' +
        '<i class="base" style="top:' + pc(yb) + '"></i><i class="ax"></i><span class="lb cap">Cancellation-intent calls a day · last 30 days</span>' +
        '<span class="lb late nq1" style="right:0;top:' + pc(yb) + ';translate:0 7px">Usual day · <b>17 calls</b></span>' +
        '<i class="dot o late nq2" style="left:' + pc(26 / n * 100) + ';top:' + pc(Y(44)) + '"></i><span class="lb late nq2" style="right:' + pc(100 - 26 / n * 100) + ';top:' + pc(Y(44)) + ';translate:-14px -50%">Over twice the usual · <b>Oct 9</b></span>' +
        '<i class="dot late nq3" style="left:100%;top:' + pc(Y(58)) + '"></i><span class="lb late nq3" style="right:0;top:' + pc(Y(58)) + ';translate:4px -30px"><b>58 calls</b> · Oct 12</span></div>' +
        '<div class="nr-days">' + [[0, 'Sep 13'], [7, 'Sep 20'], [14, 'Sep 27'], [21, 'Oct 4'], [29, 'Oct 12']].map(function (a) { return '<span style="left:' + pc(a[0] / n * 100) + '">' + a[1] + '</span>'; }).join('') + '</div>' +
        /* a story has voices: two of today's calls, the same ones the Signals screen lists under "Caught today" */
        '<div class="nr-said"><blockquote>“If this isn’t refunded today I’m canceling everything.”<small>Call · Oct 12 · 2:02 pm · 6 min 12 sec</small></blockquote>' +
        '<blockquote>“Just cancel the whole trip, please.”<small>Call · Oct 12 · 12:05 pm · 9 min 3 sec</small></blockquote></div>' +
        '<div class="nr-why"><div><b>Why you’re seeing this</b><p>The signal passed twice its usual level on Oct 9 and has stayed above it for four days.</p></div>' +
        '<span class="nr-str"><i><u></u><u></u><u></u></i>Strong</span><span class="nr-see">See the 211 calls →</span></div></section>' +
        '<section class="nr-side"><div class="nr-feat"><small>Monthly recap · September</small><h3>38,214 calls. One story.</h3><p>The busiest day, and the one thing that changed most.</p>' +
        '<div class="nr-pl"><span class="nr-play"><svg viewBox="0 0 12 12"><path d="M2.5 1.2v9.6L10.5 6z"/></svg>Play · 75 sec</span><span class="nr-wv">' + wv + '</span></div></div>' +
        '<div class="nr-list">' + N.map(function (s) { return '<div class="nr-item' + s[4] + '"><b>' + s[0] + '</b><span class="sx-tag ' + s[3] + '">' + s[2] + '</span><span>' + s[1] + '</span></div>'; }).join('') + '</div></section></div>' +
        '<div class="nr-story" data-s="0"><div class="pr"><i class="on"></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="sl s0"><small>September 2026 · Your recap</small><h3>Chief,<br class="dk"> your month was loud.</h3><p>Let’s listen back.</p></div>' +
        '<div class="sl s1"><small>Calls analyzed</small><h3>38,214</h3><p>9% more than August</p></div>' +
        '<div class="nr-mon"><span class="tip" style="left:' + pc(20.5 / 30 * 100) + '">Busiest day · <b>Mon, Sep 21</b> · 1,921 calls</span><div class="b">' + bars + '</div><div class="x"><span>Sep 1</span><span>Sep 30</span></div></div>' +
        '<div class="sl s2"><small>What changed most</small><h3>Refund calls doubled in one week.</h3><p>The week of September 21, when the schedule changed.</p>' +
        /* the two weeks are two bands, each with its total above it */
        '<div class="nr-ref"><span class="wn" style="left:' + pc(160 / W * 100) + '"><b>963</b><i>Sep 14 to 20</i></span><span class="wn on" style="left:' + pc(230 / W * 100) + '"><b>2,014</b><i>Sep 21 to 27</i></span>' +
        '<svg viewBox="0 0 ' + W + ' 100" preserveAspectRatio="none"><clipPath id="nr-wk"><rect x="195" y="-30" width="70" height="160"/></clipPath><rect x="125" y="-12" width="70" height="112" fill="#fff" fill-opacity=".08"/><rect x="195" y="-12" width="70" height="112" fill="#fff" fill-opacity=".2"/>' +
        '<path d="' + rd + '" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
        '<path d="' + rd + '" fill="none" stroke="#fff" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" clip-path="url(#nr-wk)"/></svg>' +
        '<div class="x"><span>Sep 1</span><span>Sep 30</span></div></div></div></div>';
    },
    show: function (el, i, ui) {
      var st = el.querySelector('.nr-story'), num = st.querySelector('.s1 h3'), plot = el.querySelector('.nr-plot'), live = !!ui && !ui.jump;
      /* the front page arrives: the lead story's line is drawn from left to right, then its marks appear */
      plot.classList.remove('draw');
      if (i === 0 && live) { void plot.offsetWidth; plot.classList.add('draw'); }
      /* the slide says it counts the calls: so it counts */
      /* the count is the comparison itself: it starts at August's total (38,214 is 9% more) and the line that says so lands after it */
      st.querySelector('.s1').classList.toggle('cnt', i === 2 && live);
      if (i === 2 && live) { num.textContent = '35,059'; for (var n = 1; n <= 28; n++) (function (n) { later(function () { num.textContent = Math.round(35059 + 3155 * (1 - Math.pow(1 - n / 28, 4))).toLocaleString('en-US'); }, 520 + n * 44); })(n); }
      else num.textContent = '38,214';
      /* the last slide performs its claim: the second week's total starts at the first week's 963 and counts up to 2,014 */
      var wk = st.querySelector('.nr-ref .wn.on b');
      if (i === 3 && live) { wk.textContent = '963'; for (var m = 1; m <= 22; m++) (function (m) { later(function () { wk.textContent = Math.round(963 + 1051 * (1 - Math.pow(1 - m / 22, 3))).toLocaleString('en-US'); }, 2150 + m * 38); })(m); }
      else wk.textContent = '2,014';
      /* Play: the story opens out of its own cover, the blue card it was started from */
      if (i === 1 && live) {
        var a = el.querySelector('.nr-feat').getBoundingClientRect(), r = st.getBoundingClientRect(), z = r.width / st.offsetWidth || 1;
        st.style.transition = 'none';
        st.style.clipPath = 'inset(' + ((a.top - r.top) / z).toFixed(1) + 'px ' + ((r.right - a.right) / z).toFixed(1) + 'px ' + ((r.bottom - a.bottom) / z).toFixed(1) + 'px ' + ((a.left - r.left) / z).toFixed(1) + 'px round 16px)';
        void st.offsetWidth; st.style.transition = '';
      }
      st.style.clipPath = i >= 1 ? 'inset(0 round 22px)' : '';
      st.classList.toggle('on', i >= 1);
      st.classList.toggle('opens', i === 1 && live);
      if (i >= 1) { st.dataset.s = i - 1; [].forEach.call(st.querySelectorAll('.pr i'), function (x, n) { x.classList.toggle('on', n < i); }); }
    }
  };

  /* ---------- Data ---------- */
  /* Owner, 22.11.2026: "too simple, important elements are missing; compare with the product". The page now carries what the product's
     Data page carries: the project and its count, views with counts, a date range and filters, nine columns (a call with its summary,
     its id, when, where it stands, priority, who has it, length, sentiment, score) and a foot with pages. The plain-words field is still
     the subject: its answer lands in the ordinary filter bar as three chips anyone can read and remove. */
  S.data = {
    nav: 'Data', icon: '<ellipse cx="9" cy="4.8" rx="5.5" ry="2.3"/><path d="M3.5 4.8v8.4c0 1.3 2.5 2.3 5.5 2.3s5.5-1 5.5-2.3V4.8M3.5 9c0 1.3 2.5 2.3 5.5 2.3s5.5-1 5.5-2.3"/>',
    steps: ['Every call is a row: what it was about, where it stands and how it scored.', 'A filter is asked for in plain words.', 'It becomes three conditions, and 86 calls remain.'],
    build: function () {
      var ic = function (d, c) { return '<svg class="i' + (c ? ' ' + c : '') + '" viewBox="0 0 18 18">' + d + '</svg>'; };
      var SPARK = '<path d="M9 2.5l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z"/>', X = '<path d="M5.5 5.5l7 7M12.5 5.5l-7 7"/>',
        COPY = '<rect x="6.5" y="6.5" width="8" height="8" rx="2"/><path d="M4 11.5h-.2a1.3 1.3 0 0 1-1.3-1.3V4.8a1.3 1.3 0 0 1 1.3-1.3h5.4a1.3 1.3 0 0 1 1.3 1.3V5"/>',
        WARN = '<path d="M9 3.4 15.2 14H2.8z"/><path d="M9 7.6v3M9 12.2v.1"/>';
      /* alert, call, summary, id, day, time, status, priority, who, length, sentiment, score, direction (0 in, 1 out) */
      var A = [[1, 'Refunds & Credits', 'Asks twice for a refund on a cancelled flight, is offered a voucher', '00002000-r4k', 'Oct 13', '14:02', 'In progress', 3, 'Daniel Brooks', '6:12', 'Negative', 38, 0],
        [0, 'Online Booking', 'Books two seats to Lisbon and adds a bag at checkout', '00001999-b7m', 'Oct 13', '13:47', 'Done', 1, 'Maya Collins', '3:05', 'Positive', 82, 0],
        [0, 'Trip Status', 'Asks whether the 18:40 to Madrid is still on time', '00001998-t2x', 'Oct 13', '13:31', 'Done', 1, 'Ryan Cole', '2:40', 'Neutral', 71, 0],
        [1, 'Refunds & Credits', 'A refund promised ten days ago has not arrived', '00001997-r9d', 'Oct 13', '13:18', 'In progress', 3, 'Paula Nunes', '7:48', 'Negative', 41, 0],
        [0, 'Seating & Extras', 'Moves to an aisle seat and pays for extra legroom', '00001996-s5q', 'Oct 13', '12:56', 'Done', 1, 'Sofia Cruz', '1:52', 'Positive', 88, 0],
        [0, 'Refunds & Credits', 'Offered a credit in place of the refund and refuses it', '00001995-r1h', 'Oct 13', '12:40', 'Pending', 3, 'Alex Ward', '5:27', 'Negative', 35, 1],
        [0, 'Schedule Changes', 'Flight moved by four hours, asks for an earlier one', '00001994-c3v', 'Oct 13', '12:22', 'Pending', 2, '', '4:10', 'Neutral', 66, 0],
        [1, 'Refunds & Credits', 'Third call about the same refund, asks for a manager', '00001993-r6w', 'Oct 13', '12:05', 'In progress', 3, 'Maya Collins', '9:03', 'Negative', 29, 0],
        [0, 'E-ticket Delivery', 'The e-ticket never reached the inbox, sent again by email', '00001992-e8n', 'Oct 13', '11:51', 'Done', 1, 'Ryan Cole', '2:15', 'Positive', 79, 1]];
      var F = [A[0], A[3], A[5], A[7],
        [0, 'Refunds & Credits', 'The refund went to an old card, wants it sent again', '00001987-r3p', 'Oct 13', '10:52', 'Pending', 2, '', '6:40', 'Negative', 44, 0],
        [0, 'Refunds & Credits', 'Cancelled within 24 hours and was still charged a fee', '00001962-r8z', 'Oct 12', '17:31', 'Done', 2, 'Ryan Cole', '8:15', 'Negative', 33, 0],
        [0, 'Refunds & Credits', 'Only part of the refund came, the bag fee is missing', '00001955-r2j', 'Oct 12', '16:08', 'Pending', 2, 'Sofia Cruz', '5:48', 'Negative', 47, 1],
        [0, 'Refunds & Credits', 'Refund for a delayed flight was turned down, asks why', '00001948-r5t', 'Oct 12', '14:47', 'Done', 2, 'Paula Nunes', '7:20', 'Negative', 39, 0],
        [1, 'Refunds & Credits', 'Waited four weeks for the refund and will dispute the charge', '00001931-r7b', 'Oct 12', '11:15', 'In progress', 3, 'Alex Ward', '10:36', 'Negative', 27, 0]];
      var PR = ['', 'Low', 'Medium', 'High'], STC = { 'In progress': 'ip', 'Done': 'dn', 'Pending': 'pd', 'Cancelled': 'pd' };
      /* the four calls that match the filter are the same rows before and after: they stay and slide up to their new places
         (cls 'stay', --up = how many rows up), and their copies in the filtered set (cls 'dup') are never drawn */
      var UP = { 0: 0, 3: 2, 5: 3, 7: 4 };
      var row = function (r, n, cls, up) {
        return '<div class="dt-r' + (cls ? ' ' + cls : '') + '" style="--n:' + n + (up != null ? ';--up:' + up : '') + '"><i class="ck"></i>' +
          '<span class="cl"><b>' + r[1] + (r[0] ? ic(WARN, 'wn') : '') + '</b><small>' + r[2] + '</small></span>' +
          '<span class="id">' + r[3] + ic(COPY) + '</span>' +
          '<span class="dc">' + r[4] + '<small>' + r[5] + '</small></span>' +
          '<span><i class="dt-st ' + STC[r[6]] + '">' + r[6] + '</i></span>' +
          '<span class="pr"><i class="p' + r[7] + '"><u></u><u></u><u></u></i>' + PR[r[7]] + '</span>' +
          (r[8] ? '<span class="ag">' + av(r[8]) + '<em>' + r[8] + '</em></span>' : '<span class="ag none"><i class="sx-av"></i><em>Unassigned</em></span>') +
          '<span class="dr">' + (r[12] ? 'Outbound' : 'Inbound') + '</span>' +
          '<span class="du">' + r[9] + '</span>' +
          '<span class="se"><i class="' + (r[10] === 'Negative' ? 'neg' : r[10] === 'Neutral' ? 'neu' : '') + '"></i>' + r[10] + '</span>' +
          '<span class="sc ' + (r[11] < 50 ? 'lo' : r[11] < 75 ? 'md' : 'hi') + '">' + r[11] + '</span></div>';
      };
      var tab = function (t, n, on) { return '<span' + (on ? ' class="on"' : '') + '>' + t + (n ? '<small>' + n + '</small>' : '') + '</span>'; };
      var chip = function (k, v, n) { return '<span class="dt-f" style="--n:' + n + '">' + k + ' <b>' + v + '</b>' + ic(X, 'x') + '</span>'; };
      return '<div class="top dt-top"><h2>Data</h2><span class="dt-crumb">' + ic('<path d="M7 5l4 4-4 4"/>') + 'Northwind</span><span class="sx-tag nw dt-proc"><i></i>Processing 3</span><div class="sp"></div>' +
        '<div class="dt-search">' + ic('<circle cx="8" cy="8" r="4.5"/><path d="M11.5 11.5l3.5 3.5"/>') + '<span>Search calls</span><kbd>/</kbd></div>' + act('Export') + act(ic('<path d="M9 12V4M5.5 7.3 9 3.8l3.5 3.5M3.5 14h11"/>') + 'Upload', 'ink') + '</div>' +
        '<div class="dt-tabs">' + tab('All calls', '2,000', 1) + tab('Needs review', '148') + tab('High priority', '62') + tab('Alerts', '17') + tab('Done', '1,204') + tab('Agent evaluation', '') + '</div>' +
        '<div class="dt-ask"><i class="dt-cam a"></i><i class="dt-cam c"></i>' + ic(SPARK) + '<span class="tx"></span><i class="dt-send">' + ic('<path d="M9 13.5v-9M5.2 8.3 9 4.5l3.8 3.8"/>') + '</i></div>' +
        '<div class="dt-bar"><span class="dt-btn">' + ic('<rect x="3" y="4" width="12" height="11" rx="2.5"/><path d="M3 7.5h12M6.5 2.5v3M11.5 2.5v3"/>') + 'Last 90 days' + chev + '</span>' +
        chip('Topic', 'Refunds & Credits', 0) + chip('Length', 'over 5 min', 1) + chip('Sentiment', 'Negative', 2) +
        '<span class="dt-btn add">' + ic('<path d="M9 4v10M4 9h10"/>') + 'Filter</span><span class="dt-n"><b>2,000</b> calls</span><span class="sp"></span>' +
        '<span class="dt-btn">' + ic('<rect x="3" y="3.5" width="12" height="11" rx="2.5"/><path d="M7.2 3.5v11M10.8 3.5v11"/>') + 'Columns<b>10</b></span></div>' +
        '<div class="dt-tbl"><div class="dt-r hd"><i class="ck"></i><span>Call</span><span>ID</span><span class="srt">Call date' + ic('<path d="M9 4v10M5.5 10.5 9 14l3.5-3.5"/>') + '</span><span>Status</span><span>Priority</span><span>Assigned to</span><span>Direction</span><span class="du">Length</span><span>Sentiment</span><span style="text-align:right">Score</span></div>' +
        '<div class="dt-body"><div class="dt-set all">' + A.map(function (r, n) { return UP[n] != null ? row(r, n, 'stay', UP[n]) : row(r, n); }).join('') + '</div><div class="dt-set hit">' + F.map(function (r, n) { return row(r, n, n < 4 ? 'dup' : ''); }).join('') + '</div></div>' +
        '<div class="dt-foot"><span class="ct"><span class="rg"><b>1–9</b> of </span><span class="of">2,000</span> calls</span><span class="av"><i></i><span>Average score <b class="p">36</b><small>against <b>76</b><em> for all calls</em></small></span><i></i><span class="ln">Average length <b>7:07</b><small>against <b>4:12</b></small></span></span><button class="act ink sig" type="button">Save as a signal</button><span class="sp"></span>' +
        '<span class="pg"><i>' + ic('<path d="M11 5l-4 4 4 4"/>') + '</i><b>1</b><u>2</u><u>3</u><em>…</em><u class="last">223</u><i>' + ic('<path d="M7 5l4 4-4 4"/>') + '</i></span></div></div>';
    },
    show: function (el, i, ui) {
      var tx = el.querySelector('.dt-ask .tx'), n = el.querySelector('.dt-n'), of = el.querySelector('.dt-foot .of'), last = el.querySelector('.dt-foot .last'), text = 'refund calls over 5 minutes where the customer was unhappy';
      var count = function (v, bar) { n.innerHTML = v === 2000 ? '<b>2,000</b> calls' : '<b>' + v.toLocaleString('en-US') + '</b> of 2,000 calls'; if (bar) return; of.textContent = v.toLocaleString('en-US'); last.textContent = Math.ceil(v / 9); };
      /* shown finished, at once: a jump, a reader who asked for less motion, or a window the page holds paused (it marks its figure) */
      var still = !!ui.jump;
      try { if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) still = true; } catch (e) {}
      try { var fe = window.frameElement, fg = fe && fe.closest ? fe.closest('.px-fig') : null; if (fg && fg.classList.contains('is-paused')) still = true; } catch (e) {}
      el.classList.toggle('jmp', still);
      if (i === 0) tx.textContent = ''; else if (i === 1 && !still) type(tx, text); else if (i === 2) {
        /* the sentence is read: each phrase takes a lilac line as the condition it became lands under it */
        tx.classList.remove('typing'); tx.innerHTML = '<u style="--n:0">refund calls</u> <u style="--n:1">over 5 minutes</u> where the customer was <u style="--n:2">unhappy</u>';
      } else { tx.classList.remove('typing'); tx.textContent = text; }
      if (i === 2 && !still) {
        /* the count narrows once for each phrase, as its condition lands: 2,000, then 318 refund calls, 141 of them over five
           minutes, 86 of those unhappy. Only then do the rows change under it */
        count(2000);
        [[2000, 318, 230], [318, 141, 780], [141, 86, 1330]].forEach(function (r) {
          for (var k = 1; k <= 9; k++) (function (k) { later(function () { var q = 1 - Math.pow(1 - k / 9, 3); count(Math.round(r[0] - (r[0] - r[1]) * q), true); }, r[2] + k * 26); })(k);
        });
        /* the footer counts rows, so it changes when the rows do */
        later(function () { count(86); }, 2950);
      } else count(i === 2 ? 86 : 2000);
    }
  };

  /* ---------- Signals ---------- */
  /* Second build, 23.11.2026 (owner: go over every product screen, invest in each). The page was a flat list with its lower half empty.
     Now the three signals that are firing lead as cards with their evidence, the same way Newsroom shows it: 14 days of calls, a dashed
     line for a usual day, the days over twice the usual in coral. The quiet ones stay a list. Every bar adds up to the count beside it,
     and Cancellation intent is the same series as Newsroom's lead story (412 calls, 58 yesterday, usual day 17, firing since Oct 9). */
  S.signals = {
    nav: 'Signals', icon: '<path d="M2.5 9h3l2-5 3 10 2-5h3"/>',
    steps: ['A signal is a rule that classifies calls on its own.', 'Opening one shows the calls it caught.', 'A new signal is written in plain words.'],
    build: function () {
      var F = [['Cancellation intent', 'The customer says they want to cancel or leave', 17, 'Oct 9', [16, 18, 17, 19, 16, 18, 17, 20, 26, 34, 44, 52, 57, 58]],
        ['Refund refused', 'A refund is asked for and not offered', 5, 'Oct 10', [4, 5, 4, 5, 4, 5, 5, 4, 5, 5, 6, 11, 15, 16]],
        ['Disclosure missing', 'No recording disclosure in the first 30 seconds', 3, 'Oct 11', [2, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 5, 13, 14]]];
      var Q = [['Upgrade offer missed', 'An eligible customer is not offered an upgrade', 'Active', '', [15, 16, 14, 15, 17, 16, 15, 14, 16, 15, 15, 15, 16, 15]],
        ['Long silence', 'More than 20 seconds with nobody speaking', 'Active', '', [12, 12, 11, 12, 11, 11, 10, 9, 8, 8, 7, 7, 7, 6]],
        ['Competitor mentioned', 'The customer names another airline', 'Active', '', [3, 4, 3, 3, 4, 3, 4, 3, 3, 4, 3, 3, 4, 3]],
        ['Praise for the agent', 'The customer thanks the agent by name', 'Paused', '', null]];
      var sum = function (a) { return a.reduce(function (x, y) { return x + y; }, 0); };
      var spark = function (a) { var mx = Math.max.apply(0, a); return '<span class="sp">' + a.map(function (v, d) { return '<i style="height:' + Math.max(16, v / mx * 100).toFixed(0) + '%;--d:' + d + '"></i>'; }).join('') + '</span>'; };
      var card = function (f, k) {
        var a = f[4], mx = Math.max.apply(0, a);
        return '<div class="sg-card" data-g="' + k + '"><header><b>' + f[0] + '</b><i class="tg"></i></header><small>' + f[1] + '</small>' +
          '<div class="fig"><b>' + a[13] + '</b><span>calls yesterday<em> · ' + sum(a) + ' in 14 days</em></span><span class="sx-tag ink" style="animation-delay:' + (1380 + k * 120) + 'ms">' + (a[13] / f[2]).toFixed(1) + '× usual</span></div>' +
          '<div class="sg-plot">' + a.map(function (v, d) { return '<i' + (v > f[2] * 2 ? ' class="pk"' : '') + ' style="height:' + (v / mx * 100).toFixed(1) + '%;animation-delay:' + (380 + k * 120 + d * 34) + 'ms"></i>'; }).join('') +
          '<u style="bottom:' + (f[2] / mx * 100).toFixed(1) + '%"></u><span class="lb" style="bottom:calc(' + (f[2] / mx * 100).toFixed(1) + '% + 7px)">Usual day · <b>' + f[2] + '</b></span>' +
          '<span class="lb last">Over twice the usual since <b>' + f[3] + '</b></span></div><div class="sg-ax"><span>Sep 29</span><span>Oct 12</span></div></div>';
      };
      var row = function (q, k) {
        return '<div class="sg-r" data-g="' + k + '"><i class="tg' + (q[4] ? '' : ' off') + '"></i><span class="nm">' + q[0] + '<small>' + q[1] + '</small></span>' + (q[4] ? spark(q[4]) : '<span class="sp"></span>') +
          '<span class="ct">' + (q[4] ? '<b>' + sum(q[4]) + '</b>calls in 14 days' : '<b>–</b>paused on Sep 28') + '</span><span class="sx-tag ' + q[3] + '">' + q[2] + '</span></div>';
      };
      return top('Signals', 'Rules that classify calls on their own. <span class="sg-nn">7</span> signals · 3 triggered now', act('<svg class="i" viewBox="0 0 18 18"><path d="M9 3.5v11M3.5 9h11"/></svg>New signal', 'ink sg-nw') + act('Cancel', 'sg-cx')) +
        '<div class="sg-new"><span class="tx"></span><span class="sx-tag blue">Reading the last 14 days…</span></div>' +
        '<div class="sg-r fresh"><span class="nm"><span>Supervisor requested<span class="sx-tag nw">Preview</span></span><small>Also catches “a manager” and “someone in charge”</small></span>' + spark([1, 2, 1, 3, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1]) + '<span class="ct"><b>23</b>calls in 14 days</span>' + act('Save signal', 'ink') +
        /* a preview is checked before it is saved: two of the calls it found, the words that matched underlined */
        '<div class="mq"><small>2 of the 23</small><span>“Can I <u>speak to your supervisor</u>, please?”<small> · Oct 12</small></span><span>“I want <u>a manager</u> on the line.”<small> · Oct 11</small></span></div></div>' +
        '<div class="sx-body"><div class="sx-h"><b>Triggered now</b><span>3 signals over twice their usual day</span></div><div class="sg-fire">' + F.map(card).join('') + '</div>' +
        '<div class="sx-h sg-h2"><b>The other four</b><span>3 active, inside their usual range · 1 paused</span></div><div class="sg-list">' + Q.map(function (q, k) { return row(q, k + 3); }).join('') + '</div></div>';
    },
    show: function (el, i, ui) {
      var fresh = el.querySelector('.sg-r.fresh'), tag = el.querySelector('.sg-new .sx-tag'), fire = el.querySelector('.sg-fire'), live = !!ui && !ui.jump;
      var sv = fresh.querySelector('.act'), pt = fresh.querySelector('.nm .sx-tag'), nn = el.querySelector('.sg-nn');
      fresh.classList.remove('in', 'q'); sv.classList.remove('press', 'saved'); sv.textContent = 'Save signal'; pt.className = 'sx-tag nw'; pt.textContent = 'Preview'; nn.textContent = '7';
      tag.textContent = 'Reading the last 14 days…';
      /* the page arrives: each firing signal's fourteen days rise from left to right, then the usual day is drawn across them */
      fire.classList.remove('draw');
      if (i === 0 && live) { void fire.offsetWidth; fire.classList.add('draw'); }
      if (i === 1) {
        el.querySelector('[data-g="0"]').classList.add('hot');
        ui.side('<header>Cancellation intent<small>412 calls in 14 days</small></header><div class="a" style="margin-top:14px"><p>The customer says they want to cancel or leave. Over twice its usual day since Oct 9: <b>58 calls yesterday against a usual 17.</b></p></div>' +
          /* why it fired: what yesterday's 58 calls were about (they add up to 58) */
          '<div class="sg-why"><h4>What the 58 calls are about</h4>' + [['Refund not received', 31], ['Schedule change', 16], ['Long wait on hold', 11]].map(function (w, n) { return '<div style="--i:' + n + '"><span>' + w[0] + '</span><b>' + w[1] + '</b><i><u style="width:' + (w[1] / 31 * 100).toFixed(0) + '%"></u></i></div>'; }).join('') + '</div>' +
          '<h4>Caught yesterday<span class="n"> · <i class="w">4</i><i class="t">2</i> of 58</span></h4>' +
          '<ul class="sg-q">' + [['2:02 pm', '“If this isn’t refunded today I’m <u>canceling everything</u>.”', 'Daniel Brooks · 6 min 12 sec'], ['1:18 pm', '“I’d rather <u>book with someone else</u> next time.”', 'Maya Collins · 4 min 40 sec'],
            ['12:05 pm', '“Just <u>cancel the whole trip</u>, please.”', 'Ryan Cole · 9 min 3 sec'], ['11:40 am', '“<u>Close my account</u>, I’m done waiting.”', 'Sofia Cruz · 11 min 26 sec']]
            .map(function (q, n) { return '<li style="--i:' + n + '"><b>' + q[0] + '</b><span>' + q[1] + '<small>' + q[2] + '</small></span></li>'; }).join('') + '</ul><span class="sg-all">Open all 58 calls →</span><div class="ft">' + act('Edit rule') + act('Create a task', 'ink') + '</div>');
      }
      if (i === 2) {
        var box = el.querySelector('.sg-new'), tx = box.querySelector('.tx'), text = 'The customer asks to speak to a supervisor';
        box.classList.remove('done', 'found');
        /* the fourteen days are read: the preview's bars rise one day at a time and its count rises with them; the field's note has
           said its piece and leaves */
        var nb = fresh.querySelector('.ct b'); nb.textContent = '23';
        var found = function () { box.classList.add('found'); fresh.classList.add('in');
          if (ui.jump) { fresh.classList.add('q'); return; }
          nb.textContent = '0'; for (var k = 1; k <= 14; k++) (function (k) { later(function () { nb.textContent = Math.round(23 * k / 14); }, 900 + k * 45); })(k);
          /* a preview is checked before it is saved: the row opens on two of the calls it caught. Only then is the button pressed;
             it says so, the page counts eight signals and the tag turns from Preview to Active */
          later(function () { fresh.classList.add('q'); }, 2300);
          later(function () { sv.classList.add('press'); }, 5000);
          later(function () { sv.classList.add('saved'); sv.textContent = 'Saved'; nn.textContent = '8'; pt.className = 'sx-tag flip'; pt.textContent = 'Active'; }, 5350); };
        if (ui.jump) { tx.textContent = text; box.classList.add('done'); found(); }
        /* the field arrives empty and the frame arrives with it; only then is the sentence typed */
        else { tx.textContent = ''; later(function () { type(tx, text, function () { box.classList.add('done'); later(found, 1100); }); }, 1250); }
      }
    }
  };

  /* ---------- Demos ---------- */
  S.demos = {
    nav: 'Demos', icon: '<rect x="2.5" y="3.5" width="13" height="11" rx="2.4"/><path d="M7.6 6.8v4.4L11.4 9z"/>',
    steps: ['A demo is a script that drives the product’s own screens.', 'Opening one shows its steps, line by line.', 'Play runs the steps on the working screens.', 'The same script plays in Hebrew.'],
    build: function () {
      var D = [['Your September recap', 'The month as a story: volume, the topic that took over, the agent of the month.', '75 sec · 8 steps', ['Open Newsroom', 'Play the monthly recap', 'Count the calls']], ['The Monday loop', 'From an alert to a task to a closed loop, on one customer.', '40 sec · 6 steps', ['Open an alert', 'Create a task', 'Assign it']], ['The daily signal', 'A signal fires, the calls behind it open, a task is created.', '30 sec · 5 steps', ['Open Signals', 'Open the firing signal', 'Read a call']],
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
    tip: function (target, html, where, width) {
      tip.style.width = width ? width + 'px' : ''; tip.style.height = ''; tip.classList.remove('fill'); tip.innerHTML = html; tip.classList.add('on'); tip.style.left = tip.style.top = '0px';
      var a = target.getBoundingClientRect(), r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, x, y;
      if (where === 'left') { x = a.left - r.left - w - 14; y = a.top - r.top + a.height / 2 - h / 2; }
      else if (where === 'below') { x = a.right - r.left - w; y = a.bottom - r.top + 14; }
      else if (where === 'topright') { x = a.right - r.left - w; y = a.top - r.top - h - 14; }
      else { x = a.left - r.left + a.width / 2 - w / 2; y = a.top - r.top - h - 14; }
      var z = r.width / el.offsetWidth || 1; /* the stage is zoomed to fit: rects are in screen px, styles are not */
      x = x / z + w - w / z; y = where === 'below' ? (a.bottom - r.top) / z + 14 : where === 'left' ? y / z : (a.top - r.top) / z - h - 14;
      if (where !== 'below' && where !== 'topright' && where !== 'left') x = (a.left - r.left + a.width / 2) / z - w / 2; else if (where !== 'left') x = (a.right - r.left) / z - w;
      /* no room under the thing it points at: it goes above it, never over it */
      if (where === 'below' && y > el.offsetHeight - h - 20) y = (a.top - r.top) / z - h - 14;
      if (where === 'lefttop') { var pr = target.parentNode.getBoundingClientRect(); x = (a.left - r.left) / z - w - 14; y = (pr.top - r.top) / z + 2; }
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
