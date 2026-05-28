import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

/** Шоурум B2B и ссылка на образец — только при модели оптового предзаказа. */
export function isWorkshop2ShowroomPreorderContext(
  dossier: Workshop2DossierPhase1 | null | undefined
): boolean {
  if (!dossier) return false;
  const launch = dossier.passportProductionBrief?.plannedLaunchType;
  if (launch === 'wholesale_preorder') return true;
  if (dossier.b2bIntegrationDraft?.isLive) return true;
  return false;
}
