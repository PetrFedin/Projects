import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import {
  getEffectiveDependsOn,
  type ProductionFlowProfileId,
} from '@/lib/production/collection-production-profiles';
import type {
  CollectionSkuFlowDoc,
  MatrixStepStatus,
} from '@/lib/production/unified-sku-flow-store';

export type StagesSubTab = 'ops' | 'process' | 'sku';

export type StagesTabArticle = {
  id: string;
  sku: string;
  name: string;
  currentStageId: string;
  deliveryWindowId?: string;
  audienceId?: string;
  audienceLabel?: string;
  categoryLeafId?: string;
  categoryPathLabel?: string;
  season?: string;
  categoryL1?: string;
  categoryL2?: string;
  categoryL3?: string;
  productionSiteId?: string;
  productionSiteLabel?: string;
  fabricSuppliersLabel?: string;
  fabricStockNote?: string;
  /** Номер заказа (B2B/PO), в котором ведётся артикул — для ссылок в чаты и календарь */
  primaryOrderRef?: string;
};

export type StagesFacetAxis = 'audience' | 'season' | 'l1' | 'l2' | 'l3' | 'fab';

export type StagesFacetSetBundle = Record<StagesFacetAxis, Set<string>>;

/** Вкладка, на которой последний раз меняли срез / перечень / узел схемы (пульс-иконка фильтра только на ней). */
export const STAGES_FILTER_SUB_PARAM = 'stagesFilterSub';

export const DEPS_SCHEMA_CHUNK = 5;

/** Колонок «Доски этапов» в одном ряду (далее — перенос на следующую строку). */
export const BOARD_STAGES_PER_ROW = 4;

export function normalizeStagesSub(raw: string | null): StagesSubTab {
  if (raw === 'process' || raw === 'sku') return raw;
  return 'ops';
}

export function subTabFromStagesParams(params: URLSearchParams): StagesSubTab {
  return normalizeStagesSub(params.get('stagesSub'));
}

export function filterActiveInParams(params: URLSearchParams): boolean {
  if (params.get('stagesChainFocus')) return true;
  if (
    params.get('stagesAudience') ||
    params.get('stagesSeason') ||
    params.get('stagesL1') ||
    params.get('stagesL2') ||
    params.get('stagesL3') ||
    params.get('stagesFab')
  ) {
    return true;
  }
  return false;
}

/** Несколько значений в одном query-параметре: OR внутри оси; между осями — AND. */
export function decodeFacetList(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((x) => {
      const t = x.trim();
      if (!t) return '';
      try {
        return decodeURIComponent(t);
      } catch {
        return t;
      }
    })
    .filter(Boolean);
}

export function encodeFacetList(values: Iterable<string>): string {
  return [...values]
    .sort()
    .map((v) => encodeURIComponent(v))
    .join(',');
}

export function articleMatchesFacetBundle(
  a: StagesTabArticle,
  bundle: StagesFacetSetBundle,
  omit?: StagesFacetAxis
): boolean {
  if (
    omit !== 'audience' &&
    bundle.audience.size > 0 &&
    (!a.audienceId || !bundle.audience.has(a.audienceId))
  )
    return false;
  if (omit !== 'season' && bundle.season.size > 0 && (!a.season || !bundle.season.has(a.season)))
    return false;
  if (omit !== 'l1' && bundle.l1.size > 0 && (!a.categoryL1 || !bundle.l1.has(a.categoryL1)))
    return false;
  if (omit !== 'l2' && bundle.l2.size > 0 && (!a.categoryL2 || !bundle.l2.has(a.categoryL2)))
    return false;
  if (omit !== 'l3' && bundle.l3.size > 0 && (!a.categoryL3 || !bundle.l3.has(a.categoryL3)))
    return false;
  if (
    omit !== 'fab' &&
    bundle.fab.size > 0 &&
    (!a.productionSiteId || !bundle.fab.has(a.productionSiteId))
  )
    return false;
  return true;
}

/** После изменения фильтров: снять метку владельца, если фильтров нет; иначе при setOwner — запомнить вкладку. */
export function finishStagesFilterMutation(params: URLSearchParams, setOwner?: StagesSubTab) {
  if (!filterActiveInParams(params)) {
    params.delete(STAGES_FILTER_SUB_PARAM);
    return;
  }
  if (setOwner !== undefined) {
    params.set(STAGES_FILTER_SUB_PARAM, setOwner);
  }
}

export function chunkStepsForDepsSchema<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function skuDependencySatisfiedForHint(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  depId: string,
  steps: readonly CollectionStep[]
): boolean {
  const depStep = steps.find((x) => x.id === depId);
  const st = doc.skus[skuId]?.stages[depId]?.status ?? 'not_started';
  if (depStep?.relaxesWhenNotStarted && st === 'not_started') return true;
  return st === 'done' || st === 'skipped';
}

