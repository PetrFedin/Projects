/**
 * Телеметрия «следующий шаг» для offline-обучения ранжирования (логрег / бустинг) поверх rule-based baseline.
 * Без PII: только sku, обезличенные предупреждения, чеклист решений, primaryAction, хэш bundle, этапы маршрута.
 */

import type {
  Workshop2OverviewBundleSnapshot,
  Workshop2OverviewModel,
} from '@/lib/production/workshop2-overview-model';

const SS_KEY = 'synth.w2.nextStepMl.v1';

function safeSeg(id: string): string {
  return id.replace(/:/g, '_');
}

function articleKey(collectionId: string, articleId: string): string {
  return `${safeSeg(collectionId)}::${safeSeg(articleId)}`;
}

function clipStr(s: string, max: number): string {
  const t = s.trim();
  return t.length <= max ? t : t.slice(0, max);
}

/** DJB2 → hex, детерминированный от строки JSON. */
export function w2HashUtf8(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(16);
}

export type W2NextStepMlSnapshot = {
  warnings: string[];
  decisionItems: Array<{ label: string; filled: boolean; dossierSection: string }>;
  primaryAction: {
    tab: string;
    buttonLabel: string;
    title: string;
    dossierSection?: string;
  };
  routeStages: Array<{ id: string; status: string; pct: number }>;
  bundleHash: string;
};

export type W2NextStepBuffered = {
  snapshotHash: string;
  snapshot: W2NextStepMlSnapshot;
  capturedAtMs: number;
  recommendedTab: string;
  recommendedDossierSection?: string;
};

function stableBundleJson(bundle: Workshop2OverviewBundleSnapshot | null): string {
  try {
    return JSON.stringify(bundle ?? {});
  } catch {
    return '{}';
  }
}

export function buildW2NextStepMlSnapshot(args: {
  warnings: string[];
  model: Workshop2OverviewModel;
  bundle: Workshop2OverviewBundleSnapshot | null;
}): W2NextStepMlSnapshot {
  const bundleHash = w2HashUtf8(stableBundleJson(args.bundle));
  const warnings = args.warnings.map((w) => clipStr(w, 240)).filter(Boolean);
  return {
    warnings,
    decisionItems: args.model.decisionItems.map((d) => ({
      label: clipStr(d.label, 120),
      filled: d.filled,
      dossierSection: d.dossierSection,
    })),
    primaryAction: {
      tab: args.model.primaryAction.tab,
      buttonLabel: clipStr(args.model.primaryAction.buttonLabel, 80),
      title: clipStr(args.model.primaryAction.title, 160),
      dossierSection: args.model.primaryAction.dossierSection,
    },
    routeStages: args.model.routeStages.map((s) => ({
      id: s.id,
      status: s.status,
      pct: Math.round(s.pct),
    })),
    bundleHash,
  };
}

export function hashW2NextStepMlSnapshot(snapshot: W2NextStepMlSnapshot): string {
  return w2HashUtf8(JSON.stringify(snapshot));
}

function readBufMap(): Record<string, W2NextStepBuffered> {
  if (typeof sessionStorage === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as unknown;
    return p && typeof p === 'object' && !Array.isArray(p)
      ? (p as Record<string, W2NextStepBuffered>)
      : {};
  } catch {
    return {};
  }
}

function writeBufMap(m: Record<string, W2NextStepBuffered>): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(SS_KEY, JSON.stringify(m));
  } catch {
    /* quota */
  }
}

/** Обновить буфер снимка для пары коллекция+артикул (текущая вкладка браузера). */
export function w2UpsertNextStepMlBuffer(
  collectionId: string,
  articleId: string,
  snapshot: W2NextStepMlSnapshot
): W2NextStepBuffered {
  const snapshotHash = hashW2NextStepMlSnapshot(snapshot);
  const entry: W2NextStepBuffered = {
    snapshotHash,
    snapshot,
    capturedAtMs: Date.now(),
    recommendedTab: snapshot.primaryAction.tab,
    recommendedDossierSection: snapshot.primaryAction.dossierSection,
  };
  const k = articleKey(collectionId, articleId);
  const map = readBufMap();
  map[k] = entry;
  writeBufMap(map);
  return entry;
}

export function w2ReadNextStepMlBuffer(
  collectionId: string,
  articleId: string
): W2NextStepBuffered | null {
  return readBufMap()[articleKey(collectionId, articleId)] ?? null;
}
