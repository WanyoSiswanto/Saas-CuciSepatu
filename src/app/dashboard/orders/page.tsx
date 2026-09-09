'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Search,
  Filter,
  MessageSquare,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Printer,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { formatRupiah, generateOrderReceiptWhatsAppUrl, generateReadyForPickupWhatsAppUrl } from '@/lib/whatsapp';
import { StatusBadge, PaymentBadge, STATUS_CONFIG } from '@/components/ui/StatusBadge';
import { ReceiptModal } from '@/components/ui/ReceiptModal';

export default function OrdersListPage() {
  const { orders, updatePaymentStatus } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Quick Payment Modal
  const [paymentModalOrder, setPaymentModalOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      order.orderCode.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      order.items.some(it =>
        `${it.shoeBrand} ${it.shoeModel}`.toLowerCase().includes(q)
      );

    if (!matchSearch) return false;

    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;

    if (paymentFilter !== 'ALL' && order.paymentStatus !== paymentFilter) return false;

    return true;
  });

  const handleSettlePayment = (order: Order) => {
    updatePaymentStatus(order.id, 'PAID', order.totalAmount);
    setPaymentModalOrder(null);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Daftar Seluruh Pesanan Workshop</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Database pesanan masuk, riwayat nota kasir, status pelunasan, dan akses langsung ke WhatsApp pelanggan.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode nota (CS-...), nama pelanggan, atau merk sepatu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition"
          />
        </div>

        {/* Status Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500"
          >
            <option value="ALL">Semua Status Pengerjaan</option>
            <option value="PENDING">Antrean Masuk</option>
            <option value="IN_TREATMENT">Proses Treatment</option>
            <option value="DRYING">Pengeringan</option>
            <option value="QC_PACKING">QC & Packing</option>
            <option value="READY_FOR_PICKUP">Siap Diambil</option>
            <option value="COMPLETED">Selesai</option>
          </select>

          <select
            value={paymentFilter}
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-500"
          >
            <option value="ALL">Semua Pembayaran</option>
            <option value="PAID">Lunas</option>
            <option value="DOWN_PAYMENT">DP</option>
            <option value="UNPAID">Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-extrabold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Kode Nota & Tgl</th>
                <th className="px-5 py-4">Pelanggan</th>
                <th className="px-5 py-4">Sepatu & Layanan</th>
                <th className="px-5 py-4">Status Pengerjaan</th>
                <th className="px-5 py-4">Pembayaran</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-medium">
                    Tidak ditemukan pesanan yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const item = order.items[0];
                  const sisaBayar = order.totalAmount - order.paidAmount;

                  return (
                    <tr key={order.id} className="hover:bg-blue-50/40 transition">
                      {/* Kode Nota & Tgl */}
                      <td className="px-5 py-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-slate-900 text-xs">
                            {order.orderCode}
                          </span>
                          {order.isExpress && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                              EXP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {new Date(order.entryDate).toLocaleDateString('id-ID')}
                        </p>
                      </td>

                      {/* Pelanggan */}
                      <td className="px-5 py-4 space-y-0.5">
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{order.customerPhone}</p>
                      </td>

                      {/* Sepatu & Layanan */}
                      <td className="px-5 py-4 space-y-0.5">
                        <p className="font-bold text-slate-800">
                          {item?.shoeBrand} {item?.shoeModel}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item?.serviceName} ({item?.material})
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Pembayaran */}
                      <td className="px-5 py-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <PaymentBadge
                            status={order.paymentStatus}
                            paidAmount={order.paidAmount}
                            totalAmount={order.totalAmount}
                          />
                          <span className="font-mono text-slate-800 font-bold">
                            {formatRupiah(order.totalAmount)}
                          </span>
                        </div>
                        {sisaBayar > 0 && (
                          <button
                            onClick={() => setPaymentModalOrder(order)}
                            className="text-[10px] text-amber-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>Sisa {formatRupiah(sisaBayar)} (Lunasi)</span>
                          </button>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            title="Buka & Cetak Nota"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              const url =
                                order.status === 'READY_FOR_PICKUP'
                                  ? generateReadyForPickupWhatsAppUrl(order)
                                  : generateOrderReceiptWhatsAppUrl(order);
                              window.open(url, '_blank');
                            }}
                            title="Kirim Nota via WhatsApp"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <a
                            href={`/track/${order.orderCode}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Tracking Publik"
                            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Payment Settle Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Konfirmasi Pelunasan Nota</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>No. Nota:</span>
                <span className="font-mono font-bold text-slate-900">{paymentModalOrder.orderCode}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pelanggan:</span>
                <span className="text-slate-900 font-bold">{paymentModalOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Tagihan:</span>
                <span className="font-mono font-bold text-slate-900">{formatRupiah(paymentModalOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sudah Masuk (DP):</span>
                <span className="font-mono text-slate-700">{formatRupiah(paymentModalOrder.paidAmount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-amber-700">
                <span>Sisa Tagihan:</span>
                <span className="font-mono text-sm">{formatRupiah(paymentModalOrder.totalAmount - paymentModalOrder.paidAmount)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pastikan uang tunai atau bukti transfer QRIS sudah diterima kasir sebelum mengonfirmasi pelunasan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPaymentModalOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => handleSettlePayment(paymentModalOrder)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
              >
                Konfirmasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        order={selectedReceiptOrder}
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />
    </div>
  );
}
