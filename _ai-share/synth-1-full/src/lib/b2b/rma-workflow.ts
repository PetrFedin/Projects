/**
 * RMA / Возвраты с workflow — рекламации, акты, списание, учёт.
 * OroCommerce-style.
 */

export type RmaStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'received'
  | 'refunded'
  | 'closed';

export type RmaType = 'return' | 'claim' | 'exchange';

export interface RmaItem {
  id: string;
  orderLineId?: string;
  productId: string;
  sku: string;
  qty: number;
  reason: string;
  condition?: 'new' | 'used' | 'defective';
}

export interface Rma {
  id: string;
  orderId: string;
  partnerId: string;
  partnerName: string;
  type: RmaType;
  status: RmaStatus;
  items: RmaItem[];
  totalAmount: number;
  currency: string;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'b2b_rma_v1';

const STATUS_LABELS: Record<RmaStatus, string> = {
  draft: 'Черновик',
  submitted: 'Отправлена',
  in_review: 'На проверке',
  approved: 'Одобрена',
  rejected: 'Отклонена',
  received: 'Получено',
  refunded: 'Возврат',
  closed: 'Закрыта',
};

const TYPE_LABELS: Record<RmaType, string> = {
  return: 'Возврат',
  claim: 'Рекламация',
  exchange: 'Обмен',
};

function load(): Rma[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Rma[]) : [];
  } catch {
    return [];
  }
}

function save(items: Rma[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getRmaList(): Rma[] {
  return load();
}

export function getRma(id: string): Rma | undefined {
  return load().find((r) => r.id === id);
}

export function getRmaStatusLabel(status: RmaStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function getRmaTypeLabel(type: RmaType): string {
  return TYPE_LABELS[type] ?? type;
}

export function getNextStatuses(current: RmaStatus): RmaStatus[] {
  const flow: Record<RmaStatus, RmaStatus[]> = {
    draft: ['submitted'],
    submitted: ['in_review', 'rejected'],
    in_review: ['approved', 'rejected'],
    approved: ['received'],
    rejected: ['closed'],
    received: ['refunded'],
    refunded: ['closed'],
    closed: [],
  };
  return flow[current] ?? [];
}
