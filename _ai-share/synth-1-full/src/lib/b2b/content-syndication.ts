/**
 * Fashion Cloud: контент и синдикация.
 * Единый PIM → каталог байера: выгрузка ассортимента, медиа, атрибутов.
 * Синхронизация по расписанию (мок: cron/webhook) + индикатор «последнее обновление».
 */

import type { Product } from '@/lib/types';
import type { BuyerRights, B2BChannelId } from './buyer-rights';
import { isProductVisibleToBuyer } from './buyer-rights';
import { formatProductComposition } from '@/lib/b2b/format-product-composition';
import { validateProductsForB2B } from '@/lib/b2b/b2b-catalog-contract';

/** Доп. поля PIM для синдикации / NuORDER (не все в `Product`) */
type SyndicationProductExtras = {
  allowedTerritories?: string[];
  allowedChannels?: B2BChannelId[];
  collection?: string;
  certifications?: unknown;
};

function syndicationExtras(p: Product): SyndicationProductExtras {
  const x = p as Product & SyndicationProductExtras;
  return {
    allowedTerritories: x.allowedTerritories,
    allowedChannels: x.allowedChannels,
    collection: x.collection,
    certifications: x.certifications,
  };
}

function syndicationSustainabilityLabel(p: Product): string | undefined {
  const { certifications } = syndicationExtras(p);
  const raw = p.sustainability && p.sustainability.length > 0 ? p.sustainability : certifications;
  if (raw == null) return undefined;
  if (Array.isArray(raw)) return raw.length > 0 ? 'Сертифицировано' : undefined;
  if (typeof raw === 'object')
    return Object.keys(raw as object).length > 0 ? 'Сертифицировано' : undefined;
  return 'Сертифицировано';
}

/** Статус синдикации по бренду или глобальный */
export interface SyndicationStatus {
  lastSyncedAt: string;
  source: 'pim';
  brandId?: string;
  /** Мок: расписание (cron expression или описание) */
  schedule?: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
}

/** Лог последней выгрузки PIM → каталог байера: расписание + ошибки по SKU. */
export interface SyndicationRunLog {
  runAt: string; // ISO
  brandId?: string;
  status: 'success' | 'partial' | 'error';
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  /** SKU с ошибками валидации (контракт B2B) */
  skuErrors: {
    sku: string;
    productId: string;
    name: string;
    errors: { field: string; message: string }[];
  }[];
  /** Расписание следующего запуска (мок) */
  nextRunSchedule?: string;
}

/** Fashion Cloud / Colect: каналы контента по продукту (лукбук, 3D, доп. медиа) */
export type ContentChannelId = 'lookbook' | 'linesheet' | '3d' | 'video' | 'extra_media';

export interface ContentChannelLink {
  channelId: ContentChannelId;
  label: string;
  url?: string;
  available: boolean;
}

/** Элемент каталога байера после синдикации из PIM */
export interface SyndicatedCatalogItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  season: string;
  price: number;
  priceFormatted: string;
  imageUrl: string;
  attributes: Record<string, string>;
  moq: number;
  /** Капсула / подколлекция для фильтров B2B каталога */
  capsule?: string;
  /** Материал для фильтра */
  material?: string;
  /** Цвет для фильтра */
  color?: string;
  /** Устойчивость: сертификат, recycled и т.д. */
  sustainability?: string;
  /** Каналы контента по продукту (Fashion Cloud) */
  contentChannels?: ContentChannelLink[];
  /** NuORDER: территории/каналы, в которых продукт доступен (права байера) */
  allowedTerritories?: string[];
  allowedChannels?: B2BChannelId[];
}

const STORAGE_KEY = 'b2b_content_syndication_last_sync';
const STORAGE_KEY_RUN_LOG = 'b2b_content_syndication_run_log';
const STORAGE_KEY_VALID_SKUS = 'b2b_content_syndication_valid_skus';

function getStoredLastSync(brandId?: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, string>;
    return brandId ? (data[brandId] ?? data['_global'] ?? null) : (data['_global'] ?? null);
  } catch {
    return null;
  }
}

