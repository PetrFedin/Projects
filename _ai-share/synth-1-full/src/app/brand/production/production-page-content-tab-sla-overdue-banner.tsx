'use client';

import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ProductionPageContentTabSlaOverdueBanner({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { filteredSlaSamples } = px;
  const overdue = (filteredSlaSamples || []).filter((s: any) => s.slaOverdue);

  if (overdue.length === 0) return null;

  const suffix = overdue.length === 1 ? '' : overdue.length < 5 ? 'а' : 'ов';

  return (
    <Card className="rounded-xl border border-amber-200 bg-amber-50/50">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-[11px] font-bold">
            {overdue.length} сэмпл{suffix} просрочено:{' '}
            {overdue
              .slice(0, 3)
              .map((s: any) => s.skuName)
              .join(', ')}
            {overdue.length > 3 ? ` +${overdue.length - 3}` : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
