import type { ProcessContext, ProcessInstance } from './types';

/** Мок: коллекции для contextKey=collectionId */
export const MOCK_COLLECTIONS: ProcessContext[] = [
  { id: 'col-fw26', type: 'collection', label: 'FW26', meta: { season: 'FW26' } },
  { id: 'col-ss27', type: 'collection', label: 'SS27', meta: { season: 'SS27' } },
  { id: 'col-fw27', type: 'collection', label: 'FW27', meta: { season: 'FW27' } },
  { id: 'col-outlet', type: 'collection', label: 'Outlet 2026', meta: { season: 'Outlet' } },
];

/** Мок: заказы для contextKey=orderId */
export const MOCK_ORDERS: ProcessContext[] = [
  { id: 'ord-1001', type: 'order', label: 'Заказ #1001 — Retailer A', meta: { retailer: 'Retailer A' } },
  { id: 'ord-1002', type: 'order', label: 'Заказ #1002 — Retailer B', meta: { retailer: 'Retailer B' } },
  { id: 'ord-1003', type: 'order', label: 'Заказ #1003 — Shop C', meta: { retailer: 'Shop C' } },
];

/** Мок: RFQ для contextKey=rfqId */
export const MOCK_RFQ: ProcessContext[] = [
  { id: 'rfq-201', type: 'rfq', label: 'RFQ-201 — Ткань летняя', meta: { material: 'fabric' } },
  { id: 'rfq-202', type: 'rfq', label: 'RFQ-202 — Фурнитура', meta: { material: 'hardware' } },
  { id: 'rfq-203', type: 'rfq', label: 'RFQ-203 — CMT фабрика', meta: { type: 'cmt' } },
];

/** Мок: отгрузки для contextKey=shipmentId. РФ: СДЭК, Боксберри, EMS. DHL/UPS — в archive. */
export const MOCK_SHIPMENTS: ProcessContext[] = [
  { id: 'ship-501', type: 'shipment', label: 'Отгрузка #501', meta: { carrier: 'СДЭК' } },
  { id: 'ship-502', type: 'shipment', label: 'Отгрузка #502', meta: { carrier: 'Боксберри' } },
];

/** Параллельные инстансы по типу процесса */
export const MOCK_INSTANCES: Record<string, ProcessInstance[]> = {
  production: [
    {
      id: 'inst-fw26',
      processId: 'production',
      contextId: 'col-fw26',
      context: MOCK_COLLECTIONS[0],
      createdAt: '2025-09-01T00:00:00Z',
    },
    {
      id: 'inst-ss27',
      processId: 'production',
      contextId: 'col-ss27',
      context: MOCK_COLLECTIONS[1],
      createdAt: '2025-12-01T00:00:00Z',
    },
    {
      id: 'inst-fw27',
      processId: 'production',
      contextId: 'col-fw27',
      context: MOCK_COLLECTIONS[2],
      createdAt: '2026-01-15T00:00:00Z',
    },
  ],
  b2b: [
    { id: 'inst-ord-1001', processId: 'b2b', contextId: 'ord-1001', context: MOCK_ORDERS[0], createdAt: '2026-02-01T00:00:00Z' },
    { id: 'inst-ord-1002', processId: 'b2b', contextId: 'ord-1002', context: MOCK_ORDERS[1], createdAt: '2026-02-05T00:00:00Z' },
  ],
  sourcing: [
    { id: 'inst-rfq-201', processId: 'sourcing', contextId: 'rfq-201', context: MOCK_RFQ[0], createdAt: '2026-01-20T00:00:00Z' },
    { id: 'inst-rfq-202', processId: 'sourcing', contextId: 'rfq-202', context: MOCK_RFQ[1], createdAt: '2026-01-25T00:00:00Z' },
  ],
};

export function getContextsByType(contextKey?: string): ProcessContext[] {
  switch (contextKey) {
    case 'collectionId':
      return MOCK_COLLECTIONS;
    case 'orderId':
      return MOCK_ORDERS;
    case 'rfqId':
      return MOCK_RFQ;
    case 'shipmentId':
      return MOCK_SHIPMENTS;
    default:
      return [...MOCK_COLLECTIONS, ...MOCK_ORDERS, ...MOCK_RFQ];
  }
}

export function getInstancesForProcess(processId: string): ProcessInstance[] {
  return MOCK_INSTANCES[processId] ?? [];
}
