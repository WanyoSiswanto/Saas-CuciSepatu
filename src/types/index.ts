export type OrderStatus = 
  | 'PENDING'          // Antrean Masuk
  | 'IN_TREATMENT'     // Proses Pencucian / Treatment
  | 'DRYING'           // Pengeringan
  | 'QC_PACKING'       // Quality Check & Packing
  | 'READY_FOR_PICKUP' // Siap Diambil
  | 'COMPLETED'        // Selesai Diambil
  | 'CANCELLED';       // Dibatalkan

export type PaymentStatus = 'UNPAID' | 'DOWN_PAYMENT' | 'PAID';

export type MaterialType = 
  | 'CANVAS' 
  | 'SUEDE' 
  | 'LEATHER' 
  | 'NUBUCK' 
  | 'MESH_KNIT' 
  | 'COMBINATION' 
  | 'RUBBER';

export interface ItemPhoto {
  id: string;
  photoType: 'BEFORE' | 'AFTER';
  photoUrl: string;
  caption?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  shoeBrand: string;
  shoeModel: string;
  shoeColor: string;
  material: MaterialType;
  serviceName: string;
  serviceId?: string;
  price: number;
  initialNotes?: string;
  photos: ItemPhoto[];
}

export interface StatusLog {
  id: string;
  status: OrderStatus;
  notes?: string;
  changedBy?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. CS-2609-001
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  isExpress: boolean;
  notes?: string;
  entryDate: string;
  targetDate: string;
  completedDate?: string;
  items: OrderItem[];
  statusLogs: StatusLog[];
}

export interface ServicePrice {
  id: string;
  name: string;
  category: 'CLEANING' | 'RESTORATION' | 'PROTECTION';
  description: string;
  basePrice: number;
  estDays: number;
}
