const CACHE_VERSION = 'v1.2.1';
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const ASSETS_CACHE = `assets-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/robots.txt',
  '/sitemap.xml',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('Initial cache setup complete with available assets');
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // MONETAG REQUESTS BYPASS: Monetag ke domains ko cache na karein taake ads sahi chalein
  if (
    url.hostname.includes('quge5.com') || 
    url.hostname.includes('3nbf4.com') || 
    url.hostname.includes('bngpt.com') ||
    url.hostname.includes('v977v.com')
  ) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  const offlineHtmlResponse = () =>
    caches.match('/index.html').then((response) => {
      return response || new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({ 'Content-Type': 'text/html' })
      });
    });

  const offlineTextResponse = () =>
    new Response('Network error while offline', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || offlineTextResponse();
          });
        })
    );
    return;
  }

  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            caches.open(ASSETS_CACHE).then(c => c.delete(request));
          } else {
            return response;
          }
        }
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(ASSETS_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request).then((fallback) => {
              return fallback || offlineTextResponse();
            });
          });
      })
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put('/index.html', clone);
            });
          }
          return response;
        })
        .catch(() => offlineHtmlResponse())
    );
    return;
  }

  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || offlineHtmlResponse();
          });
        })
    );
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }
});
