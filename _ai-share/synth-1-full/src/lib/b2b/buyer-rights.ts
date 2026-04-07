/**
 * NuORDER: права по территории и каналу — что видит байер в каталоге и в матрице.
 * Фильтрация продуктов по allowedTerritories / allowedChannels для текущего партнёра.
 */

export type B2BChannelId = 'wholesale' | 'retail_a' | 'retail_b' | 'outlet' | 'ecom' | 'marketplace';

export interface BuyerRights {
  /** Территории, к которым привязан партнёр (видит только продукты для этих территорий) */
  allowedTerritories: string[];
  /** Каналы сбыта (wholesale, retail_a, outlet и т.д.) */
  allowedChannels: B2BChannelId[];
  /** Ценовые уровни, доступные партнёру */
  allowedPriceTiers: ('retail_a' | 'retail_b' | 'outlet')[];
}

const STORAGE_KEY_TERRITORY = 'b2b_buyer_territory';
const STORAGE_KEY_CHANNELS = 'b2b_buyer_channels';

/** Мок: текущие права байера. При API — из профиля партнёра. */
export function getCurrentBuyerRights(): BuyerRights {
  if (typeof window === 'undefined') {
    return {
      allowedTerritories: ['Moscow', 'SPb', 'Russia'],
      allowedChannels: ['wholesale', 'retail_a', 'retail_b'],
      allowedPriceTiers: ['retail_a', 'retail_b'],
    };
  }
  try {
    const territories = localStorage.getItem(STORAGE_KEY_TERRITORY);
    const channels = localStorage.getItem(STORAGE_KEY_CHANNELS);
    return {
      allowedTerritories: territories ? JSON.parse(territories) : ['Moscow', 'SPb', 'Russia'],
      allowedChannels: channels ? JSON.parse(channels) : ['wholesale', 'retail_a', 'retail_b'],
      allowedPriceTiers: ['retail_a', 'retail_b'],
    };
  } catch {
    return {
      allowedTerritories: ['Moscow', 'SPb', 'Russia'],
      allowedChannels: ['wholesale', 'retail_a', 'retail_b'],
      allowedPriceTiers: ['retail_a', 'retail_b'],
    };
  }
}

export function setCurrentBuyerTerritories(territories: string[]) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY_TERRITORY, JSON.stringify(territories));
}

export function setCurrentBuyerChannels(channels: B2BChannelId[]) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
}

/** Продукт может иметь ограничения по территории/каналу (при API — из PIM/ассортимента). */
export interface ProductVisibility {
  /** Территории, в которых продукт доступен (пусто = все) */
  allowedTerritories?: string[];
  /** Каналы, в которых продукт доступен (пусто = все) */
  allowedChannels?: B2BChannelId[];
}

/** Проверка: доступен ли продукт текущему байеру по правам территории/канала. */
export function isProductVisibleToBuyer(
  product: ProductVisibility,
  rights: BuyerRights
): boolean {
  if (product.allowedTerritories && product.allowedTerritories.length > 0) {
    const hasTerritory = product.allowedTerritories.some((t) => rights.allowedTerritories.includes(t));
    if (!hasTerritory) return false;
  }
  if (product.allowedChannels && product.allowedChannels.length > 0) {
    const hasChannel = product.allowedChannels.some((c) => rights.allowedChannels.includes(c));
    if (!hasChannel) return false;
  }
  return true;
}

/** Мок видимости по индексу (как в content-syndication). Пустой массив = продукт доступен всем. */
const MOCK_TERRITORIES_BY_INDEX: string[][] = [['Moscow', 'Russia'], ['SPb', 'Russia'], ['Moscow', 'SPb', 'Russia'], [], ['Moscow'], ['SPb']];
const MOCK_CHANNELS_BY_INDEX: B2BChannelId[][] = [['wholesale', 'retail_a'], ['wholesale', 'retail_b'], ['wholesale', 'retail_a', 'retail_b'], [], ['outlet']];

/** Фильтр списка продуктов по правам байера (территория/канал). Для продуктов без полей видимости используется мок по индексу. */
export function getProductsVisibleToBuyer<T extends { id?: string }>(
  products: T[],
  rights: BuyerRights,
  getVisibility?: (p: T, index: number) => ProductVisibility
): T[] {
  return products.filter((p, i) => {
    const visibility = getVisibility
      ? getVisibility(p, i)
      : {
          allowedTerritories: (p as any).allowedTerritories ?? MOCK_TERRITORIES_BY_INDEX[i % 6],
          allowedChannels: (p as any).allowedChannels ?? MOCK_CHANNELS_BY_INDEX[i % 6],
        };
    return isProductVisibleToBuyer(visibility, rights);
  });
}
