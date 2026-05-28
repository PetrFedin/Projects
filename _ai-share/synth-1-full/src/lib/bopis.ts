/**
 * BOPIS (Buy Online Pick In Store) — самовывоз в РФ.
 * Инфраструктура под API: типы и эндпоинты. При подключении API — заменить mock на вызовы.
 * Связи: заказы, склады, ЭДО/Честный ЗНАК при выдаче, точки продаж.
 */

export type BopisOrderStatus =
  | 'created' // заказ создан
  | 'confirmed' // подтверждён, ожидает комплектации
  | 'ready' // готов к выдаче в точке
  | 'at_point' // доставлен в точку самовывоза
  | 'picked_up' // выдан клиенту
  | 'cancelled' // отменён
  | 'expired'; // не выдан в срок

/** Точка выдачи (магазин/ПВЗ) — РФ: адрес, часы, маркировка */
export interface BopisPickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  /** Часы работы для самовывоза */
  openingHours?: string;
  /** Поддержка маркировки (Честный ЗНАК) при выдаче */
  markingSupported: boolean;
  /** ЭДО: формирование документов при выдаче */
  edoOnPickup: boolean;
}

/** Заказ на самовывоз */
export interface BopisOrder {
  id: string;
  orderId: string; // исходный интернет-заказ
  pickupPointId: string;
  status: BopisOrderStatus;
  createdAt: string; // ISO
  readyAt?: string; // когда готов к выдаче
  pickedUpAt?: string;
  /** Срок хранения в точке (дней), РФ часто 3–7 */
  storageDays: number;
  /** Код выдачи для клиента (например последние 4 цифры заказа) */
  pickupCode?: string;
  /** КИЗ/маркировка: передача в Честный ЗНАК при выдаче */
  markingItems?: { gtin: string; serial?: string }[];
}

/** Эндпоинты для будущего API (без вызовов) */
export const BOPIS_API = {
  listOrders: '/api/v1/bopis/orders',
  getOrder: '/api/v1/bopis/orders/:id',
  listPickupPoints: '/api/v1/bopis/pickup-points',
  confirmReady: '/api/v1/bopis/orders/:id/ready',
  confirmPickup: '/api/v1/bopis/orders/:id/pickup',
  /** РФ: отчёт в ГИС МТ (Честный ЗНАК) при выдаче */
  reportPickupToGis: '/api/v1/bopis/orders/:id/report-pickup',
  /** ЭДО: документ передачи при выдаче */
  getHandoverDocument: '/api/v1/bopis/orders/:id/handover-document',
} as const;
