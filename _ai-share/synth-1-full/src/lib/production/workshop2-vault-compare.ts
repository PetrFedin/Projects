/**
 * Wave 3 P1: vault PDF revision compare (hash + page summary).
 */
import { createHash } from 'node:crypto';

export type Workshop2VaultCompareDoc = {
  id: string;
  title?: string;
  storagePath?: string | null;
  metadata?: Record<string, unknown> | null;
  pageCount?: number;
};

export type Workshop2VaultCompareResult = {
  leftId: string;
  rightId: string;
  leftLabel: string;
  rightLabel: string;
  sameFileHash: boolean;
  leftHash: string;
  rightHash: string;
  leftPageCount: number | null;
  rightPageCount: number | null;
  pageCountDelta: number | null;
  summaryRu: string;
};

function docLabel(doc: Workshop2VaultCompareDoc): string {
  return doc.title?.trim() || doc.id;
}

function readPageCount(doc: Workshop2VaultCompareDoc): number | null {
  if (typeof doc.pageCount === 'number' && Number.isFinite(doc.pageCount)) return doc.pageCount;
  const meta = doc.metadata ?? {};
  const raw = meta.pageCount ?? meta.page_count ?? meta.pages;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function hashDoc(doc: Workshop2VaultCompareDoc): string {
  const payload = JSON.stringify({
    id: doc.id,
    title: doc.title ?? '',
    storagePath: doc.storagePath ?? '',
    pageCount: readPageCount(doc),
    metadata: doc.metadata ?? {},
  });
  return createHash('sha256').update(payload).digest('hex').slice(0, 16);
}

export function compareWorkshop2VaultRevisions(input: {
  left: Workshop2VaultCompareDoc;
  right: Workshop2VaultCompareDoc;
}): Workshop2VaultCompareResult {
  const leftHash = hashDoc(input.left);
  const rightHash = hashDoc(input.right);
  const leftPageCount = readPageCount(input.left);
  const rightPageCount = readPageCount(input.right);
  const pageCountDelta =
    leftPageCount != null && rightPageCount != null ? rightPageCount - leftPageCount : null;
  const sameFileHash = leftHash === rightHash;
  let summaryRu = sameFileHash
    ? 'Ревизии идентичны по hash метаданных.'
    : 'Ревизии различаются (hash метаданных).';
  if (pageCountDelta != null && pageCountDelta !== 0) {
    summaryRu += ` Δ страниц: ${pageCountDelta > 0 ? '+' : ''}${pageCountDelta}.`;
  }
  return {
    leftId: input.left.id,
    rightId: input.right.id,
    leftLabel: docLabel(input.left),
    rightLabel: docLabel(input.right),
    sameFileHash,
    leftHash,
    rightHash,
    leftPageCount,
    rightPageCount,
    pageCountDelta,
    summaryRu,
  };
}
