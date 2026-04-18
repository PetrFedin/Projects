'use client';

import React, { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Layers, ChevronRight, ChevronLeft, Factory, FileText, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  COLLECTION_TEMPLATES,
  SEASONS,
  COLLECTION_TYPES,
  PRIORITIES,
  type CollectionTemplate,
} from '@/lib/collection-templates';
import { createDrop, createColorStory, saveMerchandiseGrid } from '@/lib/collections-api';
import { TZ_TEMPLATES } from '@/lib/tz-templates';
import { CollectionCreateWizardSteps } from './CollectionCreateWizardSteps';

const FACTORIES = [
  { id: 'gt', name: 'Global Textiles', spec: 'Верхняя одежда' },
  { id: 'st', name: 'Smart Tailor', spec: 'Платья, костюмы' },
  { id: 'out', name: 'Аутсорс (выбрать позже)', spec: '' },
];

const MERCH_CATEGORIES = [
  { id: 'dresses', label: 'Платья', pct: 25 },
  { id: 'tops', label: 'Верх', pct: 30 },
  { id: 'bottoms', label: 'Низ', pct: 25 },
  { id: 'outerwear', label: 'Верхняя одежда', pct: 20 },
];

export interface CollectionFormData {
  name: string;
  season: string;
  type: string;
  priority: string;
  description: string;
  responsible: string;
  deadline: string;
  dropName: string;
  dropDate: string;
  drops: Array<{ name: string; date: string; plan?: string }>;
  factoryIds: string[];
  tzTemplateId: string;
  materials: number;
  sewing: number;
  logistics: number;
  merchPlan: Array<{ id: string; label: string; pct: number; targetUnits: number }>;
  palette: Array<{ name: string; hex: string }>;
  selectedSkuIds: string[];
}

const INITIAL_FORM: CollectionFormData = {
  name: '',
  season: 'SS26',
  type: 'main',
  priority: 'Standard',
  description: '',
  responsible: 'Анна К.',
  deadline: '',
  dropName: '',
  dropDate: '',
  drops: [],
  factoryIds: [],
  tzTemplateId: 'basic',
  materials: 0,
  sewing: 0,
  logistics: 0,
  merchPlan: MERCH_CATEGORIES.map((c) => ({ ...c, targetUnits: 0 })),
  palette: [],
  selectedSkuIds: [],
};

export interface CollectionCreateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApiError?: (message: string) => void;
  onCreated: (
    collection: {
      id: string;
      name: string;
      status: string;
      items: number;
      readiness: string;
      budget: string;
      type: string;
      priority: string;
      deadline: string;
      responsible: string;
      season?: string;
    },
    budget?: { materials: number; sewing: number; logistics: number }
  ) => void;
  existingCollections?: Array<{ id: string; name: string }>;
  allSkus?: Array<{ id: string; name: string; collection: string }>;
  duplicateFrom?: {
    id: string;
    name: string;
    budget?: { materials: number; sewing: number; logistics: number };
  } | null;
}

const STEPS = [
  { id: 1, title: 'Основные данные', key: 'basics' },
  { id: 2, title: 'Дропы', key: 'drops' },
  { id: 3, title: 'Бюджет и ассортимент', key: 'budget' },
  { id: 4, title: 'Цветовая палитра', key: 'palette' },
];

