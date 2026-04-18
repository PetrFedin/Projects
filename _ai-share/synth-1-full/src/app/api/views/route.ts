import { NextResponse } from 'next/server';
import { createView, listViews } from '../../../services/viewsStore';
import { normalizeFilters } from '../../../lib/serverQuery';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const scope = url.searchParams.get('scope') as 'personal' | 'team' | null;
  const views = listViews(scope ?? undefined);
  return NextResponse.json({ views });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? 'Untitled view');
  const scope = (body.scope === 'team' ? 'team' : 'personal') as 'personal' | 'team';
  const ownerId = scope === 'personal' ? 'me' : undefined;

  const filters = normalizeFilters(body.filters ?? {});
  const v = createView({ name, scope, ownerId, filters });

  return NextResponse.json({ view: v }, { status: 201 });
}
