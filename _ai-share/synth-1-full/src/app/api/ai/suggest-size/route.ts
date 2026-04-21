import { NextRequest, NextResponse } from 'next/server';
import { suggestSize } from '@/ai/flows/suggest-size';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(req: NextRequest) {
  try {
    const {
      productName,
      category,
      sizeChart,
      userHeight,
      userWeight,
      userChest,
      userWaist,
      userHips,
      userQuestion,
    } = await readJsonBody<{
      productName?: string;
      category?: string;
      sizeChart?: unknown;
      userHeight?: unknown;
      userWeight?: unknown;
      userChest?: unknown;
      userWaist?: unknown;
      userHips?: unknown;
      userQuestion?: string;
    }>(req);
    if (!productName || !category) {
      return NextResponse.json({ error: 'productName and category are required' }, { status: 400 });
    }
    const result = await suggestSize({
      productName,
      category,
      sizeChart:
        sizeChart === undefined || sizeChart === null
          ? undefined
          : typeof sizeChart === 'string'
            ? sizeChart
            : String(sizeChart),
      userHeight: userHeight ? Number(userHeight) : undefined,
      userWeight: userWeight ? Number(userWeight) : undefined,
      userChest: userChest ? Number(userChest) : undefined,
      userWaist: userWaist ? Number(userWaist) : undefined,
      userHips: userHips ? Number(userHips) : undefined,
      userQuestion,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error('[suggest-size] Failed:', e);
    return NextResponse.json({ error: 'Failed to suggest size' }, { status: 500 });
  }
}