export function CollectionCreateWizard({
  open,
  onOpenChange,
  onCreated,
  onApiError,
  existingCollections = [],
  allSkus = [],
  duplicateFrom,
}: CollectionCreateWizardProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CollectionFormData>(() => {
    if (duplicateFrom) {
      const template = COLLECTION_TEMPLATES[0];
      const b = duplicateFrom.budget;
      return {
        ...INITIAL_FORM,
        ...template,
        name: `${duplicateFrom.name} (копия)`,
        ...(b && { materials: b.materials, sewing: b.sewing, logistics: b.logistics }),
      };
    }
    return { ...INITIAL_FORM };
  });
  const [templateId, setTemplateId] = useState<string | null>(duplicateFrom ? 'seasonal' : null);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setErrors({});
      if (duplicateFrom) {
        const template = COLLECTION_TEMPLATES[0];
        const b = duplicateFrom.budget;
        setForm({
          ...INITIAL_FORM,
          ...template,
          name: `${duplicateFrom.name} (копия)`,
          ...(b && { materials: b.materials, sewing: b.sewing, logistics: b.logistics }),
        });
        setTemplateId('seasonal');
      } else {
        setForm({ ...INITIAL_FORM });
        setTemplateId(null);
      }
    }
  }, [open]);

  const applyTemplate = (t: CollectionTemplate) => {
    setTemplateId(t.id);
    setForm((prev) => ({
      ...prev,
      season: t.season,
      type: t.type,
      priority: t.priority,
      materials: t.budgetMaterials,
      sewing: t.budgetSewing,
      logistics: t.budgetLogistics,
      dropName: t.dropName,
      dropDate: t.dropDate,
      drops:
        t.dropName && t.dropDate ? [{ name: t.dropName, date: t.dropDate, plan: '' }] : prev.drops,
      palette: [...t.palette],
    }));
  };

  const validateStep = (s: number) => {
    const e = {} as Record<string, string>;
    if (s === 1) {
      if (!form.name?.trim()) e.name = 'Введите название';
      else if (
        existingCollections.some((c) => c.name.toLowerCase() === form.name.trim().toLowerCase())
      ) {
        e.name = 'Коллекция с таким названием уже есть';
      }
      const d = form.deadline;
      if (d && isNaN(Date.parse(d))) e.deadline = 'Некорректная дата';
    }
    if (s === 2) {
      const drops = form.drops?.length
        ? form.drops
        : form.dropName
          ? [{ name: form.dropName, date: form.dropDate }]
          : [];
      if (drops.length === 0) e.dropName = 'Добавьте хотя бы один Drop';
      drops.forEach((d, i) => {
        if (!d.name?.trim()) e['drop_' + i] = 'Название';
        if (d.date && isNaN(Date.parse(d.date))) e['dropdate_' + i] = 'Дата';
      });
    }
    if (s === 3) {
      const t = form.materials + form.sewing + form.logistics;
      if (t <= 0) e.budget = 'Укажите хотя бы одну сумму';
      if (form.materials < 0 || form.sewing < 0 || form.logistics < 0)
        e.budget = 'Суммы не могут быть отрицательными';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const formatBudget = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

  const handleFinish = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    try {
      const collId = (form.name || 'NEW')
        .toUpperCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      const totalBudget = form.materials + form.sewing + form.logistics;
      const typeLabel = COLLECTION_TYPES.find((x) => x.value === form.type)?.label || 'Коллекция';

      // API: Drop
      const drops = form.drops?.length
        ? form.drops
        : form.dropName
          ? [{ name: form.dropName, date: form.dropDate }]
          : [];
      for (const d of drops) {
        if (d.name && d.date && totalBudget > 0) {
          try {
            await createDrop({
              season: form.season,
              drop_name: d.name,
              scheduled_date: new Date(d.date).toISOString(),
              sku_list_json: form.selectedSkuIds.length ? { sku_ids: form.selectedSkuIds } : {},
            });
          } catch (err) {
            onApiError?.(
              `Не удалось создать Drop: ${err instanceof Error ? err.message : 'ошибка API'}`
            );
          }
        }
      }

      // API: Color Story
      if (form.palette.length > 0) {
        try {
          await createColorStory({
            collection_name: form.name || collId,
            palette_json: { colors: form.palette },
          });
        } catch (err) {
          onApiError?.(
            `Не удалось сохранить палитру: ${err instanceof Error ? err.message : 'ошибка API'}`
          );
        }
      }

      // API: Merchandise Grid
      const targetUnits = form.merchPlan?.reduce((s, m) => s + (m.targetUnits || 0), 0) || 0;
      if (totalBudget > 0) {
        try {
          await saveMerchandiseGrid(form.season, {
            total_budget: totalBudget,
            category_split_json: {
              materials: form.materials,
              sewing: form.sewing,
              logistics: form.logistics,
            },
            target_units: targetUnits,
          });
        } catch (err) {
          onApiError?.(
            `Не удалось сохранить бюджет: ${err instanceof Error ? err.message : 'ошибка API'}`
          );
        }
      }

      onCreated(
        {
          id: collId,
          name: form.name || 'New Collection',
          status: 'Development',
          items: 0,
          readiness: '0%',
          budget: totalBudget ? `${formatBudget(totalBudget)} ₽` : '0 ₽',
          type: typeLabel,
          priority: form.priority,
          deadline: form.deadline || '—',
          responsible: form.responsible,
          season: form.season,
        },
        totalBudget > 0
          ? { materials: form.materials, sewing: form.sewing, logistics: form.logistics }
          : undefined
      );
      onOpenChange(false);
      setStep(1);
      setForm({ ...INITIAL_FORM });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-[2rem] border-none bg-white p-0 shadow-2xl sm:max-w-[640px]">
        <DialogHeader className="bg-text-primary shrink-0 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-2xl">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
                Новая коллекция
              </DialogTitle>
              <DialogDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase">
                Шаг {step} из 4 · {STEPS[step - 1].title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <CollectionCreateWizardSteps
            step={step}
            form={form}
            setForm={setForm}
            errors={errors}
            applyTemplate={applyTemplate}
            templateId={templateId}
          />
        </div>
        <DialogFooter className="bg-bg-surface2 flex justify-between border-t p-6">
          <div>
            {step > 1 && (
              <Button variant="ghost" onClick={handleBack} className="h-10 gap-1 rounded-xl">
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
                onClick={handleNext}
                className="bg-accent-primary h-10 gap-1 rounded-xl text-white"
              >
                Далее <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="bg-accent-primary h-10 rounded-xl text-white"
              >
                {isSubmitting ? 'Создаём...' : 'Запустить'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
