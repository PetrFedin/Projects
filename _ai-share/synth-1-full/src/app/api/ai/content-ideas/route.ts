import { NextRequest, NextResponse } from 'next/server';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const { brandName, theme, channel, count } = await readJsonBody<{
      brandName?: string;
      theme?: string;
      channel?: string;
      count?: number;
    }>(req);
    if (!brandName) return NextResponse.json({ error: 'brandName is required' }, { status: 400 });
    const result = await generateContentIdeas({
      brandName,
      theme,
      channel: channel as 'instagram' | 'telegram' | 'blog' | 'email' | undefined,
      count,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error('[content-ideas] Failed:', e);
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
