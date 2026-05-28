/**
 * Шаблоны T&A (Time & Action) по категории / lifecycleTaTemplateId паспорта.
 * Контент вех — data/workshop2/ta-templates/*.json (см. workshop2-ta-template-loader).
 */

import type { HandbookCategoryLeaf } from './category-handbook-leaves';
import type {
  Workshop2DossierPhase1,
  Workshop2TaMilestone,
} from './workshop2-dossier-phase1.types';
import {
  getWorkshop2TaTemplateDef,
  getWorkshop2TaTemplateDefs,
  listWorkshop2TaTemplateSelectOptions,
  type Workshop2TaTemplateDef,
} from './workshop2-ta-template-loader';

export type { Workshop2TaTemplateDef };
export { getWorkshop2TaTemplateDefs, listWorkshop2TaTemplateSelectOptions };

/** @deprecated Используйте getWorkshop2TaTemplateDefs() — оставлено для обратной совместимости импортов. */
export const WORKSHOP2_TA_TEMPLATE_DEFS: Record<string, Workshop2TaTemplateDef> = new Proxy(
  {} as Record<string, Workshop2TaTemplateDef>,
  {
    get(_t, prop: string) {
      return getWorkshop2TaTemplateDefs()[prop];
    },
    ownKeys() {
      return Reflect.ownKeys(getWorkshop2TaTemplateDefs());
    },
    getOwnPropertyDescriptor(_t, prop) {
      const val = getWorkshop2TaTemplateDefs()[String(prop)];
      if (val === undefined) return undefined;
      return { configurable: true, enumerable: true, value: val };
    },
  }
);

function addDaysIso(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Строит вехи T&A из шаблона; сохраняет id существующих вех по title при merge. */
export function buildTaMilestonesFromTemplate(
  templateId: string,
  existing?: Workshop2TaMilestone[],
  baseDate = new Date()
): Workshop2TaMilestone[] {
  const def = getWorkshop2TaTemplateDef(templateId) ?? getWorkshop2TaTemplateDef('standard-60')!;
  const byTitle = new Map((existing ?? []).map((m) => [m.title, m]));

  return def.offsetsDays.map((step, i) => {
    const prev = byTitle.get(step.title);
    return {
      id: prev?.id ?? `ta-${templateId}-${i}`,
      title: step.title,
      targetDate: addDaysIso(baseDate, step.offsetDays),
      actualDate: prev?.actualDate ?? null,
      status: prev?.status ?? 'pending',
    };
  });
}

/** Подбирает id шаблона T&A по листу справочника (L1–L3). */
export function resolveLifecycleTaTemplateIdFromLeaf(
  leaf: HandbookCategoryLeaf | null | undefined
): string {
  if (!leaf) return 'standard-60';
  const l2 = leaf.l2Name.toLowerCase();
  const l3 = leaf.l3Name.toLowerCase();
  if (
    l2.includes('верхняя') ||
    l3.includes('пальто') ||
    l3.includes('куртка') ||
    l3.includes('пуховик')
  ) {
    return 'outerwear-90';
  }
  if (l3.includes('футболка') || l3.includes('топ') || l3.includes('майка')) {
    return 'fast-track-30';
  }
  if (l2.includes('сложн') || l3.includes('жакет') || l3.includes('костюм')) {
    return 'complex-120';
  }
  return 'standard-60';
}

/** Выставляет шаблон в паспорте и пересчитывает вехи T&A в черновике. */
export function applyLifecycleTaTemplateToDossier(
  dossier: Workshop2DossierPhase1,
  templateId: string
): Workshop2DossierPhase1 {
  const withTemplate: Workshop2DossierPhase1 = {
    ...dossier,
    passportProductionBrief: {
      ...(dossier.passportProductionBrief ?? {}),
      lifecycleTaTemplateId: templateId,
    },
  };
  return syncTaMilestonesForDossier(withTemplate);
}

/** Шаблон T&A из категории + пересчёт вех (смена L1–L3). */
export function applyLifecycleTaTemplateFromLeaf(
  dossier: Workshop2DossierPhase1,
  leaf: HandbookCategoryLeaf | null | undefined
): Workshop2DossierPhase1 {
  return applyLifecycleTaTemplateToDossier(dossier, resolveLifecycleTaTemplateIdFromLeaf(leaf));
}

/** Обновляет taMilestones в досье, если шаблон изменился или вех ещё нет. */
export function syncTaMilestonesForDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  const templateId = dossier.passportProductionBrief?.lifecycleTaTemplateId;
  if (!templateId) return dossier;
  const milestones = buildTaMilestonesFromTemplate(templateId, dossier.taMilestones);
  const same =
    dossier.taMilestones?.length === milestones.length &&
    dossier.taMilestones.every((m, i) => m.targetDate === milestones[i]?.targetDate);
  if (same) return dossier;
  return { ...dossier, taMilestones: milestones };
}
