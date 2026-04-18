/**
 * Единые query-параметры контекста «этапы коллекции → модули бренд-центра».
 * Источник для ссылок с доски, баннера и useProductionStageContext.
 */

import { COLLECTION_STEPS, type CollectionStep } from '@/lib/production/collection-steps-catalog';
import { ROUTES } from '@/lib/routes';

export const STAGES_SKU_PARAM = 'stagesSku';
export const STAGES_STEP_PARAM = 'stagesStep';
export const STAGES_WORK_SKU_PARAM = 'stagesWorkSku';
/** Фильтр узла на «Процесс и правила» (схема). */
export const STAGES_CHAIN_FOCUS_PARAM = 'stagesChainFocus';
/** Один раз открыть панель этапа на вкладке «По артикулам» для stepId; после открытия снимается из URL. */
export const STAGES_SKU_PANEL_STEP_PARAM = 'stagesSkuPanel';
/** Вкладка блока формы в панели этапа (с `stagesSkuPanel`); после открытия снимается из URL. */
export const STAGES_SKU_PANEL_TAB_PARAM = 'stagesSkuPanelTab';
/** Допустимые значения — совпадают с `StageFillEditTab` в чеклисте. */
export const STAGES_SKU_PANEL_TAB_VALUES = [
  'process',
  'people',
  'costs',
  'outputs',
  'files',
] as const;
export type StagesSkuPanelTab = (typeof STAGES_SKU_PANEL_TAB_VALUES)[number];

export function parseStagesSkuPanelTab(raw: string | null | undefined): StagesSkuPanelTab | null {
  const t = raw?.trim() ?? '';
  return (STAGES_SKU_PANEL_TAB_VALUES as readonly string[]).includes(t)
    ? (t as StagesSkuPanelTab)
    : null;
}
/** Фильтр матрицы этапов по значению phase из каталога (точное совпадение). */
export const STAGES_MATRIX_PHASE_PARAM = 'stagesMatrixPhase';
/** Текстовый фильтр строк матрицы (подстрока в названии / фазе / id / зоне), для шаринга вида таблицы. */
export const STAGES_MATRIX_Q_PARAM = 'stagesMatrixQ';
export const COLLECTION_ID_PARAM = 'collectionId';
export const SKU_CODE_PARAM = 'sku';
export const PRODUCT_ID_PARAM = 'productId';

/** Ключ localStorage unified flow (как на странице производства). */
export function collectionFlowStorageKey(collectionIdFromQuery: string): string {
  const t = collectionIdFromQuery?.trim() ?? '';
  return !t || t === 'Investor' ? 'default' : t;
}

export type ParsedStageUrlContext = {
  collectionId: string;
  stagesSku: string;
  stagesStep: string;
  skuCode: string;
  productId: string;
  /** id артикула в flow-store: stagesSku || productId */
  resolvedArticleId: string;
};

export function parseStageUrlSearchParams(searchParams: URLSearchParams): ParsedStageUrlContext {
  const collectionId = searchParams.get(COLLECTION_ID_PARAM)?.trim() ?? '';
  const stagesSku = searchParams.get(STAGES_SKU_PARAM)?.trim() ?? '';
  const stagesStep = searchParams.get(STAGES_STEP_PARAM)?.trim() ?? '';
  const skuCode = searchParams.get(SKU_CODE_PARAM)?.trim() ?? '';
  const productId = searchParams.get(PRODUCT_ID_PARAM)?.trim() ?? '';
  const resolvedArticleId = stagesSku || productId;
  return { collectionId, stagesSku, stagesStep, skuCode, productId, resolvedArticleId };
}

/** Есть ли «хвост» из цепочки этапов (показ баннера / панели). */
export function hasStageFlowTail(ctx: ParsedStageUrlContext): boolean {
  return Boolean(ctx.skuCode || ctx.stagesSku || ctx.productId || ctx.stagesStep);
}

/** Достаточно данных для смены статуса этапа в flow-store. */
export function canBindStageActions(ctx: ParsedStageUrlContext): boolean {
  return Boolean(ctx.stagesStep && ctx.resolvedArticleId);
}

export function getCollectionStepById(stepId: string): CollectionStep | undefined {
  return COLLECTION_STEPS.find((s) => s.id === stepId);
}

export function getPreviousCollectionStep(stepId: string): CollectionStep | null {
  const idx = COLLECTION_STEPS.findIndex((s) => s.id === stepId);
  if (idx <= 0) return null;
  return COLLECTION_STEPS[idx - 1] ?? null;
}

export function getNextCollectionStep(stepId: string): CollectionStep | null {
  const idx = COLLECTION_STEPS.findIndex((s) => s.id === stepId);
  if (idx < 0 || idx >= COLLECTION_STEPS.length - 1) return null;
  return COLLECTION_STEPS[idx + 1] ?? null;
}

export type StageTransitionPreserve = {
  collectionId?: string;
  stagesSku: string;
  productId?: string;
  sku?: string;
  setStagesStepTo: string;
};

/**
 * Собрать href модуля этапа с сохранением контекста коллекции и артикула.
 * Для вкладок цеха подмешивает floorTab.
 */
