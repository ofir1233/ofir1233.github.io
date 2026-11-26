/* Explain mode of the Evaluation by agent app: studio.html?app=eval&explain=1 (loaded by studio.html only under that flag).
   For the portfolio's Explainable scores case. The key decision, built for real: a click on a score opens a card that answers the
   first two questions for free (is it really bad? is it the agent or the team?), and only a second, deliberate click, Explore in Chat,
   asks the AI for the calls. Before that the calls section says so, in one quiet line. SAMPLE DATA: the studio's own.
   When at least half of the agents shown are under the pass mark on the score's criterion, the card says so (it may be the process, not the
   agent) and Explore in Chat asks about the criterion across the team. The page drives it with window.hearExplain.step(n): 0 the grid,
   1 the scores under the pass mark, 2 the card on the lowest score of the lowest criterion (Selma's Compliance 58, where 5 of 8 agents are
   under 70), 3 the calls and the answer. */
(function () {
  const app = document.querySelector('.app .card'), view = document.querySelector('.appv[data-v="eval"]'), hm = document.getElementById('hm');
  const ev = view.querySelector('.ev'), tb = document.getElementById('evl');
  if (!app || !hm || !ev) return;
  /* the portfolio's case (explain=1) also folds the sidebar to a rail and plays its steps; the Studio on its own keeps its layout */
  const story = new URLSearchParams(location.search).has('explain');
  stage.classList.add('xp'); if (story) stage.classList.remove('is-rail');
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const z = () => parseFloat(stage.style.zoom) || 1;
  const cells = () => [...hm.querySelectorAll('td[data-a]')];
  const first = n => n.split(' ')[0];
  const ord = k => k + (k % 10 === 1 && k !== 11 ? 'st' : k % 10 === 2 && k !== 12 ? 'nd' : k % 10 === 3 && k !== 13 ? 'rd' : 'th');

  // the calls section starts empty: no fake rows until someone asks
  const hint = document.createElement('p'); hint.className = 'xp-hint'; hint.textContent = 'Pick a score, then Explore in Chat to see the calls behind it.';
  ev.appendChild(hint);
  const origPick = pick, origFill = fillCalls;
  // the portfolio's one sample call, followed through four screens (Topics, here, Workflows, Newsroom): on Oct 13 a customer who cannot
  // afford to rebook asks twice for a refund and is offered a voucher. It is the lowest of the calls behind Selma's Compliance score, so it
  // takes the first row; the rest stay the studio's own, and the answer in the chat counts them as they are
  const origCalls = callsFor, OCT13 = { reason: 'Refund request', d: 'Oct 13', len: '6:12', mom: '1:48', s: 29, miss: true, find: 'Vulnerability protocol skipped' };
  if (story) callsFor = function (agent, crit, v, n) { const out = origCalls(agent, crit, v, n);
    if (agent === 'Selma Kaya' && crit === 'Compliance' && out.length) out[0] = Object.assign({}, OCT13);
    return out; };
  let explored = null, pop = null, popCell = null, said = [], thinkT = 0;
  // the studio refits the calls on resize and on showing the app: here only once they were asked for, for that score
  fillCalls = function (td) { if (td && td === explored) origFill(td); };
  function empty() { explored = null; ev.classList.add('xp-empty'); tb.innerHTML = '';
    ['evt', 'evs', 'eva'].forEach(id => { document.getElementById(id).textContent = ''; }); }
  function clearChat() { clearTimeout(thinkT); said.forEach(d => d.remove()); said = []; }
  function select(td) { hm.querySelectorAll('td.sel').forEach(x => x.classList.remove('sel')); if (td) td.classList.add('sel'); }

  // what the card says, all from the grid: the criterion's scores across the agents shown
  function facts(td) {
    const ci = CRIT.indexOf(td.dataset.c), v = +td.dataset.v, all = rows.map(r => r.s[ci]), n = all.length;
    const mean = avg(all), better = all.filter(x => x > v).length, rank = better + 1, lo = Math.min(50, Math.floor(Math.min(...all) / 10) * 10);
    const nb = Math.round((100 - lo) / 10), bins = Array(nb).fill(0), bin = x => Math.min(nb - 1, Math.floor((x - lo) / 10));
    all.forEach(x => bins[bin(x)]++);
    return { a: td.dataset.a, c: td.dataset.c, ci, v, n, mean, rank, lo, nb, bins, me: bin(v), low: Math.min(...all), high: Math.max(...all), team: teamLow(ci),
      rankText: rank === 1 ? `Highest of ${n} agents` : !all.some(x => x < v) ? `Lowest of ${n} agents` : `${ord(rank)} of ${n} agents` };
  }
  function openPop(td) {
    closePop(); const f = facts(td), d = f.v - f.mean, mx = Math.max(...f.bins), at = (f.mean - f.lo) / (100 - f.lo) * 100;
    pop = document.createElement('div'); pop.className = 'xp-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', `${f.a}, ${f.c}, ${f.v}`);
    pop.innerHTML = `<button type="button" class="xp-x" aria-label="Close">×</button><strong>${f.a}</strong><span class="xp-sub">${f.c} · last 30 days</span>`
      + `<div class="xp-head"><b class="xp-chip ${band(f.v)}">${f.v}</b><div><b class="${d < 0 ? 'dn' : d > 0 ? 'up' : ''}">${d === 0 ? 'At the team average' : (d < 0 ? '−' : '+') + Math.abs(d) + ' vs team average'}</b><span>${f.rankText}</span></div></div>`
      + `<small class="xp-lbl">Across all ${f.n} agents</small>`
      + `<div class="xp-hist" aria-hidden="true">${f.bins.map((c, k) => `<i class="${(f.lo + k * 10 < PASS ? 'lo ' : '') + (k === f.me ? 'me' : '')}" style="height:${c ? Math.max(8, c / mx * 100) : 0}%"></i>`).join('')}<b class="avg" style="left:${at.toFixed(1)}%"></b></div>`
      + `<div class="xp-ax"><span>Low ${f.low}</span><span class="mid" style="left:${Math.max(32, Math.min(68, at)).toFixed(1)}%">Team avg ${f.mean}</span><span>High ${f.high}</span></div>`
      + (f.team ? `<p class="xp-team">${f.team} of ${f.n} agents are under ${PASS} on ${f.c}. It may be the process, not the agent.</p>`
        + `<p class="xp-note">Opens Chat, which looks across the team’s calls on ${f.c}. Nothing extra loads until you click.</p>`
        : `<p class="xp-note">Opens Chat, which looks up this agent’s calls. Nothing extra loads until you click.</p>`)
      + `<button type="button" class="xp-go">Explore in Chat</button><button type="button" class="xp-link">Open agent evaluation</button>`;
    app.appendChild(pop); popCell = td; place();
    pop.querySelector('.xp-x').addEventListener('click', () => { closePop(); td.focus && td.focus(); });
    pop.querySelector('.xp-go').addEventListener('click', () => explore(td, !calm));
    pop.querySelector('.xp-link').addEventListener('click', () => { const tr = td.closest('tr'); closePop();
      stage.classList.remove('xp-low'); hm.querySelectorAll('tr.xp-on').forEach(x => x.classList.remove('xp-on')); tr.classList.add('xp-on'); stage.classList.add('xp-row'); });
  }
  // beside the score, inside the app card: below it if there is room, else above, else to the side
  function place() {
    if (!pop || !popCell) return; const k = z(), cr = app.getBoundingClientRect(), r = popCell.getBoundingClientRect();
    const W = app.clientWidth, H = app.clientHeight, st = app.scrollTop, pw = pop.offsetWidth, ph = pop.offsetHeight, g = 10, m = 12;
    const L = (r.left - cr.left) / k, T = (r.top - cr.top) / k + st, R = (r.right - cr.left) / k, B = (r.bottom - cr.top) / k + st;
    let x = Math.max(m, Math.min(W - pw - m, (L + R) / 2 - 44)), y;
    if (B + g + ph <= st + H - m) y = B + g;
    else if (T - g - ph >= st + m) y = T - g - ph;
    else { y = Math.max(st + m, Math.min(st + H - ph - m, (T + B) / 2 - ph / 2)); x = R + g + pw <= W - m ? R + g : Math.max(m, L - g - pw); }
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
  }
  function closePop() { if (pop) pop.remove(); pop = null; popCell = null; }

  // the second, deliberate click: the calls behind the score, and the question and its answer in the conversation
  function explore(td, slow) {
    closePop(); clearChat(); stage.classList.remove('xp-low', 'xp-row');
    explored = td; ev.classList.remove('xp-empty'); origPick(td);      // the studio's own: selects, titles the section, fills as many calls as fit
    const n = tb.children.length, list = callsFor(td.dataset.a, td.dataset.c, td.dataset.v, n), miss = list.filter(r => r.miss);
    const by = {}; miss.forEach(r => { by[r.find] = (by[r.find] || 0) + 1; });
    const top = Object.entries(by).sort((a, b) => b[1] - a[1])[0], who = first(td.dataset.a) + '’s ' + td.dataset.c;
    const ci = CRIT.indexOf(td.dataset.c), team = teamLow(ci), cAvg = avg(rows.map(r => r.s[ci]));
    // most of the team under the pass mark: the question is about the criterion across the team, and the answer says only what the grid shows
    const q = team ? `Why are ${team} of ${rows.length} agents under ${PASS} on ${td.dataset.c}?`
      : miss.length ? `Which calls pulled ${who} down to ${td.dataset.v}?` : `Which calls are behind ${who} score of ${td.dataset.v}?`;
    const ans = team ? `<p>It isn’t only ${first(td.dataset.a)}: ${team} of the ${rows.length} agents are under ${PASS} on ${td.dataset.c}, so start with the process.`
        + (top && top[1] > 1 ? ` In ${first(td.dataset.a)}’s calls the most common miss is <strong>${top[0].charAt(0).toLowerCase() + top[0].slice(1)}</strong>, on ${top[1]} of ${n}.` : '') + `</p>`
      : !miss.length ? `<p>All ${n} calls in the table met it. The lowest scored ${list[0].s}.</p>`
      : top[1] > 1 ? `<p><strong>${top[0]}</strong> on ${top[1]} of the ${n} calls in the table.</p>`
      : `<p>Each low call missed something different. The lowest: <strong>${list[0].find.charAt(0).toLowerCase() + list[0].find.slice(1)}</strong>.</p>`;
    const qd = say('you xp-said', ''); qd.textContent = q; said.push(qd);
    if (!slow) { said.push(say('it xp-said', ans)); return; }
    const p = say('it think xp-said', '<span class="dots" aria-label="Thinking"><i></i><i></i><i></i></span>'); said.push(p);
    thinkT = setTimeout(() => { p.classList.remove('think'); p.innerHTML = ans; msgs.scrollTop = msgs.scrollHeight; }, 900);
  }

  // a click on a score: select it and open its card; the calls wait for Explore in Chat
  pick = function (td) {
    stage.classList.remove('xp-low', 'xp-row'); hm.querySelectorAll('tr.xp-on').forEach(x => x.classList.remove('xp-on'));
    if (td !== explored) { empty(); clearChat(); }
    select(td); openPop(td);
  };
  addEventListener('pointerdown', e => { if (pop && !pop.contains(e.target) && !e.target.closest('#hm td[data-a]')) closePop(); }, true);
  addEventListener('keydown', e => { if (e.key === 'Escape' && pop) { const c = popCell; closePop(); if (c) c.focus && c.focus(); } });
  addEventListener('resize', () => requestAnimationFrame(place));

  // the page's steps: each one a whole state, so scrolling back and forth always lands the same way
  const focus = () => [...hm.querySelectorAll(`td[data-c="${byCrit[0][0]}"]`)].sort((a, b) => a.dataset.v - b.dataset.v)[0];      // the lowest score of the lowest criterion
  function reset() { closePop(); clearChat(); select(null); empty(); stage.classList.remove('xp-low', 'xp-row'); hm.querySelectorAll('tr.xp-on').forEach(x => x.classList.remove('xp-on')); }
  function step(n) {
    reset();
    if (n === 1) stage.classList.add('xp-low');
    if (n === 2) { const td = focus(); select(td); openPop(td); }
    if (n === 3) explore(focus(), false);
  }
  // the part of the screen each step is about, in this window's pixels; narrow = a phone's stage, so a tighter crop
  const R = el => el && el.getBoundingClientRect();
  const join = (list, pad) => { list = list.filter(Boolean); if (!list.length) return null;
    const x = Math.min(...list.map(r => r.left)) - pad, y = Math.min(...list.map(r => r.top)) - pad, x2 = Math.max(...list.map(r => r.right)) + pad, y2 = Math.max(...list.map(r => r.bottom)) + pad;
    return { x, y, w: x2 - x, h: y2 - y }; };
  function rect(n, narrow) {
    const k = z(), pad = 12 * k, row1 = hm.rows[1], key = view.querySelector('.key');
    if (n === 0) return narrow ? join([R(hm.rows[0].cells[0]), R(hm.rows[hm.rows.length - 1].cells[0]), R(row1.cells[3])], pad) : join([R(view.querySelector('.top') || hm), R(hm), R(key)], pad);
    if (n === 1) { const low = [...hm.querySelectorAll('td.b1, td.b2')].map(R);
      return narrow ? join([R(hm.rows[0].cells[0]), R(hm.rows[hm.rows.length - 1].cells[0]), ...low, R(key.querySelector('.key__pass'))], pad) : join([R(hm), R(key)], pad); }
    if (n === 2) { const c = popCell || focus(); return join([R(pop), R(c), narrow ? null : R(c.closest('tr').cells[0])], pad * 1.5); }
    if (n === 3) return narrow ? join(said.map(R), pad * 1.5) : join([R(ev)], pad);
    return join([R(app)], 0);
  }
  empty(); select(null);
  // the app's paper card, in this window's pixels: the page's camera never shows past it
  const bounds = () => { const r = app.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
  window.hearExplain = { step, rect, bounds, ready: true };
  try { parent.postMessage({ hearExplain: 'ready' }, location.origin); } catch (e) {}
})();
