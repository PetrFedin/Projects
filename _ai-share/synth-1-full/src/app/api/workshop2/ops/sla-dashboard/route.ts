import { NextResponse } from 'next/server';

import { buildWorkshop2OpsSlaDashboard } from '@/lib/production/workshop2-ops-sla-dashboard';

/** GET ops SLA dashboard — ACK p99, 3D error rate, SLO targets RU. */
export async function GET() {
  const dashboard = buildWorkshop2OpsSlaDashboard();
  return NextResponse.json({ ok: true, ...dashboard });
}
