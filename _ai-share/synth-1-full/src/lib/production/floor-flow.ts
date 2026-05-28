/**
 * Единая цепочка вкладок «Цех» — порядок и подписи (hint — подсказки в UI).
 * Текст контура на вкладке «Этапы» держите в синхроне с порядком `COLLECTION_STEPS` в `collection-steps-catalog.ts` (без циклического импорта отсюда).
 */

export const PRODUCTION_FLOOR_STEPS = [
  {
    id: 'stages',
    label: 'Этапы · зависимости',
    hint: 'Контур коллекции (исполнение в матрице): бриф → SKU → хаб → маржа → материалы → рефы → Tech Pack → согласования → поставка в цех → семплы → B2B → площадка → PO → операции → снабжение → nesting → выпуск → ОТК → склад → комплектация → отгрузка → ESG. Дорожная карта в переговорах — другой порядок пунктов, см. справку «Гайд бренда» на вкладке «Этапы».',
  },
  {
    id: 'live',
    label: 'LIVE · схема',
    hint: 'Поэтапная схема от брифа до отгрузки: согласования сторон, производство, B2B и логистика — в одном таймлайне с контекстом коллекции.',
  },
  {
    id: 'workshop',
    label: 'Коллекция',
    hint: 'Хаб коллекции в цеху: артикулы, карта этапов, чек-лист и быстрые переходы в модули до запуска серии.',
  },
  {
    id: 'supplies',
    label: 'Снабжение',
    hint: 'Снабжение цеха: VMI, бронирование материалов и фурнитуры под PO и раскрой.',
  },
  {
    id: 'sample',
    label: 'Эталон · fit',
    hint: 'Отшив семплов, лекала на семпл, отправка и примерки; Gold Sample и fit до массового PO.',
  },
  {
    id: 'plan',
    label: 'План · PO',
    hint: 'Площадка, сроки процессов, Gantt и формальный запуск серии (PO) в производство.',
  },
  {
    id: 'nesting',
    label: 'Nesting AI',
    hint: 'Nesting AI · раскрой: укладка лекал на рулон после резервов и до пошива.',
  },
  {
    id: 'launch',
    label: 'Выпуск',
    hint: 'Выпуск в цеху: смены, загрузка линий, видеоэтапы и субподряд по подтверждённым PO.',
  },
  {
    id: 'quality',
    label: 'ОТК',
    hint: 'ОТК: мобильные инспекции, приёмка партий и рабочее место QC перед складом.',
  },
  {
    id: 'receipt',
    label: 'Склад',
    hint: 'Готовый товар и склад бренда: приёмка с производства и остатки по коллекции.',
  },
  {
    id: 'ops',
    label: 'Операции',
    hint: 'Операции: BOM, сводка PO, переписка с фабрикой и аудит исполнения.',
  },
] as const;

export type ProductionFloorTabId = (typeof PRODUCTION_FLOOR_STEPS)[number]['id'];

export const PRODUCTION_FLOOR_TAB_IDS = PRODUCTION_FLOOR_STEPS.map(
  (s) => s.id
) as readonly ProductionFloorTabId[];

export function isProductionFloorTab(v: string | null | undefined): v is ProductionFloorTabId {
  return !!v && (PRODUCTION_FLOOR_TAB_IDS as readonly string[]).includes(v);
}

/** Вкладки, где модули цеха работают в контексте одного артикула (`stagesSku` в URL). «Коллекция» и LIVE — без артикула. */
export const PRODUCTION_FLOOR_TABS_REQUIRE_ARTICLE = [
  'stages',
  'supplies',
  'sample',
  'plan',
  'nesting',
  'launch',
  'quality',
  'receipt',
  'ops',
] as const satisfies readonly ProductionFloorTabId[];

export function productionFloorTabRequiresArticle(tab: ProductionFloorTabId): boolean {
  return (PRODUCTION_FLOOR_TABS_REQUIRE_ARTICLE as readonly string[]).includes(tab);
}
