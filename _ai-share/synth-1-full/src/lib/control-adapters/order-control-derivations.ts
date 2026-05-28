/**
 * Pure derivation helpers for OrderControlInput → Blocker[] / NextAction.
 * No I/O, no mutation, no storage.
 *
 * Shared language (with article-control-derivations):
 * - `reasons[]` on ControlOutput comes from mapOrderToControlSignals — rollup for status/risk.
 * - Blockers repeat labeled conditions in structured form; overlapping ReasonCodes are intentional
 *   (machine rollup vs actionable blocker list).
 * - Derived `rule_id`: `{domain}.derive.{snake_case}`.
 * - `next_action`: `undefined` → derive; explicit `null` → no action (handled in adapter, not here).
 */
import type {
  Blocker,
  BlockerSummary,
  BlockerSeverity,
  EntityRef,
  NextAction,
} from '@/lib/contracts';
import type { OrderControlInput } from './order-control-output';
import {
  assertDerivationBlockerValid,
  assertDerivationNextActionValid,
} from './derivation-assertions';

function orderEntityRef(input: OrderControlInput): EntityRef {
  return {
    entity_type: 'order',
    entity_id: input.order_id,
    label: input.display_label,
  };
}

function derivationSource(input: OrderControlInput): Blocker['source'] {
  return {
    domain: 'order',
    record_type: 'OrderControlDerivation',
    record_id: input.order_id,
  };
}

const SEVERITY_RANK: Record<BlockerSeverity, number> = {
  info: 0,
  warning: 1,
  error: 2,
  critical: 3,
};

function maxSeverity(a: BlockerSeverity, b: BlockerSeverity): BlockerSeverity {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}

/**
 * Deterministic blockers from a narrow rule set (payment, delivery, attention status).
 */
export function deriveOrderBlockers(input: OrderControlInput): Blocker[] {
  const ref = orderEntityRef(input);
  const src = derivationSource(input);
  const ts = input.as_of;
  const out: Blocker[] = [];

  if (input.payment_status === 'overdue') {
    const b: Blocker = {
      blocker_id: `derived:order:${input.order_id}:payment_overdue`,
      entity_ref: ref,
      blocker_type: 'OTHER',
      severity: 'critical',
      source: src,
      explanation: {
        codes: [{ code: 'ORDER_PENDING_PAYMENT', params: { payment_status: 'overdue' } }],
      },
      owner: { role: 'finance_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'payment_current',
        predicate_ref: 'rule.order.payment.not_overdue',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveOrderBlockers.payment_overdue');
    out.push(b);
  }

  const d = input.delivery_date?.trim();
  const hasDelivery = d != null && d.length >= 10 && d[4] === '-' && d[7] === '-';
  // Drafts often omit logistics — do not surface a blocker until the order leaves draft.
  if (!hasDelivery && input.commercial_status !== 'Черновик') {
    const b: Blocker = {
      blocker_id: `derived:order:${input.order_id}:missing_delivery_date`,
      entity_ref: ref,
      blocker_type: 'READINESS_GAP',
      severity: 'warning',
      source: src,
      explanation: {
        codes: [{ code: 'READINESS_GAP', params: { field: 'delivery_date' } }],
      },
      owner: { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'delivery_date_set',
        predicate_ref: 'rule.order.delivery_date.present',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveOrderBlockers.missing_delivery');
    out.push(b);
  }

  if (input.commercial_status === 'Требует внимания') {
    const b: Blocker = {
      blocker_id: `derived:order:${input.order_id}:requires_attention`,
      entity_ref: ref,
      blocker_type: 'OTHER',
      severity: 'error',
      source: src,
      explanation: {
        codes: [{ code: 'UNKNOWN', params: { commercial_status: input.commercial_status } }],
      },
      owner: { role: 'brand_ops' },
      created_at: ts,
      updated_at: ts,
      resolution_condition: {
        type: 'commercial_cleared',
        predicate_ref: 'rule.order.commercial.not_requires_attention',
      },
      status: 'open',
    };
    assertDerivationBlockerValid(b, 'deriveOrderBlockers.requires_attention');
    out.push(b);
  }

  return out;
}

export function summarizeDerivedBlockers(blockers: Blocker[]): BlockerSummary {
  if (blockers.length === 0) {
    return { count: 0, highest_severity: 'info', top_blocker_ids: [] };
  }
  let hi: BlockerSeverity = 'info';
  for (const b of blockers) hi = maxSeverity(hi, b.severity);
  return {
    count: blockers.length,
    highest_severity: hi,
    top_blocker_ids: blockers.slice(0, 5).map((b) => b.blocker_id),
  };
}

/**
 * Single derived next action; priority: overdue payment → review → draft.
 */
export function deriveOrderNextAction(input: OrderControlInput): NextAction | null {
  const ref = orderEntityRef(input);

  if (input.payment_status === 'overdue') {
    const a: NextAction = {
      action_id: `derived:order:${input.order_id}:request_payment`,
      entity_ref: ref,
      action_type: 'REQUEST_CONFIRMATION',
      reason: [{ code: 'ORDER_PENDING_PAYMENT', params: { intent: 'request_payment' } }],
      owner: { role: 'finance_ops' },
      source: { kind: 'derived', rule_id: 'order.derive.request_payment' },
      status: 'open',
      explainability: { rule_id: 'order.derive.request_payment' },
    };
    assertDerivationNextActionValid(a, 'deriveOrderNextAction.request_payment');
    return a;
  }

  if (input.commercial_status === 'Требует внимания') {
    const a: NextAction = {
      action_id: `derived:order:${input.order_id}:attention_review`,
      entity_ref: ref,
      action_type: 'OTHER',
      reason: [{ code: 'READINESS_GAP', params: { phase: 'attention' } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'order.derive.attention_review' },
      status: 'open',
      explainability: { rule_id: 'order.derive.attention_review' },
    };
    assertDerivationNextActionValid(a, 'deriveOrderNextAction.attention_review');
    return a;
  }

  if (input.commercial_status === 'На проверке') {
    const a: NextAction = {
      action_id: `derived:order:${input.order_id}:approve_order`,
      entity_ref: ref,
      action_type: 'SUBMIT_APPROVAL',
      reason: [{ code: 'MISSING_APPROVAL', params: { phase: 'review' } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'order.derive.approve_order' },
      status: 'open',
      explainability: { rule_id: 'order.derive.approve_order' },
    };
    assertDerivationNextActionValid(a, 'deriveOrderNextAction.approve_order');
    return a;
  }

  if (input.commercial_status === 'Черновик') {
    const a: NextAction = {
      action_id: `derived:order:${input.order_id}:submit_order`,
      entity_ref: ref,
      action_type: 'OTHER',
      reason: [{ code: 'READINESS_GAP', params: { intent: 'submit_order' } }],
      owner: { role: 'brand_ops' },
      source: { kind: 'derived', rule_id: 'order.derive.submit_order' },
      status: 'open',
      explainability: { rule_id: 'order.derive.submit_order' },
    };
    assertDerivationNextActionValid(a, 'deriveOrderNextAction.submit_order');
    return a;
  }

  return null;
}
