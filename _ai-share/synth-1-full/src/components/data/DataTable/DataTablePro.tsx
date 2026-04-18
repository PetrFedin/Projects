'use client';

import * as React from 'react';
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
} from '@tanstack/react-table';
import {
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  MoreHorizontal,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterChips } from './FilterChips';

export function DataTablePro<T>({
  columns,
  data,
  searchPlaceholder = 'Поиск...',
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
    return columnFilters.map((f) => ({
      key: f.id,
      label: (columns.find((c) => (c as any).accessorKey === f.id)?.header as string) || f.id,
      value: f.value as string,
    }));
  }, [columnFilters, columns]);

  return (
    <div className="w-full space-y-2">
      {/* Search and Advanced Controls */}
      <div className="border-border-subtle flex items-center justify-between border-b py-2">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative">
            <Search className="text-text-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(columns[0].id || '')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn(columns[0].id || '')?.setFilterValue(event.target.value)
              }
              className="bg-bg-surface2 h-8 w-[250px] border-none pl-8 text-[11px]"
            />
          </div>
          <FilterChips
            filters={activeFilters}
            onRemove={(key) => table.getColumn(key)?.setFilterValue('')}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-border-subtle text-text-secondary h-8 gap-2 font-bold"
          >
            <Download className="h-3 w-3" /> Экспорт
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border-subtle text-text-secondary h-8 gap-2 font-bold"
          >
            <SlidersHorizontal className="h-3 w-3" /> Колонки
          </Button>
        </div>
      </div>

      {/* Main Table Container with Horizontal Scroll */}
      <div className="border-border-subtle overflow-x-auto border bg-white">
        <table className="w-full border-collapse text-left text-[11px] font-medium uppercase tracking-wider">
          <thead className="bg-bg-surface2 border-border-subtle text-text-muted border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => (
                  <th
                    key={header.id}
                    className={cn(
                      'h-9 whitespace-nowrap px-4 font-black',
                      idx === 0 &&
                        stickyFirstColumn &&
                        'bg-bg-surface2 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-border-subtle divide-y">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    'hover:bg-bg-surface2/80 group h-12 cursor-pointer transition-colors',
                    row.getIsSelected() && 'bg-bg-surface2'
                  )}
                >
                  {row.getVisibleCells().map((cell, idx) => (
                    <td
                      key={cell.id}
                      className={cn(
                        'whitespace-nowrap px-4',
                        idx === 0 &&
                          stickyFirstColumn &&
                          'group-hover:bg-bg-surface2/80 sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-text-muted h-24 text-center font-bold italic"
                >
                  Нет данных для отображения.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      <div className="border-border-subtle flex items-center justify-between border-t px-2 py-4">
        <div className="text-text-muted flex-1 text-[10px] font-black uppercase tracking-[0.2em]">
          {table.getFilteredSelectedRowModel().rows.length} из{' '}
          {table.getFilteredRowModel().rows.length} выбрано
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Строк на стр.
            </p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border-border-default h-7 w-[60px] border bg-white text-[10px] font-bold outline-none"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="text-text-muted flex w-[100px] items-center justify-center text-[10px] font-black uppercase tracking-widest">
            Стр. {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border-subtle h-7 w-7 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border-subtle h-7 w-7 p-0"
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
