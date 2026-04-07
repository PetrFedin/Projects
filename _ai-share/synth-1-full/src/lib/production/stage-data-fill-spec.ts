/**
 * Чеклист заполнения данных по этапу × SKU: разные поля и обязательность под модуль этапа.
 * Процент 0–100 — по фактическому заполнению полей в едином процессе (не «готово в цепочке»).
 * Ключи в STAGE_FILL_BY_STEP — в том же порядке, что этапы в `COLLECTION_STEPS` (удобство чтения и согласованность с каталогом).
 */

import type { CollectionSkuFlowDoc, SkuStageDetail } from '@/lib/production/unified-sku-flow-store';
import { getSkuCurrentProcessStepId } from '@/lib/production/unified-sku-flow-store';

const t = (s?: string) => (s ?? '').trim();

export function hasNonEmptyNotes(row: SkuStageDetail): boolean {
  return !!(t(row.notes) || t(row.delayReason));
}

export function hasAssignee(row: SkuStageDetail): boolean {
  return !!t(row.assignee);
}

export function hasRole(row: SkuStageDetail): boolean {
  return !!t(row.role);
}

export function hasMeaningfulCostLines(row: SkuStageDetail): boolean {
  return (row.costLines ?? []).some((l) => t(l.label) && (Number(l.amountRub) || 0) > 0);
}

export function hasApprovals(row: SkuStageDetail): boolean {
  return (row.approvals ?? []).some((a) => t(a.name));
}

export function hasOutputs(row: SkuStageDetail): boolean {
  return (row.outputs ?? []).some((o) => t(o.kind) && t(o.ref));
}

export function hasAttachmentsNotes(row: SkuStageDetail): boolean {
  return !!t(row.attachmentsNotes);
}

/** Статус отличен от «не начато» — второстепенный маркер активности в контуре. */
export function statusTracked(row: SkuStageDetail): boolean {
  return row.status !== 'not_started';
}

/** Вкладка окна «По артикулам», где править поле под пункт чеклиста. */
export type StageFillEditTab = 'process' | 'people' | 'costs' | 'outputs' | 'files';

export const STAGE_FILL_EDIT_TAB_LABELS: Record<StageFillEditTab, string> = {
  process: 'Процесс',
  people: 'Ответственные',
  costs: 'Затраты',
  outputs: 'Выходы',
  files: 'Вложения',
};

const EDIT_TAB_BY_ITEM_ID: Record<string, StageFillEditTab> = {
  owner: 'people',
  role: 'people',
  rfq: 'people',
  signoff: 'people',
  approvals: 'people',
  'margin-track': 'people',
  'cost-lines': 'costs',
  costs: 'costs',
  outputs: 'outputs',
  'pim-map': 'outputs',
  'tp-pack': 'outputs',
  'media-out': 'outputs',
  'sample-artifacts': 'outputs',
  ls: 'outputs',
  'po-ref': 'outputs',
  ops: 'outputs',
  nest: 'outputs',
  exec: 'outputs',
  qc: 'outputs',
  wh: 'outputs',
  kit: 'outputs',
  ship: 'outputs',
  'mat-bom': 'outputs',
  esg: 'files',
  supply: 'process',
  slot: 'process',
  vmi: 'files',
  attachments: 'files',
  'brief-text': 'process',
  record: 'process',
  'status-active': 'process',
  notes: 'process',
  'hub-note': 'process',
};

export function inferEditTabForFillItemId(id: string): StageFillEditTab {
  return EDIT_TAB_BY_ITEM_ID[id] ?? 'process';
}

export type StageFillCriterion = {
  id: string;
  label: string;
  required: boolean;
  /** Что ожидается в UI модуля этапа (вкладка цеха / внешний маршрут). */
  moduleHint?: string;
  filled: (row: SkuStageDetail) => boolean;
};

function crit(
  id: string,
  label: string,
  required: boolean,
  filled: (row: SkuStageDetail) => boolean,
  moduleHint?: string
): StageFillCriterion {
  return { id, label, required, filled, moduleHint };
}

