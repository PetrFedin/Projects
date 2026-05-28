'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ProductionPageContentTabDocumentsTable({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { docFilter, productionDocuments, selectedId, docStatusFilter } = px;

  const rows = (productionDocuments || []).filter(
    (d: any) =>
      (!docFilter || docFilter === 'all' || d.type === docFilter) &&
      (!selectedId || d.collection === selectedId) &&
      (!docStatusFilter || docStatusFilter === 'all' || d.status === docStatusFilter)
  );

  return (
    <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[9px]">Тип</TableHead>
            <TableHead className="text-[9px]">Наименование</TableHead>
            <TableHead className="text-[9px]">Коллекция</TableHead>
            <TableHead className="text-[9px]">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d: any, i: number) => (
            <TableRow key={d.id ?? i}>
              <TableCell className="text-[10px]">{d.type}</TableCell>
              <TableCell className="text-[10px]">{d.name}</TableCell>
              <TableCell className="text-[10px]">{d.collection}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[8px]">
                  {d.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
