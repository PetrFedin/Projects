/**
 * First Order Discount — скидка на первый заказ.
 * Привязана к customer groups.
 */

import { getFirstOrderDiscountPercent } from './customer-groups';

export function getFirstOrderDiscount(
  orderCount: number,
  customerGroupId?: string
): number {
  if (orderCount > 0) return 0;
  return getFirstOrderDiscountPercent(customerGroupId);
}

export function applyFirstOrderDiscount(
  amount: number,
  orderCount: number,
  customerGroupId?: string
): { discountedAmount: number; discountPercent: number } {
  const pct = getFirstOrderDiscount(orderCount, customerGroupId);
  if (pct <= 0) return { discountedAmount: amount, discountPercent: 0 };
  const discountedAmount = Math.round(amount * (1 - pct / 100));
  return { discountedAmount, discountPercent: pct };
}
