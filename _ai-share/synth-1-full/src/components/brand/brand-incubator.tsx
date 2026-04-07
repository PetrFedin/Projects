'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, Sparkles, Palette, Fingerprint, 
  Target, Globe, BookOpen, PenTool, CheckCircle2,
  RefreshCcw, ArrowRight, ShieldCheck, Heart,
  Zap, Layout, Layers, Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function BrandIncubator() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dnaResult, setDnaResult] = useState<any>(null);

  const generateDNA = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDnaResult({
        philosophy: "Cyber-Heritage: Сочетание традиционного портновского мастерства с функциональностью будущего.",
        keywords: ["Адаптивность", "Минимализм", "Устойчивость"],
        visualIdentity: {
          palette: ["Indio Ink", "Digital Lavender", "Graphite"],
          typography: "Geometric Sans-Serif",
          vibe: "High-Tech / Silent Luxury"
        },
        audience: "Urban Nomads (25-40 лет), ценящие мобильность и качество материалов."
      });
      setIsGenerating(false);
      setStep(3);
    }, 2500);
  };

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-indigo-600 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-6 w-6 text-white" />
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Brand Birth Module</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">Brand DNA Incubator</CardTitle>
            <CardDescription className="text-indigo-100 font-medium">Разработка философии, ДНК и концепции бренда с нуля при поддержке Syntha AI.</CardDescription>
          </div>
          <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
             <Fingerprint className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Workflow Steps */}
          <div className="lg:col-span-4 space-y-4">
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Прогресс разработки</p>
                <div className="flex gap-1.5">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", step >= i ? "bg-indigo-600" : "bg-slate-100")} />
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                {[
                  { id: 1, title: 'Концепция и Ценности', icon: BookOpen, desc: 'Определение миссии и духа бренда.' },
                  { id: 2, title: 'Аудитория и Рынок', icon: Target, desc: 'Поиск идеального покупателя.' },
                  { id: 3, title: 'Визуальный Код (DNA)', icon: Palette, desc: 'Палитра, силуэты и детали.' }
                ].map((s) => (
                  <button 
                    key={s.id}
                    onClick={() => setStep(s.id)}
                    className={cn(
                      "w-full p-3 rounded-2xl border-2 transition-all flex items-center gap-3 text-left",
                      step === s.id ? "border-indigo-600 bg-indigo-50/50" : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", step === s.id ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-400")}>
                       <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black uppercase text-slate-900">{s.title}</p>
                       <p className="text-[9px] text-slate-500 font-medium leading-tight">{s.desc}</p>
                    </div>
                  </button>
                ))}
             </div>

             {step < 3 && (
               <Button className="w-full h-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">
                  Продолжить настройку
               </Button>
             )}
             
             {step === 3 && !dnaResult && (
               <Button 
                onClick={generateDNA}
                disabled={isGenerating}
                className="w-full h-12 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 transition-transform"
               >
                 {isGenerating ? <RefreshCcw className="h-5 w-5 animate-spin mr-3" /> : <Sparkles className="h-5 w-5 mr-3 text-amber-400" />}
                 Сгенерировать ДНК Бренда
               </Button>
             )}
          </div>

          {/* Result Canvas */}
          <div className="lg:col-span-8 bg-slate-50 rounded-xl border border-slate-100 p-3 relative overflow-hidden flex flex-col justify-center">
             <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div 
                    key="gen"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center space-y-6 text-center"
                  >
                     <div className="relative">
                        <div className="h-24 w-24 border-4 border-indigo-100 rounded-full animate-spin border-t-indigo-600" />
                        <BrainCircuit className="absolute inset-0 m-auto h-10 w-10 text-indigo-600 animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-tighter">Идет процесс рождения бренда...</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Анализ глобальных трендов и ваших предпочтений</p>
                     </div>
                  </motion.div>
                ) : dnaResult ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-10"
                  >
                     <div className="space-y-4">
                        <Badge className="bg-indigo-600 text-white border-none font-black text-[8px] uppercase px-3 py-1">Identity Confirmed</Badge>
                        <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">Философия Бренда</h3>
                        <p className="text-sm text-indigo-900 font-medium italic leading-relaxed">«{dnaResult.philosophy}»</p>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-6">
                           <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b pb-2 flex items-center gap-2">
                              <Palette className="h-4 w-4 text-indigo-600" /> Визуальный Код
                           </h5>
                           <div className="space-y-4">
                              <div className="flex gap-2">
                                 {dnaResult.visualIdentity.palette.map((color: string, i: number) => (
                                   <div key={i} className="flex flex-col items-center gap-2">
                                      <div className={cn("h-12 w-12 rounded-xl shadow-sm border border-white", i === 0 ? "bg-slate-900" : i === 1 ? "bg-indigo-200" : "bg-slate-400")} />
                                      <span className="text-[8px] font-bold text-slate-400 uppercase">{color}</span>
                                   </div>
                                 ))}
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Шрифт: <span className="text-slate-900 font-black">{dnaResult.visualIdentity.typography}</span></p>
                              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Вайб: <span className="text-slate-900 font-black uppercase">{dnaResult.visualIdentity.vibe}</span></p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b pb-2 flex items-center gap-2">
                              <Target className="h-4 w-4 text-indigo-600" /> Целевая Аудитория
                           </h5>
                           <div className="space-y-4">
                              <p className="text-sm font-bold text-slate-700 leading-relaxed">{dnaResult.audience}</p>
                              <div className="flex flex-wrap gap-2">
                                 {dnaResult.keywords.map((k: string, i: number) => (
                                   <Badge key={i} variant="outline" className="border-indigo-100 text-indigo-600 font-black uppercase text-[8px]">{k}</Badge>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                              <PenTool className="h-7 w-7 text-white" />
                           </div>
                           <div>
                              <h4 className="text-base font-black uppercase tracking-tighter">Начать проектирование коллекции</h4>
                              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Авто-наполнение ассортиментной матрицы на основе ДНК</p>
                           </div>
                        </div>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black uppercase text-[10px] h-12 px-8 shadow-2xl">
                           В PLM-Матрицу <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                     </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                     <div className="h-20 w-20 bg-slate-200 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-slate-400" />
                     </div>
                     <div>
                        <h4 className="text-base font-black uppercase tracking-tighter">Заполните анкету слева</h4>
                        <p className="text-xs font-bold text-slate-400 uppercase max-w-xs mx-auto">Чтобы AI мог построить структуру вашего бренда, нам нужно понять ваши базовые идеи.</p>
                     </div>
                  </div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
