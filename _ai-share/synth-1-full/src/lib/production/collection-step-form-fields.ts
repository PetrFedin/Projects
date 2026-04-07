import type { CollectionStep } from '@/lib/production/collection-steps-catalog';

export type StepFieldType = 'text' | 'textarea' | 'number';

export type StepFieldDef = {
  key: string;
  label: string;
  type: StepFieldType;
  placeholder?: string;
};

/** Общий хвост: цели, решения, риски, ссылки — для любого этапа. */
const GENERIC: StepFieldDef[] = [
  {
    key: 'objectives',
    label: 'Цели и критерии успеха',
    type: 'textarea',
    placeholder: 'Что должно быть достигнуто на этом этапе…',
  },
  {
    key: 'keyDecisions',
    label: 'Ключевые решения и договорённости',
    type: 'textarea',
    placeholder: 'Фиксация решений для команды…',
  },
  {
    key: 'risksBlockers',
    label: 'Риски и блокеры',
    type: 'textarea',
    placeholder: 'Что может сорвать сроки или качество…',
  },
  {
    key: 'linksRefs',
    label: 'Ссылки, документы, ID в системах',
    type: 'textarea',
    placeholder: 'URL, номера ТЗ, тикеты…',
  },
];

const BRIEF_FIELDS: StepFieldDef[] = [
  { key: 'season', label: 'Сезон / капсула', type: 'text', placeholder: 'Напр. FW26 Main' },
  {
    key: 'revenueTarget',
    label: 'Целевая выручка коллекции',
    type: 'text',
    placeholder: 'Напр. 45 млн ₽ опт',
  },
  {
    key: 'marginTarget',
    label: 'Целевая маржа',
    type: 'text',
    placeholder: 'Напр. 42% валовая',
  },
  {
    key: 'audience',
    label: 'Аудитория и сегмент',
    type: 'textarea',
    placeholder: 'Кому продаём, ценовой ярус, география…',
  },
  {
    key: 'mood',
    label: 'Настроение, референсы, история бренда',
    type: 'textarea',
    placeholder: 'Образ коллекции, ключевые рефы…',
  },
  {
    key: 'constraints',
    label: 'Ограничения и правила',
    type: 'textarea',
    placeholder: 'Эко, бюджет сырья, сроки, запреты по каналам…',
  },
  {
    key: 'strategicNotes',
    label: 'Доп. заметки для команды',
    type: 'textarea',
    placeholder: 'Всё важное, что не вошло выше…',
  },
];

/**
 * Поля по id этапа из COLLECTION_STEPS (порядок и состав — каталог этапов).
 * Этапы вне карты или новые id получают GENERIC.
 */
