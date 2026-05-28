import { POReconciliationResult } from './types';
import { reconcilePO } from './rfid-reconciliation-logic';

describe('RFIDReconciliation', () => {
  it('should match scanned EPCs against an expected Purchase Order', () => {
    const result = reconcilePO({
      purchaseOrderId: 'PO-123',
      epcs: ['A1M001', 'A1M002'],
    }) as POReconciliationResult;

    expect(result.status).toBe('PARTIAL_MATCH');
    expect(result.matchedItems.length).toBe(2);
    expect(result.missingItems.find((m) => m.size === 'M')?.expectedQuantity).toBe(8); // 10 expected - 2 scanned
  });

  it('should identify missing items and unexpected items', () => {
    const result = reconcilePO({
      purchaseOrderId: 'PO-123',
      epcs: ['A1M001', 'UNKNOWN123'],
    }) as POReconciliationResult;

    expect(result.status).toBe('MISMATCH');
    expect(result.unexpectedItems.includes('UNKNOWN123')).toBe(true);
  });
});
