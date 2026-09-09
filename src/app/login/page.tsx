'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Footprints,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { STORE_INFO } from '@/lib/mockData';
import { NyoLogo } from '@/components/ui/NyoLogo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const [pin, setPin] = useState('8888');
  const [role, setRole] = useState<'KASIR' | 'ADMIN'>('KASIR');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    // Set authentication session cookie for 7 days
    document.cookie = 'sneakercare_session=authenticated; path=/; max-age=604800; SameSite=Lax';

    setTimeout(() => {
      router.push(redirectTarget);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center items-center p-4 selection:bg-blue-500/20 selection:text-blue-700">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <NyoLogo size="lg" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal Kasir & Workshop
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Area khusus staf internal {STORE_INFO.name}.
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl space-y-5">
          {/* Uji Coba Demo Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-start gap-3 text-xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-blue-900">Mode Uji Coba Portofolio</p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Tekan tombol di bawah untuk langsung masuk dan menguji seluruh fitur operasional kasir.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Pilih Peran Akun</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('KASIR')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    role === 'KASIR'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kasir & Teknisi
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    role === 'ADMIN'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Owner / Admin
                </button>
              </div>
            </div>

            {/* PIN Input (Pre-filled for realism & convenience) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700">PIN Keamanan Kasir</label>
                <span className="text-[10px] text-slate-400 font-mono">PIN Demo: 8888</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono font-bold tracking-widest focus:outline-none focus:bg-white focus:border-blue-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* 1-Click Fast Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Memproses Masuk...</span>
              ) : (
                <>
                  <span>Masuk Sebagai {role} (1-Klik)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Separation explanation */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Pelanggan tidak dapat mengakses area ini dan diarahkan langsung ke pelacakan status pesanan.
            </p>
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buka Portal Pelacakan Customer</span>
            </Link>
          </div>
        </div>

        {/* Bottom Home Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-600 font-medium transition"
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <LoginForm />
    </Suspense>
  );
}
