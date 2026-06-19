/**
 * Компактное дерево категорий для UI-фильтров (id/name/children).
 * Источник: `generated/category-handbook.filter-tree.json` · `npm run gen:category-catalog`.
 */
import filterTree from './generated/category-handbook.filter-tree.json';

export type CategoryHandbookFilterNode = {
  id: string;
  name: string;
  children?: CategoryHandbookFilterNode[];
};

export type CategoryHandbookFilterAudience = {
  id: string;
  name: string;
  categories: CategoryHandbookFilterNode[];
};

type FilterTreeFile = {
  schemaVersion: number;
  audiences: CategoryHandbookFilterAudience[];
};

let cached: CategoryHandbookFilterAudience[] | null = null;

export function getCategoryHandbookFilterTree(): CategoryHandbookFilterAudience[] {
  if (!cached) {
    cached = (filterTree as FilterTreeFile).audiences;
  }
  return cached;
}
