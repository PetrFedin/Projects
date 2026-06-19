import { NextResponse } from 'next/server';
import { z } from 'zod';
import { observeApiRoute } from '@/lib/server/observe-api-route';
import { detectDefectsGenkitFlow } from '@/ai/flows/detect-defects-flow';
import { getUnknownErrorMessage } from '@/lib/unknown-error-message';

const RequestSchema = z.object({
  imageBase64: z.string().describe('Base64 image data or data URL'),
});

async function detectDefectsHandler(request: Request) {
  try {
    const json = await request.json();
    const parsed = RequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Limit base64 length to prevent DoS (approx 10MB payload)
    if (parsed.data.imageBase64.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image too large' }, { status: 413 });
    }

    // Execute flow
    const result = await detectDefectsGenkitFlow({ imageBase64: parsed.data.imageBase64 });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      'AI Detect Error:',
      getUnknownErrorMessage(error, 'Unknown error during AI defect detection')
    );
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return observeApiRoute(request, '/api/brand/workshop2/qc/detect', () =>
    detectDefectsHandler(request)
  );
}
