/* ==========================================================================
   LOCATION GUIDE
   Store coordinates and address live in one place — update here if the
   shop ever moves. Powers the map link, directions button, copy, and share.
   ========================================================================== */

/* ---- EDIT STORE LOCATION HERE ---- */
const KMM_STORE_LOCATION = {
  name: "Kannan Musical Mart",
  addressLine: "New No. 274, Old No. 380, Mint Street",
  city: "Sowcarpet",
  state: "Chennai",
  postalCode: "600001",
  country: "India",
  lat: 13.0916,
  lng: 80.2868,
  phoneDisplay: "+91 98401 48769 • 044-25299827",
  phoneHref: "+919840148769",
  phoneMobileDisplay: "+91 98401 48769",
  phoneMobileHref: "+919840148769",
  phoneLandlineDisplay: "044-25299827",
  phoneLandlineHref: "04425299827",
  email: "kannanmusicalmart@yahoo.com",
};

(function () {
  "use strict";

  const loc = KMM_STORE_LOCATION;
  const fullAddress = [loc.addressLine, loc.city, loc.state + " " + loc.postalCode, loc.country]
    .filter(Boolean)
    .join(", ");

  const mapsQuery = encodeURIComponent(loc.name + ", " + fullAddress);
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(loc.name + ", " + fullAddress);
  const embedUrl = "https://www.google.com/maps?q=" + mapsQuery + "&z=16&output=embed";
  const staticShareUrl = "https://www.google.com/maps/search/?api=1&query=" + mapsQuery;

  function fillTextTargets() {
    document.querySelectorAll("[data-store-address]").forEach((el) => (el.textContent = fullAddress));
    document.querySelectorAll("[data-store-address-line]").forEach((el) => (el.textContent = loc.addressLine));
    document.querySelectorAll("[data-store-city]").forEach((el) => (el.textContent = loc.city));
    document.querySelectorAll("[data-store-state]").forEach((el) => (el.textContent = loc.state));
    document.querySelectorAll("[data-store-postal]").forEach((el) => (el.textContent = loc.postalCode));
    document.querySelectorAll("[data-store-phone]").forEach((el) => (el.textContent = loc.phoneDisplay));
    document.querySelectorAll("[data-store-phone-href]").forEach((el) => el.setAttribute("href", "tel:" + loc.phoneHref));
    document.querySelectorAll("[data-store-phone-mobile]").forEach((el) => (el.textContent = loc.phoneMobileDisplay));
    document.querySelectorAll("[data-store-phone-mobile-href]").forEach((el) => el.setAttribute("href", "tel:" + loc.phoneMobileHref));
    document.querySelectorAll("[data-store-phone-landline]").forEach((el) => (el.textContent = loc.phoneLandlineDisplay));
    document.querySelectorAll("[data-store-phone-landline-href]").forEach((el) => el.setAttribute("href", "tel:" + loc.phoneLandlineHref));
    document.querySelectorAll("[data-store-email]").forEach((el) => (el.textContent = loc.email));
    document.querySelectorAll("[data-store-email-href]").forEach((el) => el.setAttribute("href", "mailto:" + loc.email));

    document.querySelectorAll("[data-map-embed]").forEach((iframe) => {
      iframe.setAttribute("src", embedUrl);
    });
    document.querySelectorAll("[data-directions-link]").forEach((el) => {
      el.setAttribute("href", directionsUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
  }

  async function copyAddress(triggerEl) {
    const text = loc.name + ", " + fullAddress;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers without Clipboard API
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const lang = (window.KMM_I18N && window.KMM_I18N.getCurrentLang()) || "en";
      const t = (window.KMM_TRANSLATIONS && window.KMM_TRANSLATIONS[lang]) || {};
      if (window.KMM_TOAST) {
        window.KMM_TOAST({
          type: "success",
          title: t["contact.copiedToast"] || "Address copied to clipboard",
        });
      }
    } catch (err) {
      if (window.KMM_TOAST) {
        window.KMM_TOAST({ type: "error", title: "Could not copy address", message: String(err.message || err) });
      }
    }
  }

  async function shareLocation() {
    const shareData = {
      title: loc.name,
      text: loc.name + " — " + fullAddress,
      url: staticShareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyAddress();
      }
    } catch (err) {
      // User cancelling the native share sheet throws — ignore that case
      if (err && err.name !== "AbortError" && window.KMM_TOAST) {
        window.KMM_TOAST({ type: "error", title: "Could not share location" });
      }
    }
  }

  function bindButtons() {
    document.querySelectorAll("[data-copy-address-btn]").forEach((btn) => {
      btn.addEventListener("click", () => copyAddress(btn));
    });
    document.querySelectorAll("[data-share-location-btn]").forEach((btn) => {
      btn.addEventListener("click", shareLocation);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    fillTextTargets();
    bindButtons();
  });

  window.KMM_LOCATION = { config: loc, fullAddress, directionsUrl, embedUrl };
})();
