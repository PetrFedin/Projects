/**
 * Wave AC — стабильный sample-order для demo-ss27-01 в file-store (PG off).
 * Нужен для QC→inspector deep link и Playwright #7 без PG seed script.
 */
import 'server-only';

import type { Workshop2SampleOrderRecord } from '@/lib/server/workshop2-sample-order-repository';
import { workshop2SampleOrderStatusToMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import { normalizeWorkshop2NestingRequest } from '@/lib/production/workshop2-nesting-request';
import { isWorkshop2FileStoreDemoArticle } from '@/lib/production/workshop2-file-store-demo-bootstrap';

/** Детерминированный id — inspector route `/inspector/[orderId]` и E2E curl. */
export const WORKSHOP2_FILE_STORE_DEMO_SAMPLE_ORDER_ID =
  'file-store-demo-ss27-01-sample-order' as const;

export function isWorkshop2FileStoreDemoSampleOrderArticle(
  collectionId: string,
  articleId: string
): boolean {
  return (
    collectionId === 'SS27' &&
    articleId === 'demo-ss27-01' &&
    isWorkshop2FileStoreDemoArticle('SS27', { id: articleId })
  );
}

/** Создаёт in-memory demo sample-order (без PG). */
export function buildWorkshop2FileStoreDemoSampleOrder(input: {
  collectionId: string;
  articleId: string;
}): Workshop2SampleOrderRecord | null {
  if (!isWorkshop2FileStoreDemoSampleOrderArticle(input.collectionId, input.articleId)) {
    return null;
  }
  const now = new Date().toISOString();
  const status = 'draft' as const;
  return {
    id: WORKSHOP2_FILE_STORE_DEMO_SAMPLE_ORDER_ID,
    collectionId: input.collectionId,
    articleId: input.articleId,
    status,
    movementStatus: workshop2SampleOrderStatusToMovementStatus(status),
    movementLog: [],
    statusHistory: [],
    sizes: { M: 1 },
    quantity: 1,
    notes: 'file-store demo sample-order (Wave AC)',
    createdAt: now,
    updatedAt: now,
    createdBy: 'file-store-sample-order-bootstrap',
    contractorId: 'fact-1',
    nestingRequest: normalizeWorkshop2NestingRequest({}),
  };
}
