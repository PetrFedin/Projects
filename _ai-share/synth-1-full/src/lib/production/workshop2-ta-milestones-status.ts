/**
 * T&A milestones: досье → bundle → честная сводка (без legacy_mock).
 */
import type { TimeAndActionSnapshot } from '@/lib/production/article-workspace/types';
import type {
  Workshop2DossierPhase1,
  Workshop2TaMilestone,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export type Workshop2TaMilestoneSource = 'dossier' | 'bundle' | 'empty';

export type Workshop2TaMilestonesStatus = {
  source: Workshop2TaMilestoneSource;
  milestoneCount: number;
  completedCount: number;
  delayedCount: number;
  overdueCount: number;
  inProgressCount: number;
  state: 'empty' | 'partial' | 'ready' | 'at_risk';
  hintRu?: string;
};

function parseDay(iso: string): number | null {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Приоритет: taMilestones досье (PG/mirror) → bundle workspace. */
export function resolveWorkshop2TaMilestones(input: {
  dossier?: Workshop2DossierPhase1 | null;
  bundleTa?: TimeAndActionSnapshot | null;
}): { milestones: Workshop2TaMilestone[]; source: Workshop2TaMilestoneSource } {
  const fromDossier = input.dossier?.taMilestones;
  if (fromDossier?.length) {
    return { milestones: fromDossier, source: 'dossier' };
  }
  const fromBundle = input.bundleTa?.milestones;
  if (fromBundle?.length) {
    return { milestones: fromBundle, source: 'bundle' };
  }
  return { milestones: [], source: 'empty' };
}

export function summarizeWorkshop2TaMilestonesStatus(input: {
  dossier?: Workshop2DossierPhase1 | null;
  bundleTa?: TimeAndActionSnapshot | null;
  /** plan | supply — разные подсказки в UI. */
  surface?: 'plan' | 'supply';
}): Workshop2TaMilestonesStatus {
  const { milestones, source } = resolveWorkshop2TaMilestones(input);
  const today = startOfTodayMs();
  let completedCount = 0;
  let delayedCount = 0;
  let overdueCount = 0;
  let inProgressCount = 0;

  for (const m of milestones) {
    if (m.status === 'completed') completedCount += 1;
    if (m.status === 'delayed') delayedCount += 1;
    if (m.status === 'in_progress') inProgressCount += 1;
    const target = parseDay(m.targetDate);
    if (target != null && target < today && m.status !== 'completed' && m.status !== 'delayed') {
      overdueCount += 1;
    }
  }

  const milestoneCount = milestones.length;
  let state: Workshop2TaMilestonesStatus['state'] = 'empty';
  if (milestoneCount === 0) state = 'empty';
  else if (delayedCount > 0 || overdueCount > 0) state = 'at_risk';
  else if (completedCount === milestoneCount) state = 'ready';
  else state = 'partial';

  const surface = input.surface ?? 'plan';
  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu =
      surface === 'supply'
        ? 'Календарь T&A пуст — задайте taMilestones в досье или на вкладке «План заказа».'
        : 'Нет этапов T&A — добавьте вехи или синхронизируйте шаблон lifecycle из брифа.';
  } else if (state === 'at_risk') {
    hintRu = `Риск по срокам: ${delayedCount} с задержкой, ${overdueCount} просрочено по targetDate.`;
  } else if (source === 'bundle' && !input.dossier?.taMilestones?.length) {
    hintRu =
      'Вехи только в bundle workspace — сохраните досье (PUT), чтобы PG/API отдавали тот же календарь.';
  } else if (input.dossier?.taMilestonesMirror && !input.dossier.taMilestonesMirror.persistedAt) {
    hintRu =
      workshop2PgMirrorStr(input.dossier.taMilestonesMirror, 'hintRu') ||
      'T&A mirror в досье без persistedAt — «T&A → PG» на плане.';
  } else if (state === 'partial' && inProgressCount === 0) {
    hintRu = 'Этапы заведены — отметьте in_progress/completed по факту поставщика.';
  }

  return {
    source,
    milestoneCount,
    completedCount,
    delayedCount,
    overdueCount,
    inProgressCount,
    state,
    hintRu,
  };
}
