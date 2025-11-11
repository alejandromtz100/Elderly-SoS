const CACHE_NAME = "elderly-cache-v3";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// -------------------------------
// 🔹 Instalación: Cache inicial
// -------------------------------
self.addEventListener("install", (event) => {
  console.log("⚙️ Instalando Service Worker...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn("⚠️ Algunos archivos no se pudieron cachear:", err);
      });
    })
  );
  self.skipWaiting();
});

// -------------------------------
// 🔹 Activación: Limpieza de caché vieja
// -------------------------------
self.addEventListener("activate", (event) => {
  console.log("🚀 Activando nuevo Service Worker...");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// -------------------------------
// 🔹 Fetch: Intercepta todas las solicitudes
// -------------------------------
self.addEventListener("fetch", (event) => {
  // ⚠️ Ignora peticiones que no sean GET
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // ✅ Si existe en caché, se devuelve directamente
      if (cachedResponse) {
        return cachedResponse;
      }

      // 🔹 Intentar obtenerlo de la red
      return fetch(event.request)
        .then((networkResponse) => {
          // ✅ Solo cacheamos respuestas GET exitosas
          if (networkResponse && networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // -------------------------------
          // ⚠️ Sin conexión o error de red
          // -------------------------------
          console.warn("📴 Sin conexión. No se pudo obtener:", event.request.url);

          // Si es un recurso estático (por ejemplo una imagen o página)
          if (event.request.destination === "image") {
            return caches.match("/icon-192.png"); // fallback
          }

          // 🔹 Respuesta genérica offline (sin error en consola)
          return new Response("Modo offline - recurso no disponible", {
            status: 200, // ✅ evita error en consola
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});

// -------------------------------
// 🔹 Escucha cambios de conexión
// -------------------------------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
