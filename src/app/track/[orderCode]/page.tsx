'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Footprints,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';
import { getOrderByCode, getStoredOrders } from '@/lib/storage/orderStore';
import { STORE_INFO } from '@/lib/mockData';
import { NyoLogo } from '@/components/ui/NyoLogo';
import { formatRupiah, formatDateIndo } from '@/lib/whatsapp';
import { StatusBadge, PaymentBadge, STATUS_CONFIG } from '@/components/ui/StatusBadge';
import { PhotoComparison } from '@/components/ui/PhotoComparison';
import { Order, OrderStatus } from '@/types';

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING', label: 'Diterima di Kasir', desc: 'Sepatu masuk antrean pengerjaan' },
  { status: 'IN_TREATMENT', label: 'Proses Treatment', desc: 'Pencucian material & treatment khusus' },
  { status: 'DRYING', label: 'Pengeringan', desc: 'Sirkulasi udara stabil / UV box' },
  { status: 'QC_PACKING', label: 'QC & Packaging', desc: 'Inspeksi hasil & packaging steril' },
  { status: 'READY_FOR_PICKUP', label: 'Siap Diambil', desc: 'Sepatu siap diambil di workshop' },
  { status: 'COMPLETED', label: 'Selesai', desc: 'Sepatu sudah diserahkan ke pelanggan' },
];

