export interface Item {
  id?: IDBValidKey;
  idAnggota: IDBValidKey;
  idPinjaman: IDBValidKey; // Relasi ke simpanan
  idMetodePembayaran: IDBValidKey; // Relasi ke metodePembayaran
  jumlah: number;
  tanggal: string;
}