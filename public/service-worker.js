const CACHE_NAME = "elderly-cache-v4";

// Recursos esenciales
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// --------------------------------------------------
// INSTALL → Cache inicial
// --------------------------------------------------
self.addEventListener("install", (event) => {
  console.log("⚙️ Instalando Service Worker...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn("⚠️ No se pudieron cachear algunos archivos:", err);
      });
    })
  );

  self.skipWaiting();
});

// --------------------------------------------------
// ACTIVATE → Limpiar cachés viejas
// --------------------------------------------------
self.addEventListener("activate", (event) => {
  console.log("🚀 Activando nuevo Service Worker...");

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Eliminando caché antigua:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// --------------------------------------------------
// FETCH → Cache First
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
          if (event.request.destination === "image") {
            return caches.match("/icon-192.png");
          }

          return new Response("Offline - recurso no disponible", {
            status: 200,
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});

// --------------------------------------------------
// MESSAGE → Forzar actualización
// --------------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// --------------------------------------------------
// PUSH → Mostrar notificaciones push
// --------------------------------------------------
self.addEventListener("push", (event) => {
  console.log("📬 Push recibido:", event.data?.text());

  let payload = {};

  // Parse seguro del JSON
  try {
    payload = event.data?.json() || {};
  } catch {
    payload = {
      title: "Notificación",
      body: event.data?.text() || "Tienes una nueva notificación",
    };
  }

  const title = payload.title || "Notificación";
  const body = payload.body || "Tienes un mensaje nuevo";

  const options = {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    data: {
      url: payload.url || "/", // URL a abrir
    },
    actions: [
      { action: "open", title: "Abrir" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// --------------------------------------------------
// notificationclick → Abrir la app o URL específica
// --------------------------------------------------
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsList) => {
        for (const client of clientsList) {
          if (client.url.includes(urlToOpen) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(urlToOpen);
      })
  );
});
