'use client';

import React, { useState } from 'react';
import { 
  Users, MessageSquare, FileText, Zap, Eye, CheckCircle2, 
  Clock, Share2, Plus, Sparkles, Box, Layout, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MOCK_PROPOSALS = [
  { id: 'p1', supplier: 'TexWorld Italy', material: 'Eco-Nylon 2.0', status: 'pending', match: 98, time: '2ч назад' },
  { id: 'p2', supplier: 'Nordic Wool Co', material: 'Merino Blend XP', status: 'approved', match: 92, time: '1д назад' },
  { id: 'p3', supplier: 'Silk Road Silk', material: 'Raw Silk Canvas', status: 'rejected', match: 75, time: '3д назад' }
];

export function SupplierCollabHub() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'live'>('proposals');

  return (
    <Card className="rounded-xl border-slate-100 shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-4 border-b border-slate-50">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Collaborative Sourcing 2.0</span>
            </div>
            <CardTitle className="text-base font-bold uppercase tracking-tighter">Supplier Collab Lab</CardTitle>
            <CardDescription className="text-sm font-medium">
              Прямая синхронизация поставщиков материалов с вашим отделом дизайна. Сокращение цикла закупки в 3 раза.
            </CardDescription>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
             <button 
                onClick={() => setActiveTab('proposals')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all", activeTab === 'proposals' ? "bg-white text-black shadow-sm" : "text-slate-400")}
             >
               Предложения
             </button>
             <button 
                onClick={() => setActiveTab('live')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all", activeTab === 'live' ? "bg-white text-black shadow-sm" : "text-slate-400")}
             >
               Live Сессия
             </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {activeTab === 'proposals' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Column: Sketch & Design Context */}
            <div className="lg:col-span-1 space-y-4">
               <div className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800" alt="Sketch" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
                     <Layout className="h-8 w-8 mb-2" />
                     <p className="text-[10px] font-bold uppercase">Текущий концепт: Tech-Minimalism SS26</p>
                  </div>
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-indigo-600 text-white font-bold uppercase text-[8px]">Design Context</Badge>
                  </div>
               </div>
               <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold uppercase text-white/40">Требования AI</p>
                  <p className="text-[11px] font-bold uppercase tracking-tight leading-relaxed">"Ищем водоотталкивающий нейлон с матовым финишем. Плотность 120-150г/м. Эко-сертификат обязателен."</p>
               </div>
            </div>

            {/* Right Column: Supplier Proposals */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Входящие предложения под эскиз</h4>
                <div className="flex gap-2">
                   <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      <span className="text-[9px] font-bold uppercase tracking-tighter">AI Match Enabled</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                {MOCK_PROPOSALS.map((prop) => (
                  <motion.div 
                    key={prop.id}
                    whileHover={{ x: 10 }}
                    className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
                          <Box className="h-6 w-6 text-slate-300" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-0.5">
                             <p className="text-[11px] font-bold uppercase text-slate-900">{prop.material}</p>
                             <Badge className={cn(
                               "text-[7px] font-bold uppercase h-4 px-1.5",
                               prop.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                               prop.status === 'rejected' ? "bg-rose-100 text-rose-600" :
                               "bg-slate-100 text-slate-500"
                             )}>
                               {prop.status}
                             </Badge>
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{prop.supplier} • {prop.time}</p>
                          <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center gap-1 text-indigo-600">
                                <Zap className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase">{prop.match}% AI Match</span>
                             </div>
                             <div className="flex items-center gap-1 text-slate-400">
                                <MessageSquare className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase">4 сообщения</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-slate-100">
                          <Eye className="h-4 w-4 text-slate-400" />
                       </Button>
                       <Button className="h-10 bg-indigo-600 text-white rounded-xl px-6 font-bold uppercase text-[9px] tracking-widest hover:scale-105 transition-transform">
                          Обсудить
                       </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-bold uppercase text-slate-400 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                 <Plus className="h-4 w-4" /> Запросить образцы у других поставщиков
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 text-center space-y-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-3xl" />
             <div className="relative z-10 space-y-4">
                <div className="h-20 w-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50">
                   <Zap className="h-10 w-10 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold uppercase text-white tracking-tighter">Live Sourcing Session</h3>
                <p className="text-sm text-white/60 max-w-[400px] mx-auto leading-relaxed">Присоединяйтесь к прямой трансляции с производства или шоурума поставщика для мгновенного утверждения материалов.</p>
                <div className="pt-4">
                   <Button className="bg-white text-indigo-900 rounded-2xl px-12 h-10 font-bold uppercase text-[11px] tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-white/10">
                      Войти в Live Session
                   </Button>
                </div>
             </div>
             <div className="grid grid-cols-4 gap-3 relative z-10 pt-8 opacity-40">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-video bg-white/5 rounded-xl border border-white/10" />
                ))}
             </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
