/**
 * ERP / 1С Integration — синхронизация заказов, остатков, финансов
 */

export type ErpProvider = '1c' | 'sap' | 'moysklad';

export interface ErpConnection {
  provider: ErpProvider;
  name: string;
  baseUrl?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
}

export interface ErpSyncRequest {
  provider: ErpProvider;
  scope: 'orders' | 'stock' | 'finance' | 'all';
  collectionIds?: string[];
}

export interface ErpSyncResult {
  success: boolean;
  scope: ErpSyncRequest['scope'];
  ordersSync?: { created: number; updated: number };
  stockSync?: { updated: number };
  financeSync?: { invoices: number };
  errors?: string[];
}

const PROVIDER_LABELS: Record<ErpProvider, string> = {
  '1c': '1С:Предприятие',
  sap: 'SAP',
  moysklad: 'МойСклад',
};

export function getErpProviderLabel(p: ErpProvider): string {
  return PROVIDER_LABELS[p] ?? p;
}
