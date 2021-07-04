const CACHE_PREFIX = 'bigtrip-cache';
const CACHE_VAR = 'v1';
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VAR}`;

const HTTP_STATUS_OK = 200;
const RESPONSE_SAFE_TYPE = 'basic';

const assetUrls = [
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

const installHandler = (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(assetUrls);
      }),
  );
};

const activateHandler = (evt) => {
  evt.waitUntil(
    caches.keys()
      .then((cacheNames) =>  Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )),
  );
};

const fetchHandler = (evt) => {
  const {request} = evt;

  evt.respondWith(
    caches.match(request)
      .then((cacheResponse) => {
        if (cacheResponse) {
          return cacheResponse;
        }

        return fetch(request)
          .then((response) => {
            if (
              !response ||
              response.status !== HTTP_STATUS_OK ||
              response.type !== RESPONSE_SAFE_TYPE
            )  {
              return response;
            }

            const clonedResponse = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, clonedResponse));

            return response;
          });
      }),
  );
};

self.addEventListener('install', installHandler);
self.addEventListener('activate', activateHandler);
self.addEventListener('fetch', fetchHandler);
