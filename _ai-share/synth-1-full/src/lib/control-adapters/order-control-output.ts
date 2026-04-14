/**
 * Narrow adapter: wholesale B2B-oriented order snapshot → ControlOutput.
 * Does not aggregate platform-wide; does not infer payment/shipment SoT beyond labeled inputs.
 *
 * @see docs/domain-model/order.md
 * @see docs/domain-model/control-contracts.md
 */
import type { B2BOrder, B2BOrderPaymentStatus } from '@/lib/types';
import type {
  ControlOutput,
  ControlOwnerRef,
  DeadlinePressureState,
  NextAction,
  ReadinessSummary,
  ReasonPayload,
} from '@/lib/contracts';
import { validateControlOutput, validateNextAction } from '@/lib/contracts';
import {
  deriveOrderBlockers,
  deriveOrderNextAction,
  summarizeDerivedBlockers,
} from './order-control-derivations';

/** Version tag for adapter output; bump when mapping rules change. */
export const ORDER_CONTROL_ADAPTER_VERSION = 'order-control-output.v1.2';

/** Only within this window (inclusive) does delivery show as `upcoming` — tighter than a full week to cut noise. */
export const ORDER_DEADLINE_UPCOMING_DAYS = 3;

/**
 * Minimal normalized input for this slice only — not the future full order domain model.
 */
export interface OrderControlInput {
  order_id: string;
  /** Commercial / workflow label (e.g. RU labels from B2B mocks). */
  commercial_status: string;
  payment_status?: B2BOrderPaymentStatus;
  /** YYYY-MM-DD commitment; optional. */
  delivery_date?: string;
  /** ISO-8601 snapshot time. */
  as_of: string;
  /** Defaults derived from order_id + as_of when omitted. */
  version?: string;
  /** Optional execution-linkage pointer only; no embedded commitment truth. */
  commitment_id?: string;
  owner?: ControlOwnerRef;
  /** Display only; not authoritative id. */
  display_label?: string;
  /**
   * Optional fulfillment hint for readiness dimension only.
   * Not commercial order state and not shipment SoT — must stay labeled.
   */
  fulfillment_signal?: 'unknown' | 'in_progress' | 'shipped' | 'delivered';
  /** When set (non-null), embedded into output and must pass validateNextAction. */
  next_action?: NextAction | null;
}

const OK_STATUSES = new Set([
  'Согласован',
  'Подтверждён',
  'Зарезервировано',
  'В производстве',
  'Отгружен',
  'Доставлен',
  'Инвойс выписан',
]);

function parseYmdUtc(ymd: string): number {
  const [y, m, d] = ymd.split('-').map((x) => Number(x));
  if (!y || !m || !d) return NaN;
  return Date.UTC(y, m - 1, d);
}

/** Public for tests — maps delivery_date vs as_of (date prefix) to pressure. */
export function mapOrderDeadlinePressure(
  delivery_date: string | undefined,
  as_of: string
): DeadlinePressureState {
  const d = delivery_date?.slice(0, 10);
  const a = as_of.slice(0, 10);
  if (!d || d.length !== 10 || d[4] !== '-' || d[7] !== '-') {
    return { level: 'none' };
  }
  if (!a || a.length !== 10) return { level: 'none', next_deadline_at: d };

  const td = parseYmdUtc(d);
  const ta = parseYmdUtc(a);
  if (Number.isNaN(td) || Number.isNaN(ta)) return { level: 'none', next_deadline_at: d };

  if (d < a) return { level: 'overdue', next_deadline_at: d };
  if (d === a) return { level: 'due_today', next_deadline_at: d };
  const days = (td - ta) / 86_400_000;
  if (days <= ORDER_DEADLINE_UPCOMING_DAYS) return { level: 'upcoming', next_deadline_at: d };
  return { level: 'none', next_deadline_at: d };
}

const DELIVERY_PRESSURE_SUPPRESSED_STATUSES = new Set(['Отгружен', 'Доставлен', 'Инвойс выписан']);

/**
 * Past delivery dates on fulfilled orders are usually stale demo data, not active slip —
 * hide delivery pressure so signals stay actionable.
 */
export function calibrateOrderDeadlinePressure(
  input: OrderControlInput,
  raw: DeadlinePressureState
): DeadlinePressureState {
  if (raw.level === 'none') return raw;
  if (!DELIVERY_PRESSURE_SUPPRESSED_STATUSES.has(input.commercial_status)) return raw;
  return { level: 'none', next_deadline_at: undefined };
}

function commercialReadinessState(
  status: string,
  payment: B2BOrderPaymentStatus | undefined
): 'ready' | 'not_ready' | 'unknown' {
  if (payment === 'overdue') return 'not_ready';
  if (OK_STATUSES.has(status)) return 'ready';
  if (status === 'Черновик' || status === 'На проверке' || status === 'Требует внимания') {
    return 'not_ready';
  }
  return 'unknown';
}

function fulfillmentReadinessState(
  signal: OrderControlInput['fulfillment_signal']
): 'ready' | 'not_ready' | 'unknown' {
  if (signal == null) return 'unknown';
  if (signal === 'delivered') return 'ready';
  if (signal === 'shipped' || signal === 'in_progress') return 'not_ready';
  return 'unknown';
}

