jest.mock('@/lib/server/workshop2-b2b-orders-repository', () => ({
  getWorkshop2B2bOrder: jest.fn(),
  putWorkshop2B2bOrder: jest.fn(),
}));

jest.mock('@/lib/server/platform-core-chain-status-hub', () => ({
  bumpPlatformCoreChainStatus: jest.fn(),
}));

jest.mock('@/lib/server/platform-core-b2b-registry-hub', () => ({
  bumpPlatformCoreB2bRegistry: jest.fn(),
}));

import {
  acknowledgeWorkshop2B2bBuyerDelivery,
  bulkAcknowledgeWorkshop2B2bBuyerDelivery,
} from '@/lib/server/workshop2-b2b-buyer-delivery-ack';
import {
  getWorkshop2B2bOrder,
  putWorkshop2B2bOrder,
} from '@/lib/server/workshop2-b2b-orders-repository';

const getOrder = getWorkshop2B2bOrder as jest.Mock;
const putOrder = putWorkshop2B2bOrder as jest.Mock;

describe('workshop2-b2b-buyer-delivery-ack', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('acknowledges shipped order once', async () => {
    getOrder.mockResolvedValue({
      id: 'B2B-DEMO-001',
      status: 'shipped',
      tier: 'standard',
      totalRub: 1000,
      lines: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    putOrder.mockResolvedValue({ persisted: true, mode: 'postgres' });

    const first = await acknowledgeWorkshop2B2bBuyerDelivery({ orderId: 'B2B-DEMO-001' });
    expect(first.ok).toBe(true);
    if (first.ok) {
      expect(first.order.buyerDeliveryAcknowledgedAt).toBeTruthy();
    }

    getOrder.mockResolvedValue({
      id: 'B2B-DEMO-001',
      status: 'shipped',
      tier: 'standard',
      totalRub: 1000,
      lines: [],
      buyerDeliveryAcknowledgedAt: '2026-06-12T00:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-06-12T00:00:00.000Z',
    });
    const second = await acknowledgeWorkshop2B2bBuyerDelivery({ orderId: 'B2B-DEMO-001' });
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.code).toBe('already_ack');
  });

  it('bulk ack splits acknowledged and skipped', async () => {
    getOrder
      .mockResolvedValueOnce({
        id: 'B2B-A',
        status: 'shipped',
        tier: 'standard',
        totalRub: 1,
        lines: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      })
      .mockResolvedValueOnce({
        id: 'B2B-B',
        status: 'confirmed',
        tier: 'standard',
        totalRub: 1,
        lines: [],
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      });
    putOrder.mockResolvedValue({ persisted: true, mode: 'postgres' });

    const result = await bulkAcknowledgeWorkshop2B2bBuyerDelivery({
      orderIds: ['B2B-A', 'B2B-B'],
    });
    expect(result.acknowledged).toEqual(['B2B-A']);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.orderId).toBe('B2B-B');
  });
});
