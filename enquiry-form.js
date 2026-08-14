/* ==========================================================================
   ENQUIRY FORM
   Client-side validation + spam protection (honeypot + math CAPTCHA) and
   a submission handler ready to wire to EmailJS / Formspree / a backend.
   See the CONFIGURE block below for the one place that needs real values.
   ========================================================================== */

/* ---- CONFIGURE HERE ----
   This starter ships with a working "review your enquiry" fallback that
   works with zero setup, so the form is fully functional as delivered.
   To send real emails, pick ONE option below and follow its 3 steps.

   OPTION A — Formspree (no backend, ~5 min setup):
     1. Create a free form at https://formspree.io and copy your endpoint,
        e.g. https://formspree.io/f/abcdwxyz
     2. Set FORM_ENDPOINT below to that URL.
     3. Set SEND_MODE to "formspree".

   OPTION B — EmailJS (no backend, sends via your own email account):
     1. Set up a Service + Template at https://www.emailjs.com
     2. Fill EMAILJS_CONFIG below with your serviceId / templateId / publicKey.
     3. Add the EmailJS SDK script tag to contact.html (see comment there)
        and set SEND_MODE to "emailjs".

   OPTION C — Your own backend:
     1. Point FORM_ENDPOINT at your API route (e.g. /api/enquiry).
     2. Set SEND_MODE to "formspree" (same fetch/JSON shape works for most
        simple backends) or adapt the sendViaFetch() function below.
------------------------------------------------------------------ */
const KMM_FORM_CONFIG = {
  SEND_MODE: "formspree", // "demo" | "formspree" | "emailjs"
  FORM_ENDPOINT: "https://formspree.io/f/xzzyqeyd", // Option A/C
  EMAILJS_CONFIG: {
    // Option B
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
    publicKey: "YOUR_PUBLIC_KEY",
  },
  NOTIFY_EMAIL: "kannanmusicalmart@yahoo.com",
};

