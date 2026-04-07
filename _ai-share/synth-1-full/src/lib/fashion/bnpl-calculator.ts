import type { Product } from '@/lib/types';
import type { BnplInstallmentV1 } from './types';

/** Расчет платежей для BNPL (Долями / Сплит / Частями). */
export function calculateBnpl(product: Product, provider: BnplInstallmentV1['provider'] = 'dolyame'): BnplInstallmentV1 {
  const price = product.price;
  const installments = 4;
  const payment = Math.round(price / installments);

  const next = new Date();
  next.setDate(next.getDate() + 14); // Обычно платеж каждые 2 недели

  return {
    totalPrice: price,
    installments,
    paymentAmount: payment,
    nextPaymentDate: next.toISOString().split('T')[0],
    provider,
  };
}
