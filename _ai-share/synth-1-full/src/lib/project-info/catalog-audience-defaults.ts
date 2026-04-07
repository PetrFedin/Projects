import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';

export type CatalogAudienceKey = 'men' | 'women' | 'boys' | 'girls' | 'newborn' | 'other';

export type CatalogAudienceFlags = Record<CatalogAudienceKey, boolean>;

const ADULTS_AND_KIDS: CatalogAudienceFlags = {
  men: true,
  women: true,
  boys: true,
  girls: true,
  newborn: false,
  other: false,
};

const WOMEN_AND_GIRLS: CatalogAudienceFlags = {
  men: false,
  women: true,
  boys: false,
  girls: true,
  newborn: false,
  other: false,
};

const SHOES_WITH_NEWBORN_BASE: CatalogAudienceFlags = {
  men: true,
  women: true,
  boys: true,
  girls: true,
  newborn: true,
  other: false,
};

/** Обувь без размеров новорождённых (по группе L2 или листу L3). */
function shoeExcludesNewborn(l2: string, l3: string): boolean {
  if (['Мюли', 'Сабо', 'Слипоны', 'Эспадрильи'].includes(l2)) return true;
  if (l2 === 'Мокасины и топсайдеры' && l3 === 'Топсайдеры') return true;
  return false;
}

/**
 * Дефолтные галочки по смыслу категории (один общий каталог).
 * Справочник: `src/lib/data/category-handbook.ts` → `npm run gen:category-catalog`.
 */
export function defaultAudienceFlagsForCatalogLeaf(leaf: HandbookCategoryLeaf): CatalogAudienceFlags {
  const l1 = leaf.l1Name.trim();
  const l2 = leaf.l2Name.trim();
  const l3 = leaf.l3Name.trim();

  if (l1 === 'Одежда') {
    if (l3 === 'Пончо' || l3 === 'Кроп-топы') {
      return { ...WOMEN_AND_GIRLS };
    }
    if (l2 === 'Платья и сарафаны' || l2 === 'Юбки') {
      return { ...WOMEN_AND_GIRLS, newborn: true };
    }
    if (l2 === 'Джинсы' || l2 === 'Спортивная одежда') {
      return { ...ADULTS_AND_KIDS, newborn: true };
    }
    if (l2 === 'Топы и футболки' && (l3 === 'Майки' || l3 === 'Поло' || l3 === 'Футболки')) {
      return { ...ADULTS_AND_KIDS, newborn: true };
    }
    if (
      l2 === 'Костюмы и жакеты' &&
      (l3 === 'Костюмы' || l3 === 'Смокинги' || l3 === 'Пиджаки' || l3 === 'Жилеты')
    ) {
      return { ...ADULTS_AND_KIDS, newborn: true };
    }
    if (l2 === 'Трикотаж' && l3 === 'Юбки') {
      return { ...WOMEN_AND_GIRLS, newborn: true };
    }
    if (l2 === 'Трикотаж') {
      return { ...ADULTS_AND_KIDS, newborn: true };
    }

    const f = { ...ADULTS_AND_KIDS };
    if (l2 === 'Верхняя одежда' || l2 === 'Брюки') {
      f.newborn = true;
    }
    if (l2 === 'Нижнее бельё' || l2 === 'Пижамы и домашняя одежда' || l2 === 'Пляжная мода') {
      f.newborn = true;
    }
    if (l3 === 'Шубы' || l3 === 'Рубашки') {
      f.newborn = true;
    }
    return f;
  }

  if (l1 === 'Обувь') {
    if (l2 === 'Сандалии и шлёпанцы' && l3 === 'Босоножки') {
      return { ...WOMEN_AND_GIRLS };
    }
    if (l2 === 'Туфли' && l3 === 'Балетки') {
      return { ...WOMEN_AND_GIRLS };
    }
    const f = { ...SHOES_WITH_NEWBORN_BASE };
    if (shoeExcludesNewborn(l2, l3)) f.newborn = false;
    return f;
  }

  if (l1 === 'Сумки') {
    if (l2 === 'Вечерние') {
      return { ...WOMEN_AND_GIRLS };
    }
    if (l3 === 'Клатч') {
      return { men: false, women: true, boys: false, girls: true, newborn: false, other: false };
    }
    if (l3 === 'Кросс-боди' || l3 === 'Тот') {
      return { men: false, women: false, boys: true, girls: true, newborn: false, other: false };
    }
    if (l3 === 'Дорожные сумки') {
      return { ...ADULTS_AND_KIDS, newborn: true };
    }
    return { ...ADULTS_AND_KIDS };
  }

  if (l1 === 'Аксессуары') {
    const adultsKidsNewborn: CatalogAudienceFlags = { ...ADULTS_AND_KIDS, newborn: true };
    if (l2 === 'Галстуки и бабочки') return { ...adultsKidsNewborn };
    if (l2 === 'Перчатки и варежки') return { ...adultsKidsNewborn };
    if (l2 === 'Шарфы') return { ...adultsKidsNewborn };

    const f = { ...ADULTS_AND_KIDS };
    if (l2 === 'Платки') f.newborn = true;
    if (l2 === 'Ремни и подтяжки' && (l3 === 'Подтяжки' || l3 === 'Ремни')) {
      f.newborn = true;
    }
    return f;
  }

  if (l1 === 'Головные уборы') {
    if (l2 === 'Береты') {
      return { ...WOMEN_AND_GIRLS };
    }
    return { ...SHOES_WITH_NEWBORN_BASE };
  }

  if (l1 === 'Носочно-чулочные') {
    return { ...SHOES_WITH_NEWBORN_BASE };
  }

  if (l1 === 'Красота и уход') {
    return {
      men: true,
      women: true,
      boys: false,
      girls: false,
      newborn: false,
      other: false,
    };
  }

  if (l1 === 'Аксессуары для новорождённых') {
    return {
      men: false,
      women: false,
      boys: false,
      girls: false,
      newborn: true,
      other: false,
    };
  }

  /** Только «Остальное»: без мужчин, женщин, детей и новорождённых. */
  if (l1 === 'Дом и стиль жизни') {
    return {
      men: false,
      women: false,
      boys: false,
      girls: false,
      newborn: false,
      other: true,
    };
  }

  if (l1 === 'Игрушки (детские)') {
    return {
      men: false,
      women: false,
      boys: true,
      girls: false,
      newborn: true,
      other: false,
    };
  }

  return { ...ADULTS_AND_KIDS };
}
