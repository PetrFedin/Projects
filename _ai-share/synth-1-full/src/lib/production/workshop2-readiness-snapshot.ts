/**
 * Единая модель готовности Workshop2 для UI (хаб, шапка кабинета, вкладки ТЗ, «Пульс»).
 *
 * Формулы:
 * - **Готовность ТЗ (`tzOverallPct`)** — среднее арифметическое % заполнения пяти секций ТЗ
 *   (паспорт, визуал, материалы, конструкция, задание), по `calculateWorkshopTzSectionCompletion`
 *   с учётом фазы ТЗ и черновиков SKU/названия в паспорте.
 * - **Пульс (`preflightScore`)** — отдельная шкала 0–100: 100 минус штрафы pre-flight производства
 *   (блокер −14, предупреждение −5); не смешивается с % заполнения ТЗ.
 * - **% раздела** — тот же `pct`, что на кольце вкладки и в списке «Пульс артикула».
 */

import type { HandbookCategoryLeaf } from './category-handbook-snapshot-builder';
import { resolvePhase1AttributeRows, type ResolvedPhase1AttributeRow } from './attribute-catalog';
import { type DossierSection, SECTION_ROLES } from './dossier-readiness-engine';
import type { Workshop2DossierPhase1 } from './workshop2-dossier-phase1.types';
import {
  buildWorkshop2ProductionPreflightSnapshot,
  type W2ProductionPreflightSnapshot,
} from './workshop2-production-preflight';
import {
  calculateWorkshopTzSectionCompletion,
  getWorkshopTzSectionStatusLabel,
  type WorkshopTzReadinessPhase,
  type WorkshopTzSectionReadinessOptions,
} from './workshop2-tz-section-readiness';

/** Пять секций, из которых считается общий % ТЗ (совпадает с блоком «Пульс артикула»). */
export const WORKSHOP2_TZ_OVERALL_SECTION_KEYS: readonly DossierSection[] = [
  'general',
  'visuals',
  'material',
  'construction',
  'assignment',
] as const;

export type Workshop2ReadinessSectionRow = {
  pct: number;
  label: string;
  done: number;
  total: number;
  status: string;
};

export type Workshop2ReadinessSnapshot = {
  tzOverallPct: number;
  preflightScore: number;
  preflight: W2ProductionPreflightSnapshot | null;
  sections: Record<DossierSection, Workshop2ReadinessSectionRow>;
};

export type Workshop2ReadinessSnapshotInput = {
  dossier: Workshop2DossierPhase1 | null;
  leaf?: HandbookCategoryLeaf | null;
  attributeRows?: ResolvedPhase1AttributeRow[];
  tzPhase?: WorkshopTzReadinessPhase;
  techPackZipSessionBlobById?: Record<string, string>;
  articleSkuDraft?: string;
  articleNameDraft?: string;
};

function sectionLabel(section: DossierSection): string {
  return SECTION_ROLES[section]?.label ?? section;
}

function applyPassportDraftBonus(
  general: Workshop2ReadinessSectionRow,
  dossier: Workshop2DossierPhase1,
  articleSkuDraft?: string,
  articleNameDraft?: string
): Workshop2ReadinessSectionRow {
  const skuAssigned = dossier.assignments.some(
    (a) => a.attributeId === 'sku' && a.values.length > 0
  );
  const nameAssigned = dossier.assignments.some(
    (a) => a.attributeId === 'name' && a.values.length > 0
  );
  const skuFilledUi = skuAssigned || (articleSkuDraft?.trim().length ?? 0) > 0;
  const nameFilledUi = nameAssigned || (articleNameDraft?.trim().length ?? 0) > 0;
  const bonusDone = Number(skuFilledUi && !skuAssigned) + Number(nameFilledUi && !nameAssigned);
  if (bonusDone === 0) return general;

  const done = general.done + bonusDone;
  const total = Math.max(general.total, 1);
  const pct = Math.round((done / total) * 100);
  return { ...general, done, pct };
}

