/**
 * Lightweight refs only — no embedded domain payloads.
 * @see docs/domain-model/control-contracts.md §6
 */

import type { ControlEntityType } from './enums';

/** Canonical entity pointer — ids are authoritative; label is display-only (not a key). */
export interface EntityRef {
  entity_type: ControlEntityType;
  entity_id: string;
  label?: string;
  scope?: {
    brand_id?: string;
    shop_id?: string;
    tenant_id?: string;
  };
  as_of_expected?: string;
}

export type CommitmentPartyType = 'supplier' | 'factory';

/** Pointer to execution commitment — no PO lines, dates, or quantities here. */
export interface CommitmentRef {
  commitment_id: string;
  party_type?: CommitmentPartyType;
  party_id?: string;
  related_entity_refs?: EntityRef[];
}
