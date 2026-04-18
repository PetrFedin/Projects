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
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Printer,
  Download,
  ArrowRightLeft,
  Calendar,
  Building2,
  CheckCircle2,
  UserCheck,
  Zap,
  Layers,
  ShoppingBag,
  Truck,
  Plus,
  Box,
  CreditCard,
  ChevronRight,
  Info,
  AlertCircle,
  Gavel,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AutoPOWizardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenMarketplace?: (query: string) => void;
  productName?: string;
  sku?: string;
}

export function AutoPOWizard({
  isOpen,
  onOpenChange,
  onOpenMarketplace,
  productName = 'Urban Jacket SS26',
  sku = 'TP-9921',
}: AutoPOWizardProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const BOM_MATERIALS = [
    {
      name: 'Cotton Jersey 180g',
      qty: '1,200 м',
      supplier: 'Tex-Global',
      stock: '250 м',
      need: '950 м',
      status: 'missing',
    },
    {
      name: 'YKK Zipper 20cm',
      qty: '800 шт',
      supplier: 'YKK Russia',
      stock: '1,200 шт',
      need: '0 шт',
      status: 'available',
    },
    {
      name: 'Silk Threads (Black)',
      qty: '12 боб.',
      supplier: 'Green Thread',
      stock: '2 боб.',
      need: '10 боб.',
      status: 'missing',
    },
  ];

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[650px]">
        <DialogHeader className="relative bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/20">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">
                Auto-PO Generator (BOM to Order)
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Автоматическое формирование заказов поставщикам для {productName}
              </DialogDescription>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <div className="min-h-[400px] space-y-6 p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Анализ потребностей по BOM
                  </h4>
                  <Badge className="h-5 border-none bg-slate-100 px-2 text-[8px] font-black uppercase tracking-widest text-slate-600">
                    Партия: 800 ед.
                  </Badge>
                </div>

                <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
                  {BOM_MATERIALS.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-between rounded-xl border p-3 transition-all',
                        m.status === 'missing'
                          ? 'border-rose-100 bg-rose-50'
                          : 'border-emerald-100 bg-emerald-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg shadow-sm',
                            m.status === 'missing'
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-emerald-100 text-emerald-600'
                          )}
                        >
                          {m.status === 'missing' ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                            {m.name}
                          </p>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                            Поставщик: {m.supplier}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-slate-900">
                            {m.need}
                          </p>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                            На складе: {m.stock}
                          </p>
                        </div>
                        {m.status === 'missing' && (
                          <Button
                            onClick={() => onOpenMarketplace?.(m.name)}
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg border-rose-200 bg-white text-rose-500 shadow-sm transition-all hover:bg-rose-500 hover:text-white"
                          >
                            <Gavel className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                  <Zap className="h-4 w-4 animate-pulse fill-indigo-600 text-indigo-600" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase leading-none tracking-widest text-indigo-900">
                      AI Optimization
                    </p>
                    <p className="text-[9px] font-medium uppercase leading-relaxed tracking-tight text-indigo-800/80">
                      Найдено пересечение по Cotton Jersey с коллекцией SS26. Рекомендуется
                      консолидировать заказ для получения скидки 15%.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex h-full flex-col items-center justify-center space-y-6 py-4"
              >
                <div className="relative">
                  <Box className="h-16 w-16 animate-bounce text-indigo-600" />
                  <div className="absolute -right-2 -top-2">
                    <Zap className="h-6 w-6 animate-pulse fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-black uppercase tracking-tighter">
                    Формирование Purchase Orders...
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Создание 2-х документов для Tex-Global и Green Thread
                  </p>
                </div>
                <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                    className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 py-4"
              >
                <div className="flex flex-col items-center space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight">
                      Заказы (PO) созданы успешно
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                      Добавлены в финансовый календарь и снабжение.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'PO-26-042', target: 'Tex-Global', val: '807,500 ₽', status: 'DRAFT' },
                    { id: 'PO-26-043', target: 'Green Thread', val: '12,400 ₽', status: 'DRAFT' },
                  ].map((po, i) => (
                    <div
                      key={i}
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-indigo-500 transition-transform group-hover:scale-110" />
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                            {po.id}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            {po.target}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-[11px] font-black tabular-nums text-slate-900">
                          {po.val}
                        </p>
                        <Badge className="h-4 border-none bg-slate-100 px-1.5 text-[8px] font-black uppercase text-slate-500">
                          {po.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="border-t border-slate-100 bg-slate-50 p-6">
          {step === 1 && (
            <div className="flex w-full gap-3">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-11 flex-1 text-[10px] font-black uppercase tracking-widest text-slate-400"
              >
                Отмена
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="h-11 flex-[2] gap-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-700"
              >
                Создать все заказы (2) <ArrowRightLeft className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          {step === 2 && null}
          {step === 3 && (
            <div className="grid w-full grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-11 gap-2 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest"
              >
                <Printer className="h-4 w-4" /> Печать всех
              </Button>
              <Button
                onClick={() => {
                  setStep(1);
                  onOpenChange(false);
                }}
                className="h-11 gap-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white"
              >
                В реестр снабжения <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
