'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Video, Radio, Users, MessageSquare, Heart, 
  ShoppingBag, Zap, Activity, Settings, 
  Play, Pause, Mic, Monitor, Share2, Eye, Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

export default function BrandLiveDashboard() {
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(1242);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <SectionInfoCard
        title="Live Broadcast"
        description="Прямые эфиры для B2B и B2C. Связь с Media (трансляции), Products (презентация) и Pre-orders."
        icon={Radio}
        iconBg="bg-rose-100"
        iconColor="text-rose-600"
        badges={<><Badge variant="outline" className="text-[9px]">Media</Badge><Badge variant="outline" className="text-[9px]">Products</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/media">Media</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/pre-orders"><Package className="h-3 w-3 mr-1" /> Pre-orders</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
         <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
              isLive ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"
            )}>
               <Radio className="h-7 w-7" />
            </div>
            <div>
               <h1 className="text-base font-black uppercase tracking-tighter">Live Broadcast Control</h1>
               <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", isLive ? "bg-rose-500 animate-pulse" : "bg-slate-300")} />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                     {isLive ? 'В ЭФИРЕ: Презентация коллекции SS26' : 'Ожидание запуска'}
                  </p>
               </div>
            </div>
         </div>
         <div className="flex gap-3">
            <Button onClick={() => setIsLive(!isLive)} className={cn(
              "h-10 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all",
              isLive ? "bg-slate-900 text-white" : "bg-rose-600 text-white"
            )}>
               {isLive ? 'Завершить эфир' : 'Выйти в прямой эфир'}
            </Button>
            <Button variant="outline" className="h-10 w-10 rounded-2xl border-slate-200"><Settings className="h-5 w-5 text-slate-400" /></Button>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
         {/* Live Preview / Producer View */}
         <div className="lg:col-span-8 space-y-6">
            <Card className="rounded-xl border-none shadow-2xl bg-black overflow-hidden relative aspect-video">
               <div className="absolute inset-0 flex items-center justify-center">
                  {!isLive ? (
                    <div className="text-center space-y-4">
                       <div className="h-20 w-20 bg-white/10 rounded-full mx-auto flex items-center justify-center border border-white/20">
                          <Play className="h-8 w-8 text-white fill-white" />
                       </div>
                       <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Нажмите кнопку вверху, чтобы начать трансляцию</p>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                       <Video className="h-24 w-24 text-white/10" />
                       <div className="absolute top-4 left-8 flex gap-3">
                          <Badge className="bg-rose-600 text-white border-none font-black text-[10px]">LIVE</Badge>
                          <Badge className="bg-black/40 text-white border-none font-black text-[10px] backdrop-blur-md">00:42:12</Badge>
                       </div>
                       <div className="absolute top-4 right-8">
                          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                             <Eye className="h-3 w-3 text-white" />
                             <span className="text-[10px] font-black text-white">{viewers.toLocaleString('ru-RU')}</span>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
               
               {isLive && (
                 <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="flex gap-3">
                       <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer">
                          <Mic className="h-5 w-5" />
                       </div>
                       <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer">
                          <Monitor className="h-5 w-5" />
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button className="bg-indigo-600 text-white rounded-xl h-12 px-6 font-black uppercase text-[10px]">Pinned: Tech Parka v2</Button>
                    </div>
                 </div>
               )}
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-rose-500" /> Продажи в эфире
                     </h4>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px]">Real-time</Badge>
                  </div>
                  <div className="space-y-4">
                     {[
                       { name: 'Urban Tech Parka', qty: 12, price: '18,000 ₽' },
                       { name: 'Cyber Silk Scarf', qty: 42, price: '4,500 ₽' }
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
                          <div>
                             <p className="text-[10px] font-black uppercase text-slate-900">{item.name}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase">{item.qty} заказов</p>
                          </div>
                          <span className="text-sm font-black text-indigo-600">{item.price}</span>
                       </div>
                     ))}
                  </div>
               </Card>

               <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 space-y-6">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                     <MessageSquare className="h-4 w-4" /> Чат модерация
                  </h4>
                  <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                     {[
                       { user: '@alex_v', msg: 'Какая плотность у ткани?' },
                       { user: '@stylist_pro', msg: 'Это будет в новых цветах?' },
                       { user: '@retail_buyer', msg: 'Какая минимальная партия для опта?' }
                     ].map((chat, i) => (
                       <div key={i} className="space-y-1">
                          <p className="text-[9px] font-black text-white/40 uppercase">{chat.user}</p>
                          <p className="text-[11px] font-medium leading-relaxed">{chat.msg}</p>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
         </div>

         {/* Side Panel: Analytics & Controls */}
         <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white p-4 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Activity className="h-32 w-32" /></div>
               <div className="relative z-10 space-y-6">
                  <Badge className="bg-white/20 text-white border-none uppercase text-[8px] font-black">Conversion Insights</Badge>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                           <span>Удержание аудитории</span>
                           <span>84%</span>
                        </div>
                        <Progress value={84} className="h-1 bg-white/10" />
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                           <span>CTR в корзину</span>
                           <span>12.4%</span>
                        </div>
                        <Progress value={65} className="h-1 bg-white/10" />
                     </div>
                  </div>
                  <p className="text-[10px] text-indigo-100 font-medium leading-relaxed italic">
                     «Упоминание экологичности ткани увеличило поток заказов на 15% за последние 2 минуты».
                  </p>
               </div>
            </Card>

            <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xl space-y-6">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Управление Офферами</h4>
               <div className="space-y-4">
                  <Button className="w-full h-12 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-rose-600 hover:text-white transition-all">Спеццена для эфира ON</Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-400 text-[9px] font-black uppercase">Запустить опрос</Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-400 text-[9px] font-black uppercase">Разыграть купон</Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
