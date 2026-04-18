'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Globe,
  Truck,
  AlertCircle,
  Info,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

export function LandedCostCalculator() {
  const [fobPrice, setFobPrice] = useState(1200000); // Base wholesale price
  const [origin, setOrigin] = useState('Italy');
  const [destination, setDestination] = useState('Russia');
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air');

  const calculations = useMemo(() => {
    const dutyRate = destination === 'Russia' ? 0.15 : 0.12; // 15% duty for RU
    const vatRate = destination === 'Russia' ? 0.2 : 0.19; // 20% VAT for RU
    const shippingCost = shippingMethod === 'air' ? fobPrice * 0.08 : fobPrice * 0.03;
    const insurance = fobPrice * 0.005;

    const cifValue = fobPrice + shippingCost + insurance;
    const dutyAmount = cifValue * dutyRate;
    const vatAmount = (cifValue + dutyAmount) * vatRate;
    const totalLanded = cifValue + dutyAmount + vatAmount;

    return {
      shipping: shippingCost,
      insurance,
      duty: dutyAmount,
      vat: vatAmount,
      total: totalLanded,
      multiplier: totalLanded / fobPrice,
    };
  }, [fobPrice, destination, shippingMethod]);

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-4">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
=======
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              TRADE_COMPLIANCE_v1.5
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
>>>>>>> recover/cabinet-wip-from-stash
            Калькулятор
            <br />
            Себестоимости
          </h2>
<<<<<<< HEAD
          <p className="max-w-md text-left text-xs font-medium text-slate-400">
=======
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Определение полной стоимости товара с учетом логистики, пошлин, налогов и страховки до
            двери покупателя.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
<<<<<<< HEAD
            className="h-10 gap-2 rounded-2xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            Экспорт анализа
          </Button>
          <Button className="h-10 gap-2 rounded-2xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200">
=======
            className="border-border-default h-10 gap-2 rounded-2xl bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            Экспорт анализа
          </Button>
          <Button className="bg-text-primary h-10 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            Применить к заказу #8821 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Input Parameters */}
        <div className="space-y-6 lg:col-span-4">
<<<<<<< HEAD
          <Card className="rounded-xl border-none bg-white p-4 shadow-xl shadow-slate-200/50">
            <CardHeader className="mb-8 p-0">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">
=======
          <Card className="rounded-xl border-none bg-white p-4 shadow-md shadow-xl">
            <CardHeader className="mb-8 p-0">
              <CardTitle className="text-text-primary text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Параметры сделки
              </CardTitle>
            </CardHeader>
            <div className="space-y-6">
              <div className="space-y-2">
<<<<<<< HEAD
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Оптовая цена (FOB)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">
=======
                <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
                  Оптовая цена (FOB)
                </label>
                <div className="relative">
                  <span className="text-text-muted absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    ₽
                  </span>
                  <Input
                    type="number"
                    value={fobPrice}
                    onChange={(e) => setFobPrice(parseInt(e.target.value) || 0)}
<<<<<<< HEAD
                    className="h-10 rounded-2xl border-none bg-slate-50 pl-12 text-sm font-black"
=======
                    className="bg-bg-surface2 h-10 rounded-2xl border-none pl-12 text-sm font-black"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Страна назначения
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Russia', 'UAE', 'EU', 'USA'].map((dest) => (
                    <Button
                      key={dest}
                      onClick={() => setDestination(dest)}
                      variant={destination === dest ? 'default' : 'outline'}
                      className={cn(
                        'h-12 rounded-xl text-[9px] font-black uppercase tracking-widest',
<<<<<<< HEAD
                        destination === dest ? 'bg-slate-900' : 'border-slate-100'
=======
                        destination === dest ? 'bg-text-primary' : 'border-border-subtle'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {dest === 'Russia'
                        ? 'Россия'
                        : dest === 'UAE'
                          ? 'ОАЭ'
                          : dest === 'EU'
                            ? 'Европа'
                            : dest === 'USA'
                              ? 'США'
                              : dest}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
<<<<<<< HEAD
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Режим доставки
                </label>
                <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
=======
                <label className="text-text-muted ml-1 text-[10px] font-black uppercase tracking-widest">
                  Режим доставки
                </label>
                <div className="bg-bg-surface2 flex gap-2 rounded-xl p-1">
>>>>>>> recover/cabinet-wip-from-stash
                  <Button
                    onClick={() => setShippingMethod('air')}
                    className={cn(
                      'h-10 flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                      shippingMethod === 'air'
<<<<<<< HEAD
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-transparent text-slate-400'
=======
                        ? 'text-text-primary bg-white shadow-sm'
                        : 'text-text-muted bg-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    АВИА
                  </Button>
                  <Button
                    onClick={() => setShippingMethod('sea')}
                    className={cn(
                      'h-10 flex-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all',
                      shippingMethod === 'sea'
<<<<<<< HEAD
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-transparent text-slate-400'
=======
                        ? 'text-text-primary bg-white shadow-sm'
                        : 'text-text-muted bg-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    МОРЕ/АВТО
                  </Button>
                </div>
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl shadow-slate-200/50">
=======
          <Card className="bg-accent-primary rounded-xl border-none p-4 text-white shadow-md shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black uppercase tracking-tight">
                  Тарифное предупреждение
                </h4>
                <p className="text-[9px] font-medium leading-relaxed text-white/60">
                  Недавние изменения в законодательстве региона (
                  {destination === 'Russia'
                    ? 'Россия'
                    : destination === 'UAE'
                      ? 'ОАЭ'
                      : destination === 'EU'
                        ? 'Европа'
                        : destination === 'USA'
                          ? 'США'
                          : destination}
                  ) могут повлиять на коды ТН ВЭД для синтетических мембранных тканей. Множитель:
                  1.4x.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Results / Breakdown */}
        <div className="space-y-4 lg:col-span-8">
<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-4 p-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    Итоговая себестоимость
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-4 p-3">
                <div className="space-y-1">
                  <h3 className="text-text-primary text-sm font-black uppercase tracking-tight">
                    Итоговая себестоимость
                  </h3>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Расчетная оценка финальной доставки
                  </p>
                </div>

                <div className="space-y-6">
<<<<<<< HEAD
                  <div className="flex items-center justify-between border-b border-slate-50 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        Оптовая цена (FOB)
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {fobPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        Логистика и страх.
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {(calculations.shipping + calculations.insurance).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        Пошлины и сборы
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {calculations.duty.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-50 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        НДС (20%)
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900">
=======
                  <div className="border-border-subtle flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-text-primary h-1.5 w-1.5 rounded-full" />
                      <span className="text-text-muted text-[10px] font-black uppercase">
                        Оптовая цена (FOB)
                      </span>
                    </div>
                    <span className="text-text-primary text-sm font-black">
                      {fobPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="border-border-subtle flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent-primary h-1.5 w-1.5 rounded-full" />
                      <span className="text-text-muted text-[10px] font-black uppercase">
                        Логистика и страх.
                      </span>
                    </div>
                    <span className="text-text-primary text-sm font-black">
                      {(calculations.shipping + calculations.insurance).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="border-border-subtle flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      <span className="text-text-muted text-[10px] font-black uppercase">
                        Пошлины и сборы
                      </span>
                    </div>
                    <span className="text-text-primary text-sm font-black">
                      {calculations.duty.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="border-border-subtle flex items-center justify-between border-b py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-text-muted text-[10px] font-black uppercase">
                        НДС (20%)
                      </span>
                    </div>
                    <span className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
                      {calculations.vat.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white shadow-2xl">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                <div className="bg-text-primary flex items-center justify-between rounded-xl p-4 text-white shadow-2xl">
                  <div className="space-y-1">
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Итоговая оценка (Landed)
                    </p>
                    <p className="text-base font-black">
                      {Math.round(calculations.total).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="flex flex-col justify-center space-y-10 border-l border-slate-100 bg-slate-50 p-3">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
=======
              <div className="bg-bg-surface2 border-border-subtle flex flex-col justify-center space-y-10 border-l p-3">
                <div className="space-y-4">
                  <h4 className="text-text-muted text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Множитель цены
                  </h4>
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <svg className="h-full w-full rotate-[-90deg]">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="12"
                        strokeDasharray="440"
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - 440 * (calculations.multiplier - 1) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
<<<<<<< HEAD
                      <span className="text-base font-black text-slate-900">
                        {calculations.multiplier.toFixed(2)}x
                      </span>
                      <span className="text-[8px] font-black uppercase text-slate-400">
=======
                      <span className="text-text-primary text-base font-black">
                        {calculations.multiplier.toFixed(2)}x
                      </span>
                      <span className="text-text-muted text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        Коэффициент наценки
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
<<<<<<< HEAD
                      <span className="text-[10px] font-black uppercase text-slate-900">
=======
                      <span className="text-text-primary text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        Налоговая эффективность
                      </span>
                      <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                        ВЫСОКАЯ
                      </Badge>
                    </div>
<<<<<<< HEAD
                    <p className="text-[9px] font-medium uppercase leading-relaxed text-slate-400">
=======
                    <p className="text-text-muted text-[9px] font-medium uppercase leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                      Обнаружен оптимальный маршрут через хаб Дубай. Потенциальная экономия 4.2% на
                      региональных пошлинах.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
<<<<<<< HEAD
                    className="h-10 w-full gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
                    className="text-accent-primary h-10 w-full gap-2 text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Полный отчет по комплаенсу <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
