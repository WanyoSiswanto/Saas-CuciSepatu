'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Footprints,
  Plus,
  Trash2,
  Camera,
  Upload,
  Sparkles,
  CheckCircle,
  Receipt,
  Calendar,
  AlertCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { DEFAULT_SERVICES } from '@/lib/mockData';
import { MaterialType, PaymentStatus, Order } from '@/types';
import { formatRupiah } from '@/lib/whatsapp';
import { ReceiptModal } from '@/components/ui/ReceiptModal';

const POPULAR_BRANDS = [
  'Nike',
  'Adidas',
  'New Balance',
  'Air Jordan',
  'Converse',
  'Vans',
  'Puma',
  'Asics',
  'Onitsuka Tiger',
  'Salomon',
  'Docmart (Dr. Martens)',
  'Lainnya',
];

const MATERIALS: { value: MaterialType; label: string; note: string }[] = [
  { value: 'CANVAS', label: 'Canvas / Kain', note: 'Aman dengan sabun standar' },
  { value: 'SUEDE', label: 'Suede', note: 'Hindari air berlebih & sikat kasar' },
  { value: 'LEATHER', label: 'Leather / Kulit', note: 'Perlu conditioner & balm' },
  { value: 'NUBUCK', label: 'Nubuck', note: 'Gunakan sikat karet krep khusus' },
  { value: 'MESH_KNIT', label: 'Mesh / Flyknit', note: 'Sikat lembut & pengeringan cepat' },
  { value: 'COMBINATION', label: 'Kombinasi Bahan', note: 'Perlu teknik multi-treatment' },
];

