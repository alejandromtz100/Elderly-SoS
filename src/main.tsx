import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

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
// 🔹 Detección de estado de conexión
// ---------------------------------------------
window.addEventListener('online', () => {
  console.log('🟢 Conexión restaurada');
});

window.addEventListener('offline', () => {
  console.warn('🔴 Sin conexión - modo offline activo');
});
