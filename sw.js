/* Service worker: guarda la app para que abra sin conexión. Los datos viven en el propio móvil (IndexedDB). */
const VERSION = "pb-movil-v2";
const SHELL = ["./", "index.html", "styles.css", "app.js", "data.js", "local.js", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png",
  "fonts/baloo-2-latin-600-normal.woff2", "fonts/baloo-2-latin-800-normal.woff2", "fonts/nunito-latin-400-normal.woff2",
  "fonts/nunito-latin-600-normal.woff2", "fonts/nunito-latin-700-normal.woff2", "fonts/nunito-latin-800-normal.woff2"];

self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // red primero (para recibir actualizaciones); si no hay red o la web ya no está publicada (404), se usa la copia guardada
  const fromCache = () => caches.match(e.request).then(r => r || caches.match("index.html"));
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; }
    return fromCache().then(c => c || r);
  }).catch(fromCache));
});
