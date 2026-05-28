/**
 * Обёртка readiness референсов для баннера (visual handoff gate).
 */
import {
  evaluateWorkshop2VisualReferencesReadiness,
  type Workshop2VisualReferencesReadiness,
  type Workshop2VisualReferencesReadinessInput,
} from '@/lib/production/workshop2-visual-references-readiness';

export type Workshop2VisualReferencesStatus = Workshop2VisualReferencesReadiness & {
  state: 'blocked' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2VisualReferencesStatus(
  dossier: Workshop2VisualReferencesReadinessInput | null | undefined
): Workshop2VisualReferencesStatus {
  const base = evaluateWorkshop2VisualReferencesReadiness(dossier);
  const state: Workshop2VisualReferencesStatus['state'] = base.readyForVisualGate
    ? 'ready'
    : 'blocked';

  let hintRu = base.blockerRu;
  if (state === 'ready') {
    hintRu = `Визуал готов: ${base.mediaRefCount} media ref · чеклист ${base.handoffChecklistDone}/${base.handoffChecklistTotal}.`;
  }

  return {
    ...base,
    state,
    hintRu,
  };
}
