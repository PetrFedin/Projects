import { NextResponse } from 'next/server';

export function getOrCreateRequestId(req: Pick<Request, 'headers'>): string {
  const fromHeader = req.headers.get('x-request-id')?.trim();
  if (fromHeader) return fromHeader;
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}`;
}

export function jsonError(
  body: {
    code: string;
    message: string;
    status: number;
    meta?: unknown;
    cause?: unknown;
  },
  init?: ResponseInit
): NextResponse {
  const { status, ...payload } = body;
  return NextResponse.json(payload, { status, ...init });
}
