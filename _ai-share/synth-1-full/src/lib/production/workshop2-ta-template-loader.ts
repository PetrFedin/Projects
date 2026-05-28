/**
 * Загрузчик шаблонов T&A из data/workshop2/ta-templates/*.json (статический import).
 */

import fastTrack30 from '../../../data/workshop2/ta-templates/fast-track-30.json';
import standard60 from '../../../data/workshop2/ta-templates/standard-60.json';
import outerwear90 from '../../../data/workshop2/ta-templates/outerwear-90.json';
import complex120 from '../../../data/workshop2/ta-templates/complex-120.json';

export type Workshop2TaTemplateDef = {
  labelRu: string;
  offsetsDays: { title: string; offsetDays: number }[];
};

type TaTemplateJson = {
  id: string;
  labelRu: string;
  offsetsDays: { title: string; offsetDays: number }[];
};

function toDef(row: TaTemplateJson): Workshop2TaTemplateDef {
  return { labelRu: row.labelRu, offsetsDays: row.offsetsDays };
}

const TEMPLATE_ROWS: TaTemplateJson[] = [fastTrack30, standard60, outerwear90, complex120];

const DEFS: Record<string, Workshop2TaTemplateDef> = Object.fromEntries(
  TEMPLATE_ROWS.map((row) => [row.id, toDef(row)])
);

/** Все шаблоны T&A (id → определение). */
export function getWorkshop2TaTemplateDefs(): Record<string, Workshop2TaTemplateDef> {
  return DEFS;
}

export function getWorkshop2TaTemplateDef(templateId: string): Workshop2TaTemplateDef | undefined {
  return DEFS[templateId] ?? DEFS['standard-60'];
}

/** Опции для select в паспорте (русские подписи из JSON). */
export function listWorkshop2TaTemplateSelectOptions(): { value: string; label: string }[] {
  return TEMPLATE_ROWS.map((row) => ({ value: row.id, label: row.labelRu }));
}
