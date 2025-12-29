const CACHE_NAME = "adaro-pump-v2";

const BASE = "/pump-monitoring-pwa/";

const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "dashboard.html",
  BASE + "ops.html",
  BASE + "mon.html",
  BASE + "hce.html",
  BASE + "data-record.html",
  BASE + "setting.html",

  BASE + "manifest.json",

  BASE + "assets/css/app-theme.css",

  BASE + "assets/js/app-config.js",
  BASE + "assets/js/app-setting.js",
  BASE + "assets/js/data-record.js",
  BASE + "assets/js/grafik.js",

  BASE + "assets/img/bg.jpg",
  BASE + "assets/img/logo.png",
  BASE + "assets/img/icon-192.png",
  BASE + "assets/img/icon-512.png"
];

/* === INSTALL === */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // 🔴 WAJIB
});

/* === ACTIVATE === */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim(); // 🔴 WAJIB
});

/* === FETCH === */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});


