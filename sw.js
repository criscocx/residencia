// Service worker mínimo de ComiditApp.
// Su única función es habilitar la instalación como app (PWA).
// No implementa caché offline para evitar mostrar datos desactualizados
// de comensales — la app siempre necesita conexión para reflejar la realidad.

const CACHE_NAME = 'comiditapp-shell-v1';
const SHELL_FILES = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first: siempre intenta traer la versión más reciente.
// Solo usa caché si no hay conexión (para que al menos abra la pantalla).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
