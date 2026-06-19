/**
 * Wave 25 #52: зеркало lab dip + gate sample-order (fallback live palette).
 */
import { summarizeWorkshop2LabDipStatus } from '@/lib/production/workshop2-lab-dip-status';
import { evaluateWorkshop2LabDipSampleGate } from '@/lib/production/workshop2-lab-dip-sample-gate';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

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
  const blockerSampleOrder =
    mirror.blockerSampleOrder === true ||
    workshop2PgMirrorStr(mirror, 'blockerSampleOrder') === 'true';
  const hintRu = workshop2PgMirrorStr(mirror, 'hintRu');
  const approvedCount = workshop2PgMirrorNum(mirror, 'approvedCount');
  const colorwayCount = workshop2PgMirrorNum(mirror, 'colorwayCount');
  const state = workshop2PgMirrorStr(mirror, 'state') || String(mirror.state ?? '');

  if (blockerSampleOrder) {
    return {
      id: 'supply.lab_dip.not_approved',
      severity: 'blocker',
      messageRu:
        hintRu || `Lab dip: одобрено ${approvedCount}/${colorwayCount} — согласуйте цвета.`,
    };
  }
  if (state === 'blocked') {
    return {
      id: 'supply.lab_dip.rejected',
      severity: 'blocker',
      messageRu: hintRu || 'Есть отклонённые lab dip — обновите статусы colorway.',
    };
  }
  return null;
}
