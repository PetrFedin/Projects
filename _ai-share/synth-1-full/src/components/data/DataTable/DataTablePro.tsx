"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { 
  ChevronRight, ChevronLeft, SlidersHorizontal, 
  Download, Filter, Search, ArrowUpDown, 
  MoreHorizontal, Check, X, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterChips } from "./FilterChips";

export function DataTablePro<T>({
  columns,
  data,
  searchPlaceholder = "Поиск...",
  onRowClick,
  stickyFirstColumn = true,
}: {
  columns: ColumnDef<T, any>[];
  data: T[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  stickyFirstColumn?: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const activeFilters = React.useMemo(() => {
    return columnFilters.map(f => ({
      key: f.id,
      label: columns.find(c => (c as any).accessorKey === f.id)?.header as string || f.id,
      value: f.value as string
    }));
  }, [columnFilters, columns]);

  return (
    <div className="w-full space-y-2">
      {/* Search and Advanced Controls */}
      <div className="flex items-center justify-between py-2 border-b border-zinc-100">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(columns[0].id || "")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(columns[0].id || "")?.setFilterValue(event.target.value)
              }
              className="h-8 w-[250px] pl-8 bg-zinc-50 border-none text-[11px]"
            />
          </div>
          <FilterChips 
            filters={activeFilters} 
            onRemove={(key) => table.getColumn(key)?.setFilterValue("")} 
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 gap-2 border-zinc-100 font-bold text-zinc-500">
            <Download className="h-3 w-3" /> Экспорт
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-2 border-zinc-100 font-bold text-zinc-500">
            <SlidersHorizontal className="h-3 w-3" /> Колонки
          </Button>
        </div>
      </div>

      {/* Main Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto border border-zinc-100 bg-white">
        <table className="w-full text-left text-[11px] font-medium uppercase tracking-wider border-collapse">
          <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th 
                    key={header.id} 
                    className={cn(
                      "h-9 px-4 font-black whitespace-nowrap",
                      idx === 0 && stickyFirstColumn && "sticky left-0 bg-zinc-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "group h-12 hover:bg-zinc-50/50 cursor-pointer transition-colors",
                    row.getIsSelected() && "bg-zinc-50"
                  )}
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <td 
                      key={cell.id} 
                      className={cn(
                        "px-4 whitespace-nowrap",
                        idx === 0 && stickyFirstColumn && "sticky left-0 bg-white group-hover:bg-zinc-50/50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-zinc-400 font-bold italic">
                  Нет данных для отображения.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between px-2 py-4 border-t border-zinc-100">
        <div className="flex-1 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
          {table.getFilteredSelectedRowModel().rows.length} из{" "}
          {table.getFilteredRowModel().rows.length} выбрано
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Строк на стр.</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-7 w-[60px] border border-zinc-200 bg-white text-[10px] font-bold outline-none"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-[10px] font-black uppercase text-zinc-400 tracking-widest">
            Стр. {table.getState().pagination.pageIndex + 1} из{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="xs"
              className="h-7 w-7 p-0 border-zinc-100"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="h-7 w-7 p-0 border-zinc-100"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
