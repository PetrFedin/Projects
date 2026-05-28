import { NextResponse } from 'next/server';
import { computeAnalyticsKpis } from '@/lib/production/analytics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collectionIds = searchParams.get('collections')?.split(',').filter(Boolean) ?? [];
  // Mock data — далее заменить на реальные данные из БД
  const sampleStatuses = [
    { collection: 'SS26', slaOverdue: false, status: 'approved' },
    { collection: 'SS26', slaOverdue: true, status: 'pending' },
    { collection: 'DROP-UZ', slaOverdue: false, status: 'pending' },
  ].filter((s) => collectionIds.length === 0 || collectionIds.includes(s.collection));
  const productionOrders = [
    { collection: 'SS26', qty: 500 },
    { collection: 'DROP-UZ', qty: 120 },
  ].filter((o) => collectionIds.length === 0 || collectionIds.includes(o.collection));
  const collections = [
    { id: 'SS26', name: 'Summer Solstice 2026' },
    { id: 'DROP-UZ', name: 'Urban Zen Drop' },
    { id: 'BASIC', name: 'Core Basics' },
  ].filter((c) => collectionIds.length === 0 || collectionIds.includes(c.id));
  const budgets = [
    { collectionId: 'SS26', totalPlan: 4200000, totalFact: 3800000 },
    { collectionId: 'DROP-UZ', totalPlan: 850000, totalFact: 200000 },
  ].filter((b) => collectionIds.length === 0 || collectionIds.includes(b.collectionId));
  const kpis = computeAnalyticsKpis({
    collections,
    sampleStatuses,
    productionOrders,
    budgets,
  });
  const drillDown = collections.map((c) => {
    const samples = sampleStatuses.filter((s) => s.collection === c.id);
    const onTime = samples.filter((s) => !s.slaOverdue).length;
    const budget = budgets.find((b) => b.collectionId === c.id);
    const orders = productionOrders.filter((o) => o.collection === c.id);
    return {
      collectionId: c.id,
      collectionName: c.name,
      onTimePct: samples.length ? Math.round((onTime / samples.length) * 100) : 0,
      samplesTotal: samples.length,
      samplesOnTime: onTime,
      ordersTotal: orders.reduce((s, o) => s + (o.qty ?? 0), 0),
      budgetPlan: budget?.totalPlan ?? 0,
      budgetFact: budget?.totalFact ?? 0,
    };
  });
  return NextResponse.json({ kpis, drillDown });
}
