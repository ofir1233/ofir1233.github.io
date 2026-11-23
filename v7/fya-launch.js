/* FYI case study, layer: Going public.
   The formats are views of the event. While what is printed equals what the event says, the plates sit in register.
   Move the doors: the event changes at once, the three sheets slip one after another and get an "Out of date" slip.
   Refresh: sheet by sheet, each takes the new time, its plates close and its slip leaves. Moving the doors back does the same, because the print is true again. */
(function () {
  'use strict';
  var root = document.getElementById('fya-launch');
  if (!root) return;
  var press = root.querySelector('[data-fl-press]'),
    sheets = [].slice.call(root.querySelectorAll('.fl-sheet')),
    move = root.querySelector('[data-fl-move]'),
    refresh = root.querySelector('[data-fl-refresh]'),
    tt = root.querySelector('[data-fl-tt]'),
    st = root.querySelector('[data-fl-st]'),
    sub = root.querySelector('[data-fl-sub]');
  if (!press || !sheets.length || !move || !refresh) return;

  var still = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SLIP_LEAD = 40, SLIP_GAP = 90, SNAP_GAP = 90, REFRESH_GAP = 110; /* the last sheet lands inside 800 ms */
  var S = { event: '9 PM', printed: '9 PM' }, timers = [];

  function later(fn, ms) { if (still || !ms) { fn(); return; } timers.push(setTimeout(fn, ms)); }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function nb(s) { return s.replace(' ', ' '); }

  function status() {
    var out = S.event !== S.printed;
    press.classList.toggle('is-out', out);
    if (st) st.textContent = out ? 'Out of date' : 'Up to date';
    if (sub) sub.textContent = out ? 'The event says ' + S.event : 'Doors ' + S.printed + ' on all three';
    refresh.disabled = !out;
    move.classList.toggle('is-quiet', out);
    move.textContent = S.event === '9 PM' ? 'Move doors to 10 PM' : 'Move doors back to 9 PM';
  }
  function print(sheet) {
    var t = sheet.querySelector('[data-fl-time]');
    if (t) t.textContent = nb(S.printed);
    sheet.classList.remove('is-out');
  }
  /* bring every sheet to what the state says, one after another */
  function settle(lead, gap, statusLast) {
    clear();
    var out = S.event !== S.printed;
    sheets.forEach(function (sheet, i) {
      later(function () { if (out) sheet.classList.add('is-out'); else print(sheet); }, lead + i * gap);
    });
    /* on a refresh the status line closes with the last sheet */
    if (statusLast) later(status, lead + (sheets.length - 1) * gap); else status();
  }
  /* phone: the sheets sit below the fold, so after the reader's own press bring the status line up to them */
  function reveal() {
    var line = root.querySelector('.fl-status');
    if (!line || window.innerWidth >= 860) return;
    setTimeout(function () {
      var top = line.getBoundingClientRect().top;
      if (top > window.innerHeight - 260) window.scrollTo({ top: window.scrollY + top - 76, behavior: still ? 'auto' : 'smooth' });
    }, 450);
  }

  move.addEventListener('click', function () {
    var old = S.event;
    S.event = old === '9 PM' ? '10 PM' : '9 PM';
    if (tt) tt.innerHTML = '<span class="a-up"><span class="fl-upd">Updated · </span>Doors <s>' + nb(old) + '</s> ' + nb(S.event) + '</span>';
    settle(SLIP_LEAD, S.event !== S.printed ? SLIP_GAP : SNAP_GAP);
    reveal();
  });
  refresh.addEventListener('click', function () {
    S.printed = S.event;
    refresh.disabled = true;
    settle(0, REFRESH_GAP, true);
    move.focus({ preventScroll: true });
  });

  status();
})();
