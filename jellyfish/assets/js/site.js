(function () {
  "use strict";

  /* Always open at the top. A #section link from outside the site (WhatsApp, Instagram) or a reload
     does not land mid-page; links between our own pages (aftercare.html -> ./#prices) still jump. */
  (function () {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var fromUs = false;
    try { fromUs = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (e) {}
    if (!location.hash || fromUs) return;
    history.replaceState(null, "", location.pathname + location.search);
    var top = function () { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    top(); window.addEventListener("load", function () { top(); setTimeout(top, 0); });
  })();

  /* ===== Settings ===== */
  var WHATSAPP = "972525659677";  // wa.me format: 972 + number without the leading 0 (052-5659677)
  var GA4_ID = "";                // [GA4 measurement ID, e.g. G-XXXXXXX]. Empty = no analytics, no consent bar
  var META_PIXEL_ID = "";         // [Meta Pixel ID]. Empty = no pixel
  var LIST_ENDPOINT = "";         // [mailing tool form URL, e.g. Brevo or Mailchimp]. Empty = sign-ups arrive as a WhatsApp message

  /* Ready-made WhatsApp texts. The first words tell the studio where each lead came from. */
  var HI = "היי Jellyfish 🪼 ";
  var TEXTS = {
    site: HI + "אשמח לקבוע קעקוע",
    mini: HI + "מיני",
    "13": HI + "13",
    list: HI + "אשמח להצטרף לרשימה של ראשונים לדעת",
    artist: HI + "אשמח לקבוע אצל ",
    piercing: HI + "פירסינג אצל יניב",
    gift: HI + "אשמח לשובר מתנה",
    heal: HI + "שולח/ת תמונת החלמה",
    jobs: HI + "בעניין עבודה בסטודיו",
    google: HI + "הגעתי מגוגל",
    card: HI + "קיבלתי כרטיס מחבר/ה: ",
    ad: HI + "ראיתי את המודעה, מיני",
    qr: HI + "עברתי ברחוב, מיני"
  };

  function store(kind) { try { return window[kind]; } catch (e) { return null; } }
  function get(kind, k) { var s = store(kind); try { return s ? s.getItem(k) : null; } catch (e) { return null; } }
  function set(kind, k, v) { var s = store(kind); try { if (s) s.setItem(k, v); } catch (e) {} }

  var params = new URLSearchParams(location.search);

  /* Source of the visit (?src=ig|ad|qr|google|card), kept for the session */
  var src = params.get("src");
  if (src) set("sessionStorage", "jf-src", src); else src = get("sessionStorage", "jf-src");
  /* Where the lead came from, added to the end of every specific message (13, mini, artist...) so no source is lost */
  var SRC_TAG = { google: "הגעתי מגוגל", card: "קיבלתי כרטיס מחבר/ה: ", ad: "ראיתי את המודעה", qr: "עברתי ברחוב" };
  if (src && !SRC_TAG.hasOwnProperty(src) && src !== "site" && src !== "ig") src = null;

  /* Accent preview: ?accent=teal */
  if (params.get("accent") === "teal") {
    document.documentElement.style.setProperty("--accent", "#00828B");
    document.documentElement.style.setProperty("--on-accent", "#FFFFFF");
  }

  /* Analytics, only after consent and only when IDs are set */
  function track(name, data) {
    try { if (window.gtag) window.gtag("event", name, data || {}); } catch (e) {}
    try { if (window.fbq && name === "whatsapp_click") window.fbq("track", "Contact", data || {}); } catch (e) {}
  }
  function loadAnalytics() {
    if (GA4_ID) {
      var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", GA4_ID);
    }
    if (META_PIXEL_ID) {
      /* Standard Meta Pixel loader */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", META_PIXEL_ID); window.fbq("track", "PageView");
    }
  }
  if (GA4_ID || META_PIXEL_ID) {
    var consent = get("localStorage", "jf-consent");
    if (consent === "yes") loadAnalytics();
    else if (consent !== "no") {
      var bar = document.createElement("div");
      bar.className = "consent"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "עוגיות");
      bar.innerHTML = '<p>אנחנו משתמשים בעוגיות כדי לדעת אילו פרסומים מביאים אנשים לסטודיו. <a href="privacy.html">פרטים</a></p><button class="btn btn--book" type="button" data-c="yes">אישור</button><button class="btn btn--ghost" type="button" data-c="no" style="color:inherit;border-color:currentColor">לא, תודה</button>';
      bar.addEventListener("click", function (e) { var c = e.target.getAttribute("data-c"); if (!c) return; set("localStorage", "jf-consent", c); if (c === "yes") loadAnalytics(); bar.remove(); });
      (document.querySelector(".site") || document.body).appendChild(bar);
    }
  }

  /* WhatsApp links */
  function textFor(key, extra) {
    if (key === "mini" && (src === "ad" || src === "qr")) return TEXTS[src] + (extra || "");
    var tag = SRC_TAG[src] && key !== "heal" && key !== "jobs" ? " · " + SRC_TAG[src] : "";
    if (key && key !== "site" && TEXTS.hasOwnProperty(key)) return TEXTS[key] + (extra || "") + tag;
    return (SRC_TAG[src] ? TEXTS[src] : TEXTS.site) + (extra || "");
  }
  function waLink(text) { return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text); }
  document.querySelectorAll(".js-wa").forEach(function (a) {
    if (!WHATSAPP) return;
    a.href = waLink(textFor(a.getAttribute("data-wa"), a.getAttribute("data-wa-extra")));
    a.target = "_blank"; a.rel = "noopener";
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest(".js-wa");
    if (!a) return;
    set("sessionStorage", "jf-wa", "1");
    track("whatsapp_click", { kind: a.getAttribute("data-wa") || "site", source: src || "direct" });
  });

  /* Time-boxed blocks: data-until="YYYY-MM-DD" disappears on that day, data-from appears on it (Israel time) */
  var now = new Date();
  function day(d) { return new Date(d + "T00:00:00+02:00"); }
  document.querySelectorAll("[data-until]").forEach(function (el) { if (now >= day(el.getAttribute("data-until"))) el.remove(); });
  document.querySelectorAll("[data-from]").forEach(function (el) { if (now < day(el.getAttribute("data-from"))) el.remove(); });

  /* Nav: solid after a scroll (always on short pages), compact after the first screen */
  var nav = document.querySelector(".nav");
  var hero = document.getElementById("top");
  var isHome = !!document.querySelector(".site--home");
  function onScroll() {
    if (!nav) return;
    var y = window.scrollY;
    nav.classList.toggle("is-solid", !isHome || y > 40);
    nav.classList.toggle("is-compact", y > (hero && isHome ? hero.offsetHeight - 120 : 240));
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mobile booking bar. One red button on screen at a time: the bar hides while one of the page's own red booking
     buttons (hero, section buttons, closer) is on screen, and otherwise borrows the words and WhatsApp message of the
     section crossing the middle of the screen, so the thumb button always matches what the visitor is reading. */
  var mbar = document.getElementById("mbar");
  function mbarOn(on) { if (!mbar) return; mbar.classList.toggle("is-on", on); mbar.setAttribute("aria-hidden", on ? "false" : "true"); mbar.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; }); }
  if (mbar) {
    var mLink = mbar.querySelector("a"), mText = document.createElement("span");
    var words = function (b) { return [].slice.call(b.childNodes).filter(function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent; }).join("").trim(); };
    var asCta = function (b) { return { href: b.href, text: words(b), kind: b.getAttribute("data-wa") || "site" }; };
    var take = function (c) { mLink.href = c.href; mText.textContent = c.text; mLink.setAttribute("data-wa", c.kind); };
    var pageBtn = !isHome && document.querySelector("main .btn--book.js-wa");
    var base = pageBtn ? asCta(pageBtn) : asCta(mLink);
    [].slice.call(mLink.childNodes).forEach(function (n) { if (n.nodeType === 3) mLink.removeChild(n); });
    mLink.appendChild(mText);
    take(base);
    if ("IntersectionObserver" in window) {
      var onScreen = [];
      var redIo = new IntersectionObserver(function (es) {
        es.forEach(function (e) { var i = onScreen.indexOf(e.target); if (e.isIntersecting && i < 0) onScreen.push(e.target); if (!e.isIntersecting && i > -1) onScreen.splice(i, 1); });
        mbarOn(onScreen.length === 0 || mbar.contains(document.activeElement));
      });
      document.querySelectorAll("main .btn--book.js-wa, .closer .btn--book.js-wa").forEach(function (b) { redIo.observe(b); });
      var secIo = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (!e.isIntersecting) return; var b = e.target.querySelector(".btn--book.js-wa"); take(b ? asCta(b) : base); });
      }, { rootMargin: "-50% 0px -50% 0px" });
      document.querySelectorAll("main section, main > header, .closer").forEach(function (s) { secIo.observe(s); });
    } else mbarOn(true);
  }

  /* Hero video: pause control (WCAG 2.2.2), paused for reduced motion */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var vid = document.querySelector(".hero__bg"), tog = document.getElementById("hero-toggle");
  if (vid && hero) {
    var setPaused = function (p) { hero.classList.toggle("is-paused", p); if (tog) tog.setAttribute("aria-label", p ? "הפעלת הווידאו" : "עצירת הווידאו"); };
    if (reduce) { vid.removeAttribute("autoplay"); vid.pause(); setPaused(true); }
    if (tog) tog.addEventListener("click", function () { if (vid.paused) { vid.play().catch(function () {}); setPaused(false); } else { vid.pause(); setPaused(true); } });
  }

  /* Hero video: stop decoding while the hero is off screen (battery), unless the visitor paused it */
  if (vid && hero && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      if (hero.classList.contains("is-paused")) return;
      if (es[0].isIntersecting) vid.play().catch(function () {}); else vid.pause();
    }).observe(hero);
  }

  /* Mobile menu */
  var drawer = document.getElementById("drawer"), openBtn = document.getElementById("menu-open");
  if (drawer && openBtn) {
    /* A modal <dialog>: focus stays inside, the page behind is inert, Escape closes it and focus returns to the menu button */
    var closeDrawer = function () { if (drawer.open) drawer.close(); };
    drawer.addEventListener("close", function () { openBtn.setAttribute("aria-expanded", "false"); });
    openBtn.addEventListener("click", function () { if (drawer.showModal) drawer.showModal(); else drawer.setAttribute("open", ""); openBtn.setAttribute("aria-expanded", "true"); var c = document.getElementById("menu-close"); if (c) c.focus(); });
    document.getElementById("menu-close").addEventListener("click", closeDrawer);
    drawer.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(); });
  }

  /* Gallery: filter + lightbox */
  var chips = document.querySelectorAll(".chip"), tiles = document.querySelectorAll(".tile");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      var f = c.getAttribute("data-filter");
      tiles.forEach(function (t) { t.hidden = !(f === "all" || t.getAttribute("data-kind") === f); });
    });
  });
  var lb = document.getElementById("lb");
  if (lb) {
    var lbImg = document.getElementById("lb-img"), lbCap = document.getElementById("lb-cap");
    document.querySelectorAll(".tile img").forEach(function (img) {
      img.tabIndex = 0; img.setAttribute("role", "button");
      var openLb = function () { lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = img.closest("figure").querySelector("figcaption span").textContent; if (lb.showModal) lb.showModal(); };
      img.addEventListener("click", openLb);
      img.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(); } });
    });
    document.getElementById("lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  }

  /* "First to know" mailing list: name + email (+ optional phone), unticked consent.
     On every screen the automatic prompt is a thin bar (phone: above the booking bar; tablet and up: the bottom-left corner,
     away from the WhatsApp button). It never takes focus and never covers the hero; the form opens only on click.
     Auto-shows once per visit after ~20 s or half the page, once the hero is scrolled past; after closing, not again for 30 days. */
  var nl = document.getElementById("nl"), nlbar = document.getElementById("nlbar");
  if (nl && nl.showModal) {
    var DAY = 1000 * 60 * 60 * 24;
    var blocked = function () { return nl.open || (lb && lb.open) || (drawer && drawer.open); };
    var openNl = function (modal) {
      if (blocked()) return;
      if (nlbar) nlbar.hidden = true;
      nl.classList.toggle("is-float", !modal);
      if (modal) nl.showModal(); else nl.show();
      track("list_popup", { mode: modal ? "modal" : "float" });
    };
    /* Hiding the bar or the window must not drop keyboard focus to the top of the page */
    var lastOut = null;
    document.addEventListener("focusin", function (e) { if (!(nlbar && nlbar.contains(e.target)) && !nl.contains(e.target)) lastOut = e.target; });
    var refocus = function () { var t = document.querySelector("#mbar.is-on a") || lastOut; if (t && t.isConnected) t.focus({ preventScroll: true }); };
    var dismiss = function () { var inBar = nlbar && nlbar.contains(document.activeElement); set("localStorage", "jf-nl-closed", String(Date.now())); if (nlbar) nlbar.hidden = true; if (nl.open) nl.close(); if (inBar) refocus(); };
    nl.addEventListener("close", function () { var a = document.activeElement; if (!a || a === document.body || nl.contains(a) || (nlbar && nlbar.contains(a))) refocus(); });
    document.querySelectorAll("[data-open-nl]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openNl(true); }); });
    document.querySelectorAll("[data-dismiss-nl]").forEach(function (b) { b.addEventListener("click", dismiss); });
    nl.addEventListener("click", function (e) { if (e.target === nl || e.target.closest("[data-close-nl]")) dismiss(); });
    nl.addEventListener("cancel", function () { set("localStorage", "jf-nl-closed", String(Date.now())); });
    nl.addEventListener("keydown", function (e) { if (e.key === "Escape" && !nl.matches(":modal")) dismiss(); });

    var form = document.getElementById("nl-form"), done = document.getElementById("nl-done"), err = document.getElementById("nl-err");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = String(d.get("name") || "").trim(), email = String(d.get("email") || "").trim(), tel = String(d.get("phone") || "").trim();
      var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      var bad = !name ? "nl-name" : !emailOk ? "nl-email" : !d.get("consent") ? "nl-consent" : "";
      var problem = !name ? "חסר שם." : !emailOk ? (email ? "המייל לא נראה תקין." : "חסר מייל.") : !d.get("consent") ? "צריך לסמן את תיבת ההסכמה." : "";
      form.querySelectorAll("input").forEach(function (i) { i.removeAttribute("aria-invalid"); i.removeAttribute("aria-describedby"); });
      if (problem) { var f = document.getElementById(bad); f.setAttribute("aria-invalid", "true"); f.setAttribute("aria-describedby", "nl-err"); err.textContent = problem; err.hidden = false; f.focus(); return; }
      err.hidden = true;
      if (LIST_ENDPOINT) {
        fetch(LIST_ENDPOINT, { method: "POST", mode: "no-cors", body: d }).catch(function () {});
      } else if (WHATSAPP) {
        /* No mailing tool connected yet: the sign-up arrives as a WhatsApp message to the studio */
        var signup = waLink(TEXTS.list + "\nשם: " + name + "\nמייל: " + email + (tel ? "\nטלפון: " + tel : "") + "\nהסכמה: סימנתי באתר ״אשמח לקבל מ-Jellyfish Tattoo עדכונים על דפי פלאש ותורים פנויים. אפשר להסיר בכל רגע.״");
        window.open(signup, "_blank", "noopener");
      }
      set("localStorage", "jf-nl-joined", "1");
      track("sign_up", { method: "list" });
      try { if (window.fbq) window.fbq("track", "Lead", { content_name: "list" }); } catch (x) {}
      form.hidden = true; done.hidden = false;
      if (!LIST_ENDPOINT) {
        /* No mailing tool yet: the sign-up is the WhatsApp message that just opened, so ask them to send it */
        var dl = done.querySelector(".latin"), dh = done.querySelector("h2"), dp = done.querySelector("p");
        if (dl) dl.textContent = "One more step";
        if (dh) dh.textContent = "עוד צעד אחד.";
        if (dp) dp.textContent = "שלחו את ההודעה שנפתחה בוואטסאפ, ואתם ברשימה. דף הפלאש הבא יגיע אליכם 24 שעות לפני כולם.";
        /* the button resends exactly that sign-up message, in case the WhatsApp tab was blocked or closed */
        var cta = done.querySelector(".js-wa");
        if (cta && signup) { cta.href = signup; cta.setAttribute("data-wa", "list"); cta.lastChild.textContent = "לשליחת ההודעה בוואטסאפ"; }
      }
      done.focus();
    });

    var closedAt = Number(get("localStorage", "jf-nl-closed") || 0);
    var eligible = !get("localStorage", "jf-nl-joined") && Date.now() - closedAt > 30 * DAY && !get("sessionStorage", "jf-nl-shown") && !params.has("nopopup");
    if (eligible) {
      var fired = false;
      var auto = function () {
        if (fired || get("sessionStorage", "jf-wa") || blocked()) return;
        if (isHome && hero && hero.getBoundingClientRect().bottom > 0) { clearTimeout(timer); timer = setTimeout(auto, 4000); return; }
        fired = true; set("sessionStorage", "jf-nl-shown", "1");
        window.removeEventListener("scroll", onDepth); clearTimeout(timer);
        if (nlbar) nlbar.hidden = false; else openNl(false);
      };
      var onDepth = function () { var h = document.documentElement.scrollHeight - window.innerHeight; if (h > 0 && window.scrollY / h > 0.5) auto(); };
      var timer = setTimeout(auto, 20000);
      window.addEventListener("scroll", onDepth, { passive: true });
    }
  }

  /* Smooth scrolling for in-page links only, not for the jump to a #section on arrival, which it would cut short */
  window.addEventListener("load", function () { setTimeout(function () { document.documentElement.classList.add("smooth-scroll"); }, 300); });

  /* Print / save as PDF */
  document.querySelectorAll("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });
})();
