'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Order } from '@/types';
import { STORE_INFO } from '@/lib/mockData';
import { formatRupiah, formatDateIndo, generateOrderReceiptWhatsAppUrl } from '@/lib/whatsapp';
import { Printer, Share2, Copy, Check, ExternalLink, X } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReceiptModal({ order, isOpen, onClose }: ReceiptModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order && typeof window !== 'undefined') {
      const trackingUrl = `${window.location.origin}/track/${order.orderCode}`;
      QRCode.toDataURL(trackingUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error('Error generating QR', err));
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const url = generateOrderReceiptWhatsAppUrl(order);
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/track/${order.orderCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sisaBayar = order.totalAmount - order.paidAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#13161c] border border-white/10 rounded-2xl shadow-2xl p-6 my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Nota Digital & Cetak Thermal</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {order.orderCode}
              </span>
            </h3>
            <p className="text-xs text-zinc-400">Siap cetak ke printer 58mm/80mm atau dikirim via WhatsApp</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim WhatsApp</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition border border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
          </button>
        </div>

        {/* Thermal Receipt Paper Container */}
        <div className="flex justify-center p-3 bg-zinc-950/60 rounded-xl border border-white/5">
          <div
            id="thermal-receipt"
            className="w-[300px] bg-white text-black p-5 rounded font-mono text-[11px] leading-relaxed shadow-lg select-text"
          >
            {/* Receipt Header */}
            <div className="text-center space-y-1">
              <h2 className="text-sm font-extrabold tracking-wider">{STORE_INFO.name}</h2>
              <p className="text-[10px] text-zinc-600">{STORE_INFO.tagline}</p>
              <p className="text-[9px] text-zinc-600">{STORE_INFO.address}</p>
              <p className="text-[9px] text-zinc-600">WA: +{STORE_INFO.phone}</p>
            </div>

            <div className="my-3 border-t border-dashed border-black/40" />

            {/* Receipt Metadata */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>NO. NOTA:</span>
                <span className="font-bold">{order.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span>TGL MASUK:</span>
                <span>{new Date(order.entryDate).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>EST. SELESAI:</span>
                <span className="font-bold">{new Date(order.targetDate).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>PELANGGAN:</span>
                <span className="font-bold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>NO. HP/WA:</span>
                <span>{order.customerPhone}</span>
              </div>
              {order.isExpress && (
                <div className="bg-black text-white text-center py-0.5 px-1 font-bold text-[10px] my-1">
                  *** LAYANAN EXPRESS 1 HARI ***
                </div>
              )}
            </div>

            <div className="my-3 border-t border-dashed border-black/40" />

            {/* Items List */}
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={item.id} className="space-y-0.5">
                  <div className="flex justify-between font-bold">
                    <span>
                      {idx + 1}. {item.shoeBrand} {item.shoeModel}
                    </span>
                    <span>{formatRupiah(item.price)}</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 flex justify-between pl-3">
                    <span>Layanan: {item.serviceName}</span>
                    <span>({item.material})</span>
                  </div>
                  {item.initialNotes && (
                    <div className="text-[9px] italic text-zinc-500 pl-3">
                      Catatan: {item.initialNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="my-3 border-t border-dashed border-black/40" />

            {/* Totals */}
            <div className="space-y-1 font-semibold">
              <div className="flex justify-between text-xs font-bold">
                <span>TOTAL TAGIHAN:</span>
                <span>{formatRupiah(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>TERBAYAR (DP):</span>
                <span>{formatRupiah(order.paidAmount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>SISA TAGIHAN:</span>
                <span className={sisaBayar > 0 ? 'font-bold' : ''}>
                  {sisaBayar > 0 ? formatRupiah(sisaBayar) : 'LUNAS'}
                </span>
              </div>
            </div>

            <div className="my-3 border-t border-dashed border-black/40" />

            {/* QR Code & Tracking Info */}
            <div className="text-center space-y-1">
              <p className="text-[9px] font-bold">SCAN QR UNTUK CEK STATUS SEPATU</p>
              {qrCodeUrl && (
                <div className="flex justify-center my-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeUrl} alt="QR Code Tracking" className="w-24 h-24 border border-zinc-200" />
                </div>
              )}
              <p className="text-[8px] text-zinc-600">Simpan nota ini sebagai bukti sah pengambilan sepatu.</p>
              <p className="text-[8px] font-bold mt-2">TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
            </div>
          </div>
        </div>

        {/* Footer Link to Public Page */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <a
            href={`/track/${order.orderCode}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition underline underline-offset-4"
          >
            <span>Buka Tampilan Pelanggan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
