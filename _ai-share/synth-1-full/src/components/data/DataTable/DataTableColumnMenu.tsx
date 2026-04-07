"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "../../ui/button";

export function DataTableColumnMenu<T>({ table }: { table: Table<T> }) {
  const [open, setOpen] = React.useState(false);

  const cols = table
    .getAllLeafColumns()
    .filter((c) => c.getCanHide())
    .map((c) => ({ id: c.id, label: String(c.columnDef.header ?? c.id), visible: c.getIsVisible() }));

  return (
    <div className="relative">
      <Button variant="secondary" onClick={() => setOpen((v) => !v)}>
        Columns
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border-subtle bg-bg-surface shadow-sm p-2 z-20">
          <div className="px-2 py-2 text-xs uppercase tracking-[0.06em] text-text-muted">Visibility</div>
          <div className="max-h-64 overflow-auto">
            {cols.map((c) => (
              <label key={c.id} className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-bg-surface2 rounded-md">
                <input
                  type="checkbox"
                  checked={c.visible}
                  onChange={(e) => table.getColumn(c.id)?.toggleVisibility(e.target.checked)}
                />
                <span className="text-text-primary">{c.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-2 flex justify-end gap-2 px-2 pb-2">
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnVisibility();
                setOpen(false);
              }}
            >
              Reset
            </Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

