/**
 * Объединённый список обязательных id атрибутов ТЗ-1 для листа справочника:
 * catalog `requiredForPhase1` + info-pick matrix + tz-leaf-requirements (+ алиасы).
 */
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import { resolvePhase1AttributeRows } from '@/lib/production/attribute-catalog';
import { collectRequiredCatalogAttributeKeysForLeaf } from '@/lib/project-info/info-pick-attribute-keys';
import {
  getTzLeafExtraRequirements,
  type TzLeafExtraRequirements,
} from '@/lib/project-info/tz-leaf-requirements.generated';
import { resolveWorkshop2CatalogAttributeId } from '@/lib/production/workshop2-attribute-id-aliases';

const TZ_FLAG_TO_INFO_PICK_KEY: Partial<Record<keyof TzLeafExtraRequirements, string>> = {
  collectionSeasonRequired: 'season',
  packagingDimensionsRequired: 'packagingDimensionsClassOptions',
  customsHsDeclarationRequired: 'customsHsDeclarationOptions',
  certificationMarksRequired: 'certificationMarksOptions',
};

export type Workshop2RequiredFieldsPayload = {
  leafId: string;
  pathLabel?: string;
  /** Уникальные канонические id после merge и алиасов. */
  requiredIds: string[];
  count: number;
  fromCatalogRequiredForPhase1: string[];
  fromInfoPickMatrix: string[];
  fromTzLeafRequirements: string[];
};

function dedupeCanonical(ids: Iterable<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ids) {
    const id = resolveWorkshop2CatalogAttributeId(raw.trim());
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out.sort((a, b) => a.localeCompare(b, 'ru'));
}

/** Канонические id, обязательные на этапе ТЗ-1 для leafId. */
export function resolveWorkshop2RequiredFieldIdsForLeaf(
  leafId: string
): Workshop2RequiredFieldsPayload | null {
  const lid = leafId.trim();
  if (!lid) return null;
  const leaf = findHandbookLeafById(lid);
  if (!leaf) return null;

  const fromCatalogRequiredForPhase1 = resolvePhase1AttributeRows(leaf.leafId)
    .filter((row) => row.attribute.requiredForPhase1)
    .map((row) => resolveWorkshop2CatalogAttributeId(row.attribute.attributeId));

  const fromInfoPickMatrix = [
    ...collectRequiredCatalogAttributeKeysForLeaf(leaf.l1Name, leaf.l2Name, leaf.l3Name),
  ].map((id) => resolveWorkshop2CatalogAttributeId(id));

  const tz = getTzLeafExtraRequirements(leaf.l1Name, leaf.l2Name, leaf.l3Name);
  const fromTzLeafRequirements: string[] = [];
  for (const [flag, infoPickKey] of Object.entries(TZ_FLAG_TO_INFO_PICK_KEY) as [
    keyof TzLeafExtraRequirements,
    string | undefined,
  ][]) {
    if (!infoPickKey || !tz[flag]) continue;
    fromTzLeafRequirements.push(resolveWorkshop2CatalogAttributeId(infoPickKey));
  }

  const requiredIds = dedupeCanonical([
    ...fromCatalogRequiredForPhase1,
    ...fromInfoPickMatrix,
    ...fromTzLeafRequirements,
  ]);

  return {
    leafId: leaf.leafId,
    pathLabel: `${leaf.l1Name} › ${leaf.l2Name} › ${leaf.l3Name}`,
    requiredIds,
    count: requiredIds.length,
    fromCatalogRequiredForPhase1: dedupeCanonical(fromCatalogRequiredForPhase1),
    fromInfoPickMatrix: dedupeCanonical(fromInfoPickMatrix),
    fromTzLeafRequirements: dedupeCanonical(fromTzLeafRequirements),
  };
}
