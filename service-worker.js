const VERSION = 'v3';
const CACHE_NAME = 'paper-cache_' + VERSION;
const IMAGE_CACHE_NAME = 'paper-image_' + VERSION;

const IMMUTABLE_APPSHELL = [
  '/pwa/favicon.ico',
  '/pwa/favicon-16x16.png',
  '/pwa/favicon-32x32.png',
  '/pwa/manifest.json',
  '/pwa/images/no_image.png',
  '/pwa/images/add_photo.svg',
  '/pwa/images/clear.svg',
  '/pwa/images/delete.svg',
  '/pwa/images/favorite_active.svg',
  '/pwa/images/favorite.svg',
  '/pwa/images/menu.svg',
  '/pwa/images/notification.svg',
  '/pwa/images/notification_disabled.svg',
  '/pwa/images/notification_enabled.svg'
];

const MUTABLE_APPSHELL = [
  '/pwa/',
  '/pwa/js/common.js',
  '/pwa/js/index.js',
  '/pwa/css/index.css'
];

const CACHE_LIST = IMMUTABLE_APPSHELL.concat(MUTABLE_APPSHELL);
const DYNAMIC_PATTERN = /(\.eot$|\.ttf$|\.woff$|^\/icons)/;

self.addEventListener('install', (event) => {
  console.log('Service Worker - install');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_LIST)),
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker - activate');

});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker -', event.request.url);
  const url = new URL(event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request)),
  );
});

self.addEventListener('sync', (event) => {
  console.log('Service Worker - sync:', event.tag);

});

self.addEventListener('message', (event) => {
  console.log('Service Worker - message:', action);

});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  console.log('Service Worker - push:', data);

  const title = 'Paper';
  const options = {
    body: data.message,
    badge: data.badge,
    icon: data.icon
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker - Notification clicked!');
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow('https://google.com')
  );
});
