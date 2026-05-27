/**
 * Индекс документов: статические ссылки + покрытие vault (без full-text search).
 */
import { buildWorkshop2DocumentsIndex } from '@/lib/production/workshop2-documents-index';

export type Workshop2DocumentsIndexStatus = {
  staticEntryCount: number;
  vaultDocCount: number;
  vaultIndexedCount: number;
  techPackAttachmentCount: number;
  fullTextSearchAvailable: false;
  state: 'empty' | 'partial' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2DocumentsIndexStatus(input: {
  collectionId: string;
  articleUrlSegment: string;
  vaultDocuments: { id: string; storagePath?: string | null; title?: string }[];
  techPackAttachmentCount?: number;
  backendMode?: 'server' | 'local';
}): Workshop2DocumentsIndexStatus {
  const staticEntries = buildWorkshop2DocumentsIndex({
    collectionId: input.collectionId,
    articleUrlSegment: input.articleUrlSegment,
  });
  const vaultDocCount = input.vaultDocuments.length;
  const vaultIndexedCount = input.vaultDocuments.filter(
    (d) => Boolean(d.storagePath?.trim()) || Boolean(d.title?.trim())
  ).length;
  const techPackAttachmentCount = input.techPackAttachmentCount ?? 0;

  let state: Workshop2DocumentsIndexStatus['state'] = 'ready';
  if (vaultDocCount === 0 && techPackAttachmentCount === 0) {
    state = 'empty';
  } else if (
    input.backendMode === 'server' &&
    vaultDocCount > 0 &&
    vaultIndexedCount < vaultDocCount
  ) {
    state = 'partial';
  }

  let hintRu: string | undefined;
  if (state === 'empty') {
    hintRu = 'Индекс: vault, ZIP ТЗ и handoff — загрузите файлы в Vault для полного пакета.';
  } else if (state === 'partial') {
    hintRu = `Индекс статичен (${staticEntries.length} ссылки); ${vaultDocCount - vaultIndexedCount} vault-записей без storage_path — не в ZIP.`;
  } else if (techPackAttachmentCount > 0) {
    hintRu = `Индекс + ${techPackAttachmentCount} tech-pack вложений в досье; полнотекстовый поиск vault — в roadmap.`;
  } else {
    hintRu = `Индекс: ${staticEntries.length} быстрых ссылки; ${vaultDocCount} файл(ов) vault. Полнотекстовый поиск — не реализован (потолок 8.8).`;
  }

  return {
    staticEntryCount: staticEntries.length,
    vaultDocCount,
    vaultIndexedCount,
    techPackAttachmentCount,
    fullTextSearchAvailable: false,
    state,
    hintRu,
  };
}
