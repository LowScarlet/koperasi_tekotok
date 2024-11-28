export interface Item {
  id?: IDBValidKey;
  idAnggota: IDBValidKey; // Relasi ke anggota
  jumlah: number;
  tanggal: string;
  keterangan: string;
  jenis: string; // Contoh: "pokok", "wajib", "sukarela"
}