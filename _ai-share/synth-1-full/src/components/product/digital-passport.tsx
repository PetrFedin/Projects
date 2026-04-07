'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Leaf, Factory, Globe, Database, 
  QrCode, Fingerprint, Info, Share2, ArrowLeft,
  Lock, History, CheckCircle2, Zap, Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function DigitalProductPassport() {
  const [activeTab, setActiveTab] = useState<'origin' | 'eco' | 'verify'>('origin');

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in duration-1000">
      {/* Mobile-Style Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md rounded-xl border border-slate-100 sticky top-4 z-50 shadow-xl">
        <Button variant="ghost" size="icon" className="rounded-full">
           <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Digital Passport v2.0</p>
           <h1 className="text-sm font-black uppercase tracking-tighter">Urban Tech Parka #001</h1>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
           <Share2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Product visual */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl group">
        <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800" alt="Product" className="object-cover w-full h-full" />
        <div className="absolute top-4 left-6 flex flex-col gap-2">
           <Badge className="bg-emerald-500 text-white border-none font-black text-[9px] uppercase px-3 py-1">Verified Authentic</Badge>
           <Badge className="bg-black/50 backdrop-blur-md text-white border-none font-black text-[9px] uppercase px-3 py-1">Blockchain ID: 0x82...f42</Badge>
        </div>
        <div className="absolute bottom-6 right-6">
           <div className="h-12 w-12 bg-white p-2 rounded-2xl shadow-2xl">
              <QrCode className="h-full w-full" />
           </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200">
         {['origin', 'eco', 'verify'].map((tab) => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={cn(
               "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all",
               activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
             )}
           >
             {tab === 'origin' ? 'История' : tab === 'eco' ? 'Экология' : 'Подлинность'}
           </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'origin' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <Card className="rounded-xl border-slate-100 shadow-sm p-4 space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                   <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <History className="h-6 w-6 text-indigo-600" />
                   </div>
                   <div>
                      <h3 className="text-base font-black uppercase tracking-tight">Путь изделия</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">От фермы до ваших рук</p>
                   </div>
                </div>
                
                <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                   {[
                     { stage: 'Ферма (Сырье)', location: 'Tasmania, AU', date: 'Сен 2025', icon: Leaf, desc: 'Шерсть мериноса высшей категории.' },
                     { stage: 'Производство ткани', location: 'Biella, IT', date: 'Окт 2025', icon: Factory, desc: 'Ткачество и финишная обработка.' },
                     { stage: 'Пошив коллекции', location: 'Moscow, RU', date: 'Дек 2025', icon: Scissors, desc: 'Финальная сборка в Syntha Factory.' },
                     { stage: 'Ваша покупка', location: 'Syntha Store', date: 'Янв 2026', icon: ShoppingBag, desc: 'Продано и верифицировано.' }
                   ].map((step, i) => (
                     <div key={i} className="flex gap-3 relative z-10">
                        <div className="h-12 w-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                           <step.icon className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="space-y-1 pt-1">
                           <div className="flex items-center justify-between">
                              <p className="text-[11px] font-black uppercase text-slate-900">{step.stage}</p>
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{step.date}</span>
                           </div>
                           <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{step.location}</p>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </Card>
          </motion.div>
        )}

        {activeTab === 'eco' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <Card className="rounded-xl border-none bg-emerald-900 text-white p-4 space-y-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Leaf className="h-40 w-40" />
                </div>
                <div className="space-y-1 relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Sustainability Score</p>
                   <h3 className="text-sm font-black tracking-tighter uppercase">Elite Grade</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 relative z-10">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-emerald-300">Carbon Footprint</p>
                      <h4 className="text-sm font-black tabular-nums">4.2 <span className="text-xs text-emerald-500">kg CO2</span></h4>
                      <Progress value={20} className="h-1 bg-emerald-800" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-emerald-300">Water Saved</p>
                      <h4 className="text-sm font-black tabular-nums">1.2k <span className="text-xs text-emerald-500">liters</span></h4>
                      <Progress value={85} className="h-1 bg-emerald-800" />
                   </div>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md relative z-10 border border-white/10">
                   <p className="text-[10px] font-medium leading-relaxed italic">
                      «Это изделие на 88% состоит из переработанных материалов. Произведено с использованием солнечной энергии на фабрике Syntha.»
                   </p>
                </div>
             </Card>
          </motion.div>
        )}

        {activeTab === 'verify' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <Card className="rounded-xl border-slate-100 shadow-xl p-3 text-center space-y-4">
                <div className="h-24 w-24 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                   <ShieldCheck className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-sm font-black uppercase tracking-tighter">Authenticity Verified</h3>
                   <p className="text-sm text-slate-500 font-medium">Это изделие является оригинальным продуктом бренда Syntha Lab.</p>
                </div>
                <div className="space-y-4 pt-4">
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <Fingerprint className="h-5 w-5 text-indigo-600" />
                         <span className="text-[10px] font-black uppercase text-slate-900">NFC Chip Status</span>
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase">Active</Badge>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <Lock className="h-5 w-5 text-indigo-600" />
                         <span className="text-[10px] font-black uppercase text-slate-900">Blockchain Record</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">View on Etherscan</span>
                   </div>
                </div>
                <div className="p-4 bg-slate-100 rounded-xl text-slate-900 border border-slate-200">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2">Владение изделием</p>
                   <p className="text-xs opacity-70 mb-6">Ваш цифровой паспорт подтверждает право собственности и подлинность изделия на протяжении всего жизненного цикла.</p>
                   <Button className="w-full h-12 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm">
                      История обслуживания
                   </Button>
                </div>
             </Card>
          </motion.div>
        )}
      </div>

      <footer className="text-center pb-20">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Syntha Ecosystem • All rights reserved</p>
      </footer>
    </div>
  );
}

function Scissors(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/></svg>
}

function ShoppingBag(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
}
