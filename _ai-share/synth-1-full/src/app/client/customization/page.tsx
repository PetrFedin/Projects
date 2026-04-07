'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Ruler, 
  Sparkles, 
  ShoppingBag,
  ArrowRight,
  Info,
  Scan,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MOCK_CUSTOMIZATION_PROJECTS, MOCK_BODY_MEASUREMENTS } from '@/lib/logic/customization-utils';
import { CustomOption } from '@/lib/types/customization';
import Link from 'next/link';

export default function CustomizationHubPage() {
  const [step, setStep] = useState<'project' | 'configure' | 'measure' | 'review'>('project');
  const [selectedProject, setSelectedProject] = useState(MOCK_CUSTOMIZATION_PROJECTS[0]);
  const [config, setConfig] = useState<{
    fabric: CustomOption | null;
    button: CustomOption | null;
    pocket: CustomOption | null;
    collar: CustomOption | null;
  }>({
    fabric: selectedProject.availableOptions.fabrics[0],
    button: selectedProject.availableOptions.buttons[0],
    pocket: selectedProject.availableOptions.pockets[0],
    collar: selectedProject.availableOptions.collars[0],
  });

  const totalPrice = selectedProject.basePrice + 
    (config.fabric?.priceDelta || 0) + 
    (config.button?.priceDelta || 0) + 
    (config.pocket?.priceDelta || 0) + 
    (config.collar?.priceDelta || 0);

  const handleOptionSelect = (type: keyof typeof config, option: CustomOption) => {
    setConfig(prev => ({ ...prev, [type]: option }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-tighter italic">Mass Customization Hub</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Индивидуальный пошив P3</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {[
              { id: 'project', label: 'Выбор модели' },
              { id: 'configure', label: 'Дизайн' },
              { id: 'measure', label: 'Мерки' },
              { id: 'review', label: 'Заказ' }
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black",
                  step === s.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-400"
                )}>
                  {i + 1}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  step === s.id ? "text-indigo-600" : "text-slate-400"
                )}>{s.label}</span>
                {i < 3 && <ChevronRight className="h-3 w-3 text-slate-300 ml-2" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Итого</p>
                <p className="text-sm font-black text-indigo-600 tracking-tighter">{totalPrice.toLocaleString('ru-RU')} ₽</p>
             </div>
             <Button className="h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 shadow-xl">
                Купить
             </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">
          {step === 'project' && (
            <motion.div 
              key="project"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {MOCK_CUSTOMIZATION_PROJECTS.map((project) => (
                <Card 
                  key={project.id}
                  className="group cursor-pointer border-none shadow-sm hover:shadow-2xl transition-all rounded-xl overflow-hidden"
                  onClick={() => {
                    setSelectedProject(project);
                    setStep('configure');
                  }}
                >
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Tailored for You</p>
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-4 italic">{project.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white italic">от {project.basePrice.toLocaleString('ru-RU')} ₽</span>
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Feature info */}
              <Card className="lg:col-span-2 border-dashed border-2 border-indigo-200 bg-indigo-50/50 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                 <div className="h-12 w-12 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6">
                    <Sparkles className="h-8 w-8 text-indigo-600" />
                 </div>
                 <h2 className="text-base font-black uppercase tracking-tighter italic text-indigo-900 mb-4">Магия идеальной посадки</h2>
                 <p className="text-slate-600 max-w-md text-sm leading-relaxed mb-8">
                    Мы объединили традиционное мастерство индпошива с технологиями 3D-сканирования тела. Больше никаких примерок и переделок — только вещь, созданная специально для вас.
                 </p>
                 <div className="flex gap-3">
                    <Badge className="bg-white text-indigo-600 border-indigo-100 h-8 px-4 font-black uppercase tracking-widest">3D Scan Tech</Badge>
                    <Badge className="bg-white text-indigo-600 border-indigo-100 h-8 px-4 font-black uppercase tracking-widest">AI Pattern Generator</Badge>
                    <Badge className="bg-white text-indigo-600 border-indigo-100 h-8 px-4 font-black uppercase tracking-widest">Global CMT Network</Badge>
                 </div>
              </Card>
            </motion.div>
          )}

          {step === 'configure' && (
            <motion.div 
              key="configure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-3"
            >
              {/* Product Preview */}
              <div className="lg:col-span-7 xl:col-span-8 sticky top-24">
                <Card className="border-none shadow-2xl rounded-xl overflow-hidden aspect-[4/5] relative bg-white">
                  <img 
                    src={selectedProject.image} 
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-8 p-4 bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl max-w-xs">
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Live Configuration</p>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                           <span className="text-slate-400 uppercase tracking-widest">Ткань:</span>
                           <span className="text-slate-900">{config.fabric?.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold">
                           <span className="text-slate-400 uppercase tracking-widest">Лацкан:</span>
                           <span className="text-slate-900">{config.collar?.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] font-bold">
                           <span className="text-slate-400 uppercase tracking-widest">Карманы:</span>
                           <span className="text-slate-900">{config.pocket?.name}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                     <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 backdrop-blur-md border border-white/20">
                        <Maximize2 className="h-5 w-5" />
                     </Button>
                     <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-900/10 hover:bg-slate-900/20 text-slate-900 backdrop-blur-md border border-white/20">
                        <Sparkles className="h-5 w-5" />
                     </Button>
                  </div>
                </Card>
              </div>

              {/* Configuration Controls */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                   <h2 className="text-sm font-black uppercase tracking-tighter italic mb-6">Настройте детали</h2>
                   
                   <Tabs defaultValue="fabric">
                      <TabsList className="w-full h-12 bg-slate-50 border-none p-1 rounded-2xl mb-8">
                         <TabsTrigger value="fabric" className="flex-1 text-[9px] font-black uppercase tracking-widest rounded-xl">Ткань</TabsTrigger>
                         <TabsTrigger value="collar" className="flex-1 text-[9px] font-black uppercase tracking-widest rounded-xl">Крой</TabsTrigger>
                         <TabsTrigger value="details" className="flex-1 text-[9px] font-black uppercase tracking-widest rounded-xl">Детали</TabsTrigger>
                      </TabsList>

                      <TabsContent value="fabric" className="space-y-6">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Выберите основной материал</p>
                         <div className="grid grid-cols-2 gap-3">
                            {selectedProject.availableOptions.fabrics.map((fabric) => (
                               <div 
                                  key={fabric.id}
                                  onClick={() => handleOptionSelect('fabric', fabric)}
                                  className={cn(
                                    "relative rounded-2xl p-4 border-2 transition-all cursor-pointer",
                                    config.fabric?.id === fabric.id ? "border-indigo-600 bg-indigo-50/50 shadow-md" : "border-slate-50 hover:border-slate-200"
                                  )}
                               >
                                  <div className="h-12 w-full rounded-xl overflow-hidden mb-3">
                                     <img src={fabric.image} className="w-full h-full object-cover" />
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-tight">{fabric.name}</p>
                                  <p className="text-[9px] font-bold text-slate-400">+{fabric.priceDelta} ₽</p>
                                  {config.fabric?.id === fabric.id && (
                                     <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                        <Check className="h-3 w-3" />
                                     </div>
                                  )}
                               </div>
                            ))}
                         </div>
                      </TabsContent>

                      <TabsContent value="collar" className="space-y-6">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Тип лацкана и воротника</p>
                         <div className="space-y-3">
                            {selectedProject.availableOptions.collars.map((collar) => (
                               <div 
                                  key={collar.id}
                                  onClick={() => handleOptionSelect('collar', collar)}
                                  className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                    config.collar?.id === collar.id ? "border-indigo-600 bg-indigo-50/50 shadow-md" : "border-slate-50 hover:border-slate-200"
                                  )}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Scissors className="h-4 w-4 text-slate-400" />
                                     </div>
                                     <span className="text-[11px] font-black uppercase tracking-widest">{collar.name}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-indigo-600">+{collar.priceDelta} ₽</span>
                               </div>
                            ))}
                         </div>
                      </TabsContent>
                      
                      {/* More tabs content... */}
                      <TabsContent value="details" className="space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Пуговицы и карманы</p>
                        {/* Simplified for brevity */}
                        <div className="space-y-3">
                           {selectedProject.availableOptions.pockets.map((pocket) => (
                               <div 
                                  key={pocket.id}
                                  onClick={() => handleOptionSelect('pocket', pocket)}
                                  className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                                    config.pocket?.id === pocket.id ? "border-indigo-600 bg-indigo-50/50 shadow-md" : "border-slate-50 hover:border-slate-200"
                                  )}
                               >
                                  <span className="text-[11px] font-black uppercase tracking-widest">{pocket.name}</span>
                                  <span className="text-[10px] font-bold text-indigo-600">+{pocket.priceDelta} ₽</span>
                               </div>
                            ))}
                        </div>
                      </TabsContent>
                   </Tabs>

                   <div className="mt-12 flex items-center gap-3">
                      <Button variant="outline" className="flex-1 h-12 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest" onClick={() => setStep('project')}>
                         <ChevronLeft className="mr-2 h-4 w-4" /> Назад
                      </Button>
                      <Button className="flex-[2] h-12 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-xl" onClick={() => setStep('measure')}>
                         Перейти к меркам <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'measure' && (
            <motion.div 
              key="measure"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto"
            >
               <Card className="border-none shadow-2xl rounded-xl overflow-hidden bg-slate-900 text-white">
                  <div className="grid md:grid-cols-2">
                     <div className="p-4 border-r border-white/10">
                        <div className="h-12 w-12 rounded-3xl bg-indigo-600 flex items-center justify-center mb-8 shadow-2xl">
                           <Scan className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-base font-black uppercase tracking-tighter italic mb-4 leading-none">3D AI Body Scan</h2>
                        <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">
                           Мы используем данные вашего последнего 3D-сканирования. Точность до 1.5 мм гарантирует, что вещь сядет идеально без единой примерки.
                        </p>
                        
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                 <Check className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Последний скан</p>
                                 <p className="text-[11px] font-bold">{new Date(MOCK_BODY_MEASUREMENTS.scannedAt).toLocaleDateString('ru-RU')}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                              <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                 <Sparkles className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Точность (Confidence)</p>
                                 <p className="text-[11px] font-bold">{(MOCK_BODY_MEASUREMENTS.confidenceScore * 100).toFixed(0)}% Высокая</p>
                              </div>
                           </div>
                        </div>

                        <div className="mt-12 flex gap-3">
                           <Button className="flex-1 h-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest" onClick={() => setStep('review')}>
                              Использовать эти данные
                           </Button>
                           <Button variant="outline" className="h-12 w-12 rounded-2xl border-white/20 bg-transparent text-white">
                              <Scan className="h-5 w-5" />
                           </Button>
                        </div>
                     </div>

                     <div className="p-4 flex flex-col items-center justify-center bg-indigo-600/10">
                        <div className="relative w-full aspect-square max-w-[300px]">
                           {/* Human Avatar Simulation */}
                           <div className="absolute inset-0 flex items-center justify-center opacity-20">
                              <div className="h-[250px] w-px bg-indigo-500/50 absolute" />
                              <div className="w-[150px] h-px bg-indigo-500/50 absolute" />
                           </div>
                           <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full animate-pulse" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="h-12 w-10 bg-indigo-400 rounded-t-full mb-1 opacity-40" />
                              <div className="h-32 w-20 bg-indigo-400 rounded-2xl opacity-40" />
                              <div className="flex gap-1 mt-1">
                                 <div className="h-20 w-8 bg-indigo-400 rounded-b-xl opacity-40" />
                                 <div className="h-20 w-8 bg-indigo-400 rounded-b-xl opacity-40" />
                              </div>
                           </div>

                           {/* Measurement pointers */}
                           <div className="absolute top-1/4 -right-4 flex items-center gap-2">
                              <div className="h-[2px] w-12 bg-indigo-400" />
                              <span className="text-[10px] font-black italic">{MOCK_BODY_MEASUREMENTS.chest} cm</span>
                           </div>
                           <div className="absolute top-1/2 -left-4 flex items-center gap-2">
                              <span className="text-[10px] font-black italic">{MOCK_BODY_MEASUREMENTS.waist} cm</span>
                              <div className="h-[2px] w-12 bg-indigo-400" />
                           </div>
                           <div className="absolute bottom-1/4 -right-4 flex items-center gap-2">
                              <div className="h-[2px] w-12 bg-indigo-400" />
                              <span className="text-[10px] font-black italic">{MOCK_BODY_MEASUREMENTS.armLength} cm</span>
                           </div>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400 mt-8">3D Avatar Verified</p>
                     </div>
                  </div>
               </Card>
               <div className="mt-8 flex justify-center">
                  <Button variant="link" className="text-slate-400 text-[10px] font-black uppercase tracking-widest" onClick={() => setStep('configure')}>
                     <ChevronLeft className="mr-2 h-3 w-3" /> Изменить конфигурацию
                  </Button>
               </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3"
            >
               <div className="md:col-span-2 space-y-6">
                  <Card className="border-none shadow-sm rounded-xl p-3 bg-white">
                     <h2 className="text-sm font-black uppercase tracking-tighter italic mb-8">Резюме заказа</h2>
                     <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="h-24 w-24 rounded-xl overflow-hidden flex-shrink-0 shadow-xl">
                              <img src={selectedProject.image} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{selectedProject.brandId}</p>
                              <h3 className="text-base font-black uppercase tracking-tight italic">{selectedProject.name}</h3>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-6">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Конфигурация</p>
                              <div className="space-y-1">
                                 <p className="text-[11px] font-bold">{config.fabric?.name}</p>
                                 <p className="text-[11px] font-bold">{config.collar?.name}</p>
                                 <p className="text-[11px] font-bold">{config.pocket?.name}</p>
                                 <p className="text-[11px] font-bold">{config.button?.name}</p>
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Параметры тела</p>
                              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                                 <span className="text-slate-400">Рост: {MOCK_BODY_MEASUREMENTS.height} см</span>
                                 <span className="text-slate-400">Грудь: {MOCK_BODY_MEASUREMENTS.chest} см</span>
                                 <span className="text-slate-400">Талия: {MOCK_BODY_MEASUREMENTS.waist} см</span>
                                 <span className="text-slate-400">Бедра: {MOCK_BODY_MEASUREMENTS.hips} см</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </Card>

                  <Card className="border-none shadow-sm rounded-xl p-4 bg-indigo-50/50 flex items-center gap-3">
                     <div className="h-12 w-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-indigo-600">
                        <Sparkles className="h-6 w-6" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-tight">AI Quality Check</h4>
                        <p className="text-[11px] text-slate-600 font-medium">Ваша конфигурация проверена AI-стилистом. Сочетаемость материалов и кроя — 100%.</p>
                     </div>
                  </Card>
               </div>

               <div className="space-y-6">
                  <Card className="border-none shadow-xl rounded-xl p-4 bg-slate-900 text-white">
                     <h3 className="text-base font-black uppercase tracking-tight italic mb-6">Оплата</h3>
                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                           <span className="text-white/40 uppercase font-black text-[10px] tracking-widest">Модель</span>
                           <span className="font-bold">{selectedProject.basePrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-white/40 uppercase font-black text-[10px] tracking-widest">Опции</span>
                           <span className="font-bold">{(totalPrice - selectedProject.basePrice).toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-white/40 uppercase font-black text-[10px] tracking-widest">Доставка</span>
                           <span className="text-emerald-400 font-black text-[10px] uppercase">Бесплатно</span>
                        </div>
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex justify-between items-baseline">
                           <span className="text-sm font-black uppercase tracking-tighter italic">Итого</span>
                           <span className="text-sm font-black tracking-tighter italic text-indigo-400">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                        </div>
                     </div>
                     
                     <Button className="w-full h-10 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-900/40">
                        Оформить заказ
                     </Button>
                     <p className="text-[9px] text-center text-white/30 font-bold uppercase tracking-widest mt-6 leading-relaxed">
                        Нажимая кнопку, вы подтверждаете заказ на индивидуальный пошив по вашим меркам.
                     </p>
                  </Card>
                  
                  <div className="p-4 bg-white rounded-xl border border-slate-100 flex flex-col items-center text-center">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Ожидаемая дата готовности</p>
                     <p className="text-base font-black tracking-tighter italic">20 Марта 2024</p>
                     <Badge className="mt-4 bg-slate-100 text-slate-900 border-none px-4 py-1 text-[8px] font-black uppercase tracking-widest">14 дней на пошив</Badge>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
