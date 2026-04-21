/**
 * Единый учёт процесса по артикулам коллекции: этап × SKU — статус, ответственные,
 * задержки, затраты, подтверждения, выходы (модели, акты). MVP: localStorage.
 */

import type { CollectionStep } from '@/lib/production/collection-steps-catalog';

export type MatrixStepStatus = 'not_started' | 'in_progress' | 'done';

/** Запись журнала правок по этапу × SKU (MVP: localStorage). */
export type SkuStageAuditEntry = {
  at: string;
  by?: string;
  summary: string;
};

export type SkuStageDetail = {
  status: MatrixStepStatus | 'blocked' | 'skipped';
  assignee?: string;
  role?: string;
  updatedAt?: string;
  updatedBy?: string;
  notes?: string;
  delayDays?: number;
  delayReason?: string;
  costLines?: { label: string; amountRub: number; paid?: boolean }[];
  approvals?: { role: string; name: string; at: string }[];
  /** Семантика `kind`: см. `workshop2-core1-linkage.ts` (например `po`, `floor_batch`). */
  outputs?: { kind: string; ref: string }[];
  /** Ссылки на файлы, пути, ID в DAM — текстом до появления загрузки. */
  attachmentsNotes?: string;
  auditLog?: SkuStageAuditEntry[];
};

export type SkuFlowEntry = {
  label: string;
  stages: Record<string, SkuStageDetail>;
};

export type CollectionSkuFlowDoc = {
  v: 1;
  /** Пресет графа этапов (reorder, готовый товар и т.д.) — см. collection-production-profiles.ts */
  productionProfileId?: string;
  skus: Record<string, SkuFlowEntry>;
};

const STORAGE_PREFIX = 'brand_unified_sku_flow_v1__';

/** Синхронизация UI (баннер этапов, матрица) после записи в localStorage в той же вкладке. */
export const BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT = 'brand-unified-sku-flow-saved';

export function unifiedSkuFlowStorageKey(collectionKey: string): string {
  return `${STORAGE_PREFIX}${collectionKey?.trim() || 'default'}`;
}

function emptyStage(): SkuStageDetail {
  return { status: 'not_started' };
}

const AUDIT_TRACK_KEYS: (keyof SkuStageDetail)[] = [
  'status',
  'assignee',
  'role',
  'notes',
  'delayDays',
  'delayReason',
  'costLines',
  'approvals',
  'outputs',
  'updatedBy',
  'attachmentsNotes',
];

const AUDIT_KEY_LABELS: Partial<Record<keyof SkuStageDetail, string>> = {
  status: 'статус',
  assignee: 'ответственный',
  role: 'роль',
  notes: 'заметки',
  delayDays: 'задержка (дн.)',
  delayReason: 'причина задержки',
  costLines: 'затраты',
  approvals: 'согласования',
  outputs: 'выходы',
  updatedBy: 'кто обновил',
  attachmentsNotes: 'вложения и ссылки',
};

function auditValuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/** Человекочитаемая сводка изменённых полей (без updatedAt / auditLog). */
function summarizeSkuStageChanges(prev: SkuStageDetail, next: SkuStageDetail): string | null {
  const labels: string[] = [];
  for (const k of AUDIT_TRACK_KEYS) {
    if (!auditValuesEqual(prev[k], next[k])) {
      labels.push(AUDIT_KEY_LABELS[k] ?? String(k));
    }
  }
  if (!labels.length) return null;
  return `Изменено: ${labels.join(', ')}`;
}

const MAX_AUDIT_ENTRIES = 40;

