const appScope = new URL(self.registration.scope);
const indexUrl = new URL('index.html', appScope).href;
const cachePrefix = 'first-stock:' + appScope.pathname + ':';
const cacheName = cachePrefix + 'v4';

const appFiles = [
  'index.html',
  'app.webmanifest',
  'icons/app-192.png',
  'icons/app-512.png',
  'icons/app-maskable-512.png',
  'icons/apple-touch-icon.png',
  'assets/lucide-book-open.svg',
  'assets/lucide-map.svg',
  'assets/lucide-chart.svg',
  'assets/campus-stickers.svg',
  'assets/CAMPUS-ART-CREDITS.txt',
].map(path => new URL(path, appScope).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(appFiles.map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const oldNames = (await caches.keys()).filter(name => name.startsWith(cachePrefix) && name !== cacheName);
    await Promise.all(oldNames.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, cacheKey) {
  const cache = await caches.open(cacheName);
  let response;
  try {
    response = await fetch(request, { cache: 'no-cache' });
    if (response.ok) {
      await cache.put(cacheKey, response.clone()).catch(() => {});
      return response;
    }
    if (response.status < 500) return response;
  } catch {
    // Use the last successful copy when offline.
  }
  return (await cache.match(cacheKey)) || response || Response.error();
}

async function cachedFont(request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone()).catch(() => {});
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== appScope.origin || !url.pathname.startsWith(appScope.pathname)) return;

  const isEntry = url.pathname === appScope.pathname || url.pathname === new URL(indexUrl).pathname;
  if (request.mode === 'navigate' && isEntry) {
    event.respondWith(networkFirst(request, indexUrl));
  } else if (request.destination === 'font') {
    event.respondWith(cachedFont(request));
  } else if (appFiles.includes(url.href)) {
    event.respondWith(networkFirst(request, url.href));
  }
});
