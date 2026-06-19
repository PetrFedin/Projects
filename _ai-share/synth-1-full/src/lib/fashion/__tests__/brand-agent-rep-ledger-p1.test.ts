import {
  mapWorkshop2PayoutStatusToCommissionStatus,
  workshop2B2bCommissionLineToRecord,
  workshop2B2bCommissionLinesToRecords,
} from '@/lib/fashion/brand-agent-rep-ledger-map';
import type { Workshop2B2bCommissionLine } from '@/lib/production/workshop2-b2b-commission';
import {
  clearWorkshop2B2bCommissionMemoryForTests,
  listWorkshop2B2bCommissionLinesForOrganization,
  upsertWorkshop2B2bCommissionLineOnOrderSubmit,
} from '@/lib/server/workshop2-b2b-commission-repository';

describe('brand-agent-rep-ledger-map', () => {
  const line: Workshop2B2bCommissionLine = {
    id: 'c1',
    orderId: 'B2B-SS27-001',
    repId: 'rep-anna',
    orderTotalRub: 1_000_000,
    commissionPct: 5,
    commissionRub: 50_000,
    attributedAt: '2026-05-20T10:00:00.000Z',
    payoutStatus: 'accrued',
  };

  it('maps payout_status to commission status', () => {
    expect(mapWorkshop2PayoutStatusToCommissionStatus('accrued')).toBe('pending');
    expect(mapWorkshop2PayoutStatusToCommissionStatus('payout_pending')).toBe('approved');
    expect(mapWorkshop2PayoutStatusToCommissionStatus('paid')).toBe('paid');
  });

  it('maps PG line to CommissionRecord', () => {
    const record = workshop2B2bCommissionLineToRecord(line);
    expect(record.subAgentId).toBe('rep-anna');
    expect(record.orderIds).toEqual(['B2B-SS27-001']);
    expect(record.period).toBe('2026-05');
    expect(record.status).toBe('pending');
  });

  it('maps multiple lines', () => {
    expect(workshop2B2bCommissionLinesToRecords([line, line]).length).toBe(2);
  });
});

describe('workshop2-b2b-commission-repository P1', () => {
  beforeEach(() => {
    clearWorkshop2B2bCommissionMemoryForTests();
  });

  it('upserts commission line by order id', async () => {
    const line = {
      orderId: 'ORD-UPSERT-1',
      repId: 'rep-anna',
      orderTotalRub: 500_000,
      commissionPct: 5,
      commissionRub: 25_000,
      attributedAt: new Date().toISOString(),
    };
    const first = await upsertWorkshop2B2bCommissionLineOnOrderSubmit({ line });
    expect(first.persisted).toBe(true);

    const updated = await upsertWorkshop2B2bCommissionLineOnOrderSubmit({
      line: { ...line, commissionRub: 30_000 },
    });
    expect(updated.persisted).toBe(true);

    const rows = await listWorkshop2B2bCommissionLinesForOrganization({
      repId: 'rep-anna',
      seedIfEmpty: false,
    });
    const match = rows.find((r) => r.orderId === 'ORD-UPSERT-1');
    expect(match?.commissionRub).toBe(30_000);
  });

  it('seeds commission lines when empty', async () => {
    const rows = await listWorkshop2B2bCommissionLinesForOrganization({ seedIfEmpty: true });
    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows.some((r) => r.repId === 'rep-anna')).toBe(true);
  });
});
