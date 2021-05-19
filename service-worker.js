importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    ({ url }) => url.pathname === '/index.html',
    new workbox.strategies.NetworkFirst()
);