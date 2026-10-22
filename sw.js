/* Зерно 35 — кэш для работы без интернета.
   Страница берётся из сети, если она есть; остальные файлы отдаются из кэша и тихо обновляются в фоне. */
const CACHE = "zerno35-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./favicon-32.png",
  "./golos-text-cyrillic-400-normal.woff2",
  "./golos-text-latin-400-normal.woff2",
  "./golos-text-cyrillic-500-normal.woff2",
  "./golos-text-latin-500-normal.woff2",
  "./golos-text-cyrillic-600-normal.woff2",
  "./golos-text-latin-600-normal.woff2",
  "./dela-gothic-one-cyrillic-400-normal.woff2",
  "./dela-gothic-one-latin-400-normal.woff2",
  "./jetbrains-mono-cyrillic-500-normal.woff2",
  "./jetbrains-mono-latin-500-normal.woff2",
  "./jetbrains-mono-cyrillic-700-normal.woff2",
  "./jetbrains-mono-latin-700-normal.woff2"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); }
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
