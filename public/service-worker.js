const CACHE_NAME = "elderly-cache-v3";
// Lista de recursos esenciales que se cachearán durante la instalación.
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// ------------------------------------------------------------------
// 🔹 Instalación: Cache inicial (Estrategia: Cache-First)
// Este evento se dispara cuando el Service Worker se instala por primera vez.
// ------------------------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("⚙️ Instalando Service Worker...");
  event.waitUntil(
    // 1. Abrir la caché con el nombre de versión actual.
    caches.open(CACHE_NAME).then((cache) => {
      // 2. Agregar todos los recursos esenciales a la caché.
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn("⚠️ Algunos archivos no se pudieron cachear:", err);
      });
    })
  );
  // 3. Forzar la activación inmediata del nuevo Service Worker.
  self.skipWaiting();
});

// ------------------------------------------------------------------
// 🔹 Activación: Limpieza de caché vieja
// Este evento se dispara después de la instalación y es clave para actualizar la caché.
// ------------------------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("🚀 Activando nuevo Service Worker...");
  event.waitUntil(
    // 1. Obtener todas las claves de caché existentes.
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          // 2. Eliminar cualquier caché que NO sea la versión actual (CACHE_NAME).
          if (key !== CACHE_NAME) {
            console.log("🧹 Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // 3. Tomar el control de los clientes (páginas) abiertos inmediatamente.
  self.clients.claim();
});

// ------------------------------------------------------------------
// 🔹 Fetch: Intercepta todas las solicitudes (Estrategia: Cache-First, then Network)
// ------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  // ⚠️ Ignora peticiones que no sean GET para evitar problemas con APIs POST/PUT/DELETE.
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    // 1. Intentar obtener el recurso de la caché.
    caches.match(event.request).then((cachedResponse) => {
      // ✅ Si existe en caché, se devuelve directamente (Cache-First).
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Si no está en caché, intentar obtenerlo de la red (Network).
      return fetch(event.request)
        .then((networkResponse) => {
          // ✅ Solo cacheamos respuestas GET exitosas.
          if (networkResponse && networkResponse.status === 200) {
            // Clonar la respuesta, ya que el cuerpo de una respuesta solo puede ser leído una vez.
            const clonedResponse = networkResponse.clone();
            // Abrir la caché y guardar el nuevo recurso para futuras peticiones.
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          // Devolver la respuesta de la red.
          return networkResponse;
        })
        .catch(() => {
          // ----------------------------------------------------
          // ⚠️ Sin conexión o error de red (Offline Fallback)
          // ----------------------------------------------------
          console.warn("📴 Sin conexión. No se pudo obtener:", event.request.url);

          // Si es una imagen, devolver una imagen de fallback estática.
          if (event.request.destination === "image") {
            return caches.match("/icon-192.png"); // fallback de imagen
          }

          // 🔹 Respuesta genérica offline para otros recursos (evita error de consola).
          return new Response("Modo offline - recurso no disponible", {
            status: 200, // ✅ Esto evita el error de red en la consola
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});

// ------------------------------------------------------------------
// 🔹 Escucha mensajes: Para forzar activación desde la aplicación principal
// ------------------------------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    // Si la aplicación principal envía un mensaje "SKIP_WAITING", forzar la activación.
    self.skipWaiting();
  }
});