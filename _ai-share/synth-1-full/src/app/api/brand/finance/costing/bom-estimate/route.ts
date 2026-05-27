import { NextResponse } from 'next/server';
import { logObservability } from '@/lib/logger';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId');

  logObservability('api.http', {
    route: '/api/brand/finance/costing/bom-estimate',
    method: 'GET',
    status: 200,
    latencyMs: 12,
  });

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
  }

  // Мок-логика: возвращаем фейковую плановую себестоимость на основе артикула
  const estimate = {
    articleId,
    totalLandedCost: 15.4,
    currency: 'USD',
    bomCoveragePct: 85, // процент строк BOM с ценами
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(estimate);
}
