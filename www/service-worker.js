const CACHE_NAME = 'tacenda-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(['/', '/index.html']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(r => r || fetch(event.request))
  );
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data.json(); } catch(e) {
    data = { title: 'Tacenda', body: event.data ? event.data.text() : '新消息' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Tacenda', {
      body: data.body || '',
      icon: 'https://i.postimg.cc/8Pgm5B6w/IMG-5211.png',
      tag: 'tacenda-' + Date.now(),
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

