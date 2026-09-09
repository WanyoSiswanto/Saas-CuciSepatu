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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Ringkasan Workshop</span>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              Live Monitor
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Status antrean cucian, sepatu siap diambil, dan arus kas masuk hari ini.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/pos"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition shadow-md shadow-orange-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Terima Sepatu Masuk (POS)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sedang Dikerjakan */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Antrean & Proses</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-700 font-mono">{activeOrders.length}</span>
            <span className="text-xs text-slate-500 font-medium">pasang sepatu</span>
          </div>
          <p className="text-[11px] text-slate-400">Dalam tahapan cuci s.d. QC</p>
        </div>

        {/* Card 2: Siap Diambil */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Siap Diambil</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">
              {readyForPickup.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">menunggu pelanggan</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Lolos inspeksi Quality Control</p>
        </div>

        {/* Card 3: Kas Masuk */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Total Kas Diterima</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
              {formatRupiah(totalPaid)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Akumulasi pelunasan & DP</p>
        </div>

        {/* Card 4: Piutang / Sisa Tagihan */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-slate-600">Belum Dilunasi</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-amber-600 font-mono">
              {formatRupiah(totalUnpaid)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Dilunasi saat ambil sepatu</p>
        </div>
      </div>

      {/* Main Content: Urgent Queues + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent & Ready for Pickup Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Sepatu Siap Diambil */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">Rak Siap Diambil ({readyForPickup.length})</h2>
              </div>
              <Link
                href="/dashboard/kanban"
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold"
              >
                <span>Buka Kanban</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {readyForPickup.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada sepatu di rak siap diambil saat ini.
              </p>
            ) : (
              <div className="space-y-3">
                {readyForPickup.map(order => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-extrabold text-slate-900">
                          {order.orderCode}
                        </span>
                        <span className="text-xs text-slate-700 font-bold">
                          {order.customerName}
                        </span>
                        <PaymentBadge
                          status={order.paymentStatus}
                          paidAmount={order.paidAmount}
                          totalAmount={order.totalAmount}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {order.items.map(it => `${it.shoeBrand} ${it.shoeModel}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 shadow-2xs"
                      >
                        <Receipt className="w-3.5 h-3.5 text-slate-500" />
                        <span>Nota</span>
                      </button>
                      <button
                        onClick={() =>
                          window.open(generateReadyForPickupWhatsAppUrl(order), '_blank')
                        }
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Notif WA</span>
                      </button>
                      <Link
                        href={`/track/${order.orderCode}`}
                        target="_blank"
                        className="p-2 rounded-xl bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 transition border border-slate-200 shadow-2xs"
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
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Prioritas Pengerjaan & Express ({urgentOrders.length})
                </h2>
              </div>
              <span className="text-[11px] text-amber-700 font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                DEADLINE DEKAT
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {urgentOrders.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Tidak ada pesanan express atau mendesak hari ini.
                </p>
              ) : (
                urgentOrders.map(order => (
                  <div key={order.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {order.orderCode}
                        </span>
                        {order.isExpress && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                            ⚡ EXPRESS
                          </span>
                        )}
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-slate-600">
                        {order.customerName} — {order.items[0]?.shoeBrand}{' '}
                        {order.items[0]?.shoeModel} ({order.items[0]?.serviceName})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-mono font-semibold text-slate-700">
                        Target: {new Date(order.targetDate).toLocaleDateString('id-ID')}
                      </p>
                      <Link
                        href="/dashboard/kanban"
                        className="text-[11px] text-blue-600 font-bold hover:underline"
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

        {/* Right 1 Col: Quick Actions & Activity Log */}
        <div className="space-y-6">
          {/* Quick Nav Cards */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Akses Cepat Kasir & Workshop
            </h3>

            <Link
              href="/dashboard/pos"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200/80 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
                  +
                </div>
                <div>
                  <h4 className="text-xs font-bold text-orange-950">Input Order Baru</h4>
                  <p className="text-[10px] text-orange-700">Pencatatan sepatu, foto & nota</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-orange-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/kanban"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-100 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Kanban className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Papan Kanban</h4>
                  <p className="text-[10px] text-slate-500">Atur progres treatment & QC</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition" />
            </Link>

            <Link
              href="/dashboard/orders"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Semua Data Pesanan</h4>
                  <p className="text-[10px] text-slate-500">Cari nota & filter status</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Activity Log Feed */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Log Aktivitas Terbaru
              </h3>
              <span className="text-[10px] font-mono font-bold text-blue-600">REALTIME</span>
            </div>

            <div className="space-y-3">
              {recentLogs.map(log => (
                <div key={log.id} className="text-xs space-y-1 pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-blue-600 font-bold">{log.orderCode}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 text-[11px] font-medium">{log.notes || `Status: ${log.status}`}</p>
                  <p className="text-[10px] text-slate-400">
                    Oleh <span className="text-slate-600 font-semibold">{log.changedBy || 'Sistem'}</span> • {log.shoeBrand} {log.shoeModel}
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
