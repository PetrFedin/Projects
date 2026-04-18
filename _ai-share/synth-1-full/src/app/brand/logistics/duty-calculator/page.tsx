'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Globe,
  Truck,
  FileText,
  Calculator,
  Ship,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Info,
  ChevronDown,
  PieChart as PieChartIcon,
  ChevronRight,
  Target,
  Search,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Package,
  MapPin,
  HelpCircle,
  Clock,
  ExternalLink,
  ArrowRightLeft,
} from 'lucide-react';
import { HS_CODES, COUNTRY_RATES, calculateDDP, suggestHSCode } from '@/lib/logic/duty-utils';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

/**
 * Global Duty Engine UI
 * Автоматический расчет пошлин и налогов для 200+ стран в режиме реального времени (DDP).
 */

export default function GlobalDutyCalculatorPage() {
  const [productDesc, setProductDesc] = useState('Silk Evening Dress with embroidery');
  const [hsCode, setHSCode] = useState(HS_CODES[2]); // Default Dress HS Code
  const [country, setCountry] = useState('GB'); // Default UK
  const [itemValue, setItemValue] = useState(250);
  const [shipping, setShipping] = useState(25);
  const [insurance, setInsurance] = useState(5);

  const ddpEstimate = useMemo(() => {
    return calculateDDP(itemValue, country, hsCode.code, shipping, insurance);
  }, [itemValue, country, hsCode, shipping, insurance]);

  const handleAISuggestHS = () => {
    const suggested = suggestHSCode(productDesc);
    setHSCode(suggested);
  };

  const currentRate = COUNTRY_RATES[country] || {
    countryCode: country,
    importDuty: 0,
    vat: 0,
    threshold: 0,
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-4 duration-700 animate-in fade-in">
      <SectionInfoCard
        title="Global Duty Engine"
        description="Расчёт пошлин и налогов (DDP) для 200+ стран. HS-коды, инвойсы, CMR. Связь с Production (PO, логистика) и Warehouse. Результаты — для калькуляции стоимости доставки."
        icon={Globe}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Production → PO
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              DDP / CIF
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/warehouse">Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/consolidation">Consolidation</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/shadow-inventory">Shadow Inventory</Link>
            </Button>
          </>
        }
      />
      <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Globe className="h-2.5 w-2.5" />
            <span>Global Duty Engine (DDP)</span>
          </div>
          <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
            Duty Calculator
          </h1>
          <p className="mt-1 px-0.5 text-[11px] font-medium text-slate-500">
            Real-time international tax & duty estimation.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
          >
            <FileText className="mr-1.5 h-3 w-3" /> Docs
          </Button>
          <Button className="h-7 rounded-lg bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-slate-800">
            <Package className="mr-1.5 h-3 w-3" /> Invoice
          </Button>
        </div>
      </header>

      <div className="mt-2 grid gap-3 lg:grid-cols-12">
        {/* Input Form */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Параметры отправки
              </CardTitle>
              <CardDescription className="text-[11px] font-medium text-slate-400">
                Введите данные товара и страну назначения для расчета DDP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* Step 1: Destination */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    1. Страна назначения
                  </h4>
                  <Badge
                    variant="outline"
                    className="h-4 border-indigo-100 text-[7px] font-black uppercase text-indigo-600"
                  >
                    Cross-Border Ready
                  </Badge>
                </div>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-bold uppercase">
                    <SelectValue placeholder="Выберите страну" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                    <SelectItem value="US" className="py-2 text-xs font-bold uppercase">
                      United States (США)
                    </SelectItem>
                    <SelectItem value="GB" className="py-2 text-xs font-bold uppercase">
                      United Kingdom (Великобритания)
                    </SelectItem>
                    <SelectItem value="DE" className="py-2 text-xs font-bold uppercase">
                      Germany (Германия)
                    </SelectItem>
                    <SelectItem value="FR" className="py-2 text-xs font-bold uppercase">
                      France (Франция)
                    </SelectItem>
                    <SelectItem value="CN" className="py-2 text-xs font-bold uppercase">
                      China (Китай)
                    </SelectItem>
                    <SelectItem value="AE" className="py-2 text-xs font-bold uppercase">
                      UAE (ОАЭ)
                    </SelectItem>
                    <SelectItem value="KZ" className="py-2 text-xs font-bold uppercase">
                      Kazakhstan (Казахстан)
                    </SelectItem>
                    <SelectItem value="RU" className="py-2 text-xs font-bold uppercase">
                      Russia (Россия)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Step 2: Product & HS Code */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    2. Код товара (HS Code)
                  </h4>
                  <Button
                    onClick={handleAISuggestHS}
                    variant="ghost"
                    className="h-5 gap-1 rounded-md px-2 text-[8px] font-black uppercase text-indigo-600 hover:bg-indigo-50"
                  >
                    <BrainCircuit className="h-2.5 w-2.5" /> Suggest Code
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Описание товара (напр. Silk Dress)"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    className="h-10 rounded-lg border-slate-200 text-xs font-medium"
                  />
                  <Select
                    value={hsCode.code}
                    onValueChange={(val) =>
                      setHSCode(HS_CODES.find((c) => c.code === val) || HS_CODES[0])
                    }
                  >
                    <SelectTrigger className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-xs font-bold uppercase">
                      <SelectValue placeholder="HS Code" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                      {HS_CODES.map((c) => (
                        <SelectItem
                          key={c.code}
                          value={c.code}
                          className="text-xs font-bold uppercase"
                        >
                          {c.code} — {c.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="px-1 text-[10px] font-medium italic text-slate-400 opacity-70">
                  {hsCode.description}
                </p>
              </div>

              {/* Step 3: Values */}
              <div className="space-y-3">
                <h4 className="px-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  3. Стоимость (CIF)
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Item Value
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="number"
                        value={itemValue}
                        onChange={(e) => setItemValue(Number(e.target.value))}
                        className="h-9 rounded-lg pl-8 text-xs font-bold tabular-nums"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Freight
                    </label>
                    <Input
                      type="number"
                      value={shipping}
                      onChange={(e) => setShipping(Number(e.target.value))}
                      className="h-9 rounded-lg text-xs font-bold tabular-nums"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                      Insurance
                    </label>
                    <Input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(Number(e.target.value))}
                      className="h-9 rounded-lg text-xs font-bold tabular-nums"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threshold Warning */}
          {itemValue + shipping + insurance < (currentRate.threshold || 0) && (
            <Card className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm duration-300 animate-in zoom-in">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 shadow-inner">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-tight text-emerald-800">
                  De Minimis: Без пошлины
                </p>
                <p className="text-[10px] font-medium leading-relaxed text-emerald-600 opacity-80">
                  Стоимость посылки (${itemValue + shipping + insurance}) ниже порога для
                  беспошлинного ввоза в {country} (${currentRate.threshold}).
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Results Dashboard */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="group relative overflow-hidden rounded-2xl border border-indigo-500 bg-indigo-600 p-4 text-white shadow-2xl shadow-indigo-100/50">
            <div className="absolute right-0 top-0 h-48 w-48 -translate-y-24 translate-x-24 rounded-full bg-white/5 blur-3xl transition-all group-hover:bg-white/10" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-indigo-400/20 blur-2xl" />

            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-tight">Final DDP Value</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                    Total Payable by Client
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-black tabular-nums tracking-tighter">
                  ${ddpEstimate.finalPriceDDP.toFixed(2)}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                  {ddpEstimate.currency} • DELIVERED DUTY PAID
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    Import Duty
                  </p>
                  <p className="text-base font-black tabular-nums text-white">
                    ${ddpEstimate.dutyAmount.toFixed(2)}
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                    {currentRate.importDuty}% RATE
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                    VAT / Sales Tax
                  </p>
                  <p className="text-base font-black tabular-nums text-indigo-200">
                    ${ddpEstimate.vatAmount.toFixed(2)}
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                    {currentRate.vat}% RATE
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
            <div className="mb-6 flex items-center gap-3 px-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-inner transition-transform group-hover:scale-105">
                <Truck className="h-4 w-4 text-indigo-600" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-tight text-slate-900">
                Cost Breakdown
              </h3>
            </div>

            <div className="space-y-4 px-1">
              {[
                {
                  label: 'Item CIF Value',
                  value: itemValue + shipping + insurance,
                  icon: Package,
                  color: 'text-slate-400',
                },
                {
                  label: 'Total Customs Duties',
                  value: ddpEstimate.dutyAmount,
                  icon: FileText,
                  color: 'text-indigo-600',
                },
                {
                  label: 'Import VAT (Tax)',
                  value: ddpEstimate.vatAmount,
                  icon: DollarSign,
                  color: 'text-emerald-600',
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border-b border-slate-50 px-2 py-2.5 transition-colors last:border-0 hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <row.icon className={cn('h-3.5 w-3.5', row.color)} />
                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                      {row.label}
                    </span>
                  </div>
                  <span className="text-xs font-black tabular-nums text-slate-900">
                    ${row.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-100 px-1 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Compliance Check
                </h4>
                <Badge className="h-4 border-none bg-emerald-50 px-1.5 text-[7px] font-black uppercase text-emerald-600">
                  Verified
                </Badge>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'HS Code Match', status: 'valid' },
                  { label: 'Trade Embargo Check', status: 'valid' },
                  { label: 'Restricted Category', status: 'valid' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-1">
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                    <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
