/** Client-safe defaults (без node:fs) — для UI и shared types. */

export type Workshop2CollectionDefaults = {
  vatPercent: number;
  currency: 'RUB';
  /** Для apparel leaf — markingRequired по умолчанию при создании артикула. */
  markingRequiredDefault: boolean;
  updatedAt?: string;
};

export const WORKSHOP2_RU_COLLECTION_DEFAULTS: Workshop2CollectionDefaults = {
  vatPercent: 20,
  currency: 'RUB',
  markingRequiredDefault: true,
};
