/**
 * Colect: карта партнёров / территории — кто где торгует, конфликты территории, статус эксклюзива.
 */

export interface PartnerTerritory {
  partnerId: string;
  partnerName: string;
  /** Регион/территория (город, округ, страна) */
  region: string;
  /** Уникальный ключ региона для группировки (например Moscow, SPb) */
  regionKey: string;
  /** Эксклюзивный партнёр в этой территории */
  isExclusive: boolean;
  status: 'active' | 'pending' | 'suspended';
  /** Для отображения на карте: порядок или кластер */
  order?: number;
}

const STORAGE_KEY = 'b2b_partner_territories';

const SEED: PartnerTerritory[] = [
  {
    partnerId: 'podium',
    partnerName: 'Podium (Москва)',
    region: 'Москва / ЦФО',
    regionKey: 'Moscow',
    isExclusive: true,
    status: 'active',
    order: 1,
  },
  {
    partnerId: 'tsum',
    partnerName: 'ЦУМ (Москва)',
    region: 'Москва / ЦФО',
    regionKey: 'Moscow',
    isExclusive: false,
    status: 'active',
    order: 2,
  },
  {
    partnerId: 'boutique7',
    partnerName: 'Boutique No.7 (СПб)',
    region: 'Санкт-Петербург / СЗФО',
    regionKey: 'SPb',
    isExclusive: true,
    status: 'active',
    order: 1,
  },
  {
    partnerId: 'galery',
    partnerName: 'Galery (СПб)',
    region: 'Санкт-Петербург / СЗФО',
    regionKey: 'SPb',
    isExclusive: false,
    status: 'active',
    order: 2,
  },
  {
    partnerId: 'krasnodar1',
    partnerName: 'Юг Торг (Краснодар)',
    region: 'Краснодар / ЮФО',
    regionKey: 'Krasnodar',
    isExclusive: true,
    status: 'active',
    order: 1,
  },
  {
    partnerId: 'ekb1',
    partnerName: 'Урал Ритейл (Екатеринбург)',
    region: 'Екатеринбург / УрФО',
    regionKey: 'Ekb',
    isExclusive: true,
    status: 'active',
    order: 1,
  },
];

function load(): PartnerTerritory[] {
  if (typeof window === 'undefined') return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function save(data: PartnerTerritory[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getPartnerTerritories(brandId?: string): PartnerTerritory[] {
  return load();
}

/** Группировка по региону (regionKey). */
export function getPartnersByRegion(): {
  regionKey: string;
  region: string;
  partners: PartnerTerritory[];
}[] {
  const list = load();
  const byRegion = new Map<string, { region: string; partners: PartnerTerritory[] }>();
  list.forEach((p) => {
    const existing = byRegion.get(p.regionKey);
    if (!existing) {
      byRegion.set(p.regionKey, { region: p.region, partners: [p] });
    } else {
      existing.partners.push(p);
    }
  });
  return Array.from(byRegion.entries()).map(([regionKey, { region, partners }]) => ({
    regionKey,
    region,
    partners: partners.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
  }));
}

/** Конфликты: в одном регионе несколько партнёров, при этом хотя бы один помечен эксклюзивом — конфликт. */
export interface TerritoryConflict {
  regionKey: string;
  region: string;
  partners: PartnerTerritory[];
  /** Есть ли эксклюзив в регионе (тогда второй партнёр — потенциальный конфликт) */
  hasExclusive: boolean;
  message: string;
}

export function getTerritoryConflicts(): TerritoryConflict[] {
  const byRegion = getPartnersByRegion();
  const conflicts: TerritoryConflict[] = [];
  byRegion.forEach(({ regionKey, region, partners }) => {
    const exclusive = partners.filter((p) => p.isExclusive);
    const hasExclusive = exclusive.length > 0;
    const multiple = partners.length > 1;
    if (multiple && hasExclusive) {
      conflicts.push({
        regionKey,
        region,
        partners,
        hasExclusive: true,
        message: `В регионе ${region} эксклюзив у ${exclusive[0].partnerName}; также торгуют: ${partners
          .filter((p) => !p.isExclusive)
          .map((p) => p.partnerName)
          .join(', ')}`,
      });
    } else if (multiple) {
      conflicts.push({
        regionKey,
        region,
        partners,
        hasExclusive: false,
        message: `В регионе ${region} несколько партнёров без эксклюзива: ${partners.map((p) => p.partnerName).join(', ')}`,
      });
    }
  });
  return conflicts;
}