/** Добавить строку в журнал этапа (уведомления, согласования) без обязательных правок полей. */
export function appendSkuStageAuditLine(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepId: string,
  line: { summary: string; by?: string }
): CollectionSkuFlowDoc {
  const next = { ...doc, skus: { ...doc.skus } };
  const entry = next.skus[skuId];
  if (!entry) return doc;
  const prev = entry.stages[stepId] ?? emptyStage();
  const at = new Date().toISOString();
  const auditLog = [
    ...(prev.auditLog ?? []).slice(-(MAX_AUDIT_ENTRIES - 1)),
    { at, by: line.by, summary: line.summary },
  ];
  const stages = {
    ...entry.stages,
    [stepId]: { ...prev, auditLog, updatedAt: at },
  };
  next.skus[skuId] = { ...entry, stages };
  return next;
}

export function loadUnifiedSkuFlowDoc(collectionKey: string): CollectionSkuFlowDoc {
  if (typeof window === 'undefined') return { v: 1, skus: {} };
  try {
    const raw = window.localStorage.getItem(unifiedSkuFlowStorageKey(collectionKey));
    if (!raw) return { v: 1, skus: {} };
    const p = JSON.parse(raw) as CollectionSkuFlowDoc;
    if (!p || p.v !== 1 || typeof p.skus !== 'object') return { v: 1, skus: {} };
    return p;
  } catch {
    return { v: 1, skus: {} };
  }
}

export function saveUnifiedSkuFlowDoc(collectionKey: string, doc: CollectionSkuFlowDoc): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(unifiedSkuFlowStorageKey(collectionKey), JSON.stringify(doc));
  window.dispatchEvent(
    new CustomEvent(BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT, { detail: { collectionKey } })
  );
}

export function ensureSkuStages(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  label: string,
  stepIds: readonly string[]
): CollectionSkuFlowDoc {
  const existing = doc.skus[skuId];
  const stages: Record<string, SkuStageDetail> = { ...(existing?.stages ?? {}) };
  let changed = false;
  for (const id of stepIds) {
    if (!stages[id]) {
      stages[id] = emptyStage();
      changed = true;
    }
  }
  const nextLabel = label || skuId;
  if (existing && !changed && existing.label === nextLabel) return doc;
  return {
    ...doc,
    skus: {
      ...doc.skus,
      [skuId]: { label: nextLabel, stages },
    },
  };
}

/** Убрать SKU из документа (удаление локального черновика, импорт-синк). */
export function removeSkuFromUnifiedDoc(
  doc: CollectionSkuFlowDoc,
  skuId: string
): CollectionSkuFlowDoc {
  if (!doc.skus[skuId]) return doc;
  const { [skuId]: _removed, ...rest } = doc.skus;
  return { ...doc, skus: rest };
}

export function patchProductionProfile(
  doc: CollectionSkuFlowDoc,
  productionProfileId: string
): CollectionSkuFlowDoc {
  return { ...doc, productionProfileId };
}

export function patchSkuStage(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  stepId: string,
  patch: Partial<SkuStageDetail>
): CollectionSkuFlowDoc {
  const { auditLog: _patchAudit, ...restPatch } = patch;
  if (Object.keys(restPatch).length === 0) return doc;

  const next = { ...doc, skus: { ...doc.skus } };
  const entry = next.skus[skuId];
  if (!entry) return doc;
  const prev = entry.stages[stepId] ?? emptyStage();
  const updatedAt = new Date().toISOString();
  const merged: SkuStageDetail = {
    ...prev,
    ...restPatch,
    updatedAt,
    auditLog: prev.auditLog,
  };

  const summary = summarizeSkuStageChanges(prev, merged);
  if (summary) {
    merged.auditLog = [
      ...(merged.auditLog ?? []).slice(-(MAX_AUDIT_ENTRIES - 1)),
      { at: updatedAt, by: merged.updatedBy ?? prev.updatedBy, summary },
    ];
  }

  const stages = {
    ...entry.stages,
    [stepId]: merged,
  };
  next.skus[skuId] = { ...entry, stages };
  return next;
}

