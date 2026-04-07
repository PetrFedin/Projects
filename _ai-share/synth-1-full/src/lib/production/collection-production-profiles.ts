/**
 * Профили контура производства: ослабляют или переписывают зависимости этапов под сценарий бренда
 * (reorder, CMT, муслин, сток сырья, покупка готового товара, MTO и т.д.).
 * Канонические этапы остаются в COLLECTION_STEPS; меняется только граф блокировок для матрицы и подсказок.
 */

import type { CollectionStep } from '@/lib/production/collection-steps-catalog';

export type ProductionFlowProfileId =
  | 'full_development'
  | 'reorder_carryover'
  | 'prototype_muslin_first'
  | 'materials_on_stock'
  | 'cmt_factory_sample'
  | 'private_label_finished_goods'
  | 'dropship_3pl'
  | 'mto_bespoke';

export const DEFAULT_PRODUCTION_FLOW_PROFILE: ProductionFlowProfileId = 'full_development';

export const PRODUCTION_FLOW_PROFILES: readonly {
  id: ProductionFlowProfileId;
  label: string;
  hint: string;
}[] = [
  {
    id: 'full_development',
    label: 'Новая разработка (полный контур)',
    hint: 'ТЗ → согласования → поставка в цех → семплы → серия; как в базовом каталоге.',
  },
  {
    id: 'reorder_carryover',
    label: 'Reorder / доработка прошлой модели',
    hint: 'Семплы и запуск серии без жёсткой привязки к новому Tech Pack и поставке до образца; каркас и costing уже есть.',
  },
  {
    id: 'prototype_muslin_first',
    label: 'Сначала муслин / прототип',
    hint: 'Образец после материалов, до финального ТЗ; формальное ТЗ и гейт остаются перед закупкой под серию.',
  },
  {
    id: 'materials_on_stock',
    label: 'Сырьё и фурнитура уже на стоке',
    hint: 'Путь «поставка в цех» не ждёт отдельного гейта — приход из стока/VMI.',
  },
  {
    id: 'cmt_factory_sample',
    label: 'CMT: образец и материалы от фабрики',
    hint: 'Семпл после ТЗ и материалов без отдельной ветки поставки бренда до образца.',
  },
  {
    id: 'private_label_finished_goods',
    label: 'Готовый товар (закупка, не своё производство)',
    hint: 'Нет раскроя/смен на своей фабрике; приёмка, ОТК, склад и B2B после коммерческого PO.',
  },
  {
    id: 'dropship_3pl',
    label: 'Дропшип / 3PL (готовая партия под заказ)',
    hint: 'Тот же упрощённый граф, что «готовый товар»: без nesting и выпуска на своей фабрике.',
  },
  {
    id: 'mto_bespoke',
    label: 'MTO / индивидуальные заказы',
    hint: 'Как новая разработка по графу; акцент на согласованиях — отдельные поля чеклиста в модулях.',
  },
];

const FINISHED_GOODS_LIKE_DEPS: Partial<Record<string, string[]>> = {
  'photo-ref': ['materials'],
  'tech-pack': ['materials', 'photo-ref'],
  'gate-all-stakeholders': ['costing', 'tech-pack', 'materials'],
  'supply-path': ['gate-all-stakeholders'],
  samples: ['materials'],
  'b2b-linesheets': ['samples'],
  'production-window': ['costing', 'gate-all-stakeholders'],
  po: ['production-window'],
  'floor-ops': ['po'],
  'supplies-bind': [],
  'nesting-cut': [],
  'floor-execution': [],
  qc: ['po'],
  'ready-made': ['qc'],
  'wholesale-prep': ['ready-made'],
  'b2b-ship-stores': ['wholesale-prep'],
  sustainability: ['materials', 'po'],
};

/** Частичные переопределения dependsOn по id этапа; пустой массив = этап не блокируется предшественниками. */
const PROFILE_STEP_DEPS: Record<
  ProductionFlowProfileId,
  Partial<Record<string, string[] | undefined>>
> = {
  full_development: {},
  reorder_carryover: {
    samples: ['materials', 'costing'],
  },
  prototype_muslin_first: {
    samples: ['materials'],
    'supply-path': ['gate-all-stakeholders'],
    'production-window': ['samples', 'costing', 'supply-path'],
  },
  materials_on_stock: {
    'supply-path': ['materials'],
    'production-window': ['samples', 'costing', 'supply-path'],
  },
  cmt_factory_sample: {
    samples: ['materials', 'tech-pack'],
    'production-window': ['samples', 'costing', 'supply-path'],
  },
  private_label_finished_goods: { ...FINISHED_GOODS_LIKE_DEPS },
  dropship_3pl: { ...FINISHED_GOODS_LIKE_DEPS },
  mto_bespoke: {},
};

export function normalizeProductionFlowProfileId(
  raw: string | null | undefined
): ProductionFlowProfileId {
  const t = raw?.trim() as ProductionFlowProfileId | '';
  if (t && PROFILE_STEP_DEPS[t]) return t;
  return DEFAULT_PRODUCTION_FLOW_PROFILE;
}

/** Визуальный режим этапа: «не по профилю» — не свой цех / не тот сценарий, этап остаётся в каталоге для API и отчётов. */
export type ProductionStageDisplayMode = 'standard' | 'not_applicable';

const PROFILE_STEP_DISPLAY: Record<
  ProductionFlowProfileId,
  Partial<Record<string, ProductionStageDisplayMode>>
> = {
  full_development: {},
  reorder_carryover: {},
  prototype_muslin_first: {},
  materials_on_stock: {},
  cmt_factory_sample: {},
  private_label_finished_goods: {
    'supplies-bind': 'not_applicable',
    'nesting-cut': 'not_applicable',
    'floor-execution': 'not_applicable',
  },
  dropship_3pl: {
    'supplies-bind': 'not_applicable',
    'nesting-cut': 'not_applicable',
    'floor-execution': 'not_applicable',
  },
  mto_bespoke: {},
};

export function getProductionStageDisplayMode(
  stepId: string,
  profileId: ProductionFlowProfileId | undefined
): ProductionStageDisplayMode {
  const p = normalizeProductionFlowProfileId(profileId);
  return PROFILE_STEP_DISPLAY[p]?.[stepId] ?? 'standard';
}

/**
 * Эффективные предшественники для блокировок матрицы и подсказок по контуру SKU.
 */
export function getEffectiveDependsOn(
  step: Pick<CollectionStep, 'id' | 'dependsOn'>,
  profileId: ProductionFlowProfileId | undefined
): string[] {
  const p = normalizeProductionFlowProfileId(profileId);
  const o = PROFILE_STEP_DEPS[p]?.[step.id];
  if (o !== undefined) return [...o];
  return [...step.dependsOn];
}
