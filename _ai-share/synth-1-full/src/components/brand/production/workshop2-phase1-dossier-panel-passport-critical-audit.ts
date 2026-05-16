import { filterPassportCriticalAuditLines } from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Уникальные строки критичного аудита паспорта из журнала правок досье. */
export function buildPassportCriticalAuditSummariesFromTzActionLog(
  tzActionLog: Workshop2DossierPhase1['tzActionLog']
): readonly { id: string; messages: readonly string[] }[] {
  const acc: string[] = [];
  for (const e of tzActionLog ?? []) {
    if (e.action.type === 'dossier_edit') acc.push(...e.action.summaries);
  }
  const uniq = [...new Set(filterPassportCriticalAuditLines(acc))];
  return uniq.map((text, i) => ({
    id: `passport-critical-${i}`,
    messages: [text],
  }));
}
