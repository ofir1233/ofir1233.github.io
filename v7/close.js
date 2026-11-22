/* v7 - close: the last frame of the page. The postcard arrives once, the picture drifts a little with the scroll,
   the hour and the postmark's date are Tel Aviv's, and copying the address answers with a tick. */
(function () {
  var sec = document.getElementById('contact'); if (!sec || !sec.classList.contains('cl')) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ADDR = 'ofirnona123@gmail.com';
  var $ = function (s) { return sec.querySelector(s); };

  /* Tel Aviv: the hour next to the button, today's date in the postmark */
  var now = $('.cl-now'), d1 = $('.cl-pm .cl-d1'), d2 = $('.cl-pm .cl-d2');
  var part = function (o) { o.timeZone = 'Asia/Jerusalem'; return new Intl.DateTimeFormat('en-GB', o); };
  var clock = function () {
    try {
      var t = new Date(), hm = part({ hour: '2-digit', minute: '2-digit', hour12: false }).format(t), h = +hm.slice(0, 2);
      var day = h >= 7 && h < 21;
      if (now) { now.innerHTML = '<i></i>It’s <b>' + hm + '</b> in Tel Aviv. ' + (day ? 'A good time to write.' : 'I’ll read it in the morning.'); now.classList.toggle('is-day', day); }
      if (d1) d1.textContent = part({ day: '2-digit', month: 'short' }).format(t).toUpperCase();
      if (d2) d2.textContent = part({ year: 'numeric' }).format(t);
    } catch (e) {}
  };
  clock(); setInterval(clock, 20000);

  /* arriving, once */
  var lines = sec.querySelectorAll('.cl-lines li'); for (var i = 0; i < lines.length; i++) lines[i].style.setProperty('--i', i);
  var parts = sec.querySelectorAll('.cl-eye, .cl-h, .cl-pitch, .cl-mail, .cl-slot'); for (i = 0; i < parts.length; i++) parts[i].style.setProperty('--i', i);
  if (!reduce && 'IntersectionObserver' in window && sec.getBoundingClientRect().top > innerHeight * .7) {
    sec.classList.add('cl-arm');
    var card = $('.cl-card');
    new IntersectionObserver(function (es, o) {
      if (!es[0].isIntersecting) return; o.disconnect();
      sec.classList.add('cl-in'); setTimeout(function () { sec.classList.add('cl-set'); }, 2100);
    }, { threshold: .5 }).observe(card);
  }

  /* the picture drifts a little as the frame crosses the screen */
  var pic = $('.cl-pic');
  if (pic && !reduce) {
    var tick = 0, drift = function () {
      tick = 0; var r = sec.getBoundingClientRect(), vh = innerHeight; if (r.bottom < -40 || r.top > vh + 40) return;
      var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
      pic.style.setProperty('--p', Math.max(-1, Math.min(1, p)).toFixed(3));
    };
    addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(drift); }, { passive: true });
    addEventListener('resize', drift); drift();
  }

  var sr = $('.cl-sr'), say = function (s) { if (!sr) return; sr.textContent = ''; setTimeout(function () { sr.textContent = s; }, 80); };
  var put = function () {
    try { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(ADDR).then(function () { return true; }, function () { return false; }); } catch (e) {}
    return Promise.resolve(false);
  };

  /* Copy: press, the icon becomes a tick, the word changes, the line under the address turns green, and it all goes back */
  var copy = $('.cl-copy'), ct = 0;
  if (copy) copy.addEventListener('click', function () {
    put().then(function (ok) {
      var li = copy.closest('li'), l2 = copy.querySelector('.cl-w2');
      if (!ok) { /* no clipboard: select the address so Ctrl+C works */
        var a = li.querySelector('.cl-ad'), r = document.createRange(); r.selectNodeContents(a); var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        try { ok = document.execCommand('copy'); } catch (e) {}
      }
      if (l2) l2.textContent = ok ? 'Copied' : 'Selected';
      copy.classList.add('is-ok'); li.classList.add('is-ok'); say(ok ? 'Email address copied' : 'Email address selected, press Ctrl+C');
      clearTimeout(ct); ct = setTimeout(function () { copy.classList.remove('is-ok'); li.classList.remove('is-ok'); }, 2400);
    });
  });

  /* Write to me: the mail app opens as usual; the address is copied too, and a note offers Gmail to people with no mail app */
  var mail = $('.cl-mail'), slot = $('.cl-slot'), nt = 0;
  if (mail && slot) mail.addEventListener('click', function () {
    mail.classList.remove('is-go'); void mail.offsetWidth; mail.classList.add('is-go');
    put().then(function (ok) {
      var t = slot.querySelector('.cl-note .cl-t'); if (t) t.textContent = ok ? 'Address copied.' : ADDR + '.';
      setTimeout(function () { slot.classList.add('is-noted'); say((ok ? 'Email address copied. ' : '') + 'No mail app? Write in Gmail.'); }, 260);
      clearTimeout(nt); nt = setTimeout(function () { slot.classList.remove('is-noted'); }, 9000);
    });
  });
})();
