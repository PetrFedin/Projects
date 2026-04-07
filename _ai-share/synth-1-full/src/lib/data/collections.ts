/**
 * Модель и хранилище карточек коллекций бренда.
 * Сейчас — localStorage; позже можно заменить на API.
 */

export interface CollectionCard {
  id: string;
  name: string;
  season: string;
  concept: string;
  dna: string;
  description: string;
  status: 'draft' | 'active' | 'archive';
  createdAt: string; // ISO
  updatedAt: string;
}

const STORAGE_KEY = 'brand_collections_v1';

function loadAll(): CollectionCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSeedCollections();
    const parsed = JSON.parse(raw) as CollectionCard[];
    return Array.isArray(parsed) ? parsed : getSeedCollections();
  } catch {
    return getSeedCollections();
  }
}

function saveAll(items: CollectionCard[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getSeedCollections(): CollectionCard[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'fw26-main',
      name: 'FW26 Main',
      season: 'FW26',
      concept: 'Уют и функциональность: тёплые текстуры, объёмные силуэты.',
      dna: 'Минимализм, натуральные материалы, палитра терракоты и тёмно-синего.',
      description: 'Основная осенне-зимняя коллекция 2026.',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ss26-drop1',
      name: 'SS26 Drop 1',
      season: 'SS26',
      concept: 'Лёгкость и воздух. Лён, хлопок, открытые линии.',
      dna: 'Средиземноморский дух, светлые тона, расслабленный крой.',
      description: 'Первый дроп весна-лето 2026.',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'fw25-archive',
      name: 'FW25 Archive',
      season: 'FW25',
      concept: 'Архивная коллекция.',
      dna: '—',
      description: 'Закрытая коллекция FW25.',
      status: 'archive',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function getCollections(): CollectionCard[] {
  return loadAll();
}

export function getCollectionById(id: string): CollectionCard | undefined {
  return loadAll().find((c) => c.id === id);
}

export function getActiveCollections(): CollectionCard[] {
  return loadAll().filter((c) => c.status === 'active' || c.status === 'draft');
}

export function getArchivedCollections(): CollectionCard[] {
  return loadAll().filter((c) => c.status === 'archive');
}

export function createCollection(data: Omit<CollectionCard, 'id' | 'createdAt' | 'updatedAt'>): CollectionCard {
  const list = loadAll();
  const id = data.season.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);
  const now = new Date().toISOString();
  const card: CollectionCard = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  list.unshift(card);
  saveAll(list);
  return card;
}

export function updateCollection(id: string, patch: Partial<Omit<CollectionCard, 'id' | 'createdAt'>>): CollectionCard | null {
  const list = loadAll();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const updated = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  list[idx] = updated;
  saveAll(list);
  return updated;
}

export function slugifyForId(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яё\-]/gi, '');
}
