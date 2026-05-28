import type { Workshop2ArticleMainTab } from '@/lib/production/workshop2-collection-metrics';

/** Вкладки воркспейса артикула (без «Обзор» в полоске). */
export const W2_ARTICLE_MAIN_TAB_STRIP: readonly {
  id: Workshop2ArticleMainTab;
  title: string;
  blurb: string;
}[] = [
  {
    id: 'tz',
    title: 'Техническое задание',
    blurb: 'Паспорт, визуал, материалы и конструкция.',
  },
  {
    id: 'supply',
    title: 'Снабжение',
    blurb: 'Спецификация (BOM) и бронь материалов.',
  },
  {
    id: 'fit',
    title: 'Примерка',
    blurb: 'Замеры, комментарии и правки до идеальной посадки.',
  },
  {
    id: 'plan',
    title: 'План заказа',
    blurb: 'Сроки и план запуска в работу.',
  },
  {
    id: 'release',
    title: 'Производство',
    blurb: 'Статус пошива и маршрут по цеху.',
  },
  {
    id: 'qc',
    title: 'Контроль качества',
    blurb: 'Чек-листы проверки и фото дефектов.',
  },
  {
    id: 'stock',
    title: 'Приёмка',
    blurb: 'Приход на склад и готовность к отгрузке.',
  },
  {
    id: 'vault',
    title: 'Документы и финансы',
    blurb: 'Договоры, счета и себестоимость.',
  },
] as const;

/** Wave 14 RU: порядок вкладок по умолчанию (SS27 journey-first). */
export const WORKSHOP2_RU_TAB_ORDER_DEFAULT = [
  'tz',
  'plan',
  'supply',
  'fit',
  'release',
  'qc',
  'stock',
  'vault',
] as const satisfies readonly Workshop2ArticleMainTab[];

export const WORKSHOP2_RU_TAB_ORDER_STORAGE_KEY = 'w2-tab-order-ru';

/** Применяет RU порядок один раз из localStorage (если ещё не сохранён). */
export function applyWorkshop2RuMainTabOrderOnce<T extends { id: Workshop2ArticleMainTab }>(
  tabs: readonly T[],
  storage: Pick<Storage, 'getItem' | 'setItem'> | null
): T[] {
  if (!storage || tabs.length === 0) return [...tabs];
  const existing = storage.getItem(WORKSHOP2_RU_TAB_ORDER_STORAGE_KEY);
  if (!existing) {
    storage.setItem(WORKSHOP2_RU_TAB_ORDER_STORAGE_KEY, WORKSHOP2_RU_TAB_ORDER_DEFAULT.join(','));
  }
  const orderRaw = storage.getItem(WORKSHOP2_RU_TAB_ORDER_STORAGE_KEY);
  const order = (orderRaw ?? WORKSHOP2_RU_TAB_ORDER_DEFAULT.join(','))
    .split(',')
    .map((s) => s.trim()) as Workshop2ArticleMainTab[];
  const byId = new Map(tabs.map((t) => [t.id, t]));
  const sorted: T[] = [];
  for (const id of order) {
    const row = byId.get(id);
    if (row) sorted.push(row);
  }
  for (const t of tabs) {
    if (!sorted.includes(t)) sorted.push(t);
  }
  return sorted;
}

export function w2ArticleMainTabMeta(tab: Workshop2ArticleMainTab): {
  title: string;
  blurb: string;
  raciLine: string;
} {
  if (tab === 'overview') {
    return w2ArticleMainTabMeta('tz');
  }
  const row = W2_ARTICLE_MAIN_TAB_STRIP.find((r) => r.id === tab);
  return {
    title: row?.title ?? 'Техническое задание',
    blurb: '',
    raciLine: '',
  };
}
