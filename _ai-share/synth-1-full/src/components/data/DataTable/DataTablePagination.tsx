import React from 'react';
import { Table } from '@tanstack/react-table';
import { Button } from '../../ui/button';

export function DataTablePagination<T>({ table }: { table: Table<T> }) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <div className="border-border-subtle flex items-center justify-between gap-3 border-t px-5 py-3">
      <div className="text-text-secondary text-sm">
        Page <span className="text-text-primary">{pageIndex + 1}</span> of{' '}
        <span className="text-text-primary">{pageCount}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
