/**
 * Единый реестр id атрибутов: info-pick ↔ attribute-catalog (read API + UI-бейджи).
 */
import { getAttributeById } from '@/lib/production/attribute-catalog';
import {
  WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES,
  resolveWorkshop2CatalogAttributeId,
} from '@/lib/production/workshop2-attribute-id-aliases';
import { collectRequiredInfoPickAttributeKeys } from '@/lib/project-info/info-pick-attribute-keys';

export { WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES };

/** Обратный индекс: канонический id → оси info-pick. */
export function buildWorkshop2CatalogToInfoPickAliasMap(): Readonly<
  Record<string, readonly string[]>
> {
  const out = new Map<string, string[]>();
  for (const [infoPickId, catalogId] of Object.entries(
    WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES
  )) {
    const list = out.get(catalogId) ?? [];
    list.push(infoPickId);
    out.set(catalogId, list);
  }
  return Object.fromEntries([...out.entries()].map(([k, v]) => [k, [...new Set(v)]]));
}

/** Атрибут каталога связан с матрицей info-pick (есть алиас или обратная привязка). */
export function isWorkshop2AttributeLinkedToInfoPickMatrix(catalogAttributeId: string): boolean {
  const id = catalogAttributeId.trim();
  if (!id) return false;
  if (Object.values(WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES).includes(id)) return true;
  const reverse = buildWorkshop2CatalogToInfoPickAliasMap();
  return Boolean(reverse[id]?.length);
}

/** Info-pick ключи листа без валидного атрибута в attribute-catalog. */
export function listUnresolvedInfoPickKeysForLeaf(
  l1Name: string,
  l2Name: string,
  l3Name: string = ''
): string[] {
  const raw = collectRequiredInfoPickAttributeKeys(l1Name, l2Name, l3Name);
  const unresolved: string[] = [];
  for (const key of raw) {
    const catalogId = resolveWorkshop2CatalogAttributeId(key);
    if (!getAttributeById(catalogId)) unresolved.push(key);
  }
  return unresolved.sort();
}

/** Сводка для GET /references/attribute-aliases. */
export function buildWorkshop2AttributeRegistryPayload(input: {
  leafId?: string;
  l1Name?: string;
  l2Name?: string;
  l3Name?: string;
}): {
  leafId?: string;
  aliases: Readonly<Record<string, string>>;
  catalogToInfoPick: Readonly<Record<string, readonly string[]>>;
  unresolvedInfoPickKeys: string[];
} {
  const l1 = input.l1Name?.trim() ?? '';
  const l2 = input.l2Name?.trim() ?? '';
  const l3 = input.l3Name?.trim() ?? '';
  const unresolved = l1 && l2 ? listUnresolvedInfoPickKeysForLeaf(l1, l2, l3) : [];
  return {
    ...(input.leafId?.trim() ? { leafId: input.leafId.trim() } : {}),
    aliases: WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES,
    catalogToInfoPick: buildWorkshop2CatalogToInfoPickAliasMap(),
    unresolvedInfoPickKeys: unresolved,
  };
}
