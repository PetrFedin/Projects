/**
 * Wave 23 #39: зеркало grading apply log + gate export-tz.
 */
import { summarizeWorkshop2GradingStatus } from '@/lib/production/workshop2-grading-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2GradingApplyMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['gradingApplyMirror']> {
  const status = summarizeWorkshop2GradingStatus(dossier, null);
  const last = dossier.gradingApplyLog?.[0];
  const hasApplyLog = Boolean(last?.appliedAt);
  const blockerExport = status.hasSampleScale && status.ruleCount === 0 && !hasApplyLog;

  return {
    mirroredAt: new Date().toISOString(),
    ruleCount: status.ruleCount,
    sizeCount: status.sizeCount,
    lastAppliedAt: last?.appliedAt,
    hasApplyLog,
    state: status.state,
    blockerExport,
    hintRu: status.hintRu,
  };
}

export function persistWorkshop2GradingApplyMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    gradingApplyMirror: buildWorkshop2GradingApplyMirror(dossier),
  };
}

export function evaluateWorkshop2GradingApplyExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.gradingApplyMirror;
  if (!mirror) {
    return {
      id: 'grading.apply.mirror_missing',
      severity: 'warning',
      messageRu: 'Градация не зафиксирована в PG — «Градация → PG» на конструкции.',
    };
  }
  if (mirror.blockerExport) {
    return {
      id: 'grading.apply.missing',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Шкала задана, но градация не применена — ZIP ТЗ заблокирован до apply.',
    };
  }
  if (mirror.state === 'partial') {
    return {
      id: 'grading.apply.partial',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'Градация частична — проверьте правила и размерные строки.',
    };
  }
  return null;
}

/** Wave 25 #39: тот же критерий apply — blocker handoff-commit при шкале без apply log. */
export function evaluateWorkshop2GradingApplyHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const exportCheck = evaluateWorkshop2GradingApplyExportGate(dossier);
  if (!exportCheck) return null;
  if (exportCheck.id === 'grading.apply.mirror_missing') {
    return {
      ...exportCheck,
      messageRu: 'Градация не зафиксирована в PG — «Градация → PG» перед handoff.',
    };
  }
  return exportCheck;
}
