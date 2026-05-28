/**
 * Честная сводка шапки: % ТЗ vs пульс pre-flight (разные шкалы).
 */
import type { Workshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';

export type Workshop2WorkspaceHeaderPulseStatus = {
  tzOverallPct: number;
  preflightScore: number;
  scoreGap: number;
  preflightBlockerCount: number;
  preflightWarningCount: number;
  canSendToFactory: boolean;
  state: 'empty' | 'at_risk' | 'aligned' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2WorkspaceHeaderPulseStatus(
  snapshot: Workshop2ReadinessSnapshot | null
): Workshop2WorkspaceHeaderPulseStatus {
  if (!snapshot?.preflight) {
    return {
      tzOverallPct: snapshot?.tzOverallPct ?? 0,
      preflightScore: 0,
      scoreGap: 0,
      preflightBlockerCount: 0,
      preflightWarningCount: 0,
      canSendToFactory: false,
      state: 'empty',
      hintRu: 'Нет досье — пульс и % ТЗ недоступны.',
    };
  }

  const tzOverallPct = snapshot.tzOverallPct;
  const preflightScore = snapshot.preflightScore;
  const scoreGap = tzOverallPct - preflightScore;
  const preflightBlockerCount = snapshot.preflight.blockers.length;
  const preflightWarningCount = snapshot.preflight.warnings.length;
  const canSendToFactory = snapshot.preflight.canSendToFactory;

  let state: Workshop2WorkspaceHeaderPulseStatus['state'] = 'aligned';
  let hintRu: string | undefined;

  if (preflightBlockerCount > 0) {
    state = 'at_risk';
    hintRu = `${preflightBlockerCount} блокер(ов) pre-flight — % ТЗ (${tzOverallPct}%) не гарантирует передачу в цех.`;
  } else if (scoreGap >= 25) {
    state = 'at_risk';
    hintRu = `Разрыв ТЗ ${tzOverallPct}% и пульса ${preflightScore}/100 — проверьте блокеры в «Пульс артикула».`;
  } else if (!canSendToFactory) {
    state = 'at_risk';
    hintRu = `Пульс ${preflightScore}/100 — ниже порога передачи; устраните предупреждения pre-flight.`;
  } else if (preflightWarningCount > 0) {
    state = 'aligned';
    hintRu = `${preflightWarningCount} предупреждений pre-flight — передача возможна, но есть риски.`;
  } else {
    state = 'ready';
  }

  return {
    tzOverallPct,
    preflightScore,
    scoreGap,
    preflightBlockerCount,
    preflightWarningCount,
    canSendToFactory,
    state,
    hintRu,
  };
}
