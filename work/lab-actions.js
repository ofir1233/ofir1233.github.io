// Actions board: hover a card, filter to High priority, open a task, tick an item, move it to In progress,
// @mention a teammate and post, then scroll the panel to the thread and the activity log.
(() => {
  if (!window.LX) return;
  const { ic, prio, av } = LX;
  const SRC = { alert: ['alert', 'Alert'], call: ['phone', 'Call'], eval: ['shield', 'Agent evaluation'], signal: ['pulse', 'Signal'], form: ['doc', 'Feedback form'] };
  const PR = { 3: 'High', 2: 'Medium', 1: 'Low' };
  const TAG = { esc: ['fwd', 'Escalated'], res: ['check', 'Resolved'], dup: ['copy', 'Duplicate'], na: ['ban', 'Not actionable', 'dark'] };
  // [id, priority, source, date, title, body, mentions-you comments, tag, [initials, name], counters]
  const CARDS = {
    P1: [3, 'alert', 'Today', 'Customer asked twice for a refund, was offered only a voucher', 'Cancelled JFK–LHR flight. The customer requested a cash refund twice; the agent offered a voucher both times and did not log the request.', 3, 0, ['DB', 'Daniel Brooks'], [['sqcheck', '0/2', 'ai'], ['msg', '3', 'cm'], ['clip', '1']]],
    P2: [2, 'call', 'Yesterday', 'Reason for Call tagged as Billing — should be Service outage', '<b>@AI,</b> the Reason for Call parameter is tagged incorrectly. This was a service…', 0, 0, ['MC', 'Maya Collins'], [['msg', '2']]],
    P3: [3, 'eval', 'Yesterday', 'Recording disclosure missing in the first 30 seconds', 'Agent evaluation flagged the call: the mandatory recording disclosure was nev…', 0, 0, null, [['sqcheck', '0/1']]],
    P4: [2, 'signal', 'Oct 10', 'Callback promised within 24 hours', 'The agent promised to call the customer back about a seat change; the signal fire…', 1, 0, ['SC', 'Sofia Cruz'], [['sqcheck', '1/3'], ['msg', '1']]],
    P5: [1, 'call', 'Oct 9', 'Great de-escalation — use in coaching', '<b>@JonahStone</b> great example of de-', 0, 0, false],
    I1: [3, 'alert', 'Oct 10', 'Technical failure blocked a booking', 'The booking engine timed out at payment; the customer could not…', 5, 0, ['RC', 'Ryan Cole'], [['sqcheck', '2/4'], ['msg', '5'], ['clip', '2']]],
    I2: [3, 'eval', 'Oct 9', 'Identity verification skipped before a ticket change', 'The agent changed the passenger name without verifying identity. Compliance…', 0, 0, ['PN', 'Paula Nunes'], [['sqcheck', '1/2'], ['msg', '2']]],
    I3: [2, 'call', 'Oct 8', 'Seat upgrade charged twice', 'Customer was charged twice for a business upgrade. The agent opened a…', 0, 0, ['AW', 'Alex Ward'], [['sqcheck', '1/1'], ['msg', '4'], ['clip', '1']]],
    I4: [2, 'alert', 'Oct 7', 'Unusual silence time on Trip Status calls', 'Silence time averaged 16% this week, double the usual. Agents wait on the…', 0, 0, false],
    D1: [2, 'alert', 'Oct 5', 'Lost baggage claim escalated to the ground team', 'Claim reference passed to the ground team; the customer received the bag the…', 0, 'esc', ['SC', 'Sofia Cruz'], [['sqcheck', '2/2'], ['msg', '3'], ['clip', '1']]],
    D2: [1, 'call', 'Oct 4', 'Re-analyze sentiment on a VIP escalation', 'Sentiment was re-analyzed after the transcript was corrected; the call now…', 0, 'res', ['MC', 'Maya Collins'], [['sqcheck', '1/1'], ['msg', '1']]],
    C1: [2, 'alert', 'Oct 10', 'Duplicate: booking engine timeout', 'Same incident as an earlier task. Closed as a duplicate.', 0, 'dup', ['RC', 'Ryan Cole'], [['msg', '1']]],
    C2: [1, 'form', 'Sep 30', 'Feedback form: website search is slow', 'Customer feedback about the website search. Not a contact-center issue.', 0, 'na', null, [['clip', '1']]],
  };
  const card = id => {
    const [p, src, date, title, body, men, tag, who, cnt] = CARDS[id];
    const [si, sl] = SRC[src];
    const tg = tag && TAG[tag];
    return `<article class="cd wrap" data-id="${id}" data-p="${p}">
      <div class="cd-m"><span class="cd-p p${p}">${prio(p)}${PR[p]}</span><span class="cd-s">${ic(si)}<span>${sl}</span><i>·</i><span>${date}</span></span></div>
      <h4 class="cd-t">${title}</h4><p class="cd-b">${body}</p>
      ${men ? `<div class="cd-x">${ic('at')}<b>Mentions you</b><span>· <span class="n">${men}</span> ${men === 1 ? 'comment' : 'comments'}</span></div>` : ''}
      ${tg ? `<span class="cd-g ${tg[2] || ''}">${ic(tg[0])}${tg[1]}</span>` : ''}
      ${who === false ? '' : `<div class="cd-f">${who ? av(who[0]) + `<b>${who[1]}</b>` : av('') + '<b class="none">Not assigned</b>'}<span class="cd-c">${(cnt || []).map(([i, v, k]) => `<span${k ? ` data-k="${k}"` : ''}>${ic(i)}<span>${v}</span></span>`).join('')}</span></div>`}
      <span class="cd-tb">${ic('play')}<i></i>${ic('archive')}</span>
    </article>`;
  };
  const col = (k, cls, name, n, meta, ids, more, extra = '') => `<section class="col ${cls}" data-col="${k}" style="left:${{ pe: 273, ip: 564, dn: 855, ca: 1146 }[k]}px">
    <div class="col-h"><b>${name}</b><em>${n}</em><small>${meta}</small>${ic('more')}</div>
    <div class="col-l">${extra}${ids.map(card).join('')}${more ? `<div class="cl-more">${more}</div>` : ''}</div></section>`;
  const PEOPLE = [['AW', 'Alex Ward', 1], ['RC', 'Ryan Cole'], ['PN', 'Paula Nunes'], ['JS', 'Jonah Stone'], ['SC', 'Sofia Cruz'], ['MW', 'Milo West'], ['LC', 'Lena Carter'], ['DB', 'Daniel Brooks'], ['MC', 'Maya Collins']];
  const comment = (ini, name, time, body) => `<div class="ce">${av(ini)}<div><h5>${name}<small>${time}</small></h5><p>${body}</p></div></div>`;
  const html = () => `${LX.shell({ active: 'Actions', scroll: 19.5 })}
    <header class="ac-head"><h3>Actions</h3><span class="ac-search">Search workflows...${ic('search')}</span><span class="ac-new">${ic('plus')}New task</span><span class="ac-ver"><span>V1</span><span class="on">V2</span></span></header>
    <div class="ac-scope"><span class="on">Everyone</span><span>Assigned to me</span><span>Mentioned me</span><span>Not assigned</span></div>
    <i class="ac-sep"></i>
    ${[['Assignee', 'All', 731, 121], ['Status', 'All', 862, 106], ['Priority', 'All', 978, 109], ['Labels', 'All', 1097, 105], ['Date', 'Any time', 1212, 135]].map(([l, v, x, w]) => `<span class="ac-pill" style="left:${x}px;width:${w}px">${l} <b>${v}</b>${ic('down')}</span>`).join('')}
    <span class="ac-pill r2" style="left:274px;width:144px">Close reason <b>All</b>${ic('down')}</span>
    <span class="ac-clear">${ic('x')}Clear filters</span>
    <div class="ac-chips">${[['High priority', 4, 'hp'], ['Open action items', 7], ['From alerts', 5], ['From agent evaluation', 2], ['No call attached', 4]].map(([l, n, k]) => `<span class="chip"${k ? ` data-k="${k}"` : ''}>${l}<em>${n}</em></span>`).join('')}</div>
    <div class="ac-showing">Showing <b class="sh">17</b> of <b>17</b> workflows</div>
    ${col('pe', '', 'Pending', 6, 'oldest 4d', ['P1', 'P2', 'P3', 'P4', 'P5'])}
    ${col('ip', '', 'In progress', 5, 'oldest 6d', ['I1', 'I2', 'I3', 'I4'])}
    ${col('dn', 'done', 'Done', 4, '16 total', ['D1', 'D2'], '+12 older items', `<div class="cr"><h4>Close reasons</h4><p>6 most recent · Done and Cancelled</p><div class="cr-bar">${[[3, '#1b1b1b'], [1, '#727272'], [1, '#b7b6b9'], [1, '#cfcfcf']].map(([n, c]) => `<i style="flex:${n};background:${c}"></i>`).join('')}</div><ul>${[['Resolved', 3, '#1b1b1b'], ['Duplicate', 1, '#727272'], ['Not actionable', 1, '#b7b6b9'], ['Escalated', 1, '#cfcfcf']].map(([l, n, c]) => `<li><i style="background:${c}"></i>${l}<b>${n}</b></li>`).join('')}</ul></div>`)}
    ${col('ca', 'canc', 'Cancelled', 2, '6 total', ['C1', 'C2'], '+4 older items')}
    <div class="ac-dim"></div>
    <aside class="dw">
      <div class="dw-h"><span class="dw-btn">${ic('spark')}Ask AI</span><span class="dw-btn">${ic('play')}Open call</span>${ic('archive')}${ic('x')}</div>
      <div class="dw-b"><div class="dw-in">
        <h3 class="dw-t">Customer asked twice for a refund, was offered only a voucher</h3>
        <p class="dw-d">Cancelled JFK–LHR flight. The customer requested a cash refund twice; the agent offered a voucher both times and did not log the request.</p>
        <hr>
        <dl class="props">
          <dt>Status</dt><dd><span class="trg st"><span class="v">Pending</span>${ic('down')}</span></dd>
          <dt>Priority</dt><dd><span class="trg">${prio(3)}High${ic('down')}</span></dd>
          <dt>Assignee</dt><dd><span class="trg as">${av('DB')}Daniel Brooks${ic('down')}</span></dd>
          <dt>Labels</dt><dd><span class="lab">${ic('alert')}Alert</span></dd>
          <dt>Call</dt><dd>Today, 09:41 <small>· handled by Lena Carter</small></dd>
          <dt>Topic</dt><dd>Refunds &amp; Credits</dd>
        </dl>
        <hr>
        <div class="sec">Action items <small class="aic">0 of 2 done</small></div>
        <div class="dw-bar"><i></i></div>
        <div class="ai"><div>${'<span class="cb">' + ic('check') + '</span>'}<span>Call the customer back about the refund</span></div><div><span class="cb">${ic('check')}</span><span>Log the refund request in the CRM</span></div></div>
        <div class="sec">Attachments <small>1</small></div>
        <div class="att">${ic('file')}Refund policy.pdf</div>
        <div class="sec cmh">Comments <small class="cmc">3</small></div>
        <div class="cm-wrap"><div class="cm"><span class="cm-tx"></span><span class="cm-ph">Write a comment...</span><span class="cm-hint">Type @ to mention someone</span><span class="cm-go">Comment</span></div></div>
        <div class="thread">
          ${comment('MC', 'Maya Collins', 'Today, 10:05', '<b>@AlexWard</b> second refund complaint on this route this week — worth a look.')}
          ${comment('AW', 'Alex Ward', 'Today, 10:12', '<b>@DanielBrooks</b> can you call the customer back and log the refund request?')}
          ${comment('DB', 'Daniel Brooks', 'Today, 10:20', 'On it — calling after 14:00.')}
        </div>
        <div class="sec">Activity</div>
        <ul class="act"><li>Created<small>Today, 10:02</small></li><li>Assigned to Daniel Brooks</li></ul>
      </div></div>
    </aside>`;

  const filterOn = ({ app, q, qa }) => {
    app.classList.add('filtered'); q('.chip[data-k="hp"]').classList.add('on'); q('.sh').textContent = '4';
    qa('.cd').forEach(e => e.classList.toggle('dim', e.dataset.p !== '3'));
  };
  LX.scene('actions', {
    cls: 'sc-ac',
    html,
    // the page's other figures: one state of the board each, cropped
    stills: {
      board: { set: filterOn, crop: [262, 0, 1178, 740] },
      card: { crop: [275, 268, 277, 206] },
      filters: { cls: 'st-strip', set: filterOn, crop: [268, 82, 1346, 92] },
      reasons: { crop: [857, 268, 277, 192] },
      cancelled: { crop: [1146, 231, 280, 446] },
    },
    cursor: [136, 544],
    hold: 3100,
    // when each beat starts and when the last one ends (s), for progress bars outside the window
    times: [0, 4.17, 7.1, 9.33, 10.83, 13.83, 25.0, 26.4],
    beats: [
      'Hovering a card shows its quick actions.',
      'Filtering to High priority shows 4 of 17 tasks.',
      'A task opens in the side panel.',
      'Ticking off an action item updates the progress bar.',
      'The task moves to In progress, and its card follows.',
      'An @mention brings a teammate into the thread.',
      'The thread and the activity log keep the record.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      const B = async (i, t0) => { await at(t0); await c.beat(i); off = c.P.t - t0 * 1000; };
      // a held step (reduced motion, or a step tab clicked while paused) rests on the frame its label describes:
      // it stops at t as if step i began there, and the recording's clock picks up from t if played on
      const rest = async (i, t) => { if (c.ff && c.P.stopHold && c.P.stopAt === i) { await c.beat(i); off = c.P.t - t * 1000; } };
      const cd = id => q(`.cd[data-id="${id}"]`);
      const tb = (id, on) => cd(id).classList.toggle('tb', on);
      const nav = q('.sb-i[data-nav="AI Tasks"]');
      const chip = q('.chip[data-k="hp"]');
      c.hover(nav);

      // 1. hover cards: the quick-action toolbar
      await B(0, 0);
      await at(1.23);
      let m = c.move([432, 297], { d: 370 });
      await at(1.37); c.hover(nav, false);
      await at(1.43); tb('P1', true);
      await m;
      await at(2.2); await rest(1, 2.2);
      m = c.move([683, 297], { d: 400 });
      await at(2.37); tb('P1', false);
      await at(2.43); tb('I1', true);
      await m;
      await at(3.17);
      m = c.move([926, 297], { d: 400 });
      await at(3.4); tb('I1', false);
      await m;

      // 2. the High priority quick filter
      await B(1, 4.17);
      c.cam([496, 300]); // phones: the board, chip in view
      await c.move(chip, { d: 360, x: .5 });
      await at(4.57); await c.click(chip);
      app.classList.add('filtered'); app.classList.remove('unfilter');
      chip.classList.add('on');
      q('.sh').textContent = '4';
      qa('.cd').forEach(e => e.classList.toggle('dim', e.dataset.p !== '3'));
      await at(6.25); await rest(2, 6.25); await c.click(chip);
      app.classList.remove('filtered'); app.classList.add('unfilter');
      q('.sh').textContent = '17';
      qa('.cd').forEach(e => e.classList.remove('dim'));
      chip.classList.remove('on'); chip.classList.add('fo');

      // 3. open the task in the side panel
      await B(2, 7.1);
      const t1 = cd('P1').querySelector('.cd-t');
      m = c.move(t1, { d: 370, x: .42, y: .25 });
      await at(7.37); tb('P1', true);
      await m;
      await at(7.55); await c.click(t1);
      app.classList.add('open'); cd('P1').classList.add('sel');
      c.anim(q('.dw'), [{ transform: 'translateX(500px)' }, { transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.2,.8,.2,1)' });
      c.anim(q('.ac-dim'), [{ opacity: 0 }, { opacity: 1 }], { duration: 110, easing: 'linear' });
      c.cam([1174, 300]); // phones: the panel, title in view

      // 4. tick the first action item
      await B(3, 9.33);
      const item = q('.ai div');
      m = c.move(item.lastElementChild, { d: 400, x: .9 });
      await c.wait(60); tb('P1', false);
      await m;
      await at(9.73); c.hover(item);
      await at(9.78); await c.click(item);
      item.classList.add('ok');
      q('.aic').textContent = '1 of 2 done';
      cd('P1').querySelector('[data-k="ai"] span').textContent = '1/2';
      const fill = q('.dw-bar i'); fill.style.width = '50%';
      c.anim(fill, [{ width: '0%' }, { width: '50%' }], { duration: 200, easing: 'ease-out' });

      // 5. move it to In progress
      await B(4, 10.83);
      c.hover(item, false);
      const st = q('.trg.st');
      await c.move(st, { d: 370, x: .45 });
      await at(11.2); c.hover(st);
      await at(11.25); await c.click(st);
      const menu = c.add(q('.dw-in'), `<div class="menu">${['Pending', 'In progress', 'Done', 'Cancelled'].map((s, i) => `<div>${s}${i ? '' : ic('check')}</div>`).join('')}</div>`, 'none');
      await at(12.17);
      const opt = menu.children[1];
      m = c.move(opt, { d: 400, x: .45 });
      await at(12.4); c.hover(opt);
      await m;
      await at(12.62); await c.click(opt);
      menu.remove(); c.hover(st, false);
      st.querySelector('.v').textContent = 'In progress';
      const ipl = q('[data-col="ip"] .col-l');
      ipl.prepend(cd('P1'));
      q('[data-col="pe"] .col-h em').textContent = '5';
      q('[data-col="ip"] .col-h em').textContent = '6';
      q('.act').insertAdjacentHTML('beforeend', '<li>Moved to In progress</li>');
      c.hover(q('.trg.as'));

      // 6. @mention a teammate and post
      await B(5, 13.83);
      c.hover(q('.trg.as'), false);
      const cm = q('.cm'), tx = q('.cm-tx'), go = q('.cm-go');
      m = c.move(cm, { d: 400, x: .5, y: .34 });
      await at(14.0); c.hover(item);
      await at(14.07); c.hover(item, false);
      await m;
      await at(14.25); await c.click(cm);
      cm.classList.add('fo'); tx.classList.add('is-typing');
      let pop = null;
      const filter = s => {
        const k = s.lastIndexOf('@');
        if (k < 0) return;
        const qy = s.slice(k + 1).toLowerCase();
        const rows = PEOPLE.filter(p => p[1].toLowerCase().includes(qy)).slice(0, 6);
        if (!pop) pop = c.add(q('.cm-wrap'), '<div class="pop"></div>', 'none');
        pop.innerHTML = rows.map(([i, n, me]) => `<div data-n="${n}">${av(i)}${n}${me ? '<small>(you)</small>' : ''}</div>`).join('');
      };
      await at(14.8);
      await c.type(tx, 'Looping in @', { ms: 68, caret: true, onChar: s => { go.classList.add('on'); if (s.endsWith('@')) filter(s); } });
      for (const [t, ch] of [[16.67, 'S'], [16.87, 'o'], [17.0, 'f']]) { await at(t); await c.type(tx, ch, { keep: true, caret: true, ms: 1, onChar: filter }); }
      await at(18.3);
      const row = pop.querySelector('[data-n="Sofia Cruz"]');
      m = c.move(row, { d: 330, x: .48 });
      await at(18.57); c.hover(row);
      await m;
      await at(18.63); await c.click(row);
      pop.remove(); pop = null;
      tx.textContent = 'Looping in @SofiaCruz ';
      await at(19.4); c.jump(cm, { x: .5, y: .34 });
      await at(19.53);
      await c.type(tx, 'can you call the customer today?', { ms: 63, keep: true, caret: true });
      await at(22.37); await rest(6, 22.37);
      // phones: aim a little left of center so the camera stays on the panel instead of panning past its labels
      await c.move(go, { d: 300, x: c.P.root.classList.contains('lx-cam') ? .4 : .5 });
      await at(22.78); await c.click(go, { press: .97 });
      tx.textContent = ''; tx.classList.remove('is-typing'); cm.classList.remove('fo'); go.classList.remove('on');
      q('.cmc').textContent = '4';
      q('.thread').insertAdjacentHTML('beforeend', comment('AW', 'Alex Ward', 'Today, 10:31', 'Looping in <b>@SofiaCruz</b> can you call the customer today?'));
      const p1 = cd('P1');
      p1.querySelector('.cd-x .n').textContent = '4';
      p1.querySelector('[data-k="cm"] span').textContent = '4';

      // 7. the thread and the activity log
      await B(6, 25.0);
      c.cam([1174, 600]); // phones: the panel's thread and activity log
      await c.move([1169, 683], { d: 400 });
      await at(25.43);
      await c.scroll(q('.dw-in'), 313, 200);
    },
  });
})();
