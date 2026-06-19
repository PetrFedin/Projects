import {
  clearWorkshop2LogisticsMemoryForTests,
  upsertWorkshop2LogisticsShipment,
} from '@/lib/server/workshop2-logistics-repository';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => false),
  getWorkshop2PgPool: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-b2b-orders-repository', () => ({
  getWorkshop2B2bOrder: jest.fn(async (orderId: string) =>
    orderId === 'B2B-9001' || orderId === 'B2B-DEMO-SHOP1-SS27'
      ? {
          id: orderId,
          collectionId: 'SS27',
          articleId: 'demo-ss27-01',
          status: 'confirmed',
          lines: [],
          totalRub: 1000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : null
  ),
}));

jest.mock('@/lib/integrations/spine/order-tracking-persistence.file', () => ({
  getOrderTracking: jest.fn(() => undefined),
  upsertOrderTracking: jest.fn((s: { wholesaleOrderId: string; trackingNumber?: string }) => s),
}));

jest.mock('@/lib/integrations/spine/order-tracking.service', () => ({
  syncSynthaPgTracking: jest.fn((input: { wholesaleOrderId: string; trackingNumber?: string }) => ({
    wholesaleOrderId: input.wholesaleOrderId,
    platform: 'syntha',
    trackingNumber: input.trackingNumber,
    updatedAt: new Date().toISOString(),
  })),
}));

jest.mock('@/lib/server/platform-core-chain-status-hub', () => ({
  bumpPlatformCoreChainStatus: jest.fn(),
}));

import { syncWorkshop2B2bOrderLogisticsTracking } from '@/lib/server/workshop2-b2b-order-logistics-tracking';

describe('workshop2-b2b-order-logistics-tracking', () => {
  beforeEach(() => {
    clearWorkshop2LogisticsMemoryForTests();
  });

  it('syncs PG logistics + spine mirror for clean B2B order', async () => {
    const result = await syncWorkshop2B2bOrderLogisticsTracking({
      orderId: 'B2B-9001',
      trackingNumber: 'SYN-LOG-001',
      carrier: 'DHL',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.trackingNumber).toBe('SYN-LOG-001');
      expect(result.shipment.sampleOrderId).toBe('B2B-9001');
    }
  });

  it('syncs PG logistics + spine mirror for demo pin order', async () => {
    const result = await syncWorkshop2B2bOrderLogisticsTracking({
      orderId: 'B2B-DEMO-SHOP1-SS27',
      trackingNumber: 'SYN-DEMO-001',
      carrier: 'CDEK',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.trackingNumber).toBe('SYN-DEMO-001');
      expect(result.shipment.sampleOrderId).toBe('B2B-DEMO-SHOP1-SS27');
    }
  });

  it('rejects non-PG order ids', async () => {
    const result = await syncWorkshop2B2bOrderLogisticsTracking({
      orderId: 'INT-JOOR-golden-joor-123',
      trackingNumber: 'X',
    });
    expect(result.ok).toBe(false);
  });
});