/**
 * Rollup for ControlOutput.status / risk. Blockers from deriveOrderBlockers may repeat the same
 * ReasonCodes — reasons are the headline, blockers are structured work items (see order-control-derivations).
 */
function mapOrderToControlSignals(input: OrderControlInput): {
  status: ControlOutput['status'];
  risk: ControlOutput['risk'];
  reasons: ReasonPayload[];
} {
  const reasons: ReasonPayload[] = [];
  const st = input.commercial_status;
  const pay = input.payment_status;

  if (pay === 'overdue') {
    reasons.push({ code: 'ORDER_PENDING_PAYMENT', params: { payment_status: 'overdue' } });
    return { status: 'critical', risk: 'severe', reasons };
  }
  if (pay === 'pending' || pay === 'partial') {
    reasons.push({ code: 'ORDER_PENDING_PAYMENT', params: { payment_status: pay } });
  }

  if (st === 'Требует внимания') {
    reasons.push({ code: 'UNKNOWN', params: { commercial_status: st } });
    return { status: 'critical', risk: 'high', reasons };
  }
  if (st === 'Черновик') {
    reasons.push({ code: 'READINESS_GAP', params: { phase: 'draft' } });
    return { status: 'attention', risk: 'medium', reasons };
  }
  if (st === 'На проверке') {
    reasons.push({ code: 'MISSING_APPROVAL', params: { phase: 'review' } });
    return { status: 'attention', risk: 'medium', reasons };
  }
  if (OK_STATUSES.has(st)) {
    if (reasons.length === 0) reasons.push({ code: 'UNKNOWN', params: { commercial_status: st } });
    return {
      status: 'ok',
      risk: pay === 'pending' || pay === 'partial' ? 'medium' : 'low',
      reasons,
    };
  }
  reasons.push({ code: 'UNKNOWN', params: { commercial_status: st } });
  return { status: 'attention', risk: 'medium', reasons };
}

function buildReadinessSummary(input: OrderControlInput): ReadinessSummary {
  const commercial = commercialReadinessState(input.commercial_status, input.payment_status);
  const fulfillment = fulfillmentReadinessState(input.fulfillment_signal);
  const gapsCommercial: ReasonPayload[] = [];
  if (commercial !== 'ready')
    gapsCommercial.push({ code: 'READINESS_GAP', params: { dimension: 'commercial' } });
  const gapsFulfillment: ReasonPayload[] = [];
  if (fulfillment === 'not_ready')
    gapsFulfillment.push({ code: 'READINESS_GAP', params: { dimension: 'fulfillment' } });

  return {
    dimensions: [
      {
        key: 'commercial',
        state: commercial,
        gap_codes: commercial === 'ready' ? [] : gapsCommercial,
      },
      { key: 'fulfillment', state: fulfillment, gap_codes: gapsFulfillment },
    ],
  };
}

export function orderControlInputFromB2BOrder(
  order: B2BOrder,
  as_of: string,
  version?: string
): OrderControlInput {
  return {
    order_id: order.order,
    commercial_status: order.status,
    payment_status: order.paymentStatus,
    delivery_date: order.deliveryDate,
    as_of,
    version,
    display_label: `${order.order} · ${order.shop}`,
  };
}

export function assertOrderControlInput(input: OrderControlInput): void {
  if (input.order_id == null || String(input.order_id).trim() === '') {
    throw new Error('OrderControlInput.order_id is required');
  }
  if (input.as_of == null || String(input.as_of).trim() === '') {
    throw new Error('OrderControlInput.as_of is required');
  }
}

/**
 * Build a ControlOutput for one order anchor. Throws if contract validation fails.
 */
export function buildOrderControlOutput(input: OrderControlInput): ControlOutput {
  assertOrderControlInput(input);

  const { status, risk, reasons } = mapOrderToControlSignals(input);
  const deadline_pressure = calibrateOrderDeadlinePressure(
    input,
    mapOrderDeadlinePressure(input.delivery_date, input.as_of)
  );
  const readiness_summary = buildReadinessSummary(input);

  const derivedBlockers = deriveOrderBlockers(input);
  const blocker_summary = summarizeDerivedBlockers(derivedBlockers);

  let next: NextAction | null = null;
  if (input.next_action !== undefined) {
    if (input.next_action !== null) {
      const nv = validateNextAction(input.next_action);
      if (!nv.ok) throw new Error(`Invalid next_action: ${nv.errors.join('; ')}`);
      next = input.next_action;
    }
  } else {
    next = deriveOrderNextAction(input);
    if (next != null) {
      const nv = validateNextAction(next);
      if (!nv.ok) throw new Error(`Invalid derived next_action: ${nv.errors.join('; ')}`);
    }
  }

  const output: ControlOutput = {
    entity_ref: {
      entity_type: 'order',
      entity_id: input.order_id,
      label: input.display_label,
    },
    commitment_ref: input.commitment_id ? { commitment_id: input.commitment_id } : undefined,
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
      `${ORDER_CONTROL_ADAPTER_VERSION}:${input.as_of.slice(0, 10)}:${input.order_id}`,
  };

  const v = validateControlOutput(output);
  if (!v.ok) throw new Error(`ControlOutput validation failed: ${v.errors.join('; ')}`);
  return output;
}
