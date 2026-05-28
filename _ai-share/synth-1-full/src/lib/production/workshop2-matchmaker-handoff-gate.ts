/**
 * Wave 20 #9: gate handoff commit при отсутствии/устаревшем matchmaker в досье.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

const MATCHMAKER_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export function evaluateWorkshop2MatchmakerHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const needsFactory =
    Boolean(dossier.sewingPlan?.partnerId?.trim()) ||
    Boolean(dossier.techPackFactoryHandoffs?.length);
  if (!needsFactory) return null;

  const mm = dossier.matchmakerResult;
  if (!mm?.recommendedContractorId) {
    return {
      id: 'matchmaker.result.missing',
      severity: 'warning',
      messageRu:
        'Швейный план/передача в цех без сохранённого matchmaker — запустите подбор подрядчика и PUT досье.',
    };
  }
  const ageMs = Date.now() - new Date(mm.syncedAt).getTime();
  if (ageMs > MATCHMAKER_MAX_AGE_MS) {
    return {
      id: 'matchmaker.result.stale',
      severity: 'warning',
      messageRu: 'Matchmaker в досье старше 14 дней — повторите подбор перед handoff commit.',
    };
  }
  if (typeof mm.confidence === 'number' && mm.confidence < 0.45) {
    return {
      id: 'matchmaker.confidence.low',
      severity: 'warning',
      messageRu: `Низкая уверенность matchmaker (${Math.round(mm.confidence * 100)}%) — подтвердите подрядчика вручную.`,
    };
  }
  return null;
}
