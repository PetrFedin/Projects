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
  Minimize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  MOCK_CUSTOMIZATION_PROJECTS,
  MOCK_BODY_MEASUREMENTS,
} from '@/lib/logic/customization-utils';
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

  const totalPrice =
    selectedProject.basePrice +
    (config.fabric?.priceDelta || 0) +
    (config.button?.priceDelta || 0) +
    (config.pocket?.priceDelta || 0) +
    (config.collar?.priceDelta || 0);

  const handleOptionSelect = (type: keyof typeof config, option: CustomOption) => {
    setConfig((prev) => ({ ...prev, [type]: option }));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase italic tracking-tighter">
                Mass Customization Hub
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Индивидуальный пошив P3
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {[
              { id: 'project', label: 'Выбор модели' },
              { id: 'configure', label: 'Дизайн' },
              { id: 'measure', label: 'Мерки' },
              { id: 'review', label: 'Заказ' },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black',
                    step === s.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-slate-100 text-slate-400'
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    'text-[10px] font-black uppercase tracking-widest',
                    step === s.id ? 'text-indigo-600' : 'text-slate-400'
                  )}
                >
                  {s.label}
                </span>
                {i < 3 && <ChevronRight className="ml-2 h-3 w-3 text-slate-300" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[8px] font-black uppercase leading-none tracking-widest text-slate-400">
                Итого
              </p>
              <p className="text-sm font-black tracking-tighter text-indigo-600">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <Button className="h-10 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800">
              Купить
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4">
        <AnimatePresence mode="wait">
          {step === 'project' && (
            <motion.div
              key="project"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3"
            >
              {MOCK_CUSTOMIZATION_PROJECTS.map((project) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer overflow-hidden rounded-xl border-none shadow-sm transition-all hover:shadow-2xl"
                  onClick={() => {
                    setSelectedProject(project);
                    setStep('configure');
                  }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        Tailored for You
                      </p>
                      <h3 className="mb-4 text-sm font-black uppercase italic leading-none tracking-tighter text-white">
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black italic text-white">
                          от {project.basePrice.toLocaleString('ru-RU')} ₽
                        </span>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md transition-colors group-hover:bg-indigo-600">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Feature info */}
              <Card className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-center lg:col-span-2">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-xl">
                  <Sparkles className="h-8 w-8 text-indigo-600" />
                </div>
                <h2 className="mb-4 text-base font-black uppercase italic tracking-tighter text-indigo-900">
                  Магия идеальной посадки
                </h2>
                <p className="mb-8 max-w-md text-sm leading-relaxed text-slate-600">
                  Мы объединили традиционное мастерство индпошива с технологиями 3D-сканирования
                  тела. Больше никаких примерок и переделок — только вещь, созданная специально для
                  вас.
                </p>
                <div className="flex gap-3">
                  <Badge className="h-8 border-indigo-100 bg-white px-4 font-black uppercase tracking-widest text-indigo-600">
                    3D Scan Tech
                  </Badge>
                  <Badge className="h-8 border-indigo-100 bg-white px-4 font-black uppercase tracking-widest text-indigo-600">
                    AI Pattern Generator
                  </Badge>
                  <Badge className="h-8 border-indigo-100 bg-white px-4 font-black uppercase tracking-widest text-indigo-600">
                    Global CMT Network
                  </Badge>
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
              className="grid grid-cols-1 gap-3 lg:grid-cols-12"
            >
              {/* Product Preview */}
              <div className="sticky top-24 lg:col-span-7 xl:col-span-8">
                <Card className="relative aspect-[4/5] overflow-hidden rounded-xl border-none bg-white shadow-2xl">
                  <img
                    src={selectedProject.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-8 top-4 max-w-xs rounded-3xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur-md">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                      Live Configuration
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="uppercase tracking-widest text-slate-400">Ткань:</span>
                        <span className="text-slate-900">{config.fabric?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="uppercase tracking-widest text-slate-400">Лацкан:</span>
                        <span className="text-slate-900">{config.collar?.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="uppercase tracking-widest text-slate-400">Карманы:</span>
                        <span className="text-slate-900">{config.pocket?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-8 flex flex-col gap-2">
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-2xl border border-white/20 bg-slate-900/10 text-slate-900 backdrop-blur-md hover:bg-slate-900/20"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-2xl border border-white/20 bg-slate-900/10 text-slate-900 backdrop-blur-md hover:bg-slate-900/20"
                    >
                      <Sparkles className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Configuration Controls */}
              <div className="space-y-6 lg:col-span-5 xl:col-span-4">
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h2 className="mb-6 text-sm font-black uppercase italic tracking-tighter">
                    Настройте детали
                  </h2>

                  <Tabs defaultValue="fabric">
                    <TabsList className="mb-8 h-12 w-full rounded-2xl border-none bg-slate-50 p-1">
                      <TabsTrigger
                        value="fabric"
                        className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
                      >
                        Ткань
                      </TabsTrigger>
                      <TabsTrigger
                        value="collar"
                        className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
                      >
                        Крой
                      </TabsTrigger>
                      <TabsTrigger
                        value="details"
                        className="flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest"
                      >
                        Детали
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fabric" className="space-y-6">
                      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Выберите основной материал
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProject.availableOptions.fabrics.map((fabric) => (
                          <div
                            key={fabric.id}
                            onClick={() => handleOptionSelect('fabric', fabric)}
                            className={cn(
                              'relative cursor-pointer rounded-2xl border-2 p-4 transition-all',
                              config.fabric?.id === fabric.id
                                ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                                : 'border-slate-50 hover:border-slate-200'
                            )}
                          >
                            <div className="mb-3 h-12 w-full overflow-hidden rounded-xl">
                              <img src={fabric.image} className="h-full w-full object-cover" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-tight">
                              {fabric.name}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400">
                              +{fabric.priceDelta} ₽
                            </p>
                            {config.fabric?.id === fabric.id && (
                              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="collar" className="space-y-6">
                      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Тип лацкана и воротника
                      </p>
                      <div className="space-y-3">
                        {selectedProject.availableOptions.collars.map((collar) => (
                          <div
                            key={collar.id}
                            onClick={() => handleOptionSelect('collar', collar)}
                            className={cn(
                              'flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all',
                              config.collar?.id === collar.id
                                ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                                : 'border-slate-50 hover:border-slate-200'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                <Scissors className="h-4 w-4 text-slate-400" />
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-widest">
                                {collar.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600">
                              +{collar.priceDelta} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    {/* More tabs content... */}
                    <TabsContent value="details" className="space-y-6">
                      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Пуговицы и карманы
                      </p>
                      {/* Simplified for brevity */}
                      <div className="space-y-3">
                        {selectedProject.availableOptions.pockets.map((pocket) => (
                          <div
                            key={pocket.id}
                            onClick={() => handleOptionSelect('pocket', pocket)}
                            className={cn(
                              'flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all',
                              config.pocket?.id === pocket.id
                                ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                                : 'border-slate-50 hover:border-slate-200'
                            )}
                          >
                            <span className="text-[11px] font-black uppercase tracking-widest">
                              {pocket.name}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-600">
                              +{pocket.priceDelta} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-12 flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="h-12 flex-1 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest"
                      onClick={() => setStep('project')}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Назад
                    </Button>
                    <Button
                      className="h-12 flex-[2] rounded-2xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-indigo-700"
                      onClick={() => setStep('measure')}
                    >
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
              className="mx-auto max-w-4xl"
            >
              <Card className="overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-2xl">
                <div className="grid md:grid-cols-2">
                  <div className="border-r border-white/10 p-4">
                    <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600 shadow-2xl">
                      <Scan className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mb-4 text-base font-black uppercase italic leading-none tracking-tighter">
                      3D AI Body Scan
                    </h2>
                    <p className="mb-8 text-sm font-medium leading-relaxed text-white/60">
                      Мы используем данные вашего последнего 3D-сканирования. Точность до 1.5 мм
                      гарантирует, что вещь сядет идеально без единой примерки.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                            Последний скан
                          </p>
                          <p className="text-[11px] font-bold">
                            {new Date(MOCK_BODY_MEASUREMENTS.scannedAt).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                            Точность (Confidence)
                          </p>
                          <p className="text-[11px] font-bold">
                            {(MOCK_BODY_MEASUREMENTS.confidenceScore * 100).toFixed(0)}% Высокая
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex gap-3">
                      <Button
                        className="h-12 flex-1 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100"
                        onClick={() => setStep('review')}
                      >
                        Использовать эти данные
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 w-12 rounded-2xl border-white/20 bg-transparent text-white"
                      >
                        <Scan className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-indigo-600/10 p-4">
                    <div className="relative aspect-square w-full max-w-[300px]">
                      {/* Human Avatar Simulation */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="absolute h-[250px] w-px bg-indigo-500/50" />
                        <div className="absolute h-px w-[150px] bg-indigo-500/50" />
                      </div>
                      <div className="absolute inset-0 animate-pulse rounded-full border-2 border-indigo-500/30" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="mb-1 h-12 w-10 rounded-t-full bg-indigo-400 opacity-40" />
                        <div className="h-32 w-20 rounded-2xl bg-indigo-400 opacity-40" />
                        <div className="mt-1 flex gap-1">
                          <div className="h-20 w-8 rounded-b-xl bg-indigo-400 opacity-40" />
                          <div className="h-20 w-8 rounded-b-xl bg-indigo-400 opacity-40" />
                        </div>
                      </div>

                      {/* Measurement pointers */}
                      <div className="absolute -right-4 top-1/4 flex items-center gap-2">
                        <div className="h-[2px] w-12 bg-indigo-400" />
                        <span className="text-[10px] font-black italic">
                          {MOCK_BODY_MEASUREMENTS.chest} cm
                        </span>
                      </div>
                      <div className="absolute -left-4 top-1/2 flex items-center gap-2">
                        <span className="text-[10px] font-black italic">
                          {MOCK_BODY_MEASUREMENTS.waist} cm
                        </span>
                        <div className="h-[2px] w-12 bg-indigo-400" />
                      </div>
                      <div className="absolute -right-4 bottom-1/4 flex items-center gap-2">
                        <div className="h-[2px] w-12 bg-indigo-400" />
                        <span className="text-[10px] font-black italic">
                          {MOCK_BODY_MEASUREMENTS.armLength} cm
                        </span>
                      </div>
                    </div>
                    <p className="mt-8 text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
                      3D Avatar Verified
                    </p>
                  </div>
                </div>
              </Card>
              <div className="mt-8 flex justify-center">
                <Button
                  variant="link"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400"
                  onClick={() => setStep('configure')}
                >
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
              className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-3"
            >
              <div className="space-y-6 md:col-span-2">
                <Card className="rounded-xl border-none bg-white p-3 shadow-sm">
                  <h2 className="mb-8 text-sm font-black uppercase italic tracking-tighter">
                    Резюме заказа
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl shadow-xl">
                        <img src={selectedProject.image} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                          {selectedProject.brandId}
                        </p>
                        <h3 className="text-base font-black uppercase italic tracking-tight">
                          {selectedProject.name}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-slate-50 pt-6">
                      <div>
                        <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Конфигурация
                        </p>
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold">{config.fabric?.name}</p>
                          <p className="text-[11px] font-bold">{config.collar?.name}</p>
                          <p className="text-[11px] font-bold">{config.pocket?.name}</p>
                          <p className="text-[11px] font-bold">{config.button?.name}</p>
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Параметры тела
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                          <span className="text-slate-400">
                            Рост: {MOCK_BODY_MEASUREMENTS.height} см
                          </span>
                          <span className="text-slate-400">
                            Грудь: {MOCK_BODY_MEASUREMENTS.chest} см
                          </span>
                          <span className="text-slate-400">
                            Талия: {MOCK_BODY_MEASUREMENTS.waist} см
                          </span>
                          <span className="text-slate-400">
                            Бедра: {MOCK_BODY_MEASUREMENTS.hips} см
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="flex items-center gap-3 rounded-xl border-none bg-indigo-50/50 p-4 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-md">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">
                      AI Quality Check
                    </h4>
                    <p className="text-[11px] font-medium text-slate-600">
                      Ваша конфигурация проверена AI-стилистом. Сочетаемость материалов и кроя —
                      100%.
                    </p>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
                  <h3 className="mb-6 text-base font-black uppercase italic tracking-tight">
                    Оплата
                  </h3>
                  <div className="mb-8 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Модель
                      </span>
                      <span className="font-bold">
                        {selectedProject.basePrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Опции
                      </span>
                      <span className="font-bold">
                        {(totalPrice - selectedProject.basePrice).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Доставка
                      </span>
                      <span className="text-[10px] font-black uppercase text-emerald-400">
                        Бесплатно
                      </span>
                    </div>
                    <div className="my-4 h-px bg-white/10" />
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black uppercase italic tracking-tighter">
                        Итого
                      </span>
                      <span className="text-sm font-black italic tracking-tighter text-indigo-400">
                        {totalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  <Button className="h-10 w-full rounded-2xl bg-indigo-600 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/40 hover:bg-indigo-500">
                    Оформить заказ
                  </Button>
                  <p className="mt-6 text-center text-[9px] font-bold uppercase leading-relaxed tracking-widest text-white/30">
                    Нажимая кнопку, вы подтверждаете заказ на индивидуальный пошив по вашим меркам.
                  </p>
                </Card>

                <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 text-center">
                  <p className="mb-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Ожидаемая дата готовности
                  </p>
                  <p className="text-base font-black italic tracking-tighter">20 Марта 2024</p>
                  <Badge className="mt-4 border-none bg-slate-100 px-4 py-1 text-[8px] font-black uppercase tracking-widest text-slate-900">
                    14 дней на пошив
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
