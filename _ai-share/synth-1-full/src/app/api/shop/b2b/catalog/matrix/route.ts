/**
 * GET /api/shop/b2b/catalog/matrix?collectionId=&articleId=
 * Матрица style × color × size из досье W2 + кампании showroom.
 */
import { NextRequest, NextResponse } from 'next/server';

import {
  buildWorkshop2B2bCampaign,
  buildWorkshop2B2bCatalogMatrix,
  buyerTierCanSeeCampaign,
  isWorkshop2B2bBuyerTier,
  type Workshop2B2bBuyerTier,
} from '@/lib/production/workshop2-b2b-campaign-hub';
import { enrichWorkshop2B2bMatrixWithAvailability } from '@/lib/production/workshop2-b2b-wave22-parity';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { getWorkshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';

export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim() ?? 'demo-ss27-01';
  if (!collectionId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Параметр collectionId обязателен.' },
      { status: 400 }
    );
  }

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record?.dossier) {
    return NextResponse.json(
      { ok: false, messageRu: 'Досье артикула не найдено — синхронизируйте W2.' },
      { status: 404 }
    );
  }

  const campaign = await getWorkshop2ShowroomCampaign({ collectionId, articleId });
  const buyerTierRaw = req.nextUrl.searchParams.get('buyerTier')?.trim() ?? 'standard';
  const buyerTier: Workshop2B2bBuyerTier = isWorkshop2B2bBuyerTier(buyerTierRaw)
    ? buyerTierRaw
    : 'standard';

  const hubCampaign = buildWorkshop2B2bCampaign({
    collectionId,
    articleId,
    dossier: record.dossier,
    campaign,
  });

  if (
    !hubCampaign.published ||
    !buyerTierCanSeeCampaign({ buyerTier, campaignTier: hubCampaign.tier })
  ) {
    return NextResponse.json(
      {
        ok: false,
        code: 'campaign_not_visible',
        messageRu: 'Кампания не опубликована или недоступна для вашего tier.',
        tier: hubCampaign.tier,
        buyerTier,
      },
      { status: 403 }
    );
  }

  const matrix = enrichWorkshop2B2bMatrixWithAvailability({
    matrix: buildWorkshop2B2bCatalogMatrix({
      collectionId,
      articleId,
      dossier: record.dossier,
      campaign,
    }),
    dossier: record.dossier,
  });

  return NextResponse.json({
    ok: true,
    matrix,
    campaign: hubCampaign,
    messageRu: `Матрица ${matrix.cells.length} ячеек · ₽ опт · MOQ ${matrix.cells[0]?.moq ?? 1}.`,
  });
}
