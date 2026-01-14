"use client";

import React from "react";
import { cn } from "../../lib/cn";

export function Select({
  value,
  onChange,
  options,
  className
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <select
      className={cn("h-10 rounded-md border border-border-default bg-bg-surface px-3 text-sm text-text-primary", className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}