export function buildStageTransitionHref(
  targetStep: CollectionStep,
  preserve: StageTransitionPreserve
): string {
  const raw = targetStep.href ?? ROUTES.brand.production;
  let pathPart = raw;
  let existingSearch = '';
  if (raw.includes('?')) {
    const i = raw.indexOf('?');
    pathPart = raw.slice(0, i);
    existingSearch = raw.slice(i + 1);
  }
  const params = new URLSearchParams(existingSearch);
  if (preserve.collectionId) params.set(COLLECTION_ID_PARAM, preserve.collectionId);
  else params.delete(COLLECTION_ID_PARAM);

  if (preserve.stagesSku) params.set(STAGES_SKU_PARAM, preserve.stagesSku);
  else params.delete(STAGES_SKU_PARAM);

  if (preserve.productId) params.set(PRODUCT_ID_PARAM, preserve.productId);
  else params.delete(PRODUCT_ID_PARAM);

  if (preserve.sku) params.set(SKU_CODE_PARAM, preserve.sku);
  else params.delete(SKU_CODE_PARAM);

  params.set(STAGES_STEP_PARAM, preserve.setStagesStepTo);

  if (targetStep.productionFloorTab) {
    if (targetStep.productionFloorTab === 'workshop') params.delete('floorTab');
    else params.set('floorTab', targetStep.productionFloorTab);
  }

  const q = params.toString();
  return q ? `${pathPart}?${q}` : pathPart;
}

/** Ссылка «назад к матрице этапов» с тем же контекстом. */
export function buildBackToStagesMatrixHref(ctx: ParsedStageUrlContext): string {
  const params = new URLSearchParams();
  if (ctx.collectionId) params.set(COLLECTION_ID_PARAM, ctx.collectionId);
  params.set('floorTab', 'stages');
  if (ctx.stagesSku) params.set(STAGES_SKU_PARAM, ctx.stagesSku);
  else if (ctx.productId) params.set(STAGES_SKU_PARAM, ctx.productId);
  if (ctx.stagesStep) params.set(STAGES_STEP_PARAM, ctx.stagesStep);
  const q = params.toString();
  return `/brand/production${q ? `?${q}` : ''}`;
}

/** Частичное обновление query на странице производства (контекст этапов). `null` в поле — удалить параметр. */
export type BrandProductionStagesPatch = Partial<{
  floorTab: string | null;
  stagesSub: 'ops' | 'process' | 'sku' | null;
  stagesSku: string | null;
  stagesStep: string | null;
  stagesChainFocus: string | null;
  stagesSkuPanel: string | null;
  stagesSkuPanelTab: string | null;
  stagesMatrixPhase: string | null;
  stagesMatrixQ: string | null;
}>;

function normalizeSearchString(q: string): string {
  return q.startsWith('?') ? q.slice(1) : q;
}

export function applyBrandProductionStagesSearch(
  currentSearch: string,
  patch: BrandProductionStagesPatch
): string {
  const p = new URLSearchParams(normalizeSearchString(currentSearch));
  if ('floorTab' in patch) {
    const v = patch.floorTab;
    if (v === null || v === undefined || v === '' || v === 'workshop') p.delete('floorTab');
    else p.set('floorTab', v);
  }
  if ('stagesSub' in patch) {
    const v = patch.stagesSub;
    if (v === null || v === undefined || v === 'ops') p.delete('stagesSub');
    else p.set('stagesSub', v);
  }
  if ('stagesSku' in patch) {
    const v = patch.stagesSku;
    if (v === null || v === undefined || v === '') p.delete(STAGES_SKU_PARAM);
    else p.set(STAGES_SKU_PARAM, v);
  }
  if ('stagesStep' in patch) {
    const v = patch.stagesStep;
    if (v === null || v === undefined || v === '') p.delete(STAGES_STEP_PARAM);
    else p.set(STAGES_STEP_PARAM, v);
  }
  if ('stagesChainFocus' in patch) {
    const v = patch.stagesChainFocus;
    if (v === null || v === undefined || v === '') p.delete(STAGES_CHAIN_FOCUS_PARAM);
    else p.set(STAGES_CHAIN_FOCUS_PARAM, v);
  }
  if ('stagesSkuPanel' in patch) {
    const v = patch.stagesSkuPanel;
    if (v === null || v === undefined || v === '') p.delete(STAGES_SKU_PANEL_STEP_PARAM);
    else p.set(STAGES_SKU_PANEL_STEP_PARAM, v);
  }
  if ('stagesSkuPanelTab' in patch) {
    const v = patch.stagesSkuPanelTab;
    if (v === null || v === undefined || v === '') p.delete(STAGES_SKU_PANEL_TAB_PARAM);
    else p.set(STAGES_SKU_PANEL_TAB_PARAM, v);
  }
  if ('stagesMatrixPhase' in patch) {
    const v = patch.stagesMatrixPhase;
    if (v === null || v === undefined || v === '') p.delete(STAGES_MATRIX_PHASE_PARAM);
    else p.set(STAGES_MATRIX_PHASE_PARAM, v);
  }
  if ('stagesMatrixQ' in patch) {
    const v = patch.stagesMatrixQ;
    if (v === null || v === undefined || v === '') p.delete(STAGES_MATRIX_Q_PARAM);
    else p.set(STAGES_MATRIX_Q_PARAM, v.slice(0, 120));
  }
  return p.toString();
}

/** Собрать href той же страницы с обновлённым контекстом этапов (сохраняет collectionId и прочие параметры). */
export function buildBrandProductionStagesHref(
  pathname: string,
  currentSearch: string,
  patch: BrandProductionStagesPatch
): string {
  const q = applyBrandProductionStagesSearch(currentSearch, { floorTab: 'stages', ...patch });
  return q ? `${pathname}?${q}` : pathname;
}
