/**
 * Wave 10: сводная карточка артикула (gates, ₽, T&A, чат, маркировка, ЭДО) — один экран.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { calculateDossierReadiness } from '@/lib/production/dossier-readiness-engine';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';
import { resolveWorkshop2CostingRubFromDossier } from '@/lib/production/workshop2-dossier-costing-rub';
import { workshop2EdoStatusLabelRu } from '@/lib/production/workshop2-edo-signoff';
import { buildWorkshop2MarkingWizardSteps } from '@/lib/production/workshop2-marking-honest-sign';

export type Workshop2RuArticleDashboardCard = {
  gatesSummaryRu: string;
  costRollupRub: string | null;
  taNextMilestoneRu: string | null;
  unreadChatCount: number;
  markingStatusRu: string;
  edoStatusRu: string;
  loadedAt: string;
};

export function buildWorkshop2RuArticleDashboardCard(input: {
  dossier: Workshop2DossierPhase1;
  unreadChatCount?: number;
  env?: Record<string, string | undefined>;
}): Workshop2RuArticleDashboardCard {
  const readiness = calculateDossierReadiness(input.dossier, null);
  const missingGates = readiness.overall.missingGates?.length ?? 0;
  const gatesSummaryRu =
    missingGates > 0
      ? `${readiness.overall.pct}% ТЗ · блокеров: ${missingGates}`
      : `${readiness.overall.pct}% ТЗ · готово к handoff`;

  const costing = resolveWorkshop2CostingRubFromDossier(input.dossier);
  const costRollupRub =
    costing && costing.estimatedFobRub > 0
      ? formatWorkshop2RubCurrency(costing.estimatedFobRub)
      : null;

  const milestones = input.dossier.taMilestones ?? [];
  const nextMs = milestones.find((m) => m.status !== 'completed' && m.targetDate);
  const taNextMilestoneRu = nextMs
    ? `${nextMs.title} · ${nextMs.targetDate}`
    : milestones.length
      ? 'Все вехи закрыты'
      : null;

  const markingSteps = buildWorkshop2MarkingWizardSteps(input.dossier, input.env);
  const markingActive = markingSteps.find((s) => s.status === 'active');
  const markingStatusRu =
    input.dossier.markingHonestSignMirror?.hintRu ??
    markingActive?.hintRu ??
    'Маркировка не настроена';

  const edo = input.dossier.edoSignoffMirror;
  const edoStatusRu = edo
    ? (edo.statusLabelRu ?? workshop2EdoStatusLabelRu(edo.edoStatus))
    : 'ЭДО не запрошен';

  return {
    gatesSummaryRu,
    costRollupRub,
    taNextMilestoneRu,
    unreadChatCount: input.unreadChatCount ?? 0,
    markingStatusRu,
    edoStatusRu,
    loadedAt: new Date().toISOString(),
  };
}