/** Универсальный fallback, если этап не описан явно. */
export const DEFAULT_STAGE_FILL: readonly StageFillCriterion[] = [
  crit('owner', 'Ответственный за этап', true, hasAssignee, 'Модуль этапа или вкладка «Люди»'),
  crit('record', 'Фиксация в контуре (комментарий / задержка)', true, hasNonEmptyNotes, 'Вкладка «Процесс»'),
  crit('status-active', 'Статус этапа обновлён', false, statusTracked, 'Вкладка «Процесс»'),
];

const STAGE_FILL_BY_STEP: Record<string, readonly StageFillCriterion[]> = {
  brief: [
    crit('brief-text', 'Бриф: цели, сезон, экономика (текст)', true, hasNonEmptyNotes, 'Коллекция в цеху · бриф'),
    crit('owner', 'Ответственный за бриф', true, hasAssignee, 'Назначение в модуле или «Люди»'),
    crit('role', 'Роль в этапе', false, hasRole, '«Люди»'),
    crit('outputs', 'Зафиксированные выходы (документы, ссылки)', false, hasOutputs, '«Выходы»'),
    crit('attachments', 'Вложения и ссылки', false, hasAttachmentsNotes, '«Вложения»'),
  ],
  'assortment-map': [
    crit('pim-map', 'Карта артикула в PIM (тип, ссылка на карточку)', true, hasOutputs, 'Продукты · PIM'),
    crit('owner', 'Ответственный за карту SKU', true, hasAssignee, '«Люди»'),
    crit('notes', 'Исключения и примечания', false, hasNonEmptyNotes, '«Процесс»'),
    crit('attachments', 'Чертежи, refs', false, hasAttachmentsNotes, '«Вложения»'),
  ],
  'collection-hub': [
    crit('hub-note', 'Статус и заметка по хабу коллекции', true, hasNonEmptyNotes, 'Коллекция в цеху'),
    crit('owner', 'Ответственный', true, hasAssignee, '«Люди»'),
    crit('outputs', 'Быстрые ссылки / выходы хаба', false, hasOutputs, '«Выходы»'),
    crit('status-active', 'Статус в контуре', false, statusTracked, '«Процесс»'),
  ],
  costing: [
    crit('cost-lines', 'Строки себестоимости с суммами (₽)', true, hasMeaningfulCostLines, 'Бюджет · факт'),
    crit('margin-track', 'Согласование маржи или комментарий', true, (r) => hasApprovals(r) || hasNonEmptyNotes(r), 'Сообщения, задачи → «Люди»'),
    crit('owner', 'Ответственный за costing', true, hasAssignee, '«Люди»'),
    crit('outputs', 'Ссылки на прайс / версии расчёта', false, hasOutputs, '«Выходы»'),
  ],
  materials: [
    crit('mat-bom', 'Материалы, поставщик, нормы (артефакты или текст)', true, (r) => hasOutputs(r) || hasAttachmentsNotes(r), 'Материалы · BOM'),
    crit('owner', 'Ответственный', true, hasAssignee, '«Люди»'),
    crit('rfq', 'RFQ / согласование поставщика', false, hasApprovals, '«Люди» · подтверждения'),
    crit('notes', 'Комментарии по материалам', false, hasNonEmptyNotes, '«Процесс»'),
  ],
  'photo-ref': [
    crit('media-out', 'Референсы / медиа (тип + ссылка)', true, hasOutputs, 'Медиа'),
    crit('owner', 'Ответственный за визуал', false, hasAssignee, '«Люди»'),
    crit('attachments', 'Доп. ссылки на файлы', false, hasAttachmentsNotes, '«Вложения»'),
  ],
  'tech-pack': [
    crit('tp-pack', 'ТЗ: лекала, версии, ссылки (выходы или вложения)', true, (r) => hasOutputs(r) || hasAttachmentsNotes(r), 'Tech pack'),
    crit('owner', 'Ответственный (конструктор / тех)', true, hasAssignee, '«Люди»'),
    crit('notes', 'Швы, размеры, примечания', false, hasNonEmptyNotes, '«Процесс»'),
    crit('approvals', 'Согласование ТЗ', false, hasApprovals, '«Люди»'),
  ],
  'gate-all-stakeholders': [
    crit('signoff', 'Подтверждения сторон (кто согласовал)', true, hasApprovals, 'LIVE процесс · сообщения'),
    crit('owner', 'Координатор согласования', true, hasAssignee, '«Люди»'),
    crit('notes', 'Итог совещания / решения', false, hasNonEmptyNotes, '«Процесс»'),
  ],
  'supply-path': [
    crit('supply', 'Поставка: заказ / сток (заметка или выход)', true, (r) => hasNonEmptyNotes(r) || hasOutputs(r), 'Закупка · сток'),
    crit('owner', 'Ответственный закупки', true, hasAssignee, '«Люди»'),
    crit('costs', 'Логистика / стоимость поставки', false, hasMeaningfulCostLines, '«Затраты»'),
  ],
  samples: [
    crit('sample-artifacts', 'Семпл: партия, эталон, fit (выходы)', true, hasOutputs, 'Семпл · Gold sample'),
    crit('owner', 'Ответственный', true, hasAssignee, '«Люди»'),
    crit('notes', 'Комментарии примерки', false, hasNonEmptyNotes, '«Процесс»'),
    crit('attachments', 'Фото / акт', false, hasAttachmentsNotes, '«Вложения»'),
  ],
  'b2b-linesheets': [
    crit('ls', 'Лайншит / лукбук (выходы или вложения)', true, (r) => hasOutputs(r) || hasAttachmentsNotes(r), 'B2B linesheets'),
    crit('owner', 'Ответственный B2B', false, hasAssignee, '«Люди»'),
  ],
  'production-window': [
    crit('slot', 'Площадка и сроки (фиксация в контуре)', true, (r) => hasNonEmptyNotes(r) || hasOutputs(r), 'Фабрики · план'),
    crit('owner', 'Ответственный за производство', true, hasAssignee, '«Люди»'),
    crit('approvals', 'Согласование календаря', false, hasApprovals, '«Люди»'),
  ],
  po: [
    crit('po-ref', 'PO / запуск серии (номер, ссылка)', true, (r) => hasOutputs(r) || hasNonEmptyNotes(r), 'Gantt · план PO'),
    crit('owner', 'Ответственный', true, hasAssignee, '«Люди»'),
    crit('costs', 'Суммы по PO', false, hasMeaningfulCostLines, '«Затраты»'),
  ],
  'floor-ops': [
    crit('ops', 'BOM / сводка операций', true, (r) => hasOutputs(r) || hasNonEmptyNotes(r), 'Операции цеха'),
    crit('owner', 'Ответственный', false, hasAssignee, '«Люди»'),
    crit('attachments', 'Аудит / вложения', false, hasAttachmentsNotes, '«Вложения»'),
  ],
  'supplies-bind': [
    crit('vmi', 'Резерв / поставка в цех', true, (r) => hasNonEmptyNotes(r) || hasAttachmentsNotes(r), 'Снабжение · VMI'),
    crit('owner', 'Ответственный снабжения', true, hasAssignee, '«Люди»'),
  ],
  'nesting-cut': [
    crit('nest', 'Раскрой / nesting (файл, ссылка)', true, (r) => hasOutputs(r) || hasAttachmentsNotes(r), 'Nesting AI'),
    crit('owner', 'Ответственный', true, hasAssignee, '«Люди»'),
  ],
  'floor-execution': [
    crit('exec', 'Выпуск: смены / факт', true, (r) => hasNonEmptyNotes(r) || hasOutputs(r), 'Выпуск · смены'),
    crit('owner', 'Ответственный цеха', true, hasAssignee, '«Люди»'),
  ],
  qc: [
    crit('qc', 'ОТК: акт / статус партии', true, (r) => hasOutputs(r) || hasNonEmptyNotes(r), 'ОТК · качество'),
    crit('owner', 'Ответственный QC', true, hasAssignee, '«Люди»'),
    crit('approvals', 'Подпись приёмки', false, hasApprovals, '«Люди»'),
  ],
  'ready-made': [
    crit('wh', 'Приёмка готового товара на склад', true, (r) => hasOutputs(r) || hasNonEmptyNotes(r), 'Склад · готовый товар'),
    crit('owner', 'Ответственный склада', true, hasAssignee, '«Люди»'),
  ],
  'wholesale-prep': [
    crit('kit', 'Комплектация под B2B', true, (r) => hasOutputs(r) || hasNonEmptyNotes(r), 'Склад · комплектация'),
    crit('owner', 'Ответственный', true, hasAssignee, '«Люди»'),
  ],
  'b2b-ship-stores': [
    crit('ship', 'Отгрузка / ASN / трекинг', true, (r) => hasOutputs(r) || hasNonEmptyNotes(r), 'B2B · отгрузки'),
    crit('owner', 'Ответственный логистики', true, hasAssignee, '«Люди»'),
  ],
  sustainability: [
    crit('esg', 'ESG: сертификаты, паспорт (текст или выходы)', true, (r) => hasAttachmentsNotes(r) || hasOutputs(r), 'ESG'),
    crit('owner', 'Ответственный устойчивость', false, hasAssignee, '«Люди»'),
    crit('notes', 'Комплаенс / примечания', false, hasNonEmptyNotes, '«Процесс»'),
  ],
};

