import { NextResponse } from 'next/server';
import { resolveWorkshop2SewingPlanReferencePayload } from '@/lib/production/workshop2-sewing-plan-reference-data';

/**
 * Справочники для паспорта: партнёры B2B (каталог брендов + демо или полный JSON из env) и
 * расширение списка субъектов РФ через `RF_FEDERAL_SUBJECT_EXTRA_JSON`.
 */
export async function GET() {
  return NextResponse.json(resolveWorkshop2SewingPlanReferencePayload());
}
