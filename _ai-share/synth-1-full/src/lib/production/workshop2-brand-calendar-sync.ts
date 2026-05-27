/**
 * T&A milestones, gate-даты и движение образца Workshop2 → события brand calendar.
 */
import type {
  Workshop2DossierPhase1,
  Workshop2TaMilestone,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU,
  type Workshop2SampleGoodsMovementStatus,
} from '@/lib/production/workshop2-sample-goods-movement';

export type Workshop2BrandCalendarBlockerKind = 'sample_deadline' | 'gold' | 'handoff';

export type Workshop2BrandCalendarSyncEvent = {
  id: string;
  collectionId: string;
  articleId: string;
  sourceKind: 'ta_milestone' | 'gate_blocker' | 'sample_movement';
  title: string;
  startAt: string;
  endAt: string;
  isBlocker: boolean;
  blockerKind?: Workshop2BrandCalendarBlockerKind;
  linkedMilestoneId?: string;
  /** Critical path: id предыдущей вехи (dependsOn). */
  dependsOn?: string;
  href?: string;
  priority?: 'high' | 'medium' | 'low';
};

function dayStartIso(isoDate: string): string {
  const d = isoDate.trim().slice(0, 10);
  return `${d}T09:00:00.000Z`;
}

function dayEndIso(isoDate: string): string {
  const d = isoDate.trim().slice(0, 10);
  return `${d}T18:00:00.000Z`;
}

function matchGateBlockerKind(title: string): Workshop2BrandCalendarBlockerKind | null {
  const t = title.toLowerCase();
  if (t.includes('образец') || t.includes('sample')) return 'sample_deadline';
  if (t.includes('gold') || t.includes('золот') || t.includes('эталон')) return 'gold';
  if (t.includes('handoff') || t.includes('передач') || t.includes('цех')) return 'handoff';
  return null;
}

function gateBlockerFromMilestone(
  milestone: Workshop2TaMilestone,
  collectionId: string,
  articleId: string
): Workshop2BrandCalendarSyncEvent | null {
  const kind = matchGateBlockerKind(milestone.title);
  if (!kind) return null;
  const overdue = milestone.status !== 'completed' && milestone.status !== 'delayed';
  return {
    id: `w2cal-blocker-${collectionId}-${articleId}-${milestone.id}`,
    collectionId,
    articleId,
    sourceKind: 'gate_blocker',
    title: `⛔ ${milestone.title}`,
    startAt: dayStartIso(milestone.targetDate),
    endAt: dayEndIso(milestone.targetDate),
    isBlocker: overdue,
    blockerKind: kind,
    linkedMilestoneId: milestone.id,
    href: `/brand/production/workshop2/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}?w2pane=plan`,
    priority: kind === 'handoff' ? 'high' : 'medium',
  };
}

function milestoneToCalendarEvent(
  milestone: Workshop2TaMilestone,
  collectionId: string,
  articleId: string,
  dependsOn?: string
): Workshop2BrandCalendarSyncEvent {
  const atRisk = milestone.status === 'delayed' || milestone.status === 'in_progress';
  return {
    id: `w2cal-ta-${collectionId}-${articleId}-${milestone.id}`,
    collectionId,
    articleId,
    sourceKind: 'ta_milestone',
    title: milestone.title,
    startAt: dayStartIso(milestone.targetDate),
    endAt: dayEndIso(milestone.targetDate),
    isBlocker: false,
    linkedMilestoneId: milestone.id,
    dependsOn,
    href: `/brand/production/workshop2/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}?w2pane=plan`,
    priority: atRisk ? 'high' : 'medium',
  };
}

