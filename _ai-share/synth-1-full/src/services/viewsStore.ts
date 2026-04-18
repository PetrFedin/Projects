import type { SavedView } from '../types/views';
import { DEFAULT_FILTERS } from '../types/filters';

let VIEWS: SavedView[] = [
  {
    id: 'v1',
    name: 'My: In-stock winners',
    scope: 'personal',
    ownerId: 'me',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    filters: { ...DEFAULT_FILTERS, inStockOnly: true, sellThroughMin: 40, page: 1 },
  },
  {
    id: 'v2',
    name: 'Team: Low stock / high GM',
    scope: 'team',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    filters: { ...DEFAULT_FILTERS, lowStock: true, gmMin: 55, page: 1 },
  },
];

const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

export function listViews(scope?: 'personal' | 'team') {
  return scope ? VIEWS.filter((v) => v.scope === scope) : VIEWS;
}

export function createView(view: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  const v: SavedView = { ...view, id: uid(), createdAt: now, updatedAt: now };
  VIEWS = [v, ...VIEWS];
  return v;
}

export function updateView(
  id: string,
  patch: Partial<Pick<SavedView, 'name' | 'filters' | 'scope'>>
) {
  const now = new Date().toISOString();
  VIEWS = VIEWS.map((v) => (v.id === id ? { ...v, ...patch, updatedAt: now } : v));
  return VIEWS.find((v) => v.id === id) ?? null;
}

export function deleteView(id: string) {
  const before = VIEWS.length;
  VIEWS = VIEWS.filter((v) => v.id !== id);
  return VIEWS.length !== before;
}
