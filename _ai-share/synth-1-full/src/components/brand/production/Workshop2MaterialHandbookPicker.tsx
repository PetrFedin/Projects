'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type MaterialOption = {
  parameterId: string;
  label: string;
};

type Props = {
  sortedParams: MaterialOption[];
  excludeIds: Set<string>;
  onPick: (p: MaterialOption) => void;
};

export function Workshop2MaterialHandbookPicker({ sortedParams, excludeIds, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();
  const available = sortedParams.filter(
    (p) => !excludeIds.has(p.parameterId) && (!needle || p.label.toLowerCase().includes(needle))
  );

  return (
    <div className="w-full min-w-0 max-w-full space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="h-9 w-full px-3 text-xs font-semibold sm:w-auto"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Скрыть справочник' : 'Добавить из справочника'}
      </Button>
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
