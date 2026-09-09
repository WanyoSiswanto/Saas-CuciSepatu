import { Order } from '@/types';
import { STORE_INFO } from './mockData';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Buat link WhatsApp pesan nota masuk & link tracking untuk pelanggan
 */
export function generateOrderReceiptWhatsAppUrl(order: Order, baseUrl?: string): string {
  const trackingHost = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://sneakercare.app');
  const trackingUrl = `${trackingHost}/track/${order.orderCode}`;

  const itemsList = order.items
    .map((item, idx) => `👟 *Sepatu #${idx + 1}:* ${item.shoeBrand} ${item.shoeModel} (${item.material})\n   - Layanan: ${item.serviceName}\n   - Biaya: ${formatRupiah(item.price)}`)
    .join('\n');

  const paymentStatusLabel = 
    order.paymentStatus === 'PAID' ? 'LUNAS (Terima Kasih)' :
    order.paymentStatus === 'DOWN_PAYMENT' ? `DP ${formatRupiah(order.paidAmount)} (Sisa: ${formatRupiah(order.totalAmount - order.paidAmount)})` :
    `BELUM DIBAYAR (${formatRupiah(order.totalAmount)})`;

  const message = `*NOTA DIGITAL — ${STORE_INFO.name}*
━━━━━━━━━━━━━━━━━━━━
Halo Kak *${order.customerName}*, terima kasih telah mempercayakan perawatan sepatu Anda di ${STORE_INFO.name}!

📋 *No. Nota:* \`${order.orderCode}\`
📅 *Tgl Masuk:* ${formatDateIndo(order.entryDate)}
🎯 *Estimasi Selesai:* ${formatDateIndo(order.targetDate)} ${order.isExpress ? '⚡ (EXPRESS)' : ''}

${itemsList}

━━━━━━━━━━━━━━━━━━━━
💵 *Total Tagihan:* *${formatRupiah(order.totalAmount)}*
💳 *Status Bayar:* ${paymentStatusLabel}

🔍 *Cek Status & Foto Sepatu Anda secara Realtime:*
👉 ${trackingUrl}

_Kami akan kirimkan notifikasi kembali begitu sepatu Anda siap diambil._
📍 ${STORE_INFO.address}
📞 CS: +${STORE_INFO.phone}`;

  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Buat link WhatsApp notifikasi sepatu sudah selesai & siap diambil
 */
export function generateReadyForPickupWhatsAppUrl(order: Order, baseUrl?: string): string {
  const trackingHost = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://sneakercare.app');
  const trackingUrl = `${trackingHost}/track/${order.orderCode}`;
  const sisaBayar = order.totalAmount - order.paidAmount;

  const message = `*SEPATU SIAP DIAMBIL — ${STORE_INFO.name}*
━━━━━━━━━━━━━━━━━━━━
Halo Kak *${order.customerName}*! Sepatu Anda dengan No. Nota \`${order.orderCode}\` sudah *SELESAI* dikerjakan, lolos Quality Control, dan siap diambil. ✨

${order.items.map(it => `👟 ${it.shoeBrand} ${it.shoeModel}`).join(', ')}

${sisaBayar > 0 ? `⚠️ *Sisa Pembayaran:* ${formatRupiah(sisaBayar)} (bisa dilunasi saat pengambilan via Cash/QRIS)` : `✅ *Pembayaran:* SUDAH LUNAS`}

📸 *Lihat Foto Hasil Cucian (Before / After):*
👉 ${trackingUrl}

📍 *Alamat Pengambilan:*
${STORE_INFO.address}
⏰ Jam Buka: ${STORE_INFO.operationalHours}

Ditunggu kedatangannya ya Kak!`;

  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
