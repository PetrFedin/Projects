import {
  ERP_AUTO_RETRY_BASE_MS,
  erpAutoRetryDelayMs,
  formatErpAutoRetryCountdownRu,
  formatErpAutoRetryExhaustedRu,
  pickEarliestErpNextRetryAt,
  summarizeFactoryErpAttentionRu,
} from '@/lib/production/workshop2-erp-retry-hint';

describe('workshop2-erp-retry-hint', () => {
  it('backoff delays grow exponentially', () => {
    expect(erpAutoRetryDelayMs(0)).toBe(ERP_AUTO_RETRY_BASE_MS);
    expect(erpAutoRetryDelayMs(1)).toBe(ERP_AUTO_RETRY_BASE_MS * 2);
    expect(erpAutoRetryDelayMs(2)).toBe(ERP_AUTO_RETRY_BASE_MS * 4);
  });

  it('countdown shows seconds under one minute', () => {
    const now = Date.parse('2026-06-12T12:00:00.000Z');
    const iso = new Date(now + 45_000).toISOString();
    expect(formatErpAutoRetryCountdownRu(iso, now)).toBe('Автоповтор ERP через 45 с');
  });

  it('countdown shows «сейчас» when due', () => {
    const now = Date.parse('2026-06-12T12:00:00.000Z');
    expect(formatErpAutoRetryCountdownRu(new Date(now - 1).toISOString(), now)).toBe(
      'Автоповтор ERP — сейчас'
    );
  });

  it('exhausted copy at max attempts', () => {
    expect(formatErpAutoRetryExhaustedRu(3)).toContain('исчерпаны');
    expect(formatErpAutoRetryExhaustedRu(2)).toBeNull();
  });

  it('picks earliest retry timestamp', () => {
    const a = '2026-06-12T12:05:00.000Z';
    const b = '2026-06-12T12:02:00.000Z';
    expect(pickEarliestErpNextRetryAt([a, b])).toBe(b);
  });

  it('summarizes factory ERP attention buckets', () => {
    expect(
      summarizeFactoryErpAttentionRu({ errorCount: 1, journalOnlyCount: 2, pendingCount: 0 })
    ).toContain('ошибка live ERP');
    expect(
      summarizeFactoryErpAttentionRu({ errorCount: 0, journalOnlyCount: 1, pendingCount: 0 })
    ).toContain('журнал');
  });
});
