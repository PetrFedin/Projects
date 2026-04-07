/**
 * Трекинг заказа и прозрачность поставки.
 * JOOR/FashioNexus: статусы отгрузки (подтверждён → в производстве → отгружен → в пути → доставлен),
 * даты отгрузки/доставки, трек-номер, этапы для байера.
 */

export type ShipmentStageId = 'picked' | 'handed_to_carrier' | 'in_transit' | 'delivered';

export interface ShipmentStage {
  id: ShipmentStageId;
  label: string;
  date: string | null;
  done: boolean;
  current?: boolean;
}

export interface OrderShipmentTracking {
  /** Дата отгрузки со склада бренда */
  shipDate: string | null;
  /** Ожидаемая дата доставки */
  estimatedDelivery: string | null;
  /** Трек-номер (мок: при интеграции — от перевозчика) */
  trackNumber: string | null;
  /** Курьер/перевозчик */
  carrier: string;
  /** Этапы: Собран / Передан в доставку / В пути / Доставлен */
  stages: ShipmentStage[];
  /** Заказ отгружен (есть дата отгрузки или этап «В пути»/«Доставлен») */
  isShipped: boolean;
}

const DEFAULT_STAGES: ShipmentStage[] = [
  { id: 'picked', label: 'Собран', date: '2024-09-08', done: true },
  { id: 'handed_to_carrier', label: 'Передан в доставку', date: '2024-09-10', done: true },
  { id: 'in_transit', label: 'В пути', date: null, done: false, current: true },
  { id: 'delivered', label: 'Доставлен', date: null, done: false },
];

/** Мок: трекинг отгрузки по заказу. В проде — API /orders/:id/shipment или ASN. */
export function getOrderShipmentTracking(orderId: string): OrderShipmentTracking {
  const shippedOrders = ['B2B-0012', 'B2B-0011'];
  const isShipped = shippedOrders.includes(orderId);
  const shipDate = isShipped ? '2024-09-10' : null;
  const stages: ShipmentStage[] = isShipped
    ? [...DEFAULT_STAGES]
    : [
        { id: 'picked', label: 'Собран', date: null, done: false },
        { id: 'handed_to_carrier', label: 'Передан в доставку', date: null, done: false },
        { id: 'in_transit', label: 'В пути', date: null, done: false },
        { id: 'delivered', label: 'Доставлен', date: null, done: false },
      ];
  return {
    shipDate,
    estimatedDelivery: isShipped ? '2024-09-15' : null,
    trackNumber: isShipped ? '1Z999AA10123456784' : null,
    carrier: 'DHL Express',
    stages,
    isShipped,
  };
}
