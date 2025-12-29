
(function () {

  /* ==========================
     LOAD SETTING
     (JANGAN UBAH KEY)
  ========================== */
  const appSetting = {
    lang: localStorage.getItem("appLang") || "id",
    theme: localStorage.getItem("appTheme") || "light",
    orientation: localStorage.getItem("appOrientation") || "auto",
    fontSize: localStorage.getItem("appFontSize") || "normal"
  };

  /* ==========================
     APPLY LANGUAGE
     (AMAN GLOBAL)
  ========================== */
  if (document.documentElement) {
    document.documentElement.lang = appSetting.lang;
  }

  /* ==========================
     APPLY THEME
     (FIX classList NULL)
  ========================== */
  if (document.body) {
    document.body.classList.remove("theme-light", "theme-dark");

    if (appSetting.theme === "dark") {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.add("theme-light");
    }
  }

  /* ==========================
     APPLY ORIENTATION
     (NON-INTRUSIVE & AMAN)
  ========================== */
  if (document.body && appSetting.orientation !== "auto") {
    document.body.setAttribute(
      "data-orientation",
      appSetting.orientation
    );
  }

  /* ==========================
     APPLY FONT SIZE
     (FUTURE READY, AMAN)
  ========================== */
  if (document.body) {
    document.body.setAttribute(
      "data-font",
      appSetting.fontSize
    );
  }

})();

