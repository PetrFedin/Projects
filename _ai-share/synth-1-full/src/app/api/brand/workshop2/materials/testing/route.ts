import { NextResponse } from 'next/server';

function dossierContextMissing(req: Request): boolean {
  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get('collectionId')?.trim();
  const articleId = searchParams.get('articleId')?.trim();
  return !collectionId || !articleId;
}

export async function GET(request: Request) {
  if (dossierContextMissing(request)) {
    return NextResponse.json({ error: 'dossier_required' }, { status: 503 });
  }

  return NextResponse.json({ testingLogs: [] });
}

export async function POST(request: Request) {
  if (dossierContextMissing(request)) {
    return NextResponse.json({ error: 'dossier_required' }, { status: 503 });
  }

  return NextResponse.json(
    { error: 'Material tests require dossier PG mirror (not legacy mock).' },
    { status: 503 }
  );
}
