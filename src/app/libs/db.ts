import { openDB, IDBPDatabase } from 'idb';

const dbName = 'KOPERASI_TEKOTOK';
const storeNames = ['anggota', 'simpanan', 'pinjaman', 'pembayaranPinjaman', 'metodePembayaran'];

let dbPromise: Promise<IDBPDatabase>;

export const initDB = async (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(dbName, 1, {
      upgrade(db) {
        storeNames.forEach((storeName) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            
            // Buat index jika store adalah simpanan
            if (storeName === 'simpanan') {
              store.createIndex('idAnggota', 'idAnggota', { unique: false });
            }
          }
        });
      }
    });
  }
  return dbPromise;
};
