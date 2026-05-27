'use client';

import { useCallback, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  formatWorkshop2Rub,
  persistWorkshop2FxPrefs,
  readWorkshop2FxPrefs,
  referenceToRub,
  rubToReference,
  type Workshop2FxPrefs,
} from '@/lib/production/workshop2-money-rub';

/** Калькулятор курса: справочная валюта ↔ рубли (итог в ТЗ/BOM — в ₽). */
export function Workshop2FxCalculatorPopover({
  rubAmount,
  className,
}: {
  /** Текущая сумма в рублях (если есть) — подставляется в поле. */
  rubAmount?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Workshop2FxPrefs>(() => readWorkshop2FxPrefs());
  const [rubInput, setRubInput] = useState(
    rubAmount != null && Number.isFinite(rubAmount) ? String(rubAmount) : ''
  );

  const rubVal = parseFloat(rubInput.replace(',', '.'));
  const refVal = Number.isFinite(rubVal) ? rubToReference(rubVal, prefs) : NaN;

  const savePrefs = useCallback((next: Workshop2FxPrefs) => {
    setPrefs(next);
    persistWorkshop2FxPrefs(next);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={className ?? 'text-text-muted hover:text-text-primary h-7 w-7 shrink-0'}
          title="Калькулятор валюты (справка; в ТЗ суммы в ₽)"
          aria-label="Калькулятор валюты"
        >
          <LucideIcons.Calculator className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-3 p-3" align="end">
        <p className="text-text-primary text-xs font-semibold">Курс для справки</p>
        <p className="text-text-muted text-[10px] leading-snug">
          В досье и BOM фиксируются суммы в рублях. Здесь можно пересчитать из USD/EUR по курсу на
          дату.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1">
            <span className="text-text-muted text-[10px] font-medium">Валюта</span>
            <select
              className="h-8 w-full rounded-md border bg-white px-2 text-[11px]"
              value={prefs.referenceCurrency}
              onChange={(e) =>
                savePrefs({
                  ...prefs,
                  referenceCurrency: e.target.value as Workshop2FxPrefs['referenceCurrency'],
                })
              }
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-text-muted text-[10px] font-medium">Курс (₽ за 1)</span>
            <Input
              type="number"
              step="0.01"
              className="h-8 text-[11px]"
              value={prefs.rateRub}
              onChange={(e) =>
                savePrefs({ ...prefs, rateRub: parseFloat(e.target.value) || prefs.rateRub })
              }
            />
          </label>
          <label className="col-span-2 space-y-1">
            <span className="text-text-muted text-[10px] font-medium">Дата курса</span>
            <Input
              type="date"
              className="h-8 text-[11px]"
              value={prefs.rateDate}
              onChange={(e) => savePrefs({ ...prefs, rateDate: e.target.value })}
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-text-muted text-[10px] font-medium">Сумма, ₽</span>
          <Input
            type="number"
            className="h-8 text-[11px]"
            value={rubInput}
            onChange={(e) => setRubInput(e.target.value)}
            placeholder="4500"
          />
        </label>
        {Number.isFinite(refVal) ? (
          <p className="text-text-secondary border-border-subtle bg-bg-surface2/60 rounded-md border px-2 py-1.5 text-[11px]">
            ≈ {refVal.toFixed(2)} {prefs.referenceCurrency}
            <span className="text-text-muted"> · обратно: </span>
            {formatWorkshop2Rub(referenceToRub(refVal, prefs))}
          </p>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
