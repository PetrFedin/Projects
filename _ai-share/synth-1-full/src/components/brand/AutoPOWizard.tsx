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
import { Badge } from "@/components/ui/badge";
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
  Gavel
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  productName = "Urban Jacket SS26",
  sku = "TP-9921" 
}: AutoPOWizardProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const BOM_MATERIALS = [
    { name: 'Cotton Jersey 180g', qty: '1,200 м', supplier: 'Tex-Global', stock: '250 м', need: '950 м', status: 'missing' },
    { name: 'YKK Zipper 20cm', qty: '800 шт', supplier: 'YKK Russia', stock: '1,200 шт', need: '0 шт', status: 'available' },
    { name: 'Silk Threads (Black)', qty: '12 боб.', supplier: 'Green Thread', stock: '2 боб.', need: '10 боб.', status: 'missing' },
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
      <DialogContent className="sm:max-w-[650px] bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 bg-slate-900 text-white relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">Auto-PO Generator (BOM to Order)</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
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

        <div className="p-6 space-y-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Анализ потребностей по BOM</h4>
                  <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black uppercase px-2 h-5 tracking-widest">Партия: 800 ед.</Badge>
                </div>
                
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {BOM_MATERIALS.map((m, i) => (
                    <div key={i} className={cn(
                      "p-3 rounded-xl border flex justify-between items-center transition-all",
                      m.status === 'missing' ? "bg-rose-50 border-rose-100" : "bg-emerald-50 border-emerald-100"
                    )}>
                       <div className="flex items-center gap-3">
                         <div className={cn(
                           "h-8 w-8 rounded-lg flex items-center justify-center shadow-sm",
                           m.status === 'missing' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                         )}>
                            {m.status === 'missing' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                         </div>
                         <div className="space-y-0.5">
                           <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{m.name}</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Поставщик: {m.supplier}</p>
                         </div>
                       </div>
                       <div className="text-right flex items-center gap-3">
                         <div className="text-right">
                           <p className="text-[10px] font-black text-slate-900 uppercase">{m.need}</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">На складе: {m.stock}</p>
                         </div>
                         {m.status === 'missing' && (
                           <Button 
                             onClick={() => onOpenMarketplace?.(m.name)}
                             variant="outline" 
                             size="icon" 
                             className="h-7 w-7 rounded-lg border-rose-200 bg-white text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                           >
                             <Gavel className="h-3 w-3" />
                           </Button>
                         )}
                       </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3">
                   <Zap className="h-4 w-4 text-indigo-600 animate-pulse fill-indigo-600" />
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none">AI Optimization</p>
                     <p className="text-[9px] text-indigo-800/80 font-medium leading-relaxed uppercase tracking-tight">
                       Найдено пересечение по Cotton Jersey с коллекцией SS26. Рекомендуется консолидировать заказ для получения скидки 15%.
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
                className="space-y-6 py-4 flex flex-col items-center justify-center h-full"
              >
                <div className="relative">
                  <Box className="h-16 w-16 text-indigo-600 animate-bounce" />
                  <div className="absolute -top-2 -right-2">
                    <Zap className="h-6 w-6 text-amber-400 animate-pulse fill-amber-400" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                   <h3 className="text-lg font-black uppercase tracking-tighter">Формирование Purchase Orders...</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Создание 2-х документов для Tex-Global и Green Thread</p>
                </div>
                <div className="w-full max-w-sm h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight">Заказы (PO) созданы успешно</h4>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Добавлены в финансовый календарь и снабжение.</p>
                  </div>
                </div>

                <div className="space-y-3">
                   {[
                     { id: 'PO-26-042', target: 'Tex-Global', val: '807,500 ₽', status: 'DRAFT' },
                     { id: 'PO-26-043', target: 'Green Thread', val: '12,400 ₽', status: 'DRAFT' },
                   ].map((po, i) => (
                     <div key={i} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-indigo-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                           <FileText className="h-5 w-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                           <div className="space-y-0.5">
                              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{po.id}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{po.target}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <p className="text-[11px] font-black text-slate-900 tabular-nums">{po.val}</p>
                           <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase h-4 px-1.5">{po.status}</Badge>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
          {step === 1 && (
            <div className="flex w-full gap-3">
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 font-black uppercase text-[10px] tracking-widest text-slate-400"
              >
                Отмена
              </Button>
              <Button 
                onClick={() => setStep(2)}
                className="flex-[2] h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all gap-2"
              >
                Создать все заказы (2) <ArrowRightLeft className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
          {step === 2 && null}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" className="h-11 border-slate-200 rounded-xl font-black uppercase text-[10px] gap-2 tracking-widest">
                <Printer className="h-4 w-4" /> Печать всех
              </Button>
              <Button 
                onClick={() => {
                  setStep(1);
                  onOpenChange(false);
                }}
                className="h-11 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] gap-2 tracking-widest"
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
