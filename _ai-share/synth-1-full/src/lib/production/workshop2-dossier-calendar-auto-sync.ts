/**
 * Wave 10: авто calendar-sync при изменении taMilestones (debounce на стороне PUT).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2BrandCalendarEventsForArticle,
  type Workshop2BrandCalendarSampleOrderInput,
} from '@/lib/production/workshop2-brand-calendar-sync';
import { replaceWorkshop2BrandCalendarEventsForArticle } from '@/lib/server/workshop2-brand-calendar-repository';

function milestonesSignature(dossier: Workshop2DossierPhase1): string {
  const rows = dossier.taMilestones ?? [];
  return rows
    .map((m) => `${m.id}:${m.targetDate ?? ''}:${m.status ?? ''}:${m.title ?? ''}`)
    .join('|');
}

export function shouldAutoSyncWorkshop2CalendarOnDossierPut(input: {
  previous?: Workshop2DossierPhase1 | null;
  next: Workshop2DossierPhase1;
}): boolean {
  const prevSig = input.previous ? milestonesSignature(input.previous) : '';
  const nextSig = milestonesSignature(input.next);
  if (!nextSig) return false;
  return prevSig !== nextSig;
}

/** Best-effort sync после PUT досье (без отдельной кнопки на T&A). */
export async function autoSyncWorkshop2BrandCalendarAfterDossierPut(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  organizationId?: string | null;
  sampleOrderDueDate?: string | null;
  sampleOrders?: Workshop2BrandCalendarSampleOrderInput[];
}): Promise<{ synced: number; skipped: boolean }> {
  const events = buildWorkshop2BrandCalendarEventsForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    sampleOrderDueDate: input.sampleOrderDueDate ?? null,
    sampleOrders: input.sampleOrders,
  });
  if (!events.length) {
    return { synced: 0, skipped: true };
  }
  const result = await replaceWorkshop2BrandCalendarEventsForArticle({
    collectionId: input.collectionId,
    articleId: input.articleId,
    events,
    organizationId: input.organizationId ?? undefined,
  });
  return { synced: result.synced, skipped: false };
}

/** Wave 18: авто calendar-sync после PATCH movement (in_transit / received). */
export async function autoSyncWorkshop2BrandCalendarAfterSampleMovement(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  organizationId?: string | null;
  sampleOrders: Workshop2BrandCalendarSampleOrderInput[];
  sampleOrderDueDate?: string | null;
}): Promise<{ synced: number; skipped: boolean }> {
  return autoSyncWorkshop2BrandCalendarAfterDossierPut(input);
}
