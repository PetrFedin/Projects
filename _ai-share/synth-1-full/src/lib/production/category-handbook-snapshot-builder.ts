/**
 * Сборка снимка категорий из `CATEGORY_HANDBOOK` (без JSON) — для `npm run gen:category-catalog`.
 */
import type { Audience, CategoryNode } from '@/lib/data/category-handbook';
import type { TaxonomyLeafAlias } from '@/lib/production/category-leaf-production-types';
import { TAXONOMY_LEAF_ALIASES } from '@/lib/production/category-taxonomy-aliases';

export type HandbookCategoryLeaf = {
  audienceId: string;
  audienceName: string;
  leafId: string;
  l1Name: string;
  l2Name: string;
  l3Name: string;
  pathLabel: string;
};

export type CategoryHandbookSnapshot = {
  /** v2: алиасы `leafId` в `taxonomyAliases`; v1 — только дерево. */
  schemaVersion: 1 | 2;
  generatedAt: string;
  source: string;
  audiences: { id: string; name: string }[];
  leaves: HandbookCategoryLeaf[];
  /** История переноса устаревших leafId → актуальный лист (производство, отчёты). */
  taxonomyAliases?: TaxonomyLeafAlias[];
};

function handbookL1L2L3FromChain(chain: CategoryNode[]): { l1: string; l2: string; l3: string } {
  const names = chain.map((n) => n.name);
  const l1 = names[0] ?? '';
  const l2 = names.length > 1 ? names[1]! : '—';
  const l3 = names.length > 2 ? names.slice(2).join(' › ') : '—';
  return { l1, l2, l3 };
}

export function handbookAudienceCategoryPath(
  _audienceName: string,
  l1: string,
  l2: string,
  l3: string
): string {
  return `${l1} › ${l2} › ${l3}`;
}

function walk(node: CategoryNode, audience: Audience, ancestors: CategoryNode[], out: HandbookCategoryLeaf[]) {
  const chain = [...ancestors, node];
  if (!node.children?.length) {
    const { l1, l2, l3 } = handbookL1L2L3FromChain(chain);
    out.push({
      audienceId: audience.id,
      audienceName: audience.name,
      leafId: node.id,
      l1Name: l1,
      l2Name: l2,
      l3Name: l3,
      pathLabel: handbookAudienceCategoryPath(audience.name, l1, l2, l3),
    });
    return;
  }
  for (const ch of node.children) {
    walk(ch, audience, chain, out);
  }
}

export function buildCategoryHandbookSnapshot(handbook: Audience[]): CategoryHandbookSnapshot {
  const leaves: HandbookCategoryLeaf[] = [];
  for (const aud of handbook) {
    for (const root of aud.categories) {
      walk(root, aud, [], leaves);
    }
  }
  return {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    source: 'src/lib/data/category-handbook.ts',
    audiences: handbook.map((a) => ({ id: a.id, name: a.name })),
    leaves,
    taxonomyAliases: [...TAXONOMY_LEAF_ALIASES],
  };
}
