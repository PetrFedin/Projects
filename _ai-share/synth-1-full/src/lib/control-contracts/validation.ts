/**
 * Contract validation — no side effects, no I/O.
 * @see docs/domain-model/control-contracts.md
 */

import type { Blocker, ControlOutput, NextAction } from './contracts';
import type { CommitmentRef, EntityRef } from './refs';
import {
  ACTION_TYPES,
  BLOCKER_SEVERITIES,
  BLOCKER_STATUSES,
  BLOCKER_TYPES,
  CONTROL_ENTITY_TYPES,
  CONTROL_RISK_LEVELS,
  CONTROL_STATUSES,
  DEADLINE_PRESSURES,
  NEXT_ACTION_STATUSES,
  REASON_CODES,
  READINESS_DIMENSION_STATES,
} from './enums';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function nonEmpty(s: string | undefined, field: string, errors: string[]) {
  if (s == null || String(s).trim() === '') errors.push(`${field} is required`);
}

function isMember<T extends string>(
  value: string,
  allowed: readonly T[],
  field: string,
  errors: string[]
) {
  if (!allowed.includes(value as T)) errors.push(`${field} has invalid value: ${value}`);
}

function validateReasonPayloads(payloads: { code: string }[], field: string, errors: string[]) {
  for (let i = 0; i < payloads.length; i++) {
    isMember(payloads[i].code, REASON_CODES, `${field}[${i}].code`, errors);
  }
}

export function validateEntityRef(ref: EntityRef): ValidationResult {
  const errors: string[] = [];
  nonEmpty(ref.entity_id, 'entity_id', errors);
  isMember(ref.entity_type, CONTROL_ENTITY_TYPES, 'entity_type', errors);
  return { ok: errors.length === 0, errors };
}

export function validateCommitmentRef(ref: CommitmentRef): ValidationResult {
  const errors: string[] = [];
  nonEmpty(ref.commitment_id, 'commitment_id', errors);
  if (ref.related_entity_refs) {
    ref.related_entity_refs.forEach((r: EntityRef, i: number) => {
      const inner = validateEntityRef(r);
      if (!inner.ok) errors.push(...inner.errors.map((e) => `related_entity_refs[${i}].${e}`));
    });
  }
  return { ok: errors.length === 0, errors };
}

/** Type guard — no domain payload checks */
export function isEntityRef(value: unknown): value is EntityRef {
  if (value == null || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.entity_id === 'string' &&
    o.entity_id.trim() !== '' &&
    typeof o.entity_type === 'string' &&
    (CONTROL_ENTITY_TYPES as readonly string[]).includes(o.entity_type)
  );
}

export function validateBlocker(b: Blocker): ValidationResult {
  const errors: string[] = [];
  nonEmpty(b.blocker_id, 'blocker_id', errors);
  if (b.entity_ref == null) errors.push('entity_ref is required');
  else {
    const er = validateEntityRef(b.entity_ref);
    if (!er.ok) errors.push(...er.errors.map((e) => `entity_ref.${e}`));
  }
  if (b.commitment_ref != null) {
    const cr = validateCommitmentRef(b.commitment_ref);
    if (!cr.ok) errors.push(...cr.errors.map((e) => `commitment_ref.${e}`));
  }
  isMember(b.blocker_type, BLOCKER_TYPES, 'blocker_type', errors);
  isMember(b.severity, BLOCKER_SEVERITIES, 'severity', errors);
  isMember(b.status, BLOCKER_STATUSES, 'status', errors);
  if (b.source == null) errors.push('source is required');
  else {
    nonEmpty(b.source.domain, 'source.domain', errors);
    nonEmpty(b.source.record_type, 'source.record_type', errors);
  }
  nonEmpty(b.owner.role, 'owner.role', errors);
  nonEmpty(b.created_at, 'created_at', errors);
  nonEmpty(b.updated_at, 'updated_at', errors);
  nonEmpty(b.resolution_condition.type, 'resolution_condition.type', errors);
  nonEmpty(b.resolution_condition.predicate_ref, 'resolution_condition.predicate_ref', errors);
  if (!b.explanation?.codes?.length) errors.push('explanation.codes must be non-empty');
  else validateReasonPayloads(b.explanation.codes, 'explanation.codes', errors);
  return { ok: errors.length === 0, errors };
}

