/**
 * Customer Groups — сегментация клиентов (розница, дистрибуция, франшиза).
 * Привязка к price lists, volume discounts, net terms.
 */

export type CustomerGroupId = 'retail' | 'distribution' | 'franchise' | 'wholesale';

export interface CustomerGroup {
  id: CustomerGroupId;
  name: string;
  nameRu: string;
  /** Ценовой уровень (retail_a, retail_b, outlet) — для price tiers */
  defaultPriceTier: string;
  /** Дефолтный net term в днях */
  defaultNetTermDays: number;
  /** Скидка на первый заказ (%) */
  firstOrderDiscountPercent?: number;
  /** Освобождение от НДС (УСН и др.) */
  vatExempt?: boolean;
}

const STORAGE_KEY = 'b2b_customer_groups_v1';

const DEFAULT_GROUPS: CustomerGroup[] = [
  { id: 'retail', name: 'Retail', nameRu: 'Розница', defaultPriceTier: 'retail_a', defaultNetTermDays: 14, firstOrderDiscountPercent: 5 },
  { id: 'wholesale', name: 'Wholesale', nameRu: 'Опт', defaultPriceTier: 'retail_b', defaultNetTermDays: 30, firstOrderDiscountPercent: 8 },
  { id: 'distribution', name: 'Distribution', nameRu: 'Дистрибуция', defaultPriceTier: 'retail_b', defaultNetTermDays: 60, vatExempt: true },
  { id: 'franchise', name: 'Franchise', nameRu: 'Франшиза', defaultPriceTier: 'retail_a', defaultNetTermDays: 30, firstOrderDiscountPercent: 10, vatExempt: true },
];

function load(): CustomerGroup[] {
  if (typeof window === 'undefined') return DEFAULT_GROUPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_GROUPS;
  } catch {
    return DEFAULT_GROUPS;
  }
}

function save(groups: CustomerGroup[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export function getCustomerGroups(): CustomerGroup[] {
  return load();
}

export function getCustomerGroup(id: CustomerGroupId | string): CustomerGroup | undefined {
  return load().find((g) => g.id === id);
}

export function getDefaultNetTermDays(groupId?: CustomerGroupId | string): number {
  const group = groupId ? getCustomerGroup(groupId) : undefined;
  return group?.defaultNetTermDays ?? 30;
}

export function getFirstOrderDiscountPercent(groupId?: CustomerGroupId | string): number {
  const group = groupId ? getCustomerGroup(groupId) : undefined;
  return group?.firstOrderDiscountPercent ?? 0;
}

export function isVatExempt(groupId?: CustomerGroupId | string): boolean {
  const group = groupId ? getCustomerGroup(groupId) : undefined;
  return group?.vatExempt ?? false;
}

export function getPriceTierForGroup(groupId?: CustomerGroupId | string): string {
  const group = groupId ? getCustomerGroup(groupId) : undefined;
  return group?.defaultPriceTier ?? 'retail_b';
}
