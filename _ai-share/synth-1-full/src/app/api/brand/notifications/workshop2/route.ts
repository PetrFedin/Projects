/**
 * GET /api/brand/notifications/workshop2 — domain events + chat + calendar overdue.
 */
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2BrandNotificationsSummary } from '@/lib/production/workshop2-brand-notifications-hub';
import { guardWorkshop2Route } from '@/lib/server/workshop2-route-auth';

export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, ['brand']);
  if (auth instanceof NextResponse) return auth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() ?? 'SS27';
  const summary = await buildWorkshop2BrandNotificationsSummary({ collectionId });

  return NextResponse.json({
    ok: true,
    bellCount: summary.totalCount,
    ...summary,
  });
}
