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

export function w2ArticleMainTabMeta(
  tab: Workshop2ArticleMainTab
): { title: string; blurb: string; raciLine: string } {
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
