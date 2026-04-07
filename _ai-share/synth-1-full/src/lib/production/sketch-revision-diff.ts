import type {
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchRevisionSnapshot,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type SketchRevisionPinFieldDiff = {
  field: 'priority' | 'stage' | 'linkedBomLineRef';
  from: string;
  to: string;
};

export type SketchRevisionCompareResult = {
  leafIdA: string;
  leafIdB: string;
  leafMismatch: boolean;
  countA: number;
  countB: number;
  addedIds: string[];
  removedIds: string[];
  changed: Array<{ annotationId: string; diffs: SketchRevisionPinFieldDiff[] }>;
};

function pinKeyFields(a: Workshop2Phase1CategorySketchAnnotation) {
  return {
    priority: a.priority ?? 'important',
    stage: a.stage ?? 'tz',
    linkedBomLineRef: (a.linkedBomLineRef ?? '').trim(),
  };
}

/** Сравнение двух снимков ревизий (один leafId; при несовпадении — флаг leafMismatch). */
export function compareRevisionSnapshots(
  snapA: Workshop2SketchRevisionSnapshot,
  snapB: Workshop2SketchRevisionSnapshot
): SketchRevisionCompareResult {
  const leafMismatch = snapA.leafId !== snapB.leafId;
  const mapA = new Map(snapA.annotations.map((x) => [x.annotationId, x]));
  const mapB = new Map(snapB.annotations.map((x) => [x.annotationId, x]));
  const addedIds: string[] = [];
  const removedIds: string[] = [];
  const changed: Array<{ annotationId: string; diffs: SketchRevisionPinFieldDiff[] }> = [];

  for (const id of mapB.keys()) {
    if (!mapA.has(id)) addedIds.push(id);
  }
  for (const id of mapA.keys()) {
    if (!mapB.has(id)) removedIds.push(id);
  }
  for (const id of mapA.keys()) {
    const pa = mapA.get(id);
    const pb = mapB.get(id);
    if (!pa || !pb) continue;
    const fa = pinKeyFields(pa);
    const fb = pinKeyFields(pb);
    const diffs: SketchRevisionPinFieldDiff[] = [];
    if (fa.priority !== fb.priority) {
      diffs.push({ field: 'priority', from: fa.priority, to: fb.priority });
    }
    if (fa.stage !== fb.stage) {
      diffs.push({ field: 'stage', from: fa.stage, to: fb.stage });
    }
    if (fa.linkedBomLineRef !== fb.linkedBomLineRef) {
      diffs.push({
        field: 'linkedBomLineRef',
        from: fa.linkedBomLineRef || '—',
        to: fb.linkedBomLineRef || '—',
      });
    }
    if (diffs.length) changed.push({ annotationId: id, diffs });
  }

  return {
    leafIdA: snapA.leafId,
    leafIdB: snapB.leafId,
    leafMismatch,
    countA: snapA.annotations.length,
    countB: snapB.annotations.length,
    addedIds,
    removedIds,
    changed,
  };
}
