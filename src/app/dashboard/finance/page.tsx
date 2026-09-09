'use client';

import React from 'react';
import Link from 'next/link';
import {
  CircleDollarSign,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Sparkles,
  PieChart,
  Receipt,
  ArrowUpRight,
  ArrowLeft,
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
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-2 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
          <span>Kembali ke Dashboard</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <CircleDollarSign className="w-6 h-6 text-blue-600" />
          <span>Laporan Kas Masuk & Performa Layanan</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Rekapitulasi pendapatan tunai/transfer, piutang pelanggan yang belum lunas, dan statistik paket layanan terlaris.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kas Masuk */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-600">Total Kas Masuk (Real)</span>
          <p className="text-2xl font-extrabold text-blue-700 font-mono">
            {formatRupiah(totalPaid)}
          </p>
          <p className="text-[11px] text-slate-400">Uang tunai & QRIS yang sudah diterima</p>
        </div>

        {/* Piutang Belum Lunas */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-600">Piutang Belum Lunas</span>
          <p className="text-2xl font-extrabold text-amber-600 font-mono">
            {formatRupiah(totalUnpaid)}
          </p>
          <p className="text-[11px] text-slate-400">{unpaidOrders.length} nota menunggu pelunasan</p>
        </div>

        {/* Estimasi Gross Omset */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-600">Total Nilai Transaksi</span>
          <p className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatRupiah(grossSales)}
          </p>
          <p className="text-[11px] text-slate-400">Dari {orders.length} total pesanan masuk</p>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-600">Rata-rata per Nota (AOV)</span>
          <p className="text-2xl font-extrabold text-orange-600 font-mono">
            {formatRupiah(avgOrderValue)}
          </p>
          <p className="text-[11px] text-slate-400">Nilai rata-rata per transaksi</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Unpaid Invoices Follow-up Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Daftar Tagihan Belum Lunas</h2>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {unpaidOrders.length} Pelanggan
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Daftar pesanan dengan status DP atau Belum Bayar. Kasir dapat mengirim pengingat pelunasan via WhatsApp.
          </p>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {unpaidOrders.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center font-medium">
                Semua pesanan telah lunas! Tidak ada piutang tertunggak.
              </p>
            ) : (
              unpaidOrders.map(order => {
                const sisa = order.totalAmount - order.paidAmount;
                return (
                  <div key={order.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-slate-900">{order.orderCode}</span>
                        <span className="text-xs text-slate-800 font-bold">{order.customerName}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {order.items[0]?.shoeBrand} {order.items[0]?.shoeModel}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Total {formatRupiah(order.totalAmount)} • DP {formatRupiah(order.paidAmount)}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="font-mono text-xs font-extrabold text-amber-700">
                        Sisa {formatRupiah(sisa)}
                      </p>
                      <button
                        onClick={() => handleSendReminderWA(order)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition border border-emerald-200 shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Breakdown Paket Layanan Terpopuler</h2>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Sebaran kontribusi omset berdasarkan jenis treatment cuci dan restorasi sepatu.
          </p>

          <div className="space-y-4 pt-2">
            {serviceStats.map(srv => {
              const pct = Math.round((srv.count / totalServicesCount) * 100);
              return (
                <div key={srv.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{srv.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500">{srv.count} pasang</span>
                      <span className="text-blue-700 font-extrabold">{formatRupiah(srv.revenue)}</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-full transition-all"
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
