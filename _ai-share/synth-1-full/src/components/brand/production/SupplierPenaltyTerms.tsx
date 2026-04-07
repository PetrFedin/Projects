'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Gavel, AlertTriangle, FileText, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PenaltyTerm {
  type: 'delay' | 'defect' | 'shortage';
  label: string;
  value: string; // e.g. "1% в день", "50 000 ₽"
  description?: string;
}

export interface CooperationTerm {
  payment: string; // "Аванс 50% + 50% при отгрузке"
  warranty?: string;
  leadTime?: string;
}

interface SupplierPenaltyTermsProps {
  factoryName: string;
  factoryId?: string;
  penalties?: PenaltyTerm[];
  terms?: CooperationTerm;
  onSave?: (penalties: PenaltyTerm[], terms: CooperationTerm) => void;
}

const DEFAULT_PENALTIES: PenaltyTerm[] = [
  { type: 'delay', label: 'Просрочка отгрузки', value: '1% в день от суммы заказа', description: 'Макс. 15%' },
  { type: 'defect', label: 'Брак выше нормы', value: '100% стоимости бракованных единиц', description: 'При рекламации' },
  { type: 'shortage', label: 'Недопоставка', value: '2% за каждые недостающие 10%', description: 'От объёма PO' },
];

export function SupplierPenaltyTerms({
  factoryName,
  factoryId,
  penalties = DEFAULT_PENALTIES,
  terms = { payment: 'Аванс 50% + 50% при отгрузке', leadTime: '21–28 дней' },
  onSave,
}: SupplierPenaltyTermsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localPenalties, setLocalPenalties] = useState(penalties);
  const [localTerms, setLocalTerms] = useState(terms);

  return (
    <>
      <Card
        className={cn(
          'border shadow-sm rounded-xl p-4 cursor-pointer transition-all hover:border-amber-200',
          'border-slate-100'
        )}
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                Штрафы и условия
              </CardTitle>
              <CardDescription className="text-[9px] text-slate-500 mt-0.5">
                Просрочки, брак, условия сотрудничества
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[8px] border-amber-200 text-amber-700">
            Настроить
          </Badge>
        </div>
        <CardContent className="p-0 mt-3 space-y-2">
          {localPenalties.slice(0, 2).map((p, i) => (
            <div key={i} className="flex justify-between text-[9px]">
              <span className="text-slate-600 font-bold uppercase">{p.label}</span>
              <span className="text-slate-900 font-black">{p.value}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <Handshake className="w-3 h-3 text-indigo-500" />
            <span className="text-[9px] font-bold text-slate-600">{localTerms.payment}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-600" />
              Условия сотрудничества: {factoryName}
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              Штрафы за просрочки и брак. Условия оплаты и гарантии.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Штрафные санкции
              </h4>
              <div className="space-y-3">
                {localPenalties.map((p, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">{p.label}</Label>
                    <Input
                      value={p.value}
                      onChange={(e) =>
                        setLocalPenalties((prev) =>
                          prev.map((pp, j) => (j === i ? { ...pp, value: e.target.value } : pp))
                        )
                      }
                      className="mt-1 h-9 text-[11px] font-bold"
                      placeholder="1% в день"
                    />
                    {p.description && (
                      <p className="text-[8px] text-slate-400 mt-1">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-2 flex items-center gap-1">
                <Handshake className="w-3 h-3" /> Условия оплаты
              </h4>
              <Input
                value={localTerms.payment}
                onChange={(e) => setLocalTerms((t) => ({ ...t, payment: e.target.value }))}
                className="h-10 text-[11px]"
                placeholder="Аванс 50% + 50% при отгрузке"
              />
            </div>
            <div>
              <Label className="text-[9px] font-bold uppercase text-slate-500">Срок производства</Label>
              <Input
                value={localTerms.leadTime || ''}
                onChange={(e) => setLocalTerms((t) => ({ ...t, leadTime: e.target.value }))}
                className="mt-1 h-9 text-[11px]"
                placeholder="21–28 дней"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                onSave?.(localPenalties, localTerms);
                setIsOpen(false);
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
