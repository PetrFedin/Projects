import type { MatchContractorsOutput } from '@/lib/production/workshop2-match-contractors-types';
import type { Workshop2MatchmakerPersistedResult } from '@/lib/production/workshop2-dossier-phase1.types';
import type { SewingPlanPartnerRow } from '@/lib/production/workshop2-sewing-plan-reference-types';

/** Структурированный результат matchmaker для PUT досье. */
export function buildWorkshop2MatchmakerPersistedResult(
  data: MatchContractorsOutput,
  contractors: SewingPlanPartnerRow[]
): Workshop2MatchmakerPersistedResult {
  const top = data.matches[0];
  const contractor = contractors.find((c) => c.id === top?.contractorId);
  return {
    recommendedContractorId: top?.contractorId,
    recommendedLabel: contractor?.label,
    confidence: top?.score,
    rationale: top?.rationale,
    syncedAt: new Date().toISOString(),
    raw: { matches: data.matches },
  };
}
