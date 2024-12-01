// pages/index.tsx
'use client'

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>UTS Local Storage</h1>
      <h4>List Link</h4>
      <ul>
        <li><Link href={'/anggota'}>Manajemen Anggota</Link></li>
      </ul>
    </div>
  );
}
