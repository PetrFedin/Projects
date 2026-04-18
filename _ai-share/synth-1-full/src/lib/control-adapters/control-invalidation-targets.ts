/**
 * Maps approved invalidation events → concrete Order/Article/Sample/Commitment control recompute targets.
 * Sync only — no async queue. Optional `subscribeControlInvalidation` + `dispatchControlInvalidation`
 * for explicit single-screen or test hooks (not a global event bus).
 *
 * Gaps (explicit, prefer under-triggering):
 * - inventory.balance_changed: only when signal.entity_ref is already an `article` anchor;
 *   no sku_balance / inventory_location → article inference in this slice.
 *
 * @see src/lib/control-contracts/invalidation.ts
 */
import {
  ControlInvalidationEventTypes,
  type CommitmentRef,
  type ControlInvalidationSignal,
  type EntityRef,
} from '@/lib/contracts';

export type ControlRecomputeTarget =
  | { kind: 'order_control'; entity_ref: EntityRef }
  | { kind: 'article_control'; entity_ref: EntityRef }
  | { kind: 'sample_control'; entity_ref: EntityRef }
  | { kind: 'commitment_control'; entity_ref: EntityRef };

/**
 * Surfaces that should bump `as_of` on **any** of these control targets stay aligned after cross-entity dispatches.
 */
export const BRAND_CONTROL_SURFACE_TICK_KINDS: ControlRecomputeTarget['kind'][] = [
  'order_control',
  'article_control',
  'sample_control',
  'commitment_control',
];

export interface GetControlRecomputeTargetsOptions {
  /** Use when event is commitment.updated and linkage lives on the commitment. */
  commitment_ref?: CommitmentRef;
}

function refToTarget(ref: EntityRef): ControlRecomputeTarget | null {
  if (ref.entity_id == null || String(ref.entity_id).trim() === '') return null;
  if (ref.entity_type === 'order') return { kind: 'order_control', entity_ref: ref };
  if (ref.entity_type === 'article') return { kind: 'article_control', entity_ref: ref };
  if (ref.entity_type === 'sample') return { kind: 'sample_control', entity_ref: ref };
  if (ref.entity_type === 'commitment') return { kind: 'commitment_control', entity_ref: ref };
  return null;
}

