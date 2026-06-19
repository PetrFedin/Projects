/**
 * POST rep linesheet share — token + journal (email delivery stub when SMTP unset).
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2B2bRepShareUrl,
  formatWorkshop2B2bCampaignId,
} from '@/lib/production/workshop2-b2b-wave22-parity';
import { guardShopB2bCheckoutRoute } from '@/lib/server/shop-b2b-checkout-route-auth';
import { issueWorkshop2B2bRepShareToken } from '@/lib/server/workshop2-b2b-wishlist-repository';

export async function POST(req: NextRequest) {
  const checkoutAuth = await guardShopB2bCheckoutRoute(req);
  if (checkoutAuth instanceof NextResponse) return checkoutAuth;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный JSON.' }, { status: 400 });
  }

  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  const repId = String(body.repId ?? 'rep-demo').trim();
  const email = String(body.email ?? '').trim();
  const campaignIdParam = String(body.campaignId ?? '').trim();

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

  const emailConfigured = Boolean(process.env.WORKSHOP2_B2B_LINESHEET_SMTP_URL?.trim());
  const emailSent = emailConfigured && Boolean(email);

  return NextResponse.json({
    ok: true,
    shareUrl,
    token: token.token,
    expiresAt: token.expiresAt,
    configured: emailConfigured,
    emailSent,
    messageRu: email
      ? emailSent
        ? `Linesheet отправлен на ${email} (journal PG).`
        : `Ссылка создана для ${email}; SMTP не настроен — только journal PG.`
      : 'Ссылка rep linesheet создана (journal PG, без email).',
  });
}
