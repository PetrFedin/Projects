"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FinancialEntryType = 'income' | 'expense';
interface FinancialEntry {
  id: string;
  description: string;
  amount: number;
  type: FinancialEntryType;
  date: string;
}

export function ExpensesAndIncome() {
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([
    { id: 'fe1', description: 'Продажи B2B (Опт)', amount: 15400000, type: 'income', date: '2026-01-31' },
    { id: 'fe2', description: 'Закупка сырья', amount: 4800000, type: 'expense', date: '2026-01-25' },
    { id: 'fe3', description: 'Зарплата сотрудникам', amount: 2860000, type: 'expense', date: '2026-01-20' },
    { id: 'fe4', description: 'Оплата аренды склада', amount: 750000, type: 'expense', date: '2026-01-01' },
    { id: 'fe5', description: 'Инвестиции (раунд А)', amount: 10000000, type: 'income', date: '2025-12-15' },
  ]);

  const [newEntry, setNewEntry] = useState({
    description: '',
    amount: '',
    type: 'expense' as FinancialEntryType,
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddEntry = () => {
    if (newEntry.description && newEntry.amount) {
      setFinancialEntries(prev => [...prev, {
        id: `fe-${Date.now()}`,
        description: newEntry.description,
        amount: parseFloat(newEntry.amount),
        type: newEntry.type,
        date: newEntry.date,
      }]);
      setNewEntry({ description: '', amount: '', type: 'expense', date: new Date().toISOString().split('T')[0] });
    }
  };

  const totalIncome = financialEntries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = financialEntries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <Card className="rounded-xl border-slate-100 shadow-xl bg-white overflow-hidden">
        <CardHeader className="p-3 border-b border-slate-50 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">Расходы и Доходы</CardTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Учет всех финансовых операций</p>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Чистый баланс</p>
              <p className={cn("text-base font-black tabular-nums", netBalance >= 0 ? "text-emerald-600" : "text-rose-600")}>
                {netBalance.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
              <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">Всего доходов</p>
              <p className="text-sm font-black tabular-nums">{totalIncome.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 space-y-2">
              <p className="text-[9px] font-black uppercase text-rose-600 tracking-widest">Всего расходов</p>
              <p className="text-sm font-black tabular-nums">{totalExpenses.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
              <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">Итоговый баланс</p>
              <p className={cn("text-sm font-black tabular-nums", netBalance >= 0 ? "text-emerald-600" : "text-rose-600")}>
                {netBalance.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Новая операция</h3>
            <div className="flex gap-3">
              <Input 
                placeholder="Описание (напр. Зарплата Январь)" 
                value={newEntry.description} 
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                className="flex-1 rounded-xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20"
              />
              <Input 
                type="number" 
                placeholder="Сумма (₽)" 
                value={newEntry.amount} 
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                className="w-32 rounded-xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20"
              />
              <Select value={newEntry.type} onValueChange={(value: FinancialEntryType) => setNewEntry({ ...newEntry, type: value })}>
                <SelectTrigger className="w-[140px] rounded-xl font-black uppercase text-[10px] tracking-widest h-11">
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="income">Доход</SelectItem>
                  <SelectItem value="expense">Расход</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="date" 
                value={newEntry.date} 
                onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                className="w-36 rounded-xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20"
              />
              <Button onClick={handleAddEntry} className="bg-black text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-11 px-6 shadow-xl">
                <Plus className="h-3.5 w-3.5 mr-2" /> Добавить
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">История операций</h3>
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent h-12">
                  <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Описание</TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Дата</TableHead>
                  <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Сумма</TableHead>
                  <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Тип</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialEntries.map((entry) => (
                  <TableRow key={entry.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors h-12">
                    <TableCell className="pl-10">
                      <p className="text-xs font-black uppercase text-slate-900">{entry.description}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-600">{entry.date}</span>
                    </TableCell>
                    <TableCell className={cn("text-right font-black text-xs", entry.type === 'income' ? "text-emerald-600" : "text-rose-600")}>
                      {entry.type === 'expense' && '-'} {entry.amount.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell className="pr-10 text-center">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                        entry.type === 'income' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      )}>
                        {entry.type === 'income' ? 'Доход' : 'Расход'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
