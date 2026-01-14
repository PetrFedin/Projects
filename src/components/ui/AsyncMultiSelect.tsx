"use client";

import React from "react";
import { cn } from "../../lib/cn";
import { Input } from "./Input";
import { Button } from "./Button";

type Option = { value: string; label: string };

export function AsyncMultiSelect({
  value,
  onChange,
  placeholder,
  type,
  className
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  type: "brands" | "suppliers" | "retailers" | "marketplaces";
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(false);

  const label =
    value.length === 0 ? placeholder : value.length <= 2 ? value.join(", ") : `${value.length} selected`;

  const fetchOptions = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/options?type=${type}&q=${encodeURIComponent(q)}`, { cache: "no-store" });
      const json = await res.json();
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
    const next = value.includes(v) ? value.filter(x => x !== v) : [...value, v];
    onChange(next);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className="h-10 w-full min-w-[200px] rounded-md border border-border-default bg-bg-surface px-3 text-sm text-text-primary text-left"
        onClick={() => setOpen(v => !v)}
      >
        {label}
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-lg border border-border-subtle bg-bg-surface shadow-sm p-2">
          <div className="px-1 pb-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search…" />
          </div>

          <div className="max-h-56 overflow-auto">
            {loading ? (
              <div className="px-2 py-6 text-sm text-text-secondary">Loading…</div>
            ) : options.length === 0 ? (
              <div className="px-2 py-6 text-sm text-text-secondary">No matches</div>
            ) : (
              options.map((o) => (
                <label key={o.value} className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-bg-surface2 rounded-md">
                  <input type="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} />
                  <span className="text-text-primary">{o.label}</span>
                </label>
              ))
            )}
          </div>

          <div className="mt-2 flex justify-end gap-2 px-1 pb-1">
            <Button variant="ghost" onClick={() => onChange([])}>Clear</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </div>
      )}
    </div>
  );
}



