export interface Item {
  id?: IDBValidKey;
  idAnggota: IDBValidKey; // Relasi ke anggota
  jumlah: number;
  tanggal: string;
  tanggalPinjam: string;
  keterangan: string;
  status: string; // Contoh: "disetujui", "ditolak", "lunas"
}