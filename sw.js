self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then(cache => cache.addAll(['/', '/index.html']))
  );
});

self.addEventListener('fetch', async (event) => {
  const cached = await event.respondWith(caches.match(event.request));
  if (cached !== undefined) {
    console.log('got thing from cache'  )
    return cached;
  }

  try {
    const networkResponse = await fetch(event.request);
    const clone = networkResponse.clone();
    const cache = await caches.open('v1');

    cache.put(event.request, clone);

    return networkResponse;
  } catch (e) {
    console.error('ruh-roh', e);
  }
});
