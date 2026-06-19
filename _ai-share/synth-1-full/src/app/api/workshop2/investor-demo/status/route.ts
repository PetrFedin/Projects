import { NextResponse } from 'next/server';

import { buildWorkshop2InvestorDemoStatusReport } from '@/lib/production/workshop2-investor-demo-status';

/** GET — investor demo readiness (auto-gates + signoff, без fake success). */
export async function GET() {
  const report = buildWorkshop2InvestorDemoStatusReport();
  return NextResponse.json({
    ok: true,
    ...report,
  });
}
