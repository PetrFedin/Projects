import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';

import {
  getWorkshop2CollectionDefaults,
  putWorkshop2CollectionDefaults,
  normalizeWorkshop2CollectionDefaults,
} from '@/lib/production/workshop2-collection-defaults';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

/** GET/PUT /api/workshop2/setup/collection-defaults?collectionId=SS27 */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const collectionId = new URL(req.url).searchParams.get('collectionId')?.trim();
  if (!collectionId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_request', {
      messageRu: 'Укажите collectionId в query.',
    });
  }

  const defaults = getWorkshop2CollectionDefaults(collectionId);
  return NextResponse.json({ ok: true, collectionId, defaults });
}

export async function PUT(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const b = body as Record<string, unknown>;
  const collectionId = String(b.collectionId ?? '').trim();
  if (!collectionId) {
    return jsonWorkshop2ErrorRu(400, 'missing_collection_id');
  }

  const defaults = putWorkshop2CollectionDefaults({
    collectionId,
    defaults: normalizeWorkshop2CollectionDefaults({
      vatPercent: typeof b.vatPercent === 'number' ? b.vatPercent : undefined,
      markingRequiredDefault:
        typeof b.markingRequiredDefault === 'boolean' ? b.markingRequiredDefault : undefined,
      currency: 'RUB',
    }),
  });

  return NextResponse.json({ ok: true, collectionId, defaults });
}
