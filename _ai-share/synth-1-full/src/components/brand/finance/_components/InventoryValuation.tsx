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
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';

export function InventoryValuation() {
  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-xl">
        <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-3">
          <div>
            <CardTitle className="text-text-primary text-base font-black uppercase tracking-tight">
              Stock Asset Control
            </CardTitle>
            <p className="text-text-muted mt-2 text-[10px] font-bold uppercase tracking-widest">
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
            <Button className="bg-accent-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
              Оценить ликвидность
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-bg-surface2/80">
              <TableRow className="border-border-subtle h-12 hover:bg-transparent">
                <TableHead className="text-text-muted pl-10 text-[9px] font-black uppercase tracking-widest">
                  Категория актива
                </TableHead>
                <TableHead className="text-text-muted text-center text-[9px] font-black uppercase tracking-widest">
                  Единиц
                </TableHead>
                <TableHead className="text-text-muted text-right text-[9px] font-black uppercase tracking-widest">
                  Оценочная стоимость
                </TableHead>
                <TableHead className="text-text-muted text-center text-[9px] font-black uppercase tracking-widest">
                  Ликвидность
                </TableHead>
                <TableHead className="text-text-muted pr-10 text-center text-[9px] font-black uppercase tracking-widest">
                  Залог / Обеспечение
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryStats.map((stat, i) => (
                <TableRow
                  key={i}
                  className="border-border-subtle hover:bg-bg-surface2/30 h-12 transition-colors"
                >
                  <TableCell className="pl-10">
                    <p className="text-text-primary text-xs font-black uppercase">
                      {stat.category}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-text-secondary text-xs font-bold">{stat.items}</span>
                  </TableCell>
                  <TableCell className="text-text-primary text-right text-xs font-black">
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
                            : 'bg-text-muted text-white'
                      )}
                    >
                      {stat.liquidity}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-10 text-center">
                    {stat.collateral ? (
                      <div className="text-accent-primary flex items-center justify-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[8px] font-black uppercase">Доступно</span>
                      </div>
                    ) : (
                      <span className="text-text-muted text-[8px] font-black uppercase">
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
        <Card className="bg-text-primary rounded-xl border-none p-4 text-white shadow-xl">
          <h4 className="text-accent-primary mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
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
                className="hover:bg-accent-primary/10 h-8 rounded-xl bg-white px-4 text-[8px] font-black uppercase tracking-widest text-black"
              >
                Получить предложение
              </Button>
            </div>
            <Separator className="bg-white/5" />
            <p className="text-[10px] font-medium leading-relaxed text-white/40">
              *Расчет произведен на основе <AcronymWithTooltip abbr="LTV" /> 50% от оценочной
              стоимости категории "Готовая продукция" с учетом коэффициента ликвидности.
            </p>
          </div>
        </Card>
        <Card className="border-border-subtle rounded-xl bg-white p-4 shadow-sm">
          <h4 className="text-text-muted mb-6 text-[10px] font-black uppercase tracking-[0.2em]">
            Оборачиваемость запасов
          </h4>
          <div className="flex items-center gap-3">
            <div className="border-accent-primary border-t-border-subtle flex h-24 w-24 items-center justify-center rounded-full border-8">
              <span className="text-base font-black">42</span>
            </div>
            <div className="space-y-2">
              <p className="text-text-primary text-xs font-black uppercase">дня — средний цикл</p>
              <p className="text-text-muted text-[9px] font-medium leading-relaxed">
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
