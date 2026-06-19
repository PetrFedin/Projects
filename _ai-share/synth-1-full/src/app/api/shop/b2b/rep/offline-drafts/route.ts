import { NextResponse } from 'next/server';

import type { ShopRepOfflineDraft } from '@/lib/shop/shop-rep-offline-drafts-store.types';
import {
  appendShopRepOfflineDraftServer,
  getShopRepOfflineDraftsServer,
  shopRepOfflineDraftsStorageMode,
} from '@/lib/server/shop-rep-offline-drafts-repository';

/** GET /api/shop/b2b/rep/offline-drafts — queued rep drafts (file / memory). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const repId = url.searchParams.get('repId')?.trim() || 'rep-demo';
  const config = await getShopRepOfflineDraftsServer(repId);
  return NextResponse.json({
    ok: true,
    config,
    storageMode: shopRepOfflineDraftsStorageMode(),
  });
}

/** POST /api/shop/b2b/rep/offline-drafts — append draft for rep. */
export async function POST(req: Request) {
  const body = (await req.json()) as {
    repId?: string;
    draft?: ShopRepOfflineDraft;
  };
  const repId = body.repId?.trim() || 'rep-demo';
  const draft = body.draft;
  if (!draft?.id || !draft.createdAt) {
    return NextResponse.json({ ok: false, messageRu: 'Некорректный draft' }, { status: 400 });
  }
  const config = await appendShopRepOfflineDraftServer({
    repId,
    draft: { ...draft, repId: draft.repId?.trim() || repId },
  });
  return NextResponse.json({
    ok: true,
    config,
    storageMode: shopRepOfflineDraftsStorageMode(),
  });
}
