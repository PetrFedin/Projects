import type { BrandPgThreadRow } from '@/lib/brand/brand-messages-pg-threads';
import { WORKSHOP2_B2B_ORDER_CONTEXT_TYPE } from '@/lib/production/workshop2-b2b-order-lifecycle';

const EMPTY_INBOX_PREVIEW_RU = 'Нет сообщений';

/** PG order threads + honest empty rows для заказов без сообщений (не synthetic inbox). */
export function mergeCommsHubInboxThreadRows(
  pgThreads: readonly BrandPgThreadRow[],
  orderIds: readonly string[],
  collectionId: string
): BrandPgThreadRow[] {
  const orderThreadById = new Map<string, BrandPgThreadRow>();
  for (const t of pgThreads) {
    if (t.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE) {
      const id = t.contextId?.trim();
      if (id) orderThreadById.set(id, t);
    }
  }

  const orderRows: BrandPgThreadRow[] = [];
  for (const raw of orderIds) {
    const id = raw.trim();
    if (!id) continue;
    orderRows.push(
      orderThreadById.get(id) ?? {
        contextType: WORKSHOP2_B2B_ORDER_CONTEXT_TYPE,
        contextId: id,
        lastMessageAt: '',
        lastMessagePreview: EMPTY_INBOX_PREVIEW_RU,
        messageCount: 0,
      }
    );
  }

  const articleRows = pgThreads.filter((t) => {
    if (t.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE) return false;
    const cid = t.collectionId?.trim();
    return !cid || cid === collectionId;
  });

  return [...orderRows, ...articleRows];
}

export function commsHubThreadLabel(
  thread: BrandPgThreadRow,
  productionOrderByB2bId: Readonly<Record<string, string>> = {}
): string {
  if (thread.contextType === WORKSHOP2_B2B_ORDER_CONTEXT_TYPE) {
    const orderId = thread.contextId?.trim() ?? '';
    const po = productionOrderByB2bId[orderId];
    if (po) return `PO ${po} · ${orderId}`;
    return `Заказ · ${orderId}`;
  }
  const cid = thread.collectionId?.trim();
  const aid = thread.articleId?.trim();
  if (cid && aid) return `${cid} · ${aid}`;
  return thread.contextId;
}
