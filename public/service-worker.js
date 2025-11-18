const CACHE_NAME = "elderly-cache-v3";

// Lista de recursos esenciales a cachear
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// --------------------------------------------------
// 🔹 EVENTO: INSTALL → Cache inicial
// --------------------------------------------------
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

// --------------------------------------------------
// 🔹 EVENTO: ACTIVATE → Limpieza de caché vieja
// --------------------------------------------------
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

// --------------------------------------------------
// 🔹 EVENTO: FETCH → Estrategia Cache-First
// --------------------------------------------------
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.warn("📴 Sin conexión:", event.request.url);

          if (event.request.destination === "image") {
            return caches.match("/icon-192.png");
          }

          return new Response("Modo offline - recurso no disponible", {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});

// --------------------------------------------------
// 🔹 EVENTO: MESSAGE → Control de actualización
// --------------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// --------------------------------------------------
// 🔥🔥🔥
// 🔹 EVENTO: PUSH → Mostrar notificaciones push
// 🔥🔥🔥
// --------------------------------------------------
self.addEventListener("push", (event) => {
  console.log("📬 Notificación Push recibida:", event.data?.text());

  let data = {};
  try {
    data = event.data.json();
  } catch (err) {
    data = {
      title: "Notificación",
      body: event.data?.text() || "Tienes un nuevo mensaje",
    };
  }

  const options = {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notificación", options)
  );
});

// --------------------------------------------------
// 🔹 EVENTO: notificationclick (opcional)
// --------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/");
    })
  );
});
