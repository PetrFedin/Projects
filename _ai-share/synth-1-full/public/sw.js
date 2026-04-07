// PWA Service Worker — кеш и офлайн
const CACHE_NAME = 'syntha-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      try {
        return await fetch(e.request);
      } catch {
        const fromUrl = await caches.match(e.request);
        if (fromUrl) return fromUrl;
        const shell = await caches.match('/');
        if (shell) return shell;
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});
