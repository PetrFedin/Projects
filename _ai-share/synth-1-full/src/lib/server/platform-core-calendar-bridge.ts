import 'server-only';

import type { Workshop2B2bCalendarEvent } from '@/lib/production/workshop2-b2b-campaign-hub';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import type { Workshop2SampleOrderRecord } from '@/lib/server/workshop2-sample-order-repository';
import { workshop2B2bProductionHandoffPoId } from '@/lib/server/workshop2-b2b-production-handoff';

export function buildPlatformCoreHandoffCalendarEvent(
  order: Workshop2B2bOrderRecord,
  handedOff: boolean
): Workshop2B2bCalendarEvent | null {
  if (!handedOff || !order.collectionId) return null;
  const poId = workshop2B2bProductionHandoffPoId(order.id);
  const date = order.updatedAt.slice(0, 10);
  return {
    id: `b2b-handoff-${order.id}`,
    collectionId: order.collectionId,
    articleId: order.articleId,
    source: 'b2b',
    title: `Передача в производство · ${poId}`,
    b2bOrderId: order.id,
    startAt: `${date}T10:00:00.000Z`,
    endAt: `${date}T11:00:00.000Z`,
    kind: 'market_date',
  };
}

export function buildPlatformCoreMaterialsSuppliedCalendarEvent(input: {
  order: Workshop2B2bOrderRecord;
  articleId?: string;
}): Workshop2B2bCalendarEvent | null {
  const order = input.order;
  if (!order.collectionId?.trim()) return null;
  const date = order.updatedAt.slice(0, 10);
  const articleId =
    input.articleId?.trim() ||
    order.lines[0]?.articleId?.trim() ||
    order.articleId?.trim() ||
    undefined;
  return {
    id: `b2b-materials-${order.id}`,
    collectionId: order.collectionId,
    articleId,
    source: 'b2b',
    title: `Материалы подтверждены · ${order.id}`,
    b2bOrderId: order.id,
    startAt: `${date}T14:00:00.000Z`,
    endAt: `${date}T15:00:00.000Z`,
    kind: 'delivery_window',
  };
}

export function buildPlatformCoreSampleOrderCalendarEvent(
  order: Workshop2SampleOrderRecord
): Workshop2B2bCalendarEvent | null {
  const date = order.dueDate?.trim().slice(0, 10);
  if (!date || !order.collectionId) return null;
  return {
    id: `sample-due-${order.id}`,
    collectionId: order.collectionId,
    articleId: order.articleId,
    source: 'b2b',
    title: `Образец · ${order.id} (${order.status})`,
    startAt: `${date}T09:00:00.000Z`,
    endAt: `${date}T17:00:00.000Z`,
    kind: 'delivery_window',
  };
}

/** PO из очереди handoff — для mfr/sup календаря (все серии коллекции). */
export function buildPlatformCoreHandoffQueueCalendarEvent(input: {
  b2bOrderId: string;
  productionOrderId: string;
  collectionId: string;
  articleId?: string;
  handoffAt?: string;
}): Workshop2B2bCalendarEvent | null {
  const b2bOrderId = input.b2bOrderId.trim();
  const productionOrderId = input.productionOrderId.trim();
  const collectionId = input.collectionId.trim();
  if (!b2bOrderId || !productionOrderId || !collectionId) return null;
  const date = (input.handoffAt?.trim() || new Date().toISOString()).slice(0, 10);
  return {
    id: `b2b-po-queue-${productionOrderId}`,
    collectionId,
    articleId: input.articleId?.trim(),
    source: 'b2b',
    title: `PO ${productionOrderId} · ${b2bOrderId}`,
    b2bOrderId,
    startAt: `${date}T09:00:00.000Z`,
    endAt: `${date}T10:30:00.000Z`,
    kind: 'market_date',
  };
}
