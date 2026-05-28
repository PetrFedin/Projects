import type { B2BMultiCurrencySettlementV1 } from './types';

/** Расчет взаиморасчетов в разных валютах для регионов (B2B Multi-Currency). */
export function getB2BCurrencySettlement(
  orderId: string,
  rubAmount: number,
  targetCurrency: B2BMultiCurrencySettlementV1['currency'] = 'CNY'
): B2BMultiCurrencySettlementV1 {
  const rates = {
    RUB: 1.0,
    CNY: 0.08, // 1 RUB = 0.08 CNY
    KZT: 4.8, // 1 RUB = 4.8 KZT
    BYN: 0.035, // 1 RUB = 0.035 BYN
  };

  const exchangeRate = rates[targetCurrency];
  const finalAmount = rubAmount * exchangeRate;

  return {
    orderId,
    baseAmount: rubAmount,
    currency: targetCurrency,
    exchangeRate,
    finalAmount,
    isRateLocked: true,
  };
}
