'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Footprints,
  PlusCircle,
  Kanban,
  Receipt,
  Search,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Sparkles,
  ArrowRight,
  Database,
  Phone,
} from 'lucide-react';
import { STORE_INFO } from '@/lib/mockData';
import { NyoLogo } from '@/components/ui/NyoLogo';

export default function HomePage() {
  const router = useRouter();
  const [trackQuery, setTrackQuery] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackQuery.trim();
    if (!q) return;

    if (q.toUpperCase().startsWith('CS-')) {
      router.push(`/track/${q.toUpperCase()}`);
    } else {
      router.push(`/track?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-blue-500/20 selection:text-blue-700">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <NyoLogo size="md" />
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 block">
                Nyo<span className="text-blue-600">Clean</span>
              </span>
              <span className="text-[10px] text-blue-600 font-bold font-mono">
                SHOE CARE ATELIER
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition"
            >
              Lacak Pesanan
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              Dashboard Kasir
            </Link>
            <Link
              href="/dashboard/pos"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs transition shadow-xs shadow-orange-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buka POS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Kasir Workshop & Live Tracking Pelanggan 100% Gratis</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Perawatan Sepatu Profesional <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              NyoClean Shoe Laundry & Care
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Pantau status pengerjaan sepatu Anda secara transparan. Dari antrean cuci, pengeringan, hingga lolos QC siap diambil di toko.
          </p>

          {/* Dedicated Live Tracking Search Box */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-lg max-w-xl mx-auto text-left space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-blue-600" />
                <span>Lacak Status Cucian Sepatu Anda</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Bebas Login
              </span>
            </div>

            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Ketik No. Nota (CS-...) atau No. WhatsApp"
                value={trackQuery}
                onChange={e => setTrackQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
              >
                <span>Lacak</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span className="font-medium">Coba cek nota:</span>
              <button
                type="button"
                onClick={() => router.push('/track/CS-2609-001')}
                className="font-mono font-bold text-blue-600 hover:underline"
              >
                CS-2609-001
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => router.push('/track/CS-2609-002')}
                className="font-mono font-bold text-blue-600 hover:underline"
              >
                CS-2609-002
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => router.push('/track/CS-2609-004')}
                className="font-mono font-bold text-blue-600 hover:underline"
              >
                CS-2609-004
              </button>
            </div>
          </div>

          {/* Quick Workshop Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wide uppercase transition shadow-md shadow-orange-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Order Baru (POS)</span>
            </Link>

            <Link
              href="/dashboard/kanban"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition border border-slate-200 shadow-2xs"
            >
              <Kanban className="w-4 h-4 text-blue-600" />
              <span>Papan Kanban Workshop</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <span>Dashboard Admin</span>
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
            <h3 className="text-base font-extrabold text-slate-900">Nota Struk Thermal & QR Code Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Format struk fisik standar 58mm/80mm siap cetak ke printer Bluetooth kasir, lengkap dengan QR Code tracking unik dan link bebas biaya.
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
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p className="font-bold text-slate-700">
          {STORE_INFO.name} — Shoe Laundry & Care Management System
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {STORE_INFO.address} • Jam Buka: {STORE_INFO.operationalHours}
        </p>
      </footer>
    </div>
  );
}
