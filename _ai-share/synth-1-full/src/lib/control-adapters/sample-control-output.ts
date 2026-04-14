/**
 * Narrow adapter: normalized sample snapshot → ControlOutput.
 * Sample is anchored as its own entity — not article/order SoT (optional ids are context only).
 *
 * Gap (explicit): no Workshop2 dossier, lab/QC payloads, or shipment tracking — only workflow + optional YMD.
 * @see docs/domain-model/control-contracts.md
 */
import type {
  Blocker,
  ControlOutput,
  ControlOwnerRef,
  DeadlinePressureState,
  NextAction,
  ReadinessSummary,
  ReasonPayload,
} from '@/lib/contracts';
import { validateControlOutput, validateNextAction } from '@/lib/contracts';
import { mapOrderDeadlinePressure } from './order-control-output';
import { summarizeDerivedBlockers } from './order-control-derivations';
import {
  assertDerivationBlockerValid,
  assertDerivationNextActionValid,
} from './derivation-assertions';

export const SAMPLE_CONTROL_ADAPTER_VERSION = 'sample-control-output.v1.0';

/** Minimal workflow — not full PLM / lab model. */
export type SampleControlWorkflowStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

export interface SampleControlInput {
  sample_id: string;
  /** Context only — not merged into entity_ref. */
  article_id?: string;
  collection_id?: string;
  workflow_status: SampleControlWorkflowStatus;
  /** YYYY-MM-DD target (review / expected arrival); optional. */
  due_at_ymd?: string;
  as_of: string;
  version?: string;
  owner?: ControlOwnerRef;
  display_label?: string;
  /** undefined → derive; null → force no next_action. */
  next_action?: NextAction | null;
}

function sampleEntityRef(input: SampleControlInput) {
  return {
    entity_type: 'sample' as const,
    entity_id: input.sample_id,
    label: input.display_label,
  };
}

function derivationSource(input: SampleControlInput): Blocker['source'] {
  return {
    domain: 'sample',
    record_type: 'SampleControlDerivation',
    record_id: input.sample_id,
  };
}

function ctxParams(input: SampleControlInput): Record<string, string> {
  const p: Record<string, string> = {};
  if (input.article_id) p.article_id = input.article_id;
  if (input.collection_id) p.collection_id = input.collection_id;
  return p;
}

export function mapSampleDeadlinePressure(
  due_at_ymd: string | undefined,
  as_of: string
): DeadlinePressureState {
  const d = due_at_ymd?.trim();
  return mapOrderDeadlinePressure(d && d.length >= 10 ? d : undefined, as_of);
}

function mapSampleToControlSignals(input: SampleControlInput): {
  status: ControlOutput['status'];
  risk: ControlOutput['risk'];
  reasons: ReasonPayload[];
} {
  const ctx = ctxParams(input);
  switch (input.workflow_status) {
    case 'approved':
      return {
        status: 'ok',
        risk: 'low',
        reasons: [{ code: 'UNKNOWN', params: { ...ctx, workflow: 'approved' } }],
      };
    case 'rejected':
      return {
        status: 'critical',
        risk: 'high',
        reasons: [{ code: 'READINESS_GAP', params: { ...ctx, outcome: 'rejected' } }],
      };
    case 'in_review':
      return {
        status: 'attention',
        risk: 'medium',
        reasons: [{ code: 'MISSING_APPROVAL', params: { ...ctx, gate: 'sample_review' } }],
      };
    case 'pending':
    default:
      return {
        status: 'attention',
        risk: 'low',
        reasons: [{ code: 'READINESS_GAP', params: { ...ctx, phase: 'pending' } }],
      };
  }
}

function buildSampleReadinessSummary(input: SampleControlInput): ReadinessSummary {
  const gaps: ReasonPayload[] = [];
  let state: ReadinessSummary['dimensions'][0]['state'] = 'unknown';

  switch (input.workflow_status) {
    case 'approved':
      state = 'ready';
      break;
    case 'rejected':
      state = 'not_ready';
      gaps.push({ code: 'READINESS_GAP', params: { outcome: 'rejected' } });
      break;
    case 'in_review':
      state = 'not_ready';
      gaps.push({ code: 'MISSING_APPROVAL', params: { gate: 'sample_review' } });
      break;
    case 'pending':
      state = 'unknown';
      break;
    default:
      state = 'unknown';
  }

  return {
    dimensions: [{ key: 'sample_readiness', state, gap_codes: gaps }],
  };
}

