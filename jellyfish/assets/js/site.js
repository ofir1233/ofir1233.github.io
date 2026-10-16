(function () {
  "use strict";

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
    var t;
    if (key && key !== "site") t = (key === "mini" && (src === "ad" || src === "qr")) ? TEXTS[src] : TEXTS[key];
    if (!t) t = TEXTS[src] && src !== "site" ? TEXTS[src] : TEXTS.site;
    return t + (extra || "");
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

  /* Mobile booking bar: after the hero on the home page, always on short pages */
  var mbar = document.getElementById("mbar");
  function mbarOn(on) { if (!mbar) return; mbar.classList.toggle("is-on", on); mbar.setAttribute("aria-hidden", on ? "false" : "true"); mbar.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; }); }
  if (mbar) {
    if (isHome && hero && "IntersectionObserver" in window) new IntersectionObserver(function (es) { mbarOn(!es[0].isIntersecting); }, { threshold: 0.05 }).observe(hero);
    else mbarOn(true);
  }

  /* Hero video: pause control (WCAG 2.2.2), paused for reduced motion */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vid = document.querySelector(".hero__bg"), tog = document.getElementById("hero-toggle");
  if (vid && hero) {
    var setPaused = function (p) { hero.classList.toggle("is-paused", p); if (tog) { tog.setAttribute("aria-pressed", p ? "true" : "false"); tog.setAttribute("aria-label", p ? "הפעלת הווידאו" : "עצירת הווידאו"); } };
    if (reduce) { vid.removeAttribute("autoplay"); vid.pause(); setPaused(true); }
    if (tog) tog.addEventListener("click", function () { if (vid.paused) { vid.play().catch(function () {}); setPaused(false); } else { vid.pause(); setPaused(true); } });
  }

  /* Mobile menu */
  var drawer = document.getElementById("drawer"), openBtn = document.getElementById("menu-open");
  if (drawer && openBtn) {
    var closeDrawer = function () { drawer.hidden = true; openBtn.setAttribute("aria-expanded", "false"); };
    openBtn.addEventListener("click", function () { drawer.hidden = false; openBtn.setAttribute("aria-expanded", "true"); var c = document.getElementById("menu-close"); if (c) c.focus(); });
    document.getElementById("menu-close").addEventListener("click", closeDrawer);
    drawer.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !drawer.hidden) closeDrawer(); });
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
     Desktop: a small card in the bottom-left corner, away from the WhatsApp button. Phone: a thin bar above the booking bar,
     never a full-screen window. Auto-shows once per visit after ~20 s or half the page; after closing, not again for 30 days. */
  var nl = document.getElementById("nl"), nlbar = document.getElementById("nlbar");
  if (nl && nl.showModal) {
    var DAY = 1000 * 60 * 60 * 24;
    var phone = function () { return window.matchMedia("(max-width: 767px)").matches; };
    var blocked = function () { return nl.open || (lb && lb.open) || (drawer && !drawer.hidden); };
    var openNl = function (modal) {
      if (blocked()) return;
      if (nlbar) nlbar.hidden = true;
      nl.classList.toggle("is-float", !modal);
      if (modal) nl.showModal(); else nl.show();
      track("list_popup", { mode: modal ? "modal" : "float" });
    };
    var dismiss = function () { set("localStorage", "jf-nl-closed", String(Date.now())); if (nlbar) nlbar.hidden = true; if (nl.open) nl.close(); };
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
      var problem = !name ? "חסר שם." : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? "המייל לא נראה תקין." : !d.get("consent") ? "צריך לסמן את תיבת ההסכמה." : "";
      if (problem) { err.textContent = problem; err.hidden = false; (form.querySelector(":invalid") || form.querySelector("input")).focus(); return; }
      err.hidden = true;
      if (LIST_ENDPOINT) {
        fetch(LIST_ENDPOINT, { method: "POST", mode: "no-cors", body: d }).catch(function () {});
      } else if (WHATSAPP) {
        /* No mailing tool connected yet: the sign-up arrives as a WhatsApp message to the studio */
        window.open(waLink(TEXTS.list + "\nשם: " + name + "\nמייל: " + email + (tel ? "\nטלפון: " + tel : "")), "_blank", "noopener");
      }
      set("localStorage", "jf-nl-joined", "1");
      track("sign_up", { method: "list" });
      try { if (window.fbq) window.fbq("track", "Lead", { content_name: "list" }); } catch (x) {}
      form.hidden = true; done.hidden = false; done.focus();
    });

    var closedAt = Number(get("localStorage", "jf-nl-closed") || 0);
    var eligible = !get("localStorage", "jf-nl-joined") && Date.now() - closedAt > 30 * DAY && !get("sessionStorage", "jf-nl-shown") && !params.has("nopopup");
    if (eligible) {
      var fired = false;
      var auto = function () {
        if (fired || get("sessionStorage", "jf-wa") || blocked()) return;
        fired = true; set("sessionStorage", "jf-nl-shown", "1");
        window.removeEventListener("scroll", onDepth); clearTimeout(timer);
        if (phone() && nlbar) nlbar.hidden = false; else openNl(false);
      };
      var onDepth = function () { var h = document.documentElement.scrollHeight - window.innerHeight; if (h > 0 && window.scrollY / h > 0.5) auto(); };
      var timer = setTimeout(auto, 20000);
      window.addEventListener("scroll", onDepth, { passive: true });
    }
  }

  /* Print / save as PDF */
  document.querySelectorAll("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });
})();
