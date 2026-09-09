'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Kanban,
  Receipt,
  Search,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Sparkles,
  ArrowRight,
  Droplets,
  Star,
  Check,
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
              <span className="font-extrabold text-base tracking-tight text-slate-900 block">
                Nyo<span className="text-blue-600">Clean</span>
              </span>
              <span className="text-[10px] text-blue-600 font-bold font-mono">
                SHOE CARE ATELIER
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/track"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-xl hover:bg-blue-50 transition flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lacak Pesanan</span>
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

      {/* Hero Section: Editorial Split */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline & Live Search Box (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NyoClean Atelier • Perawatan Sepatu Higienis & Terstruktur</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Kembalikan Kilau Bersih <br />
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                Sepatu Kesayangan Anda
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
              Perawatan sepatu profesional dengan teknik khusus untuk bahan <em>Leather, Suede, Canvas,</em> hingga <em>Nubuck</em>. Dipantau transparan lewat foto sebelum/sesudah dan live tracking gratis.
            </p>

            {/* Dedicated Live Tracking Search Box */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-md max-w-xl text-left space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Cek Status Cucian Sepatu Anda</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Bebas Login
                </span>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ketik No. Nota (CS-...) atau No. WhatsApp"
                  value={trackQuery}
                  onChange={e => setTrackQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition shadow-inner"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Lacak</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Contoh Nota:</span>
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
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard/pos"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs tracking-wide uppercase transition shadow-md shadow-orange-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Input Kasir POS</span>
              </Link>

              <Link
                href="/dashboard/kanban"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition border border-slate-200 shadow-2xs"
              >
                <Kanban className="w-4 h-4 text-blue-600" />
                <span>Papan Kanban Workshop</span>
              </Link>
            </div>
          </div>

          {/* Right Column: High-End Floating Sneaker Showcase (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Ambient Water & Foam Glow Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/60 via-cyan-50/40 to-amber-50/30 rounded-full blur-3xl -z-10 scale-95" />

            {/* Main Showcase Container */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center group">
              {/* Isolated Floating Sneaker */}
              <div className="relative w-full h-full p-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-sneaker.png"
                  alt="NyoClean Pristine Clean Sneaker"
                  className="w-full h-full object-contain drop-shadow-2xl select-none pointer-events-none"
                  style={{
                    filter: 'drop-shadow(0 20px 30px rgba(37, 99, 235, 0.18))',
                  }}
                />
              </div>

              {/* Floating Pill Badge 1: Top Right (Lolos QC) */}
              <div className="absolute -top-2 right-2 sm:right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg px-3.5 py-2 rounded-2xl flex items-center gap-2 transition group-hover:-translate-y-1">
                <div className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xs">
                  ✓
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-extrabold text-slate-900">100% Deep Clean</p>
                  <p className="text-[10px] text-emerald-600 font-bold">Lolos Uji Quality Control</p>
                </div>
              </div>

              {/* Floating Pill Badge 2: Bottom Left (Bahan Sensitif) */}
              <div className="absolute -bottom-2 left-2 sm:left-4 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg px-3.5 py-2 rounded-2xl flex items-center gap-2 transition group-hover:translate-y-1">
                <div className="w-6 h-6 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-xs font-extrabold text-slate-900">Suede & Leather Care</p>
                  <p className="text-[10px] text-blue-600 font-bold">Formula Khusus Tanpa Rusak</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
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
