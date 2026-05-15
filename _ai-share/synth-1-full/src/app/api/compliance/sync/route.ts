import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TNVEDResolver } from '@/lib/compliance/tnved-resolver';
import { syncChestnyZnak } from '@/lib/compliance/chestny-znak-sync';

const syncPayloadSchema = z.object({
  batchId: z.string(),
  items: z.array(z.object({
    articleId: z.string(),
    category: z.string(),
    materialComposition: z.array(z.object({
      material: z.string(),
      percentage: z.number().int().nonnegative().max(100)
    }))
  }))
});

export async function POST(req: NextRequest) {
  // Threat Mitigation T-07-03-1: Require warehouse manager role/auth.
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || authHeader !== 'Bearer warehouse-manager-token') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const payload = syncPayloadSchema.parse(json);

    const resolver = new TNVEDResolver();
    const tnvedCodes = payload.items.map(item => 
      resolver.resolve({
        category: item.category,
        materialComposition: item.materialComposition,
        targetCountry: 'RU'
      })
    );

    // Threat Mitigation T-07-03-2: Use asynchronous processing (mocked queue) to prevent blocking HTTP requests.
    // Kick off background job (no await)
    syncChestnyZnak(payload.batchId, tnvedCodes).catch(err => {
      console.error('Chestny ZNAK sync background error:', err);
    });

    return NextResponse.json({ 
      status: 'ACCEPTED', 
      message: `Sync job for batch ${payload.batchId} accepted.` 
    }, { status: 202 });

  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
