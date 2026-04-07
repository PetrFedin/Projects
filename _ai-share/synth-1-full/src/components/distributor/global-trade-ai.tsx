'use client';

import React, { useState } from 'react';
import { 
  Globe, ShieldCheck, FileText, Download, 
  RefreshCcw, CheckCircle2, Zap, Scale,
  Truck, Ship, Plane, AlertTriangle, 
  Calculator, History, ChevronRight, BarChart3,
  ExternalLink, Landmark
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DOCS = [
  { id: 'doc-1', title: 'Export Invoice #9921', country: 'EU / Italy', status: 'ready', type: 'Customs' },
  { id: 'doc-2', title: 'Packing List SS26', country: 'UAE / Dubai', status: 'generating', type: 'Logistics' },
  { id: 'doc-3', title: 'Certificate of Origin', country: 'China / Shanghai', status: 'pending_sign', type: 'Legal' }
];

export function GlobalTradeAi() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeRegion, setActiveRegion] = useState('EU');

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-slate-900 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="h-6 w-6 text-indigo-400" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Compliance Engine</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">Global Trade AI</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Автоматизация таможенных документов, расчет пошлин и экспортный контроль.</CardDescription>
          </div>
          <div className="flex gap-2">
             <Badge className="bg-white/10 text-white border-none font-black text-[9px] uppercase px-3 py-1 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                HS Codes API: Live
             </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Controls Area */}
          <div className="lg:col-span-8 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Активные экспортные потоки</h4>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                   {['EU', 'CIS', 'MENA', 'ASIA'].map(reg => (
                     <button 
                      key={reg} 
                      onClick={() => setActiveRegion(reg)}
                      className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", activeRegion === reg ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                     >
                       {reg}
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                {MOCK_DOCS.map((doc) => (
                  <div key={doc.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm">
                          <FileText className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <p className="text-sm font-black uppercase text-slate-900 tracking-tight">{doc.title}</p>
                             <Badge className={cn(
                                "text-[7px] font-black uppercase h-4 px-1.5",
                                doc.status === 'ready' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                             )}>
                                {doc.status}
                             </Badge>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{doc.country} • {doc.type}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-100">
                          <Download className="h-5 w-5 text-slate-400" />
                       </Button>
                       <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
                          Проверить AI
                       </Button>
                    </div>
                  </div>
                ))}
             </div>

             <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Calculator className="h-7 w-7" />
                   </div>
                   <div>
                      <p className="text-sm font-black uppercase tracking-tighter text-slate-900">Duty Calculator Pro</p>
                      <p className="text-[10px] text-indigo-700/80 font-bold uppercase tracking-widest">Авто-расчет таможенных пошлин и НДС по коду ТН ВЭД</p>
                   </div>
                </div>
                <Button className="h-10 bg-white text-indigo-600 border border-indigo-200 rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                   Рассчитать партию
                </Button>
             </div>
          </div>

          {/* Compliance Sidebar */}
          <div className="lg:col-span-4 space-y-4">
             <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShieldCheck className="h-32 w-32" />
                </div>
                
                <div className="space-y-1 relative z-10">
                   <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Compliance Health</p>
                   <h3 className="text-sm font-black tabular-nums">98.4%</h3>
                   <p className="text-[9px] text-indigo-300/60 font-bold uppercase">Риск задержки документов: Низкий</p>
                </div>

                <div className="space-y-4 relative z-10 pt-4">
                   {[
                     { icon: Landmark, label: "Валютный контроль", status: "Pass" },
                     { icon: Scale, label: "Санкционный комплаенс", status: "Active" },
                     { icon: Zap, label: "HS Code Auto-Matching", status: "94%" }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-3">
                           <item.icon className="h-4 w-4 text-indigo-400" />
                           <span className="text-[10px] font-black uppercase text-white/60">{item.label}</span>
                        </div>
                        <span className="text-[9px] font-black text-emerald-400 uppercase">{item.status}</span>
                     </div>
                   ))}
                </div>

                <Button className="w-full h-10 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-indigo-500 transition-all relative z-10">
                   Новая декларация
                </Button>
             </div>

             <Card className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                   <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-2 pt-1">
                   <p className="text-[11px] font-black uppercase text-amber-900 leading-none">Изменение пошлин (EU)</p>
                   <p className="text-[10px] text-amber-700/80 font-medium leading-relaxed">
                      С 1 марта вводится новый экологический сбор на синтетические волокна в ЕС. AI обновил ваши шаблоны инвойсов.
                   </p>
                </div>
             </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
