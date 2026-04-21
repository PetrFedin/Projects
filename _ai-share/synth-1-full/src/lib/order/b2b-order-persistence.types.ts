import type { B2BOrder } from '@/lib/types';
import type { B2BOrderLineItem } from '@/lib/order/b2b-order-payload';

/**
 * Версия снимка на диске. При смене схемы — миграция или новый `schemaVersion`.
 */
export type B2BOrderSnapshotSchemaVersion = 1;

/**
 * Горизонтальное расширение: строки заказа по id (для замены demoOperationalDetailLineItems).
 * Ключ = `B2BOrder.order` (wholesale id).
 */
export type LineItemsByOrderId = Record<string, B2BOrderLineItem[]>;

export type B2BOrderSnapshotFileV1 = {
  schemaVersion: 1;
  meta?: {
    locale?: 'ru';
    updatedAt?: string;
    /** Идентификатор среды / тенанта (будущее: multi-org) */
    tenantHint?: string;
  };
  orders: B2BOrder[];
  /** Опционально: детализация для API карточки заказа без отдельной таблицы */
  lineItemsByOrderId?: LineItemsByOrderId;
};

/**
 * Порт чтения заказов — будущие реализации: Postgres, 1С-адаптер, внешний OMS.
 * Пока используется только снимок JSON + fallback на сид `order-data`.
 */
export interface B2BOrderReadPort {
  listOrdersBase(): Promise<B2BOrder[]>;
}