function dedupeTargets(targets: ControlRecomputeTarget[]): ControlRecomputeTarget[] {
  const seen = new Set<string>();
  const out: ControlRecomputeTarget[] = [];
  for (const t of targets) {
    const k = `${t.kind}:${t.entity_ref.entity_id}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

/**
 * Returns which control adapter outputs should be recomputed for this signal.
 * Empty array means “no mapped targets” (not an error).
 */
export function getControlRecomputeTargets(
  signal: ControlInvalidationSignal,
  options?: GetControlRecomputeTargetsOptions
): ControlRecomputeTarget[] {
  switch (signal.event) {
    case ControlInvalidationEventTypes.orderStateChanged: {
      const t = refToTarget(signal.entity_ref);
      return t?.kind === 'order_control' ? [t] : [];
    }
    case ControlInvalidationEventTypes.articleChanged: {
      const t = refToTarget(signal.entity_ref);
      return t?.kind === 'article_control' ? [t] : [];
    }
    case ControlInvalidationEventTypes.sampleChanged: {
      const t = refToTarget(signal.entity_ref);
      return t?.kind === 'sample_control' ? [t] : [];
    }
    case ControlInvalidationEventTypes.commitmentUpdated: {
      const out: ControlRecomputeTarget[] = [];
      const direct = refToTarget(signal.entity_ref);
      if (direct) out.push(direct);

      const related = options?.commitment_ref?.related_entity_refs;
      if (related?.length) {
        for (const r of related) {
          const t = refToTarget(r);
          if (t) out.push(t);
        }
      }
      return dedupeTargets(out);
    }
    case ControlInvalidationEventTypes.inventoryBalanceChanged: {
      const t = refToTarget(signal.entity_ref);
      return t?.kind === 'article_control' ? [t] : [];
    }
    default:
      return [];
  }
}

export function shouldRecomputeOrderControl(
  signal: ControlInvalidationSignal,
  options?: GetControlRecomputeTargetsOptions
): boolean {
  return getControlRecomputeTargets(signal, options).some((t) => t.kind === 'order_control');
}

export function shouldRecomputeArticleControl(
  signal: ControlInvalidationSignal,
  options?: GetControlRecomputeTargetsOptions
): boolean {
  return getControlRecomputeTargets(signal, options).some((t) => t.kind === 'article_control');
}

export function shouldRecomputeSampleControl(
  signal: ControlInvalidationSignal,
  options?: GetControlRecomputeTargetsOptions
): boolean {
  return getControlRecomputeTargets(signal, options).some((t) => t.kind === 'sample_control');
}

export function shouldRecomputeCommitmentControl(
  signal: ControlInvalidationSignal,
  options?: GetControlRecomputeTargetsOptions
): boolean {
  return getControlRecomputeTargets(signal, options).some((t) => t.kind === 'commitment_control');
}

export interface ControlInvalidationDispatchPayload {
  signal: ControlInvalidationSignal;
  options: GetControlRecomputeTargetsOptions | undefined;
  targets: ControlRecomputeTarget[];
}

type ControlInvalidationListener = (payload: ControlInvalidationDispatchPayload) => void;

const invalidationListeners = new Set<ControlInvalidationListener>();

/** Register a sync listener; unsubscribe returns a disposer. For client UI / tests only. */
export function subscribeControlInvalidation(listener: ControlInvalidationListener): () => void {
  invalidationListeners.add(listener);
  return () => invalidationListeners.delete(listener);
}

/**
 * Resolves targets, then notifies subscribers in registration order.
 * Returns the same targets for inline use (e.g. bump local snapshot tick).
 */
export function dispatchControlInvalidation(
  signal: ControlInvalidationSignal,
  options?: GetControlRecomputeTargetsOptions
): ControlRecomputeTarget[] {
  const targets = getControlRecomputeTargets(signal, options);
  const payload: ControlInvalidationDispatchPayload = { signal, options, targets };
  for (const listener of invalidationListeners) {
    try {
      listener(payload);
    } catch (e) {
      console.error('[dispatchControlInvalidation]', e);
    }
  }
  return targets;
}

/**
 * Ledger → Control: пересчёт article_control при изменении остатков по продукту (ATP).
 * В демо `productId` на грануле часто совпадает с `entity_id` артикула; `unknown` / пустое — пропуск.
 */
export function dispatchInventoryBalanceChangedForProduct(
  productId: string | undefined
): ControlRecomputeTarget[] {
  const id = productId?.trim();
  if (!id || id === 'unknown') return [];
  return dispatchControlInvalidation({
    event: ControlInvalidationEventTypes.inventoryBalanceChanged,
    entity_ref: { entity_type: 'article', entity_id: id },
  });
}

/** Thin seam for call sites: `article.changed` with an article anchor. */
export function dispatchArticleChanged(articleId: string): ControlRecomputeTarget[] {
  const id = articleId?.trim();
  if (!id) return [];
  return dispatchControlInvalidation({
    event: ControlInvalidationEventTypes.articleChanged,
    entity_ref: { entity_type: 'article', entity_id: id },
  });
}

/** Thin seam for call sites: `order.state_changed` with an order anchor. */
export function dispatchOrderStateChanged(orderId: string): ControlRecomputeTarget[] {
  const id = orderId?.trim();
  if (!id) return [];
  return dispatchControlInvalidation({
    event: ControlInvalidationEventTypes.orderStateChanged,
    entity_ref: { entity_type: 'order', entity_id: id },
  });
}

/** Call when sample workflow / due / linkage changed; bumps `sample_control` subscribers. */
export function dispatchSampleChanged(sampleId: string): ControlRecomputeTarget[] {
  const id = sampleId?.trim();
  if (!id) return [];
  return dispatchControlInvalidation({
    event: ControlInvalidationEventTypes.sampleChanged,
    entity_ref: { entity_type: 'sample', entity_id: id },
  });
}

/** Call when execution commitment fields changed; bumps `commitment_control` and optional linked entities. */
export function dispatchCommitmentUpdated(
  commitmentId: string,
  options?: GetControlRecomputeTargetsOptions
): ControlRecomputeTarget[] {
  const id = commitmentId?.trim();
  if (!id) return [];
  return dispatchControlInvalidation(
    {
      event: ControlInvalidationEventTypes.commitmentUpdated,
      entity_ref: { entity_type: 'commitment', entity_id: id },
    },
    options
  );
}
