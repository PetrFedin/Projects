/**
 * GET /api/b2b/sparklayer/quotes — список КП (Quoting).
 * POST /api/b2b/sparklayer/quotes — создание КП.
 * Query (GET): customerId, status, limit. Body (POST): SparkLayerCreateQuotePayload.
 */

import { NextResponse } from 'next/server';
import {
  sparkLayerGetQuotes,
  sparkLayerCreateQuote,
} from '@/lib/b2b/integrations/archive/sparklayer-core';
import type { SparkLayerCreateQuotePayload } from '@/lib/b2b/integrations/archive/sparklayer-core';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const quotes = await sparkLayerGetQuotes({ customerId, status, limit });
    return NextResponse.json(quotes);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SparkLayerCreateQuotePayload;
    if (!body?.customerId || !body?.lines?.length) {
      return NextResponse.json(
        { success: false, error: 'Body must include customerId and lines array' },
        { status: 400 }
      );
    }
    const result = await sparkLayerCreateQuote(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Create quote failed' },
      { status: 500 }
    );
  }
}
