/* v7 - system: this section's behaviour. Loaded deferred, after the page's own scripts. */
/* The wall is drawn here as live components in the Hear look (the same rules as hear-v7/plan/studio.html), not as pictures.
   Three rows drift slowly; a row rests while the pointer or the keyboard is on it, and the whole wall rests off screen. All data is sample data. */
(function () {
  var kit = document.getElementById('ds-kit');
  if (!kit) return;
  var I = function (d) { return '<svg class="i" viewBox="0 0 18 18" aria-hidden="true">' + d + '</svg>'; };
  var IC = {
    grid: '<rect x="2.5" y="2.5" width="5.4" height="5.4" rx="1.2"/><rect x="10.1" y="2.5" width="5.4" height="5.4" rx="1.2"/><rect x="2.5" y="10.1" width="5.4" height="5.4" rx="1.2"/><rect x="10.1" y="10.1" width="5.4" height="5.4" rx="1.2"/>',
    list: '<path d="M3 5h12M3 9h12M3 13h8"/>', bars: '<path d="M3.5 15V9M9 15V3.5M14.5 15V7"/>', check: '<circle cx="9" cy="9" r="6.2"/><path d="M6.3 9.2l1.9 1.9 3.6-4"/>',
    wave: '<path d="M3 7.5v3M6 5v8M9 7v4M12 3.5v11M15 7.5v3"/>', book: '<path d="M3.5 3.5h8a2 2 0 0 1 2 2v9h-8a2 2 0 0 1-2-2zM3.5 12.5a2 2 0 0 1 2-2h8"/>',
    bolt: '<path d="M10 2.5 4 10h4.5L8 15.5 14 8H9.5z"/>', bell: '<path d="M4.5 12.5V8.2a4.5 4.5 0 0 1 9 0v4.3l1.2 1.5H3.3zM7.3 15.5a1.8 1.8 0 0 0 3.4 0"/>',
    help: '<circle cx="9" cy="9" r="6.5"/><path d="M7.2 7.2a1.9 1.9 0 1 1 2.6 1.8c-.5.3-.8.7-.8 1.3M9 12.7v.1"/>',
    set: '<path d="M3 5.5h6.5M12.5 5.5H15M3 12.5h2.5M8.5 12.5H15"/><circle cx="11" cy="5.5" r="1.5"/><circle cx="7" cy="12.5" r="1.5"/>',
    plus: '<path d="M9 3.5v11M3.5 9h11"/>', chev: '<path d="M5 7.5l4 4 4-4"/>', at: '<circle cx="9" cy="9" r="2.6"/><path d="M11.6 6.6v3.2a1.7 1.7 0 0 0 3.4 0V9a6 6 0 1 0-2.4 4.8"/>',
    mic: '<rect x="6.6" y="2.2" width="4.8" height="8.4" rx="2.4"/><path d="M3.8 8.6a5.2 5.2 0 0 0 10.4 0M9 13.8v2.2"/>', up: '<path d="M9 14V4.5M4.8 8.4 9 4.2l4.2 4.2"/>',
    search: '<circle cx="8" cy="8" r="4.6"/><path d="M11.6 11.6 15 15"/>', share: '<path d="M9 11V3M6 5.6 9 2.6l3 3M4 9.5v4.2h10V9.5"/>'
  };
  var MARK = '<svg class="mk" viewBox="0 0 69 60" aria-hidden="true"><path d="M63.6202 25.6905C66.431 26.6546 69 26.1754 69 28.5414C69 30.9074 65.4639 29.2245 61.4139 32.459C57.364 35.6935 56.1551 40.0061 53.4954 45.4868C50.8357 50.9675 46.5138 61.4496 39.1091 59.8324C31.7043 58.2151 34.2129 46.1157 34.0618 41.1741C33.9106 36.2325 33.2457 32.5189 29.2865 32.0696C25.3272 31.6204 23.0302 34.6153 20.7332 38.2391C18.4363 41.863 16.502 49.3802 11.0315 47.7629C5.5611 46.1457 9.3088 36.1726 7.46518 33.2077C5.62155 30.2427 3.17346 30.1886 2.29698 30.1886C1.4205 30.1886 8.16629e-06 29.7394 0 28.5714C-8.16629e-06 27.4033 1.26938 27.0739 2.29698 27.0739C3.32457 27.0739 4.60326 27.2375 7.19317 26.5291C13.6307 24.7681 12.8147 11.2251 20.1288 11.5845C27.0146 11.9229 23.4533 26.0798 30.0118 26.0798C36.5703 26.0798 38.7464 18.5027 41.4665 12.8424C44.1866 7.18205 49.4152 -1.32349 56.1551 0.173941C62.8949 1.67137 60.5677 14.1302 60.1445 18.0535C59.7214 21.9768 60.8095 24.7264 63.6202 25.6905Z"/></svg>';
  var av = function (t, on) { return '<i class="dk-av' + (on ? ' on' : '') + '">' + t + '</i>'; };
  var bars = function (a) { return '<span class="dk-bars">' + a.map(function (v) { return '<i class="' + (v < 40 ? 'l1' : v < 60 ? 'l3' : 'l5') + '" style="height:' + v + '%"></i>'; }).join('') + '</span>'; };
  var cell = function (v) { return '<i class="dk-cell ' + (v < 60 ? 'l1' : v < 70 ? 'l3' : '') + '">' + v + '</i>'; };
  var task = function (t, who, tag) { return '<div class="dk-task"><small>From Compliance</small><b>' + t + '</b><footer>' + av(who) + '<span class="dk-tag">' + tag + '</span></footer></div>'; };
  var note = function (ic, t, s, un) { return '<div class="dk-note"><i class="ic">' + I(IC[ic]) + '</i><span><b>' + t + '</b><small>' + s + '</small></span>' + (un ? '<em></em>' : '') + '</div>'; };
  var nv = function (ic, t, cls) { return '<span class="dk-nv' + (cls ? ' ' + cls : '') + '">' + I(IC[ic]) + t + '</span>'; };
  var seg = function (a, on) { return '<span class="dk-seg" role="group">' + a.map(function (t, i) { return '<button type="button" aria-pressed="' + (i === on) + '">' + t + '</button>'; }).join('') + '</span>'; };

  /* [name, state, width, markup, sky?] */
  var ROWS = [
    ['Foundations & Atoms', 39, [
      ['Type', 'Byrd', 230, '<div class="dk-type"><b>Aa</b><span><i style="font-weight:400">Regular</i><i style="font-weight:500">Medium</i><i style="font-weight:600">SemiBold</i></span></div>'],
      ['Color', 'Score scale', 300, '<div class="dk-scale"><i class="l1">54</i><i class="l2">62</i><i class="l3">71</i><i class="l4">78</i><i class="l5">91</i></div>'],
      ['Button', 'Primary', 190, '<button type="button" class="dk-btn ink">' + I(IC.plus) + 'New app</button>'],
      ['Button', 'Secondary', 300, '<div class="dk-rowx"><button type="button" class="dk-btn">Last 30 days' + I(IC.chev) + '</button><button type="button" class="dk-btn">Share</button></div>'],
      ['Chip', 'Filter', 300, '<div class="dk-rowx"><button type="button" class="dk-chip" aria-pressed="true">All</button><button type="button" class="dk-chip" aria-pressed="false">Open <b>8</b></button><button type="button" class="dk-chip" aria-pressed="false">Mine</button></div>'],
      ['Tag', 'Status', 250, '<div class="dk-rowx"><span class="dk-tag ink">Surging</span><span class="dk-tag blue">Rising</span><span class="dk-tag">Steady</span></div>'],
      ['Avatar', 'Initials', 190, '<div class="dk-rowx tight">' + av('MC', 1) + av('DB') + av('RC') + av('+4') + '</div>'],
      ['Segmented control', 'Three options', 370, seg(['Most calls', 'Lowest score', 'Biggest drop'], 0)],
      ['Switch', 'On and off', 170, '<div class="dk-rowx"><button type="button" class="dk-sw" role="switch" aria-checked="true" aria-label="Sample switch"></button><button type="button" class="dk-sw" role="switch" aria-checked="false" aria-label="Sample switch"></button></div>'],
      ['Iconography', 'Navigation', 300, '<div class="dk-icons">' + ['grid', 'list', 'bars', 'check', 'wave', 'book', 'bolt', 'bell', 'help', 'set'].map(function (k) { return '<i>' + I(IC[k]) + '</i>'; }).join('') + '</div>'],
      ['Field', 'Search', 280, '<label class="dk-field">' + I(IC.search) + '<input type="text" placeholder="Search calls" aria-label="Sample search field"></label>'],
      ['Badge', 'Count', 150, '<div class="dk-rowx"><b class="dk-badge">2</b><b class="dk-dot"></b></div>']
    ]],
    ['Molecules', 22, [
      ['Navigation item', 'Three states', 270, '<div class="dk-side">' + nv('wave', 'Conversations') + nv('book', 'Knowledge', 'hv') + nv('grid', 'Topics', 'on') + '</div>', 1],
      ['Stat', 'With change', 250, '<div class="dk-kpi"><small>Sales without alerts</small><b>72.6<i>%</i></b><span>▲ 2.1 pts against the 6 weeks before</span></div>'],
      ['Chat bubble', 'Question', 320, '<p class="dk-you">Which calls pulled Selma’s Vulnerable customer protocol score down?</p>'],
      ['Chat bubble', 'Answer', 340, '<div class="dk-ai">' + MARK + '<p><b>12 calls</b> failed, and 9 of them share one cause: the customer said they were struggling to pay and the protocol questions were skipped.</p></div>'],
      ['Chat bubble', 'Thinking', 220, '<div class="dk-ai">' + MARK + '<span class="dk-think"><i></i><i></i><i></i></span></div>'],
      ['Score row', 'Thirty days', 380, '<div class="dk-srow"><b>Trip Status</b>' + bars([62, 60, 66, 64, 61, 68, 70, 63, 59, 64, 66, 69, 71, 65, 62, 60, 58, 63, 66, 68, 64, 61, 63, 65]) + '<small>▼ 5 pts</small><em>63</em></div>'],
      ['Heatmap row', 'Only failing scores take color', 450, '<div class="dk-hrow"><b>Fee disclosure</b>' + [85, 90, 67, 100, 87, 54].map(cell).join('') + '</div>'],
      ['Story', 'With status', 360, '<div class="dk-story"><span><b>“Cancellation intent” is surging past its 30-day baseline</b><small>Signal · 240% over baseline · 4:12 pm</small></span><span class="dk-tag ink">Surging</span></div>'],
      ['Task card', 'Open', 270, task('Recording disclosure missing in the first 30 seconds', 'PN', 'Open')],
      ['Notification', 'Unread', 320, note('check', 'Fee disclosure fell to 88%', 'Compliance review · yesterday', 1)],
      ['Legend', 'Score', 360, '<div class="dk-key"><i></i><span>70 and up</span><i class="l3"></i><span>60–69</span><i class="l1"></i><span>under 60</span></div>']
    ]],
    ['Organisms', 28, [
      ['Composer', 'Write and send', 430, '<div class="dk-glass"><form class="dk-cmp"><input type="text" value="Which calls pulled the score down?" placeholder="Ask about your calls" aria-label="Sample question"><footer>' + I(IC.at) + I(IC.list) + '<span></span>' + I(IC.mic) + '<button type="submit" aria-label="Send">' + I(IC.up) + '</button></footer></form></div>', 1],
      ['Sidebar', 'Workspace', 270, '<div class="dk-side"><span class="dk-org"><b>N</b>Northwind</span><button type="button" class="dk-btn ink wide">' + I(IC.plus) + 'New app</button>' + nv('grid', 'Evaluation by agent', 'on') + nv('list', 'Disclosure review') + nv('bars', 'Handle time by team') + '</div>', 1],
      ['Notifications', 'Popover', 350, '<div class="dk-pop"><header><b>Notifications</b><span>Mark all as read</span></header>' + note('list', '3 new calls to review', 'Disclosure review · 2 h ago', 1) + note('check', 'Fee disclosure fell to 88%', 'Compliance review · yesterday', 1) + note('bars', 'Team Delta over target for 3 days', 'Handle time by team · 2 days ago') + '</div>', 1],
      ['Stat band', 'Three stats', 520, '<div class="dk-kpis"><div class="dk-kpi"><small>Calls</small><b>22,150</b><span>across 13 topics</span></div><div class="dk-kpi"><small>Average score</small><b>51</b><span>out of 100</span></div><div class="dk-kpi"><small>New topics</small><b>4</b><span>first seen this month</span></div></div>'],
      ['Heatmap', 'Criteria by agent', 440, '<div class="dk-heat">' + [['Fee disclosure', [85, 90, 67, 100, 87]], ['Consent to continue', [81, 72, 87, 89, 65]], ['Identity verification', [90, 89, 76, 100, 75]], ['Vulnerable customer', [88, 70, 72, 61, 54]]].map(function (r) { return '<div class="dk-hrow"><b>' + r[0] + '</b>' + r[1].map(cell).join('') + '</div>'; }).join('') + '</div>'],
      ['Board column', 'Open tasks', 320, '<div class="dk-col"><h5>Open<i>5</i></h5>' + task('Recording disclosure missing in the first 30 seconds', 'PN', 'Compliance') + task('Identity verification skipped before a ticket change', 'DB', 'Compliance') + '</div>'],
      ['Ask AI', 'Side sheet', 360, '<div class="dk-sheet"><header>' + MARK + '<b>Ask AI</b><span>Selma K.</span></header><p class="dk-you">Which calls pulled the score down?</p><p class="dk-say"><b>12 calls</b> failed, and 9 share one cause.</p><ul><li><b>Oct 9</b>Customer mentions a missed payment at 02:14.</li><li><b>Oct 7</b>Says the rent is due tomorrow. The sale continues.</li></ul></div>']
    ]]
  ];

  var rowsEl = kit.querySelector('.dk-rows');
  rowsEl.innerHTML = ROWS.map(function (r, n) {
    var tiles = r[2].map(function (t) {
      return '<li class="dk-t' + (t[4] ? ' sky' : '') + '" data-k="' + t[0] + ' ' + t[1] + '" style="--w:' + t[2] + 'px"><div class="dk-c">' + t[3] + '</div><p class="dk-n"><b>' + t[0] + '</b>' + t[1] + '</p></li>';
    }).join('');
    return '<div class="dk-row' + (n === 0 ? ' short' : n === 1 ? ' rev' : ' tall') + '" role="group" aria-label="' + r[0].replace('&', 'and') + ', ' + r[1] + ' stories"><p class="dk-lab"><b>' + r[0].replace('&', '&amp;') + '</b><span>' + r[1] + '</span></p>' +
      '<div class="dk-strip"><div class="dk-track"><ul class="dk-list">' + tiles + '</ul></div></div></div>';
  }).join('');

  /* The components answer: a chip, a segment or a switch changes when pressed. */
  kit.addEventListener('click', function (e) {
    var b = e.target.closest('.dk-seg button, .dk-chip, .dk-sw'); if (!b) return;
    if (b.classList.contains('dk-sw')) { b.setAttribute('aria-checked', b.getAttribute('aria-checked') !== 'true'); return; }
    [].forEach.call(b.parentElement.children, function (x) { if (x.hasAttribute('aria-pressed')) x.setAttribute('aria-pressed', x === b); });
  });

  /* The composer sends: the question lands in the Question bubble, Thinking wakes, the Answer writes itself. */
  var ANSWER = '<b>12 calls</b> failed, and 9 of them share one cause: the customer said they were struggling to pay and the protocol questions were skipped.';
  var busy = [];
  var tiles = function (k) { return [].filter.call(kit.querySelectorAll('.dk-t'), function (t) { return t.getAttribute('data-k') === k; }); };
  var lit = function (k, on) { tiles(k).forEach(function (t) { t.classList.toggle('lit', on); }); };
  var later = function (fn, ms) { busy.push(setTimeout(fn, ms)); };
  function send(form) {
    var input = form.querySelector('input'), text = input.value.trim(); if (!text) return;
    busy.forEach(clearTimeout); busy = [];
    ['Chat bubble Question', 'Chat bubble Thinking', 'Chat bubble Answer'].forEach(function (k) { lit(k, false); });
    [].forEach.call(kit.querySelectorAll('.dk-cmp input'), function (x) { x.value = ''; x.placeholder = 'Sent. Watch the chat bubbles in Molecules.'; });
    tiles('Chat bubble Question').forEach(function (t) { t.querySelector('.dk-you').textContent = text; });
    var ans = tiles('Chat bubble Answer').map(function (t) { return t.querySelector('p'); });
    ans.forEach(function (p) { p.style.opacity = .25; });
    lit('Chat bubble Question', true);
    later(function () { lit('Chat bubble Question', false); lit('Chat bubble Thinking', true); }, 1100);
    later(function () {
      lit('Chat bubble Thinking', false); lit('Chat bubble Answer', true);
      var plain = ANSWER.replace(/<[^>]+>/g, ''), n = 0;
      (function type() { n += 3; ans.forEach(function (p) { p.style.opacity = 1; p.textContent = plain.slice(0, n); }); if (n < plain.length) later(type, 22); else ans.forEach(function (p) { p.innerHTML = ANSWER; }); })();
    }, 2700);
    later(function () { lit('Chat bubble Answer', false); [].forEach.call(kit.querySelectorAll('.dk-cmp input'), function (x) { x.placeholder = 'Ask about your calls'; }); }, 7200);
  }
  kit.addEventListener('submit', function (e) { var f = e.target.closest('.dk-cmp'); if (f) { e.preventDefault(); send(f); } });

  /* The head is one quiet sentence. The two controls (the corner token, and the pause) sit under the wall, small, on one line
     (owner, 22.11.2026: the head "looked like a war": a count, a sentence, swatches, a switch and a button side by side). */
  var head = kit.querySelector('.dk-head'), pause = kit.querySelector('.dk-pause');
  var foot = document.createElement('div'); foot.className = 'dk-foot';
  var tok = document.createElement('div'); tok.className = 'dk-tok';
  tok.innerHTML = '<span id="dk-corner-l">Corner token</span><span class="dk-seg" role="group" aria-labelledby="dk-corner-l"><button type="button" data-corner="" aria-pressed="true">Pill</button><button type="button" data-corner="soft" aria-pressed="false">Soft</button></span>';
  /* owner, 22.11.2026 night: "not needed, it just loads the page": the row is not added; the pause stays out of sight. */
  if (pause) pause.hidden = true;
  if (head) head.innerHTML = '<p class="dk-line"><b>122</b> stories in <b>6</b> tiers. Real components, not pictures: press a chip, flip a switch, send a question.</p>';
  tok.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    kit.classList.toggle('soft', b.getAttribute('data-corner') === 'soft');
  });

  /* Drift: with a mouse and motion allowed, each row loops; otherwise the rows are swiped by hand. */
  var can = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn = pause;
  if (can) {
    [].forEach.call(kit.querySelectorAll('.dk-track'), function (tr) {
      var list = tr.firstElementChild, copy = list.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      [].forEach.call(copy.querySelectorAll('button, input'), function (x) { x.tabIndex = -1; });
      tr.appendChild(copy);
      tr.style.setProperty('--dur', Math.max(70, Math.round(list.scrollWidth / 34)) + 's');
    });
    kit.classList.add('moving');
    var hinted = false;
    new IntersectionObserver(function (es) {
      kit.classList.toggle('run', es[0].isIntersecting);
      /* once, on arrival, a switch and a chip move by themselves: the tiles are not pictures */
      if (es[0].isIntersecting && !hinted) { hinted = true;
        setTimeout(function () { [].forEach.call(kit.querySelectorAll('.dk-sw[aria-checked="false"]'), function (x) { x.setAttribute('aria-checked', 'true'); }); }, 1500);
        setTimeout(function () { [].forEach.call(kit.querySelectorAll('.dk-row .dk-chip:nth-child(2)'), function (x) { x.click(); }); }, 2500);
      }
    }, { rootMargin: '120px 0px' }).observe(kit);
    if (btn) {
      btn.hidden = false;
      btn.addEventListener('click', function () {
        var off = kit.classList.toggle('stopped');
        btn.setAttribute('aria-pressed', off); btn.querySelector('.dk-pt').textContent = off ? 'Play motion' : 'Pause motion';
      });
    }
  }
})();
