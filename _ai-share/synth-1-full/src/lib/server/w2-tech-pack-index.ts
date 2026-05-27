/**
 * Индекс вложений tech pack: Postgres при DATABASE_URL, иначе in-memory (один инстанс Node / dev).
 */
import {
  getW2TechPackIndexRow as pgGet,
  listW2TechPackIndexForArticle as pgList,
  updateHandoffOnIndex as pgUpdateHandoff,
  upsertW2TechPackIndexRow as pgUpsert,
  w2TechPackIndexPgEnabled,
  type W2TechPackIndexRow,
} from '@/lib/server/w2-tech-pack-index-pg';
import {
  memoryGetW2TechPackIndexRow,
  memoryListW2TechPackIndexForArticle,
  memoryUpdateHandoff,
  memoryUpsertW2TechPackIndexRow,
} from '@/lib/server/w2-tech-pack-index-memory';

export type { W2TechPackIndexRow };

export async function upsertW2TechPackIndex(
  row: Omit<W2TechPackIndexRow, 'updatedAt'> & { updatedAt?: string }
): Promise<void> {
  if (w2TechPackIndexPgEnabled()) {
    try {
      await pgUpsert(row);
      return;
    } catch (e) {
      console.error('[w2_techpack_index] pg upsert failed, fallback memory', e);
    }
  }
  memoryUpsertW2TechPackIndexRow(row);
}

export async function getW2TechPackIndex(
  collectionId: string,
  articleId: string,
  attachmentId: string
): Promise<W2TechPackIndexRow | null> {
  if (w2TechPackIndexPgEnabled()) {
    try {
      return await pgGet(collectionId, articleId, attachmentId);
    } catch (e) {
      console.error('[w2_techpack_index] pg get failed', e);
    }
  }
  return memoryGetW2TechPackIndexRow(collectionId, articleId, attachmentId);
}

export async function listW2TechPackIndexForArticle(
  collectionId: string,
  articleId: string
): Promise<W2TechPackIndexRow[]> {
  if (w2TechPackIndexPgEnabled()) {
    try {
      return await pgList(collectionId, articleId);
    } catch (e) {
      console.error('[w2_techpack_index] pg list failed', e);
    }
  }
  return memoryListW2TechPackIndexForArticle(collectionId, articleId);
}

export async function updateW2TechPackHandoff(
  collectionId: string,
  articleId: string,
  attachmentId: string,
  handoffStatus: string,
  packageRevision?: string | null
): Promise<void> {
  if (w2TechPackIndexPgEnabled()) {
    try {
      await pgUpdateHandoff(collectionId, articleId, attachmentId, handoffStatus, packageRevision);
      return;
    } catch (e) {
      console.error('[w2_techpack_index] pg handoff update failed', e);
    }
  }
  memoryUpdateHandoff(collectionId, articleId, attachmentId, handoffStatus, packageRevision);
}
