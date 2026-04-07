"use client";

import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { payrollData } from "../_fixtures/finance-data";

export function PayrollManagement() {
  const totalEmployees = payrollData.reduce((sum, item) => sum + item.qty, 0);
  const totalMonthlyFOT = payrollData.reduce((sum, item) => sum + item.total, 0);
  const averageSalary = totalEmployees > 0 ? totalMonthlyFOT / totalEmployees : 0;

  return (
    <Card className="rounded-xl border-slate-100 shadow-xl bg-white overflow-hidden animate-in fade-in duration-700">
      <CardHeader className="p-3 border-b border-slate-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900 leading-none">Штатное расписание и ФОТ</CardTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Автоматический расчет выплат на основе структуры команды</p>
          </div>
          <Button className="bg-indigo-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6 gap-2">
            <Plus className="h-3.5 w-3.5" /> Добавить позицию
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-50">
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Всего сотрудников</p>
            <p className="text-sm font-black text-slate-900">{totalEmployees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Общий ФОТ (мес)</p>
            <p className="text-sm font-black text-slate-900">{totalMonthlyFOT.toLocaleString('ru-RU')} ₽</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Средний оклад</p>
            <p className="text-sm font-black text-slate-900">{averageSalary.toLocaleString('ru-RU')} ₽</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent h-12">
              <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Должность</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Кол-во</TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Оклад (ед)</TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Бонус / KPI</TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Итого ФОТ</TableHead>
              <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((item) => (
              <TableRow key={item.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors h-12">
                <TableCell className="pl-10">
                  <p className="text-xs font-black uppercase text-slate-900">{item.role}</p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="text-[10px] font-black border-slate-200">{item.qty}</Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-xs text-slate-600">{item.salary.toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell className="text-right font-bold text-xs text-indigo-600">+{item.bonus.toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell className="text-right font-black text-xs text-slate-900">{item.total.toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell className="pr-10 text-center">
                  <Badge className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                    item.status === 'paid' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  )}>
                    {item.status === 'paid' ? 'Выплачено' : 'В обработке'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-900 text-white hover:bg-slate-900 border-none">
              <TableCell className="pl-10 py-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Итоговый ФОТ за месяц</p>
              </TableCell>
              <TableCell className="text-center font-black">{totalEmployees}</TableCell>
              <TableCell colSpan={2}></TableCell>
              <TableCell className="text-right font-black text-sm tracking-tighter">{totalMonthlyFOT.toLocaleString('ru-RU')} ₽</TableCell>
              <TableCell className="pr-10 text-center">
                <Badge className="bg-white/10 text-white border-none text-[8px] font-black uppercase">Sync OK</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
