/**
 * Brand logo hook animation — GSAP timeline on #brandLogo.
 * Exposed via window.ProductSwitcherLogo for main.js bootstrap.
 */
(function () {
  "use strict";

  var logoTimeline = null;

  /** Hook animation — mark caught by arc, bar snaps in, accent glow */
  function playLogoHookAnimation(brandLogoEl) {
    if (typeof gsap === "undefined" || !brandLogoEl) return;

    var hook = brandLogoEl.querySelector(".logo-hook");
    var mark = brandLogoEl.querySelector(".logo-mark");
    var markInner = brandLogoEl.querySelector(".logo-mark-inner");
    var bar = brandLogoEl.querySelector(".logo-bar");
    var accent = brandLogoEl.querySelector(".logo-accent");
    var tagline = brandLogoEl.querySelector(".top-nav__logo-tagline");
    var glowGroup = brandLogoEl.querySelector(".logo-glow-group");

    if (!hook || !mark || !bar) return;

    if (logoTimeline) {
      logoTimeline.kill();
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set([hook, mark, markInner, bar, accent, tagline, glowGroup], { clearProps: "all" });
      gsap.set([hook, mark, markInner, bar, accent], {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      });
      gsap.set(bar, { scaleX: 1, transformOrigin: "18px 8.5px" });
      gsap.set(tagline, { autoAlpha: 0.55 });
      return;
    }

    gsap.set(hook, {
      transformOrigin: "12px 2px",
      rotation: -58,
      y: -7,
      opacity: 0,
    });
    gsap.set(mark, { transformOrigin: "9px 8.5px", scale: 0.35, y: 4, opacity: 0 });
    gsap.set(markInner, { transformOrigin: "9px 8.5px", scale: 0, opacity: 0 });
    gsap.set(bar, {
      transformOrigin: "18px 8.5px",
      scaleX: 0,
      opacity: 0,
    });
    gsap.set(accent, { scale: 0, transformOrigin: "50% 50%", opacity: 0 });
    gsap.set(tagline, { autoAlpha: 0, y: -2 });
    gsap.set(glowGroup, { filter: "url(#logoGlow)", opacity: 1 });

    logoTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    logoTimeline
      .to(hook, {
        opacity: 0.85,
        duration: 0.25,
      })
      .to(
        hook,
        {
          rotation: 8,
          y: 0,
          duration: 0.55,
          ease: "back.out(2.4)",
        },
        0.05,
      )
      .addLabel("hook-catch", 0.45)
      .to(
        hook,
        {
          rotation: 0,
          duration: 0.35,
          ease: "elastic.out(1, 0.55)",
        },
        "hook-catch",
      )
      .to(
        mark,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.42,
          ease: "elastic.out(1.15, 0.45)",
        },
        "hook-catch+=0.02",
      )
      .to(
        markInner,
        {
          scale: 1,
          opacity: 0.92,
          duration: 0.28,
          ease: "back.out(2)",
        },
        "hook-catch+=0.12",
      )
      .to(
        bar,
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.62,
          ease: "elastic.out(1, 0.42)",
        },
        "hook-catch+=0.08",
      )
      .to(
        accent,
        {
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(3)",
        },
        "hook-catch+=0.35",
      )
      .to(
        tagline,
        {
          autoAlpha: 0.55,
          y: 0,
          duration: 0.4,
          ease: "power1.out",
        },
        "hook-catch+=0.42",
      )
      .to(
        accent,
        {
          scale: 1.35,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut",
        },
        "hook-catch+=0.55",
      )
      .to(
        glowGroup,
        {
          opacity: 0.92,
          duration: 0.8,
          ease: "sine.out",
        },
        "hook-catch+=0.5",
      );
  }

  function initLogoAnimation(brandLogoEl) {
    if (!brandLogoEl) return;

    playLogoHookAnimation(brandLogoEl);

    brandLogoEl.addEventListener("click", function () {
      playLogoHookAnimation(brandLogoEl);
    });

    brandLogoEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playLogoHookAnimation(brandLogoEl);
      }
    });
  }

  window.ProductSwitcherLogo = {
    init: initLogoAnimation,
    replay: playLogoHookAnimation,
  };
})();
