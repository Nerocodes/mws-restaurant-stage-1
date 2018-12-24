let cacheName = 'v8';
let cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './js/main.js',
    './js/idb.js',
    './js/dbhelper.js',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    'https://cdn.rawgit.com/GoogleChrome/pwacompat/v2.0.1/pwacompat.min.js',
    './js/restaurant_info.js',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './img/iconmws-512.png',
    './img/iconmws-256.png',
    './img/iconmws.png'
];

self.addEventListener('install', (e) => {
    //console.log('[ServiceWorker] Installed');

    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            // console.log('[ServiceWorker] Caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    )
});

self.addEventListener('activate', (e) => {
    // console.log('[ServiceWorker] Activated');

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((thisCacheName) => {
                if(thisCacheName !== cacheName){
                    //console.log('[ServiceWorker] Removing Cache Files from', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
});

self.addEventListener('fetch', (e) => {
    //console.log('[ServiceWorker] Fetching', e.request.url);

    e.respondWith(
        caches.match(e.request, {ignoreSearch: true}).then((response) => {
            if(response) return response;
            let reqClone = e.request.clone();
            return fetch(reqClone).then((res) => {
                if(!res) return;

                let resClone = res.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(e.request, resClone);
                });

                return res;
            });
        })
    )

});