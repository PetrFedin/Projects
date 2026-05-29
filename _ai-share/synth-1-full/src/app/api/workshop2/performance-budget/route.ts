import { NextResponse } from 'next/server';

import { buildWorkshop2PerformanceBudgetPayload } from '@/lib/production/workshop2-performance-budget-api';

/** GET — performance budget targets + LCP pass/fail (Wave 40/54). */
export async function GET() {
  const payload = buildWorkshop2PerformanceBudgetPayload();
  return NextResponse.json(payload);
}
