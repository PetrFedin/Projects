import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2ProductionPreflightSnapshot } from '@/lib/production/workshop2-production-preflight';

/** Досье после экспорта итогового ТЗ + запись в журнал (без persist / freezeUpdatedAt). */
export function stampDossierAfterFinalTzExport(opts: {
  dossier: Workshop2DossierPhase1;
  format: 'html' | 'pdf';
  updatedByLabel: string;
  skuDraft: string;
  nameDraft: string;
  pathLabel: string;
}): Workshop2DossierPhase1 {
  const { dossier, format, updatedByLabel, skuDraft, nameDraft, pathLabel } = opts;
  const dossierUpdatedAtSnapshot = dossier.updatedAt ?? '';
  const exportedAt = new Date().toISOString();
  const productionPreflight = buildWorkshop2ProductionPreflightSnapshot(dossier);
  const meta = {
    exportedAt,
    exportedBy: updatedByLabel.slice(0, 200),
    format,
    dossierUpdatedAtSnapshot,
    articleSkuSnapshot: skuDraft.trim(),
    articleNameSnapshot: nameDraft.trim(),
    pathLabelSnapshot: pathLabel,
  };
  const productionSnapshot = {
    score: productionPreflight.score,
    blockers: productionPreflight.blockers,
    warnings: productionPreflight.warnings,
    info: [],
    issues: productionPreflight.issues,
    canExportDraft: productionPreflight.blockers.length <= 5,
    canSendToFactory: productionPreflight.canSendToFactory,
    updatedAt: exportedAt,
  };
  const productionExportMeta = {
    exportedAt,
    exportedBy: updatedByLabel.slice(0, 200),
    status: productionPreflight.canSendToFactory ? ('ready_for_factory' as const) : ('draft' as const),
    score: productionPreflight.score,
    blockersCount: productionPreflight.blockers.length,
    warningsCount: productionPreflight.warnings.length,
    dossierUpdatedAtSnapshot,
  };
  return pushTzActionLog(
    {
      ...dossier,
      finalTzDocumentLastExport: meta,
      productionPreflightLastSnapshot: productionSnapshot,
      productionTzLastExport: productionExportMeta,
    },
    updatedByLabel,
    {
      type: 'final_tz_spec_export',
      format,
      dossierUpdatedAtSnapshot,
      pathLabel,
    }
  );
}
