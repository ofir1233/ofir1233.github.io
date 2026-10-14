// Signals: the list of classifiers that run on calls. A paused signal's Auto switch is turned on, then Create opens the
// editor: a name, a folder from the menu, a description and an item with a name, a key and a description, a second
// item, and Save puts the new signal at the top of the list.
(() => {
  if (!window.LX) return;
  const { ic } = LX;
  LX.addIcons({
    sgHome: 'M4 10.3L12 4l8 6.3V19a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19z',
    sgGrid: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM15.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5z',
    sgApps: 'M5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3A1.5 1.5 0 0 1 5.5 4zM15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3A1.5 1.5 0 0 1 15.5 4zM5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3A1.5 1.5 0 0 1 5.5 14zM17 14v6M14 17h6',
    sgFolder: 'M4 7.5A1.5 1.5 0 0 1 5.5 6h4l2 2h7A1.5 1.5 0 0 1 20 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z',
    sgCopy: 'M10 9h8.5A1.5 1.5 0 0 1 20 10.5V19a1.5 1.5 0 0 1-1.5 1.5H10A1.5 1.5 0 0 1 8.5 19v-8.5A1.5 1.5 0 0 1 10 9zM15.5 9V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3',
    sgDots: 'M12 5.5h.01M12 12h.01M12 18.5h.01',
    sgHist: 'M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4h4M12 8v4.3l2.8 1.8',
    sgTrash: 'M4.5 6.5h15M9.5 6.5V4.8a.8.8 0 0 1 .8-.8h3.4a.8.8 0 0 1 .8.8v1.7M6.5 6.5l.9 12.6a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-12.6',
    sgUpc: 'M6 15l6-6 6 6',
  });
  const SPARK = '<svg class="sg-sp" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.2 7.3 7.3 2.2-7.3 2.2L12 21.5l-2.2-7.3L2.5 12l7.3-2.2z"/></svg>';
  const STAR = '<svg class="sg-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>';
  const GRIP = '<svg class="sg-grip" viewBox="0 0 6 10" aria-hidden="true"><circle cx="1" cy="1" r="1"/><circle cx="5" cy="1" r="1"/><circle cx="1" cy="5" r="1"/><circle cx="5" cy="5" r="1"/><circle cx="1" cy="9" r="1"/><circle cx="5" cy="9" r="1"/></svg>';
  const GRAB = '<svg class="sg-grab" viewBox="0 0 8 8" aria-hidden="true"><path d="M7 2L2 7M7 5L5 7"/></svg>';

  // the sidebar: Main and Intelligence scroll in the nav, the DEV pages sit in their own block under it
  const NAV = [['h', 'Main'], ['sgHome', 'Chat'], ['news', 'News'], ['db', 'Data'], ['db', 'Data V2'], ['sgGrid', 'Topics'], ['report', 'Reports'], ['sgApps', 'Mini Apps'],
    ['h', 'Intelligence'], ['term', 'Signals'], ['alert', 'Alerts'], ['shieldPlain', 'Compliance'], ['shield', 'Agent Evaluation'], ['book', 'Knowledge']];
  const DEV = `<div class="sg-dev">${[['news', 'News · Directions'], ['video', 'Demos'], ['story', 'Storybook']].map(([i, l]) => `<div class="sb-i dev" data-nav="${l}">${i === 'story' ? LX.mark('sm') : ic(i)}<span>${l}</span><em>DEV</em></div>`).join('')}</div>`;
  const shell = () => LX.shell({ active: 'Signals', nav: NAV }).replace('<div class="sb-user">', DEV + '<div class="sb-user">');

  const ST = { a: 'Active', t: 'Triggered', p: 'Paused', e: 'Error' };
  // [auto on, name, status, source chip, id, runs, created at]
  const SIG = [
    [1, 'Agent Introduction Engine', 'a', 'ai', '1f0254bf-00000000b4c5', 14, '12/01/2025 11:36:26'],
    [1, 'Billing Dispute Classifier', 't', 'ai', '2a3b4c5d-00000000c6d7', 31, '12/02/2025 09:14:52'],
    [0, 'Active Data Source Engine', 'p', 'sys', '3c4d5e6f-00000000d8…', 8, '12/03/2025 14:07:33'],
    [1, 'Junk Filter Separator', 'a', '', '4d5e6f70-00000000e9f0', 22, '12/04/2025 10:55:18'],
    [1, 'Escalation Spike Detector', 't', 'ai', '5e6f7081-00000000f0a1', 7, '12/05/2025 08:22:44'],
    [1, 'CSAT Drop Alert', 'a', 'sys', '6f708192-000000000b1c', 5, '12/06/2025 16:43:09'],
    [0, 'Churn Risk Signal', 'p', 'ai', '70819203-000000001c2d', 19, '12/07/2025 11:18:57'],
    [1, 'Compliance Keyword Monitor', 'a', 'sys', '819203a4-000000002d…', 44, '12/08/2025 13:36:21'],
    [1, 'Peak Hour Staffing Signal', 'a', '', '9203a4b5-000000003e4f', 26, '12/09/2025 07:51:30'],
    [0, 'Agent Silence Pattern Detector', 'e', 'ai', 'a3b4c5d6-000000004f50', 11, '12/10/2025 15:09:44'],
    [1, 'New Product Mention Tracker', 'a', 'sys', 'b4c5d6e7-0000000050…', 38, '12/11/2025 09:27:16'],
    [1, 'Repeat Caller Identifier', 't', '', 'c5d6e7f8-000000006172', 17, '12/12/2025 12:44:08'],
    [1, 'Resolution Rate Anomaly', 'a', 'ai', 'd6e7f809-000000007283', 9, '12/13/2025 10:33:55'],
    [0, 'Sentiment Reversal Signal', 'p', 'sys', 'e7f8091a-000000008394', 6, '12/14/2025 14:22:39'],
    [1, 'Upsell Opportunity Detector', 'a', '', 'f809102b-0000000094a5', 51, '12/15/2025 08:47:22'],
  ];
  // the new signal, with a synthetic id in the same pattern as the others
  const NEW = [1, 'Refund Request Spike', 'a', '', '0a1b2c3d-000000000a01', 0, '10/12/2026 09:05:33'];
  const Y0 = 51, PITCH = 36.87;
  const chip = k => k === 'ai' ? `<span class="sg-chip ai">${SPARK}AI</span>` : k === 'sys' ? `<span class="sg-chip sys">${ic('shieldPlain')}System</span>` : '';
  const row = ([on, name, st, src, id, runs, at], i) => `<div class="sg-r${i % 2 ? ' z' : ''}" style="top:${(Y0 + i * PITCH).toFixed(2)}px">
      <span class="sg-n">${i + 1}</span><span class="sg-tg${on ? ' on' : ''}"><i></i></span>${ic('sgDots', 'sg-act')}
      <span class="sg-name">${name}</span><span class="sg-st ${st}">${ST[st]}</span>
      <span class="sg-id ${src || 'none'}">${chip(src)}<span class="t${id.endsWith('…') ? ' tr' : ''}">${id}</span>${ic('sgCopy')}</span>
      <span class="sg-runs">${runs}</span><span class="sg-at">${at}</span></div>`;
  const TABS = [['All', 15], ['Compliance', 2], ['Customer Health', 6], ['Operations', 5], ['Agent Quality', 2]];
  const list = () => `<section class="sg-list">
      <header class="sg-top"><h3>Signals</h3>${ic('right', 'sg-crumb')}<span class="sg-total">Total signals <b>15</b></span><span class="sg-quota"><i><i></i></i>9 / 10</span>
        <span class="sg-search">${ic('search')}Search signals...</span><span class="sg-ver"><span class="on">V1</span><span>V2</span></span><span class="sg-create">${ic('plus')}Create</span></header>
      <div class="sg-tabs">${ic('sgFolder', 'sg-fold')}${TABS.map(([l, n], i) => `<span class="${i ? '' : 'on'}" data-t="${l}">${l}<em>${n}</em></span>`).join('')}</div>
      <div class="sg-tbl"><div class="sg-th"><span style="left:68px">Auto</span><span style="left:149px">Actio…</span><span style="left:230px">Name</span><span style="left:505px">Status</span>
        <span style="left:622px">Signal ID</span><span style="left:898px">Runs</span><span style="left:996px">Created at</span>${[130, 486, 603, 878, 977, 1148].map(x => `<i style="left:${x}px"></i>`).join('')}</div>
        <div class="sg-rows"></div></div>
      <div class="sg-toast">Signal updated successfully</div>
    </section>`;
  const FOLDERS = ['Compliance', 'Customer Health', 'Operations', 'Agent Quality'];
  const ITEM_PH = 'Description Example : Sentiment of the call : Positive, Neutral, or Negative. Use \'Negative\' if the customer is very unhappy, \'Neutral\' if no emotions are expressed, and \'Positive\' if the customer is happy.';
  const item = n => `<div class="sg-item"><div class="it-h">${GRIP}<b>Item ${n}</b>${ic('sgTrash', 'it-del')}${ic('down', 'it-chev')}</div>
      <div class="it-b"><span class="sg-in it-name"><span class="tx"></span><span class="ph">Name</span></span><span class="sg-in it-key"><span class="tx"></span><span class="ph">Key</span></span>
        <span class="sg-in it-type">STRING${ic('down')}</span><span class="sg-in sg-ta it-desc"><span class="tx"></span><span class="ph">${ITEM_PH}</span>${GRAB}</span></div></div>`;
  const editor = () => `<section class="sg-ed">
      <header class="sg-top"><span class="ed-back">${ic('left')}Signals</span>${ic('right', 'ed-crumb')}<span class="ed-title"><span class="tx"></span><span class="ph">Signal name...</span></span>
        <span class="ed-hist">${ic('sgHist')}History</span><span class="ed-imp">Import Configuration</span><span class="ed-save">Save</span></header>
      <div class="ed-card"><span class="sg-in ed-name"><span class="tx"></span><span class="ph">Signal name...</span></span>
        <span class="sg-in ed-folder">${ic('sgFolder')}<span class="v">Folder...</span><i></i></span><span class="ed-model">${STAR}Yoko-1${ic('down')}</span>
        <hr><span class="sg-in sg-ta ed-desc"><span class="tx"></span><span class="ph">Description / Context — describe what this signal should detect or analyze...</span>${GRAB}</span></div>
      <div class="ed-items">${item(1)}<div class="ed-add">${ic('plus')}Add Item</div></div>
      <div class="ed-menu">${FOLDERS.map(f => `<div data-f="${f}">${f}</div>`).join('')}<hr><div class="nf">${ic('plus')}New folder</div></div>
    </section>`;
  const html = () => `${shell()}${list()}${editor()}`;

  LX.scene('signals', {
    cls: 'sc-sg',
    html,
    cursor: [137, 520],
    hold: 3400,
    times: [0, 5.4, 7.12, 11.76, 13.96, 19.76, 31.08, 33.64, 37.2],
    beats: [
      'The Signals list shows each signal\'s status and source.',
      'A paused signal is switched on with its Auto toggle.',
      'Create opens a new signal, and its name is typed.',
      'The folder it belongs in is picked from a menu.',
      'What the signal should detect is written in plain words.',
      'An item gets a name, a key and a description.',
      'A second item is added, then the signal is saved.',
      'The new signal lands at the top of the list.',
    ],
    async run(c) {
      const { q, qa, app } = c;
      // the script follows the recording's clock: at(t) waits until t seconds into the take
      let off = 0;
      const at = t => c.wait(Math.max(0, t * 1000 + off - c.P.t));
      // a beat entered by a jump starts the take's clock over; in normal play small delays are not carried forward
      const B = async (i, t0) => { await at(t0); await c.beat(i); const d = c.P.t - t0 * 1000; off = Math.abs(d) > 250 ? d : 0; };
      // type at the recording's steady pace, one character every ms from t0
      const typeAt = async (els, text, t0, ms, onChar) => {
        els = [].concat(els);
        els.forEach(e => e.parentElement.classList.add('has'));
        for (let i = 1; i <= text.length; i++) { await at(t0 + (i - 1) * ms / 1000); els.forEach(e => { e.textContent = text.slice(0, i); }); if (onChar) onChar(i); }
      };
      // a click at t; what it changes lands at the recorded time t1 (absolute, so short waits do not add up)
      const press = async (el, t, t1) => { await at(t); await c.click(el, { after: 0 }); await at(t1); };
      const focus = (el, on = true) => { qa('.fo').forEach(e => e !== el && e.classList.remove('fo')); if (el) el.classList.toggle('fo', on); };
      const rows = () => qa('.sg-r');
      // the name link underlines only while the pointer is on it
      const hov = (i, ul = true) => rows().forEach((r, k) => { r.classList.toggle('hv', k === i); r.classList.toggle('ul', k === i && ul); });
      const fill = data => { q('.sg-rows').innerHTML = data.map(row).join(''); };

      // 1. the list loads; the pointer sweeps down the names
      await B(0, 0);
      await at(0.52); fill(SIG);
      await at(2.96);
      // phones: from the sidebar to the list, framing the names, their status and the AI or System chip
      c.cam([730, 420]);
      let m = c.move([575, 229], { d: 360 });
      for (const [t, i] of [[3.04, 6], [3.12, 5], [3.16, 4], [3.2, 3], [3.24, 2], [3.28, 1]]) { await at(t); hov(i); }
      await m;
      await at(3.76);
      m = c.move([576, 340], { d: 360 });
      for (const [t, i] of [[3.84, 2], [3.92, 3], [4.04, 4]]) { await at(t); hov(i); }
      await m;
      await at(4.6);
      m = c.move([575, 414], { d: 320 });
      for (const [t, i] of [[4.64, 5], [4.84, 6]]) { await at(t); hov(i); }
      await m;

      // 2. a paused signal's Auto switch goes on
      await B(1, 5.4);
      // phones: the Auto column beside the names, clear of the sidebar
      c.cam([506, 420]);
      const tg = rows()[2].querySelector('.sg-tg');
      m = c.move(tg, { d: 330, x: .5 });
      for (const [t, i] of [[5.48, 5], [5.56, 4], [5.64, 3], [5.72, 2]]) { await at(t); hov(i, false); }
      await m;
      await press(tg, 5.76, 5.8);
      q('.sg-toast').classList.add('on');
      await at(5.82);
      tg.classList.add('on');
      c.anim(tg.firstElementChild, [{ transform: 'translateX(-15px)' }, { transform: 'none' }], { duration: 130, easing: 'ease-out' });
      c.anim(tg, [{ backgroundColor: '#d0d0d0' }, { backgroundColor: '#1a72f4' }], { duration: 130, easing: 'ease-out' });

      // 3. Create: the editor, and the signal's name
      await B(2, 7.12);
      const create = q('.sg-list .sg-create');
      m = c.move(create, { d: 360, x: .53 });
      await at(7.16); hov(0, false);
      await at(7.24); hov(-1);
      await m;
      await press(create, 7.56, 7.6);
      app.classList.add('editing');
      q('.sg-toast').classList.remove('on');
      c.cam([600, 300]);
      await at(9.2);
      const title = q('.ed-title');
      await c.move([478, 43], { d: 290 });
      await press(title, 9.52, 9.56);
      focus(title);
      await typeAt([q('.ed-title .tx'), q('.ed-name .tx')], 'Refund Request Spike', 10.28, 46);

      // 4. a folder from the menu
      await B(3, 11.76);
      const folder = q('.ed-folder');
      c.cam([900, 300]);
      m = c.move([968, 123], { d: 340 });
      await press(folder, 12.08, 12.12);
      await m;
      app.classList.add('menu');
      await at(12.2); focus(null);
      await at(12.88);
      m = c.move([942, 194], { d: 320 });
      const opt = f => q(`.ed-menu [data-f="${f}"]`);
      await at(12.96); c.hover(opt('Compliance'));
      await at(13.12); c.hover(opt('Compliance'), false); c.hover(opt('Customer Health'));
      await m;
      await press(opt('Customer Health'), 13.24, 13.28);
      app.classList.remove('menu'); app.classList.add('picked');
      folder.querySelector('.v').textContent = 'Customer Health';

      // 5. what the signal should detect
      await B(4, 13.96);
      const desc = q('.ed-desc');
      c.cam([810, 300]);
      await c.move([849, 208], { d: 360 });
      await press(desc, 14.4, 14.44);
      focus(desc);
      await typeAt(q('.ed-desc .tx'), 'Flag calls where a customer asks for a refund, and why, so a spike shows up the same day.', 15.08, 47.3);

      // 6. the first item: open it, then its name, key and description
      await B(5, 19.76);
      const it = q('.sg-item');
      m = c.move([1136, 308], { d: 380 });
      await press(it.querySelector('.it-chev'), 20.12, 20.16);
      await m;
      it.classList.add('open');
      c.anim(it.querySelector('.it-chev'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }], { duration: 120, easing: 'ease-out' });
      await at(20.24); focus(null);
      await at(21.04);
      const nm = it.querySelector('.it-name');
      c.cam([700, 400]);
      await c.move([657, 357], { d: 360 });
      await press(nm, 21.48, 21.52);
      focus(nm);
      await typeAt([nm.querySelector('.tx'), it.querySelector('.it-h b')], 'Refund reason', 22.16, 46.7);
      await at(23.32);
      const key = it.querySelector('.it-key');
      await c.move([658, 394], { d: 320 });
      await press(key, 23.68, 23.72);
      focus(key);
      await typeAt(key.querySelector('.tx'), 'refund_reason', 24.24, 56.7);
      await at(25.48);
      const idesc = it.querySelector('.it-desc');
      c.cam([960, 400]);
      await c.move([957, 395], { d: 400 });
      await press(idesc, 25.92, 25.96);
      focus(idesc);
      await typeAt(idesc.querySelector('.tx'), 'Main reason the customer gives: late delivery, damaged item, billing error or other.', 26.68, 46.7);

      // 7. a second item, then Save
      await B(6, 31.08);
      const add = q('.ed-add');
      c.cam([790, 420]);
      m = c.move([849, 495], { d: 300 });
      await at(31.4); c.hover(add);
      await press(add, 31.44, 31.48);
      await m;
      add.insertAdjacentHTML('beforebegin', item(2));
      add.classList.add('dn');
      await at(31.56); c.hover(add, false); add.classList.remove('dn'); focus(null);
      await at(32.8);
      const save = q('.ed-save');
      await c.move(save, { d: 360, x: .4 });
      await press(save, 33.2, 33.24);

      // 8. back on the list, the new signal on top
      await B(7, 33.64);
      app.classList.remove('editing', 'picked');
      app.classList.add('saved');
      q('.sg-rows').innerHTML = '';
      q('.sg-total b').textContent = '16';
      q('.sg-tabs [data-t="All"] em').textContent = '16';
      q('.sg-tabs [data-t="Customer Health"] em').textContent = '7';
      c.cam([600, 300]);
      await at(33.76); c.hover(q('.sg-list .sg-create'));
      await at(33.8); fill([NEW, ...SIG]);
    },
  });
})();
