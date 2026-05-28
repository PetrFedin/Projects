import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';

import {
  getWorkshop2CollectionSignoffStages,
  putWorkshop2CollectionSignoffStages,
} from '@/lib/server/workshop2-signoff-stages-repository';

/** GET/PUT signoffStages[] per collection (Wave 7 #18). */
export async function GET(req: NextRequest) {
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim() ?? 'SS27';
  const stages = await getWorkshop2CollectionSignoffStages({ collectionId });
  return NextResponse.json({ ok: true, collectionId, stages });
}

export async function PUT(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const collectionId = String((body as { collectionId?: string }).collectionId ?? '').trim();
  const stages = (body as { stages?: unknown }).stages;
  if (!collectionId || !Array.isArray(stages)) {
    return jsonWorkshop2ErrorRu(400, 'invalid_request', {
      messageRu: 'Передайте collectionId и stages[].',
    });
  }
  const saved = await putWorkshop2CollectionSignoffStages({
    collectionId,
    stages: stages as Parameters<typeof putWorkshop2CollectionSignoffStages>[0]['stages'],
  });
  return NextResponse.json({
    ok: true,
    collectionId,
    stages: saved,
    messageRu: `Этапы signoff для ${collectionId} сохранены (${saved.length}).`,
  });
}
