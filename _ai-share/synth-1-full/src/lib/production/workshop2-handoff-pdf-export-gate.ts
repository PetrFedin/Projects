/**
 * Серверный/клиентский gate PDF handoff — 409-совместимые проверки.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2HandoffPdfExportReadiness } from '@/lib/production/workshop2-handoff-pdf-export-readiness';

export type Workshop2HandoffPdfExportGateCheck = {
  id: string;
  severity: 'blocker' | 'warning';
  messageRu: string;
};

export type Workshop2HandoffPdfExportGateResult = {
  allowed: boolean;
  state: 'blocked' | 'warn' | 'ready';
  checks: Workshop2HandoffPdfExportGateCheck[];
};

export function evaluateWorkshop2HandoffPdfExportGate(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeaf?: HandbookCategoryLeaf | null;
  vaultFileCount?: number;
}): Workshop2HandoffPdfExportGateResult {
  const mirror = input.dossier.handoffPdfMirror;
  const readiness = mirror
    ? {
        hasSketchImage: mirror.hasSketchImage,
        sketchSheetCount: 0,
        openVisualGateCount: mirror.openVisualGateCount,
        handoffReady: mirror.handoffReady,
        blockerCount: mirror.blockerCount,
        state: mirror.state,
        hintRu: mirror.hintRu,
        blockers:
          mirror.state === 'blocked'
            ? [mirror.hintRu ?? 'PDF handoff заблокирован в PG.']
            : mirror.state === 'warn'
              ? [mirror.hintRu ?? 'PDF handoff с предупреждениями.']
              : [],
      }
    : evaluateWorkshop2HandoffPdfExportReadiness(input);
  const checks: Workshop2HandoffPdfExportGateCheck[] = readiness.blockers.map((msg, i) => ({
    id: `handoff_pdf.${i}`,
    severity: readiness.state === 'blocked' ? 'blocker' : 'warning',
    messageRu: msg,
  }));

  if (readiness.state === 'warn' && checks.length === 0 && readiness.hintRu) {
    checks.push({
      id: 'handoff_pdf.warn',
      severity: 'warning',
      messageRu: readiness.hintRu,
    });
  }

  return {
    allowed: readiness.state !== 'blocked',
    state: readiness.state,
    checks,
  };
}
