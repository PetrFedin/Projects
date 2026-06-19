import type {
  BrandProductionCutTicketRow,
  BrandProductionCutTicketStatus,
} from '@/lib/brand-production/cut-tickets';
import { labelBrandProductionCutTicketStatusRu } from '@/lib/brand-production/cut-tickets';

export type BrandProductionCutTicketPgPayload = {
  poId?: string;
  poCode?: string;
  sku?: string;
  articleName?: string;
  factoryName?: string;
  sizeSummary?: string;
  targetCutDate?: string;
  brandStatus?: BrandProductionCutTicketStatus;
  b2bOrderId?: string;
  lifecycleLabel?: string;
  source?: string;
};

export type BrandProductionCutTicketPgRow = BrandProductionCutTicketRow & {
  ticketNo: string;
  storageKey: string;
};

export function brandProductionCutTicketPgToRow(input: {
  id: string;
  collectionId: string;
  articleId: string;
  ticketNo: string;
  qty: number;
  w2Status: string;
  payload: BrandProductionCutTicketPgPayload;
}): BrandProductionCutTicketPgRow {
  const payload = input.payload ?? {};
  const brandStatus =
    payload.brandStatus ??
    (input.w2Status === 'cut'
      ? 'issued'
      : input.w2Status === 'issued'
        ? 'in_wip'
        : input.w2Status === 'cancelled'
          ? 'draft'
          : 'ready');

  return {
    id: input.id,
    storageKey: input.id,
    ticketNo: input.ticketNo,
    poId: payload.poId ?? input.id,
    poCode: payload.poCode ?? input.ticketNo,
    articleId: input.articleId,
    sku: payload.sku ?? input.articleId,
    articleName: payload.articleName ?? input.articleId,
    factoryName: payload.factoryName ?? '—',
    totalQty: input.qty,
    sizeSummary: payload.sizeSummary ?? '',
    targetCutDate: payload.targetCutDate,
    status: brandStatus,
    lifecycleLabel: payload.lifecycleLabel ?? labelBrandProductionCutTicketStatusRu(brandStatus),
  };
}

export function brandProductionCutTicketRowToPgPayload(
  row: BrandProductionCutTicketRow,
  b2bOrderId?: string
): BrandProductionCutTicketPgPayload {
  return {
    poId: row.poId,
    poCode: row.poCode,
    sku: row.sku,
    articleName: row.articleName,
    factoryName: row.factoryName,
    sizeSummary: row.sizeSummary,
    targetCutDate: row.targetCutDate,
    brandStatus: row.status,
    b2bOrderId: b2bOrderId?.trim() || undefined,
    lifecycleLabel: row.lifecycleLabel,
    source: 'brand_ops_sync',
  };
}

export function mapBrandCutTicketStatusToW2(
  status: BrandProductionCutTicketStatus
): 'draft' | 'issued' | 'cut' | 'cancelled' {
  if (status === 'issued') return 'cut';
  if (status === 'in_wip') return 'issued';
  if (status === 'draft') return 'draft';
  return 'draft';
}
