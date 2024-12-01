import { initDB } from '../libs/db';
import { Item } from './types';

const storeName = 'statusPinjaman'

// CRUD functions
export const addItem = async (item: Omit<Item, 'id'>): Promise<IDBValidKey> => {
  const db = await initDB();
  const id = await db.add(storeName, item);
  return id;
};

export const getItem = async (id: IDBValidKey): Promise<Item | undefined> => {
  const db = await initDB();
  return db.get(storeName, id);
};

export const getAllItems = async (): Promise<Item[]> => {
  const db = await initDB();
  return db.getAll(storeName);
};

export const updateItem = async (id: IDBValidKey, updatedData: Partial<Item>): Promise<Item | null> => {
  const db = await initDB();
  const item = await db.get(storeName, id);
  if (!item) return null;
  const updatedItem = { ...item, ...updatedData };
  await db.put(storeName, updatedItem);
  return updatedItem;
};

export const deleteItem = async (id: IDBValidKey): Promise<void> => {
  const db = await initDB();
  await db.delete(storeName, id);
};
