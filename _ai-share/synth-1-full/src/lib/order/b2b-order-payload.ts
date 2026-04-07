/**
 * B2B Order payload — форма данных для отправки заказа (JOOR-style).
 * При подключении API: передавать в POST /api/v1/orders или аналог.
 */

export type B2BOrderMode = 'buy_now' | 'reorder' | 'pre_order';

/** JOOR: статус позиции заказа — открыта / отменена / заменена */
export type B2BOrderLineStatus = 'open' | 'cancelled' | 'replaced';

/** JOOR: окно доставки (Start Ship Date — Complete Ship Date) */
export interface B2BDeliveryWindow {
  id: string;
  label: string;
  startShipDate: string;
  completeShipDate: string;
  cancelDate?: string;
}

export interface B2BOrderLineItem {
  productId: string;
  size: string;
  quantity: number;
  price: number;
  currency?: string;
  deliveryDate?: string;
  /** JOOR: привязка к окну доставки (split delivery) */
  deliveryWindowId?: string;
  /** JOOR: заметка к позиции */
  lineNotes?: string;
  /** JOOR: статус позиции */
  lineStatus?: B2BOrderLineStatus;
  /** NuOrder: при замене — ID продукта-альтернативы */
  replacedByProductId?: string;
  /** ASOS: размер бренда (EU и т.д.) для маркетплейса */
  brandSize?: string;
  /** ASOS: размер в сетке ритейлера (внутренняя линейка) */
  retailerSize?: string;
  tryBeforeBuy?: boolean;
}

export interface B2BOrderPayload {
  /** Режим заказа */
  orderMode: B2BOrderMode;
  /** Идентификатор дропа (для pre_order) */
  dropId?: string;
  /** Название дропа (для отображения) */
  dropLabel?: string;
  /** Часть заказа — сэмплы на примерку (Try Before Buy) */
  tryBeforeBuy?: boolean;
  /** JOOR: окна доставки для split delivery */
  deliveryWindows?: B2BDeliveryWindow[];
  /** JOOR: заметки к заказу (байер/бренд) */
  orderNotes?: string;
  /** JOOR: валюта заказа */
  currency?: string;
  /** Zalando ZEOS: канал исполнения — один склад/интеграция для маркетплейса и B2B */
  fulfillmentChannel?: 'zeos' | 'own' | 'marketplace';
  /** Позиции заказа */
  items: B2BOrderLineItem[];
}
