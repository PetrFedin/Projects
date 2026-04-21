'use client';

import React from 'react';
import { cn } from '../../lib/cn';
import { Input } from './input';
import { Button } from './button';

type Option = { value: string; label: string };

export function AsyncMultiSelect({
  value,
  onChange,
  placeholder,
  type,
  className,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  type: 'brands' | 'suppliers' | 'retailers' | 'marketplaces';
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);

  const label =
    value.length === 0
      ? placeholder
      : value.length <= 2
        ? value.join(', ')
        : `${value.length} selected`;

  const fetchOptions = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/options?type=${type}&q=${encodeURIComponent(q)}`, {
        cache: 'no-store',
      });
      const json = (await res.json()) as { options?: Option[] };
      setOptions(json.options ?? []);
    } finally {
      setLoading(false);
    }
  }, [type, q]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(fetchOptions, 180);
    return () => clearTimeout(t);
  }, [open, q, fetchOptions]);

  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange(next);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        className="border-border-default bg-bg-surface text-text-primary h-10 w-full min-w-[200px] rounded-md border px-3 text-left text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>

      {open && (
        <div className="border-border-subtle bg-bg-surface absolute z-30 mt-2 w-full rounded-lg border p-2 shadow-sm">
          <div className="px-1 pb-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Введите для поиска…" />
          </div>

          <div className="max-h-56 overflow-auto">
            {loading ? (
              <div className="text-text-secondary px-2 py-6 text-sm">Загрузка…</div>
            ) : options.length === 0 ? (
              <div className="text-text-secondary px-2 py-6 text-sm">Нет совпадений</div>
            ) : (
              options.map((o) => (
                <label
                  key={o.value}
                  className="hover:bg-bg-surface2 flex items-center gap-2 rounded-md px-2 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(o.value)}
                    onChange={() => toggle(o.value)}
                  />
                  <span className="text-text-primary">{o.label}</span>
                </label>
              ))
            )}
          </div>

          <div className="mt-2 flex justify-end gap-2 px-1 pb-1">
            <Button variant="ghost" onClick={() => onChange([])}>
              Clear
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
