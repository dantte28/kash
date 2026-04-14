const CACHE = 'kash-v1'

const PRECACHE = [
  '/',
  '/dashboard',
  '/nova-venda',
  '/historico',
  '/estoque',
  '/fluxo',
  '/fechamento',
]

// Instala e pré-cacheia as páginas principais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

// Remove caches antigos ao ativar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Cache-first para navegação, network-first para assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith(self.location.origin)) return

  const url = new URL(event.request.url)

  // Ignora rotas de API e ícones gerados dinamicamente
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/icon')) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchAndCache = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
        .catch(() => cached || new Response('Offline', { status: 503 }))

      // Para navegação: tenta rede primeiro, fallback no cache
      // Para assets estáticos: usa cache primeiro
      const isNavigation = event.request.mode === 'navigate'
      return isNavigation ? fetchAndCache : cached || fetchAndCache
    })
  )
})
