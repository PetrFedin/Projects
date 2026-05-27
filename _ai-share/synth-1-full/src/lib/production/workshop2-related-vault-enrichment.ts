/**
 * Wave 19 #23: vault doc count в полосе связанных разделов.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function countWorkshop2VaultDocumentsForRelatedStrip(
  dossier?: Workshop2DossierPhase1 | null
): number {
  return dossier?.vaultDocuments?.length ?? 0;
}

export function formatWorkshop2RelatedVaultLinkLabel(docCount: number): string {
  if (docCount <= 0) return 'Документы';
  return `Документы (${docCount})`;
}
