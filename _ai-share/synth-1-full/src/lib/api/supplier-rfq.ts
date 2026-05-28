/**
 * API-слой Supplier RFQ по контракту SUPPLIER_RFQ_API.
 * Пока бэкенд не подключён — возвращаем моки.
 */

import { get } from './client';
import { SUPPLIER_RFQ_API } from '@/lib/supplier-rfq';
import type { SupplierRfq } from '@/lib/supplier-rfq';

const MOCK_RFQ_LIST: SupplierRfq[] = [
  {
    id: 'rfq1',
    title: 'Ткань основная SS26',
    status: 'quotes_received',
    items: [
      {
        id: 'i1',
        type: 'fabric',
        description: 'Хлопок сатин 120 г/м²',
        quantity: 2000,
        unit: 'м',
        techPackRef: 'TP-9921',
      },
      { id: 'i2', type: 'trim', description: 'Пуговицы 18мм', quantity: 5000, unit: 'шт' },
    ],
    quotes: [
      { supplierId: 'sup1', supplierName: 'Текстиль Плюс', amountRub: 340_000, leadTimeDays: 14 },
      { supplierId: 'sup2', supplierName: 'Фабрика тканей', amountRub: 318_000, leadTimeDays: 21 },
    ],
    createdAt: '2026-03-01T10:00:00Z',
    sentAt: '2026-03-02T09:00:00Z',
  },
];

export async function listRfq(): Promise<SupplierRfq[]> {
  try {
    return await get<SupplierRfq[]>(SUPPLIER_RFQ_API.list);
  } catch {
    return MOCK_RFQ_LIST;
  }
}

export async function getRfq(id: string): Promise<SupplierRfq | null> {
  try {
    return await get<SupplierRfq>(SUPPLIER_RFQ_API.get.replace(':id', id));
  } catch {
    return MOCK_RFQ_LIST.find((r) => r.id === id) ?? MOCK_RFQ_LIST[0] ?? null;
  }
}
