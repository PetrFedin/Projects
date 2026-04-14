/**
 * Operational interaction context — at least one anchor required.
 * @see docs/domain-model/interaction-attachment.md §4
 */

import type { CommitmentRef, EntityRef } from './refs';
import { validateEntityRef } from './validation';

export interface OperationalInteractionContext {
  entity_ref?: EntityRef;
  commitment_ref?: CommitmentRef;
  blocker_id?: string;
  action_id?: string;
}

export function validateOperationalInteractionContext(ctx: OperationalInteractionContext): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const has =
    ctx.blocker_id != null ||
    ctx.action_id != null ||
    (ctx.commitment_ref != null && ctx.commitment_ref.commitment_id !== '') ||
    ctx.entity_ref != null;
  if (!has) {
    errors.push(
      'operational context requires at least one of: entity_ref, commitment_ref, blocker_id, action_id'
    );
    return { ok: false, errors };
  }
  if (ctx.entity_ref != null) {
    const er = validateEntityRef(ctx.entity_ref);
    if (!er.ok) errors.push(...er.errors.map((e) => `entity_ref.${e}`));
  }
  if (ctx.commitment_ref != null) {
    if (
      ctx.commitment_ref.commitment_id == null ||
      ctx.commitment_ref.commitment_id.trim() === ''
    ) {
      errors.push('commitment_ref.commitment_id is required when commitment_ref is set');
    }
  }
  if (ctx.blocker_id != null && ctx.blocker_id.trim() === '')
    errors.push('blocker_id must be non-empty when set');
  if (ctx.action_id != null && ctx.action_id.trim() === '')
    errors.push('action_id must be non-empty when set');
  return { ok: errors.length === 0, errors };
}
