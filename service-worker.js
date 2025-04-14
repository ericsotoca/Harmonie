// Service Worker pour l'application Harmonie
const CACHE_NAME = 'harmonie-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/goals.css',
  '/css/rituals.css',
  '/css/wheel.css',
  '/js/main.js',
  '/js/goals.js',
  '/js/rituals.js',
  '/js/wheel.js',
  // Ajouter ici d'autres assets (icônes, images, etc.) si besoin
];

// Installation : mise en cache des fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interception des requêtes : servir depuis le cache si possible
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
