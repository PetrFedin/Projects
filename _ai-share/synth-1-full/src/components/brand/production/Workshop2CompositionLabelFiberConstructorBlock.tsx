'use client';

import { Trash2 } from 'lucide-react';
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
import { compositionLabelConstructorFiberPercentSum } from '@/lib/production/workshop2-composition-label-constructor';
import { W2_COMPOSITION_LABEL_FIBER_CATALOG } from '@/lib/production/workshop2-composition-label-spec-constants';
import type {
  Workshop2CompositionLabelFiberRow,
  Workshop2CompositionLabelSpec,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

function normalizeRows(
  rows: Workshop2CompositionLabelFiberRow[] | undefined
): Workshop2CompositionLabelFiberRow[] {
  const r = rows?.length ? [...rows] : [{ fiberId: '', percent: 0 }];
  return r.length ? r : [{ fiberId: '', percent: 0 }];
}

export function Workshop2CompositionLabelFiberConstructorBlock({
  spec,
  onChange,
  readOnly,
  sumAlert,
  embedded = false,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
  sumAlert: boolean;
  /** Без отдельной карточки «Блок А» — внутри шага SpecBlock. */
  embedded?: boolean;
}) {
  const ro = readOnly;
  const s = spec ?? {};
  const rows = normalizeRows(s.constructorFiberRows);
  const sum = compositionLabelConstructorFiberPercentSum(s);

  const setRows = (nextRows: Workshop2CompositionLabelFiberRow[]) => {
    onChange(patchSpec(s, { constructorFiberRows: nextRows }));
  };

  const shell = embedded
    ? 'space-y-2'
    : 'space-y-2 rounded-lg border border-border-subtle bg-bg-surface2/40 p-3';

  return (
    <div className={shell}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {embedded ? (
          <p className="text-text-secondary text-[11px]">
            Волокна и доли, сумма 100% для ворот и PDF.
          </p>
        ) : (
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-text-primary text-base font-semibold">
              Бирка состава и ухода (составник)
            </h3>
            <p className="text-text-secondary text-[11px] leading-snug">
              Укажите состав. Сумма долей должна равняться 100% для прохождения ворот ТЗ и генерации
              PDF.
            </p>
          </div>
        )}
        <span
          data-testid="workshop2-dossier-composition-fiber-sum"
          className={cn(
            'ml-auto text-xs font-medium tabular-nums',
            sumAlert
              ? 'text-red-600'
              : Math.abs(sum - 100) < 0.05 && sum > 0
                ? 'text-emerald-700'
                : 'text-text-secondary'
          )}
        >
          Σ = {Math.round(sum * 100) / 100}%
          {sum > 0 ? (Math.abs(sum - 100) < 0.05 ? ' ✓' : ' ≠ 100%') : ''}
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((row, idx) => (
          <div
            key={idx}
            data-testid={`workshop2-dossier-composition-fiber-row-${idx}`}
            className="border-border-subtle/50 mb-2 grid gap-2 border-b pb-2 last:mb-0 last:border-0 last:pb-0 sm:grid-cols-[1fr_88px_auto] sm:items-end"
          >
            <div className="space-y-1">
              <Label className="text-xs font-medium">Волокно</Label>
              <Select
                disabled={ro}
                value={row.fiberId || 'unset'}
                onValueChange={(v) => {
                  const next = [...rows];
                  next[idx] = { ...next[idx], fiberId: v === 'unset' ? '' : v };
                  setRows(next);
                }}
              >
                <SelectTrigger
                  className="h-9 text-xs"
                  data-testid={`workshop2-dossier-composition-fiber-id-${idx}`}
                >
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unset" className="text-xs">
                    —
                  </SelectItem>
                  {W2_COMPOSITION_LABEL_FIBER_CATALOG.map((f) => (
                    <SelectItem key={f.id} value={f.id} className="text-xs">
                      {f.labelRu} / {f.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">%</Label>
              <Input
                className="h-9 text-xs tabular-nums"
                inputMode="decimal"
                disabled={ro}
                data-testid={`workshop2-dossier-composition-fiber-percent-${idx}`}
                value={row.percent ? String(row.percent) : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(',', '.');
                  const n = raw === '' ? 0 : Number(raw);
                  const next = [...rows];
                  next[idx] = { ...next[idx], percent: Number.isFinite(n) ? n : 0 };
                  setRows(next);
                }}
                placeholder="0"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-red-700"
              disabled={ro || rows.length <= 1}
              aria-label="Удалить строку"
              onClick={() => {
                const next = rows.filter((_, i) => i !== idx);
                setRows(next.length ? next : [{ fiberId: '', percent: 0 }]);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 text-xs"
        disabled={ro}
        data-testid="workshop2-dossier-composition-fiber-add"
        onClick={() => setRows([...rows, { fiberId: '', percent: 0 }])}
      >
        Добавить компонент
      </Button>
    </div>
  );
}
