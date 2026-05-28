/**
 * Покрытие скетчей: канон, листы, метки BOM-ref, снимок ревизии.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  bomRefsUnionFromSketchSurfaces,
  latestRevisionSnapshotForLeaf,
} from '@/lib/production/sketch-bom-integrity';
import { buildMaterialSketchBomStrip } from '@/lib/production/workshop2-material-bom-sketch-strip';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';

export type Workshop2SketchCoverageSummary = {
  hasCanonImage: boolean;
  sheetCount: number;
  sheetsWithImage: number;
  sketchPinTotal: number;
  bomRefCount: number;
  hasRevisionSnapshot: boolean;
  bomStripState: 'na' | 'ok' | 'warn';
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function evaluateWorkshop2SketchCoverage(
  dossier: Workshop2DossierPhase1 | null | undefined,
  categoryLeafId: string | null | undefined
): Workshop2SketchCoverageSummary | null {
  if (!dossier) return null;
  const leafId = categoryLeafId?.trim() ?? '';
  const hasCanonImage = Boolean(dossier.categorySketchImageDataUrl?.trim());
  const sheets = normalizeSketchSheets(dossier.sketchSheets);
  const sheetsWithImage = sheets.filter((s) => Boolean(s.imageDataUrl?.trim())).length;
  const sheetCount = sheets.length;

  const liveAnnotations = [
    ...(dossier.categorySketchAnnotations ?? []),
    ...sheets.flatMap((s) => s.annotations ?? []),
  ];
  const sketchPinTotal = liveAnnotations.filter(
    (a) => !leafId || a.categoryLeafId === leafId || !a.categoryLeafId
  ).length;

  const bomRefCount = leafId
    ? bomRefsUnionFromSketchSurfaces(
        dossier.categorySketchAnnotations,
        sheets.map((s) => ({ annotations: s.annotations ?? [] })),
        leafId
      ).length
    : 0;

  const revisionSnapshots = dossier.categorySketchRevisionSnapshots;
  const hasRevisionSnapshot = leafId
    ? Boolean(latestRevisionSnapshotForLeaf(revisionSnapshots, leafId))
    : false;

  const bomStrip = leafId
    ? buildMaterialSketchBomStrip(leafId, dossier.categorySketchAnnotations, revisionSnapshots)
    : {
        state: 'na' as const,
        title: '',
        bullets: [],
        primaryTarget: 'sketch' as const,
        anchorId: '',
        jumpLabel: '',
      };

  const hasVisual = hasCanonImage || sheetsWithImage > 0;
  let state: Workshop2SketchCoverageSummary['state'] = 'empty';
  if (hasVisual && sketchPinTotal > 0 && bomStrip.state !== 'warn') state = 'ready';
  else if (hasVisual || sketchPinTotal > 0) state = 'partial';

  let hintRu: string | undefined;
  if (!hasVisual) {
    hintRu = 'Нет изображения скетча — загрузите канон или лист с подложкой.';
  } else if (sketchPinTotal === 0) {
    hintRu = 'Скетч есть, но нет меток — расставьте привязки к узлам BOM для цеха.';
  } else if (bomStrip.state === 'warn') {
    hintRu = bomStrip.bullets[0] ?? 'Проверьте связь меток скетча с BOM-ref.';
  } else if (!hasRevisionSnapshot && bomRefCount > 0) {
    hintRu = 'Зафиксируйте снимок ревизии скетча после расстановки меток.';
  }

  return {
    hasCanonImage,
    sheetCount,
    sheetsWithImage,
    sketchPinTotal,
    bomRefCount,
    hasRevisionSnapshot,
    bomStripState: bomStrip.state,
    state,
    hintRu,
  };
}
