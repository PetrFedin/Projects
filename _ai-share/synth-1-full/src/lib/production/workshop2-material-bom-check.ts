/**
 * BOM / материалы: контрольные точки и мини-гейт для Workshop2 ТЗ.
 */

import { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';

export { W2_MATERIAL_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-material-bom-anchors';

export type MaterialBomGateItem = {
  id: string;
  message: string;
  anchorId: string;
  jumpLabel: string;
};

export type MaterialBomCheckpoint = {
  id: string;
  label: string;
  done: boolean;
  anchorId: string;
};

export type MaterialBomHubModel = {
  combinedPct: number;
  gateItems: MaterialBomGateItem[];
  checkpoints: MaterialBomCheckpoint[];
};

export type BuildMaterialBomHubInput = {
  matRequired: boolean;
  matHandbookLineCount: number;
  linkedMatComposition: boolean;
  /** Сумма % по строкам состава; null если связка mat+composition выключена */
  compositionPctSum: number | null;
  materialSectionPct: number;
};

const A = W2_MATERIAL_SUBPAGE_ANCHORS;

/** Категорийные подсказки для цеха/закупа и дизайна/ОТК (краткие правила). */
export function buildMaterialCategoryNotes(l2Name: string): string[] {
  const key = l2Name.trim();
  const tail = 'Метки на скетче должны ссылаться на те же BOM-ref, что и строки материала.';
  const byL2: Record<string, string[]> = {
    'Верхняя одежда': [
      'Разведите shell, подклад, утеплитель, мембрану и фурнитуру по отдельным строкам справочника.',
      'Для многослойки укажите доли в составе только если включена связка mat ↔ composition.',
    ],
    'Платья и сарафаны': [
      'Основная ткань и подклад — отдельные строки; фурнитура (молния, пуговицы) — в каталоге ниже.',
    ],
    'Рубашки и блузы': ['Для смесовых тканей доведите сумму % до 100 при связке состава.'],
    Трикотаж: ['Уточните волокна (хлопок/вискоза/синтетика) — это влияет на усадку и ОТК.'],
  };
  const base = byL2[key] ?? [
    'Заполните обязательные поля каталога в этой секции — снабжение читает их как единый BOM.',
  ];
  return [...base, tail];
}

export function buildMaterialBomHubModel(input: BuildMaterialBomHubInput): MaterialBomHubModel {
  const gate: MaterialBomGateItem[] = [];

  if (input.matRequired && input.matHandbookLineCount === 0) {
    gate.push({
      id: 'gate-mat',
      message: 'Не выбран основной материал из справочника (атрибут mat).',
      anchorId: A.mat,
      jumpLabel: 'К mat',
    });
  }

  if (
    input.linkedMatComposition &&
    input.compositionPctSum !== null &&
    input.compositionPctSum !== 100
  ) {
    gate.push({
      id: 'gate-comp',
      message: `Сумма процентов состава должна быть 100% (сейчас ${input.compositionPctSum}%).`,
      anchorId: A.composition,
      jumpLabel: 'К составу',
    });
  }

  if (input.materialSectionPct < 100) {
    gate.push({
      id: 'gate-section',
      message: `Секция «Материалы» заполнена на ${input.materialSectionPct}% — дозаполните поля каталога.`,
      anchorId: A.catalog,
      jumpLabel: 'К каталогу',
    });
  }

  const matOk = !input.matRequired || input.matHandbookLineCount > 0;
  const compOk =
    !input.linkedMatComposition ||
    input.compositionPctSum === null ||
    input.compositionPctSum === 100;
  const secOk = input.materialSectionPct >= 100;

  const checkpoints: MaterialBomCheckpoint[] = [
    {
      id: 'cp-mat',
      label: 'Основной материал из справочника',
      done: matOk,
      anchorId: A.mat,
    },
    {
      id: 'cp-comp',
      label: 'Состав 100% (при связке mat + composition)',
      done: compOk,
      anchorId: A.composition,
    },
    {
      id: 'cp-sec',
      label: 'Все поля секции «Материалы»',
      done: secOk,
      anchorId: A.catalog,
    },
  ];

  return {
    combinedPct: input.materialSectionPct,
    gateItems: gate,
    checkpoints,
  };
}
