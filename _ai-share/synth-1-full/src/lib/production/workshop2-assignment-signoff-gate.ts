/**
 * Ворота sample-order: подписи секций ТЗ перед заказом образца.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { summarizeWorkshop2AssignmentSignoffChecklist } from '@/lib/production/workshop2-assignment-signoff-checklist';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

const MIN_SECTIONS_SIGNED = 4;

export function evaluateWorkshop2AssignmentSignoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const summary = summarizeWorkshop2AssignmentSignoffChecklist(dossier);
  if (!summary) return null;
  if (summary.sectionsSigned >= MIN_SECTIONS_SIGNED) return null;
  return {
    id: 'assignment.signoff.sections',
    severity: 'blocker',
    messageRu: `Подпишите секции ТЗ (${summary.sectionsSigned}/${MIN_SECTIONS_SIGNED}): ${summary.rows
      .filter((r) => !r.signed)
      .map((r) => r.labelRu)
      .join(', ')}.`,
  };
}
