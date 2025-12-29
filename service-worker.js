const CACHE_NAME = "adaro-pump-v3";

const ASSETS = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./ops.html",
  "./mon.html",
  "./hce.html",
  "./data-record.html",
  "./setting.html",

  "./manifest.json",

  "./assets/css/app-theme.css",

  "./assets/js/app-config.js",
  "./assets/js/app-setting.js",
  "./assets/js/data-record.js",
  "./assets/js/grafik.js",

  "./assets/img/bg.jpg",
  "./assets/img/logo.png",
  "./assets/img/icon-192.png",
  "./assets/img/icon-512.png"
];

/* === INSTALL === */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
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
  self.clients.claim();
});

/* === FETCH === */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});



