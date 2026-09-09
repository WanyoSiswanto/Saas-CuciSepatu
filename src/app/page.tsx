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
} from 'lucide-react';
import { STORE_INFO } from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#f8f9fa] flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navigation */}
      <header className="border-b border-white/[0.08] bg-[#101318]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-white">
                {STORE_INFO.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                MANAGEMENT SYSTEM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buka POS Kasir</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Dual-Mode Architecture: Portfolio Interactive Demo & Production DB Ready</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Sistem Operasional & Kasir <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Shoes Laundry & Care Workshop
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Aplikasi manajemen cuci sepatu: dari registrasi kasir dengan foto kondisi awal (Before Photo), papan Kanban teknisi, nota thermal 58mm/80mm, notifikasi WhatsApp otomatis, hingga halaman tracking publik untuk pelanggan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wide uppercase transition shadow-xl shadow-emerald-500/25"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mulai Kasir POS</span>
            </Link>

            <Link
              href="/dashboard/kanban"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition border border-white/10"
            >
              <Kanban className="w-4 h-4" />
              <span>Lihat Kanban Pengerjaan</span>
            </Link>

            <Link
              href="/track/CS-2609-001"
              target="_blank"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 font-semibold text-xs transition border border-emerald-500/30"
            >
              <Search className="w-4 h-4" />
              <span>Cek Tracking Publik</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Foto Kondisi Awal & Sesudah (Before/After)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dokumentasi kamera saat sepatu masuk untuk mendeteksi noda dan cacat bawaan, serta foto hasil akhir setelah dicuci untuk membebaskan toko dari komplain sepihak.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Nota Thermal & WhatsApp 1-Klik</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Format struk fisik standar 58mm/80mm siap cetak ke printer Bluetooth kasir, lengkap dengan QR Code tracking unik dan tombol kirim rincian nota langsung via WhatsApp.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Pipeline Kanban Alur Cuci</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Memisahkan sepatu berdasarkan tahapan kerja: Antrean Masuk, Treatment Khusus (Suede, Leather, Canvas), Pengeringan, QC & Packaging, hingga Rak Siap Ambil.
            </p>
          </div>
        </div>

        {/* Architecture Specs Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101318] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Spesifikasi Arsitektur Software</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono">FRAMEWORK</span>
              <p className="text-xs font-bold text-white">Next.js 16 (App Router)</p>
              <p className="text-[11px] text-zinc-400">React 19 & Turbopack</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono">STYLING & DESIGN</span>
              <p className="text-xs font-bold text-white">Tailwind CSS v4</p>
              <p className="text-[11px] text-zinc-400">Tactical Dark Slate Palette</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono">DATA ADAPTER</span>
              <p className="text-xs font-bold text-white">Dual-Mode Repository</p>
              <p className="text-[11px] text-zinc-400">Client Storage Demo + Prisma DB</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] text-zinc-500 font-mono">PUBLIC PORTAL</span>
              <p className="text-xs font-bold text-white">No-Auth Live Tracking</p>
              <p className="text-[11px] text-zinc-400">Via QR Code & WhatsApp Link</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-6 text-center text-xs text-zinc-500 space-y-1">
        <p>
          {STORE_INFO.name} — Shoe Laundry & Care Management System
        </p>
        <p className="text-[11px] text-zinc-600">
          Dirancang untuk operasional toko cuci sepatu mandiri yang rapi, transparan, dan terstruktur.
        </p>
      </footer>
    </div>
  );
}
