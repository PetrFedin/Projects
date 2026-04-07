/**
 * Сводки «каталог → таблицы» по галочкам справочника (дефолты + localStorage из ProjectInfoCategoryHandbookFlatTable).
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import { getHandbookCategoryLeaves } from '@/lib/production/category-catalog';
import type { CatalogAudienceFlags } from '@/lib/project-info/category-catalog-audience-flags';
import { defaultAudienceFlagsForCatalogLeaf } from '@/lib/project-info/catalog-audience-defaults';
import type { FootwearCoverageRow } from '@/lib/footwear-size-coverage';

export type KidsHandbookAudience = 'boys' | 'girls' | 'newborn';
export type KidsCoverageSegment = 'clothing' | 'shoes' | 'bags' | 'accessories';

function resolveFlags(
  leaf: HandbookCategoryLeaf,
  flagMap: Record<string, CatalogAudienceFlags>,
): CatalogAudienceFlags {
  return flagMap[leaf.leafId] ?? defaultAudienceFlagsForCatalogLeaf(leaf);
}

function audienceHit(f: CatalogAudienceFlags, a: KidsHandbookAudience): boolean {
  return Boolean(f[a]);
}

function uniqJoin(names: string[]): string {
  const s = [...new Set(names.filter((n) => n && n !== '—'))];
  return s.length ? s.join('; ') : '—';
}

const CLOTHING_L2_ORDER: string[] = [
  'Верхняя одежда',
  'Костюмы и жакеты',
  'Платья и сарафаны',
  'Юбки',
  'Рубашки и блузы',
  'Топы и футболки',
  'Джинсы',
  'Брюки',
  'Трикотаж',
  'Спортивная одежда',
  'Нижнее бельё',
  'Пижамы и домашняя одежда',
  'Пляжная мода',
];

const SHOES_L2_ORDER: string[] = [
  'Кроссовки',
  'Туфли',
  'Ботинки',
  'Сандалии и шлёпанцы',
  'Сапоги',
  'Мокасины и топсайдеры',
  'Угги и унты',
  'Слипоны',
  'Эспадрильи',
  'Мюли',
  'Сабо',
  'Домашняя обувь',
  'Спортивная',
];

const BAGS_L2_ORDER: string[] = [
  'Повседневные',
  'Вечерние',
  'Чемоданы',
  'Рабочие',
  'Спортивные и дорожные',
  'Косметички',
];

const ACCESSORIES_L1_ORDER = ['Аксессуары', 'Головные уборы', 'Носочно-чулочные', 'Аксессуары для новорождённых'];

function segmentL1s(segment: KidsCoverageSegment, audience: KidsHandbookAudience): string[] {
  if (segment === 'clothing') return ['Одежда'];
  if (segment === 'shoes') return ['Обувь'];
  if (segment === 'bags') return ['Сумки'];
  const base = ['Аксессуары', 'Головные уборы', 'Носочно-чулочные'];
  if (audience === 'newborn') base.push('Аксессуары для новорождённых');
  return base;
}

function clothingRowMeta(
  l2: string,
  a: KidsHandbookAudience,
): { sizeTableTitle: string; fetchKey: string; notes: string } | null {
  const n = 'По галочкам справочника категорий для этой аудитории';
  const m: Record<string, Partial<Record<KidsHandbookAudience, { sizeTableTitle: string; fetchKey: string }>>> = {
    'Верхняя одежда': {
      boys: { sizeTableTitle: 'Верхняя одежда (мальчики)', fetchKey: 'sizeChartDataKidsOuterwearBoys' },
      girls: { sizeTableTitle: 'Верхняя одежда (девочки)', fetchKey: 'sizeChartDataKidsOuterwearGirls' },
      newborn: { sizeTableTitle: 'Верхняя одежда — габариты (0–12 м)', fetchKey: 'sizeChartDataKidsNewbornOuterwear' },
    },
    'Костюмы и жакеты': {
      boys: { sizeTableTitle: 'Костюмы и жакеты (мальчики)', fetchKey: 'sizeChartDataKidsSuitsBoys' },
      girls: { sizeTableTitle: 'Костюмы и жакеты (девочки)', fetchKey: 'sizeChartDataKidsSuitsGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    'Платья и сарафаны': {
      girls: { sizeTableTitle: 'Платья и сарафаны (девочки)', fetchKey: 'sizeChartDataKidsDressesGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    Юбки: {
      girls: { sizeTableTitle: 'Юбки (девочки)', fetchKey: 'sizeChartDataKidsSkirtsGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    'Рубашки и блузы': {
      boys: { sizeTableTitle: 'Рубашки, поло, футболки (мальчики)', fetchKey: 'sizeChartDataKidsShirtsTopsBoys' },
      girls: { sizeTableTitle: 'Рубашки, поло, футболки (девочки)', fetchKey: 'sizeChartDataKidsShirtsTopsGirls' },
      newborn: { sizeTableTitle: 'Боди, распашонки, верх — габариты (0–12 м)', fetchKey: 'sizeChartDataKidsNewbornBodysuitsTops' },
    },
    'Топы и футболки': {
      boys: { sizeTableTitle: 'Рубашки, поло, футболки (мальчики)', fetchKey: 'sizeChartDataKidsShirtsTopsBoys' },
      girls: { sizeTableTitle: 'Рубашки, поло, футболки (девочки)', fetchKey: 'sizeChartDataKidsShirtsTopsGirls' },
      newborn: { sizeTableTitle: 'Боди, распашонки, верх — габариты (0–12 м)', fetchKey: 'sizeChartDataKidsNewbornBodysuitsTops' },
    },
    Джинсы: {
      boys: { sizeTableTitle: 'Брюки, джинсы, шорты (мальчики)', fetchKey: 'sizeChartDataKidsBottomsBoys' },
      girls: { sizeTableTitle: 'Брюки, джинсы, шорты (девочки)', fetchKey: 'sizeChartDataKidsBottomsGirls' },
      newborn: { sizeTableTitle: 'Ползунки, брюки — габариты (0–12 м)', fetchKey: 'sizeChartDataKidsNewbornBottoms' },
    },
    Брюки: {
      boys: { sizeTableTitle: 'Брюки, джинсы, шорты (мальчики)', fetchKey: 'sizeChartDataKidsBottomsBoys' },
      girls: { sizeTableTitle: 'Брюки, джинсы, шорты (девочки)', fetchKey: 'sizeChartDataKidsBottomsGirls' },
      newborn: { sizeTableTitle: 'Ползунки, брюки — габариты (0–12 м)', fetchKey: 'sizeChartDataKidsNewbornBottoms' },
    },
    Трикотаж: {
      boys: { sizeTableTitle: 'Трикотаж и спорт (мальчики)', fetchKey: 'sizeChartDataKidsKnitSportBoys' },
      girls: { sizeTableTitle: 'Трикотаж и спорт (девочки)', fetchKey: 'sizeChartDataKidsKnitSportGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    'Спортивная одежда': {
      boys: { sizeTableTitle: 'Трикотаж и спорт (мальчики)', fetchKey: 'sizeChartDataKidsKnitSportBoys' },
      girls: { sizeTableTitle: 'Трикотаж и спорт (девочки)', fetchKey: 'sizeChartDataKidsKnitSportGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    'Нижнее бельё': {
      boys: { sizeTableTitle: 'Нижнее бельё, пижамы, пляж (мальчики)', fetchKey: 'sizeChartDataKidsUnderwearPajamasBeachBoys' },
      girls: { sizeTableTitle: 'Нижнее бельё, пижамы, пляж (девочки)', fetchKey: 'sizeChartDataKidsUnderwearPajamasBeachGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    'Пижамы и домашняя одежда': {
      boys: { sizeTableTitle: 'Нижнее бельё, пижамы, пляж (мальчики)', fetchKey: 'sizeChartDataKidsUnderwearPajamasBeachBoys' },
      girls: { sizeTableTitle: 'Нижнее бельё, пижамы, пляж (девочки)', fetchKey: 'sizeChartDataKidsUnderwearPajamasBeachGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
    'Пляжная мода': {
      boys: { sizeTableTitle: 'Нижнее бельё, пижамы, пляж (мальчики)', fetchKey: 'sizeChartDataKidsUnderwearPajamasBeachBoys' },
      girls: { sizeTableTitle: 'Нижнее бельё, пижамы, пляж (девочки)', fetchKey: 'sizeChartDataKidsUnderwearPajamasBeachGirls' },
      newborn: { sizeTableTitle: 'Одежда (новорождённые, 0–12 м)', fetchKey: 'sizeChartDataKidsNewbornApparel' },
    },
  };
  const row = m[l2]?.[a];
  if (!row) return null;
  return { ...row, notes: n };
}

function clothingSummary(a: KidsHandbookAudience): FootwearCoverageRow {
  const t =
    a === 'boys'
      ? 'Одежда (мальчики)'
      : a === 'girls'
        ? 'Одежда (девочки)'
        : 'Одежда (новорождённые, 0–12 м)';
  const fk =
    a === 'boys'
      ? 'sizeChartDataKidsApparelBoys'
      : a === 'girls'
        ? 'sizeChartDataKidsApparelGirls'
        : 'sizeChartDataKidsNewbornApparel';
  return {
    catalogGroup: 'Сводная таблица',
    catalogLeaves: 'Рост и обхваты по возрасту',
    sizeTableTitle: t,
    fetchKey: fk,
    notes: 'Первая числовая таблица в блоке одежды',
  };
}

function shoesRowMeta(a: KidsHandbookAudience): { sizeTableTitle: string; fetchKey: string; notes: string } {
  if (a === 'newborn') {
    return {
      sizeTableTitle: 'Пинетки EU 16–19; далее общая EU-сетка 18–35',
      fetchKey: 'sizeChartDataNewbornShoes · sizeChartDataKidsShoes',
      notes: 'Кроссовки, ботинки, сандалии для малышей — по миллиметрам стопы из kids-shoes',
    };
  }
  return {
    sizeTableTitle: 'Обувь (детская) — EU',
    fetchKey: 'sizeChartDataKidsShoes',
    notes: 'Длина стопы по EU одна для мальчиков и девочек; модельный ряд в каталоге различается',
  };
}

function bagsRowMeta(l2: string, a: KidsHandbookAudience): { sizeTableTitle: string; fetchKey: string; notes: string } {
  if (a === 'newborn' && (l2 === 'Повседневные' || l2 === 'Спортивные и дорожные')) {
    return {
      sizeTableTitle: 'Сумки у коляски / для ухода (0–12 м)',
      fetchKey: 'sizeChartDataNewbornBags',
      notes: 'Часть строк дублируется в «Аксессуары для новорождённых»',
    };
  }
  return {
    sizeTableTitle: 'Сумки и ранцы (детские)',
    fetchKey: 'sizeChartDataKidsBags',
    notes: 'Габариты — таблица ниже',
  };
}

function accessoriesRowMeta(
  l1: string,
  l2: string,
  a: KidsHandbookAudience,
): { sizeTableTitle: string; fetchKey: string; notes: string } {
  if (l1 === 'Аксессуары для новорождённых') {
    return {
      sizeTableTitle: 'Аксессуары для новорождённых — габариты',
      fetchKey: 'sizeChartDataNewbornAccessories',
      notes: 'Кат. newborn-accessories',
    };
  }
  if (l1 === 'Головные уборы') {
    return {
      sizeTableTitle: a === 'newborn' ? 'Шапочки (новорождённые)' : 'Головные уборы (детские)',
      fetchKey: a === 'newborn' ? 'sizeChartDataNewbornHeadwear' : 'sizeChartDataKidsHats',
      notes: '—',
    };
  }
  if (l1 === 'Носочно-чулочные') {
    return {
      sizeTableTitle: 'Носки (детские)',
      fetchKey: 'kidsAccessoryChartBlocks',
      notes: 'Блок «Носки»',
    };
  }
  const acc: Record<string, { sizeTableTitle: string; fetchKey: string }> = {
    'Перчатки и варежки': { sizeTableTitle: 'Перчатки (детские)', fetchKey: 'kidsAccessoryChartBlocks' },
    'Ремни и подтяжки': { sizeTableTitle: 'Ремни', fetchKey: 'kidsAccessoryChartBlocks' },
    Шарфы: { sizeTableTitle: 'Шарфы…', fetchKey: 'kidsAccessoryChartBlocks' },
    Платки: { sizeTableTitle: 'Платки…', fetchKey: 'kidsAccessoryChartBlocks' },
    Очки: { sizeTableTitle: 'Очки', fetchKey: 'kidsAccessoryChartBlocks' },
    Кольца: { sizeTableTitle: 'Кольца', fetchKey: 'kidsAccessoryChartBlocks' },
    Часы: { sizeTableTitle: 'Часы', fetchKey: 'kidsAccessoryChartBlocks' },
    Кошельки: { sizeTableTitle: 'Кошельки', fetchKey: 'kidsAccessoryChartBlocks' },
    Зонты: { sizeTableTitle: 'Зонты', fetchKey: 'kidsAccessoryChartBlocks' },
  };
  const hit = acc[l2];
  if (hit) {
    return { ...hit, notes: 'Вкладка «Аксессуары»' };
  }
  return {
    sizeTableTitle: `Аксессуары › ${l2}`,
    fetchKey: 'kidsAccessoryChartBlocks',
    notes: 'См. блоки ниже',
  };
}

export function buildKidsHandbookCoverageRows(
  audience: KidsHandbookAudience,
  segment: KidsCoverageSegment,
  flagMap: Record<string, CatalogAudienceFlags>,
): FootwearCoverageRow[] {
  const leaves = getHandbookCategoryLeaves();
  const l1s = new Set(segmentL1s(segment, audience));
  const byGroup = new Map<string, HandbookCategoryLeaf[]>();

  for (const leaf of leaves) {
    if (!l1s.has(leaf.l1Name)) continue;
    const key = `${leaf.l1Name}\t${leaf.l2Name}`;
    const arr = byGroup.get(key) ?? [];
    arr.push(leaf);
    byGroup.set(key, arr);
  }

  const out: FootwearCoverageRow[] = [];

  if (segment === 'clothing') {
    out.push(clothingSummary(audience));
  }

  const groupKeys = [...byGroup.keys()];
  const orderFor = (l1: string, l2: string): number => {
    if (segment === 'clothing') return CLOTHING_L2_ORDER.indexOf(l2);
    if (segment === 'shoes') return SHOES_L2_ORDER.indexOf(l2);
    if (segment === 'bags') return BAGS_L2_ORDER.indexOf(l2);
    const i1 = ACCESSORIES_L1_ORDER.indexOf(l1);
    return i1 === -1 ? 500 + l2.charCodeAt(0) : i1 * 100 + l2.charCodeAt(0);
  };

  groupKeys.sort((a, b) => {
    const [l1a, l2a] = a.split('\t');
    const [l1b, l2b] = b.split('\t');
    if (l1a !== l1b) return l1a.localeCompare(l1b, 'ru');
    const oa = orderFor(l1a, l2a);
    const ob = orderFor(l1b, l2b);
    const ia = oa === -1 ? 999 : oa;
    const ib = ob === -1 ? 999 : ob;
    if (ia !== ib) return ia - ib;
    return l2a.localeCompare(l2b, 'ru');
  });

  for (const gk of groupKeys) {
    const groupLeaves = byGroup.get(gk)!;
    const [l1, l2] = gk.split('\t');
    const matching = groupLeaves.filter((leaf) => audienceHit(resolveFlags(leaf, flagMap), audience));
    if (matching.length === 0) continue;

    const catalogLeaves = uniqJoin(matching.map((l) => l.l3Name));
    const catalogGroup = `${l1} › ${l2}`;

    if (segment === 'clothing') {
      const meta = clothingRowMeta(l2, audience);
      if (!meta) continue;
      out.push({
        catalogGroup,
        catalogLeaves,
        sizeTableTitle: meta.sizeTableTitle,
        fetchKey: meta.fetchKey,
        notes: meta.notes,
      });
    } else if (segment === 'shoes') {
      const sm = shoesRowMeta(audience);
      out.push({
        catalogGroup,
        catalogLeaves,
        sizeTableTitle: sm.sizeTableTitle,
        fetchKey: sm.fetchKey,
        notes: sm.notes,
      });
    } else if (segment === 'bags') {
      const bm = bagsRowMeta(l2, audience);
      out.push({
        catalogGroup,
        catalogLeaves,
        sizeTableTitle: bm.sizeTableTitle,
        fetchKey: bm.fetchKey,
        notes: bm.notes,
      });
    } else {
      const am = accessoriesRowMeta(l1, l2, audience);
      out.push({
        catalogGroup,
        catalogLeaves,
        sizeTableTitle: am.sizeTableTitle,
        fetchKey: am.fetchKey,
        notes: am.notes,
      });
    }
  }

  if (segment === 'shoes') {
    const dedup = new Map<string, FootwearCoverageRow>();
    for (const r of out) {
      dedup.set(r.catalogGroup, r);
    }
    return [...dedup.values()];
  }

  return out;
}
