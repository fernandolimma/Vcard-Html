const CACHE_NAME = 'v1.1'; // Atualize o número da versão aqui

// Instalação do service worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/img/icon-192x192.png',
                '/img/icon-500x500.png',
                '/img/perfil.jpg',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
            ]);
        }).catch(function(error) {
            console.error('Falha ao abrir o cache:', error);
        })
    );
});

// Ativação do service worker
self.addEventListener('activate', function(event) {
    const cacheWhitelist = [CACHE_NAME]; // Lista de caches permitidos (novos)

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Apaga caches antigos
                    }
                })
            );
        })
    );
});

// Requisição de recursos com cache
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request); // Retorna o recurso do cache ou faz a requisição
        })
    );
});
