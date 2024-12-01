import { openDB, IDBPDatabase } from 'idb';

const dbName = 'KOPERASI_TEKOTOK';
const storeNames = ['anggota', 'simpanan', 'pinjaman', 'pembayaranPinjaman', 'metodePembayaran', 'kategoriSimpanan', 'kategoriPinjaman', 'statusPinjaman'];

let dbPromise: Promise<IDBPDatabase>;

export const initDB = async (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(dbName, 1, {
      upgrade(db) {
        storeNames.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          }
        });
      }
    });
  }
  return dbPromise;
};
