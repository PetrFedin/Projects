import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MOCK_DB_PATH = path.join(process.cwd(), 'tmp-dossier-db.json');

async function readDb(): Promise<Record<string, any>> {
  try {
    const data = await fs.readFile(MOCK_DB_PATH, 'utf8');
    return JSON.parse(data) as Record<string, any>;
  } catch (err) {
    // If file doesn't exist or is invalid JSON, return empty object
    return {};
  }
}

async function writeDb(data: Record<string, any>): Promise<void> {
  await fs.writeFile(MOCK_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getStorageKey(collectionId: string, articleId: string): string {
  const safeSegment = (id: string) => id.replace(/:/g, '_');
  return `${safeSegment(collectionId)}::${safeSegment(articleId)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collectionId');
  const articleId = searchParams.get('articleId');

  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'Missing collectionId or articleId' }, { status: 400 });
  }

  const db = await readDb();
  const key = getStorageKey(collectionId, articleId);
  const dossier = db[key];

  if (!dossier) {
    return NextResponse.json(null);
  }

  return NextResponse.json(dossier);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collectionId');
  const articleId = searchParams.get('articleId');

  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'Missing collectionId or articleId' }, { status: 400 });
  }

  let dossier;
  try {
    dossier = await request.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const db = await readDb();
  const key = getStorageKey(collectionId, articleId);
  db[key] = dossier;

  await writeDb(db);

  return NextResponse.json({ success: true });
}
