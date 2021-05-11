const VERSION = 'v1';
const CACHE_NAME = 'paper-cache_' + VERSION;
const IMAGE_CACHE_NAME = 'paper-image_' + VERSION;

const IMMUTABLE_APPSHELL = [
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/manifest.json',
  '/images/no_image.png',
  '/images/add_photo.svg',
  '/images/clear.svg',
  '/images/delete.svg',
  '/images/favorite_active.svg',
  '/images/favorite.svg',
  '/images/menu.svg',
  '/images/notification.svg',
  '/images/notification_disabled.svg',
  '/images/notification_enabled.svg'
];

const MUTABLE_APPSHELL = [
  '/',
  '/js/common.js',
  '/js/index.js',
  '/css/index.css'
];

const CACHE_LIST = IMMUTABLE_APPSHELL.concat(MUTABLE_APPSHELL);
const DYNAMIC_PATTERN = /(\.eot$|\.ttf$|\.woff$|^\/icons)/;

self.addEventListener('install', (event) => {
  console.log('Service Worker - install');

});

self.addEventListener('activate', (event) => {
  console.log('Service Worker - activate');

});

self.addEventListener('fetch', (event) => {
  console.log('Service Worker -', event.request.url);
  const url = new URL(event.request.url);
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
  // event.notification.close();
  // event.waitUntil(
  //   self.clients.openWindow('https://google.com')
  // );
});
