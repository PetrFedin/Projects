'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { split100 } from '@/components/brand/production/workshop2-phase1-dossier-panel-color-mat-helpers';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  parseMatRowsFromDossier,
  type MatPctRow,
} from '@/lib/production/workshop2-material-mat-rows';
import { cn } from '@/lib/utils';

type MatHandbookParam = AttributeCatalogAttribute['parameters'][number];

function MaterialHandbookPicker({
  sortedParams,
  excludeIds,
  onPick,
}: {
  sortedParams: MatHandbookParam[];
  excludeIds: Set<string>;
  onPick: (p: MatHandbookParam) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const available = sortedParams.filter(
    (p) => !excludeIds.has(p.parameterId) && (!needle || p.label.toLowerCase().includes(needle))
  );
  return (
    <div className="ms-auto min-w-0 max-w-md space-y-2">
      <div className="flex justify-end">
        <Button type="button" className="h-9 px-3 text-xs font-semibold" onClick={() => setOpen((v) => !v)}>
          {open ? 'Скрыть справочник' : 'Добавить'}
        </Button>
      </div>
      {open ? (
        <div className="border-border-default w-full min-w-[16rem] rounded-xl border bg-white p-3 shadow-sm">
          <Input
            className="mb-2 h-9 text-sm"
            placeholder="Фильтр по названию…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="border-border-subtle divide-border-subtle max-h-48 divide-y overflow-y-auto rounded-md border">
            {available.length === 0 ? (
              <p className="text-text-secondary p-3 text-[11px]">
                Нет позиций — измените фильтр или все материалы уже в строке состава.
              </p>
            ) : (
              available.map((p) => (
                <button
                  key={p.parameterId}
                  type="button"
                  className="hover:bg-bg-surface2 w-full px-2 py-2 text-left text-sm"
                  onClick={() => {
                    onPick(p);
                    setQ('');
                    setOpen(false);
                  }}
                >
                  {p.label}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MaterialCompositionBlock({
  dossier,
  matAttribute,
  linkedComposition,
  onApplyRows,
  onApplySoloParts,
  showMaterialRequiredHint,
}: {
  dossier: Workshop2DossierPhase1;
  matAttribute: AttributeCatalogAttribute;
  linkedComposition: boolean;
  onApplyRows: (rows: MatPctRow[]) => void;
  onApplySoloParts: (parts: { parameterId: string; displayLabel: string }[]) => void;
  showMaterialRequiredHint?: boolean;
}) {
  const paramLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of matAttribute.parameters) m.set(p.parameterId, p.label);
    return m;
  }, [matAttribute.parameters]);

  const sortedParams = useMemo(
    () => [...matAttribute.parameters].sort((x, y) => x.sortOrder - y.sortOrder),
    [matAttribute.parameters]
  );

  const rows = useMemo(
    () => parseMatRowsFromDossier(dossier, paramLabelById),
    [dossier, paramLabelById]
  );

  if (!linkedComposition) {
    const a = dossier.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'mat');
    const selected = new Set(
      (a?.values ?? [])
        .filter((v) => v.valueSource === 'handbook_parameter')
        .map((v) => v.parameterId)
        .filter(Boolean) as string[]
    );
    const pushSolo = (nextSel: Set<string>) => {
      const parts = sortedParams
        .filter((p) => nextSel.has(p.parameterId))
        .map((p) => ({ parameterId: p.parameterId, displayLabel: p.label }));
      onApplySoloParts(parts);
    };
    const addSolo = (pid: string) => {
      if (selected.has(pid)) return;
      const next = new Set(selected);
      next.add(pid);
      pushSolo(next);
    };
    const removeSolo = (pid: string) => {
      const next = new Set(selected);
      next.delete(pid);
      pushSolo(next);
    };
    const selectedRows = sortedParams.filter((p) => selected.has(p.parameterId));
    return (
      <div id="w2-material-composition" className="scroll-mt-20 w-full min-w-0 space-y-3">
        {showMaterialRequiredHint ? (
          <p className="text-[11px] font-medium text-amber-700">Выберите материал.</p>
        ) : null}
        <div className="w-full min-w-0 space-y-2">
          {selectedRows.length === 0 ? (
            <p className="text-text-secondary text-[11px]">Пока пусто — нажмите «Добавить» ниже.</p>
          ) : (
            <div className="grid w-full min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
              {selectedRows.map((p) => (
                <div
                  key={p.parameterId}
                  className="border-border-subtle bg-bg-surface2/40 space-y-0.5 rounded-md border px-2 py-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="text-text-primary min-w-0 truncate text-[11px] font-semibold leading-none"
                      title={p.label}
                    >
                      {p.label}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-text-secondary h-6 w-6 shrink-0 p-0 text-xs leading-none hover:text-red-600"
                      onClick={() => removeSolo(p.parameterId)}
                      aria-label={`Убрать ${p.label}`}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-border-subtle flex w-full min-w-0 justify-end border-t pt-3">
          <MaterialHandbookPicker
            sortedParams={sortedParams}
            excludeIds={selected}
            onPick={(p) => addSolo(p.parameterId)}
          />
        </div>
      </div>
    );
  }

  const pctByPid = Object.fromEntries(rows.map((r) => [r.parameterId, r.pct])) as Record<
    string,
    number
  >;
  const sum = rows.reduce((s, r) => s + r.pct, 0);
  const selectedIds = new Set(rows.map((r) => r.parameterId));

  const addLinked = (pid: string, label: string) => {
    if (rows.some((r) => r.parameterId === pid)) return;
    const next = [...rows, { parameterId: pid, label, pct: 0 }];
    const parts = split100(next.length);
    onApplyRows(next.map((r, i) => ({ ...r, pct: parts[i]! })));
  };

  const removeLinked = (pid: string) => {
    let next = rows.filter((r) => r.parameterId !== pid);
    if (next.length === 1) next[0] = { ...next[0]!, pct: 100 };
    else if (next.length > 1) {
      const parts = split100(next.length);
      next = next.map((r, i) => ({ ...r, pct: parts[i]! }));
    }
    onApplyRows(next);
  };

  const setPctFor = (pid: string, label: string, raw: string) => {
    const n = parseInt(raw.replace(/\D/g, ''), 10);
    const pct = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
    const next = rows.map((r) => (r.parameterId === pid ? { ...r, label, pct } : r));
    onApplyRows(next);
  };

  const selectedRows = rows;

  return (
    <div id="w2-material-composition" className="scroll-mt-20 w-full min-w-0 space-y-3">
      {showMaterialRequiredHint ? (
        <p className="text-[11px] font-medium text-amber-700">Выберите материал.</p>
      ) : null}

      <div className="w-full min-w-0 space-y-2">
        {selectedRows.length === 0 ? (
          <p className="text-text-secondary text-[11px]">Пока пусто — нажмите «Добавить» ниже.</p>
        ) : (
          <div className="grid w-full min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
            {selectedRows.map((r) => (
              <div
                key={r.parameterId}
                className="border-border-subtle bg-bg-surface2/40 space-y-0.5 rounded-md border px-2 py-1"
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-text-primary min-w-0 truncate text-[11px] font-semibold leading-none"
                    title={r.label}
                  >
                    {r.label}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-text-secondary h-6 w-6 shrink-0 p-0 text-xs leading-none hover:text-red-600"
                    onClick={() => removeLinked(r.parameterId)}
                    aria-label={`Убрать ${r.label}`}
                  >
                    ×
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-text-secondary text-[10px] leading-none">Доля, %</span>
                  <Input
                    className={cn(
                      'h-8 w-12 px-1 text-[11px] tabular-nums',
                      sum !== 100 && rows.length > 0 && 'border-amber-400 ring-1 ring-amber-200/80'
                    )}
                    inputMode="numeric"
                    value={String(pctByPid[r.parameterId] ?? 0)}
                    onChange={(e) => setPctFor(r.parameterId, r.label, e.target.value)}
                    aria-label={`Процент для ${r.label}`}
                    aria-invalid={sum !== 100 && rows.length > 0 ? true : undefined}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {sum !== 100 && rows.length > 0 ? (
        <div
          className="w-full rounded-md border border-amber-400/90 bg-amber-50/95 px-2.5 py-2 text-[11px] leading-snug text-amber-950 shadow-sm"
          role="alert"
        >
          <span className="font-semibold">Состав не сходится до 100%.</span> Сейчас сумма{' '}
          <span className="font-bold tabular-nums">{sum}%</span> — поправьте доли до сохранения ТЗ
          (комплаенс, BOM, экспорт).
        </div>
      ) : null}
      <div className="border-border-subtle flex w-full min-w-0 flex-wrap items-center justify-between gap-2 border-t pt-3">
        <p
          className={cn(
            'min-w-0 shrink-0 text-sm font-semibold tabular-nums',
            sum === 100 ? 'text-emerald-700' : 'text-amber-700'
          )}
        >
          Всего: {sum}%
        </p>
        <MaterialHandbookPicker
          sortedParams={sortedParams}
          excludeIds={selectedIds}
          onPick={(p) => addLinked(p.parameterId, p.label)}
        />
      </div>
    </div>
  );
}
