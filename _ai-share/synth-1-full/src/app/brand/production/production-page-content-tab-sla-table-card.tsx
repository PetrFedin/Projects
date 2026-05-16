'use client';

import { Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SLACountdown } from '@/components/brand/production/ProductionSectionEnhancements';

export function ProductionPageContentTabSlaTableCard({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { filteredSlaSamples, STAGE_LABELS = {} } = px;

  return (
    <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase">Сроки по этапам сэмплов</CardTitle>
            <CardDescription className="text-[10px]">
              Просрочки дедлайнов Proto, PP, Size Set — алерты и напоминания
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[9px]">SKU</TableHead>
              <TableHead className="text-[9px]">Этап</TableHead>
              <TableHead className="text-[9px]">Дедлайн</TableHead>
              <TableHead className="text-[9px]">Просрочка</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(filteredSlaSamples || []).map((s: any) => (
              <TableRow key={s.skuId}>
                <TableCell className="text-[10px]">{s.skuName}</TableCell>
                <TableCell className="text-[10px]">
                  {STAGE_LABELS[s.stage] || s.stageLabel}
                </TableCell>
                <TableCell className="text-[10px]">
                  <SLACountdown dueDate={s.dueDate} overdue={s.slaOverdue} />
                </TableCell>
                <TableCell>
                  {s.slaOverdue ? (
                    <Badge variant="destructive" className="text-[8px]">
                      Просрочено
                    </Badge>
                  ) : (
                    <span className="text-text-secondary text-[10px]">В срок</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
