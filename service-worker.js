const CACHE_NAME = "adaro-pump-v1";

const ASSETS = [
  "dashboard.html",
  "ops.html",
  "mon.html",
  "hce.html",
  "data-record.html",
  "setting.html",

  "manifest.json",

  "assets/css/app-theme.css",

  "assets/js/app-config.js",
  "assets/js/app-setting.js",
  "assets/js/data-record.js",
  "assets/js/grafik.js",

  "assets/img/bg.jpg",
  "assets/img/logo.png",
  "assets/img/icon-192.png",
  "assets/img/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
