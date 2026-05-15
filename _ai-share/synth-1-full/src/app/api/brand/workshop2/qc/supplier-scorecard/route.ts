import { NextResponse } from 'next/server';
import { observeApiRoute } from '@/lib/server/observe-api-route';

async function supplierScorecardHandler(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierId = searchParams.get('supplierId');

  if (!supplierId) {
    return NextResponse.json({ error: 'supplierId is required' }, { status: 400 });
  }

  // Mock data until read-model DB is integrated
  const mockData = {
    totalBatches: 120,
    passed: 105,
    failed: 5,
    rework: 10,
    passRate: 87.5,
    defectTypes: [
      { name: 'Кривой шов', value: 45 },
      { name: 'Пятно', value: 25 },
      { name: 'Разрыв', value: 15 },
      { name: 'Прочее', value: 15 },
    ],
  };

  return NextResponse.json(mockData);
}

export const GET = observeApiRoute(supplierScorecardHandler);
