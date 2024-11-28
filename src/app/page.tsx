// pages/index.tsx
'use client'

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Tugas Local Storage Menggunakan IndexDB</h1>
      <h4>List Link</h4>
      <ul>
        <li><Link href={'/anggota'}>Manajemen Anggota</Link></li>
      </ul>
    </div>
  );
}
