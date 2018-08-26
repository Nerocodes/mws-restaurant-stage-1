let cacheName = 'v1';
let cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    './manifest.json',
    './css/styles.css',
    './data/restaurants.json',
    './js/main.js',
    './js/dbhelper.js',
    './js/restaurant_info.js'
];

self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Installed');

    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[ServiceWorker] Caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    )
});

self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((thisCacheName) => {
                if(thisCacheName !== cacheName){
                    console.log('[ServiceWorker] Removing Cache Files from', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
});

self.addEventListener('fetch', (e) => {
    console.log('[ServiceWorker] Fetching', e.request.url);

    e.respondWith(
        caches.match(e.request).then((response) => {
            if(response) return response;
            return fetch(e.request);
        })
    )

});