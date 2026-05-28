import { NextRequest, NextResponse } from 'next/server';
import { suggestSupportReply } from '@/ai/flows/suggest-support-reply';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const { customerMessage, faq, context } = await readJsonBody<{
      customerMessage?: string;
      faq?: unknown;
      context?: string;
    }>(req);
    if (!customerMessage)
      return NextResponse.json({ error: 'customerMessage is required' }, { status: 400 });
    const result = await suggestSupportReply({
      customerMessage,
      faq: faq as { question: string; answer: string }[] | undefined,
      context,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error('[support-reply] Failed:', e);
    return NextResponse.json({ error: 'Failed to suggest reply' }, { status: 500 });
  }
}
