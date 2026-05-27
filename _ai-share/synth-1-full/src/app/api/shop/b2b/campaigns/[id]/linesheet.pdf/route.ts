/**
 * GET linesheet PDF — кампания + W2 dossier (Wave 22).
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2B2bCampaign } from '@/lib/production/workshop2-b2b-campaign-hub';
import { buildWorkshop2B2bLinesheetPdfBytes } from '@/lib/production/workshop2-b2b-linesheet-pdf';
import { parseWorkshop2B2bCampaignId } from '@/lib/production/workshop2-b2b-wave22-parity';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { getWorkshop2ShowroomCampaign } from '@/lib/server/workshop2-showroom-repository';

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const parsed = parseWorkshop2B2bCampaignId(id);
  if (!parsed) {
    return NextResponse.json(
      { ok: false, messageRu: 'Некорректный id кампании (collectionId::articleId).' },
      { status: 400 }
    );
  }

  const record = await getWorkshop2ServerDossierRecord(parsed.collectionId, parsed.articleId);
  if (!record?.dossier) {
    return NextResponse.json(
      { ok: false, messageRu: 'Досье не найдено — синхронизируйте W2.' },
      { status: 404 }
    );
  }

  const pgCampaign = await getWorkshop2ShowroomCampaign(parsed);
  const campaign = buildWorkshop2B2bCampaign({
    collectionId: parsed.collectionId,
    articleId: parsed.articleId,
    dossier: record.dossier,
    campaign: pgCampaign,
  });

  const bytes = buildWorkshop2B2bLinesheetPdfBytes({ campaign });
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="linesheet-${parsed.collectionId}-${parsed.articleId}.pdf"`,
    },
  });
}
