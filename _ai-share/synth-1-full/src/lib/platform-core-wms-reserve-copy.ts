/**
 * Единый честный copy про резерв WMS в Platform Core.
 * Резерв появляется после handoff — не на checkout.
 */

export const PLATFORM_CORE_WMS_RESERVE_CHECKOUT_RU =
  'Резерв склада — после подтверждения брендом и передачи в цех.';

export const PLATFORM_CORE_WMS_RESERVE_PENDING_AFTER_HANDOFF_RU =
  'Резерв ожидается после передачи в производство';

export const PLATFORM_CORE_WMS_RESERVE_BEFORE_HANDOFF_RU =
  'Резерв — после подтверждения бренда и передачи в цех';

export const PLATFORM_CORE_WMS_RESERVE_DONE_RU = 'Резерв на складе';

export const PLATFORM_CORE_WMS_RESERVE_DISABLED_RU =
  'WMS (склад) выключен — резерв недоступен';

/** Supplier procurement: резерв после shop checkout + brand handoff. */
export const PLATFORM_CORE_WMS_RESERVE_SUPPLIER_PROCUREMENT_RU =
  'Резерв WMS — после checkout магазина и handoff бренда в цех.';

export type PlatformCoreWmsReserveCabinetRole = 'brand' | 'manufacturer' | 'supplier';

/** Короткий badge на карточке OP (бренд). */
export function formatPlatformCoreWmsReserveBrandBadgeRu(done: boolean): string {
  return done ? 'WMS ✓' : 'WMS…';
}

/** Длинный badge на карточке OP (цех / поставщик). */
export function formatPlatformCoreWmsReserveCabinetLongRu(
  done: boolean,
  role: Exclude<PlatformCoreWmsReserveCabinetRole, 'brand'>
): string {
  if (done) return 'Резерв WMS оформлен';
  if (role === 'supplier') return 'Заявка на резерв (PG)';
  return 'Резерв WMS ожидается';
}

export function formatPlatformCoreWmsReserveDoneWithQtyRu(qty?: number): string {
  return qty != null && qty > 0
    ? `Резерв на складе: ${qty} ед.`
    : PLATFORM_CORE_WMS_RESERVE_DONE_RU;
}
