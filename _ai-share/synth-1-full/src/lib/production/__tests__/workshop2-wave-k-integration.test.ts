/** @jest-environment node */

import { B2BPriorityStrategy } from '@/lib/b2b/allocation/allocation-engine';
import {
  buildIntakeAllocationPayloadFromAtpRows,
  parseReplenishmentSkuToAllocationParts,
} from '@/lib/b2b/intake-allocation-client';
import { buildShopReplenishmentStockRows } from '@/lib/platform/shop-replenishment-stock-atp';
import {
  buildWorkshop2B2bFashionCloudDraftOrder,
  parseWorkshop2B2bFashionCloudWebhookBody,
} from '@/lib/production/workshop2-b2b-fashion-cloud-inbound';
import {
  getLatestB2bIntakeAllocationPlan,
  persistB2bIntakeAllocationPlan,
} from '@/lib/server/b2b-intake-allocation-repository';

describe('workshop2-b2b-fashion-cloud-inbound', () => {
  it('parses order webhook body', () => {
    const payload = parseWorkshop2B2bFashionCloudWebhookBody({
      type: 'order.created',
      order: {
        id: 'FC-9001',
        lines: [{ articleId: 'demo-ss27-01', size: 'M', quantity: 12, wholesalePriceRub: 1000 }],
      },
    });
    expect(payload?.externalOrderRef).toBe('FC-9001');
    const order = buildWorkshop2B2bFashionCloudDraftOrder(payload!);
    expect(order.status).toBe('submitted');
    expect(order.lines[0]?.qty).toBe(12);
  });
});

describe('b2b-intake-allocation-client', () => {
  it('parses sku size suffix for allocation parts', () => {
    expect(parseReplenishmentSkuToAllocationParts('demo-ss27-01-M')).toEqual({
      articleId: 'demo-ss27-01',
      size: 'M',
    });
  });

  it('builds batch and B2B demand from ATP rows', () => {
    const rows = buildShopReplenishmentStockRows(6);
    const payload = buildIntakeAllocationPayloadFromAtpRows({
      rows,
      batchId: 'batch-ui-1',
      orderId: 'INT-1',
    });
    expect(payload.batch.batchId).toBe('batch-ui-1');
    expect(payload.batch.items.length).toBeGreaterThan(0);
    expect(payload.demand.b2bBackorders.length).toBeGreaterThan(0);
  });
});

describe('b2b-intake-allocation-repository', () => {
  it('persists allocation plan to memory/file when PG off', async () => {
    const strategy = new B2BPriorityStrategy();
    const plan = strategy.allocate(
      {
        batchId: 'batch-smoke-1',
        items: [{ articleId: 'demo-ss27-01', size: 'M', quantity: 10 }],
      },
      {
        b2bBackorders: [
          {
            orderId: 'B2B-DEMO-1',
            articleId: 'demo-ss27-01',
            size: 'M',
            requestedQuantity: 4,
          },
        ],
        ecomDemand: [],
        retailDemand: [],
      }
    );

    const saved = await persistB2bIntakeAllocationPlan({ batchId: 'batch-smoke-1', plan });
    expect(saved.planId).toMatch(/^alloc-batch-smoke-1-/);

    const latest = await getLatestB2bIntakeAllocationPlan('batch-smoke-1');
    expect(latest?.plan.allocations.length).toBeGreaterThan(0);
  });
});
