/* ==========================================================================
   Meadow — landing page behaviour
   No dependencies. Progressive enhancement only.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Signal the head-script failsafe that the behaviour layer is active.
  document.documentElement.dataset.enhanced = "true";

  /* ---------- Mobile navigation ---------- */
  var nav = document.querySelector(".nav");
  var navToggle = document.querySelector(".nav__toggle");

  if (nav && navToggle) {
    var setOpen = function (open) {
      nav.setAttribute("data-open", String(open));
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", function () {
      setOpen(nav.getAttribute("data-open") !== "true");
    });

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    nav.querySelectorAll(".nav__list a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
  }

  /* ---------- Backdrop video: respect reduced motion + data saver ---------- */
  var video = document.querySelector(".backdrop__video");
  if (video) {
    var pauseForMotion = function () {
      if (reduceMotion.matches) {
        video.pause();
        video.removeAttribute("autoplay");
      } else if (video.paused) {
        video.play().catch(function () { /* autoplay blocked; poster remains */ });
      }
    };

    var connection = navigator.connection;
    if (connection && (connection.saveData || /2g/.test(connection.effectiveType || ""))) {
      video.removeAttribute("autoplay");
      video.setAttribute("preload", "none");
    }

    pauseForMotion();
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", pauseForMotion);
    else if (reduceMotion.addListener) reduceMotion.addListener(pauseForMotion);
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length) {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

      revealTargets.forEach(function (el) { observer.observe(el); });
    }
  }

  /* ---------- KPI count-up ---------- */
  var compact = function (value) {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return String(Math.round(value));
  };

  var formatValue = function (el, value) {
    var mode = el.getAttribute("data-format") || "plain";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);

    if (mode === "compact") return compact(value);
    if (mode === "percent") return value.toFixed(decimals) + "%";
    return String(Math.round(value));
  };

  var counters = document.querySelectorAll(".kpi__value[data-count-to]");
  var runCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count-to")) || 0;
    var prefix = el.getAttribute("data-prefix") || "";
    var mode = el.getAttribute("data-format") || "plain";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);

    var render = function (value) {
      if (mode === "percent") {
        el.textContent = value.toFixed(decimals) + "%";
        return;
      }
      el.textContent = prefix + formatValue(el, value);
    };

    if (reduceMotion.matches) { render(target); return; }

    var duration = 1100;
    var start = null;

    var step = function (timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      render(target * eased);
      if (progress < 1) window.requestAnimationFrame(step);
      else render(target);
    };

    window.requestAnimationFrame(step);
  };

  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCount);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- Billing toggle ---------- */
  var billingButtons = document.querySelectorAll("[data-billing]");
  var amounts = document.querySelectorAll(".plan__amount");
  var periods = document.querySelectorAll(".plan__period");

  if (billingButtons.length) {
    billingButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var period = btn.getAttribute("data-billing");

        billingButtons.forEach(function (other) {
          var active = other === btn;
          other.classList.toggle("is-active", active);
          other.setAttribute("aria-pressed", String(active));
        });

        amounts.forEach(function (el) {
          el.textContent = "$" + el.getAttribute("data-" + period);
        });

        periods.forEach(function (el) {
          el.textContent = el.getAttribute("data-" + period);
        });
      });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
