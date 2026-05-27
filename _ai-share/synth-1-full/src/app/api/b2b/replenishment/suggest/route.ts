import { NextResponse } from 'next/server';
import { calculateReplenishment } from '@/lib/b2b/replenishment-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bomLines, plannedQuantity } = body;

    if (!bomLines || !Array.isArray(bomLines)) {
      return NextResponse.json({ error: 'bomLines array is required' }, { status: 400 });
    }

    const qty = typeof plannedQuantity === 'number' && plannedQuantity > 0 ? plannedQuantity : 100;

    // Using Zod for validation would be better for Threat T-02-04, let's validate non-negative
    const validatedLines = bomLines.filter(
      (line) =>
        (line.qty === undefined || line.qty >= 0) &&
        (line.costPerUnit === undefined || line.costPerUnit >= 0)
    );

    const suggestions = calculateReplenishment(validatedLines, qty);

    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate replenishment' }, { status: 500 });
  }
}
