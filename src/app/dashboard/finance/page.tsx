'use client';

import React from 'react';
import {
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Sparkles,
  PieChart,
  Receipt,
  ArrowUpRight,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { formatRupiah, formatDateIndo } from '@/lib/whatsapp';
import { DEFAULT_SERVICES, STORE_INFO } from '@/lib/mockData';

export default function FinancePage() {
  const { orders } = useOrderStore();

  const totalPaid = orders.reduce((acc, o) => acc + o.paidAmount, 0);
  const totalUnpaid = orders.reduce((acc, o) => acc + (o.totalAmount - o.paidAmount), 0);
  const grossSales = totalPaid + totalUnpaid;
  const avgOrderValue = orders.length > 0 ? Math.round(grossSales / orders.length) : 0;

  // Unpaid Orders
  const unpaidOrders = orders.filter(o => o.totalAmount - o.paidAmount > 0);

  // Service distribution
  const serviceStats = DEFAULT_SERVICES.map(srv => {
    const matchingItems = orders.flatMap(o => o.items).filter(it => it.serviceName.includes(srv.name));
    const count = matchingItems.length;
    const revenue = matchingItems.reduce((sum, it) => sum + it.price, 0);
    return {
      ...srv,
      count,
      revenue,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const totalServicesCount = serviceStats.reduce((sum, s) => sum + s.count, 0) || 1;

  const handleSendReminderWA = (order: typeof unpaidOrders[0]) => {
    const sisa = order.totalAmount - order.paidAmount;
    const msg = `*PENGINGAT PEMBAYARAN & PENGAMBILAN — ${STORE_INFO.name}*
Halo Kak *${order.customerName}*, sepatu Anda No. Nota \`${order.orderCode}\` memiliki sisa tagihan sebesar *${formatRupiah(sisa)}*.

Jika sepatu sudah selesai atau saat pengambilan di workshop, pelunasan dapat dilakukan melalui Kasir (Cash / QRIS).

📍 Workshop: ${STORE_INFO.address}
Terima kasih Kak! 🙏`;

    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <CircleDollarSign className="w-5 h-5 text-teal-400" />
          <span>Laporan Kas Masuk & Performa Layanan</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Rekapitulasi pendapatan tunai/transfer, piutang pelanggan yang belum lunas, dan statistik paket layanan terlaris.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kas Masuk */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <span className="text-xs font-medium text-zinc-400">Total Kas Masuk (Real)</span>
          <p className="text-xl font-extrabold text-teal-400 font-mono">
            {formatRupiah(totalPaid)}
          </p>
          <p className="text-[11px] text-zinc-500">Uang tunai & QRIS yang sudah diterima</p>
        </div>

        {/* Piutang Belum Lunas */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <span className="text-xs font-medium text-zinc-400">Piutang Belum Lunas</span>
          <p className="text-xl font-extrabold text-amber-400 font-mono">
            {formatRupiah(totalUnpaid)}
          </p>
          <p className="text-[11px] text-zinc-500">{unpaidOrders.length} nota menunggu pelunasan</p>
        </div>

        {/* Estimasi Gross Omset */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <span className="text-xs font-medium text-zinc-400">Total Nilai Transaksi</span>
          <p className="text-xl font-extrabold text-white font-mono">
            {formatRupiah(grossSales)}
          </p>
          <p className="text-[11px] text-zinc-500">Dari {orders.length} total pesanan masuk</p>
        </div>

        {/* Average Order Value */}
        <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-2">
          <span className="text-xs font-medium text-zinc-400">Rata-rata per Nota (AOV)</span>
          <p className="text-xl font-extrabold text-purple-400 font-mono">
            {formatRupiah(avgOrderValue)}
          </p>
          <p className="text-[11px] text-zinc-500">Nilai rata-rata per transaksi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Unpaid Invoices Follow-up Table */}
        <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Daftar Tagihan Belum Lunas</h2>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">
              {unpaidOrders.length} Pelanggan
            </span>
          </div>

          <p className="text-xs text-zinc-400">
            Daftar pesanan dengan status DP atau Belum Bayar. Kasir dapat mengirim pengingat pelunasan via WhatsApp.
          </p>

          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto pr-1">
            {unpaidOrders.length === 0 ? (
              <p className="text-xs text-zinc-500 py-8 text-center">
                Semua pesanan telah lunas! Tidak ada piutang tertunggak.
              </p>
            ) : (
              unpaidOrders.map(order => {
                const sisa = order.totalAmount - order.paidAmount;
                return (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{order.orderCode}</span>
                        <span className="text-xs text-zinc-200 font-medium">{order.customerName}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {order.items[0]?.shoeBrand} {order.items[0]?.shoeModel}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        Total {formatRupiah(order.totalAmount)} • DP {formatRupiah(order.paidAmount)}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="font-mono text-xs font-bold text-amber-400">
                        Sisa {formatRupiah(sisa)}
                      </p>
                      <button
                        onClick={() => handleSendReminderWA(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-semibold transition border border-emerald-500/30"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Kirim WA</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Service Category Performance */}
        <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Breakdown Paket Layanan Terpopuler</h2>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            Sebaran kontribusi omset berdasarkan jenis treatment cuci dan restorasi sepatu.
          </p>

          <div className="space-y-3.5 pt-2">
            {serviceStats.map(srv => {
              const pct = Math.round((srv.count / totalServicesCount) * 100);
              return (
                <div key={srv.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-200">{srv.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-zinc-400">{srv.count} pasang</span>
                      <span className="text-emerald-400 font-semibold">{formatRupiah(srv.revenue)}</span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
