import Link from 'next/link';
import {
  Footprints,
  PlusCircle,
  Kanban,
  Receipt,
  Search,
  CheckCircle2,
  ShieldCheck,
  Printer,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Sliders,
  Database,
  Layers,
  Sparkle,
} from 'lucide-react';
import { STORE_INFO } from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-blue-500/20 selection:text-blue-700">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 block">
                {STORE_INFO.name}
              </span>
              <span className="text-[10px] text-blue-600 font-bold font-mono">
                WORKSHOP ATELIER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition shadow-xs shadow-orange-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buka POS Kasir</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Dual-Mode Architecture: Portfolio Interactive Demo & Production DB Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Sistem Operasional & Kasir <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              Shoes Laundry & Care Atelier
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Aplikasi manajemen perawatan sepatu profesional: foto kondisi awal (Before Photo), papan alur Kanban teknisi, nota cetak thermal 58mm/80mm, notifikasi WhatsApp otomatis, hingga portal tracking publik bagi pelanggan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wide uppercase transition shadow-lg shadow-orange-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mulai Kasir POS</span>
            </Link>

            <Link
              href="/dashboard/kanban"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition border border-slate-200/90 shadow-2xs"
            >
              <Kanban className="w-4 h-4 text-blue-600" />
              <span>Lihat Kanban Pengerjaan</span>
            </Link>

            <Link
              href="/track/CS-2609-001"
              target="_blank"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 font-bold text-xs transition border border-blue-200 shadow-2xs"
            >
              <Search className="w-4 h-4" />
              <span>Cek Tracking Publik</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Dokumentasi Foto Awal & Sesudah (Before/After)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kamera saat sepatu masuk untuk mendeteksi noda dan cacat bawaan, serta foto hasil akhir setelah dicuci untuk membebaskan toko dari komplain sepihak.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Nota Struk Thermal & WhatsApp 1-Klik</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Format struk fisik standar 58mm/80mm siap cetak ke printer Bluetooth kasir, lengkap dengan QR Code tracking unik dan tombol kirim rincian nota via WhatsApp.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Pipeline Kanban Workshop</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Memisahkan sepatu berdasarkan tahapan kerja: Antrean Masuk, Treatment Khusus (Suede, Leather, Canvas), Pengeringan, QC & Packaging, hingga Rak Siap Ambil.
            </p>
          </div>
        </div>

        {/* Architecture Specs Box */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Spesifikasi Arsitektur Software</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold">FRAMEWORK</span>
              <p className="text-xs font-bold text-slate-900">Next.js 16 (App Router)</p>
              <p className="text-[11px] text-slate-500">React 19 & Turbopack</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold">STYLING & PALETTE</span>
              <p className="text-xs font-bold text-slate-900">Tailwind CSS v4</p>
              <p className="text-[11px] text-slate-500">Fresh Blue, Amber & Citrus</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold">DATA ADAPTER</span>
              <p className="text-xs font-bold text-slate-900">Dual-Mode Repository</p>
              <p className="text-[11px] text-slate-500">Client Demo + Prisma PostgreSQL</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-bold">PUBLIC PORTAL</span>
              <p className="text-xs font-bold text-slate-900">No-Auth Live Tracking</p>
              <p className="text-[11px] text-slate-500">Via QR Code & WhatsApp Link</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 space-y-1 bg-white">
        <p className="font-bold text-slate-700">
          {STORE_INFO.name} — Shoe Laundry & Care Management System
        </p>
        <p className="text-[11px] text-slate-400">
          Dirancang untuk operasional toko cuci sepatu mandiri yang rapi, transparan, dan terstruktur.
        </p>
      </footer>
    </div>
  );
}
