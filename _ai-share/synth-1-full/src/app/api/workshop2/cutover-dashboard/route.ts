import { NextResponse } from 'next/server';

import { buildWorkshop2CutoverDashboard } from '@/lib/production/workshop2-cutover-dashboard';

/** GET cutover dashboard — wave45–52 probes + human signoff gate RU. */
export async function GET() {
  const dashboard = buildWorkshop2CutoverDashboard();
  return NextResponse.json({ ok: true, ...dashboard });
}
