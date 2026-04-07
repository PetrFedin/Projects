/**
 * Volume Discounts (Brandboom, NetSuite).
 * Скидки по объёму: 10+ шт = −5%, 50+ = −10% и т.д.
 * Привязка к customer groups.
 */

import type { CustomerGroupId } from './customer-groups';

export interface VolumeDiscountTier {
  /** Минимальное кол-во единиц (суммарно по строке или по заказу) */
  minQuantity: number;
  /** Скидка в процентах (5 = 5%) */
  discountPercent: number;
  /** Или фиксированный множитель к цене (0.95 = −5%) */
  multiplier?: number;
}

export interface VolumeDiscountRule {
  id: string;
  brandId?: string;
  /** Группы клиентов — если задано, правило только для этих групп. Пусто = для всех. */
  customerGroupIds?: CustomerGroupId[];
  /** По продукту или по заказу целиком */
  scope: 'line' | 'order';
  tiers: VolumeDiscountTier[];
  validFrom?: string;
  validTo?: string;
}

const STORAGE_KEY = 'b2b_volume_discounts_v1';

const DEFAULT_TIERS: VolumeDiscountTier[] = [
  { minQuantity: 10, discountPercent: 5, multiplier: 0.95 },
  { minQuantity: 25, discountPercent: 8, multiplier: 0.92 },
  { minQuantity: 50, discountPercent: 12, multiplier: 0.88 },
  { minQuantity: 100, discountPercent: 15, multiplier: 0.85 },
];

function loadRules(): VolumeDiscountRule[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** Правила объёмных скидок по бренду. Мок: одно правило по умолчанию. */
export function getVolumeDiscountRules(brandId?: string): VolumeDiscountRule[] {
  const stored = loadRules();
  if (stored.length > 0) {
    return brandId ? stored.filter((r) => !r.brandId || r.brandId === brandId) : stored;
  }
  return [
    {
      id: 'vd-default',
      scope: 'line',
      tiers: DEFAULT_TIERS,
    },
  ];
}

/** Применить скидку по объёму. Возвращает множитель к цене (1 = без скидки). */
export function getVolumeDiscountMultiplier(
  quantity: number,
  brandId?: string,
  customerGroupId?: CustomerGroupId
): number {
  const rules = getVolumeDiscountRules(brandId, customerGroupId);
  const rule = rules[0]; // берём первое подходящее
  if (!rule?.tiers?.length) return 1;
  const sorted = [...rule.tiers].sort((a, b) => b.minQuantity - a.minQuantity);
  for (const tier of sorted) {
    if (quantity >= tier.minQuantity) {
      return tier.multiplier ?? 1 - tier.discountPercent / 100;
    }
  }
  return 1;
}

/** Цена с учётом объёмной скидки */
export function applyVolumeDiscount(
  basePrice: number,
  quantity: number,
  brandId?: string,
  customerGroupId?: CustomerGroupId
): number {
  const mult = getVolumeDiscountMultiplier(quantity, brandId, customerGroupId);
  return Math.round(basePrice * quantity * mult);
}
