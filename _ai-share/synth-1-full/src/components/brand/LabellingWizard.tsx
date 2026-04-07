'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LabellingWizardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  sku?: string;
}

export function LabellingWizard({ isOpen, onOpenChange, productName = "Urban Jacket SS26", sku = "SKU-9921" }: LabellingWizardProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 1, title: "Параметры ГИС МТ", desc: "Тип товара и ТН ВЭД" },
    { id: 2, title: "Заказ КМ", desc: "Количество и способ выпуска" },
    { id: 3, title: "Генерация", desc: "Печать и ввод в оборот" }
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
      <DialogContent className="sm:max-w-[600px] bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 bg-slate-900 text-white relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">Мастер маркировки (Честный ЗНАК)</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Автоматизированный заказ КИЗ для {productName}
              </DialogDescription>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500" 
              style={{ width: `${(step / steps.length) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 min-h-[300px]">
          {step <= 3 && (
            <div className="flex justify-between mb-8">
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all",
                    step === s.id ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : 
                    step > s.id ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 text-slate-300"
                  )}>
                    {step > s.id ? <CheckCircle2 className="h-3 w-3" /> : s.id}
                  </div>
                  <div className="text-center">
                    <p className={cn("text-[8px] font-black uppercase tracking-widest", step === s.id ? "text-slate-900" : "text-slate-400")}>{s.title}</p>
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Категория товара</Label>
                    <Select defaultValue="clothes">
                      <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold uppercase">
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Код ТН ВЭД</Label>
                    <Input defaultValue="6201 93 000 0" className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex gap-3">
                  <Info className="h-4 w-4 text-indigo-600 shrink-0" />
                  <p className="text-[10px] text-indigo-900 font-medium leading-relaxed">
                    Для одежды верхнего ассортимента (куртки, ветровки) выбранный код ТН ВЭД требует обязательной маркировки с 1 апреля 2024 года.
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
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Способ выпуска в оборот</Label>
                  <Select defaultValue="production_rf">
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold uppercase">
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
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Количество КИЗ</Label>
                    <Input type="number" defaultValue="800" className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Тип кодов</Label>
                    <Select defaultValue="unit">
                      <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs font-bold uppercase">
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
                    <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                      <Printer className="h-8 w-8 text-slate-300" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight">Готов к генерации</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">800 кодов маркировки DataMatrix</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase text-slate-600">ЭЦП Подключена</span>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">СБИС / ТЕНЗОР</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 flex flex-col items-center justify-center py-8">
                    <div className="relative">
                      <QrCode className="h-16 w-16 text-indigo-600 animate-pulse" />
                      <div className="absolute -top-2 -right-2">
                        <Zap className="h-6 w-6 text-amber-400 animate-bounce fill-amber-400" />
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400 text-center w-full italic">Генерация кодов в системе ГИС МТ... {progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-slate-100" />
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
                <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter">КИЗ успешно созданы</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Заказ №ГИС-29421-2026. 800 единиц.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button className="h-12 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] gap-2">
                    <Printer className="h-4 w-4" /> Печать этикеток
                  </Button>
                  <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-black uppercase text-[10px] gap-2">
                    <FileText className="h-4 w-4" /> Скачать реестр
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
          {step <= 3 ? (
            <div className="flex w-full gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1 || isProcessing}
                className="flex-1 h-10 font-black uppercase text-[10px] tracking-widest text-slate-400"
              >
                Назад
              </Button>
              <Button 
                onClick={handleNext}
                disabled={isProcessing}
                className="flex-[2] h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-200 transition-all gap-2"
              >
                {step === 3 ? "Заказать в Честный ЗНАК" : "Продолжить"} <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleReset}
              className="w-full h-10 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest"
            >
              Завершить
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
