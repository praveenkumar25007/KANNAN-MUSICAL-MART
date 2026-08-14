/* ==========================================================================
   I18N ENGINE
   Swaps text content instantly based on data-i18n attributes.
   Persists choice in localStorage under "kmm_lang".
   No page reload — every call is a DOM text swap plus a fade transition.
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "kmm_lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["en", "ta"];

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(stored) ? stored : DEFAULT_LANG;
    } catch (e) {
      // localStorage unavailable (private mode etc.) — fall back silently
      return DEFAULT_LANG;
    }
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore — non-critical */
    }
  }

  function dict(lang) {
    return (window.KMM_TRANSLATIONS && window.KMM_TRANSLATIONS[lang]) || {};
  }

  function applyTranslations(lang) {
    const d = dict(lang);
    const fallback = dict(DEFAULT_LANG);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = d[key] ?? fallback[key];
      if (value === undefined) return;

      // Attribute-target translation, e.g. data-i18n-attr="placeholder"
      const attrTarget = el.getAttribute("data-i18n-attr");
      if (attrTarget) {
        el.setAttribute(attrTarget, value);
      } else {
        el.textContent = value;
      }
    });

    // Elements needing a translated attribute AND visible text both use
    // data-i18n for text and data-i18n-placeholder for the placeholder attr
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = d[key] ?? fallback[key];
      if (value !== undefined) el.setAttribute("placeholder", value);
    });

    document.documentElement.setAttribute("lang", lang === "ta" ? "ta" : "en");
    document.dispatchEvent(new CustomEvent("kmm:langchange", { detail: { lang } }));
  }

  function setLanguage(lang, { animate = true } = {}) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
    storeLang(lang);

    const root = document.body;
    if (animate && root) {
      root.classList.add("lang-fade");
      window.setTimeout(() => {
        applyTranslations(lang);
        requestAnimationFrame(() => {
          root.classList.remove("lang-fade");
        });
      }, 160);
    } else {
      applyTranslations(lang);
    }

    // Sync any language-switch UI on the page
    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      const isActive = btn.getAttribute("data-lang-option") === lang;
      btn.setAttribute("aria-checked", String(isActive));
    });
    document.querySelectorAll("[data-current-lang-label]").forEach((el) => {
      el.textContent = lang === "ta" ? "தமிழ்" : "English";
    });
    document.querySelectorAll("[data-current-lang-flag]").forEach((el) => {
      el.textContent = lang === "ta" ? "🇮🇳" : "🇬🇧";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    style.textContent =
      "body.lang-fade [data-i18n], body.lang-fade [data-i18n-placeholder] { transition: opacity 150ms ease; opacity: 0.35; }";
    document.head.appendChild(style);

    applyTranslations(getStoredLang());

    document.querySelectorAll("[data-lang-option]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang-option");
        setLanguage(lang);
        document.querySelectorAll(".lang-switch.is-open").forEach((el) => el.classList.remove("is-open"));
      });
    });
  });

  window.KMM_I18N = { setLanguage, getCurrentLang: getStoredLang };
})();
