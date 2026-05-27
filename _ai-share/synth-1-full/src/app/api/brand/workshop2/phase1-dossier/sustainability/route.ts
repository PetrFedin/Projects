import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { materialLines } = (await req.json()) as any;

    // Mock calculating sustainability
    let carbonSum = 0;
    let waterSum = 0;

    (materialLines || []).forEach((line: any) => {
      // randomly assign per line for mock
      carbonSum += 2.5 + Math.random() * 5;
      waterSum += 10 + Math.random() * 50;
    });

    if (carbonSum === 0) {
      carbonSum = 12.4;
      waterSum = 150;
    }

    const metrics = {
      passportId: `DPP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      carbonFootprint: carbonSum.toFixed(2),
      waterUsage: Math.round(waterSum),
      recycledContentPct: Math.round(15 + Math.random() * 60),
      ecoScore: Math.round(60 + Math.random() * 35),
    };

    return NextResponse.json({ metrics });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
