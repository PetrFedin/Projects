'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingBasket, Layers, Bookmark } from 'lucide-react';

export default function MultiCartPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Несколько корзин</h1>
        <p className="text-sm text-slate-500">
          Несколько черновиков заказа и сохранённые корзины для байеров.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <ShoppingBasket className="mb-2 h-5 w-5 text-indigo-600" />
            <CardTitle className="text-sm font-bold">Active carts</CardTitle>
            <CardDescription className="text-xs">Активные корзины</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <Layers className="mb-2 h-5 w-5 text-emerald-600" />
            <CardTitle className="text-sm font-bold">Avg items per cart</CardTitle>
            <CardDescription className="text-xs">Среднее число позиций</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <Bookmark className="mb-2 h-5 w-5 text-amber-600" />
            <CardTitle className="text-sm font-bold">Saved carts</CardTitle>
            <CardDescription className="text-xs">Сохранённые корзины</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black tabular-nums text-slate-900">—</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
