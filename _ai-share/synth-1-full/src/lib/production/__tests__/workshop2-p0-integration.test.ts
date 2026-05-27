/**
 * P0 integration: gate messages, PLM retry badge, sample-order failure copy.
 */
import {
  formatWorkshop2GateChecksForUi,
  parseWorkshop2ApiGateChecksFromJson,
} from '@/lib/production/workshop2-api-gate-messages';
import { describeWorkshop2CreateSampleOrderFailure } from '@/lib/production/workshop2-sample-api-client';
import { formatWorkshop2PlmOutboxBadge } from '@/lib/production/workshop2-plm-outbox-badge';

describe('workshop2 P0 — API gate messages', () => {
  it('parses checks array from 409 JSON body', () => {
    const checks = parseWorkshop2ApiGateChecksFromJson({
      error: 'handoff_not_ready',
      checks: [
        { id: 'lab_dip', severity: 'blocker', messageRu: 'Нет lab dip' },
        { id: 'vault', severity: 'warning', messageRu: 'Vault пуст' },
      ],
    });
    expect(checks).toHaveLength(2);
    expect(checks[0]?.messageRu).toBe('Нет lab dip');
  });

  it('formats blockers before warnings for UI toast', () => {
    const text = formatWorkshop2GateChecksForUi(
      [
        { severity: 'warning', messageRu: 'Предупреждение' },
        { severity: 'blocker', messageRu: 'Блокер A' },
        { severity: 'blocker', messageRu: 'Блокер B' },
      ],
      'fallback'
    );
    expect(text).toContain('Блокер A');
    expect(text).not.toContain('Предупреждение');
  });

  it('uses fallback when checks empty', () => {
    expect(formatWorkshop2GateChecksForUi([], 'Сообщение сервера')).toBe('Сообщение сервера');
  });
});

describe('workshop2 P0 — sample order failure copy', () => {
  it('describeWorkshop2CreateSampleOrderFailure joins gate checks', () => {
    const msg = describeWorkshop2CreateSampleOrderFailure({
      ok: false,
      status: 409,
      checks: [{ severity: 'blocker', messageRu: 'CR не подписан' }],
    });
    expect(msg).toBe('CR не подписан');
  });
});

describe('workshop2 P0 — PLM retry badge', () => {
  it('shows retry when failed without pending queue', () => {
    const badge = formatWorkshop2PlmOutboxBadge({
      pending: 0,
      awaitingAck: 0,
      failed: 3,
    });
    expect(badge.showRetryFailedButton).toBe(true);
    expect(badge.showProcessButton).toBe(false);
    expect(badge.tone).toBe('failed');
  });

  it('shows retry alongside process when failed and pending', () => {
    const badge = formatWorkshop2PlmOutboxBadge({
      pending: 2,
      awaitingAck: 0,
      failed: 1,
    });
    expect(badge.showRetryFailedButton).toBe(true);
    expect(badge.showProcessButton).toBe(true);
    expect(badge.labelRu).toContain('fail');
  });
});
