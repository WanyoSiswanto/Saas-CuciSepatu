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
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white select-none shadow-xs">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
                {STORE_INFO.name}
              </h1>
              <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                <span>Atelier Shoe Care</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Operasional Counter
          </div>

          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                } ${item.highlight && !isActive ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-blue-600'
                        : item.highlight
                        ? 'text-orange-500'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.href === '/dashboard/kanban' && activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-700 border border-blue-200">
                    {activeCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-5 px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Portal Pelanggan
          </div>

          <Link
            href="/track/CS-2609-001"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 hover:bg-blue-50/60 transition group border border-transparent hover:border-blue-100"
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-blue-500 group-hover:scale-110 transition" />
              <span>Cek Tracking Publik</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-blue-500" />
          </Link>
        </div>

        {/* Dual Mode Card & Reset Footer */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-blue-50/80 to-amber-50/40 border border-blue-100 space-y-2">
          <div className="flex items-center gap-1.5 text-blue-700 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Demo Mode</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Data tersimpan di browser Anda. Siap disambungkan ke PostgreSQL / Prisma saat produksi.
          </p>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition border border-slate-200/80 shadow-2xs"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Data Demo</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white border-r border-slate-200 flex flex-col z-10 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">{STORE_INFO.name}</h2>
                  <p className="text-[10px] text-blue-600 font-semibold">POS WORKSHOP</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-100 mt-4">
                <Link
                  href="/track/CS-2609-001"
                  target="_blank"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50"
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
        <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-100" />
              <span className="text-xs font-semibold text-slate-700">
                Outlet Jakarta Selatan — Workshop Buka
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/pos"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs shadow-orange-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">+ Input Order Baru</span>
            </Link>
          </div>
        </header>

        {/* Body Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#F8FAFC]">
          {children}
        </main>
      </div>

      {/* Reset Data Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Reset ke Data Demo Awal?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tindakan ini akan mengembalikan daftar pesanan dan foto ke contoh awal default (Jordan 1, NB 990, Samba, dll).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
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
