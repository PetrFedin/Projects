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

type MaterialRollRow = {
  name?: string;
  roll?: string;
  length?: string;
  status?: string;
};

export function ProductionPageContentTabMaterialsBodyRollsFabricCard({
  filteredMaterials,
  onAddMaterial,
}: {
  filteredMaterials: MaterialRollRow[];
  onAddMaterial?: () => void;
}) {
  return (
    <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-xs font-black uppercase">Рулоны ткани</CardTitle>
        <Button size="sm" className="text-[9px]" onClick={() => onAddMaterial?.()}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Добавить
        </Button>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[9px]">Наименование</TableHead>
            <TableHead className="text-[9px]">Рулон</TableHead>
            <TableHead className="text-[9px]">Длина</TableHead>
            <TableHead className="text-[9px]">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMaterials.map((m, i) => (
            <TableRow key={i}>
              <TableCell className="text-[10px]">{m.name}</TableCell>
              <TableCell className="font-mono text-[10px]">{m.roll}</TableCell>
              <TableCell className="text-[10px]">{m.length}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[8px]">
                  {m.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
