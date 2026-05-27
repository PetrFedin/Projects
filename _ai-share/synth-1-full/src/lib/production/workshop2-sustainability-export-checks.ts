/**
 * Wave S — checks[] для export/registry действий на вкладке Sustainability (fail-closed).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2SustainabilityExportGate } from '@/lib/production/workshop2-sustainability-lca-persist';
import { evaluateWorkshop2SustainabilityCarbonRollupExportGate } from '@/lib/production/workshop2-sustainability-carbon-rollup';
import { summarizeWorkshop2SustainabilityStatus } from '@/lib/production/workshop2-sustainability-status';

export function collectWorkshop2SustainabilityExportChecks(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
}): Workshop2HandoffReadinessCheck[] {
  const checks: Workshop2HandoffReadinessCheck[] = [];
  const status = summarizeWorkshop2SustainabilityStatus(input);

  if (status.state === 'empty') {
    checks.push({
      id: 'sustainability.bom.empty',
      severity: 'blocker',
      messageRu: 'Заполните материалы в ТЗ → материалы или состав на бирке перед export.',
    });
    return checks;
  }

  const lca = evaluateWorkshop2SustainabilityExportGate(input);
  if (lca) checks.push(lca);

  const carbon = evaluateWorkshop2SustainabilityCarbonRollupExportGate({ dossier: input.dossier });
  if (carbon) checks.push(carbon);

  return checks;
}

export function workshop2SustainabilityExportBlocked(
  checks: Workshop2HandoffReadinessCheck[]
): boolean {
  return checks.some((c) => c.severity === 'blocker');
}
