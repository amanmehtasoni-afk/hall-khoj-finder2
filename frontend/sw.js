/**
 * Hall Khoj Finder — Progressive Web App Service Worker
 * Network-first for dynamic API routes, cache-first for static shell assets.
 */

const CACHE_NAME = 'hkf-shell-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/search.html',
  '/booking.html',
  '/dashboard.html',
  '/manifest.json',
  '/css/main.css',
  '/css/components.css',
  '/css/3d.css',
  '/css/animations.css',
  '/js/api.js',
  '/js/app.js',
  '/js/nav.js',
  '/js/i18n.js',
  '/assets/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[PWA SW] Pre-caching error:', err.message);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Always network-first for API requests
  if (url.pathname.startsWith('/api') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
