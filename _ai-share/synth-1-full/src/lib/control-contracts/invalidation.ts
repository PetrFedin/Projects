/**
 * Named invalidation triggers only — no dispatcher, no bus.
 * @see docs/domain-model/control-contracts.md §8
 */

import type { EntityRef } from './refs';

/**
 * Канонические строки сигналов пересчёта control (не шина DomainEventBus).
 * @see docs/domain-model/control-contracts.md §8
 */
export const ControlInvalidationEventTypes = {
  articleChanged: 'article.changed',
  orderStateChanged: 'order.state_changed',
  commitmentUpdated: 'commitment.updated',
  inventoryBalanceChanged: 'inventory.balance_changed',
  sampleChanged: 'sample.changed',
} as const;

export const CONTROL_INVALIDATION_EVENTS = [
  ControlInvalidationEventTypes.articleChanged,
  ControlInvalidationEventTypes.orderStateChanged,
  ControlInvalidationEventTypes.commitmentUpdated,
  ControlInvalidationEventTypes.inventoryBalanceChanged,
  ControlInvalidationEventTypes.sampleChanged,
] as const;

export type ControlInvalidationEvent = (typeof CONTROL_INVALIDATION_EVENTS)[number];

export interface ControlInvalidationSignal {
  event: ControlInvalidationEvent;
  /** Anchor for recomputation */
  entity_ref: EntityRef;
}

export function isControlInvalidationEvent(value: string): value is ControlInvalidationEvent {
  return (CONTROL_INVALIDATION_EVENTS as readonly string[]).includes(value);
}
