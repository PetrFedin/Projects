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
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MaterialHandoverActProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  factoryName?: string;
  materials?: any[];
}

export function MaterialHandoverAct({ 
  isOpen, 
  onOpenChange, 
  factoryName = "Global Textiles Ltd",
  materials = [
    { name: "Heavy Cotton 320g", qty: "450m", rolls: 8 },
    { name: "YKK Zipper 20cm", qty: "800 pcs", boxes: 2 }
  ]
}: MaterialHandoverActProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white border-none rounded-2xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
              <ArrowRightLeft className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">Акт приема-передачи МТР</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Давальческая схема: Передача сырья на фабрику {factoryName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {!isGenerated ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Дата отгрузки</p>
                  <p className="text-xs font-bold flex items-center gap-2"><Calendar className="h-3 w-3 text-indigo-500" /> 10 Марта 2026</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Транспорт</p>
                  <p className="text-xs font-bold flex items-center gap-2"><Building2 className="h-3 w-3 text-indigo-500" /> Собственная логистика</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Список материалов</p>
                <div className="space-y-2">
                  {materials.map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">{m.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium uppercase">{m.rolls ? `${m.rolls} рулонов` : `${m.boxes} коробок`}</p>
                      </div>
                      <Badge className="bg-slate-900 text-white border-none font-bold text-[9px] px-2">{m.qty}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-6"
            >
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <div>
                  <h4 className="text-base font-black uppercase tracking-tight">Акт сформирован</h4>
                  <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Документ №АПП-2026/03-12</p>
                </div>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Статус подписания</span>
                  <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black">ОЖИДАЕТ ФАБРИКУ</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-tight text-slate-600 italic">Подписано ЭЦП (Бренд)</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100">
          {!isGenerated ? (
            <Button 
              onClick={handleGenerate}
              className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all"
            >
              Сформировать и подписать
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-black uppercase text-[10px] gap-2">
                <Printer className="h-4 w-4" /> Печать
              </Button>
              <Button className="h-12 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] gap-2">
                <Download className="h-4 w-4" /> Скачать PDF
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
