/** Tier-бюджеты и маржа в `workshop2_collections.metadata` для golden path (core:bootstrap). */

export const WORKSHOP2_SS27_RANGE_PLANNER_METADATA = {
  rangePlanner: {
    tiers: [
      { id: 'core', budget: 1_500_000, targetMargin: 44, planSkuCount: 20 },
      { id: 'trend', budget: 900_000, targetMargin: 36, planSkuCount: 12 },
      { id: 'novelty', budget: 500_000, targetMargin: 33, planSkuCount: 6 },
    ],
  },
} as const;

export const WORKSHOP2_FW27_RANGE_PLANNER_METADATA = {
  rangePlanner: {
    tiers: [
      { id: 'core', budget: 1_200_000, targetMargin: 42, planSkuCount: 15 },
      { id: 'trend', budget: 750_000, targetMargin: 35, planSkuCount: 10 },
      { id: 'novelty', budget: 420_000, targetMargin: 32, planSkuCount: 5 },
    ],
  },
} as const;

const CORE_COLLECTION_RANGE_PLANNER_METADATA: Record<
  string,
  typeof WORKSHOP2_SS27_RANGE_PLANNER_METADATA | typeof WORKSHOP2_FW27_RANGE_PLANNER_METADATA
> = {
  SS27: WORKSHOP2_SS27_RANGE_PLANNER_METADATA,
  FW27: WORKSHOP2_FW27_RANGE_PLANNER_METADATA,
};

/** Канон tier-бюджетов golden path — fallback если metadata в PG ещё не засеяна. */
export function getWorkshop2CoreCollectionRangePlannerMetadataRaw(
  collectionId: string
):
  | typeof WORKSHOP2_SS27_RANGE_PLANNER_METADATA
  | typeof WORKSHOP2_FW27_RANGE_PLANNER_METADATA
  | null {
  return CORE_COLLECTION_RANGE_PLANNER_METADATA[collectionId.trim().toUpperCase()] ?? null;
}
