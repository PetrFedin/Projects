'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';

export function ProductionPageContentTabDashboardInsightsEvents({
  p,
}: {
  p: Record<string, unknown>;
}) {
  const px = p as Record<string, any>;
  const { setActiveTab, filteredEvents } = px;

  return (
    <>
      <ProductionSectionHeader title="Ближайшие события" barColor="bg-sky-500" />
      <Card className="border-border-subtle overflow-hidden rounded-xl border shadow-sm">
        <CardContent className="pt-4">
          <div className="max-h-36 space-y-2 overflow-y-auto">
            {(filteredEvents || []).slice(0, 5).map((e: any) => (
              <div
                key={e.id}
                className="border-border-subtle flex items-center justify-between border-b py-1.5 last:border-0"
              >
                <span className="flex-1 truncate text-[10px] font-medium">{e.title}</span>
                <span className="text-text-secondary text-[9px]">{e.date}</span>
                <Badge variant="outline" className="ml-2 text-[8px]">
                  {e.type}
                </Badge>
              </div>
            ))}
            {(!filteredEvents || filteredEvents.length === 0) && (
              <p className="text-text-muted py-4 text-[10px]">Нет ближайших событий</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-[9px]"
            onClick={() => setActiveTab?.('calendar')}
          >
            Календарь →
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
