import type { B2BCreditTermsV1 } from './types';

/** Демо-данные по кредитам байера (инфраструктура для B2B финансов). */
export function getB2BCreditTerms(buyerId: string): B2BCreditTermsV1 {
  // Demo mock based on ID
  const seed = buyerId.length;
  const limit = 500000 + (seed % 5) * 100000;
  const balance = (seed % 3) * 150000;

  return {
    creditLimit: limit,
    availableCredit: limit - balance,
    paymentTerms: seed % 2 === 0 ? 'net_30' : 'net_15',
    currency: 'RUB',
    outstandingBalance: balance,
  };
}

export const PAYMENT_TERM_LABELS: Record<B2BCreditTermsV1['paymentTerms'], string> = {
  net_15: 'Оплата через 15 дней',
  net_30: 'Оплата через 30 дней',
  net_60: 'Оплата через 60 дней',
  prepaid: 'Предоплата 100%',
};
