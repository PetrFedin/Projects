import { NextResponse } from 'next/server';
import { resolveWorkshop2SewingContractorsPayload } from '@/lib/production/workshop2-sewing-plan-reference-data';

/**
 * Плоский контракт контрагентов (партнёры пошива) для переиспользования вне полного reference payload.
 */
export async function GET() {
  const { partners, source } = resolveWorkshop2SewingContractorsPayload();
  return NextResponse.json({
    partners,
    source: {
      partnersCount: partners.length,
      partnersSource: source.partners,
    },
  });
}
