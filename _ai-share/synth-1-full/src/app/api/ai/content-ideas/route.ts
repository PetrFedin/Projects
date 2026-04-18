import { NextRequest, NextResponse } from 'next/server';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandName, theme, channel, count } = body;
    if (!brandName) return NextResponse.json({ error: 'brandName is required' }, { status: 400 });
    const result = await generateContentIdeas({ brandName, theme, channel, count });
    return NextResponse.json(result);
  } catch (e) {
    console.error('[content-ideas] Failed:', e);
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
