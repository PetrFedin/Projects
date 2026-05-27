/**
 * Wave X #53 — честность carbon rollup: эвристика vs persist в PG mirror.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  evaluateWorkshop2SustainabilityCarbonRollup,
  evaluateWorkshop2SustainabilityCarbonRollupExportGate,
} from '@/lib/production/workshop2-sustainability-carbon-rollup';

export type Workshop2CarbonRollupPersistHonesty = {
  computed: boolean;
  persisted: boolean;
  engineLabel: string;
  hintRu: string;
};

/** Сравнивает live rollup с mirror в досье — без fake «в PG». */
export function summarizeWorkshop2CarbonRollupPersistHonesty(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2CarbonRollupPersistHonesty {
  const live = evaluateWorkshop2SustainabilityCarbonRollup(input);
  const mirror = input.dossier.sustainabilityCarbonRollupMirror;
  const persisted = Boolean(mirror?.computedAt);
  const computed = live.materialLineCount > 0 || live.carbonFootprintKg > 0;

  let hintRu: string;
  if (!computed) {
    hintRu = 'BOM пуст — carbon rollup недоступен.';
  } else if (!persisted) {
    hintRu =
      'Rollup рассчитан эвристически (heuristic_bom_v1) — нажмите «Carbon rollup → PG» для persist в досье.';
  } else if (mirror && Math.abs(mirror.carbonFootprintKg - live.carbonFootprintKg) > 0.01) {
    hintRu = 'BOM изменился после последнего rollup — пересчитайте и сохраните в PG (drift).';
  } else {
    hintRu = mirror?.hintRu ?? live.hintRu;
  }

  return {
    computed,
    persisted,
    engineLabel: mirror?.engine ?? live.engine,
    hintRu,
  };
}

export function evaluateWorkshop2CarbonRollupPersistHonestyGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2HandoffReadinessCheck | null {
  const honesty = summarizeWorkshop2CarbonRollupPersistHonesty(input);
  if (!honesty.computed) return null;
  if (!honesty.persisted) {
    return {
      id: 'sustainability.carbon.not_persisted',
      severity: 'warning',
      messageRu: honesty.hintRu,
    };
  }
  return evaluateWorkshop2SustainabilityCarbonRollupExportGate({ dossier: input.dossier });
}