export default function PublicTrackPage({ params }: { params: Promise<{ orderCode: string }> }) {
  const resolvedParams = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (resolvedParams?.orderCode) {
      const found = getOrderByCode(resolvedParams.orderCode);
      setOrder(found || null);
      setLoading(false);
    }
  }, [resolvedParams]);

  const handleSearchManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    const found = getOrderByCode(manualCode.trim());
    setOrder(found || null);
  };

  const getStepState = (stepStatus: OrderStatus, currentStatus: OrderStatus) => {
    const orderRanks: Record<OrderStatus, number> = {
      PENDING: 1,
      IN_TREATMENT: 2,
      DRYING: 3,
      QC_PACKING: 4,
      READY_FOR_PICKUP: 5,
      COMPLETED: 6,
      CANCELLED: 0,
    };

    const currentRank = orderRanks[currentStatus] || 1;
    const stepRank = orderRanks[stepStatus] || 1;

    if (currentRank > stepRank) return 'COMPLETED';
    if (currentRank === stepRank) return 'CURRENT';
    return 'UPCOMING';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Memuat status pengerjaan sepatu...</span>
        </div>
      </div>
    );
  }

  // Not found state
  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-bold text-slate-900">Pesanan Tidak Ditemukan</h1>
            <p className="text-xs text-slate-500">
              Kode nota <span className="font-mono font-bold text-amber-700">&quot;{resolvedParams?.orderCode}&quot;</span> belum terdaftar di sistem kami.
            </p>
          </div>

          <form onSubmit={handleSearchManual} className="space-y-2 pt-2">
            <input
              type="text"
              placeholder="Masukkan kode nota, contoh: CS-2609-001"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs text-center font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
            >
              Cek Status Nota
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <p>Atau coba cek kode pesanan demo:</p>
            <div className="flex items-center justify-center gap-2 font-mono font-bold text-blue-600">
              <Link href="/track/CS-2609-001" className="hover:underline">CS-2609-001</Link>
              <span>•</span>
              <Link href="/track/CS-2609-002" className="hover:underline">CS-2609-002</Link>
              <span>•</span>
              <Link href="/track/CS-2609-004" className="hover:underline">CS-2609-004</Link>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const firstItem = order.items[0];
  const sisaBayar = order.totalAmount - order.paidAmount;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Branding Header with Quick Return Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
            title="Kembali ke Dashboard"
          >
            <NyoLogo size="md" />
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                {STORE_INFO.name}
              </h2>
              <p className="text-[10px] text-blue-600 font-bold font-mono">LIVE TRACKING PORTAL</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-2xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Ke Dashboard</span>
            </Link>

            <a
              href={`https://wa.me/${STORE_INFO.phone}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Tanya CS</span>
            </a>
          </div>
        </div>

        {/* Status Highlight Banner */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                KODE PESANAN
              </span>
              <h1 className="text-xl font-mono font-extrabold text-slate-900">
                {order.orderCode}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                STATUS SAAT INI
              </span>
              <StatusBadge status={order.status} size="md" />
            </div>
          </div>

          {/* Customer & Shoe Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Pelanggan</span>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Sepatu</span>
              <p className="font-bold text-slate-900">
                {firstItem?.shoeBrand} {firstItem?.shoeModel}
              </p>
              <p className="text-[11px] text-slate-500">
                {firstItem?.serviceName} ({firstItem?.material})
              </p>
            </div>
          </div>

          {/* Target / Completed Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>
                Estimasi Selesai:{' '}
                <strong className="text-slate-900">
                  {new Date(order.targetDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  })}
                </strong>
              </span>
            </div>
            {order.isExpress && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                ⚡ EXPRESS 1 HARI
              </span>
            )}
          </div>
        </div>

        {/* Progress Tracker Timeline */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Alur Tahapan Pengerjaan
          </h3>

          <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {TIMELINE_STEPS.map((step, idx) => {
              const state = getStepState(step.status, order.status);
              const matchingLog = order.statusLogs.find(l => l.status === step.status);

              return (
                <div key={step.status} className="relative flex items-start gap-3 text-xs">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border ${
                      state === 'COMPLETED'
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : state === 'CURRENT'
                        ? 'bg-amber-400 border-amber-500 text-slate-950 ring-4 ring-amber-100 animate-pulse'
                        : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {state === 'COMPLETED' ? '✓' : idx + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold ${
                          state === 'CURRENT'
                            ? 'text-amber-700'
                            : state === 'COMPLETED'
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      {matchingLog && (
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          {new Date(matchingLog.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{step.desc}</p>
                    {matchingLog?.notes && (
                      <p className="text-[10px] text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100 mt-1">
                        &quot;{matchingLog.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Before / After Photo Comparison */}
        {firstItem && firstItem.photos.length > 0 && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Dokumentasi Kondisi Sepatu
              </h3>
              <span className="text-[10px] font-bold text-blue-600 font-mono bg-blue-50 px-2.5 py-0.5 rounded-full">
                VERIFIKASI HASIL
              </span>
            </div>

            <PhotoComparison
              photos={firstItem.photos}
              shoeBrand={firstItem.shoeBrand}
              shoeModel={firstItem.shoeModel}
            />
          </div>
        )}

        {/* Payment Summary */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Rincian Pembayaran
          </h3>

          <div className="space-y-2.5 text-xs divide-y divide-slate-100">
            <div className="flex justify-between text-slate-600 pt-1">
              <span>Total Biaya Layanan:</span>
              <span className="font-mono font-bold text-slate-900">{formatRupiah(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600 pt-2">
              <span>Sudah Dibayar (DP/Lunas):</span>
              <span className="font-mono font-bold text-slate-800">{formatRupiah(order.paidAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 items-baseline">
              <span className="font-bold text-slate-900">Sisa Tagihan:</span>
              <span
                className={`font-mono font-extrabold text-base ${
                  sisaBayar > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {sisaBayar > 0 ? formatRupiah(sisaBayar) : 'LUNAS'}
              </span>
            </div>
          </div>

          {sisaBayar > 0 && (
            <p className="text-[10px] text-slate-400 pt-1">
              * Pelunasan sisa tagihan dapat dilakukan saat mengambil sepatu di kasir (Cash / QRIS).
            </p>
          )}
        </div>

        {/* Store Address & Footer */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Lokasi Workshop & Pengambilan Sepatu:</span>
          </div>
          <p className="text-slate-600 pl-6 leading-relaxed">{STORE_INFO.address}</p>
          <div className="flex items-center gap-2 text-slate-500 pl-6 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{STORE_INFO.operationalHours}</span>
          </div>
        </div>

        {/* Bottom Navigation Shortcut */}
        <div className="text-center pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-bold text-xs border border-slate-200 shadow-2xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Workshop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
