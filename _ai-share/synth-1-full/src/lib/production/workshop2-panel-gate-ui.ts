/**
 * Wave U — конвертация handoff checks → API gate UI для operational panels.
 */
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function workshop2HandoffChecksToApiGate(
  checks: Array<Workshop2HandoffReadinessCheck | null | undefined>
): Workshop2ApiGateCheck[] {
  return checks
    .filter((c): c is Workshop2HandoffReadinessCheck => c != null)
    .map((c) => ({
      id: c.id,
      severity: c.severity,
      messageRu: c.messageRu,
    }));
}

export function collectWorkshop2PanelExportGateChecks(input: {
  checks: Array<Workshop2HandoffReadinessCheck | null | undefined>;
}): Workshop2ApiGateCheck[] {
  return workshop2HandoffChecksToApiGate(input.checks);
}
