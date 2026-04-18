'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe2, Leaf, ShieldCheck } from 'lucide-react';

export default function DigitalPassportPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight">Цифровой паспорт</h1>
        <p className="mt-1 text-sm text-slate-500">
          Digital product passport with full traceability
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-sky-600" />
              <CardTitle className="text-sm">Происхождение материалов</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-slate-800">Италия · Турция · РФ</p>
            <p className="mt-1 text-[10px] text-slate-500">по SKU SS26-042</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <CardTitle className="text-sm">Углеродный след</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums">8.2 кг</p>
            <p className="mt-1 text-[10px] text-slate-500">CO₂e на единицу (оценка)</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
              <CardTitle className="text-sm">Сертификаты</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-slate-800">OEKO-TEX · GRS</p>
            <p className="mt-1 text-[10px] text-slate-500">действуют до 2027-06</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