/** Что сделать, чтобы двигаться к следующему этапу каталога для одного SKU (зависимости = статусы матрицы). */
export function hintTextForArticleNextCatalogStep(
  doc: CollectionSkuFlowDoc,
  steps: readonly CollectionStep[],
  a: StagesTabArticle,
  skuLabel: string,
  profileId: ProductionFlowProfileId
): string {
  const curId = a.currentStageId;
  const idx = steps.findIndex((s) => s.id === curId);
  const curTitle = steps[idx]?.title ?? curId;
  if (idx < 0) {
    return `${skuLabel}: этап «${curTitle}» не сопоставлен каталогу коллекции — проверьте данные артикула.`;
  }
  if (idx >= steps.length - 1) {
    return `${skuLabel}: по каталогу вы на последнем этапе («${curTitle}»). Дальше — отгрузка, B2B и склады в профильных модулях; статусы поддерживайте в «Матрице этапов».`;
  }
  const next = steps[idx + 1];
  const nextDeps = getEffectiveDependsOn(next, profileId);
  const missing = nextDeps.filter((d) => !skuDependencySatisfiedForHint(doc, a.id, d, steps));
  if (missing.length > 0) {
    const names = missing.map((d) => steps.find((x) => x.id === d)?.title ?? d).join(' · ');
    return `${skuLabel} · сейчас «${curTitle}». Чтобы перейти к «${next.title}», сначала закройте зависимости: ${names} — в «Матрице этапов» для этого артикула отметьте эти этапы «Готово» (или выполните работу в привязанных к строке вкладках).`;
  }
  return `${skuLabel} · сейчас «${curTitle}». Следующий этап — «${next.title}»; зависимости для него закрыты. Завершите работу по «${curTitle}», в матрице отметьте этап «Готово» и ведите «${next.title}» (переходы по ссылкам из матрицы).`;
}

export function getSkuContourNavigationDetail(
  doc: CollectionSkuFlowDoc,
  steps: readonly CollectionStep[],
  a: StagesTabArticle,
  profileId: ProductionFlowProfileId
): {
  cur?: CollectionStep;
  next?: CollectionStep;
  blockedDeps: { id: string; title: string }[];
  atEnd: boolean;
} {
  const curId = a.currentStageId;
  const idx = steps.findIndex((s) => s.id === curId);
  const cur = idx >= 0 ? steps[idx] : undefined;
  const atEnd = idx >= 0 && idx >= steps.length - 1;
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : undefined;
  let blockedDeps: { id: string; title: string }[] = [];
  if (next) {
    blockedDeps = getEffectiveDependsOn(next, profileId)
      .filter((d) => !skuDependencySatisfiedForHint(doc, a.id, d, steps))
      .map((d) => ({ id: d, title: steps.find((x) => x.id === d)?.title ?? d }));
  }
  return { cur, next, blockedDeps, atEnd };
}

/** Локальные черновики коллекции/артикулов (без API) — см. local-collection-inventory. */
export type StagesLocalInventoryTools = {
  collectionId: string;
  totalArticlesInCollection: number;
  poolArticleCount: number;
  contextFilterActive: boolean;
  onResetFacets: () => void;
  localRemovableArticles: { id: string; sku: string }[];
  isUserDefinedCollection: boolean;
  /** true если SKU уже в пуле коллекции */
  isSkuDuplicate: (skuCode: string) => boolean;
  onAddArticle: (skuCode: string, displayName?: string) => boolean;
  onCreateCollection: (rawId: string, displayName: string) => void;
  onRemoveLocalArticle: (articleId: string) => void;
  onRemoveUserCollection: () => void;
  onExportInventory: () => void;
  onImportInventory: (jsonText: string, replaceAll: boolean) => { ok: boolean; message: string };
  /** Экспорт unified SKU flow (localStorage-слой) для текущего collectionFlowKey */
  onExportUnifiedFlow?: () => void;
};

export type StagesLocalInventoryToolsInput = Omit<
  StagesLocalInventoryTools,
  'poolArticleCount' | 'contextFilterActive' | 'onResetFacets'
>;

export function statusLabel(
  s: MatrixStepStatus,
  blocked: boolean,
  profileNa?: boolean
): string {
  if (profileNa) return 'Вне профиля';
  if (blocked) return 'Заблокировано';
  if (s === 'done') return 'Готово';
  if (s === 'in_progress') return 'В работе';
  return 'Не начато';
}
