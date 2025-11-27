import { openDB } from 'idb';

const DB_NAME = 'elderly_offline_db';
const STORE_NAME = 'adultos_pendientes';

export async function initAdultsDB() {
  return openDB(DB_NAME, 2, {   // ← SUBIMOS versión para forzar actualización
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    }
  });
}

// Guarda adulto offline
export async function saveAdultOffline(adultoData: any) {
  const db = await initAdultsDB();

  return db.add(STORE_NAME, {
    ...adultoData,
    synced: false,
    timestamp: Date.now()
  });
}

// Obtiene todos los adultos pendientes
export async function getPendingAdults() {
  const db = await initAdultsDB();
  return db.getAll(STORE_NAME);
}

// Elimina un adulto luego de sincronizar
export async function deletePendingAdult(id: number) {
  const db = await initAdultsDB();
  return db.delete(STORE_NAME, id);
}
