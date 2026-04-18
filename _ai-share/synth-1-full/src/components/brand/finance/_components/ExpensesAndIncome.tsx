'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
    {
      id: 'fe1',
      description: 'Продажи B2B (Опт)',
      amount: 15400000,
      type: 'income',
      date: '2026-01-31',
    },
    {
      id: 'fe2',
      description: 'Закупка сырья',
      amount: 4800000,
      type: 'expense',
      date: '2026-01-25',
    },
    {
      id: 'fe3',
      description: 'Зарплата сотрудникам',
      amount: 2860000,
      type: 'expense',
      date: '2026-01-20',
    },
    {
      id: 'fe4',
      description: 'Оплата аренды склада',
      amount: 750000,
      type: 'expense',
      date: '2026-01-01',
    },
    {
      id: 'fe5',
      description: 'Инвестиции (раунд А)',
      amount: 10000000,
      type: 'income',
      date: '2025-12-15',
    },
  ]);

  const [newEntry, setNewEntry] = useState({
    description: '',
    amount: '',
    type: 'expense' as FinancialEntryType,
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddEntry = () => {
    if (newEntry.description && newEntry.amount) {
      setFinancialEntries((prev) => [
        ...prev,
        {
          id: `fe-${Date.now()}`,
          description: newEntry.description,
          amount: parseFloat(newEntry.amount),
          type: newEntry.type,
          date: newEntry.date,
        },
      ]);
      setNewEntry({
        description: '',
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const totalIncome = financialEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = financialEntries
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-3">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">
              Расходы и Доходы
            </CardTitle>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Учет всех финансовых операций
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-end">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Чистый баланс
              </p>
              <p
                className={cn(
                  'text-base font-black tabular-nums',
                  netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {netBalance.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                Всего доходов
              </p>
              <p className="text-sm font-black tabular-nums">
                {totalIncome.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-rose-600">
                Всего расходов
              </p>
              <p className="text-sm font-black tabular-nums">
                {totalExpenses.toLocaleString('ru-RU')} ₽
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                Итоговый баланс
              </p>
              <p
                className={cn(
                  'text-sm font-black tabular-nums',
                  netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                )}
              >
                {netBalance.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Новая операция
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Описание (напр. Зарплата Январь)"
                value={newEntry.description}
                onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                className="h-11 flex-1 rounded-xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
              />
              <Input
                type="number"
                placeholder="Сумма (₽)"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                className="h-11 w-32 rounded-xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
              />
              <Select
                value={newEntry.type}
                onValueChange={(value: FinancialEntryType) =>
                  setNewEntry({ ...newEntry, type: value })
                }
              >
                <SelectTrigger className="h-11 w-[140px] rounded-xl text-[10px] font-black uppercase tracking-widest">
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
                className="h-11 w-36 rounded-xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
              />
              <Button
                onClick={handleAddEntry}
                className="h-11 rounded-xl bg-black px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-xl"
              >
                <Plus className="mr-2 h-3.5 w-3.5" /> Добавить
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              История операций
            </h3>
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="h-12 border-slate-100 hover:bg-transparent">
                  <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Описание
                  </TableHead>
                  <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Дата
                  </TableHead>
                  <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Сумма
                  </TableHead>
                  <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Тип
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialEntries.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="h-12 border-slate-50 transition-colors hover:bg-slate-50/30"
                  >
                    <TableCell className="pl-10">
                      <p className="text-xs font-black uppercase text-slate-900">
                        {entry.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-600">{entry.date}</span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right text-xs font-black',
                        entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      )}
                    >
                      {entry.type === 'expense' && '-'} {entry.amount.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell className="pr-10 text-center">
                      <Badge
                        className={cn(
                          'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                          entry.type === 'income'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        )}
                      >
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
