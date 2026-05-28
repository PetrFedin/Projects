'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function OrderControlSummaryList() {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Orders</CardTitle>
      </CardHeader>
      <CardContent className="py-3 pt-0 text-xs text-muted-foreground">
        Control summary placeholder — wire to order aggregate when available.
      </CardContent>
    </Card>
  );
}