export default function POSPage() {
  const router = useRouter();
  const { createOrder } = useOrderStore();

  // Customer State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Item State
  const [shoeBrand, setShoeBrand] = useState('Nike');
  const [shoeModel, setShoeModel] = useState('');
  const [shoeColor, setShoeColor] = useState('');
  const [material, setMaterial] = useState<MaterialType>('LEATHER');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(['srv-2']);
  const [initialNotes, setInitialNotes] = useState('');
  const [isExpress, setIsExpress] = useState(false);

  // Photo State
  const [beforePhotoUrl, setBeforePhotoUrl] = useState<string>('');
  const [photoCaption, setPhotoCaption] = useState('Kondisi awal sepatu saat diterima di kasir');

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('UNPAID');
  const [customPaidAmount, setCustomPaidAmount] = useState<number>(0);

  // Completion / Modal State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate Price
  const servicesTotal = selectedServiceIds.reduce((sum, sId) => {
    const srv = DEFAULT_SERVICES.find(s => s.id === sId);
    return sum + (srv ? srv.basePrice : 0);
  }, 0);

  const expressFee = isExpress ? 25000 : 0;
  const grandTotal = servicesTotal + expressFee;

  // Handle Image Upload (File or Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforePhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseDemoPhoto = () => {
    setBeforePhotoUrl(
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80'
    );
    if (!shoeModel) setShoeModel('Air Jordan 1 High OG');
    if (!shoeColor) setShoeColor('Chicago (Red/White/Black)');
    if (!initialNotes) setInitialNotes('Terdapat bercak noda kecokelatan di samping sol dan lecet halus di toe cap.');
  };

  const handleServiceToggle = (serviceId: string) => {
    if (selectedServiceIds.includes(serviceId)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter(id => id !== serviceId));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, serviceId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Nama pelanggan wajib diisi.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Nomor WhatsApp pelanggan wajib diisi.');
      return;
    }
    if (!shoeModel.trim()) {
      setErrorMsg('Model/seri sepatu wajib diisi.');
      return;
    }
    if (selectedServiceIds.length === 0) {
      setErrorMsg('Pilih minimal 1 jenis layanan.');
      return;
    }

    // Determine target date
    const now = new Date();
    const estDays = isExpress ? 1 : 3;
    const targetDate = new Date(now.getTime() + estDays * 24 * 60 * 60 * 1000).toISOString();

    const selectedServiceNames = selectedServiceIds
      .map(id => DEFAULT_SERVICES.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(' + ');

    const paidAmount =
      paymentStatus === 'PAID'
        ? grandTotal
        : paymentStatus === 'DOWN_PAYMENT'
        ? Math.min(customPaidAmount, grandTotal)
        : 0;

    const newOrder = createOrder({
      customerName,
      customerPhone,
      customerAddress: customerAddress.trim() || undefined,
      isExpress,
      totalAmount: grandTotal,
      paidAmount,
      paymentStatus,
      targetDate,
      notes: initialNotes,
      items: [
        {
          shoeBrand,
          shoeModel,
          shoeColor: shoeColor || 'Standard',
          material,
          serviceName: selectedServiceNames,
          price: grandTotal,
          initialNotes: initialNotes || undefined,
          photos: beforePhotoUrl
            ? [
                {
                  photoType: 'BEFORE',
                  photoUrl: beforePhotoUrl,
                  caption: photoCaption,
                },
              ]
            : [],
        },
      ],
    });

    setCompletedOrder(newOrder);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Footprints className="w-5 h-5 text-emerald-400" />
            <span>Penerimaan Sepatu Masuk (POS Counter)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pencatatan data pelanggan, material sepatu, foto kondisi awal, dan cetak nota kasir.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseDemoPhoto}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 text-xs font-semibold border border-white/10 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Isi Contoh Otomatis</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* 1. Customer Information */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Informasi Pelanggan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Nama Lengkap Pelanggan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Nomor WhatsApp <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-zinc-500">Nota & link tracking dikirim ke nomor ini</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">
                Alamat / Kota (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Tebet, Jakarta Selatan"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 2. Shoe Specifications */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Identitas & Bahan Sepatu</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Brand Sepatu</label>
                <select
                  value={shoeBrand}
                  onChange={e => setShoeBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {POPULAR_BRANDS.map(brand => (
                    <option key={brand} value={brand} className="bg-zinc-900 text-white">
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-300">
                  Model / Seri Sepatu <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Air Jordan 1 High Chicago / Samba OG"
                  value={shoeModel}
                  onChange={e => setShoeModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Warna Sepatu</label>
              <input
                type="text"
                placeholder="Contoh: Red / White / Black"
                value={shoeColor}
                onChange={e => setShoeColor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Material Grid */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">
                Material Dominan (Menentukan Treatment & Sabun)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MATERIALS.map(m => (
                  <button
                    type="button"
                    key={m.value}
                    onClick={() => setMaterial(m.value)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      material === m.value
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm'
                        : 'bg-zinc-950/40 border-white/5 text-zinc-400 hover:border-white/15'
                    }`}
                  >
                    <p className="text-xs font-semibold">{m.label}</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{m.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Condition Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
                <span>Catatan Kondisi Awal & Kerusakan Bawaan</span>
                <span className="text-[10px] text-zinc-500">Penting untuk proteksi komplain</span>
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Sol menganga di sisi luar 2cm, noda minyak di lidah sepatu, baret di heel."
                value={initialNotes}
                onChange={e => setInitialNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 3. Foto Dokumentasi Kondisi Awal (Before Photo) */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Foto Kondisi Awal (Before)</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-medium">Bebas komplain kerusakan</span>
            </div>

            {beforePhotoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[16/9] max-h-60 bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beforePhotoUrl}
                  alt="Kondisi Awal"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setBeforePhotoUrl('')}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition"
                  title="Hapus foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 px-2.5 py-1 rounded text-xs text-white font-medium">
                  Foto Sebelum Dicuci (Tersimpan)
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="flex-1 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-xl cursor-pointer bg-zinc-950/40 hover:bg-zinc-950/80 transition group">
                  <Camera className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 mb-2 transition" />
                  <span className="text-xs font-medium text-zinc-300">Ambil Foto via Kamera / Galeri</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">JPG, PNG atau WebP</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleUseDemoPhoto}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Pakai Foto Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Service Package, Payment & Summary */}
        <div className="space-y-5">
          {/* Services Checklist */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                4
              </span>
              <span>Pilih Paket Layanan</span>
            </h2>

            <div className="space-y-2">
              {DEFAULT_SERVICES.map(srv => {
                const isSelected = selectedServiceIds.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleServiceToggle(srv.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition select-none ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40'
                        : 'bg-zinc-950/40 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-bold text-white">{srv.name}</span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-400">
                        {formatRupiah(srv.basePrice)}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 pl-6">{srv.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Express Toggle */}
            <div
              onClick={() => setIsExpress(!isExpress)}
              className={`p-3 rounded-xl border cursor-pointer transition select-none flex items-center justify-between ${
                isExpress
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : 'bg-zinc-950/40 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${isExpress ? 'text-amber-400' : 'text-zinc-500'}`} />
                <div>
                  <p className="text-xs font-bold text-white">Paket Express (1 Hari)</p>
                  <p className="text-[10px] text-zinc-400">Selesai besok sore</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-400">+Rp 25.000</span>
            </div>
          </div>

          {/* Payment & Ringkasan Biaya */}
          <div className="p-5 rounded-2xl bg-[#12151c] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                5
              </span>
              <span>Pembayaran & Kasir</span>
            </h2>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950/60 rounded-xl border border-white/5">
              {(['PAID', 'DOWN_PAYMENT', 'UNPAID'] as PaymentStatus[]).map(st => (
                <button
                  type="button"
                  key={st}
                  onClick={() => {
                    setPaymentStatus(st);
                    if (st === 'DOWN_PAYMENT' && customPaidAmount === 0) {
                      setCustomPaidAmount(Math.round(grandTotal / 2));
                    }
                  }}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition ${
                    paymentStatus === st
                      ? st === 'PAID'
                        ? 'bg-emerald-600 text-white shadow'
                        : st === 'DOWN_PAYMENT'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-rose-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st === 'PAID' ? 'Lunas' : st === 'DOWN_PAYMENT' ? 'DP' : 'Belum Bayar'}
                </button>
              ))}
            </div>

            {paymentStatus === 'DOWN_PAYMENT' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Nominal DP Diterima</label>
                <input
                  type="number"
                  value={customPaidAmount || ''}
                  onChange={e => setCustomPaidAmount(Number(e.target.value))}
                  placeholder="Nominal DP dalam Rupiah"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Summary Breakdown */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal Layanan</span>
                <span className="font-mono">{formatRupiah(servicesTotal)}</span>
              </div>
              {isExpress && (
                <div className="flex justify-between text-amber-400">
                  <span>Biaya Tambahan Express</span>
                  <span className="font-mono">+{formatRupiah(expressFee)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold text-white text-sm">
                <span>Total Tagihan:</span>
                <span className="text-emerald-400 font-mono text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>Simpan & Buat Nota Kasir</span>
            </button>
          </div>
        </div>
      </form>

      {/* Pop up Receipt Modal on Successful Order Creation */}
      <ReceiptModal
        order={completedOrder}
        isOpen={!!completedOrder}
        onClose={() => {
          setCompletedOrder(null);
          router.push('/dashboard/kanban');
        }}
      />
    </div>
  );
}
