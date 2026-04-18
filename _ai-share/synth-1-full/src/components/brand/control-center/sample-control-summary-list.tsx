'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function SampleControlSummaryList() {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Samples</CardTitle>
      </CardHeader>
      <CardContent className="py-3 pt-0 text-xs text-muted-foreground">
        Sample pipeline summary placeholder.
      </CardContent>
    </Card>
  );
}
