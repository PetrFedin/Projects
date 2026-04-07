/**
 * B2B Feature Types — FEATURE_BENCHMARK.md
 * Единый источник типов для ship windows, price lists, RFQ, credit, exclusion zones.
 */

/** Pre-order / Re-order / At-Once — Fashion Cloud, Le New Black, Brandboom */
export type ShipWindowType = 'pre_order' | 'at_once' | 're_order' | 'future';

export interface ShipWindow {
  id: string;
  type: ShipWindowType;
  label: string;
  labelEn?: string;
  /** Дата отгрузки или окно (start, end) */
  deliveryDate?: string;
  deliveryWindow?: { start: string; end: string };
  /** ATP: available to promise */
  availableToPromise?: number;
  /** Приоритет в UI */
  sortOrder: number;
}

/** Персональные прайс-листы — СотБит, SparkLayer, Brandboom */
export type PriceListTier = 'retail_a' | 'retail_b' | 'outlet' | 'wholesale' | 'vip' | 'custom';

export interface PriceList {
  id: string;
  name: string;
  tier?: PriceListTier;
  currency: string;
  /** Модификатор к базовой цене (1.0 = 100%) */
  modifier?: number;
  /** Скидка от объёма: [{ minQty, discountPercent }] */
  volumeDiscounts?: { minQty: number; discountPercent: number }[];
  validFrom?: string;
  validTo?: string;
  /** Исключения по регионам (exclusion zones) */
  exclusionZoneIds?: string[];
}

/** Request for Quote — SparkLayer, B2B-Center */
export type RFQStatus = 'draft' | 'sent' | 'received' | 'accepted' | 'rejected' | 'expired';

export interface RFQ {
  id: string;
  buyerId: string;
  supplierId?: string;
  items: { skuId: string; quantity: number; notes?: string }[];
  status: RFQStatus;
  expiresAt: string;
  createdAt: string;
  /** Ответ поставщика */
  response?: {
    offeredPrice?: number;
    leadTimeDays?: number;
    validUntil?: string;
    notes?: string;
  };
}

/** Отсрочка платежа, лимиты — SparkLayer, Candid */
export interface CreditTerms {
  /** Дней отсрочки (net 30, net 60) */
  netDays: number;
  /** Кредитный лимит в валюте */
  creditLimit: number;
  currency: string;
  /** Текущий долг */
  balanceUsed?: number;
  /** Доступно */
  balanceAvailable?: number;
}

/** Exclusion zones — Brandboom (дистрибуция по регионам) */
export interface ExclusionZone {
  id: string;
  name: string;
  /** ISO коды стран или регионы */
  countries?: string[];
  regions?: string[];
  /** ID партнёров с эксклюзивом */
  exclusivePartnerIds?: string[];
}

/** Multi-door ordering — RepSpark, Colect */
export interface ShipFromLocation {
  id: string;
  name: string;
  type: 'warehouse' | 'store' | 'factory';
  address?: string;
  /** Доступность по ship window */
  shipWindowIds?: string[];
}
