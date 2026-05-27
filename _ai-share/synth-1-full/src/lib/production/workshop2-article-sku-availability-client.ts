/**
 * Клиент: async-проверка SKU (PG) + подсказка для формы создания артикула.
 */

import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';
import { normalizeLocalSkuCode } from '@/lib/production/local-collection-inventory';

export type Workshop2SkuAvailabilityResult = {
  available: boolean;
  source: 'postgres' | 'pg_disabled' | 'local_only';
  messageRu?: string;
  conflict?: { collectionId: string; articleId: string; sku: string };
};

export async function fetchWorkshop2SkuAvailability(input: {
  sku: string;
  collectionId: string;
  excludeArticleId?: string;
  /** SKU уже есть в local inventory этой коллекции. */
  localDuplicate?: boolean;
}): Promise<Workshop2SkuAvailabilityResult> {
  const normalized = normalizeLocalSkuCode(input.sku);
  if (!normalized) {
    return { available: true, source: 'local_only' };
  }

  if (input.localDuplicate) {
    return {
      available: false,
      source: 'local_only',
      messageRu: `SKU «${normalized}» уже есть в составе этой коллекции.`,
    };
  }

  const q = new URLSearchParams({
    sku: normalized,
    collectionId: input.collectionId.trim(),
  });
  if (input.excludeArticleId?.trim()) {
    q.set('excludeArticleId', input.excludeArticleId.trim());
  }

  const res = await fetch(`/api/workshop2/articles/sku-availability?${q}`, {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });

  if (!res.ok) {
    return {
      available: true,
      source: 'local_only',
      messageRu: 'Серверная проверка SKU недоступна — учтён только local inventory.',
    };
  }

  const json = (await res.json()) as {
    available?: boolean;
    source?: string;
    messageRu?: string;
    conflict?: Workshop2SkuAvailabilityResult['conflict'];
  };

  if (json.source === 'pg_disabled') {
    return {
      available: true,
      source: 'pg_disabled',
      messageRu: json.messageRu,
    };
  }

  return {
    available: Boolean(json.available),
    source: 'postgres',
    messageRu: json.messageRu,
    conflict: json.conflict,
  };
}
