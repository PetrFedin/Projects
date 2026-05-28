'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ArticleControlSummaryList() {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Articles</CardTitle>
      </CardHeader>
      <CardContent className="py-3 pt-0 text-xs text-muted-foreground">
        Article readiness summary placeholder.
      </CardContent>
    </Card>
  );
}
