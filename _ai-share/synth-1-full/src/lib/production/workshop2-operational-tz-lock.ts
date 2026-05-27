/**
 * Блокировка перехода с операционной вкладки в ТЗ — по движку готовности, не «любой скетч».
 */

import { calculateDossierReadiness } from '@/lib/production/dossier-readiness-engine';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2OperationalTzBridge,
  type Workshop2OperationalPipelineTab,
} from '@/lib/production/workshop2-article-operational-tz-bridge';

export type Workshop2OperationalTzLockResult = {
  locked: boolean;
  reasonRu: string;
  focusPct: number;
};

export function evaluateWorkshop2OperationalTzLock(input: {
  tab: Workshop2OperationalPipelineTab;
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | null | undefined;
}): Workshop2OperationalTzLockResult {
  if (!input.dossier) {
    return {
      locked: true,
      reasonRu: 'Досье не загружено — откройте вкладку «Техническое задание» и сохраните.',
      focusPct: 0,
    };
  }

  if (!input.leaf?.leafId) {
    return {
      locked: true,
      reasonRu: 'Категория L3 не выбрана — укажите в паспорте артикула.',
      focusPct: 0,
    };
  }

  const bridge = buildWorkshop2OperationalTzBridge(input.tab, input.dossier, input.leaf);
  const pctMatch = /(\d+)%/.exec(bridge.focusPctLabel);
  const focusPct = pctMatch ? Number(pctMatch[1]) : 0;

  const readiness = calculateDossierReadiness(input.dossier, input.leaf);
  const overallLow = readiness.overall.pct < 15;

  if (overallLow) {
    return {
      locked: true,
      reasonRu: `ТЗ заполнено на ${readiness.overall.pct}% — минимум паспорт и категория.`,
      focusPct,
    };
  }

  return {
    locked: false,
    reasonRu: bridge.blockerLines[0] ?? 'Связанные разделы ТЗ доступны для редактирования.',
    focusPct,
  };
}
