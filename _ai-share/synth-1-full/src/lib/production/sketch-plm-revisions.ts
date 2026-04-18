import type {
  Workshop2CategorySketchCompliance,
  Workshop2DossierPhase1,
  Workshop2Phase1CategorySketchAnnotation,
  Workshop2SketchRevisionSnapshot,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { sketchPinBelongsToLeaf } from '@/lib/production/workshop2-sketch-pin-templates';

const MAX_SNAPSHOTS = 24;

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `snap-${Date.now()}`;
}

/** Добавить неизменяемый снимок меток текущей ветки (master). */
export function appendCategorySketchRevisionSnapshot(
  dossier: Workshop2DossierPhase1,
  args: {
    leafId: string;
    by: string;
    revisionLabel: string;
    annotations: Workshop2Phase1CategorySketchAnnotation[];
    compliance?: Workshop2CategorySketchCompliance;
  }
): Workshop2DossierPhase1 {
  const own = args.annotations.filter((a) => sketchPinBelongsToLeaf(a, args.leafId));
  const snap: Workshop2SketchRevisionSnapshot = {
    snapshotId: newId(),
    at: new Date().toISOString(),
    by: args.by.trim() || '—',
    revisionLabel: args.revisionLabel.trim() || '—',
    leafId: args.leafId,
    annotations: JSON.parse(JSON.stringify(own)) as Workshop2Phase1CategorySketchAnnotation[],
    complianceCopy: args.compliance ? { ...args.compliance } : undefined,
  };
  const prev = dossier.categorySketchRevisionSnapshots ?? [];
  return { ...dossier, categorySketchRevisionSnapshots: [...prev, snap].slice(-MAX_SNAPSHOTS) };
}
