/**
 * Wave X #42 — полный checks[] для smart routing panel (production fail-closed + gate UI).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  evaluateWorkshop2SmartRoutingHandoffGate,
  evaluateWorkshop2SmartRoutingSampleGate,
  persistWorkshop2SmartRoutingMirrorToDossier,
} from '@/lib/production/workshop2-smart-routing-dossier-persist';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';
import {
  resolveWorkshop2SmartRoutingProductionEngineKind,
  shouldShowWorkshop2SmartRoutingDemoWarning,
} from '@/lib/production/workshop2-no-demo-deadends';

export function collectWorkshop2SmartRoutingGateChecks(input: {
  dossier: Workshop2DossierPhase1;
  env?: NodeJS.ProcessEnv;
}): Workshop2HandoffReadinessCheck[] {
  const env = input.env ?? process.env;
  const withMirror = persistWorkshop2SmartRoutingMirrorToDossier(input.dossier);
  const checks: Workshop2HandoffReadinessCheck[] = [];

  if (shouldShowWorkshop2SmartRoutingDemoWarning({ dossier: withMirror, env })) {
    checks.push({
      id: 'routing.demo_blocked_prod',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(withMirror.smartRoutingMirror, 'hintRu') ||
        'DEMO-маршрутизация в production — задайте WORKSHOP2_SMART_ROUTING_DEMO=1 или соберите маршрут вручную.',
    });
  }

  const sampleGate = evaluateWorkshop2SmartRoutingSampleGate(withMirror);
  if (sampleGate) checks.push(sampleGate);

  const handoffGate = evaluateWorkshop2SmartRoutingHandoffGate(withMirror);
  if (handoffGate) checks.push(handoffGate);

  const engineKind = resolveWorkshop2SmartRoutingProductionEngineKind({
    dossier: withMirror,
    env,
  });
  if (
    engineKind === 'empty' &&
    (withMirror.sewingPlan?.partnerId?.trim() || withMirror.routingSteps?.length === 0)
  ) {
    checks.push({
      id: 'routing.steps.empty_warning',
      severity: 'warning',
      messageRu: 'Маршрутизация пуста — заполните операции или загрузите шаблон (dev only).',
    });
  }

  return checks;
}

export function workshop2SmartRoutingGateBlocked(
  checks: Workshop2HandoffReadinessCheck[]
): boolean {
  return checks.some((c) => c.severity === 'blocker');
}
