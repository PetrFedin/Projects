/**
 * Wave S — полный checks[] для DPP export UI (fail-closed, без silent download).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { evaluateWorkshop2DppExportGate } from '@/lib/production/workshop2-dpp-export-gate';
import { validateWorkshop2DppJsonLdForExport } from '@/lib/production/workshop2-dpp-jsonld-validator';

export function collectWorkshop2DppExportChecks(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
}): Workshop2HandoffReadinessCheck[] {
  const checks: Workshop2HandoffReadinessCheck[] = [];
  const gate = evaluateWorkshop2DppExportGate(input);
  if (gate) checks.push(gate);

  const schema = validateWorkshop2DppJsonLdForExport(input);
  if (schema.state === 'invalid') {
    for (const issue of schema.issues) {
      checks.push({
        id: issue.code,
        severity: 'blocker',
        messageRu: issue.messageRu,
      });
    }
  }

  return checks;
}

export function workshop2DppExportBlocked(checks: Workshop2HandoffReadinessCheck[]): boolean {
  return checks.some((c) => c.severity === 'blocker');
}
