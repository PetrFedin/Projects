'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Printer,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LabellingWizardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  sku?: string;
}

export function LabellingWizard({
  isOpen,
  onOpenChange,
  productName = 'Urban Jacket SS26',
  sku = 'SKU-9921',
}: LabellingWizardProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 1, title: 'Параметры ГИС МТ', desc: 'Тип товара и ТН ВЭД' },
    { id: 2, title: 'Заказ КМ', desc: 'Количество и способ выпуска' },
    { id: 3, title: 'Генерация', desc: 'Печать и ввод в оборот' },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsProcessing(true);
      // Simulate generation
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setStep(4); // Success step
        }
      }, 50);
    }
  };

  const handleReset = () => {
    setStep(1);
    setProgress(0);
    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[600px]">
        <DialogHeader className="bg-text-primary relative p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary shadow-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">
                Мастер маркировки (Честный ЗНАК)
              </DialogTitle>
              <DialogDescription className="text-text-muted mt-0.5 text-[10px] font-bold uppercase tracking-widest">
                Автоматизированный заказ КИЗ для {productName}
              </DialogDescription>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <div
              className="bg-accent-primary h-full transition-all duration-500"
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <div className="min-h-[300px] space-y-6 p-6">
          {step <= 3 && (
            <div className="mb-8 flex justify-between">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-black transition-all',
                      step === s.id
                        ? 'bg-accent-primary border-accent-primary text-white shadow-lg'
                        : step > s.id
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-border-default text-text-muted'
                    )}
                  >
                    {step > s.id ? <CheckCircle2 className="h-3 w-3" /> : s.id}
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        'text-[8px] font-black uppercase tracking-widest',
                        step === s.id ? 'text-text-primary' : 'text-text-muted'
                      )}
                    >
                      {s.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Категория товара
                    </Label>
                    <Select defaultValue="clothes">
                      <SelectTrigger className="border-border-default bg-bg-surface2 h-10 rounded-xl text-xs font-bold uppercase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothes">Легкая промышленность</SelectItem>
                        <SelectItem value="shoes">Обувь</SelectItem>
                        <SelectItem value="accessories">Аксессуары</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Код ТН ВЭД
                    </Label>
                    <Input
                      defaultValue="6201 93 000 0"
                      className="border-border-default bg-bg-surface2 h-10 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
                <div className="bg-accent-primary/10 border-accent-primary/20 flex gap-3 rounded-xl border p-4">
                  <Info className="text-accent-primary h-4 w-4 shrink-0" />
                  <p className="text-accent-primary text-[10px] font-medium leading-relaxed">
                    Для одежды верхнего ассортимента (куртки, ветровки) выбранный код ТН ВЭД требует
                    обязательной маркировки с 1 апреля 2024 года.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Способ выпуска в оборот
                  </Label>
                  <Select defaultValue="production_rf">
                    <SelectTrigger className="border-border-default bg-bg-surface2 h-10 rounded-xl text-xs font-bold uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production_rf">Производство в РФ</SelectItem>
                      <SelectItem value="import">Импорт из стран вне ЕАЭС</SelectItem>
                      <SelectItem value="import_eaes">Импорт из ЕАЭС</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Количество КИЗ
                    </Label>
                    <Input
                      type="number"
                      defaultValue="800"
                      className="border-border-default bg-bg-surface2 h-10 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Тип кодов
                    </Label>
                    <Select defaultValue="unit">
                      <SelectTrigger className="border-border-default bg-bg-surface2 h-10 rounded-xl text-xs font-bold uppercase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Единица товара</SelectItem>
                        <SelectItem value="bundle">Групповая упаковка</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 py-4"
              >
                {!isProcessing ? (
                  <div className="space-y-4">
                    <div className="border-border-default flex flex-col items-center justify-center space-y-3 rounded-xl border-2 border-dashed p-4 text-center">
                      <Printer className="text-text-muted h-8 w-8" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight">
                          Готов к генерации
                        </p>
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                          800 кодов маркировки DataMatrix
                        </p>
                      </div>
                    </div>
                    <div className="bg-bg-surface2 flex items-center justify-between rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-text-secondary text-[10px] font-black uppercase">
                          ЭЦП Подключена
                        </span>
                      </div>
                      <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                        СБИС / ТЕНЗОР
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-6 py-8">
                    <div className="relative">
                      <QrCode className="text-accent-primary h-16 w-16 animate-pulse" />
                      <div className="absolute -right-2 -top-2">
                        <Zap className="h-6 w-6 animate-bounce fill-amber-400 text-amber-400" />
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-text-muted w-full text-center italic">
                          Генерация кодов в системе ГИС МТ... {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="bg-bg-surface2 h-1.5" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter">
                    КИЗ успешно созданы
                  </h3>
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                    Заказ №ГИС-29421-2026. 800 единиц.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button className="bg-text-primary h-12 gap-2 rounded-xl text-[10px] font-black uppercase text-white">
                    <Printer className="h-4 w-4" /> Печать этикеток
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border-default h-12 gap-2 rounded-xl text-[10px] font-black uppercase"
                  >
                    <FileText className="h-4 w-4" /> Скачать реестр
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="bg-bg-surface2 border-border-subtle border-t p-6">
          {step <= 3 ? (
            <div className="flex w-full gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1 || isProcessing}
                className="text-text-muted h-10 flex-1 text-[10px] font-black uppercase tracking-widest"
              >
                Назад
              </Button>
              <Button
                onClick={handleNext}
                disabled={isProcessing}
                className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/15 h-10 flex-[2] gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all"
              >
                {step === 3 ? 'Заказать в Честный ЗНАК' : 'Продолжить'}{' '}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleReset}
              className="bg-text-primary h-10 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
            >
              Завершить
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
