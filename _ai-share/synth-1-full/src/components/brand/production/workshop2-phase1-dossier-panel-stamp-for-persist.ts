import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import {
  summarizeWorkshop2PersistAttrDiffDetails,
  summarizeWorkshop2PersistDiff,
} from '@/lib/production/workshop2-dossier-activity-log';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/**
 * Подготовка досье к сохранению: служебные поля, при необходимости — строки журнала ТЗ по diff к последнему успешному снапшоту.
 */
export function stampPhase1DossierForPersist(
  next: Workshop2DossierPhase1,
  opts: { freezeUpdatedAt?: boolean } | undefined,
  updatedByLabel: string,
  prevSnap: Workshop2DossierPhase1 | null
): Workshop2DossierPhase1 {
  let stamped: Workshop2DossierPhase1 = {
    ...next,
    schemaVersion: 1,
    updatedAt:
      opts?.freezeUpdatedAt && next.updatedAt
        ? next.updatedAt
        : new Date().toISOString(),
    updatedBy:
      opts?.freezeUpdatedAt && next.updatedBy
        ? next.updatedBy
        : updatedByLabel.slice(0, 256),
  };
  if (prevSnap) {
    const summaries = summarizeWorkshop2PersistDiff(prevSnap, stamped);
    const details = summarizeWorkshop2PersistAttrDiffDetails(prevSnap, stamped);
    const lines = [...summaries, ...details];
    if (lines.length > 0) {
      stamped = pushTzActionLog(stamped, updatedByLabel, { type: 'dossier_edit', summaries: lines });
    }
  }
  return stamped;
}
