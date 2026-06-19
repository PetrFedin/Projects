import type { ReplenishmentStockRow } from '@/lib/platform/shop-replenishment-stock-atp';

export type IntakeAllocationPayload = {
  batch: {
    batchId: string;
    items: Array<{ articleId: string; size: string; quantity: number }>;
  };
  demand: {
    b2bBackorders: Array<{
      orderId?: string;
      articleId: string;
      size: string;
      requestedQuantity: number;
    }>;
    ecomDemand: Array<{
      orderId?: string;
      storeId?: string;
      articleId: string;
      size: string;
      requestedQuantity: number;
    }>;
    retailDemand: Array<{
      orderId?: string;
      storeId?: string;
      articleId: string;
      size: string;
      requestedQuantity: number;
    }>;
  };
};

export type IntakeAllocationResult = {
  planId?: string;
  persistMode?: string;
  messageRu?: string;
  allocations?: Array<{ destinationType: string; allocatedQuantity: number }>;
  unallocated?: Array<{ quantity: number }>;
};

export function parseReplenishmentSkuToAllocationParts(sku: string): {
  articleId: string;
  size: string;
} {
  const parts = sku.split('-');
  if (parts.length >= 2) {
    const last = parts[parts.length - 1] ?? '';
    if (/^(XXS|XS|S|M|L|XL|XXL|\d{2})$/i.test(last)) {
      return { articleId: parts.slice(0, -1).join('-'), size: last.toUpperCase() };
    }
  }
  return { articleId: sku, size: 'M' };
}

/** Build intake batch × B2B backorder demand from Stock·ATP rows (replenishment tab). */
export function buildIntakeAllocationPayloadFromAtpRows(input: {
  rows: ReplenishmentStockRow[];
  batchId: string;
  orderId: string;
}): IntakeAllocationPayload {
  const batchItems = input.rows
    .filter((row) => row.inTransit > 0)
    .map((row) => {
      const { articleId, size } = parseReplenishmentSkuToAllocationParts(row.sku);
      return { articleId, size, quantity: row.inTransit };
    });

  const b2bBackorders = input.rows
    .filter((row) => row.atp < 5)
    .map((row) => {
      const { articleId, size } = parseReplenishmentSkuToAllocationParts(row.sku);
      return {
        orderId: input.orderId,
        articleId,
        size,
        requestedQuantity: Math.max(5 - row.atp, 1),
      };
    });

  const fallbackBatch =
    batchItems.length > 0
      ? batchItems
      : input.rows.slice(0, 4).map((row) => {
          const { articleId, size } = parseReplenishmentSkuToAllocationParts(row.sku);
          return { articleId, size, quantity: Math.max(row.onHand, 1) };
        });

  const fallbackDemand =
    b2bBackorders.length > 0
      ? b2bBackorders
      : [
          {
            orderId: input.orderId,
            articleId: 'demo-ss27-01',
            size: 'M',
            requestedQuantity: 2,
          },
        ];

  return {
    batch: { batchId: input.batchId, items: fallbackBatch },
    demand: {
      b2bBackorders: fallbackDemand,
      ecomDemand: [],
      retailDemand: [],
    },
  };
}

export async function postB2bIntakeAllocation(
  payload: IntakeAllocationPayload
): Promise<IntakeAllocationResult> {
  const res = await fetch('/api/b2b/intake/allocate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as IntakeAllocationResult & { error?: string };
  if (!res.ok) {
    throw new Error(json.error ?? json.messageRu ?? `allocate ${res.status}`);
  }
  return json;
}
