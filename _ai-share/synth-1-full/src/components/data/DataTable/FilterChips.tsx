import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function FilterChips({
  filters,
  onRemove,
}: {
  filters: { key: string; label: string; value: string }[];
  onRemove: (key: string) => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {filters.map((f) => (
        <div
          key={f.key}
<<<<<<< HEAD
          className="inline-flex items-center gap-1.5 rounded-sm border border-zinc-200 bg-zinc-100 px-2 py-1"
        >
          <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">
            {f.label}:
          </span>
          <span className="text-[10px] font-bold uppercase text-zinc-900">{f.value}</span>
          <button
            onClick={() => onRemove(f.key)}
            className="text-zinc-400 transition-colors hover:text-zinc-900"
=======
          className="bg-bg-surface2 border-border-default inline-flex items-center gap-1.5 rounded-sm border px-2 py-1"
        >
          <span className="text-text-muted text-[10px] font-black uppercase tracking-tighter">
            {f.label}:
          </span>
          <span className="text-text-primary text-[10px] font-bold uppercase">{f.value}</span>
          <button
            onClick={() => onRemove(f.key)}
            className="text-text-muted hover:text-text-primary transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
