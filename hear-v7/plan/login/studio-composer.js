// The composer: ONE writing component for the whole system (see studio-composer.css for its states and looks).
//   composer(element, options) builds the field inside `element` and returns a small handle:
//     { el, ta, has(), focused(), set(text), clear(), busy(on), focus(), nudge() }
//   options: label, placeholder, ideas (typed out one after another while the field rests), at (groups for the "@" menu),
//            slash (groups for the "/" menu), slashLabel, sendLabel, hintEmpty, hintText, busyHint, up (menus open upward),
//            onSend(text, handle), onCancel(handle), onChange(handle), onKey(event, handle)
// A group is { title, items: [[name, note, badge, textToInsert]] }.
// Keys: Enter sends · Shift+Enter new line · "@" and "/" open their menus · ↑ ↓ move · Enter or Tab choose · Esc closes, then leaves the field.
// Nothing here talks to a server: sending, listening and the menus are the design of the interaction, not the product.
window.composer = function (el, o) {
  const ICON = {
    at: '<svg class="i" viewBox="0 0 18 18"><circle cx="9" cy="9" r="2.6"/><path d="M11.6 6.6v3.2a1.7 1.7 0 0 0 3.4 0V9a6 6 0 1 0-2.4 4.8"/></svg>',
    slash: '<svg class="i" viewBox="0 0 18 18"><rect x="2.8" y="2.8" width="12.4" height="12.4" rx="3.2"/><path d="M10.4 5.8 7.6 12.2"/></svg>',
    mic: '<svg class="i" viewBox="0 0 18 18"><rect x="6.6" y="2.2" width="4.8" height="8.4" rx="2.4"/><path d="M3.8 8.6a5.2 5.2 0 0 0 10.4 0M9 13.8v2.2"/></svg>'
  };
  el.innerHTML =
    '<div class="cmp__in"><div class="cmp__hl" aria-hidden="true"></div>' +
    '<textarea rows="1" spellcheck="false" autocomplete="off" aria-label="' + o.label + '"></textarea>' +
    '<div class="cmp__ph" aria-hidden="true"><span></span><i></i></div></div>' +
    '<div class="cmp__bar">' +
    '<button type="button" class="tool" data-tool="at" aria-label="Point at your data" title="Point at your data  @">' + ICON.at + '</button>' +
    '<button type="button" class="tool" data-tool="slash" aria-label="' + o.slashLabel + '" title="' + o.slashLabel + '  /">' + ICON.slash + '</button>' +
    '<span class="cmp__hint" aria-hidden="true"></span>' +
    // voice and send share ONE slot at the right edge (his note 11-19: the mic "sits in a strange place" when a hidden send kept a slot
    // beside it). At rest the mic sits flush right; with text, send takes its place in the same spot, as in the lab's Ask field.
    '<span class="cmp__act"><button type="button" class="tool mic" data-tool="mic" aria-label="Speak" title="Speak">' + ICON.mic + '</button>' +
    '<button type="button" class="send" aria-label="' + o.sendLabel + '" title="' + o.sendLabel + '  ↵"></button></span></div>' +
    '<div class="cmp__err" role="alert" hidden><span></span><button type="button" class="cmp__retry">Retry</button></div>' +
    '<div class="menu' + (o.up ? ' menu--up' : '') + '" role="listbox" hidden></div>';

  const ta = el.querySelector('textarea'), hl = el.querySelector('.cmp__hl'), ph = el.querySelector('.cmp__ph span'),
    hint = el.querySelector('.cmp__hint'), menu = el.querySelector('.menu'), send = el.querySelector('.send'), errBox = el.querySelector('.cmp__err'), tools = {};
  el.querySelectorAll('.tool').forEach(t => { tools[t.dataset.tool] = t });
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const names = (o.at || []).flatMap(g => g.items.map(x => x[0])).sort((a, b) => b.length - a.length);
  const TOKEN = names.length ? new RegExp('@(' + names.join('|') + ')', 'g') : null;      // the names are plain words, nothing to escape
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  let busy = false, listening = false, open = null, sel = 0, items = [], trig = null, twTimer = 0, twAt = 0, ready = false, retry = null;

  const has = () => ta.value.trim().length > 0;
  const focused = () => document.activeElement === ta;
  const resting = () => !focused() && !has() && !busy && !listening && !open && !(o.awake && o.awake());      // o.awake: the surroundings are in use (say, the ideas under the field)

  function hints() {
    if (listening) hint.innerHTML = '<span class="cmp__wave"><i></i><i></i><i></i><i></i><i></i></span>' + (o.listenHint || 'Listening…  <kbd>esc</kbd> stop');
    else if (busy) hint.innerHTML = o.busyHint || '';
    else hint.innerHTML = has() ? o.hintText : o.hintEmpty;
  }
  function paint() {
    const t = esc(ta.value);
    hl.innerHTML = (TOKEN ? t.replace(TOKEN, '<mark>$&</mark>') : t) + '​';
    hl.scrollTop = ta.scrollTop;
    el.classList.toggle('has-text', has());
    canSend();
    hints();
    if (ready && o.onChange) o.onChange(api);      // never during set-up: the caller does not hold the handle yet
  }

  // At rest the field types its own examples, one after another: it shows what can be asked without a word of explanation.
  function typewriter() {
    clearTimeout(twTimer);
    el.classList.remove('is-rest');
    if (!resting() || calm || !o.ideas || !o.ideas.length) { ph.textContent = listening ? 'Listening…' : o.placeholder; return }
    el.classList.add('is-rest');
    let text = o.ideas[twAt % o.ideas.length], i = 0, dir = 1;
    (function step() {
      if (!resting()) return;
      i += dir; ph.textContent = text.slice(0, i);
      if (dir > 0 && i >= text.length) { dir = -1; twTimer = setTimeout(step, 2000) }
      else if (dir < 0 && i <= 0) { twAt++; text = o.ideas[twAt % o.ideas.length]; dir = 1; twTimer = setTimeout(step, 450) }
      else twTimer = setTimeout(step, dir > 0 ? 36 + (text[i - 1] === ' ' ? 34 : 0) : 13);
    })();
  }

  // The menus. One selection for the keyboard and the mouse; choosing writes into the text, exactly where the caret is.
  // there is something to send: words beyond a lone "@" or "/", and no menu waiting for a choice
  function canSend() { el.classList.toggle('can-send', /[^\s@\/]/.test(ta.value.replace(/(^|\s)[@\/]\S*$/, ''))) }      // send stays while a menu is open, if there are words besides the trigger (critic round 6)
  function closeMenu() { open = null; trig = null; menu.hidden = true; el.classList.remove('is-menu'); tools.at.classList.remove('is-on'); tools.slash.classList.remove('is-on'); canSend() }
  function mark() {
    const bs = menu.querySelectorAll('button'), list = menu.querySelector('.menu__list');
    bs.forEach((b, k) => { b.classList.toggle('is-sel', k === sel); b.setAttribute('aria-selected', k === sel) });
    const b = bs[sel]; if (!b || !list) return;
    if (b.offsetTop < list.scrollTop + 26) list.scrollTop = b.offsetTop - 26;
    else if (b.offsetTop + b.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = b.offsetTop + b.offsetHeight - list.clientHeight;
  }
  // The menu never leaves the window: its list is only as tall as the room under (or over) the field, and scrolls inside.
  function fitMenu() {
    const list = menu.querySelector('.menu__list'); if (!list) return;
    const f = el.getBoundingClientRect(), z = f.width / el.offsetWidth || 1;
    // o.roomBottom: the menu lives inside a surface (the plate) and must end 16 px above that surface's own bottom edge
    const room = o.roomBottom ? (o.roomBottom() - f.bottom) / z - 14 - 16 - (menu.offsetHeight - list.offsetHeight)
                              : (o.up ? f.top : innerHeight - f.bottom) / z - (menu.offsetHeight - list.offsetHeight) - 40;
    let max = Math.max(110, Math.min(312, room)); list.style.maxHeight = max + 'px';
    // never end on a group title: if the last thing that fits whole is a heading, stop above it (critic round 5)
    const kids = [...list.children]; let last = null; for (const k of kids) { if (k.offsetTop + k.offsetHeight <= max + .5) last = k; else break }
    if (last && last.tagName === 'H5') list.style.maxHeight = last.offsetTop + 'px';
  }
  function openMenu(kind, q) {
    const groups = kind === 'at' ? o.at : o.slash; q = (q || '').toLowerCase();
    items = []; let html = '';
    for (const g of groups || []) {
      const its = g.items.filter(x => x[0].toLowerCase().includes(q)).slice(0, q ? 5 : (g.show || 2));
      if (!its.length) continue;
      html += '<h5>' + g.title + '</h5>' + its.map(x => { items.push({ kind, x }); return '<button type="button" role="option" data-k="' + (items.length - 1) + '"><i>' + (x[2] || x[0][0]) + '</i>' + x[0] + (x[1] ? '<small>' + x[1] + '</small>' : '') + '</button>' }).join('');
    }
    if (!items.length) { closeMenu(); return }
    menu.innerHTML = '<div class="menu__list">' + html + '</div><footer><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>↵</kbd> choose</span><span><kbd>esc</kbd> close</span></footer>';
    if (open !== kind) sel = 0;
    sel = Math.min(sel, items.length - 1); open = kind; menu.hidden = false; el.classList.add('is-menu'); canSend();
    tools.at.classList.toggle('is-on', kind === 'at'); tools.slash.classList.toggle('is-on', kind === 'slash');
    fitMenu(); [130, 260, 400].forEach(ms => setTimeout(() => { if (open) fitMenu() }, ms));      // again while the plate around the field settles
    mark();
  }
  function pick(k) {
    const it = items[k]; if (!it) return;
    const v = ta.value, s = trig ? trig.start : ta.selectionStart, e = trig ? trig.end : ta.selectionEnd;
    let pre = v.slice(0, s);
    if (pre && !/\s$/.test(pre)) pre += ' ';
    const ins = it.kind === 'at' ? '@' + it.x[0] + ' ' : (it.x[3] !== undefined ? it.x[3] : it.x[0] + ' ');
    ta.value = pre + ins + v.slice(e);
    closeMenu(); ta.focus(); ta.setSelectionRange((pre + ins).length, (pre + ins).length); paint();
  }
  function findTrigger() {      // "@" or "/" at the start or after a space, and what has been typed after it (one space allowed: "Team Cedar")
    const c = ta.selectionStart, m = ta.value.slice(0, c).match(/(^|\s)([@\/])([^\s@\/]*(?: [^\s@\/]*)?)$/);
    if (m && m[3].length <= 18 && (m[2] === '@' ? o.at : o.slash)) { trig = { start: c - m[3].length - 1, end: c }; openMenu(m[2] === '@' ? 'at' : 'slash', m[3]) }
    else closeMenu();
  }
  function toggleMic() { listening = !listening; el.classList.toggle('is-listening', listening); tools.mic.classList.toggle('is-on', listening); closeMenu(); hints(); typewriter() }
  function nudge() { el.classList.remove('is-nudge'); void el.offsetWidth; el.classList.add('is-nudge'); setTimeout(() => el.classList.remove('is-nudge'), 360) }
  function unfail() { retry = null; errBox.hidden = true; el.classList.remove('is-error') }
  function submit() {
    if (busy) { if (o.onCancel) o.onCancel(api); return }
    unfail();
    if (!has() || !/[^\s@\/]/.test(ta.value)) { nudge(); ta.focus(); return }
    if (listening) toggleMic();
    o.onSend(ta.value.trim(), api);
  }

  // Pressing a button of the field never takes the caret out of the text.
  el.addEventListener('pointerdown', e => { if (e.target.closest('button')) e.preventDefault() });
  el.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) { if (!busy) ta.focus(); return }
    if (b === send) { submit(); return }
    if (b.classList.contains('cmp__retry')) { const r = retry; unfail(); if (r) r(api); return }
    if (b.dataset.k !== undefined) { pick(+b.dataset.k); return }
    if (busy) return;
    if (b.dataset.tool === 'mic') { toggleMic(); ta.focus(); return }
    if (open === b.dataset.tool) { closeMenu(); return }
    ta.focus(); trig = null; openMenu(b.dataset.tool, '');
  });
  menu.addEventListener('pointermove', e => { const b = e.target.closest('button'); if (b && +b.dataset.k !== sel) { sel = +b.dataset.k; mark() } });
  ta.addEventListener('input', () => { if (el.classList.contains('is-error')) unfail(); paint(); findTrigger() });
  ta.addEventListener('scroll', () => { hl.scrollTop = ta.scrollTop });
  ta.addEventListener('focus', () => { el.classList.add('is-focus'); typewriter(); hints(); if (o.onChange) o.onChange(api) });
  ta.addEventListener('blur', () => setTimeout(() => { if (focused()) return; el.classList.remove('is-focus'); closeMenu(); typewriter(); if (o.onChange) o.onChange(api) }, 0));
  ta.addEventListener('keydown', e => {
    if (busy) { if (e.key === 'Escape' && o.onCancel) o.onCancel(api); return }
    if (open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length; mark(); return }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(sel); return }
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return }
    }
    if (e.key === 'Escape') { if (listening) toggleMic(); else ta.blur(); return }
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(); return }
    if (o.onKey) o.onKey(e, api);
  });

  // ── the border follows the pointer (see .field.is-glow in the CSS; ported from the lab's ChatInput) ──
  const CORAL = [64, 172, 255], BLUE = [10, 128, 236], NEAR = 120;      // "אני רוצה כחול לא כתום" (11-19): the light is a clear sky blue (the name CORAL stays: the resting colour), a deeper blue over a tool
  let at = null, gRaf = 0, onTool = false, blend = 0, tw = null, twRaf = 0, leaveT = 0;
  function glowPaint() {
    if (!at) return;
    const r = el.getBoundingClientRect();
    const quiet = focused() || has() || busy || listening || !r.width || el.classList.contains('is-error');
    const dx = Math.max(0, r.left - at.x, at.x - r.right), dy = Math.max(0, r.top - at.y, at.y - r.bottom);
    const i = onTool ? 1 : Math.max(0, 1 - Math.hypot(dx, dy) / NEAR);
    if (quiet) { el.classList.remove('is-glow'); return }
    if (i <= 0 && !el.classList.contains('is-glow')) return;      // once lit, stay lit and fade to zero: switching the mode off is what flickered
    const c = CORAL.map((v, k) => Math.round(v + (BLUE[k] - v) * blend));
    el.style.setProperty('--gx', ((at.x - r.left) / r.width * 100).toFixed(2) + '%');
    el.style.setProperty('--gy', ((at.y - r.top) / r.height * 100).toFixed(2) + '%');
    el.style.setProperty('--gi', i.toFixed(3));
    el.style.setProperty('--ga', Math.sqrt(i).toFixed(3));      // the colour's strength rises faster than the reach, so it never sits half-mixed into the grey
    el.style.setProperty('--gc', c.join(','));
    el.classList.add('is-glow');
  }
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    at = { x: e.clientX, y: e.clientY };
    if (!gRaf) gRaf = requestAnimationFrame(() => { gRaf = 0; glowPaint() });
  }, { passive: true });
  function blendTo(to, ms) {      // coral → blue over a tool (0.28 s), back on leaving (0.4 s), eased out
    tw = { from: blend, to, ms, t0: performance.now() };
    if (!twRaf) twRaf = requestAnimationFrame(function step(now) {
      const k = Math.min(1, (now - tw.t0) / tw.ms); blend = tw.from + (tw.to - tw.from) * (1 - (1 - k) * (1 - k)); glowPaint();
      twRaf = k < 1 ? requestAnimationFrame(step) : 0;
    });
  }
  el.querySelectorAll('.tool').forEach(t => {
    t.addEventListener('pointerenter', () => { clearTimeout(leaveT); onTool = true; blendTo(1, 280) });
    t.addEventListener('pointerleave', () => { leaveT = setTimeout(() => { onTool = false; blendTo(0, 400) }, 60) });
  });
  ta.addEventListener('focus', () => el.classList.remove('is-glow'));
  ta.addEventListener('blur', () => setTimeout(glowPaint, 0));

  const api = {
    el, ta, has, focused, nudge,
    focus() { ta.focus() },
    set(text) { ta.value = text; closeMenu(); paint(); ta.focus(); ta.setSelectionRange(text.length, text.length) },
    clear() { ta.value = ''; closeMenu(); paint(); typewriter() },
    rest() { typewriter() },
    // Something went wrong: the field unlocks, the text stays exactly as it was, one plain line says what happened, and Retry tries again.
    fail(message, onRetry) { api.busy(false); retry = onRetry || null; errBox.querySelector('span').textContent = message; errBox.querySelector('.cmp__retry').hidden = !onRetry; errBox.hidden = false; el.classList.add('is-error'); ta.focus() },      // look again at whether to type the examples (the caller's surroundings changed)
    busy(on) { busy = on; el.classList.toggle('is-busy', on); ta.readOnly = on; if (on) { closeMenu(); if (listening) toggleMic() } hints(); typewriter() }
  };
  paint(); typewriter(); ready = true;
  return api;
};
