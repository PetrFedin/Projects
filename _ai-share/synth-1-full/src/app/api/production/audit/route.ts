import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entity = searchParams.get('entity') ?? 'all';
  const collectionIds = searchParams.get('collections')?.split(',').filter(Boolean) ?? [];
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);
  // Mock audit — далее заменить на БД
  const entries = [
    {
      id: 1,
      action: 'bom',
      actionLabel: 'Изменение BOM',
      entity: 'bom',
      collection: 'SS26',
      user: 'Анна К.',
      time: new Date().toISOString(),
      detail: 'Версия 2.4',
    },
    {
      id: 2,
      action: 'po',
      actionLabel: 'Amendment PO',
      entity: 'po',
      collection: 'SS26',
      user: 'Игорь М.',
      time: new Date().toISOString(),
      detail: 'PO-001: qty 500→480',
    },
    {
      id: 3,
      action: 'sample',
      actionLabel: 'Статус сэмпла',
      entity: 'sample',
      collection: 'SS26',
      user: 'Елена С.',
      time: new Date().toISOString(),
      detail: 'TP-9921 approved',
    },
  ]
    .filter((e) => entity === 'all' || e.entity === entity)
    .filter(
      (e) => collectionIds.length === 0 || (e.collection && collectionIds.includes(e.collection))
    )
    .slice(0, limit);
  return NextResponse.json({ entries });
}
