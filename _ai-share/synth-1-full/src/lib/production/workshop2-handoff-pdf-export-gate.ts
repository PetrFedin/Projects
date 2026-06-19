/**
 * Серверный/клиентский gate PDF handoff — 409-совместимые проверки.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { evaluateWorkshop2HandoffPdfExportReadiness } from '@/lib/production/workshop2-handoff-pdf-export-readiness';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

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
    ? (() => {
        const mirrorState = mirror.state;
        const state =
          mirrorState === 'blocked' || mirrorState === 'warn' || mirrorState === 'ready'
            ? mirrorState
            : 'blocked';
        const hintRu = workshop2PgMirrorStr(mirror, 'hintRu');
        return {
          hasSketchImage: mirror.hasSketchImage === true,
          sketchSheetCount: 0,
          openVisualGateCount: workshop2PgMirrorNum(mirror, 'openVisualGateCount'),
          handoffReady: mirror.handoffReady === true,
          blockerCount: workshop2PgMirrorNum(mirror, 'blockerCount'),
          state,
          hintRu,
          blockers:
            state === 'blocked'
              ? [hintRu || 'PDF handoff заблокирован в PG.']
              : state === 'warn'
                ? [hintRu || 'PDF handoff с предупреждениями.']
                : [],
        };
      })()
    : evaluateWorkshop2HandoffPdfExportReadiness(input);
  const checks: Workshop2HandoffPdfExportGateCheck[] = readiness.blockers.map((msg, i) => ({
    id: `handoff_pdf.${i}`,
    severity: readiness.state === 'blocked' ? 'blocker' : 'warning',
    messageRu: typeof msg === 'string' ? msg : 'PDF handoff заблокирован.',
  }));

  if (readiness.state === 'warn' && checks.length === 0 && readiness.hintRu) {
    checks.push({
      id: 'handoff_pdf.warn',
      severity: 'warning',
      messageRu: readiness.hintRu,
    });
  }

  const state: Workshop2HandoffPdfExportGateResult['state'] =
    readiness.state === 'blocked' || readiness.state === 'warn' || readiness.state === 'ready'
      ? readiness.state
      : 'blocked';

  return {
    allowed: state !== 'blocked',
    state,
    checks,
  };
}
