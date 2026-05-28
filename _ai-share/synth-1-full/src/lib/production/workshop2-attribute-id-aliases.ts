/**
 * Сквозной реестр id: оси info-pick / product-attributes → канонический attribute-catalog Workshop2.
 * Нужен для readiness, сиротских назначений и сверки с project-info без дублирования полей в досье.
 */
import { getAttributeById } from './attribute-catalog';

/** info-pick / legacy id → канонический id в attribute-catalog.instance.json */
export const WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES: Readonly<Record<string, string>> = {
  materialOptions: 'mat',
  shoeUpperMaterialOptions: 'mat',
  shoeSoleMaterialOptions: 'sole',
  shoeLiningMaterialOptions: 'shoe-lining',
  shoeInsoleMaterialOptions: 'shoe-insole-material',
  footwearShaftHeightOptions: 'shoe-shaft-height',
  heelHeightOptions: 'shoe-heel-shape',
  fasteningOptionsByCategory: 'shoe-closure',
  insulationMaterialOptions: 'insulationMaterialOptions',
  fabricCompositionPresetOptions: 'fabricCompositionPresetOptions',
  fabricCompositionDetailClassOptions: 'fabricCompositionDetailClassOptions',
  careWashingClassOptions: 'careWashingClassOptions',
  countryOfOriginMarketOptions: 'countryOfOriginMarketOptions',
  productBarcodeTypeOptions: 'productBarcodeTypeOptions',
  primaryColorFamilyOptions: 'primaryColorFamilyOptions',
  colorReferenceSystemOptions: 'colorReferenceSystemOptions',
};

const catalogToInfoPick = new Map<string, string[]>();
for (const [infoPickId, catalogId] of Object.entries(
  WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES
)) {
  const list = catalogToInfoPick.get(catalogId) ?? [];
  list.push(infoPickId);
  catalogToInfoPick.set(catalogId, list);
}

/** Канонический id каталога для оси info-pick (если нет алиаса — исходный id, если есть в каталоге). */
export function resolveWorkshop2CatalogAttributeId(attributeId: string): string {
  const raw = attributeId.trim();
  if (!raw) return raw;
  const mapped = WORKSHOP2_INFO_PICK_TO_CATALOG_ATTRIBUTE_ALIASES[raw];
  if (mapped && getAttributeById(mapped)) return mapped;
  if (getAttributeById(raw)) return raw;
  return mapped ?? raw;
}

/** Все канонические id, соответствующие одной оси info-pick (для проверки заполненности). */
export function resolveWorkshop2CatalogAttributeIdsForInfoPickKey(infoPickKey: string): string[] {
  const canonical = resolveWorkshop2CatalogAttributeId(infoPickKey);
  const reverse = catalogToInfoPick.get(canonical) ?? [];
  return [...new Set([canonical, infoPickKey, ...reverse])];
}

/** Набор id, допустимых для листа: каталог + обратные алиасы info-pick. */
export function expandCatalogAttributeIdsWithInfoPickAliases(
  catalogIds: Iterable<string>
): Set<string> {
  const out = new Set<string>();
  for (const id of catalogIds) {
    out.add(id);
    for (const legacy of catalogToInfoPick.get(id) ?? []) out.add(legacy);
  }
  return out;
}

/** Есть ли в досье значение по каноническому id или любому алиасу info-pick. */
export function dossierHasCanonicalValueForAttributeId(
  dossier: { assignments?: { kind?: string; attributeId?: string; values?: unknown[] }[] },
  attributeId: string
): boolean {
  const ids = resolveWorkshop2CatalogAttributeIdsForInfoPickKey(attributeId);
  return (dossier.assignments ?? []).some(
    (a) =>
      a.kind === 'canonical' && ids.includes(a.attributeId ?? '') && (a.values?.length ?? 0) > 0
  );
}
