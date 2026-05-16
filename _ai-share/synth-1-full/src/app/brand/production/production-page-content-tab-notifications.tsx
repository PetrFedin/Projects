'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabNotifications({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { notificationsList } = px;

  return (
<TabsContent value="notifications" className={cabinetSurface.cabinetProfileTabPanel}>
  <ProductionSectionHeader title="Уведомления" barColor="bg-rose-600" />
  <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
    <CardHeader>
      <CardTitle className="text-xs font-black uppercase">Уведомления</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {(notificationsList || []).map((n: any) => (
          <div
            key={n.id}
            className={cn(
              'rounded-lg border p-3',
              !n.read && 'bg-accent-primary/10 border-accent-primary/20'
            )}
          >
            <p className="text-[10px] font-medium">{n.title}</p>
            <p className="text-text-secondary text-[9px]">{n.time}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>
  );
}
