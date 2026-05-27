/**
 * Заказ образца блокируется, пока не одобрены lab dip по всем colorway.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { summarizeWorkshop2ColorPaletteStatus } from '@/lib/production/workshop2-color-palette-status';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function evaluateWorkshop2LabDipSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const palette = summarizeWorkshop2ColorPaletteStatus(dossier);
  if (palette.colorwayCount === 0) return null;

  if (palette.labDipApprovedCount < palette.colorwayCount) {
    const pending = palette.colorwayCount - palette.labDipApprovedCount;
    return {
      id: 'supply.lab_dip.not_approved',
      severity: 'blocker',
      messageRu:
        palette.hintRu ??
        `Lab dip: одобрено ${palette.labDipApprovedCount}/${palette.colorwayCount} — согласуйте ${pending} цвет(ов) перед заказом образца.`,
    };
  }

  return null;
}
