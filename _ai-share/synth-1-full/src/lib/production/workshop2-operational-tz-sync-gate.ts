/**
 * Ворота синхронизации операционной вкладки ← ТЗ (не «sync» при пустых разделах).
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { calculateDossierReadiness } from '@/lib/production/dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2OperationalTzBridge,
  TAB_SOURCE_SECTIONS,
  type Workshop2OperationalPipelineTab,
} from '@/lib/production/workshop2-article-operational-tz-bridge';
import { evaluateWorkshop2OperationalTzLock } from '@/lib/production/workshop2-operational-tz-lock';

/** Минимум % по связанным секциям ТЗ перед merge operational ← dossier. */
export const WORKSHOP2_OPERATIONAL_TZ_SYNC_MIN_FOCUS_PCT = 30;

export type Workshop2OperationalTzSyncGateResult = {
  allowed: boolean;
  focusPct: number;
  reasonRu: string;
};

function tabFocusPct(
  tab: Workshop2OperationalPipelineTab,
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | null | undefined
): number {
  const r = calculateDossierReadiness(dossier, leaf ?? null);
  const secs = TAB_SOURCE_SECTIONS[tab];
  if (secs.length === 0) return 0;
  const sum = secs.reduce((a, s) => a + (r.sections[s]?.pct ?? 0), 0);
  return Math.round(sum / secs.length);
}

export function evaluateWorkshop2OperationalTzSyncGate(input: {
  tab: Workshop2OperationalPipelineTab;
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | null | undefined;
}): Workshop2OperationalTzSyncGateResult {
  const lock = evaluateWorkshop2OperationalTzLock(input);
  if (lock.locked) {
    return { allowed: false, focusPct: lock.focusPct, reasonRu: lock.reasonRu };
  }

  if (!input.dossier) {
    return {
      allowed: false,
      focusPct: 0,
      reasonRu: 'Досье не загружено — сохраните ТЗ перед синхронизацией.',
    };
  }

  const focusPct = tabFocusPct(input.tab, input.dossier, input.leaf);
  if (focusPct < WORKSHOP2_OPERATIONAL_TZ_SYNC_MIN_FOCUS_PCT) {
    const bridge = buildWorkshop2OperationalTzBridge(input.tab, input.dossier, input.leaf);
    return {
      allowed: false,
      focusPct,
      reasonRu:
        bridge.blockerLines[0] ??
        `Связанные разделы ТЗ заполнены на ${focusPct}% — минимум ${WORKSHOP2_OPERATIONAL_TZ_SYNC_MIN_FOCUS_PCT}% для синхронизации.`,
    };
  }

  return {
    allowed: true,
    focusPct,
    reasonRu: 'Синхронизация операционных данных из ТЗ разрешена.',
  };
}
