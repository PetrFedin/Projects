import { NextRequest, NextResponse } from 'next/server';
import { processBodyScan } from '@/ai/flows/body-scanner';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      userId?: string;
      frontImageUrl?: string;
      sideImageUrl?: string;
      height?: number;
      unit?: 'cm' | 'in';
    };

    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    const height = typeof body.height === 'number' ? body.height : NaN;
    const unit = body.unit === 'in' ? 'in' : body.unit === 'cm' ? 'cm' : undefined;

    if (!userId || !Number.isFinite(height) || height <= 0 || !unit) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message: 'userId, height (>0), unit (cm|in) are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await processBodyScan({
      userId,
      height,
      unit,
      frontImageUrl: typeof body.frontImageUrl === 'string' ? body.frontImageUrl : undefined,
      sideImageUrl: typeof body.sideImageUrl === 'string' ? body.sideImageUrl : undefined,
    });

    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to process body scan',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
