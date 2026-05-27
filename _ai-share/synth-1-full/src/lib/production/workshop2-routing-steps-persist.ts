/**
 * Persist routingSteps из derived production model → досье (wave 17 #64).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  syncWorkshop2RoutingStepsOnDossier,
  type Workshop2RoutingStep,
} from '@/lib/production/workshop2-routing-steps';

export function persistWorkshop2RoutingStepsFromDossier(dossier: Workshop2DossierPhase1): {
  dossier: Workshop2DossierPhase1;
  steps: Workshop2RoutingStep[];
  source: 'existing' | 'derived';
} {
  const hadPersisted = (dossier.routingSteps?.length ?? 0) > 0;
  const synced = syncWorkshop2RoutingStepsOnDossier(dossier);
  const steps = synced.routingSteps ?? [];
  if (!steps.length) {
    return { dossier, steps: [], source: 'derived' };
  }
  if (hadPersisted) {
    return { dossier: synced, steps, source: 'existing' };
  }
  return {
    dossier: {
      ...synced,
      routingStepsPersistedAt: new Date().toISOString(),
    },
    steps,
    source: 'derived',
  };
}
