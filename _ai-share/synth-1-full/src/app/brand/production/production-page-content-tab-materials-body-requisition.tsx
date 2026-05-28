'use client';

import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ProductionPageContentTabMaterialsBodyRequisition({
  p,
}: {
  p: Record<string, unknown>;
}) {
  const px = p as Record<string, any>;
  const { selectedId, setRequisitions, requisitions } = px;

  return (
    <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-xs font-black uppercase">Заявки на материалы</CardTitle>
        <Button
          size="sm"
          className="text-[9px]"
          onClick={() =>
            setRequisitions?.((prev: any[]) => [
              ...(prev || []),
              {
                id: `R-${Date.now()}`,
                material: 'Новая заявка',
                qty: 0,
                unit: 'м',
                status: 'Draft',
                supplier: '—',
                collection: selectedId || 'General',
              },
            ])
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Добавить
        </Button>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[9px]">ID</TableHead>
            <TableHead className="text-[9px]">Материал</TableHead>
            <TableHead className="text-[9px]">Кол-во</TableHead>
            <TableHead className="text-[9px]">Коллекция</TableHead>
            <TableHead className="text-[9px]">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(requisitions || [])
            .filter((r: any) => !selectedId || r.collection === selectedId)
            .map((r: any, i: number) => (
              <TableRow key={r.id || i}>
                <TableCell className="font-mono text-[10px]">{r.id}</TableCell>
                <TableCell className="text-[10px]">{r.material}</TableCell>
                <TableCell className="text-[10px]">
                  {r.qty} {r.unit}
                </TableCell>
                <TableCell className="text-[10px]">{r.collection}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[8px]">
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}
