'use client';

import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Truck, Factory, Building2 } from 'lucide-react';
import { interPartnerInvoices } from '../_fixtures/finance-data';

export function InterPartnerInvoices() {
  return (
    <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-xl duration-700 animate-in fade-in">
      <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-3">
        <div>
          <CardTitle className="text-text-primary text-base font-black uppercase tracking-tight">
            Сквозные счета (Inter-Partner Invoicing)
          </CardTitle>
          <p className="text-text-muted mt-2 text-[10px] font-bold uppercase tracking-widest">
            Учет взаиморасчетов между партнерами внутри платформы
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest"
          >
            Сверка с банком
          </Button>
          <Button className="bg-accent-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white">
            Выставить счет
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-bg-surface2/80">
            <TableRow className="border-border-subtle h-12 hover:bg-transparent">
              <TableHead className="text-text-muted pl-10 text-[9px] font-black uppercase tracking-widest">
                ID Счета
              </TableHead>
              <TableHead className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Контрагент
              </TableHead>
              <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                Сумма
              </TableHead>
              <TableHead className="text-text-muted text-center text-[9px] font-black uppercase tracking-widest">
                Тип
              </TableHead>
              <TableHead className="text-text-muted pr-10 text-center text-[9px] font-black uppercase tracking-widest">
                Статус
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interPartnerInvoices.map((inv) => (
              <TableRow
                key={inv.id}
                className="border-border-subtle hover:bg-bg-surface2/30 h-12 transition-colors"
              >
                <TableCell className="text-text-muted pl-10 font-mono text-[10px] font-black">
                  {inv.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="bg-bg-surface2 text-text-muted flex h-8 w-8 items-center justify-center rounded-lg">
                      {inv.partner.includes('Production') ? (
                        <Factory className="h-4 w-4" />
                      ) : inv.partner.includes('Logistics') ? (
                        <Truck className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-text-primary text-xs font-black uppercase">
                        {inv.partner}
                      </p>
                      <p className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
                        Дата: {inv.date}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text-primary text-right text-xs font-black">
                  {inv.amount.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-none text-[8px] font-black uppercase',
                      inv.type === 'receivable'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-bg-surface2 text-text-secondary'
                    )}
                  >
                    {inv.type === 'receivable' ? 'Входящий' : 'Исходящий'}
                  </Badge>
                </TableCell>
                <TableCell className="pr-10 text-center">
                  <Badge
                    className={cn(
                      'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                      inv.status === 'paid'
                        ? 'bg-emerald-500 text-white'
                        : inv.status === 'pending'
                          ? 'bg-amber-500 text-white'
                          : 'animate-pulse bg-rose-500 text-white shadow-lg shadow-rose-100'
                    )}
                  >
                    {inv.status === 'paid'
                      ? 'Оплачен'
                      : inv.status === 'pending'
                        ? 'Ожидает'
                        : 'Просрочен'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
