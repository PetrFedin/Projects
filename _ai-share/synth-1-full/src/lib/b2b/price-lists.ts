/**
 * SparkLayer: прайс-листы и акции — разные уровни цен по периоду/каналу без ручной правки каждого SKU.
 * Множитель или список скидок по каналу (price tier) и периоду (validFrom–validTo).
 */

import type { PriceTierId } from '@/lib/b2b/price-tiers';
import type { CustomerGroupId } from './customer-groups';

export interface PriceList {
  id: string;
  name: string;
  /** Канал / ценовой уровень (retail_a, retail_b, outlet) */
  channel: PriceTierId;
  /** Группы клиентов — если задано, прайс только для этих групп. Пусто = для всех. */
  customerGroupIds?: CustomerGroupId[];
  /** Период действия */
  validFrom: string; // ISO date
  validTo: string; // ISO date
  /** Тип: множитель к базовой цене (0.9 = −10%) или переопределения по SKU */
  type: 'multiplier' | 'override';
  /** Для multiplier: множитель к оптовой цене (0.85 = 15% скидка) */
  multiplier?: number;
  /** Для override: маппинг productId → цена (руб). Пусто = не используется. */
  overrides?: Record<string, number>;
  createdAt: string;
}

const STORAGE_KEY = 'b2b_price_lists';

function load(): PriceList[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(lists: PriceList[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

const SEED: PriceList[] = [
  {
    id: 'pl-retail-b-q1',
    name: 'Retail B −4% Q1',
    channel: 'retail_b',
    validFrom: '2025-01-01',
    validTo: '2025-03-31',
    type: 'multiplier',
    multiplier: 0.96,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pl-outlet-promo',
    name: 'Outlet акция −5%',
    channel: 'outlet',
    validFrom: '2025-02-01',
    validTo: '2025-02-28',
    type: 'multiplier',
    multiplier: 0.95,
    createdAt: new Date().toISOString(),
  },
];

export function getPriceLists(brandId?: string): PriceList[] {
  const stored = load();
  return stored.length > 0 ? stored : [...SEED];
}

export function getActivePriceListsForChannel(
  channel: PriceTierId,
  asOfDate?: string,
  customerGroupId?: CustomerGroupId
): PriceList[] {
  const date = asOfDate ?? new Date().toISOString().slice(0, 10);
  return getPriceLists().filter((pl) => {
    if (pl.channel !== channel || pl.validFrom > date || pl.validTo < date) return false;
    if (pl.customerGroupIds?.length) {
      return customerGroupId && pl.customerGroupIds.includes(customerGroupId);
    }
    return true;
  });
}

/** Итоговая цена с учётом активных прайс-листов и акций. basePrice — уже с учётом tier (getPriceForTier); применяется множитель или override по SKU. */
export function getPriceWithPromotions(
  productId: string,
  basePrice: number,
  channel: PriceTierId,
  asOfDate?: string,
  customerGroupId?: CustomerGroupId
): number {
  const active = getActivePriceListsForChannel(channel, asOfDate, customerGroupId);
  let price = basePrice;
  for (const pl of active) {
    if (pl.type === 'override' && pl.overrides?.[productId] != null) {
      price = pl.overrides[productId];
      break;
    }
    if (pl.type === 'multiplier' && pl.multiplier != null) {
      price = Math.round(price * pl.multiplier);
    }
  }
  return price;
}

export function addPriceList(pl: Omit<PriceList, 'id' | 'createdAt'>): PriceList {
  const lists = load().length ? load() : [...SEED];
  const newPl: PriceList = {
    ...pl,
    id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  lists.push(newPl);
  save(lists);
  return newPl;
}

export function deletePriceList(id: string): void {
  const lists = load().filter((p) => p.id !== id);
  save(lists);
}
