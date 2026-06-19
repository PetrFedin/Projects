/**
 * Release gate: factory pack complete → showroom / handoff.
 */
import type { Workshop2FinalTzSpecExportContext } from '@/lib/production/workshop2-final-tz-spec-export';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  WORKSHOP2_TECHPACK_EXPORT_SHEETS,
  summarizeWorkshop2TechPackExportReadiness,
} from '@/lib/production/workshop2-techpack-export-sheets';
import type { Workshop2TechPackExportOptions } from '@/lib/production/workshop2-techpack-export-sheets';

export type Workshop2TechPackReleaseGate = {
  ready: boolean;
  sheetsReady: number;
  sheetsTotal: number;
  qtyBridged: boolean;
  blockersRu: string[];
  sheetBlockers: { sheetNo: number; titleRu: string; missingRu: string[] }[];
};

export function assessWorkshop2TechPackReleaseGate(input: {
  dossier: Workshop2DossierPhase1;
  ctx: Workshop2FinalTzSpecExportContext;
  exportOptions?: Workshop2TechPackExportOptions;
}): Workshop2TechPackReleaseGate {
  const summary = summarizeWorkshop2TechPackExportReadiness(input.dossier, input.ctx);
  const qtyBridged = (input.exportOptions?.qtyByColorSize?.length ?? 0) > 0;
  const sheetBlockers = summary.rows
    .filter((r) => !r.ok)
    .map((r) => {
      const meta = WORKSHOP2_TECHPACK_EXPORT_SHEETS.find((s) => s.id === r.id);
      return {
        sheetNo: meta?.sheetNo ?? 0,
        titleRu: meta?.titleRu ?? r.id,
        missingRu: r.missingRu,
      };
    });
  const blockersRu: string[] = [];
  for (const b of sheetBlockers) {
    blockersRu.push(`Лист ${b.sheetNo}: ${b.missingRu.join(', ')}`);
  }
  if (!qtyBridged) {
    blockersRu.push('Qty color×size: нет bridge (matrix / working order / досье)');
  }
  const sheetsComplete = summary.sheetsReady === summary.sheetsTotal;
  return {
    ready: sheetsComplete && qtyBridged,
    sheetsReady: summary.sheetsReady,
    sheetsTotal: summary.sheetsTotal,
    qtyBridged,
    blockersRu,
    sheetBlockers,
  };
}
