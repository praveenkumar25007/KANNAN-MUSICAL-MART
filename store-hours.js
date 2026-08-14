/* ==========================================================================
   STORE HOURS ENGINE
   Single config object below controls every hour shown on the site.
   To edit hours, change KMM_HOURS_CONFIG only — everything else derives
   from it automatically (badge, countdown, next-open/closing labels).
   ========================================================================== */

/* ---- EDIT HOURS HERE ---- */
const KMM_HOURS_CONFIG = {
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  // Set a day to `null` to mark it a holiday/closed all day.
  0: null, // Sunday — Holiday
  1: { open: "10:00", close: "20:00" },
  2: { open: "10:00", close: "20:00" },
  3: { open: "10:00", close: "20:00" },
  4: { open: "10:00", close: "20:00" },
  5: { open: "10:00", close: "20:00" },
  6: { open: "10:00", close: "20:00" },
};

(function () {
  "use strict";

  function parseTimeToday(timeStr, baseDate) {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  }

  function formatTime12h(date) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function formatDuration(ms) {
    const totalMinutes = Math.max(0, Math.round(ms / 60000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours <= 0) return minutes + "m";
    return hours + "h " + minutes + "m";
  }

  function findNextOpen(now) {
    // Look ahead up to 7 days to find the next open slot
    for (let i = 0; i < 8; i++) {
      const checkDate = new Date(now);
      checkDate.setDate(now.getDate() + i);
      const dayConfig = KMM_HOURS_CONFIG[checkDate.getDay()];
      if (!dayConfig) continue;

      const openTime = parseTimeToday(dayConfig.open, checkDate);
      if (i === 0 && openTime <= now) continue; // already past today's open
      return openTime;
    }
    return null;
  }

  function computeStatus(now) {
    const dayConfig = KMM_HOURS_CONFIG[now.getDay()];

    if (dayConfig) {
      const openTime = parseTimeToday(dayConfig.open, now);
      const closeTime = parseTimeToday(dayConfig.close, now);
      if (now >= openTime && now < closeTime) {
        return {
          isOpen: true,
          closesAt: closeTime,
          msRemaining: closeTime - now,
        };
      }
    }

    const nextOpen = findNextOpen(now);
    return {
      isOpen: false,
      opensAt: nextOpen,
      msRemaining: nextOpen ? nextOpen - now : null,
    };
  }

  function render() {
    const badgeEls = document.querySelectorAll("[data-store-status-badge]");
    const timeEls = document.querySelectorAll("[data-current-time]");
    const countdownEls = document.querySelectorAll("[data-store-countdown]");
    const countdownLabelEls = document.querySelectorAll("[data-store-countdown-label]");
    const nextLabelEls = document.querySelectorAll("[data-store-next-label]");
    const nextTimeEls = document.querySelectorAll("[data-store-next-time]");

    if (!badgeEls.length && !timeEls.length) return;

    const now = new Date();
    const status = computeStatus(now);
    const lang = (window.KMM_I18N && window.KMM_I18N.getCurrentLang()) || "en";
    const t = (window.KMM_TRANSLATIONS && window.KMM_TRANSLATIONS[lang]) || {};

    timeEls.forEach((el) => {
      el.textContent = formatTime12h(now);
    });

    badgeEls.forEach((el) => {
      el.classList.remove("status-open", "status-closed");
      el.classList.add(status.isOpen ? "status-open" : "status-closed");
      const label = el.querySelector("[data-status-text]");
      if (label) {
        label.textContent = status.isOpen
          ? t["contact.statusOpen"] || "Open Now"
          : t["contact.statusClosed"] || "Closed Now";
      }
    });

    countdownLabelEls.forEach((el) => {
      el.textContent = status.isOpen
        ? t["contact.closesIn"] || "Closes in"
        : t["contact.opensIn"] || "Opens in";
    });

    countdownEls.forEach((el) => {
      el.textContent = status.msRemaining != null ? formatDuration(status.msRemaining) : "—";
    });

    nextLabelEls.forEach((el) => {
      el.textContent = status.isOpen
        ? t["contact.closingLabel"] || "Closing Time"
        : t["contact.nextOpenLabel"] || "Next Opening";
    });

    nextTimeEls.forEach((el) => {
      const target = status.isOpen ? status.closesAt : status.opensAt;
      el.textContent = target ? formatTime12h(target) : "—";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    window.setInterval(render, 30000); // refresh every 30s — countdown stays accurate without hammering the DOM
    document.addEventListener("kmm:langchange", render);
  });

  window.KMM_STORE_HOURS = { computeStatus, render, config: KMM_HOURS_CONFIG };
})();