/** Применить один статус ко всем артикулам на этапе (кнопки матрицы) */
export function setStageStatusForAllSkus(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  stepId: string,
  status: MatrixStepStatus,
  updatedBy?: string
): CollectionSkuFlowDoc {
  let d = doc;
  for (const skuId of skuIds) {
    if (!d.skus[skuId]) continue;
    d = patchSkuStage(d, skuId, stepId, { status, updatedBy });
  }
  return d;
}

/** Агрегат по всем SKU коллекции для строки матрицы и баннера «Где вы сейчас» */
export function aggregateStepStatusForSkus(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  stepId: string
): MatrixStepStatus {
  if (skuIds.length === 0) return 'not_started';
  const statuses: SkuStageDetail['status'][] = skuIds.map(
    (id) => doc.skus[id]?.stages[stepId]?.status ?? 'not_started'
  );
  if (statuses.every((s) => s === 'done' || s === 'skipped')) {
    if (statuses.some((s) => s === 'done')) return 'done';
    return 'not_started';
  }
  if (statuses.some((s) => s === 'blocked')) return 'in_progress';
  if (statuses.some((s) => s === 'in_progress')) return 'in_progress';
  if (statuses.some((s) => s === 'done')) return 'in_progress';
  return 'not_started';
}

/** Карта stepId → агрегированный статус */
export function buildAggregateStatusMap(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  steps: readonly Pick<CollectionStep, 'id'>[]
): Record<string, MatrixStepStatus> {
  const m: Record<string, MatrixStepStatus> = {};
  for (const s of steps) {
    m[s.id] = aggregateStepStatusForSkus(doc, skuIds, s.id);
  }
  return m;
}

/** Сколько артикулов закрыли этап (готово или пропуск) */
export function aggregateSkuDoneCount(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  stepId: string
): number {
  if (skuIds.length === 0) return 0;
  return skuIds.filter((id) => {
    const s = doc.skus[id]?.stages[stepId]?.status ?? 'not_started';
    return s === 'done' || s === 'skipped';
  }).length;
}

export function aggregateSkuProgressLine(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  stepId: string
): string {
  if (skuIds.length === 0) return '—';
  const n = aggregateSkuDoneCount(doc, skuIds, stepId);
  return `${n}/${skuIds.length} арт.`;
}

/** Зависимость выполнена по всем артикулам (для блокировки строк матрицы) */
export function aggregateDepSatisfied(
  doc: CollectionSkuFlowDoc,
  skuIds: readonly string[],
  depId: string,
  depStep: Pick<CollectionStep, 'relaxesWhenNotStarted'> | undefined
): boolean {
  if (skuIds.length === 0) return true;
  const list = skuIds.map((id) => doc.skus[id]?.stages[depId]?.status ?? 'not_started');
  if (depStep?.relaxesWhenNotStarted && list.every((s) => s === 'not_started')) return true;
  return list.every((s) => s === 'done' || s === 'skipped');
}

/**
 * Первый этап по каталогу, который ещё не «готов/пропуск» в матрице статусов.
 * Для UI «где сейчас артикул» в производстве используйте {@link getSkuDataGatedCurrentStepId} из `stage-data-fill-spec`
 * (сначала обязательные данные чеклиста по порядку этапов, затем эта логика).
 */
export function getSkuCurrentProcessStepId(
  doc: CollectionSkuFlowDoc,
  skuId: string,
  orderedStepIds: readonly string[]
): string {
  if (orderedStepIds.length === 0) return '';
  const entry = doc.skus[skuId];
  if (!entry) return orderedStepIds[0];
  for (const sid of orderedStepIds) {
    const st = entry.stages[sid]?.status ?? 'not_started';
    if (st === 'done' || st === 'skipped') continue;
    return sid;
  }
  return orderedStepIds[orderedStepIds.length - 1];
}

export function isSkuStepDone(doc: CollectionSkuFlowDoc, skuId: string, stepId: string): boolean {
  const st = doc.skus[skuId]?.stages[stepId]?.status ?? 'not_started';
  return st === 'done' || st === 'skipped';
}
