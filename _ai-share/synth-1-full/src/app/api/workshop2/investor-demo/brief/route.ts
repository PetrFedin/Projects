import { NextResponse } from 'next/server';

import { buildWorkshop2InvestorDemoBrief } from '@/lib/production/workshop2-investor-demo-brief';

/** GET — one-screen investor dashboard JSON (Wave 58). */
export async function GET() {
  const brief = buildWorkshop2InvestorDemoBrief();
  return NextResponse.json({ ok: true, ...brief });
}
