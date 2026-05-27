/**
 * Wave 4 P0 #2: UI hint для engineTier smart routing mirror.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2SmartRoutingEngineTierHint =
  | 'empty'
  | 'demo_template'
  | 'rules_url'
  | 'external'
  | 'heuristic'
  | 'manual';

export function resolveWorkshop2SmartRoutingEngineTierForUi(
  dossier: Workshop2DossierPhase1
): Workshop2SmartRoutingEngineTierHint {
  const mirror = dossier.smartRoutingMirror;
  const tier = mirror?.engineTier ?? mirror?.engineKind ?? 'empty';
  if (tier === 'rules_url') return 'external';
  return tier as Workshop2SmartRoutingEngineTierHint;
}

export function formatWorkshop2SmartRoutingEngineTierLabelRu(
  tier: Workshop2SmartRoutingEngineTierHint
): string {
  switch (tier) {
    case 'demo_template':
      return 'Демо-шаблон';
    case 'rules_url':
      return 'Rules URL';
    case 'external':
      return 'External rules';
    case 'heuristic':
      return 'Эвристика';
    case 'manual':
      return 'Ручной';
    case 'empty':
    default:
      return 'Пусто';
  }
}

export function buildWorkshop2SmartRoutingEngineTierHintRu(
  dossier: Workshop2DossierPhase1
): string {
  const tier = resolveWorkshop2SmartRoutingEngineTierForUi(dossier);
  const label = formatWorkshop2SmartRoutingEngineTierLabelRu(tier);
  const mirror = dossier.smartRoutingMirror;
  const steps = mirror?.stepCount ?? 0;
  if (tier === 'external' || tier === 'rules_url') {
    return `engineTier: ${label} · ${steps} шаг(ов) · external rules (без fake ML ACK)`;
  }
  if (tier === 'demo_template') {
    return `engineTier: ${label} · ${steps} шаг(ов) · DEMO (production fail-closed без WORKSHOP2_SMART_ROUTING_DEMO=1)`;
  }
  return `engineTier: ${label} · ${steps} шаг(ов)`;
}
