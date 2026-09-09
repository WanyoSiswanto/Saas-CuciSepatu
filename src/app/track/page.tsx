'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Footprints,
  ArrowRight,
  Phone,
  Receipt,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { STORE_INFO } from '@/lib/mockData';
import { StatusBadge, PaymentBadge } from '@/components/ui/StatusBadge';
import { formatRupiah } from '@/lib/whatsapp';
import { Order } from '@/types';

export default function TrackSearchPortal() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const [searchInput, setSearchInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<Order[]>([]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    setHasSearched(true);

    // Normalize phone numbers (remove symbols, leading 0 or 62)
    const cleanDigits = query.replace(/[^0-9]/g, '');

    const matches = orders.filter(o => {
      // 1. Check exact or partial order code (e.g. CS-2609-001 or 001)
      if (o.orderCode.toLowerCase().includes(query)) return true;

      // 2. Check customer phone number
      const orderPhoneDigits = o.customerPhone.replace(/[^0-9]/g, '');
      if (cleanDigits.length >= 4) {
        if (orderPhoneDigits.includes(cleanDigits) || cleanDigits.includes(orderPhoneDigits.slice(-8))) {
          return true;
        }
      }

      // 3. Check customer name
      if (o.customerName.toLowerCase().includes(query)) return true;

      return false;
    });

    setSearchResults(matches);

    // If exactly 1 match found and it matches an exact order code, jump directly to it
    if (matches.length === 1 && matches[0].orderCode.toLowerCase() === query) {
      router.push(`/track/${matches[0].orderCode}`);
    }
  };

  const handleQuickDemoCode = (code: string) => {
    setSearchInput(code);
    router.push(`/track/${code}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col selection:bg-blue-500/20 selection:text-blue-700">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 block group-hover:text-blue-600 transition">
                {STORE_INFO.name}
              </span>
              <span className="text-[10px] text-blue-600 font-bold font-mono">
                LIVE TRACKING PORTAL
              </span>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            Akses Kasir / Admin →
          </Link>
        </div>
      </header>

      {/* Main Search Experience */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Layanan Cek Status Cuci Sepatu 100% Gratis</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Lacak Status Sepatu Anda
          </h1>

          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Masukkan <strong>No. Nota</strong> atau <strong>No. WhatsApp</strong> Anda untuk melihat tahapan cuci dan foto sebelum/sesudah pengerjaan.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Contoh: CS-2609-001 atau 081234567890"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm tracking-wide uppercase transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status Sekarang</span>
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Contoh Kode Demo:</span>
            <button
              onClick={() => handleQuickDemoCode('CS-2609-001')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-mono font-bold transition border border-slate-200"
            >
              CS-2609-001 (Jordan 1)
            </button>
            <button
              onClick={() => handleQuickDemoCode('CS-2609-002')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-mono font-bold transition border border-slate-200"
            >
              CS-2609-002 (NB 990)
            </button>
            <button
              onClick={() => handleQuickDemoCode('CS-2609-004')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-mono font-bold transition border border-slate-200"
            >
              CS-2609-004 (Chuck 70)
            </button>
          </div>
        </div>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hasil Pencarian ({searchResults.length} Ditemukan)
              </h2>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Pesanan Tidak Ditemukan</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Tidak ada pesanan yang cocok dengan <strong className="text-slate-800">&quot;{searchInput}&quot;</strong>. Pastikan nomor nota atau nomor WhatsApp yang Anda masukkan sudah benar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map(order => {
                  const item = order.items[0];
                  return (
                    <Link
                      key={order.id}
                      href={`/track/${order.orderCode}`}
                      className="block p-5 rounded-3xl bg-white hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition group space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-blue-700 text-sm">
                            {order.orderCode}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-bold text-slate-900">
                            {order.customerName}
                          </span>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                        <div>
                          <p className="font-bold text-slate-800">
                            {item?.shoeBrand} {item?.shoeModel}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Layanan: {item?.serviceName} ({item?.material})
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-blue-600 font-bold group-hover:translate-x-1 transition">
                          <span>Buka Detail</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* How it works info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-900">Scan QR / Masukkan Kode</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cukup scan QR di struk atau ketik nomor WA Anda di kolom pencarian.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-900">Pantau Alur Treatment</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Lihat progres realtime apakah sepatu sedang dicuci, dikeringkan, atau masuk QC.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-900">Siap Diambil di Workshop</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dapatkan kepastian tanggal selesai sebelum Anda datang mengambil sepatu ke toko.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <p className="font-bold text-slate-700">{STORE_INFO.name} — Workshop Live Tracking</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{STORE_INFO.address}</p>
      </footer>
    </div>
  );
}