const BY_STEP: Record<string, StepFieldDef[]> = {
  brief: BRIEF_FIELDS,
  'assortment-map': [
    { key: 'rangeStructure', label: 'Структура дропов и линий', type: 'textarea', placeholder: 'Дропы, ключевые формы, приоритет линий…' },
    { key: 'sizeScale', label: 'Размерная сетка и особенности', type: 'textarea', placeholder: 'EU/US, unisex, plus, kids…' },
    { key: 'categoryFocus', label: 'Фокус категорий (L1–L3)', type: 'textarea', placeholder: 'Категории, которые тянем в сезон…' },
    { key: 'pricingBand', label: 'Ценовые коридоры по линиям', type: 'textarea', placeholder: 'RRP / опт, ярусы…' },
    ...GENERIC,
  ],
  'collection-hub': [
    { key: 'hubPriorities', label: 'Приоритеты контроля в хабе', type: 'textarea', placeholder: 'Что смотреть ежедневно по коллекции…' },
    { key: 'skuRolloutPlan', label: 'План вывода SKU / дропов', type: 'textarea', placeholder: 'Последовательность публикаций и производства…' },
    ...GENERIC,
  ],
  costing: [
    { key: 'landedCostPolicy', label: 'Политика landed cost', type: 'textarea', placeholder: 'Правила расчёта, валюты, логистика в cost…' },
    { key: 'marginBands', label: 'Коридоры маржи (опт / розница)', type: 'textarea', placeholder: 'По линиям или типам изделий…' },
    { key: 'fxAndDuty', label: 'Курс, пошлины, страхование', type: 'textarea', placeholder: 'Допущения для прогноза…' },
    ...GENERIC,
  ],
  materials: [
    { key: 'materialStrategy', label: 'Стратегия сырья и фурнитуры', type: 'textarea', placeholder: 'Ткани, подклад, YKK, экологичность…' },
    { key: 'supplierShortlist', label: 'Шорт-лист поставщиков', type: 'textarea', placeholder: 'Кто в RFQ, статусы…' },
    { key: 'consumptionNorms', label: 'Нормы расхода (ориентир)', type: 'textarea', placeholder: 'м/изд., запас на брак…' },
    ...GENERIC,
  ],
  'photo-ref': [
    { key: 'visualDirection', label: 'Визуальное направление и референсы', type: 'textarea', placeholder: 'Moodboard, must-have кадры…' },
    { key: 'shootPlan', label: 'План съёмок / студии', type: 'textarea', placeholder: 'Даты, модели, локации…' },
    { key: 'prototypeVisuals', label: 'Прототип: фото и комментарии', type: 'textarea', placeholder: 'Ссылки на снимки образца…' },
    ...GENERIC,
  ],
  'tech-pack': [
    { key: 'tzScope', label: 'Объём ТЗ и перечень артефактов', type: 'textarea', placeholder: 'Лекала, градация, швы, допуски…' },
    { key: 'revisionLog', label: 'Версии и согласованные правки', type: 'textarea', placeholder: 'v1 → v2, кто утвердил…' },
    { key: 'gradingRules', label: 'Правила градации и контрольные мерки', type: 'textarea', placeholder: 'Ключевые точки, рост…' },
    ...GENERIC,
  ],
  'gate-all-stakeholders': [
    { key: 'stakeholderList', label: 'Стороны и роли на «воротах»', type: 'textarea', placeholder: 'Дизайн, тех, закупка, маркетинг…' },
    { key: 'checklistStatus', label: 'Чек-лист согласований', type: 'textarea', placeholder: 'ТЗ · материалы · конструктив — статусы OK…' },
    { key: 'formalDecision', label: 'Формальное решение (go / hold)', type: 'textarea', placeholder: 'Условия перехода к закупке и семплу…' },
    ...GENERIC,
  ],
  'supply-path': [
    { key: 'sourcingDecision', label: 'Решение: закупка / сток / VMI', type: 'textarea', placeholder: 'Что откуда и почему…' },
    { key: 'supplierCommitments', label: 'Обязательства поставщика', type: 'textarea', placeholder: 'Сроки, партии, Incoterms…' },
    { key: 'inboundLogistics', label: 'Логистика прихода в цех', type: 'textarea', placeholder: 'Окна, ответственные за приёмку…' },
    ...GENERIC,
  ],
  samples: [
    { key: 'sampleRound', label: 'Раунд семплов (1 / 2 / PP / TOP)', type: 'text', placeholder: 'Напр. Round 2' },
    { key: 'sampleScope', label: 'Объём: какие SKU / размеры', type: 'textarea', placeholder: 'Перечень или ссылка на список…' },
    { key: 'fitCommentsSummary', label: 'Итог примерок и доработок', type: 'textarea', placeholder: 'Ключевые замечания, решения…' },
    { key: 'goldSampleTarget', label: 'Цель Gold Sample / эталон', type: 'textarea', placeholder: 'Критерии принятия…' },
    ...GENERIC,
  ],
  'b2b-linesheets': [
    { key: 'linesheetCoverage', label: 'Охват лайншитов и лукбуков', type: 'textarea', placeholder: 'Стили, байеры, версии презентаций…' },
    { key: 'b2bPresentationNote', label: 'Статус показов и обещания опту', type: 'textarea', placeholder: 'Даты, каналы, allocation…' },
    ...GENERIC,
  ],
  'production-window': [
    { key: 'factoryAllocation', label: 'Площадка / фабрика и мощность', type: 'textarea', placeholder: 'Линии, загрузка, резерв…' },
    { key: 'processCalendar', label: 'Календарь процессов (раскрой–пошив)', type: 'textarea', placeholder: 'Контрольные даты, буферы…' },
    { key: 'capacityRisks', label: 'Риски мощности и срывов', type: 'textarea', placeholder: 'Праздники, очередь PO…' },
    ...GENERIC,
  ],
  po: [
    { key: 'poList', label: 'PO / заказы в работе', type: 'textarea', placeholder: 'Номера, объёмы, фабрики…' },
    { key: 'qtyAndSizes', label: 'Количества и размерные ряды', type: 'textarea', placeholder: 'Свод по стилям…' },
    { key: 'deliveryCommitments', label: 'Сроки от фабрики', type: 'textarea', placeholder: 'Ex-factory, в цех…' },
    ...GENERIC,
  ],
  'floor-ops': [
    { key: 'bomSync', label: 'Синхронизация BOM с цехом', type: 'textarea', placeholder: 'Актуальность спецификаций…' },
    { key: 'poOpsAudit', label: 'Аудит PO на полу', type: 'textarea', placeholder: 'Расхождения план/факт…' },
    { key: 'factoryComms', label: 'Коммуникации с фабрикой', type: 'textarea', placeholder: 'Ключевые договорённости…' },
    ...GENERIC,
  ],
  'supplies-bind': [
    { key: 'reservationIds', label: 'Брони / резервы (ID, объёмы)', type: 'textarea', placeholder: 'VMI, бронь материалов…' },
    { key: 'cutReadiness', label: 'Готовность к раскрою', type: 'textarea', placeholder: 'Приход сырья под даты раскроя…' },
    { key: 'stockCoverage', label: 'Покрытие стоком', type: 'textarea', placeholder: 'Что закрыто со склада…' },
    ...GENERIC,
  ],
  'nesting-cut': [
    { key: 'nestingJobRef', label: 'Задание nesting / раскрой', type: 'textarea', placeholder: 'ID задачи, ПО, рулоны…' },
    { key: 'yieldFabric', label: 'Выход ткани, % укладки', type: 'textarea', placeholder: 'План/факт укладки…' },
    { key: 'markerFiles', label: 'Маркеры / файлы раскладки', type: 'textarea', placeholder: 'Ссылки на файлы…' },
    ...GENERIC,
  ],
  'floor-execution': [
    { key: 'shiftPlan', label: 'План смен и выход', type: 'textarea', placeholder: 'Смены, бригады…' },
    { key: 'subcontractTrack', label: 'Субподряд (раскрой/пошив)', type: 'textarea', placeholder: 'Исполнители, статусы…' },
    { key: 'videoMilestones', label: 'Видео-контрольные точки', type: 'textarea', placeholder: 'Этапы съёмки на линии…' },
    ...GENERIC,
  ],
  qc: [
    { key: 'inspectionBatches', label: 'Партии на инспекции', type: 'textarea', placeholder: 'PO, партия, AQL…' },
    { key: 'defectLog', label: 'Дефекты и устранение', type: 'textarea', placeholder: 'Критичные / мажорные…' },
    { key: 'releaseDecision', label: 'Решение о выпуске на склад', type: 'textarea', placeholder: 'Условный допуск / брак…' },
    ...GENERIC,
  ],
  'ready-made': [
    { key: 'receiptVsPo', label: 'Приёмка: сверка с PO', type: 'textarea', placeholder: 'Количества, расхождения…' },
    { key: 'warehousePlacement', label: 'Размещение на складе бренда', type: 'textarea', placeholder: 'Зоны, коды ячеек…' },
    { key: 'qualityAtReceipt', label: 'Качество при входе', type: 'textarea', placeholder: 'Замечания при приёмке…' },
    ...GENERIC,
  ],
  'wholesale-prep': [
    { key: 'labelingPackaging', label: 'Маркировка и упаковка', type: 'textarea', placeholder: 'Этикетки, короба, паллеты…' },
    { key: 'b2bOrderMapping', label: 'Привязка к заказам B2B', type: 'textarea', placeholder: 'PO байеров, комплекты…' },
    { key: 'shipPrepDates', label: 'Даты готовности к отгрузке', type: 'textarea', placeholder: 'Окна отгрузки…' },
    ...GENERIC,
  ],
  'b2b-ship-stores': [
    { key: 'asnRefs', label: 'ASN / накладные / трекинг', type: 'textarea', placeholder: 'Номера отправок…' },
    { key: 'retailRoutes', label: 'Маршруты в торговые точки', type: 'textarea', placeholder: 'Ритейлеры, города…' },
    { key: 'deliveryConfirmations', label: 'Подтверждения доставки', type: 'textarea', placeholder: 'Статусы у клиента…' },
    ...GENERIC,
  ],
  sustainability: [
    { key: 'certificates', label: 'Сертификаты и комплаенс', type: 'textarea', placeholder: 'GOTS, OEKO-TEX, локальные требования…' },
    { key: 'productPassport', label: 'Паспорт изделия / traceability', type: 'textarea', placeholder: 'Цепочка материалов, партии…' },
    { key: 'circularActions', label: 'Циркулярность и ESG-инициативы', type: 'textarea', placeholder: 'Переработка, take-back, отчётность…' },
    ...GENERIC,
  ],
};

export function getFormFieldsForStep(stepId: string): StepFieldDef[] {
  return BY_STEP[stepId] ?? GENERIC;
}

/** Есть ли хотя бы одно непустое поле по определениям формы. */
export function hasSubstantiveModuleContent(
  fields: Record<string, string>,
  defs: readonly StepFieldDef[]
): boolean {
  for (const d of defs) {
    if ((fields[d.key] ?? '').trim().length > 0) return true;
  }
  return false;
}

export function initialEmptyFields(step: CollectionStep): Record<string, string> {
  const fields = getFormFieldsForStep(step.id);
  const o: Record<string, string> = {};
  for (const f of fields) o[f.key] = '';
  return o;
}
