import {
  findHandbookLeafById,
  resolveHandbookLeafId,
} from '@/lib/production/category-handbook-leaves';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';

/**
 * `leafId` с учётом алиасов таксономии; снимок `category-handbook.snapshot.json` — единый источник.
 */
export function isValidHandbookCatalogLeafId(leafId: string): boolean {
  if (!leafId || typeof leafId !== 'string') return false;
  return Boolean(findHandbookLeafById(leafId.trim()));
}

export function resolveOrRejectHandbookCatalogLeafId(
  leafId: string
):
  | { ok: true; leaf: HandbookCategoryLeaf; canonicalId: string }
  | { ok: false; reason: 'empty' | 'unknown' } {
  const t = leafId?.trim() ?? '';
  if (!t) return { ok: false, reason: 'empty' };
  const leaf = findHandbookLeafById(t);
  if (!leaf) return { ok: false, reason: 'unknown' };
  return { ok: true, leaf, canonicalId: resolveHandbookLeafId(leaf.leafId) };
}
