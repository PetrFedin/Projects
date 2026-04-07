"use client";

import React from "react";
import { Button } from "../../ui/button";

export function DataTableBulkBar({
  count,
  actions,
  onClear
}: {
  count: number;
  actions: Array<{ label: string; onClick: () => void; tone?: "primary" | "secondary" | "danger" }>;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-surface px-4 py-3 shadow-sm">
      <div className="text-sm text-text-secondary">
        Selected: <span className="text-text-primary font-medium">{count}</span>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((a) => (
          <Button
            key={a.label}
            variant={a.tone === "primary" ? "primary" : a.tone === "danger" ? "secondary" : "secondary"}
            onClick={a.onClick}
            className={a.tone === "danger" ? "border border-state-error text-state-error hover:bg-[rgba(220,38,38,0.06)]" : ""}
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

