/**
 * Снимок дерева категорий из category-handbook.ts → JSON (источник правды в рантайме).
 * Запуск: npm run gen:category-catalog
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Audience, CategoryNode } from '../src/lib/data/category-handbook';
import { CATEGORY_HANDBOOK } from '../src/lib/data/category-handbook';
import { buildCategoryHandbookSnapshot } from '../src/lib/production/category-handbook-snapshot-builder';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/lib/production/generated');
const snapPath = join(outDir, 'category-handbook.snapshot.json');
const filterTreePath = join(outDir, 'category-handbook.filter-tree.json');

function stripFilterNode(node: CategoryNode): { id: string; name: string; children?: ReturnType<typeof stripFilterNode>[] } {
  const children = node.children?.map(stripFilterNode);
  return children?.length ? { id: node.id, name: node.name, children } : { id: node.id, name: node.name };
}

function buildFilterTree(handbook: Audience[]) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: 'src/lib/data/category-handbook.ts',
    audiences: handbook.map((a) => ({
      id: a.id,
      name: a.name,
      categories: a.categories.map(stripFilterNode),
    })),
  };
}

const snap = buildCategoryHandbookSnapshot(CATEGORY_HANDBOOK);
const filterTree = buildFilterTree(CATEGORY_HANDBOOK);
mkdirSync(outDir, { recursive: true });
writeFileSync(snapPath, `${JSON.stringify(snap, null, 2)}\n`, 'utf8');
writeFileSync(filterTreePath, `${JSON.stringify(filterTree, null, 2)}\n`, 'utf8');
console.log(
  '[gen:category-catalog]',
  snapPath,
  'audiences:',
  snap.audiences.length,
  'leaves:',
  snap.leaves.length,
  '| filter-tree:',
  filterTree.audiences.length
);
