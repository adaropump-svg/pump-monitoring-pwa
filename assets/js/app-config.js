/* ===== GLOBAL CONFIG ===== */
const APP_LANG_KEY = "appLang";
const APP_THEME_KEY = "appTheme";
const APP_ORIENTATION_KEY = "appOrientation";

/* ===== DICTIONARY ===== */
const dictionary = {
  id: {
    dashboard: "Menu Utama",
    ops: "Menu Operasional",
    mon: "Menu Monitoring",
    hce: "Health Equipment",
    data: "Data Record",
    grafik: "Grafik",
    setting: "Pengaturan",
    welcome: "Selamat datang di aplikasi monitoring pompa"
  },
  en: {
    dashboard: "Main Menu",
    ops: "Operation Menu",
    mon: "Monitoring Menu",
    hce: "Health Equipment",
    data: "Data Record",
    grafik: "Chart",
    setting: "Settings",
    welcome: "Welcome to pump monitoring application"
  }
};

/* ===== LANGUAGE ===== */
function getLang(){
  return localStorage.getItem(APP_LANG_KEY) || "id";
}

function t(key){
  const lang = getLang();
  return dictionary[lang][key] || key;
}

/* ===== APPLY LANGUAGE ===== */
function applyLanguage(){
  document.querySelectorAll("[data-lang]").forEach(el=>{
    el.innerText = t(el.dataset.lang);
  });
}

/* ===== ON LOAD ===== */
document.addEventListener("DOMContentLoaded", applyLanguage);



