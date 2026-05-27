/**
 * Готовность к exportTzHandoffPdfOnly / sketch-only bundle (честные blockers).
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';
import { normalizeSketchSheets } from '@/lib/production/workshop2-sketch-sheets';
import {
  buildWorkshop2VisualGateItems,
  collectWorkshop2VisualSectionWarnings,
} from '@/lib/production/workshop2-visual-section-warnings';

export type Workshop2HandoffPdfExportReadiness = {
  hasSketchImage: boolean;
  sketchSheetCount: number;
  openVisualGateCount: number;
  handoffReady: boolean;
  blockerCount: number;
  state: 'blocked' | 'warn' | 'ready';
  hintRu?: string;
  blockers: string[];
};

export function evaluateWorkshop2HandoffPdfExportReadiness(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeaf?: HandbookCategoryLeaf | null;
  vaultFileCount?: number;
}): Workshop2HandoffPdfExportReadiness {
  const sheets = normalizeSketchSheets(input.dossier.sketchSheets);
  const hasSketchImage =
    Boolean(input.dossier.categorySketchImageDataUrl?.trim()) ||
    sheets.some((s) => Boolean(s.imageDataUrl?.trim()));

  const visualGateMessages = collectWorkshop2VisualSectionWarnings(
    input.dossier,
    input.categoryLeaf ?? null
  );
  const openVisualGateCount = buildWorkshop2VisualGateItems(
    input.dossier,
    input.categoryLeaf ?? null
  ).length;

  const handoff = evaluateWorkshop2HandoffReadiness({
    dossier: input.dossier,
    categoryLeafId: input.categoryLeaf?.leafId,
    vaultFileCount: input.vaultFileCount ?? 0,
  });

  const blockers: string[] = [];
  if (!hasSketchImage) {
    blockers.push('Нет изображения скетча (канон или лист) — PDF будет пустым.');
  }
  if (openVisualGateCount > 0) {
    blockers.push(
      visualGateMessages[0] ?? `Визуальный gate: ${openVisualGateCount} незакрытых пунктов.`
    );
  }
  if (!handoff.ready) {
    const firstBlocker = handoff.checks.find((c) => c.severity === 'blocker');
    if (firstBlocker) blockers.push(firstBlocker.messageRu);
  }

  let state: Workshop2HandoffPdfExportReadiness['state'] = 'ready';
  if (blockers.length > 0 && !hasSketchImage) state = 'blocked';
  else if (blockers.length > 0) state = 'warn';

  let hintRu: string | undefined;
  if (state === 'blocked') {
    hintRu = blockers[0];
  } else if (state === 'warn') {
    hintRu = `${blockers.length} предупреждений — PDF можно сформировать, но пакет не полный для цеха.`;
  } else {
    hintRu = `Готово к PDF: ${sheets.length + (input.dossier.categorySketchImageDataUrl ? 1 : 0)} доек скетча.`;
  }

  return {
    hasSketchImage,
    sketchSheetCount: sheets.length,
    openVisualGateCount,
    handoffReady: handoff.ready,
    blockerCount: blockers.length,
    state,
    hintRu,
    blockers,
  };
}
