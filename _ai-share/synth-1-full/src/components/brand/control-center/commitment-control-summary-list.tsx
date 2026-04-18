'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CommitmentControlSummaryList() {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Commitments</CardTitle>
      </CardHeader>
      <CardContent className="py-3 pt-0 text-xs text-muted-foreground">
        Production commitment summary placeholder.
      </CardContent>
    </Card>
  );
}
