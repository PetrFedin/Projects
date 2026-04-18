/**
 * B2B Feature Constants — связь с ROUTES, лейблами, значениями по умолчанию.
 */

import type { ShipWindow, ShipWindowType } from './types';

/** Ship windows — Pre-order / At-Once / Re-order */
export const SHIP_WINDOWS: Record<
  ShipWindowType,
  Omit<ShipWindow, 'id' | 'deliveryDate' | 'deliveryWindow' | 'availableToPromise'>
> = {
  pre_order: { type: 'pre_order', label: 'Предзаказ', labelEn: 'Pre-order', sortOrder: 1 },
  at_once: { type: 'at_once', label: 'Со склада', labelEn: 'At-Once', sortOrder: 2 },
  re_order: { type: 're_order', label: 'Повторный заказ', labelEn: 'Re-order', sortOrder: 3 },
  future: { type: 'future', label: 'Будущая поставка', labelEn: 'Future', sortOrder: 4 },
};

/** Price list tiers — для priceTier в B2BOrder */
export const PRICE_LIST_TIERS = ['retail_a', 'retail_b', 'outlet', 'wholesale', 'vip'] as const;

/** Net terms — дни отсрочки */
export const NET_TERMS_OPTIONS = [0, 7, 14, 21, 30, 45, 60, 90] as const;
