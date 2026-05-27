/**
 * Wave 11: deep link из B2B lookbook/showroom → workspace артикула (если mapping в campaign/collectionId).
 */
import type { LookbookProject } from '@/lib/b2b/lookbook-projects-store';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';

/** Демо SS27: первый артикул коллекции для buyer path без отдельного SKU mapping. */
const SS27_DEFAULT_ARTICLE_BY_COLLECTION: Record<string, string> = {
  SS27: 'demo-ss27-01',
};

export function resolveShowroomWorkspaceArticleId(
  project: Pick<LookbookProject, 'collectionId' | 'workspaceArticleId'>
): string | null {
  const explicit = project.workspaceArticleId?.trim();
  if (explicit) return explicit;
  const col = project.collectionId?.trim();
  if (!col) return null;
  return SS27_DEFAULT_ARTICLE_BY_COLLECTION[col] ?? null;
}

export function resolveShowroomLookbookWorkspaceHref(
  project: Pick<LookbookProject, 'collectionId' | 'workspaceArticleId' | 'id'>
): string | null {
  const collectionId = project.collectionId?.trim();
  const articleId = resolveShowroomWorkspaceArticleId(project);
  if (!collectionId || !articleId) return null;
  return workshop2ArticleHref(collectionId, articleId);
}
