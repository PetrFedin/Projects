'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import {
  LayoutGrid,
  Target,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Package,
  CloudRain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

const CORE_TREND_NOVELTY = [
  {
    id: 'core',
    label: 'Core',
    desc: 'Базовый ассортимент',
    targetMargin: 42,
    budget: 1200000,
    skuCount: 24,
  },
  {
    id: 'trend',
    label: 'Trend',
    desc: 'Трендовые модели',
    targetMargin: 38,
    budget: 800000,
    skuCount: 16,
  },
  {
    id: 'novelty',
    label: 'Novelty',
    desc: 'Новинки и лимиты',
    targetMargin: 35,
    budget: 400000,
    skuCount: 8,
  },
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
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
=======
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Smart Range Planner & Assortment Simulator"
        description="Матрица ассортимента Core/Trend/Novelty с целевой маржой и бюджетом. Прогон коллекции через модель спроса — хиты и висляки до пошива."
        icon={LayoutGrid}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Merchandising
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/merchandising">
=======
              <Link href={ROUTES.brand.merchandising}>
>>>>>>> recover/cabinet-wip-from-stash
                <LayoutGrid className="mr-1 h-3 w-3" /> Rack Planner
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/products">Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/weather-collections">
=======
              <Link href={ROUTES.brand.products}>Products</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.weatherCollections}>
>>>>>>> recover/cabinet-wip-from-stash
                <CloudRain className="mr-1 h-3 w-3" /> Weather-Driven
              </Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Range Planner & Simulator</h1>

      {/* Smart Range Planner: Core / Trend / Novelty */}
<<<<<<< HEAD
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
=======
      <Card className="border-border-default rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" /> Smart Range Planner
          </CardTitle>
          <CardDescription>
            Матрица ассортимента с целевой маржой и планированием бюджета до дизайна. Сезон:{' '}
            {season}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {['SS2026', 'FW2025'].map((s) => (
              <Button
                key={s}
                variant={season === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeason(s)}
                className="rounded-lg text-[10px] font-bold uppercase"
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {CORE_TREND_NOVELTY.map((row) => (
              <Card
                key={row.id}
<<<<<<< HEAD
                className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50"
=======
                className="border-border-default bg-bg-surface2/80 overflow-hidden rounded-xl border"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <CardHeader className="pb-2">
                  <Badge
                    className="w-fit"
                    variant={
                      row.id === 'core' ? 'default' : row.id === 'trend' ? 'secondary' : 'outline'
                    }
                  >
                    {row.label}
                  </Badge>
                  <CardTitle className="text-sm">{row.desc}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Целевая маржа</span>
                    <span className="text-accent-primary font-black">{row.targetMargin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Бюджет</span>
                    <span className="font-black tabular-nums">{row.budget.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">SKU</span>
                    <span className="font-bold">{row.skuCount}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assortment Simulator: hits / duds */}
<<<<<<< HEAD
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
=======
      <Card className="border-border-default rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Assortment Simulator
          </CardTitle>
          <CardDescription>
            Прогон коллекции через модель спроса. Выявление потенциальных хитов и висляков до
            пошива.
          </CardDescription>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-500">Артикул</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-500">
                    Скор спроса
                  </th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-500">Вердикт</th>
                  <th className="p-3 text-[10px] font-bold uppercase text-slate-500">
=======
          <div className="border-border-default overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-bg-surface2 border-border-default border-b">
                  <th className="text-text-secondary p-3 text-[10px] font-bold uppercase">
                    Артикул
                  </th>
                  <th className="text-text-secondary p-3 text-[10px] font-bold uppercase">
                    Скор спроса
                  </th>
                  <th className="text-text-secondary p-3 text-[10px] font-bold uppercase">
                    Вердикт
                  </th>
                  <th className="text-text-secondary p-3 text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    Рекомендация
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SIMULATOR.map((r, i) => (
                  <tr key={i} className="border-border-subtle border-b">
                    <td className="p-3 font-medium">{r.sku}</td>
                    <td className="p-3 tabular-nums">{r.score}</td>
                    <td className="p-3">
                      <Badge
                        className={cn(
                          r.verdict === 'hit'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {r.verdict === 'hit' ? (
                          <TrendingUp className="mr-1 inline h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 inline h-3 w-3" />
                        )}
                        {r.verdict === 'hit' ? 'Хит' : 'Висляк'}
                      </Badge>
                    </td>
                    <td className="text-text-secondary p-3">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
<<<<<<< HEAD
          <p className="mt-3 text-[10px] text-slate-400">
=======
          <p className="text-text-muted mt-3 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
            На основе исторических данных и AI-модели спроса. Подключите PIM и производство для
            актуализации.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
<<<<<<< HEAD
          <Link href="/brand/merchandising">
=======
          <Link href={ROUTES.brand.merchandising}>
>>>>>>> recover/cabinet-wip-from-stash
            <Package className="mr-2 h-4 w-4" /> К Rack Planner
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.productsMatrix}>Матрица вариантов</Link>
        </Button>
      </div>
    </RegistryPageShell>
  );
}
