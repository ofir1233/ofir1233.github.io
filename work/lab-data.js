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
  // the Lab's AI glyph: three four-point stars, a large one low in the middle, a medium one above it to the left and a
  // small one above it to the right
  const SPARK = '<svg class="dt-sp" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7.5Q11.9 14.6 19 15.5Q11.9 16.4 11 23.5Q10.1 16.4 3 15.5Q10.1 14.6 11 7.5zM5.6 1.6Q6.05 5.15 9.6 5.6Q6.05 6.05 5.6 9.6Q5.15 6.05 1.6 5.6Q5.15 5.15 5.6 1.6zM16.2 1.4Q16.47 3.53 18.6 3.8Q16.47 4.07 16.2 6.2Q15.93 4.07 13.8 3.8Q15.93 3.53 16.2 1.4z"/></svg>';

  // the sidebar: Main and Intelligence scroll in the nav, the DEV pages sit in their own block under it
  const NAV = [['h', 'Main'], ['nrHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['dtGrid', 'Topics'], ['report', 'Reports'], ['dtApps', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge']];
  LX.addIcons({
    nrHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    dtGrid: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    dtApps: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
  });
  const DEV = `<div class="dt-dev">${[['news', 'News · Directions'], ['video', 'Demos'], ['story', 'Storybook']].map(([i, l]) => `<div class="sb-i dev" data-nav="${l}">${i === 'story' ? LX.mark('sm') : ic(i)}<span>${l}</span></div>`).join('')}</div>`;
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
      <span class="dt-st">${st ? `<span class="dt-pill ${st}">${ST[st]}</span>` : dash}</span>
      <span class="dt-pri">${p ? `<i class="${p}"></i>${PRI[p]}` : dash}</span>
      <span class="dt-as">${a ? av(a) + PPL[a][0] : dash}</span>
      <span class="dt-dir">${dir}</span>
    </div>`;
  };

  // the filter popover's field list (the recording's alert names are replaced with neutral ones)
  const FIELDS = ['ID', 'File name', 'Call date', 'Created at', 'Audio length', 'Processing status', 'Team', 'Agent status'];
  const ALERTS = ['Any alert', 'Rejected alert', 'Pricing question', 'Customer frustration', 'Tone issue', 'Missed disclosure', 'Refund request', 'Policy breach', 'Third party', 'Data handling'];
  const popover = () => `<div class="dt-pop">
      <div class="pp-ai">${SPARK}<span class="pp-in"><span class="pp-tx"><span class="tx"></span><i class="crt"></i></span><span class="ph">Describe the calls you want to</span></span><span class="pp-gen">Generate</span></div>
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
        <dl class="pn-f"><div><dt>Status</dt><dd><span class="dt-pill ip">In progress</span></dd></div><div><dt>Priority</dt><dd><i class="dot"></i>High</dd></div>
          <div><dt>Assigned to</dt><dd>${av(who)}${PPL[who][0]}</dd></div>${LBL.map((l, i) => `<div><dt>${l}</dt><dd>${vals[i]}</dd></div>`).join('')}</dl></div>`;
  };

  // the desktop line breaks follow the recording; a space before each one keeps the words apart where phones hide them
  const ASK = 'What happened on this Technical issue call (October 12, 2026 · 02:09), and does it need follow-<br>up?';
  const ANSWER = 'The call was an inbound, high-priority technical issue about an SSO integration problem. Leo Martin gathered <br>details and escalated the case to engineering, noting a third-party alert. The call remains in-progress, so a <br>follow-up is needed to confirm engineering’s root-cause analysis and closure.';
  const RELATED = ['Engineering escalation status', 'Third-party alert details', 'SSO integration troubleshooting steps'];
  const modal = () => `<div class="dt-dim"></div><div class="dt-mo">
      <div class="mo-h"><span class="mo-tile">${SPARK}</span><h4>Ask AI</h4><span class="mo-sub">New conversation</span>
        <span class="mo-ic">${ic('dtHist')}${ic('dtEdit')}${ic('dtExp', 'exp')}${ic('x')}</span></div>
      <div class="mo-chips"><span>Data V2${ic('x')}</span><span>Project · Northwind</span></div>
      <div class="mo-q">${ASK}</div>
      <div class="mo-think"><i class="globe"><i></i></i>Thinking...</div>
      <div class="mo-a"><p>${ANSWER}</p><div class="mo-act">${ic('dtUp')}${ic('dtDown')}${ic('dtRe')}${ic('dtCopy')}${ic('dtKebab')}</div>
        <h5>Related</h5><ul>${RELATED.map(r => `<li>${r}${ic('dtArrow')}</li>`).join('')}</ul></div>
      <div class="mo-cm"><span class="ph"><i class="crt"></i>Ask anything about this page...</span><span class="mo-ics">${ic('at')}${ic('dtSlash')}</span>${ic('dtMic', 'mic')}<span class="busy"><i></i><i></i><i></i></span></div>
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
    // phones open on the table card from its left edge: the header's call count, the toolbar and the first rows (the
    // pointer rests in the sidebar, off to the left, until it crosses the rows)
    cam0: [520, 300],
    hold: 7000,
    times: [0, 7.58, 11.32, 16.3, 20.44, 23.64, 25.05, 32.4],
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
      const ms = t => Math.round(t * 1000) + off;
      // a time already reached goes on at once (a wait of 0 would cost a tick); a cancelled run still stops here
      const at = t => { const d = ms(t) - c.P.t; return d > 0 || c.tok !== c.P.token ? c.wait(Math.max(0, d)) : Promise.resolve(); };
      // c.beat() takes one tick, so a beat is entered one tick early; after a jump the clock is taken again
      const B = async (i, t0) => { await at(t0 - 0.016); const ff = c.ff; await c.beat(i); if (ff) off = c.P.t - Math.round(t0 * 1000); };
      // an animation that starts at t on the recording's clock (part way through when it is set up late)
      const A = (el, kf, t, d, easing = 'linear', fill = 'backwards', o = {}) => c.anim(el, kf, { duration: d, delay: ms(t) - c.P.t, easing, fill, ...o });

      // the rows under the pointer: the table shows the hover grey on whichever row the dot is over
      const r = k => q(`.dt-r[data-k="${k}"]`);
      let rowsNow = ALL, right = 1425, over = true, hk = null;
      // phones: while pin is set the camera holds its frame and the glides do not pull it after the dot
      let pin = false;
      const hov = k => { if (k === hk) return; hk = k; qa('.dt-r.hv').forEach(e => e.classList.remove('hv')); if (k && r(k)) r(k).classList.add('hv'); };
      const rowAt = (x, y) => (!over || x < 274 || x > right || y < 198 || y > 884) ? null : rowsNow[Math.floor((y - 198) / PITCH)] || null;
      // the dot glides at an even speed along recorded points [t, x, y] (the first is when it leaves), and the row
      // hover follows it frame by frame
      const glide = async (pts, track = true) => {
        const P = c.P, t0 = pts[0][0], [t1, x1, y1] = pts[pts.length - 1];
        const all = [[t0, P.cx, P.cy], ...pts.slice(1)];
        P.cx = x1; P.cy = y1; P.place(); if (!pin) P.follow(x1, y1);
        if (c.ff) { if (track) hov(rowAt(x1, y1)); return; }
        P.anim(P.cursor, all.map(([t, x, y]) => ({ transform: `translate(${x}px,${y}px)`, offset: (t - t0) / (t1 - t0) })),
          { duration: (t1 - t0) * 1000, delay: ms(t0) - P.t, easing: 'linear', fill: 'backwards' });
        if (!track) return at(t1);
        for (;;) {
          const t = (P.t - off) / 1000;
          let k = 1; while (k < all.length - 1 && all[k][0] < t) k++;
          const [ta, xa, ya] = all[k - 1], [tb, xb, yb] = all[k], u = Math.min(1, Math.max(0, (t - ta) / (tb - ta)));
          hov(rowAt(xa + (xb - xa) * u, ya + (yb - ya) * u));
          if (t >= t1) return;
          await c.wait(8);
        }
      };
      // a text caret that blinks on the scene's clock (0.52 s on, 0.52 s off) and starts its cycle again at t
      const blinks = new Map();
      const blink = (el, t) => {
        const was = blinks.get(el); if (was) was.finish();
        blinks.set(el, A(el, [{ opacity: 1 }, { opacity: 1, offset: .5 }, { opacity: 0, offset: .5 }, { opacity: 0 }], t, 1040, 'linear', 'none', { iterations: 9 }));
      };

      // 1. the table loads, then the pointer crosses the rows and comes back to them
      await B(0, 0);
      c.cam([520, 300]);
      await at(0.5); fillRows(app, ALL);
      await at(3.42); await glide([[3.42, 137, 357], [3.8, 1357, 43]]);
      // phones: back from the header's right end, the call count and the call titles stay whole while rows are hovered
      await at(5.22); c.cam([520, 300]);
      await glide([[5.22, 1357, 43], [5.6, 629, 225]]);
      await at(6.0); await glide([[6.0, 629, 225], [6.38, 629, 325]]);
      await at(6.81); await glide([[6.81, 629, 325], [7.18, 629, 424]]);

      // 2. Filter: the plain-language box on top
      await B(1, 7.58);
      // phones: "Data V2", the date range and the whole popover, with Generate inside the frame
      c.cam([520, 330]);
      const flt = q('.dt-filter');
      await glide([[7.58, 629, 424], [7.96, 460, 133]]);
      await at(8.01);
      flt.classList.add('on');
      const pop = c.add(app, popover(), 'none');
      A(pop, [{ opacity: 0, transform: 'translateY(-1px)' }, { opacity: 1, transform: 'none' }], 8.01, 100, 'cubic-bezier(0,0,.2,1)');
      const tx = pop.querySelector('.tx'), crt = pop.querySelector('.crt'), inp = pop.querySelector('.pp-in'), gen = pop.querySelector('.pp-gen');
      blink(crt, 8.01);
      await at(9.33); glide([[9.33, 460, 133], [9.68, 540, 176]], false).catch(() => {});
      // the button's open colors fade once the pointer has left it
      await at(9.48);
      flt.classList.remove('on');
      A(flt, [{ background: '#eef3fc', boxShadow: 'inset 0 0 0 1px #5f8bc0', color: '#1f68c0' }, { background: '#fff', boxShadow: 'inset 0 0 0 1px #e6e6e6', color: '#121212' }], 9.48, 120, 'ease');
      A(flt.querySelector('.i'), [{ color: '#1f68c0' }, { color: '#888' }], 9.48, 120, 'ease');
      // "High priority calls" at an even 42 ms a key; the caret stays lit while keys come and blinks again after
      const words = 'High priority calls';
      for (let i = 1; i <= words.length; i++) {
        const t = 10.03 + (i - 1) * 0.0441;
        await at(t); tx.textContent = words.slice(0, i); inp.classList.add('has'); blink(crt, t);
        if (i === 1) { await at(10.07); gen.classList.add('ok'); }
      }

      // 3. Generate: the words become an ordinary filter chip and the rows re-flow
      await B(2, 11.32);
      glide([[11.32, 540, 176], [11.68, 685, 174]], false).catch(() => {});
      await at(11.63); gen.classList.add('hv');
      await at(11.86);
      pop.remove(); blinks.get(crt).finish();
      app.classList.add('filtered');
      q('.dt-count').textContent = '800 calls';
      const toast = q('.dt-toast');
      toast.classList.add('on');
      // the toast is full size from its first frame and only fades in
      A(toast, [{ opacity: 0 }, { opacity: 1 }], 11.845, 170, 'ease-in-out');
      // the rows that stay glide up to their new places; the ones that drop out fade where they are; the new ones come up
      // from below, those the list had already drawn under the fold from where they were, the rest from just past the edge
      const list = q('.dt-rows'), FLOW = 'cubic-bezier(.4,0,.2,1)';
      const OLD = { br: 14, es: 16, nb: 19, pr2: 20 }, EDGE = { co2: 871, te2: 866, ex2: 861, pa2: 856, br2: 851 };
      ALL.forEach(k => {
        const el = r(k), j = HIGH.indexOf(k);
        if (j < 0) { A(el, [{ opacity: 1 }, { opacity: 0 }], 11.895, 130, 'linear', 'both').finished.then(() => el.remove(), () => {}); return; }
        const y0 = parseFloat(el.style.top), y1 = Y0 + j * PITCH;
        el.style.top = y1.toFixed(1) + 'px';
        if (y0 !== y1) A(el, [{ transform: `translateY(${(y0 - y1).toFixed(1)}px)` }, { transform: 'none' }], 11.845, 430, FLOW);
      });
      HIGH.filter(k => !ALL.includes(k)).forEach(k => {
        const j = HIGH.indexOf(k), y1 = Y0 + j * PITCH, y0 = k in OLD ? Y0 + OLD[k] * PITCH : EDGE[k];
        const el = c.add(list, row(k, j), 'none');
        A(el, [{ transform: `translateY(${(y0 - y1).toFixed(1)}px)` }, { transform: 'none' }], 11.845, 430, FLOW);
      });
      rowsNow = HIGH;
      await at(15.0); toast.classList.remove('on');

      // 4. open a call beside the table
      await B(3, 16.3);
      // phones: the frame of the Filter steps holds (the chip, the call titles and IDs) while the dot wanders to the
      // Call date column and back, then makes one pan to the panel when it opens
      pin = true; c.cam([520, 330]);
      await glide([[16.3, 685, 174], [16.67, 629, 235]]);
      await at(17.04); await glide([[17.04, 629, 235], [17.42, 809, 297]]);
      await at(17.84); await glide([[17.84, 809, 297], [18.2, 378, 223]]);
      r('pr').classList.add('ring');
      await at(18.235);
      openPanel(c, 'pr'); right = 1073;
      // phones: the panel from just above its top edge down to its last field; the toolbar row stays out of the frame
      c.cam([1190, 454]);

      // 5. the arrow keys step to the next calls; the focus ring moves a frame before the row and the panel follow
      await B(4, 20.44);
      r('pr').classList.remove('ring'); r('co').classList.add('ring');
      await at(20.475);
      r('co').classList.add('sel');
      q('.pn-in').innerHTML = panelBody('co');
      await at(22.075);
      r('co').classList.remove('sel', 'ring'); r('te').classList.add('sel', 'ring');
      q('.pn-in').innerHTML = panelBody('te');

      // 6. Ask AI about this call
      await B(5, 23.64);
      const ask = q('.pn-ask');
      // phones: the camera's bottom-right stop, which frames the panel's footer and, once open, the whole Ask AI sheet
      c.cam([1200, 600]);
      // the dot sweeps down to the panel's footer at an even speed; the row hover follows it across the table
      await glide([[23.64, 378, 223], [24.013, 1195, 831]]);
      await at(24.065); c.hover(ask);
      await at(24.125);
      // the button's hover colors fade out as the dialog comes up over it
      c.hover(ask, false); r('te').classList.remove('ring'); over = false; hov(null);
      A(ask, [{ boxShadow: 'inset 0 0 0 1px #8ea9d8', color: '#1b356a' }, { boxShadow: 'inset 0 0 0 1px #e8e8e8', color: '#100b0c' }], 24.125, 110, 'ease-out');
      A(ask.querySelector('.dt-sp'), [{ color: '#1b356a' }, { color: '#111' }], 24.125, 110, 'ease-out');
      app.classList.add('asking');
      q('.sb-ai').classList.add('on');
      const mo = q('.dt-mo'), dim = q('.dt-dim'), cm = q('.mo-cm');
      A(dim, [{ opacity: 0 }, { opacity: 1 }], 24.125, 190, 'ease-out');
      A(mo, [{ opacity: 0, transform: 'translateY(2px)' }, { opacity: 1, transform: 'none' }], 24.125, 200, 'ease-out');
      c.cam([1200, 600]);
      // thinking: the sphere's stripes keep their angle and drift slowly down and to the right (about 2.3 px a second), and
      // the send button's dots rise 4.5 px and fall again in a 1.15 s wave, 0.15 s apart; the composer's caret blinks
      A(q('.globe i'), [{ transform: 'rotate(-50deg) translateY(0)' }, { transform: 'rotate(-50deg) translateY(2.2px)' }], 24.125, 950);
      const BOB = [{ transform: 'translateY(1.8px)', easing: 'ease-in-out' }, { transform: 'translateY(-2.7px)', easing: 'ease-in-out' }, { transform: 'translateY(1.8px)' }];
      qa('.busy i').forEach((d, i) => A(d, BOB, 24.05 + i * .15, 1150, 'linear', 'backwards', { iterations: 2 }));
      blink(q('.mo-cm .crt'), 24.14);
      // the composer takes focus: the pale ring first, then the border turns blue
      await at(24.54);
      A(cm, [
        { boxShadow: 'inset 0 0 0 1px #cbcbcb, 0 0 0 4px rgba(22,119,255,0)' },
        { boxShadow: 'inset 0 0 0 1px #cbcbcb, 0 0 0 4px rgba(22,119,255,.09)', offset: .125 },
        { boxShadow: 'inset 0 0 0 1px #c6ccd8, 0 0 0 4px rgba(22,119,255,.09)', offset: .375 },
        { boxShadow: 'inset 0 0 0 1.25px #8eaae0, 0 0 0 4px rgba(22,119,255,.09)', offset: .625 },
        { boxShadow: 'inset 0 0 0 1.5px #4f86e8, 0 0 0 4px rgba(22,119,255,.09)' }], 24.54, 160);
      cm.classList.add('fo');

      // 7. the answer, with related topics
      await B(6, 25.05);
      mo.classList.add('done');
      A(q('.mo-a'), [{ opacity: 0, transform: 'translateY(7px)' }, { opacity: 1, transform: 'none' }], 25.05, 230, 'ease-out');
      const li = qa('.mo-a li');
      A(li[1], [{ opacity: 0 }, { opacity: 1 }], 25.1, 170, 'ease-out');
      A(li[2], [{ opacity: 0 }, { opacity: 1 }], 25.18, 170, 'ease-out');
      const busy = q('.busy');
      // the busy button shrinks a little as it fades, and the mic comes up under it (the recording dissolves here)
      A(busy, [{ opacity: 1 }, { opacity: 0 }], 25.045, 170, 'linear', 'both');
      A(busy, [{ transform: 'none' }, { transform: 'scale(.8)' }], 25.045, 60, 'ease-out', 'both');
      qa('.busy i').forEach(d => A(d, [{ opacity: 1 }, { opacity: 0 }], 25.045, 80, 'linear', 'both'));
      A(q('.mo-cm .mic'), [{ opacity: 0 }, { opacity: 1 }], 25.08, 100);
      await at(25.24); busy.classList.add('gone');
      await at(25.28);
      q('.mo-sub').textContent = 'What happened on this Technical issue call (Octobe';
      await at(25.4);
    },
  });
})();
