'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  COLLECTION_TEMPLATES,
  SEASONS,
  COLLECTION_TYPES,
  PRIORITIES,
  type CollectionTemplate,
} from '@/lib/collection-templates';
import type { CollectionFormData } from './CollectionCreateWizard';

const MERCH_CATEGORIES = [
  { id: 'dresses', label: 'Платья', pct: 25 },
  { id: 'tops', label: 'Верх', pct: 30 },
  { id: 'bottoms', label: 'Низ', pct: 25 },
  { id: 'outerwear', label: 'Верхняя одежда', pct: 20 },
];

interface CollectionCreateWizardStepsProps {
  step: number;
  form: CollectionFormData;
  setForm: React.Dispatch<React.SetStateAction<CollectionFormData>>;
  errors: Record<string, string>;
  applyTemplate: (t: CollectionTemplate) => void;
  templateId: string | null;
}

export function CollectionCreateWizardSteps({
  step,
  form,
  setForm,
  errors,
  applyTemplate,
  templateId,
}: CollectionCreateWizardStepsProps) {
  if (step === 1) {
    return (
      <div className="space-y-4">
        {COLLECTION_TEMPLATES.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Шаблон</Label>
            <div className="flex flex-wrap gap-2">
              {COLLECTION_TEMPLATES.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={templateId === t.id ? 'border-indigo-500 bg-indigo-50' : ''}
                  onClick={() => applyTemplate(t)}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400">
            Название коллекции *
          </Label>
          <Input
            placeholder="Летнее солнцестояние 2026"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="h-11 rounded-xl"
          />
          {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Сезон</Label>
            <Select
              value={form.season}
              onValueChange={(v) => setForm((f) => ({ ...f, season: v }))}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEASONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Тип</Label>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLLECTION_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Ответственный</Label>
            <Input
              value={form.responsible}
              onChange={(e) => setForm((f) => ({ ...f, responsible: e.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-400">Дедлайн</Label>
            <Input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className="h-11 rounded-xl"
            />
            {errors.deadline && <p className="text-xs text-rose-500">{errors.deadline}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400">Приоритет</Label>
          <Select
            value={form.priority}
            onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const drops = form.drops?.length
      ? form.drops
      : form.dropName
        ? [{ name: form.dropName, date: form.dropDate }]
        : [];
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400">Первый дроп</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Название"
              value={form.dropName}
              onChange={(e) => setForm((f) => ({ ...f, dropName: e.target.value }))}
              className="h-11 rounded-xl"
            />
            <Input
              type="date"
              value={form.dropDate}
              onChange={(e) => setForm((f) => ({ ...f, dropDate: e.target.value }))}
              className="h-11 rounded-xl"
            />
          </div>
          {errors.dropName && <p className="text-xs text-rose-500">{errors.dropName}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400">
            Дополнительные дропы
          </Label>
          {drops.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Название"
                value={d.name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    drops: (f.drops || []).map((x, j) =>
                      j === i ? { ...x, name: e.target.value } : x
                    ),
                  }))
                }
                className="h-10 flex-1 rounded-xl"
              />
              <Input
                type="date"
                value={d.date}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    drops: (f.drops || []).map((x, j) =>
                      j === i ? { ...x, date: e.target.value } : x
                    ),
                  }))
                }
                className="h-10 w-36 rounded-xl"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 text-rose-500"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    drops: (f.drops || []).filter((_, j) => j !== i),
                  }))
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() =>
              setForm((f) => ({
                ...f,
                drops: [...(f.drops || []), { name: '', date: '', plan: '' }],
              }))
            }
          >
            <Plus className="size-4" /> Добавить дроп
          </Button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400">
            Бюджет (материалы / пошив / логистика)
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Материалы"
              value={form.materials || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, materials: parseInt(e.target.value, 10) || 0 }))
              }
              className="h-11 rounded-xl"
            />
            <Input
              type="number"
              min={0}
              placeholder="Пошив"
              value={form.sewing || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, sewing: parseInt(e.target.value, 10) || 0 }))
              }
              className="h-11 rounded-xl"
            />
            <Input
              type="number"
              min={0}
              placeholder="Логистика"
              value={form.logistics || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, logistics: parseInt(e.target.value, 10) || 0 }))
              }
              className="h-11 rounded-xl"
            />
          </div>
          {errors.budget && <p className="text-xs text-rose-500">{errors.budget}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-400">
            Merchandise plan (целевые единицы)
          </Label>
          {form.merchPlan?.map((m, i) => (
            <div key={m.id} className="flex items-center gap-2">
              <span className="w-28 text-xs font-bold">{m.label}</span>
              <Input
                type="number"
                min={0}
                value={m.targetUnits || 0}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    merchPlan: (f.merchPlan || []).map((x, j) =>
                      j === i ? { ...x, targetUnits: parseInt(e.target.value, 10) || 0 } : x
                    ),
                  }))
                }
                className="h-10 flex-1 rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Цветовая палитра: {form.palette?.length || 0} цветов
        </p>
        {form.palette?.length ? (
          <div className="flex flex-wrap gap-2">
            {form.palette.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1"
                style={{ backgroundColor: c.hex ? `${c.hex}20` : undefined }}
              >
                <div
                  className="size-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: c.hex || '#ccc' }}
                />
                <span className="text-xs font-bold">{c.name || '—'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic text-slate-400">
            Палитра подгружается из шаблона. Нажмите &quot;Запустить&quot; для создания коллекции.
          </p>
        )}
      </div>
    );
  }

  return null;
}
