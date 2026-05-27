/**
 * Демо-стабы справочников Workshop2 (зеркало data/workshop2/*.seed.json для runtime без API).
 * JSON импортируется статически — без node:fs (иначе ломается клиентский бандл Next).
 */

import materialsLibrarySeed from '../../../data/workshop2/materials-library.seed.json';

export type Workshop2MaterialLibraryRow = {
  id: string;
  name: string;
  role: string;
  supplier?: string;
  /** Артикул поставщика (экспорт BOM). */
  supplierSku?: string;
  composition?: string;
  gsm?: number;
  /** Ориентир цены за единицу (USD) из библиотеки. */
  priceUsd?: number;
  /** Код сертификата / compliance. */
  certCode?: string;
};

export type Workshop2PomTemplateRow = {
  leafId: string;
  label: string;
  dimensionLabels: string[];
};

const MATERIALS_LIBRARY_SEED: Workshop2MaterialLibraryRow[] =
  Array.isArray(materialsLibrarySeed.materials) && materialsLibrarySeed.materials.length > 0
    ? materialsLibrarySeed.materials
    : [
        {
          id: 'mat-demo-wool-90',
          name: 'Шерсть 90% / кашемир 10%',
          role: 'main',
          supplier: 'ООО «ИвановоТекстиль»',
          supplierSku: 'IVT-WOOL-90',
          composition: '90% шерсть, 10% кашемир',
          gsm: 620,
          priceUsd: 28.5,
          certCode: 'OEKO-TEX-100',
        },
      ];

const POM_TEMPLATES_SEED: Workshop2PomTemplateRow[] = [
  {
    leafId: 'catalog-apparel-g0-l0',
    label: 'Пальто · базовый POM',
    dimensionLabels: ['Обхват груди', 'Обхват талии', 'Обхват бёдер', 'Длина изделия'],
  },
  {
    leafId: 'catalog-shoes-g0-l0',
    label: 'Кроссовки · EU',
    dimensionLabels: ['Длина стельки (мм)', 'Масса пары (г)'],
  },
];

export function getWorkshop2MaterialsLibrarySeed(): Workshop2MaterialLibraryRow[] {
  return MATERIALS_LIBRARY_SEED;
}

export function getWorkshop2PomTemplatesForLeaf(leafId: string): Workshop2PomTemplateRow[] {
  return POM_TEMPLATES_SEED.filter((t) => t.leafId === leafId);
}
