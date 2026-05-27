/**
 * Wave 11: batch PATCH supply-related mirrors — material flow → lab dip → landed ₽ → vendor winner → summary.
 * Вызывается из dossier PUT при ?batch=supply (минимальный scope, без лишних round-trips).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { syncWorkshop2CostingRubMirrorOnDossier } from '@/lib/production/workshop2-dossier-costing-rub';
import { persistWorkshop2LabDipMirrorToDossier } from '@/lib/production/workshop2-lab-dip-dossier-persist';
import { persistWorkshop2SupplyOpsMirrorToDossier } from '@/lib/production/workshop2-supply-ops-dossier-persist';
import { persistWorkshop2SupplyBundleMirrorToDossier } from '@/lib/production/workshop2-supply-bundle-dossier-persist';
import { acceptWorkshop2VendorBidHeuristicWinner } from '@/lib/production/workshop2-vendor-bids';
import type { SupplySnapshot } from '@/lib/production/article-workspace/types';

export type Workshop2SupplyBatchPatchResult = {
  dossier: Workshop2DossierPhase1;
  applied: string[];
};

export function applyWorkshop2SupplyBatchPatchOnDossier(input: {
  dossier: Workshop2DossierPhase1;
  supply?: SupplySnapshot | null;
  env?: Record<string, string | undefined>;
  /** Авто-принять heuristic winner если есть pending bids. */
  acceptVendorWinner?: boolean;
}): Workshop2SupplyBatchPatchResult {
  const applied: string[] = [];
  let d = input.dossier;

  d = persistWorkshop2LabDipMirrorToDossier(d);
  applied.push('labDipMirror');

  d = syncWorkshop2CostingRubMirrorOnDossier(d, input.env);
  applied.push('costingRub');

  if (input.acceptVendorWinner !== false && (d.bids?.length ?? 0) > 0) {
    const withWinner = acceptWorkshop2VendorBidHeuristicWinner({ dossier: d });
    if (withWinner !== d) {
      d = withWinner;
      applied.push('vendorBidsMirror');
    }
  }

  d = persistWorkshop2SupplyOpsMirrorToDossier(d, input.env);
  applied.push('supplyOpsMirror');

  if (input.supply !== undefined) {
    d = persistWorkshop2SupplyBundleMirrorToDossier(d, { supply: input.supply ?? null });
    applied.push('supplyBundleMirror');
  }

  return { dossier: d, applied };
}
