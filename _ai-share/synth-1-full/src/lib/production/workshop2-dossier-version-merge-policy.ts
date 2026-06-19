/**
 * Политика merge при 409: критичные поля досье выигрывает сервер (server-wins).
 */
import type {
  Workshop2DossierPhase1,
  Workshop2ProductionModel,
} from '@/lib/production/workshop2-dossier-phase1.types';

export const WORKSHOP2_SERVER_WINS_MERGE_FIELDS: readonly (keyof Workshop2DossierPhase1)[] = [
  'tzSignatoryBindings',
  'sectionSignoffs',
  'techPackFactoryHandoffs',
  'productionModel',
  'sampleIntakeRelease',
  'goldSampleStatus',
  'lifecycleState',
] as const;

function workshop2ProductionModelHasMaterialLines(
  model: Workshop2ProductionModel | undefined
): boolean {
  return (model?.materialLines ?? []).some((line) => line.materialName?.trim());
}

/**
 * PUT досье: UI часто шлёт подмножество полей (ТЗ general) без BOM.
 * Не затираем server-wins поля, если клиент их не прислал или прислал пустой BOM.
 */
export function preserveWorkshop2ServerWinsFieldsOnDossierPut(
  prior: Workshop2DossierPhase1 | null | undefined,
  incoming: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  if (!prior) return incoming;

  let next: Workshop2DossierPhase1 = { ...incoming };
  for (const key of WORKSHOP2_SERVER_WINS_MERGE_FIELDS) {
    if (key === 'lifecycleState') continue;

    const priorVal = prior[key];
    if (priorVal === undefined) continue;

    const incomingVal = incoming[key];
    if (key === 'productionModel') {
      if (
        !workshop2ProductionModelHasMaterialLines(
          incomingVal as Workshop2ProductionModel | undefined
        ) &&
        workshop2ProductionModelHasMaterialLines(priorVal as Workshop2ProductionModel)
      ) {
        next = { ...next, productionModel: priorVal as Workshop2ProductionModel };
      }
      continue;
    }

    if (incomingVal === undefined) {
      next = { ...next, [key]: priorVal };
    }
  }

  return next;
}

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
