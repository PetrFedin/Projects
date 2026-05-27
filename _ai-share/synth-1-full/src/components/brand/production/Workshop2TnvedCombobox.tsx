'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useWorkshop2RefTnved } from '@/components/brand/production/use-workshop2-references';

type Props = {
  categoryLeafId?: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

/** Комбобокс ТН ВЭД: подсказки из PG/static по leafId + свободный ввод 10 цифр. */
export function Workshop2TnvedCombobox({
  categoryLeafId,
  value,
  onChange,
  placeholder = '10 знаков ЕАЭС',
  disabled,
  className,
}: Props) {
  const { items, state } = useWorkshop2RefTnved(categoryLeafId, true);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const options = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) => r.code.includes(q) || r.label.toLowerCase().includes(q));
  }, [items, filter]);

  const onInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    onChange(digits);
    setFilter(raw);
    setOpen(true);
  };

  const showEmptyHint = open && state !== 'loading' && options.length === 0;

  return (
    <div className={cn('relative min-w-0', className)}>
      <Input
        className="h-9 font-mono text-sm"
        value={value}
        onChange={(e) => onInput(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={10}
        inputMode="numeric"
        aria-autocomplete="list"
      />
      {open && (options.length > 0 || state === 'loading' || showEmptyHint) ? (
        <ul
          className="border-border-default bg-bg-surface absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border text-[11px] shadow-md"
          role="listbox"
        >
          {state === 'loading' ? (
            <li className="text-text-muted px-2 py-1.5">Загрузка справочника…</li>
          ) : null}
          {showEmptyHint ? (
            <li className="text-text-muted px-2 py-2 leading-snug">
              {categoryLeafId?.trim()
                ? 'Нет подсказок ТН ВЭД для этой категории. Введите 10 цифр вручную или обновите справочник.'
                : 'Справочник ТН ВЭД пуст. Введите код из 10 цифр вручную.'}
            </li>
          ) : null}
          {options.slice(0, 24).map((r) => (
            <li key={r.code}>
              <button
                type="button"
                className="hover:bg-bg-surface2 w-full px-2 py-1.5 text-left"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(r.code);
                  setFilter('');
                  setOpen(false);
                }}
              >
                <span className="font-mono font-semibold">{r.code}</span>
                <span className="text-text-secondary ml-1.5">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
