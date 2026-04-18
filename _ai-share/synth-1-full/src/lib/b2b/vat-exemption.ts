/**
 * VAT Exemption — освобождение от НДС (УСН, без НДС).
 * РФ: работа с клиентами на УСН и без НДС.
 */

import { isVatExempt } from './customer-groups';

const VAT_RATE = 20; // 20% НДС в РФ

export function isCustomerVatExempt(customerGroupId?: string): boolean {
  return isVatExempt(customerGroupId);
}

export function getVatRate(customerGroupId?: string): number {
  return isCustomerVatExempt(customerGroupId) ? 0 : VAT_RATE;
}

export function addVatIfApplicable(amountWithoutVat: number, customerGroupId?: string): number {
  const rate = getVatRate(customerGroupId);
  return Math.round(amountWithoutVat * (1 + rate / 100));
}

export function getVatAmount(amountWithVat: number, customerGroupId?: string): number {
  const rate = getVatRate(customerGroupId);
  if (rate === 0) return 0;
  return Math.round(amountWithVat - amountWithVat / (1 + rate / 100));
}
