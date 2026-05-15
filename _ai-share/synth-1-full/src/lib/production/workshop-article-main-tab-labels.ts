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
    blurb: 'Паспорт, визуал, материалы и конструкция — единая спецификация до отшива образца.',
  },
  {
    id: 'supply',
    title: 'Снабжение и закупка',
    blurb: 'BOM, брони и альтернативы, без серийного заказа в этом контуре.',
  },
  {
    id: 'fit',
    title: 'Эталон и посадка',
    blurb: 'Замеры, примерка, правки до эталонной посадки и приёмки сэмпла.',
  },
  {
    id: 'plan',
    title: 'План заказа',
    blurb: 'PO, раскрой и готовность к запуску в работу — после закрытия ТЗ.',
  },
  {
    id: 'release',
    title: 'Производство изделия',
    blurb: 'Операции цеха, себестоимость, статус на линии.',
  },
  {
    id: 'qc',
    title: 'Контроль качества',
    blurb: 'Партии, AQL, замечания и решения по браку.',
  },
  {
    id: 'stock',
    title: 'Приёмка изделия',
    blurb: 'Склад, движения и итоговая готовность к отгрузке.',
  },
  {
    id: 'vault',
    title: 'Vault',
    blurb: 'Договоры, сертификаты и финансовые документы.',
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
