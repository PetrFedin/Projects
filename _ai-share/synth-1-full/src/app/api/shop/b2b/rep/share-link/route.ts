/**
 * GET tokenized rep linesheet share URL (journal PG, Wave 22).
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2B2bRepShareUrl,
  formatWorkshop2B2bCampaignId,
} from '@/lib/production/workshop2-b2b-wave22-parity';
import { issueWorkshop2B2bRepShareToken } from '@/lib/server/workshop2-b2b-wishlist-repository';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';

export async function GET(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  const campaignIdParam = req.nextUrl.searchParams.get('campaignId')?.trim();
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const articleId = req.nextUrl.searchParams.get('articleId')?.trim();
  const repId = req.nextUrl.searchParams.get('repId')?.trim() || 'rep-demo';
  const campaignId =
    campaignIdParam ||
    (collectionId && articleId ? formatWorkshop2B2bCampaignId(collectionId, articleId) : '');

  if (!campaignId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Укажите campaignId или collectionId+articleId.' },
      { status: 400 }
    );
  }

  const token = await issueWorkshop2B2bRepShareToken({ campaignId, repId });
  const origin = req.nextUrl.origin || 'http://localhost:3000';
  const shareUrl = buildWorkshop2B2bRepShareUrl({
    baseUrl: origin,
    token: token.token,
    campaignId,
    repId,
  });

  return NextResponse.json({
    ok: true,
    shareUrl,
    token: token.token,
    expiresAt: token.expiresAt,
    messageRu: 'Ссылка для rep linesheet (без отправки email).',
  });
}
