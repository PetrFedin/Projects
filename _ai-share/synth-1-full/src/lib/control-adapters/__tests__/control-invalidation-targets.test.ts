/**
 * @jest-environment node
 */

import { ControlInvalidationEventTypes, type ControlInvalidationSignal } from '@/lib/contracts';
import {
  dispatchArticleChanged,
  dispatchCommitmentUpdated,
  dispatchControlInvalidation,
  dispatchOrderStateChanged,
  dispatchSampleChanged,
  getControlRecomputeTargets,
  shouldRecomputeArticleControl,
  shouldRecomputeCommitmentControl,
  shouldRecomputeOrderControl,
  shouldRecomputeSampleControl,
  subscribeControlInvalidation,
} from '@/lib/control-adapters/control-invalidation-targets';

describe('control-invalidation-targets', () => {
  it('order.state_changed + order ref → order_control only', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.orderStateChanged,
      entity_ref: { entity_type: 'order', entity_id: 'B2B-0012' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([
      { kind: 'order_control', entity_ref: signal.entity_ref },
    ]);
    expect(shouldRecomputeOrderControl(signal)).toBe(true);
    expect(shouldRecomputeArticleControl(signal)).toBe(false);
  });

  it('order.state_changed with wrong entity_type → no targets', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.orderStateChanged,
      entity_ref: { entity_type: 'article', entity_id: 'art-1' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([]);
  });

  it('article.changed + article ref → article_control only', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.articleChanged,
      entity_ref: { entity_type: 'article', entity_id: 'art-2' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([
      { kind: 'article_control', entity_ref: signal.entity_ref },
    ]);
    expect(shouldRecomputeArticleControl(signal)).toBe(true);
    expect(shouldRecomputeOrderControl(signal)).toBe(false);
    expect(shouldRecomputeSampleControl(signal)).toBe(false);
  });

  it('sample.changed + sample ref → sample_control only', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.sampleChanged,
      entity_ref: { entity_type: 'sample', entity_id: 'smp-12' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([
      { kind: 'sample_control', entity_ref: signal.entity_ref },
    ]);
    expect(shouldRecomputeSampleControl(signal)).toBe(true);
    expect(shouldRecomputeArticleControl(signal)).toBe(false);
  });

  it('sample.changed with wrong entity_type → no targets', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.sampleChanged,
      entity_ref: { entity_type: 'article', entity_id: 'art-1' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([]);
  });

  it('commitment.updated + related_entity_refs → order and article targets', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.commitmentUpdated,
      entity_ref: { entity_type: 'commitment', entity_id: 'cmt-1' },
    };
    const targets = getControlRecomputeTargets(signal, {
      commitment_ref: {
        commitment_id: 'cmt-1',
        related_entity_refs: [
          { entity_type: 'order', entity_id: 'O-1' },
          { entity_type: 'article', entity_id: 'A-1' },
        ],
      },
    });
    expect(targets).toHaveLength(3);
    expect(targets.some((t) => t.kind === 'commitment_control')).toBe(true);
    expect(targets.some((t) => t.kind === 'order_control')).toBe(true);
    expect(targets.some((t) => t.kind === 'article_control')).toBe(true);
  });

  it('commitment.updated + commitment anchor only → commitment_control', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.commitmentUpdated,
      entity_ref: { entity_type: 'commitment', entity_id: 'cmt-1' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([
      { kind: 'commitment_control', entity_ref: signal.entity_ref },
    ]);
    expect(shouldRecomputeCommitmentControl(signal)).toBe(true);
  });

  it('commitment.updated with direct order entity_ref → that order', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.commitmentUpdated,
      entity_ref: { entity_type: 'order', entity_id: 'O-9' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([
      { kind: 'order_control', entity_ref: signal.entity_ref },
    ]);
  });

  it('inventory.balance_changed does not map sku_balance to article', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.inventoryBalanceChanged,
      entity_ref: { entity_type: 'sku_balance', entity_id: 'sku-1' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([]);
  });

  it('inventory.balance_changed with article ref → article_control (explicit anchor only)', () => {
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.inventoryBalanceChanged,
      entity_ref: { entity_type: 'article', entity_id: 'art-3' },
    };
    expect(getControlRecomputeTargets(signal)).toEqual([
      { kind: 'article_control', entity_ref: signal.entity_ref },
    ]);
  });

  it('dispatchControlInvalidation invokes subscribers with targets', () => {
    const seen: string[] = [];
    const unsub = subscribeControlInvalidation(({ targets }) => {
      seen.push(...targets.map((t) => t.kind));
    });
    const signal: ControlInvalidationSignal = {
      event: ControlInvalidationEventTypes.articleChanged,
      entity_ref: { entity_type: 'article', entity_id: 'x' },
    };
    const returned = dispatchControlInvalidation(signal);
    expect(returned).toHaveLength(1);
    expect(seen).toEqual(['article_control']);
    unsub();
  });

  it('dispatchArticleChanged is article.changed with trimmed id', () => {
    expect(dispatchArticleChanged('  ')).toEqual([]);
    expect(dispatchArticleChanged('art-1')).toEqual([
      { kind: 'article_control', entity_ref: { entity_type: 'article', entity_id: 'art-1' } },
    ]);
  });

  it('dispatchOrderStateChanged is order.state_changed with trimmed id', () => {
    expect(dispatchOrderStateChanged('  ')).toEqual([]);
    expect(dispatchOrderStateChanged('O-1')).toEqual([
      { kind: 'order_control', entity_ref: { entity_type: 'order', entity_id: 'O-1' } },
    ]);
  });

  it('dispatchSampleChanged is sample.changed with trimmed id', () => {
    expect(dispatchSampleChanged('  ')).toEqual([]);
    expect(dispatchSampleChanged('smp-12')).toEqual([
      { kind: 'sample_control', entity_ref: { entity_type: 'sample', entity_id: 'smp-12' } },
    ]);
  });

  it('dispatchCommitmentUpdated is commitment.updated with optional linkage', () => {
    expect(dispatchCommitmentUpdated('  ')).toEqual([]);
    expect(dispatchCommitmentUpdated('cmt-1')).toEqual([
      { kind: 'commitment_control', entity_ref: { entity_type: 'commitment', entity_id: 'cmt-1' } },
    ]);
    expect(
      dispatchCommitmentUpdated('cmt-1', {
        commitment_ref: {
          commitment_id: 'cmt-1',
          related_entity_refs: [{ entity_type: 'article', entity_id: 'art-1' }],
        },
      })
    ).toEqual([
      { kind: 'commitment_control', entity_ref: { entity_type: 'commitment', entity_id: 'cmt-1' } },
      { kind: 'article_control', entity_ref: { entity_type: 'article', entity_id: 'art-1' } },
    ]);
  });
});
