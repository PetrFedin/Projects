'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, ArrowLeft, DollarSign, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** NuOrder-style: планирование ассортимента байером по категориям/бюджету до заказа. */
const mockCategories = [
  { id: 'outerwear', name: 'Верхняя одежда', budget: 40, plannedUnits: 120 },
  { id: 'tops', name: 'Топы и блузы', budget: 25, plannedUnits: 200 },
  { id: 'bottoms', name: 'Брюки и юбки', budget: 20, plannedUnits: 150 },
  { id: 'shoes', name: 'Обувь', budget: 15, plannedUnits: 80 },
];

export default function B2BAssortmentPlanningPage() {
  const [totalBudget, setTotalBudget] = useState(2000000);
  const [categories, setCategories] = useState(mockCategories);

  const totalPlannedPercent = categories.reduce((s, c) => s + c.budget, 0);
  const byCategory = totalPlannedPercent ? categories.map(c => ({ ...c, amount: Math.round((totalBudget * c.budget) / 100) })) : [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-3xl pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.shop.b2bOrderMode}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase flex items-center gap-2"><Layers className="h-6 w-6" /> Планирование ассортимента</h1>
          <p className="text-slate-500 text-sm mt-0.5">Распределите бюджет по категориям перед заказом в матрице.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Бюджет и категории</CardTitle>
          <CardDescription>Задайте общий бюджет и долю по категориям. План можно перенести в матрицу заказа.</CardDescription>
          <div className="grid gap-2 pt-2 max-w-xs">
            <Label>Общий бюджет (₽)</Label>
            <Input type="number" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value) || 0)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {byCategory.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-medium">{c.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{c.budget}%</span>
                <span className="font-semibold">{c.amount.toLocaleString('ru-RU')} ₽</span>
                <span className="text-xs text-slate-400">{c.plannedUnits} ед. план</span>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-400 pt-2">Итого: {totalPlannedPercent}% от бюджета. После сохранения перейдите в матрицу и собирайте заказ в рамках плана.</p>
          <Button className="mt-2" asChild><Link href={ROUTES.shop.b2bMatrix}>Открыть матрицу заказа</Link></Button>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bBudget}><DollarSign className="h-3 w-3 mr-1" /> OTB Бюджет</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrderMode}>Режим заказа</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Матрица, заказы, аналитика, выставки" className="mt-6" />
    </div>
  );
}
