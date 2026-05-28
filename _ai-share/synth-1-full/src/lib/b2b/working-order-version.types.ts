/**
 * Общие типы Working Order (клиент localStorage + серверный JSON).
 * Отдельный файл, чтобы `app/api` не импортировал модуль с `window`.
 */

export type WorkingOrderVersionStatus = 'draft' | 'pending_review' | 'confirmed' | 'rejected';

export interface WorkingOrderRow {
  Style?: string;
  SKU?: string;
  Color?: string;
  'Delivery Window'?: string;
  'Qty XS'?: string;
  'Qty S'?: string;
  'Qty M'?: string;
  'Qty L'?: string;
  'Qty XL'?: string;
  Total?: string;
  Price?: string;
  'Line Total'?: string;
  [key: string]: string | undefined;
}

export interface WorkingOrderVersion {
  id: string;
  createdAt: string;
  uploadedBy: string;
  uploadedByUserId?: string;
  fileName: string;
  rows: WorkingOrderRow[];
  status: WorkingOrderVersionStatus;
  wholesaleOrderId?: string;
  brandComment?: string;
  confirmedAt?: string;
  confirmedBy?: string;
}
