'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Target, Ruler } from 'lucide-react';

export default function BodyScannerPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">AI Сканер тела</h2>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          3D-сканирование и рекомендации размеров на основе измерений.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Scan className="h-4 w-4 text-indigo-600" />
              Scans completed
            </CardTitle>
            <CardDescription className="text-xs">Завершённых сканов</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Target className="h-4 w-4 text-emerald-600" />
              Accuracy rate
            </CardTitle>
            <CardDescription className="text-xs">Точность модели</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
              <Ruler className="h-4 w-4 text-amber-600" />
              Size recommendations generated
            </CardTitle>
            <CardDescription className="text-xs">Рекомендаций размера</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
