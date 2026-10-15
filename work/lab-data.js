// Data V2 calls table: the rows load, Filter's plain-language box turns "High priority calls" into a Priority: High chip,
// the rows re-flow to the filtered set, a call opens in the side panel, the arrow keys step to the next calls, and
// Ask AI answers a question about the open call.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    dtCal: 'M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5zM4 9.5h16M8.5 13.2h.01M12 13.2h.01M15.5 13.2h.01M8.5 16.6h.01M12 16.6h.01M15.5 16.6h.01',
    dtCols: 'M5.5 4.5h13A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V6a1.5 1.5 0 0 1 1.5-1.5zM9.4 4.5v15M14.6 4.5v15',
    dtSort: 'M12 4.5v15M6.5 14l5.5 5.5 5.5-5.5',
    dtKebab: 'M12 5.5h.01M12 12h.01M12 18.5h.01',
    dtCopy: 'M10 9h8.5A1.5 1.5 0 0 1 20 10.5V19a1.5 1.5 0 0 1-1.5 1.5H10A1.5 1.5 0 0 1 8.5 19v-8.5A1.5 1.5 0 0 1 10 9zM15.5 9V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3',
    dtTri: 'M10.3 4.3L2.6 17.8A2 2 0 0 0 4.3 20.8h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0zM12 9.5v4.2M12 17h.01',
    dtHist: 'M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4h4M12 8v4.3l2.8 1.8',
    dtEdit: 'M11 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5M17.3 3.7a2 2 0 0 1 2.9 2.9L12.5 14.3l-3.8 1 1-3.8z',
    dtExp: 'M14.5 4.5h5v5M19.5 4.5l-6 6M9.5 19.5h-5v-5M4.5 19.5l6-6',
    dtUp: 'M7.5 10.5v9.5h-3v-9.5zM7.5 10.5l3.6-6.6a1.9 1.9 0 0 1 3.4 1.5l-.8 3.6h5.2a2 2 0 0 1 2 2.4l-1.4 6.6a2 2 0 0 1-2 1.5H7.5',
    dtDown: 'M7.5 13.5V4h-3v9.5zM7.5 13.5l3.6 6.6a1.9 1.9 0 0 0 3.4-1.5l-.8-3.6h5.2a2 2 0 0 0 2-2.4l-1.4-6.6a2 2 0 0 0-2-1.5H7.5',
    dtRe: 'M4.5 12a7.5 7.5 0 1 0 2.4-5.5M4.5 4.5v4h4',
    dtMic: 'M12 3.5a2.6 2.6 0 0 1 2.6 2.6v5.6a2.6 2.6 0 0 1-5.2 0V6.1A2.6 2.6 0 0 1 12 3.5zM6.5 11.3a5.5 5.5 0 0 0 11 0M12 16.8v3.7M9 20.5h6',
    dtSlash: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM14.2 7.5l-4.4 9',
    dtArrow: 'M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5',
    dtCheck: 'M5 12.5l4.5 4.5L19 7',
  });
  // the Lab's AI glyph: a large four-point star with a small one above it to the right
  const SPARK = '<svg class="dt-sp" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6.5l1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8L3 13l4.8-1.7zM18 2.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>';

  // the sidebar: Main and Intelligence scroll in the nav, the DEV pages sit in their own block under it
  const NAV = [['h', 'Main'], ['nrHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['dtGrid', 'Topics'], ['report', 'Reports'], ['dtApps', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge']];
  LX.addIcons({
    nrHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    dtGrid: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    dtApps: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
  });
  const DEV = `<div class="dt-dev">${[['news', 'News · Directions'], ['video', 'Demos'], ['story', 'Storybook']].map(([i, l]) => `<div class="sb-i dev" data-nav="${l}">${i === 'story' ? LX.mark('sm') : ic(i)}<span>${l}</span><em>DEV</em></div>`).join('')}</div>`;
  const shell = () => LX.shell({ active: 'Data V2', nav: NAV }).replace('<div class="sb-user">', DEV + '<div class="sb-user">');

  // people: initials, name, color
  const PPL = { SC: ['Sofia Cruz', '#448bea'], MW: ['Milo West', '#74af90'], LT: ['Layla Torres', '#f3aa9e'], NP: ['Nina Patel', '#d19adc'], JO: ['James Okafor', '#61a59b'] };
  const av = ini => `<i class="av" style="--c:${PPL[ini][1]}">${ini}</i>`;
  const ST = { ip: 'In progress', dn: 'Done', pe: 'Pending', ca: 'Cancelled' };
  const PRI = { h: 'High', m: 'Medium', l: 'Low' };
  // [key, alert, title, subtitle as shown, id, date, time, status, priority, assignee, direction]
  const ROWS = {
    pr: [1, 'Pricing', 'Customer inquired about enterprise li…', '170254bf-000000000000', 'Oct 12', '09:14', 'ip', 'h', 'SC', 'Inbound'],
    bi: [0, 'Billing', 'Follow-up on unresolved billing discre…', '2a3b4c5d-000000000001', 'Oct 12', '07:47', 'dn', 'l', 'MW', 'Outbound'],
    pd: [0, 'Product demo', 'Product demo for new analytics mod…', '3c4d5e6f-000000000002', 'Oct 12', '06:21', 'pe', 'm', 'LT', 'Outbound'],
    on: [0, 'Onboarding', 'Onboarding session for new SMB clien…', '4d5e6f70-000000000003', 'Oct 12', '05:41', 'dn', '', '', 'Inbound'],
    co: [1, 'Compliance', 'Compliance review call regarding dat…', '5e6f7081-000000000004', 'Oct 12', '04:15', 'ip', 'h', 'NP', 'Inbound'],
    re: [0, 'Renewal', 'Renewal negotiation for annual subsc…', '6f708192-000000000005', 'Oct 12', '03:36', 'dn', 'm', 'JO', 'Outbound'],
    te: [1, 'Technical issue', 'Technical troubleshooting for SSO inte…', '70819203-000000000006', 'Oct 12', '02:09', 'ip', 'h', 'SC', 'Inbound'],
    rt: [0, 'Retention', 'Churn prevention call. Offered loyalty …', '819203a4-000000000007', 'Oct 12', '01:30', 'dn', 'm', 'MW', 'Outbound'],
    ex: [0, 'Expansion', 'Enterprise expansion discussion. Clien…', '9203a4b5-000000000008', 'Oct 12', '00:04', '', 'h', 'LT', 'Outbound'],
    tr: [0, 'Training', 'Training session on advanced reportin…', 'a3b4c5d6-000000000009', 'Oct 11', '23:24', 'dn', 'l', 'NP', 'Inbound'],
    se: [0, 'Security review', 'Security questionnaire review for ente…', 'b4c5d6e7-000000000010', 'Oct 11', '21:58', 'ip', 'm', 'JO', 'Inbound'],
    pa: [1, 'Partnerships', 'Partnership discussion for reseller agr…', 'c5d6e7f8-000000000011', 'Oct 11', '21:19', 'ca', 'h', 'SC', 'Outbound'],
    ah: [0, 'Account health', 'Customer success check-in. Account …', 'd6e7f809-000000000012', 'Oct 11', '19:52', 'dn', '', 'MW', 'Outbound'],
    ct: [0, 'Contracts', 'Contract amendment for GDPR adde…', 'e7f8091a-000000000013', 'Oct 11', '19:14', 'ip', 'l', 'LT', 'Inbound'],
    br: [0, 'Business review', 'Executive business review with CTO a…', 'f809102b-000000000014', 'Oct 11', '17:46', 'dn', 'h', 'NP', 'Outbound'],
    es: [1, 'Escalation', 'Support escalation for API rate-limitin…', '102b3c4d-000000000016', 'Oct 11', '15:41', 'ip', 'h', 'SC', 'Inbound'],
    nb: [0, 'New business', 'New logo pursuit — cold outreach con…', '4d5e6f70-000000000019', 'Oct 11', '12:56', 'ip', 'h', 'LT', 'Outbound'],
    pr2: [1, 'Pricing', 'Customer inquired about enterprise li…', '170254bf-000000000020', 'Oct 11', '11:29', 'ip', 'h', 'SC', 'Inbound'],
    co2: [1, 'Compliance', 'Compliance review call regarding dat…', '5e6f7081-000000000024', 'Oct 11', '07:18', 'ip', 'h', 'NP', 'Inbound'],
    te2: [1, 'Technical issue', 'Technical troubleshooting for SSO inte…', '70819203-000000000026', 'Oct 11', '05:12', 'ip', 'h', 'SC', 'Inbound'],
    ex2: [0, 'Expansion', 'Enterprise expansion discussion. Clien…', '9203a4b5-000000000028', 'Oct 11', '03:06', '', 'h', 'LT', 'Outbound'],
    pa2: [1, 'Partnerships', 'Partnership discussion for reseller agr…', 'c5d6e7f8-000000000031', 'Oct 11', '00:21', '', 'h', 'SC', 'Outbound'],
    br2: [0, 'Business review', 'Executive business review with CTO a…', 'f809102b-000000000034', 'Oct 10', '22:40', 'dn', 'h', 'NP', 'Outbound'],
  };
  const ALL = ['pr', 'bi', 'pd', 'on', 'co', 're', 'te', 'rt', 'ex', 'tr', 'se', 'pa', 'ah', 'ct'];
  const HIGH = ['pr', 'co', 'te', 'ex', 'pa', 'br', 'es', 'nb', 'pr2', 'co2', 'te2', 'ex2', 'pa2', 'br2'];
  const Y0 = 39, PITCH = 50.2;
  const dash = '<span class="dt-dash">—</span>';
  const row = (k, i) => {
    const [al, t, s, id, d, tm, st, p, a, dir] = ROWS[k];
    return `<div class="dt-r" data-k="${k}" style="top:${(Y0 + i * PITCH).toFixed(1)}px">
      <span class="dt-cb"></span>${al ? ic('dtTri', 'dt-al') : ''}
      <div class="dt-call"><b>${t}</b><small>${s}</small></div>
      <span class="dt-id">${id}${ic('dtCopy')}</span>
      <div class="dt-date"><b>${d}</b><small>${tm}</small></div>
      <span class="dt-st">${st ? `<span class="pill ${st}">${ST[st]}</span>` : dash}</span>
      <span class="dt-pri">${p ? `<i class="${p}"></i>${PRI[p]}` : dash}</span>
      <span class="dt-as">${a ? av(a) + PPL[a][0] : dash}</span>
      <span class="dt-dir">${dir}</span>
    </div>`;
  };

  // the filter popover's field list (the recording's alert names are replaced with neutral ones)
  const FIELDS = ['ID', 'File name', 'Call date', 'Created at', 'Audio length', 'Processing status', 'Team', 'Agent status'];
  const ALERTS = ['Any alert', 'Rejected alert', 'Pricing question', 'Customer frustration', 'Tone issue', 'Missed disclosure', 'Refund request', 'Policy breach', 'Third party', 'Data handling'];
  const popover = () => `<div class="dt-pop">
      <div class="pp-ai">${SPARK}<span class="pp-in"><span class="tx"></span><span class="ph">Describe the calls you want to</span></span><span class="pp-gen">Generate</span></div>
      <div class="pp-sr"><span>Search fields...</span></div>
      <div class="pp-l"><h6>Call</h6>${FIELDS.map(f => `<div>${f}</div>`).join('')}<div class="off">Transcription text<small>No data</small></div>
        <h6>Alerts</h6>${ALERTS.map(f => `<div>${f}</div>`).join('')}</div>
    </div>`;

  // the side panel, one call at a time: [key, title, id, meta, alert lines, description, fields]
  const CALLS = {
    pr: ['Pricing', '170254bf-000000000000', 'Oct 12 · 09:14 · Inbound', ['Pricing question · False positive', 'Refund request'],
      'Customer inquired about enterprise licensing<br>options and volume discount tiers for Q2 renewal.',
      [['2,682', 'Paris, France', 'Noah Price', 'Retention', '0:58', 'No', '40', 'Processing'], 'SC']],
    co: ['Compliance', '5e6f7081-000000000004', 'Oct 12 · 04:15 · Inbound', ['Refund request'],
      'Compliance review call regarding data residency<br>requirements for APAC region deployment.',
      [['13,230', 'Sydney, Australia', 'Owen Reed', 'Billing support', '24:54', 'No', '66', 'Finished'], 'NP']],
    te: ['Technical issue', '70819203-000000000006', 'Oct 12 · 02:09 · Inbound', ['Third party · False positive'],
      'Technical troubleshooting for SSO integration<br>issue. Escalated to engineering for root cause.',
      [['10,901', 'Dubai, UAE', 'Leo Martin', 'Billing support', '8:52', 'Yes', '79', 'Finished'], 'SC']],
  };
  const LBL = ['Proposed price', 'Destination', 'Agent', 'Team', 'Audio length', 'Follow-up needed', 'Agent score', 'Processing status'];
  const panelBody = k => {
    const [t, id, meta, al, desc, [vals, who]] = CALLS[k];
    return `<div class="pn-h"><h4>${t}</h4><span class="pn-id">${id}${ic('dtCopy')}</span><span class="pn-m">${meta}</span>${ic('x', 'pn-x')}</div>
      <div class="pn-b"><div class="pn-al">${ic('dtTri')}<div><b>An alert was triggered on this call</b>${al.map(l => `<span>${l}</span>`).join('')}</div></div>
        <p class="pn-d">${desc}</p>
        <dl class="pn-f"><div><dt>Status</dt><dd><span class="pill ip">In progress</span></dd></div><div><dt>Priority</dt><dd><i class="dot"></i>High</dd></div>
          <div><dt>Assigned to</dt><dd>${av(who)}${PPL[who][0]}</dd></div>${LBL.map((l, i) => `<div><dt>${l}</dt><dd>${vals[i]}</dd></div>`).join('')}</dl></div>`;
  };

  // the desktop line breaks follow the recording; a space before each one keeps the words apart where phones hide them
  const ASK = 'What happened on this Technical issue call (October 12, 2026 · 02:09), and does it need follow-<br>up?';
  const ANSWER = 'The call was an inbound, high-priority technical issue about an SSO integration problem. Leo Martin gathered <br>details and escalated the case to engineering, noting a third-party alert. The call remains in-progress, so a <br>follow-up is needed to confirm engineering’s root-cause analysis and closure.';
  const RELATED = ['Engineering escalation status', 'Third-party alert details', 'SSO integration troubleshooting steps'];
  const modal = () => `<div class="dt-dim"></div><div class="dt-mo">
      <div class="mo-h"><span class="mo-tile">${SPARK}</span><h4>Ask AI</h4><span class="mo-sub">New conversation</span>
        <span class="mo-ic">${ic('dtHist')}${ic('dtEdit')}${ic('dtExp')}${ic('x')}</span></div>
      <div class="mo-chips"><span>Data V2${ic('x')}</span><span>Project · Northwind</span></div>
      <div class="mo-q">${ASK}</div>
      <div class="mo-think"><i class="globe"><i></i></i>Thinking...</div>
      <div class="mo-a"><p>${ANSWER}</p><div class="mo-act">${ic('dtUp')}${ic('dtDown')}${ic('dtRe')}${ic('dtCopy')}${ic('dtKebab')}</div>
        <h5>Related</h5><ul>${RELATED.map(r => `<li>${r}${ic('dtArrow')}</li>`).join('')}</ul></div>
      <div class="mo-cm"><span class="ph">Ask anything about this page...</span><span class="mo-ics">${ic('at')}${ic('dtSlash')}</span>${ic('dtMic', 'mic')}<span class="busy"><i></i><i></i><i></i></span></div>
    </div>`;

  const html = () => `${shell()}
    <header class="dt-head"><h3>Data V2</h3>${ic('right', 'dt-crumb')}<span class="dt-count">2,000 calls</span><span class="dt-proc">Processing: 3</span>
      <span class="dt-search">${ic('search')}Search...</span><span class="dt-up">Upload</span>${ic('dtKebab', 'dt-keb')}
      <span class="dt-seg"><span>V2</span><span class="on">V3 Facelift</span></span></header>
    <div class="dt-tabs"><span class="on">All calls</span><span>Needs review</span><span>High priority</span><span>Alerts</span><span>Done</span><span>Agent evaluation</span></div>
    <div class="dt-unsaved"><span>Unsaved changes</span><b>Reset</b><span class="dt-save">Save as view</span></div>
    <span class="dt-btn dt-range">Last 90 days${ic('dtCal')}</span>
    <span class="dt-btn dt-filter">${ic('plus')}Filter</span>
    <span class="dt-chip"><b>Priority</b>&nbsp;: High<i>${ic('x')}</i></span><span class="dt-clear">Clear all</span>
    <span class="dt-btn dt-cols">${ic('dtCols')}Columns (9)</span>
    <section class="dt-tbl">
      <div class="dt-th"><span class="dt-cb"></span><span style="left:63px">Call</span><span style="left:333px">ID</span><span style="left:556px">Call date${ic('dtSort')}</span><span style="left:678px">Status</span>
        <span style="left:804px">Priority</span><span style="left:928px">Assigned to</span><span style="left:1090px">Direction</span>${[313, 537, 659, 785, 909, 1071].map(x => `<i style="left:${x}px"></i>`).join('')}</div>
      <div class="dt-rows"></div>
    </section>
    <aside class="dt-pn"><div class="pn-in"></div>
      <div class="pn-ft"><span class="pn-open">Open full call</span><span class="pn-ask">${SPARK}Ask AI about this call</span><small>↑↓ next call · Esc to close</small></div></aside>
    <div class="dt-toast">Filters applied</div>
    ${modal()}`;

  const fillRows = (app, keys) => { app.querySelector('.dt-rows').innerHTML = keys.map(row).join(''); };
  const openPanel = ({ app, q }, k) => { app.classList.add('panel'); q('.pn-in').innerHTML = panelBody(k); };

  LX.scene('data', {
    cls: 'sc-dt',
    html,
    cursor: [137, 357],
    // phones open on the header's call count, the toolbar and the first rows, with the pointer whole at the left edge
    cam0: [357, 300],
    hold: 6000,
    times: [0, 7.6, 11.32, 16.32, 20.48, 23.68, 25.08, 31.4],
    beats: [
      'The calls table loads with 2,000 calls.',
      'Filter opens, and a request is typed in plain words.',
      'Generate turns the words into a High priority filter chip.',
      'A call opens in a panel beside the table.',
      'The arrow keys step the panel to the next calls.',
      'A panel button opens Ask AI about this call.',
      'The answer explains the call and suggests related topics.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // a beat entered by a jump starts the take's clock over; in normal play small delays are not carried forward
      const B = async (i, t0) => { await at(t0); await c.beat(i); const d = c.P.t - t0 * 1000; off = Math.abs(d) > 250 ? d : 0; };
      // type at the recording's steady pace, one character every ms from t0
      const typeAt = async (el, text, t0, ms, onChar) => {
        el.classList.add('is-typing');
        for (let i = 1; i <= text.length; i++) { await at(t0 + (i - 1) * ms / 1000); el.textContent = text.slice(0, i); if (onChar) onChar(el.textContent); }
      };
      const r = k => q(`.dt-r[data-k="${k}"]`);
      const hov = k => { qa('.dt-r.hv').forEach(e => e.classList.remove('hv')); if (k) r(k).classList.add('hv'); };

      // 1. the table loads, then the pointer idles over the rows
      await B(0, 0);
      c.cam([357, 300]);
      await at(0.5); fillRows(app, ALL);
      await at(3.44); await c.move([1357, 43], { d: 360 });
      await at(5.24);
      // phones: back from the header's right end, the call count and the call titles stay whole while rows are hovered
      c.cam([520, 300]);
      let m = c.move([629, 225], { d: 360 });
      await at(5.6); hov('pr'); await m;
      await at(6.04);
      m = c.move([629, 323], { d: 400 });
      await at(6.12); hov('bi');
      await at(6.28); hov('pd'); await m;
      await at(6.84);
      m = c.move([629, 423], { d: 360 });
      await at(6.92); hov('on');
      await at(7.12); hov('co'); await m;

      // 2. Filter: the plain-language box on top
      await B(1, 7.6);
      // phones: "Data V2", the date range and the whole popover, with Generate inside the frame
      c.cam([520, 330]);
      const flt = q('.dt-filter');
      m = c.move(flt, { d: 360, x: .5 });
      await at(7.64); hov(null); await m;
      await at(7.96); await c.click(flt, { after: 40 });
      flt.classList.add('on');
      const pop = c.add(app, popover(), 'none');
      c.anim(pop, [{ opacity: 0, transform: 'translateY(-1px)' }, { opacity: 1, transform: 'none' }], { duration: 110, easing: 'ease-out' });
      const tx = pop.querySelector('.tx'), inp = pop.querySelector('.pp-in'), gen = pop.querySelector('.pp-gen');
      tx.classList.add('is-typing');
      await at(9.36); await c.move([539, 175], { d: 320 });
      await at(10.04);
      gen.classList.add('ok'); flt.classList.remove('on');
      await typeAt(tx, 'High priority calls', 10.04, 42, () => inp.classList.add('has'));

      // 3. Generate: the words become an ordinary filter chip and the rows re-flow
      await B(2, 11.32);
      await c.move([685, 175], { d: 360 });
      await at(11.64); gen.classList.add('hv');
      await at(11.82); await c.click(gen, { after: 40 });
      pop.remove(); flt.classList.remove('on');
      app.classList.add('filtered');
      q('.dt-count').textContent = '800 calls';
      const toast = q('.dt-toast');
      toast.classList.add('on');
      c.anim(toast, [{ opacity: 0, transform: 'scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: 120, easing: 'ease-out' });
      // rows that stay glide to their new slots, rows that drop out fade where they are, new rows rise into place
      const list = q('.dt-rows');
      const EASE = 'ease';
      ALL.forEach(k => {
        const el = r(k), j = HIGH.indexOf(k);
        if (j < 0) { el.classList.add('out'); c.anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'linear', fill: 'forwards' }).finished.then(() => el.remove(), () => {}); return; }
        const y0 = parseFloat(el.style.top), y1 = Y0 + j * PITCH;
        el.style.top = y1.toFixed(1) + 'px';
        if (y0 !== y1) c.anim(el, [{ transform: `translateY(${(y0 - y1).toFixed(1)}px)` }, { transform: 'none' }], { duration: 360, easing: EASE });
      });
      HIGH.filter(k => !ALL.includes(k)).forEach((k, n) => {
        const el = c.add(list, row(k, HIGH.indexOf(k)), 'none');
        c.anim(el, [{ opacity: .4, transform: `translateY(${480 + n * 55}px)` }, { opacity: 1, transform: 'none' }], { duration: 360, easing: EASE });
      });
      await at(15.0); toast.classList.remove('on');

      // 4. open a call beside the table
      await B(3, 16.32);
      m = c.move([629, 233], { d: 360 });
      await at(16.44); hov('pr'); await m;
      await at(17.12);
      m = c.move([809, 297], { d: 360 });
      await at(17.2); hov('co'); await m;
      await at(17.88);
      const t1 = r('pr').querySelector('.dt-call b');
      m = c.move([378, 223], { d: 320 });
      await at(18.08); hov('pr'); await m;
      await c.click(t1, { after: 20 });
      r('pr').classList.add('ring');
      await at(18.24);
      openPanel(c, 'pr');
      c.cam([1190, 430]);

      // 5. the arrow keys step to the next calls; the panel follows
      await B(4, 20.48);
      r('pr').classList.remove('ring'); r('co').classList.add('sel', 'ring');
      q('.pn-in').innerHTML = panelBody('co');
      await at(22.08);
      r('co').classList.remove('sel', 'ring'); r('te').classList.add('sel', 'ring');
      q('.pn-in').innerHTML = panelBody('te');

      // 6. Ask AI about this call
      await B(5, 23.68);
      hov(null);
      const ask = q('.pn-ask');
      // phones: the camera's bottom-right stop, which frames the panel's footer and, once open, the whole Ask AI sheet
      c.cam([1200, 600]);
      m = c.move(ask, { d: 360, x: .49, y: .4 });
      // the row hover follows the pointer as it sweeps down to the panel's footer
      for (const [t, k] of [[23.68, 'co'], [23.72, 'ex'], [23.76, 'pa'], [23.8, 'br'], [23.84, 'es'], [23.92, 'co2'], [24.0, null]]) { await at(t); hov(k); }
      await m;
      await at(24.08); c.hover(ask);
      await at(24.1); await c.click(ask, { after: 40 });
      c.hover(ask, false); r('te').classList.remove('ring');
      app.classList.add('asking');
      q('.sb-ai').classList.add('on');
      const mo = q('.dt-mo'), dim = q('.dt-dim');
      c.anim(dim, [{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
      c.anim(mo, [{ opacity: 0, transform: 'translateY(2px)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'ease-out' });
      c.cam([1200, 600]);
      const globe = q('.globe i'), dots = qa('.busy i');
      c.anim(globe, [{ transform: 'translate(0,0)' }, { transform: 'translate(-6px,-6px)' }], { duration: 900, easing: 'linear' });
      dots.forEach((d, i) => c.anim(d, [{ transform: 'translateY(0)' }, { transform: 'translateY(-3px)', offset: .3 }, { transform: 'translateY(0)', offset: .6 }, { transform: 'translateY(0)' }], { duration: 600, delay: i * 120, iterations: 2, easing: 'ease-in-out' }));
      await at(24.56);
      const cm = q('.mo-cm');
      cm.classList.add('fo');
      c.anim(cm, [{ boxShadow: '0 0 0 0 rgba(22,119,255,0)', borderColor: '#d9d9d9' }, { boxShadow: '0 0 0 3px rgba(22,119,255,.12)', borderColor: '#4f86e8' }], { duration: 150, easing: 'ease-out' });

      // 7. the answer, with related topics
      await B(6, 25.08);
      mo.classList.add('done');
      const ans = q('.mo-a');
      c.anim(ans, [{ opacity: .3, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease-out' });
      qa('.mo-a li').forEach((li, i) => c.anim(li, [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 120, delay: i * 40, easing: 'ease-out', fill: 'backwards' }));
      c.anim(q('.busy'), [{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'linear' });
      await at(25.28);
      q('.mo-sub').textContent = 'What happened on this Technical issue call (Octobe';
      await at(25.4);
    },
  });
})();
