export interface Item {
  id?: IDBValidKey;
  kode: string;
  nama: string;
  deskripsi: string;
  biaya: number;
}