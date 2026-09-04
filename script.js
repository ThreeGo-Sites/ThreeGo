(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================================================
     1) PAGE LOADER — progress bar + percentage
     ========================================================= */
  var loader = document.getElementById("loader");
  var fill = document.getElementById("loaderFill");
  var pct = document.getElementById("loaderPct");

  function runLoader() {
    if (reduceMotion) {
      finishLoader();
      return;
    }
    var value = 0;
    var timer = setInterval(function () {
      // uneven increments feel more like real loading than a linear ramp
      value += Math.random() * 18 + 6;
      if (value >= 100) {
        value = 100;
        clearInterval(timer);
        setTimeout(finishLoader, 220);
      }
      fill.style.width = value + "%";
      pct.textContent = Math.floor(value) + "%";
    }, 140);
  }

  function finishLoader() {
    if (fill) fill.style.width = "100%";
    if (pct) pct.textContent = "100%";
    if (loader) {
      loader.classList.add("is-done");
      // orchestrated hero entrance fires right as the loader clears
      setTimeout(revealHero, 250);
    } else {
      revealHero();
    }
  }

  function revealHero() {
    var heroItems = document.querySelectorAll(".hero-inner [data-reveal]");
    heroItems.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // safety net: never let the loader trap the user
  window.addEventListener("load", function () {
    setTimeout(function () {
      if (loader && !loader.classList.contains("is-done")) finishLoader();
    }, 3000);
  });

  runLoader();

  /* =========================================================
     2) SCROLL-TRIGGERED REVEAL for everything below the fold
     ========================================================= */
  var revealTargets = document.querySelectorAll(
    "[data-reveal]:not(.hero-inner [data-reveal])"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* =========================================================
     3) LAZY "LOADING" OF PORTFOLIO SHOTS (skeleton -> art)
     ========================================================= */
  var shots = document.querySelectorAll("[data-lazy-shot]");

  if ("IntersectionObserver" in window) {
    var shotIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var card = entry.target;
            // simulate a real asset fetch so the skeleton has a purpose
            var delay = reduceMotion ? 0 : 500 + Math.random() * 500;
            setTimeout(function () {
              card.classList.add("is-loaded");
            }, delay);
            shotIo.unobserve(card);
          }
        });
      },
      { threshold: 0.3 }
    );
    shots.forEach(function (el) {
      shotIo.observe(el);
    });
  } else {
    shots.forEach(function (el) {
      el.classList.add("is-loaded");
    });
  }

  /* =========================================================
     4) HEADER STATE ON SCROLL + SCROLL PROGRESS BAR
     ========================================================= */
  var header = document.getElementById("siteHeader");
  var scrollProgress = document.getElementById("scrollProgress");
  var whatsFloat = document.getElementById("whatsFloat");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle("is-scrolled", y > 30);
    if (whatsFloat) whatsFloat.classList.toggle("is-visible", y > 300);

    if (scrollProgress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var ratio = max > 0 ? (y / max) * 100 : 0;
      scrollProgress.style.width = ratio + "%";
    }
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* =========================================================
     5) MOBILE NAV TOGGLE
     ========================================================= */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================================================
     6) FOOTER YEAR
     ========================================================= */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
