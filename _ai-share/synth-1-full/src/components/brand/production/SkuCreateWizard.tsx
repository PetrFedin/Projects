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
import { ChevronRight, ChevronLeft, Package, FileText, Layers, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

const SKU_STAGES = ['Дизайн', 'ТЗ', 'BOM', 'Образец', 'Согласование', 'PO'] as const;

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
const DEFAULT_COLORS = ['Чёрный', 'Белый', 'Тёмно-синий', 'Бежевый'];

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
  const [colors, setColors] = useState<string[]>(['Чёрный', 'Белый']);
  const [matrix, setMatrix] = useState<Record<string, number>>({});

  const toggleSize = (s: string) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort()));
  const toggleColor = (c: string) =>
    setColors((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handleFinish = () => {
    const id = `TP-${Math.floor(Math.random() * 9000) + 1000}`;
    onCreated({
      id,
      name: name || 'Новый SKU',
      collection: collectionId,
      stage: 'Дизайн',
      sizes,
      colors,
      bomItems,
    });
    onOpenChange(false);
    setStep(1);
    setName('');
    setBomItems([
      { material: 'Ткань основная', qty: 1.5, unit: 'м' },
      { material: 'Подкладка', qty: 0.8, unit: 'м' },
      { material: 'Молния', qty: 1, unit: 'шт' },
    ]);
    setSizes(['S', 'M', 'L']);
    setColors(['Чёрный', 'Белый']);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-2xl p-0 sm:max-w-[560px]">
<<<<<<< HEAD
        <DialogHeader className="shrink-0 bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600">
=======
        <DialogHeader className="bg-text-primary shrink-0 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-2xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                Новый артикул
              </DialogTitle>
<<<<<<< HEAD
              <DialogDescription className="mt-1 text-[10px] font-bold uppercase text-slate-400">
=======
              <DialogDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                {collectionName || collectionId} · Шаг {step} из 4
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
<<<<<<< HEAD
                <Label className="text-[10px] font-black uppercase text-slate-400">
                  Название артикула *
                </Label>
                <Input
                  placeholder="Платье Midnight, Топ White Silk..."
=======
                <Label className="text-text-muted text-[10px] font-black uppercase">
                  Название артикула *
                </Label>
                <Input
                  placeholder="Платье «Полночь», топ «Белый шёлк»..."
>>>>>>> recover/cabinet-wip-from-stash
                  className="h-11 rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-muted text-[10px] font-black uppercase">
                  Категория
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Выбрать" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dresses">Платья</SelectItem>
                    <SelectItem value="tops">Верх</SelectItem>
                    <SelectItem value="bottoms">Низ</SelectItem>
                    <SelectItem value="outerwear">Верхняя одежда</SelectItem>
                  </SelectContent>
                </Select>
              </div>
<<<<<<< HEAD
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[9px] font-bold uppercase text-slate-500">Этапы артикула</p>
=======
              <div className="bg-bg-surface2 border-border-subtle rounded-xl border p-3">
                <p className="text-text-secondary text-[9px] font-bold uppercase">Этапы артикула</p>
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mt-2 flex flex-wrap gap-2">
                  {SKU_STAGES.map((s, i) => (
                    <span
                      key={s}
                      className={cn(
                        'rounded-lg px-2 py-1 text-[9px] font-bold',
<<<<<<< HEAD
                        i === 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
=======
                        i === 0
                          ? 'bg-accent-primary/15 text-accent-primary'
                          : 'bg-bg-surface2 text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
<<<<<<< HEAD
              <p className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <FileText className="h-4 w-4" /> BOM / Техпак — материалы
=======
              <p className="text-text-secondary flex items-center gap-2 text-[10px] font-bold">
                <FileText className="h-4 w-4" /> <AcronymWithTooltip abbr="BOM" /> / техпак —
                материалы
>>>>>>> recover/cabinet-wip-from-stash
              </p>
              <div className="space-y-3">
                {bomItems.map((item, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Материал"
                      className="h-10 flex-1"
                      value={item.material}
                      onChange={(e) =>
                        setBomItems((prev) =>
                          prev.map((x, j) => (j === i ? { ...x, material: e.target.value } : x))
                        )
                      }
                    />
                    <Input
                      type="number"
                      className="h-10 w-20"
                      value={item.qty}
                      onChange={(e) =>
                        setBomItems((prev) =>
                          prev.map((x, j) =>
                            j === i ? { ...x, qty: parseFloat(e.target.value) || 0 } : x
                          )
                        )
                      }
                    />
                    <Select
                      value={item.unit}
                      onValueChange={(v) =>
                        setBomItems((prev) => prev.map((x, j) => (j === i ? { ...x, unit: v } : x)))
                      }
                    >
                      <SelectTrigger className="h-10 w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="м">м</SelectItem>
                        <SelectItem value="шт">шт</SelectItem>
                        <SelectItem value="г">г</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() =>
                    setBomItems((prev) => [...prev, { material: '', qty: 0, unit: 'м' }])
                  }
                >
                  + Материал
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
<<<<<<< HEAD
              <p className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <Layers className="h-4 w-4" /> Варианты: размеры и цвета
              </p>
              <div>
                <Label className="text-[9px] font-black uppercase text-slate-400">Размеры</Label>
=======
              <p className="text-text-secondary flex items-center gap-2 text-[10px] font-bold">
                <Layers className="h-4 w-4" /> Варианты: размеры и цвета
              </p>
              <div>
                <Label className="text-text-muted text-[9px] font-black uppercase">Размеры</Label>
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mt-2 flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-all',
                        sizes.includes(s)
<<<<<<< HEAD
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
=======
                          ? 'bg-accent-primary text-white'
                          : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
<<<<<<< HEAD
                <Label className="text-[9px] font-black uppercase text-slate-400">Цвета</Label>
=======
                <Label className="text-text-muted text-[9px] font-black uppercase">Цвета</Label>
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mt-2 flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleColor(c)}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase transition-all',
                        colors.includes(c)
<<<<<<< HEAD
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
=======
                          ? 'bg-accent-primary text-white'
                          : 'bg-bg-surface2 text-text-secondary hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {c}
                    </button>
                  ))}
                  <Input
                    placeholder="+ цвет"
                    className="h-8 w-20 text-[10px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const v = (e.target as HTMLInputElement).value.trim();
                        if (v) {
                          setColors((prev) => [...prev, v]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
<<<<<<< HEAD
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[9px] font-bold text-slate-500">
                  Матрица: {sizes.length} размеров × {colors.length} цветов
                </p>
                <p className="mt-1 text-[9px] text-slate-400">Заполняется при создании PO</p>
=======
              <div className="bg-bg-surface2 rounded-xl p-3">
                <p className="text-text-secondary text-[9px] font-bold">
                  Матрица: {sizes.length} размеров × {colors.length} цветов
                </p>
                <p className="text-text-muted mt-1 text-[9px]">
                  Заполняется при создании <AcronymWithTooltip abbr="PO" />
                </p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-bold">Готово к созданию</span>
                </div>
<<<<<<< HEAD
                <p className="mt-2 text-[10px] text-slate-600">
                  Артикул будет создан в стадии Design. После заполнения ТЗ и BOM можно запустить
                  поток сэмплов (Proto 1 → Proto 2 → PP).
=======
                <p className="text-text-secondary mt-2 text-[10px]">
                  Артикул будет создан в стадии «Дизайн». После заполнения ТЗ и{' '}
                  <AcronymWithTooltip abbr="BOM" /> можно запустить поток сэмплов (Прототип 1 →
                  Прототип 2 → PP).
>>>>>>> recover/cabinet-wip-from-stash
                </p>
              </div>
              <div className="space-y-1 text-[11px] font-bold">
                <p>
<<<<<<< HEAD
                  <span className="text-slate-400">Название:</span> {name || '—'}
                </p>
                <p>
                  <span className="text-slate-400">Категория:</span> {category || '—'}
                </p>
                <p>
                  <span className="text-slate-400">BOM:</span>{' '}
                  {bomItems.filter((i) => i.material).length} позиций
                </p>
                <p>
                  <span className="text-slate-400">Варианты:</span> {sizes.join(', ')} ×{' '}
=======
                  <span className="text-text-muted">Название:</span> {name || '—'}
                </p>
                <p>
                  <span className="text-text-muted">Категория:</span> {category || '—'}
                </p>
                <p>
                  <span className="text-text-muted">
                    <AcronymWithTooltip abbr="BOM" />:
                  </span>{' '}
                  {bomItems.filter((i) => i.material).length} позиций
                </p>
                <p>
                  <span className="text-text-muted">Варианты:</span> {sizes.join(', ')} ×{' '}
>>>>>>> recover/cabinet-wip-from-stash
                  {colors.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

<<<<<<< HEAD
        <DialogFooter className="flex justify-between border-t bg-slate-50 p-6">
=======
        <DialogFooter className="bg-bg-surface2 flex justify-between border-t p-6">
>>>>>>> recover/cabinet-wip-from-stash
          <div>
            {step > 1 && (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Назад
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !name.trim()}
                className="gap-1"
              >
                Далее <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>Создать артикул</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
