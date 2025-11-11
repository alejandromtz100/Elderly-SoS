import { openDB } from 'idb';

const DB_NAME = 'elderly_offline_db';
const STORE_NAME = 'users';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'usuario' });
      }
    },
  });
}

export async function saveUserOffline(userData: any) {
  const db = await initDB();
  await db.put(STORE_NAME, userData);
}

export async function getUserOffline(usuario: string) {
  const db = await initDB();
  return db.get(STORE_NAME, usuario);
}
