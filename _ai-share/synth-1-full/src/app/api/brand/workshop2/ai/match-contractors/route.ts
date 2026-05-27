import { NextResponse } from 'next/server';
import { matchContractors } from '@/ai/flows/match-contractors-flow';
import { resolveWorkshop2SewingContractorsPayload } from '@/lib/production/workshop2-sewing-plan-reference-data';
import { z } from 'zod';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';

const RequestSchema = z.object({
  articleDescription: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Fetch contractors internally
    const contractorsPayload = resolveWorkshop2SewingContractorsPayload();

    const result = await matchContractors({
      articleDescription: parsed.data.articleDescription,
      contractors: contractorsPayload.partners,
      userId: 'system', // Or extract from session
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Match contractors error:', error);
    return NextResponse.json(
      { error: getUnknownErrorMessage(error, 'Failed to run matchmaker') },
      { status: 500 }
    );
  }
}
