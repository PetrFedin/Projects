import { NextResponse } from 'next/server';
import { logObservability } from '@/lib/logger';

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as any;
    const { collectionId, articleId, bomLineId, unitCostNet, landedCost, currency } = body;

    logObservability('api.http', {
      route: '/api/brand/workshop2/phase1-dossier/bom-costing',
      method: 'PATCH',
      status: 200,
      latencyMs: 8,
    });

    if (!articleId || !bomLineId) {
      return NextResponse.json({ error: 'articleId and bomLineId are required' }, { status: 400 });
    }

    // Здесь в реальности мы бы обновили строку в БД досье и возможно синхронизировали с Costing-сервисом
    console.log('[BOM Costing Updated]', {
      articleId,
      bomLineId,
      unitCostNet,
      landedCost,
      currency,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, updated: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
