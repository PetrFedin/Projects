/**
 * GET /api/b2b/colect/lookbook/[lookbookId]/content — контент лукбука (фото, видео, 3D), режимы показа.
 * Query: chapterId, type (photo|video|3d).
 */

import { NextResponse } from 'next/server';
import { colectGetLookbookContent } from '@/lib/b2b/integrations/archive/colect-client';
import type { ColectContentType } from '@/lib/b2b/integrations/archive/colect-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lookbookId: string }> }
) {
  try {
    const { lookbookId } = await params;
    if (!lookbookId) return NextResponse.json({ error: 'lookbookId required' }, { status: 400 });
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId') ?? undefined;
    const type = searchParams.get('type') as ColectContentType | undefined;
    const content = await colectGetLookbookContent(lookbookId, { chapterId, type });
    return NextResponse.json(content);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to get lookbook content' },
      { status: 500 }
    );
  }
}
