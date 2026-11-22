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

  /* The harbour keeps Tel Aviv's hour. The card already tells the visitor what time it is where I am; the picture now shows it:
     the same painting at the blue hour around sunset and sunrise, and under the moon at night. The sun's times are worked out for
     Tel Aviv's place on the map and today's date (the standard sunrise equation), so "dusk" is the real dusk, in June as in December.
     The other paintings are swapped in only once they have loaded, so the day picture is never replaced by an empty frame.
     Live only when the section carries data-hours; ?hour=day|dusk|night shows one hour for review. */
  var forced = /[?&]hour=(day|dusk|night)\b/.exec(location.search);
  if (sec.hasAttribute('data-hours') || forced) {
    var base = (function () { try { return document.currentScript.src.replace(/v7\/close\.js.*$/, 'img/'); } catch (e) { return 'img/'; } })();
    var sunUTC = function (d) {   /* [sunrise, sunset] in minutes of the UTC day, for 32.08 N 34.78 E */
      var rad = Math.PI / 180, lat = 32.08, lon = 34.78, N = Math.floor((d - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5), g = 2 * Math.PI / 365 * (N - 1);
      var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
      var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
      var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(dec)) - Math.tan(lat * rad) * Math.tan(dec)) / rad;
      return [720 - 4 * (lon + ha) - eq, 720 - 4 * (lon - ha) - eq];
    };
    var hourOf = function (d) {
      var s = sunUTC(d), m = d.getUTCHours() * 60 + d.getUTCMinutes();
      if (m >= s[0] + 20 && m < s[1] - 25) return 'day';
      if ((m >= s[1] - 25 && m < s[1] + 55) || (m >= s[0] - 55 && m < s[0] + 20)) return 'dusk';
      return 'night';
    };
    var shown = 'day', asked = '', small = matchMedia('(max-width:960px)');
    var sky = function () {
      var want = forced ? forced[1] : hourOf(new Date());
      if (want === shown || want === asked) return;
      var put = function () { sec.classList.remove('cl-dusk', 'cl-night'); if (want !== 'day') sec.classList.add('cl-' + want); shown = want; asked = ''; };
      if (want === 'day') return put();
      asked = want;
      var im = new Image(); im.onload = put; im.onerror = function () { asked = ''; };
      im.src = base + 'end-harbour-' + want + (small.matches ? '-1152' : '') + '.webp';
    };
    sky(); setInterval(sky, 60000);
  }

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

  /* The card remembers the visit. The headline says "You've seen my work"; a second ink mark says what this visitor did see:
     the parts of the page they stayed on, and for how long. A part counts after five seconds with its middle on screen, while the tab is
     in front. Nothing is stored and nothing leaves the page. The mark is composed while the card is still out of sight (so the card
     never changes size in front of the reader) and lands after the postmark. Someone who came straight here gets no mark. */
  var via = $('.cl-via'), cardEl = $('.cl-card');
  if (via && cardEl && 'IntersectionObserver' in window) {
    var NAMES = [['code', 'How I work'], ['design-lab', 'Design Lab'], ['product', 'Product'], ['system', 'Design system'], ['web', 'Brand'], ['fyi', 'FYI app'], ['ia', 'Architecture'], ['process', 'Process'], ['turns', 'Decisions'], ['path', 'Experience']];
    var secs = [], dwell = {}, total = 0, stamped = false;
    NAMES.forEach(function (n) { var e = document.getElementById(n[0]); if (e) { secs.push({ id: n[0], name: n[1], el: e }); dwell[n[0]] = 0; } });
    /* real time, not a count of ticks: a browser may slow a page's timers, and the seconds must still be true. One tick never counts
       for more than a second and a half, so a laptop that slept adds nothing. */
    var t0 = performance.now();
    setInterval(function () {
      var t = performance.now(), dt = Math.min(1.5, (t - t0) / 1000); t0 = t;
      if (document.hidden || stamped) return; total += dt;
      var mid = innerHeight / 2;
      for (var k = 0; k < secs.length; k++) { var r = secs[k].el.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { dwell[secs[k].id] += dt; break; } }
    }, 500);
    var compose = function () {
      var seen = secs.filter(function (x) { return dwell[x.id] >= 5; }); if (!seen.length) return false;
      var byTime = seen.slice().sort(function (p, q) { return dwell[q.id] - dwell[p.id]; });
      var pick = function (n) { var top = byTime.slice(0, n); return seen.filter(function (x) { return top.indexOf(x) >= 0; }).map(function (x) { return x.name; }); };
      var names = pick(3); if (names.join(' · ').length > 30) names = pick(2); if (names.join(' · ').length > 30) names = pick(1);
      /* a postal word, "via", and the parts in page order: up to three, the ones stayed on longest. No minutes and no counts: a card
         that reports numbers reads as tracking, not as post. A second line is written only for someone who followed the sample call
         in Product through all four of its screens. */
      var th = window.v7Thread || {}, rode = th.Topics && th.Compliance && th.Actions && th.Newsroom, all = seen.length === secs.length;
      via.textContent = '';
      var l1 = document.createElement('span'); l1.textContent = all ? 'Via the whole page' : 'Via ' + names.join(' · '); via.append(l1);
      if (rode) { var l2 = document.createElement('span'); l2.textContent = 'Followed one call to Newsroom'; via.append(l2); }
      via.setAttribute('aria-label', 'You came here by way of ' + seen.map(function (x) { return x.name; }).join(', ') + '.' + (rode ? ' You followed one call to Newsroom.' : ''));
      return true;
    };
    /* The mark takes its place only while the card is out of sight; its words are refreshed at the moment it lands. */
    /* On the wide card the mark is beside the postmark and lands when the card's lines have been ruled (they end at about 2.26s; it
       waits a beat more, so it is its own event and not the ruling's tail). On the stacked card it is at the card's foot, often
       below the screen when the card arrives: there it lands when the mark itself has come into view. */
    var near = false, half = false, inview = false, stacked = matchMedia('(max-width:960px)');
    var land = function () {
      if (stamped || !sec.classList.contains('has-via') || !(stacked.matches ? inview : half)) return;
      stamped = true; compose();
      var arriving = sec.classList.contains('cl-arm') && !sec.classList.contains('cl-set');
      setTimeout(function () { sec.classList.add('via-on'); }, reduce ? 0 : stacked.matches || !arriving ? 320 : 2560);
    };
    new IntersectionObserver(function (es) {
      var was = near; near = es[es.length - 1].isIntersecting;
      if (near && !was && !half && !stamped && !sec.classList.contains('has-via') && compose()) sec.classList.add('has-via');
      land();
    }, { rootMargin: '100% 0px 100% 0px' }).observe(cardEl);
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1], was = half; half = e.isIntersecting && e.intersectionRatio >= .5;
      /* the reader jumped straight to the card (End key, the Contact button with no smooth scroll): it is a new picture in any case,
         so the mark may take its place in it now */
      if (half && !was && !stamped && !sec.classList.contains('has-via') && compose()) sec.classList.add('has-via');
      land();
    }, { threshold: [.5] }).observe(cardEl);
    new IntersectionObserver(function (es) { var e = es[es.length - 1]; inview = e.isIntersecting && e.intersectionRatio >= .9; land(); }, { threshold: [.9] }).observe(via);
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