export function getStageFillCriteria(stepId: string): readonly StageFillCriterion[] {
  return STAGE_FILL_BY_STEP[stepId] ?? DEFAULT_STAGE_FILL;
}

export type StageFillEvaluationItem = {
  id: string;
  label: string;
  required: boolean;
  filled: boolean;
  moduleHint?: string;
  /** Вкладка диалога для редактирования этого пункта. */
  editTab: StageFillEditTab;
};

export type StageFillEvaluation = {
  percent: number;
  items: StageFillEvaluationItem[];
  requiredFilled: number;
  requiredTotal: number;
  optionalFilled: number;
  optionalTotal: number;
};

/** Обязательные поля дают 65% шкалы, дополнительные — 35% (если доп. нет — только обязательные → 100%). */
export function evaluateStageDataFill(stepId: string, row: SkuStageDetail): StageFillEvaluation {
  const criteria = getStageFillCriteria(stepId);
  const items: StageFillEvaluationItem[] = criteria.map((c) => ({
    id: c.id,
    label: c.label,
    required: c.required,
    filled: c.filled(row),
    moduleHint: c.moduleHint,
    editTab: inferEditTabForFillItemId(c.id),
  }));

  const req = items.filter((i) => i.required);
  const opt = items.filter((i) => !i.required);
  const reqF = req.filter((i) => i.filled).length;
  const optF = opt.filter((i) => i.filled).length;
  const reqT = Math.max(req.length, 1);
  const optT = opt.length;

  let percent: number;
  if (optT === 0) {
    percent = Math.round((100 * reqF) / reqT);
  } else {
    percent = Math.round(100 * (0.65 * (reqF / reqT) + 0.35 * (optF / optT)));
  }

  return {
    percent: Math.min(100, Math.max(0, percent)),
    items,
    requiredFilled: reqF,
    requiredTotal: req.length,
    optionalFilled: optF,
    optionalTotal: optT,
  };
}

/**
 * Текущий этап артикула с учётом обязательных полей: нельзя «быть» на следующем этапе,
 * пока на предыдущих по порядку каталога не закрыты обязательные пункты чеклиста.
 * После того как по всем этапам обязательные данные есть — используется логика статусов матрицы.
 */
export function getSkuDataGatedCurrentStepId(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  orderedStepIds: readonly string[]
): string {
  if (orderedStepIds.length === 0) return '';
  const entry = doc.skus[skuId];
  if (!entry) return orderedStepIds[0];

  for (const sid of orderedStepIds) {
    const row = entry.stages[sid] ?? { status: 'not_started' as const };
    const ev = evaluateStageDataFill(sid, row);
    if (ev.requiredTotal > 0 && ev.requiredFilled < ev.requiredTotal) {
      return sid;
    }
  }

  return getSkuCurrentProcessStepId(doc, skuId, orderedStepIds) || orderedStepIds[orderedStepIds.length - 1];
}
