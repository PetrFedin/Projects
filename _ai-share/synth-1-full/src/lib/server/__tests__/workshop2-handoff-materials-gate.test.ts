/** @jest-environment node */

import { confirmWorkshop2B2bProductionHandoff } from '@/lib/server/workshop2-b2b-production-handoff';

jest.mock('@/lib/server/workshop2-b2b-orders-repository', () => ({
  getWorkshop2B2bOrder: jest.fn(),
}));

jest.mock('@/lib/server/workshop2-material-requisition-repository', () => ({
  listWorkshop2MaterialRequisitions: jest.fn(),
  areWorkshop2MaterialRequisitionsConfirmedForArticles: jest.fn(),
}));

import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { listWorkshop2MaterialRequisitions } from '@/lib/server/workshop2-material-requisition-repository';

describe('confirmWorkshop2B2bProductionHandoff materials gate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getWorkshop2B2bOrder as jest.Mock).mockResolvedValue({
      id: 'B2B-DEMO-SHOP1-SS27',
      status: 'confirmed',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
      lines: [{ articleId: 'demo-ss27-01', qty: 12 }],
    });
  });

  it('blocks handoff when material requisitions are not supplier_confirmed', async () => {
    (listWorkshop2MaterialRequisitions as jest.Mock).mockResolvedValue([
      { id: 'req-1', status: 'pending' },
    ]);

    const result = await confirmWorkshop2B2bProductionHandoff({
      orderId: 'B2B-DEMO-SHOP1-SS27',
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('materials_pending');
    expect(result.messageRu).toMatch(/материал/i);
  });

  it('does not block on materials_pending when article has no requisitions', async () => {
    (listWorkshop2MaterialRequisitions as jest.Mock).mockResolvedValue([]);

    const result = await confirmWorkshop2B2bProductionHandoff({
      orderId: 'B2B-DEMO-SHOP1-SS27',
    });

    if (!result.ok) {
      expect(result.code).not.toBe('materials_pending');
    }
  });

  it('does not block when at least one requisition is supplier_confirmed', async () => {
    (listWorkshop2MaterialRequisitions as jest.Mock).mockResolvedValue([
      { id: 'req-1', status: 'supplier_confirmed' },
    ]);

    const result = await confirmWorkshop2B2bProductionHandoff({
      orderId: 'B2B-DEMO-SHOP1-SS27',
    });

    if (!result.ok) {
      expect(result.code).not.toBe('materials_pending');
    }
  });
});
