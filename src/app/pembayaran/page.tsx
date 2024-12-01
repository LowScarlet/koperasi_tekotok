'use client';

import { useEffect, useState } from "react";
import { Item } from "./types"; // Import the new type for transactions
import { getAllItems, addItem, updateItem, deleteItem } from "./db";
import { getAllItems as getAllPinjamanItems } from "../pinjaman/db";
import { Item as Pinjaman } from "../pinjaman/types";
import { getAllItems as getAllMetodeItems } from "../metodePembayaran/db";
import { Item as MetodePembayaran } from "../metodePembayaran/types";
import { getAllItems as getAllAnggotaItems } from "../anggota/db";
import { Item as Anggota } from "../anggota/types";

export default function Index() {
  const [items, setItems] = useState<Item[]>([]);
  const [pinjamanItems, setPinjamanItems] = useState<Pinjaman[]>([]);
  const [metodeItems, setMetodeItems] = useState<MetodePembayaran[]>([]);
  const [anggotaItems, setAnggotaItems] = useState<Anggota[]>([]); // Add anggotaItems state
  const [loading, setLoading] = useState<boolean>(true);
  const [updateId, setUpdateId] = useState<IDBValidKey | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<IDBValidKey | null>(null);

  // Default form data structure
  const def: Item = {
    idPinjaman: "", // This is a required field
    idMetodePembayaran: "", // This is a required field
    idAnggota: "", // Add idAnggota
    jumlah: 0,
    tanggal: "", // Format date as string
  };

  const [formData, setFormData] = useState<Item>(def);

  // Fetching all the items, pinjaman, metode data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allItems, allPinjaman, allMetode, allAnggota] = await Promise.all([
        getAllItems(),
        getAllPinjamanItems(),
        getAllMetodeItems(),
        getAllAnggotaItems(), // Fetching anggota data
      ]);
      setItems(allItems);
      setPinjamanItems(allPinjaman);
      setMetodeItems(allMetode);
      setAnggotaItems(allAnggota); // Set anggota data
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle changes in the form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "jumlah" ? parseFloat(value) : value,
    }));
  };

  // Handle Add or Update Item
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

  // Handle selecting an item for updating
  const handleSelectItemForUpdate = (item: Item) => {
    setUpdateId(item.id!);
    setFormData({
      idPinjaman: item.idPinjaman,
      idMetodePembayaran: item.idMetodePembayaran,
      idAnggota: item.idAnggota, // Add idAnggota in the update
      jumlah: item.jumlah,
      tanggal: item.tanggal,
    });

    const modal = document.getElementById("my_modal_1") as HTMLDialogElement;
    modal.showModal();
  };

  // Handle deleting an item
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
        <h1 className="font-bold text-xl">Data Transaksi</h1>
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

      {/* Modal Form */}
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
            {/* Anggota Dropdown */}
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

            {/* Pinjaman Dropdown */}
            <div className="form-control">
              <label className="label" htmlFor="idPinjaman">
                <span className="font-semibold label-text">ID Pinjaman</span>
              </label>
              <select
                id="idPinjaman"
                name="idPinjaman"
                value={formData.idPinjaman.toString()}
                onChange={handleChange}
                className="w-full select-bordered select"
                required
              >
                <option value="" disabled>
                  Pilih Pinjaman
                </option>
                {pinjamanItems.map((pinjaman, index) => (
                  <option key={index} value={pinjaman.id?.toString()}>
                    {pinjaman.keterangan} ({pinjaman.id?.toString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Metode Pembayaran Dropdown */}
            <div className="form-control">
              <label className="label" htmlFor="idMetodePembayaran">
                <span className="font-semibold label-text">ID Metode Pembayaran</span>
              </label>
              <select
                id="idMetodePembayaran"
                name="idMetodePembayaran"
                value={formData.idMetodePembayaran.toString()}
                onChange={handleChange}
                className="w-full select-bordered select"
                required
              >
                <option value="" disabled>
                  Pilih Metode Pembayaran
                </option>
                {metodeItems.map((metode, index) => (
                  <option key={index} value={metode.id?.toString()}>
                    {metode.nama} ({metode.id?.toString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Input */}
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

            {/* Tanggal Input */}
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

      {/* Data Table */}
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
                <th>ID Pinjaman</th>
                <th>ID Metode</th>
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
                  <td>{item.idPinjaman.toString()}</td>
                  <td>{item.idMetodePembayaran.toString()}</td>
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
