'use client';

import { RegistryPageShell } from '@/components/design-system';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calculator,
  Globe,
  Ship,
  Truck,
  Info,
  AlertCircle,
  FileText,
  Download,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { ShopB2bToolHeader } from '@/components/shop/ShopB2bToolHeader';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function LandedCostPage() {
  const [currency, setCurrency] = useState('EUR');
  const [origin, setOrigin] = useState('Italy');
  const [transport, setTransport] = useState('truck');

  const mockItems = [
    {
      id: 1,
      name: 'Silk Dress "Verona"',
      sku: 'SD-VRN-01',
      fob: 120,
      qty: 50,
      duty: 12,
      shipping: 4.5,
      vat: 20,
    },
    {
      id: 2,
      name: 'Wool Coat "Milan"',
      sku: 'WC-MLN-05',
      fob: 245,
      qty: 30,
      duty: 12,
      shipping: 8.2,
      vat: 20,
    },
    {
      id: 3,
      name: 'Leather Bag "Tuscany"',
      sku: 'LB-TSN-02',
      fob: 180,
      qty: 100,
      duty: 15,
      shipping: 3.8,
      vat: 20,
    },
  ];

  const exchangeRate = currency === 'EUR' ? 102.4 : currency === 'USD' ? 94.2 : 12.85;

  const calculateLanded = (item: any) => {
    const fobInRub = item.fob * exchangeRate;
    const shippingInRub = item.shipping * exchangeRate;
    const dutyAmount = fobInRub * (item.duty / 100);
    const total = fobInRub + dutyAmount + shippingInRub;
    return {
      dutyAmount,
      landed: total,
      margin: (((45000 - total) / 45000) * 100).toFixed(1), // Assuming fixed retail price 45,000 RUB
    };
  };

  return (
<<<<<<< HEAD
    <div className="container mx-auto space-y-4 px-4 py-4">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">
            Landed Cost Calculator
          </h1>
          <p className="font-medium text-slate-500">
            Расчет полной себестоимости с учетом логистики, пошлин и налогов
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Экспорт отчета
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Сохранить расчет</Button>
        </div>
      </header>
=======
    <RegistryPageShell className="max-w-5xl space-y-4">
      <ShopB2bToolHeader
        title="Landed Cost Calculator"
        description="Расчёт полной себестоимости с учётом логистики, пошлин и налогов"
        trailing={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Экспорт отчета
            </Button>
            <Button className="bg-accent-primary hover:bg-accent-primary">Сохранить расчет</Button>
          </>
        }
      />

      <ShopAnalyticsSegmentErpStrip />
>>>>>>> recover/cabinet-wip-from-stash

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
<<<<<<< HEAD
              <Globe className="h-4 w-4 text-indigo-500" /> Параметры импорта
=======
              <Globe className="text-accent-primary h-4 w-4" /> Параметры импорта
>>>>>>> recover/cabinet-wip-from-stash
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Валюта закупки</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="CNY">CNY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Страна происхождения</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Italy">Италия</SelectItem>
                  <SelectItem value="France">Франция</SelectItem>
                  <SelectItem value="China">Китай</SelectItem>
                  <SelectItem value="Turkey">Турция</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Тип логистики</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={transport === 'truck' ? 'default' : 'outline'}
                  className="text-[10px] font-bold"
                  onClick={() => setTransport('truck')}
                >
                  <Truck className="mr-1 h-3 w-3" /> АВТО
                </Button>
                <Button
                  variant={transport === 'ship' ? 'default' : 'outline'}
                  className="text-[10px] font-bold"
                  onClick={() => setTransport('ship')}
                >
                  <Ship className="mr-1 h-3 w-3" /> МОРЕ
                </Button>
              </div>
            </div>
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-xs">
<<<<<<< HEAD
                <span className="text-slate-500">Курс ЦБ ({currency}/RUB):</span>
                <span className="font-bold">{exchangeRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Страховка груза:</span>
=======
                <span className="text-text-secondary">Курс ЦБ ({currency}/RUB):</span>
                <span className="font-bold">{exchangeRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Страховка груза:</span>
>>>>>>> recover/cabinet-wip-from-stash
                <span className="font-bold text-emerald-600">0.5% (Вкл)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-black uppercase">Расчет по позициям</CardTitle>
            </div>
<<<<<<< HEAD
            <Badge variant="outline" className="border-indigo-100 bg-indigo-50 text-indigo-700">
=======
            <Badge
              variant="outline"
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20"
            >
>>>>>>> recover/cabinet-wip-from-stash
              Всего позиций: {mockItems.length}
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
<<<<<<< HEAD
                <TableRow className="bg-slate-50/50">
=======
                <TableRow className="bg-bg-surface2/80">
>>>>>>> recover/cabinet-wip-from-stash
                  <TableHead className="text-[10px] font-black uppercase">Товар</TableHead>
                  <TableHead className="text-[10px] font-black uppercase">
                    FOB ({currency})
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase">Пошлина (%)</TableHead>
                  <TableHead className="text-[10px] font-black uppercase">
                    Логистика ({currency})
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase">
                    Landed (RUB)
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase">
                    Маржа (Est.)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockItems.map((item) => {
                  const calc = calculateLanded(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold">{item.name}</p>
<<<<<<< HEAD
                          <p className="font-mono text-[10px] text-slate-400">{item.sku}</p>
=======
                          <p className="text-text-muted font-mono text-[10px]">{item.sku}</p>
>>>>>>> recover/cabinet-wip-from-stash
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '¥'}
                        {item.fob}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{item.duty}%</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
<<<<<<< HEAD
                                <Info className="h-3 w-3 text-slate-300" />
=======
                                <Info className="text-text-muted h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
                              </TooltipTrigger>
                              <TooltipContent>Код ТН ВЭД: 6204430000</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
<<<<<<< HEAD
                      <TableCell className="text-sm text-slate-600">
                        {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '¥'}
                        {item.shipping}
                      </TableCell>
                      <TableCell className="text-right font-black text-indigo-600">
=======
                      <TableCell className="text-text-secondary text-sm">
                        {currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '¥'}
                        {item.shipping}
                      </TableCell>
                      <TableCell className="text-accent-primary text-right font-black">
>>>>>>> recover/cabinet-wip-from-stash
                        {calc.landed.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="border-none bg-emerald-50 font-black text-emerald-700">
                          {calc.margin}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
<<<<<<< HEAD
        <Card className="border-none bg-indigo-600 text-white shadow-xl shadow-indigo-100">
=======
        <Card className="bg-accent-primary shadow-accent-primary/10 border-none text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-white/10 p-2">
                <Calculator className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest opacity-80">
                Итого себестоимость
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-base font-black">1 420 500 ₽</p>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Всего за 180 ед. товара
              </p>
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        <Card className="border-none bg-slate-900 text-white">
=======
        <Card className="bg-text-primary border-none text-white">
>>>>>>> recover/cabinet-wip-from-stash
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-white/10 p-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest opacity-80">
                Налоги и сборы
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-base font-black">284 100 ₽</p>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                НДС (20%) + Пошлины
              </p>
            </div>
          </CardContent>
        </Card>

<<<<<<< HEAD
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
=======
        <Card className="border-border-default bg-white">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-accent-primary/10 rounded-lg p-2">
                <FileText className="text-accent-primary h-5 w-5" />
              </div>
              <span className="text-text-muted text-xs font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Прогноз маржинальности
              </span>
            </div>
            <div className="space-y-1">
<<<<<<< HEAD
              <p className="text-base font-black text-slate-900">72.4%</p>
=======
              <p className="text-text-primary text-base font-black">72.4%</p>
>>>>>>> recover/cabinet-wip-from-stash
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                На 4.2% выше среднего по сезону
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
<<<<<<< HEAD
    </div>
=======

      <div className="border-border-subtle mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-landed-cost-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-landed-cost-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
