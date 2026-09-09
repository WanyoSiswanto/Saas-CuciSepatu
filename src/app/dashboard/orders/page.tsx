'use client';

import React, { useState } from 'react';
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
    // Search match
    const q = searchQuery.toLowerCase();
    const matchSearch =
      order.orderCode.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerPhone.includes(q) ||
      order.items.some(it =>
        `${it.shoeBrand} ${it.shoeModel}`.toLowerCase().includes(q)
      );

    if (!matchSearch) return false;

    // Status filter
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;

    // Payment filter
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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Daftar Seluruh Pesanan Workshop</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Database pesanan masuk, riwayat nota kasir, status pelunasan, dan akses langsung ke WhatsApp pelanggan.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#12151c] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode nota (CS-...), nama pelanggan, atau merk sepatu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Status Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
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
            className="px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Pembayaran</option>
            <option value="PAID">Lunas</option>
            <option value="DOWN_PAYMENT">DP</option>
            <option value="UNPAID">Belum Bayar</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-2xl bg-[#12151c] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101318] text-zinc-400 border-b border-white/[0.08] font-semibold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Kode Nota & Tgl</th>
                <th className="px-4 py-3.5">Pelanggan</th>
                <th className="px-4 py-3.5">Sepatu & Layanan</th>
                <th className="px-4 py-3.5">Status Pengerjaan</th>
                <th className="px-4 py-3.5">Pembayaran</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">
                    Tidak ditemukan pesanan yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const item = order.items[0];
                  const sisaBayar = order.totalAmount - order.paidAmount;

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition">
                      {/* Kode Nota & Tgl */}
                      <td className="px-4 py-3.5 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-white text-xs">
                            {order.orderCode}
                          </span>
                          {order.isExpress && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                              EXP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          {new Date(order.entryDate).toLocaleDateString('id-ID')}
                        </p>
                      </td>

                      {/* Pelanggan */}
                      <td className="px-4 py-3.5 space-y-0.5">
                        <p className="font-semibold text-white">{order.customerName}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">{order.customerPhone}</p>
                      </td>

                      {/* Sepatu & Layanan */}
                      <td className="px-4 py-3.5 space-y-0.5">
                        <p className="font-medium text-zinc-200">
                          {item?.shoeBrand} {item?.shoeModel}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {item?.serviceName} ({item?.material})
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Pembayaran */}
                      <td className="px-4 py-3.5 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <PaymentBadge
                            status={order.paymentStatus}
                            paidAmount={order.paidAmount}
                            totalAmount={order.totalAmount}
                          />
                          <span className="font-mono text-zinc-200 font-medium">
                            {formatRupiah(order.totalAmount)}
                          </span>
                        </div>
                        {sisaBayar > 0 && (
                          <button
                            onClick={() => setPaymentModalOrder(order)}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <span>Sisa {formatRupiah(sisaBayar)} (Lunasi)</span>
                          </button>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            title="Buka & Cetak Nota"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
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
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`/track/${order.orderCode}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Tracking Publik"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#13161c] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Konfirmasi Pelunasan Nota</span>
            </h3>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-white/5 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>No. Nota:</span>
                <span className="font-mono text-white">{paymentModalOrder.orderCode}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Pelanggan:</span>
                <span className="text-white">{paymentModalOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Total Tagihan:</span>
                <span className="font-mono text-white">{formatRupiah(paymentModalOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Sudah Masuk (DP):</span>
                <span className="font-mono text-zinc-300">{formatRupiah(paymentModalOrder.paidAmount)}</span>
              </div>
              <div className="pt-1.5 border-t border-white/10 flex justify-between font-bold text-amber-400">
                <span>Sisa yang Harus Dilunasi:</span>
                <span className="font-mono">{formatRupiah(paymentModalOrder.totalAmount - paymentModalOrder.paidAmount)}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Pastikan uang tunai atau bukti transfer QRIS sudah diterima kasir sebelum mengonfirmasi pelunasan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPaymentModalOrder(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white bg-white/5"
              >
                Batal
              </button>
              <button
                onClick={() => handleSettlePayment(paymentModalOrder)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500"
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
