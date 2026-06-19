import 'server-only';

import {
  buildWorkshop2B2bCalendarEventsForCollection,
  buildWorkshop2B2bCampaign,
  buyerTierCanSeeCampaign,
  type Workshop2B2bBuyerTier,
  type Workshop2B2bCalendarEvent,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import { buildWorkshop2B2bDeliveryCalendarEventFromOrder } from '@/lib/production/workshop2-b2b-wave22-parity';
import { getPlatformCoreDemo } from '@/lib/platform-core-hub-matrix';
import { resolveB2bChainStatusUnified } from '@/lib/integrations/spine/operational-import-handoff.service';
import {
  getWorkshop2B2bOrder,
  listWorkshop2B2bOrdersForCollection,
} from '@/lib/server/workshop2-b2b-orders-repository';
import {
  buildPlatformCoreHandoffCalendarEvent,
  buildPlatformCoreHandoffQueueCalendarEvent,
  buildPlatformCoreMaterialsSuppliedCalendarEvent,
  buildPlatformCoreSampleOrderCalendarEvent,
} from '@/lib/server/platform-core-calendar-bridge';
import { listWorkshop2FactoryProductionHandoffQueue } from '@/lib/server/workshop2-b2b-production-handoff';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2SampleOrdersByCollection } from '@/lib/server/workshop2-sample-order-repository';
import {
  getWorkshop2ShowroomCampaign,
  listWorkshop2PublishedShowroomArticles,
} from '@/lib/server/workshop2-showroom-repository';
import { listSpineCalendarEvents } from '@/lib/integrations/spine/integration-calendar-bridge';
import { listPlatformCoreUserCalendarTasks } from '@/lib/server/platform-core-user-calendar-task';

function eventMatchesOrder(event: Workshop2B2bCalendarEvent, orderId: string): boolean {
  return (
    event.id.includes(orderId) ||
    event.title.includes(orderId) ||
    event.b2bOrderId === orderId ||
    event.id === `b2b-handoff-${orderId}` ||
    event.id === `b2b-materials-${orderId}` ||
    event.id === `b2b-ship-order-${orderId}` ||
    event.id === `supplier-delivery-${orderId}`
  );
}

/** События B2B-календаря из W2/PG (кампании, заказы, handoff, образцы). */
export async function getPlatformCoreB2bCalendarEvents(options: {
  collectionId: string;
  orderId?: string;
  buyerTier?: Workshop2B2bBuyerTier;
  articleIds?: string[];
}): Promise<{
  collectionId: string;
  events: Workshop2B2bCalendarEvent[];
  count: number;
}> {
  const { collectionId, orderId, buyerTier = 'standard' } = options;
  const events: Workshop2B2bCalendarEvent[] = [];

  if (!orderId) {
    let articleIds = options.articleIds ?? [];
    if (articleIds.length === 0) {
      const published = await listWorkshop2PublishedShowroomArticles(collectionId);
      articleIds =
        published.length > 0
          ? published.map((p) => p.articleId)
          : [getPlatformCoreDemo(collectionId).demoArticleId];
    }

    const campaigns = [];
    for (const articleId of articleIds) {
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      if (!record?.dossier) continue;
      const pgCampaign = await getWorkshop2ShowroomCampaign({ collectionId, articleId });
      if (!pgCampaign?.published) continue;
      const campaign = buildWorkshop2B2bCampaign({
        collectionId,
        articleId,
        dossier: record.dossier,
        campaign: pgCampaign,
        tier: pgCampaign.visibilityTier,
      });
      if (!buyerTierCanSeeCampaign({ buyerTier, campaignTier: campaign.tier })) continue;
      campaigns.push(campaign);
    }

    events.push(...buildWorkshop2B2bCalendarEventsForCollection({ collectionId, campaigns }));
  }

  const orders = orderId
    ? [await getWorkshop2B2bOrder(orderId)].filter(
        (o): o is NonNullable<typeof o> => o != null && o.collectionId === collectionId
      )
    : await listWorkshop2B2bOrdersForCollection(collectionId);
  for (const order of orders) {
    const ship = buildWorkshop2B2bDeliveryCalendarEventFromOrder(order);
    if (ship) events.push(ship);
    const chain = await resolveB2bChainStatusUnified(order.id);
    const handoff = buildPlatformCoreHandoffCalendarEvent(order, chain?.handedOff === true);
    if (handoff) events.push(handoff);
    if (chain?.materialsSupplied) {
      const materials = buildPlatformCoreMaterialsSuppliedCalendarEvent({
        order,
        articleId: chain.articleId,
      });
      if (materials) events.push(materials);
    }
  }

  if (!orderId) {
    const sampleOrders = await listWorkshop2SampleOrdersByCollection({ collectionId });
    for (const sample of sampleOrders) {
      const sampleEvent = buildPlatformCoreSampleOrderCalendarEvent(sample);
      if (sampleEvent) events.push(sampleEvent);
    }

    const handoffQueue = await listWorkshop2FactoryProductionHandoffQueue({ factoryId: 'fact-1' });
    for (const item of handoffQueue.items) {
      if (item.collectionId !== collectionId) continue;
      const queueEvent = buildPlatformCoreHandoffQueueCalendarEvent({
        b2bOrderId: item.b2bOrderId,
        productionOrderId: item.productionOrderId,
        collectionId: item.collectionId,
        articleId: item.articleId,
        handoffAt: item.handoffAt,
      });
      if (queueEvent && !events.some((e) => e.id === queueEvent.id)) {
        events.push(queueEvent);
      }
    }
  }

  const includeSpineEvents = !orderId?.startsWith('B2B-DEMO-');
  if (includeSpineEvents) {
    for (const spineEvent of listSpineCalendarEvents({ collectionId, orderId })) {
      events.push(spineEvent);
    }
  }

  for (const userEvent of await listPlatformCoreUserCalendarTasks({ collectionId, orderId })) {
    if (!events.some((e) => e.id === userEvent.id)) {
      events.push(userEvent);
    }
  }

  const filtered = orderId ? events.filter((e) => eventMatchesOrder(e, orderId)) : events;

  return { collectionId, events: filtered, count: filtered.length };
}
