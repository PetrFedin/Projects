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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MaterialHandoverActProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  factoryName?: string;
  materials?: any[];
}

export function MaterialHandoverAct({
  isOpen,
  onOpenChange,
  factoryName = 'Global Textiles Ltd',
  materials = [
    { name: 'Heavy Cotton 320g', qty: '450m', rolls: 8 },
    { name: 'YKK Zipper 20cm', qty: '800 pcs', boxes: 2 },
  ],
}: MaterialHandoverActProps) {
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[550px]">
        <DialogHeader className="border-b border-slate-100 bg-slate-50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 shadow-sm">
              <ArrowRightLeft className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">
                Акт приема-передачи МТР
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Давальческая схема: Передача сырья на фабрику {factoryName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {!isGenerated ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Дата отгрузки
                  </p>
                  <p className="flex items-center gap-2 text-xs font-bold">
                    <Calendar className="h-3 w-3 text-indigo-500" /> 10 Марта 2026
                  </p>
                </div>
                <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    Транспорт
                  </p>
                  <p className="flex items-center gap-2 text-xs font-bold">
                    <Building2 className="h-3 w-3 text-indigo-500" /> Собственная логистика
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-900">
                  Список материалов
                </p>
                <div className="space-y-2">
                  {materials.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                    >
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">{m.name}</p>
                        <p className="text-[9px] font-medium uppercase text-slate-400">
                          {m.rolls ? `${m.rolls} рулонов` : `${m.boxes} коробок`}
                        </p>
                      </div>
                      <Badge className="border-none bg-slate-900 px-2 text-[9px] font-bold text-white">
                        {m.qty}
                      </Badge>
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
              <div className="flex flex-col items-center space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                <div>
                  <h4 className="text-base font-black uppercase tracking-tight">Акт сформирован</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    Документ №АПП-2026/03-12
                  </p>
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-[9px] font-black uppercase text-slate-400">
                    Статус подписания
                  </span>
                  <Badge className="border-none bg-amber-100 text-[8px] font-black text-amber-700">
                    ОЖИДАЕТ ФАБРИКУ
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase italic tracking-tight text-slate-600">
                    Подписано ЭЦП (Бренд)
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="border-t border-slate-100 bg-slate-50 p-6">
          {!isGenerated ? (
            <Button
              onClick={handleGenerate}
              className="h-12 w-full rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-600"
            >
              Сформировать и подписать
            </Button>
          ) : (
            <div className="grid w-full grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-slate-200 text-[10px] font-black uppercase"
              >
                <Printer className="h-4 w-4" /> Печать
              </Button>
              <Button className="h-12 gap-2 rounded-xl bg-indigo-600 text-[10px] font-black uppercase text-white">
                <Download className="h-4 w-4" /> Скачать PDF
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
