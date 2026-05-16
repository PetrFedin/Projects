import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'tmp-bundle-db.json');

async function readDb() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

async function writeDb(data: Record<string, any>) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collectionId');
  const articleId = searchParams.get('articleId');

  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'Missing collectionId or articleId' }, { status: 400 });
  }

  const db = await readDb();
  const key = `${collectionId}:${articleId}`;
  const bundle = db[key];

  if (!bundle) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(bundle);
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('collectionId');
  const articleId = searchParams.get('articleId');

  if (!collectionId || !articleId) {
    return NextResponse.json({ error: 'Missing collectionId or articleId' }, { status: 400 });
  }

  const patch = await request.json();
  const db = await readDb();
  const key = `${collectionId}:${articleId}`;
  
  const existing = db[key] || {
    schemaVersion: 1,
    collectionId,
    articleId,
    updatedAt: new Date().toISOString(),
  };

  const updated = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  db[key] = updated;
  await writeDb(db);

  return NextResponse.json(updated);
}
