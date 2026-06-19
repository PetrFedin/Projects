import { nuorderFetchOrders } from '../nuorder-orders';
import { nuorderServerFetchOrdersByStatus } from '../nuorder-server';
import type { NuOrderConfig } from '../nuorder-client';

jest.mock('../nuorder-server', () => ({
  nuorderServerFetchOrdersByStatus: jest.fn(),
}));

const mockFetch = nuorderServerFetchOrdersByStatus as jest.MockedFunction<
  typeof nuorderServerFetchOrdersByStatus
>;

const CONFIG: NuOrderConfig = {
  hostname: 'wholesale.sandbox1.nuorder.com',
  consumerKey: 'ck',
  consumerSecret: 'cs',
  oauthToken: 'ot',
  oauthTokenSecret: 'ots',
  sandbox: true,
};

describe('nuorder-orders', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('maps upstream rows to imported orders', async () => {
    mockFetch.mockResolvedValue({
      success: true,
      orders: [
        {
          order_id: 'nu-1001',
          order_number: '1361318',
          status: 'approved',
          company_name: 'WH Shop',
          created_at: '2026-01-15T10:00:00Z',
          total: 4200,
          line_items: [{ sku: 'COAT-01', quantity: 2 }],
        },
      ],
    });

    const rows = await nuorderFetchOrders(CONFIG, { limit: 5 });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.id).toBe('nu-1001');
    expect(rows[0]?.orderNumber).toBe('1361318');
    expect(rows[0]?.lineCount).toBe(1);
  });

  it('returns empty when upstream fails', async () => {
    mockFetch.mockResolvedValue({ success: false, orders: [], error: 'HTTP 401' });
    expect(await nuorderFetchOrders(CONFIG)).toEqual([]);
  });
});
