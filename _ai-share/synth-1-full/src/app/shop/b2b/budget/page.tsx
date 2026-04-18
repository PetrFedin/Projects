'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Download,
  PlusCircle,
  TrendingUp,
  Sparkles,
  History,
  Globe,
  RefreshCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { B2BFintech } from '@/components/shop/b2b-fintech';

const budgetData = [
  {
    season: 'Осень-Зима 2024',
    budgetPlan: 10000000,
    budgetFact: 8250000,
    skuCount: 120,
    itemCount: 3500,
    forecastRevenue: 24750000,
    forecastSellOut: 85,
    seasonalShare: 70,
    otherShare: 30,
  },
  {
    season: 'Весна-Лето 2024',
    budgetPlan: 8000000,
    budgetFact: 8100000,
    skuCount: 150,
    itemCount: 4200,
    forecastRevenue: 22680000,
    forecastSellOut: 92,
    seasonalShare: 85,
    otherShare: 15,
  },
  {
    season: 'Осень-Зима 2023',
    budgetPlan: 7500000,
    budgetFact: 7450000,
    skuCount: 110,
    itemCount: 3200,
    forecastRevenue: 20860000,
    forecastSellOut: 95,
    seasonalShare: 65,
    otherShare: 35,
  },
];

export default function B2BBudgetPage() {
  return (
    <div className="space-y-4">
      {/* --- BRAND PROPOSALS & BUDGET RESERVATION (CROSS-SYNC) --- */}
      <B2BFintech />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="relative overflow-hidden rounded-xl border-2 border-indigo-100 bg-indigo-50/20 lg:col-span-2">
          <div className="absolute right-0 top-0 p-4 opacity-5">
            <TrendingUp className="h-32 w-32 text-indigo-600" />
          </div>
          <CardHeader className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse text-indigo-600" />
              <Badge className="border-none bg-indigo-600 px-2 py-0.5 text-[8px] font-black uppercase text-white">
                Opportunity Sync
              </Badge>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tight">
              Smart Budget Reservations
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Предложения брендов на основе ваших планов R&D
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 pt-2">
            <div className="space-y-4">
              {[
                {
                  brand: 'Syntha Lab',
                  col: "Urban Nomad FW'26",
                  impact: '+12% Revenue',
                  budget: '1.2M ₽',
                  status: 'Priority 1',
                },
                {
                  brand: 'Nordic Wool',
                  col: 'Arctic Explorer',
                  impact: '+8% Sell-Out',
                  budget: '0.8M ₽',
                  status: 'Trending',
                },
              ].map((prop, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-2xl border border-indigo-100 bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-[10px] font-black text-slate-400">
                      {prop.brand[0]}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black uppercase text-slate-900">
                        {prop.brand}: {prop.col}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-indigo-100 text-[8px] font-black uppercase text-indigo-600"
                        >
                          {prop.impact}
                        </Badge>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          {prop.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase text-slate-400">Est. Budget</p>
                      <p className="text-xs font-black tabular-nums text-slate-900">
                        {prop.budget}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 rounded-xl bg-slate-900 text-[9px] font-black uppercase tracking-widest text-white hover:bg-slate-800"
                    >
                      Забронировать
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="relative flex flex-col justify-between overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent)]" />
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 backdrop-blur-md">
                <TrendingUp className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="pt-2 text-sm font-black uppercase leading-none tracking-tighter">
                Budget Utilization AI
              </h3>
              <p className="text-[10px] font-medium italic leading-relaxed text-slate-400">
                «Вы задействовали 65% бюджета на сезон FW'26. AI рекомендует оставить 15% на
                экспресс-подсортировку хитов продаж.»
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Allocation Health</span>
                <span className="text-indigo-400">Excellent</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-3/4 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </div>
            </div>
          </div>
          <Button className="relative z-10 mt-6 h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-xl hover:bg-slate-100">
            Оптимизировать план
          </Button>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
          <div>
            <CardTitle>Планирование бюджета</CardTitle>
            <CardDescription>Управляйте вашим закупочным бюджетом по сезонам.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-100 text-indigo-600 hover:bg-indigo-50"
            >
              <History className="mr-2 h-4 w-4" /> Наложить историю LFL
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200">
              <Globe className="mr-2 h-4 w-4" /> Валютное хеджирование (RUB)
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Экспорт
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Новый бюджетный план
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сезон / Период</TableHead>
                <TableHead>Бюджет (План/Факт)</TableHead>
                <TableHead>Кол-во SKU</TableHead>
                <TableHead>Кол-во штук</TableHead>
                <TableHead>Прогноз выручки</TableHead>
                <TableHead>Прогноз Sell-Out</TableHead>
                <TableHead>Доля в выручке (Сезон/Другое)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetData.map((item) => (
                <TableRow key={item.season}>
                  <TableCell className="font-semibold">
                    <Link
                      href={`/shop/b2b/budget/${item.season.toLowerCase().replace(' ', '-')}`}
                      className="hover:underline"
                    >
                      {item.season}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.budgetFact.toLocaleString('ru-RU')} ₽ /{' '}
                    {item.budgetPlan.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell>{item.skuCount}</TableCell>
                  <TableCell>{item.itemCount.toLocaleString('ru-RU')}</TableCell>
                  <TableCell>{item.forecastRevenue.toLocaleString('ru-RU')} ₽</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      {item.forecastSellOut}%
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.seasonalShare}% / {item.otherShare}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
