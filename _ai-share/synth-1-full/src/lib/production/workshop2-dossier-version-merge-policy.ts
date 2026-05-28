/**
 * Политика merge при 409: критичные поля досье выигрывает сервер (server-wins).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export const WORKSHOP2_SERVER_WINS_MERGE_FIELDS: readonly (keyof Workshop2DossierPhase1)[] = [
  'tzSignatoryBindings',
  'sectionSignoffs',
  'techPackFactoryHandoffs',
  'productionModel',
  'sampleIntakeRelease',
  'goldSampleStatus',
  'lifecycleState',
] as const;

/** Слияние локального досье с серверным: server-wins для критичных полей. */
export function mergeWorkshop2DossierWithServerWinsPolicy(
  server: Workshop2DossierPhase1,
  local: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  const merged: Workshop2DossierPhase1 = { ...local, ...server };
  for (const key of WORKSHOP2_SERVER_WINS_MERGE_FIELDS) {
    const serverVal = server[key];
    if (serverVal !== undefined) {
      (merged as Record<string, unknown>)[key as string] = serverVal;
    }
  }
  return merged;
}
