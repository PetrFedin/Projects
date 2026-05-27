/**
 * Gate экономики образца: при ненулевом BOM rollup нужен синхронизированный sampleEconomicsDraft.
 */
import { computeWorkshop2BomCostingRollup } from '@/lib/production/workshop2-bom-costing';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function evaluateWorkshop2SampleEconomicsGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const rollup = computeWorkshop2BomCostingRollup(dossier);
  const hasBomCost =
    rollup.estimatedFob > 0 || (rollup.lineCosts?.length ?? 0) > 0 || rollup.materialsTotal > 0;

  if (!hasBomCost) return null;

  const draft = dossier.sampleEconomicsDraft;
  const syncedAt = draft?.bomRollup?.syncedAt?.trim();
  const bomRefLines = (draft?.lines ?? []).filter(
    (l) => l.sourceHint === 'tz_bom_reference'
  ).length;

  if (syncedAt && bomRefLines > 0) return null;

  return {
    id: 'sample.economics.bom_rollup_required',
    severity: 'blocker',
    messageRu:
      'Экономика образца не синхронизирована с BOM — откройте «Снабжение» и нажмите «Синхронизировать с BOM» перед заказом образца.',
  };
}
