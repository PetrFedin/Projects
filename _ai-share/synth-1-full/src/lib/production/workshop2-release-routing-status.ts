/**
 * Выпуск · техпроцесс: routingSteps досье + операции release bundle.
 */
import type { ReleaseSnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2RoutingStepsFromDossier,
  computeWorkshop2RoutingPipelineMetrics,
} from '@/lib/production/workshop2-routing-steps';

export type Workshop2ReleaseRoutingStatus = {
  routingStepCount: number;
  totalSashMin: number;
  releaseOperationCount: number;
  completedOperations: number;
  kanbanStatus?: ReleaseSnapshot['kanbanStatus'];
  routingSource: 'persisted' | 'derived' | 'empty';
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2ReleaseRoutingStatus(input: {
  dossier?: Workshop2DossierPhase1 | null;
  release?: ReleaseSnapshot | null;
}): Workshop2ReleaseRoutingStatus {
  const dossier = input.dossier;
  const release = input.release;
  const persisted = dossier?.routingSteps ?? [];
  const derived = dossier ? buildWorkshop2RoutingStepsFromDossier(dossier) : [];
  const steps = persisted.length ? persisted : derived;
  const routingSource: Workshop2ReleaseRoutingStatus['routingSource'] = persisted.length
    ? 'persisted'
    : derived.length
      ? 'derived'
      : 'empty';

  const metrics = dossier
    ? computeWorkshop2RoutingPipelineMetrics({
        ...dossier,
        routingSteps: steps.length ? steps : dossier.routingSteps,
      })
    : { stepCount: 0, totalSashMin: 0, partnerLabel: undefined, hasSampleStageLink: false };

  const ops = release?.operations ?? [];
  const completedOperations = ops.filter((o) => o.status === 'completed').length;

  let state: Workshop2ReleaseRoutingStatus['state'] = 'empty';
  if (steps.length > 0 && ops.length > 0) state = 'ready';
  else if (steps.length > 0 || ops.length > 0) state = 'partial';

  let hintRu: string | undefined;
  if (routingSource === 'empty') {
    hintRu =
      'Нет routingSteps — заполните умную маршрутизацию или productionModel.operations в ТЗ.';
  } else if (ops.length === 0) {
    hintRu = `Маршрут: ${steps.length} шагов — синхронизируйте операции выпуска из ТЗ (кнопка на панели).`;
  } else if (routingSource === 'derived') {
    hintRu = 'Шаги маршрута выведены из досье — сохраните досье для persist routingSteps в PG.';
  } else if (completedOperations < ops.length) {
    hintRu = `В цехе ${completedOperations}/${ops.length} операций завершено — обновите kanban на панели выпуска.`;
  }

  return {
    routingStepCount: metrics.stepCount,
    totalSashMin: metrics.totalSashMin,
    releaseOperationCount: ops.length,
    completedOperations,
    kanbanStatus: release?.kanbanStatus,
    routingSource,
    state,
    hintRu,
  };
}

export type Workshop2ReleaseRoutingPanelDisplay = Workshop2ReleaseRoutingStatus & {
  /** releaseRoutingMirror сохранён в досье/PG. */
  mirrorInPg: boolean;
};

/**
 * Wave T: UI выпуска — без «готов» без PG mirror (не fake routed).
 */
export function summarizeWorkshop2ReleaseRoutingPanelDisplay(input: {
  dossier?: Workshop2DossierPhase1 | null;
  release?: ReleaseSnapshot | null;
}): Workshop2ReleaseRoutingPanelDisplay {
  const live = summarizeWorkshop2ReleaseRoutingStatus(input);
  const mirror = input.dossier?.releaseRoutingMirror;
  if (mirror) {
    return {
      routingStepCount: mirror.routingStepCount,
      totalSashMin: live.totalSashMin,
      releaseOperationCount: mirror.releaseOperationCount,
      completedOperations: live.completedOperations,
      kanbanStatus: live.kanbanStatus,
      routingSource: mirror.routingSource,
      state: mirror.state,
      hintRu: mirror.hintRu ?? live.hintRu,
      mirrorInPg: true,
    };
  }
  let state = live.state;
  let hintRu = live.hintRu;
  if (state === 'ready') {
    state = 'partial';
    hintRu =
      'Маршрут локально готов, но releaseRoutingMirror не в PG — «Routing → PG» перед handoff.';
  } else if (live.routingStepCount > 0 && !hintRu) {
    hintRu = 'Routing snapshot не в PG — сохраните mirror на панели выпуска.';
  }
  return { ...live, state, hintRu, mirrorInPg: false };
}
