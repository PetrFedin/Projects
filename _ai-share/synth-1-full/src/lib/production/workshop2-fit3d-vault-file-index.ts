/**
 * Wave 41 #55: индекс vault файлов для Fit3D (список + ссылка на upload).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { hasWorkshop2VaultGlbInIndex } from '@/lib/production/workshop2-fit3d-vault-gate';

export type Workshop2Fit3dVaultFileRow = {
  id: string;
  fileName: string;
  mimeType?: string;
  storagePath?: string;
  isGlb: boolean;
  uploadedAt?: string;
};

export function listWorkshop2Fit3dVaultFilesFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2Fit3dVaultFileRow[] {
  const docs = dossier.vaultDocuments ?? [];
  return docs.map((d) => {
    const name = String(d.title ?? d.id ?? 'file');
    const lower = name.toLowerCase();
    return {
      id: String(d.id ?? name),
      fileName: name,
      mimeType: undefined,
      storagePath: undefined,
      isGlb: lower.endsWith('.glb') || lower.endsWith('.gltf'),
      uploadedAt: d.uploadedAt,
    };
  });
}

export function summarizeWorkshop2Fit3dVaultFileIndex(dossier: Workshop2DossierPhase1): {
  fileCount: number;
  glbCount: number;
  hasProductionGlb: boolean;
  hintRu: string;
} {
  const rows = listWorkshop2Fit3dVaultFilesFromDossier(dossier);
  const glbCount = rows.filter((r) => r.isGlb).length;
  const hasProductionGlb = hasWorkshop2VaultGlbInIndex(dossier);
  return {
    fileCount: rows.length,
    glbCount,
    hasProductionGlb,
    hintRu:
      rows.length === 0
        ? 'Vault пуст — загрузите .glb через вкладку Vault.'
        : hasProductionGlb
          ? `Vault: ${rows.length} файл(ов), ${glbCount} 3D — Fit3D prod path OK.`
          : `Vault: ${rows.length} файл(ов) — нужен .glb для production Fit3D.`,
  };
}
