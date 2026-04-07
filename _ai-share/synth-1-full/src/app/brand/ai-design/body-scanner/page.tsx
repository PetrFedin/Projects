'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Target, Ruler } from 'lucide-react';

export default function BodyScannerPage() {
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <div>
        <h2 className="text-lg font-black uppercase tracking-tight">AI Сканер тела</h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">
          3D-сканирование и рекомендации размеров на основе измерений.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-xl border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
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
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
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
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
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
