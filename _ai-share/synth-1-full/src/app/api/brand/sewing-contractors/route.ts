import { NextResponse } from 'next/server';
import { resolveWorkshop2SewingContractorsPayload } from '@/lib/production/workshop2-sewing-plan-reference-data';

/** Отдельный endpoint контрагентов пошива (без справочника регионов РФ). */
export async function GET() {
  return NextResponse.json(resolveWorkshop2SewingContractorsPayload());
}
