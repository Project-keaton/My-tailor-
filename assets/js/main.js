/**
 * My Tailor — site behaviour
 * Vanilla JS, no dependencies. Loaded with `defer`.
 *
 *  - Header state (scrolled / hide on scroll down)
 *  - Accessible mobile menu
 *  - Scroll reveal animations
 *  - Contact form validation + success state (UI only)
 *  - Service pre-selection from ?service= query string
 *  - Footer year
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     Header: solid background after scrolling, hide on scroll down
  ------------------------------------------------------------------ */
  var header = document.querySelector("[data-header]");
  if (header) {
    var lastY = window.scrollY;
    var ticking = false;

    var updateHeader = function () {
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 40);

      // Only auto-hide once the user is well past the top, and never while the menu is open
      if (!body.classList.contains("menu-open")) {
        var goingDown = y > lastY && y > 400;
        header.classList.toggle("is-hidden", goingDown);
      }
      lastY = y;
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
  }

  /* ------------------------------------------------------------------
     Mobile menu
  ------------------------------------------------------------------ */
  var toggle = document.querySelector("[data-nav-toggle]");
  var menu = document.getElementById("mobile-menu");

  if (toggle && menu) {
    var toggleLabel = toggle.querySelector("[data-nav-label]");

    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (toggleLabel) toggleLabel.textContent = open ? "Close" : "Menu";
      menu.classList.toggle("is-open", open);
      menu.toggleAttribute("inert", !open);
      menu.setAttribute("aria-hidden", String(!open));
      body.classList.toggle("menu-open", open);
      body.classList.toggle("is-locked", open);

      if (open) {
        var firstLink = menu.querySelector("a");
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    };

    // Start closed and out of the tab order
    menu.setAttribute("inert", "");
    menu.setAttribute("aria-hidden", "true");

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close on Escape and return focus to toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close when a link is chosen
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Close if viewport grows to desktop
    window.matchMedia("(min-width: 62em)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     Scroll reveal
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     Contact form (front-end only — wire to a backend / form service)
  ------------------------------------------------------------------ */
  var form = document.querySelector("[data-contact-form]");

  if (form) {
    // Pre-select a service from ?service=slug (linked from Services page)
    var params = new URLSearchParams(window.location.search);
    var preset = params.get("service");
    var select = form.querySelector("#service");
    if (preset && select) {
      var match = select.querySelector('option[value="' + CSS.escape(preset) + '"]');
      if (match) select.value = preset;
    }

    var messages = {
      name: "Please tell us your name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      service: "Please choose a service.",
      message: "Please add a short message.",
      consent: "Please agree so we can contact you."
    };

    var showError = function (field, show) {
      var wrap = field.closest(".field") || field.closest(".consent-wrap");
      if (!wrap) return;
      var err = wrap.querySelector(".field__error");
      wrap.classList.toggle("has-error", show);
      field.setAttribute("aria-invalid", String(show));
      if (err) err.textContent = show ? (messages[field.name] || "Please check this field.") : "";
    };

    var validateField = function (field) {
      var valid = field.checkValidity();
      showError(field, !valid);
      return valid;
    };

    // Validate on blur, clear on input once corrected
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        if (field.value || field.type === "checkbox") validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll("[required]");
      var firstInvalid = null;

      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // Simulated submission — replace with fetch() to your endpoint
      var submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      submit.querySelector("span").textContent = "Sending…";

      window.setTimeout(function () {
        var success = document.querySelector("[data-form-success]");
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.focus();
        }
      }, 700);
    });
  }

  /* ------------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------ */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  root.classList.add("is-ready");
})();
