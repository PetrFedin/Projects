import type { ColumnDef, VisibilityState, RowSelectionState } from "@tanstack/react-table";

export type DataTableColumn<T> = ColumnDef<T, any>;

export type SortDir = "asc" | "desc" | "";

export type ServerQuery = {
  q?: string;
  page: number;      // 1-based in URL
  pageSize: number;
  sortBy?: string;
  sortDir?: SortDir;
  [key: string]: any;
};

export type ServerResult<T> = {
  rows: T[];
  total: number;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  query: ServerQuery;
  result: ServerResult<T>;
  isLoading?: boolean;
  onQueryChange: (patch: Partial<ServerQuery>, opts?: { replace?: boolean }) => void;
  rowId: (row: T) => string;
  bulkActions?: Array<{
    label: string;
    onClick: (ids: string[]) => void;
    tone?: "primary" | "secondary" | "danger";
  }>;
  initialVisibility?: VisibilityState;
  stickyFirstColumn?: boolean;
  filterLabels?: Record<string, string>;
};

