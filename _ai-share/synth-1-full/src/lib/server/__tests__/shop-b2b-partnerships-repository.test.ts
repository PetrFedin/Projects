import {
  clearShopB2bPartnershipPgMemoryForTests,
  listShopB2bPartnershipRowsPg,
  upsertShopB2bPartnershipPg,
} from '@/lib/server/shop-b2b-partnerships-repository';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(() => false),
  getWorkshop2PgPool: jest.fn(),
}));

describe('shop-b2b-partnerships-repository', () => {
  beforeEach(() => {
    clearShopB2bPartnershipPgMemoryForTests();
  });

  it('upserts requested then connected for buyer+brand', async () => {
    await upsertShopB2bPartnershipPg({
      buyerId: 'shop1',
      brandId: 'brand_nordic_wool',
      brandSlug: 'nordic-wool',
      status: 'requested',
      collectionId: 'SS27',
    });
    let rows = await listShopB2bPartnershipRowsPg('shop1');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.status).toBe('requested');

    await upsertShopB2bPartnershipPg({
      buyerId: 'shop1',
      brandId: 'brand_nordic_wool',
      brandSlug: 'nordic-wool',
      status: 'connected',
      collectionId: 'SS27',
    });
    rows = await listShopB2bPartnershipRowsPg('shop1');
    expect(rows[0]?.status).toBe('connected');
    expect(rows[0]?.connectedAt).toBeTruthy();
  });
});
