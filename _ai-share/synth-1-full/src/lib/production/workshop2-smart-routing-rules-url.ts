/**
 * Wave 3 P2 #42: smart routing engineKind tiers + optional external rules URL (не ML fake).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2SmartRoutingEngineTier =
  | 'empty'
  | 'heuristic'
  | 'manual'
  | 'demo_template'
  | 'rules_url';

export function resolveWorkshop2SmartRoutingRulesUrl(
  env?: Record<string, string | undefined>
): string | undefined {
  return (
    String(
      env?.WORKSHOP2_SMART_ROUTING_RULES_URL ?? process.env.WORKSHOP2_SMART_ROUTING_RULES_URL ?? ''
    ).trim() || undefined
  );
}

export function describeWorkshop2SmartRoutingEngineTiers(): Array<{
  tier: Workshop2SmartRoutingEngineTier;
  labelRu: string;
  noteRu: string;
}> {
  return [
    {
      tier: 'empty',
      labelRu: 'Пусто',
      noteRu: 'Нет routingSteps — заполните вручную или из швейного плана.',
    },
    {
      tier: 'heuristic',
      labelRu: 'Эвристика',
      noteRu: 'Шаги из production model / BOM — не external rules engine.',
    },
    {
      tier: 'manual',
      labelRu: 'Ручной',
      noteRu: 'smartRoutingSequence или routingSteps заданы пользователем.',
    },
    {
      tier: 'demo_template',
      labelRu: 'Демо-шаблон',
      noteRu: 'DEMO sequence — заблокирован в production без WORKSHOP2_SMART_ROUTING_DEMO=1.',
    },
    {
      tier: 'rules_url',
      labelRu: 'External rules',
      noteRu:
        'WORKSHOP2_SMART_ROUTING_RULES_URL — честный HTTP rules mode (не ML). Ответ rules engine не подменяет шаги без persist.',
    },
  ];
}

export function resolveWorkshop2SmartRoutingEngineTier(input: {
  dossier: Workshop2DossierPhase1;
  env?: Record<string, string | undefined>;
}): Workshop2SmartRoutingEngineTier {
  const mirror = input.dossier.smartRoutingMirror;
  const rulesUrl = resolveWorkshop2SmartRoutingRulesUrl(input.env);
  if (rulesUrl && mirror?.stepCount && mirror.stepCount > 0) {
    return 'rules_url';
  }
  return (mirror?.engineKind as Workshop2SmartRoutingEngineTier) ?? 'empty';
}

export function buildWorkshop2SmartRoutingRulesUrlHint(
  env?: Record<string, string | undefined>
): string {
  const url = resolveWorkshop2SmartRoutingRulesUrl(env);
  if (!url) {
    return 'External rules URL не задан — используйте heuristic/manual/demo_template.';
  }
  return `Rules URL: ${url} — tier rules_url при persist mirror (без fake ML ACK).`;
}
