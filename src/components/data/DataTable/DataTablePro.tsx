"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  RowSelectionState
} from "@tanstack/react-table";
import { Card } from "../../ui/Card";
import { cn } from "../../../lib/cn";
import { DataTableColumnMenu } from "./DataTableColumnMenu";
import { DataTableBulkBar } from "./DataTableBulkBar";
import type { DataTableProps } from "./types";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { DataTablePagination } from "./DataTablePagination";

export function DataTablePro<T>({
  columns,
  query,
  result,
  isLoading,
  onQueryChange,
  rowId,
  bulkActions,
  initialVisibility,
  stickyFirstColumn = true,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (query.sortBy && query.sortDir) return [{ id: query.sortBy, desc: query.sortDir === "desc" }];
    return [];
  });

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialVisibility ?? {});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const selectionCol = React.useMemo(
    () => ({
      id: "__select__",
      header: ({ table }: any) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 44
    }),
    []
  );

  const finalColumns = React.useMemo(() => [selectionCol as any, ...columns], [selectionCol, columns]);

  const table = useReactTable({
    data: result.rows,
    columns: finalColumns,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);

      const s = next[0];
      onQueryChange(
        {
          page: 1,
          sortBy: s?.id ?? "",
          sortDir: s ? (s.desc ? "desc" : "asc") : ""
        },
        { replace: true }
      );
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(1, Math.ceil(result.total / query.pageSize)),
    getRowId: (original) => rowId(original),
    enableRowSelection: true
  });

  const selectedIds = React.useMemo(
    () => table.getSelectedRowModel().rows.map((r) => r.id),
    [table]
  );

  const pageCount = Math.max(1, Math.ceil(result.total / query.pageSize));

  return (
    <div className="space-y-3">
      {bulkActions && (
        <DataTableBulkBar
          count={selectedIds.length}
          actions={bulkActions.map((a) => ({
            label: a.label,
            tone: a.tone,
            onClick: () => a.onClick(selectedIds)
          }))}
          onClear={() => setRowSelection({})}
        />
      )}

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border-subtle bg-bg-surface flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-[320px] max-w-full">
                <Input
                  value={query.q ?? ""}
                  onChange={(e) => onQueryChange({ q: e.target.value, page: 1 }, { replace: true })}
                  placeholder="Search…"
                />
              </div>

              <div className="text-sm text-text-secondary">
                <span className="text-text-primary font-medium tabular-nums">{result.total}</span> results
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DataTableColumnMenu table={table} />
            </div>
          </div>
        </div>

        <div className="max-h-[620px] overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-bg-surface">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header, idx) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();

                    const isSticky = stickyFirstColumn && idx === 0;
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-5 py-3 text-left text-xs uppercase tracking-[0.06em] text-text-muted border-b border-border-subtle",
                          canSort && "cursor-pointer select-none hover:text-text-primary",
                          isSticky && "sticky left-0 z-20 bg-bg-surface"
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        style={{ width: header.getSize() }}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir === "asc" && <span className="text-text-secondary">↑</span>}
                          {sortDir === "desc" && <span className="text-text-secondary">↓</span>}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-5 py-10 text-sm text-text-secondary" colSpan={table.getAllColumns().length}>
                    Loading…
                  </td>
                </tr>
              ) : result.rows.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-sm text-text-secondary" colSpan={table.getAllColumns().length}>
                    No results. Try changing filters.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-border-subtle hover:bg-bg-surface2 transition duration-fast ease-standard",
                      row.getIsSelected() && "bg-[rgba(31,122,90,0.06)]"
                    )}
                  >
                    {row.getVisibleCells().map((cell, idx) => {
                      const isSticky = stickyFirstColumn && idx === 0;
                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            "px-5 py-3 text-sm text-text-primary",
                            isSticky && "sticky left-0 z-10 bg-inherit"
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <DataTablePagination table={table} />
      </Card>
    </div>
  );
}



