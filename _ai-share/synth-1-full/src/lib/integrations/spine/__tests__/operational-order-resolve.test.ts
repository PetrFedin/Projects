import { resolveSpineImportedOperationalOrder } from '../operational-order-resolve.server';

jest.mock('../imported-orders-persistence', () => ({
  getImportedOrderRecord: jest.fn(),
}));

jest.mock('@/lib/order/b2b-operational-status-persistence.file', () => ({
  getOperationalStatusRecord: jest.fn(),
}));

import { getImportedOrderRecord } from '../imported-orders-persistence';
import { getOperationalStatusRecord } from '@/lib/order/b2b-operational-status-persistence.file';

const mockGetImported = getImportedOrderRecord as jest.Mock;
const mockGetStatus = getOperationalStatusRecord as jest.Mock;

describe('operational-order-resolve.server', () => {
  beforeEach(() => {
    mockGetImported.mockReset();
    mockGetStatus.mockReset();
  });

  it('returns null for non-INT order id', () => {
    expect(resolveSpineImportedOperationalOrder('B2B-DEMO-1')).toBeNull();
    expect(mockGetImported).not.toHaveBeenCalled();
  });

  it('returns null when INT-* not in imported file', () => {
    mockGetImported.mockReturnValue(undefined);
    expect(resolveSpineImportedOperationalOrder('INT-JOOR-missing')).toBeNull();
  });

  it('returns imported order with status overlay', () => {
    mockGetImported.mockReturnValue({
      wholesaleOrderId: 'INT-JOOR-1',
      order: {
        order: 'INT-JOOR-1',
        shop: 'Shop',
        brand: 'Brand',
        status: 'pending',
        amount: '100',
        date: '2026-06-01',
      },
      lineItems: [],
      importedAt: '2026-06-01',
    });
    mockGetStatus.mockReturnValue({ status: 'confirmed', updatedAt: '2026-06-02' });
    const resolved = resolveSpineImportedOperationalOrder('INT-JOOR-1');
    expect(resolved?.status).toBe('confirmed');
  });
});
