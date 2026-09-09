'use client';

import React, { useState } from 'react';
import {
  Kanban as KanbanIcon,
  Sparkles,
  ArrowRight,
  Receipt,
  MessageSquare,
  Clock,
  CheckCircle,
  ExternalLink,
  Camera,
  X,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { Order, OrderStatus } from '@/types';
import { formatRupiah, generateReadyForPickupWhatsAppUrl } from '@/lib/whatsapp';
import { STATUS_CONFIG } from '@/components/ui/StatusBadge';
import { ReceiptModal } from '@/components/ui/ReceiptModal';
import { PhotoComparison } from '@/components/ui/PhotoComparison';

const KANBAN_COLUMNS: { status: OrderStatus; title: string; nextStatus?: OrderStatus; nextActionLabel?: string }[] = [
  {
    status: 'PENDING',
    title: 'Antrean Masuk',
    nextStatus: 'IN_TREATMENT',
    nextActionLabel: 'Mulai Treatment',
  },
  {
    status: 'IN_TREATMENT',
    title: 'Treatment & Cuci',
    nextStatus: 'DRYING',
    nextActionLabel: 'Keringkan',
  },
  {
    status: 'DRYING',
    title: 'Pengeringan',
    nextStatus: 'QC_PACKING',
    nextActionLabel: 'Masuk QC',
  },
  {
    status: 'QC_PACKING',
    title: 'QC & Packing',
    nextStatus: 'READY_FOR_PICKUP',
    nextActionLabel: 'Lolos QC (Siap Ambil)',
  },
  {
    status: 'READY_FOR_PICKUP',
    title: 'Siap Diambil',
    nextStatus: 'COMPLETED',
    nextActionLabel: 'Serahkan ke Pelanggan',
  },
  {
    status: 'COMPLETED',
    title: 'Selesai',
  },
];

export default function KanbanPage() {
  const { orders, updateOrderStatus, addPhotoToItem } = useOrderStore();
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [filterMaterial, setFilterMaterial] = useState<string>('ALL');

  // Photo upload state inside detail modal
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [afterPhotoCaption, setAfterPhotoCaption] = useState('Hasil akhir setelah dicuci & QC selesai');

  const filteredOrders = orders.filter(o => {
    if (filterMaterial === 'ALL') return true;
    return o.items.some(it => it.material === filterMaterial);
  });

  const handleAdvanceStatus = (order: Order, nextStatus: OrderStatus, label?: string) => {
    updateOrderStatus(
      order.id,
      nextStatus,
      `Tahapan pengerjaan dimajukan ke ${nextStatus} (${label || 'Teknisi'})`,
      'Teknisi Workshop'
    );
    if (detailOrder && detailOrder.id === order.id) {
      setDetailOrder({ ...detailOrder, status: nextStatus });
    }
  };

  const handleAddAfterPhoto = (order: Order) => {
    if (!afterPhotoUrl) return;
    const firstItem = order.items[0];
    if (!firstItem) return;

    addPhotoToItem(order.id, firstItem.id, {
      photoType: 'AFTER',
      photoUrl: afterPhotoUrl,
      caption: afterPhotoCaption,
    });
    setAfterPhotoUrl('');
    // refresh detail order
    const updated = orders.find(o => o.id === order.id);
    if (updated) setDetailOrder(updated);
  };

  const handleUseDemoAfterPhoto = () => {
    setAfterPhotoUrl(
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <KanbanIcon className="w-5 h-5 text-emerald-400" />
            <span>Alur Pengerjaan Workshop (Kanban Board)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pantau pergerakan sepatu dari antrean masuk, treatment pencucian, pengeringan, QC, hingga siap diambil.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Filter Bahan:</span>
          <select
            value={filterMaterial}
            onChange={e => setFilterMaterial(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#12151c] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Bahan</option>
            <option value="SUEDE">Suede</option>
            <option value="LEATHER">Leather</option>
            <option value="CANVAS">Canvas</option>
            <option value="COMBINATION">Kombinasi</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[calc(100vh-210px)]">
        {KANBAN_COLUMNS.map(col => {
          const colOrders = filteredOrders.filter(o => o.status === col.status);
          const conf = STATUS_CONFIG[col.status];

          return (
            <div
              key={col.status}
              className="flex flex-col w-80 shrink-0 rounded-2xl bg-[#101318] border border-white/[0.08] p-3 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                  <h3 className="text-xs font-bold text-white tracking-wide">{col.title}</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-300">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colOrders.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-zinc-600 text-[11px] border border-dashed border-white/5 rounded-xl">
                    Kosong
                  </div>
                ) : (
                  colOrders.map(order => {
                    const item = order.items[0];
                    const beforePhoto = item?.photos.find(p => p.photoType === 'BEFORE');
                    const afterPhoto = item?.photos.find(p => p.photoType === 'AFTER');

                    return (
                      <div
                        key={order.id}
                        className="p-3.5 rounded-xl bg-[#141820] hover:bg-[#181d26] border border-white/5 hover:border-white/15 transition-all shadow-sm space-y-3 cursor-pointer group"
                        onClick={() => setDetailOrder(order)}
                      >
                        {/* Card Header: Code & Badges */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-extrabold text-white">
                            {order.orderCode}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {order.isExpress && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                ⚡ EXPRESS
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                              {item?.material}
                            </span>
                          </div>
                        </div>

                        {/* Card Shoe Info */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-zinc-100 group-hover:text-emerald-300 transition">
                            {item?.shoeBrand} {item?.shoeModel}
                          </h4>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {item?.serviceName}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            Pelanggan: <span className="text-zinc-300 font-medium">{order.customerName}</span>
                          </p>
                        </div>

                        {/* Before/After Photo Thumbnails */}
                        {(beforePhoto || afterPhoto) && (
                          <div className="flex items-center gap-2 pt-1">
                            {beforePhoto && (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-zinc-950 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={beforePhoto.photoUrl}
                                  alt="Before"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center font-bold text-amber-300">
                                  BEF
                                </span>
                              </div>
                            )}
                            {afterPhoto && (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/40 bg-zinc-950 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={afterPhoto.photoUrl}
                                  alt="After"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-emerald-950/80 text-[8px] text-center font-bold text-emerald-300">
                                  AFT
                                </span>
                              </div>
                            )}
                            {item?.initialNotes && (
                              <p className="text-[10px] text-zinc-500 italic line-clamp-2 pl-1">
                                &quot;{item.initialNotes}&quot;
                              </p>
                            )}
                          </div>
                        )}

                        {/* Card Footer: Action Button */}
                        <div
                          className="pt-2 border-t border-white/5 flex items-center justify-between"
                          onClick={e => e.stopPropagation()}
                        >
                          <span className="text-[10px] font-mono text-zinc-400">
                            Est: {new Date(order.targetDate).toLocaleDateString('id-ID')}
                          </span>

                          {col.nextStatus ? (
                            <button
                              onClick={() => handleAdvanceStatus(order, col.nextStatus!, col.nextActionLabel)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-white text-[11px] font-semibold border border-emerald-500/30 transition"
                            >
                              <span>{col.nextActionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle className="w-3 h-3" />
                              <span>Selesai</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Photo Management Modal */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#13161c] border border-white/10 rounded-2xl p-6 my-8 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">{detailOrder.orderCode}</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {STATUS_CONFIG[detailOrder.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Pelanggan: <span className="text-white font-medium">{detailOrder.customerName}</span> (WA: {detailOrder.customerPhone})
                </p>
              </div>

              <button
                onClick={() => setDetailOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedReceiptOrder(detailOrder)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-200 border border-white/10 transition"
              >
                <Receipt className="w-4 h-4" />
                <span>Lihat Nota Kasir</span>
              </button>

              {detailOrder.status === 'READY_FOR_PICKUP' && (
                <button
                  onClick={() => window.open(generateReadyForPickupWhatsAppUrl(detailOrder), '_blank')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim WA Siap Ambil</span>
                </button>
              )}

              <a
                href={`/track/${detailOrder.orderCode}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-emerald-400 border border-emerald-500/20 transition ml-auto"
              >
                <span>Halaman Tracking Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Interactive Photo Comparison */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/5 space-y-3">
              <PhotoComparison
                photos={detailOrder.items[0]?.photos || []}
                shoeBrand={detailOrder.items[0]?.shoeBrand}
                shoeModel={detailOrder.items[0]?.shoeModel}
              />

              {/* Add After Photo Form (if after photo does not exist yet) */}
              {!detailOrder.items[0]?.photos.some(p => p.photoType === 'AFTER') && (
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>Unggah Foto Hasil Cucian (After Photo)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleUseDemoAfterPhoto}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Pakai Foto Demo Hasil Bersih</span>
                    </button>
                  </div>

                  {afterPhotoUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-500/40 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={afterPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={afterPhotoCaption}
                          onChange={e => setAfterPhotoCaption(e.target.value)}
                          placeholder="Catatan hasil pengerjaan..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddAfterPhoto(detailOrder)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400 transition"
                          >
                            Simpan Foto After
                          </button>
                          <button
                            onClick={() => setAfterPhotoUrl('')}
                            className="px-2 py-1 text-xs text-zinc-400 hover:text-white"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/15 hover:border-emerald-500/40 bg-white/[0.02] cursor-pointer text-xs text-zinc-400 hover:text-white transition">
                      <Camera className="w-4 h-4 text-zinc-500" />
                      <span>Pilih Foto dari Galeri / Kamera</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAfterPhotoUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Status Movement Bar */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Ubah Status Pengerjaan Cepat
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {KANBAN_COLUMNS.map(col => (
                  <button
                    key={col.status}
                    onClick={() => handleAdvanceStatus(detailOrder, col.status)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                      detailOrder.status === col.status
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Logs Timeline */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Riwayat Pengerjaan ({detailOrder.statusLogs.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs divide-y divide-white/5">
                {detailOrder.statusLogs.map((log, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-white font-medium">{log.notes || log.status}</p>
                      <p className="text-[10px] text-zinc-500">
                        Oleh {log.changedBy || 'Sistem'}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                      {new Date(log.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
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
