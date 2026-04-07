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
  DollarSign
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
    const vatRate = destination === 'Russia' ? 0.20 : 0.19; // 20% VAT for RU
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
      multiplier: totalLanded / fobPrice
    };
  }, [fobPrice, destination, shippingMethod]);

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Calculator className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              TRADE_COMPLIANCE_v1.5
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Калькулятор<br/>Себестоимости
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Определение полной стоимости товара с учетом логистики, пошлин, налогов и страховки до двери покупателя.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              Экспорт анализа
           </Button>
           <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
              Применить к заказу #8821 <ArrowRight className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Input Parameters */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4">
            <CardHeader className="p-0 mb-8">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Параметры сделки</CardTitle>
            </CardHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Оптовая цена (FOB)</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₽</span>
                   <Input 
                     type="number" 
                     value={fobPrice}
                     onChange={(e) => setFobPrice(parseInt(e.target.value) || 0)}
                     className="pl-12 h-10 rounded-2xl bg-slate-50 border-none font-black text-sm" 
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Страна назначения</label>
                <div className="grid grid-cols-2 gap-2">
                   {['Russia', 'UAE', 'EU', 'USA'].map(dest => (
                     <Button 
                       key={dest}
                       onClick={() => setDestination(dest)}
                       variant={destination === dest ? 'default' : 'outline'}
                       className={cn(
                         "h-12 rounded-xl text-[9px] font-black uppercase tracking-widest",
                         destination === dest ? "bg-slate-900" : "border-slate-100"
                       )}
                     >
                        {dest === 'Russia' ? 'Россия' : dest === 'UAE' ? 'ОАЭ' : dest === 'EU' ? 'Европа' : dest === 'USA' ? 'США' : dest}
                     </Button>
                   ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Режим доставки</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                   <Button 
                     onClick={() => setShippingMethod('air')}
                     className={cn(
                       "flex-1 h-10 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all",
                       shippingMethod === 'air' ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400"
                     )}
                   >
                     АВИА
                   </Button>
                   <Button 
                     onClick={() => setShippingMethod('sea')}
                     className={cn(
                       "flex-1 h-10 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all",
                       shippingMethod === 'sea' ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400"
                     )}
                   >
                     МОРЕ/АВТО
                   </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-indigo-600 text-white p-4">
             <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                   <Info className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-sm font-black uppercase tracking-tight">Тарифное предупреждение</h4>
                   <p className="text-[9px] font-medium text-white/60 leading-relaxed">
                     Недавние изменения в законодательстве региона ({destination === 'Russia' ? 'Россия' : destination === 'UAE' ? 'ОАЭ' : destination === 'EU' ? 'Европа' : destination === 'USA' ? 'США' : destination}) могут повлиять на коды ТН ВЭД для синтетических мембранных тканей. Множитель: 1.4x.
                   </p>
                </div>
             </div>
          </Card>
        </div>

        {/* Results / Breakdown */}
        <div className="lg:col-span-8 space-y-4">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2">
               <div className="p-3 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Итоговая себестоимость</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Расчетная оценка финальной доставки</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                          <span className="text-[10px] font-black uppercase text-slate-400">Оптовая цена (FOB)</span>
                       </div>
                       <span className="text-sm font-black text-slate-900">{fobPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span className="text-[10px] font-black uppercase text-slate-400">Логистика и страх.</span>
                       </div>
                       <span className="text-sm font-black text-slate-900">{(calculations.shipping + calculations.insurance).toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span className="text-[10px] font-black uppercase text-slate-400">Пошлины и сборы</span>
                       </div>
                       <span className="text-sm font-black text-slate-900">{calculations.duty.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-slate-50">
                       <div className="flex items-center gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black uppercase text-slate-400">НДС (20%)</span>
                       </div>
                       <span className="text-sm font-black text-slate-900">{calculations.vat.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-2xl">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Итоговая оценка (Landed)</p>
                        <p className="text-base font-black">{Math.round(calculations.total).toLocaleString('ru-RU')} ₽</p>
                     </div>
                     <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-3 flex flex-col justify-center space-y-10 border-l border-slate-100">
                  <div className="space-y-4">
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Множитель цены</h4>
                     <div className="relative h-40 w-40 flex items-center justify-center">
                        <svg className="h-full w-full rotate-[-90deg]">
                           <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                           <motion.circle 
                             cx="80" cy="80" r="70" fill="none" stroke="#6366f1" strokeWidth="12" 
                             strokeDasharray="440"
                             initial={{ strokeDashoffset: 440 }}
                             animate={{ strokeDashoffset: 440 - (440 * (calculations.multiplier - 1)) }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                           />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <span className="text-base font-black text-slate-900">{calculations.multiplier.toFixed(2)}x</span>
                           <span className="text-[8px] font-black uppercase text-slate-400">Коэффициент наценки</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-white shadow-sm space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-slate-900">Налоговая эффективность</span>
                          <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">ВЫСОКАЯ</Badge>
                       </div>
                       <p className="text-[9px] font-medium text-slate-400 leading-relaxed uppercase">
                         Обнаружен оптимальный маршрут через хаб Дубай. Потенциальная экономия 4.2% на региональных пошлинах.
                       </p>
                    </div>
                    <Button variant="ghost" className="w-full h-10 text-[9px] font-black uppercase tracking-widest text-indigo-600 gap-2">
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
