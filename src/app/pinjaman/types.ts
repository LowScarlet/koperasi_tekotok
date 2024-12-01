export interface Item {
  id?: IDBValidKey;
  idAnggota: IDBValidKey;
  idStatusPinjaman: IDBValidKey;
  idKategoriPinjaman: IDBValidKey;
  jumlah: number;
  tanggal: string;
}