const CACHE_PREFIX = 'big-trip-cache';
const CACHE_VAR = 'v1';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VAR}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

const staticPaths = [
  '/',
  '/index.html',
  '/bundle.js',
  '/css/style.css',
  '/fonts/',
  '/fonts/Montserrat-Bold.woff2',
  '/fonts/Montserrat-ExtraBold.woff2',
  '/fonts/Montserrat-Medium.woff2',
  '/fonts/Montserrat-Regular.woff2',
  '/fonts/Montserrat-SemiBold.woff2',
  '/img/header-bg.png',
  '/img/header-bg@2x.png',
  '/img/logo.png',
  '/img/icons/bus.png',
  '/img/icons/check-in.png',
  '/img/icons/drive.png',
  '/img/icons/flight.png',
  '/img/icons/restaurant.png',
  '/img/icons/ship.png',
  '/img/icons/sightseeing.png',
  '/img/icons/taxi.png',
  '/img/icons/train.png',
  '/img/icons/transport.png',
  '/img/photos/1.jpg',
  '/img/photos/2.jpg',
  '/img/photos/3.jpg',
  '/img/photos/4.jpg',
  '/img/photos/5.jpg',
];

const loadData = async (request) => {
  const cacheResponse = await caches.match(request);

  if (cacheResponse) {
    return cacheResponse;
  }

  const response = await fetch(request);
  const { status, type} = response;

  if (!response || status !== HTTP_STATUS_OK || type !== RESPONSE_SAFE_TYPE) {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());

  return response;
};

self.addEventListener('install', async () => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(staticPaths);
});

self.addEventListener('activate', async () => {
  const cacheNames = await caches.keys();

  const obsoleteCache = cacheNames
    .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
    .map((name) => caches.delete(name));

  await Promise.all(obsoleteCache);
});

self.addEventListener('fetch', async (evt) => {
  const { request } = evt;
  evt.respondWith(loadData(request));
});
