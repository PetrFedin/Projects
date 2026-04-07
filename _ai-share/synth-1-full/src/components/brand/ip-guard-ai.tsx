'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, ShieldAlert, Eye, Search, 
  ExternalLink, FileText, AlertCircle, 
  RefreshCcw, CheckCircle2, Globe, Scale,
  Camera, Zap, Fingerprint, Lock, Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DETECTIONS = [
  { 
    id: 'd1', 
    marketplace: 'AliExpress', 
    title: 'High Tech Urban Jacket (Replica)', 
    price: '3,200 ₽', 
    match: 94, 
    status: 'risk', 
    date: 'Сегодня',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200' 
  },
  { 
    id: 'd2', 
    marketplace: 'Wildberries', 
    title: 'Куртка мужская демисезонная (Design Copy)', 
    price: '4,500 ₽', 
    match: 82, 
    status: 'warning', 
    date: 'Вчера',
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=200' 
  },
  { 
    id: 'd3', 
    marketplace: 'Ozon', 
    title: 'Брюки в стиле Syntha Lab', 
    price: '2,800 ₽', 
    match: 75, 
    status: 'ignored', 
    date: '2 дня назад',
    image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=200' 
  }
];

export function IpGuardAi() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(true);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-rose-600 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-6 w-6 text-white" />
              <span className="text-[10px] font-black text-rose-200 uppercase tracking-widest">Brand Protection Engine</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">IP Guard AI</CardTitle>
            <CardDescription className="text-rose-100 font-medium italic">Автоматический поиск копий вашего дизайна на маркетплейсах и защита авторских прав.</CardDescription>
          </div>
          <Button 
            onClick={startScan}
            disabled={isScanning}
            className="bg-white text-rose-600 hover:bg-rose-50 rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl"
          >
            {isScanning ? <RefreshCcw className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Запустить сканер IP
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Status Feed */}
          <div className="lg:col-span-8 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Обнаруженные совпадения</h4>
                <div className="flex gap-2">
                   <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px] uppercase">Marketplaces: 12</Badge>
                   <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px] uppercase">Social Media: 42</Badge>
                </div>
             </div>

             <div className="space-y-4">
                <AnimatePresence>
                  {isScanning && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-slate-50 rounded-xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center space-y-4 text-center"
                    >
                       <RefreshCcw className="h-10 w-10 text-rose-500 animate-spin" />
                       <div>
                          <p className="text-sm font-black uppercase tracking-tighter">Нейронное сравнение визуальных кодов...</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Проверка WB, OZON, Ali, Lamoda, Instagram</p>
                       </div>
                       <div className="w-full max-w-sm">
                          <Progress value={scanProgress} className="h-1.5 bg-slate-200" />
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isScanning && MOCK_DETECTIONS.map((det) => (
                  <motion.div 
                    key={det.id}
                    layoutId={det.id}
                    className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-xl hover:border-rose-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                       <div className="relative h-20 w-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                          <Image src={det.image} alt="Detection" fill className="object-cover" />
                          <div className="absolute inset-0 bg-rose-600/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-black text-rose-600 uppercase">{det.marketplace}</span>
                             <Badge className={cn(
                               "text-[7px] font-black uppercase h-4 px-1.5",
                               det.status === 'risk' ? "bg-rose-500 text-white" :
                               det.status === 'warning' ? "bg-amber-500 text-white" :
                               "bg-slate-100 text-slate-400"
                             )}>
                               {det.match}% Match
                             </Badge>
                          </div>
                          <h5 className="text-sm font-black uppercase text-slate-900 tracking-tight">{det.title}</h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{det.price} • {det.date}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-slate-100 hover:bg-slate-50">
                          <Eye className="h-5 w-5 text-slate-400" />
                       </Button>
                       <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest hover:bg-rose-600 transition-colors shadow-lg">
                          <FileText className="h-4 w-4 mr-2" /> Сформировать претензию
                       </Button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* IP Stats Sidebar */}
          <div className="lg:col-span-4 space-y-4">
             <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Fingerprint className="h-32 w-32" />
                </div>
                
                <div className="space-y-1 relative z-10">
                   <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest">Design Assets Protected</p>
                   <h3 className="text-sm font-black tabular-nums">142 <span className="text-sm text-white/40">SKU</span></h3>
                </div>

                <div className="space-y-4 relative z-10 pt-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase text-white/60">Успешных блокировок</span>
                         <span className="text-[9px] font-black text-emerald-400">12 в этом мес.</span>
                      </div>
                      <Progress value={85} className="h-1 bg-white/10" />
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase text-white/60">Сохраненная маржа</span>
                         <span className="text-[9px] font-black text-rose-400">4.2M ₽</span>
                      </div>
                      <Progress value={45} className="h-1 bg-white/10" />
                   </div>
                </div>

                <Button className="w-full h-10 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-rose-500 transition-colors relative z-10">
                   <Scale className="h-4 w-4 mr-2" /> Юридический пакет PRO
                </Button>
             </div>

             <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                   <Lock className="h-6 w-6" />
                </div>
                <div className="space-y-2 pt-1">
                   <p className="text-[11px] font-black uppercase text-indigo-900 leading-none">Smart Watermark</p>
                   <p className="text-[10px] text-indigo-700/80 font-medium leading-relaxed">
                      Все ваши лекала и 3D-модели промаркированы невидимым цифровым кодом Syntha IP. Это упрощает победу в судах на 100%.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
