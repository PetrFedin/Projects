'use client';

import React, { useState } from 'react';
import { 
  DollarSign, Landmark, ArrowRight, ShieldCheck, 
  Zap, Clock, FileText, CheckCircle2, TrendingUp,
  BrainCircuit, Scale, Percent, Wallet, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_FINANCING_OFFERS = [
  {
    id: 'f1',
    type: 'Factoring',
    title: 'Мгновенный Факторинг',
    desc: 'Бренд получает оплату сразу, вы платите через 60 дней.',
    limit: '5,000,000 ₽',
    rate: '1.2%',
    period: '60 дней',
    icon: Zap,
    color: 'bg-amber-500',
    status: 'Доступно'
  },
  {
    id: 'f2',
    type: 'Credit',
    title: 'Кредитная Линия на подсорт',
    desc: 'Оборотные средства для срочного выкупа хитов продаж.',
    limit: '2,500,000 ₽',
    rate: '14% годовых',
    period: '12 месяцев',
    icon: Landmark,
    color: 'bg-indigo-600',
    status: 'Пре-аппрув'
  }
];

export function B2BFintech() {
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => setIsApplying(false), 2000);
  };

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 bg-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Fintech Gateway</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">B2B Fintech & Факторинг</CardTitle>
            <CardDescription className="text-sm font-medium">Финансовые инструменты для масштабирования ваших закупок и управления кэш-флоу.</CardDescription>
          </div>
          <div className="flex gap-2">
             <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase px-3 py-1">Кредитный лимит: 7.5M ₽</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-4 space-y-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Использовано</p>
              <h4 className="text-sm font-black text-slate-900 tabular-nums">1.2M ₽</h4>
              <Progress value={16} className="h-1 bg-slate-200 mt-3" />
           </div>
           <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">К оплате (30д)</p>
              <h4 className="text-sm font-black text-slate-900 tabular-nums">450,000 ₽</h4>
              <div className="flex items-center gap-2 mt-2">
                 <Clock className="h-3 w-3 text-amber-500" />
                 <span className="text-[9px] font-bold text-amber-600 uppercase">Ближайший платеж: 12 фев</span>
              </div>
           </div>
           <div className="p-4 bg-slate-900 rounded-xl text-white flex flex-col justify-between">
              <div className="flex items-center gap-2">
                 <BrainCircuit className="h-4 w-4 text-indigo-400" />
                 <span className="text-[9px] font-black uppercase tracking-widest">AI Scoring</span>
              </div>
              <div>
                 <h4 className="text-base font-black text-white leading-tight uppercase">High Trust Level</h4>
                 <p className="text-[9px] text-white/40 font-bold uppercase mt-1">Доступна пониженная ставка -0.5%</p>
              </div>
           </div>
        </div>

        {/* Offers Grid */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b pb-2">Доступные предложения</h4>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {MOCK_FINANCING_OFFERS.map((offer) => (
                <div 
                  key={offer.id} 
                  onClick={() => setSelectedOffer(offer.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                    selectedOffer === offer.id ? "border-indigo-600 bg-white shadow-2xl scale-102" : "border-slate-100 bg-slate-50 hover:border-slate-300"
                  )}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", offer.color)}>
                       {React.createElement(offer.icon, { className: "h-6 w-6" })}
                    </div>
                    <Badge className="bg-white/80 backdrop-blur-sm border-none text-slate-900 font-black text-[8px] uppercase">{offer.type}</Badge>
                  </div>
                  
                  <div className="mt-6 space-y-2 relative z-10">
                    <h5 className="text-base font-black uppercase tracking-tighter text-slate-900">{offer.title}</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{offer.desc}</p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3 relative z-10">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Лимит</p>
                        <p className="text-sm font-black text-slate-900">{offer.limit}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Ставка</p>
                        <p className="text-sm font-black text-indigo-600">{offer.rate}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Срок</p>
                        <p className="text-sm font-black text-slate-900">{offer.period}</p>
                     </div>
                  </div>

                  {selectedOffer === offer.id && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between relative z-10"
                    >
                       <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase">Одобрено AI</span>
                       </div>
                       <Button 
                        onClick={(e) => { e.stopPropagation(); handleApply(); }}
                        disabled={isApplying}
                        className="bg-slate-900 text-white rounded-xl px-8 h-10 font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-transform"
                       >
                         {isApplying ? <RefreshCcw className="h-3 w-3 animate-spin mr-2" /> : <ArrowRight className="h-3 w-3 mr-2" />}
                         Активировать
                       </Button>
                    </motion.div>
                  )}

                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-5 transition-opacity">
                     {React.createElement(offer.icon, { className: "h-32 w-32" })}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Security / Compliance */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                 <p className="text-[11px] font-black uppercase text-slate-900 tracking-tight">Безопасность сделок обеспечена Syntha Secure Pay</p>
                 <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Лицензированные финансовые партнеры • Смарт-контракты</p>
              </div>
           </div>
           <Button variant="ghost" className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900">Посмотреть договор</Button>
        </div>
      </CardContent>
    </Card>
  );
}
