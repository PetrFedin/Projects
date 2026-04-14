/**
 * @jest-environment node
 */
import type { ControlOutput } from '@/lib/contracts';
import { validateControlOutput } from '@/lib/contracts';
import { buildOrderControlOutput } from '@/lib/control-adapters/order-control-output';
import { createSeedState } from '@/lib/brand-production/seed';
import {
  articleControlInputFromArticleEntity,
  buildArticleControlOutput,
} from '@/lib/control-adapters/article-control-output';
import {
  isNotifyableControlCandidate,
  LIST_SUPPRESS_ARTICLE_CONTROL_SIGNALS,
  LIST_SUPPRESS_ORDER_CONTROL_SIGNALS,
  resolveControlSignalVisibility,
  shouldSurfaceControlSignal,
} from '@/lib/control-adapters/control-signal-visibility';

const orderRef = { entity_type: 'order' as const, entity_id: 'risk-only' };

/** Valid snapshot: elevated risk chip only — no deadline / next / blockers. */
function riskOnlyHighOutput(): ControlOutput {
  return {
    entity_ref: orderRef,
    status: 'ok',
    risk: 'high',
    blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
    readiness_summary: {
      dimensions: [{ key: 'commercial', state: 'ready', gap_codes: [] }],
    },
    deadline_pressure: { level: 'none' },
    next_action: null,
    reasons: [{ code: 'UNKNOWN', params: { note: 'test' } }],
    as_of: '2026-01-01T00:00:00Z',
    version: 'test',
  };
}

describe('control-signal-visibility', () => {
  const asOf = '2024-07-20T12:00:00.000Z';

  it('isNotifyableControlCandidate is false for calm reserved order', () => {
    const out = buildOrderControlOutput({
      order_id: 'O1',
      commercial_status: 'Зарезервировано',
      as_of: asOf,
      delivery_date: '2024-09-15',
      payment_status: 'paid',
    });
    expect(validateControlOutput(out).ok).toBe(true);
    expect(isNotifyableControlCandidate(out)).toBe(false);
  });

  it('default preference: same as “allow” for notifyable output', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(isNotifyableControlCandidate(out)).toBe(true);
    expect(shouldSurfaceControlSignal(out, {})).toBe(true);
    expect(shouldSurfaceControlSignal(out)).toBe(true);
  });

  it('muted entity suppresses surface', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(
      shouldSurfaceControlSignal(out, {
        mutedEntityRefs: [{ entity_type: 'order', entity_id: 'O-draft' }],
      })
    ).toBe(false);
  });

  it('followEntityTypes excludes non-matching type', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(
      shouldSurfaceControlSignal(out, {
        followEntityTypes: ['article'],
      })
    ).toBe(false);
    expect(shouldSurfaceControlSignal(out, LIST_SUPPRESS_ORDER_CONTROL_SIGNALS)).toBe(false);
  });

  it('LIST_SUPPRESS_ARTICLE_CONTROL_SIGNALS hides article entity rows', () => {
    const { articles } = createSeedState();
    const art = articles.find((a) => a.id === 'art-2')!;
    const out = buildArticleControlOutput(
      articleControlInputFromArticleEntity(art, '2026-03-15T12:00:00.000Z')
    );
    expect(out.entity_ref.entity_type).toBe('article');
    expect(shouldSurfaceControlSignal(out, LIST_SUPPRESS_ARTICLE_CONTROL_SIGNALS)).toBe(false);
  });

  it('non-candidate returns surface true (no extra suppression)', () => {
    const out = buildOrderControlOutput({
      order_id: 'O1',
      commercial_status: 'Зарезервировано',
      as_of: asOf,
      delivery_date: '2024-09-15',
      payment_status: 'paid',
    });
    expect(
      resolveControlSignalVisibility(out, {
        mutedEntityRefs: [{ entity_type: 'order', entity_id: 'O1' }],
      }).surface
    ).toBe(true);
  });

  it('mutedReasonCodes suppresses when output.reasons intersect', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(out.reasons.some((r) => r.code === 'READINESS_GAP')).toBe(true);
    expect(
      shouldSurfaceControlSignal(out, {
        mutedReasonCodes: ['READINESS_GAP'],
      })
    ).toBe(false);
  });

  it('minRiskLevel applies only to risk-only candidates', () => {
    const ro = riskOnlyHighOutput();
    expect(validateControlOutput(ro).ok).toBe(true);
    expect(isNotifyableControlCandidate(ro)).toBe(true);
    expect(shouldSurfaceControlSignal(ro, { minRiskLevel: 'high' })).toBe(true);
    expect(shouldSurfaceControlSignal(ro, { minRiskLevel: 'severe' })).toBe(false);

    const draft = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(shouldSurfaceControlSignal(draft, { minRiskLevel: 'severe' })).toBe(true);
  });

  it('ownedOnly fails open without isEntityOwned', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(shouldSurfaceControlSignal(out, { ownedOnly: true })).toBe(true);
  });

  it('ownedOnly suppresses when not owned', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    expect(
      shouldSurfaceControlSignal(
        out,
        { ownedOnly: true },
        {
          isEntityOwned: () => false,
        }
      )
    ).toBe(false);
  });

  it('resolveControlSignalVisibility does not mutate ControlOutput', () => {
    const out = buildOrderControlOutput({
      order_id: 'O-draft',
      commercial_status: 'Черновик',
      as_of: asOf,
      delivery_date: '2024-09-20',
    });
    const frozen = JSON.stringify(out);
    resolveControlSignalVisibility(out, LIST_SUPPRESS_ORDER_CONTROL_SIGNALS);
    resolveControlSignalVisibility(out, {
      mutedEntityRefs: [{ entity_type: 'order', entity_id: 'O-draft' }],
      mutedReasonCodes: ['READINESS_GAP'],
    });
    expect(JSON.stringify(out)).toBe(frozen);
  });
});
