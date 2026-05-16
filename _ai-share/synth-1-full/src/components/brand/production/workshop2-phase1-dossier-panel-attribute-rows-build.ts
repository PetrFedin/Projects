import {
  attributeInWorkflowPhase,
  getAttributeById,
  getSortedGroups,
  type ResolvedPhase1AttributeRow,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { Workshop2Phase1AttributeAssignment } from '@/lib/production/workshop2-dossier-phase1.types';
import { workshop2PolicySuppressesAttribute } from '@/lib/production/workshop2-attribute-policy';
import { REDUNDANT_WHEN_MAT_COMPOSITION_LINKED } from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';

export type Workshop2LeafRowPolicyInput = {
  audienceId: string;
  leafId: string;
  l1Name: string;
  l2Name: string;
  l3Name: string;
};

/** Фильтр строк каталога по политике UI и связке mat+composition (фазы 1–3). */
export function filterWorkshop2CatalogRowsForPhaseUi(
  rows: ResolvedPhase1AttributeRow[],
  phase: 1 | 2 | 3,
  leaf: Workshop2LeafRowPolicyInput,
  linkedMatComposition: boolean
): ResolvedPhase1AttributeRow[] {
  return rows.filter((r) => {
    const id = r.attribute.attributeId;
    if (
      workshop2PolicySuppressesAttribute(id, {
        audienceId: leaf.audienceId,
        leafId: leaf.leafId,
        l1Name: leaf.l1Name,
        l2Name: leaf.l2Name,
        l3Name: leaf.l3Name,
        phase,
        source: 'ui',
      })
    )
      return false;
    if (linkedMatComposition && id === 'composition') return false;
    if (linkedMatComposition && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id)) return false;
    return true;
  });
}

/** Подписи групп атрибутов из каталога (стабильная карта на время жизни модуля). */
export const WORKSHOP2_ATTRIBUTE_GROUP_LABEL_BY_ID: ReadonlyMap<string, string> = (() => {
  const m = new Map<string, string>();
  for (const g of getSortedGroups()) {
    m.set(g.groupId, g.label);
  }
  return m;
})();

/** Канонические `attributeId` в досье, которых нет в базовом списке строк листа. */
export function inferWorkshop2Phase1ExtraCanonicalAttributeIds(
  assignments: readonly Workshop2Phase1AttributeAssignment[],
  baseCatalogAttributeIds: ReadonlySet<string>
): string[] {
  const out: string[] = [];
  for (const a of assignments) {
    if (a.kind !== 'canonical' || !a.attributeId || baseCatalogAttributeIds.has(a.attributeId))
      continue;
    if (!out.includes(a.attributeId)) out.push(a.attributeId);
  }
  return out;
}

export type Workshop2Phase1ExtraRow = {
  attribute: AttributeCatalogAttribute;
  groupLabel: string;
};

/** Дополнительные канонические атрибуты вне базового списка листа (фаза 1). */
export function buildWorkshop2Phase1ExtraAttributeRows(opts: {
  extraIds: readonly string[];
  baseAttributeIdSet: ReadonlySet<string>;
  groupById: ReadonlyMap<string, string>;
  leaf: Workshop2LeafRowPolicyInput;
  linkedMatComposition: boolean;
}): Workshop2Phase1ExtraRow[] {
  const { extraIds, baseAttributeIdSet, groupById, leaf, linkedMatComposition } = opts;
  const rows: Workshop2Phase1ExtraRow[] = [];
  for (const id of extraIds) {
    if (baseAttributeIdSet.has(id)) continue;
    if (
      workshop2PolicySuppressesAttribute(id, {
        audienceId: leaf.audienceId,
        leafId: leaf.leafId,
        l1Name: leaf.l1Name,
        l2Name: leaf.l2Name,
        l3Name: leaf.l3Name,
        phase: 1,
        source: 'ui',
      })
    )
      continue;
    if (linkedMatComposition && REDUNDANT_WHEN_MAT_COMPOSITION_LINKED.has(id)) continue;
    const attribute = getAttributeById(id);
    if (!attribute || !attributeInWorkflowPhase(attribute, 1)) continue;
    rows.push({
      attribute,
      groupLabel: groupById.get(attribute.groupId) ?? '—',
    });
  }
  rows.sort(
    (a, b) =>
      (groupById.get(a.attribute.groupId) ?? '').localeCompare(
        groupById.get(b.attribute.groupId) ?? '',
        'ru'
      ) || a.attribute.sortOrder - b.attribute.sortOrder
  );
  return rows;
}
