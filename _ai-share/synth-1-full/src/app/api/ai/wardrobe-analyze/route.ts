import { NextRequest, NextResponse } from 'next/server';
import { analyzeWardrobe } from '@/ai/flows/analyze-wardrobe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, occasion } = body;

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
