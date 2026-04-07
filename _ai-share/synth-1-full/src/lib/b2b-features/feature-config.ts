/**
 * Feature flags / config — какие фичи включены.
 * Связь: FEATURE_BENCHMARK.md roadmap.
 */

export const B2B_FEATURE_FLAGS = {
  shipWindows: true,
  priceLists: true,
  rfq: true,
  creditTerms: true,
  exclusionZones: true,
  multiDoorOrdering: true,
  collaborativeOrdering: false,
  eventMicrosites: true,
  buyerDiscovery: true,
  reorderReminders: false,
} as const;
