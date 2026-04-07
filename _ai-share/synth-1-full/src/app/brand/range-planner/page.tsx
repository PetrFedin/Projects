'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { LayoutGrid, Target, Sparkles, TrendingUp, TrendingDown, Package, CloudRain } from 'lucide-react';
import { cn } from '@/lib/utils';

const CORE_TREND_NOVELTY = [
  { id: 'core', label: 'Core', desc: 'Базовый ассортимент', targetMargin: 42, budget: 1200000, skuCount: 24 },
  { id: 'trend', label: 'Trend', desc: 'Трендовые модели', targetMargin: 38, budget: 800000, skuCount: 16 },
  { id: 'novelty', label: 'Novelty', desc: 'Новинки и лимиты', targetMargin: 35, budget: 400000, skuCount: 8 },
];

const MOCK_SIMULATOR = [
  { sku: 'CP-001 Cyber Parka', score: 92, verdict: 'hit' as const, note: 'Высокий спрос' },
  { sku: 'CR-002 Cargo Pants', score: 78, verdict: 'hit' as const, note: 'Стабильный' },
  { sku: 'OS-003 Overshirt', score: 45, verdict: 'dud' as const, note: 'Снизить объём' },
  { sku: 'NT-004 Neural Tee', score: 88, verdict: 'hit' as const, note: 'Хит сезона' },
];

export default function RangePlannerPage() {
  const [season, setSeason] = useState('SS2026');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Smart Range Planner & Assortment Simulator"
        description="Матрица ассортимента Core/Trend/Novelty с целевой маржой и бюджетом. Прогон коллекции через модель спроса — хиты и висляки до пошива."
        icon={LayoutGrid}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">Merchandising</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/merchandising"><LayoutGrid className="h-3 w-3 mr-1" /> Rack Planner</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/products">Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/weather-collections"><CloudRain className="h-3 w-3 mr-1" /> Weather-Driven</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Range Planner & Simulator</h1>

      {/* Smart Range Planner: Core / Trend / Novelty */}
      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Smart Range Planner
          </CardTitle>
          <CardDescription>Матрица ассортимента с целевой маржой и планированием бюджета до дизайна. Сезон: {season}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {['SS2026', 'FW2025'].map((s) => (
              <Button key={s} variant={season === s ? 'default' : 'outline'} size="sm" onClick={() => setSeason(s)} className="rounded-lg text-[10px] font-bold uppercase">
                {s}
              </Button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {CORE_TREND_NOVELTY.map((row) => (
              <Card key={row.id} className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <Badge className="w-fit" variant={row.id === 'core' ? 'default' : row.id === 'trend' ? 'secondary' : 'outline'}>
                    {row.label}
                  </Badge>
                  <CardTitle className="text-sm">{row.desc}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Целевая маржа</span>
                    <span className="font-black text-indigo-600">{row.targetMargin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Бюджет</span>
                    <span className="font-black tabular-nums">{row.budget.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SKU</span>
                    <span className="font-bold">{row.skuCount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assortment Simulator: hits / duds */}
      <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Assortment Simulator
          </CardTitle>
          <CardDescription>Прогон коллекции через модель спроса. Выявление потенциальных хитов и висляков до пошива.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 font-bold uppercase text-[10px] text-slate-500">Артикул</th>
                  <th className="p-3 font-bold uppercase text-[10px] text-slate-500">Скор спроса</th>
                  <th className="p-3 font-bold uppercase text-[10px] text-slate-500">Вердикт</th>
                  <th className="p-3 font-bold uppercase text-[10px] text-slate-500">Рекомендация</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SIMULATOR.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-3 font-medium">{r.sku}</td>
                    <td className="p-3 tabular-nums">{r.score}</td>
                    <td className="p-3">
                      <Badge className={cn(r.verdict === 'hit' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')}>
                        {r.verdict === 'hit' ? <TrendingUp className="h-3 w-3 inline mr-1" /> : <TrendingDown className="h-3 w-3 inline mr-1" />}
                        {r.verdict === 'hit' ? 'Хит' : 'Висляк'}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-600">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">На основе исторических данных и AI-модели спроса. Подключите PIM и производство для актуализации.</p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/brand/merchandising"><Package className="h-4 w-4 mr-2" /> К Rack Planner</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/brand/products/matrix">Матрица вариантов</Link>
        </Button>
      </div>
    </div>
  );
}
