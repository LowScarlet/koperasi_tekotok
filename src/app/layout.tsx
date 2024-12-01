import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={'antialiased'}
      >
        <div className="bg-base-100 navbar">
          <div className="flex-1">
            <a className="text-xl btn btn-ghost">Koperasi Tekotok</a>
          </div>
          <div className="flex-none">
            <ul className="px-1 menu menu-horizontal">
              <li><Link href={'/anggota'}>Anggota</Link></li>
              <li><Link href={'/metodePembayaran'}>Metode Pembayaran</Link></li>
              <li><Link href={'/kategoriSimpanan'}>Kategori Simpanan</Link></li>
              <li><Link href={'/kategoriPinjaman'}>Kategori Pinjaman</Link></li>
              <li><Link href={'/statusPinjaman'}>Status Simpanan</Link></li>
              <li><Link href={'/simpanan'}>Simpanan</Link></li>
              <li><Link href={'/pinjaman'}>Pinjaman</Link></li>
              <li><Link href={'/pembayaran'}>Pembayaran Pinjaman</Link></li>
            </ul>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
