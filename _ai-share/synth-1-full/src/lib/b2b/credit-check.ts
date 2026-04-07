/**
 * SparkLayer / JOOR: кредитный лимит партнёра (realtime из credit-store).
 * Предупреждение до отправки заказа при приближении/превышении лимита.
 * После оплаты (JOOR Pay) used обновляется в store → wouldExceed в матрице актуален.
 */

import { getCreditUsed, getCreditLimit } from './credit-store';

export interface CreditStatus {
  limit: number;
  used: number;
  available: number;
  /** Лимит исчерпан — заказ блокировать */
  blocked: boolean;
  /** Сумма заказа превышает доступный лимит — предупреждение */
  wouldExceed: (orderTotal: number) => boolean;
}

/** Статус кредита текущего партнёра. Realtime: читает из credit-store (обновляется после оплаты). */
export function getCreditForCurrentPartner(): CreditStatus {
  const limit = getCreditLimit();
  const used = getCreditUsed();
  const available = limit - used;
  return {
    limit,
    used,
    available,
    blocked: available <= 0,
    wouldExceed(orderTotal: number) {
      return orderTotal > available;
    },
  };
}
