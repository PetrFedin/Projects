'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function ProductionPageContentTabDashboardInsightsBudget({
  p,
}: {
  p: Record<string, unknown>;
}) {
  const px = p as Record<string, any>;
  const { setActiveTab, collections, collectionBudgets } = px;

  const overBudgets = (collectionBudgets || []).filter(
    (b: any) => (b.totalPlan || 0) - (b.totalFact || 0) < 0
  );

  if (overBudgets.length === 0) return null;

  return (
    <Card className="rounded-xl border border-rose-200 bg-rose-50/50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 text-rose-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="text-[11px] font-bold">Перерасход бюджета</p>
            <p className="text-[10px] text-rose-600">
              Коллекции:{' '}
              {overBudgets
                .map(
                  (b: any) =>
                    collections?.find((c: any) => c.id === b.collectionId)?.name ||
                    b.collectionId
                )
                .join(', ')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto h-7 border-rose-200 text-[9px] text-rose-700"
            onClick={() => setActiveTab?.('budget')}
          >
            Бюджет →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
