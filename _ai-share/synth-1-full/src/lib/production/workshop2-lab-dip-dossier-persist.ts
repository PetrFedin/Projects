/**
 * Wave 25 #52: зеркало lab dip + gate sample-order (fallback live palette).
 */
import { summarizeWorkshop2LabDipStatus } from '@/lib/production/workshop2-lab-dip-status';
import { evaluateWorkshop2LabDipSampleGate } from '@/lib/production/workshop2-lab-dip-sample-gate';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2LabDipMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['labDipMirror']> {
  const status = summarizeWorkshop2LabDipStatus(dossier);
  const colorwayCount = status?.colorwayCount ?? 0;
  const approvedCount = status?.approvedCount ?? 0;
  const blockerSampleOrder =
    colorwayCount > 0 && approvedCount < colorwayCount && status?.state !== 'empty';

  return {
    mirroredAt: new Date().toISOString(),
    colorwayCount,
    approvedCount,
    pendingCount: status?.pendingCount ?? 0,
    rejectedCount: status?.rejectedCount ?? 0,
    state: status?.state ?? 'empty',
    blockerSampleOrder,
    hintRu: status?.hintRu,
  };
}

export function persistWorkshop2LabDipMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    labDipMirror: buildWorkshop2LabDipMirror(dossier),
  };
}

export function evaluateWorkshop2LabDipMirrorGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.labDipMirror;
  if (!mirror) {
    return evaluateWorkshop2LabDipSampleGate(dossier);
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'supply.lab_dip.not_approved',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ??
        `Lab dip: одобрено ${mirror.approvedCount}/${mirror.colorwayCount} — согласуйте цвета.`,
    };
  }
  if (mirror.state === 'blocked') {
    return {
      id: 'supply.lab_dip.rejected',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'Есть отклонённые lab dip — обновите статусы colorway.',
    };
  }
  return null;
}
