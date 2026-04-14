import {
  computeAggregates,
  isPilotSnapshotPayload,
  normalizePilotRows,
  pilotRepresentativenessWarnings,
  recommendScale,
  sampleLinkedArticleId,
  type PilotSnapshotPayload,
} from '@/lib/pilot-control-report';

const minimalPayload = {
  meta: { as_of: '2026-04-09T12:00:00.000Z' },
  articles: [],
  orders: [],
  commitments: [],
  samples: [],
};

describe('pilot-control-report', () => {
  it('isPilotSnapshotPayload validates shape', () => {
    expect(isPilotSnapshotPayload(minimalPayload)).toBe(true);
    expect(isPilotSnapshotPayload({})).toBe(false);
  });

  it('sampleLinkedArticleId reads article_id from reasons', () => {
    const control = {
      reasons: [{ code: 'X', params: { article_id: 'art-2' } }],
    };
    expect(sampleLinkedArticleId(control)).toBe('art-2');
  });

  it('normalizes one row per kind and flags noise pattern', () => {
    const payload = {
      meta: { as_of: '2026-04-09T12:00:00.000Z' },
      articles: [],
      orders: [
        {
          kind: 'order',
          id: 'ord-noise',
          control: {
            entity_ref: { entity_type: 'order', entity_id: 'ord-noise', label: 'L' },
            status: 'ok',
            risk: 'medium',
            deadline_pressure: { level: 'overdue', next_deadline_at: '2024-01-01' },
            next_action: null,
          },
          presentation: {
            next_action_line: null,
            signal_surface_visible: true,
          },
        },
      ],
      commitments: [],
      samples: [],
    };
    const rows = normalizePilotRows(payload);
    expect(rows).toHaveLength(1);
    expect(rows[0]!.noise_candidate).toBe('yes');
    expect(rows[0]!.next_action).toBe('—');
  });

  it('recommendScale returns recalibrate when only noise', () => {
    const agg = {
      total_entities: 5,
      by_kind: { order: 5 },
      surface_visible_true: 5,
      surface_visible_false: 0,
      by_risk: { medium: 5 },
      by_deadline_level: { overdue: 5 },
      with_next_action: 0,
      without_next_action: 5,
      commitment_cue_true: 0,
      noise_candidates: 2,
      strong_signal_candidates: 0,
      duplicate_action_candidates: 0,
    };
    expect(recommendScale(agg).verdict).toBe('recalibrate_first');
  });

  it('pilotRepresentativenessWarnings flags tiny snapshot', () => {
    const tiny: PilotSnapshotPayload = {
      meta: { as_of: '2026-04-09T12:00:00.000Z' },
      articles: [{ kind: 'article', id: 'a', control: {}, presentation: {} }],
      orders: [],
      commitments: [],
      samples: [],
    };
    expect(pilotRepresentativenessWarnings(tiny).length).toBeGreaterThan(0);
  });

  it('aggregates count kinds', () => {
    const payload = {
      meta: { as_of: '2026-04-09T12:00:00.000Z' },
      articles: [
        {
          kind: 'article',
          id: 'a1',
          control: {
            entity_ref: { label: 'A' },
            status: 'ok',
            risk: 'low',
            deadline_pressure: { level: 'none' },
          },
          presentation: { signal_surface_visible: false },
        },
      ],
      orders: [],
      commitments: [],
      samples: [],
    };
    const agg = computeAggregates(normalizePilotRows(payload));
    expect(agg.by_kind.article).toBe(1);
    expect(agg.total_entities).toBe(1);
  });
});
