'use client';
import React from 'react';
import { Input } from './input';

export function DateRange({
  from,
  to,
  onChange,
}: {
  from?: string;
  to?: string;
  onChange: (v: { from?: string; to?: string }) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="date"
        value={from ?? ''}
        onChange={(e) => onChange({ from: e.target.value || undefined, to })}
      />
      <div className="text-text-muted">—</div>
      <Input
        type="date"
        value={to ?? ''}
        onChange={(e) => onChange({ from, to: e.target.value || undefined })}
      />
    </div>
  );
}
