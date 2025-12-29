
(function () {

  function applyLanguage() {
    const lang = localStorage.getItem("appLang") || "id";
    const dict = window.LANG_DATA && window.LANG_DATA[lang];

    if (!dict) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
  }

  /* Apply on load */
  document.addEventListener("DOMContentLoaded", applyLanguage);

  /* Expose for manual re-apply (optional) */
  window.applyLanguage = applyLanguage;

})();

