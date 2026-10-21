/* Jellyfish Tattoo: motion. GSAP + ScrollTrigger, self-hosted in assets/vendor/gsap (GSAP standard no-charge license).
   Everything is readable without JS, and nothing moves under prefers-reduced-motion.
   Brand book, chapter 7: dots grow from their dense edge in 900ms ease-out; one ornamental focus per section; photos are never tinted. */
(function () {
  "use strict";
  var html = document.documentElement;
  function ready() { html.classList.add("motion-done"); }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) { ready(); return; }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });

  /* "late": the 2.5s fallback in <head> already showed everything (GSAP or the fonts came slowly). Then there is no intro,
     and nothing already on screen is hidden and replayed. */
  var late = false;
  function seen(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    /* Already scrolled past (a link straight to a section further down): it stays as it is. A once-trigger created
       past its end kills itself inside ScrollTrigger's refresh and throws, which stopped every reveal after it. */
    return r.bottom < 0 || (late && r.top < window.innerHeight);
  }
  function ext(a, b) { for (var k in b) if (Object.prototype.hasOwnProperty.call(b, k)) a[k] = b[k]; return a; }
  function all(sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); }
  function one(sel, root) { return (root || document).querySelector(sel); }
  var EXPO = "expo.out";

  /* Big headings rise line by line out of a mask. The browser's own line breaks (text-wrap: balance, right to left) are
     pinned with temporary <br>s first, then the heading is cut into masked line blocks. When the reveal ends the heading
     goes back to its original markup, so resizing later reflows it normally. */
  function pin(el) {
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), words = [], n, m, re;
    while ((n = walk.nextNode())) { re = /\S+/g; while ((m = re.exec(n.data))) words.push({ node: n, at: m.index, end: m.index + m[0].length }); }
    var range = document.createRange(), last = null, breaks = [];
    words.forEach(function (w) {
      range.setStart(w.node, w.at); range.setEnd(w.node, w.end);
      var r = range.getClientRects(); if (!r.length) return;
      if (last !== null && r[0].top > last + 4) breaks.push(w);
      last = r[0].top;
    });
    function prevNode(node) {
      for (var cur = node; cur && cur !== el; cur = cur.parentNode) {
        var p = cur.previousSibling;
        while (p && p.nodeType === 3 && !p.data.trim()) p = p.previousSibling;
        if (p) return p;
      }
      return null;
    }
    breaks.reverse().forEach(function (w) {
      var node = w.node, starts = !node.data.slice(0, w.at).trim();
      var prev = starts ? prevNode(node) : null;
      if (prev && prev.nodeName === "BR") return;
      var br = document.createElement("br"); br.setAttribute("data-pin", "");
      var host = node.parentNode;
      var first = starts; for (var q = node.previousSibling; first && q; q = q.previousSibling) if (q.nodeType !== 3 || q.data.trim()) first = false;
      if (first && host !== el && host.parentNode === el) el.insertBefore(br, host);
      else host.insertBefore(br, node.splitText(w.at));
    });
  }
  function lines(el, vars, trigger) {
    if (!el) return null;
    var orig = el.innerHTML;
    pin(el);
    /* Cut the heading at every <br> (ours and the author's) into masked line blocks; cloneContents keeps nested spans */
    var range = document.createRange(), frags = [], prev = null;
    all("br", el).concat([null]).forEach(function (br) {
      if (prev) range.setStartAfter(prev); else range.setStart(el, 0);
      if (br) range.setEndBefore(br); else range.setEnd(el, el.childNodes.length);
      var f = range.cloneContents();
      if (f.textContent.trim()) frags.push(f);
      prev = br;
    });
    el.textContent = "";
    el.classList.add("is-split");
    var ls = frags.map(function (f) {
      var mask = document.createElement("span"), line = document.createElement("span");
      mask.className = "line-mask"; line.className = "line";
      line.appendChild(f); mask.appendChild(line); el.appendChild(mask);
      return line;
    });
    return gsap.from(ls, ext({
      yPercent: 112, duration: 1.15, ease: EXPO, stagger: 0.11,
      scrollTrigger: trigger ? { trigger: trigger, start: "top 86%", once: true } : undefined,
      onComplete: function () { el.innerHTML = orig; el.classList.remove("is-split"); }
    }, vars || {}));
  }
  function rise(targets, vars) { return gsap.from(targets, ext({ opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, vars || {})); }

  function intro() {
    /* Home hero */
    var hero = one(".hero");
    if (hero) {
      var tl = gsap.timeline({ delay: 0.15 });
      /* The lockup is pressed onto the paper from the top, the coral rule draws from the reading side, then the line and the pill */
      var logo = one(".hero__logo", hero);
      if (logo) tl.add(gsap.fromTo(logo, { clipPath: "inset(0% -4% 100% -4%)", y: 16 }, { clipPath: "inset(-6% -4% -6% -4%)", y: 0, duration: 1.4, ease: EXPO, clearProps: "clipPath,transform" }), 0.05);
      tl.add(gsap.fromTo(all(".hero__rule", hero), { scaleX: 0 }, { scaleX: 1, transformOrigin: "100% 50%", duration: 0.9, ease: EXPO }), 0.6);
      var line = one(".hero__line", hero);
      if (line) tl.add(lines(line, { stagger: 0.12, duration: 1.1 }), 0.62);
      tl.add(rise(one(".lead", hero)), 0.85);
      tl.add(rise(all(".btn-row > *", hero), { stagger: 0.09 }), 0.95);
      tl.add(rise(all(".hero__labels > *", hero), { y: 8, stagger: 0.07 }), 1.1);
      /* The film opens upward inside its arch */
      var arch = one(".hero__arch", hero);
      if (arch) {
        tl.add(gsap.fromTo(arch, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: EXPO, clearProps: "clipPath" }), 0.25);
        tl.add(gsap.from(one(".hero__bg", hero), { scale: 1.16, duration: 2.2, ease: EXPO, clearProps: "transform" }), 0.25);
        tl.add(rise(all(".hero__spark, .hero__toggle", hero), { y: 0, duration: 1 }), 1.2);
      }
    }
    /* Short pages and artist pages */
    var head = one(".page-head");
    if (head) {
      var th = gsap.timeline({ delay: 0.1 });
      th.add(rise(all(".crumbs, .kicker", head), { y: 10 }), 0);
      var h = one("h1", head);
      if (h) th.add(lines(h), 0.08);
      th.add(rise(all(".lead, .artist-status, .btn-row > *", head), { stagger: 0.08 }), 0.45);
      var pic = one(".portrait img", head);
      if (pic) {
        th.add(gsap.fromTo(pic, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: EXPO }), 0.15);
        th.add(gsap.from(pic, { scale: 1.12, duration: 1.8, ease: EXPO, clearProps: "transform" }), 0.15);
        th.add(rise(one(".portrait figcaption", head), { y: 8 }), 0.8);
      }
      var card = one(".head-card", head);
      if (card) th.add(gsap.from(card, { opacity: 0, y: 60, rotation: -10, duration: 1.3, ease: EXPO }), 0.25);
    }
  }

  function scroll() {
    /* Section headings (h2.display), with their kicker */
    all("main section .display, main .flash-wrap .display, .closer .display").forEach(function (h) {
      if (seen(h)) return;
      var sec = h.closest("section") || h;
      var kick = h.previousElementSibling && h.previousElementSibling.classList.contains("kicker") ? h.previousElementSibling : (one(".kicker", sec));
      if (kick) rise(kick, { y: 10, scrollTrigger: { trigger: h, start: "top 88%", once: true } });
      cut(h);
    });

    /* Hero: as it scrolls away the video pushes in and the words lift off */
    var hero = one(".hero");
    if (hero) {
      gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.4 } })
        .to(one(".hero__bg", hero), { scale: 1.1, ease: "none", duration: 1 }, 0)
        .to(one(".hero__text", hero), { y: -40, ease: "none", duration: 1 }, 0);
    }
    /* The faded mandalas turn slowly as their section passes (a CSS variable, so their own placement transform is kept) */
    all(".orn-mandala").forEach(function (m, i) {
      var host = m.closest("section, header, .closer, .footer") || m.parentElement;
      gsap.fromTo(m, { "--spin": "0deg" }, { "--spin": (i % 2 ? "-" : "") + "28deg", ease: "none",
        scrollTrigger: { trigger: host, start: "top bottom", end: "bottom top", scrub: 0.8 } });
    });

    /* Stipple edges and drawing crops (.js-art) are revealed by site.js and the CSS art layer, not here */

    /* Studio numbers: rows rise, numbers count up to whole numbers, words lift out of a mask, the signature writes itself */
    all(".stats").forEach(function (list) {
      if (seen(list)) return;
      var rows = all("li", list);
      var tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 82%", once: true } });
      tl.from(rows, { opacity: 0, y: 28, duration: 0.9, stagger: 0.16, ease: EXPO }, 0);
      all(".count[data-to]", list).forEach(function (el) {
        var to = +el.getAttribute("data-to");
        el.style.display = "inline-block"; el.style.minWidth = el.offsetWidth + "px"; el.style.textAlign = "end";
        tl.fromTo(el, { textContent: 0 }, { textContent: to, duration: 1.8, ease: "power2.out", snap: { textContent: 1 }, immediateRender: false }, 0.1);
      });
      all(".stat__word", list).forEach(function (w, i) {
        w.innerHTML = '<span class="word-mask"><span class="word">' + w.innerHTML + "</span></span>";
        tl.from(one(".word", w), { yPercent: 115, duration: 1.1, ease: EXPO }, 0.25 + i * 0.16);
      });
      tl.from(all(".stat__l", list), { opacity: 0, x: 12, duration: 0.7, stagger: 0.16 }, 0.35);
    });
    all(".sig__img").forEach(function (img) {
      if (seen(img)) return;
      gsap.fromTo(img, { clipPath: "inset(-10% 100% -10% 0%)" }, { clipPath: "inset(-10% 0% -10% 0%)", duration: 1.8, ease: "power2.inOut",
        scrollTrigger: { trigger: img, start: "top 90%", once: true } });
    });
    all(".studio__quote, .story__quote").forEach(function (q) { if (!seen(q)) rise(q, { y: 20, duration: 1, scrollTrigger: { trigger: q, start: "top 88%", once: true } }); });

    /* Gallery tiles and the team, in batches as they come in */
    function batch(sel, vars) {
      var items = all(sel).filter(function (el) { return !seen(el); }); if (!items.length) return;
      gsap.set(items, { opacity: 0, y: vars && vars.y != null ? vars.y : 44 });
      /* vars only set the start offset: every item ends at y 0 */
      ST.batch(items, { start: "top 90%", once: true, onEnter: function (b) {
        gsap.to(b, ext(ext({}, vars || {}), { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: EXPO, overwrite: true }));
      } });
    }
    batch(".gallery > .tile");
    batch(".style-card");
    batch(".mate");
    batch(".voucher", { y: 36 });
    all(".cards .artist").forEach(function (card, i) {
      if (seen(card)) return;
      var img = one(".artist__photo", card);
      var tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 86%", once: true }, delay: i * 0.12 });
      if (img) tl.fromTo(img, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EXPO }, 0);
      tl.from(all(".artist__meta, .artist > p, .artist > a", card), { opacity: 0, y: 14, duration: 0.7, stagger: 0.07 }, 0.35);
    });

    /* Lists that read as rows: prices, facts, steps, timelines, the flash sheet */
    function rows(groupSel, rowSel, vars) {
      all(groupSel).forEach(function (g) {
        var r = all(rowSel, g); if (!r.length || seen(g)) return;
        gsap.from(r, ext({ opacity: 0, y: 16, duration: 0.7, stagger: 0.07, scrollTrigger: { trigger: g, start: "top 86%", once: true } }, vars || {}));
      });
    }
    rows(".prices", "tr");
    rows(".policy", "li");
    rows(".facts", ":scope > div");
    rows(".steps", ":scope > li", { stagger: 0.14, y: 24 });
    rows(".timeline", ":scope > li", { stagger: 0.12, y: 24 });
    rows(".flash-grid", ":scope > li", { stagger: 0.035, y: 20, scale: 0.94 });
    rows(".faq, .faq-list", "details");
    all(".archive, .send-card, .care-card").forEach(function (el) { if (!seen(el)) rise(el, { y: 30, duration: 1, scrollTrigger: { trigger: el, start: "top 88%", once: true } }); });
  }

  var pending = [];
  function cut(h) {
    var orig = h.innerHTML, tw = lines(h, null, h);
    if (tw) pending.push({ el: h, orig: orig, tw: tw });
  }
  function recut() {
    pending = pending.filter(function (p) {
      if (p.tw.progress() > 0 || !p.el.classList.contains("is-split")) return false;
      if (p.tw.scrollTrigger) p.tw.scrollTrigger.kill();
      p.tw.kill(); p.el.innerHTML = p.orig; p.el.classList.remove("is-split");
      return true;
    });
    pending = pending.filter(function (p) { if (seen(p.el)) return false; p.tw = lines(p.el, null, p.el); return true; });
    ST.refresh();
  }

  /* Keyboard: an element that gets focus before its reveal shows at once (scrubbed hero motion is left to the scroll) */
  document.addEventListener("focusin", function (e) {
    for (var el = e.target; el && el !== document.body; el = el.parentElement) {
      if (!el._gsap || +getComputedStyle(el).opacity >= 1) continue;
      var scrubbed = false;
      gsap.getTweensOf(el).forEach(function (t) {
        var a = t; while (a.parent && a.parent !== gsap.globalTimeline) a = a.parent;
        if (a.scrollTrigger && a.scrollTrigger.vars.scrub) scrubbed = true; else a.progress(1);
      });
      if (!scrubbed) gsap.set(el, { opacity: 1, y: 0, x: 0, scale: 1 });
    }
  });

  function start() {
    late = html.classList.contains("motion-done");
    /* ScrollTrigger must never put back a remembered scroll position: the page opens at the top */
    if (ST.clearScrollMemory) ST.clearScrollMemory("manual");
    if (!late) intro();
    scroll();
    ready();
    /* Printing or saving as PDF before scrolling: finish every reveal first */
    window.addEventListener("beforeprint", function () {
      ST.getAll().forEach(function (s) { if (s.animation && s.vars.once) s.animation.progress(1); });
      gsap.set(all(".gallery > .tile, .style-card, .mate, .voucher"), { opacity: 1, y: 0 });
    });
    var lastW = window.innerWidth, rt;
    window.addEventListener("resize", function () {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth; clearTimeout(rt); rt = setTimeout(recut, 250);
    });
    /* Images and late fonts change the page height: measure again once everything is in */
    window.addEventListener("load", function () { ST.refresh(); });
  }
  /* Wait briefly for the display font so the line cuts match the final lines; headings return to their own markup after the reveal */
  var fonts = document.fonts && document.fonts.ready;
  var started = false;
  function go() { if (started) return; started = true; start(); }
  if (fonts) { fonts.then(function () { if (started) recut(); else go(); }); setTimeout(go, 450); } else go();
})();
