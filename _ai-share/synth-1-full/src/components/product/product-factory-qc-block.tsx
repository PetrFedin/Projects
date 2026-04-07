'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getProductQcStatus } from '@/lib/fashion/factory-qc-logic';
import { ClipboardCheck, CheckCircle2, XCircle, AlertCircle, Calendar } from 'lucide-react';

type Props = { product: Product };

export function ProductFactoryQcBlock({ product }: Props) {
  const qc = getProductQcStatus(product.sku);
  if (!qc) return null;

  return (
    <Card className="mt-4 border-dashed bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4" />
          Factory QC Report
        </CardTitle>
        <CardDescription className="text-xs">Результаты финальной инспекции на фабрике.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Status:</span>
            <Badge variant={qc.overallResult === 'approved' ? 'default' : 'destructive'} className="text-[9px] h-4">
              {qc.overallResult.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {qc.date}
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t">
          {qc.checks.map(check => (
            <div key={check.id} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{check.label}</span>
              <div className="flex items-center gap-1.5">
                {check.status === 'pass' ? (
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                ) : check.status === 'fail' ? (
                  <XCircle className="h-3 w-3 text-rose-600" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                )}
                <span className="font-medium">{check.status}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground italic leading-tight pt-1">
          Inspector: {qc.inspector}
        </p>
      </CardContent>
    </Card>
  );
}
