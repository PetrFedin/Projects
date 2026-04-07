/**
 * GET /api/b2b/colect/lookbook/[lookbookId]/structure — структура лукбука (главы, Key Looks).
 * При появлении API Colect — вызов реального эндпоинта.
 */

import { NextResponse } from 'next/server';
import { colectGetLookbookStructure } from '@/lib/b2b/integrations/archive/colect-client';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lookbookId: string }> }
) {
  try {
    const { lookbookId } = await params;
    if (!lookbookId) return NextResponse.json({ error: 'lookbookId required' }, { status: 400 });
    const structure = await colectGetLookbookStructure(lookbookId);
    return NextResponse.json(structure);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to get lookbook structure' },
      { status: 500 }
    );
  }
}
