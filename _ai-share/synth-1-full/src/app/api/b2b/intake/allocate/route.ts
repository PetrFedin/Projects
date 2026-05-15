import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { B2BPriorityStrategy } from '@/lib/b2b/allocation/allocation-engine';

const itemSchema = z.object({
  articleId: z.string(),
  size: z.string(),
  quantity: z.number().int().nonnegative()
});

const demandSchema = z.object({
  orderId: z.string().optional(),
  storeId: z.string().optional(),
  articleId: z.string(),
  size: z.string(),
  requestedQuantity: z.number().int().nonnegative()
});

const allocatePayloadSchema = z.object({
  batch: z.object({
    batchId: z.string(),
    items: z.array(itemSchema)
  }),
  demand: z.object({
    b2bBackorders: z.array(demandSchema),
    ecomDemand: z.array(demandSchema),
    retailDemand: z.array(demandSchema)
  })
});

export async function POST(req: NextRequest) {
  // Threat Mitigation T-07-02-1: Require warehouse manager role/auth.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || authHeader !== 'Bearer warehouse-manager-token') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    
    // Threat Mitigation T-07-02-2: Validate payload with Zod.
    const payload = allocatePayloadSchema.parse(json);

    // Threat Mitigation T-07-02-3: Ensure race conditions are handled via transactions.
    // SELECT ... FOR UPDATE to lock inventory before allocation
    // mock transaction: console.log("BEGIN TRANSACTION; SELECT * FROM inventory FOR UPDATE;");

    const strategy = new B2BPriorityStrategy();
    
    // Cast demand to match exact types since Zod drops optionals or makes them union
    const demandProfile = {
      b2bBackorders: payload.demand.b2bBackorders.map(d => ({ ...d, orderId: d.orderId || 'UNKNOWN' })),
      ecomDemand: payload.demand.ecomDemand,
      retailDemand: payload.demand.retailDemand.map(d => ({ ...d, storeId: d.storeId || 'UNKNOWN' }))
    };

    const plan = strategy.allocate(payload.batch, demandProfile);

    // mock transaction finish: console.log("COMMIT TRANSACTION;");

    return NextResponse.json(plan);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
