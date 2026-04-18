'use client';

import { Package, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { inventoryStats } from '../_fixtures/finance-data';

export function InventoryValuation() {
  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-3">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">
              Stock Asset Control
            </CardTitle>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Учет товарных остатков как финансового обеспечения
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest"
            >
              Сверка стока
            </Button>
            <Button className="h-10 rounded-xl bg-indigo-600 px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
              Оценить ликвидность
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="h-12 border-slate-100 hover:bg-transparent">
                <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Категория актива
                </TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Единиц
                </TableHead>
                <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Оценочная стоимость
                </TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Ликвидность
                </TableHead>
                <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Залог / Обеспечение
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryStats.map((stat, i) => (
                <TableRow
                  key={i}
                  className="h-12 border-slate-50 transition-colors hover:bg-slate-50/30"
                >
                  <TableCell className="pl-10">
                    <p className="text-xs font-black uppercase text-slate-900">{stat.category}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs font-bold text-slate-600">{stat.items}</span>
                  </TableCell>
                  <TableCell className="text-right text-xs font-black text-slate-900">
                    {stat.value.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        stat.liquidity === 'high'
                          ? 'bg-emerald-500 text-white'
                          : stat.liquidity === 'medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-400 text-white'
                      )}
                    >
                      {stat.liquidity}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-10 text-center">
                    {stat.collateral ? (
                      <div className="flex items-center justify-center gap-2 text-indigo-600">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[8px] font-black uppercase">Доступно</span>
                      </div>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-slate-300">
                        Недоступно
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
          <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
            Финансовый потенциал стока
          </h4>
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase text-white/40">
                  Кредитный лимит под залог товара
                </p>
                <p className="text-sm font-black tabular-nums">9,250,000 ₽</p>
              </div>
              <Button
                size="sm"
                className="h-8 rounded-xl bg-white px-4 text-[8px] font-black uppercase tracking-widest text-black hover:bg-indigo-50"
              >
                Получить предложение
              </Button>
            </div>
            <Separator className="bg-white/5" />
            <p className="text-[10px] font-medium leading-relaxed text-white/40">
              *Расчет произведен на основе LTV 50% от оценочной стоимости категории "Готовая
              продукция" с учетом коэффициента ликвидности.
            </p>
          </div>
        </Card>
        <Card className="rounded-xl border-slate-100 bg-white p-4 shadow-sm">
          <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Оборачиваемость запасов
          </h4>
          <div className="flex items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-indigo-600 border-t-slate-100">
              <span className="text-base font-black">42</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-slate-900">дня — средний цикл</p>
              <p className="text-[9px] font-medium leading-relaxed text-slate-400">
                Ваш текущий цикл оборачиваемости на 12% быстрее среднего по рынку в категории
                Contemporary.
              </p>
              <div className="flex items-center text-[9px] font-black text-emerald-600">
                <Package className="mr-1 h-3 w-3" /> Оптимально
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
