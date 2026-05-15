import { NextResponse } from 'next/server';
import { z } from 'zod';
import { observeApiRoute } from '@/lib/server/observe-api-route';
import { analyzeFitPhotos } from '@/ai/flows/analyze-fit-photos';

const RequestSchema = z.object({
  photoUrls: z.array(z.string().url().or(z.string().startsWith('data:image/'))),
});

export const POST = observeApiRoute(async (req) => {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { photoUrls } = parsed.data;

    // TODO: T-03-01 Tampering mitigation: validate URLs belong to trusted domains/S3
    const trustedUrls = photoUrls.filter(url => 
      url.startsWith('data:image/') || 
      url.includes('s3.amazonaws.com') || 
      url.includes('synth-platform.com')
    );

    if (trustedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No trusted photo URLs provided' },
        { status: 400 }
      );
    }

    const result = await analyzeFitPhotos({ photoUrls: trustedUrls, userId: 'api-user' });

    return NextResponse.json({ aiFitAnalysis: result });
  } catch (error) {
    console.error('AI Fit Analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during AI analysis' },
      { status: 500 }
    );
  }
});
