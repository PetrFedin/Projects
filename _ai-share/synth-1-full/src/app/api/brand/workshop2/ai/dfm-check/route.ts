import { NextResponse } from 'next/server';
import { analyzeDfm } from '@/ai/flows/analyze-dfm-flow';
import { z } from 'zod';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';

const RequestSchema = z.object({
  articleDescription: z.string(),
  photoUrl: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const result = await analyzeDfm({
      articleDescription: parsed.data.articleDescription,
      photoUrl: parsed.data.photoUrl,
      userId: 'system', // Or extract from session if available
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('DFM check error:', error);
    return NextResponse.json(
      { error: getUnknownErrorMessage(error, 'Failed to run DFM check') },
      { status: 500 }
    );
  }
}
