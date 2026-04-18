'use client';

import React from 'react';
import { Button } from '../../ui/button';

export function DataTableBulkBar({
  count,
  actions,
  onClear,
}: {
  count: number;
  actions: Array<{ label: string; onClick: () => void; tone?: 'primary' | 'secondary' | 'danger' }>;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="border-border-subtle bg-bg-surface flex items-center justify-between gap-3 rounded-lg border px-4 py-3 shadow-sm">
      <div className="text-text-secondary text-sm">
        Selected: <span className="text-text-primary font-medium">{count}</span>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((a) => (
          <Button
            key={a.label}
<<<<<<< HEAD
            variant={
              a.tone === 'primary' ? 'primary' : a.tone === 'danger' ? 'secondary' : 'secondary'
            }
=======
            variant={a.tone === 'primary' ? 'cta' : a.tone === 'danger' ? 'secondary' : 'secondary'}
>>>>>>> recover/cabinet-wip-from-stash
            onClick={a.onClick}
            className={
              a.tone === 'danger'
                ? 'border-state-error text-state-error border hover:bg-[rgba(220,38,38,0.06)]'
                : ''
            }
          >
            {a.label}
          </Button>
        ))}
        <Button variant="ghost" onClick={onClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
