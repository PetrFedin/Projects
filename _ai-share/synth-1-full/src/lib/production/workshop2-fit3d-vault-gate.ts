/**
 * Wave 37 #55: Fit3D — блокировка placeholder без .glb в vault index.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  resolveWorkshop2Fit3dModel,
  WORKSHOP2_FIT3D_PLACEHOLDER_GLB,
} from '@/lib/production/workshop2-fit-3d-model-resolve';

export type Workshop2Fit3dVaultIndexEntry = {
  documentId: string;
  storagePath?: string | null;
  fileName?: string;
};

function pathLooksGlb(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v.endsWith('.glb') || v.endsWith('.gltf');
}

/** Индекс vault-документов с бинарным .glb/.gltf (storagePath или metadata). */
export function listWorkshop2VaultGlbIndex(
  vaultDocuments: Workshop2Fit3dVaultIndexEntry[]
): Workshop2Fit3dVaultIndexEntry[] {
  return vaultDocuments.filter((d) => {
    if (d.storagePath && pathLooksGlb(d.storagePath)) return true;
    if (d.fileName && pathLooksGlb(d.fileName)) return true;
    const meta = (d as { metadata?: Record<string, unknown> }).metadata;
    const fn = typeof meta?.fileName === 'string' ? meta.fileName : undefined;
    const sp = typeof meta?.storagePath === 'string' ? meta.storagePath : undefined;
    return Boolean((fn && pathLooksGlb(fn)) || (sp && pathLooksGlb(sp)));
  });
}

/** Wave 3 #55: валидация upload .glb перед индексацией vault. */
export function validateWorkshop2VaultGlbUpload(input: {
  fileName: string;
  contentType?: string | null;
  sizeBytes?: number;
}): { ok: boolean; error?: string; messageRu?: string } {
  const name = input.fileName.trim().toLowerCase();
  if (!pathLooksGlb(name)) {
    return {
      ok: false,
      error: 'not_glb',
      messageRu: 'Fit3D vault: допускаются только .glb / .gltf.',
    };
  }
  if (input.sizeBytes != null && input.sizeBytes <= 0) {
    return {
      ok: false,
      error: 'empty_file',
      messageRu: 'Fit3D vault: пустой файл .glb.',
    };
  }
  const ct = String(input.contentType ?? '').toLowerCase();
  if (ct && !ct.includes('gltf') && !ct.includes('octet-stream') && !ct.includes('model')) {
    return {
      ok: false,
      error: 'content_type',
      messageRu: `Fit3D vault: неожиданный content-type (${ct}).`,
    };
  }
  return { ok: true };
}

export function hasWorkshop2VaultGlbInIndex(dossier: Workshop2DossierPhase1): boolean {
  const docs = (dossier.vaultDocuments ?? []).map((d) => {
    const ext = d as unknown as Workshop2Fit3dVaultIndexEntry & {
      metadata?: Record<string, unknown>;
      title?: string;
    };
    const titleName = typeof d.title === 'string' ? d.title : undefined;
    return {
      documentId: d.id,
      storagePath:
        ext.storagePath ??
        (typeof ext.metadata?.storagePath === 'string' ? ext.metadata.storagePath : null),
      fileName: typeof ext.metadata?.fileName === 'string' ? ext.metadata.fileName : titleName,
      metadata: ext.metadata,
    };
  });
  if (listWorkshop2VaultGlbIndex(docs).length > 0) return true;
  const cadId = dossier.fitSessions?.[0]?.cadVersionId;
  if (cadId && pathLooksGlb(String(cadId))) return true;
  return false;
}

export function evaluateWorkshop2Fit3dVaultGlbGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId?: string;
  articleId?: string;
  nodeEnv?: string;
}): Workshop2HandoffReadinessCheck | null {
  const prod = (input.nodeEnv ?? process.env.NODE_ENV) === 'production';
  const cadId = input.dossier.fitSessions?.[0]?.cadVersionId;
  const resolution = resolveWorkshop2Fit3dModel({
    cadVersionId: cadId,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });

  if (!prod) return null;

  const hasGlb = hasWorkshop2VaultGlbInIndex(input.dossier);
  if (hasGlb) return null;

  if (resolution.placeholderBlockedInProd || resolution.isPlaceholder) {
    return {
      id: 'fit3d.vault.glb_missing',
      severity: 'blocker',
      messageRu:
        'Fit3D: нет .glb в vault index — загрузите модель в Vault (CAD ingest) перед образцом/handoff. Placeholder заблокирован в production.',
    };
  }

  if (resolution.modelUrl === WORKSHOP2_FIT3D_PLACEHOLDER_GLB) {
    return {
      id: 'fit3d.placeholder.blocked',
      severity: 'blocker',
      messageRu: 'Fit3D: placeholder.glb запрещён в production без vault .glb.',
    };
  }

  return null;
}

export function evaluateWorkshop2Fit3dVaultExportGate(input: {
  dossier: Workshop2DossierPhase1;
  collectionId?: string;
  articleId?: string;
}): Workshop2HandoffReadinessCheck | null {
  const check = evaluateWorkshop2Fit3dVaultGlbGate(input);
  if (!check) return null;
  return {
    id: 'fit3d.vault.export_warning',
    severity: 'warning',
    messageRu: check.messageRu,
  };
}
