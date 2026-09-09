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
} from 'lucide-react';
import { getOrderByCode, getStoredOrders } from '@/lib/storage/orderStore';
import { STORE_INFO } from '@/lib/mockData';
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
      <div className="min-h-screen bg-[#0b0d11] text-white flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-zinc-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Memuat status pengerjaan sepatu...</span>
        </div>
      </div>
    );
  }

  // Not found state
  if (!order) {
    return (
      <div className="min-h-screen bg-[#0b0d11] text-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#12151c] border border-white/10 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-base font-bold text-white">Pesanan Tidak Ditemukan</h1>
            <p className="text-xs text-zinc-400">
              Kode nota <span className="font-mono text-amber-300">&quot;{resolvedParams?.orderCode}&quot;</span> belum terdaftar di sistem kami.
            </p>
          </div>

          <form onSubmit={handleSearchManual} className="space-y-2 pt-2">
            <input
              type="text"
              placeholder="Masukkan kode nota, contoh: CS-2609-001"
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition"
            >
              Cek Status Nota
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 space-y-1.5 text-[11px] text-zinc-400">
            <p>Atau coba cek kode pesanan demo:</p>
            <div className="flex items-center justify-center gap-2 font-mono text-emerald-400">
              <Link href="/track/CS-2609-001" className="hover:underline">CS-2609-001</Link>
              <span>•</span>
              <Link href="/track/CS-2609-002" className="hover:underline">CS-2609-002</Link>
              <span>•</span>
              <Link href="/track/CS-2609-004" className="hover:underline">CS-2609-004</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstItem = order.items[0];
  const sisaBayar = order.totalAmount - order.paidAmount;

  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#f8f9fa] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Branding Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wider text-white">
                {STORE_INFO.name}
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono">LIVE TRACKING PORTAL</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${STORE_INFO.phone}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Tanya CS</span>
          </a>
        </div>

        {/* Status Highlight Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#141822] to-[#101318] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                KODE PESANAN
              </span>
              <h1 className="text-lg font-mono font-extrabold text-white">
                {order.orderCode}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                STATUS SAAT INI
              </span>
              <StatusBadge status={order.status} size="md" />
            </div>
          </div>

          {/* Customer & Shoe Summary */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-zinc-500 text-[10px]">Pelanggan</span>
              <p className="font-semibold text-white">{order.customerName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-zinc-500 text-[10px]">Sepatu</span>
              <p className="font-semibold text-white">
                {firstItem?.shoeBrand} {firstItem?.shoeModel}
              </p>
              <p className="text-[11px] text-zinc-400">
                {firstItem?.serviceName} ({firstItem?.material})
              </p>
            </div>
          </div>

          {/* Target / Completed Indicator */}
          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>
                Estimasi Selesai:{' '}
                <strong className="text-white">
                  {new Date(order.targetDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  })}
                </strong>
              </span>
            </div>
            {order.isExpress && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⚡ EXPRESS 1 HARI
              </span>
            )}
          </div>
        </div>

        {/* Progress Tracker Timeline */}
        <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Alur Tahapan Pengerjaan
          </h3>

          <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {TIMELINE_STEPS.map((step, idx) => {
              const state = getStepState(step.status, order.status);
              const matchingLog = order.statusLogs.find(l => l.status === step.status);

              return (
                <div key={step.status} className="relative flex items-start gap-3 text-xs">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                      state === 'COMPLETED'
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : state === 'CURRENT'
                        ? 'bg-amber-500 border-amber-400 text-zinc-950 animate-pulse'
                        : 'bg-zinc-900 border-white/20 text-zinc-600'
                    }`}
                  >
                    {state === 'COMPLETED' ? '✓' : idx + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          state === 'CURRENT'
                            ? 'text-amber-400 font-bold'
                            : state === 'COMPLETED'
                            ? 'text-white'
                            : 'text-zinc-500'
                        }`}
                      >
                        {step.label}
                      </span>
                      {matchingLog && (
                        <span className="text-[10px] font-mono text-zinc-500">
                          {new Date(matchingLog.createdAt).toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400">{step.desc}</p>
                    {matchingLog?.notes && (
                      <p className="text-[10px] text-zinc-500 italic bg-white/[0.02] p-1.5 rounded mt-1">
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
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Dokumentasi Kondisi Sepatu
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">VERIFIKASI WORKSHOP</span>
            </div>

            <PhotoComparison
              photos={firstItem.photos}
              shoeBrand={firstItem.shoeBrand}
              shoeModel={firstItem.shoeModel}
            />
          </div>
        )}

        {/* Payment Summary */}
        <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Rincian Pembayaran
          </h3>

          <div className="space-y-2 text-xs divide-y divide-white/5">
            <div className="flex justify-between text-zinc-400 pt-1">
              <span>Total Biaya Layanan:</span>
              <span className="font-mono text-white">{formatRupiah(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-zinc-400 pt-2">
              <span>Sudah Dibayar (DP/Lunas):</span>
              <span className="font-mono text-zinc-300">{formatRupiah(order.paidAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 items-baseline">
              <span className="font-bold text-white">Sisa Tagihan:</span>
              <span
                className={`font-mono font-extrabold text-sm ${
                  sisaBayar > 0 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {sisaBayar > 0 ? formatRupiah(sisaBayar) : 'LUNAS'}
              </span>
            </div>
          </div>

          {sisaBayar > 0 && (
            <p className="text-[10px] text-zinc-500 pt-1">
              * Pelunasan sisa tagihan dapat dilakukan saat mengambil sepatu di kasir (Cash / QRIS).
            </p>
          )}
        </div>

        {/* Store Address & Footer */}
        <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-3 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Lokasi Workshop & Pengambilan Sepatu:</span>
          </div>
          <p className="text-zinc-400 pl-6">{STORE_INFO.address}</p>
          <div className="flex items-center gap-2 text-zinc-400 pl-6 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{STORE_INFO.operationalHours}</span>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/dashboard"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            Masuk ke Dashboard Kasir / Admin →
          </Link>
        </div>
      </div>
    </div>
  );
}
