'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Footprints,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  PlusCircle,
  ExternalLink,
  Kanban,
  MessageSquare,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { formatRupiah, formatDateIndo, generateReadyForPickupWhatsAppUrl } from '@/lib/whatsapp';
import { StatusBadge, PaymentBadge } from '@/components/ui/StatusBadge';
import { ReceiptModal } from '@/components/ui/ReceiptModal';
import { Order } from '@/types';

export default function DashboardOverviewPage() {
  const { orders } = useOrderStore();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Metrics
  const activeOrders = orders.filter(
    o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  );

  const readyForPickup = orders.filter(o => o.status === 'READY_FOR_PICKUP');

  const totalPaid = orders.reduce((acc, o) => acc + o.paidAmount, 0);

  const totalUnpaid = orders.reduce(
    (acc, o) => acc + (o.totalAmount - o.paidAmount),
    0
  );

  // Urgent Orders (Express or due today/overdue)
  const urgentOrders = activeOrders.filter(o => o.isExpress || new Date(o.targetDate) <= new Date());

  // Recent status logs across all orders
  const recentLogs = orders
    .flatMap(o =>
      o.statusLogs.map(log => ({
        ...log,
        orderCode: o.orderCode,
        customerName: o.customerName,
        shoeBrand: o.items[0]?.shoeBrand || 'Sepatu',
        shoeModel: o.items[0]?.shoeModel || '',
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>Ringkasan Workshop</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              Live Monitor
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Status antrean cucian, sepatu siap diambil, dan arus kas masuk hari ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/pos"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Terima Sepatu Masuk (POS)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sedang Dikerjakan */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Antrean & Proses</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">{activeOrders.length}</span>
            <span className="text-xs text-zinc-400">pasang sepatu</span>
          </div>
          <p className="text-[11px] text-zinc-500">Dalam tahapan cuci s.d. QC</p>
        </div>

        {/* Card 2: Siap Diambil */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Siap Diambil</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {readyForPickup.length}
            </span>
            <span className="text-xs text-zinc-400">menunggu pelanggan</span>
          </div>
          <p className="text-[11px] text-emerald-400/80">Lolos inspeksi Quality Control</p>
        </div>

        {/* Card 3: Kas Masuk */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Total Kas Diterima</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono">
              {formatRupiah(totalPaid)}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Akumulasi pelunasan & DP</p>
        </div>

        {/* Card 4: Piutang / Sisa Tagihan */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Belum Dilunasi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
              {formatRupiah(totalUnpaid)}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Dilunasi saat ambil sepatu</p>
        </div>
      </div>

      {/* Main Content: Urgent Queues + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent & Ready for Pickup Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Sepatu Siap Diambil */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white">Rak Siap Diambil ({readyForPickup.length})</h2>
              </div>
              <Link
                href="/dashboard/kanban"
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
              >
                <span>Buka Kanban</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {readyForPickup.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">
                Belum ada sepatu di rak siap diambil saat ini.
              </p>
            ) : (
              <div className="space-y-3">
                {readyForPickup.map(order => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-white">
                          {order.orderCode}
                        </span>
                        <span className="text-xs text-zinc-300 font-medium">
                          {order.customerName}
                        </span>
                        <PaymentBadge
                          status={order.paymentStatus}
                          paidAmount={order.paidAmount}
                          totalAmount={order.totalAmount}
                        />
                      </div>
                      <p className="text-xs text-zinc-400">
                        {order.items.map(it => `${it.shoeBrand} ${it.shoeModel}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Nota</span>
                      </button>
                      <button
                        onClick={() =>
                          window.open(generateReadyForPickupWhatsAppUrl(order), '_blank')
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Notif WA</span>
                      </button>
                      <Link
                        href={`/track/${order.orderCode}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                        title="Halaman Tracking Publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Prioritas & Express */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  Prioritas Pengerjaan & Express ({urgentOrders.length})
                </h2>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">DEADLINE DEKAT</span>
            </div>

            <div className="divide-y divide-white/5">
              {urgentOrders.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">
                  Tidak ada pesanan express atau mendesak hari ini.
                </p>
              ) : (
                urgentOrders.map(order => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-white">
                          {order.orderCode}
                        </span>
                        {order.isExpress && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            EXPRESS 1 HARI
                          </span>
                        )}
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-zinc-400">
                        {order.customerName} — {order.items[0]?.shoeBrand}{' '}
                        {order.items[0]?.shoeModel} ({order.items[0]?.serviceName})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-mono text-zinc-300">
                        Target: {new Date(order.targetDate).toLocaleDateString('id-ID')}
                      </p>
                      <Link
                        href="/dashboard/kanban"
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Pindahkan Status →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Status Timeline & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Nav Cards */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Akses Cepat Kasir & Workshop
            </h3>

            <Link
              href="/dashboard/pos"
              className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-300">Input Order Baru</h4>
                  <p className="text-[10px] text-zinc-400">Pencatatan sepatu, foto & nota</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/kanban"
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                  <Kanban className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Papan Kanban</h4>
                  <p className="text-[10px] text-zinc-400">Atur progres treatment & QC</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/orders"
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Semua Data Pesanan</h4>
                  <p className="text-[10px] text-zinc-400">Cari nota & filter status</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Activity Log Feed */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Log Aktivitas Terbaru
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">WORKSHOP REALTIME</span>
            </div>

            <div className="space-y-3">
              {recentLogs.map(log => (
                <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-white/5 last:border-none last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-semibold">{log.orderCode}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-[11px]">{log.notes || `Status: ${log.status}`}</p>
                  <p className="text-[10px] text-zinc-500">
                    Oleh <span className="text-zinc-400 font-medium">{log.changedBy || 'Sistem'}</span> • {log.shoeBrand} {log.shoeModel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        order={selectedReceiptOrder}
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />
    </div>
  );
}
