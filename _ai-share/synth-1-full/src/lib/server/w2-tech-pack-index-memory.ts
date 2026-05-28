import type { W2TechPackIndexRow } from '@/lib/server/w2-tech-pack-index-pg';

const store = new Map<string, W2TechPackIndexRow>();

function key(collectionId: string, articleId: string, attachmentId: string) {
  return `${collectionId}\n${articleId}\n${attachmentId}`;
}

export function memoryUpsertW2TechPackIndexRow(
  row: Omit<W2TechPackIndexRow, 'updatedAt'> & { updatedAt?: string }
): void {
  const k = key(row.collectionId, row.articleId, row.attachmentId);
  const updatedAt = row.updatedAt ?? new Date().toISOString();
  store.set(k, { ...row, updatedAt });
}

export function memoryGetW2TechPackIndexRow(
  collectionId: string,
  articleId: string,
  attachmentId: string
): W2TechPackIndexRow | null {
  return store.get(key(collectionId, articleId, attachmentId)) ?? null;
}

export function memoryListW2TechPackIndexForArticle(
  collectionId: string,
  articleId: string
): W2TechPackIndexRow[] {
  const prefix = `${collectionId}\n${articleId}\n`;
  const out: W2TechPackIndexRow[] = [];
  for (const [k, v] of store) {
    if (k.startsWith(prefix)) out.push(v);
  }
  out.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return out;
}

export function memoryUpdateHandoff(
  collectionId: string,
  articleId: string,
  attachmentId: string,
  handoffStatus: string,
  packageRevision?: string | null
): void {
  const k = key(collectionId, articleId, attachmentId);
  const cur = store.get(k);
  if (!cur) return;
  const updatedAt = new Date().toISOString();
  store.set(k, {
    ...cur,
    handoffStatus,
    packageRevision:
      packageRevision !== undefined && packageRevision !== null
        ? packageRevision
        : cur.packageRevision,
    updatedAt,
  });
}
