const CACHE_NAME = 'museo-app-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/amuse_logo.png'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Aggiungi solo i file che esistono realmente
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.log(`Failed to cache ${url}:`, err)
              return null
            })
          )
        )
      })
      .then(() => {
        // Forza l'attivazione del nuovo service worker
        return self.skipWaiting()
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Prendi il controllo di tutti i client
      return self.clients.claim()
    })
  )
})
