/**
 * Единая модель бейджей шапки workspace артикула:
 * lifecycle ТЗ, R&D, PLM, шаг мастерской, realtime — из одних источников.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import {
  getLifecycleStateBadgeClass,
  getLifecycleStateLabel,
} from '@/lib/production/dossier-lifecycle';
import type { Workshop2DossierLifecycleState } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  calculateDossierReadiness,
  type DossierReadiness,
} from '@/lib/production/dossier-readiness-engine';
import {
  buildRndStatusTitleExtras,
  resolveRndArticleStatus,
  rndStatusBadge,
  type Workshop2RndExternalHints,
} from '@/lib/production/workshop2-rnd-state-machine';
import {
  formatWorkshop2PlmOutboxBadge,
  type Workshop2PlmOutboxBadge,
} from '@/lib/production/workshop2-plm-outbox-badge';
import type { Workshop2WorkspaceHeaderPulseStatus } from '@/lib/production/workshop2-workspace-header-pulse-status';

export type Workshop2WorkspaceTzPhaseStep = '1' | '2' | '3';

export type Workshop2WorkspaceHeaderBadge = {
  label: string;
  title: string;
  className: string;
};

export type Workshop2WorkspaceHeaderSync = {
  lifecycle: Workshop2WorkspaceHeaderBadge;
  rnd: Workshop2WorkspaceHeaderBadge & { tone: ReturnType<typeof rndStatusBadge>['tone'] };
  plm: Workshop2PlmOutboxBadge & { className: string };
  tzPhase: Workshop2WorkspaceHeaderBadge;
  /** Подсказка при расхождении lifecycle и pre-flight (например, «передано», но есть блокеры). */
  coherenceHintRu?: string;
};

const PLM_TONE_CLASS: Record<Workshop2PlmOutboxBadge['tone'], string> = {
  ok: 'border-emerald-200 bg-emerald-50/80 text-emerald-800',
  pending: 'border-amber-200 bg-amber-50/80 text-amber-900',
  awaiting_ack: 'border-sky-200 bg-sky-50/80 text-sky-900',
};

const TZ_PHASE_LABEL: Record<Workshop2WorkspaceTzPhaseStep, string> = {
  '1': 'ТЗ · шаг 1 — паспорт и материалы',
  '2': 'ТЗ · шаг 2 — конструкция и образец',
  '3': 'ТЗ · шаг 3 — передача в производство',
};

function normalizeLifecycle(
  state: Workshop2DossierLifecycleState | undefined
): Workshop2DossierLifecycleState {
  return state ?? 'draft';
}

function buildCoherenceHint(
  lifecycle: Workshop2DossierLifecycleState,
  pulse: Workshop2WorkspaceHeaderPulseStatus | null | undefined,
  readiness: DossierReadiness
): string | undefined {
  const sentLike = lifecycle === 'sent_to_production' || lifecycle === 'accepted';
  if (sentLike && pulse && !pulse.canSendToFactory) {
    return `Статус ТЗ «${getLifecycleStateLabel(lifecycle)}», но pre-flight не готов (${pulse.preflightBlockerCount} блокер(ов), пульс ${pulse.preflightScore}/100).`;
  }
  if (lifecycle === 'handoff_ready' && !readiness.overall.readyForHandoff) {
    return 'ТЗ помечено «готово к передаче», но ворота handoff ещё не закрыты — проверьте разделы.';
  }
  if (
    lifecycle === 'draft' &&
    readiness.overall.readyForHandoff &&
    readiness.summary.approvalsReady
  ) {
    return 'Разделы готовы к передаче — обновите статус ТЗ или отправьте в производство.';
  }
  return undefined;
}

export function buildWorkshop2WorkspaceHeaderSync(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
  bundle: ArticleWorkspaceBundle | null | undefined;
  factoryErpHints?: Workshop2RndExternalHints;
  tzPhaseStep: Workshop2WorkspaceTzPhaseStep;
  pulse: Workshop2WorkspaceHeaderPulseStatus | null | undefined;
  plm: { pending: number; awaitingAck: number; autoAckEnabled?: boolean };
  plmLastEventHint?: string | null;
}): Workshop2WorkspaceHeaderSync {
  const readiness = calculateDossierReadiness(input.dossier, null);
  const lifecycle = normalizeLifecycle(input.dossier?.lifecycleState);
  const canSendToFactory = input.pulse?.canSendToFactory ?? false;

  const rndBase = rndStatusBadge(
    resolveRndArticleStatus(input.dossier, input.bundle, input.factoryErpHints, {
      canSendToFactory,
      lifecycle,
    }),
    { compact: true, erpHint: buildRndStatusTitleExtras(input.factoryErpHints) }
  );

  const plm = formatWorkshop2PlmOutboxBadge(input.plm);
  const coherenceHintRu = buildCoherenceHint(lifecycle, input.pulse, readiness);

  const rndTitleParts = [
    rndBase.title,
    `ТЗ: ${getLifecycleStateLabel(lifecycle)}`,
    plm.labelRu,
    input.plmLastEventHint ? `Событие: ${input.plmLastEventHint}` : null,
    coherenceHintRu,
  ].filter(Boolean);

  return {
    lifecycle: {
      label: getLifecycleStateLabel(lifecycle),
      title: `Жизненный цикл ТЗ: ${getLifecycleStateLabel(lifecycle)}`,
      className: getLifecycleStateBadgeClass(lifecycle),
    },
    rnd: {
      label: `R&D: ${rndBase.labelRu}`,
      title: rndTitleParts.join(' · '),
      className: cnRndTone(rndBase.tone),
      tone: rndBase.tone,
    },
    plm: {
      ...plm,
      className: PLM_TONE_CLASS[plm.tone],
    },
    tzPhase: {
      label: `Шаг ${input.tzPhaseStep}/3`,
      title: TZ_PHASE_LABEL[input.tzPhaseStep],
      className: 'border-indigo-200 bg-indigo-50/80 text-indigo-800',
    },
    coherenceHintRu,
  };
}

function cnRndTone(tone: ReturnType<typeof rndStatusBadge>['tone']): string {
  switch (tone) {
    case 'success':
      return 'border-emerald-300 bg-emerald-50 text-emerald-800';
    case 'primary':
      return 'border-indigo-300 bg-indigo-50 text-indigo-800';
    case 'warn':
      return 'border-amber-300 bg-amber-50 text-amber-900';
    case 'info':
      return 'border-sky-300 bg-sky-50 text-sky-800';
    default:
      return 'border-slate-200 text-text-secondary';
  }
}
