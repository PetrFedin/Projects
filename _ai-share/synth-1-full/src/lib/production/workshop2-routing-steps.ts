/**
 * Техпроцесс: routingSteps[] в досье — из швейного плана и умной маршрутизации.
 */

import type {
  Workshop2DossierPhase1,
  Workshop2RoutingStep,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2RoutingStepSource = Workshop2RoutingStep['source'];
export type { Workshop2RoutingStep };

export type Workshop2RoutingPipelineMetrics = {
  stepCount: number;
  totalSashMin: number;
  partnerLabel?: string;
  hasSampleStageLink: boolean;
};

/** Собирает routingSteps[] для persist и экспорта TZ bundle. */
export function buildWorkshop2RoutingStepsFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2RoutingStep[] {
  const partnerLabel = dossier.sewingPlan?.partnerLabel?.trim();
  const regionCode = dossier.sewingPlan?.regionCode?.trim();

  if (dossier.smartRoutingSequence?.length) {
    return dossier.smartRoutingSequence.map((op, i) => ({
      stepNo: i + 1,
      name: op.name,
      category: op.category,
      equipment: op.equipment,
      sashMin: op.sash,
      partnerLabel,
      regionCode,
      source: 'smart_routing' as const,
    }));
  }

  const ops = dossier.productionModel?.operations ?? [];
  if (ops.length) {
    return ops.map((op, i) => ({
      stepNo: i + 1,
      name: op.name || op.operationType || `Операция ${i + 1}`,
      category: op.operationType,
      equipment: op.machineType,
      sashMin: op.sash,
      partnerLabel,
      regionCode,
      source: 'production_model' as const,
    }));
  }

  if (dossier.sewingPlan?.partnerLabel || dossier.sewingPlan?.operationsNote) {
    return [
      {
        stepNo: 1,
        name:
          dossier.sewingPlan.operationsNote?.trim() || 'Швейный план (без детализации операций)',
        partnerLabel,
        regionCode,
        source: 'sewing_plan' as const,
      },
    ];
  }

  return [];
}

/** Обновляет routingSteps в досье (вызывается перед persist / экспортом). */
export function syncWorkshop2RoutingStepsOnDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  const steps = buildWorkshop2RoutingStepsFromDossier(dossier);
  return {
    ...dossier,
    routingSteps: steps.length ? steps : undefined,
  };
}

export function computeWorkshop2RoutingPipelineMetrics(
  dossier: Workshop2DossierPhase1
): Workshop2RoutingPipelineMetrics {
  const steps = dossier.routingSteps?.length
    ? dossier.routingSteps
    : buildWorkshop2RoutingStepsFromDossier(dossier);
  const totalSashMin = steps.reduce((sum, s) => sum + (s.sashMin ?? 0), 0);
  return {
    stepCount: steps.length,
    totalSashMin,
    partnerLabel: dossier.sewingPlan?.partnerLabel,
    hasSampleStageLink: true,
  };
}
