/**
 * ZIP export-tz-bundle: vault binaries + досье (без virus scan).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import { evaluateWorkshop2HandoffReadiness } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2TzExportBundleStatus = {
  vaultFilesWithPath: number;
  hasProductionModel: boolean;
  lastExportAt?: string;
  handoffReady: boolean;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2TzExportBundleStatus(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeafId?: string;
  vaultDocuments: { storagePath?: string | null }[];
}): Workshop2TzExportBundleStatus {
  const vaultFilesWithPath = input.vaultDocuments.filter((d) =>
    Boolean(d.storagePath?.trim())
  ).length;
  const model = ensureWorkshop2ProductionModel(input.dossier);
  const hasProductionModel = (model.materialLines?.length ?? 0) > 0;
  const lastExportAt = input.dossier.productionTzLastExport?.exportedAt;

  const handoff = evaluateWorkshop2HandoffReadiness({
    dossier: input.dossier,
    categoryLeafId: input.categoryLeafId,
    vaultFileCount: vaultFilesWithPath,
  });

  let state: Workshop2TzExportBundleStatus['state'] = 'ready';
  if (vaultFilesWithPath === 0 && !hasProductionModel) {
    state = 'empty';
  } else if (!handoff.ready || vaultFilesWithPath === 0) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'ZIP соберёт досье JSON; vault и BOM пусты — пакет для цеха будет минимальным.';
  } else if (vaultFilesWithPath === 0) {
    hintRu = 'Нет vault-файлов с storage_path — ZIP без бинарников, только JSON досье.';
  } else if (!handoff.ready) {
    hintRu = `ZIP доступен; handoff не готов (ТЗ ${handoff.tzOverallPct}%) — проверьте чеклист перед передачей.`;
  } else if (lastExportAt) {
    hintRu = `Готов к ZIP: ${vaultFilesWithPath} vault-файл(ов), последний export ${lastExportAt.slice(0, 10)}.`;
  } else {
    hintRu = `Готов к ZIP: ${vaultFilesWithPath} vault + routing/grading JSON; virus scan — вне scope.`;
  }

  return {
    vaultFilesWithPath,
    hasProductionModel,
    lastExportAt,
    handoffReady: handoff.ready,
    state,
    hintRu,
  };
}
