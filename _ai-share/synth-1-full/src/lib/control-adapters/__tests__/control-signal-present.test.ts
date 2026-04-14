import {
  commitmentOperationalCueVisible,
  formatControlActionOwnerLabel,
  formatControlNextActionLine,
  formatControlNextActionLineWithOwner,
  formatControlCommitmentQuietNextHint,
  formatControlOrderQuietNextHint,
  formatControlPresentationNextLine,
  formatControlPresentationNextLineWithOwner,
  formatSampleNextLineDelegatedToArticle,
} from '@/lib/control-adapters/control-signal-present';
import type { ControlOutput } from '@/lib/contracts';
import type { NextAction } from '@/lib/contracts';

function na(
  partial: Partial<NextAction> & Pick<NextAction, 'entity_ref' | 'action_type'>
): NextAction {
  return {
    action_id: 't',
    reason: [{ code: 'UNKNOWN', params: {} }],
    owner: { role: 'brand_ops' },
    source: { kind: 'derived', rule_id: 'x' },
    status: 'open',
    explainability: { rule_id: 'x' },
    ...partial,
  } as NextAction;
}

describe('control-signal-present', () => {
  it('formatControlActionOwnerLabel maps buckets and null for unknown', () => {
    expect(formatControlActionOwnerLabel('finance')).toBe('Финансы');
    expect(formatControlActionOwnerLabel('production')).toBe('Производство');
    expect(formatControlActionOwnerLabel('sales')).toBe('Продажи');
    expect(formatControlActionOwnerLabel('product')).toBe('Продукт');
    expect(formatControlActionOwnerLabel('unknown')).toBeNull();
  });

  it('formatControlNextActionLineWithOwner appends owner when mapped', () => {
    expect(
      formatControlNextActionLineWithOwner(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'OTHER',
          source: { kind: 'derived', rule_id: 'order.derive.request_payment' },
        })
      )
    ).toBe('Запросить оплату · Финансы');
    expect(
      formatControlNextActionLineWithOwner(
        na({
          entity_ref: { entity_type: 'commitment', entity_id: 'c1' },
          action_type: 'FOLLOW_UP_COMMITMENT',
          source: { kind: 'derived', rule_id: 'commitment.derive.follow_up_overdue' },
        })
      )
    ).toBe('Проверить исполнение · Производство');
  });

  it('formatControlNextActionLineWithOwner omits label when owner unknown', () => {
    expect(
      formatControlNextActionLineWithOwner(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'OTHER',
          source: { kind: 'derived', rule_id: 'order.approval.v1' },
        })
      )
    ).toBeNull();
  });

  it('disambiguates SUBMIT_APPROVAL by entity_ref', () => {
    expect(
      formatControlNextActionLine(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'unknown' },
        })
      )
    ).toBe('Проверить заказ');

    expect(
      formatControlNextActionLine(
        na({
          entity_ref: { entity_type: 'article', entity_id: 'a1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'unknown' },
        })
      )
    ).toBe('Утвердить сэмпл');

    expect(
      formatControlNextActionLine(
        na({
          entity_ref: { entity_type: 'sample', entity_id: 's1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'unknown' },
        })
      )
    ).toBe('Утвердить сэмпл');
  });

  it('maps order.derive.attention_review', () => {
    expect(
      formatControlNextActionLine(
        na({
          entity_ref: { entity_type: 'order', entity_id: 'o1' },
          action_type: 'OTHER',
          source: { kind: 'derived', rule_id: 'order.derive.attention_review' },
        })
      )
    ).toBe('Разобрать заказ');
  });

  it('commitmentOperationalCueVisible hides soft upcoming+medium with no chip and no next', () => {
    const control = {
      entity_ref: { entity_type: 'commitment' as const, entity_id: 'c1' },
      status: 'attention',
      risk: 'medium',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'upcoming', next_deadline_at: '2026-04-11' },
      next_action: null,
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(commitmentOperationalCueVisible(control)).toBe(false);
  });

  it('maps sample.derive.approve_sample', () => {
    expect(
      formatControlNextActionLine(
        na({
          entity_ref: { entity_type: 'sample', entity_id: 's1' },
          action_type: 'SUBMIT_APPROVAL',
          source: { kind: 'derived', rule_id: 'sample.derive.approve_sample' },
        })
      )
    ).toBe('Утвердить сэмпл');
  });

  it('formatControlOrderQuietNextHint surfaces when order has pressure but no next_action', () => {
    const control = {
      entity_ref: { entity_type: 'order' as const, entity_id: 'o1' },
      status: 'attention',
      risk: 'medium',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'overdue', next_deadline_at: '2024-01-01' },
      next_action: null,
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(formatControlOrderQuietNextHint(control)).toBe('Нет автоматического next · мониторинг');
  });

  it('formatControlOrderQuietNextHint is null when next exists or entity is not order', () => {
    const withNext = {
      entity_ref: { entity_type: 'order' as const, entity_id: 'o1' },
      status: 'ok',
      risk: 'low',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'none' },
      next_action: na({
        entity_ref: { entity_type: 'order', entity_id: 'o1' },
        action_type: 'OTHER',
        source: { kind: 'derived', rule_id: 'order.derive.submit_order' },
      }),
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(formatControlOrderQuietNextHint(withNext)).toBeNull();

    const article = {
      ...withNext,
      entity_ref: { entity_type: 'article' as const, entity_id: 'a1' },
      next_action: null,
    };
    expect(formatControlOrderQuietNextHint(article)).toBeNull();
  });

  it('formatControlCommitmentQuietNextHint when commitment surfaces but has no next_action', () => {
    const control = {
      entity_ref: { entity_type: 'commitment' as const, entity_id: 'c1' },
      status: 'attention',
      risk: 'medium',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'overdue', next_deadline_at: '2024-01-01' },
      next_action: null,
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(formatControlCommitmentQuietNextHint(control)).toBe(
      'Нет автоматического next · мониторинг'
    );
  });

  it('formatControlCommitmentQuietNextHint null for non-commitment or when next exists', () => {
    const order = {
      entity_ref: { entity_type: 'order' as const, entity_id: 'o1' },
      status: 'ok',
      risk: 'low',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'overdue', next_deadline_at: '2024-01-01' },
      next_action: null,
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(formatControlCommitmentQuietNextHint(order)).toBeNull();
  });

  it('formatSampleNextLineDelegatedToArticle points to article when both carry approve-sample', () => {
    const articleNa = na({
      entity_ref: { entity_type: 'article', entity_id: 'a1' },
      action_type: 'SUBMIT_APPROVAL',
      source: { kind: 'derived', rule_id: 'article.derive.approve_sample' },
    });
    const sampleNa = na({
      entity_ref: { entity_type: 'sample', entity_id: 's1' },
      action_type: 'SUBMIT_APPROVAL',
      source: { kind: 'derived', rule_id: 'sample.derive.approve_sample' },
    });
    const articleCtrl = {
      entity_ref: { entity_type: 'article' as const, entity_id: 'a1' },
      next_action: articleNa,
    } as ControlOutput;
    const sampleCtrl = {
      entity_ref: { entity_type: 'sample' as const, entity_id: 's1' },
      next_action: sampleNa,
    } as ControlOutput;
    expect(formatSampleNextLineDelegatedToArticle(sampleCtrl, articleCtrl, 'a1')).toBe(
      'См. артикул · a1'
    );
    expect(formatSampleNextLineDelegatedToArticle(sampleCtrl, articleCtrl, undefined)).toBe(
      'Утвердить сэмпл'
    );
  });

  it('formatControlPresentationNextLine matches next or order quiet hint', () => {
    const orderQuiet = {
      entity_ref: { entity_type: 'order' as const, entity_id: 'o1' },
      status: 'attention',
      risk: 'medium',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'overdue', next_deadline_at: '2024-01-01' },
      next_action: null,
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(formatControlPresentationNextLine(orderQuiet)).toBe(
      'Нет автоматического next · мониторинг'
    );
    expect(formatControlPresentationNextLineWithOwner(orderQuiet)).toBe(
      'Нет автоматического next · мониторинг'
    );

    const commitmentQuiet = {
      entity_ref: { entity_type: 'commitment' as const, entity_id: 'c1' },
      status: 'attention',
      risk: 'medium',
      blocker_summary: { count: 0, highest_severity: 'info', top_blocker_ids: [] },
      readiness_summary: { dimensions: [] },
      deadline_pressure: { level: 'overdue', next_deadline_at: '2024-01-01' },
      next_action: null,
      reasons: [],
      as_of: '2026-04-09T12:00:00.000Z',
      version: 't',
    } as ControlOutput;
    expect(formatControlPresentationNextLine(commitmentQuiet)).toBe(
      'Нет автоматического next · мониторинг'
    );
    expect(formatControlPresentationNextLineWithOwner(commitmentQuiet)).toBe(
      'Нет автоматического next · мониторинг'
    );
  });
});
