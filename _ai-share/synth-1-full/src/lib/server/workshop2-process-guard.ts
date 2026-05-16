import type { Workshop2DossierPhase1, Workshop2DossierLifecycleState } from '@/lib/production/workshop2-dossier-phase1.types';
import { buildWorkshop2TzGateSnapshot } from '@/lib/production/workshop2-tz-gates';

export function validateLifecycleTargetByGate(
  dossier: Workshop2DossierPhase1,
  targetState: Workshop2DossierLifecycleState
): { ok: true } | { ok: false; reasonCode: string; detail: string } {
  const gate = buildWorkshop2TzGateSnapshot(dossier);
  if (targetState === 'handoff_ready') {
    if (gate.sectionSignoffsFull < 4) {
      return {
        ok: false,
        reasonCode: 'GATE_SECTION_SIGNOFFS_INCOMPLETE',
        detail: 'Для handoff_ready нужны подписи всех 4 секций.',
      };
    }
  }
  if (targetState === 'sent_to_production') {
    if (gate.sectionSignoffsFull < 4) {
      return {
        ok: false,
        reasonCode: 'GATE_SECTION_SIGNOFFS_INCOMPLETE',
        detail: 'Перед sent_to_production нужны подписи всех 4 секций.',
      };
    }
    if (!gate.hasHandoffMarks) {
      return {
        ok: false,
        reasonCode: 'GATE_HANDOFF_MARKS_REQUIRED',
        detail: 'Перед sent_to_production зафиксируйте handoff отметки бренд/цех.',
      };
    }
    if (
      (gate.sectionMinimumErrors.material ?? []).length > 0 ||
      (gate.sectionMinimumErrors.construction ?? []).length > 0
    ) {
      return {
        ok: false,
        reasonCode: 'GATE_MINIMUM_ERRORS_BLOCK_SENT',
        detail: 'Перед sent_to_production исправьте минимум по материалам/конструкции.',
      };
    }
  }
  if (targetState === 'accepted') {
    if (gate.sectionSignoffsFull < 4) {
      return {
        ok: false,
        reasonCode: 'GATE_SECTION_SIGNOFFS_INCOMPLETE',
        detail: 'Перед accepted нужны подписи всех 4 секций.',
      };
    }
    if (!gate.hasHandoffMarks) {
      return {
        ok: false,
        reasonCode: 'GATE_HANDOFF_MARKS_REQUIRED',
        detail: 'Перед accepted зафиксируйте handoff отметки бренд/цех.',
      };
    }
  }
  return { ok: true };
}
