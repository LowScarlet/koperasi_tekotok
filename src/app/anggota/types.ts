export interface Item {
  id?: IDBValidKey;
  nama: string;
  alamat: string;
  noTelepon: string;
  tanggalDaftar: string;
  status: string;
}