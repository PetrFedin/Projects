/**
 * Экономика образца: rollup BOM vs draft / target FOB.
 */
import { computeWorkshop2BomCostingRollup } from '@/lib/production/workshop2-bom-costing';
import type { Workshop2SampleEconomicsDraft } from '@/lib/production/workshop2-sample-economics.types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { computeSampleEconomicsDraftTotal } from '@/lib/production/workshop2-sample-economics';

export type Workshop2SampleEconomicsRollupStatus = {
  estimatedFob: number;
  draftTotal: number;
  bomRollupSynced: boolean;
  deltaBand: ReturnType<typeof computeWorkshop2BomCostingRollup>['deltaBand'];
  bomReferenceLineCount: number;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2SampleEconomicsRollupStatus(input: {
  dossier: Workshop2DossierPhase1;
  draft?: Workshop2SampleEconomicsDraft | null;
}): Workshop2SampleEconomicsRollupStatus {
  const rollup = computeWorkshop2BomCostingRollup(input.dossier);
  const draft = input.draft ?? input.dossier.sampleEconomicsDraft ?? null;
  const draftTotal = draft ? computeSampleEconomicsDraftTotal(draft) : 0;
  const bomRollupSynced = Boolean(draft?.bomRollup?.syncedAt);
  const bomReferenceLineCount = (draft?.lines ?? []).filter(
    (l) => l.sourceHint === 'tz_bom_reference'
  ).length;

  let state: Workshop2SampleEconomicsRollupStatus['state'] = 'empty';
  if (rollup.estimatedFob > 0 || draftTotal > 0) {
    state =
      bomRollupSynced && bomReferenceLineCount > 0 && rollup.estimatedFob > 0 ? 'ready' : 'partial';
  }

  let hintRu: string | undefined;
  if (rollup.estimatedFob <= 0) {
    hintRu = 'BOM rollup = 0 — заполните BOM по узлам перед экономикой образца.';
  } else if (!bomRollupSynced) {
    hintRu = 'Черновик экономики не синхронизирован с BOM — нажмите «Синхронизировать с BOM».';
  } else if (rollup.deltaBand === 'over') {
    hintRu = `Оценка FOB выше target (${rollup.deltaPct ?? 0}%) — уточните цены или target в паспорте.`;
  } else if (rollup.deltaBand === 'no_target') {
    hintRu = 'Target FOB не задан — сравнение estimate vs план недоступно.';
  } else if (bomReferenceLineCount === 0) {
    hintRu = 'В черновике нет строк tz_bom_reference — выполните rollup из BOM.';
  }

  return {
    estimatedFob: rollup.estimatedFob,
    draftTotal,
    bomRollupSynced,
    deltaBand: rollup.deltaBand,
    bomReferenceLineCount,
    state,
    hintRu,
  };
}
