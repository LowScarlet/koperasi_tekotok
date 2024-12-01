export interface Item {
  id?: IDBValidKey;
  idAnggota: IDBValidKey;
  idKategoriSimpanan: IDBValidKey;
  jumlah: number;
  tanggal: string;
}