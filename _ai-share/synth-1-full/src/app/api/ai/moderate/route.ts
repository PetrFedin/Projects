import { NextRequest, NextResponse } from 'next/server';
import { moderateContent } from '@/ai/flows/moderate-content';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const { text, context } = await readJsonBody<{ text?: string; context?: string }>(req);
    if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 });
    const result = await moderateContent({
      text,
      context: context as 'description' | 'review' | 'comment' | undefined,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error('[moderate] Failed:', e);
    return NextResponse.json({ error: 'Moderation failed' }, { status: 500 });
  }
}
