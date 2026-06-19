export type PlatformCoreB2bMessageTemplateContext = 'b2b_order' | 'workshop2_article';

export type PlatformCoreB2bMessageTemplate = {
  id: string;
  labelRu: string;
  context: PlatformCoreB2bMessageTemplateContext;
  buildBody: (ctx: { orderId?: string; collectionId?: string; articleId?: string }) => string;
};

export const PLATFORM_CORE_B2B_MESSAGE_TEMPLATES: PlatformCoreB2bMessageTemplate[] = [
  {
    id: 'ship-window',
    labelRu: 'Уточнить отгрузку',
    context: 'b2b_order',
    buildBody: ({ orderId }) =>
      `Добрый день! Уточните, пожалуйста, окно отгрузки по заказу ${orderId ?? '—'}.`,
  },
  {
    id: 'qty-confirm',
    labelRu: 'Подтвердить количество',
    context: 'b2b_order',
    buildBody: ({ orderId }) =>
      `Прошу подтвердить итоговое количество и размерную сетку по заказу ${orderId ?? '—'}.`,
  },
  {
    id: 'production-status',
    labelRu: 'Статус производства',
    context: 'b2b_order',
    buildBody: ({ orderId }) =>
      `Какой текущий статус производства по заказу ${orderId ?? '—'}? Есть ли риски по срокам?`,
  },
  {
    id: 'materials-ready',
    labelRu: 'Материалы готовы',
    context: 'b2b_order',
    buildBody: ({ orderId }) =>
      `Материалы по заказу ${orderId ?? '—'} готовы к передаче. Подтвердите приём на цех.`,
  },
  {
    id: 'article-tz',
    labelRu: 'Уточнить ТЗ',
    context: 'workshop2_article',
    buildBody: ({ collectionId, articleId }) =>
      `По артикулу ${articleId ?? '—'} (${collectionId ?? 'коллекция'}): нужны уточнения по техзаданию перед образцом.`,
  },
  {
    id: 'article-sample',
    labelRu: 'Срок образца',
    context: 'workshop2_article',
    buildBody: ({ articleId }) =>
      `Когда ожидается готовность образца по артикулу ${articleId ?? '—'}?`,
  },
  {
    id: 'article-price-quote',
    labelRu: 'Запрос цены материала',
    context: 'workshop2_article',
    buildBody: ({ collectionId, articleId }) =>
      `По артикулу ${articleId ?? '—'} (${collectionId ?? 'коллекция'}): прошу подтвердить цену и срок поставки материалов по BOM.`,
  },
];

export function resolvePlatformCoreB2bMessageTemplates(ctx: {
  orderId?: string | null;
  collectionId?: string | null;
  articleId?: string | null;
}): PlatformCoreB2bMessageTemplate[] {
  if (ctx.orderId?.trim()) {
    return PLATFORM_CORE_B2B_MESSAGE_TEMPLATES.filter((t) => t.context === 'b2b_order');
  }
  if (ctx.collectionId?.trim() && ctx.articleId?.trim()) {
    return PLATFORM_CORE_B2B_MESSAGE_TEMPLATES.filter((t) => t.context === 'workshop2_article');
  }
  return [];
}
