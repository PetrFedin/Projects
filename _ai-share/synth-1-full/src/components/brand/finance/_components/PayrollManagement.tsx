'use client';

import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { payrollData } from '../_fixtures/finance-data';

export function PayrollManagement() {
  const totalEmployees = payrollData.reduce((sum, item) => sum + item.qty, 0);
  const totalMonthlyFOT = payrollData.reduce((sum, item) => sum + item.total, 0);
  const averageSalary = totalEmployees > 0 ? totalMonthlyFOT / totalEmployees : 0;

  return (
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-xl duration-700 animate-in fade-in">
      <CardHeader className="border-b border-slate-50 p-3">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-black uppercase leading-none tracking-tight text-slate-900">
              Штатное расписание и ФОТ
            </CardTitle>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Автоматический расчет выплат на основе структуры команды
            </p>
          </div>
          <Button className="h-10 gap-2 rounded-xl bg-indigo-600 px-6 text-[9px] font-black uppercase tracking-widest text-white">
=======
    <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-xl duration-700 animate-in fade-in">
      <CardHeader className="border-border-subtle border-b p-3">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <CardTitle className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
              Штатное расписание и ФОТ
            </CardTitle>
            <p className="text-text-muted mt-2 text-[10px] font-bold uppercase tracking-widest">
              Автоматический расчет выплат на основе структуры команды
            </p>
          </div>
          <Button className="bg-accent-primary h-10 gap-2 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
            <Plus className="h-3.5 w-3.5" /> Добавить позицию
          </Button>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Всего сотрудников
            </p>
            <p className="text-sm font-black text-slate-900">{totalEmployees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Общий ФОТ (мес)
            </p>
            <p className="text-sm font-black text-slate-900">
=======
        <div className="border-border-subtle grid grid-cols-3 gap-3 border-t pt-4">
          <div className="space-y-1">
            <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
              Всего сотрудников
            </p>
            <p className="text-text-primary text-sm font-black">{totalEmployees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
              Общий ФОТ (мес)
            </p>
            <p className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
              {totalMonthlyFOT.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="space-y-1">
<<<<<<< HEAD
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Средний оклад
            </p>
            <p className="text-sm font-black text-slate-900">
=======
            <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
              Средний оклад
            </p>
            <p className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
              {averageSalary.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
<<<<<<< HEAD
          <TableHeader className="bg-slate-50/50">
            <TableRow className="h-12 border-slate-100 hover:bg-transparent">
              <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Должность
              </TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                Кол-во
              </TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                Оклад (ед)
              </TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                Бонус / KPI
              </TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                Итого ФОТ
              </TableHead>
              <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
          <TableHeader className="bg-bg-surface2/80">
            <TableRow className="border-border-subtle h-12 hover:bg-transparent">
              <TableHead className="text-text-muted pl-10 text-[9px] font-black uppercase tracking-widest">
                Должность
              </TableHead>
              <TableHead className="text-text-muted text-center text-[9px] font-black uppercase tracking-widest">
                Кол-во
              </TableHead>
              <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                Оклад (ед)
              </TableHead>
              <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                Бонус / KPI
              </TableHead>
              <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                Итого ФОТ
              </TableHead>
              <TableHead className="text-text-muted pr-10 text-center text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Статус
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((item) => (
              <TableRow
                key={item.id}
<<<<<<< HEAD
                className="h-12 border-slate-50 transition-colors hover:bg-slate-50/30"
=======
                className="border-border-subtle hover:bg-bg-surface2/30 h-12 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <TableCell className="pl-10">
                  <p className="text-text-primary text-xs font-black uppercase">{item.role}</p>
                </TableCell>
                <TableCell className="text-center">
<<<<<<< HEAD
                  <Badge variant="outline" className="border-slate-200 text-[10px] font-black">
                    {item.qty}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs font-bold text-slate-600">
                  {item.salary.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell className="text-right text-xs font-bold text-indigo-600">
                  +{item.bonus.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell className="text-right text-xs font-black text-slate-900">
=======
                  <Badge variant="outline" className="border-border-default text-[10px] font-black">
                    {item.qty}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-right text-xs font-bold">
                  {item.salary.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell className="text-accent-primary text-right text-xs font-bold">
                  +{item.bonus.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell className="text-text-primary text-right text-xs font-black">
>>>>>>> recover/cabinet-wip-from-stash
                  {item.total.toLocaleString('ru-RU')} ₽
                </TableCell>
                <TableCell className="pr-10 text-center">
                  <Badge
                    className={cn(
                      'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                      item.status === 'paid'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    )}
                  >
                    {item.status === 'paid' ? 'Выплачено' : 'В обработке'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
<<<<<<< HEAD
            <TableRow className="border-none bg-slate-900 text-white hover:bg-slate-900">
=======
            <TableRow className="bg-text-primary hover:bg-text-primary/90 border-none text-white">
>>>>>>> recover/cabinet-wip-from-stash
              <TableCell className="py-6 pl-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Итоговый ФОТ за месяц
                </p>
              </TableCell>
              <TableCell className="text-center font-black">{totalEmployees}</TableCell>
              <TableCell colSpan={2}></TableCell>
              <TableCell className="text-right text-sm font-black tracking-tighter">
                {totalMonthlyFOT.toLocaleString('ru-RU')} ₽
              </TableCell>
              <TableCell className="pr-10 text-center">
                <Badge className="border-none bg-white/10 text-[8px] font-black uppercase text-white">
                  Sync OK
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
