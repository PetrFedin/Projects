import { NextResponse } from 'next/server';
import { logObservability } from '@/lib/logger';

// Мок-хранилище в памяти для разработки (в реальном приложении - БД)
let mockFitSessions: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId');

  logObservability('api.http', {
    route: '/api/brand/workshop2/fit-sessions',
    method: 'GET',
    status: 200,
    latencyMs: 5,
  });

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
  }

  const sessions = mockFitSessions.filter((s) => s.articleId === articleId);
  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    
    logObservability('api.http', {
      route: '/api/brand/workshop2/fit-sessions',
      method: 'POST',
      status: 201,
      latencyMs: 15,
    });

    const newSession = {
      ...body,
      id: body.id || globalThis.crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    mockFitSessions.push(newSession);

    return NextResponse.json({ success: true, session: newSession }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Bad Request' }, { status: 400 });
  }
}
