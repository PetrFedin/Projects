'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BudgetCategoryBreakdown } from '@/components/brand/production/ProductionSectionEnhancements';
import { cn } from '@/lib/utils';

export function ProductionPageContentTabBudgetCards({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { collectionBudgets, selectedId, collections } = px;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(collectionBudgets || [])
        .filter((b: any) => !selectedId || b.collectionId === selectedId)
        .map((b: any) => {
          const coll = collections?.find((c: any) => c.id === b.collectionId);
          const remainder = (b.totalPlan || 0) - (b.totalFact || 0);
          const pct = b.totalPlan ? Math.round((b.totalFact / b.totalPlan) * 100) : 0;
          const isOver = remainder < 0;
          return (
            <Card
              key={b.collectionId}
              className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={cn(
                  'h-1 w-full',
                  isOver ? 'bg-rose-500' : 'to-accent-primary bg-gradient-to-r from-emerald-500'
                )}
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-tight">
                  {coll?.name || b.collectionId}
                </CardTitle>
                <CardDescription className="mt-2 space-y-1 text-[11px]">
                  <span>План {(b.totalPlan / 1000).toFixed(0)}k ₽</span> ·{' '}
                  <span>Факт {(b.totalFact / 1000).toFixed(0)}k ₽</span>
                  <span
                    className={cn(
                      'mt-1 block font-bold',
                      remainder >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    Остаток: {(remainder / 1000).toFixed(0)}k ₽
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <BudgetCategoryBreakdown
                  categories={b.categories || []}
                  totalPlan={b.totalPlan}
                  totalFact={b.totalFact}
                />
                <Progress
                  value={Math.min(pct, 100)}
                  className={cn('h-2', isOver && '[&>div]:bg-rose-500')}
                  aria-label={`Бюджет «${coll?.name ?? b.collectionId}»: факт к плану ${Math.min(pct, 100)}%`}
                />
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
