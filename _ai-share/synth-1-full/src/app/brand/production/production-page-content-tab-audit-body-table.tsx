'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AuditRowWithDetail } from '@/components/brand/production/ProductionSectionEnhancements';

function auditDetailString(a: {
  detail?: unknown;
  payload?: unknown;
  comment?: unknown;
}): string | undefined {
  const v = a.detail ?? a.payload ?? a.comment;
  if (v == null) return undefined;
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function ProductionPageContentTabAuditBodyTable({
  rows,
}: {
  rows: Array<{
    id: string;
    actionLabel?: string;
    entity?: string;
    user?: string;
    time?: string;
    detail?: unknown;
    payload?: unknown;
    comment?: unknown;
  }>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-[9px]">Действие</TableHead>
          <TableHead className="text-[9px]">Сущность</TableHead>
          <TableHead className="text-[9px]">Пользователь</TableHead>
          <TableHead className="text-[9px]">Время</TableHead>
          <TableHead className="w-12 text-[9px]">Детали</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((a) => (
          <AuditRowWithDetail
            key={a.id}
            actionLabel={a.actionLabel ?? ''}
            entity={a.entity ?? ''}
            user={a.user ?? ''}
            time={a.time ?? ''}
            detail={auditDetailString(a)}
          />
        ))}
      </TableBody>
    </Table>
  );
}
