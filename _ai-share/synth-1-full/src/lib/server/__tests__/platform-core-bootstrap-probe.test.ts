import { probePlatformCoreDemoSeeded } from '@/lib/server/platform-core-bootstrap-probe';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => true),
  probeWorkshop2PgReachable: jest.fn(async () => true),
}));

jest.mock('@/lib/server/workshop2-development-status', () => ({
  getWorkshop2DevelopmentStatus: jest.fn(async () => ({ articleCount: 0 })),
}));

jest.mock('@/lib/server/workshop2-b2b-orders-repository', () => ({
  getWorkshop2B2bOrder: jest.fn(async () => null),
}));

const pgPool = jest.requireMock('@/lib/server/workshop2-pg-pool') as {
  isWorkshop2PostgresEnabled: jest.Mock;
  probeWorkshop2PgReachable: jest.Mock;
};
const devStatus = jest.requireMock('@/lib/server/workshop2-development-status') as {
  getWorkshop2DevelopmentStatus: jest.Mock;
};
const orders = jest.requireMock('@/lib/server/workshop2-b2b-orders-repository') as {
  getWorkshop2B2bOrder: jest.Mock;
};

describe('platform-core-bootstrap-probe', () => {
  beforeEach(() => {
    pgPool.isWorkshop2PostgresEnabled.mockReturnValue(true);
    pgPool.probeWorkshop2PgReachable.mockResolvedValue(true);
    devStatus.getWorkshop2DevelopmentStatus.mockResolvedValue({ articleCount: 0 });
    orders.getWorkshop2B2bOrder.mockResolvedValue(null);
  });

  it('false без PG', async () => {
    pgPool.isWorkshop2PostgresEnabled.mockReturnValue(false);
    await expect(probePlatformCoreDemoSeeded()).resolves.toBe(false);
  });

  it('false при PG без seed', async () => {
    await expect(probePlatformCoreDemoSeeded()).resolves.toBe(false);
  });

  it('true при артикулах в коллекции', async () => {
    devStatus.getWorkshop2DevelopmentStatus.mockResolvedValue({ articleCount: 2 });
    await expect(probePlatformCoreDemoSeeded()).resolves.toBe(true);
  });

  it('true при demo B2B-заказе даже если development-status падает', async () => {
    devStatus.getWorkshop2DevelopmentStatus.mockRejectedValue(new Error('dev status 500'));
    orders.getWorkshop2B2bOrder.mockResolvedValue({ id: 'B2B-DEMO-SHOP1-SS27' });
    await expect(probePlatformCoreDemoSeeded()).resolves.toBe(true);
  });

  it('true при demo B2B-заказе', async () => {
    orders.getWorkshop2B2bOrder.mockResolvedValue({ id: 'B2B-DEMO-SHOP1-SS27' });
    await expect(probePlatformCoreDemoSeeded()).resolves.toBe(true);
  });
});
