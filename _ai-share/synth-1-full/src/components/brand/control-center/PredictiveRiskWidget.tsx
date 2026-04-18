'use client';

import type { RiskFactor } from '@/lib/control/control-aggregator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PredictiveRiskWidget({ risks }: { risks: RiskFactor[] }) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Predictive risks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 py-3 pt-0">
        {risks.length === 0 ? (
          <p className="text-xs text-muted-foreground">No risk factors flagged.</p>
        ) : (
          risks.map((r, i) => (
            <div key={`${r.type}-${i}`} className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="secondary" className="font-mono text-[10px]">
                {r.type}
              </Badge>
              <span className="text-muted-foreground">{r.message}</span>
              <span className="ml-auto tabular-nums opacity-70">
                {(r.severity * 100).toFixed(0)}%
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
