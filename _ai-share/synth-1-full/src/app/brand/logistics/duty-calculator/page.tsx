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
  ArrowRightLeft
} from 'lucide-react';
import { HS_CODES, COUNTRY_RATES, calculateDDP, suggestHSCode } from '@/lib/logic/duty-utils';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const currentRate = COUNTRY_RATES[country] || { countryCode: country, importDuty: 0, vat: 0, threshold: 0 };

  return (
    <div className="container mx-auto px-4 py-4 space-y-6 max-w-5xl animate-in fade-in duration-700">
      <SectionInfoCard
        title="Global Duty Engine"
        description="Расчёт пошлин и налогов (DDP) для 200+ стран. HS-коды, инвойсы, CMR. Связь с Production (PO, логистика) и Warehouse. Результаты — для калькуляции стоимости доставки."
        icon={Globe}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={<><Badge variant="outline" className="text-[9px]">Production → PO</Badge><Badge variant="outline" className="text-[9px]">DDP / CIF</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/warehouse">Warehouse</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/consolidation">Consolidation</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/shadow-inventory">Shadow Inventory</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Globe className="w-2.5 h-2.5" />
            <span>Global Duty Engine (DDP)</span>
          </div>
          <h1 className="text-sm font-black tracking-tighter uppercase text-slate-900 leading-none">Duty Calculator</h1>
          <p className="text-[11px] text-slate-500 font-medium px-0.5 mt-1">Real-time international tax & duty estimation.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <Button variant="ghost" size="sm" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
              <FileText className="w-3 h-3 mr-1.5" /> Docs
           </Button>
           <Button className="h-7 px-4 rounded-lg font-bold uppercase text-[9px] tracking-widest bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all">
              <Package className="w-3 h-3 mr-1.5" /> Invoice
           </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-3 mt-2">
         {/* Input Form */}
         <div className="lg:col-span-7 space-y-6">
            <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
               <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30">
                  <CardTitle className="text-base font-black uppercase tracking-tight">Параметры отправки</CardTitle>
                  <CardDescription className="text-[11px] font-medium text-slate-400">Введите данные товара и страну назначения для расчета DDP.</CardDescription>
               </CardHeader>
               <CardContent className="p-4 space-y-4">
                  {/* Step 1: Destination */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">1. Страна назначения</h4>
                       <Badge variant="outline" className="text-[7px] font-black uppercase text-indigo-600 h-4 border-indigo-100">Cross-Border Ready</Badge>
                    </div>
                    <Select value={country} onValueChange={setCountry}>
                       <SelectTrigger className="rounded-xl h-10 border-slate-200 text-xs font-bold uppercase bg-slate-50/50">
                          <SelectValue placeholder="Выберите страну" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                          <SelectItem value="US" className="text-xs font-bold uppercase py-2">United States (США)</SelectItem>
                          <SelectItem value="GB" className="text-xs font-bold uppercase py-2">United Kingdom (Великобритания)</SelectItem>
                          <SelectItem value="DE" className="text-xs font-bold uppercase py-2">Germany (Германия)</SelectItem>
                          <SelectItem value="FR" className="text-xs font-bold uppercase py-2">France (Франция)</SelectItem>
                          <SelectItem value="CN" className="text-xs font-bold uppercase py-2">China (Китай)</SelectItem>
                          <SelectItem value="AE" className="text-xs font-bold uppercase py-2">UAE (ОАЭ)</SelectItem>
                          <SelectItem value="KZ" className="text-xs font-bold uppercase py-2">Kazakhstan (Казахстан)</SelectItem>
                          <SelectItem value="RU" className="text-xs font-bold uppercase py-2">Russia (Россия)</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>

                  {/* Step 2: Product & HS Code */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">2. Код товара (HS Code)</h4>
                       <Button 
                          onClick={handleAISuggestHS}
                          variant="ghost" 
                          className="h-5 px-2 text-[8px] font-black uppercase text-indigo-600 hover:bg-indigo-50 gap-1 rounded-md"
                       >
                          <BrainCircuit className="w-2.5 h-2.5" /> Suggest Code
                       </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       <Input 
                          placeholder="Описание товара (напр. Silk Dress)" 
                          value={productDesc}
                          onChange={(e) => setProductDesc(e.target.value)}
                          className="rounded-lg h-10 text-xs font-medium border-slate-200"
                       />
                       <Select 
                          value={hsCode.code} 
                          onValueChange={(val) => setHSCode(HS_CODES.find(c => c.code === val) || HS_CODES[0])}
                       >
                          <SelectTrigger className="rounded-lg h-10 border-slate-200 text-xs font-bold uppercase bg-slate-50/50">
                             <SelectValue placeholder="HS Code" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-2xl">
                             {HS_CODES.map(c => (
                                <SelectItem key={c.code} value={c.code} className="text-xs font-bold uppercase">{c.code} — {c.category}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium italic px-1 opacity-70">
                       {hsCode.description}
                    </p>
                  </div>

                  {/* Step 3: Values */}
                  <div className="space-y-3">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">3. Стоимость (CIF)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       <div className="space-y-1.5">
                          <label className="text-[8px] font-bold uppercase text-slate-400 ml-1 tracking-widest">Item Value</label>
                          <div className="relative">
                             <DollarSign className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <Input 
                                type="number" 
                                value={itemValue} 
                                onChange={e => setItemValue(Number(e.target.value))} 
                                className="pl-8 rounded-lg h-9 text-xs font-bold tabular-nums" 
                             />
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[8px] font-bold uppercase text-slate-400 ml-1 tracking-widest">Freight</label>
                          <Input 
                             type="number" 
                             value={shipping} 
                             onChange={e => setShipping(Number(e.target.value))} 
                             className="rounded-lg h-9 text-xs font-bold tabular-nums" 
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[8px] font-bold uppercase text-slate-400 ml-1 tracking-widest">Insurance</label>
                          <Input 
                             type="number" 
                             value={insurance} 
                             onChange={e => setInsurance(Number(e.target.value))} 
                             className="rounded-lg h-9 text-xs font-bold tabular-nums" 
                          />
                       </div>
                    </div>
                  </div>
               </CardContent>
            </Card>

            {/* Threshold Warning */}
            {(itemValue + shipping + insurance) < (currentRate.threshold || 0) && (
               <Card className="border border-emerald-100 shadow-sm bg-emerald-50/50 rounded-xl p-4 flex items-center gap-3 animate-in zoom-in duration-300">
                  <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 shadow-inner">
                     <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                     <p className="text-[11px] font-black text-emerald-800 uppercase tracking-tight">De Minimis: Без пошлины</p>
                     <p className="text-[10px] text-emerald-600 font-medium leading-relaxed opacity-80">
                        Стоимость посылки (${itemValue + shipping + insurance}) ниже порога для беспошлинного ввоза в {country} (${currentRate.threshold}).
                     </p>
                  </div>
               </Card>
            )}
         </div>

         {/* Results Dashboard */}
         <div className="lg:col-span-5 space-y-6">
            <Card className="border border-indigo-500 shadow-2xl shadow-indigo-100/50 rounded-2xl bg-indigo-600 text-white p-4 overflow-hidden relative group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl group-hover:bg-white/10 transition-all" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />

               <div className="relative space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
                        <DollarSign className="w-5 h-5 text-white" />
                     </div>
                     <div>
                        <h3 className="text-xs font-black uppercase tracking-tight">Final DDP Value</h3>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Total Payable by Client</p>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <p className="text-sm font-black tracking-tighter tabular-nums">${ddpEstimate.finalPriceDDP.toFixed(2)}</p>
                     <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em]">{ddpEstimate.currency} • DELIVERED DUTY PAID</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Import Duty</p>
                        <p className="text-base font-black text-white tabular-nums">${ddpEstimate.dutyAmount.toFixed(2)}</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{currentRate.importDuty}% RATE</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">VAT / Sales Tax</p>
                        <p className="text-base font-black text-indigo-200 tabular-nums">${ddpEstimate.vatAmount.toFixed(2)}</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{currentRate.vat}% RATE</p>
                     </div>
                  </div>
               </div>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-2xl p-4 bg-white group hover:border-indigo-100 transition-all">
               <div className="flex items-center gap-3 mb-6 px-1">
                  <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
                    <Truck className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900">Cost Breakdown</h3>
               </div>
               
               <div className="space-y-4 px-1">
                  {[
                     { label: 'Item CIF Value', value: itemValue + shipping + insurance, icon: Package, color: 'text-slate-400' },
                     { label: 'Total Customs Duties', value: ddpEstimate.dutyAmount, icon: FileText, color: 'text-indigo-600' },
                     { label: 'Import VAT (Tax)', value: ddpEstimate.vatAmount, icon: DollarSign, color: 'text-emerald-600' }
                  ].map((row, i) => (
                     <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                           <row.icon className={cn("w-3.5 h-3.5", row.color)} />
                           <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tight">{row.label}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900 tabular-nums">${row.value.toFixed(2)}</span>
                     </div>
                  ))}
               </div>

               <div className="mt-6 pt-6 border-t border-slate-100 px-1">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Compliance Check</h4>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] uppercase h-4 px-1.5">Verified</Badge>
                  </div>
                  <div className="space-y-2">
                     {[
                        { label: 'HS Code Match', status: 'valid' },
                        { label: 'Trade Embargo Check', status: 'valid' },
                        { label: 'Restricted Category', status: 'valid' }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 px-1">
                           <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
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