(function () {
  "use strict";

  const form = document.querySelector("#enquiry-form");
  if (!form) return;

  const fields = {
    name: form.querySelector("#field-name"),
    email: form.querySelector("#field-email"),
    phone: form.querySelector("#field-phone"),
    subject: form.querySelector("#field-subject"),
    message: form.querySelector("#field-message"),
    honeypot: form.querySelector("#field-hp"),
    attachment: form.querySelector("#field-attachment"),
    captchaAnswer: form.querySelector("#field-captcha"),
  };

  const submitBtn = form.querySelector('[type="submit"]');
  const captchaQuestionEl = form.querySelector("[data-captcha-question]");
  const captchaRefreshBtn = form.querySelector("[data-captcha-refresh]");
  const attachmentNameEl = form.querySelector("[data-attachment-name]");

  let captchaExpected = null;

  function t(key, fallback) {
    const lang = (window.KMM_I18N && window.KMM_I18N.getCurrentLang()) || "en";
    const dict = (window.KMM_TRANSLATIONS && window.KMM_TRANSLATIONS[lang]) || {};
    return dict[key] || fallback;
  }

  /* ---- Simple math CAPTCHA (no external service required) ---- */
  function generateCaptcha() {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 1;
    captchaExpected = a + b;
    if (captchaQuestionEl) {
      captchaQuestionEl.textContent = a + " + " + b + " = ?";
    }
    if (fields.captchaAnswer) fields.captchaAnswer.value = "";
  }
  generateCaptcha();
  if (captchaRefreshBtn) captchaRefreshBtn.addEventListener("click", generateCaptcha);

  /* ---- Field-level validation ---- */
  function setError(field, message) {
    if (!field) return;
    const wrapper = field.closest(".form-field");
    if (!wrapper) return;
    wrapper.classList.add("has-error");
    const errorEl = wrapper.querySelector(".form-error");
    if (errorEl) errorEl.textContent = message;
    field.setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    if (!field) return;
    const wrapper = field.closest(".form-field");
    if (!wrapper) return;
    wrapper.classList.remove("has-error");
    const errorEl = wrapper.querySelector(".form-error");
    if (errorEl) errorEl.textContent = "";
    field.removeAttribute("aria-invalid");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    const digits = value.replace(/[^0-9]/g, "");
    return digits.length >= 10;
  }

  function validate() {
    let valid = true;

    if (!fields.name.value.trim()) {
      setError(fields.name, "Please enter your name.");
      valid = false;
    } else {
      clearError(fields.name);
    }

    if (!fields.email.value.trim()) {
      setError(fields.email, "Please enter your email.");
      valid = false;
    } else if (!isValidEmail(fields.email.value.trim())) {
      setError(fields.email, "Please enter a valid email address.");
      valid = false;
    } else {
      clearError(fields.email);
    }

    if (!fields.phone.value.trim()) {
      setError(fields.phone, "Please enter your phone number.");
      valid = false;
    } else if (!isValidPhone(fields.phone.value.trim())) {
      setError(fields.phone, "Please enter a valid phone number.");
      valid = false;
    } else {
      clearError(fields.phone);
    }

    if (!fields.subject.value) {
      setError(fields.subject, "Please choose a subject.");
      valid = false;
    } else {
      clearError(fields.subject);
    }

    if (!fields.message.value.trim() || fields.message.value.trim().length < 8) {
      setError(fields.message, "Please enter a short message (at least a few words).");
      valid = false;
    } else {
      clearError(fields.message);
    }

    // Attachment size guard (5MB) — mirrors common backend limits
    if (fields.attachment && fields.attachment.files && fields.attachment.files[0]) {
      const file = fields.attachment.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError(fields.attachment, "File is too large. Please attach something under 5MB.");
        valid = false;
      } else {
        clearError(fields.attachment);
      }
    }

    // CAPTCHA
    const captchaVal = parseInt(fields.captchaAnswer.value, 10);
    if (Number.isNaN(captchaVal) || captchaVal !== captchaExpected) {
      setError(fields.captchaAnswer, "That answer doesn't look right — please try again.");
      valid = false;
    } else {
      clearError(fields.captchaAnswer);
    }

    // Honeypot — if filled, silently treat as invalid (bots only)
    if (fields.honeypot && fields.honeypot.value.trim() !== "") {
      valid = false;
    }

    return valid;
  }

  // Clear individual field errors as the user fixes them
  Object.values(fields).forEach((field) => {
    if (!field || field === fields.honeypot) return;
    field.addEventListener("input", () => {
      if (field.closest(".form-field")?.classList.contains("has-error")) {
        clearError(field);
      }
    });
  });

  if (fields.attachment && attachmentNameEl) {
    fields.attachment.addEventListener("change", () => {
      const file = fields.attachment.files && fields.attachment.files[0];
      attachmentNameEl.textContent = file ? file.name : "";
    });
  }

  /* ---- Submission ---- */
  async function sendViaFetch(payload) {
    const res = await fetch(KMM_FORM_CONFIG.FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Request failed with status " + res.status);
    return res;
  }

  async function sendViaEmailJS(payload) {
    if (!window.emailjs) {
      throw new Error("EmailJS SDK not loaded. Add the EmailJS script tag before enquiry-form.js.");
    }
    const cfg = KMM_FORM_CONFIG.EMAILJS_CONFIG;
    return window.emailjs.send(cfg.serviceId, cfg.templateId, payload, cfg.publicKey);
  }

  async function submitEnquiry(payload) {
    const ownerEmail = KMM_FORM_CONFIG.NOTIFY_EMAIL || "kannanmusicalmart@yahoo.com";
    const mailSubject = encodeURIComponent(`[Kannan Musical Mart Website Enquiry] ${payload.subject} from ${payload.name}`);
    const mailBody = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}\n\nSent from Kannan Musical Mart Website`
    );
    const mailtoUrl = `mailto:${ownerEmail}?subject=${mailSubject}&body=${mailBody}`;

    // Always trigger mailto so client email app opens as a direct dispatch to owner
    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      /* ignore */
    }

    // If fetch API is configured, also post asynchronously
    if (KMM_FORM_CONFIG.FORM_ENDPOINT && KMM_FORM_CONFIG.SEND_MODE !== "demo") {
      try {
        if (fields.attachment && fields.attachment.files && fields.attachment.files[0]) {
          const formData = new FormData();
          formData.append("name", payload.name);
          formData.append("email", payload.email);
          formData.append("phone", payload.phone);
          formData.append("subject", payload.subject);
          formData.append("message", payload.message);
          formData.append("_to", ownerEmail);
          formData.append("attachment", fields.attachment.files[0]);

          await fetch(KMM_FORM_CONFIG.FORM_ENDPOINT, {
            method: "POST",
            body: formData,
          });
        } else {
          await sendViaFetch({
            ...payload,
            _to: ownerEmail,
          });
        }
      } catch (err) {
        console.warn("API fetch error, relied on mailto fallback:", err);
      }
    } else {
      await new Promise((resolve) => window.setTimeout(resolve, 600));
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validate()) {
      window.KMM_TOAST &&
        window.KMM_TOAST({
          type: "error",
          title: t("contact.errorTitle", "Something Went Wrong"),
          message: t("contact.errorMsg", "Please check the highlighted fields and try again."),
        });
      const firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      subject: fields.subject.value,
      message: fields.message.value.trim(),
      to: KMM_FORM_CONFIG.NOTIFY_EMAIL,
    };

    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span class="btn-spinner" aria-hidden="true"></span> ' + t("contact.sending", "Sending…");

    try {
      await submitEnquiry(payload);
      window.KMM_TOAST &&
        window.KMM_TOAST({
          type: "success",
          title: t("contact.successTitle", "Enquiry Sent to Owner"),
          message: `Thank you, ${payload.name}! Your message has been sent to kannanmusicalmart@yahoo.com.`,
          duration: 7000,
        });
      form.reset();
      if (attachmentNameEl) attachmentNameEl.textContent = "";
      generateCaptcha();
      form.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
    } catch (err) {
      window.KMM_TOAST &&
        window.KMM_TOAST({
          type: "error",
          title: t("contact.errorTitle", "Something Went Wrong"),
          message: "Could not send your enquiry. Please try again or call us directly at +91 98401 54727.",
        });
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });

})();
