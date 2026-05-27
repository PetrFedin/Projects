/**
 * Wave 25 #77: зеркало индекса документов + gate export-tz warning.
 */
import { summarizeWorkshop2DocumentsIndexStatus } from '@/lib/production/workshop2-documents-index-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2DocumentsIndexMirror(input: {
  collectionId: string;
  articleUrlSegment: string;
  dossier: Workshop2DossierPhase1;
  backendMode: 'server' | 'local';
}): NonNullable<Workshop2DossierPhase1['documentsIndexMirror']> {
  const vaultDocs = (input.dossier.vaultDocuments ?? []) as {
    id: string;
    storagePath?: string | null;
    title?: string;
  }[];
  const status = summarizeWorkshop2DocumentsIndexStatus({
    collectionId: input.collectionId,
    articleUrlSegment: input.articleUrlSegment,
    vaultDocuments: vaultDocs,
    techPackAttachmentCount: input.dossier.techPackAttachments?.length ?? 0,
    backendMode: input.backendMode,
  });
  const blockerExport = status.state === 'empty';

  return {
    mirroredAt: new Date().toISOString(),
    staticEntryCount: status.staticEntryCount,
    vaultDocCount: status.vaultDocCount,
    vaultIndexedCount: status.vaultIndexedCount,
    techPackAttachmentCount: status.techPackAttachmentCount,
    state: status.state,
    blockerExport,
    hintRu: status.hintRu,
  };
}

export function persistWorkshop2DocumentsIndexMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    collectionId: string;
    articleUrlSegment: string;
    backendMode: 'server' | 'local';
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    documentsIndexMirror: buildWorkshop2DocumentsIndexMirror({ ...input, dossier }),
  };
}

export function evaluateWorkshop2DocumentsIndexExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.documentsIndexMirror;
  if (!mirror) {
    const status = summarizeWorkshop2DocumentsIndexStatus({
      collectionId: '',
      articleUrlSegment: '',
      vaultDocuments: dossier.vaultDocuments ?? [],
      techPackAttachmentCount: dossier.techPackAttachments?.length ?? 0,
    });
    if (status.state === 'empty') {
      return {
        id: 'documents.index.empty',
        severity: 'warning',
        messageRu: status.hintRu ?? 'Индекс документов пуст — ZIP может не содержать vault-файлов.',
      };
    }
    return {
      id: 'documents.index.mirror_missing',
      severity: 'warning',
      messageRu: 'Индекс документов не в PG — «Индекс → PG» на вкладке Vault.',
    };
  }
  if (mirror.blockerExport) {
    return {
      id: 'documents.index.empty',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'Нет vault/tech-pack в индексе — пакет ТЗ может быть неполным.',
    };
  }
  if (mirror.state === 'partial') {
    return {
      id: 'documents.index.partial',
      severity: 'warning',
      messageRu:
        mirror.hintRu ??
        `${mirror.vaultDocCount - mirror.vaultIndexedCount} vault без storage_path — не попадут в ZIP.`,
    };
  }
  return null;
}
