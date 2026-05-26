import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reconcilePO } from '@/lib/b2b/intake/rfid-reconciliation-logic';

const reconcilePayloadSchema = z.object({
  purchaseOrderId: z.string(),
  epcs: z.array(z.string().regex(/^[0-9A-Za-z]+$/))
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const payload = reconcilePayloadSchema.parse(json);

    const result = reconcilePO(payload);
    if ('error' in result) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
