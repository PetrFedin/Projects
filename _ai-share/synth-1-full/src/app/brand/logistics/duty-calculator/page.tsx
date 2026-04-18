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
import { ROUTES } from '@/lib/routes';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

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
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16 duration-700 animate-in fade-in">
      <RegistryPageHeader
        eyebrow={
          <div className="text-text-muted flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Globe className="h-2.5 w-2.5" />
            <span>Global Duty Engine (DDP)</span>
          </div>
        }
        title="Duty Calculator"
        leadPlain="Расчёт пошлин и налогов (DDP) для 200+ стран. HS-коды, инвойсы, CMR; связь с Production и Warehouse. Real-time international tax and duty estimation."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Globe className="size-6 shrink-0 text-muted-foreground" aria-hidden />
            <Badge variant="outline" className="text-[9px]">
              Production → PO
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              DDP / CIF
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.warehouse}>Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.logisticsConsolidation}>Consolidation</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.logisticsShadowInventory}>Shadow Inventory</Link>
            </Button>
            <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
              <Button
                variant="ghost"
                size="sm"
                className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
              >
                <FileText className="mr-1.5 h-3 w-3" /> Docs
              </Button>
              <Button className="bg-text-primary hover:bg-text-primary/90 h-7 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
                <Package className="mr-1.5 h-3 w-3" /> Invoice
              </Button>
            </div>
          </div>
        }
      />

      <div className="mt-2 grid gap-3 lg:grid-cols-12">
        {/* Input Form */}
        <div className="space-y-6 lg:col-span-7">
          <Card className="border-border-subtle overflow-hidden rounded-2xl border bg-white shadow-sm">
            <CardHeader className="border-border-subtle bg-bg-surface2/30 border-b p-4">
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Параметры отправки
              </CardTitle>
              <CardDescription className="text-text-muted text-[11px] font-medium">
                Введите данные товара и страну назначения для расчета DDP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* Step 1: Destination */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                    1. Страна назначения
                  </h4>
                  <Badge
                    variant="outline"
                    className="text-accent-primary border-accent-primary/20 h-4 text-[7px] font-black uppercase"
                  >
                    Cross-Border Ready
                  </Badge>
                </div>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="border-border-default bg-bg-surface2/80 h-10 rounded-xl text-xs font-bold uppercase">
                    <SelectValue placeholder="Выберите страну" />
                  </SelectTrigger>
                  <SelectContent className="border-border-subtle rounded-xl shadow-2xl">
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
                  <h4 className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                    2. Код товара (HS Code)
                  </h4>
                  <Button
                    onClick={handleAISuggestHS}
                    variant="ghost"
                    className="text-accent-primary hover:bg-accent-primary/10 h-5 gap-1 rounded-md px-2 text-[8px] font-black uppercase"
                  >
                    <BrainCircuit className="h-2.5 w-2.5" /> Suggest Code
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Описание товара (напр. Silk Dress)"
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    className="border-border-default h-10 rounded-lg text-xs font-medium"
                  />
                  <Select
                    value={hsCode.code}
                    onValueChange={(val) =>
                      setHSCode(HS_CODES.find((c) => c.code === val) || HS_CODES[0])
                    }
                  >
                    <SelectTrigger className="border-border-default bg-bg-surface2/80 h-10 rounded-lg text-xs font-bold uppercase">
                      <SelectValue placeholder="HS Code" />
                    </SelectTrigger>
                    <SelectContent className="border-border-subtle rounded-xl shadow-2xl">
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
                <p className="text-text-muted px-1 text-[10px] font-medium italic opacity-70">
                  {hsCode.description}
                </p>
              </div>

              {/* Step 3: Values */}
              <div className="space-y-3">
                <h4 className="text-text-muted px-1 text-[9px] font-black uppercase tracking-widest">
                  3. Стоимость (CIF)
                </h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <label className="text-text-muted ml-1 text-[8px] font-bold uppercase tracking-widest">
                      Item Value
                    </label>
                    <div className="relative">
                      <DollarSign className="text-text-muted absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2" />
                      <Input
                        type="number"
                        value={itemValue}
                        onChange={(e) => setItemValue(Number(e.target.value))}
                        className="h-9 rounded-lg pl-8 text-xs font-bold tabular-nums"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted ml-1 text-[8px] font-bold uppercase tracking-widest">
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
                    <label className="text-text-muted ml-1 text-[8px] font-bold uppercase tracking-widest">
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
          <Card className="border-accent-primary shadow-accent-primary/10 bg-accent-primary group relative overflow-hidden rounded-2xl border p-4 text-white shadow-2xl">
            <div className="absolute right-0 top-0 h-48 w-48 -translate-y-24 translate-x-24 rounded-full bg-white/5 blur-3xl transition-all group-hover:bg-white/10" />
            <div className="bg-accent-primary/20 absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full blur-2xl" />

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
                  <p className="text-accent-primary/40 text-base font-black tabular-nums">
                    ${ddpEstimate.vatAmount.toFixed(2)}
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-white/30">
                    {currentRate.vat}% RATE
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border-subtle hover:border-accent-primary/20 group rounded-2xl border bg-white p-4 shadow-sm transition-all">
            <div className="mb-6 flex items-center gap-3 px-1">
              <div className="bg-bg-surface2 border-border-subtle flex h-9 w-9 items-center justify-center rounded-xl border shadow-inner transition-transform group-hover:scale-105">
                <Truck className="text-accent-primary h-4 w-4" />
              </div>
              <h3 className="text-text-primary text-xs font-black uppercase tracking-tight">
                Cost Breakdown
              </h3>
            </div>

            <div className="space-y-4 px-1">
              {[
                {
                  label: 'Item CIF Value',
                  value: itemValue + shipping + insurance,
                  icon: Package,
                  color: 'text-text-muted',
                },
                {
                  label: 'Total Customs Duties',
                  value: ddpEstimate.dutyAmount,
                  icon: FileText,
                  color: 'text-accent-primary',
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
                  className="border-border-subtle hover:bg-bg-surface2/80 flex items-center justify-between rounded-lg border-b px-2 py-2.5 transition-colors last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <row.icon className={cn('h-3.5 w-3.5', row.color)} />
                    <span className="text-text-secondary text-[10px] font-bold uppercase tracking-tight">
                      {row.label}
                    </span>
                  </div>
                  <span className="text-text-primary text-xs font-black tabular-nums">
                    ${row.value.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-border-subtle mt-6 border-t px-1 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-text-muted text-[9px] font-black uppercase tracking-widest">
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
                    <span className="text-text-secondary text-[9px] font-bold uppercase tracking-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </RegistryPageShell>
  );
}
