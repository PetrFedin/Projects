'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { loyaltyTableData, plans } from '@/lib/loyalty-data';
import { Info, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function LoyaltyProgramDetails() {
  const calculateBenefit = (cashbackPercent: number) => {
    if (cashbackPercent === 0) return '—';
    const assumedYearlySpend = 180000;
    const cashbackValue = assumedYearlySpend * (cashbackPercent / 100);
    return `${cashbackValue.toLocaleString('ru-RU')} ₽`;
  };

  const benefits = {
    base: calculateBenefit(0),
    start: calculateBenefit(3),
    comfort: calculateBenefit(7),
    premium: calculateBenefit(10),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Подробности программы лояльности</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] font-semibold">Параметр</TableHead>
                  <TableHead className="min-w-[150px] text-center">{plans[0].name}</TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    <div className="flex flex-col items-center">
                      {plans[1].name}
                      {plans[1].badgeText && (
                        <Badge variant={'secondary'} className="mt-1">
                          {plans[1].badgeText}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    <div className="flex flex-col items-center">
                      {plans[2].name}
                      {plans[2].badgeText && (
                        <Badge variant={'default'} className="mt-1">
                          {plans[2].badgeText}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[150px] text-center">
                    <div className="flex flex-col items-center">
                      {plans[3].name}
                      {plans[3].badgeText && (
                        <Badge variant="secondary" className="mt-1">
                          {plans[3].badgeText}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loyaltyTableData.map((row) => (
                  <TableRow key={row.parameter}>
                    <TableCell className="flex items-center gap-1.5 font-medium">
                      {row.parameter}
                      {row.tooltip && (
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-left" side="top">
                            <p className="whitespace-pre-wrap font-normal">{row.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {row.base === '✔' ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        row.base
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.start === '✔' ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        row.start
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-center font-semibold',
                        plans[2].buttonVariant === 'default' && 'bg-primary/5'
                      )}
                    >
                      {row.comfort === '✔' ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        row.comfort
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.premium === '✔' ? (
                        <Check className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        row.premium
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-secondary/50 hover:bg-secondary/70">
                  <TableCell className="text-sm font-bold">Кэшбэк за год</TableCell>
                  <TableCell className="text-center text-sm font-bold text-muted-foreground">
                    {benefits.base}
                  </TableCell>
                  <TableCell className="text-center text-sm font-bold text-green-600">
                    {benefits.start}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-center text-sm font-bold text-green-600',
                      plans[2].buttonVariant === 'default' && 'bg-primary/5'
                    )}
                  >
                    {benefits.comfort}
                  </TableCell>
                  <TableCell className="text-center text-sm font-bold text-green-600">
                    {benefits.premium}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </TooltipProvider>
        <CardDescription className="mt-4 text-xs">
          *Оплата бонусами 10% на тарифе "Базовый" доступна после первой покупки на сумму от 5000 ₽.
          Выгода рассчитана при условных тратах 15 000 ₽/мес или 180 000 ₽/год. Квалификационные
          баллы (за покупки) не сгорают. Неквалификационные (за активность) сгорают.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
