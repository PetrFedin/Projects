/**
 * Черновой отчёт: паспорт «general» (старт vs pre-sample) × лист × досье.
 * Сверяет обязательность каталога для шага ТЗ, присутствие атрибута на листе фазы 1
 * и заполненность по тем же правилам, что UI (`phase1FieldSatisfiedForUi`).
 */

import {
  attributeInWorkflowPhase,
  getAttributeCatalog,
  resolveAttributeIdsForLeaf,
  resolvePhase1AttributeRows,
  type ResolvedPhase1AttributeRow,
} from '@/lib/production/attribute-catalog';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  partitionGeneralPassportRows,
  passportCatalogRowRequiredForTzPhase,
  PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS,
  type WorkshopPassportTzPhase,
} from '@/lib/production/workshop2-passport-check';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { phase1FieldSatisfiedForUi } from '@/lib/production/w2-dossier-field-presentation';
import { workshop2PolicySuppressesAttribute } from '@/lib/production/workshop2-attribute-policy';
import { getWorkshopTzSectionForAttribute } from '@/lib/production/workshop2-tz-section-readiness';

/** Согласовано с `Workshop2Phase1DossierPanel` (связка mat + composition). */
const REDUNDANT_WHEN_MAT_COMPOSITION_LINKED = new Set([
  'fabricCompositionPresetOptions',
  'fabricCompositionDetailClassOptions',
]);

function filterPhase1RowsLikeDossierPanel(
  rows: ResolvedPhase1AttributeRow[],
  leafId: string
): ResolvedPhase1AttributeRow[] {
  const leaf = findHandbookLeafById(leafId);
  const ids = new Set(resolveAttributeIdsForLeaf(leafId, 1));
  const linked = ids.has('mat') && ids.has('composition');
  return rows.filter((r) => {
    const id = r.attribute.attributeId;
    if (
      workshop2PolicySuppressesAttribute(id, {
        leafId,
        l1Name: leaf?.l1Name,
        l2Name: leaf?.l2Name,
        l3Name: leaf?.l3Name,
        phase: 1,
        source: 'report',
      })
    )
      return false;
    if (linked && id === 'composition') return false;
    if (linked && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id)) return false;
    return true;
  });
}

function passportBlockForAttributeId(id: string): 'start' | 'preSample' {
  return PASSPORT_GENERAL_PRE_SAMPLE_ATTR_IDS.has(id) ? 'preSample' : 'start';
}

export type Workshop2PassportGapLine = {
  attributeId: string;
  name: string;
  passportBlock: 'start' | 'preSample';
  requiredForCurrentTzStep: boolean;
  filled: boolean;
};

export type Workshop2PassportMissingCatalogLine = {
  attributeId: string;
  name: string;
  passportBlock: 'start' | 'preSample';
  reason: 'not_in_leaf_phase1';
};

export type Workshop2PassportGapReport = {
  leafId: string;
  pathLabel: string | null;
  tzPhase: WorkshopPassportTzPhase;
  /** Все `general`-строки паспорта на листе (как в колонках «Основа» / «Таможня»), с флагами. */
  linesOnLeaf: Workshop2PassportGapLine[];
  /**
   * В каталоге обязателен на текущем шаге ТЗ и секция `general`, но `attributeId` не входит
   * в набор фазы 1 для листа → в паспорте поля нет, пока не расширят привязку листа.
   */
  requiredButMissingFromLeaf: Workshop2PassportMissingCatalogLine[];
  summary: {
    startRequiredOpen: number;
    preSampleRequiredOpen: number;
    startRequiredTotal: number;
    preSampleRequiredTotal: number;
  };
};

function catalogRequiredForTzPhase(
  a: { requiredForPhase1?: boolean; requiredForPhase2?: boolean },
  tzPhase: WorkshopPassportTzPhase
): boolean {
  if (tzPhase === '1') return Boolean(a.requiredForPhase1);
  return Boolean(a.requiredForPhase2);
}

/**
 * @param leafId — канонический id листа справочника (после алиасов `findHandbookLeafById` не нужен: строки строятся через `resolvePhase1AttributeRows` с тем же id).
 * @param dossier — текущее досье артикула.
 * @param tzPhase — шаг ТЗ (логика обязательности как в `passportCatalogRowRequiredForTzPhase`).
 */
