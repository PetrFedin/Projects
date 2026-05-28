import type { B2BOrder, B2BOrderPaymentStatus } from '@/lib/types';
import type { B2BOrderLineItem } from './b2b-order-payload';

/**
 * Канонический **оптовый** идентификатор заказа (Phase 2 Order).
 * В текущем demo-JSON он сериализуется как `wholesaleOrderId`; в legacy {@link B2BOrder} то же значение лежит в поле **`order`**.
 */
export type WholesaleOrderId = string;

/**
 * **List DTO** для operational UI: коммерческая строка + явные projection-поля оплаты.
 *
 * **SoT (demo):** строка списка строится из `mockB2BOrders` + оверлей `getOrdersWithPaymentState` — первичная «правда» заказа как сделки; **не** бухгалтерский ledger.
 * **Projection:** `paymentStatus` / `paidAmount` — агрегат из finance/credit rollup для UI, могут расходиться с будущим ledger API.
 * **Shipment:** в list DTO нет поля отгрузки; трекинг — отдельный контур (`useOrderShipmentTracking` и пр.), не смешивать в aggregate Order без явного ADR.
 */
export type OperationalOrderListRowDto = {
  wholesaleOrderId: WholesaleOrderId;
  status: string;
  shop: string;
  brand: string;
  amount: string;
  date: string;
  deliveryDate: string;
  orderMode?: B2BOrder['orderMode'];
  eventId?: string;
  passportSlotId?: string;
  priceTier?: B2BOrder['priceTier'];
  territory?: string;
  creditLimit?: number;
  /** Projection (rollup), не первичный платёжный SoT. */
  paymentStatus?: B2BOrderPaymentStatus;
  /** Projection (rollup). */
  paidAmount?: number;
};

/** **Detail DTO** — коммерческая деталь заказа (линии, заметки). */
export type OperationalOrderDetailDto = OperationalOrderListRowDto & {
  items: B2BOrderLineItem[];
  orderNotes?: string;
  /** JOOR: внутренние заметки бренда (не видны ритейлеру). */
  internalNotes?: string;
};

export function toOperationalOrderListRowDto(o: B2BOrder): OperationalOrderListRowDto {
  return {
    wholesaleOrderId: o.order,
    status: o.status,
    shop: o.shop,
    brand: o.brand,
    amount: o.amount,
    date: o.date,
    deliveryDate: o.deliveryDate,
    orderMode: o.orderMode,
    eventId: o.eventId,
    passportSlotId: o.passportSlotId,
    priceTier: o.priceTier,
    territory: o.territory,
    creditLimit: o.creditLimit,
    paymentStatus: o.paymentStatus,
    paidAmount: o.paidAmount,
  };
}

export function toOperationalOrderDetailDto(
  o: B2BOrder,
  items: B2BOrderLineItem[],
  orderNotes?: string,
  internalNotes?: string
): OperationalOrderDetailDto {
  return {
    ...toOperationalOrderListRowDto(o),
    items,
    orderNotes,
    internalNotes,
  };
}

/** Совместимость с существующим UI / `B2BOrder` до полного rename в компонентах. */
export function operationalOrderListRowDtoToB2BOrder(d: OperationalOrderListRowDto): B2BOrder {
  return {
    order: d.wholesaleOrderId,
    status: d.status,
    shop: d.shop,
    brand: d.brand,
    amount: d.amount,
    date: d.date,
    deliveryDate: d.deliveryDate,
    orderMode: d.orderMode,
    eventId: d.eventId,
    passportSlotId: d.passportSlotId,
    priceTier: d.priceTier,
    territory: d.territory,
    creditLimit: d.creditLimit,
    paymentStatus: d.paymentStatus,
    paidAmount: d.paidAmount,
  };
}