function deriveSampleBlockers(input: SampleControlInput): Blocker[] {
  const ref = sampleEntityRef(input);
  const src = derivationSource(input);
  const ts = input.as_of;
  const ctx = ctxParams(input);
  const out: Blocker[] = [];

  if (input.workflow_status === 'rejected') {
    const b: Blocker = {
      blocker_id: `derived:sample:${input.sample_id}:rejected`,
      entity_ref: ref,
      blocker_type: 'COMPLIANCE_HOLD',
      severity: 'error',
      source: src,
      explanation: {
        codes: [{ code: 'READINESS_GAP', params: { ...ctx, outcome: 'rejected' } }],
      },
      owner: input.owner ?? { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'sample_resubmit_or_close',
        predicate_ref: 'rule.sample.not_rejected',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveSampleBlockers.rejected');
    out.push(b);
  }

  if (input.workflow_status === 'in_review') {
    const b: Blocker = {
      blocker_id: `derived:sample:${input.sample_id}:awaiting_approval`,
      entity_ref: ref,
      blocker_type: 'MISSING_APPROVAL',
      severity: 'warning',
      source: src,
      explanation: {
        codes: [{ code: 'MISSING_APPROVAL', params: { ...ctx, gate: 'sample_review' } }],
      },
      owner: input.owner ?? { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'sample_approved',
        predicate_ref: 'rule.sample.approved_or_rejected',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveSampleBlockers.in_review');
    out.push(b);
  }

  const due = input.due_at_ymd?.trim();
  const hasDue = due != null && due.length >= 10 && due[4] === '-' && due[7] === '-';
  if (hasDue && input.workflow_status !== 'approved' && input.workflow_status !== 'rejected') {
    const ymdNow = input.as_of.slice(0, 10);
    if (ymdNow > due!) {
      const b: Blocker = {
        blocker_id: `derived:sample:${input.sample_id}:due_overdue`,
        entity_ref: ref,
        blocker_type: 'LATE_COMMITMENT',
        severity: 'warning',
        source: src,
        explanation: {
          codes: [{ code: 'LATE_COMMITMENT', params: { ...ctx, due_at: due! } }],
        },
        owner: input.owner ?? { role: 'brand_ops' },
        created_at: ts,
        updated_at: ts,
        resolution_condition: {
          type: 'deadline_cleared',
          predicate_ref: 'rule.sample.due_not_passed',
        },
        status: 'open',
      };
      assertDerivationBlockerValid(b, 'deriveSampleBlockers.overdue');
      out.push(b);
    }
  }

  return out;
}

function deriveSampleNextAction(input: SampleControlInput): NextAction | null {
  if (input.workflow_status !== 'in_review') return null;

  const ref = sampleEntityRef(input);
  const ctx = ctxParams(input);
  const a: NextAction = {
    action_id: `derived:sample:${input.sample_id}:approve_sample`,
    entity_ref: ref,
    action_type: 'SUBMIT_APPROVAL',
    reason: [{ code: 'MISSING_APPROVAL', params: { ...ctx, gate: 'sample_review' } }],
    owner: input.owner ?? { role: 'brand_ops' },
    source: { kind: 'derived', rule_id: 'sample.derive.approve_sample' },
    status: 'open',
    explainability: { rule_id: 'sample.derive.approve_sample' },
  };
  assertDerivationNextActionValid(a, 'deriveSampleNextAction.in_review');
  return a;
}

export function assertSampleControlInput(input: SampleControlInput): void {
  if (input.sample_id == null || String(input.sample_id).trim() === '') {
    throw new Error('SampleControlInput.sample_id is required');
  }
  if (input.as_of == null || String(input.as_of).trim() === '') {
    throw new Error('SampleControlInput.as_of is required');
  }
}

export function buildSampleControlOutput(input: SampleControlInput): ControlOutput {
  assertSampleControlInput(input);

  const { status, risk, reasons } = mapSampleToControlSignals(input);
  const deadline_pressure = mapSampleDeadlinePressure(input.due_at_ymd, input.as_of);
  const readiness_summary = buildSampleReadinessSummary(input);

  const derivedBlockers = deriveSampleBlockers(input);
  const blocker_summary = summarizeDerivedBlockers(derivedBlockers);

  let next: NextAction | null = null;
  if (input.next_action !== undefined) {
    if (input.next_action !== null) {
      const nv = validateNextAction(input.next_action);
      if (!nv.ok) throw new Error(`Invalid next_action: ${nv.errors.join('; ')}`);
      next = input.next_action;
    }
  } else {
    next = deriveSampleNextAction(input);
    if (next != null) {
      const nv = validateNextAction(next);
      if (!nv.ok) throw new Error(`Invalid derived next_action: ${nv.errors.join('; ')}`);
    }
  }

  const output: ControlOutput = {
    entity_ref: sampleEntityRef(input),
    status,
    risk,
    blocker_summary,
    readiness_summary,
    deadline_pressure,
    next_action: next,
    owner: input.owner,
    reasons,
    as_of: input.as_of,
    version:
      input.version ??
      `${SAMPLE_CONTROL_ADAPTER_VERSION}:${input.as_of.slice(0, 10)}:${input.sample_id}`,
  };

  const v = validateControlOutput(output);
  if (!v.ok) throw new Error(`ControlOutput validation failed: ${v.errors.join('; ')}`);
  return output;
}
