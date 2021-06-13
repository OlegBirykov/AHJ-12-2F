import { loadingUrl, dataUrl } from './tools';

const json = JSON.stringify([
  {
    text: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    image: 0,
    timestamp: 0,
  },
  {
    text: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    image: 0,
    timestamp: 0,
  },
  {
    text: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    image: 0,
    timestamp: 0,
  },
]);
const responseFromCache = new Response(json);

const loadingCache = 'loadingCache';
const dataCache = 'dataCache';

self.addEventListener('install', (evt) => {
  evt.waitUntil((async () => {
    const cache = await caches.open(loadingCache);
    await cache.put(loadingUrl, responseFromCache);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil((async () => {
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (evt) => {
  switch (evt.request.url) {
    case loadingUrl:
      evt.respondWith((async () => {
        const cache = await caches.open(loadingCache);
        const response = await cache.match(evt.request);
        return response;
      })());

      evt.waitUntil((async () => {
        const clients = await self.clients.matchAll();
        const client = clients.find((item) => item.id === evt.clientId);

        const cache = await caches.open(dataCache);

        try {
          const response = await fetch(evt.request.url);
          if (response.ok) {
            await cache.put(dataUrl, response);
            client.postMessage('ready');
          } else {
            client.postMessage('error');
          }
        } catch (e) {
          client.postMessage('error');
        }
      })());
      break;

    case dataUrl:
      evt.respondWith((async () => {
        const cache = await caches.open(dataCache);
        const response = await cache.match(evt.request);
        return response;
      })());
      break;

    default:
  }
});
