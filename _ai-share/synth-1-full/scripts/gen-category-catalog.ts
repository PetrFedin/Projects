/**
 * Снимок дерева категорий из category-handbook.ts → JSON (источник правды в рантайме).
 * Запуск: npm run gen:category-catalog
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORY_HANDBOOK } from '../src/lib/data/category-handbook';
import { buildCategoryHandbookSnapshot } from '../src/lib/production/category-handbook-snapshot-builder';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'src/lib/production/generated/category-handbook.snapshot.json');

const snap = buildCategoryHandbookSnapshot(CATEGORY_HANDBOOK);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(snap, null, 2)}\n`, 'utf8');
console.log('[gen:category-catalog]', outPath, 'audiences:', snap.audiences.length, 'leaves:', snap.leaves.length);
