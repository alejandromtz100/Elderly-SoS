import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// ⚠️ Asegúrate de que esta ruta sea correcta para tu archivo syncPendingAdults.ts
import { syncPendingAdults } from './db/syncPendingAdults'; 

// ---------------------------------------------
// 🔹 Renderiza la aplicación principal
// ---------------------------------------------
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ---------------------------------------------
// 🔹 Registro del Service Worker (PWA + Offline)
// ---------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado con éxito:', registration);
      })
      .catch((error) => {
        console.error('❌ Error al registrar el Service Worker:', error);
      });
  });
}

// ---------------------------------------------
// 🔹 Detección de estado de conexión y Sincronización
// ---------------------------------------------
window.addEventListener('online', () => {
  console.log('🟢 Conexión restaurada. Intentando sincronizar datos pendientes...');
  // 🚀 Llama a la función de sincronización cuando el usuario recupera internet
  syncPendingAdults(); 
});

window.addEventListener('offline', () => {
  console.warn('🔴 Sin conexión - modo offline activo');
});