export function validateNextAction(a: NextAction): ValidationResult {
  const errors: string[] = [];
  nonEmpty(a.action_id, 'action_id', errors);
  if (a.entity_ref == null) errors.push('entity_ref is required');
  else {
    const er = validateEntityRef(a.entity_ref);
    if (!er.ok) errors.push(...er.errors.map((e) => `entity_ref.${e}`));
  }
  if (a.commitment_ref != null) {
    const cr = validateCommitmentRef(a.commitment_ref);
    if (!cr.ok) errors.push(...cr.errors.map((e) => `commitment_ref.${e}`));
  }
  isMember(a.action_type, ACTION_TYPES, 'action_type', errors);
  isMember(a.status, NEXT_ACTION_STATUSES, 'status', errors);
  if (a.source == null) errors.push('source is required');
  else if (a.source.kind === 'derived') {
    nonEmpty(a.source.rule_id, 'source.rule_id', errors);
  } else {
    nonEmpty(a.source.assigned_by, 'source.assigned_by', errors);
    nonEmpty(a.source.assigned_at, 'source.assigned_at', errors);
  }
  nonEmpty(a.owner.role, 'owner.role', errors);
  if (!a.reason?.length) errors.push('reason must be non-empty');
  else validateReasonPayloads(a.reason, 'reason', errors);
  if (typeof a.explainability === 'string') {
    nonEmpty(a.explainability, 'explainability', errors);
  } else {
    nonEmpty(a.explainability.rule_id, 'explainability.rule_id', errors);
  }
  return { ok: errors.length === 0, errors };
}

export function validateControlOutput(o: ControlOutput): ValidationResult {
  const errors: string[] = [];
  if (o.entity_ref == null) errors.push('entity_ref is required');
  else {
    const er = validateEntityRef(o.entity_ref);
    if (!er.ok) errors.push(...er.errors.map((e) => `entity_ref.${e}`));
  }
  if (o.commitment_ref != null) {
    const cr = validateCommitmentRef(o.commitment_ref);
    if (!cr.ok) errors.push(...cr.errors.map((e) => `commitment_ref.${e}`));
  }
  isMember(o.status, CONTROL_STATUSES, 'status', errors);
  isMember(o.risk, CONTROL_RISK_LEVELS, 'risk', errors);
  nonEmpty(o.as_of, 'as_of', errors);
  nonEmpty(String(o.version), 'version', errors);
  if (o.blocker_summary.count < 0) errors.push('blocker_summary.count must be >= 0');
  isMember(
    o.blocker_summary.highest_severity,
    BLOCKER_SEVERITIES,
    'blocker_summary.highest_severity',
    errors
  );
  if (!o.readiness_summary?.dimensions) errors.push('readiness_summary.dimensions required');
  else {
    o.readiness_summary.dimensions.forEach((d, i) => {
      nonEmpty(d.key, `readiness_summary.dimensions[${i}].key`, errors);
      isMember(
        d.state,
        READINESS_DIMENSION_STATES,
        `readiness_summary.dimensions[${i}].state`,
        errors
      );
      if (!Array.isArray(d.gap_codes))
        errors.push(`readiness_summary.dimensions[${i}].gap_codes must be array`);
      else
        validateReasonPayloads(d.gap_codes, `readiness_summary.dimensions[${i}].gap_codes`, errors);
    });
  }
  if (o.deadline_pressure == null) errors.push('deadline_pressure is required');
  else {
    isMember(o.deadline_pressure.level, DEADLINE_PRESSURES, 'deadline_pressure.level', errors);
  }
  validateReasonPayloads(o.reasons, 'reasons', errors);
  if (o.next_action != null) {
    const na = validateNextAction(o.next_action);
    errors.push(...na.errors.map((e) => `next_action.${e}`));
  }
  return { ok: errors.length === 0, errors };
}
