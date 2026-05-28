import type { PreOrderFinancingV1 } from './types';

/** Финансирование предзаказов для B2B (схема 30/70, рассрочки). */
export function getB2BPreOrderFinancing(totalAmount: number): PreOrderFinancingV1 {
  const deposit = totalAmount * 0.3;
  const remaining = totalAmount - deposit;
  const date = new Date();
  date.setMonth(date.getMonth() + 2); // 60 days remaining due

  return {
    totalAmount,
    depositPercent: 30,
    depositAmount: deposit,
    remainingAmount: remaining,
    remainingDueDate: date.toISOString().split('T')[0],
    isInterestFree: true,
    creditTermDays: 60,
  };
}
