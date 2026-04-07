/**
 * Хранение карточек коллекций бренда (localStorage).
 * Список коллекций, создание и открытие карточки → работа внутри коллекции.
 */

export interface CollectionCard {
  id: string;
  name: string;
  season?: string;
  concept?: string;
  dna?: string;
  createdAt: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'brand_collections_v1';

function load(): CollectionCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items: CollectionCard[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getCollections(): CollectionCard[] {
  return load();
}

export function getCollectionById(id: string): CollectionCard | undefined {
  return load().find((c) => c.id === id);
}

export function createCollection(data: Omit<CollectionCard, 'id' | 'createdAt' | 'updatedAt'>): CollectionCard {
  const items = load();
  const id = `col-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();
  const card: CollectionCard = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  items.unshift(card);
  save(items);
  return card;
}

export function updateCollection(id: string, data: Partial<Omit<CollectionCard, 'id' | 'createdAt'>>): CollectionCard | null {
  const items = load();
  const idx = items.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const updated = { ...items[idx], ...data, updatedAt: new Date().toISOString() };
  items[idx] = updated;
  save(items);
  return updated;
}

export function deleteCollection(id: string): boolean {
  const items = load().filter((c) => c.id !== id);
  if (items.length === load().length) return false;
  save(items);
  return true;
}
