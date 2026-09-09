'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, PaymentStatus, ItemPhoto } from '@/types';
import { INITIAL_ORDERS } from '../mockData';

const STORAGE_KEY = 'sneakercare_orders_v1';
const STORE_EVENT = 'sneakercare_store_updated';

// Helper for localStorage
export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') {
    return INITIAL_ORDERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading from localStorage', e);
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event(STORE_EVENT));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export function getOrderByCode(orderCode: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find(o => o.orderCode.toLowerCase() === orderCode.toLowerCase());
}

export function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: Array<{
    shoeBrand: string;
    shoeModel: string;
    shoeColor: string;
    material: any;
    serviceName: string;
    price: number;
    initialNotes?: string;
    photos?: Array<{ photoType: 'BEFORE' | 'AFTER'; photoUrl: string; caption?: string }>;
  }>;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  isExpress: boolean;
  notes?: string;
  targetDate: string;
}): Order {
  const orders = getStoredOrders();
  
  // Format code e.g. CS-2609-007
  const count = orders.length + 1;
  const padNum = String(count).padStart(3, '0');
  const now = new Date();
  const yearMonth = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
  const orderCode = `CS-${yearMonth}-${padNum}`;
  const nowIso = now.toISOString();

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderCode,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerAddress: data.customerAddress,
    status: 'PENDING',
    paymentStatus: data.paymentStatus,
    totalAmount: data.totalAmount,
    paidAmount: data.paidAmount,
    isExpress: data.isExpress,
    notes: data.notes,
    entryDate: nowIso,
    targetDate: data.targetDate,
    items: data.items.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      shoeBrand: it.shoeBrand,
      shoeModel: it.shoeModel,
      shoeColor: it.shoeColor,
      material: it.material,
      serviceName: it.serviceName,
      price: it.price,
      initialNotes: it.initialNotes,
      photos: (it.photos || []).map((p, pIdx) => ({
        id: `ph-${Date.now()}-${pIdx}`,
        photoType: p.photoType,
        photoUrl: p.photoUrl,
        caption: p.caption,
        createdAt: nowIso,
      })),
    })),
    statusLogs: [
      {
        id: `log-${Date.now()}`,
        status: 'PENDING',
        notes: 'Pesanan baru dicatat di meja kasir POS',
        changedBy: 'Kasir',
        createdAt: nowIso,
      },
    ],
  };

  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string,
  changedBy: string = 'Teknisi Workshop'
): Order | null {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const current = orders[index];

  const newLog = {
    id: `log-${Date.now()}`,
    status: newStatus,
    notes: notes || `Status diubah ke ${newStatus}`,
    changedBy,
    createdAt: nowIso,
  };

  const updatedOrder: Order = {
    ...current,
    status: newStatus,
    completedDate: newStatus === 'COMPLETED' ? nowIso : current.completedDate,
    statusLogs: [...current.statusLogs, newLog],
  };

  orders[index] = updatedOrder;
  saveStoredOrders(orders);
  return updatedOrder;
}

export function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  paidAmount: number
): Order | null {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return null;

  const updatedOrder: Order = {
    ...orders[index],
    paymentStatus,
    paidAmount,
  };

  orders[index] = updatedOrder;
  saveStoredOrders(orders);
  return updatedOrder;
}

export function addPhotoToItem(
  orderId: string,
  itemId: string,
  photo: { photoType: 'BEFORE' | 'AFTER'; photoUrl: string; caption?: string }
): Order | null {
  const orders = getStoredOrders();
  const orderIdx = orders.findIndex(o => o.id === orderId);
  if (orderIdx === -1) return null;

  const currentOrder = orders[orderIdx];
  const itemIdx = currentOrder.items.findIndex(it => it.id === itemId);
  if (itemIdx === -1) return null;

  const newPhoto: ItemPhoto = {
    id: `ph-${Date.now()}`,
    photoType: photo.photoType,
    photoUrl: photo.photoUrl,
    caption: photo.caption,
    createdAt: new Date().toISOString(),
  };

  const updatedItems = [...currentOrder.items];
  updatedItems[itemIdx] = {
    ...updatedItems[itemIdx],
    photos: [...updatedItems[itemIdx].photos, newPhoto],
  };

  const updatedOrder: Order = {
    ...currentOrder,
    items: updatedItems,
  };

  orders[orderIdx] = updatedOrder;
  saveStoredOrders(orders);
  return updatedOrder;
}

export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  window.dispatchEvent(new Event(STORE_EVENT));
}

// React Hook for dynamic reactivity across views
export function useOrderStore() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(() => {
    setOrders(getStoredOrders());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refresh();

    const handleCustomUpdate = () => refresh();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };

    window.addEventListener(STORE_EVENT, handleCustomUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(STORE_EVENT, handleCustomUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refresh]);

  return {
    orders,
    isLoaded,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    addPhotoToItem,
    resetDemoData,
    refresh,
  };
}
