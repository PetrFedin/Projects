import { fullCategoryStructure } from './categories';

export type CatalogLeafRow = { key: string; l1: string; l2: string; l3: string };

/**
 * Листья полного дерева категорий (как на странице «Каталог»): L1 › L2 › L3.
 */
export function flattenCategoryTree(
  node: Record<string, unknown>,
  level1 = '',
  level2 = '',
  acc: CatalogLeafRow[] = []
): CatalogLeafRow[] {
  for (const [name, children] of Object.entries(node)) {
    const childObj = children as Record<string, unknown>;
    const hasChildren =
      childObj && typeof childObj === 'object' && Object.keys(childObj).length > 0;
    if (hasChildren) {
      flattenCategoryTree(childObj, level1 || name, level1 ? level2 || name : '', acc);
    } else {
      const l1 = level1 || name;
      const l2 = level1 ? level2 || name : '—';
      const l3 = level1 && level2 ? name : '—';
      acc.push({ key: `${l1}|${l2}|${l3}`, l1, l2, l3 });
    }
  }
  return acc;
}

let cachedLeafRows: CatalogLeafRow[] | null = null;

export function getCatalogLeafRows(): CatalogLeafRow[] {
  if (!cachedLeafRows) {
    cachedLeafRows = flattenCategoryTree(fullCategoryStructure as Record<string, unknown>);
  }
  return cachedLeafRows;
}
