import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2ServerDossierRecord,
  putWorkshop2ServerDossierRecord,
} from '@/lib/server/workshop2-phase1-dossier-server-store';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';
import {
  workshop2DossierPutFailureBody,
  workshop2DossierPutFailureStatus,
} from '@/lib/server/workshop2-dossier-put-utils';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export async function GET(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collectionId');
  const articleId = searchParams.get('articleId');

  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'Missing collectionId or articleId' }, { status: 400 });
  }

  const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  if (!record?.dossier) {
    return NextResponse.json(null);
  }

  return NextResponse.json(record.dossier);
}

export async function POST(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collectionId');
  const articleId = searchParams.get('articleId');

  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'Missing collectionId or articleId' }, { status: 400 });
  }

  let dossier: Workshop2DossierPhase1;
  try {
    dossier = (await request.json()) as Workshop2DossierPhase1;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!dossier || !Array.isArray(dossier.assignments)) {
    return NextResponse.json({ error: 'Invalid dossier payload' }, { status: 400 });
  }

  const existing = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  const result = await putWorkshop2ServerDossierRecord({
    collectionId,
    articleId,
    dossier,
    baseVersion: existing?.version,
  });
  if (!result.ok) {
    return NextResponse.json(workshop2DossierPutFailureBody(result), {
      status: workshop2DossierPutFailureStatus(result),
    });
  }

  return NextResponse.json({ success: true });
}
