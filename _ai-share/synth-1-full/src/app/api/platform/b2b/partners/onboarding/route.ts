import { NextRequest, NextResponse } from 'next/server';

import { listPlatformB2bPartnersOnboarding } from '@/lib/server/platform-b2b-partners-onboarding-server';

/** GET — platform view of shop↔brand onboarding rows (profile → requested → connected). */
export async function GET(req: NextRequest) {
  const buyerId = req.nextUrl.searchParams.get('buyerId')?.trim();
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();

  const result = await listPlatformB2bPartnersOnboarding({ buyerId, collectionId });

  return NextResponse.json({
    ok: true,
    buyerId: result.buyerId,
    collectionId: result.collectionId,
    rows: result.rows,
    counts: result.counts,
    storageMode: result.storageMode,
    messageRu: `${result.counts.connected} connected · ${result.counts.requested} requested · ${result.counts.profile} profile (${result.storageMode}).`,
  });
}
