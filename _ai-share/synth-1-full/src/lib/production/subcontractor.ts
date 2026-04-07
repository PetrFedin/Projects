/**
 * Subcontractor Hub — учёт работ, переданных на сторону (аутсорс).
 * Связь: Production, поставщики, финансы. РФ: договоры, акты. Инфра под API.
 */

export type SubcontractWorkStatus = 'requested' | 'in_progress' | 'completed' | 'cancelled';

export type SubcontractWorkType = 'cutting' | 'sewing' | 'finishing' | 'packaging' | 'other';

export interface SubcontractOrder {
  id: string;
  subcontractorId: string;
  subcontractorName: string;
  orderId: string;           // основной заказ/PO
  workType: SubcontractWorkType;
  workTypeLabel: string;      // "Пошив", "Раскрой"
  quantity: number;
  unit?: string;              // шт, кг
  status: SubcontractWorkStatus;
  requestedAt: string;       // ISO
  completedAt?: string;
  /** Сумма (руб) при API */
  amountRub?: number;
  actNumber?: string;        // номер акта выполненных работ
}

export const SUBCONTRACTOR_API = {
  list: '/api/v1/production/subcontractor/orders',
  get: '/api/v1/production/subcontractor/orders/:id',
  create: '/api/v1/production/subcontractor/orders',
  updateStatus: '/api/v1/production/subcontractor/orders/:id/status',
} as const;
