/**
 * Справочник: какие атрибуты каталога относятся к секциям паспорта ТЗ и к каким уровням ветки (L1/L2/L3).
 * Не меняет привязку полей в форме (`getSectionForAttr`) — только консистентная картина для UI и обучения.
 */

import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import { getAttributeCatalog, getAttributeDossierSection, attributeInWorkflowPhase } from '@/lib/production/attribute-catalog';

export type PassportReferenceSection =
  | 'general'
  | 'visuals'
  | 'material'
  | 'construction';

export type CatalogDepthLevel = 'l1' | 'l2' | 'l3';

export type PassportAttributeReferenceRow = {
  attributeId: string;
  name: string;
  groupId: string;
  /** Секция паспорта для справочника (может отличаться от формы, если задан override). */
  passportSection: PassportReferenceSection;
  /** Общий блок (ТН ВЭД, страна, маркировка регуляторики…) — ожидается на всех позициях. */
  passportCommon: boolean;
  /** Где по смыслу заполняется в иерархии каталога. */
  applicableLevels: CatalogDepthLevel[];
  requiredForPhase1: boolean;
};

/** Секции, где fallback по groupId не совпадает с политикой паспорта (остальное — `dossierSection` в инстансе каталога). */
const REFERENCE_SECTION_OVERRIDES: Partial<Record<string, PassportReferenceSection>> = {
  sampleBaseSize: 'construction',
  fitToleranceSpec: 'construction',
  clothingFitOptions: 'construction',
};

const REGULATORY_ID_PREFIXES = ['customs', 'countryOf', 'nationalMarking', 'productBarcode'] as const;

function isRegulatoryCommonAttributeId(id: string): boolean {
  if (REGULATORY_ID_PREFIXES.some((p) => id.startsWith(p))) return true;
  if (id === 'okpd2CodeNote' || id === 'certificationMarksOptions' || id === 'customsClassificationRationale') {
    return true;
  }
  return false;
}

function lineIdentityAttributeIds(): Set<string> {
  return new Set([
    'season',
    'styleOccasionOptions',
    'collectionSeasonTagOptions',
    'composition',
    'articleWeightPackagingClassOptions',
    'specialNeedsOptions',
  ]);
}

function normalizePassportSection(raw: string | undefined): PassportReferenceSection {
  if (!raw) return 'general';
  if (raw === 'measurements' || raw === 'packaging') return raw === 'measurements' ? 'construction' : 'material';
  if (raw === 'general' || raw === 'visuals' || raw === 'material' || raw === 'construction') return raw;
  return 'general';
}

export function inferPassportReferenceSection(attr: AttributeCatalogAttribute): PassportReferenceSection {
  const override = REFERENCE_SECTION_OVERRIDES[attr.attributeId];
  if (override) return override;
  if (attr.dossierSection) return normalizePassportSection(attr.dossierSection);
  const resolved = getAttributeDossierSection(attr.attributeId);
  return normalizePassportSection(resolved);
}

export function inferPassportApplicableLevels(
  attr: AttributeCatalogAttribute,
  globalIds: Set<string>
): CatalogDepthLevel[] {
  if (attr.passportApplicableLevels?.length) return [...attr.passportApplicableLevels];
  if (isRegulatoryCommonAttributeId(attr.attributeId)) return ['l1', 'l2', 'l3'];
  if (globalIds.has(attr.attributeId)) return ['l1', 'l2', 'l3'];
  if (attr.groupId === 'global' && lineIdentityAttributeIds().has(attr.attributeId)) {
    return ['l1', 'l2', 'l3'];
  }
  return ['l3'];
}

export function inferPassportCommonFlag(attr: AttributeCatalogAttribute, globalIds: Set<string>): boolean {
  if (typeof attr.passportCommon === 'boolean') return attr.passportCommon;
  if (isRegulatoryCommonAttributeId(attr.attributeId)) return true;
  return globalIds.has(attr.attributeId);
}

/**
 * Все строки справочника для фазы 1 (атрибуты не retired, участвуют в workflow фазы 1).
 */
export function buildPassportAttributeReferenceRows(phase: number = 1): PassportAttributeReferenceRow[] {
  const cat = getAttributeCatalog();
  const globalIds = new Set(cat.globalAttributeIds ?? []);
  const rows: PassportAttributeReferenceRow[] = [];
  for (const attr of cat.attributes) {
    if (attr.retiredFromWorkshop) continue;
    if (!attributeInWorkflowPhase(attr, phase)) continue;
    rows.push({
      attributeId: attr.attributeId,
      name: attr.name,
      groupId: attr.groupId,
      passportSection: inferPassportReferenceSection(attr),
      passportCommon: inferPassportCommonFlag(attr, globalIds),
      applicableLevels: inferPassportApplicableLevels(attr, globalIds),
      requiredForPhase1: Boolean(attr.requiredForPhase1),
    });
  }
  rows.sort((a, b) => {
    const sec = a.passportSection.localeCompare(b.passportSection, 'ru');
    if (sec !== 0) return sec;
    if (a.passportCommon !== b.passportCommon) return a.passportCommon ? -1 : 1;
    return a.name.localeCompare(b.name, 'ru');
  });
  return rows;
}

export function groupPassportReferenceBySection(
  rows: PassportAttributeReferenceRow[]
): Record<PassportReferenceSection, PassportAttributeReferenceRow[]> {
  const empty: Record<PassportReferenceSection, PassportAttributeReferenceRow[]> = {
    general: [],
    visuals: [],
    material: [],
    construction: [],
  };
  for (const r of rows) {
    empty[r.passportSection].push(r);
  }
  return empty;
}

/** Удобно для узла ветки: уровень 1 | 2 | 3 соответствует слоту L1 / L2 / L3. */
export function attributeRowAppliesToBranchLevel(
  row: PassportAttributeReferenceRow,
  branchLevel: 1 | 2 | 3
): boolean {
  const key: CatalogDepthLevel = branchLevel === 1 ? 'l1' : branchLevel === 2 ? 'l2' : 'l3';
  return row.applicableLevels.includes(key);
}
