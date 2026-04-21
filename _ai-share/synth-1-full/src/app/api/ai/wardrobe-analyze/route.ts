import { NextRequest, NextResponse } from 'next/server';
import { analyzeWardrobe } from '@/ai/flows/analyze-wardrobe';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const { items, occasion } = await readJsonBody<{ items?: unknown; occasion?: string }>(req);

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items array is required' }, { status: 400 });
    }

    const result = await analyzeWardrobe({
      items: items.map((it: any) => ({
        title: it.title ?? it.name ?? '',
        category: it.category ?? '',
        color: it.color,
        tags: Array.isArray(it.tags) ? it.tags : [],
      })),
      occasion,
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error('[wardrobe-analyze] Failed:', e);
    return NextResponse.json({ error: 'Failed to analyze wardrobe' }, { status: 500 });
  }
}
