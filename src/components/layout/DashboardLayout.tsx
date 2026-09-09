'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Kanban,
  Receipt,
  CircleDollarSign,
  Search,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  Footprints,
} from 'lucide-react';
import { useOrderStore } from '@/lib/storage/orderStore';
import { STORE_INFO } from '@/lib/mockData';

const NAV_ITEMS = [
  { label: 'Ringkasan Toko', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Kasir & Input POS', href: '/dashboard/pos', icon: PlusCircle, highlight: true },
  { label: 'Kanban Pengerjaan', href: '/dashboard/kanban', icon: Kanban },
  { label: 'Semua Pesanan', href: '/dashboard/orders', icon: Receipt },
  { label: 'Laporan Keuangan', href: '/dashboard/finance', icon: CircleDollarSign },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resetDemoData, orders } = useOrderStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeCount = orders.filter(
    o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
  ).length;

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0d11]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/[0.08] bg-[#101318] select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.08]">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wider text-white">
                {STORE_INFO.name}
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono">WORKSHOP POS v1.0</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Manajemen Operasional
          </div>

          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm border border-white/10 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                } ${item.highlight ? 'text-emerald-400 hover:text-emerald-300' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.href === '/dashboard/kanban' && activeCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {activeCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Layanan Pelanggan
          </div>

          <Link
            href="/track/CS-2609-001"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/[0.05] transition group border border-transparent hover:border-emerald-500/20"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400" />
              <span>Cek Tracking Publik</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
          </Link>
        </div>

        {/* Dual Mode Indicator & Reset Footer */}
        <div className="p-3 m-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Mode</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            Data tersimpan di browser Anda. Siap disambungkan ke PostgreSQL / Prisma saat produksi.
          </p>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition border border-white/5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data Demo</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#101318] border-r border-white/10 flex flex-col z-10 p-5">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">{STORE_INFO.name}</h2>
                  <p className="text-[10px] text-zinc-500">POS KASIR</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-white/10 mt-4">
                <Link
                  href="/track/CS-2609-001"
                  target="_blank"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-emerald-400"
                >
                  <span>Lihat Tracking Publik</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar Header */}
        <header className="h-14 border-b border-white/[0.08] bg-[#101318]/70 backdrop-blur-md flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-zinc-300">
                Outlet Jakarta Selatan — Shift Aktif
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-400 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Input Order Baru</span>
            </Link>
          </div>
        </header>

        {/* Body Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#0b0d11]">
          {children}
        </main>
      </div>

      {/* Reset Data Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#14171e] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Reset ke Data Demo Awal?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tindakan ini akan mengembalikan daftar pesanan dan foto ke contoh awal default (Jordan 1, NB 990, Samba, dll).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white bg-white/5"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
