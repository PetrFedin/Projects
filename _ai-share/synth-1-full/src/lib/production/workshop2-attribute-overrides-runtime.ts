/**
 * Runtime-слой PG-переопределений каталога атрибутов (label, requiredForPhase1).
 * Подмешивается в getAttributeById после загрузки с API.
 */

export type Workshop2AttributeOverrideRow = {
  attributeId: string;
  label?: string;
  requiredForPhase1?: boolean;
};

let overridesById = new Map<string, Workshop2AttributeOverrideRow>();

export function setWorkshop2AttributeOverrides(rows: Workshop2AttributeOverrideRow[]): void {
  overridesById = new Map(rows.map((r) => [r.attributeId, r]));
}

export function clearWorkshop2AttributeOverrides(): void {
  overridesById = new Map();
}

export function getWorkshop2AttributeOverride(
  attributeId: string
): Workshop2AttributeOverrideRow | undefined {
  return overridesById.get(attributeId);
}
