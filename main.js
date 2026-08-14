/* ==========================================================================
   MAIN — shared behavior across all pages
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Theme Manager (Color Customization) ---- */
  const THEMES = {
    brass: {
      label: "Brass & Varnish",
      brass: "#d4aa3a",
      brassBright: "#e0bf72",
      brassDim: "#8a6f34",
      varnishRed: "#8b1e2e",
      varnishRedBright: "#a8293b",
      glassBorder: "rgba(212, 170, 58, 0.22)",
      glassBorderStrong: "rgba(212, 170, 58, 0.42)",
      shadowBrassGlow: "0 0 0 1px rgba(212, 170, 58, 0.4), 0 0 32px rgba(212, 170, 58, 0.22)"
    },
    emerald: {
      label: "Emerald Gold",
      brass: "#e5c158",
      brassBright: "#f3d67b",
      brassDim: "#9e812d",
      varnishRed: "#0f523b",
      varnishRedBright: "#167554",
      glassBorder: "rgba(229, 193, 88, 0.25)",
      glassBorderStrong: "rgba(229, 193, 88, 0.45)",
      shadowBrassGlow: "0 0 0 1px rgba(229, 193, 88, 0.4), 0 0 32px rgba(15, 82, 59, 0.3)"
    },
    sapphire: {
      label: "Royal Sapphire",
      brass: "#38bdf8",
      brassBright: "#7dd3fc",
      brassDim: "#0284c7",
      varnishRed: "#1e3a8a",
      varnishRedBright: "#2563eb",
      glassBorder: "rgba(56, 189, 248, 0.25)",
      glassBorderStrong: "rgba(56, 189, 248, 0.45)",
      shadowBrassGlow: "0 0 0 1px rgba(56, 189, 248, 0.4), 0 0 32px rgba(30, 58, 138, 0.35)"
    },
    crimson: {
      label: "Crimson Velvet",
      brass: "#fb7185",
      brassBright: "#fda4af",
      brassDim: "#e11d48",
      varnishRed: "#9f1239",
      varnishRedBright: "#be123c",
      glassBorder: "rgba(251, 113, 133, 0.25)",
      glassBorderStrong: "rgba(251, 113, 133, 0.45)",
      shadowBrassGlow: "0 0 0 1px rgba(251, 113, 133, 0.4), 0 0 32px rgba(159, 18, 57, 0.35)"
    },
    purple: {
      label: "Amethyst Twilight",
      brass: "#facc15",
      brassBright: "#fde047",
      brassDim: "#ca8a04",
      varnishRed: "#6b21a8",
      varnishRedBright: "#9333ea",
      glassBorder: "rgba(250, 204, 21, 0.25)",
      glassBorderStrong: "rgba(250, 204, 21, 0.45)",
      shadowBrassGlow: "0 0 0 1px rgba(250, 204, 21, 0.4), 0 0 32px rgba(107, 33, 168, 0.35)"
    },
    platinum: {
      label: "Platinum Onyx",
      brass: "#cbd5e1",
      brassBright: "#f1f5f9",
      brassDim: "#64748b",
      varnishRed: "#334155",
      varnishRedBright: "#475569",
      glassBorder: "rgba(203, 213, 225, 0.25)",
      glassBorderStrong: "rgba(203, 213, 225, 0.45)",
      shadowBrassGlow: "0 0 0 1px rgba(203, 213, 225, 0.4), 0 0 32px rgba(51, 65, 85, 0.35)"
    }
  };

  function applyThemeConfig(config) {
    const root = document.documentElement;
    if (config.brass) root.style.setProperty("--brass", config.brass);
    if (config.brassBright) root.style.setProperty("--brass-bright", config.brassBright);
    if (config.brassDim) root.style.setProperty("--brass-dim", config.brassDim);
    if (config.varnishRed) root.style.setProperty("--varnish-red", config.varnishRed);
    if (config.varnishRedBright) root.style.setProperty("--varnish-red-bright", config.varnishRedBright);
    if (config.glassBorder) root.style.setProperty("--glass-border", config.glassBorder);
    if (config.glassBorderStrong) root.style.setProperty("--glass-border-strong", config.glassBorderStrong);
    if (config.shadowBrassGlow) root.style.setProperty("--shadow-brass-glow", config.shadowBrassGlow);
  }

  function setPresetTheme(themeKey) {
    const theme = THEMES[themeKey] || THEMES.brass;
    applyThemeConfig(theme);
    try {
      localStorage.setItem("kmm_theme", JSON.stringify({ type: "preset", key: themeKey }));
    } catch (e) {}
    updateThemeUI(themeKey, null);
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function adjustBrightness(hex, percent) {
    const { r, g, b } = hexToRgb(hex);
    const adjust = (val) => Math.min(255, Math.max(0, Math.round(val + (val * percent) / 100)));
    const toHex = (val) => val.toString(16).padStart(2, "0");
    return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
  }

  function setCustomColorTheme(hex) {
    const brassBright = adjustBrightness(hex, 25);
    const brassDim = adjustBrightness(hex, -25);
    const { r, g, b } = hexToRgb(hex);
    const glassBorder = `rgba(${r}, ${g}, ${b}, 0.28)`;
    const glassBorderStrong = `rgba(${r}, ${g}, ${b}, 0.5)`;
    const shadowBrassGlow = `0 0 0 1px rgba(${r}, ${g}, ${b}, 0.4), 0 0 32px rgba(${r}, ${g}, ${b}, 0.25)`;

    const config = {
      brass: hex,
      brassBright,
      brassDim,
      glassBorder,
      glassBorderStrong,
      shadowBrassGlow
    };

    applyThemeConfig(config);
    try {
      localStorage.setItem("kmm_theme", JSON.stringify({ type: "custom", hex }));
    } catch (e) {}
    updateThemeUI("custom", hex);
  }

  function updateThemeUI(activeKey, customHex) {
    document.querySelectorAll(".theme-option").forEach((btn) => {
      const isMatch = activeKey !== "custom" && btn.getAttribute("data-theme") === activeKey;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-selected", String(isMatch));
    });
    const labelEl = document.querySelector("[data-current-theme-label]");
    if (labelEl) {
      labelEl.textContent = activeKey === "custom" ? "Custom" : (THEMES[activeKey] ? THEMES[activeKey].label : "Theme");
    }
    const colorInput = document.getElementById("theme-color-input");
    if (colorInput) {
      if (customHex) colorInput.value = customHex;
      else if (THEMES[activeKey]) colorInput.value = THEMES[activeKey].brass;
    }
  }

  function initTheme() {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem("kmm_theme"));
    } catch (e) {}

    if (saved && saved.type === "custom" && saved.hex) {
      setCustomColorTheme(saved.hex);
    } else if (saved && saved.type === "preset" && THEMES[saved.key]) {
      setPresetTheme(saved.key);
    } else {
      setPresetTheme("brass");
    }
  }

  initTheme();

  /* ==========================================================================
     DARK / LIGHT MODE TOGGLE BUTTON (works across all pages)
     ========================================================================== */
  function initModeToggle() {
    const STORAGE_KEY = "kmm_mode";

    function getStoredMode() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : "dark";
      } catch (e) {
        return "dark";
      }
    }

    function applyMode(mode) {
      document.documentElement.setAttribute("data-mode", mode);
      try {
        localStorage.setItem(STORAGE_KEY, mode);
      } catch (e) {}

      document.querySelectorAll(".mode-toggle-btn").forEach((btn) => {
        const label = btn.querySelector(".mode-label");
        if (label) {
          label.textContent = mode === "light" ? "Light" : "Dark";
        }
      });
    }

    applyMode(getStoredMode());

    document.querySelectorAll(".mode-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const currentMode = document.documentElement.getAttribute("data-mode") || "dark";
        const newMode = currentMode === "dark" ? "light" : "dark";
        applyMode(newMode);

        if (window.KMM_TOAST) {
          window.KMM_TOAST({
            type: "info",
            title: "Theme Mode",
            message: newMode === "light" ? "Switched to Light Mode ☀️" : "Switched to Dark Mode 🌙",
            duration: 3000,
          });
        }
      });
    });
  }
  initModeToggle();

  /* ==========================================================================
     TAMIL CLASSICAL MUSIC PLAYER WIDGET (works across all pages)
     ========================================================================== */
  function initMusicPlayer() {
    const widget = document.getElementById("music-player-widget");
    if (!widget) return;

    const toggleBtn = document.getElementById("music-toggle");
    const panel = document.getElementById("music-panel");
    const closeBtn = document.getElementById("music-panel-close");
    const trackNameEl = document.getElementById("music-track-name");
    const trackArtistEl = document.getElementById("music-track-artist");
    const playPauseBtn = document.getElementById("music-play-pause");
    const prevBtn = document.getElementById("music-prev");
    const nextBtn = document.getElementById("music-next");
    const volumeSlider = document.getElementById("music-volume");
    const trackListEl = document.getElementById("music-track-list");

    const TRACKS = [
      {
        name: "Carnatic Flute Harmony",
        artist: "Traditional Tamil Flute",
        url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=indian-flute-114528.mp3",
      },
      {
        name: "Veena Raga Mohanam",
        artist: "Saraswati Veena Classical",
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c9a3b680.mp3?filename=indian-classical-instrumental-19827.mp3",
      },
      {
        name: "Nadaswaram Festival Melody",
        artist: "Temple & Festival Sound",
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=indian-melody-15587.mp3",
      },
      {
        name: "Morning Carnatic Peace",
        artist: "Acoustic Sitar & Tabla",
        url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_8843232148.mp3?filename=indian-instrumental-background-1262.mp3",
      },
    ];

    let currentTrackIdx = 0;
    let isPlaying = false;
    let audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = 0.4;

    let audioCtx = null;
    let synthOsc = null;

    function playSynthFallback() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (synthOsc) synthOsc.stop();
        synthOsc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        synthOsc.type = "sine";
        synthOsc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        synthOsc.connect(gain);
        gain.connect(audioCtx.destination);
        synthOsc.start();
      } catch (e) {}
    }

    function stopSynthFallback() {
      try {
        if (synthOsc) {
          synthOsc.stop();
          synthOsc = null;
        }
      } catch (e) {}
    }

    function renderTrackList() {
      if (!trackListEl) return;
      trackListEl.innerHTML = "";
      TRACKS.forEach((track, idx) => {
        const item = document.createElement("div");
        item.className = "music-track-item" + (idx === currentTrackIdx ? " is-active" : "");
        item.innerHTML = `
          <span class="music-track-num">${idx + 1}</span>
          <span style="flex:1;">${track.name}</span>
          <span>${idx === currentTrackIdx && isPlaying ? "🎵" : "▶"}</span>
        `;
        item.addEventListener("click", () => {
          selectTrack(idx, true);
        });
        trackListEl.appendChild(item);
      });
    }

    function updateTrackUI() {
      const track = TRACKS[currentTrackIdx];
      if (trackNameEl) trackNameEl.textContent = track.name;
      if (trackArtistEl) trackArtistEl.textContent = track.artist;
      if (playPauseBtn) playPauseBtn.innerHTML = isPlaying ? "&#9208;" : "&#9654;";
      widget.classList.toggle("is-playing", isPlaying);
      renderTrackList();
    }

    function loadTrack(idx) {
      currentTrackIdx = idx;
      audio.src = TRACKS[currentTrackIdx].url;
      updateTrackUI();
    }

    function playTrack() {
      audio.play().then(() => {
        isPlaying = true;
        updateTrackUI();
      }).catch(() => {
        isPlaying = true;
        playSynthFallback();
        updateTrackUI();
      });
    }

    function pauseTrack() {
      audio.pause();
      stopSynthFallback();
      isPlaying = false;
      updateTrackUI();
    }

    function togglePlay() {
      if (isPlaying) {
        pauseTrack();
      } else {
        playTrack();
      }
    }

    function selectTrack(idx, autoPlay = true) {
      loadTrack(idx);
      if (autoPlay) {
        playTrack();
      }
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = panel.classList.contains("is-open");
        document.querySelectorAll(".lang-switch.is-open, .theme-switch.is-open").forEach((el) => el.classList.remove("is-open"));
        panel.classList.toggle("is-open", !isOpen);
        toggleBtn.setAttribute("aria-expanded", String(!isOpen));
      });
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        panel.classList.remove("is-open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      });
    }

    document.addEventListener("click", (e) => {
      if (panel && panel.classList.contains("is-open") && !widget.contains(e.target)) {
        panel.classList.remove("is-open");
        if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
      }
    });

    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const nextIdx = (currentTrackIdx + 1) % TRACKS.length;
        selectTrack(nextIdx, true);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prevIdx = (currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
        selectTrack(prevIdx, true);
      });
    }

    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const vol = parseFloat(e.target.value) / 100;
        audio.volume = vol;
      });
    }

    audio.addEventListener("ended", () => {
      const nextIdx = (currentTrackIdx + 1) % TRACKS.length;
      selectTrack(nextIdx, true);
    });

    loadTrack(0);
  }
  initMusicPlayer();


  /* ---- Page loader ---- */
  window.addEventListener("load", () => {
    const loader = document.querySelector(".page-loader");
    if (!loader) return;
    // Small delay so the entrance doesn't feel abrupt on fast connections
    window.setTimeout(() => loader.classList.add("is-hidden"), 380);
  });

  /* ---- Nav: scrolled state + mobile toggle + backdrop ---- */
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navBackdrop = document.querySelector(".nav-backdrop");
  const navCloseBtn = document.querySelector(".nav-close-btn");

  function updateNavScrollState() {
    if (!nav) return;
    if (window.scrollY > 24) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  updateNavScrollState();
  window.addEventListener("scroll", updateNavScrollState, { passive: true });

  function closeMobileNav() {
    if (!navLinks) return;
    navLinks.classList.remove("is-open");
    if (navToggle) {
      navToggle.classList.remove("is-active");
      navToggle.setAttribute("aria-expanded", "false");
    }
    if (navBackdrop) {
      navBackdrop.classList.remove("is-active");
    }
    document.body.style.overflow = "";
  }

  function openMobileNav() {
    if (!navLinks) return;
    navLinks.classList.add("is-open");
    if (navToggle) {
      navToggle.classList.add("is-active");
      navToggle.setAttribute("aria-expanded", "true");
    }
    if (navBackdrop) {
      navBackdrop.classList.add("is-active");
    }
    document.body.style.overflow = "hidden";
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.contains("is-open");
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (navCloseBtn) {
      navCloseBtn.addEventListener("click", closeMobileNav);
    }

    if (navBackdrop) {
      navBackdrop.addEventListener("click", closeMobileNav);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMobileNav();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileNav();
      });
    });
  }

  /* Highlight mobile bottom nav active page based on current location */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".mobile-bottom-link").forEach((btn) => {
    const href = btn.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html") || (currentPath === "index.html" && href === "index.html")) {
      btn.classList.add("is-active");
      btn.setAttribute("aria-current", "page");
    }
  });

  /* ---- Language switch dropdown open/close ---- */
  document.querySelectorAll(".lang-switch").forEach((wrap) => {
    const btn = wrap.querySelector(".lang-switch-btn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !wrap.classList.contains("is-open");
      document.querySelectorAll(".lang-switch.is-open, .theme-switch.is-open").forEach((el) => el.classList.remove("is-open"));
      if (willOpen) wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", String(willOpen));
    });
  });

  /* ---- Theme Switch dropdown open/close ---- */
  document.querySelectorAll(".theme-switch").forEach((wrap) => {
    const btn = wrap.querySelector(".theme-switch-btn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !wrap.classList.contains("is-open");
      document.querySelectorAll(".theme-switch.is-open, .lang-switch.is-open").forEach((el) => el.classList.remove("is-open"));
      if (willOpen) wrap.classList.add("is-open");
      btn.setAttribute("aria-expanded", String(willOpen));
    });

    wrap.querySelectorAll(".theme-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const themeKey = opt.getAttribute("data-theme");
        setPresetTheme(themeKey);
        wrap.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        if (window.KMM_TOAST) {
          window.KMM_TOAST({ type: "success", title: "Theme Updated", message: `Switched to ${THEMES[themeKey]?.label || "theme"}` });
        }
      });
    });

    const colorInput = wrap.querySelector("#theme-color-input");
    if (colorInput) {
      colorInput.addEventListener("input", (e) => {
        setCustomColorTheme(e.target.value);
      });
    }
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".lang-switch.is-open, .theme-switch.is-open").forEach((el) => el.classList.remove("is-open"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".lang-switch.is-open, .theme-switch.is-open").forEach((el) => el.classList.remove("is-open"));
    }
  });

  /* ---- Scroll progress bar ---- */
  const progressBar = document.querySelector(".scroll-progress");
  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  /* ---- Scroll-to-top button ---- */
  const scrollTopBtn = document.querySelector(".scroll-top-btn");
  if (scrollTopBtn) {
    function toggleScrollTop() {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
    }
    toggleScrollTop();
    window.addEventListener("scroll", toggleScrollTop, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Scroll reveal via IntersectionObserver ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const trigger = item.querySelector(".faq-question");
    const panel = item.querySelector(".faq-answer");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Close siblings for a clean single-open accordion
      item.parentElement.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          const openPanel = openItem.querySelector(".faq-answer");
          const openTrigger = openItem.querySelector(".faq-question");
          if (openPanel) openPanel.style.maxHeight = null;
          if (openTrigger) openTrigger.setAttribute("aria-expanded", "false");
        }
      });

      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
    });
  });

  /* ---- Toast notification system (shared) ---- */
  function ensureToastStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      stack.setAttribute("aria-live", "polite");
      stack.setAttribute("role", "status");
      document.body.appendChild(stack);
    }
    return stack;
  }

  const ICONS = {
    success:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>',
    error:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-5M12 8h.01"/></svg>',
  };

  function showToast({ type = "info", title, message, duration = 4200 }) {
    const stack = ensureToastStack();
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.innerHTML =
      '<span class="toast-icon">' +
      (ICONS[type] || ICONS.info) +
      '</span><div class="toast-body">' +
      (title ? '<div class="toast-title">' + title + "</div>" : "") +
      (message ? '<div class="toast-msg">' + message + "</div>" : "") +
      '</div><button class="toast-close" aria-label="Dismiss notification"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>';

    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));

    function remove() {
      toast.classList.remove("is-visible");
      window.setTimeout(() => toast.remove(), 300);
    }

    toast.querySelector(".toast-close").addEventListener("click", remove);
    window.setTimeout(remove, duration);
  }

  window.KMM_TOAST = showToast;
})();
