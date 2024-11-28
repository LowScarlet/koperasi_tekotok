'use client';

import { useEffect, useState } from "react";
import { Item } from "./types";
import { getAllItems, addItem, updateItem, deleteItem } from "./db";

export default function Index() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateId, setUpdateId] = useState<IDBValidKey | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<IDBValidKey | null>(null);

  const def = {
    nama: "",
    alamat: "",
    noTelepon: "",
    tanggalDaftar: "",
    status: "",
  };

  const [formData, setFormData] = useState(def);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allItems = await getAllItems();
      setItems(allItems);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      nama: item.nama || "",
      alamat: item.alamat || "",
      noTelepon: item.noTelepon || "",
      tanggalDaftar: item.tanggalDaftar || "",
      status: item.status || "",
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
        <h1 className="font-bold text-xl">Data Anggota</h1>
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
              <label className="label" htmlFor="nama">
                <span className="label-text">Nama</span>
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                placeholder="Nama"
                value={formData.nama}
                onChange={handleChange}
                className="input-bordered w-full input"
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="alamat">
                <span className="label-text">Alamat</span>
              </label>
              <input
                id="alamat"
                name="alamat"
                type="text"
                placeholder="Alamat"
                value={formData.alamat}
                onChange={handleChange}
                className="input-bordered w-full input"
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="noTelepon">
                <span className="label-text">No Telepon</span>
              </label>
              <input
                id="noTelepon"
                name="noTelepon"
                type="text"
                placeholder="No Telepon"
                value={formData.noTelepon}
                onChange={handleChange}
                className="input-bordered w-full input"
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="tanggalDaftar">
                <span className="label-text">Tanggal Daftar</span>
              </label>
              <input
                id="tanggalDaftar"
                name="tanggalDaftar"
                type="date"
                value={formData.tanggalDaftar}
                onChange={handleChange}
                className="input-bordered w-full input"
                required
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="status">
                <span className="label-text">Status</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full select-bordered select"
                required
              >
                <option value="" disabled>
                  Pilih Status
                </option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
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
                <th>Id</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>No Telepon</th>
                <th>Tanggal Daftar</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id?.toString() || index}>
                  <td>{index + 1}</td>
                  <td>{item.id?.toString()}</td>
                  <td>{item.nama}</td>
                  <td>{item.alamat}</td>
                  <td>{item.noTelepon}</td>
                  <td>{item.tanggalDaftar}</td>
                  <td>{item.status}</td>
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