export function buildWorkshop2PassportAttributeGapReport(
  leafId: string,
  dossier: Workshop2DossierPhase1,
  tzPhase: WorkshopPassportTzPhase = '1'
): Workshop2PassportGapReport {
  const leaf = findHandbookLeafById(leafId);
  const pathLabel = leaf?.pathLabel ?? null;

  const baseRows = resolvePhase1AttributeRows(leafId);
  const phaseRows = filterPhase1RowsLikeDossierPanel(baseRows, leafId);
  const generalRows = phaseRows.filter(
    (r) => getWorkshopTzSectionForAttribute(r.attribute.attributeId, r.group?.groupId) === 'general'
  );
  const { startRows, preSampleRows } = partitionGeneralPassportRows(generalRows);
  const orderedGeneralRows = [...startRows, ...preSampleRows];

  const linesOnLeaf: Workshop2PassportGapLine[] = [];
  for (const row of orderedGeneralRows) {
    const assignment = dossier.assignments.find(
      (a) => a.kind === 'canonical' && a.attributeId === row.attribute.attributeId
    );
    const filled = phase1FieldSatisfiedForUi(row.attribute, assignment);
    const required = passportCatalogRowRequiredForTzPhase(row, tzPhase);
    linesOnLeaf.push({
      attributeId: row.attribute.attributeId,
      name: row.attribute.name,
      passportBlock: passportBlockForAttributeId(row.attribute.attributeId),
      requiredForCurrentTzStep: required,
      filled,
    });
  }

  const leafPhase1 = new Set(resolveAttributeIdsForLeaf(leafId, 1));
  const requiredButMissingFromLeaf: Workshop2PassportMissingCatalogLine[] = [];
  for (const a of getAttributeCatalog().attributes) {
    if (!attributeInWorkflowPhase(a, 1) || a.retiredFromWorkshop) continue;
    if (getWorkshopTzSectionForAttribute(a.attributeId, a.groupId) !== 'general') continue;
    if (leafPhase1.has(a.attributeId)) continue;
    if (!catalogRequiredForTzPhase(a, tzPhase)) continue;
    requiredButMissingFromLeaf.push({
      attributeId: a.attributeId,
      name: a.name,
      passportBlock: passportBlockForAttributeId(a.attributeId),
      reason: 'not_in_leaf_phase1',
    });
  }
  requiredButMissingFromLeaf.sort((x, y) => x.attributeId.localeCompare(y.attributeId));

  const startLines = linesOnLeaf.filter((l) => l.passportBlock === 'start');
  const preLines = linesOnLeaf.filter((l) => l.passportBlock === 'preSample');
  return {
    leafId,
    pathLabel,
    tzPhase,
    linesOnLeaf,
    requiredButMissingFromLeaf,
    summary: {
      startRequiredOpen: startLines.filter((l) => l.requiredForCurrentTzStep && !l.filled).length,
      preSampleRequiredOpen: preLines.filter((l) => l.requiredForCurrentTzStep && !l.filled).length,
      startRequiredTotal: startLines.filter((l) => l.requiredForCurrentTzStep).length,
      preSampleRequiredTotal: preLines.filter((l) => l.requiredForCurrentTzStep).length,
    },
  };
}

/** Текст для лога, консоли или вставки в тикет. */
export function formatWorkshop2PassportGapReportAsText(r: Workshop2PassportGapReport): string {
  const out: string[] = [];
  out.push(`Workshop2 passport gap — leaf ${r.leafId}`);
  if (r.pathLabel) out.push(`Path: ${r.pathLabel}`);
  out.push(`TZ step: ${r.tzPhase}`);
  out.push(
    `Summary: start open ${r.summary.startRequiredOpen}/${r.summary.startRequiredTotal} required; pre-sample open ${r.summary.preSampleRequiredOpen}/${r.summary.preSampleRequiredTotal} required`
  );
  out.push('');
  out.push('On leaf (general / passport columns):');
  for (const l of r.linesOnLeaf) {
    const st = l.requiredForCurrentTzStep
      ? l.filled
        ? 'ok'
        : 'OPEN (required)'
      : l.filled
        ? 'filled (optional)'
        : '—';
    out.push(`  [${l.passportBlock}] ${l.attributeId} — ${l.name}: ${st}`);
  }
  if (r.requiredButMissingFromLeaf.length) {
    out.push('');
    out.push('Required in catalog (general) but not on leaf phase-1 (no field in UI):');
    for (const m of r.requiredButMissingFromLeaf) {
      out.push(`  [${m.passportBlock}] ${m.attributeId} — ${m.name}`);
    }
  }
  return out.join('\n');
}
