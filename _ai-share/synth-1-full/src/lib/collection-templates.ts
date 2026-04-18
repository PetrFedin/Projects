/**
 * Шаблоны коллекций для быстрого старта
 */

export type CollectionType = 'main' | 'capsule' | 'collab';
export type CollectionPriority = 'High' | 'Standard' | 'Low';
export const SEASONS = [
  'SS26',
  'SS27',
  'FW26',
  'FW27',
  'Resort26',
  'Resort27',
  'Pre-Fall26',
  'Pre-Fall27',
] as const;
export const COLLECTION_TYPES: { value: CollectionType; label: string }[] = [
  { value: 'main', label: 'Сезонная коллекция' },
  { value: 'capsule', label: 'Капсула' },
  { value: 'collab', label: 'Коллаборация' },
];
export const PRIORITIES: { value: CollectionPriority; label: string }[] = [
  { value: 'High', label: 'Высокий' },
  { value: 'Standard', label: 'Стандарт' },
  { value: 'Low', label: 'Низкий' },
];

export interface CollectionTemplate {
  id: string;
  name: string;
  description: string;
  season: string;
  type: CollectionType;
  priority: CollectionPriority;
  budgetMaterials: number;
  budgetSewing: number;
  budgetLogistics: number;
  dropName: string;
  dropDate: string;
  palette: Array<{ name: string; hex: string }>;
}

export const COLLECTION_TEMPLATES: CollectionTemplate[] = [
  {
    id: 'seasonal',
    name: 'Сезонная коллекция',
    description: 'Полноценный сезон: основной ассортимент, несколько дропов',
    season: 'SS26',
    type: 'main',
    priority: 'High',
    budgetMaterials: 1800000,
    budgetSewing: 2100000,
    budgetLogistics: 300000,
    dropName: 'Main Drop',
    dropDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    palette: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'White', hex: '#f5f5f5' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Beige', hex: '#d4c4a8' },
    ],
  },
  {
    id: 'capsule',
    name: 'Капсула',
    description: 'Компактная лимитированная линейка',
    season: 'SS26',
    type: 'capsule',
    priority: 'Standard',
    budgetMaterials: 400000,
    budgetSewing: 350000,
    budgetLogistics: 80000,
    dropName: 'Capsule Drop',
    dropDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    palette: [
      { name: 'Ivory', hex: '#fffff0' },
      { name: 'Sage', hex: '#9dc183' },
      { name: 'Terracotta', hex: '#c26f3d' },
    ],
  },
  {
    id: 'drop',
    name: 'Drop',
    description: 'Единичный дроп: быстрый релиз',
    season: 'SS26',
    type: 'main',
    priority: 'High',
    budgetMaterials: 250000,
    budgetSewing: 300000,
    budgetLogistics: 50000,
    dropName: 'Express Drop',
    dropDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    palette: [
      { name: 'Black', hex: '#000000' },
      { name: 'Charcoal', hex: '#36454f' },
    ],
  },
];
