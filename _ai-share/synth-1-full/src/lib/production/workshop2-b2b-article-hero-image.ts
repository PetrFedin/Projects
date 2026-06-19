import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { resolveWorkshop2SketchSheetThumbUrl } from '@/lib/production/workshop2-fit-session-photo';

/** Hero/preview для B2B matrix и linesheet — vault mirror или скетч из досье. */
export function resolveWorkshop2B2bArticleHeroImageUrl(
  dossier: Workshop2DossierPhase1 | null | undefined
): string | undefined {
  const vaultUrl = dossier?.vaultPanelMirror?.heroPreviewUrl?.trim();
  if (vaultUrl) return vaultUrl;
  return resolveWorkshop2SketchSheetThumbUrl(dossier);
}
