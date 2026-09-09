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
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  IN_TREATMENT: {
    label: 'Proses Treatment',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    dot: 'bg-blue-400',
  },
  DRYING: {
    label: 'Pengeringan',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
    dot: 'bg-indigo-400',
  },
  QC_PACKING: {
    label: 'QC & Packing',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    dot: 'bg-purple-400',
  },
  READY_FOR_PICKUP: {
    label: 'Siap Diambil',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400 animate-pulse',
  },
  COMPLETED: {
    label: 'Selesai',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/20',
    dot: 'bg-zinc-500',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    dot: 'bg-rose-500',
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const conf = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${conf.bg} ${conf.text} ${conf.border} ${
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
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
        LUNAS
      </span>
    );
  }

  if (status === 'DOWN_PAYMENT') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-500/30">
        DP {Math.round((paidAmount / (totalAmount || 1)) * 100)}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-950/60 text-rose-300 border border-rose-500/30">
      BELUM BAYAR
    </span>
  );
}
