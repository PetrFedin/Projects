/**
 * @jest-environment node
 */
import { validateControlOutput } from '@/lib/contracts';
import { createSeedState } from '@/lib/brand-production/seed';
import {
  articleControlInputFromArticleEntity,
  buildArticleControlOutput,
  mapArticleDeadlinePressure,
} from '@/lib/control-adapters/article-control-output';

describe('article-control-output adapter', () => {
  const as_of = '2026-03-15T12:00:00.000Z';
  const { articles } = createSeedState();

  it('maps seed article b2b-ready to valid ControlOutput', () => {
    const art = articles.find((a) => a.id === 'art-3')!;
    const input = articleControlInputFromArticleEntity(art, as_of);
    const out = buildArticleControlOutput(input);
    expect(out.entity_ref.entity_type).toBe('article');
    expect(out.entity_ref.entity_id).toBe('art-3');
    expect(out.status).toBe('ok');
    expect(out.blocker_summary.count).toBe(0);
    expect(out.next_action).toBeNull();
    expect(validateControlOutput(out).ok).toBe(true);
  });

  it('samples without gold → attention + sample readiness gap + derived blocker/next', () => {
    const art = articles.find((a) => a.id === 'art-2')!;
    const out = buildArticleControlOutput(articleControlInputFromArticleEntity(art, as_of));
    expect(out.status).toBe('attention');
    expect(out.risk).toBe('medium');
    expect(out.reasons.some((r) => r.code === 'SAMPLE_NOT_APPROVED')).toBe(true);
    expect(out.blocker_summary.count).toBeGreaterThanOrEqual(1);
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'article.derive.approve_sample',
    });
    const sampleDim = out.readiness_summary.dimensions.find((d) => d.key === 'sample_gate');
    expect(sampleDim?.state).toBe('not_ready');
  });

  it('manufacturing with gold, not b2b-ready → ok (release gate not active until warehouse/b2b_ready)', () => {
    const art = articles.find((a) => a.id === 'art-1')!;
    const out = buildArticleControlOutput(articleControlInputFromArticleEntity(art, as_of));
    expect(out.status).toBe('ok');
    expect(out.risk).toBe('low');
  });

  it('warehouse stage without b2b_ready → attention + b2b derivation', () => {
    const art = articles.find((a) => a.id === 'art-1')!;
    const input = articleControlInputFromArticleEntity(
      { ...art, lifecycleStage: 'warehouse' },
      as_of
    );
    const out = buildArticleControlOutput(input);
    expect(out.status).toBe('attention');
    expect(out.reasons.some((r) => r.params?.dimension === 'b2b')).toBe(true);
    expect(out.blocker_summary.top_blocker_ids.some((id) => id.includes('b2b_not_ready'))).toBe(
      true
    );
    expect(out.next_action?.source).toEqual({
      kind: 'derived',
      rule_id: 'article.derive.complete_b2b_release',
    });
  });

  it('explicit next_action null skips derivation', () => {
    const art = articles.find((a) => a.id === 'art-2')!;
    const input = {
      ...articleControlInputFromArticleEntity(art, as_of),
      next_action: null as const,
    };
    const out = buildArticleControlOutput(input);
    expect(out.next_action).toBeNull();
    expect(out.blocker_summary.count).toBeGreaterThanOrEqual(1);
  });

  it('deadline_pressure is always present', () => {
    const out = buildArticleControlOutput({
      article_id: 'x',
      lifecycle_stage: 'concept',
      gold_sample_approved: false,
      b2b_ready: false,
      linesheet_ready: false,
      as_of,
    });
    expect(out.deadline_pressure.level).toBe('none');
  });

  it('mapArticleDeadlinePressure uses earlier of two YMD targets', () => {
    expect(
      mapArticleDeadlinePressure('2026-06-01', '2026-05-10', '2026-03-15T00:00:00Z')
        .next_deadline_at
    ).toBe('2026-05-10');
  });

  it('rejects empty article_id', () => {
    expect(() =>
      buildArticleControlOutput({
        article_id: '',
        lifecycle_stage: 'concept',
        gold_sample_approved: false,
        b2b_ready: false,
        linesheet_ready: false,
        as_of,
      })
    ).toThrow(/article_id/);
  });
});
