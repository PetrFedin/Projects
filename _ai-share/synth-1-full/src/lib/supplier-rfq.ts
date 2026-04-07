/**
 * Supplier RFQ Engine — тендеры на ткань и фурнитуру.
 * Связь: Materials, поставщики, Tech Pack. РФ: рубль, ЭДО. Инфра под API.
 */

export type RfqStatus = 'draft' | 'sent' | 'quotes_received' | 'awarded' | 'cancelled';

export type RfqItemType = 'fabric' | 'trim' | 'packaging' | 'other';

export interface RfqItem {
  id: string;
  type: RfqItemType;
  description: string;
  quantity: number;
  unit: string;              // м, шт, кг
  techPackRef?: string;      // ссылка на Tech Pack
}

export interface RfqQuote {
  supplierId: string;
  supplierName: string;
  amountRub?: number;
  leadTimeDays?: number;
  validUntil?: string;       // ISO
}

export interface SupplierRfq {
  id: string;
  title: string;
  status: RfqStatus;
  items: RfqItem[];
  quotes: RfqQuote[];
  createdAt: string;
  sentAt?: string;
  awardedSupplierId?: string;
}

export const SUPPLIER_RFQ_API = {
  list: '/api/v1/suppliers/rfq',
  get: '/api/v1/suppliers/rfq/:id',
  create: '/api/v1/suppliers/rfq',
  send: '/api/v1/suppliers/rfq/:id/send',
  award: '/api/v1/suppliers/rfq/:id/award',
} as const;

/** Список RFQ. При API — GET SUPPLIER_RFQ_API.list */
export async function listRfq(): Promise<SupplierRfq[]> {
  await new Promise((r) => setTimeout(r, 200));
  const now = new Date().toISOString();
  return [
    {
      id: 'rfq1',
      title: 'Ткань основная FW26',
      status: 'quotes_received',
      items: [
        { id: 'i1', type: 'fabric', description: 'Шерсть 280 г/м²', quantity: 500, unit: 'м', techPackRef: 'TP-101' },
        { id: 'i2', type: 'trim', description: 'Пуговицы рог', quantity: 2000, unit: 'шт' },
      ],
      quotes: [
        { supplierId: 's1', supplierName: 'Текстиль Плюс', amountRub: 450_000, leadTimeDays: 21 },
        { supplierId: 's2', supplierName: 'Фурнитура Про', amountRub: 520_000, leadTimeDays: 14 },
      ],
      createdAt: now,
      sentAt: now,
    },
  ];
}
