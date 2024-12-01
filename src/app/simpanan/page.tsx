'use client';

import { useEffect, useState } from "react";
import { Item } from "./types"; // Impor tipe baru
import { getAllItems, addItem, updateItem, deleteItem } from "./db";
import { getAllItems as getAllAnggotaItems } from "../anggota/db";
import { Item as Anggota } from "../anggota/types";
import { getAllItems as getAllKategoriSimpananItems } from "../kategoriSimpanan/db"; // New import for kategori simpanan
import { Item as KategoriSimpanan } from "../kategoriSimpanan/types"; // New type for kategori simpanan

export default function Index() {
  const [items, setItems] = useState<Item[]>([]);
  const [anggotaItems, setAnggotaItems] = useState<Anggota[]>([]);
  const [kategoriSimpananItems, setKategoriSimpananItems] = useState<KategoriSimpanan[]>([]); // State for kategori simpanan
  const [loading, setLoading] = useState<boolean>(true);
  const [updateId, setUpdateId] = useState<IDBValidKey | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<IDBValidKey | null>(null);

  const def: Item = {
    idAnggota: "",
    idKategoriSimpanan: "", // Default for kategori simpanan
    jumlah: 0,
    tanggal: "",
  };

  const [formData, setFormData] = useState<Item>(def);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allItems, allAnggota, allKategoriSimpanan] = await Promise.all([
        getAllItems(),
        getAllAnggotaItems(),
        getAllKategoriSimpananItems(), // Fetch kategori simpanan data
      ]);
      setItems(allItems);
      setAnggotaItems(allAnggota);
      setKategoriSimpananItems(allKategoriSimpanan); // Set kategori simpanan data
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "jumlah" ? parseFloat(value) : value, // Convert jumlah to number
    }));
  };

  const handleAddOrUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (updateId) {
      await updateItem(updateId, formData);
    } else {
      await addItem(formData);
    }

    const allItems = await getAllItems();
    setItems(allItems);
    setFormData(def);
    setUpdateId(null);
    setLoading(false);

    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal.close();
  };

  const handleSelectItemForUpdate = (item: Item) => {
    setUpdateId(item.id!);
    setFormData({
      idAnggota: item.idAnggota,
      idKategoriSimpanan: item.idKategoriSimpanan, // Update for kategori simpanan
      jumlah: item.jumlah,
      tanggal: item.tanggal,
    });

    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal.showModal();
  };

  const handleDeleteItem = async (id: IDBValidKey) => {
    setLoading(true);
    await deleteItem(id);
    const allItems = await getAllItems();
    setItems(allItems);
    setDeleteConfirmId(null);
    setLoading(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="font-bold text-xl">Data Simpanan</h1>
        <button
          className="btn"
          onClick={() => {
            const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
            modal.showModal();
          }}
        >
          Tambah Data
        </button>
      </div>

      <dialog id="my_modal_1" className="modal">
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() => {
            setFormData(def);
            setUpdateId(null);
          }}
        >
          <button>close</button>
        </form>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{updateId ? "Update Data" : "Tambah Data"}</h3>

          <form onSubmit={handleAddOrUpdateItem} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="idAnggota">
                <span className="font-semibold label-text">ID Anggota</span>
              </label>
              <select
                id="idAnggota"
                name="idAnggota"
                value={formData.idAnggota.toString()}
                onChange={handleChange}
                className="w-full select-bordered select"
                required
              >
                <option value="" disabled>
                  Pilih Anggota
                </option>
                {anggotaItems.map((anggota, index) => (
                  <option key={index} value={anggota.id?.toString()}>
                    {anggota.nama} ({anggota.id?.toString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="idKategoriSimpanan">
                <span className="font-semibold label-text">ID Kategori Simpanan</span>
              </label>
              <select
                id="idKategoriSimpanan"
                name="idKategoriSimpanan"
                value={formData.idKategoriSimpanan.toString()}
                onChange={handleChange}
                className="w-full select-bordered select"
                required
              >
                <option value="" disabled>
                  Pilih Kategori Simpanan
                </option>
                {kategoriSimpananItems.map((kategoriSimpanan, index) => (
                  <option key={index} value={kategoriSimpanan.id?.toString()}>
                    {kategoriSimpanan.kategori} ({kategoriSimpanan.id?.toString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="jumlah">
                <span className="label-text">Jumlah</span>
              </label>
              <input
                id="jumlah"
                name="jumlah"
                type="number"
                placeholder="Jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                className="input-bordered w-full input"
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="tanggal">
                <span className="label-text">Tanggal</span>
              </label>
              <input
                id="tanggal"
                name="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={handleChange}
                className="input-bordered w-full input"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 form-control mt-4">
              <button type="submit" className="btn btn-primary">
                {updateId ? "Update Data" : "Tambah Data"}
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {loading ? (
        <p className="font-semibold text-center text-lg">Memuat Data...</p>
      ) : items.length === 0 ? (
        <p className="font-semibold text-center text-lg">Data Kosong!</p>
      ) : (
        <div className="rounded-md overflow-x-auto">
          <table className="w-full table table-zebra">
            <thead>
              <tr>
                <th>No</th>
                <th>ID</th>
                <th>ID Anggota</th>
                <th>ID Kategori Simpanan</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id?.toString() || index}>
                  <td>{index + 1}</td>
                  <td>{item.id?.toString()}</td>
                  <td>{item.idAnggota.toString()}</td>
                  <td>{item.idKategoriSimpanan.toString()}</td>
                  <td>{item.jumlah}</td>
                  <td>{item.tanggal}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSelectItemForUpdate(item)}
                    >
                      Ubah
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        deleteConfirmId === item.id
                          ? handleDeleteItem(item.id!)
                          : setDeleteConfirmId(item.id!)
                      }
                    >
                      {deleteConfirmId === item.id ? "Yakin Hapus?" : "Hapus"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
