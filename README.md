# SNEAKERCARE LAB — Shoes Laundry & Restoration Management System

Sistem manajemen operasional cuci dan perawatan sepatu (Shoe Laundry & Care) untuk 1 toko mandiri. Dirancang dengan pola **Dual-Mode Data Architecture** agar dapat langsung dijalankan dan diuji sebagai live demo portofolio tanpa konfigurasi database eksternal, sekaligus siap disambungkan ke PostgreSQL / Prisma ORM untuk kebutuhan produksi nyata.

---

## Fitur Utama

- **Penerimaan Kasir (POS Counter):** Pencatatan pelanggan, identitas & bahan sepatu (Canvas, Suede, Leather, Nubuck, Mesh), paket treatment, dan dokumentasi foto kondisi awal (**Before Photo**).
- **Papan Alur Kerja (Kanban Board):** Memantau alur pengerjaan sepatu (*Antrean Masuk*, *Treatment & Cuci*, *Pengeringan*, *QC & Packing*, *Siap Diambil*, *Selesai*) lengkap dengan unggah foto hasil cucian (**After Photo**).
- **Nota Struk Thermal:** Format cetak struk siap pakai ukuran 58mm / 80mm dengan QR code unik menuju link tracking pesanan.
- **Notifikasi WhatsApp 1-Klik:** Generator pesan nota digital dan pemberitahuan sepatu siap diambil yang dikirim langsung ke nomor WhatsApp pelanggan.
- **Halaman Pelacakan Publik Pelanggan (`/track/[orderCode]`):** Halaman tracking ringan tanpa login bagi pelanggan untuk memantau timeline pengerjaan dan membandingkan foto **Before vs After** secara interaktif.
- **Laporan Keuangan & Piutang:** Rekap kas masuk harian/bulanan, tagihan tertunggak, dan analisis performa paket layanan terpopuler.

---

## Arsitektur & Teknologi

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org) + [React 19](https://react.dev)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) (Tactical Dark Slate Palette)
- **Database & ORM:** [Prisma ORM](https://www.prisma.io) dengan skema PostgreSQL / Supabase
- **Data Adapter:** Dual-Mode Repository (`localStorage` interaktif untuk demo portofolio + Prisma Client untuk mode database produksi)
- **Icons & Tooling:** [Lucide React](https://lucide.dev) & `qrcode`

---

## Menjalankan Proyek Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/WanyoSiswanto/Saas-CuciSepatu.git
   cd Saas-CuciSepatu
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

4. **Kompilasi build produksi:**
   ```bash
   npm run build
   ```

---

## Struktur Halaman

| Route | Keterangan |
| :--- | :--- |
| `/` | Landing intro & akses cepat portal sistem |
| `/dashboard` | Ringkasan metrik kasir, antrean aktif, dan sepatu siap diambil |
| `/dashboard/pos` | Form kasir penerimaan sepatu baru & unggah foto Before |
| `/dashboard/kanban` | Papan alur kerja workshop teknisi & unggah foto After |
| `/dashboard/orders` | Master database seluruh pesanan & pencarian nota |
| `/dashboard/finance` | Rekapitulasi kas masuk, piutang, dan performa layanan |
| `/track/[orderCode]` | Portal pelacakan publik pelanggan (bebas login via QR/WhatsApp) |
