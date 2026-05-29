import { NextResponse } from 'next/server';

import { buildWorkshop2InvestorDemoEnvCheck } from '@/lib/production/workshop2-investor-demo-mode';

/** GET — ops debug: raw env + demoModeComputed (Wave 58 investor prep). */
export async function GET() {
  const check = buildWorkshop2InvestorDemoEnvCheck();
  return NextResponse.json({ ok: true, ...check });
}
