/**
 * Слияние локального журнала хаба с server audit (dossier events API).
 */

import type { Workshop2ActivityEntry } from '@/lib/production/workshop2-activity-log';

export type Workshop2ServerDossierEventRow = {
  id: string;
  collectionId: string;
  articleId: string;
  eventType: string;
  createdAt: string;
  createdBy?: string;
  eventPayload?: Record<string, unknown>;
};

/** Wave W — не показывать synthetic/demo seed events как PG audit. */
const WORKSHOP2_HUB_ACTIVITY_SYNTHETIC_EVENT_TYPES = new Set([
  'demo_seed',
  'file_store_demo_bootstrap',
  'fake_audit',
  'synthetic_event',
]);

export function isWorkshop2HubActivityServerEventHonest(
  event: Workshop2ServerDossierEventRow
): boolean {
  const type = event.eventType.trim().toLowerCase();
  if (!type) return false;
  if (WORKSHOP2_HUB_ACTIVITY_SYNTHETIC_EVENT_TYPES.has(type)) return false;
  if (type.startsWith('fake_') || type.startsWith('synthetic_')) return false;
  return true;
}

function serverEventLine(event: Workshop2ServerDossierEventRow, skuHint?: string): string {
  const sku = skuHint?.trim();
  const prefix = sku ? `[${sku}] ` : '';
  const type = event.eventType.trim();
  if (type === 'dossier_saved' || type === 'legacy_dossier_edit') {
    return `${prefix}Сохранение досье (сервер)`;
  }
  if (type.startsWith('legacy_')) {
    return `${prefix}${type.replace(/^legacy_/, 'Досье: ')}`;
  }
  return `${prefix}${type}`;
}

export function mapWorkshop2ServerEventToActivityEntry(
  event: Workshop2ServerDossierEventRow,
  skuHint?: string
): Workshop2ActivityEntry {
  return {
    id: `srv-${event.id}`,
    at: event.createdAt,
    line: serverEventLine(event, skuHint),
    actor: event.createdBy,
    collectionId: event.collectionId,
    articleId: event.articleId,
  };
}

/** Объединяет local + server, dedup по id, новые сверху. */
export function mergeWorkshop2HubActivitySources(
  local: Workshop2ActivityEntry[],
  server: Workshop2ServerDossierEventRow[],
  skuByArticleId?: Record<string, string>
): Workshop2ActivityEntry[] {
  const seen = new Set<string>();
  const out: Workshop2ActivityEntry[] = [];

  for (const e of server) {
    if (!isWorkshop2HubActivityServerEventHonest(e)) continue;
    const mapped = mapWorkshop2ServerEventToActivityEntry(e, skuByArticleId?.[e.articleId]);
    if (seen.has(mapped.id)) continue;
    seen.add(mapped.id);
    out.push(mapped);
  }

  for (const e of local) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
  }

  out.sort((a, b) => b.at.localeCompare(a.at));
  return out.slice(0, 250);
}
