// FYI inner page: the art that leaves the phone in each part (the painted wave, the stickers, the printed paper, the ink).
// It only builds the drawn pieces and decides which are out; where they sit and how they move is in v7/fyi-take.css.
// A piece with data-b="3" comes out when its part is on and the scene in the phone has reached beat 3; data-e="5" takes it back at beat 5.
(function () {
  'use strict';
  var d = document, parts = [].slice.call(d.querySelectorAll('.ot-part')), uid = 0;
  if (!parts.length) return;
  var f = function (n) { return n.toFixed(1); };
  var paint = function (id) { return '<pattern id="otp' + id + '" patternUnits="userSpaceOnUse" width="720" height="360"><image href="../img/fyi-door/paint-pink.webp" width="720" height="360" preserveAspectRatio="none"/></pattern>'; };
  var rough = function (id, sc, fq) { return '<filter id="otr' + id + '" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="' + fq + '" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="' + sc + '"/></filter>'; };
  var box = function (el) { var s = el.style; return { w: parseFloat(s.getPropertyValue('--w')), h: parseFloat(s.getPropertyValue('--h')) }; };

  // the voice note as paint: thin bars at the phone that grow as they leave it, pink over two inks set a little off
  function wave(svg) {
    var b = box(svg), id = ++uid, W = b.w, cy = b.h / 2, hMin = 15, hMax = b.h * .96, x = 0, w = 3, i = 0, bars = [];
    while (x + w < W && i < 60) {
      var u = x / W, k = .3 + .7 * Math.abs(Math.sin(i * 1.7 + .4) * .6 + Math.sin(i * .63 + 1.3) * .4);
      bars.push({ x: x, w: w, h: Math.max(w * 1.6, (hMin + (hMax - hMin) * Math.pow(u, 1.22)) * k) });
      x += w * 1.74; w *= 1.082; i++;
    }
    var rects = function (dx, dy) { return bars.map(function (r, n) { var q = Math.min(1, r.w / 9); return '<rect class="wb" style="--i:' + n + '" x="' + f(r.x + dx * q) + '" y="' + f(cy - r.h / 2 + dy * q) + '" width="' + f(r.w) + '" height="' + f(r.h) + '" rx="' + f(r.w / 2) + '"/>'; }).join(''); };
    svg.setAttribute('viewBox', '0 0 ' + b.w + ' ' + b.h);
    svg.innerHTML = '<defs>' + paint(id) + rough(id, 5, '.035') + '</defs><g filter="url(#otr' + id + ')"><g fill="#22cdf0">' + rects(-4, 3.5) + '</g><g fill="#7a2cff">' + rects(3.5, -3) + '</g><g fill="url(#otp' + id + ')">' + rects(0, 0) + '</g></g>';
  }
  // a number or a name in the same paint
  function num(svg) {
    var b = box(svg), id = ++uid, size = +svg.dataset.size || b.h * .9, t = svg.dataset.num, y = b.h / 2 + size * .35;
    var tx = function (dx, dy, fill) { return '<text x="' + f(b.w / 2 + dx) + '" y="' + f(y + dy) + '" text-anchor="middle" font-size="' + size + '" fill="' + fill + '">' + t + '</text>'; };
    var o = Math.max(2, size * .028);
    svg.setAttribute('viewBox', '0 0 ' + b.w + ' ' + b.h);
    svg.innerHTML = '<defs>' + paint(id) + rough(id, Math.max(2, size * .02), '.03') + '</defs><g filter="url(#otr' + id + ')">' + tx(-o, o * .9, '#22cdf0') + tx(o * .9, -o * .8, '#7a2cff') + tx(0, 0, 'url(#otp' + id + ')') + '</g>';
  }
  function ink(svg) {
    var b = box(svg), id = ++uid, k = svg.dataset.ink, w = b.w, h = b.h, cx = w / 2, cy = h / 2, rx = w * .44, ry = h * .4, p = '';
    if (k === 'loop') p = 'M' + f(cx - rx * .9) + ' ' + f(cy + ry * .2) + 'C' + f(cx - rx * 1.05) + ' ' + f(cy - ry * .9) + ' ' + f(cx + rx * .2) + ' ' + f(cy - ry * 1.25) + ' ' + f(cx + rx * .92) + ' ' + f(cy - ry * .55) + 'C' + f(cx + rx * 1.3) + ' ' + f(cy + ry * .1) + ' ' + f(cx + rx * .7) + ' ' + f(cy + ry * 1.05) + ' ' + f(cx - rx * .1) + ' ' + f(cy + ry * 1.02) + 'C' + f(cx - rx * .8) + ' ' + f(cy + ry) + ' ' + f(cx - rx * 1.12) + ' ' + f(cy + ry * .3) + ' ' + f(cx - rx * .8) + ' ' + f(cy - ry * .35);
    else if (k === 'check') p = 'M' + f(w * .08) + ' ' + f(h * .52) + 'C' + f(w * .2) + ' ' + f(h * .62) + ' ' + f(w * .3) + ' ' + f(h * .78) + ' ' + f(w * .36) + ' ' + f(h * .92) + 'C' + f(w * .5) + ' ' + f(h * .55) + ' ' + f(w * .7) + ' ' + f(h * .25) + ' ' + f(w * .94) + ' ' + f(h * .06);
    else if (k === 'strike') p = 'M' + f(w * .02) + ' ' + f(h * .62) + 'C' + f(w * .3) + ' ' + f(h * .5) + ' ' + f(w * .6) + ' ' + f(h * .46) + ' ' + f(w * .98) + ' ' + f(h * .34);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.innerHTML = '<defs>' + rough(id, 2.6, '.06') + '</defs><g filter="url(#otr' + id + ')"><path pathLength="1" d="' + p + '"/></g>';
  }

  function count(el, to) {
    if (el._to === to) return; el._to = to;
    var from = +el.textContent || 0, t0 = 0, run = ++uid; el._run = run;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || from === to) { el.textContent = to; return; }
    requestAnimationFrame(function step(t) { if (el._run !== run) return; if (!t0) t0 = t; var u = Math.min(1, (t - t0) / 1500), e = 1 - Math.pow(1 - u, 3); el.textContent = Math.round(from + (to - from) * e); if (u < 1) requestAnimationFrame(step); });
  }

  function apply(el) {
    var s = el._art;
    s.items.forEach(function (it) {
      var ds = it.dataset, go = s.on && s.beat >= (+ds.b || 0) && (ds.e == null || s.beat < +ds.e);
      it.classList.toggle('go', go);
      if (ds.b2 != null) it.classList.toggle('to2', go && s.beat >= +ds.b2);
      if (ds.play != null) it.classList.toggle('play', go && s.beat === +ds.play);
    });
    s.counts.forEach(function (c) { var v = c.dataset.count.split(','); count(c, s.on && s.beat >= +c.dataset.cb ? +v[1] : +v[0]); });
  }
  parts.forEach(function (el) {
    var art = el.querySelector('.ot-art'), stage = el.querySelector('[data-fx-stage]');
    if (!art) return;
    [].forEach.call(art.querySelectorAll('[data-wave]'), wave);
    [].forEach.call(art.querySelectorAll('[data-num]'), num);
    [].forEach.call(art.querySelectorAll('[data-ink]'), ink);
    el._art = { on: false, beat: 0, items: [].slice.call(art.querySelectorAll('.oa')), counts: [].slice.call(art.querySelectorAll('[data-count]')) };
    // a scene with no beat rail reports -1 when it ends: what is out stays out
    if (stage) stage.addEventListener('fx:beat', function (e) { if (e.detail.i < 0 || e.detail.ff) return; el._art.beat = e.detail.i; apply(el); });
  });
  // the rail of a part: one segment for each moment of its scene. Played moments are full, the current one fills while it plays,
  // and a click on a segment plays the scene from that moment.
  // on this page the scenes play faster than they were written: waits and moves are shortened by the same factor
  if (window.FX) window.FX.speed = 1.45;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, narrow = matchMedia('(max-width: 999px)');
  parts.forEach(function (el) {
    var rail = el.querySelector('.ot-rail'), stage = el.querySelector('[data-fx-stage]'), root = el.querySelector('[data-scene]'), copy = el.querySelector('.ot-copy');
    if (!rail || !stage || !root) return;
    var segs = [].slice.call(rail.querySelectorAll('.ot-segs button')), again = rail.querySelector('.ot-again');
    // one tab stop for the rail, on the current moment; while focus is on a segment the stop stays there, so Tab leaves the rail
    var rove = function (i) { segs.forEach(function (b, k) { b.tabIndex = k === i ? 0 : -1; }); };
    rove(0);
    // state: 0 the moment is playing, 1 the scene is held on the end of this moment, 2 the scene is over
    var paint = function (i, state) {
      segs.forEach(function (b, k) { var on = !state && k === i; b.classList.toggle('done', state === 2 || k < i || (state === 1 && k === i)); b.classList.toggle('on', on); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
      if (segs.indexOf(d.activeElement) < 0) rove(i);
      if (state !== 2 && d.activeElement === again) { rove(i); segs[i].focus({ preventScroll: true }); }
      again.hidden = state !== 2 || reduce;
    };
    stage.addEventListener('fx:beat', function (e) {
      var i = e.detail.i; if (i < 0 || e.detail.ff) return;   // a skip passes through the earlier moments: only where it lands counts
      paint(i, 0);
      // the engine marks the end, or a hold, just after the beat it reports
      setTimeout(function () { var p = root._fx; if (!p || p.shown !== i || p.ff) return; if (p.done) paint(i, reduce ? 1 : 2); else if (!p.user) paint(i, 1); }, 0);
    });
    var hold = function () { rail.classList.toggle('hold', !stage.classList.contains('fx-on')); };
    if ('MutationObserver' in window) new MutationObserver(hold).observe(stage, { attributes: true, attributeFilter: ['class'] });
    hold();
    var from = function (k) {
      var p = root._fx; if (!p) return;
      segs.forEach(function (b) { b.classList.remove('on'); }); void rail.offsetWidth;
      p.parked = false;
      if (reduce) return p.run(k, true);
      p.user = true; if (window.FX && FX.held) p.solo = true;
      if (k === 0 && p.done) p.restart(); else p.run(k);
    };
    segs.forEach(function (b, k) {
      b.addEventListener('click', function () { rove(k); from(k); });
      b.addEventListener('keydown', function (e) {
        var n = segs.length, t = e.key === 'ArrowRight' ? (k + 1) % n : e.key === 'ArrowLeft' ? (k - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
        if (t < 0) return;
        e.preventDefault(); rove(t); segs[t].focus(); from(t);
      });
    });
    again.addEventListener('click', function () { from(0); rove(0); segs[0].focus({ preventScroll: true }); });
    // on the 3D page the text of a part is fixed and shows only while its part is in view: a key landing on its rail brings the part there
    rail.addEventListener('focusin', function (e) {
      if (!d.documentElement.classList.contains('ot-3d') || !copy || !copy.contains(rail) || !e.target.matches(':focus-visible')) return;
      if ((parseFloat(copy.style.getPropertyValue('--o')) || 0) < .9) scrollTo(0, el.getBoundingClientRect().top + scrollY + 80);
    });
    // beside the text on a wide screen; under the phone where the two are stacked
    var place = function () { var ph = el.querySelector('.ot-ph'); if (narrow.matches && ph) ph.after(rail); else if (copy) copy.appendChild(rail); };
    place(); if (narrow.addEventListener) narrow.addEventListener('change', place);
  });
  // the scenes were written for a page with a beat rail and count their beats from it; this page has none, so say how many each has
  var N = { origin: 6, spark: 6, catchup: 6, task: 6, together: 6, launch: 7 };
  d.addEventListener('DOMContentLoaded', function () { setTimeout(function () { parts.forEach(function (el) { var r = el.querySelector('[data-scene]'), p = r && r._fx; if (p && !p.n && N[el.dataset.part]) p.n = N[el.dataset.part]; }); }, 0); });
  window.OTArt = { set: function (el, on) { var s = el._art; if (!s) return; var st = el.querySelector('[data-fx-stage]'); if (on && st && +st.dataset.beat > s.beat) s.beat = +st.dataset.beat; s.on = on; apply(el); } };
})();
