import { POReconciliationResult } from './types';

// Extract logic so it can be tested without NextRequest
export function reconcilePO(payload: {
  purchaseOrderId: string;
  epcs: string[];
}): POReconciliationResult | { error: string } {
  const MOCK_PO_DB: Record<string, Array<{ articleId: string; size: string; quantity: number }>> = {
    'PO-123': [
      { articleId: 'A1', size: 'M', quantity: 10 },
      { articleId: 'A1', size: 'L', quantity: 5 },
    ],
  };

  const expectedItems = MOCK_PO_DB[payload.purchaseOrderId];
  if (!expectedItems) return { error: 'PO not found' };

  const result: POReconciliationResult = {
    purchaseOrderId: payload.purchaseOrderId,
    matchedItems: [],
    missingItems: [],
    unexpectedItems: [],
    status: 'MISMATCH',
  };

  const scannedCounts: Record<string, number> = {};

  for (const epc of payload.epcs) {
    let parsed = null;
    if (epc.includes('A1M')) parsed = { articleId: 'A1', size: 'M' };
    else if (epc.includes('A1L')) parsed = { articleId: 'A1', size: 'L' };

    if (!parsed) {
      result.unexpectedItems.push(epc);
      continue;
    }

    const key = `${parsed.articleId}-${parsed.size}`;
    scannedCounts[key] = (scannedCounts[key] || 0) + 1;

    result.matchedItems.push({
      articleId: parsed.articleId,
      size: parsed.size,
      epc,
    });
  }

  let hasMissing = false;
  let hasUnexpected = result.unexpectedItems.length > 0;

  for (const item of expectedItems) {
    const key = `${item.articleId}-${item.size}`;
    const scannedCount = scannedCounts[key] || 0;

    if (scannedCount < item.quantity) {
      result.missingItems.push({
        articleId: item.articleId,
        size: item.size,
        expectedQuantity: item.quantity - scannedCount,
      });
      hasMissing = true;
    } else if (scannedCount > item.quantity) {
      hasUnexpected = true;
    }
  }

  if (!hasMissing && !hasUnexpected) result.status = 'FULL_MATCH';
  else if (!hasUnexpected) result.status = 'PARTIAL_MATCH';
  else result.status = 'MISMATCH';

  return result;
}
