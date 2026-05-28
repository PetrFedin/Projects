/**
 * Wave 12 RU: gate подсказка на заказ образца — markingRequired без GTIN (Честный ЗНАК).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import {
  isWorkshop2MarkingRegisteredForSampleGate,
  resolveWorkshop2PassportMarkingFields,
} from '@/lib/production/workshop2-marking-honest-sign';
import { getWorkshop2MarketProfile } from '@/lib/production/workshop2-market-profile';

export function evaluateWorkshop2RuMarkingSampleOrderGate(
  dossier: Workshop2DossierPhase1,
  env: Record<string, string | undefined> = process.env
): Workshop2ApiGateCheck | null {
  if (getWorkshop2MarketProfile(env) !== 'ru') return null;
  const f = resolveWorkshop2PassportMarkingFields(dossier);
  if (!f.markingRequired) return null;
  if (isWorkshop2MarkingRegisteredForSampleGate(dossier)) return null;
  return {
    id: 'marking.gtin_or_registered.required_for_sample',
    severity: 'blocker',
    messageRu:
      'Маркировка обязательна (РФ): укажите GTIN или дождитесь статуса «зарегистрировано в ЧЗ» перед заказом образца.',
  };
}

export function workshop2RuMarkingSampleOrderHintRu(
  dossier: Workshop2DossierPhase1
): string | null {
  return evaluateWorkshop2RuMarkingSampleOrderGate(dossier)?.messageRu ?? null;
}
