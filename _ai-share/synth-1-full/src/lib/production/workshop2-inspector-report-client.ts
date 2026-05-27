/**
 * Клиент API чек-листа мобильного инспектора (PG primary, localStorage — только cache).
 * M7.3: при сетевой ошибке — очередь IndexedDB (workshop2-inspector-offline-queue).
 */
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import {
  enqueueWorkshop2InspectorOfflinePut,
  flushWorkshop2InspectorOfflineQueue,
  workshop2InspectorOfflineQueueDepth,
} from '@/lib/production/workshop2-inspector-offline-queue';

export type Workshop2InspectorReportDto = {
  sampleOrderId: string;
  collectionId: string;
  articleId: string;
  checkedItemIds: string[];
  notes?: string;
  updatedBy?: string;
  updatedAt: string;
};

function reportUrl(collectionId: string, articleId: string, orderId: string): string {
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/inspector-report/${encodeURIComponent(orderId)}`;
}

export type Workshop2InspectorReportFetchResult = {
  report: Workshop2InspectorReportDto | null;
  pgPrimary: boolean;
  allowLocalStorageFallback: boolean;
  readSource?: string;
  hintRu?: string;
};

export async function fetchWorkshop2InspectorReport(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
}): Promise<Workshop2InspectorReportFetchResult> {
  const res = await fetch(reportUrl(input.collectionId, input.articleId, input.sampleOrderId), {
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) {
    return {
      report: null,
      pgPrimary: false,
      allowLocalStorageFallback: true,
    };
  }
  const json = (await res.json()) as {
    report?: Workshop2InspectorReportDto | null;
    readPath?: {
      pgPrimary?: boolean;
      allowLocalStorageFallback?: boolean;
      readSource?: string;
      hintRu?: string;
    };
  };
  return {
    report: json.report ?? null,
    pgPrimary: Boolean(json.readPath?.pgPrimary),
    allowLocalStorageFallback: json.readPath?.allowLocalStorageFallback !== false,
    readSource: json.readPath?.readSource,
    hintRu: json.readPath?.hintRu,
  };
}

export async function saveWorkshop2InspectorReport(input: {
  collectionId: string;
  articleId: string;
  sampleOrderId: string;
  checkedItemIds: string[];
  notes?: string;
  offlineReplay?: boolean;
  /** При true — не ставить в offline-очередь при ошибке сети. */
  skipOfflineQueue?: boolean;
}): Promise<{
  ok: boolean;
  report?: Workshop2InspectorReportDto;
  status?: number;
  queuedOffline?: boolean;
  offlineQueueLength?: number;
}> {
  try {
    const res = await fetch(reportUrl(input.collectionId, input.articleId, input.sampleOrderId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify({
        checkedItemIds: input.checkedItemIds,
        notes: input.notes,
        offlineReplay: input.offlineReplay,
      }),
    });
    const json = (await res.json()) as { ok?: boolean; report?: Workshop2InspectorReportDto };
    if (json.ok) {
      return { ok: true, report: json.report, status: res.status };
    }
    if (
      !input.skipOfflineQueue &&
      !input.offlineReplay &&
      (res.status === 0 || res.status >= 500)
    ) {
      enqueueWorkshop2InspectorOfflinePut({
        collectionId: input.collectionId,
        articleId: input.articleId,
        sampleOrderId: input.sampleOrderId,
        checkedItemIds: input.checkedItemIds,
      });
      return {
        ok: false,
        status: res.status,
        queuedOffline: true,
        offlineQueueLength: workshop2InspectorOfflineQueueDepth(),
      };
    }
    return { ok: false, report: json.report, status: res.status };
  } catch {
    if (!input.skipOfflineQueue && !input.offlineReplay) {
      enqueueWorkshop2InspectorOfflinePut({
        collectionId: input.collectionId,
        articleId: input.articleId,
        sampleOrderId: input.sampleOrderId,
        checkedItemIds: input.checkedItemIds,
      });
      return {
        ok: false,
        status: 0,
        queuedOffline: true,
        offlineQueueLength: workshop2InspectorOfflineQueueDepth(),
      };
    }
    return { ok: false, status: 0 };
  }
}

/** Сброс offline-очереди инспектора (PWA flush). */
export async function flushWorkshop2InspectorOfflineReportQueue(): Promise<{
  flushed: number;
  failed: number;
}> {
  const batch = await flushWorkshop2InspectorOfflineQueue({
    save: (payload) =>
      saveWorkshop2InspectorReport({
        ...payload,
        offlineReplay: true,
        skipOfflineQueue: true,
      }),
  });
  return { flushed: batch.flushed, failed: batch.failed };
}

export function getWorkshop2InspectorOfflineQueueSize(): number {
  return workshop2InspectorOfflineQueueDepth();
}
