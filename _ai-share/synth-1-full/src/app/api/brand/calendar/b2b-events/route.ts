/**
 * GET /api/brand/calendar/b2b-events?collectionId=
 * События B2B (окна предзаказа / поставки) для brand calendar.
 */
import { NextRequest, NextResponse } from 'next/server';

import {
  buildWorkshop2B2bCalendarEventsForCollection,
  buildWorkshop2B2bCampaign,
  buyerTierCanSeeCampaign,
  type Workshop2B2bBuyerTier,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import { buildWorkshop2B2bDeliveryCalendarEventFromOrder } from '@/lib/production/workshop2-b2b-wave22-parity';
import { listWorkshop2B2bOrdersForCollection } from '@/lib/server/workshop2-b2b-orders-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { getWorkshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';

export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  if (!collectionId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Параметр collectionId обязателен.' },
      { status: 400 }
    );
  }

  const articleIdsParam = req.nextUrl.searchParams.get('articleIds')?.trim();
  const articleIds = articleIdsParam
    ? articleIdsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : ['demo-ss27-01'];

  const buyerTier = (req.nextUrl.searchParams.get('buyerTier')?.trim() ??
    'standard') as Workshop2B2bBuyerTier;

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

  const events = buildWorkshop2B2bCalendarEventsForCollection({ collectionId, campaigns });
  const orders = await listWorkshop2B2bOrdersForCollection(collectionId);
  for (const order of orders) {
    const ship = buildWorkshop2B2bDeliveryCalendarEventFromOrder(order);
    if (ship) events.push(ship);
  }

  return NextResponse.json({
    ok: true,
    collectionId,
    events,
    count: events.length,
    messageRu: `B2B календарь: ${events.length} событий по ${campaigns.length} кампаниям.`,
  });
}
