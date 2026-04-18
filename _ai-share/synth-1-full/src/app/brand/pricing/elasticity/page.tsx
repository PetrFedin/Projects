'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, BarChart3, Percent } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getFinanceLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

/** Упрощённая модель: эластичность -1.2 => при +10% цены объём -12% */
function elasticityImpact(priceChangePct: number, elasticity = -1.2) {
  const volumeChangePct = elasticity * priceChangePct;
  return volumeChangePct;
}

export default function PriceElasticityPage() {
  const [currentPrice, setCurrentPrice] = useState(5000);
  const [priceChangePct, setPriceChangePct] = useState(10);
  const [baseVolume, setBaseVolume] = useState(100);

  const result = useMemo(() => {
    const newPrice = currentPrice * (1 + priceChangePct / 100);
    const volumeChangePct = elasticityImpact(priceChangePct);
    const newVolume = Math.max(1, Math.round(baseVolume * (1 + volumeChangePct / 100)));
    const revenueBefore = currentPrice * baseVolume;
    const revenueAfter = newPrice * newVolume;
    const revenueChangePct = revenueBefore
      ? ((revenueAfter - revenueBefore) / revenueBefore) * 100
      : 0;
    return { newPrice, newVolume, volumeChangePct, revenueBefore, revenueAfter, revenueChangePct };
  }, [currentPrice, priceChangePct, baseVolume]);

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
=======
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Price Elasticity Predictor"
        description="AI-прогноз влияния изменения цены на объём продаж. Эластичность по SKU, категориям, каналам. Связь с Finance, Pricing, Analytics."
        icon={TrendingUp}
<<<<<<< HEAD
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
=======
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
>>>>>>> recover/cabinet-wip-from-stash
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              AI
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href="/brand/pricing">Pricing</Link>
=======
              <Link href={ROUTES.brand.pricing}>Pricing</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Price Elasticity Predictor</h1>

<<<<<<< HEAD
      <Card className="rounded-xl border border-indigo-200 bg-white shadow-sm">
=======
      <Card className="border-accent-primary/30 rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" /> Калькулятор «Что если»
          </CardTitle>
          <CardDescription>
            Текущая цена и объём, изменение цены в % — прогноз объёма и выручки (эластичность ≈
            -1.2)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
<<<<<<< HEAD
              <Label className="text-[10px] font-bold uppercase text-slate-500">
=======
              <Label className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Цена сейчас (₽)
              </Label>
              <Input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value) || 0)}
                className="mt-1 h-9"
              />
            </div>
            <div>
<<<<<<< HEAD
              <Label className="text-[10px] font-bold uppercase text-slate-500">
=======
              <Label className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Изменение цены (%)
              </Label>
              <Input
                type="number"
                value={priceChangePct}
                onChange={(e) => setPriceChangePct(Number(e.target.value) || 0)}
                className="mt-1 h-9"
                placeholder="10 или -15"
              />
            </div>
            <div>
<<<<<<< HEAD
              <Label className="text-[10px] font-bold uppercase text-slate-500">
=======
              <Label className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Объём продаж (ед.)
              </Label>
              <Input
                type="number"
                value={baseVolume}
                onChange={(e) => setBaseVolume(Number(e.target.value) || 0)}
                className="mt-1 h-9"
              />
            </div>
          </div>
<<<<<<< HEAD
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm md:grid-cols-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Новая цена</p>
              <p className="font-black tabular-nums text-indigo-700">
=======
          <div className="bg-accent-primary/10 border-accent-primary/20 grid grid-cols-2 gap-3 rounded-xl border p-4 text-sm md:grid-cols-4">
            <div>
              <p className="text-text-secondary text-[10px] font-bold uppercase">Новая цена</p>
              <p className="text-accent-primary font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                {result.newPrice.toLocaleString()} ₽
              </p>
            </div>
            <div>
<<<<<<< HEAD
              <p className="text-[10px] font-bold uppercase text-slate-500">Прогноз объёма</p>
=======
              <p className="text-text-secondary text-[10px] font-bold uppercase">Прогноз объёма</p>
>>>>>>> recover/cabinet-wip-from-stash
              <p className="font-black tabular-nums">
                {result.newVolume} ед. ({result.volumeChangePct >= 0 ? '+' : ''}
                {result.volumeChangePct.toFixed(1)}%)
              </p>
            </div>
            <div>
<<<<<<< HEAD
              <p className="text-[10px] font-bold uppercase text-slate-500">Выручка было</p>
              <p className="font-black tabular-nums text-slate-700">
=======
              <p className="text-text-secondary text-[10px] font-bold uppercase">Выручка было</p>
              <p className="text-text-primary font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                {result.revenueBefore.toLocaleString()} ₽
              </p>
            </div>
            <div>
<<<<<<< HEAD
              <p className="text-[10px] font-bold uppercase text-slate-500">Выручка станет</p>
=======
              <p className="text-text-secondary text-[10px] font-bold uppercase">Выручка станет</p>
>>>>>>> recover/cabinet-wip-from-stash
              <p
                className={`font-black tabular-nums ${result.revenueChangePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {result.revenueAfter.toLocaleString()} ₽ ({result.revenueChangePct >= 0 ? '+' : ''}
                {result.revenueChangePct.toFixed(1)}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

<<<<<<< HEAD
      <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
=======
      <Card className="border-border-default rounded-xl border bg-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Эластичность по артикулам
          </CardTitle>
          <CardDescription>
            Симуляция: как изменится объём продаж при изменении цены на ±10%, ±20%
          </CardDescription>
        </CardHeader>
        <CardContent>
<<<<<<< HEAD
          <div className="flex h-48 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
=======
          <div className="bg-bg-surface2 border-border-default text-text-secondary flex h-48 items-center justify-center rounded-xl border">
>>>>>>> recover/cabinet-wip-from-stash
            <p className="text-sm">
              График эластичности по артикулам (подключите данные из PIM / Analytics)
            </p>
          </div>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getFinanceLinks()} />
    </RegistryPageShell>
  );
}