/** Строит набор событий календаря из taMilestones + gate blockers. */
export function buildWorkshop2BrandCalendarEventsFromDossier(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  sampleOrderDueDate?: string | null;
}): Workshop2BrandCalendarSyncEvent[] {
  const { collectionId, articleId, dossier } = input;
  const events: Workshop2BrandCalendarSyncEvent[] = [];
  const milestones = dossier.taMilestones ?? [];

  let prevMilestoneId: string | undefined;
  for (const m of milestones) {
    if (!m.targetDate?.trim()) continue;
    events.push(milestoneToCalendarEvent(m, collectionId, articleId, prevMilestoneId));
    const blocker = gateBlockerFromMilestone(m, collectionId, articleId);
    if (blocker) {
      events.push({ ...blocker, dependsOn: prevMilestoneId ?? m.id });
    }
    prevMilestoneId = m.id;
  }

  if (input.sampleOrderDueDate?.trim()) {
    events.push({
      id: `w2cal-blocker-${collectionId}-${articleId}-sample-order-due`,
      collectionId,
      articleId,
      sourceKind: 'gate_blocker',
      title: '⛔ Дедлайн образца (sample order)',
      startAt: dayStartIso(input.sampleOrderDueDate),
      endAt: dayEndIso(input.sampleOrderDueDate),
      isBlocker: dossier.goldSampleStatus?.status !== 'approved',
      blockerKind: 'sample_deadline',
      href: `/brand/production/workshop2/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}?w2pane=fit`,
      priority: 'high',
    });
  }

  return events;
}

export type Workshop2BrandCalendarSampleOrderInput = {
  id: string;
  movementStatus?: Workshop2SampleGoodsMovementStatus | string | null;
  movementLog?: Array<{
    at: string;
    to: Workshop2SampleGoodsMovementStatus | string;
  }> | null;
};

/** События календаря из журнала движения образца (in_transit / received). */
export function buildWorkshop2BrandCalendarEventsFromSampleMovement(input: {
  collectionId: string;
  articleId: string;
  orders: Workshop2BrandCalendarSampleOrderInput[];
}): Workshop2BrandCalendarSyncEvent[] {
  const { collectionId, articleId } = input;
  const events: Workshop2BrandCalendarSyncEvent[] = [];
  const href = `/brand/production/workshop2/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}?w2pane=fit`;

  for (const order of input.orders) {
    const orderKey = order.id.trim().slice(0, 8);
    const seen = new Set<string>();

    const pushMovement = (status: Workshop2SampleGoodsMovementStatus, at: string) => {
      if (status !== 'in_transit' && status !== 'received') return;
      const dedupeKey = `${order.id}:${status}:${at.slice(0, 10)}`;
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      const label = WORKSHOP2_SAMPLE_MOVEMENT_LABELS_RU[status];
      const title =
        status === 'in_transit' ? `🚚 Образец в пути · ${orderKey}` : `✅ ${label} · ${orderKey}`;
      events.push({
        id: `w2cal-movement-${collectionId}-${articleId}-${order.id}-${status}-${at.slice(0, 10)}`,
        collectionId,
        articleId,
        sourceKind: 'sample_movement',
        title,
        startAt: dayStartIso(at),
        endAt: dayEndIso(at),
        isBlocker: status === 'in_transit',
        blockerKind: status === 'in_transit' ? 'sample_deadline' : undefined,
        href,
        priority: status === 'received' ? 'medium' : 'high',
      });
    };

    for (const entry of order.movementLog ?? []) {
      const to = String(entry.to ?? '').trim() as Workshop2SampleGoodsMovementStatus;
      if (entry.at?.trim()) pushMovement(to, entry.at);
    }

    const current = String(order.movementStatus ?? '').trim() as Workshop2SampleGoodsMovementStatus;
    if (current === 'in_transit' || current === 'received') {
      const lastAt = order.movementLog?.length
        ? order.movementLog[order.movementLog.length - 1]?.at
        : new Date().toISOString();
      if (lastAt) pushMovement(current, lastAt);
    }
  }

  return events;
}

/** T&A + gate blockers + движение образца — единая сборка для calendar-sync. */
export function buildWorkshop2BrandCalendarEventsForArticle(input: {
  collectionId: string;
  articleId: string;
  dossier: Workshop2DossierPhase1;
  sampleOrderDueDate?: string | null;
  sampleOrders?: Workshop2BrandCalendarSampleOrderInput[];
}): Workshop2BrandCalendarSyncEvent[] {
  const base = buildWorkshop2BrandCalendarEventsFromDossier({
    collectionId: input.collectionId,
    articleId: input.articleId,
    dossier: input.dossier,
    sampleOrderDueDate: input.sampleOrderDueDate ?? null,
  });
  const movement = buildWorkshop2BrandCalendarEventsFromSampleMovement({
    collectionId: input.collectionId,
    articleId: input.articleId,
    orders: input.sampleOrders ?? [],
  });
  return [...base, ...movement];
}
