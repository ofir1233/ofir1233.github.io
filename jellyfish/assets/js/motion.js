/* Jellyfish Tattoo: motion for type. GSAP + ScrollTrigger, self-hosted in assets/vendor/gsap (GSAP standard no-charge license).
   Section headings rise line by line, the studio numbers count up, the signature writes itself, quotes rise: once each, as
   they come in. The hero and page-head intro is CSS (site.css, "Intro"), so it starts at first paint without waiting for GSAP.
   Ornaments, illustrations, cards, rows and photos never move here: the many small reveals made phones stutter (owner, 2026-10-21).
   Everything is readable without JS, and nothing moves under prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* Keyboard: a control that gets focus while the CSS intro is still bringing it in shows at once (finish keeps it from replaying) */
  document.addEventListener("focusin", function (e) {
    for (var el = e.target; el && el !== document.body; el = el.parentElement) if (el.getAnimations) el.getAnimations().forEach(function (a) { if (/^jf-/.test(a.animationName || "") && a.playState !== "finished") a.finish(); });
  });
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
  /* Reveals stay 2D: with force3D "auto" every tween promotes its target to a compositor layer and drops it at the end,
     which rebuilt the layer tree almost every frame while scrolling on phones */
  gsap.config({ force3D: false });

  function seen(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    /* Already on screen or scrolled past when this runs: it has been painted whole, so it stays as it is and is never
       hidden and replayed (a heading on a page's first screen, a link straight to index.html#studio). A once-trigger
       created past its end also kills itself inside ScrollTrigger's refresh and throws, which stopped every reveal after it. */
    return r.bottom < 0 || r.top < window.innerHeight;
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
      yPercent: 135, duration: 1.15, ease: EXPO, stagger: 0.11,
      scrollTrigger: trigger ? { trigger: trigger, start: "top 86%", once: true, fastScrollEnd: true } : undefined,
      onComplete: function () { el.innerHTML = orig; el.classList.remove("is-split"); }
    }, vars || {}));
  }
  function rise(targets, vars) { return gsap.from(targets, ext({ opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, vars || {})); }

  function scroll() {
    /* Section headings (h2.display), with their kicker */
    all("main section .display, main .flash-wrap .display, .closer .display").forEach(function (h) {
      if (seen(h)) return;
      var sec = h.closest("section") || h;
      var kick = h.previousElementSibling && h.previousElementSibling.classList.contains("kicker") ? h.previousElementSibling : (one(".kicker", sec));
      if (kick && !seen(kick)) rise(kick, { y: 10, scrollTrigger: { trigger: h, start: "top 88%", once: true, fastScrollEnd: true } });
      cut(h);
    });

    /* Studio numbers: rows rise, numbers count up to whole numbers, words lift out of a mask, the signature writes itself */
    all(".stats").forEach(function (list) {
      if (seen(list)) return;
      var rows = all("li", list);
      var tl = gsap.timeline({ scrollTrigger: { trigger: list, start: "top 82%", once: true, fastScrollEnd: true } });
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
      gsap.fromTo(img, { clipPath: "inset(-10% 100% -10% 0%)" }, { clipPath: "inset(-10% 0% -10% 0%)", duration: 1.8, ease: "power2.inOut", clearProps: "clipPath",
        scrollTrigger: { trigger: img, start: "top 90%", once: true, fastScrollEnd: true } });
    });
    all(".studio__quote, .story__quote").forEach(function (q) { if (!seen(q)) rise(q, { y: 20, duration: 1, scrollTrigger: { trigger: q, start: "top 88%", once: true, fastScrollEnd: true } }); });
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
    /* ScrollTrigger must never put back a remembered scroll position: the page opens at the top */
    if (ST.clearScrollMemory) ST.clearScrollMemory("manual");
    scroll();
    /* Printing or saving as PDF before scrolling: finish every reveal first */
    window.addEventListener("beforeprint", function () {
      ST.getAll().forEach(function (s) { if (s.animation && s.vars.once) s.animation.progress(1); });
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
