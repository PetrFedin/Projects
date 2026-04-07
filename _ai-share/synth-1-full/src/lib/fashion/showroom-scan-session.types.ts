/**
 * Инфраструктура для прод: синхронизация списка сканов между устройствами и привязка к сессии байера / заказу.
 * Реализацию API и БД подключать позже.
 */

/** Сессия байера в шоуруме (планшет / телефон). */
export type ShowroomBuyerSessionV1 = {
  sessionId: string;
  buyerAccountId?: string;
  buyerLabel?: string;
  brandId?: string;
  showroomEventId?: string;
  createdAtIso: string;
  /** Черновик заказа или корзина на платформе. */
  linkedDraftOrderId?: string;
};

export type ShowroomScanLinePersistedV1 = {
  lineId: string;
  sessionId: string;
  registryTagId: string;
  scannedAtIso: string;
  source: 'qr' | 'barcode';
  sizesQtyNote?: string;
};

/** POST /api/showroom-sessions/:id/lines — тело для синхронизации (заготовка). */
export type ShowroomSessionAppendScanBodyV1 = {
  registryTagId: string;
  source: 'qr' | 'barcode';
  sizesQtyNote?: string;
};
