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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <KanbanIcon className="w-6 h-6 text-blue-600" />
            <span>Alur Pengerjaan Workshop (Kanban Board)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau pergerakan sepatu dari antrean masuk, treatment pencucian, pengeringan, QC, hingga siap diambil.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Bahan:</span>
          <select
            value={filterMaterial}
            onChange={e => setFilterMaterial(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-2xs"
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
              className="flex flex-col w-80 shrink-0 rounded-3xl bg-slate-100/70 border border-slate-200/80 p-3.5 space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${conf.dot}`} />
                  <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">{col.title}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colOrders.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl font-medium">
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
                        className="p-4 rounded-2xl bg-white hover:bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all shadow-xs space-y-3 cursor-pointer group"
                        onClick={() => setDetailOrder(order)}
                      >
                        {/* Card Header: Code & Badges */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-extrabold text-slate-900">
                            {order.orderCode}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {order.isExpress && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200">
                                ⚡ EXP
                              </span>
                            )}
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {item?.material}
                            </span>
                          </div>
                        </div>

                        {/* Card Shoe Info */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {item?.shoeBrand} {item?.shoeModel}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item?.serviceName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Pelanggan: <span className="text-slate-700 font-bold">{order.customerName}</span>
                          </p>
                        </div>

                        {/* Before/After Photo Thumbnails */}
                        {(beforePhoto || afterPhoto) && (
                          <div className="flex items-center gap-2 pt-1">
                            {beforePhoto && (
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={beforePhoto.photoUrl}
                                  alt="Before"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-[8px] text-center font-bold text-white">
                                  BEF
                                </span>
                              </div>
                            )}
                            {afterPhoto && (
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-blue-300 bg-slate-100 shrink-0 shadow-2xs">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={afterPhoto.photoUrl}
                                  alt="After"
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-blue-600 text-[8px] text-center font-bold text-white">
                                  AFT
                                </span>
                              </div>
                            )}
                            {item?.initialNotes && (
                              <p className="text-[10px] text-slate-500 italic line-clamp-2 pl-1">
                                &quot;{item.initialNotes}&quot;
                              </p>
                            )}
                          </div>
                        )}

                        {/* Card Footer: Action Button */}
                        <div
                          className="pt-2.5 border-t border-slate-100 flex items-center justify-between"
                          onClick={e => e.stopPropagation()}
                        >
                          <span className="text-[10px] font-mono font-medium text-slate-500">
                            Est: {new Date(order.targetDate).toLocaleDateString('id-ID')}
                          </span>

                          {col.nextStatus ? (
                            <button
                              onClick={() => handleAdvanceStatus(order, col.nextStatus!, col.nextActionLabel)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-[11px] font-bold border border-blue-200 transition shadow-2xs"
                            >
                              <span>{col.nextActionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 my-8 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-slate-900 font-mono">{detailOrder.orderCode}</h3>
                  <span className="text-xs px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                    {STATUS_CONFIG[detailOrder.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Pelanggan: <span className="text-slate-900 font-bold">{detailOrder.customerName}</span> (WA: {detailOrder.customerPhone})
                </p>
              </div>

              <button
                onClick={() => setDetailOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedReceiptOrder(detailOrder)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 transition"
              >
                <Receipt className="w-4 h-4 text-slate-500" />
                <span>Lihat Nota Kasir</span>
              </button>

              {detailOrder.status === 'READY_FOR_PICKUP' && (
                <button
                  onClick={() => window.open(generateReadyForPickupWhatsAppUrl(detailOrder), '_blank')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim WA Siap Ambil</span>
                </button>
              )}

              <a
                href={`/track/${detailOrder.orderCode}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 border border-blue-200 transition ml-auto"
              >
                <span>Halaman Tracking Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Interactive Photo Comparison */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <PhotoComparison
                photos={detailOrder.items[0]?.photos || []}
                shoeBrand={detailOrder.items[0]?.shoeBrand}
                shoeModel={detailOrder.items[0]?.shoeModel}
              />

              {/* Add After Photo Form (if after photo does not exist yet) */}
              {!detailOrder.items[0]?.photos.some(p => p.photoType === 'AFTER') && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <span>Unggah Foto Hasil Cucian (After Photo)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={handleUseDemoAfterPhoto}
                      className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pakai Foto Demo Hasil Bersih</span>
                    </button>
                  </div>

                  {afterPhotoUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-blue-300 shrink-0 shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={afterPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={afterPhotoCaption}
                          onChange={e => setAfterPhotoCaption(e.target.value)}
                          placeholder="Catatan hasil pengerjaan..."
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddAfterPhoto(detailOrder)}
                            className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                          >
                            Simpan Foto After
                          </button>
                          <button
                            onClick={() => setAfterPhotoUrl('')}
                            className="px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-slate-300 hover:border-blue-400 bg-white cursor-pointer text-xs font-semibold text-slate-600 hover:text-slate-900 transition">
                      <Camera className="w-4 h-4 text-slate-400" />
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
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ubah Status Pengerjaan Cepat
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {KANBAN_COLUMNS.map(col => (
                  <button
                    key={col.status}
                    onClick={() => handleAdvanceStatus(detailOrder, col.status)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition ${
                      detailOrder.status === col.status
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Logs Timeline */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Riwayat Pengerjaan ({detailOrder.statusLogs.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-xs divide-y divide-slate-100">
                {detailOrder.statusLogs.map((log, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-slate-900 font-bold">{log.notes || log.status}</p>
                      <p className="text-[10px] text-slate-500">
                        Oleh {log.changedBy || 'Sistem'}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
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
