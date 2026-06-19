/**
 * Product Switcher — wheel/thumb navigation, video scrub or color fallback.
 */
(function () {
  "use strict";

  // Set at build time when a video file exists in assets/ (null = color fallback mode)
  var VIDEO_SRC = null;

  var SECTION_COLORS = ["#C4A882", "#C0C0C0", "#D4C876"];
  var SECTION_COUNT = 3;

  var scrollProgress = 0;
  var targetProgress = 0;
  var activeSection = 0;
  var rafId = null;
  var useVideo = false;
  var videoEl = null;
  var fallbackEl = null;

  var centralArea = document.getElementById("centralArea");
  var switcherEl = document.getElementById("switcher");
  var brandLogoEl = document.getElementById("brandLogo");

  /** Parse hex color to [r, g, b] */
  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  /** Lerp between two hex colors by t (0–1) */
  function lerpColor(c1, c2, t) {
    var a = hexToRgb(c1);
    var b = hexToRgb(c2);
    var r = Math.round(a[0] + (b[0] - a[0]) * t);
    var g = Math.round(a[1] + (b[1] - a[1]) * t);
    var bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  /** Map progress 0–1 to interpolated fallback background color */
  function progressToColor(progress) {
    var scaled = progress * (SECTION_COUNT - 1);
    var idx = Math.min(SECTION_COUNT - 2, Math.floor(scaled));
    var localT = scaled - idx;
    return lerpColor(SECTION_COLORS[idx], SECTION_COLORS[idx + 1], localT);
  }

  /** Section index from progress (3 equal ranges) */
  function progressToSection(progress) {
    return Math.min(SECTION_COUNT - 1, Math.floor(progress * SECTION_COUNT));
  }

  /** Midpoint progress for section index */
  function sectionMidpoint(index) {
    return (index + 0.5) / SECTION_COUNT;
  }

  function buildSwitcher() {
    switcherEl.innerHTML = "";
    for (var i = 0; i < SECTION_COUNT; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "switcher__thumb" + (i === activeSection ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", i === activeSection ? "true" : "false");
      btn.setAttribute("aria-label", "Variant " + (i + 1));
      btn.dataset.index = String(i);

      var inner = document.createElement("span");
      inner.className = "switcher__inner";
      inner.style.backgroundColor = SECTION_COLORS[i];

      if (useVideo) {
        inner.style.backgroundImage = "url('assets/nav-icon-" + (i + 1) + ".png')";
      }

      btn.appendChild(inner);
      btn.addEventListener("click", onThumbClick);
      switcherEl.appendChild(btn);
    }
  }

  function updateSwitcherUI() {
    var thumbs = switcherEl.querySelectorAll(".switcher__thumb");
    for (var i = 0; i < thumbs.length; i++) {
      var isActive = i === activeSection;
      thumbs[i].classList.toggle("active", isActive);
      thumbs[i].setAttribute("aria-selected", isActive ? "true" : "false");
    }
  }

  function onThumbClick(e) {
    var idx = parseInt(e.currentTarget.dataset.index, 10);
    targetProgress = sectionMidpoint(idx);
  }

  function onWheel(e) {
    e.preventDefault();
    targetProgress += e.deltaY * 0.0004;
    if (targetProgress < 0) targetProgress = 0;
    if (targetProgress > 1) targetProgress = 1;
  }

  function tick() {
    var diff = targetProgress - scrollProgress;

    if (Math.abs(diff) >= 0.0005) {
      scrollProgress += diff * 0.15;
    } else {
      scrollProgress = targetProgress;
    }

    if (useVideo && videoEl && videoEl.duration && isFinite(videoEl.duration)) {
      videoEl.currentTime = scrollProgress * videoEl.duration;
    } else if (fallbackEl) {
      fallbackEl.style.backgroundColor = progressToColor(scrollProgress);
    }

    var nextSection = progressToSection(scrollProgress);
    if (nextSection !== activeSection) {
      activeSection = nextSection;
      updateSwitcherUI();
    }

    rafId = requestAnimationFrame(tick);
  }

  function initVideo(src) {
    videoEl = document.createElement("video");
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("webkit-playsinline", "");
    videoEl.preload = "auto";
    videoEl.src = src;

    return new Promise(function (resolve) {
      var settled = false;

      function fail() {
        if (settled) return;
        settled = true;
        resolve(false);
      }

      function ok() {
        if (settled) return;
        settled = true;
        resolve(true);
      }

      videoEl.addEventListener("loadedmetadata", ok, { once: true });
      videoEl.addEventListener("error", fail, { once: true });

      centralArea.appendChild(videoEl);

      // Timeout fallback if metadata never loads
      setTimeout(fail, 8000);
    });
  }

  function initFallback() {
    fallbackEl = document.createElement("div");
    fallbackEl.className = "fallback-color";
    fallbackEl.style.backgroundColor = SECTION_COLORS[0];
    fallbackEl.setAttribute("aria-hidden", "true");
    centralArea.appendChild(fallbackEl);
  }

  function start() {
    window.addEventListener("wheel", onWheel, { passive: false });
    rafId = requestAnimationFrame(tick);
  }

  async function boot() {
    if (window.ProductSwitcherLogo) {
      window.ProductSwitcherLogo.init(brandLogoEl);
    }

    buildSwitcher();

    if (VIDEO_SRC) {
      var loaded = await initVideo(VIDEO_SRC);
      if (loaded) {
        useVideo = true;
        buildSwitcher();
        start();
        return;
      }
      if (videoEl) {
        videoEl.remove();
        videoEl = null;
      }
    }

    initFallback();
    start();
  }

  boot();
})();
