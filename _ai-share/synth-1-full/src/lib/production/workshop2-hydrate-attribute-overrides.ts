import { setWorkshop2AttributeOverrides } from '@/lib/production/workshop2-attribute-overrides-runtime';
import { fetchWorkshop2RefAttributes } from '@/lib/production/workshop2-references-client';

/** Подтянуть PG-переопределения атрибутов в runtime каталога (клиент). */
export async function hydrateWorkshop2AttributeOverridesFromApi(): Promise<void> {
  const data = await fetchWorkshop2RefAttributes();
  if (!data?.items?.length) return;
  setWorkshop2AttributeOverrides(
    data.items
      .filter((row) => row.hasOverride)
      .map((row) => ({
        attributeId: row.attributeId,
        ...(row.overrideLabel ? { label: row.overrideLabel } : {}),
        requiredForPhase1: row.requiredForPhase1,
      }))
  );
}
