'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Percent } from 'lucide-react';
import { B2BModulePage } from '@/components/shop/B2BModulePage';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/** NuOrder: виджет расчёта маржи в корзине. */
export default function B2BMarginCalculatorPage() {
  const [buyPrice, setBuyPrice] = useState(10000);
  const [sellPrice, setSellPrice] = useState(15000);
  const margin = sellPrice > 0 ? ((sellPrice - buyPrice) / sellPrice * 100).toFixed(1) : '0';

  return (
    <B2BModulePage
      title="Margin Calculator"
      description="Расчёт маржи в корзине (NuOrder)"
      moduleId="margin-calculator"
      icon={Calculator}
      phase={2}
    >
      <Card>
        <CardHeader>
          <CardTitle>Калькулятор маржи</CardTitle>
          <CardDescription>Введите закупочную и розничную цену для расчёта маржинальности.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Закупочная цена (₽)</Label>
            <Input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value) || 0)} />
          </div>
          <div className="grid gap-2">
            <Label>Розничная цена (₽)</Label>
            <Input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value) || 0)} />
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <Percent className="h-4 w-4 text-slate-500" />
            <span className="font-semibold">Маржа: {margin}%</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop.b2bCollaborativeOrder}>Collaborative Order</Link>
          </Button>
        </CardContent>
      </Card>
    </B2BModulePage>
  );
}
