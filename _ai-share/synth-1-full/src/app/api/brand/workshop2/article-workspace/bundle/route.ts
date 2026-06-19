import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'tmp-bundle-db.json');

type ArticleWorkspaceBundle = Record<string, unknown> & {
  schemaVersion: number;
  collectionId: string;
  articleId: string;
  updatedAt: string;
};

async function readDb(): Promise<Record<string, ArticleWorkspaceBundle>> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(data);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, ArticleWorkspaceBundle>;
    }
    return {};
  } catch {
    return {};
  }
}

async function writeDb(data: Record<string, ArticleWorkspaceBundle>) {
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

  const patch = (await request.json()) as Record<string, unknown>;
  const db = await readDb();
  const key = `${collectionId}:${articleId}`;

  const existing: ArticleWorkspaceBundle =
    db[key] ??
    ({
      schemaVersion: 1,
      collectionId,
      articleId,
      updatedAt: new Date().toISOString(),
    } as ArticleWorkspaceBundle);

  const updated: ArticleWorkspaceBundle = {
    ...existing,
    ...patch,
    schemaVersion: 1,
    collectionId,
    articleId,
    updatedAt: new Date().toISOString(),
  };

  db[key] = updated;
  await writeDb(db);

  return NextResponse.json(updated);
}
