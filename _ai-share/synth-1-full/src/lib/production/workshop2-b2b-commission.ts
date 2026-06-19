/**
 * Wave 4 P1: commission engine stub — % от order total по rep attribution.
 */
export type Workshop2B2bCommissionPayoutStatus = 'accrued' | 'payout_pending' | 'paid';

export type Workshop2B2bCommissionLine = {
  id?: string;
  orderId: string;
  repId: string;
  orderTotalRub: number;
  commissionPct: number;
  commissionRub: number;
  attributedAt: string;
  customerName?: string;
  payoutStatus?: Workshop2B2bCommissionPayoutStatus;
};

const DEMO_COMMISSION_PCT = 5;

const DEMO_ORDERS: Workshop2B2bCommissionLine[] = [
  {
    orderId: 'B2B-SS27-001',
    repId: 'rep-anna',
    orderTotalRub: 1_250_000,
    commissionPct: DEMO_COMMISSION_PCT,
    commissionRub: 62_500,
    attributedAt: '2026-05-20T10:00:00.000Z',
    customerName: 'Demo Retail MOW',
  },
  {
    orderId: 'B2B-SS27-002',
    repId: 'rep-anna',
    orderTotalRub: 480_000,
    commissionPct: DEMO_COMMISSION_PCT,
    commissionRub: 24_000,
    attributedAt: '2026-05-22T14:30:00.000Z',
    customerName: 'Demo Retail SPB',
  },
  {
    orderId: 'B2B-SS27-003',
    repId: 'rep-ivan',
    orderTotalRub: 920_000,
    commissionPct: DEMO_COMMISSION_PCT,
    commissionRub: 46_000,
    attributedAt: '2026-05-21T09:15:00.000Z',
    customerName: 'Demo KZ',
  },
];

export function resolveWorkshop2B2bCommissionPct(env?: Record<string, string | undefined>): number {
  const raw = String(
    env?.WORKSHOP2_B2B_COMMISSION_PCT ?? process.env.WORKSHOP2_B2B_COMMISSION_PCT ?? ''
  ).trim();
  const n = raw ? Number(raw) : DEMO_COMMISSION_PCT;
  return Number.isFinite(n) && n >= 0 ? n : DEMO_COMMISSION_PCT;
}

export function calculateWorkshop2B2bCommission(input: {
  orderTotalRub: number;
  repId: string;
  orderId: string;
  commissionPct?: number;
  customerName?: string;
  attributedAt?: string;
}): Workshop2B2bCommissionLine {
  const pct = input.commissionPct ?? DEMO_COMMISSION_PCT;
  const commissionRub = Math.round((input.orderTotalRub * pct) / 100);
  return {
    orderId: input.orderId,
    repId: input.repId.trim(),
    orderTotalRub: input.orderTotalRub,
    commissionPct: pct,
    commissionRub,
    attributedAt: input.attributedAt ?? new Date().toISOString(),
    customerName: input.customerName,
  };
}

export function listWorkshop2B2bCommissionsForRep(input: {
  repId: string;
  lines?: Workshop2B2bCommissionLine[];
}): {
  repId: string;
  lines: Workshop2B2bCommissionLine[];
  totalCommissionRub: number;
  orderCount: number;
} {
  const id = input.repId.trim();
  const lines = (input.lines ?? DEMO_ORDERS).filter((l) => l.repId === id);
  const totalCommissionRub = lines.reduce((acc, l) => acc + l.commissionRub, 0);
  return { repId: id, lines, totalCommissionRub, orderCount: lines.length };
}
