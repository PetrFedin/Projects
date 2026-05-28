import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';

import { appendWorkshop2VendorBidToDossier } from '@/lib/production/workshop2-vendor-bids';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { putWorkshop2DossierToPg } from '@/lib/server/workshop2-dossier-repository';
import { enqueueWorkshop2DomainEvent } from '@/lib/server/workshop2-domain-events';

type RouteParams = {
  params: Promise<{ collectionId: string; articleId: string }>;
};

/** POST vendor bid → dossier mirror PG + domain event (Wave 7 #10). */
async function postVendorBid(req: NextRequest, ctx: RouteParams) {
  const { collectionId, articleId } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const b = body as {
    vendorId?: string;
    vendorName?: string;
    cmtPrice?: number;
    currency?: string;
    leadTimeDays?: number;
    moq?: number;
  };
  if (!b.vendorId?.trim() || !b.vendorName?.trim() || b.cmtPrice == null) {
    return jsonWorkshop2ErrorRu(400, 'invalid_request', {
      messageRu: 'vendorId, vendorName, cmtPrice обязательны.',
    });
  }

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record?.dossier) {
    return jsonWorkshop2ErrorRu(404, 'invalid_request', {
      messageRu: 'Досье не найдено — откройте workspace для sync.',
    });
  }

  const { dossier, bid } = appendWorkshop2VendorBidToDossier({
    dossier: record.dossier,
    bid: {
      vendorId: b.vendorId,
      vendorName: b.vendorName,
      cmtPrice: Number(b.cmtPrice),
      currency: b.currency ?? 'RUB',
      leadTimeDays: Number(b.leadTimeDays ?? 21),
      moq: Number(b.moq ?? 100),
    },
  });

  const put = await putWorkshop2DossierToPg({
    collectionId,
    articleId,
    dossier,
    baseVersion: record.version,
    txMeta: { eventType: 'supply.vendor_bid.received', eventPayload: { bidId: bid.id } },
  });
  if (!put.ok) {
    return jsonWorkshop2ErrorRu(409, 'version_conflict');
  }

  void enqueueWorkshop2DomainEvent({
    type: 'supply.vendor_bid.received',
    collectionId,
    articleId,
    payload: {
      bidId: bid.id,
      vendorId: bid.vendorId,
      vendorName: bid.vendorName,
      cmtPrice: bid.cmtPrice,
      currency: bid.currency,
      messageRu: `Ставка ${bid.vendorName}: ${bid.cmtPrice} ${bid.currency} (heuristic compare, без ML).`,
    },
  }).catch(() => {
    /* best-effort */
  });

  return NextResponse.json({
    ok: true,
    bid,
    bids: dossier.bids ?? [],
    mirror: dossier.vendorBidsMirror,
    messageRu: dossier.vendorBidsMirror?.heuristicWinnerNoteRu,
  });
}

export const POST = withWorkshop2ApiErrorRu(postVendorBid);
