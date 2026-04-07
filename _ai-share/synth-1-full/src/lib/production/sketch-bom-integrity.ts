import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchRevisionSnapshot,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';

export type BomRefIntegrityStatus =
  | 'empty'
  | 'no_snapshot'
  | 'in_baseline'
  | 'not_in_baseline'
  | 'also_in_live_set';

/** Уникальные непустые BOM-ref из снимка (последний по времени для leaf уже выбран снаружи). */
export function bomRefsFromSnapshotAnnotations(
  annotations: Workshop2Phase1CategorySketchAnnotation[],
  leafId: string
): Set<string> {
  const set = new Set<string>();
  for (const a of annotations) {
    if (!sketchPinBelongsToLeaf(a, leafId)) continue;
    const r = (a.linkedBomLineRef ?? '').trim();
    if (r) set.add(r);
  }
  return set;
}

/** Живой набор ref с текущих меток ветки. */
export function bomRefsFromLiveAnnotations(
  annotations: Workshop2Phase1CategorySketchAnnotation[],
  leafId: string
): Set<string> {
  return bomRefsFromSnapshotAnnotations(annotations, leafId);
}

/**
 * Уникальные непустые `linkedBomLineRef` с master-скетча и всех листов для листа каталога.
 */
export function bomRefsUnionFromSketchSurfaces(
  masterAnnotations: Workshop2Phase1CategorySketchAnnotation[] | undefined,
  sheets: { annotations: Workshop2Phase1CategorySketchAnnotation[] }[] | undefined,
  leafId: string
): string[] {
  const merged = new Set<string>();
  for (const r of bomRefsFromLiveAnnotations(masterAnnotations ?? [], leafId)) merged.add(r);
  for (const sheet of sheets ?? []) {
    for (const r of bomRefsFromLiveAnnotations(sheet.annotations ?? [], leafId)) merged.add(r);
  }
  return [...merged].sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }));
}

/**
 * Последний снимок ревизии для leaf (по полю at).
 */
export function latestRevisionSnapshotForLeaf(
  snapshots: Workshop2SketchRevisionSnapshot[] | undefined,
  leafId: string
): Workshop2SketchRevisionSnapshot | undefined {
  if (!snapshots?.length) return undefined;
  const own = snapshots.filter((s) => s.leafId === leafId);
  if (own.length === 0) return undefined;
  return [...own].sort((a, b) => a.at.localeCompare(b.at)).at(-1);
}

export function classifyBomLineRef(
  ref: string | undefined,
  baseline: Set<string> | undefined,
  live: Set<string>
): BomRefIntegrityStatus {
  const t = (ref ?? '').trim();
  if (!t) return 'empty';
  if (!baseline || baseline.size === 0) return 'no_snapshot';
  if (baseline.has(t)) {
    return live.has(t) ? 'also_in_live_set' : 'in_baseline';
  }
  return 'not_in_baseline';
}
