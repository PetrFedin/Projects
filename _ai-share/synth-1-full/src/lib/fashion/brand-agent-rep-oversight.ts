import type { CommissionRecord } from '@/lib/distributor/sub-agent-commission';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { ROUTES } from '@/lib/routes';

export function summarizeBrandAgentRepLedger(records: readonly CommissionRecord[]): {
  total: number;
  pending: number;
  approved: number;
  paid: number;
  commissionRub: number;
} {
  const pending = records.filter((r) => r.status === 'pending').length;
  const approved = records.filter((r) => r.status === 'approved').length;
  const paid = records.filter((r) => r.status === 'paid').length;
  const commissionRub = records.reduce((sum, r) => sum + r.commissionRub, 0);
  return { total: records.length, pending, approved, paid, commissionRub };
}

export function brandAgentRepShopPortalHref(): string {
  return `${ROUTES.shop.b2bSalesRepPortal}?${PILLAR_CAPABILITY_FEATURE_PARAM}=portal`;
}

export function brandAgentRepShopCommissionHref(): string {
  return `${ROUTES.shop.b2bSalesRepPortal}?${PILLAR_CAPABILITY_FEATURE_PARAM}=commission`;
}

export function brandAgentRepLedgerHref(): string {
  return `${ROUTES.brand.distributor.commissions}?${PILLAR_CAPABILITY_FEATURE_PARAM}=ledger`;
}

export function listBrandAgentRepNames(records: readonly CommissionRecord[]): string[] {
  return [...new Set(records.map((r) => r.subAgentName))];
}
