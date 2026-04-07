'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronLeft, Package, FileText, Layers, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SKU_STAGES = ['Design', 'TZ', 'BOM', 'Sample', 'Approval', 'PO'] as const;

export interface SkuCreateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  collectionName?: string;
  onCreated: (sku: {
    id: string;
    name: string;
    collection: string;
    stage: string;
    sizes: string[];
    colors: string[];
    bomItems: { material: string; qty: number; unit: string }[];
  }) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const DEFAULT_COLORS = ['Black', 'White', 'Navy', 'Beige'];

export function SkuCreateWizard({
  open,
  onOpenChange,
  collectionId,
  collectionName,
  onCreated,
}: SkuCreateWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [bomItems, setBomItems] = useState<{ material: string; qty: number; unit: string }[]>([
    { material: 'Ткань основная', qty: 1.5, unit: 'м' },
    { material: 'Подкладка', qty: 0.8, unit: 'м' },
    { material: 'Молния', qty: 1, unit: 'шт' },
  ]);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['Black', 'White']);
  const [matrix, setMatrix] = useState<Record<string, number>>({});

  const toggleSize = (s: string) => setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort()));
  const toggleColor = (c: string) => setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleFinish = () => {
    const id = `TP-${Math.floor(Math.random() * 9000) + 1000}`;
    onCreated({
      id,
      name: name || 'New SKU',
      collection: collectionId,
      stage: 'Design',
      sizes,
      colors,
      bomItems,
    });
    onOpenChange(false);
    setStep(1);
    setName('');
    setBomItems([{ material: 'Ткань основная', qty: 1.5, unit: 'м' }, { material: 'Подкладка', qty: 0.8, unit: 'м' }, { material: 'Молния', qty: 1, unit: 'шт' }]);
    setSizes(['S', 'M', 'L']);
    setColors(['Black', 'White']);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] rounded-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">Новый артикул</DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                {collectionName || collectionId} · Шаг {step} из 4
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Название артикула *</Label>
                <Input placeholder="Платье Midnight, Топ White Silk..." className="h-11 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400">Категория</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Выбрать" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dresses">Платья</SelectItem>
                    <SelectItem value="tops">Верх</SelectItem>
                    <SelectItem value="bottoms">Низ</SelectItem>
                    <SelectItem value="outerwear">Верхняя одежда</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-bold uppercase text-slate-500">Этапы артикула</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKU_STAGES.map((s, i) => (
                    <span key={s} className={cn("px-2 py-1 rounded-lg text-[9px] font-bold", i === 0 ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500")}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><FileText className="w-4 h-4" /> BOM / Техпак — материалы</p>
              <div className="space-y-3">
                {bomItems.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="Материал" className="h-10 flex-1" value={item.material} onChange={(e) => setBomItems((prev) => prev.map((x, j) => j === i ? { ...x, material: e.target.value } : x))} />
                    <Input type="number" className="h-10 w-20" value={item.qty} onChange={(e) => setBomItems((prev) => prev.map((x, j) => j === i ? { ...x, qty: parseFloat(e.target.value) || 0 } : x))} />
                    <Select value={item.unit} onValueChange={(v) => setBomItems((prev) => prev.map((x, j) => j === i ? { ...x, unit: v } : x))}>
                      <SelectTrigger className="h-10 w-16"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="м">м</SelectItem><SelectItem value="шт">шт</SelectItem><SelectItem value="г">г</SelectItem></SelectContent>
                    </Select>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="h-9" onClick={() => setBomItems((prev) => [...prev, { material: '', qty: 0, unit: 'м' }])}>+ Материал</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Layers className="w-4 h-4" /> Варианты: размеры и цвета</p>
              <div>
                <Label className="text-[9px] font-black uppercase text-slate-400">Размеры</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSize(s)} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all", sizes.includes(s) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-[9px] font-black uppercase text-slate-400">Цвета</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => toggleColor(c)} className={cn("px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all", colors.includes(c) ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>{c}</button>
                  ))}
                  <Input placeholder="+ цвет" className="h-8 w-20 text-[10px]" onKeyDown={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) { setColors((prev) => [...prev, v]); (e.target as HTMLInputElement).value = ''; } } }} />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[9px] font-bold text-slate-500">Матрица: {sizes.length} размеров × {colors.length} цветов</p>
                <p className="text-[9px] text-slate-400 mt-1">Заполняется при создании PO</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Готово к созданию</span>
                </div>
                <p className="text-[10px] text-slate-600 mt-2">Артикул будет создан в стадии Design. После заполнения ТЗ и BOM можно запустить поток сэмплов (Proto 1 → Proto 2 → PP).</p>
              </div>
              <div className="space-y-1 text-[11px] font-bold">
                <p><span className="text-slate-400">Название:</span> {name || '—'}</p>
                <p><span className="text-slate-400">Категория:</span> {category || '—'}</p>
                <p><span className="text-slate-400">BOM:</span> {bomItems.filter(i => i.material).length} позиций</p>
                <p><span className="text-slate-400">Варианты:</span> {sizes.join(', ')} × {colors.join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t flex justify-between">
          <div>{step > 1 && <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="gap-1"><ChevronLeft className="w-4 h-4" /> Назад</Button>}</div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Отмена</Button>
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={step === 1 && !name.trim()} className="gap-1">Далее <ChevronRight className="w-4 h-4" /></Button>
            ) : (
              <Button onClick={handleFinish}>Создать артикул</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