function setStoredLastSync(isoDate: string, brandId?: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = (raw ? JSON.parse(raw) : {}) as Record<string, string>;
    if (brandId) data[brandId] = isoDate;
    data['_global'] = isoDate;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    //
  }
}

/** Мок: последняя синхронизация по умолчанию (для SSR и первого визита) */
const DEFAULT_LAST_SYNC = '2025-03-10T12:00:00Z';

/** Получить статус синдикации для отображения «последнее обновление» */
export function getSyndicationStatus(brandId?: string): SyndicationStatus {
  const stored = getStoredLastSync(brandId);
  const lastSyncedAt = stored ?? DEFAULT_LAST_SYNC;
  return {
    lastSyncedAt,
    source: 'pim',
    brandId,
    schedule: '0 6 * * *', // мок: ежедневно в 06:00
    status: 'idle',
  };
}

function getStoredRunLog(brandId?: string): SyndicationRunLog | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RUN_LOG);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, SyndicationRunLog>;
    const key = brandId ?? '_global';
    return data[key] ?? null;
  } catch {
    return null;
  }
}

export function setStoredRunLog(log: SyndicationRunLog, brandId?: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RUN_LOG);
    const data = (raw ? JSON.parse(raw) : {}) as Record<string, SyndicationRunLog>;
    const key = brandId ?? '_global';
    data[key] = log;
    localStorage.setItem(STORAGE_KEY_RUN_LOG, JSON.stringify(data));
  } catch {
    //
  }
}

function getStoredValidSkus(brandId?: string): string[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VALID_SKUS);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, string[]>;
    const key = brandId ?? '_global';
    return data[key] ?? null;
  } catch {
    return null;
  }
}

function setStoredValidSkus(productIds: string[], brandId?: string) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VALID_SKUS);
    const data = (raw ? JSON.parse(raw) : {}) as Record<string, string[]>;
    const key = brandId ?? '_global';
    data[key] = productIds;
    localStorage.setItem(STORAGE_KEY_VALID_SKUS, JSON.stringify(data));
  } catch {
    //
  }
}

/** Расписание синдикации (мок). */
export function getSyndicationSchedule(brandId?: string): {
  cron: string;
  description: string;
  nextRun?: string;
} {
  return {
    cron: '0 6 * * *',
    description: 'Ежедневно в 06:00 (мок)',
    nextRun: 'След. запуск: завтра 06:00',
  };
}

/** Лог последней выгрузки и список SKU с ошибками. */
export function getSyndicationRunLog(brandId?: string): SyndicationRunLog | null {
  return getStoredRunLog(brandId);
}

/** Запустить синхронизацию PIM → каталог байера (мок: задержка 1.5 с). Без products — только обновление времени. */
export function triggerSync(brandId?: string, products?: Product[]): Promise<SyndicationStatus> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      setStoredLastSync(now, brandId);
      resolve({
        lastSyncedAt: now,
        source: 'pim',
        brandId,
        schedule: '0 6 * * *',
        status: 'success',
      });
    }, 1500);
  });
}

/** Запустить выгрузку с валидацией контракта B2B: лог последней выгрузки + список SKU с ошибками. */
export function runSyndicationWithValidation(
  products: Product[],
  brandId?: string
): Promise<SyndicationRunLog> {
  const { validSkus, skuErrors } = validateProductsForB2B(products);
  const now = new Date().toISOString();
  const log: SyndicationRunLog = {
    runAt: now,
    brandId,
    status:
      skuErrors.length === 0 ? 'success' : skuErrors.length < products.length ? 'partial' : 'error',
    totalProcessed: products.length,
    successCount: validSkus.length,
    errorCount: skuErrors.length,
    skuErrors: skuErrors.map((e) => ({
      sku: e.sku,
      productId: e.productId,
      name: e.name,
      errors: e.errors.map((err) => ({ field: err.field, message: err.message })),
    })),
    nextRunSchedule: getSyndicationSchedule(brandId).nextRun,
  };
  setStoredRunLog(log, brandId);
  setStoredValidSkus(validSkus, brandId);
  setStoredLastSync(now, brandId);
  return Promise.resolve(log);
}

