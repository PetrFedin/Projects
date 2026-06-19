/** Подпись статуса резерва на карточке отслеживания оптового заказа (честно, без mock). */

import {
  PLATFORM_CORE_WMS_RESERVE_CHECKOUT_RU,
  PLATFORM_CORE_WMS_RESERVE_DISABLED_RU,
  PLATFORM_CORE_WMS_RESERVE_PENDING_AFTER_HANDOFF_RU,
  formatPlatformCoreWmsReserveDoneWithQtyRu,
} from '@/lib/platform-core-wms-reserve-copy';

export type TrackingReserveTone = 'ok' | 'pending' | 'muted' | 'warn';

export function formatShopB2bTrackingReserveLabelRu(input: {
  status: string;
  handedOff: boolean;
  inventoryReserved: boolean;
  inventoryReservedQty?: number;
  inventoryReserveReason?: string;
}): { text: string; tone: TrackingReserveTone } {
  if (input.inventoryReserved) {
    return {
      text: formatPlatformCoreWmsReserveDoneWithQtyRu(input.inventoryReservedQty),
      tone: 'ok',
    };
  }

  if (input.inventoryReserveReason === 'internal_wms_disabled') {
    return {
      text: PLATFORM_CORE_WMS_RESERVE_DISABLED_RU,
      tone: 'muted',
    };
  }

  if (input.handedOff || input.status === 'confirmed' || input.status === 'allocated') {
    return { text: PLATFORM_CORE_WMS_RESERVE_PENDING_AFTER_HANDOFF_RU, tone: 'pending' };
  }

  return { text: PLATFORM_CORE_WMS_RESERVE_CHECKOUT_RU, tone: 'muted' };
}
