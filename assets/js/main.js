/* ZAD Agency website interactions */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Project data (Work page grid + filters)
     cat: brand | print | web | ads
     ------------------------------------------------------------------ */
  var PROJECTS = [
    { title: "Thiết kế nhận diện thương hiệu PURE", img: "work-pure.jpg", cat: ["brand"] },
    { title: "Thiết kế logo & nhận diện thương hiệu MinAI", img: "work-minai.jpg", cat: ["brand", "print"] },
    { title: "Tái định hình nhận diện thương hiệu Suoi Leo", img: "work-suoileo.jpg", cat: ["brand"] },
    { title: "Xây dựng hệ thống thương hiệu VIA Hồ Tràm", img: "work-via-hotram.jpg", cat: ["brand", "ads"] },
    { title: "Xây dựng nhận diện thương hiệu AUREA Dental", img: "work-aurea-interior.jpg", cat: ["brand", "print"] },
    { title: "Xây dựng hệ thống nhận diện thương hiệu VIAS Pickleball Academy", img: "work-vias.jpg", cat: ["brand", "ads"] },
    { title: "Định hình dấu ấn thương hiệu NGỌC HÀ", img: "work-ngocha.jpg", cat: ["brand"] },
    { title: "Thiết kế hệ thống visual Cốc Cốc", img: "work-coccoc.jpg", cat: ["ads", "web"] },
    { title: "Thiết kế hệ thống truyền thông sự kiện Viettel Academy", img: "work-viettel.jpg", cat: ["ads"] },
    { title: "Thiết kế Google Doodle chủ đề Rồng Việt", img: "work-google.jpg", cat: ["web"] },
    { title: "Thiết kế hệ thống truyền thông AUREA Dental", img: "work-aurea-billboard.jpg", cat: ["ads", "print"] }
  ];

  var IMG_PATH = "assets/img/";

  /* ------------------------------------------------------------------
     Intro loader (home page, once per browser session)
     ------------------------------------------------------------------ */
  function initIntro() {
    var intro = doc.querySelector("[data-intro]");
    if (!intro) return;

    var seen = false;
    try {
      seen = sessionStorage.getItem("zad-intro") === "1";
    } catch (e) {}

    if (seen || reduceMotion) {
      intro.classList.add("is-done");
      root.classList.remove("is-intro-pending");
      return;
    }

    doc.body.classList.add("is-locked");

    var finish = function () {
      intro.classList.add("is-leaving");
      root.classList.remove("is-intro-pending");
      doc.body.classList.remove("is-locked");
      try {
        sessionStorage.setItem("zad-intro", "1");
      } catch (e) {}
      setTimeout(function () {
        intro.classList.add("is-done");
      }, 1200);
    };

    var start = Date.now();
    var ready = function () {
      var wait = Math.max(0, 1900 - (Date.now() - start));
      setTimeout(finish, wait);
    };

    if (doc.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    intro.addEventListener("click", finish, { once: true });
  }

  /* ------------------------------------------------------------------
     Header: solid background after scrolling, hides on scroll down
     ------------------------------------------------------------------ */
  function initHeader() {
    var header = doc.querySelector(".site-header");
    if (!header) return;
    var lastY = window.scrollY;
    var ticking = false;

    var update = function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);
      var goingDown = y > lastY && y > 240;
      header.classList.toggle("is-hidden", goingDown && !doc.body.classList.contains("is-locked"));
      lastY = y;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ------------------------------------------------------------------
     Full-screen menu
     ------------------------------------------------------------------ */
  function initMenu() {
    var menu = doc.querySelector("[data-menu]");
    if (!menu) return;
    var openers = doc.querySelectorAll("[data-menu-open]");
    var closer = menu.querySelector("[data-menu-close]");
    var lastFocus = null;

    var open = function () {
      lastFocus = doc.activeElement;
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      openers.forEach(function (b) {
        b.setAttribute("aria-expanded", "true");
      });
      doc.body.classList.add("is-locked");
      setTimeout(function () {
        closer.focus();
      }, 50);
    };

    var close = function () {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      openers.forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
      });
      doc.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    };

    openers.forEach(function (b) {
      b.addEventListener("click", open);
    });
    closer.addEventListener("click", close);
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (a.hash && a.pathname === location.pathname) close();
      });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) close();
    });
  }

  /* ------------------------------------------------------------------
     Services accordion (one open at a time, image follows)
     ------------------------------------------------------------------ */
  function initAccordion() {
    var acc = doc.querySelector("[data-accordion]");
    if (!acc) return;
    var items = acc.querySelectorAll(".accordion__item");
    var media = doc.querySelectorAll("[data-service-img]");

    var activate = function (index) {
      items.forEach(function (item, i) {
        var on = i === index;
        item.classList.toggle("is-open", on);
        item.querySelector(".accordion__head").setAttribute("aria-expanded", on ? "true" : "false");
      });
      media.forEach(function (img) {
        img.classList.toggle("is-active", Number(img.getAttribute("data-service-img")) === index);
      });
    };

    items.forEach(function (item, i) {
      item.querySelector(".accordion__head").addEventListener("click", function () {
        activate(i);
      });
    });
  }

  /* ------------------------------------------------------------------
     Work cards: "View project" bubble follows the pointer
     ------------------------------------------------------------------ */
  function bindCard(media) {
    var setPos = function (x, y) {
      media.style.setProperty("--x", x + "px");
      media.style.setProperty("--y", y + "px");
    };
    media.addEventListener("pointerenter", function (e) {
      var r = media.getBoundingClientRect();
      setPos(e.clientX - r.left, e.clientY - r.top);
    });
    media.addEventListener("pointermove", function (e) {
      var r = media.getBoundingClientRect();
      setPos(e.clientX - r.left, e.clientY - r.top);
    });
    media.addEventListener("focus", function () {
      setPos(media.clientWidth / 2, media.clientHeight / 2);
    });
  }

  function initCards(scope) {
    (scope || doc).querySelectorAll(".card__media").forEach(function (m) {
      if (m.dataset.bound) return;
      m.dataset.bound = "1";
      bindCard(m);
    });
  }

  /* ------------------------------------------------------------------
     Lightbox for project images
     ------------------------------------------------------------------ */
  var lightbox = null;

  function initLightbox() {
    lightbox = doc.querySelector("[data-lightbox]");
    if (!lightbox) return;

    var img = lightbox.querySelector(".lightbox__img");
    var caption = lightbox.querySelector(".lightbox__caption");
    var list = [];
    var index = 0;
    var lastFocus = null;

    var show = function (i) {
      index = (i + list.length) % list.length;
      var link = list[index];
      img.src = link.getAttribute("href");
      img.alt = link.getAttribute("data-title") || "";
      caption.textContent = link.getAttribute("data-title") || "";
    };

    var open = function (link) {
      list = Array.prototype.slice.call(doc.querySelectorAll(".card__media"));
      lastFocus = doc.activeElement;
      show(list.indexOf(link));
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      doc.body.classList.add("is-locked");
      lightbox.querySelector(".lightbox__close").focus();
    };

    var close = function () {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      doc.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    };

    doc.addEventListener("click", function (e) {
      var link = e.target.closest(".card__media");
      if (!link) return;
      e.preventDefault();
      open(link);
    });

    lightbox.querySelector(".lightbox__close").addEventListener("click", close);
    lightbox.querySelector("[data-prev]").addEventListener("click", function () {
      show(index - 1);
    });
    lightbox.querySelector("[data-next]").addEventListener("click", function () {
      show(index + 1);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    doc.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* ------------------------------------------------------------------
     Work page: filters + layout (repeats the Figma block pattern)
     Block A = 2 small + 1 wide on the left, 1 tall + 1 banner on the right
     Block B = square + landscape
     ------------------------------------------------------------------ */
  function cardHTML(p, variant, delay) {
    return (
      '<figure class="card card--' + variant + ' is-entering" style="--delay:' + delay + 's">' +
      '<a class="card__media" href="' + IMG_PATH + p.img + '" data-title="' + p.title.replace(/"/g, "&quot;") + '">' +
      '<img src="' + IMG_PATH + p.img + '" alt="' + p.title.replace(/"/g, "&quot;") + '" loading="lazy" decoding="async">' +
      '<span class="card__view">View project</span>' +
      "</a>" +
      '<figcaption class="card__caption">' + p.title + "</figcaption>" +
      "</figure>"
    );
  }

  function buildLayout(items) {
    var html = "";
    var i = 0;
    var d = 0;
    var block = 0;
    var next = function (variant) {
      var out = cardHTML(items[i++], variant, Math.min(d, 0.5));
      d += 0.08;
      return out;
    };

    while (i < items.length) {
      var left = items.length - i;
      var useA = block % 2 === 0;
      d = 0;

      if (useA && left >= 5) {
        // Items keep their order: 2 small, tall (right), wide (left), banner (right)
        var s1 = next("small");
        var s2 = next("small");
        var tall = next("tall");
        var wide = next("wide");
        var banner = next("banner");
        html +=
          '<div class="works__a"><div class="works__a-left">' + s1 + s2 + wide +
          '</div><div class="works__a-right">' + tall + banner + "</div></div>";
      } else if (left >= 2) {
        html +=
          '<div class="works__b' + (block % 4 === 3 ? " works__b--flip" : "") + '">' +
          (block % 4 === 3 ? next("landscape") + next("square") : next("square") + next("landscape")) +
          "</div>";
      } else {
        html += '<div class="works__d">' + next("full") + "</div>";
      }
      block++;
    }
    return html;
  }

  function initWorkPage() {
    var grid = doc.querySelector("[data-works]");
    if (!grid) return;
    var buttons = doc.querySelectorAll("[data-filter]");

    var render = function (filter) {
      var items = PROJECTS.filter(function (p) {
        return filter === "all" || p.cat.indexOf(filter) !== -1;
      });
      grid.innerHTML = items.length
        ? buildLayout(items)
        : '<p class="works__empty">Dự án đang được cập nhật.</p>';
      initCards(grid);
    };

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        render(btn.getAttribute("data-filter"));
      });
    });

    var fromHash = function () {
      var key = (location.hash || "").replace("#", "");
      var match = doc.querySelector('[data-filter="' + key + '"]');
      if (match) match.click();
      return !!match;
    };

    if (!fromHash()) render("all");
    window.addEventListener("hashchange", fromHash);
  }

  /* ------------------------------------------------------------------
     About: photo slider
     ------------------------------------------------------------------ */
  function initGallery() {
    var gallery = doc.querySelector("[data-gallery]");
    if (!gallery) return;
    var slides = gallery.querySelectorAll(".gallery__slide");
    var dotsWrap = gallery.querySelector(".gallery__dots");
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var dots = [];

    slides.forEach(function (_, i) {
      var b = doc.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ảnh " + (i + 1));
      b.addEventListener("click", function () {
        go(i);
        restart();
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    var go = function (i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        s.classList.toggle("is-active", n === index);
      });
      dots.forEach(function (d, n) {
        d.setAttribute("aria-current", n === index ? "true" : "false");
      });
    };

    var restart = function () {
      clearInterval(timer);
      if (!reduceMotion) {
        timer = setInterval(function () {
          go(index + 1);
        }, 5000);
      }
    };

    go(0);
    restart();
  }

  /* ------------------------------------------------------------------
     Count-up numbers
     ------------------------------------------------------------------ */
  function countUp(el) {
    var target = Number(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var dur = 1800;
    var t0 = null;
    var step = function (t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     Scroll-triggered reveals
     ------------------------------------------------------------------ */
  function initReveal() {
    var targets = doc.querySelectorAll(".reveal, [data-observe]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      doc.querySelectorAll("[data-count]").forEach(countUp);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-visible");
          el.querySelectorAll("[data-count]").forEach(countUp);
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  function initYear() {
    doc.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  initIntro();
  initHeader();
  initMenu();
  initAccordion();
  initWorkPage();
  initCards();
  initLightbox();
  initGallery();
  initReveal();
  initYear();
})();
