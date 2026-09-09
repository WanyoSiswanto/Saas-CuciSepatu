import React from 'react';
import { OrderStatus, PaymentStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PENDING: {
    label: 'Antrean Masuk',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200/80',
    dot: 'bg-amber-500',
  },
  IN_TREATMENT: {
    label: 'Proses Treatment',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200/80',
    dot: 'bg-blue-500',
  },
  DRYING: {
    label: 'Pengeringan',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200/80',
    dot: 'bg-sky-500',
  },
  QC_PACKING: {
    label: 'QC & Packing',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200/80',
    dot: 'bg-orange-500',
  },
  READY_FOR_PICKUP: {
    label: 'Siap Diambil',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/80',
    dot: 'bg-emerald-500 animate-pulse',
  },
  COMPLETED: {
    label: 'Selesai',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const conf = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border shadow-xs ${conf.bg} ${conf.text} ${conf.border} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`} />
      {conf.label}
    </span>
  );
}

export function PaymentBadge({
  status,
  paidAmount = 0,
  totalAmount = 0,
}: {
  status: PaymentStatus;
  paidAmount?: number;
  totalAmount?: number;
}) {
  if (status === 'PAID') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        LUNAS
      </span>
    );
  }

  if (status === 'DOWN_PAYMENT') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        DP {Math.round((paidAmount / (totalAmount || 1)) * 100)}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
      BELUM BAYAR
    </span>
  );
}