/** Мок: каналы контента по продукту (Fashion Cloud). При API — из PIM/Colect. */
function getContentChannelsForProduct(_p: Product): ContentChannelLink[] {
  return [
    { channelId: 'lookbook', label: 'Лукбук', url: '#', available: true },
    { channelId: 'linesheet', label: 'Лайншит', url: '#', available: true },
    { channelId: '3d', label: '3D', available: false },
    { channelId: 'video', label: 'Видео', url: '#', available: true },
    { channelId: 'extra_media', label: 'Доп. медиа', available: false },
  ];
}

/** Мок: назначить продукту территории/каналы по индексу для проверки прав. При API — из PIM. */
function mockProductVisibility(
  p: Product,
  index: number
): { allowedTerritories?: string[]; allowedChannels?: B2BChannelId[] } {
  const territoriesByIndex: string[][] = [
    ['Moscow', 'Russia'],
    ['SPb', 'Russia'],
    ['Moscow', 'SPb', 'Russia'],
    [],
    ['Moscow'],
    ['SPb'],
  ];
  const channelsByIndex: B2BChannelId[][] = [
    ['wholesale', 'retail_a'],
    ['wholesale', 'retail_b'],
    ['wholesale', 'retail_a', 'retail_b'],
    [],
    ['outlet'],
  ];
  const i = index % 6;
  const ex = syndicationExtras(p);
  return {
    allowedTerritories: ex.allowedTerritories ?? territoriesByIndex[i],
    allowedChannels: ex.allowedChannels ?? channelsByIndex[i],
  };
}

/** Маппинг Product (PIM) → SyndicatedCatalogItem для каталога байера */
function productToSyndicatedItem(p: Product, index: number): SyndicatedCatalogItem {
  const price = typeof p.price === 'number' ? p.price : 0;
  const wholesalePrice = price * 0.4; // мок: оптовая скидка
  const imageUrl = p.images?.[0]?.url ?? '/placeholder.jpg';
  const color = p.color ?? p.availableColors?.[0]?.name ?? '';
  const visibility = mockProductVisibility(p, index);
  const ex = syndicationExtras(p);
  return {
    id: p.id,
    sku: p.sku ?? p.id,
    name: p.name ?? 'Unnamed',
    brand: p.brand ?? 'Syntha Lab',
    category: p.category ?? '',
    season: p.season ?? '',
    price: wholesalePrice,
    priceFormatted: `${Math.round(wholesalePrice).toLocaleString('ru-RU')} ₽`,
    imageUrl,
    attributes: {
      color,
      composition: formatProductComposition(p.composition),
    },
    moq: 6,
    capsule: p.capsule ?? ex.collection ?? '',
    material: p.material ?? formatProductComposition(p.composition),
    color,
    sustainability: syndicationSustainabilityLabel(p),
    contentChannels: getContentChannelsForProduct(p),
    ...visibility,
  };
}

/** Получить каталог байера из PIM (после синдикации). При brandId — фильтр по бренду. При rights — фильтр по территории/каналу. После выгрузки с валидацией — только SKU, прошедшие контракт B2B. */
export function getBuyerCatalog(
  products: Product[],
  brandId?: string,
  rights?: BuyerRights
): SyndicatedCatalogItem[] {
  let list = products;
  if (brandId) {
    const brandNorm = brandId.toLowerCase();
    list = products.filter((p) => (p.brand ?? '').toLowerCase().includes(brandNorm));
  }
  const validIds = getStoredValidSkus(brandId);
  if (validIds !== null) {
    if (validIds.length === 0) {
      list = [];
    } else {
      const set = new Set(validIds);
      list = list.filter((p) => set.has(p.id));
    }
  }
  const items = list.map((p, i) => productToSyndicatedItem(p, i));
  if (rights) {
    return items.filter((item) => isProductVisibleToBuyer(item, rights));
  }
  return items;
}
