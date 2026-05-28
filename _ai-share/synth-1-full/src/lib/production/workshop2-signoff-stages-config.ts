/**
 * Wave 7 P1 #18: многоуровневый signoff — configurable stages per collection.
 */
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isWorkshop2TzSectionFullySignedWithPassport,
  workshop2TzSignoffMetaIsCommitted,
} from '@/lib/production/workshop2-tz-signoff-complete';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2SignoffStageDef = {
  stageId: string;
  labelRu: string;
  /** Секции ТЗ, которые должны быть подписаны на этом этапе */
  sectionKeys: Workshop2TzSignoffSectionKey[];
  /** Требовать подпись assignment на этом этапе */
  requireAssignment?: boolean;
  order: number;
};

export const WORKSHOP2_DEFAULT_SIGNOFF_STAGES: Workshop2SignoffStageDef[] = [
  {
    stageId: 'tz_core',
    labelRu: 'Ядро ТЗ (4 секции)',
    sectionKeys: ['general', 'material', 'construction', 'visuals'],
    order: 1,
  },
  {
    stageId: 'assignment_handoff',
    labelRu: 'Задание + handoff',
    sectionKeys: ['assignment'],
    requireAssignment: true,
    order: 2,
  },
];

export function normalizeWorkshop2SignoffStages(
  stages: Workshop2SignoffStageDef[] | null | undefined
): Workshop2SignoffStageDef[] {
  const list = stages?.length ? stages : WORKSHOP2_DEFAULT_SIGNOFF_STAGES;
  return [...list].sort((a, b) => a.order - b.order);
}

export function summarizeWorkshop2SignoffStagesProgress(input: {
  dossier: Workshop2DossierPhase1 | null | undefined;
  stages: Workshop2SignoffStageDef[];
}): {
  stagesTotal: number;
  stagesComplete: number;
  rows: Array<{
    stageId: string;
    labelRu: string;
    complete: boolean;
    missingRu: string[];
  }>;
  hintRu?: string;
} {
  const dossier = input.dossier;
  const signoffs = dossier?.sectionSignoffs;
  const rows = input.stages.map((stage) => {
    const missingRu: string[] = [];
    for (const key of stage.sectionKeys) {
      const signed =
        key === 'assignment'
          ? isWorkshop2TzSectionFullySignedWithPassport('assignment', signoffs, dossier) ||
            workshop2TzSignoffMetaIsCommitted(signoffs?.assignment?.brand)
          : isWorkshop2TzSectionFullySignedWithPassport(key, signoffs, dossier);
      if (!signed) {
        missingRu.push(key);
      }
    }
    if (stage.requireAssignment && !missingRu.includes('assignment')) {
      const ok =
        isWorkshop2TzSectionFullySignedWithPassport('assignment', signoffs, dossier) ||
        workshop2TzSignoffMetaIsCommitted(signoffs?.assignment?.brand);
      if (!ok) missingRu.push('assignment');
    }
    return {
      stageId: stage.stageId,
      labelRu: stage.labelRu,
      complete: missingRu.length === 0,
      missingRu,
    };
  });
  const stagesComplete = rows.filter((r) => r.complete).length;
  const pending = rows.filter((r) => !r.complete);
  return {
    stagesTotal: rows.length,
    stagesComplete,
    rows,
    hintRu: pending.length
      ? `Незавершённые этапы signoff: ${pending.map((p) => p.labelRu).join(', ')}.`
      : 'Все этапы signoff пройдены.',
  };
}

export function evaluateWorkshop2DynamicSignoffGate(input: {
  dossier: Workshop2DossierPhase1;
  stages: Workshop2SignoffStageDef[];
}): Workshop2HandoffReadinessCheck | null {
  const progress = summarizeWorkshop2SignoffStagesProgress({
    dossier: input.dossier,
    stages: input.stages,
  });
  if (progress.stagesComplete >= progress.stagesTotal) return null;
  return {
    id: 'signoff.stages.incomplete',
    severity: 'blocker',
    messageRu:
      progress.hintRu ??
      `Signoff: ${progress.stagesComplete}/${progress.stagesTotal} этапов — завершите настройку коллекции.`,
  };
}
