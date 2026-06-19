import { NextRequest, NextResponse } from 'next/server';

import {
  assignWorkshop2ArticleRangePlannerTier,
  patchWorkshop2CollectionRangePlannerTier,
} from '@/lib/server/workshop2-range-planner-repository';
import { bumpPlatformCoreDevelopmentStatus } from '@/lib/server/platform-core-development-status-hub';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

/** PATCH — обновить бюджет/маржу tier в metadata коллекции. */
export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawId } = await ctx.params;
  const collectionId = rawId?.trim();
  if (!collectionId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан collectionId.' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный JSON.' }, { status: 400 });
  }

  const b = body as {
    tier?: string;
    budget?: number;
    targetMargin?: number;
    articleId?: string;
    assignTier?: boolean;
  };

  if (b.articleId?.trim() && b.tier?.trim()) {
    const assign = await assignWorkshop2ArticleRangePlannerTier({
      collectionId,
      articleId: b.articleId.trim(),
      tier: b.tier,
    });
    if (!assign.ok) {
      const status =
        assign.error === 'pg_disabled'
          ? 503
          : assign.error === 'not_found'
            ? 404
            : assign.error === 'version_conflict'
              ? 409
              : 400;
      return NextResponse.json(
        { ok: false, error: assign.error, messageRu: assign.messageRu },
        { status }
      );
    }
    bumpPlatformCoreDevelopmentStatus([collectionId]);
    return NextResponse.json({ ok: true, assigned: true });
  }

  const result = await patchWorkshop2CollectionRangePlannerTier({
    collectionId,
    tier: b.tier ?? '',
    budget: typeof b.budget === 'number' ? b.budget : undefined,
    targetMargin: typeof b.targetMargin === 'number' ? b.targetMargin : undefined,
  });

  if (!result.ok) {
    const status =
      result.error === 'pg_disabled'
        ? 503
        : result.error === 'invalid_tier' || result.error === 'empty_patch'
          ? 400
          : 400;
    return NextResponse.json(
      { ok: false, error: result.error, messageRu: result.messageRu },
      { status }
    );
  }

  bumpPlatformCoreDevelopmentStatus([collectionId]);
  return NextResponse.json({ ok: true });
}