function emptySectionRow(section: DossierSection): Workshop2ReadinessSectionRow {
  return {
    pct: 0,
    label: sectionLabel(section),
    done: 0,
    total: 1,
    status: 'Пусто',
  };
}

/**
 * Канонический снимок готовности артикула: один источник для хаба, шапки, вкладок и «Пульса».
 */
export function getWorkshop2ReadinessSnapshot(
  input: Workshop2ReadinessSnapshotInput
): Workshop2ReadinessSnapshot {
  const { dossier, leaf = null } = input;

  if (!dossier) {
    const sections = Object.fromEntries(
      WORKSHOP2_TZ_OVERALL_SECTION_KEYS.map((s) => [s, emptySectionRow(s)])
    ) as Record<DossierSection, Workshop2ReadinessSectionRow>;
    return {
      tzOverallPct: 0,
      preflightScore: 0,
      preflight: null,
      sections,
    };
  }

  const attributeRows =
    input.attributeRows ?? (leaf ? resolvePhase1AttributeRows(leaf.leafId) : []);

  const readinessOpts: WorkshopTzSectionReadinessOptions = {
    tzPhase: input.tzPhase ?? '1',
    techPackZipSessionBlobById: input.techPackZipSessionBlobById,
  };

  const sections = {} as Record<DossierSection, Workshop2ReadinessSectionRow>;
  for (const sectionId of WORKSHOP2_TZ_OVERALL_SECTION_KEYS) {
    const completion = calculateWorkshopTzSectionCompletion(
      sectionId,
      dossier,
      attributeRows,
      readinessOpts
    );
    let row: Workshop2ReadinessSectionRow = {
      pct: completion.pct,
      label: sectionLabel(sectionId),
      done: completion.done,
      total: completion.total,
      status: getWorkshopTzSectionStatusLabel(sectionId, dossier, attributeRows, readinessOpts),
    };
    if (sectionId === 'general') {
      row = applyPassportDraftBonus(row, dossier, input.articleSkuDraft, input.articleNameDraft);
    }
    sections[sectionId] = row;
  }

  const tzOverallPct = Math.round(
    WORKSHOP2_TZ_OVERALL_SECTION_KEYS.reduce((sum, key) => sum + (sections[key]?.pct ?? 0), 0) /
      WORKSHOP2_TZ_OVERALL_SECTION_KEYS.length
  );

  const preflight = buildWorkshop2ProductionPreflightSnapshot(dossier, {
    articleSkuDraft: input.articleSkuDraft,
    articleNameDraft: input.articleNameDraft,
  });

  return {
    tzOverallPct,
    preflightScore: preflight.score,
    preflight,
    sections,
  };
}

/**
 * Стабильный ключ снимка готовности — для эффектов без лишних setState,
 * когда `getWorkshop2ReadinessSnapshot` возвращает новый объект с тем же содержимым.
 */
export function serializeWorkshop2ReadinessSnapshotFingerprint(
  snap: Workshop2ReadinessSnapshot
): string {
  const sec = WORKSHOP2_TZ_OVERALL_SECTION_KEYS.map((k) => {
    const r = snap.sections[k];
    return `${k}:${r?.pct ?? 0}:${r?.done ?? 0}:${r?.total ?? 0}:${r?.status ?? ''}`;
  }).join('|');
  const pre = snap.preflight;
  const preKey = pre
    ? `${snap.preflightScore}:${pre.canSendToFactory ? 1 : 0}:${pre.issues.length}`
    : 'none';
  return `${snap.tzOverallPct};${preKey};${sec}`;
}

/** % для кольца на вкладке ТЗ (паспорт / материалы / конструкция / задание). */
export function workshop2TzTabSectionPct(
  snapshot: Workshop2ReadinessSnapshot,
  section: DossierSection
): number {
  return snapshot.sections[section]?.pct ?? 0;
}
