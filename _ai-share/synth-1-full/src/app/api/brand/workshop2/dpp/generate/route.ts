import { NextResponse } from 'next/server';
import { calculateDPP, BOMItem } from '@/lib/platform/dpp-calculator';
import { observeApiRoute } from '@/lib/server/observe-api-route';

export const POST = observeApiRoute(async (req: Request) => {
  try {
    const body = await req.json();
    const { lines } = body as { lines: BOMItem[] };

    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json({ error: 'Invalid payload, expected { lines: BOMItem[] }' }, { status: 400 });
    }

    const metrics = calculateDPP(lines);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error generating DPP:', error);
    return NextResponse.json({ error: 'Failed to generate DPP' }, { status: 500 });
  }
});
